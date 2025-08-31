import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { SubdomainService } from '../../services/subdomain.service';
import { Company } from '../../models/company.model';
import { ConfigHeaderComponent } from '../config-header/config-header.component';

interface CompanyLink {
  name: string;
  url: string;
  description: string;
  icon: string;
  category: 'app' | 'api' | 'form' | 'webhook';
  copyable: boolean;
}

@Component({
  selector: 'app-api-links-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfigHeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-config-header title="API e Integrações">
        <button 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          (click)="saveApiConfig()"
          [disabled]="isSaving()">
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

        <!-- API Configuration -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-plug text-blue-500 mr-2"></i>
              Configuração da API
            </h3>
            <p class="text-sm text-gray-600 mt-1">Configure e gerencie sua API para receber leads externos</p>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- API Status and Endpoint -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Status da API</label>
                  <div class="flex items-center space-x-3">
                    <span [class]="apiEnabled() ? 'inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800' : 'inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800'">
                      {{ apiEnabled() ? 'Ativa' : 'Inativa' }}
                    </span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" 
                             [checked]="apiEnabled()" 
                             (change)="toggleApiStatus($any($event.target).checked)"
                             class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Endpoint da API</label>
                  <div class="flex space-x-2">
                    <input
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                      [value]="getLeadIntakeUrl()"
                      readonly>
                    <button
                      class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                      (click)="copyToClipboard(getLeadIntakeUrl())">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">URL para envio de leads via API</p>
                </div>
              </div>

              <!-- API Token -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Token de API</label>
                  <div class="flex space-x-2">
                    <input
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                      [value]="showApiToken() ? apiToken() : '••••••••••••••••••••••••••••••••'"
                      readonly>
                    <button
                      class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                      (click)="toggleTokenVisibility()">
                      <i [class]="showApiToken() ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                    <button
                      class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
                      (click)="copyToClipboard(apiToken())">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Token para autenticação nas requisições API</p>
                </div>

                <div>
                  <button
                    class="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    (click)="regenerateApiToken()">
                    <i class="fas fa-sync-alt mr-1"></i>
                    Regenerar Token
                  </button>
                </div>
              </div>
            </div>

            <!-- Webhook Configuration -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="text-md font-medium text-gray-900 mb-4">Webhook (Opcional)</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">URL do Webhook</label>
                <input
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  [(ngModel)]="webhookUrl"
                  (input)="webhookUrl.set($any($event.target).value)"
                  placeholder="https://exemplo.com/webhook">
                <p class="text-xs text-gray-500 mt-1">URL que receberá notificações quando um novo lead for criado via API</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Company Links -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-link text-blue-500 mr-2"></i>
              Links da Empresa
            </h3>
            <p class="text-sm text-gray-600 mt-1">Links personalizados para {{ currentCompany()?.name }}</p>
          </div>
          
          <div class="p-6">
            <!-- Company Info Summary -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-500">Nome da Empresa</p>
                <p class="text-lg font-semibold text-gray-900">{{ currentCompany()?.name }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Subdomínio</p>
                <span class="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  {{ currentCompany()?.subdomain }}
                </span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Status</p>
                <span class="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                  {{ getStatusText() }}
                </span>
              </div>
            </div>

            <!-- Links Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              @for (link of companyLinks(); track link.name) {
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center space-x-3">
                      <div [class]="getLinkIconClass(link.category)">
                        <i [class]="link.icon"></i>
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-gray-900">{{ link.name }}</h4>
                        <p class="text-xs text-gray-500">{{ link.description }}</p>
                      </div>
                    </div>
                    @if (link.copyable) {
                      <button
                        class="text-gray-400 hover:text-gray-600 p-1"
                        (click)="copyToClipboard(link.url)"
                        title="Copiar URL">
                        <i class="fas fa-copy"></i>
                      </button>
                    }
                  </div>
                  
                  <div class="mt-3">
                    <div class="flex space-x-2">
                      <input
                        type="text"
                        class="flex-1 px-3 py-1 text-xs border border-gray-300 rounded bg-gray-50 text-gray-600"
                        [value]="link.url"
                        readonly>
                      <button
                        class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                        (click)="openLink(link.url)">
                        <i class="fas fa-external-link-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              }
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
export class ApiLinksConfigComponent implements OnInit {
  private companyService = inject(CompanyService);
  private subdomainService = inject(SubdomainService);

  currentCompany = signal<Company | null>(null);
  apiEnabled = signal(false);
  apiToken = signal<string>('');
  webhookUrl = signal<string>('');
  showApiToken = signal(false);
  isSaving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadApiConfiguration();
    this.generateCompanyLinks();
  }

  loadApiConfiguration() {
    const company = this.subdomainService.getCurrentCompany();
    if (company) {
      this.currentCompany.set(company);
      this.apiEnabled.set(company.apiConfig?.enabled || false);
      this.apiToken.set(company.apiConfig?.token || this.generateApiToken());
      this.webhookUrl.set(company.apiConfig?.webhookUrl || '');
    }
  }

  async saveApiConfig() {
    const company = this.currentCompany();
    if (!company) {
      this.showError('Empresa não encontrada');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    try {
      const updatedCompany: Partial<Company> = {
        apiConfig: {
          enabled: this.apiEnabled(),
          token: this.apiToken(),
          endpoint: this.getLeadIntakeUrl(),
          webhookUrl: this.webhookUrl()
        }
      };

      await this.companyService.updateCompany(company.id!, updatedCompany);
      
      // Update current company
      const refreshedCompany = { ...company, ...updatedCompany };
      this.subdomainService.setCurrentCompany(refreshedCompany);
      this.currentCompany.set(refreshedCompany);
      
      this.showSuccess('Configurações de API salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações de API:', error);
      this.showError('Erro ao salvar configurações. Tente novamente.');
    } finally {
      this.isSaving.set(false);
    }
  }

  toggleApiStatus(enabled: boolean) {
    this.apiEnabled.set(enabled);
  }

  toggleTokenVisibility() {
    this.showApiToken.set(!this.showApiToken());
  }

  regenerateApiToken() {
    if (confirm('Tem certeza que deseja regenerar o token da API? Isso invalidará o token atual.')) {
      const newToken = this.generateApiToken();
      this.apiToken.set(newToken);
      this.showSuccess('Novo token gerado! Lembre-se de atualizar suas integrações.');
    }
  }

  getLeadIntakeUrl(): string {
    const company = this.currentCompany();
    if (!company) return '';
    
    if (this.subdomainService.isDevelopment()) {
      return `http://localhost:5000/api/v1/companies/${company.id}/leads`;
    }
    
    return `https://api.taskboard.com.br/v1/companies/${company.id}/leads`;
  }

  companyLinks = signal<CompanyLink[]>([]);

  generateCompanyLinks() {
    const company = this.currentCompany();
    if (!company) return;

    const links: CompanyLink[] = [
      {
        name: 'Painel Principal',
        url: this.subdomainService.getCompanyUrl(company.subdomain),
        description: 'Acesso principal ao sistema da empresa',
        icon: 'fas fa-home',
        category: 'app',
        copyable: true
      },
      {
        name: 'Formulário Público',
        url: this.subdomainService.getPublicFormUrl() || '',
        description: 'Formulário para captura de leads externos',
        icon: 'fas fa-wpforms',
        category: 'form',
        copyable: true
      },
      {
        name: 'Endpoint de API',
        url: this.getLeadIntakeUrl(),
        description: 'URL para integração via API REST',
        icon: 'fas fa-plug',
        category: 'api',
        copyable: true
      },
      {
        name: 'Webhook',
        url: this.webhookUrl() || 'Não configurado',
        description: 'URL que recebe notificações de novos leads',
        icon: 'fas fa-bell',
        category: 'webhook',
        copyable: !!this.webhookUrl()
      }
    ];

    this.companyLinks.set(links.filter(link => link.url && link.url !== 'Não configurado'));
  }

  getLinkIconClass(category: string): string {
    const baseClass = 'w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm';
    switch (category) {
      case 'app': return baseClass + ' bg-blue-500';
      case 'form': return baseClass + ' bg-green-500';
      case 'api': return baseClass + ' bg-purple-500';
      case 'webhook': return baseClass + ' bg-orange-500';
      default: return baseClass + ' bg-gray-500';
    }
  }

  getStatusText(): string {
    const company = this.currentCompany();
    return company?.status === 'active' ? 'Ativo' : 'Inativo';
  }

  openLink(url: string) {
    if (url && url !== 'Não configurado') {
      window.open(url, '_blank');
    }
  }

  copyToClipboard(text: string) {
    if (text && text !== 'Não configurado') {
      navigator.clipboard.writeText(text).then(() => {
        this.showSuccess('Copiado para a área de transferência!');
      }).catch(() => {
        this.showError('Erro ao copiar para a área de transferência.');
      });
    }
  }

  private generateApiToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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