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
      
      if (!subdomain) {
        this.isInitializedSubject.next(true);
        return null;
      }

      let company = await this.companyService.getCompanyBySubdomain(subdomain);
      
      // Se não encontrou a empresa e é subdomain "gobuyer", criar automaticamente
      if (!company && subdomain === 'gobuyer') {
        try {
          await this.companyService.seedGobuyerCompany();
          company = await this.companyService.getCompanyBySubdomain(subdomain);
        } catch (error) {
          // Handle error silently or show user-friendly error
        }
      }
      
      if (company) {
        this.currentCompanySubject.next(company);
      } else {
        this.handleInvalidSubdomain(subdomain);
      }
      
      this.isInitializedSubject.next(true);
      return company;
    } catch (error) {
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
      
      // Definir subdomínio padrão para desenvolvimento
      localStorage.setItem('dev-subdomain', 'gobuyer');
      return 'gobuyer';
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
    // Implementar lógica para lidar com subdomínio inválido
    
    if (typeof window !== 'undefined') {
      // Em desenvolvimento, não redirecionar - apenas logar
      if (this.isDevelopment()) {
        console.warn(`Empresa '${subdomain}' não encontrada em desenvolvimento. Criando automaticamente...`);
        // Tentar criar empresa automaticamente em desenvolvimento
        this.createDevelopmentCompany(subdomain);
        return;
      }
      
      const hostname = window.location.hostname;
      
      // Se já estamos no subdomínio correto mas a empresa não foi encontrada no Firebase
      if (hostname.includes(`${subdomain}.taskboard.com.br`)) {
        console.error(`Empresa '${subdomain}' não encontrada no Firebase.`);
        
        // Se for a empresa 'gobuyer', tentar criar automaticamente
        if (subdomain === 'gobuyer') {
          console.log('Tentando criar empresa Gobuyer automaticamente...');
          this.companyService.seedGobuyerCompany().then(async () => {
            // Tentar buscar novamente após criar
            const company = await this.companyService.getCompanyBySubdomain('gobuyer');
            if (company) {
              this.currentCompanySubject.next(company);
              window.location.reload();
            }
          }).catch(error => {
            console.error('Erro ao criar empresa Gobuyer:', error);
            alert(`Empresa 'gobuyer' não pôde ser criada. Entre em contato com o suporte.`);
          });
          return;
        }
        
        // Para outras empresas, mostrar erro
        alert(`Empresa '${subdomain}' não encontrada. Entre em contato com o suporte.`);
        return;
      }
      
      // Apenas em produção e se não estivermos no subdomínio correto, redirecionar
      window.location.href = 'https://taskboard.com.br/empresa-nao-encontrada?subdomain=' + encodeURIComponent(subdomain);
    }
  }

  getCurrentCompany(): Company | null {
    return this.currentCompanySubject.value;
  }

  setCurrentCompany(company: Company) {
    this.currentCompanySubject.next(company);
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
  private getBaseUrl(): string {
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
      return `http://localhost:5000/api/v1/companies/${company.id}`;
    }
    
    return `https://api.taskboard.com.br/v1/companies/${company.id}`;
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

  // Criar empresa automaticamente em desenvolvimento
  private async createDevelopmentCompany(subdomain: string) {
    try {
      console.log(`Criando empresa de desenvolvimento: ${subdomain}`);
      
      const companyData = {
        subdomain: subdomain,
        name: `Empresa ${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)}`,
        contactEmail: `contato@${subdomain}.dev`,
        contactPhone: '+55 11 99999-9999',
        address: 'Desenvolvimento Local',
        cnpj: '00.000.000/0001-00',
        plan: 'professional' as const,
        status: 'active' as const,
        ownerId: 'dev-user',
        ownerEmail: `admin@${subdomain}.dev`,
        maxUsers: 50,
        maxBoards: 100,
        smtpConfig: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          user: '',
          password: '',
          fromName: `Empresa ${subdomain.charAt(0).toUpperCase() + subdomain.slice(1)}`,
          fromEmail: `contato@${subdomain}.dev`
        },
        apiConfig: {
          enabled: true,
          token: '',
          endpoint: `${this.getBaseUrl()}/api/v1/lead-intake`,
          webhookUrl: ''
        },
        features: {
          maxBoards: 10,
          maxUsers: 20,
          maxLeadsPerMonth: 5000,
          maxEmailsPerMonth: 2500,
          customBranding: true,
          apiAccess: true,
          webhooks: true,
          advancedReports: true,
          whiteLabel: false
        }
      };

      const companyId = await this.companyService.createCompany(companyData);
      const company = await this.companyService.getCompany(companyId);
      
      if (company) {
        this.currentCompanySubject.next(company);
        console.log(`Empresa ${subdomain} criada com sucesso:`, companyId);
      }
      
    } catch (error) {
      console.error('Erro ao criar empresa de desenvolvimento:', error);
    }
  }
}