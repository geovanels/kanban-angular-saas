import {
  Functions,
  httpsCallable
} from "./chunk-XKYK3QHQ.js";
import {
  HttpClient
} from "./chunk-PTOBJH2A.js";
import {
  SubdomainService
} from "./chunk-L2S3FEQE.js";
import {
  Injectable,
  __spreadValues,
  catchError,
  from,
  inject,
  map,
  setClassMetadata,
  throwError,
  ɵɵdefineInjectable
} from "./chunk-GHLOFODZ.js";

// src/app/services/smtp.service.ts
var SmtpService = class _SmtpService {
  http = inject(HttpClient);
  subdomainService = inject(SubdomainService);
  functions = inject(Functions);
  // Enviar email usando HTTP Firebase Function (melhor controle de CORS)
  sendEmail(emailData) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      console.error("\u274C Contexto da empresa n\xE3o inicializado");
      return throwError(() => new Error("Contexto da empresa n\xE3o inicializado"));
    }
    if (!this.validateSmtpConfig(company)) {
      const missingFields = this.getSmtpValidationErrors(company);
      console.error("\u274C Configura\xE7\xE3o SMTP da empresa est\xE1 incompleta:", company.smtpConfig, "Campos faltantes:", missingFields);
      return throwError(() => new Error(`Configura\xE7\xE3o SMTP incompleta. Campos faltantes: ${missingFields.join(", ")}`));
    }
    console.log("\u{1F4E7} Preparando envio de email via HTTP Firebase Functions:", {
      to: emailData.to,
      subject: emailData.subject,
      fromEmail: company.smtpConfig.fromEmail,
      fromName: company.smtpConfig.fromName
    });
    const httpFunctionUrl = "https://us-central1-kanban-gobuyer.cloudfunctions.net/sendEmailHttp";
    const payload = {
      emailData: {
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        cc: emailData.cc,
        bcc: emailData.bcc
      },
      companyId: company.id
      // Usar companyId ao invés de passar SMTP config diretamente
    };
    console.log("\u{1F4E4} Enviando para HTTP Firebase Function:", {
      url: httpFunctionUrl,
      payload: __spreadValues({}, payload)
    });
    return this.http.post(httpFunctionUrl, payload).pipe(map((result) => {
      console.log("\u2705 Email enviado com sucesso via HTTP Function:", result);
      return {
        success: result.success || true,
        messageId: result.messageId || "sent",
        message: result.message
      };
    }), catchError((error) => {
      console.error("\u274C Erro detalhado ao enviar email via HTTP Function:", error);
      let errorMessage = "Erro desconhecido ao enviar email";
      if (error.status === 400) {
        errorMessage = error.error?.error || "Dados inv\xE1lidos para envio de email";
      } else if (error.status === 404) {
        errorMessage = "Empresa n\xE3o encontrada";
      } else if (error.status === 500) {
        errorMessage = error.error?.error || "Erro interno do servidor";
      } else if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return throwError(() => ({
        success: false,
        error: errorMessage,
        details: error
      }));
    }));
  }
  // Enviar email de template
  sendTemplateEmail(templateId, to, templateData, subject) {
    return this.sendEmail({
      to,
      subject: subject || "Email autom\xE1tico",
      templateId,
      templateData
    });
  }
  // Enviar email de notificação simples
  sendNotificationEmail(to, subject, message, isHtml = false) {
    const emailData = {
      to,
      subject,
      [isHtml ? "html" : "text"]: message
    };
    return this.sendEmail(emailData);
  }
  // Enviar email de novo lead
  sendNewLeadNotification(lead, boardName, columnName) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const subject = `Novo Registro: ${lead.fields.contactName || lead.fields.companyName || "Registro sem nome"}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${company.primaryColor || "#007bff"}; color: white; padding: 20px; text-align: center;">
          <h1>${company.name}</h1>
          <h2>Novo Registro Recebido</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f8f9fa;">
          <h3>Detalhes do Registro:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Quadro:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${boardName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Fase:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${columnName}</td>
            </tr>
            ${lead.fields.companyName ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Empresa:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.fields.companyName}</td>
            </tr>
            ` : ""}
            ${lead.fields.contactName ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Contato:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.fields.contactName}</td>
            </tr>
            ` : ""}
            ${lead.fields.contactEmail ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.fields.contactEmail}</td>
            </tr>
            ` : ""}
            ${lead.fields.contactPhone ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Telefone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.fields.contactPhone}</td>
            </tr>
            ` : ""}
          </table>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666;">
          <p>
            <a href="${this.subdomainService.getCompanyUrl(company.subdomain)}" 
               style="background-color: ${company.primaryColor || "#007bff"}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Ver no Sistema
            </a>
          </p>
        </div>
      </div>
    `;
    return this.sendEmail({
      to: company.ownerEmail,
      subject,
      html
    });
  }
  // Testar configuração SMTP via Firebase Functions
  testSmtpConfiguration() {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    if (!this.validateSmtpConfig(company)) {
      const missingFields = this.getSmtpValidationErrors(company);
      return throwError(() => new Error(`Configura\xE7\xE3o SMTP incompleta. Campos faltantes: ${missingFields.join(", ")}`));
    }
    console.log("\u{1F9EA} Testando configura\xE7\xE3o SMTP via Firebase Functions");
    const testSmtpCallable = httpsCallable(this.functions, "testSmtpConfig");
    const payload = {
      smtpConfig: {
        host: company.smtpConfig.host,
        port: company.smtpConfig.port,
        secure: company.smtpConfig.secure,
        user: company.smtpConfig.user,
        password: company.smtpConfig.password,
        fromName: company.smtpConfig.fromName,
        fromEmail: company.smtpConfig.fromEmail
      },
      testEmail: company.ownerEmail
    };
    return from(testSmtpCallable(payload)).pipe(map((result) => {
      console.log("\u2705 Teste SMTP realizado com sucesso:", result.data);
      return {
        success: result.data.success || true,
        messageId: result.data.messageId || "test-sent",
        message: result.data.message || "Teste realizado com sucesso"
      };
    }), catchError((error) => {
      console.error("\u274C Erro ao testar configura\xE7\xE3o SMTP:", error);
      let errorMessage = "Erro ao testar configura\xE7\xE3o SMTP";
      if (error.message) {
        errorMessage = error.message;
      }
      return throwError(() => ({
        success: false,
        error: errorMessage,
        details: error
      }));
    }));
  }
  // Validar configuração SMTP da empresa
  validateSmtpConfig(company) {
    const config = company.smtpConfig;
    return !!(config && config.host && config.port && config.user && config.password && config.fromName && config.fromEmail);
  }
  // Validar configuração SMTP e retornar campos faltantes
  getSmtpValidationErrors(company) {
    const config = company.smtpConfig;
    const errors = [];
    if (!config) {
      errors.push("Configura\xE7\xE3o SMTP n\xE3o encontrada");
      return errors;
    }
    if (!config.host)
      errors.push("Servidor SMTP (host)");
    if (!config.port)
      errors.push("Porta SMTP");
    if (!config.user)
      errors.push("Usu\xE1rio SMTP");
    if (!config.password)
      errors.push("Senha SMTP");
    if (!config.fromName)
      errors.push("Nome do remetente");
    if (!config.fromEmail)
      errors.push("Email do remetente");
    return errors;
  }
  // Método removido - agora usa Firebase Functions diretamente
  // Obter configurações de email da empresa atual
  getCurrentEmailConfig() {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return null;
    }
    return {
      fromName: company.smtpConfig.fromName,
      fromEmail: company.smtpConfig.fromEmail,
      isConfigured: this.validateSmtpConfig(company),
      host: company.smtpConfig.host,
      port: company.smtpConfig.port,
      secure: company.smtpConfig.secure
    };
  }
  // Atualizar configuração SMTP da empresa
  updateSmtpConfig(smtpConfig) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const apiUrl = `${this.subdomainService.getApiUrl()}/smtp-config`;
    return this.http.put(apiUrl, smtpConfig).pipe(map((response) => {
      if (company) {
        company.smtpConfig = __spreadValues({}, smtpConfig);
        this.subdomainService.setCurrentCompany(company);
      }
      return response;
    }), catchError((error) => {
      console.error("Erro ao atualizar configura\xE7\xE3o SMTP:", error);
      return throwError(() => error);
    }));
  }
  static \u0275fac = function SmtpService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SmtpService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SmtpService, factory: _SmtpService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SmtpService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  SmtpService
};
//# sourceMappingURL=chunk-6B6442J4.js.map
