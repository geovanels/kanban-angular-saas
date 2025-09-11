import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { SubdomainService } from '../../services/subdomain.service';
import { SmtpService } from '../../services/smtp.service';
import { Company } from '../../models/company.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../toast/toast.service';
import { ConfigHeaderComponent } from '../config-header/config-header.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-smtp-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfigHeaderComponent, MainLayoutComponent],
  template: `
    <app-main-layout>
      <app-config-header title="Configuração SMTP">
        <div class="flex items-center space-x-3">
          <button 
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            (click)="saveConfiguration()"
            [disabled]="isSaving()">
            @if (isSaving()) {
              <i class="fas fa-spinner fa-spin mr-1"></i>
              Salvando...
            } @else {
              <i class="fas fa-save mr-1"></i>
              Salvar Configurações
            }
          </button>
        </div>
      </app-config-header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Success/Error Messages -->
        @if (successMessage()) {
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <i class="fas fa-check-circle mr-2"></i>
            {{ successMessage() }}
          </div>
        }
        
        @if (errorMessage()) {
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <i class="fas fa-exclamation-circle mr-2"></i>
            {{ errorMessage() }}
          </div>
        }

        <!-- SMTP Configuration Form -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-envelope text-blue-500 mr-2"></i>
              Configuração do Servidor SMTP
            </h3>
            <p class="text-sm text-gray-600 mt-1">Configure o servidor de email para sua empresa enviar notificações</p>
          </div>
          
          <div class="p-6">
            <form [formGroup]="smtpForm" (ngSubmit)="saveConfiguration()" class="space-y-6">
              <!-- Server Configuration -->
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div class="lg:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Servidor SMTP *
                  </label>
                  <input
                    type="text"
                    formControlName="host"
                    [class]="'w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ' + 
                            (smtpForm.get('host')?.invalid && smtpForm.get('host')?.touched ? 
                             'border-red-300 bg-red-50' : 'border-gray-300')"
                    placeholder="smtp.sendgrid.net">
                  <p class="text-xs text-gray-500 mt-1">Endereço do servidor SMTP</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Porta *
                  </label>
                  <input
                    type="number"
                    formControlName="port"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="587">
                  <p class="text-xs text-gray-500 mt-1">Porta SMTP</p>
                </div>
              </div>

              <!-- Authentication -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Usuário *
                  </label>
                  <input
                    type="text"
                    formControlName="user"
                    [class]="'w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ' + 
                            (smtpForm.get('user')?.invalid && smtpForm.get('user')?.touched ? 
                             'border-red-300 bg-red-50' : 'border-gray-300')"
                    placeholder="apikey">
                  <p class="text-xs text-gray-500 mt-1">Para SendGrid, use sempre "apikey"</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    formControlName="password"
                    [class]="'w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ' + 
                            (smtpForm.get('password')?.invalid && smtpForm.get('password')?.touched ? 
                             'border-red-300 bg-red-50' : 'border-gray-300')"
                    placeholder="SG.xxxxxxxxxx...">
                  <p class="text-xs text-gray-500 mt-1">API Key do SendGrid (começa com SG.)</p>
                </div>
              </div>

              <!-- Sender Information -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Remetente *
                  </label>
                  <input
                    type="text"
                    formControlName="fromName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [placeholder]="currentCompany()?.name || 'Nome da Empresa'">
                  <p class="text-xs text-gray-500 mt-1">Nome que aparecerá nos emails enviados</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email do Remetente *
                  </label>
                  <input
                    type="email"
                    formControlName="fromEmail"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="noreply@suaempresa.com">
                  <p class="text-xs text-gray-500 mt-1">Email que aparecerá como remetente</p>
                </div>
              </div>

              <!-- Security Options -->
              <div class="space-y-3">
                <h4 class="text-md font-medium text-gray-900">Opções de Segurança</h4>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    formControlName="secure"
                    id="secureConnection"
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <label for="secureConnection" class="ml-2 text-sm text-gray-700">
                    Usar conexão segura (SSL/TLS)
                  </label>
                </div>
                <p class="text-xs text-gray-500">Recomendado para a maioria dos provedores de email</p>
              </div>

              <!-- Test Email Section -->
              <div class="pt-6 border-t border-gray-200">
                <h4 class="text-md font-medium text-gray-900 mb-4">Testar Configuração</h4>
                <div class="flex space-x-3">
                  <input
                    type="email"
                    [(ngModel)]="testEmail"
                    [ngModelOptions]="{standalone: true}"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu-email@exemplo.com">
                  <button
                    type="button"
                    class="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    [style.background-color]="getPrimaryColor()"
                    (click)="sendTestEmail()"
                    [disabled]="isTesting() || !testEmail || smtpForm.invalid">
                    @if (isTesting()) {
                      <i class="fas fa-spinner fa-spin mr-1"></i>
                      Enviando...
                    } @else {
                      <i class="fas fa-paper-plane mr-1"></i>
                      Testar
                    }
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">Envie um email de teste para verificar se a configuração está funcionando</p>
              </div>
            </form>
          </div>
        </div>

        <!-- Quick Setup Guides -->
        <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-question-circle text-blue-500 mr-2"></i>
              Guias de Configuração Rápida
            </h3>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- SendGrid (Recomendado) -->
              <div class="border border-green-200 rounded-lg p-4 bg-green-50">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <i class="fas fa-paper-plane text-white text-sm"></i>
                  </div>
                  <h4 class="ml-3 text-sm font-semibold text-gray-900">SendGrid (Recomendado)</h4>
                  <span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Configurado</span>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Servidor:</strong> smtp.sendgrid.net</p>
                  <p><strong>Porta:</strong> 587</p>
                  <p><strong>Usuário:</strong> apikey</p>
                  <p><strong>Senha:</strong> Sua API Key do SendGrid</p>
                  <p class="text-green-700"><strong>✓</strong> Maior taxa de entrega</p>
                </div>
              </div>

              <!-- Gmail -->
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <i class="fab fa-google text-white text-sm"></i>
                  </div>
                  <h4 class="ml-3 text-sm font-semibold text-gray-900">Gmail</h4>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Servidor:</strong> smtp.gmail.com</p>
                  <p><strong>Porta:</strong> 587</p>
                  <p><strong>Seguro:</strong> Sim</p>
                  <p><strong>Senha:</strong> App Password necessária</p>
                </div>
              </div>

              <!-- Outlook -->
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <i class="fab fa-microsoft text-white text-sm"></i>
                  </div>
                  <h4 class="ml-3 text-sm font-semibold text-gray-900">Outlook</h4>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Servidor:</strong> smtp-mail.outlook.com</p>
                  <p><strong>Porta:</strong> 587</p>
                  <p><strong>Seguro:</strong> Sim</p>
                  <p><strong>Auth:</strong> STARTTLS</p>
                </div>
              </div>

              <!-- Generic -->
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
                    <i class="fas fa-server text-white text-sm"></i>
                  </div>
                  <h4 class="ml-3 text-sm font-semibold text-gray-900">Outros</h4>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Porta 25:</strong> Não segura</p>
                  <p><strong>Porta 465:</strong> SSL</p>
                  <p><strong>Porta 587:</strong> TLS</p>
                  <p><strong>Porta 2525:</strong> Alternativa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SmtpConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private subdomainService = inject(SubdomainService);
  private smtpService = inject(SmtpService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  smtpForm: FormGroup;
  currentCompany = signal<Company | null>(null);
  isSaving = signal(false);
  isTesting = signal(false);
  testEmail = '';
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.smtpForm = this.fb.group({
      host: ['smtp.sendgrid.net', Validators.required],
      port: [587, [Validators.required, Validators.min(1), Validators.max(65535)]],
      secure: [true],
      user: ['apikey', [Validators.required]],
      password: ['', Validators.required],
      fromName: ['', Validators.required],
      fromEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadCurrentConfiguration(true);
  }

  loadCurrentConfiguration(forceFetch: boolean = false) {
    const existing = this.subdomainService.getCurrentCompany();
    const hydrateForm = (company: Company) => {
      this.currentCompany.set(company);
      if (company?.smtpConfig) {
        this.smtpForm.patchValue({
          host: company.smtpConfig.host || this.smtpForm.get('host')?.value,
          port: company.smtpConfig.port || this.smtpForm.get('port')?.value,
          secure: company.smtpConfig.secure !== undefined ? company.smtpConfig.secure : this.smtpForm.get('secure')?.value,
          user: company.smtpConfig.user || this.smtpForm.get('user')?.value,
          password: company.smtpConfig.password || this.smtpForm.get('password')?.value || '',
          fromName: company.smtpConfig.fromName || this.smtpForm.get('fromName')?.value,
          fromEmail: company.smtpConfig.fromEmail || this.smtpForm.get('fromEmail')?.value
        }, { emitEvent: false });
      }
    };

    if (existing && !forceFetch) {
      hydrateForm(existing);
      return;
    }

    // Force fetch from Firestore by subdomain or user email
    (async () => {
      let company = existing || null;
      try {
        const sub = this.companyService.getCompanySubdomain();
        if (sub) company = await this.companyService.getCompanyBySubdomain(sub);
      } catch {}
      if (!company) {
        try {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser?.email) company = await this.companyService.getCompanyByUserEmail(currentUser.email);
        } catch {}
      }
      if (company) {
        this.subdomainService.setCurrentCompany(company);
        hydrateForm(company);
      }
    })();
  }

  async saveConfiguration() {
    // Sempre marcar campos como touched para mostrar erros
    this.markAllFieldsAsTouched();
    
    if (this.smtpForm.invalid) {
      this.showError('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    let company = this.currentCompany();
    if (!company?.id) {
      await new Promise(resolve => { this.loadCurrentConfiguration(true); setTimeout(resolve, 500); });
      company = this.currentCompany();
    }
    if (!company?.id) {
      this.showError('Empresa não encontrada');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    try {
      const formValue = this.smtpForm.value;
      
      const smtpConfig = {
        host: String(formValue.host || this.currentCompany()?.smtpConfig?.host || ''),
        port: Number(formValue.port || this.currentCompany()?.smtpConfig?.port || 587),
        secure: Boolean(formValue.secure ?? this.currentCompany()?.smtpConfig?.secure ?? true),
        user: String(formValue.user || this.currentCompany()?.smtpConfig?.user || ''),
        password: String((formValue.password ?? '').toString().trim() || this.currentCompany()?.smtpConfig?.password || ''),
        fromName: String(formValue.fromName || this.currentCompany()?.smtpConfig?.fromName || ''),
        fromEmail: String(formValue.fromEmail || this.currentCompany()?.smtpConfig?.fromEmail || '')
      };
      
      const updatedCompany: Partial<Company> = {
        smtpConfig: smtpConfig
      };
      
      await this.companyService.updateCompany(company.id, updatedCompany);
      
      // Refetch from Firestore to ensure persistence
      this.loadCurrentConfiguration(true);
      
      this.showSuccess('Configurações SMTP salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações SMTP:', error);
      this.showError('Erro ao salvar configurações: ' + ((error as any)?.message || 'Tente novamente.'));
    } finally {
      this.isSaving.set(false);
    }
  }

  async sendTestEmail() {
    if (!this.testEmail || this.smtpForm.invalid) {
      this.showError('Por favor, preencha um email válido e complete todas as configurações.');
      return;
    }

    // Salvar configurações primeiro se necessário
    if (this.smtpForm.dirty) {
      await this.saveConfiguration();
      // Aguardar um tempo para garantir que as configurações foram salvas
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.isTesting.set(true);
    this.clearMessages();

    try {
      const testEmailData = {
        to: this.testEmail,
        subject: `Teste SMTP - ${this.currentCompany()?.name || 'Sistema'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: ${this.getPrimaryColor()};">✅ Teste de Configuração SMTP</h2>
            <p>Parabéns! Sua configuração SMTP está funcionando corretamente.</p>
            <p><strong>Empresa:</strong> ${this.currentCompany()?.name}</p>
            <p><strong>Email enviado para:</strong> ${this.testEmail}</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid ${this.getPrimaryColor()}; margin: 20px 0;">
              <strong>Configurações utilizadas:</strong><br>
              Host: ${this.smtpForm.get('host')?.value}<br>
              Porta: ${this.smtpForm.get('port')?.value}<br>
              Seguro: ${this.smtpForm.get('secure')?.value ? 'Sim' : 'Não'}<br>
              Remetente: ${this.smtpForm.get('fromName')?.value} &lt;${this.smtpForm.get('fromEmail')?.value}&gt;
            </div>
            <p style="color: #28a745; font-weight: bold;">🎉 Sistema de emails configurado com sucesso!</p>
          </div>
        `
      };

      console.log('🧪 Enviando email de teste via SmtpService...');
      
      // Usar o SmtpService para enviar o email de teste
      const result = await this.smtpService.sendEmail(testEmailData).toPromise();
      
      if (result?.success) {
        this.showSuccess(`Email de teste enviado com sucesso para ${this.testEmail}.`);
      } else {
        throw new Error(result?.error || 'Falha no envio do email');
      }
      
    } catch (error: any) {
      console.error('❌ Erro ao enviar email de teste:', error);
      
      let errorMsg = 'Erro ao enviar email de teste.';
      
      if (error?.error) {
        errorMsg = error.error;
      } else if (error?.message) {
        if (error.message.includes('API Key') || error.message.includes('401')) {
          errorMsg = 'API Key do SendGrid inválida. Verifique se a chave está correta.';
        } else if (error.message.includes('configuração') || error.message.includes('incompleta')) {
          errorMsg = 'Configuração SMTP incompleta. Preencha todos os campos.';
        } else {
          errorMsg = `Erro: ${error.message}`;
        }
      }
      
      this.showError(errorMsg);
    } finally {
      this.isTesting.set(false);
    }
  }

  private showSuccess(message: string) {
    // Usar toast padrão do sistema
    try { this.toast.success(message); } catch {}
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  private showError(message: string) {
    // Usar toast padrão do sistema
    try { this.toast.error(message); } catch {}
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  private clearMessages() {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.smtpForm.controls).forEach(key => {
      const control = this.smtpForm.get(key);
      if (control && !control.valid && control.touched) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.smtpForm.controls).forEach(key => {
      this.smtpForm.get(key)?.markAsTouched();
    });
  }

  getPrimaryColor(): string {
    const company = this.subdomainService.getCurrentCompany();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || '#3B82F6';
  }
}