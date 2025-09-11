import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CompanyService } from './company.service';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class SubdomainService {
  private companyService = inject(CompanyService);
  
  private currentCompanySubject = new BehaviorSubject<Company | null>(null);
  public currentCompany$ = this.currentCompanySubject.asObservable();
  
  private isInitializedSubject = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this.isInitializedSubject.asObservable();

  async initializeFromSubdomain(): Promise<Company | null> {
    try {
      const subdomain = this.extractSubdomain();
      console.log('🌐 Subdomínio extraído:', subdomain, 'from hostname:', window?.location?.hostname);
      
      if (!subdomain) {
        console.log('❌ Nenhum subdomínio encontrado');
        this.isInitializedSubject.next(true);
        return null;
      }

      console.log('🔄 Iniciando busca por empresa com subdomínio:', subdomain);
      let company = await this.companyService.getCompanyBySubdomain(subdomain);
      
      
      if (company) {
        console.log('✅ Empresa encontrada, definindo no contexto:', company.name);
        this.currentCompanySubject.next(company);
      } else {
        console.log('❌ Empresa não encontrada, chamando handleInvalidSubdomain');
        this.handleInvalidSubdomain(subdomain);
      }
      
      this.isInitializedSubject.next(true);
      return company;
    } catch (error) {
      console.error('❌ Erro em initializeFromSubdomain:', error);
      this.isInitializedSubject.next(true);
      return null;
    }
  }

  private extractSubdomain(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const hostname = window.location.hostname;

    // Para desenvolvimento local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Verificar localStorage para subdomínio de desenvolvimento
      const devSubdomain = localStorage.getItem('dev-subdomain');
      if (devSubdomain) {
        return devSubdomain;
      }
      
      // Tentar extrair da URL ou parâmetro de query
      const urlParams = new URLSearchParams(window.location.search);
      const subdomainParam = urlParams.get('subdomain');
      if (subdomainParam) {
        localStorage.setItem('dev-subdomain', subdomainParam);
        return subdomainParam;
      }
      
      // Sem subdomínio padrão - deve ser configurado pelo usuário
      return null;
    }

    // Para produção: extrair de subdomain.taskboard.com.br
    if (hostname.includes('taskboard.com.br')) {
      const parts = hostname.split('.');
      if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'taskboard') {
        const subdomain = parts[0];
        return subdomain;
      }
    }
    
    // Para domínio principal taskboard.com.br (sem subdomínio)
    if (hostname === 'taskboard.com.br' || hostname === 'www.taskboard.com.br') {
      return null; // Não há empresa, deve mostrar tela de login/registro
    }

    // Outros casos (staging, etc.)
    if (hostname.includes('.')) {
      const parts = hostname.split('.');
      if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'taskboard') {
        const subdomain = parts[0];
        return subdomain;
      }
    }

    return null;
  }

  private handleInvalidSubdomain(subdomain: string) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isDev = this.isDevelopment();
      console.log('🚨 handleInvalidSubdomain chamado:', { 
        subdomain, 
        hostname, 
        isDevelopment: isDev 
      });
      
      if (isDev) {
        console.log('🔧 Ambiente de desenvolvimento - não exibindo alert');
        return;
      }
      
      if (hostname.includes(`${subdomain}.taskboard.com.br`)) {
        console.log('⚠️ Exibindo alert para empresa não encontrada');
        alert(`Empresa '${subdomain}' não encontrada. Entre em contato com o suporte.`);
        return;
      }
      
      console.log('🔄 Redirecionando para página de empresa não encontrada');
      window.location.href = 'https://taskboard.com.br/empresa-nao-encontrada?subdomain=' + encodeURIComponent(subdomain);
    }
  }

  getCurrentCompany(): Company | null {
    return this.currentCompanySubject.value;
  }

  setCurrentCompany(company: Company | null) {
    this.currentCompanySubject.next(company);
    if (typeof window !== 'undefined') {
      try {
        if (company) {
          localStorage.setItem('current-company', JSON.stringify({ id: company.id, subdomain: company.subdomain, name: company.name }));
        } else {
          localStorage.removeItem('current-company');
        }
      } catch {}
    }
  }

  clearCurrentCompany() {
    this.currentCompanySubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current-company');
    }
  }

  // Recuperar empresa persistida (fallback ao iniciar)
  restorePersistedCompany(): Company | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('current-company');
      if (!raw) return null;
      const basic = JSON.parse(raw);
      if (basic?.id && basic?.subdomain) {
        const company: Company = { id: basic.id, subdomain: basic.subdomain, name: basic.name } as any;
        this.currentCompanySubject.next(company);
        // Carregar versão completa em background para restaurar branding/SMTP/etc.
        this.companyService.getCompany(basic.id).then(full => {
          if (full) {
            this.currentCompanySubject.next(full);
          }
        }).catch(() => {});
        return company;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Método para desenvolvimento - definir subdomínio manualmente
  setDevSubdomain(subdomain: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dev-subdomain', subdomain);
      // Recarregar a página para aplicar o novo subdomínio
      window.location.reload();
    }
  }

  // Limpar subdomínio de desenvolvimento
  clearDevSubdomain() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dev-subdomain');
      window.location.reload();
    }
  }

  // Verificar se estamos em ambiente de desenvolvimento
  isDevelopment(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1';
  }

  // Obter URL base atual (com porta dinâmica)
  getBaseUrl(): string {
    if (typeof window === 'undefined') {
      return 'http://localhost:4200';
    }
    
    const { protocol, hostname, port } = window.location;
    const portSuffix = port ? `:${port}` : '';
    return `${protocol}//${hostname}${portSuffix}`;
  }

  // Gerar URL para uma empresa específica
  getCompanyUrl(subdomain: string): string {
    if (this.isDevelopment()) {
      return `${this.getBaseUrl()}?subdomain=${subdomain}`;
    }
    
    // Usar subdomínios reais com HTTPS
    return `https://${subdomain}.taskboard.com.br`;
  }

  // Gerar URL da API para a empresa atual
  getApiUrl(): string | null {
    const company = this.getCurrentCompany();
    if (!company) {
      return null;
    }

    if (this.isDevelopment()) {
      // Usar porta padrão 5001 do Firebase Functions
      const functionsPort = this.getFunctionsPort();
      return `http://localhost:${functionsPort}/api/v1/companies/${company.id}`;
    }
    
    return `https://api.taskboard.com.br/v1/companies/${company.id}`;
  }

  // Método para obter porta do Firebase Functions
  private getFunctionsPort(): number {
    // 1. Verificar localStorage (configuração salva pelo usuário)
    const storedPort = localStorage.getItem('firebase-functions-port');
    if (storedPort) {
      return parseInt(storedPort, 10);
    }
    
    // 2. Tentar detectar pela configuração do Firebase (se disponível)
    try {
      const firebaseConfig = (window as any).__FIREBASE_DEFAULTS__;
      if (firebaseConfig?.emulatorHosts?.functions) {
        const functionsHost = firebaseConfig.emulatorHosts.functions;
        const portMatch = functionsHost.match(/:(\d+)$/);
        if (portMatch) {
          return parseInt(portMatch[1], 10);
        }
      }
    } catch (error) {
      // Ignorar erro se não conseguir detectar
    }
    
    // 3. Usar porta padrão (3001 é onde o server.js está rodando)  
    return 3001;
  }

  // Gerar URL do formulário público para a empresa atual
  getPublicFormUrl(): string | null {
    const company = this.getCurrentCompany();
    if (!company) {
      return null;
    }

    if (this.isDevelopment()) {
      return `${this.getBaseUrl()}/form/${company.subdomain}`;
    }
    
    return `https://${company.subdomain}.taskboard.com.br/form`;
  }

  // Método removido - sem automação de criação de empresas
  private async createDevelopmentCompany(subdomain: string) {
    // Automação removida conforme solicitado
  }
}