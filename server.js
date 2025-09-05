const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors({
  origin: ['http://localhost:4200', 'https://localhost:4200'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// SendGrid email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { emailData, smtpConfig } = req.body;

    console.log('📧 Recebido pedido de envio de email:', {
      to: emailData.to,
      subject: emailData.subject,
      hasConfig: !!smtpConfig,
      host: smtpConfig?.host
    });

    // Validar dados obrigatórios
    if (!emailData || !emailData.to || !emailData.subject) {
      return res.status(400).json({
        success: false,
        error: 'Dados do email incompletos (to, subject obrigatórios)'
      });
    }

    if (!smtpConfig || !smtpConfig.password || !smtpConfig.fromEmail) {
      return res.status(400).json({
        success: false,
        error: 'Configuração SMTP incompleta (password, fromEmail obrigatórios)'
      });
    }

    // Preparar payload para SendGrid
    const sendGridPayload = {
      personalizations: [{
        to: [{ email: emailData.to }],
        subject: emailData.subject,
        ...(emailData.cc && { cc: emailData.cc.map(email => ({ email })) }),
        ...(emailData.bcc && { bcc: emailData.bcc.map(email => ({ email })) })
      }],
      from: {
        email: smtpConfig.fromEmail,
        name: smtpConfig.fromName || 'Sistema'
      },
      content: [{
        type: emailData.html ? "text/html" : "text/plain",
        value: emailData.html || emailData.text || ''
      }]
    };

    console.log('📤 Enviando para SendGrid:', JSON.stringify(sendGridPayload, null, 2));

    // Fazer requisição para SendGrid
    const result = await sendToSendGrid(sendGridPayload, smtpConfig.password);

    console.log('✅ Email enviado com sucesso via SendGrid');
    
    res.status(200).json({
      success: true,
      messageId: result.messageId || 'sent',
      message: 'Email enviado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    let statusCode = 500;
    let errorMessage = 'Erro interno do servidor';

    if (error.statusCode) {
      statusCode = error.statusCode;
      
      switch (statusCode) {
        case 401:
          errorMessage = 'API Key do SendGrid inválida. Verifique a configuração.';
          break;
        case 400:
          errorMessage = `Dados inválidos: ${error.message}`;
          break;
        case 403:
          errorMessage = 'Acesso negado. Verifique as permissões da API Key.';
          break;
        default:
          errorMessage = error.message || 'Erro ao enviar email';
      }
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Função para enviar email via SendGrid API
function sendToSendGrid(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    
    const options = {
      hostname: 'api.sendgrid.com',
      port: 443,
      path: '/v3/mail/send',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`📨 SendGrid Response Status: ${res.statusCode}`);
        console.log(`📨 SendGrid Response Headers:`, res.headers);
        console.log(`📨 SendGrid Response Body:`, data);

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            success: true,
            messageId: res.headers['x-message-id'] || 'sent',
            statusCode: res.statusCode
          });
        } else {
          const error = new Error(`SendGrid API Error: ${res.statusCode}`);
          error.statusCode = res.statusCode;
          error.response = data;
          
          try {
            const errorData = JSON.parse(data);
            error.message = errorData.errors?.[0]?.message || `HTTP ${res.statusCode}`;
          } catch (e) {
            error.message = `HTTP ${res.statusCode} - ${data}`;
          }
          
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erro na requisição HTTPS:', error);
      reject(new Error(`Erro de rede: ${error.message}`));
    });

    // Timeout de 30 segundos
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout: SendGrid não respondeu em 30 segundos'));
    });

    req.write(postData);
    req.end();
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor da API rodando em http://localhost:${PORT}`);
  console.log(`📧 Endpoint de email: http://localhost:${PORT}/api/send-email`);
  console.log(`❤️ Health check: http://localhost:${PORT}/api/health`);
});