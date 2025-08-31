import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubdomainService } from './subdomain.service';
import { Company } from '../models/company.model';

export interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded
    contentType: string;
  }>;
  templateId?: string;
  templateData?: { [key: string]: any };
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SmtpService {
  private http = inject(HttpClient);
  private subdomainService = inject(SubdomainService);

  // Enviar email usando configuração SMTP da empresa
  sendEmail(emailData: EmailData): Observable<EmailResponse> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Contexto da empresa não inicializado'));
    }

    if (!this.validateSmtpConfig(company)) {
      return throwError(() => new Error('Configuração SMTP da empresa está incompleta'));
    }

    // Preparar dados do email com configuração da empresa
    const emailPayload = {
      ...emailData,
      smtpConfig: {
        host: company.smtpConfig.host,
        port: company.smtpConfig.port,
        secure: company.smtpConfig.secure,
        auth: {
          user: company.smtpConfig.user,
          pass: company.smtpConfig.password
        }
      },
      from: {
        name: company.smtpConfig.fromName,
        email: company.smtpConfig.fromEmail
      },
      companyId: company.id
    };

    // URL da API de envio de emails (backend)
    const apiUrl = this.getEmailApiUrl();
    
    return this.http.post<EmailResponse>(apiUrl, emailPayload).pipe(
      map(response => ({
        ...response,
        success: true,
        messageId: response.messageId
      })),
      catchError(error => {
        console.error('Erro ao enviar email:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.message || 'Erro desconhecido ao enviar email'
        }));
      })
    );
  }

  // Enviar email de template
  sendTemplateEmail(templateId: string, to: string, templateData: { [key: string]: any }, subject?: string): Observable<EmailResponse> {
    return this.sendEmail({
      to,
      subject: subject || 'Email automático',
      templateId,
      templateData
    });
  }

  // Enviar email de notificação simples
  sendNotificationEmail(to: string, subject: string, message: string, isHtml: boolean = false): Observable<EmailResponse> {
    const emailData: EmailData = {
      to,
      subject,
      [isHtml ? 'html' : 'text']: message
    };

    return this.sendEmail(emailData);
  }

  // Enviar email de novo lead
  sendNewLeadNotification(lead: any, boardName: string, columnName: string): Observable<EmailResponse> {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    const subject = `Novo Lead: ${lead.fields.contactName || lead.fields.companyName || 'Lead sem nome'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${company.primaryColor || '#007bff'}; color: white; padding: 20px; text-align: center;">
          <h1>${company.name}</h1>
          <h2>Novo Lead Recebido</h2>
        </div>
        
        <div style="padding: 20px; background-color: #f8f9fa;">
          <h3>Detalhes do Lead:</h3>
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
            ` : ''}
            ${lead.fields.contactName ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Contato:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.fields.contactName}</td>
            </tr>
            ` : ''}
            ${lead.fields.contactEmail ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.fields.contactEmail}</td>
            </tr>
            ` : ''}
            ${lead.fields.contactPhone ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Telefone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.fields.contactPhone}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666;">
          <p>
            <a href="${this.subdomainService.getCompanyUrl(company.subdomain)}" 
               style="background-color: ${company.primaryColor || '#007bff'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
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

  // Testar configuração SMTP
  testSmtpConfiguration(): Observable<EmailResponse> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    const testEmail: EmailData = {
      to: company.ownerEmail,
      subject: `Teste SMTP - ${company.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: ${company.primaryColor || '#007bff'};">Teste de Configuração SMTP</h2>
          <p>Este é um email de teste para verificar se a configuração SMTP está funcionando corretamente.</p>
          <p><strong>Empresa:</strong> ${company.name}</p>
          <p><strong>Subdomínio:</strong> ${company.subdomain}</p>
          <p><strong>Servidor SMTP:</strong> ${company.smtpConfig.host}:${company.smtpConfig.port}</p>
          <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p style="color: #28a745; font-weight: bold;">✅ Configuração SMTP funcionando corretamente!</p>
        </div>
      `
    };

    return this.sendEmail(testEmail);
  }

  // Validar configuração SMTP da empresa
  private validateSmtpConfig(company: Company): boolean {
    const config = company.smtpConfig;
    
    return !!(
      config &&
      config.host &&
      config.port &&
      config.user &&
      config.password &&
      config.fromName &&
      config.fromEmail
    );
  }

  // Obter URL da API de emails
  private getEmailApiUrl(): string {
    const baseUrl = this.subdomainService.getApiUrl();
    return `${baseUrl}/emails/send`;
  }

  // Obter configurações de email da empresa atual
  getCurrentEmailConfig(): any {
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
  updateSmtpConfig(smtpConfig: Company['smtpConfig']): Observable<any> {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    const apiUrl = `${this.subdomainService.getApiUrl()}/smtp-config`;
    
    return this.http.put(apiUrl, smtpConfig).pipe(
      map(response => {
        // Atualizar a configuração localmente
        if (company) {
          company.smtpConfig = { ...smtpConfig };
          this.subdomainService.setCurrentCompany(company);
        }
        return response;
      }),
      catchError(error => {
        console.error('Erro ao atualizar configuração SMTP:', error);
        return throwError(() => error);
      })
    );
  }
}