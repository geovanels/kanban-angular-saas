import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SubdomainService } from '../../services/subdomain.service';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-api-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="api-config-container">
      <!-- API Configuration -->
      <div class="card">
        <div class="card-header">
          <h3><i class="fas fa-plug"></i> Configuração da API</h3>
          <p class="text-muted">Configure e gerencie sua API para receber leads externos</p>
        </div>
        
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <div class="mb-3">
                <label class="form-label"><strong>Endpoint da API:</strong></label>
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    [value]="getLeadIntakeUrl()" 
                    readonly>
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    (click)="copyToClipboard(getLeadIntakeUrl())">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
                <div class="form-text">
                  <span *ngIf="getCurrentBoardId()">URL para envio de leads neste quadro ({{ getCurrentBoardId() }})</span>
                  <span *ngIf="!getCurrentBoardId()">URL base para envio de leads. Adicione /{{ '{' }}boardId{{ '}' }} ao final para especificar o quadro</span>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label"><strong>Status da API:</strong></label>
                <div class="d-flex align-items-center gap-2">
                  <span [class]="currentCompany()?.apiConfig?.enabled ? 'badge bg-success' : 'badge bg-danger'">
                    {{ currentCompany()?.apiConfig?.enabled ? 'Ativa' : 'Inativa' }}
                  </span>
                  <button 
                    class="btn btn-sm btn-outline-primary"
                    (click)="toggleApiStatus()"
                    [disabled]="isLoading()">
                    {{ currentCompany()?.apiConfig?.enabled ? 'Desativar' : 'Ativar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-8">
              <div class="mb-3">
                <label class="form-label"><strong>Token de Autenticação:</strong></label>
                <div class="input-group">
                  <input 
                    type="password" 
                    class="form-control" 
                    [value]="currentCompany()?.apiConfig?.token" 
                    readonly
                    #tokenInput>
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    (click)="toggleTokenVisibility(tokenInput)">
                    <i class="fas" [class.fa-eye]="!showToken()" [class.fa-eye-slash]="showToken()"></i>
                  </button>
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    (click)="copyToClipboard(currentCompany()?.apiConfig?.token || '')">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
                <div class="form-text">Use este token no header Authorization: Bearer [token]</div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">&nbsp;</label>
                <div class="d-grid">
                  <button 
                    class="btn btn-warning"
                    (click)="regenerateToken()"
                    [disabled]="isLoading()">
                    <i class="fas fa-sync-alt"></i>
                    {{ isLoading() ? 'Gerando...' : 'Regenerar Token' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="d-flex gap-2 flex-wrap">
            <button 
              class="btn btn-outline-info"
              (click)="testApi()"
              [disabled]="isLoading() || !currentCompany()?.apiConfig?.enabled">
              <i class="fas fa-paper-plane"></i>
              {{ isLoading() ? 'Testando...' : 'Testar API' }}
            </button>
            
            <button 
              class="btn btn-outline-secondary"
              (click)="showIntegrationExamples.set(!showIntegrationExamples())">
              <i class="fas fa-code"></i>
              Exemplos de Integração
            </button>
          </div>
        </div>
      </div>


      <!-- Exemplos de Integração -->
      <div class="card mt-3" *ngIf="showIntegrationExamples">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6><i class="fas fa-code"></i> Exemplos de Integração</h6>
          <button 
            class="btn-close" 
            (click)="showIntegrationExamples.set(false)"></button>
        </div>
        <div class="card-body">
          <!-- Tabs de linguagens -->
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="selectedLanguage() === 'curl'"
                (click)="selectedLanguage.set('curl')">
                cURL
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="selectedLanguage() === 'javascript'"
                (click)="selectedLanguage.set('javascript')">
                JavaScript
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="selectedLanguage() === 'php'"
                (click)="selectedLanguage.set('php')">
                PHP
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link"
                [class.active]="selectedLanguage() === 'python'"
                (click)="selectedLanguage.set('python')">
                Python
              </button>
            </li>
          </ul>
          
          <!-- Conteúdo do tab -->
          <div class="tab-content mt-3">
            <pre class="bg-dark text-light p-3 rounded"><code>{{getSelectedExample()}}</code></pre>
            <div class="mt-2">
              <button 
                class="btn btn-sm btn-outline-primary"
                (click)="copyToClipboard(getSelectedExample())">
                <i class="fas fa-copy"></i> Copiar Código
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estatísticas da API -->
      <div class="card mt-3" *ngIf="apiStats()">
        <div class="card-header">
          <h6><i class="fas fa-chart-line"></i> Estatísticas da API (últimas 24h)</h6>
        </div>
        <div class="card-body">
          <div class="row text-center">
            <div class="col-md-3">
              <div class="border rounded p-3">
                <h4 class="text-primary mb-1">{{ apiStats()?.requests || 0 }}</h4>
                <small class="text-muted">Requisições</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="border rounded p-3">
                <h4 class="text-success mb-1">{{ apiStats()?.successful || 0 }}</h4>
                <small class="text-muted">Sucessos</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="border rounded p-3">
                <h4 class="text-danger mb-1">{{ apiStats()?.errors || 0 }}</h4>
                <small class="text-muted">Erros</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="border rounded p-3">
                <h4 class="text-info mb-1">{{ apiStats()?.leads || 0 }}</h4>
                <small class="text-muted">Leads Criados</small>
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

      <!-- Documentação -->
      <div class="card mt-3">
        <div class="card-header">
          <h6><i class="fas fa-book"></i> Documentação da API</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h6>Headers Obrigatórios:</h6>
              <ul class="small">
                <li><code>Content-Type: application/json</code></li>
                <li><code>Authorization: Bearer [seu-token]</code></li>
                <li><code>X-Company-Subdomain: {{ currentCompany()?.subdomain }}</code></li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6>Campos Opcionais:</h6>
              <ul class="small">
                <li><strong>companyId:</strong> Obrigatório na URL (ex: .../leadIntakeHttp/companies/{{ '{' }}companyId{{ '}' }})</li>
                <li><strong>boardId:</strong> Recomendado na URL (ex: .../boards/{{ '{' }}boardId{{ '}' }})</li>
                <li><strong>source:</strong> Origem do lead</li>
                <li><strong>utm_*:</strong> Parâmetros UTM</li>
                <li><strong>customFields:</strong> Campos personalizados</li>
              </ul>
              
              <div class="mt-3" *ngIf="subdomainService.isDevelopment()">
                <h6 class="small text-muted">Configuração de Desenvolvimento:</h6>
                <p class="small text-muted mb-1">Porta do Firebase Functions: <strong>{{ getCurrentFunctionsPort() }}</strong></p>
                <button 
                  class="btn btn-sm btn-outline-secondary" 
                  (click)="showPortConfig = !showPortConfig">
                  {{ showPortConfig ? 'Ocultar' : 'Configurar Porta' }}
                </button>
                
                <div class="mt-2" *ngIf="showPortConfig">
                  <div class="input-group input-group-sm">
                    <input 
                      type="number" 
                      class="form-control" 
                      [(ngModel)]="customPort"
                      placeholder="3001">
                    <button 
                      class="btn btn-outline-primary" 
                      type="button"
                      (click)="updateFunctionsPort()">
                      Atualizar
                    </button>
                  </div>
                  <small class="text-muted">Reinicie a página após alterar a porta</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-config-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .card-header h3 {
      margin: 0;
      color: #495057;
    }
    
    .input-group {
      position: relative;
    }
    
    .nav-tabs .nav-link {
      border: none;
      color: #6c757d;
    }
    
    .nav-tabs .nav-link.active {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }
    
    pre {
      font-size: 0.875rem;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .badge {
      font-size: 0.75rem;
    }
    
    .border {
      border: 1px solid #dee2e6 !important;
    }
    
    code {
      color: #e83e8c;
      font-size: 0.875rem;
    }
    
    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      opacity: 0.5;
    }
    
    .btn-close:hover {
      opacity: 0.75;
    }
  `]
})
export class ApiConfigComponent implements OnInit {
  private apiService = inject(ApiService);
  subdomainService = inject(SubdomainService);
  private companyService = inject(CompanyService);

  currentCompany = signal<Company | null>(null);
  isLoading = signal(false);
  showToken = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  showIntegrationExamples = signal(false);
  selectedLanguage = signal('curl');
  apiStats = signal<any>(null);
  integrationExamples = signal<{ [key: string]: string }>({});
  
  // Para configuração de porta em desenvolvimento
  showPortConfig = false;
  customPort: number = 3001;

  ngOnInit() {
    this.currentCompany.set(this.subdomainService.getCurrentCompany());
    this.loadApiStats();
    this.loadIntegrationExamples();
  }

  getLeadIntakeUrl(): string {
    try {
      const boardId = this.getCurrentBoardId();
      const companyId = this.currentCompany()?.id || '{COMPANY_ID}';
      const url = this.apiService.getLeadIntakeUrl(companyId, boardId);
      
      // DEBUG: Logs temporários
      console.log('=== DEBUG API ENDPOINT ===');
      console.log('BoardId detectado:', boardId);
      console.log('URL atual:', window.location.pathname);
      console.log('URL atual completa:', window.location.href);
      console.log('URL gerada:', url);
      console.log('URL completa deveria ser:', url + (boardId ? '' : '/' + boardId));
      console.log('Empresa atual:', this.currentCompany());
      console.log('isDevelopment:', this.subdomainService.isDevelopment());
      console.log('Porta no localStorage:', localStorage.getItem('firebase-functions-port'));
      
      return url;
    } catch (error) {
      return 'Erro: empresa não configurada';
    }
  }

  getCurrentBoardId(): string | undefined {
    // 1. Buscar o boardId da URL atual
    const url = window.location.pathname;
    console.log('DEBUG getCurrentBoardId - URL pathname:', url);
    
    // Padrão: /kanban/BOARD_ID ou /board/BOARD_ID
    const boardMatch = url.match(/\/(?:kanban|board)\/([^\/\?]+)/);
    console.log('DEBUG getCurrentBoardId - Regex match:', boardMatch);
    if (boardMatch) {
      console.log('DEBUG getCurrentBoardId - BoardId encontrado na URL:', boardMatch[1]);
      return boardMatch[1];
    }
    
    // 2. Buscar nos parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const boardIdParam = urlParams.get('boardId');
    console.log('DEBUG getCurrentBoardId - BoardId nos parâmetros:', boardIdParam);
    if (boardIdParam) {
      return boardIdParam;
    }
    
    // 3. Buscar no localStorage (último quadro acessado)
    const lastBoardId = localStorage.getItem('lastBoardId');
    console.log('DEBUG getCurrentBoardId - BoardId no localStorage:', lastBoardId);
    if (lastBoardId) {
      return lastBoardId;
    }
    
    // 4. Se não encontrar, retornar undefined (usará configuração padrão)
    return undefined;
  }

  async toggleApiStatus() {
    const company = this.currentCompany();
    if (!company) return;

    this.isLoading.set(true);
    this.clearMessages();

    try {
      const newStatus = !company.apiConfig.enabled;
      
      await this.companyService.updateCompany(company.id!, {
        apiConfig: {
          ...company.apiConfig,
          enabled: newStatus
        }
      });

      company.apiConfig.enabled = newStatus;
      this.currentCompany.set(company);
      this.subdomainService.setCurrentCompany(company);
      
      this.showSuccess(`API ${newStatus ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao alterar status da API:', error);
      this.showError('Erro ao alterar status da API.');
    } finally {
      this.isLoading.set(false);
    }
  }

  regenerateToken() {
    this.isLoading.set(true);
    this.clearMessages();

    this.apiService.regenerateApiToken().subscribe({
      next: (response) => {
        const company = this.currentCompany();
        if (company) {
          company.apiConfig.token = response.token;
          this.currentCompany.set(company);
        }
        this.showSuccess('Token regenerado com sucesso! Certifique-se de atualizar suas integrações.');
        this.loadIntegrationExamples(); // Recarregar exemplos com novo token
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao regenerar token:', error);
        this.showError('Erro ao regenerar token da API.');
        this.isLoading.set(false);
      }
    });
  }

  testApi() {
    this.isLoading.set(true);
    this.clearMessages();

    // Usar o boardId atual se disponível
    const boardId = this.getCurrentBoardId();
    
    this.apiService.testApiEndpoint(boardId).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess(`API testada com sucesso! Lead de teste criado${boardId ? ` no quadro ${boardId}` : ''}.`);
        } else {
          this.showError('Falha no teste da API: ' + (response.error || 'Erro desconhecido'));
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao testar API:', error);
        this.showError('Erro ao testar API: ' + (error.message || 'Erro desconhecido'));
        this.isLoading.set(false);
      }
    });
  }

  toggleTokenVisibility(input: HTMLInputElement) {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    this.showToken.set(isPassword);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('Copiado para área de transferência!');
    }).catch(() => {
      this.showError('Erro ao copiar para área de transferência.');
    });
  }

  getSelectedExample(): string {
    const examples = this.integrationExamples();
    return examples[this.selectedLanguage()] || 'Exemplo não disponível';
  }

  private loadApiStats() {
    this.apiService.getApiStats('24h').subscribe({
      next: (stats) => {
        this.apiStats.set(stats);
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas da API:', error);
      }
    });
  }

  private loadIntegrationExamples() {
    try {
      // Obter o boardId atual (se disponível) e campos de formulário
      const boardId = this.getCurrentBoardId();
      
      // TODO: Buscar campos do formulário se estivermos no contexto de um quadro
      // Por enquanto, usar campos padrão como exemplo
      const exampleFormFields = [
        { name: 'customField', type: 'text', includeInApi: true },
        { name: 'temperature', type: 'temperatura', includeInApi: true }
      ];
      
      const examples = this.apiService.getIntegrationExamples(boardId, exampleFormFields);
      this.integrationExamples.set(examples);
    } catch (error) {
      console.error('Erro ao carregar exemplos de integração:', error);
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

  // Métodos para gerenciar porta do Firebase Functions
  getCurrentFunctionsPort(): number {
    const storedPort = localStorage.getItem('firebase-functions-port');
    return storedPort ? parseInt(storedPort, 10) : 3001;
  }

  updateFunctionsPort() {
    if (this.customPort && this.customPort > 0 && this.customPort <= 65535) {
      this.apiService.setCustomFunctionsPort(this.customPort);
      this.showSuccess(`Porta atualizada para ${this.customPort}. Recarregue a página para aplicar.`);
      this.loadIntegrationExamples(); // Recarregar exemplos com nova porta
    } else {
      this.showError('Por favor, insira uma porta válida (1-65535).');
    }
  }
}