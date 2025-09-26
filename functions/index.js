const { onRequest } = require("firebase-functions/v2/https");
const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { Timestamp } = require('firebase-admin/firestore');

// Initialize Firebase Admin
admin.initializeApp();

// CORS middleware
const cors = require('cors')({ origin: true });

// Send Email Function - Callable for authenticated access
exports.sendEmail = onCall({
  cors: [
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:5000',
    'https://kanban-gobuyer.firebaseapp.com',
    'https://kanban-gobuyer.web.app',
    /https:\/\/.*\.taskboard\.com\.br$/,
    /http:\/\/localhost:\d+$/
  ],
  region: 'us-central1'
}, async (request) => {

  try {
    const { emailData, smtpConfig } = request.data;

    logger.info('📧 Recebido pedido de envio de email:', {
      to: emailData.to,
      subject: emailData.subject,
      hasConfig: !!smtpConfig,
      host: smtpConfig?.host
    });

    // Validar dados obrigatórios
    if (!emailData || !emailData.to || !emailData.subject) {
      throw new Error('Dados do email incompletos (to, subject obrigatórios)');
    }

    if (!smtpConfig || !smtpConfig.host || !smtpConfig.user || !smtpConfig.password) {
      throw new Error('Configuração SMTP incompleta (host, user, password obrigatórios)');
    }

    // Configurar transporter do Nodemailer com configurações específicas para SendGrid
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port || 587,
      secure: false, // true para 465, false para outros
      requireTLS: true, // Força TLS para SendGrid
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    // Configurar email
    const mailOptions = {
      from: `"${smtpConfig.fromName || 'Sistema'}" <${smtpConfig.fromEmail || smtpConfig.user}>`,
      to: emailData.to,
      subject: emailData.subject,
      ...(emailData.html && { html: emailData.html }),
      ...(emailData.text && { text: emailData.text }),
      ...(emailData.cc && { cc: emailData.cc.join(',') }),
      ...(emailData.bcc && { bcc: emailData.bcc.join(',') })
    };

    // Enviar email
    const result = await transporter.sendMail(mailOptions);

    logger.info('✅ Email enviado com sucesso:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      message: 'Email enviado com sucesso'
    };

  } catch (error) {
    logger.error('❌ Erro ao enviar email:', error);
    throw new Error(error.message || 'Erro interno ao enviar email');
  }
});

