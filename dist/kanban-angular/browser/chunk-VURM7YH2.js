import {
  HttpClient
} from "./chunk-L3ANR23A.js";
import {
  CompanyService,
  SubdomainService
} from "./chunk-NDNGZ4HQ.js";
import {
  BehaviorSubject,
  Injectable,
  __async,
  __name,
  __publicField,
  __spreadValues,
  catchError,
  inject,
  map,
  setClassMetadata,
  throwError,
  ɵɵdefineInjectable
} from "./chunk-GMR7JISZ.js";

// src/app/services/branding.service.ts
var _BrandingService = class _BrandingService {
  http = inject(HttpClient);
  subdomainService = inject(SubdomainService);
  companyService = inject(CompanyService);
  // Observable para mudanças de branding
  brandingSubject = new BehaviorSubject({});
  branding$ = this.brandingSubject.asObservable();
  constructor() {
    this.initializeBranding();
    try {
      this.subdomainService.currentCompany$.subscribe((company) => {
        if (company) {
          this.applyCompanyBranding(company);
        }
      });
    } catch {
    }
    setTimeout(() => {
      this.applyStoredBranding();
    }, 100);
  }
  // Inicializar branding da empresa
  initializeBranding() {
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
  applyStoredBranding() {
    const company = this.subdomainService.getCurrentCompany();
    if (company && company.brandingConfig) {
      if (company.brandingConfig.primaryColor) {
        this.applyColors({
          primaryColor: company.brandingConfig.primaryColor,
          secondaryColor: company.brandingConfig.secondaryColor
        });
      }
    }
  }
  // Upload de logo
  uploadLogo(file) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const validationError = this.validateImageFile(file);
    if (validationError) {
      return throwError(() => new Error(validationError));
    }
    const formData = new FormData();
    formData.append("logo", file);
    formData.append("companyId", company.id);
    const uploadUrl = `${this.subdomainService.getApiUrl()}/upload/logo`;
    return this.http.post(uploadUrl, formData).pipe(map((response) => {
      if (response.success && response.logoUrl) {
        this.updateCompanyLogo(response.logoUrl);
      }
      return response;
    }), catchError((error) => {
      console.error("Erro ao fazer upload do logo:", error);
      return throwError(() => ({
        success: false,
        error: error.error?.message || "Erro ao fazer upload do logo"
      }));
    }));
  }
  // Upload de favicon
  uploadFavicon(file) {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) {
      return throwError(() => new Error("Empresa n\xE3o encontrada"));
    }
    const validationError = this.validateFaviconFile(file);
    if (validationError) {
      return throwError(() => new Error(validationError));
    }
    const formData = new FormData();
    formData.append("favicon", file);
    formData.append("companyId", company.id);
    const uploadUrl = `${this.subdomainService.getApiUrl()}/upload/favicon`;
    return this.http.post(uploadUrl, formData).pipe(map((response) => {
      if (response.success && response.logoUrl) {
        this.applyFavicon(response.logoUrl);
      }
      return response;
    }), catchError((error) => {
      console.error("Erro ao fazer upload do favicon:", error);
      return throwError(() => error);
    }));
  }
  // Atualizar cores da empresa
  updateColors(colors) {
    return __async(this, null, function* () {
      const company = this.subdomainService.getCurrentCompany();
      if (!company) {
        throw new Error("Empresa n\xE3o encontrada");
      }
      try {
        yield this.companyService.updateCompany(company.id, colors);
        Object.assign(company, colors);
        this.subdomainService.setCurrentCompany(company);
        this.applyColors(colors);
        this.updateBranding(colors);
      } catch (error) {
        console.error("Erro ao atualizar cores:", error);
        throw error;
      }
    });
  }
  // Aplicar CSS customizado
  applyCustomCss(css) {
    this.removeCustomCss();
    if (css.trim()) {
      const style = document.createElement("style");
      style.id = "company-custom-css";
      style.textContent = css;
      document.head.appendChild(style);
    }
  }
  // Remover CSS customizado
  removeCustomCss() {
    const existingStyle = document.getElementById("company-custom-css");
    if (existingStyle) {
      existingStyle.remove();
    }
  }
  // Aplicar branding completo da empresa
  applyCompanyBranding(company) {
    const primaryColor = company.brandingConfig?.primaryColor || company.primaryColor;
    const secondaryColor = company.brandingConfig?.secondaryColor || company.secondaryColor;
    const branding = {
      logoUrl: company.logoUrl,
      primaryColor,
      secondaryColor
    };
    this.updateBranding(branding);
    if (primaryColor || secondaryColor) {
      this.applyColors({
        primaryColor,
        secondaryColor
      });
    }
    this.updatePageTitle(company.name);
  }
  // Gerar palette de cores baseada na cor primária
  generateColorPalette(primaryColor) {
    const hex = primaryColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return {
      primary: primaryColor,
      primaryLight: this.lightenColor(primaryColor, 20),
      primaryDark: this.darkenColor(primaryColor, 20),
      secondary: this.adjustHue(primaryColor, 30),
      accent: this.adjustHue(primaryColor, -30),
      success: "#28a745",
      warning: "#ffc107",
      danger: "#dc3545",
      info: "#17a2b8"
    };
  }
  // Validar arquivo de imagem
  validateImageFile(file) {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return "Arquivo muito grande. Tamanho m\xE1ximo: 5MB";
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return "Tipo de arquivo n\xE3o suportado. Use JPEG, PNG ou SVG";
    }
    return null;
  }
  // Validar arquivo de favicon
  validateFaviconFile(file) {
    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      return "Arquivo muito grande. Tamanho m\xE1ximo: 1MB";
    }
    const allowedTypes = ["image/x-icon", "image/vnd.microsoft.icon", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return "Tipo de arquivo n\xE3o suportado. Use ICO ou PNG";
    }
    return null;
  }
  // Atualizar logo da empresa
  updateCompanyLogo(logoUrl) {
    return __async(this, null, function* () {
      const company = this.subdomainService.getCurrentCompany();
      if (company) {
        company.logoUrl = logoUrl;
        this.subdomainService.setCurrentCompany(company);
        yield this.companyService.updateCompany(company.id, { logoUrl });
        this.updateBranding({ logoUrl });
      }
    });
  }
  // Aplicar cores na interface
  applyColors(colors) {
    const root = document.documentElement;
    if (colors.primaryColor) {
      const palette = this.generateColorPalette(colors.primaryColor);
      Object.entries(palette).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
      root.style.setProperty("--bs-primary", colors.primaryColor);
      root.style.setProperty("--primary-color", colors.primaryColor);
      root.style.setProperty("--tw-ring-color", colors.primaryColor + "66");
    }
    if (colors.secondaryColor) {
      root.style.setProperty("--color-secondary", colors.secondaryColor);
      root.style.setProperty("--bs-secondary", colors.secondaryColor);
      root.style.setProperty("--secondary-color", colors.secondaryColor);
    }
    if (colors.accentColor) {
      root.style.setProperty("--color-accent", colors.accentColor);
    }
    this.applyDynamicStyles(colors);
  }
  // Apply dynamic styles that override hardcoded colors
  applyDynamicStyles(colors) {
    if (!colors.primaryColor) {
      return;
    }
    const existingStyle = document.getElementById("dynamic-branding-styles");
    if (existingStyle) {
      existingStyle.remove();
    }
    const style = document.createElement("style");
    style.id = "dynamic-branding-styles";
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
  }
  // Aplicar favicon
  applyFavicon(faviconUrl) {
    const existingFavicon = document.querySelector('link[rel*="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }
    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.href = faviconUrl;
    document.head.appendChild(favicon);
  }
  // Atualizar título da página
  updatePageTitle(companyName) {
    document.title = `${companyName} - Sistema Kanban`;
  }
  // Notificar observadores sobre mudanças de branding
  updateBranding(branding) {
    const currentBranding = this.brandingSubject.value;
    const newBranding = __spreadValues(__spreadValues({}, currentBranding), branding);
    this.brandingSubject.next(newBranding);
  }
  // Utilitários de cores
  lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 255) + amt;
    const B = (num & 255) + amt;
    return "#" + (16777216 + (R < 255 ? R < 1 ? 0 : R : 255) * 65536 + (G < 255 ? G < 1 ? 0 : G : 255) * 256 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
  darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 255) - amt;
    const B = (num & 255) - amt;
    return "#" + (16777216 + (R > 255 ? 255 : R < 0 ? 0 : R) * 65536 + (G > 255 ? 255 : G < 0 ? 0 : G) * 256 + (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  }
  adjustHue(color, degrees) {
    return color;
  }
  // Obter branding atual
  getCurrentBranding() {
    return this.brandingSubject.value;
  }
  // Verificar se tem logo
  hasLogo() {
    const company = this.subdomainService.getCurrentCompany();
    if (company?.logoUrl && company.logoUrl.trim() !== "") {
      return true;
    }
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== "") {
      return true;
    }
    return false;
  }
  // Obter URL do logo
  getLogoUrl() {
    const company = this.subdomainService.getCurrentCompany();
    if (company?.logoUrl && company.logoUrl.trim() !== "") {
      return company.logoUrl;
    }
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== "") {
      return company.brandingConfig.logo;
    }
    return "";
  }
  // Obter cor primária
  getPrimaryColor() {
    const company = this.subdomainService.getCurrentCompany();
    return company?.brandingConfig?.primaryColor || company?.primaryColor || "#3B82F6";
  }
  // Reset para branding padrão
  resetToDefault() {
    this.removeCustomCss();
    const root = document.documentElement;
    root.style.removeProperty("--color-primary");
    root.style.removeProperty("--color-secondary");
    root.style.removeProperty("--bs-primary");
    root.style.removeProperty("--bs-secondary");
    this.updateBranding({
      logoUrl: void 0,
      primaryColor: void 0,
      secondaryColor: void 0,
      customCss: void 0
    });
  }
};
__name(_BrandingService, "BrandingService");
__publicField(_BrandingService, "\u0275fac", /* @__PURE__ */ __name(function BrandingService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BrandingService)();
}, "BrandingService_Factory"));
__publicField(_BrandingService, "\u0275prov", /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BrandingService, factory: _BrandingService.\u0275fac, providedIn: "root" }));
var BrandingService = _BrandingService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrandingService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  BrandingService
};
//# sourceMappingURL=chunk-VURM7YH2.js.map
