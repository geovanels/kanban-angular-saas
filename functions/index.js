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