const { onRequest } = require("firebase-functions/v2/https");
const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase Admin
admin.initializeApp();

// CORS middleware
const cors = require('cors')({ origin: true });

// Send Email Function - Callable for authenticated access
exports.sendEmail = onCall({
  cors: true,
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

// Send Email Function - Callable for authenticated access
exports.sendEmailCallable = onCall({
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