// Lead Intake HTTP Function - cria lead no Firestore na fase inicial do quadro
exports.leadIntakeHttp = onRequest({
  cors: {
    origin: [
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:5000',
      'https://kanban-gobuyer.firebaseapp.com',
      'https://kanban-gobuyer.web.app',
      /https:\/\/.*\.taskboard\.com\.br$/,
      /http:\/\/localhost:\d+$/
    ],
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Company-Subdomain'],
    credentials: true
  },
  region: 'us-central1'
}, async (request, response) => {
  try {
    const rawBody = request.body || {};
    const { companyId: bodyCompanyId, boardId: bodyBoardId, leadData } = rawBody;

    // Extrair companyId e boardId da URL em qualquer forma
    // Exemplos aceitos:
    // - /kanban-gobuyer/us-central1/leadIntakeHttp/companies/:companyId/boards/:boardId
    // - /companies/:companyId/boards/:boardId
    const pathStr = (request.path || request.originalUrl || request.url || '').toString();
    const pathMatch = pathStr.match(/\/(?:leadIntakeHttp\/)?companies\/([^\/]+)(?:\/boards\/([^\/]+))?/);
    const pathCompanyId = pathMatch && pathMatch[1] ? decodeURIComponent(pathMatch[1]) : null;
    const pathBoardId = pathMatch && pathMatch[2] ? decodeURIComponent(pathMatch[2]) : null;

    const companyId = pathCompanyId || bodyCompanyId;
    const targetBoardId = pathBoardId || bodyBoardId;

    if (!companyId) {
      return response.status(400).json({ success: false, error: 'companyId é obrigatório (na URL ou no corpo)' });
    }

    if (!targetBoardId) {
      return response.status(400).json({ success: false, error: 'boardId é obrigatório (na URL ou no corpo)' });
    }

    // Buscar fase inicial do board (isInitialPhase == true). Se não houver, cair para a primeira por ordem
    const columnsRef = admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(targetBoardId)
      .collection('columns');

    let initialColumnId = null;

    // 1) Tentar pela flag isInitialPhase
    const initialSnap = await columnsRef
      .where('isInitialPhase', '==', true)
      .limit(1)
      .get();

    if (!initialSnap.empty) {
      initialColumnId = initialSnap.docs[0].id;
    } else {
      // 2) Fallback: primeira coluna pela ordem
      const firstSnap = await columnsRef
        .orderBy('order', 'asc')
        .limit(1)
        .get();

      if (firstSnap.empty) {
        // 3) Nenhuma coluna: criar automaticamente uma fase inicial padrão
        const created = await columnsRef.add({
          name: 'Entrada',
          order: 0,
          isInitialPhase: true,
          createdAt: Timestamp.now()
        });
        initialColumnId = created.id;
      } else {
        initialColumnId = firstSnap.docs[0].id;
      }
    }

    // Normalizar payload de lead: aceitar tanto leadData quanto campos na raiz
    const incoming = leadData ?? rawBody;
    const baseFields = (incoming && incoming.fields) ? incoming.fields : (incoming || {});

    // Dicionário de sinônimos conhecidos (usado sempre)
    const synonyms = {
      companyName: ['companyName', 'empresa', 'nomeEmpresa', 'nameCompany', 'company', 'empresa_nome', 'company_name'],
      cnpj: ['cnpj', 'cnpjCompany'],
      contactName: ['contactName', 'name', 'nome', 'nomeLead', 'nameLead', 'leadName'],
      contactEmail: ['contactEmail', 'email', 'emailLead', 'contatoEmail', 'leadEmail'],
      contactPhone: ['contactPhone', 'phone', 'telefone', 'celular', 'phoneLead', 'telefoneContato'],
      temperature: ['temperature', 'temperatura', 'qualificacao', 'leadTemperature']
    };

    const lowerKeyMap = Object.keys(baseFields || {}).reduce((acc, k) => {
      acc[k.toLowerCase()] = k; // mapa para chave original
      return acc;
    }, {});

    const pickFirst = (candidates) => {
      for (const c of candidates) {
        const original = lowerKeyMap[c.toLowerCase()];
        if (original && baseFields[original] !== undefined && baseFields[original] !== null) {
          return baseFields[original];
        }
      }
      return undefined;
    };

    // Carregar configuração do formulário inicial para mapear campos
    let processedFields = { ...baseFields };
    try {
      const cfgSnap = await admin.firestore()
        .collection('companies').doc(companyId)
        .collection('boards').doc(targetBoardId)
        .collection('initialForm').doc('config')
        .get();
      if (cfgSnap.exists) {
        const cfg = cfgSnap.data() || {};
        const formFields = Array.isArray(cfg.fields) ? cfg.fields : [];

        const mapped = {};
        for (const f of formFields) {
          const apiName = (f.apiFieldName || f.name || '').toString();
          if (!apiName) continue;
          // 1) Tentar apiFieldName e name
          let value = pickFirst([apiName, f.name]);
          // 2) Tentar sinônimos padrão
          if (value === undefined && synonyms[apiName]) {
            value = pickFirst(synonyms[apiName]);
          }
          if (value !== undefined) {
            mapped[apiName] = value;
          }
        }

        processedFields = { ...baseFields, ...mapped };
      }
    } catch (e) {
      // Se falhar o mapeamento, prosseguir com baseFields
    }

    // Aplicar mapeamento canônico por sinônimos mesmo sem configuração de formulário
    const canonicalKeys = ['companyName', 'cnpj', 'contactName', 'contactEmail', 'contactPhone', 'temperature'];
    canonicalKeys.forEach((key) => {
      const current = processedFields[key];
      if (current === undefined || current === null || (typeof current === 'string' && current.trim() === '')) {
        const value = synonyms[key] ? pickFirst(synonyms[key]) : undefined;
        if (value !== undefined) {
          processedFields[key] = value;
        }
      }
    });

    const normalized = { fields: processedFields };

    const leadDoc = {
      ...normalized,
      columnId: initialColumnId,
      createdAt: Timestamp.now(),
      movedToCurrentColumnAt: Timestamp.now(),
      source: 'API',
      companyId,
      boardId: targetBoardId
    };

    const leadRef = await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(targetBoardId)
      .collection('leads')
      .add(leadDoc);

    return response.status(201).json({
      success: true,
      leadId: leadRef.id,
      boardId: targetBoardId
    });
  } catch (error) {
    logger.error('❌ Erro no leadIntakeHttp:', error);
    return response.status(500).json({ success: false, error: error.message || 'Erro interno' });
  }
});

