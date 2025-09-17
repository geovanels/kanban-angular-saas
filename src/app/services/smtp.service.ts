import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SubdomainService } from './subdomain.service';
import { CompanyService } from './company.service';
import { AuthService } from './auth.service';
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
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);

  private async resolveCompanyWithSmtp(): Promise<Company | null> {
    // 1) Empresa atual no contexto
    let company = this.subdomainService.getCurrentCompany();
    if (company?.smtpConfig && this.validateSmtpConfig(company)) return company;

    // 2) Buscar por subdomínio
    try {
      const sub = this.companyService.getCompanySubdomain();
      if (sub) {
        const bySub = await this.companyService.getCompanyBySubdomain(sub);
        if (bySub?.id) {
          this.subdomainService.setCurrentCompany(bySub);
          company = bySub;
          if (company?.smtpConfig && this.validateSmtpConfig(company)) return company;
        }
      }
    } catch {}

    // 3) Buscar por email do usuário autenticado
    try {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?.email) {
        const byEmail = await this.companyService.getCompanyByUserEmail(currentUser.email);
        if (byEmail?.id) {
          this.subdomainService.setCurrentCompany(byEmail);
          company = byEmail;
          if (company?.smtpConfig && this.validateSmtpConfig(company)) return company;
        }
      }
    } catch {}

    return company || null;
  }

  // Enviar email usando HTTP Firebase Function (melhor controle de CORS)
  sendEmail(emailData: EmailData): Observable<EmailResponse> {
    return from(this.resolveCompanyWithSmtp()).pipe(
      switchMap((company) => {
        if (!company) {
          console.error('❌ Contexto da empresa não inicializado');
          return throwError(() => new Error('Contexto da empresa não inicializado'));
        }


        // Usar HTTP Function para melhor controle de CORS
        const httpFunctionUrl = 'https://us-central1-kanban-gobuyer.cloudfunctions.net/sendEmailHttp';
        
        const payload = {
          emailData: {
            to: emailData.to,
            subject: emailData.subject,
            html: emailData.html,
            text: emailData.text,
            cc: emailData.cc,
            bcc: emailData.bcc
          },
          companyId: (company as any).id, // Cloud Function pode resolver via companyId
          // Enviar smtpConfig também, para compatibilidade retro
          smtpConfig: {
            host: (company as any).smtpConfig?.host,
            port: (company as any).smtpConfig?.port,
            secure: (company as any).smtpConfig?.secure,
            user: (company as any).smtpConfig?.user,
            password: (company as any).smtpConfig?.password,
            fromName: (company as any).smtpConfig?.fromName,
            fromEmail: (company as any).smtpConfig?.fromEmail
          }
        };


        return this.http.post<EmailResponse>(httpFunctionUrl, payload);
      }),
      map((result: any) => {
        return {
          success: result.success || true,
          messageId: result.messageId || 'sent',
          message: result.message
        };
      }),
      catchError(error => {
        console.error('❌ Erro detalhado ao enviar email via HTTP Function:', error);
        
        let errorMessage = 'Erro desconhecido ao enviar email';
        
        if (error.status === 400) {
          errorMessage = error.error?.error || 'Dados inválidos para envio de email';
        } else if (error.status === 404) {
          errorMessage = 'Empresa não encontrada';
        } else if (error.status === 500) {
          errorMessage = error.error?.error || 'Erro interno do servidor';
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
      const missingFields = this.getSmtpValidationErrors(company);
      return throwError(() => new Error(`Configuração SMTP incompleta. Campos faltantes: ${missingFields.join(', ')}`));
    }


    // Usar Firebase Callable Function para teste de configuração
    const testSmtpCallable = httpsCallable(this.functions, 'testSmtpConfig');
    
    const payload = {
      smtpConfig: {
        host: (company as any).smtpConfig.host,
        port: (company as any).smtpConfig.port,
        secure: (company as any).smtpConfig.secure,
        user: (company as any).smtpConfig.user,
        password: (company as any).smtpConfig.password,
        fromName: (company as any).smtpConfig.fromName,
        fromEmail: (company as any).smtpConfig.fromEmail
      },
      testEmail: company.ownerEmail
    };

    return from(testSmtpCallable(payload)).pipe(
      map((result: any) => {
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
    const config = (company as any).smtpConfig;
    
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

  // Validar configuração SMTP e retornar campos faltantes
  private getSmtpValidationErrors(company: Company): string[] {
    const config = (company as any).smtpConfig;
    const errors: string[] = [];
    
    if (!config) {
      errors.push('Configuração SMTP não encontrada');
      return errors;
    }
    
    if (!config.host) errors.push('Servidor SMTP (host)');
    if (!config.port) errors.push('Porta SMTP');
    if (!config.user) errors.push('Usuário SMTP');
    if (!config.password) errors.push('Senha SMTP');
    if (!config.fromName) errors.push('Nome do remetente');
    if (!config.fromEmail) errors.push('Email do remetente');
    
    return errors;
  }

  // Método removido - agora usa Firebase Functions diretamente

  // Obter configurações de email da empresa atual
  getCurrentEmailConfig(): any {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return null;
    }

    return {
      fromName: (company as any).smtpConfig.fromName,
      fromEmail: (company as any).smtpConfig.fromEmail,
      isConfigured: this.validateSmtpConfig(company),
      host: (company as any).smtpConfig.host,
      port: (company as any).smtpConfig.port,
      secure: (company as any).smtpConfig.secure
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
          (company as any).smtpConfig = { ...smtpConfig };
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