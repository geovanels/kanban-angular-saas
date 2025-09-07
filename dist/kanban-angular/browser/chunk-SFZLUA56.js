import {
  BrandingService
} from "./chunk-JM2YM2QH.js";
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
  AuthService,
  CompanyService,
  SubdomainService
} from "./chunk-L2S3FEQE.js";
import {
  CommonModule,
  Component,
  __async,
  __spreadValues,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-GHLOFODZ.js";

// src/app/components/branding-config/branding-config.component.ts
var _forTrack0 = ($index, $item) => $item.name;
function BrandingConfigComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 53);
    \u0275\u0275text(1, " Salvando... ");
  }
}
function BrandingConfigComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 54);
    \u0275\u0275text(1, " Salvar Configura\xE7\xF5es ");
  }
}
function BrandingConfigComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "i", 55);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.successMessage(), " ");
  }
}
function BrandingConfigComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "i", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.errorMessage(), " ");
  }
}
function BrandingConfigComponent_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 15);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r1.logoUrl(), \u0275\u0275sanitizeUrl);
  }
}
function BrandingConfigComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275element(1, "i", 57);
    \u0275\u0275elementEnd();
  }
}
function BrandingConfigComponent_Conditional_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 58);
    \u0275\u0275elementStart(1, "p", 59);
    \u0275\u0275text(2, "Clique para alterar o logo");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r1.logoUrl(), \u0275\u0275sanitizeUrl);
  }
}
function BrandingConfigComponent_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 60);
    \u0275\u0275elementStart(1, "p", 59);
    \u0275\u0275text(2, "Clique para fazer upload do logo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 41);
    \u0275\u0275text(4, "PNG, JPG ou SVG - M\xE1x. 5MB");
    \u0275\u0275elementEnd();
  }
}
function BrandingConfigComponent_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 61);
    \u0275\u0275listener("click", function BrandingConfigComponent_Conditional_56_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.removeLogo());
    });
    \u0275\u0275element(1, "i", 62);
    \u0275\u0275text(2, " Remover Logo ");
    \u0275\u0275elementEnd();
  }
}
function BrandingConfigComponent_For_84_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 63);
    \u0275\u0275listener("click", function BrandingConfigComponent_For_84_Template_button_click_0_listener() {
      const preset_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.applyColorPreset(preset_r6));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const preset_r6 = ctx.$implicit;
    \u0275\u0275styleProp("background-color", preset_r6.primary);
    \u0275\u0275property("title", preset_r6.name);
  }
}
function BrandingConfigComponent_Conditional_101_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51)(1, "div", 64)(2, "h3", 65);
    \u0275\u0275element(3, "i", 66);
    \u0275\u0275text(4, " Zona Perigosa ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 67);
    \u0275\u0275text(6, " A exclus\xE3o da empresa \xE9 permanente e n\xE3o pode ser desfeita. Todos os dados, quadros, leads e usu\xE1rios ser\xE3o perdidos. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 11)(8, "button", 68);
    \u0275\u0275listener("click", function BrandingConfigComponent_Conditional_101_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showDeleteModal());
    });
    \u0275\u0275element(9, "i", 62);
    \u0275\u0275text(10, " Excluir Empresa Permanentemente ");
    \u0275\u0275elementEnd()()();
  }
}
function BrandingConfigComponent_Conditional_102_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 79);
    \u0275\u0275element(1, "i", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.deleteError(), " ");
  }
}
function BrandingConfigComponent_Conditional_102_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 53);
    \u0275\u0275text(1, " Excluindo... ");
  }
}
function BrandingConfigComponent_Conditional_102_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 62);
    \u0275\u0275text(1, " Excluir Permanentemente ");
  }
}
function BrandingConfigComponent_Conditional_102_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 52)(1, "div", 69)(2, "div", 70)(3, "div", 71)(4, "h3", 8);
    \u0275\u0275element(5, "i", 72);
    \u0275\u0275text(6, " Confirmar Exclus\xE3o ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 73);
    \u0275\u0275listener("click", function BrandingConfigComponent_Conditional_102_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.hideDeleteModal());
    });
    \u0275\u0275element(8, "i", 74);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 75)(10, "strong");
    \u0275\u0275text(11, "ATEN\xC7\xC3O:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12, " Esta a\xE7\xE3o n\xE3o pode ser desfeita! ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 76);
    \u0275\u0275text(14, "Voc\xEA est\xE1 prestes a excluir permanentemente:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "ul", 77)(16, "li");
    \u0275\u0275text(17, "Empresa: ");
    \u0275\u0275elementStart(18, "strong");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "li");
    \u0275\u0275text(21, "Todos os quadros e leads");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "li");
    \u0275\u0275text(23, "Todos os usu\xE1rios associados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "li");
    \u0275\u0275text(25, "Todas as configura\xE7\xF5es e dados");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "p", 76);
    \u0275\u0275text(27, " Para confirmar, digite ");
    \u0275\u0275elementStart(28, "strong");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd();
    \u0275\u0275text(30, " abaixo: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "input", 78);
    \u0275\u0275twoWayListener("ngModelChange", function BrandingConfigComponent_Conditional_102_Template_input_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.deleteConfirmation, $event) || (ctx_r1.deleteConfirmation = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function BrandingConfigComponent_Conditional_102_Template_input_input_31_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deleteConfirmation.set($event.target.value));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(32, BrandingConfigComponent_Conditional_102_Conditional_32_Template, 3, 1, "div", 79);
    \u0275\u0275elementStart(33, "div", 38)(34, "button", 80);
    \u0275\u0275listener("click", function BrandingConfigComponent_Conditional_102_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.hideDeleteModal());
    });
    \u0275\u0275text(35, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "button", 81);
    \u0275\u0275listener("click", function BrandingConfigComponent_Conditional_102_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.deleteCompany());
    });
    \u0275\u0275conditionalCreate(37, BrandingConfigComponent_Conditional_102_Conditional_37_Template, 2, 0)(38, BrandingConfigComponent_Conditional_102_Conditional_38_Template, 2, 0);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_8_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(19);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r1.currentCompany()) == null ? null : tmp_2_0.name);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r1.currentCompany()) == null ? null : tmp_3_0.name);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.deleteConfirmation);
    \u0275\u0275property("value", ctx_r1.deleteConfirmation());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.deleteError() ? 32 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.deleteLoading());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.deleteLoading() || ctx_r1.deleteConfirmation() !== ((tmp_8_0 = ctx_r1.currentCompany()) == null ? null : tmp_8_0.name));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.deleteLoading() ? 37 : 38);
  }
}
var BrandingConfigComponent = class _BrandingConfigComponent {
  companyService = inject(CompanyService);
  subdomainService = inject(SubdomainService);
  brandingService = inject(BrandingService);
  authService = inject(AuthService);
  // Reactive signals
  currentCompany = signal(null, ...ngDevMode ? [{ debugName: "currentCompany" }] : []);
  primaryColor = signal("#3B82F6", ...ngDevMode ? [{ debugName: "primaryColor" }] : []);
  secondaryColor = signal("#6B7280", ...ngDevMode ? [{ debugName: "secondaryColor" }] : []);
  logoUrl = signal("", ...ngDevMode ? [{ debugName: "logoUrl" }] : []);
  companyName = signal("", ...ngDevMode ? [{ debugName: "companyName" }] : []);
  isSaving = signal(false, ...ngDevMode ? [{ debugName: "isSaving" }] : []);
  successMessage = signal(null, ...ngDevMode ? [{ debugName: "successMessage" }] : []);
  errorMessage = signal(null, ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
  // Delete company
  showDeleteConfirmation = signal(false, ...ngDevMode ? [{ debugName: "showDeleteConfirmation" }] : []);
  deleteConfirmation = signal("", ...ngDevMode ? [{ debugName: "deleteConfirmation" }] : []);
  deleteLoading = signal(false, ...ngDevMode ? [{ debugName: "deleteLoading" }] : []);
  deleteError = signal(null, ...ngDevMode ? [{ debugName: "deleteError" }] : []);
  colorPresets = [
    { name: "Azul", primary: "#3B82F6", secondary: "#6B7280" },
    { name: "Verde", primary: "#10B981", secondary: "#6B7280" },
    { name: "Vermelho", primary: "#EF4444", secondary: "#6B7280" },
    { name: "Roxo", primary: "#8B5CF6", secondary: "#6B7280" },
    { name: "Laranja", primary: "#F59E0B", secondary: "#6B7280" },
    { name: "Rosa", primary: "#EC4899", secondary: "#6B7280" }
  ];
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.loadCurrentBranding();
    });
  }
  loadCurrentBranding() {
    return __async(this, null, function* () {
      let company = this.subdomainService.getCurrentCompany();
      if (!company) {
        try {
          company = yield this.subdomainService.initializeFromSubdomain();
        } catch (error) {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser?.uid) {
            try {
              const companies = yield this.companyService.getCompaniesByOwner(currentUser.uid);
              if (companies.length > 0) {
                company = companies[0];
                this.subdomainService.setCurrentCompany(company);
              }
            } catch (error2) {
              console.error("Erro ao buscar empresas do usu\xE1rio:", error2);
            }
          }
        }
      }
      if (company) {
        this.currentCompany.set(company);
        this.primaryColor.set(company.brandingConfig?.primaryColor || "#3B82F6");
        this.secondaryColor.set(company.brandingConfig?.secondaryColor || "#6B7280");
        this.logoUrl.set(company.brandingConfig?.logo || "");
        this.companyName.set(company.name || "");
      }
    });
  }
  saveConfiguration() {
    return __async(this, null, function* () {
      let company = this.currentCompany();
      if (!company) {
        try {
          const sub = this.companyService.getCompanySubdomain();
          if (sub) {
            const fetched = yield this.companyService.getCompanyBySubdomain(sub);
            if (fetched) {
              this.subdomainService.setCurrentCompany(fetched);
              this.currentCompany.set(fetched);
              company = fetched;
            }
          }
        } catch {
        }
      }
      if (!company) {
        try {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser?.email) {
            const byEmail = yield this.companyService.getCompanyByUserEmail(currentUser.email);
            if (byEmail) {
              this.subdomainService.setCurrentCompany(byEmail);
              this.currentCompany.set(byEmail);
              company = byEmail;
            }
          }
        } catch {
        }
      }
      if (!company) {
        this.showError("Empresa n\xE3o encontrada");
        return;
      }
      this.isSaving.set(true);
      this.clearMessages();
      try {
        const updatedCompany = {
          name: this.companyName(),
          brandingConfig: {
            primaryColor: this.primaryColor(),
            secondaryColor: this.secondaryColor(),
            logo: this.logoUrl(),
            favicon: company.brandingConfig?.favicon || "",
            customCSS: company.brandingConfig?.customCSS || "",
            companyName: this.companyName()
          }
        };
        yield this.companyService.updateCompany(company.id, updatedCompany);
        const refreshedCompany = __spreadValues(__spreadValues({}, company), updatedCompany);
        this.subdomainService.setCurrentCompany(refreshedCompany);
        this.currentCompany.set(refreshedCompany);
        yield this.brandingService.updateColors({
          primaryColor: this.primaryColor(),
          secondaryColor: this.secondaryColor()
        });
        this.showSuccess("Configura\xE7\xF5es de branding salvas com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar configura\xE7\xF5es de branding:", error);
        this.showError("Erro ao salvar configura\xE7\xF5es. Tente novamente.");
      } finally {
        this.isSaving.set(false);
      }
    });
  }
  onLogoSelected(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoUrl.set(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  }
  removeLogo() {
    if (confirm("Tem certeza que deseja remover o logo?")) {
      this.logoUrl.set("");
    }
  }
  applyColorPreset(preset) {
    this.primaryColor.set(preset.primary);
    this.secondaryColor.set(preset.secondary);
    this.applyPreviewColors();
  }
  resetColors() {
    this.primaryColor.set("#3B82F6");
    this.secondaryColor.set("#6B7280");
  }
  getContrastColor(hexColor) {
    if (!hexColor)
      return "#000000";
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }
  applyBrandingToPage() {
    document.documentElement.style.setProperty("--primary-color", this.primaryColor());
    document.documentElement.style.setProperty("--secondary-color", this.secondaryColor());
  }
  canDeleteCompany() {
    const currentUser = this.authService.getCurrentUser();
    const company = this.currentCompany();
    if (!currentUser || !company)
      return false;
    return company.ownerEmail === currentUser.email;
  }
  deleteCompany() {
    return __async(this, null, function* () {
      const company = this.currentCompany();
      const confirmation = this.deleteConfirmation().trim();
      if (!company || confirmation !== company.name) {
        this.deleteError.set("Digite exatamente o nome da empresa para confirmar");
        return;
      }
      this.deleteLoading.set(true);
      this.deleteError.set(null);
      try {
        yield this.companyService.deleteCompany(company.id);
        yield this.authService.logout();
        window.location.href = "/login";
      } catch (error) {
        console.error("Erro ao excluir empresa:", error);
        this.deleteError.set("Erro ao excluir empresa. Tente novamente.");
      } finally {
        this.deleteLoading.set(false);
      }
    });
  }
  showDeleteModal() {
    this.showDeleteConfirmation.set(true);
    this.deleteConfirmation.set("");
    this.deleteError.set(null);
  }
  hideDeleteModal() {
    this.showDeleteConfirmation.set(false);
    this.deleteConfirmation.set("");
    this.deleteError.set(null);
  }
  applyPreviewColors() {
    this.brandingService.updateColors({
      primaryColor: this.primaryColor(),
      secondaryColor: this.secondaryColor()
    }).catch((error) => {
      this.applyBrandingToPage();
    });
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
  static \u0275fac = function BrandingConfigComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrandingConfigComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BrandingConfigComponent, selectors: [["app-branding-config"]], decls: 103, vars: 36, consts: [["logoInput", ""], ["title", "Minha Empresa"], [1, "bg-green-500", "hover:bg-green-600", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "click", "disabled"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-8"], [1, "mb-6", "p-4", "bg-green-50", "border", "border-green-200", "rounded-lg", "text-green-800"], [1, "mb-6", "p-4", "bg-red-50", "border", "border-red-200", "rounded-lg", "text-red-800"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200", "mb-8"], [1, "p-6", "border-b", "border-gray-200"], [1, "text-lg", "font-semibold", "text-gray-900", "flex", "items-center"], [1, "fas", "fa-eye", "text-blue-500", "mr-2"], [1, "text-sm", "text-gray-600", "mt-1"], [1, "p-6"], [1, "border", "border-gray-300", "rounded-lg", "p-6", "bg-gray-50"], [1, "flex", "items-center", "justify-between", "p-4", "bg-white", "rounded", "border", "border-gray-200", "mb-4"], [1, "flex", "items-center", "space-x-3"], ["alt", "Logo Preview", 1, "h-8", "w-auto", 3, "src"], [1, "h-8", "w-8", "bg-gray-300", "rounded", "flex", "items-center", "justify-center"], [1, "text-lg", "font-semibold"], [1, "flex", "space-x-2"], [1, "px-3", "py-1", "rounded", "text-sm", "font-medium"], [1, "px-3", "py-1", "rounded", "text-sm", "font-medium", "text-white"], [1, "bg-white", "rounded", "border", "border-gray-200", "p-4"], [1, "font-semibold", "mb-2"], [1, "text-gray-600", "text-sm", "mb-3"], [1, "px-2", "py-1", "rounded", "text-xs", "font-medium"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-8"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "fas", "fa-image", "text-blue-500", "mr-2"], [1, "mb-6"], [1, "border-2", "border-dashed", "border-gray-300", "rounded-lg", "p-8", "text-center", "hover:border-blue-400", "transition-colors", "cursor-pointer", 3, "click"], ["type", "file", "accept", "image/*", 1, "hidden", 3, "change"], [1, "space-y-3"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["type", "url", "placeholder", "https://exemplo.com/logo.png", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "ngModelChange", "input", "ngModel"], [1, "w-full", "bg-red-500", "hover:bg-red-600", "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors"], [1, "fas", "fa-palette", "text-blue-500", "mr-2"], [1, "p-6", "space-y-4"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], [1, "flex", "space-x-3"], ["type", "color", 1, "w-12", "h-10", "border", "border-gray-300", "rounded", "cursor-pointer", 3, "input", "value"], ["type", "text", "placeholder", "#3B82F6", 1, "flex-1", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "input", "value"], [1, "text-xs", "text-gray-500", "mt-1"], ["type", "text", "placeholder", "#6B7280", 1, "flex-1", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "input", "value"], [1, "flex", "space-x-2", "flex-wrap", "gap-2"], ["type", "button", 1, "w-8", "h-8", "rounded-full", "border-2", "border-white", "shadow-sm", "hover:scale-110", "transition-transform", 3, "background-color", "title"], [1, "pt-4", "border-t", "border-gray-200"], ["type", "button", 1, "w-full", "bg-gray-500", "hover:bg-gray-600", "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "fas", "fa-undo", "mr-1"], [1, "mt-8", "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "fas", "fa-building", "text-blue-500", "mr-2"], ["type", "text", "placeholder", "Nome da sua empresa", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "ngModelChange", "input", "ngModel"], [1, "mt-8", "bg-white", "rounded-lg", "shadow-sm", "border", "border-red-200"], [1, "fixed", "inset-0", "bg-gray-600", "bg-opacity-50", "overflow-y-auto", "h-full", "w-full", "z-50"], [1, "fas", "fa-spinner", "fa-spin", "mr-1"], [1, "fas", "fa-save", "mr-1"], [1, "fas", "fa-check-circle", "mr-2"], [1, "fas", "fa-exclamation-circle", "mr-2"], [1, "fas", "fa-image", "text-gray-500"], ["alt", "Logo atual", 1, "max-h-20", "mx-auto", "mb-4", 3, "src"], [1, "text-sm", "text-gray-600"], [1, "fas", "fa-cloud-upload-alt", "text-4xl", "text-gray-400", "mb-4"], [1, "w-full", "bg-red-500", "hover:bg-red-600", "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "fas", "fa-trash", "mr-1"], ["type", "button", 1, "w-8", "h-8", "rounded-full", "border-2", "border-white", "shadow-sm", "hover:scale-110", "transition-transform", 3, "click", "title"], [1, "p-6", "bg-red-50", "rounded-t-lg", "border-b", "border-red-200"], [1, "text-lg", "font-semibold", "text-red-800", "flex", "items-center"], [1, "fas", "fa-exclamation-triangle", "mr-2"], [1, "text-sm", "text-red-700", "mt-1"], [1, "bg-red-600", "hover:bg-red-700", "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "relative", "top-20", "mx-auto", "p-5", "border", "w-96", "shadow-lg", "rounded-md", "bg-white"], [1, "mt-3"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "fas", "fa-exclamation-triangle", "text-red-500", "mr-2"], [1, "text-gray-400", "hover:text-gray-600", 3, "click"], [1, "fas", "fa-times"], [1, "mb-4", "p-3", "bg-red-50", "border", "border-red-200", "rounded"], [1, "text-sm", "text-gray-600", "mb-4"], [1, "text-sm", "text-gray-600", "mb-4", "list-disc", "list-inside"], ["type", "text", "placeholder", "Nome da empresa", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-red-500", "focus:border-red-500", "mb-4", 3, "ngModelChange", "input", "ngModel", "value"], [1, "mb-4", "p-3", "bg-red-50", "border", "border-red-200", "rounded", "text-red-800"], [1, "flex-1", "bg-gray-500", "hover:bg-gray-600", "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click", "disabled"], [1, "flex-1", "bg-red-600", "hover:bg-red-700", "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click", "disabled"]], template: function BrandingConfigComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "app-main-layout")(1, "app-config-header", 1)(2, "button", 2);
      \u0275\u0275listener("click", function BrandingConfigComponent_Template_button_click_2_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.saveConfiguration());
      });
      \u0275\u0275conditionalCreate(3, BrandingConfigComponent_Conditional_3_Template, 2, 0)(4, BrandingConfigComponent_Conditional_4_Template, 2, 0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 3);
      \u0275\u0275conditionalCreate(6, BrandingConfigComponent_Conditional_6_Template, 3, 1, "div", 4);
      \u0275\u0275conditionalCreate(7, BrandingConfigComponent_Conditional_7_Template, 3, 1, "div", 5);
      \u0275\u0275elementStart(8, "div", 6)(9, "div", 7)(10, "h3", 8);
      \u0275\u0275element(11, "i", 9);
      \u0275\u0275text(12, " Preview da Identidade Visual ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p", 10);
      \u0275\u0275text(14, "Veja como ficar\xE1 a apar\xEAncia do sistema");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 11)(16, "div", 12)(17, "div", 13)(18, "div", 14);
      \u0275\u0275conditionalCreate(19, BrandingConfigComponent_Conditional_19_Template, 1, 1, "img", 15)(20, BrandingConfigComponent_Conditional_20_Template, 2, 0, "div", 16);
      \u0275\u0275elementStart(21, "h2", 17);
      \u0275\u0275text(22);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 18)(24, "button", 19);
      \u0275\u0275text(25, " Bot\xE3o Secund\xE1rio ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "button", 20);
      \u0275\u0275text(27, " Bot\xE3o Principal ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(28, "div", 21)(29, "h3", 22);
      \u0275\u0275text(30, "Sample Content");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "p", 23);
      \u0275\u0275text(32, "Este \xE9 um exemplo de como o conte\xFAdo aparecer\xE1 com suas cores personalizadas.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "div", 18)(34, "span", 24);
      \u0275\u0275text(35, " Tag Principal ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "span", 24);
      \u0275\u0275text(37, " Tag Secund\xE1ria ");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(38, "div", 25)(39, "div", 26)(40, "div", 7)(41, "h3", 8);
      \u0275\u0275element(42, "i", 27);
      \u0275\u0275text(43, " Logo da Empresa ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 11)(45, "div", 28)(46, "div", 29);
      \u0275\u0275listener("click", function BrandingConfigComponent_Template_div_click_46_listener() {
        \u0275\u0275restoreView(_r1);
        const logoInput_r3 = \u0275\u0275reference(50);
        return \u0275\u0275resetView(logoInput_r3.click());
      });
      \u0275\u0275conditionalCreate(47, BrandingConfigComponent_Conditional_47_Template, 3, 1)(48, BrandingConfigComponent_Conditional_48_Template, 5, 0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "input", 30, 0);
      \u0275\u0275listener("change", function BrandingConfigComponent_Template_input_change_49_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onLogoSelected($event));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(51, "div", 31)(52, "div")(53, "label", 32);
      \u0275\u0275text(54, "URL do Logo (opcional)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(55, "input", 33);
      \u0275\u0275twoWayListener("ngModelChange", function BrandingConfigComponent_Template_input_ngModelChange_55_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.logoUrl, $event) || (ctx.logoUrl = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("input", function BrandingConfigComponent_Template_input_input_55_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.logoUrl.set($event.target.value));
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(56, BrandingConfigComponent_Conditional_56_Template, 3, 0, "button", 34);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(57, "div", 26)(58, "div", 7)(59, "h3", 8);
      \u0275\u0275element(60, "i", 35);
      \u0275\u0275text(61, " Cores da Empresa ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(62, "div", 36)(63, "div")(64, "label", 37);
      \u0275\u0275text(65, "Cor Principal");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "div", 38)(67, "input", 39);
      \u0275\u0275listener("input", function BrandingConfigComponent_Template_input_input_67_listener($event) {
        \u0275\u0275restoreView(_r1);
        ctx.primaryColor.set($event.target.value);
        return \u0275\u0275resetView(ctx.applyPreviewColors());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "input", 40);
      \u0275\u0275listener("input", function BrandingConfigComponent_Template_input_input_68_listener($event) {
        \u0275\u0275restoreView(_r1);
        ctx.primaryColor.set($event.target.value);
        return \u0275\u0275resetView(ctx.applyPreviewColors());
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(69, "p", 41);
      \u0275\u0275text(70, "Cor principal da interface (bot\xF5es, links, etc.)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(71, "div")(72, "label", 37);
      \u0275\u0275text(73, "Cor Secund\xE1ria");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(74, "div", 38)(75, "input", 39);
      \u0275\u0275listener("input", function BrandingConfigComponent_Template_input_input_75_listener($event) {
        \u0275\u0275restoreView(_r1);
        ctx.secondaryColor.set($event.target.value);
        return \u0275\u0275resetView(ctx.applyPreviewColors());
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "input", 42);
      \u0275\u0275listener("input", function BrandingConfigComponent_Template_input_input_76_listener($event) {
        \u0275\u0275restoreView(_r1);
        ctx.secondaryColor.set($event.target.value);
        return \u0275\u0275resetView(ctx.applyPreviewColors());
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(77, "p", 41);
      \u0275\u0275text(78, "Cor para elementos secund\xE1rios");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(79, "div")(80, "label", 37);
      \u0275\u0275text(81, "Paletas Sugeridas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "div", 43);
      \u0275\u0275repeaterCreate(83, BrandingConfigComponent_For_84_Template, 1, 3, "button", 44, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(85, "div", 45)(86, "button", 46);
      \u0275\u0275listener("click", function BrandingConfigComponent_Template_button_click_86_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.resetColors());
      });
      \u0275\u0275element(87, "i", 47);
      \u0275\u0275text(88, " Restaurar Cores Padr\xE3o ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(89, "div", 48)(90, "div", 7)(91, "h3", 8);
      \u0275\u0275element(92, "i", 49);
      \u0275\u0275text(93, " Informa\xE7\xF5es da Empresa ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(94, "div", 11)(95, "div")(96, "label", 37);
      \u0275\u0275text(97, "Nome da Empresa");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(98, "input", 50);
      \u0275\u0275twoWayListener("ngModelChange", function BrandingConfigComponent_Template_input_ngModelChange_98_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.companyName, $event) || (ctx.companyName = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275listener("input", function BrandingConfigComponent_Template_input_input_98_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.companyName.set($event.target.value));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(99, "p", 41);
      \u0275\u0275text(100, "Este nome aparecer\xE1 no cabe\xE7alho do sistema");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(101, BrandingConfigComponent_Conditional_101_Template, 11, 0, "div", 51);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(102, BrandingConfigComponent_Conditional_102_Template, 39, 8, "div", 52);
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
      \u0275\u0275advance(10);
      \u0275\u0275styleProp("background-color", ctx.primaryColor());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.logoUrl() ? 19 : 20);
      \u0275\u0275advance(2);
      \u0275\u0275styleProp("color", ctx.getContrastColor(ctx.primaryColor()));
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.companyName() || "Nome da Empresa", " ");
      \u0275\u0275advance(2);
      \u0275\u0275styleProp("background-color", ctx.secondaryColor())("color", ctx.getContrastColor(ctx.secondaryColor()));
      \u0275\u0275advance(2);
      \u0275\u0275styleProp("background-color", ctx.primaryColor());
      \u0275\u0275advance(3);
      \u0275\u0275styleProp("color", ctx.primaryColor());
      \u0275\u0275advance(5);
      \u0275\u0275styleProp("background-color", ctx.primaryColor() + "20")("color", ctx.primaryColor());
      \u0275\u0275advance(2);
      \u0275\u0275styleProp("background-color", ctx.secondaryColor() + "20")("color", ctx.secondaryColor());
      \u0275\u0275advance(11);
      \u0275\u0275conditional(ctx.logoUrl() ? 47 : 48);
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.logoUrl);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.logoUrl() ? 56 : -1);
      \u0275\u0275advance(11);
      \u0275\u0275property("value", ctx.primaryColor());
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.primaryColor());
      \u0275\u0275advance(7);
      \u0275\u0275property("value", ctx.secondaryColor());
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.secondaryColor());
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.colorPresets);
      \u0275\u0275advance(15);
      \u0275\u0275twoWayProperty("ngModel", ctx.companyName);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.canDeleteCompany() ? 101 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showDeleteConfirmation() ? 102 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, ConfigHeaderComponent, MainLayoutComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=branding-config.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrandingConfigComponent, [{
    type: Component,
    args: [{ selector: "app-branding-config", standalone: true, imports: [CommonModule, FormsModule, ConfigHeaderComponent, MainLayoutComponent], template: `
    <app-main-layout>
      <app-config-header title="Minha Empresa">
        <button 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          (click)="saveConfiguration()"
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

        <!-- Preview Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-eye text-blue-500 mr-2"></i>
              Preview da Identidade Visual
            </h3>
            <p class="text-sm text-gray-600 mt-1">Veja como ficar\xE1 a apar\xEAncia do sistema</p>
          </div>
          <div class="p-6">
            <div class="border border-gray-300 rounded-lg p-6 bg-gray-50">
              <!-- Simulated Header Preview -->
              <div class="flex items-center justify-between p-4 bg-white rounded border border-gray-200 mb-4" 
                   [style.background-color]="primaryColor()">
                <div class="flex items-center space-x-3">
                  @if (logoUrl()) {
                    <img [src]="logoUrl()" alt="Logo Preview" class="h-8 w-auto">
                  } @else {
                    <div class="h-8 w-8 bg-gray-300 rounded flex items-center justify-center">
                      <i class="fas fa-image text-gray-500"></i>
                    </div>
                  }
                  <h2 class="text-lg font-semibold" [style.color]="getContrastColor(primaryColor())">
                    {{ companyName() || 'Nome da Empresa' }}
                  </h2>
                </div>
                <div class="flex space-x-2">
                  <button class="px-3 py-1 rounded text-sm font-medium"
                          [style.background-color]="secondaryColor()"
                          [style.color]="getContrastColor(secondaryColor())">
                    Bot\xE3o Secund\xE1rio
                  </button>
                  <button class="px-3 py-1 rounded text-sm font-medium text-white"
                          [style.background-color]="primaryColor()">
                    Bot\xE3o Principal
                  </button>
                </div>
              </div>
              
              <!-- Sample Content Preview -->
              <div class="bg-white rounded border border-gray-200 p-4">
                <h3 class="font-semibold mb-2" [style.color]="primaryColor()">Sample Content</h3>
                <p class="text-gray-600 text-sm mb-3">Este \xE9 um exemplo de como o conte\xFAdo aparecer\xE1 com suas cores personalizadas.</p>
                <div class="flex space-x-2">
                  <span class="px-2 py-1 rounded text-xs font-medium"
                        [style.background-color]="primaryColor() + '20'"
                        [style.color]="primaryColor()">
                    Tag Principal
                  </span>
                  <span class="px-2 py-1 rounded text-xs font-medium"
                        [style.background-color]="secondaryColor() + '20'"
                        [style.color]="secondaryColor()">
                    Tag Secund\xE1ria
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration Form -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Logo Configuration -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <i class="fas fa-image text-blue-500 mr-2"></i>
                Logo da Empresa
              </h3>
            </div>
            <div class="p-6">
              <div class="mb-6">
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                     (click)="logoInput.click()">
                  @if (logoUrl()) {
                    <img [src]="logoUrl()" alt="Logo atual" class="max-h-20 mx-auto mb-4">
                    <p class="text-sm text-gray-600">Clique para alterar o logo</p>
                  } @else {
                    <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                    <p class="text-sm text-gray-600">Clique para fazer upload do logo</p>
                    <p class="text-xs text-gray-500 mt-1">PNG, JPG ou SVG - M\xE1x. 5MB</p>
                  }
                </div>
                <input #logoInput type="file" class="hidden" accept="image/*" (change)="onLogoSelected($event)">
              </div>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">URL do Logo (opcional)</label>
                  <input
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [(ngModel)]="logoUrl"
                    (input)="logoUrl.set($any($event.target).value)"
                    placeholder="https://exemplo.com/logo.png">
                </div>
                
                @if (logoUrl()) {
                  <button 
                    class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    (click)="removeLogo()">
                    <i class="fas fa-trash mr-1"></i>
                    Remover Logo
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Color Configuration -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <i class="fas fa-palette text-blue-500 mr-2"></i>
                Cores da Empresa
              </h3>
            </div>
            <div class="p-6 space-y-4">
              <!-- Primary Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cor Principal</label>
                <div class="flex space-x-3">
                  <input
                    type="color"
                    class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    [value]="primaryColor()"
                    (input)="primaryColor.set($any($event.target).value); applyPreviewColors()">
                  <input
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [value]="primaryColor()"
                    (input)="primaryColor.set($any($event.target).value); applyPreviewColors()"
                    placeholder="#3B82F6">
                </div>
                <p class="text-xs text-gray-500 mt-1">Cor principal da interface (bot\xF5es, links, etc.)</p>
              </div>

              <!-- Secondary Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cor Secund\xE1ria</label>
                <div class="flex space-x-3">
                  <input
                    type="color"
                    class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    [value]="secondaryColor()"
                    (input)="secondaryColor.set($any($event.target).value); applyPreviewColors()">
                  <input
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [value]="secondaryColor()"
                    (input)="secondaryColor.set($any($event.target).value); applyPreviewColors()"
                    placeholder="#6B7280">
                </div>
                <p class="text-xs text-gray-500 mt-1">Cor para elementos secund\xE1rios</p>
              </div>

              <!-- Color Presets -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Paletas Sugeridas</label>
                <div class="flex space-x-2 flex-wrap gap-2">
                  @for (preset of colorPresets; track preset.name) {
                    <button
                      type="button"
                      class="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      [style.background-color]="preset.primary"
                      [title]="preset.name"
                      (click)="applyColorPreset(preset)">
                    </button>
                  }
                </div>
              </div>

              <!-- Reset Colors -->
              <div class="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  (click)="resetColors()">
                  <i class="fas fa-undo mr-1"></i>
                  Restaurar Cores Padr\xE3o
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Company Name -->
        <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-building text-blue-500 mr-2"></i>
              Informa\xE7\xF5es da Empresa
            </h3>
          </div>
          <div class="p-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                [(ngModel)]="companyName"
                (input)="companyName.set($any($event.target).value)"
                placeholder="Nome da sua empresa">
              <p class="text-xs text-gray-500 mt-1">Este nome aparecer\xE1 no cabe\xE7alho do sistema</p>
            </div>
          </div>
        </div>

        <!-- Delete Company Section (apenas para propriet\xE1rios) -->
        @if (canDeleteCompany()) {
          <div class="mt-8 bg-white rounded-lg shadow-sm border border-red-200">
            <div class="p-6 bg-red-50 rounded-t-lg border-b border-red-200">
              <h3 class="text-lg font-semibold text-red-800 flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Zona Perigosa
              </h3>
              <p class="text-sm text-red-700 mt-1">
                A exclus\xE3o da empresa \xE9 permanente e n\xE3o pode ser desfeita. Todos os dados, quadros, leads e usu\xE1rios ser\xE3o perdidos.
              </p>
            </div>
            <div class="p-6">
              <button
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                (click)="showDeleteModal()">
                <i class="fas fa-trash mr-1"></i>
                Excluir Empresa Permanentemente
              </button>
            </div>
          </div>
        }
      </div>
    </app-main-layout>

    <!-- Delete Confirmation Modal -->
    @if (showDeleteConfirmation()) {
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                Confirmar Exclus\xE3o
              </h3>
              <button
                class="text-gray-400 hover:text-gray-600"
                (click)="hideDeleteModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <strong>ATEN\xC7\xC3O:</strong> Esta a\xE7\xE3o n\xE3o pode ser desfeita!
            </div>
            
            <p class="text-sm text-gray-600 mb-4">Voc\xEA est\xE1 prestes a excluir permanentemente:</p>
            <ul class="text-sm text-gray-600 mb-4 list-disc list-inside">
              <li>Empresa: <strong>{{ currentCompany()?.name }}</strong></li>
              <li>Todos os quadros e leads</li>
              <li>Todos os usu\xE1rios associados</li>
              <li>Todas as configura\xE7\xF5es e dados</li>
            </ul>
            
            <p class="text-sm text-gray-600 mb-4">
              Para confirmar, digite <strong>{{ currentCompany()?.name }}</strong> abaixo:
            </p>
            
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 mb-4"
              [(ngModel)]="deleteConfirmation"
              [value]="deleteConfirmation()"
              (input)="deleteConfirmation.set($any($event.target).value)"
              placeholder="Nome da empresa">
            
            @if (deleteError()) {
              <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ deleteError() }}
              </div>
            }
            
            <div class="flex space-x-3">
              <button
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                (click)="hideDeleteModal()"
                [disabled]="deleteLoading()">
                Cancelar
              </button>
              <button
                class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                (click)="deleteCompany()"
                [disabled]="deleteLoading() || deleteConfirmation() !== currentCompany()?.name">
                @if (deleteLoading()) {
                  <i class="fas fa-spinner fa-spin mr-1"></i>
                  Excluindo...
                } @else {
                  <i class="fas fa-trash mr-1"></i>
                  Excluir Permanentemente
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `, styles: ["/* angular:styles/component:scss;219558ef63f119a92210704329b58a3cdceaa4fb296db559e672f74512827dc7;/Users/geovanelopes/Documents/GitHub/kanban-angular-saas/src/app/components/branding-config/branding-config.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=branding-config.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BrandingConfigComponent, { className: "BrandingConfigComponent", filePath: "src/app/components/branding-config/branding-config.component.ts", lineNumber: 361 });
})();
export {
  BrandingConfigComponent
};
//# sourceMappingURL=chunk-SFZLUA56.js.map
