import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { SubdomainService } from '../../services/subdomain.service';
import { Company } from '../../models/company.model';
import { ConfigHeaderComponent } from '../config-header/config-header.component';

@Component({
  selector: 'app-smtp-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfigHeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-config-header title="Configuração SMTP">
        <button 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          (click)="saveConfiguration()"
          [disabled]="isSaving() || smtpForm.invalid">
          @if (isSaving()) {
            <i class="fas fa-spinner fa-spin mr-1"></i>
            Salvando...
          } @else {
            <i class="fas fa-save mr-1"></i>
            Salvar Configurações
          }
        </button>
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
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="smtp.gmail.com">
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
                    Usuário/Email *
                  </label>
                  <input
                    type="email"
                    formControlName="user"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu-email@gmail.com">
                  <p class="text-xs text-gray-500 mt-1">Email para autenticação no servidor</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    formControlName="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="sua-senha-ou-app-password">
                  <p class="text-xs text-gray-500 mt-1">Senha ou App Password do Gmail</p>
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
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
    </div>
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

  smtpForm: FormGroup;
  currentCompany = signal<Company | null>(null);
  isSaving = signal(false);
  isTesting = signal(false);
  testEmail = '';
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

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
    this.loadCurrentConfiguration();
  }

  loadCurrentConfiguration() {
    const company = this.subdomainService.getCurrentCompany();
    if (company) {
      this.currentCompany.set(company);
      
      if (company.smtpConfig) {
        this.smtpForm.patchValue({
          host: company.smtpConfig.host,
          port: company.smtpConfig.port,
          secure: company.smtpConfig.secure,
          user: company.smtpConfig.user,
          password: company.smtpConfig.password,
          fromName: company.smtpConfig.fromName,
          fromEmail: company.smtpConfig.fromEmail
        });
      }
    }
  }

  async saveConfiguration() {
    if (this.smtpForm.invalid) return;

    const company = this.currentCompany();
    if (!company) {
      this.showError('Empresa não encontrada');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    try {
      const formValue = this.smtpForm.value;
      const updatedCompany: Partial<Company> = {
        smtpConfig: {
          host: formValue.host,
          port: formValue.port,
          secure: formValue.secure,
          user: formValue.user,
          password: formValue.password,
          fromName: formValue.fromName,
          fromEmail: formValue.fromEmail
        }
      };

      await this.companyService.updateCompany(company.id!, updatedCompany);
      
      // Update current company
      const refreshedCompany = { ...company, ...updatedCompany };
      this.subdomainService.setCurrentCompany(refreshedCompany);
      this.currentCompany.set(refreshedCompany);
      
      this.showSuccess('Configurações SMTP salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações SMTP:', error);
      this.showError('Erro ao salvar configurações. Tente novamente.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async sendTestEmail() {
    if (!this.testEmail || this.smtpForm.invalid) return;

    this.isTesting.set(true);
    this.clearMessages();

    try {
      // In a real app, you would call an API to send the test email
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.showSuccess(`Email de teste enviado para ${this.testEmail}!`);
    } catch (error) {
      console.error('Erro ao enviar email de teste:', error);
      this.showError('Erro ao enviar email de teste. Verifique as configurações.');
    } finally {
      this.isTesting.set(false);
    }
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