import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmtpService } from '../../services/smtp.service';
import { SubdomainService } from '../../services/subdomain.service';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-smtp-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="smtp-config-container">
      <div class="card">
        <div class="card-header">
          <h3><i class="fas fa-envelope"></i> Configuração SMTP</h3>
          <p class="text-muted">Configure o servidor de email para sua empresa</p>
        </div>
        
        <div class="card-body">
          <form [formGroup]="smtpForm" (ngSubmit)="saveConfiguration()">
            <div class="row">
              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label">Servidor SMTP *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="host"
                    placeholder="smtp.gmail.com">
                  <div class="form-text">Endereço do servidor SMTP</div>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label">Porta *</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    formControlName="port"
                    placeholder="587">
                  <div class="form-text">Porta do servidor SMTP</div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Usuário/Email *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    formControlName="user"
                    placeholder="seu-email@gmail.com">
                  <div class="form-text">Email para autenticação</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Senha *</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    formControlName="password"
                    placeholder="sua-senha-ou-app-password">
                  <div class="form-text">Senha ou App Password</div>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Nome do Remetente *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="fromName"
                    [placeholder]="currentCompany()?.name || 'Nome da Empresa'">
                  <div class="form-text">Nome que aparecerá nos emails</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Email do Remetente *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    formControlName="fromEmail"
                    placeholder="noreply@suaempresa.com">
                  <div class="form-text">Email que aparecerá como remetente</div>
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  formControlName="secure"
                  id="secureConnection">
                <label class="form-check-label" for="secureConnection">
                  Conexão segura (SSL/TLS)
                </label>
                <div class="form-text">Recomendado para a maioria dos provedores</div>
              </div>
            </div>
            
            <div class="d-flex gap-2 flex-wrap">
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="smtpForm.invalid || isLoading()">
                <i class="fas fa-save"></i>
                {{ isLoading() ? 'Salvando...' : 'Salvar Configuração' }}
              </button>
              
              <button 
                type="button" 
                class="btn btn-outline-info"
                (click)="testConfiguration()"
                [disabled]="smtpForm.invalid || isLoading()">
                <i class="fas fa-paper-plane"></i>
                {{ isLoading() ? 'Enviando...' : 'Enviar Email de Teste' }}
              </button>
              
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                (click)="loadPreset('gmail')">
                <i class="fab fa-google"></i>
                Gmail
              </button>
              
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                (click)="loadPreset('outlook')">
                <i class="fab fa-microsoft"></i>
                Outlook
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Status da Configuração -->
      <div class="card mt-3" *ngIf="configStatus()">
        <div class="card-body">
          <div class="d-flex align-items-center gap-3">
            <div [class]="configStatus()?.isConfigured ? 'text-success' : 'text-warning'">
              <i [class]="configStatus()?.isConfigured ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'"></i>
            </div>
            <div>
              <strong>Status: </strong>
              <span [class]="configStatus()?.isConfigured ? 'text-success' : 'text-warning'">
                {{ configStatus()?.isConfigured ? 'Configurado' : 'Não Configurado' }}
              </span>
              <div class="text-muted small" *ngIf="configStatus()?.isConfigured">
                Servidor: {{ configStatus()?.host }}:{{ configStatus()?.port }}
                <span *ngIf="configStatus()?.secure"> (SSL/TLS)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mensagens -->
      <div class="alert alert-success mt-3" *ngIf="successMessage()">
        <i class="fas fa-check-circle"></i>
        {{ successMessage() }}
      </div>
      
      <div class="alert alert-danger mt-3" *ngIf="errorMessage()">
        <i class="fas fa-exclamation-circle"></i>
        {{ errorMessage() }}
      </div>
      
      <!-- Dicas de Configuração -->
      <div class="card mt-3">
        <div class="card-header">
          <h6><i class="fas fa-info-circle"></i> Dicas de Configuração</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h6>Gmail:</h6>
              <ul class="small">
                <li>Servidor: smtp.gmail.com</li>
                <li>Porta: 587 (TLS) ou 465 (SSL)</li>
                <li>Use App Password, não sua senha normal</li>
                <li>Ative autenticação de 2 fatores</li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6>Outlook/Hotmail:</h6>
              <ul class="small">
                <li>Servidor: smtp-mail.outlook.com</li>
                <li>Porta: 587 (TLS)</li>
                <li>Use sua senha normal</li>
                <li>Certifique-se que SMTP está habilitado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .smtp-config-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .card-header h3 {
      margin: 0;
      color: #495057;
    }
    
    .form-control:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    
    .btn {
      border-radius: 6px;
    }
    
    .btn-primary {
      background-color: #007bff;
      border-color: #007bff;
    }
    
    .alert {
      border-radius: 6px;
    }
    
    .form-text {
      font-size: 0.875rem;
    }
  `]
})
export class SmtpConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private smtpService = inject(SmtpService);
  private subdomainService = inject(SubdomainService);
  private companyService = inject(CompanyService);

  smtpForm: FormGroup;
  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  currentCompany = signal<Company | null>(null);
  configStatus = signal<any>(null);

  constructor() {
    this.smtpForm = this.fb.group({
      host: ['', Validators.required],
      port: [587, [Validators.required, Validators.min(1), Validators.max(65535)]],
      secure: [false],
      user: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      fromName: ['', Validators.required],
      fromEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.currentCompany.set(this.subdomainService.getCurrentCompany());
    this.loadCurrentConfiguration();
    this.updateConfigStatus();
  }

  loadCurrentConfiguration() {
    const company = this.currentCompany();
    if (company && company.smtpConfig) {
      this.smtpForm.patchValue({
        host: company.smtpConfig.host,
        port: company.smtpConfig.port,
        secure: company.smtpConfig.secure,
        user: company.smtpConfig.user,
        password: company.smtpConfig.password,
        fromName: company.smtpConfig.fromName,
        fromEmail: company.smtpConfig.fromEmail
      });
    } else if (company) {
      // Definir valores padrão baseados na empresa
      this.smtpForm.patchValue({
        fromName: company.name,
        fromEmail: company.contactEmail || company.ownerEmail
      });
    }
  }

  async saveConfiguration() {
    if (this.smtpForm.invalid) {
      this.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading.set(true);
    this.clearMessages();

    try {
      const formValue = this.smtpForm.value;
      
      // Atualizar via CompanyService
      const company = this.currentCompany();
      if (company) {
        await this.companyService.updateCompany(company.id!, {
          smtpConfig: {
            host: formValue.host,
            port: formValue.port,
            secure: formValue.secure,
            user: formValue.user,
            password: formValue.password,
            fromName: formValue.fromName,
            fromEmail: formValue.fromEmail
          }
        });

        // Atualizar empresa local
        company.smtpConfig = formValue;
        this.currentCompany.set(company);
        this.subdomainService.setCurrentCompany(company);
        
        this.updateConfigStatus();
        this.showSuccess('Configuração SMTP salva com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar configuração SMTP:', error);
      this.showError('Erro ao salvar configuração SMTP. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  testConfiguration() {
    if (this.smtpForm.invalid) {
      this.showError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading.set(true);
    this.clearMessages();

    this.smtpService.testSmtpConfiguration().subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess('Email de teste enviado com sucesso! Verifique sua caixa de entrada.');
        } else {
          this.showError('Falha ao enviar email de teste: ' + (response.error || 'Erro desconhecido'));
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao testar configuração SMTP:', error);
        this.showError('Erro ao testar configuração SMTP: ' + (error.message || 'Erro desconhecido'));
        this.isLoading.set(false);
      }
    });
  }

  loadPreset(provider: 'gmail' | 'outlook') {
    const presets = {
      gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false
      },
      outlook: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false
      }
    };

    const preset = presets[provider];
    this.smtpForm.patchValue(preset);
  }

  private updateConfigStatus() {
    const status = this.smtpService.getCurrentEmailConfig();
    this.configStatus.set(status);
  }

  private showSuccess(message: string) {
    this.successMessage.set(message);
    this.errorMessage.set(null);
    setTimeout(() => this.successMessage.set(null), 5000);
  }

  private showError(message: string) {
    this.errorMessage.set(message);
    this.successMessage.set(null);
    setTimeout(() => this.errorMessage.set(null), 5000);
  }

  private clearMessages() {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}