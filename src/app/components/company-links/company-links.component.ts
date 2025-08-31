import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubdomainService } from '../../services/subdomain.service';
import { ApiService } from '../../services/api.service';
import { Company } from '../../models/company.model';

interface CompanyLink {
  name: string;
  url: string;
  description: string;
  icon: string;
  category: 'app' | 'api' | 'form' | 'webhook';
  copyable: boolean;
}

@Component({
  selector: 'app-company-links',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="company-links-container">
      <div class="card">
        <div class="card-header">
          <h3><i class="fas fa-link"></i> Links da Empresa</h3>
          <p class="text-muted">Links personalizados para {{ currentCompany()?.name }}</p>
        </div>
        
        <div class="card-body">
          <!-- Informações da Empresa -->
          <div class="company-info mb-4" *ngIf="currentCompany()">
            <div class="row">
              <div class="col-md-4">
                <div class="info-item">
                  <strong>Nome:</strong>
                  <span>{{ currentCompany()?.name }}</span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-item">
                  <strong>Subdomínio:</strong>
                  <span class="badge bg-primary">{{ currentCompany()?.subdomain }}</span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-item">
                  <strong>Status:</strong>
                  <span [class]="getStatusClass()">{{ getStatusText() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Links por Categoria -->
          <div class="links-section" *ngFor="let category of getCategories(); let i = index">
            <h5 class="category-title">
              <i [class]="getCategoryIcon(category)"></i>
              {{ getCategoryName(category) }}
            </h5>
            
            <div class="row">
              <div class="col-md-6" *ngFor="let link of getLinksByCategory(category)">
                <div class="link-card">
                  <div class="d-flex align-items-center gap-3">
                    <div class="link-icon">
                      <i [class]="link.icon"></i>
                    </div>
                    <div class="link-info flex-grow-1">
                      <h6 class="mb-1">{{ link.name }}</h6>
                      <p class="mb-1 small text-muted">{{ link.description }}</p>
                      <div class="link-url">
                        <small class="text-break">{{ link.url }}</small>
                      </div>
                    </div>
                    <div class="link-actions">
                      <button 
                        class="btn btn-sm btn-outline-primary me-1"
                        (click)="copyToClipboard(link.url)"
                        [disabled]="!link.copyable">
                        <i class="fas fa-copy"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-secondary"
                        (click)="openLink(link.url)"
                        *ngIf="link.category !== 'api'">
                        <i class="fas fa-external-link-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- QR Code Section -->
          <div class="qr-section mt-4" *ngIf="showQRCode()">
            <h5><i class="fas fa-qrcode"></i> QR Code</h5>
            <div class="row">
              <div class="col-md-6">
                <div class="qr-card text-center">
                  <div class="qr-code mb-3">
                    <img 
                      [src]="getQRCodeUrl(getMainUrl())" 
                      alt="QR Code"
                      class="img-fluid">
                  </div>
                  <p class="small text-muted mb-2">
                    QR Code para acesso rápido ao sistema
                  </p>
                  <button 
                    class="btn btn-sm btn-outline-primary"
                    (click)="downloadQRCode()">
                    <i class="fas fa-download"></i>
                    Baixar QR Code
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <div class="qr-info">
                  <h6>Como usar:</h6>
                  <ul class="small">
                    <li>Escaneie com qualquer leitor de QR Code</li>
                    <li>Será redirecionado para o sistema da empresa</li>
                    <li>Ideal para cartões de visita e materiais impressos</li>
                    <li>Funciona em qualquer dispositivo móvel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Instruções de Integração -->
          <div class="integration-guide mt-4">
            <h5><i class="fas fa-book"></i> Guia de Integração</h5>
            <div class="accordion">
              <div class="accordion-item">
                <div class="accordion-header">
                  <button 
                    class="accordion-button collapsed"
                    type="button"
                    [attr.data-bs-toggle]="'collapse'"
                    [attr.data-bs-target]="'#website-integration'">
                    <i class="fas fa-globe me-2"></i>
                    Integração no Site
                  </button>
                </div>
                <div id="website-integration" class="accordion-collapse collapse">
                  <div class="accordion-body">
                    <p>Para integrar o formulário de leads no seu site, use o código:</p>
                    <pre class="bg-light p-3 rounded small"><code>&lt;iframe 
  src="{{ getFormUrl() }}" 
  width="100%" 
  height="600"
  frameborder="0"&gt;
&lt;/iframe&gt;</code></pre>
                    <button 
                      class="btn btn-sm btn-outline-primary"
                      (click)="copyToClipboard(getIframeCode())">
                      <i class="fas fa-copy"></i>
                      Copiar Código
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status de Recursos -->
      <div class="card mt-3">
        <div class="card-header">
          <h6><i class="fas fa-cogs"></i> Status dos Recursos</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 text-center">
              <div class="resource-status">
                <i class="fas fa-2x mb-2" 
                   [class.fa-check-circle]="currentCompany()?.apiConfig?.enabled"
                   [class.fa-times-circle]="!currentCompany()?.apiConfig?.enabled"
                   [class.text-success]="currentCompany()?.apiConfig?.enabled"
                   [class.text-danger]="!currentCompany()?.apiConfig?.enabled"></i>
                <h6>API</h6>
                <small class="text-muted">
                  {{ currentCompany()?.apiConfig?.enabled ? 'Ativa' : 'Inativa' }}
                </small>
              </div>
            </div>
            
            <div class="col-md-3 text-center">
              <div class="resource-status">
                <i class="fas fa-2x mb-2" 
                   [class.fa-check-circle]="hasValidSmtp()"
                   [class.fa-times-circle]="!hasValidSmtp()"
                   [class.text-success]="hasValidSmtp()"
                   [class.text-danger]="!hasValidSmtp()"></i>
                <h6>SMTP</h6>
                <small class="text-muted">
                  {{ hasValidSmtp() ? 'Configurado' : 'Não Configurado' }}
                </small>
              </div>
            </div>
            
            <div class="col-md-3 text-center">
              <div class="resource-status">
                <i class="fas fa-2x mb-2" 
                   [class.fa-check-circle]="!!currentCompany()?.logoUrl"
                   [class.fa-times-circle]="!currentCompany()?.logoUrl"
                   [class.text-success]="!!currentCompany()?.logoUrl"
                   [class.text-warning]="!currentCompany()?.logoUrl"></i>
                <h6>Branding</h6>
                <small class="text-muted">
                  {{ currentCompany()?.logoUrl ? 'Logo Configurado' : 'Logo Padrão' }}
                </small>
              </div>
            </div>
            
            <div class="col-md-3 text-center">
              <div class="resource-status">
                <i class="fas fa-crown fa-2x mb-2"
                   [class.text-warning]="currentCompany()?.plan === 'free'"
                   [class.text-info]="currentCompany()?.plan === 'starter'"
                   [class.text-success]="currentCompany()?.plan === 'professional'"
                   [class.text-primary]="currentCompany()?.plan === 'enterprise'"></i>
                <h6>Plano</h6>
                <small class="text-muted text-capitalize">
                  {{ currentCompany()?.plan || 'Free' }}
                </small>
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
    </div>
  `,
  styles: [`
    .company-links-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .company-info {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #dee2e6;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .category-title {
      color: #495057;
      border-bottom: 2px solid #007bff;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }
    
    .link-card {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      transition: all 0.3s ease;
    }
    
    .link-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #007bff;
    }
    
    .link-icon {
      width: 40px;
      height: 40px;
      background: #f8f9fa;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #007bff;
      font-size: 1.2rem;
    }
    
    .link-info h6 {
      color: #495057;
      font-weight: 600;
    }
    
    .link-url {
      background: #f8f9fa;
      border-radius: 4px;
      padding: 4px 8px;
      font-family: monospace;
    }
    
    .qr-card {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 20px;
    }
    
    .qr-code img {
      max-width: 150px;
      border: 1px solid #dee2e6;
      border-radius: 4px;
    }
    
    .qr-info {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      height: 100%;
    }
    
    .resource-status {
      padding: 15px;
      border-radius: 8px;
      background: #f8f9fa;
    }
    
    .accordion-button {
      background: #f8f9fa;
      border: none;
      border-radius: 8px !important;
    }
    
    .accordion-button:not(.collapsed) {
      background: #007bff;
      color: white;
    }
    
    pre {
      font-size: 0.875rem;
      overflow-x: auto;
    }
    
    .badge {
      font-size: 0.75rem;
    }
    
    .text-break {
      word-break: break-all;
    }
  `]
})
export class CompanyLinksComponent implements OnInit {
  private subdomainService = inject(SubdomainService);
  private apiService = inject(ApiService);

  currentCompany = signal<Company | null>(null);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showQRCode = signal(true);

  ngOnInit() {
    this.currentCompany.set(this.subdomainService.getCurrentCompany());
  }

  getCategories(): string[] {
    return ['app', 'form', 'api', 'webhook'];
  }

  getCategoryName(category: string): string {
    const names: { [key: string]: string } = {
      'app': 'Sistema Web',
      'form': 'Formulários',
      'api': 'API & Integração',
      'webhook': 'Webhooks'
    };
    return names[category] || category;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'app': 'fas fa-desktop',
      'form': 'fas fa-wpforms',
      'api': 'fas fa-code',
      'webhook': 'fas fa-webhook'
    };
    return icons[category] || 'fas fa-link';
  }

  getLinksByCategory(category: string): CompanyLink[] {
    const company = this.currentCompany();
    if (!company) return [];

    const baseUrl = this.subdomainService.getCompanyUrl(company.subdomain);
    const apiUrl = this.subdomainService.getApiUrl();

    const allLinks: CompanyLink[] = [
      // Sistema Web
      {
        name: 'Dashboard Principal',
        url: `${baseUrl}/dashboard`,
        description: 'Acesso ao painel principal do sistema',
        icon: 'fas fa-tachometer-alt',
        category: 'app',
        copyable: true
      },
      {
        name: 'Login',
        url: `${baseUrl}/login`,
        description: 'Página de login da empresa',
        icon: 'fas fa-sign-in-alt',
        category: 'app',
        copyable: true
      },
      
      // Formulários
      {
        name: 'Formulário Público',
        url: `${baseUrl}/form`,
        description: 'Formulário público para captura de leads',
        icon: 'fas fa-wpforms',
        category: 'form',
        copyable: true
      },
      
      // API
      {
        name: 'Endpoint Lead Intake',
        url: this.getLeadIntakeUrl(),
        description: 'Endpoint para envio de leads via API',
        icon: 'fas fa-server',
        category: 'api',
        copyable: true
      },
      {
        name: 'Token de Autenticação',
        url: company.apiConfig?.token || 'Token não configurado',
        description: 'Token Bearer para autenticação na API',
        icon: 'fas fa-key',
        category: 'api',
        copyable: true
      },
      
      // Webhooks
      {
        name: 'URL de Webhook',
        url: company.apiConfig?.webhookUrl || 'Não configurado',
        description: 'URL para receber notificações automáticas',
        icon: 'fas fa-webhook',
        category: 'webhook',
        copyable: !!company.apiConfig?.webhookUrl
      }
    ];

    return allLinks.filter(link => link.category === category);
  }

  getLeadIntakeUrl(): string {
    try {
      return this.apiService.getLeadIntakeUrl();
    } catch (error) {
      return 'Erro: empresa não configurada';
    }
  }

  getMainUrl(): string {
    const company = this.currentCompany();
    return company ? this.subdomainService.getCompanyUrl(company.subdomain) : '';
  }

  getFormUrl(): string {
    const company = this.currentCompany();
    return company ? `${this.subdomainService.getCompanyUrl(company.subdomain)}/form` : '';
  }

  getQRCodeUrl(url: string): string {
    // Usando API gratuita para gerar QR Code
    const encodedUrl = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}`;
  }

  getIframeCode(): string {
    const formUrl = this.getFormUrl();
    return `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`;
  }

  downloadQRCode() {
    const url = this.getQRCodeUrl(this.getMainUrl());
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${this.currentCompany()?.subdomain}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showSuccess('Download do QR Code iniciado!');
  }

  openLink(url: string) {
    if (url && url !== 'Não configurado' && url !== 'Token não configurado') {
      window.open(url, '_blank');
    }
  }

  copyToClipboard(text: string) {
    if (!text || text === 'Não configurado' || text === 'Token não configurado') {
      this.showError('Nada para copiar.');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('Copiado para área de transferência!');
    }).catch(() => {
      this.showError('Erro ao copiar para área de transferência.');
    });
  }

  getStatusClass(): string {
    const company = this.currentCompany();
    if (!company) return 'badge bg-secondary';
    
    switch (company.status) {
      case 'active': return 'badge bg-success';
      case 'inactive': return 'badge bg-warning';
      case 'suspended': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getStatusText(): string {
    const company = this.currentCompany();
    if (!company) return 'Desconhecido';
    
    switch (company.status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      default: return 'Desconhecido';
    }
  }

  hasValidSmtp(): boolean {
    const company = this.currentCompany();
    return !!(company?.smtpConfig?.host && 
             company?.smtpConfig?.user && 
             company?.smtpConfig?.password);
  }

  private showSuccess(message: string) {
    this.successMessage.set(message);
    this.errorMessage.set(null);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  private showError(message: string) {
    this.errorMessage.set(message);
    this.successMessage.set(null);
    setTimeout(() => this.errorMessage.set(null), 5000);
  }
}