// Check company membership by subdomain and email
exports.checkCompanyMembership = onRequest({
  cors: {
    origin: [
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:5000',
      'https://kanban-gobuyer.firebaseapp.com',
      'https://kanban-gobuyer.web.app',
      /https:\/\/.*\.taskboard\.com\.br$/,
      /http:\/\/localhost:\d+$/
    ],
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  },
  region: 'us-central1'
}, async (request, response) => {
  try {
    const subdomain = (request.query.subdomain || '').toString();
    const email = (request.query.email || '').toString();

    if (!subdomain || !email) {
      return response.status(400).json({ success: false, error: 'Parâmetros subdomain e email são obrigatórios' });
    }

    const companiesSnap = await admin.firestore()
      .collection('companies')
      .where('subdomain', '==', subdomain)
      .limit(1)
      .get();

    if (companiesSnap.empty) {
      return response.json({ success: true, exists: false });
    }

    const companyDoc = companiesSnap.docs[0];
    const company = companyDoc.data();
    const companyId = companyDoc.id;
    const isOwner = (company.ownerEmail || '').toLowerCase() === email.toLowerCase();

    let isUser = false;
    try {
      const userDoc = await admin.firestore()
        .collection('companies').doc(companyId)
        .collection('users').doc(email)
        .get();
      isUser = userDoc.exists;
    } catch (e) {
      // ignore
    }

    return response.json({
      success: true,
      exists: true,
      companyId,
      companyName: company.name || '',
      isOwner,
      isUser,
      associated: isOwner || isUser
    });
  } catch (error) {
    logger.error('❌ Erro em checkCompanyMembership:', error);
    return response.status(500).json({ success: false, error: error.message || 'Erro interno' });
  }
});

// Send Email HTTP Function - Better CORS control
exports.sendEmailHttp = onRequest({
  cors: {
    origin: [
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:5000',
      'https://kanban-gobuyer.firebaseapp.com',
      'https://kanban-gobuyer.web.app',
      /https:\/\/.*\.taskboard\.com\.br$/,
      /http:\/\/localhost:\d+$/
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  region: 'us-central1'
}, async (request, response) => {
  try {
    const { emailData, companyId } = request.body;
    
    logger.info('📧 HTTP: Recebido pedido de envio de email:', {
      to: emailData?.to,
      subject: emailData?.subject,
      companyId: companyId
    });

    // Buscar configuração SMTP da empresa no Firestore
    const companyDoc = await admin.firestore().collection('companies').doc(companyId).get();
    
    if (!companyDoc.exists) {
      return response.status(404).json({ error: 'Empresa não encontrada' });
    }

    const company = companyDoc.data();
    const smtpConfig = company.smtpConfig;

    if (!smtpConfig || !smtpConfig.host || !smtpConfig.user || !smtpConfig.password) {
      return response.status(400).json({ error: 'Configuração SMTP da empresa está incompleta' });
    }

    // Configurar transporter do Nodemailer
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port || 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    // Configurar email
    const mailOptions = {
      from: `"${smtpConfig.fromName || company.name}" <${smtpConfig.fromEmail || smtpConfig.user}>`,
      to: emailData.to,
      subject: emailData.subject,
      ...(emailData.html && { html: emailData.html }),
      ...(emailData.text && { text: emailData.text }),
      ...(emailData.cc && { cc: emailData.cc.join(',') }),
      ...(emailData.bcc && { bcc: emailData.bcc.join(',') })
    };

    // Enviar email
    const result = await transporter.sendMail(mailOptions);

    logger.info('✅ Email enviado com sucesso via HTTP:', result.messageId);
    
    return response.json({
      success: true,
      messageId: result.messageId,
      message: 'Email enviado com sucesso'
    });

  } catch (error) {
    logger.error('❌ Erro ao enviar email via HTTP:', error);
    return response.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao enviar email'
    });
  }
});

// Send Email Function - Callable for authenticated access
exports.sendEmailCallable = onCall({
  cors: [
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:5000',
    'https://kanban-gobuyer.firebaseapp.com',
    'https://kanban-gobuyer.web.app',
    /https:\/\/.*\.taskboard\.com\.br$/,
    /http:\/\/localhost:\d+$/
  ],
  region: 'us-central1'
}, async (request) => {
  try {
    const { emailData, companyId } = request.data;
    
    logger.info('📧 Callable: Recebido pedido de envio de email:', {
      to: emailData.to,
      subject: emailData.subject,
      companyId: companyId
    });

    // Buscar configuração SMTP da empresa no Firestore
    const companyDoc = await admin.firestore().collection('companies').doc(companyId).get();
    
    if (!companyDoc.exists) {
      throw new Error('Empresa não encontrada');
    }

    const company = companyDoc.data();
    const smtpConfig = company.smtpConfig;

    if (!smtpConfig || !smtpConfig.host || !smtpConfig.user || !smtpConfig.password) {
      throw new Error('Configuração SMTP da empresa está incompleta');
    }

    // Configurar transporter do Nodemailer com configurações específicas para SendGrid
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port || 587,
      secure: false, // true para 465, false para outros
      requireTLS: true, // Força TLS para SendGrid
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    // Configurar email
    const mailOptions = {
      from: `"${smtpConfig.fromName || company.name}" <${smtpConfig.fromEmail || smtpConfig.user}>`,
      to: emailData.to,
      subject: emailData.subject,
      ...(emailData.html && { html: emailData.html }),
      ...(emailData.text && { text: emailData.text }),
      ...(emailData.cc && { cc: emailData.cc.join(',') }),
      ...(emailData.bcc && { bcc: emailData.bcc.join(',') })
    };

    // Enviar email
    const result = await transporter.sendMail(mailOptions);

    logger.info('✅ Email enviado com sucesso via callable:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      message: 'Email enviado com sucesso'
    };

  } catch (error) {
    logger.error('❌ Erro ao enviar email via callable:', error);
    throw new Error(error.message || 'Erro interno ao enviar email');
  }
});

