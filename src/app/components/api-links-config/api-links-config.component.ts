import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { SubdomainService } from '../../services/subdomain.service';
import { ApiService } from '../../services/api.service';
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
                  <p class="text-xs text-gray-500 mt-1" *ngIf="getCurrentBoardId()">URL para envio de leads neste quadro ({{ getCurrentBoardId() }})</p>
                  <p class="text-xs text-gray-500 mt-1" *ngIf="!getCurrentBoardId()">URL base para envio de leads. Adicione /{{ '{' }}boardId{{ '}' }} ao final para especificar o quadro</p>
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

          </div>
        </div>

        <!-- Documentação e Exemplos -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-book text-purple-500 mr-2"></i>
              Documentação da API
            </h3>
            <p class="text-sm text-gray-600 mt-1">Como enviar leads para o sistema via API</p>
          </div>

          <div class="p-6 space-y-6">
            <!-- Campos disponíveis -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 mb-3">Campos disponíveis</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="px-4 py-2 text-left font-medium text-gray-600">Campo</th>
                      <th class="px-4 py-2 text-left font-medium text-gray-600">Obrigatório</th>
                      <th class="px-4 py-2 text-left font-medium text-gray-600">Descrição</th>
                      <th class="px-4 py-2 text-left font-medium text-gray-600">Sinônimos aceitos</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr>
                      <td class="px-4 py-2 font-mono text-xs text-blue-700">contactName</td>
                      <td class="px-4 py-2"><span class="text-orange-600 font-medium">Recomendado</span></td>
                      <td class="px-4 py-2 text-gray-600">Nome do contato</td>
                      <td class="px-4 py-2 text-gray-400 text-xs">name, nome, nomeLead</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-mono text-xs text-blue-700">contactEmail</td>
                      <td class="px-4 py-2"><span class="text-orange-600 font-medium">Recomendado</span></td>
                      <td class="px-4 py-2 text-gray-600">E-mail do contato</td>
                      <td class="px-4 py-2 text-gray-400 text-xs">email, emailLead</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-mono text-xs text-blue-700">contactPhone</td>
                      <td class="px-4 py-2"><span class="text-gray-400">Opcional</span></td>
                      <td class="px-4 py-2 text-gray-600">Telefone do contato</td>
                      <td class="px-4 py-2 text-gray-400 text-xs">phone, telefone, celular</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-mono text-xs text-blue-700">companyName</td>
                      <td class="px-4 py-2"><span class="text-gray-400">Opcional</span></td>
                      <td class="px-4 py-2 text-gray-600">Nome da empresa</td>
                      <td class="px-4 py-2 text-gray-400 text-xs">empresa, company, nomeEmpresa</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-mono text-xs text-blue-700">cnpj</td>
                      <td class="px-4 py-2"><span class="text-gray-400">Opcional</span></td>
                      <td class="px-4 py-2 text-gray-600">CNPJ da empresa</td>
                      <td class="px-4 py-2 text-gray-400 text-xs">cnpjCompany</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-mono text-xs text-blue-700">origem</td>
                      <td class="px-4 py-2"><span class="text-gray-400">Opcional</span></td>
                      <td class="px-4 py-2 text-gray-600">Origem do lead</td>
                      <td class="px-4 py-2 text-gray-400 text-xs">origin, source, fonte, canal</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-mono text-xs text-blue-700">assunto</td>
                      <td class="px-4 py-2"><span class="text-gray-400">Opcional</span></td>
                      <td class="px-4 py-2 text-gray-600">Assunto do contato</td>
                      <td class="px-4 py-2 text-gray-400 text-xs">subject, titulo, title</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-mono text-xs text-blue-700">mensagem</td>
                      <td class="px-4 py-2"><span class="text-gray-400">Opcional</span></td>
                      <td class="px-4 py-2 text-gray-600">Mensagem do contato</td>
                      <td class="px-4 py-2 text-gray-400 text-xs">message, corpo, body, descricao</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-mono text-xs text-blue-700">temperature</td>
                      <td class="px-4 py-2"><span class="text-gray-400">Opcional</span></td>
                      <td class="px-4 py-2 text-gray-600">Temperatura / qualificação</td>
                      <td class="px-4 py-2 text-gray-400 text-xs">temperatura, qualificacao</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Exemplo cURL -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 mb-2 flex items-center justify-between">
                <span><i class="fas fa-terminal text-gray-500 mr-1"></i> Exemplo cURL</span>
                <button class="text-xs text-blue-600 hover:text-blue-800" (click)="copyToClipboard(getCurlExample())">
                  <i class="fas fa-copy mr-1"></i> Copiar
                </button>
              </h4>
              <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">{{ getCurlExample() }}</pre>
            </div>

            <!-- Exemplo JavaScript -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 mb-2 flex items-center justify-between">
                <span><i class="fab fa-js text-yellow-500 mr-1"></i> Exemplo JavaScript</span>
                <button class="text-xs text-blue-600 hover:text-blue-800" (click)="copyToClipboard(getJsExample())">
                  <i class="fas fa-copy mr-1"></i> Copiar
                </button>
              </h4>
              <pre class="bg-gray-900 text-blue-300 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">{{ getJsExample() }}</pre>
            </div>

            <!-- Exemplo PHP -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 mb-2 flex items-center justify-between">
                <span><i class="fab fa-php text-indigo-400 mr-1"></i> Exemplo PHP</span>
                <button class="text-xs text-blue-600 hover:text-blue-800" (click)="copyToClipboard(getPhpExample())">
                  <i class="fas fa-copy mr-1"></i> Copiar
                </button>
              </h4>
              <pre class="bg-gray-900 text-purple-300 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">{{ getPhpExample() }}</pre>
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
  private apiService = inject(ApiService);

  currentCompany = signal<Company | null>(null);
  apiEnabled = signal(false);
  apiToken = signal<string>('');
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
          endpoint: this.getLeadIntakeUrl()
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
    try {
      const boardId = this.getCurrentBoardId();
      // Usar ApiService que já tem toda a lógica de detecção de porta
      const companyId = this.currentCompany()?.id || '{COMPANY_ID}';
      return this.apiService.getLeadIntakeUrl(companyId, boardId);
    } catch (error) {
      return 'Erro: empresa não configurada';
    }
  }

  getCurrentBoardId(): string | undefined {
    // 1. Buscar o boardId da URL atual
    const url = window.location.pathname;
    
    // Padrão: /kanban/BOARD_ID ou /board/BOARD_ID
    const boardMatch = url.match(/\/(?:kanban|board)\/([^\/\?]+)/);
    if (boardMatch) {
      return boardMatch[1];
    }
    
    // 2. Buscar nos parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const boardIdParam = urlParams.get('boardId');
    if (boardIdParam) {
      return boardIdParam;
    }
    
    // 3. Buscar no localStorage (último quadro acessado)
    const lastBoardId = localStorage.getItem('lastBoardId');
    if (lastBoardId) {
      return lastBoardId;
    }
    
    // 4. Se não encontrar, retornar undefined (usará configuração padrão)
    return undefined;
  }

  companyLinks = signal<CompanyLink[]>([]);

  generateCompanyLinks() {
    // Links section removed - external form link should now be in leads section
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

  getCurlExample(): string {
    const url = this.getLeadIntakeUrl();
    const token = this.apiToken();
    return `curl -X POST "${url}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d '{
    "leadData": {
      "fields": {
        "contactName": "João Silva",
        "contactEmail": "joao@email.com",
        "contactPhone": "(11) 99999-0000",
        "companyName": "Empresa Exemplo",
        "origem": "Contato pelo Site",
        "assunto": "Interesse no produto X",
        "mensagem": "Gostaria de mais informações sobre..."
      }
    }
  }'`;
  }

  getJsExample(): string {
    const url = this.getLeadIntakeUrl();
    const token = this.apiToken();
    return `const response = await fetch("${url}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${token}"
  },
  body: JSON.stringify({
    leadData: {
      fields: {
        contactName: document.getElementById("nome").value,
        contactEmail: document.getElementById("email").value,
        contactPhone: document.getElementById("telefone").value,
        origem: "Contato pelo Site",
        assunto: document.getElementById("assunto").value,
        mensagem: document.getElementById("mensagem").value
      }
    }
  })
});

const data = await response.json();
console.log("Lead criado:", data.leadId);`;
  }

  getPhpExample(): string {
    const url = this.getLeadIntakeUrl();
    const token = this.apiToken();
    return `<?php
$url = "${url}";
$data = [
  "leadData" => [
    "fields" => [
      "contactName" => $_POST["nome"],
      "contactEmail" => $_POST["email"],
      "contactPhone" => $_POST["telefone"],
      "origem" => "Contato pelo Site",
      "assunto" => $_POST["assunto"],
      "mensagem" => $_POST["mensagem"]
    ]
  ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "Content-Type: application/json",
  "Authorization: Bearer ${token}"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
echo "Lead criado: " . $result["leadId"];`;
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