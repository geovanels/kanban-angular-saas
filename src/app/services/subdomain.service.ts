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
    
    // Para taskboard.com.br (domínio principal de login)
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
      // Redirecionar para o domínio principal
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

  // Gerar URL para uma empresa específica
  getCompanyUrl(subdomain: string): string {
    if (this.isDevelopment()) {
      const port = typeof window !== 'undefined' ? window.location.port : '4200';
      return `http://localhost:${port}?subdomain=${subdomain}`;
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
      return `http://localhost:4200/form/${company.subdomain}`;
    }
    
    return `https://${company.subdomain}.taskboard.com.br/form`;
  }
}