// Test SMTP Configuration Function
exports.testSmtpConfig = onCall({
  cors: [
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:5000',
    'https://kanban-gobuyer.firebaseapp.com',
    'https://kanban-gobuyer.web.app',
    /https:\/\/.*\.taskboard\.com\.br$/,
    /http:\/\/localhost:\d+$/
  ],
  region: 'us-central1'
}, async (request) => {
  try {
    const { smtpConfig, testEmail } = request.data;

    logger.info('🧪 Testando configuração SMTP:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      testEmail: testEmail
    });

    // Configurar transporter do Nodemailer com configurações específicas para SendGrid
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port || 587,
      secure: false, // true para 465, false para outros
      requireTLS: true, // Força TLS para SendGrid
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    });

    // Verificar conexão
    await transporter.verify();

    // Enviar email de teste se email fornecido
    if (testEmail) {
      const mailOptions = {
        from: `"${smtpConfig.fromName || 'Sistema'}" <${smtpConfig.fromEmail || smtpConfig.user}>`,
        to: testEmail,
        subject: 'Teste de Configuração SMTP',
        html: `
          <h2>Teste de Configuração SMTP</h2>
          <p>Este é um email de teste para verificar se a configuração SMTP está funcionando corretamente.</p>
          <p><strong>Servidor SMTP:</strong> ${smtpConfig.host}:${smtpConfig.port}</p>
          <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p style="color: #28a745; font-weight: bold;">✅ Configuração SMTP funcionando corretamente!</p>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      
      return {
        success: true,
        verified: true,
        testEmailSent: true,
        messageId: result.messageId,
        message: 'Configuração SMTP válida e email de teste enviado'
      };
    }

    return {
      success: true,
      verified: true,
      testEmailSent: false,
      message: 'Configuração SMTP válida'
    };

  } catch (error) {
    logger.error('❌ Erro ao testar configuração SMTP:', error);

    return {
      success: false,
      verified: false,
      error: error.message || 'Erro ao testar configuração SMTP'
    };
  }
});

// ================================
// AUTOMAÇÕES FIREBASE FUNCTIONS
// ================================

const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");

// Trigger quando um novo lead é criado
exports.onLeadCreated = onDocumentCreated({
  document: "companies/{companyId}/boards/{boardId}/leads/{leadId}",
  region: "us-central1"
}, async (event) => {
  try {
    const { companyId, boardId, leadId } = event.params;
    const leadData = event.data.data();

    // ⚠️ PROTEÇÃO: Não executar para leads criados antes da implementação das Functions
    const leadCreatedAt = leadData.createdAt;
    let leadTimestamp;

    if (leadCreatedAt?.toDate) {
      leadTimestamp = leadCreatedAt.toDate();
    } else if (leadCreatedAt?.seconds) {
      leadTimestamp = new Date(leadCreatedAt.seconds * 1000);
    } else if (leadCreatedAt) {
      leadTimestamp = new Date(leadCreatedAt);
    } else {
      leadTimestamp = new Date();
    }

    // Data de implementação das automações (hoje)
    const implementationDate = new Date('2025-09-26T15:40:00.000Z');

    if (leadTimestamp < implementationDate) {
      logger.info(`🛑 LEAD ANTIGO DETECTADO: ${leadId} criado em ${leadTimestamp.toISOString()} - Pulando automação`);
      return;
    }

    // Verificar se já executou automação (proteção contra duplicatas)
    if (leadData.executedAutomations && Object.keys(leadData.executedAutomations).length > 0) {
      logger.info(`🔄 Lead ${leadId} já tem automações executadas, pulando`);
      return;
    }

    logger.info(`🆕 NOVO LEAD CRIADO: ${leadId} - Board: ${boardId} - Company: ${companyId}`);

    // Buscar automações ativas para novo lead
    const automationsRef = admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('automations');

    const automationsSnapshot = await automationsRef
      .where('active', '==', true)
      .where('triggerType', '==', 'new-lead-created')
      .get();

    logger.info(`📋 Automações encontradas: ${automationsSnapshot.size}`);

    // Executar cada automação
    for (const autoDoc of automationsSnapshot.docs) {
      const automation = { id: autoDoc.id, ...autoDoc.data() };

      logger.info(`▶️ Executando automação: ${automation.id} - ${automation.name}`);

      // Verificar se automação tem fase específica
      const triggerPhase = automation.triggerPhase;
      if (triggerPhase && leadData.columnId !== triggerPhase) {
        logger.info(`⏭️ Lead não está na fase configurada (${triggerPhase}), pulando automação`);
        continue;
      }

      // Executar ações da automação
      await executeAutomationActions(automation, leadData, companyId, boardId, leadId);

      // Registrar execução no histórico
      await addAutomationHistory(companyId, boardId, automation, leadData, 'success');
    }

    if (automationsSnapshot.empty) {
      logger.info(`⚠️ Nenhuma automação de novo lead configurada para board ${boardId}`);
    }

  } catch (error) {
    logger.error('❌ Erro ao processar automações de novo lead:', error);
  }
});

// Trigger quando um lead é atualizado (mudança de fase)
exports.onLeadUpdated = onDocumentUpdated({
  document: "companies/{companyId}/boards/{boardId}/leads/{leadId}",
  region: "us-central1"
}, async (event) => {
  try {
    const { companyId, boardId, leadId } = event.params;
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();

    // Verificar se houve mudança de fase
    if (beforeData.columnId === afterData.columnId) {
      return; // Não houve mudança de fase, sair
    }

    const oldPhase = beforeData.columnId;
    const newPhase = afterData.columnId;

    logger.info(`🔄 MUDANÇA DE FASE: Lead ${leadId} - De: ${oldPhase} -> Para: ${newPhase}`);

    // Buscar automações ativas para mudança de fase
    const automationsRef = admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('automations');

    const automationsSnapshot = await automationsRef
      .where('active', '==', true)
      .where('triggerType', '==', 'card-enters-phase')
      .where('triggerPhase', '==', newPhase)
      .get();

    logger.info(`📋 Automações de mudança de fase encontradas: ${automationsSnapshot.size}`);

    // Executar cada automação
    for (const autoDoc of automationsSnapshot.docs) {
      const automation = { id: autoDoc.id, ...autoDoc.data() };

      logger.info(`▶️ Executando automação de mudança de fase: ${automation.id} - ${automation.name}`);

      // Executar ações da automação
      await executeAutomationActions(automation, afterData, companyId, boardId, leadId);

      // Registrar execução no histórico
      await addAutomationHistory(companyId, boardId, automation, afterData, 'success');
    }

  } catch (error) {
    logger.error('❌ Erro ao processar automações de mudança de fase:', error);
  }
});

// Cron job para automações baseadas em tempo (executar a cada 5 minutos)
exports.processTimeBasedAutomations = onSchedule({
  schedule: "every 5 minutes",
  region: "us-central1"
}, async (event) => {
  try {
    logger.info('⏰ Iniciando processamento de automações baseadas em tempo...');

    // Buscar todas as empresas que têm automações baseadas em tempo
    const companiesSnapshot = await admin.firestore().collection('companies').get();

    for (const companyDoc of companiesSnapshot.docs) {
      const companyId = companyDoc.id;

      // Buscar boards da empresa
      const boardsSnapshot = await admin.firestore()
        .collection('companies').doc(companyId)
        .collection('boards').get();

      for (const boardDoc of boardsSnapshot.docs) {
        const boardId = boardDoc.id;

        // Processar automações de tempo para este board
        await processTimeAutomationsForBoard(companyId, boardId);
      }
    }

    logger.info('✅ Processamento de automações baseadas em tempo concluído');

  } catch (error) {
    logger.error('❌ Erro ao processar automações baseadas em tempo:', error);
  }
});

// Função auxiliar para executar ações de automação
async function executeAutomationActions(automation, leadData, companyId, boardId, leadId) {
  try {
    for (const action of automation.actions || []) {
      logger.info(`🎯 Executando ação: ${action.type}`);

      switch (action.type) {
        case 'send-email':
          await executeSendEmailAction(action, leadData, companyId, boardId, leadId, automation);
          break;

        case 'move-to-phase':
          await executeMoveToPhaseAction(action, leadData, companyId, boardId, leadId);
          break;

        case 'assign-user':
          await executeAssignUserAction(action, leadData, companyId, boardId, leadId);
          break;

        case 'add-note':
          await executeAddNoteAction(action, leadData, companyId, boardId, leadId);
          break;

        default:
          logger.warn(`⚠️ Tipo de ação não reconhecido: ${action.type}`);
      }
    }
  } catch (error) {
    logger.error('❌ Erro ao executar ações da automação:', error);
    throw error;
  }
}

// Função auxiliar para enviar email
async function executeSendEmailAction(action, leadData, companyId, boardId, leadId, automation) {
  try {
    if (!action.templateId) {
      throw new Error('Template de email não especificado');
    }

    // Buscar template de email
    const templateDoc = await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('emailTemplates').doc(action.templateId)
      .get();

    if (!templateDoc.exists) {
      throw new Error(`Template de email não encontrado: ${action.templateId}`);
    }

    const template = templateDoc.data();

    // Processar destinatários
    const recipientFromTemplate = processEmailTemplate(template.recipients || '', leadData);
    const fallbackEmails = [
      leadData.fields?.contactEmail,
      leadData.fields?.email,
      leadData.fields?.emailLead,
      leadData.fields?.contatoEmail
    ].filter(email => email && email.includes('@'));

    const recipients = recipientFromTemplate || fallbackEmails[0];
    if (!recipients) {
      throw new Error('Destinatário não definido');
    }

    // Processar conteúdo do email
    const processedSubject = processEmailTemplate(template.subject || 'Mensagem', leadData);
    const processedContent = processEmailTemplate(template.body || '', leadData);

    // Verificar duplicatas (últimas 24 horas + verificação por template)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Verificação 1: mesmo automação + lead nas últimas 24h
    const existingAutomationEmailQuery = await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('outbox')
      .where('leadId', '==', leadId)
      .where('automationId', '==', automation.id)
      .where('createdAt', '>', twentyFourHoursAgo)
      .limit(1)
      .get();

    if (!existingAutomationEmailQuery.empty) {
      logger.info(`📧 Email duplicado detectado (automação), pulando envio para lead ${leadId}`);
      return;
    }

    // Verificação 2: mesmo template + lead nas últimas 24h
    const existingTemplateEmailQuery = await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('outbox')
      .where('leadId', '==', leadId)
      .where('templateId', '==', action.templateId)
      .where('createdAt', '>', twentyFourHoursAgo)
      .limit(1)
      .get();

    if (!existingTemplateEmailQuery.empty) {
      logger.info(`📧 Email duplicado detectado (template), pulando envio para lead ${leadId}`);
      return;
    }

    // Criar registro na caixa de saída
    const outboxRef = admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('outbox')
      .doc();

    await outboxRef.set({
      to: recipients,
      subject: processedSubject,
      html: processedContent,
      leadId: leadId,
      automationId: automation.id,
      templateId: action.templateId,
      delivery: { state: 'PENDING' },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Buscar configuração SMTP da empresa
    const companyDoc = await admin.firestore().collection('companies').doc(companyId).get();
    const smtpConfig = companyDoc.data()?.smtpConfig;

    if (!smtpConfig) {
      await outboxRef.update({
        delivery: { state: 'ERROR', error: 'Configuração SMTP não encontrada' }
      });
      throw new Error('Configuração SMTP não encontrada');
    }

    // Enviar email
    const transporter = nodemailer.createTransporter({
      host: smtpConfig.host,
      port: smtpConfig.port || 587,
      secure: false,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password
      }
    });

    const mailOptions = {
      from: `"${smtpConfig.fromName || 'Sistema'}" <${smtpConfig.fromEmail || smtpConfig.user}>`,
      to: recipients,
      subject: processedSubject,
      html: processedContent
    };

    const result = await transporter.sendMail(mailOptions);

    // Atualizar status na caixa de saída
    await outboxRef.update({
      delivery: { state: 'SUCCESS', messageId: result.messageId }
    });

    logger.info(`✅ Email enviado com sucesso: ${result.messageId}`);

  } catch (error) {
    logger.error('❌ Erro ao enviar email:', error);
    throw error;
  }
}

// Função para processar template com variáveis do lead
function processEmailTemplate(template, leadData) {
  if (!template) return '';

  let processed = template;

  // Variáveis básicas do lead
  const variables = {
    '{{contactName}}': leadData.fields?.contactName || '',
    '{{companyName}}': leadData.fields?.companyName || '',
    '{{contactEmail}}': leadData.fields?.contactEmail || '',
    '{{contactPhone}}': leadData.fields?.contactPhone || '',
    '{{cnpj}}': leadData.fields?.cnpj || '',
    '{{responsibleUserName}}': leadData.responsibleUserName || '',
    '{{responsibleUserEmail}}': leadData.responsibleUserEmail || '',
    '{{nomeResponsavel}}': leadData.responsibleUserName || '',
    '{{emailResponsavel}}': leadData.responsibleUserEmail || '',
    '{{currentDate}}': new Date().toLocaleDateString('pt-BR')
  };

  // Substituir variáveis
  Object.entries(variables).forEach(([placeholder, value]) => {
    processed = processed.replace(new RegExp(placeholder, 'g'), value);
  });

  // Substituir campos personalizados
  if (leadData.fields) {
    Object.entries(leadData.fields).forEach(([key, value]) => {
      if (typeof value === 'string') {
        processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    });
  }

  return processed;
}

// Função auxiliar para mover lead para outra fase
async function executeMoveToPhaseAction(action, leadData, companyId, boardId, leadId) {
  try {
    if (!action.phaseId) {
      throw new Error('Fase de destino não especificada');
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const phaseHistory = leadData.phaseHistory || {};

    // Finalizar fase anterior
    if (leadData.columnId && phaseHistory[leadData.columnId]) {
      phaseHistory[leadData.columnId].exitedAt = now;
    }

    // Iniciar nova fase
    phaseHistory[action.phaseId] = {
      phaseId: action.phaseId,
      enteredAt: now
    };

    await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('leads').doc(leadId)
      .update({
        columnId: action.phaseId,
        movedToCurrentColumnAt: now,
        phaseHistory: phaseHistory
      });

    logger.info(`✅ Lead ${leadId} movido para fase ${action.phaseId}`);

  } catch (error) {
    logger.error('❌ Erro ao mover lead:', error);
    throw error;
  }
}

// Função auxiliar para atribuir usuário
async function executeAssignUserAction(action, leadData, companyId, boardId, leadId) {
  try {
    if (!action.userId) {
      throw new Error('Usuário não especificado');
    }

    await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('leads').doc(leadId)
      .update({
        responsibleUserId: action.userId,
        responsibleUserName: action.userName || '',
        responsibleUserEmail: action.userEmail || ''
      });

    logger.info(`✅ Lead ${leadId} atribuído ao usuário ${action.userId}`);

  } catch (error) {
    logger.error('❌ Erro ao atribuir usuário:', error);
    throw error;
  }
}

// Função auxiliar para adicionar nota
async function executeAddNoteAction(action, leadData, companyId, boardId, leadId) {
  try {
    if (!action.note) {
      throw new Error('Nota não especificada');
    }

    const processedNote = processEmailTemplate(action.note, leadData);
    const currentNotes = leadData.fields?.notes || '';
    const newNotes = currentNotes + '\n\n[AUTOMAÇÃO] ' + new Date().toLocaleString('pt-BR') + ':\n' + processedNote;

    await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('leads').doc(leadId)
      .update({
        'fields.notes': newNotes
      });

    logger.info(`✅ Nota adicionada ao lead ${leadId}`);

  } catch (error) {
    logger.error('❌ Erro ao adicionar nota:', error);
    throw error;
  }
}

// Função para adicionar ao histórico de automação
async function addAutomationHistory(companyId, boardId, automation, leadData, status, errorMessage = null) {
  try {
    const historyItem = {
      automationId: automation.id,
      automationName: automation.name,
      leadId: leadData.id || 'unknown',
      leadName: leadData.fields?.contactName || leadData.fields?.companyName || 'Lead sem nome',
      status: status,
      executedAt: admin.firestore.FieldValue.serverTimestamp(),
      actions: automation.actions?.map(action => ({
        type: action.type,
        details: getActionDetails(action)
      })) || [],
      ...(errorMessage && { errorMessage })
    };

    await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('automationHistory')
      .add(historyItem);

  } catch (error) {
    logger.error('❌ Erro ao adicionar histórico de automação:', error);
  }
}

// Função auxiliar para obter detalhes da ação
function getActionDetails(action) {
  switch (action.type) {
    case 'send-email':
      return `Template: ${action.templateId}`;
    case 'move-to-phase':
      return `Fase: ${action.phaseId}`;
    case 'assign-user':
      return `Usuário: ${action.userId}`;
    case 'add-note':
      return `Nota: ${action.note?.substring(0, 50)}...`;
    default:
      return '';
  }
}

// Função para processar automações de tempo para um board específico
async function processTimeAutomationsForBoard(companyId, boardId) {
  try {
    // Buscar automações baseadas em tempo ativas
    const automationsSnapshot = await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('automations')
      .where('active', '==', true)
      .where('triggerType', 'in', ['card-in-phase-for-time', 'sla-overdue', 'form-not-answered'])
      .get();

    if (automationsSnapshot.empty) {
      return;
    }

    logger.info(`⏰ Processando automações de tempo para board ${boardId}: ${automationsSnapshot.size} automações`);

    // Buscar todos os leads do board
    const leadsSnapshot = await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('leads')
      .get();

    const DAY = 24 * 60 * 60 * 1000;
    const now = Date.now();

    // Processar cada automação
    for (const autoDoc of automationsSnapshot.docs) {
      const automation = { id: autoDoc.id, ...autoDoc.data() };

      for (const leadDoc of leadsSnapshot.docs) {
        const leadData = { id: leadDoc.id, ...leadDoc.data() };

        try {
          await processTimeAutomationForLead(automation, leadData, companyId, boardId, now, DAY);
        } catch (error) {
          logger.error(`❌ Erro ao processar automação ${automation.id} para lead ${leadData.id}:`, error);
        }
      }
    }

  } catch (error) {
    logger.error(`❌ Erro ao processar automações de tempo para board ${boardId}:`, error);
  }
}

// Função para processar automação de tempo para um lead específico
async function processTimeAutomationForLead(automation, leadData, companyId, boardId, now, DAY) {
  const { triggerType, triggerPhase, triggerDays } = automation;

  // Filtrar por fase se especificada
  if (triggerPhase && leadData.columnId !== triggerPhase) {
    return;
  }

  // Calcular tempo na fase atual
  const movedTs = leadData.movedToCurrentColumnAt;
  let moved;
  if (movedTs?.toDate) {
    moved = movedTs.toDate().getTime();
  } else if (movedTs?.seconds) {
    moved = movedTs.seconds * 1000;
  } else if (movedTs) {
    moved = new Date(movedTs).getTime();
  } else {
    // Fallback para createdAt
    const createdTs = leadData.createdAt;
    if (createdTs?.toDate) {
      moved = createdTs.toDate().getTime();
    } else if (createdTs?.seconds) {
      moved = createdTs.seconds * 1000;
    } else {
      moved = now; // último recurso
    }
  }

  if (!moved) return;

  const daysPassed = Math.floor((now - moved) / DAY);

  // Verificar se já foi executado
  const executionKey = `${automation.id}_${triggerDays || 0}days`;
  const executedAutomations = leadData.executedAutomations || {};
  if (executedAutomations[executionKey]) {
    return; // Já foi executado
  }

  let shouldExecute = false;

  if (triggerType === 'card-in-phase-for-time') {
    const days = triggerDays || 0;
    shouldExecute = daysPassed >= days;
  } else if (triggerType === 'sla-overdue') {
    // Buscar configuração SLA da fase
    const columnsSnapshot = await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('columns')
      .where('id', '==', leadData.columnId)
      .limit(1)
      .get();

    if (!columnsSnapshot.empty) {
      const column = columnsSnapshot.docs[0].data();
      const slaDays = column.slaDays || 0;
      shouldExecute = slaDays > 0 && daysPassed >= slaDays;
    }
  } else if (triggerType === 'form-not-answered') {
    const waitDays = triggerDays && triggerDays > 0 ? triggerDays : 1;
    if (daysPassed >= waitDays) {
      // Verificar se formulário não foi respondido
      shouldExecute = await checkFormNotAnswered(companyId, boardId, leadData.columnId, leadData);
    }
  }

  if (shouldExecute) {
    logger.info(`⏰ Executando automação de tempo: ${automation.id} para lead ${leadData.id}`);

    // Executar automação
    await executeAutomationActions(automation, leadData, companyId, boardId, leadData.id);

    // Marcar como executado
    await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('leads').doc(leadData.id)
      .update({
        [`executedAutomations.${executionKey}`]: {
          lastExecutedAt: admin.firestore.FieldValue.serverTimestamp(),
          automationId: automation.id,
          days: triggerDays || 0
        }
      });

    // Registrar no histórico
    await addAutomationHistory(companyId, boardId, automation, leadData, 'success');
  }
}

// Função para verificar se formulário não foi respondido
async function checkFormNotAnswered(companyId, boardId, phaseId, leadData) {
  try {
    // Buscar configuração do formulário da fase
    const formConfigDoc = await admin.firestore()
      .collection('companies').doc(companyId)
      .collection('boards').doc(boardId)
      .collection('phaseFormConfigs').doc(phaseId)
      .get();

    if (!formConfigDoc.exists) {
      return false; // Sem formulário, não dispara
    }

    const formConfig = formConfigDoc.data();
    const fields = formConfig.fields || [];

    if (fields.length === 0) {
      return false; // Sem campos, não dispara
    }

    // Verificar se todos os campos estão vazios
    const allEmpty = fields.every(field => {
      const key = field.apiFieldName || field.name;
      const value = leadData.fields?.[key];

      if (value === undefined || value === null || value === '') {
        return true;
      }

      const strValue = String(value).trim();
      return strValue === '' || strValue === 'undefined' || strValue === 'null';
    });

    return allEmpty;

  } catch (error) {
    logger.error('❌ Erro ao verificar formulário não respondido:', error);
    return false;
  }
}