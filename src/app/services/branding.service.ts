import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubdomainService } from './subdomain.service';
import { CompanyService } from './company.service';
import { Company } from '../models/company.model';

export interface BrandingConfig {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  customCss?: string;
}

export interface LogoUploadResponse {
  success: boolean;
  logoUrl?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  private http = inject(HttpClient);
  private subdomainService = inject(SubdomainService);
  private companyService = inject(CompanyService);

  // Observable para mudanças de branding
  private brandingSubject = new BehaviorSubject<BrandingConfig>({});
  public branding$ = this.brandingSubject.asObservable();

  constructor() {
    // Inicializar com branding da empresa atual
    this.initializeBranding();

    // Reagir a mudanças de empresa (ex.: após F5 quando SubdomainService carrega versão completa)
    try {
      this.subdomainService.currentCompany$.subscribe((company) => {
        if (company) {
          this.applyCompanyBranding(company);
        }
      });
    } catch {}

    // Aplicar branding após inicialização
    setTimeout(() => {
      this.applyStoredBranding();
    }, 100);
  }

  // Inicializar branding da empresa
  private initializeBranding() {
    const company = this.subdomainService.getCurrentCompany();
    if (company) {
      this.updateBranding({
        logoUrl: company.logoUrl,
        primaryColor: company.brandingConfig?.primaryColor || company.primaryColor,
        secondaryColor: company.brandingConfig?.secondaryColor || company.secondaryColor
      });
    }
  }

  // Aplicar branding armazenado
  private applyStoredBranding() {
    const company = this.subdomainService.getCurrentCompany();
    if (company && company.brandingConfig) {
      // Aplicar cores se existirem
      if (company.brandingConfig.primaryColor) {
        this.applyColors({
          primaryColor: company.brandingConfig.primaryColor,
          secondaryColor: company.brandingConfig.secondaryColor
        });
      }
    }
  }

  // Upload de logo
  uploadLogo(file: File): Observable<LogoUploadResponse> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    // Validar arquivo
    const validationError = this.validateImageFile(file);
    if (validationError) {
      return throwError(() => new Error(validationError));
    }

    const formData = new FormData();
    formData.append('logo', file);
    formData.append('companyId', company.id!);

    const uploadUrl = `${this.subdomainService.getApiUrl()}/upload/logo`;

