import {
  ApiService
} from "./chunk-SJX2V56K.js";
import {
  ConfigHeaderComponent
} from "./chunk-43C7U4XV.js";
import {
  MainLayoutComponent
} from "./chunk-ZIJNLXLI.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-5BCXWPYT.js";
import "./chunk-PTOBJH2A.js";
import {
  CompanyService,
  SubdomainService
} from "./chunk-L2S3FEQE.js";
import {
  CommonModule,
  Component,
  NgIf,
  __async,
  __spreadValues,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-GHLOFODZ.js";

// src/app/components/api-links-config/api-links-config.component.ts
function ApiLinksConfigComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 31);
    \u0275\u0275text(1, " Salvando... ");
  }
}
function ApiLinksConfigComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 32);
    \u0275\u0275text(1, " Salvar Configura\xE7\xF5es ");
  }
}
function ApiLinksConfigComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "i", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage(), " ");
  }
}
function ApiLinksConfigComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "i", 34);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
function ApiLinksConfigComponent_p_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("URL para envio de leads neste quadro (", ctx_r0.getCurrentBoardId(), ")");
  }
}
function ApiLinksConfigComponent_p_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("URL base para envio de leads. Adicione /", "{", "boardId", "}", " ao final para especificar o quadro");
  }
}
var ApiLinksConfigComponent = class _ApiLinksConfigComponent {
  companyService = inject(CompanyService);
  subdomainService = inject(SubdomainService);
  apiService = inject(ApiService);
  currentCompany = signal(null, ...ngDevMode ? [{ debugName: "currentCompany" }] : []);
  apiEnabled = signal(false, ...ngDevMode ? [{ debugName: "apiEnabled" }] : []);
  apiToken = signal("", ...ngDevMode ? [{ debugName: "apiToken" }] : []);
  webhookUrl = signal("", ...ngDevMode ? [{ debugName: "webhookUrl" }] : []);
  showApiToken = signal(false, ...ngDevMode ? [{ debugName: "showApiToken" }] : []);
  isSaving = signal(false, ...ngDevMode ? [{ debugName: "isSaving" }] : []);
  successMessage = signal(null, ...ngDevMode ? [{ debugName: "successMessage" }] : []);
  errorMessage = signal(null, ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
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
      this.webhookUrl.set(company.apiConfig?.webhookUrl || "");
    }
  }
  saveApiConfig() {
    return __async(this, null, function* () {
      const company = this.currentCompany();
      if (!company) {
        this.showError("Empresa n\xE3o encontrada");
        return;
      }
      this.isSaving.set(true);
      this.clearMessages();
      try {
        const updatedCompany = {
          apiConfig: {
            enabled: this.apiEnabled(),
            token: this.apiToken(),
            endpoint: this.getLeadIntakeUrl(),
            webhookUrl: this.webhookUrl()
          }
        };
        yield this.companyService.updateCompany(company.id, updatedCompany);
        const refreshedCompany = __spreadValues(__spreadValues({}, company), updatedCompany);
        this.subdomainService.setCurrentCompany(refreshedCompany);
        this.currentCompany.set(refreshedCompany);
        this.showSuccess("Configura\xE7\xF5es de API salvas com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar configura\xE7\xF5es de API:", error);
        this.showError("Erro ao salvar configura\xE7\xF5es. Tente novamente.");
      } finally {
        this.isSaving.set(false);
      }
    });
  }
  toggleApiStatus(enabled) {
    this.apiEnabled.set(enabled);
  }
  toggleTokenVisibility() {
    this.showApiToken.set(!this.showApiToken());
  }
  regenerateApiToken() {
    if (confirm("Tem certeza que deseja regenerar o token da API? Isso invalidar\xE1 o token atual.")) {
      const newToken = this.generateApiToken();
      this.apiToken.set(newToken);
      this.showSuccess("Novo token gerado! Lembre-se de atualizar suas integra\xE7\xF5es.");
    }
  }
  getLeadIntakeUrl() {
    try {
      const boardId = this.getCurrentBoardId();
      const companyId = this.currentCompany()?.id || "{COMPANY_ID}";
      return this.apiService.getLeadIntakeUrl(companyId, boardId);
    } catch (error) {
      return "Erro: empresa n\xE3o configurada";
    }
  }
  getCurrentBoardId() {
    const url = window.location.pathname;
    const boardMatch = url.match(/\/(?:kanban|board)\/([^\/\?]+)/);
    if (boardMatch) {
      return boardMatch[1];
    }
    const urlParams = new URLSearchParams(window.location.search);
    const boardIdParam = urlParams.get("boardId");
    if (boardIdParam) {
      return boardIdParam;
    }
    const lastBoardId = localStorage.getItem("lastBoardId");
    if (lastBoardId) {
      return lastBoardId;
    }
    return void 0;
  }
  companyLinks = signal([], ...ngDevMode ? [{ debugName: "companyLinks" }] : []);
  generateCompanyLinks() {
  }
  getLinkIconClass(category) {
    const baseClass = "w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm";
    switch (category) {
      case "app":
        return baseClass + " bg-blue-500";
      case "form":
        return baseClass + " bg-green-500";
      case "api":
        return baseClass + " bg-purple-500";
      case "webhook":
        return baseClass + " bg-orange-500";
      default:
        return baseClass + " bg-gray-500";
    }
  }
  getStatusText() {
    const company = this.currentCompany();
    return company?.status === "active" ? "Ativo" : "Inativo";
  }
  openLink(url) {
    if (url && url !== "N\xE3o configurado") {
      window.open(url, "_blank");
    }
  }
  copyToClipboard(text) {
    if (text && text !== "N\xE3o configurado") {
      navigator.clipboard.writeText(text).then(() => {
        this.showSuccess("Copiado para a \xE1rea de transfer\xEAncia!");
      }).catch(() => {
        this.showError("Erro ao copiar para a \xE1rea de transfer\xEAncia.");
      });
    }
  }
  generateApiToken() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  showSuccess(message) {
    this.successMessage.set(message);
    this.errorMessage.set(null);
    setTimeout(() => this.successMessage.set(null), 5e3);
  }
  showError(message) {
    this.errorMessage.set(message);
    this.successMessage.set(null);
    setTimeout(() => this.errorMessage.set(null), 5e3);
  }
  clearMessages() {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
  static \u0275fac = function ApiLinksConfigComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ApiLinksConfigComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ApiLinksConfigComponent, selectors: [["app-api-links-config"]], decls: 61, vars: 15, consts: [["title", "API e Integra\xE7\xF5es"], [1, "bg-green-500", "hover:bg-green-600", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "click", "disabled"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-8"], [1, "mb-6", "p-4", "bg-green-50", "border", "border-green-200", "rounded-lg", "text-green-800"], [1, "mb-6", "p-4", "bg-red-50", "border", "border-red-200", "rounded-lg", "text-red-800"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200", "mb-8"], [1, "p-6", "border-b", "border-gray-200"], [1, "text-lg", "font-semibold", "text-gray-900", "flex", "items-center"], [1, "fas", "fa-plug", "text-blue-500", "mr-2"], [1, "text-sm", "text-gray-600", "mt-1"], [1, "p-6"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "space-y-4"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "flex", "items-center", "space-x-3"], [1, "relative", "inline-flex", "items-center", "cursor-pointer"], ["type", "checkbox", 1, "sr-only", "peer", 3, "change", "checked"], [1, "w-11", "h-6", "bg-gray-200", "peer-focus:outline-none", "peer-focus:ring-4", "peer-focus:ring-blue-300", "rounded-full", "peer", "peer-checked:after:translate-x-full", "peer-checked:after:border-white", "after:content-['']", "after:absolute", "after:top-[2px]", "after:left-[2px]", "after:bg-white", "after:border-gray-300", "after:border", "after:rounded-full", "after:h-5", "after:w-5", "after:transition-all", "peer-checked:bg-blue-600"], [1, "flex", "space-x-2"], ["type", "text", "readonly", "", 1, "flex-1", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "bg-gray-50", "text-gray-600", 3, "value"], [1, "bg-gray-500", "hover:bg-gray-600", "text-white", "px-3", "py-2", "rounded-md", "text-sm", "transition-colors", 3, "click"], [1, "fas", "fa-copy"], ["class", "text-xs text-gray-500 mt-1", 4, "ngIf"], ["type", "text", "readonly", "", 1, "flex-1", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "font-mono", "text-sm", 3, "value"], [1, "bg-blue-500", "hover:bg-blue-600", "text-white", "px-3", "py-2", "rounded-md", "text-sm", "transition-colors", 3, "click"], [1, "text-xs", "text-gray-500", "mt-1"], [1, "w-full", "bg-orange-500", "hover:bg-orange-600", "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "fas", "fa-sync-alt", "mr-1"], [1, "mt-6", "pt-6", "border-t", "border-gray-200"], [1, "text-md", "font-medium", "text-gray-900", "mb-4"], ["type", "url", "placeholder", "https://exemplo.com/webhook", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "ngModelChange", "input", "ngModel"], [1, "fas", "fa-spinner", "fa-spin", "mr-1"], [1, "fas", "fa-save", "mr-1"], [1, "fas", "fa-check-circle", "mr-2"], [1, "fas", "fa-exclamation-circle", "mr-2"]], template: function ApiLinksConfigComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-main-layout")(1, "app-config-header", 0)(2, "button", 1);
      \u0275\u0275listener("click", function ApiLinksConfigComponent_Template_button_click_2_listener() {
        return ctx.saveApiConfig();
      });
      \u0275\u0275conditionalCreate(3, ApiLinksConfigComponent_Conditional_3_Template, 2, 0)(4, ApiLinksConfigComponent_Conditional_4_Template, 2, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 2);
      \u0275\u0275conditionalCreate(6, ApiLinksConfigComponent_Conditional_6_Template, 3, 1, "div", 3);
      \u0275\u0275conditionalCreate(7, ApiLinksConfigComponent_Conditional_7_Template, 3, 1, "div", 4);
      \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "h3", 7);
      \u0275\u0275element(11, "i", 8);
      \u0275\u0275text(12, " Configura\xE7\xE3o da API ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p", 9);
      \u0275\u0275text(14, "Configure e gerencie sua API para receber leads externos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 10)(16, "div", 11)(17, "div", 12)(18, "div")(19, "label", 13);
      \u0275\u0275text(20, "Status da API");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 14)(22, "span");
      \u0275\u0275text(23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "label", 15)(25, "input", 16);
      \u0275\u0275listener("change", function ApiLinksConfigComponent_Template_input_change_25_listener($event) {
        return ctx.toggleApiStatus($event.target.checked);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275element(26, "div", 17);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(27, "div")(28, "label", 13);
      \u0275\u0275text(29, "Endpoint da API");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "div", 18);
      \u0275\u0275element(31, "input", 19);
      \u0275\u0275elementStart(32, "button", 20);
      \u0275\u0275listener("click", function ApiLinksConfigComponent_Template_button_click_32_listener() {
        return ctx.copyToClipboard(ctx.getLeadIntakeUrl());
      });
      \u0275\u0275element(33, "i", 21);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(34, ApiLinksConfigComponent_p_34_Template, 2, 1, "p", 22)(35, ApiLinksConfigComponent_p_35_Template, 2, 2, "p", 22);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(36, "div", 12)(37, "div")(38, "label", 13);
      \u0275\u0275text(39, "Token de API");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "div", 18);
      \u0275\u0275element(41, "input", 23);
      \u0275\u0275elementStart(42, "button", 20);
      \u0275\u0275listener("click", function ApiLinksConfigComponent_Template_button_click_42_listener() {
        return ctx.toggleTokenVisibility();
      });
      \u0275\u0275element(43, "i");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "button", 24);
      \u0275\u0275listener("click", function ApiLinksConfigComponent_Template_button_click_44_listener() {
        return ctx.copyToClipboard(ctx.apiToken());
      });
      \u0275\u0275element(45, "i", 21);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(46, "p", 25);
      \u0275\u0275text(47, "Token para autentica\xE7\xE3o nas requisi\xE7\xF5es API");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(48, "div")(49, "button", 26);
      \u0275\u0275listener("click", function ApiLinksConfigComponent_Template_button_click_49_listener() {
        return ctx.regenerateApiToken();
      });
      \u0275\u0275element(50, "i", 27);
      \u0275\u0275text(51, " Regenerar Token ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(52, "div", 28)(53, "h4", 29);
      \u0275\u0275text(54, "Webhook (Opcional)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "div")(56, "label", 13);
      \u0275\u0275text(57, "URL do Webhook");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "input", 30);
      \u0275\u0275twoWayListener("ngModelChange", function ApiLinksConfigComponent_Template_input_ngModelChange_58_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.webhookUrl, $event) || (ctx.webhookUrl = $event);
        return $event;
      });
      \u0275\u0275listener("input", function ApiLinksConfigComponent_Template_input_input_58_listener($event) {
        return ctx.webhookUrl.set($event.target.value);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "p", 25);
      \u0275\u0275text(60, "URL que receber\xE1 notifica\xE7\xF5es quando um novo lead for criado via API");
      \u0275\u0275elementEnd()()()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", ctx.isSaving());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isSaving() ? 3 : 4);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.successMessage() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.errorMessage() ? 7 : -1);
      \u0275\u0275advance(15);
      \u0275\u0275classMap(ctx.apiEnabled() ? "inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800" : "inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.apiEnabled() ? "Ativa" : "Inativa", " ");
      \u0275\u0275advance(2);
      \u0275\u0275property("checked", ctx.apiEnabled());
      \u0275\u0275advance(6);
      \u0275\u0275property("value", ctx.getLeadIntakeUrl());
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.getCurrentBoardId());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.getCurrentBoardId());
      \u0275\u0275advance(6);
      \u0275\u0275property("value", ctx.showApiToken() ? ctx.apiToken() : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022");
      \u0275\u0275advance(2);
      \u0275\u0275classMap(ctx.showApiToken() ? "fas fa-eye-slash" : "fas fa-eye");
      \u0275\u0275advance(15);
      \u0275\u0275twoWayProperty("ngModel", ctx.webhookUrl);
    }
  }, dependencies: [CommonModule, NgIf, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, ConfigHeaderComponent, MainLayoutComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=api-links-config.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApiLinksConfigComponent, [{
    type: Component,
    args: [{ selector: "app-api-links-config", standalone: true, imports: [CommonModule, FormsModule, ConfigHeaderComponent, MainLayoutComponent], template: `
    <app-main-layout>
      <app-config-header title="API e Integra\xE7\xF5es">
        <button 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          (click)="saveApiConfig()"
          [disabled]="isSaving()">
          @if (isSaving()) {
            <i class="fas fa-spinner fa-spin mr-1"></i>
            Salvando...
          } @else {
            <i class="fas fa-save mr-1"></i>
            Salvar Configura\xE7\xF5es
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
              Configura\xE7\xE3o da API
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
                      [value]="showApiToken() ? apiToken() : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'"
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
                  <p class="text-xs text-gray-500 mt-1">Token para autentica\xE7\xE3o nas requisi\xE7\xF5es API</p>
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
                <p class="text-xs text-gray-500 mt-1">URL que receber\xE1 notifica\xE7\xF5es quando um novo lead for criado via API</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </app-main-layout>
  `, styles: ["/* angular:styles/component:scss;219558ef63f119a92210704329b58a3cdceaa4fb296db559e672f74512827dc7;/Users/geovanelopes/Documents/GitHub/kanban-angular-saas/src/app/components/api-links-config/api-links-config.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=api-links-config.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ApiLinksConfigComponent, { className: "ApiLinksConfigComponent", filePath: "src/app/components/api-links-config/api-links-config.component.ts", lineNumber: 167 });
})();
export {
  ApiLinksConfigComponent
};
//# sourceMappingURL=chunk-KPVUHVI7.js.map
