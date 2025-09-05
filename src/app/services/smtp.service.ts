import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubdomainService } from './subdomain.service';
import { Company } from '../models/company.model';
import { Functions, httpsCallable } from '@angular/fire/functions';

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
  private functions = inject(Functions);

  // Enviar email usando configuração SMTP da empresa via Firebase Functions
  sendEmail(emailData: EmailData): Observable<EmailResponse> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      console.error('❌ Contexto da empresa não inicializado');
      return throwError(() => new Error('Contexto da empresa não inicializado'));
    }

    if (!this.validateSmtpConfig(company)) {
      console.error('❌ Configuração SMTP da empresa está incompleta:', company.smtpConfig);
      return throwError(() => new Error('Configuração SMTP da empresa está incompleta'));
    }

    console.log('📧 Preparando envio de email via Firebase Functions:', {
      to: emailData.to,
      subject: emailData.subject,
      fromEmail: company.smtpConfig.fromEmail,
      fromName: company.smtpConfig.fromName
    });

    // Usar Firebase HTTP Function para envio direto
    const sendEmailCallable = httpsCallable(this.functions, 'sendEmail');
    
    const payload = {
      emailData: {
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        cc: emailData.cc,
        bcc: emailData.bcc
      },
      smtpConfig: {
        host: company.smtpConfig.host,
        port: company.smtpConfig.port,
        secure: company.smtpConfig.secure,
        user: company.smtpConfig.user,
        password: company.smtpConfig.password,
        fromName: company.smtpConfig.fromName,
        fromEmail: company.smtpConfig.fromEmail
      }
    };

    console.log('📤 Enviando para Firebase Functions:', {
      ...payload,
      smtpConfig: {
        ...payload.smtpConfig,
        password: payload.smtpConfig.password.substring(0, 10) + '...'
      }
    });

    return from(sendEmailCallable(payload)).pipe(
      map((result: any) => {
        console.log('✅ Email enviado com sucesso via Firebase Functions:', result.data);
        return {
          success: result.data.success || true,
          messageId: result.data.messageId || 'sent'
        };
      }),
      catchError(error => {
        console.error('❌ Erro detalhado ao enviar email via Firebase Functions:', error);
        
        let errorMessage = 'Erro desconhecido ao enviar email';
        
        if (error.code === 'unauthenticated') {
          errorMessage = 'Usuário não autenticado. Faça login novamente.';
        } else if (error.code === 'permission-denied') {
          errorMessage = 'Acesso negado. Verifique as permissões.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        return throwError(() => ({
          success: false,
          error: errorMessage,
          details: error
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

    const subject = `Novo Registro: ${lead.fields.contactName || lead.fields.companyName || 'Registro sem nome'}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${company.primaryColor || '#007bff'}; color: white; padding: 20px; text-align: center;">
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

  // Testar configuração SMTP via Firebase Functions
  testSmtpConfiguration(): Observable<EmailResponse> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    if (!this.validateSmtpConfig(company)) {
      return throwError(() => new Error('Configuração SMTP da empresa está incompleta'));
    }

    console.log('🧪 Testando configuração SMTP via Firebase Functions');

    // Usar Firebase Callable Function para teste de configuração
    const testSmtpCallable = httpsCallable(this.functions, 'testSmtpConfig');
    
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

    return from(testSmtpCallable(payload)).pipe(
      map((result: any) => {
        console.log('✅ Teste SMTP realizado com sucesso:', result.data);
        return {
          success: result.data.success || true,
          messageId: result.data.messageId || 'test-sent',
          message: result.data.message || 'Teste realizado com sucesso'
        };
      }),
      catchError(error => {
        console.error('❌ Erro ao testar configuração SMTP:', error);
        
        let errorMessage = 'Erro ao testar configuração SMTP';
        
        if (error.message) {
          errorMessage = error.message;
        }
        
        return throwError(() => ({
          success: false,
          error: errorMessage,
          details: error
        }));
      })
    );
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

  // Método removido - agora usa Firebase Functions diretamente

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