    return this.http.post<LogoUploadResponse>(uploadUrl, formData).pipe(
      map(response => {
        if (response.success && response.logoUrl) {
          // Atualizar empresa com nova URL do logo
          this.updateCompanyLogo(response.logoUrl);
        }
        return response;
      }),
      catchError(error => {
        console.error('Erro ao fazer upload do logo:', error);
        return throwError(() => ({
          success: false,
          error: error.error?.message || 'Erro ao fazer upload do logo'
        }));
      })
    );
  }

  // Upload de favicon
  uploadFavicon(file: File): Observable<LogoUploadResponse> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      return throwError(() => new Error('Empresa não encontrada'));
    }

    // Validar favicon (deve ser ICO ou PNG pequeno)
    const validationError = this.validateFaviconFile(file);
    if (validationError) {
      return throwError(() => new Error(validationError));
    }

    const formData = new FormData();
    formData.append('favicon', file);
    formData.append('companyId', company.id!);

    const uploadUrl = `${this.subdomainService.getApiUrl()}/upload/favicon`;

    return this.http.post<LogoUploadResponse>(uploadUrl, formData).pipe(
      map(response => {
        if (response.success && response.logoUrl) {
          // Aplicar favicon dinamicamente
          this.applyFavicon(response.logoUrl);
        }
        return response;
      }),
      catchError(error => {
        console.error('Erro ao fazer upload do favicon:', error);
        return throwError(() => error);
      })
    );
  }

  // Atualizar cores da empresa
  async updateColors(colors: { primaryColor?: string; secondaryColor?: string; accentColor?: string }): Promise<void> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    try {
      // Atualizar no banco de dados
      await this.companyService.updateCompany(company.id!, colors);

      // Atualizar localmente
      Object.assign(company, colors);
      this.subdomainService.setCurrentCompany(company);

      // Aplicar cores na interface
      this.applyColors(colors);

      // Notificar observadores
      this.updateBranding(colors);
    } catch (error) {
      console.error('Erro ao atualizar cores:', error);
      throw error;
    }
  }

  // Aplicar CSS customizado
  applyCustomCss(css: string): void {
    this.removeCustomCss();
    
    if (css.trim()) {
      const style = document.createElement('style');
      style.id = 'company-custom-css';
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  // Remover CSS customizado
  removeCustomCss(): void {
    const existingStyle = document.getElementById('company-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }
  }

  // Aplicar branding completo da empresa
  applyCompanyBranding(company: Company): void {
    console.log('🎨 Aplicando branding para empresa:', company.name);
    console.log('🎨 Cores da empresa:', {
      primaryColor: company.primaryColor,
      secondaryColor: company.secondaryColor,
      brandingConfig: company.brandingConfig
    });

    const primaryColor = company.brandingConfig?.primaryColor || company.primaryColor;
    const secondaryColor = company.brandingConfig?.secondaryColor || company.secondaryColor;

    const branding: BrandingConfig = {
      logoUrl: company.logoUrl,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor
    };

    this.updateBranding(branding);

    // Aplicar cores
    if (primaryColor || secondaryColor) {
      console.log('🎨 Aplicando cores:', { primaryColor, secondaryColor });
      this.applyColors({
        primaryColor: primaryColor,
        secondaryColor: secondaryColor
      });
    } else {
      console.log('⚠️ Nenhuma cor encontrada para aplicar');
    }

    // Atualizar título da página
    this.updatePageTitle(company.name);
  }

  // Gerar palette de cores baseada na cor primária
  generateColorPalette(primaryColor: string): { [key: string]: string } {
    // Converter hex para RGB
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Gerar variações
    return {
      primary: primaryColor,
      primaryLight: this.lightenColor(primaryColor, 20),
      primaryDark: this.darkenColor(primaryColor, 20),
      secondary: this.adjustHue(primaryColor, 30),
      accent: this.adjustHue(primaryColor, -30),
      success: '#28a745',
      warning: '#ffc107',
      danger: '#dc3545',
      info: '#17a2b8'
    };
  }

  // Validar arquivo de imagem
  private validateImageFile(file: File): string | null {
    // Tamanho máximo: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Tamanho máximo: 5MB';
    }

    // Tipos aceitos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não suportado. Use JPEG, PNG ou SVG';
    }

    return null;
  }

  // Validar arquivo de favicon
  private validateFaviconFile(file: File): string | null {
    // Tamanho máximo: 1MB
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Tamanho máximo: 1MB';
    }

    // Tipos aceitos para favicon
    const allowedTypes = ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não suportado. Use ICO ou PNG';
    }

    return null;
  }

  // Atualizar logo da empresa
  private async updateCompanyLogo(logoUrl: string): Promise<void> {
    const company = this.subdomainService.getCurrentCompany();
    
    if (company) {
      company.logoUrl = logoUrl;
      this.subdomainService.setCurrentCompany(company);
      
      // Salvar no banco de dados
      await this.companyService.updateCompany(company.id!, { logoUrl });
      
      // Notificar observadores
      this.updateBranding({ logoUrl });
    }
  }

  // Aplicar cores na interface
  private applyColors(colors: { primaryColor?: string; secondaryColor?: string; accentColor?: string }): void {
    const root = document.documentElement;

    if (colors.primaryColor) {
      const palette = this.generateColorPalette(colors.primaryColor);
      
      // Aplicar variáveis CSS
      Object.entries(palette).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });

      // Bootstrap override
      root.style.setProperty('--bs-primary', colors.primaryColor);
      
      // Tailwind/CSS variables overrides
      root.style.setProperty('--primary-color', colors.primaryColor);
      root.style.setProperty('--tw-ring-color', colors.primaryColor + '66');
    }

    if (colors.secondaryColor) {
      root.style.setProperty('--color-secondary', colors.secondaryColor);
      root.style.setProperty('--bs-secondary', colors.secondaryColor);
      root.style.setProperty('--secondary-color', colors.secondaryColor);
    }

    if (colors.accentColor) {
      root.style.setProperty('--color-accent', colors.accentColor);
    }

    // Apply dynamic styles for all button variations
    this.applyDynamicStyles(colors);
  }

  // Apply dynamic styles that override hardcoded colors
  private applyDynamicStyles(colors: { primaryColor?: string; secondaryColor?: string; accentColor?: string }): void {
    console.log('🎨 Aplicando estilos dinâmicos:', colors);
    
    if (!colors.primaryColor) {
      console.log('⚠️ Nenhuma cor primária fornecida');
      return;
    }

    // Remove existing dynamic styles
    const existingStyle = document.getElementById('dynamic-branding-styles');
    if (existingStyle) {
      existingStyle.remove();
      console.log('🗑️ Removeu estilos dinâmicos anteriores');
    }

    // Create new dynamic styles
    const style = document.createElement('style');
    style.id = 'dynamic-branding-styles';
    style.textContent = `
      /* Primary buttons - Override all blue/green variations with very specific selectors */
      .bg-blue-500, .bg-green-500,
      button.bg-blue-500, button.bg-green-500,
      .bg-blue-500.hover\\:bg-blue-600, .bg-green-500.hover\\:bg-green-600,
      [class*="bg-blue-500"], [class*="bg-green-500"],
      button[class*="bg-blue-500"], button[class*="bg-green-500"],
      .text-white.px-4.py-2.rounded-lg,
      .text-white.px-6.py-2.rounded-lg,
      .text-white.px-4.py-2.rounded-md {
        background-color: ${colors.primaryColor} !important;
      }
      
      .hover\\:bg-blue-600:hover, .hover\\:bg-green-600:hover,
      button.bg-blue-500:hover, button.bg-green-500:hover,
      button.hover\\:bg-blue-600:hover, button.hover\\:bg-green-600:hover,
      [class*="hover:bg-blue-600"]:hover, [class*="hover:bg-green-600"]:hover,
      button[class*="bg-blue-500"]:hover, button[class*="bg-green-500"]:hover,
      .text-white.px-4.py-2.rounded-lg:hover,
      .text-white.px-6.py-2.rounded-lg:hover,
      .text-white.px-4.py-2.rounded-md:hover {
        background-color: ${this.darkenColor(colors.primaryColor, 10)} !important;
      }
      
      /* Very specific selectors for common button patterns */
      .px-4.py-2.bg-blue-500,
      .px-6.py-2.bg-blue-500,
      .px-6.py-3.bg-blue-500,
      .px-4.py-2.bg-green-500,
      button.px-4.py-2.bg-blue-500,
      button.px-6.py-2.bg-blue-500,
      button.px-6.py-3.bg-blue-500 {
        background-color: ${colors.primaryColor} !important;
      }
      
      .px-4.py-2.bg-blue-500:hover,
      .px-6.py-2.bg-blue-500:hover,
      .px-6.py-3.bg-blue-500:hover,
      button.px-4.py-2.bg-blue-500:hover,
      button.px-6.py-2.bg-blue-500:hover,
      button.px-6.py-3.bg-blue-500:hover {
        background-color: ${this.darkenColor(colors.primaryColor, 10)} !important;
      }
      
      /* All buttons with white text and blue/green backgrounds */
      button[style*="background-color"],
      .bg-blue-500,
      .bg-green-500 {
        background-color: ${colors.primaryColor} !important;
      }
      
      /* Focus states */
      .focus\\:ring-blue-500:focus {
        --tw-ring-color: ${colors.primaryColor}66 !important;
      }
      
      .focus\\:border-blue-500:focus {
        border-color: ${colors.primaryColor} !important;
      }
      
      /* Text colors */
      .text-blue-500 {
        color: ${colors.primaryColor} !important;
      }
      
      .hover\\:text-blue-600:hover, .hover\\:text-blue-800:hover {
        color: ${this.darkenColor(colors.primaryColor, 15)} !important;
      }
      
      .text-blue-600 {
        color: ${this.darkenColor(colors.primaryColor, 5)} !important;
      }
      
      .text-blue-800 {
        color: ${this.darkenColor(colors.primaryColor, 20)} !important;
      }
      
      /* Borders */
      .border-blue-500 {
        border-color: ${colors.primaryColor} !important;
      }
      
      .border-blue-200 {
        border-color: ${colors.primaryColor}33 !important;
      }
      
      /* Backgrounds with opacity */
      .bg-blue-100 {
        background-color: ${colors.primaryColor}1A !important;
      }
      
      .bg-blue-50 {
        background-color: ${colors.primaryColor}0D !important;
      }
      
      /* Toggle switches */
      .peer-checked\\:bg-blue-600 {
        background-color: ${colors.primaryColor} !important;
      }
      
      /* Company header logo background */
      .config-header-logo-bg, .h-8.w-8.bg-blue-500,
      .h-10.w-10.bg-blue-500 {
        background-color: ${colors.primaryColor} !important;
      }
      
      /* User avatar backgrounds */
      .h-10.w-10.rounded-full.bg-blue-500 {
        background-color: ${colors.primaryColor} !important;
      }
      
      /* Specific button classes */
      .btn-primary {
        background-color: ${colors.primaryColor} !important;
        border-color: ${colors.primaryColor} !important;
      }
      
      .btn-primary:hover {
        background-color: ${this.darkenColor(colors.primaryColor, 10)} !important;
        border-color: ${this.darkenColor(colors.primaryColor, 10)} !important;
      }
      
      /* Canvas style override - for buttons with inline styles */
      button[style*="background-color: rgb(59, 130, 246)"],
      button[style*="background-color: rgb(34, 197, 94)"],
      [style*="background-color: #3B82F6"],
      [style*="background-color: #22C55E"] {
        background-color: ${colors.primaryColor} !important;
      }
    `;

    if (colors.secondaryColor) {
      style.textContent += `
        /* Secondary color applications */
        .text-gray-500 {
          color: ${colors.secondaryColor} !important;
        }
        
        .bg-gray-500 {
          background-color: ${colors.secondaryColor} !important;
        }
        
        .hover\\:bg-gray-600:hover {
          background-color: ${this.darkenColor(colors.secondaryColor, 10)} !important;
        }
        
        .text-gray-600 {
          color: ${this.darkenColor(colors.secondaryColor, 5)} !important;
        }
        
        .text-gray-700 {
          color: ${this.darkenColor(colors.secondaryColor, 10)} !important;
        }
      `;
    }
    
    document.head.appendChild(style);
    console.log('✅ Estilos dinâmicos aplicados com sucesso!');
    console.log('🎨 Cor primária aplicada:', colors.primaryColor);
  }

  // Aplicar favicon
  private applyFavicon(faviconUrl: string): void {
    // Remover favicon existente
    const existingFavicon = document.querySelector('link[rel*="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }

    // Adicionar novo favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = faviconUrl;
    document.head.appendChild(favicon);
  }

  // Atualizar título da página
  private updatePageTitle(companyName: string): void {
    document.title = `${companyName} - Sistema Kanban`;
  }

  // Notificar observadores sobre mudanças de branding
  private updateBranding(branding: Partial<BrandingConfig>): void {
    const currentBranding = this.brandingSubject.value;
    const newBranding = { ...currentBranding, ...branding };
    this.brandingSubject.next(newBranding);
  }

  // Utilitários de cores
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  private darkenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  }

  private adjustHue(color: string, degrees: number): string {
    // Implementação simplificada de ajuste de matiz
    return color; // Por simplicidade, retornando a mesma cor
  }

  // Obter branding atual
  getCurrentBranding(): BrandingConfig {
    return this.brandingSubject.value;
  }

  // Reset para branding padrão
  resetToDefault(): void {
    this.removeCustomCss();
    
    const root = document.documentElement;
    
    // Remover variáveis CSS customizadas
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-secondary');
    root.style.removeProperty('--bs-primary');
    root.style.removeProperty('--bs-secondary');
    
    this.updateBranding({
      logoUrl: undefined,
      primaryColor: undefined,
      secondaryColor: undefined,
      customCss: undefined
    });
  }
}