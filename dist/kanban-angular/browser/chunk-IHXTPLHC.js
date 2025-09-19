import {
  ConfigHeaderComponent
} from "./chunk-BZTML4PP.js";
import {
  SmtpService
} from "./chunk-7QBO7AZP.js";
import "./chunk-CPSVUG3M.js";
import {
  MainLayoutComponent
} from "./chunk-BGRXE4K2.js";
import "./chunk-VURM7YH2.js";
import {
  ToastService
} from "./chunk-RDMWVNUM.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NumberValueAccessor,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-2S4XXET5.js";
import "./chunk-L3ANR23A.js";
import {
  AuthService,
  CompanyService,
  SubdomainService
} from "./chunk-NDNGZ4HQ.js";
import {
  CommonModule,
  Component,
  __async,
  __name,
  __publicField,
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
  ɵɵpureFunction0,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-GMR7JISZ.js";

// src/app/components/smtp-config/smtp-config.component.ts
var _c0 = /* @__PURE__ */ __name(() => ({ standalone: true }), "_c0");
function SmtpConfigComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 54);
    \u0275\u0275text(1, " Salvando... ");
  }
}
__name(SmtpConfigComponent_Conditional_4_Template, "SmtpConfigComponent_Conditional_4_Template");
function SmtpConfigComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 55);
    \u0275\u0275text(1, " Salvar Configura\xE7\xF5es ");
  }
}
__name(SmtpConfigComponent_Conditional_5_Template, "SmtpConfigComponent_Conditional_5_Template");
function SmtpConfigComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "i", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage(), " ");
  }
}
__name(SmtpConfigComponent_Conditional_7_Template, "SmtpConfigComponent_Conditional_7_Template");
function SmtpConfigComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "i", 57);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
__name(SmtpConfigComponent_Conditional_8_Template, "SmtpConfigComponent_Conditional_8_Template");
function SmtpConfigComponent_Conditional_72_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 54);
    \u0275\u0275text(1, " Enviando... ");
  }
}
__name(SmtpConfigComponent_Conditional_72_Template, "SmtpConfigComponent_Conditional_72_Template");
function SmtpConfigComponent_Conditional_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 58);
    \u0275\u0275text(1, " Testar ");
  }
}
__name(SmtpConfigComponent_Conditional_73_Template, "SmtpConfigComponent_Conditional_73_Template");
var _SmtpConfigComponent = class _SmtpConfigComponent {
  fb = inject(FormBuilder);
  companyService = inject(CompanyService);
  subdomainService = inject(SubdomainService);
  smtpService = inject(SmtpService);
  authService = inject(AuthService);
  toast = inject(ToastService);
  smtpForm;
  currentCompany = signal(null, ...ngDevMode ? [{ debugName: "currentCompany" }] : []);
  isSaving = signal(false, ...ngDevMode ? [{ debugName: "isSaving" }] : []);
  isTesting = signal(false, ...ngDevMode ? [{ debugName: "isTesting" }] : []);
  testEmail = "";
  successMessage = signal(null, ...ngDevMode ? [{ debugName: "successMessage" }] : []);
  errorMessage = signal(null, ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
  constructor() {
    this.smtpForm = this.fb.group({
      host: ["smtp.sendgrid.net", Validators.required],
      port: [587, [Validators.required, Validators.min(1), Validators.max(65535)]],
      secure: [true],
      user: ["apikey", [Validators.required]],
      password: ["", Validators.required],
      fromName: ["", Validators.required],
      fromEmail: ["", [Validators.required, Validators.email]]
    });
  }
  ngOnInit() {
    this.loadCurrentConfiguration(true);
  }
  loadCurrentConfiguration(forceFetch = false) {
    const existing = this.subdomainService.getCurrentCompany();
    const hydrateForm = /* @__PURE__ */ __name((company) => {
      this.currentCompany.set(company);
      if (company?.smtpConfig) {
        this.smtpForm.patchValue({
          host: company.smtpConfig.host || this.smtpForm.get("host")?.value,
          port: company.smtpConfig.port || this.smtpForm.get("port")?.value,
          secure: company.smtpConfig.secure !== void 0 ? company.smtpConfig.secure : this.smtpForm.get("secure")?.value,
          user: company.smtpConfig.user || this.smtpForm.get("user")?.value,
          password: company.smtpConfig.password || this.smtpForm.get("password")?.value || "",
          fromName: company.smtpConfig.fromName || this.smtpForm.get("fromName")?.value,
          fromEmail: company.smtpConfig.fromEmail || this.smtpForm.get("fromEmail")?.value
        }, { emitEvent: false });
      }
    }, "hydrateForm");
    if (existing && !forceFetch) {
      hydrateForm(existing);
      return;
    }
    (() => __async(this, null, function* () {
      let company = existing || null;
      try {
        const sub = this.companyService.getCompanySubdomain();
        if (sub)
          company = yield this.companyService.getCompanyBySubdomain(sub);
      } catch {
      }
      if (!company) {
        try {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser?.email)
            company = yield this.companyService.getCompanyByUserEmail(currentUser.email);
        } catch {
        }
      }
      if (company) {
        this.subdomainService.setCurrentCompany(company);
        hydrateForm(company);
      }
    }))();
  }
  saveConfiguration() {
    return __async(this, null, function* () {
      this.markAllFieldsAsTouched();
      if (this.smtpForm.invalid) {
        this.showError("Por favor, preencha todos os campos obrigat\xF3rios corretamente.");
        return;
      }
      let company = this.currentCompany();
      if (!company?.id) {
        yield new Promise((resolve) => {
          this.loadCurrentConfiguration(true);
          setTimeout(resolve, 500);
        });
        company = this.currentCompany();
      }
      if (!company?.id) {
        this.showError("Empresa n\xE3o encontrada");
        return;
      }
      this.isSaving.set(true);
      this.clearMessages();
      try {
        const formValue = this.smtpForm.value;
        const smtpConfig = {
          host: String(formValue.host || this.currentCompany()?.smtpConfig?.host || ""),
          port: Number(formValue.port || this.currentCompany()?.smtpConfig?.port || 587),
          secure: Boolean(formValue.secure ?? this.currentCompany()?.smtpConfig?.secure ?? true),
          user: String(formValue.user || this.currentCompany()?.smtpConfig?.user || ""),
          password: String((formValue.password ?? "").toString().trim() || this.currentCompany()?.smtpConfig?.password || ""),
          fromName: String(formValue.fromName || this.currentCompany()?.smtpConfig?.fromName || ""),
          fromEmail: String(formValue.fromEmail || this.currentCompany()?.smtpConfig?.fromEmail || "")
        };
        const updatedCompany = {
          smtpConfig
        };
        yield this.companyService.updateCompany(company.id, updatedCompany);
        this.loadCurrentConfiguration(true);
        this.showSuccess("Configura\xE7\xF5es SMTP salvas com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar configura\xE7\xF5es SMTP:", error);
        this.showError("Erro ao salvar configura\xE7\xF5es: " + (error?.message || "Tente novamente."));
      } finally {
        this.isSaving.set(false);
      }
    });
  }
  sendTestEmail() {
    return __async(this, null, function* () {
      if (!this.testEmail || this.smtpForm.invalid) {
        this.showError("Por favor, preencha um email v\xE1lido e complete todas as configura\xE7\xF5es.");
        return;
      }
      if (this.smtpForm.dirty) {
        yield this.saveConfiguration();
        yield new Promise((resolve) => setTimeout(resolve, 1e3));
      }
      this.isTesting.set(true);
      this.clearMessages();
      try {
        const testEmailData = {
          to: this.testEmail,
          subject: `Teste SMTP - ${this.currentCompany()?.name || "Sistema"}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: ${this.getPrimaryColor()};">\u2705 Teste de Configura\xE7\xE3o SMTP</h2>
            <p>Parab\xE9ns! Sua configura\xE7\xE3o SMTP est\xE1 funcionando corretamente.</p>
            <p><strong>Empresa:</strong> ${this.currentCompany()?.name}</p>
            <p><strong>Email enviado para:</strong> ${this.testEmail}</p>
            <p><strong>Data/Hora:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid ${this.getPrimaryColor()}; margin: 20px 0;">
              <strong>Configura\xE7\xF5es utilizadas:</strong><br>
              Host: ${this.smtpForm.get("host")?.value}<br>
              Porta: ${this.smtpForm.get("port")?.value}<br>
              Seguro: ${this.smtpForm.get("secure")?.value ? "Sim" : "N\xE3o"}<br>
              Remetente: ${this.smtpForm.get("fromName")?.value} &lt;${this.smtpForm.get("fromEmail")?.value}&gt;
            </div>
            <p style="color: #28a745; font-weight: bold;">\u{1F389} Sistema de emails configurado com sucesso!</p>
          </div>
        `
        };
        console.log("\u{1F9EA} Enviando email de teste via SmtpService...");
        const result = yield this.smtpService.sendEmail(testEmailData).toPromise();
        if (result?.success) {
          this.showSuccess(`Email de teste enviado com sucesso para ${this.testEmail}.`);
        } else {
          throw new Error(result?.error || "Falha no envio do email");
        }
      } catch (error) {
        console.error("\u274C Erro ao enviar email de teste:", error);
        let errorMsg = "Erro ao enviar email de teste.";
        if (error?.error) {
          errorMsg = error.error;
        } else if (error?.message) {
          if (error.message.includes("API Key") || error.message.includes("401")) {
            errorMsg = "API Key do SendGrid inv\xE1lida. Verifique se a chave est\xE1 correta.";
          } else if (error.message.includes("configura\xE7\xE3o") || error.message.includes("incompleta")) {
            errorMsg = "Configura\xE7\xE3o SMTP incompleta. Preencha todos os campos.";
          } else {
            errorMsg = `Erro: ${error.message}`;
          }
        }
        this.showError(errorMsg);
      } finally {
        this.isTesting.set(false);
      }
    });
  }
  showSuccess(message) {
    try {
      this.toast.success(message);
    } catch {
    }
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
  showError(message) {
    try {
      this.toast.error(message);
    } catch {
    }
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
  clearMessages() {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
  getFormErrors() {
    const errors = {};
    Object.keys(this.smtpForm.controls).forEach((key) => {
      const control = this.smtpForm.get(key);
      if (control && !control.valid && control.touched) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
  markAllFieldsAsTouched() {
    Object.keys(this.smtpForm.controls).forEach((key) => {
      this.smtpForm.get(key)?.markAsTouched();
    });
  }
  getPrimaryColor() {
    const company = this.subdomainService.getCurrentCompany();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || "#3B82F6";
  }
};
__name(_SmtpConfigComponent, "SmtpConfigComponent");
__publicField(_SmtpConfigComponent, "\u0275fac", /* @__PURE__ */ __name(function SmtpConfigComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SmtpConfigComponent)();
}, "SmtpConfigComponent_Factory"));
__publicField(_SmtpConfigComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SmtpConfigComponent, selectors: [["app-smtp-config"]], decls: 181, vars: 19, consts: [["title", "Configura\xE7\xE3o SMTP"], [1, "flex", "items-center", "space-x-3"], [1, "bg-green-500", "hover:bg-green-600", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-8"], [1, "mb-6", "p-4", "bg-green-50", "border", "border-green-200", "rounded-lg", "text-green-800"], [1, "mb-6", "p-4", "bg-red-50", "border", "border-red-200", "rounded-lg", "text-red-800"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "p-6", "border-b", "border-gray-200"], [1, "text-lg", "font-semibold", "text-gray-900", "flex", "items-center"], [1, "fas", "fa-envelope", "text-blue-500", "mr-2"], [1, "text-sm", "text-gray-600", "mt-1"], [1, "p-6"], [1, "space-y-6", 3, "ngSubmit", "formGroup"], [1, "grid", "grid-cols-1", "lg:grid-cols-4", "gap-4"], [1, "lg:col-span-3"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-2"], ["type", "text", "formControlName", "host", "placeholder", "smtp.sendgrid.net"], [1, "text-xs", "text-gray-500", "mt-1"], ["type", "number", "formControlName", "port", "placeholder", "587", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-4"], ["type", "text", "formControlName", "user", "placeholder", "apikey"], ["type", "password", "formControlName", "password", "placeholder", "SG.xxxxxxxxxx..."], ["type", "text", "formControlName", "fromName", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "placeholder"], ["type", "email", "formControlName", "fromEmail", "placeholder", "noreply@suaempresa.com", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500"], [1, "space-y-3"], [1, "text-md", "font-medium", "text-gray-900"], [1, "flex", "items-center"], ["type", "checkbox", "formControlName", "secure", "id", "secureConnection", 1, "h-4", "w-4", "text-blue-600", "border-gray-300", "rounded", "focus:ring-blue-500"], ["for", "secureConnection", 1, "ml-2", "text-sm", "text-gray-700"], [1, "text-xs", "text-gray-500"], [1, "pt-6", "border-t", "border-gray-200"], [1, "text-md", "font-medium", "text-gray-900", "mb-4"], [1, "flex", "space-x-3"], ["type", "email", "placeholder", "seu-email@exemplo.com", 1, "flex-1", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "ngModelChange", "ngModel", "ngModelOptions"], ["type", "button", 1, "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click", "disabled"], [1, "text-xs", "text-gray-500", "mt-2"], [1, "mt-8", "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "fas", "fa-question-circle", "text-blue-500", "mr-2"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6"], [1, "border", "border-green-200", "rounded-lg", "p-4", "bg-green-50"], [1, "flex", "items-center", "mb-3"], [1, "w-8", "h-8", "bg-green-500", "rounded", "flex", "items-center", "justify-center"], [1, "fas", "fa-paper-plane", "text-white", "text-sm"], [1, "ml-3", "text-sm", "font-semibold", "text-gray-900"], [1, "ml-2", "px-2", "py-1", "bg-green-100", "text-green-800", "text-xs", "rounded"], [1, "text-xs", "text-gray-600", "space-y-1"], [1, "text-green-700"], [1, "border", "border-gray-200", "rounded-lg", "p-4"], [1, "w-8", "h-8", "bg-red-500", "rounded", "flex", "items-center", "justify-center"], [1, "fab", "fa-google", "text-white", "text-sm"], [1, "w-8", "h-8", "bg-blue-500", "rounded", "flex", "items-center", "justify-center"], [1, "fab", "fa-microsoft", "text-white", "text-sm"], [1, "w-8", "h-8", "bg-gray-500", "rounded", "flex", "items-center", "justify-center"], [1, "fas", "fa-server", "text-white", "text-sm"], [1, "fas", "fa-spinner", "fa-spin", "mr-1"], [1, "fas", "fa-save", "mr-1"], [1, "fas", "fa-check-circle", "mr-2"], [1, "fas", "fa-exclamation-circle", "mr-2"], [1, "fas", "fa-paper-plane", "mr-1"]], template: /* @__PURE__ */ __name(function SmtpConfigComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-main-layout")(1, "app-config-header", 0)(2, "div", 1)(3, "button", 2);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function SmtpConfigComponent_Template_button_click_3_listener() {
      return ctx.saveConfiguration();
    }, "SmtpConfigComponent_Template_button_click_3_listener"));
    \u0275\u0275conditionalCreate(4, SmtpConfigComponent_Conditional_4_Template, 2, 0)(5, SmtpConfigComponent_Conditional_5_Template, 2, 0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "div", 3);
    \u0275\u0275conditionalCreate(7, SmtpConfigComponent_Conditional_7_Template, 3, 1, "div", 4);
    \u0275\u0275conditionalCreate(8, SmtpConfigComponent_Conditional_8_Template, 3, 1, "div", 5);
    \u0275\u0275elementStart(9, "div", 6)(10, "div", 7)(11, "h3", 8);
    \u0275\u0275element(12, "i", 9);
    \u0275\u0275text(13, " Configura\xE7\xE3o do Servidor SMTP ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 10);
    \u0275\u0275text(15, "Configure o servidor de email para sua empresa enviar notifica\xE7\xF5es");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 11)(17, "form", 12);
    \u0275\u0275listener("ngSubmit", /* @__PURE__ */ __name(function SmtpConfigComponent_Template_form_ngSubmit_17_listener() {
      return ctx.saveConfiguration();
    }, "SmtpConfigComponent_Template_form_ngSubmit_17_listener"));
    \u0275\u0275elementStart(18, "div", 13)(19, "div", 14)(20, "label", 15);
    \u0275\u0275text(21, " Servidor SMTP * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(22, "input", 16);
    \u0275\u0275elementStart(23, "p", 17);
    \u0275\u0275text(24, "Endere\xE7o do servidor SMTP");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div")(26, "label", 15);
    \u0275\u0275text(27, " Porta * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "input", 18);
    \u0275\u0275elementStart(29, "p", 17);
    \u0275\u0275text(30, "Porta SMTP");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "div", 19)(32, "div")(33, "label", 15);
    \u0275\u0275text(34, " Usu\xE1rio * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(35, "input", 20);
    \u0275\u0275elementStart(36, "p", 17);
    \u0275\u0275text(37, 'Para SendGrid, use sempre "apikey"');
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div")(39, "label", 15);
    \u0275\u0275text(40, " Senha * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(41, "input", 21);
    \u0275\u0275elementStart(42, "p", 17);
    \u0275\u0275text(43, "API Key do SendGrid (come\xE7a com SG.)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(44, "div", 19)(45, "div")(46, "label", 15);
    \u0275\u0275text(47, " Nome do Remetente * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(48, "input", 22);
    \u0275\u0275elementStart(49, "p", 17);
    \u0275\u0275text(50, "Nome que aparecer\xE1 nos emails enviados");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(51, "div")(52, "label", 15);
    \u0275\u0275text(53, " Email do Remetente * ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(54, "input", 23);
    \u0275\u0275elementStart(55, "p", 17);
    \u0275\u0275text(56, "Email que aparecer\xE1 como remetente");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(57, "div", 24)(58, "h4", 25);
    \u0275\u0275text(59, "Op\xE7\xF5es de Seguran\xE7a");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "div", 26);
    \u0275\u0275element(61, "input", 27);
    \u0275\u0275elementStart(62, "label", 28);
    \u0275\u0275text(63, " Usar conex\xE3o segura (SSL/TLS) ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "p", 29);
    \u0275\u0275text(65, "Recomendado para a maioria dos provedores de email");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "div", 30)(67, "h4", 31);
    \u0275\u0275text(68, "Testar Configura\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "div", 32)(70, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", /* @__PURE__ */ __name(function SmtpConfigComponent_Template_input_ngModelChange_70_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.testEmail, $event) || (ctx.testEmail = $event);
      return $event;
    }, "SmtpConfigComponent_Template_input_ngModelChange_70_listener"));
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "button", 34);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function SmtpConfigComponent_Template_button_click_71_listener() {
      return ctx.sendTestEmail();
    }, "SmtpConfigComponent_Template_button_click_71_listener"));
    \u0275\u0275conditionalCreate(72, SmtpConfigComponent_Conditional_72_Template, 2, 0)(73, SmtpConfigComponent_Conditional_73_Template, 2, 0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(74, "p", 35);
    \u0275\u0275text(75, "Envie um email de teste para verificar se a configura\xE7\xE3o est\xE1 funcionando");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(76, "div", 36)(77, "div", 7)(78, "h3", 8);
    \u0275\u0275element(79, "i", 37);
    \u0275\u0275text(80, " Guias de Configura\xE7\xE3o R\xE1pida ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(81, "div", 11)(82, "div", 38)(83, "div", 39)(84, "div", 40)(85, "div", 41);
    \u0275\u0275element(86, "i", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "h4", 43);
    \u0275\u0275text(88, "SendGrid (Recomendado)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(89, "span", 44);
    \u0275\u0275text(90, "Configurado");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(91, "div", 45)(92, "p")(93, "strong");
    \u0275\u0275text(94, "Servidor:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(95, " smtp.sendgrid.net");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(96, "p")(97, "strong");
    \u0275\u0275text(98, "Porta:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(99, " 587");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "p")(101, "strong");
    \u0275\u0275text(102, "Usu\xE1rio:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(103, " apikey");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "p")(105, "strong");
    \u0275\u0275text(106, "Senha:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(107, " Sua API Key do SendGrid");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(108, "p", 46)(109, "strong");
    \u0275\u0275text(110, "\u2713");
    \u0275\u0275elementEnd();
    \u0275\u0275text(111, " Maior taxa de entrega");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(112, "div", 47)(113, "div", 40)(114, "div", 48);
    \u0275\u0275element(115, "i", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(116, "h4", 43);
    \u0275\u0275text(117, "Gmail");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(118, "div", 45)(119, "p")(120, "strong");
    \u0275\u0275text(121, "Servidor:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(122, " smtp.gmail.com");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(123, "p")(124, "strong");
    \u0275\u0275text(125, "Porta:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(126, " 587");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(127, "p")(128, "strong");
    \u0275\u0275text(129, "Seguro:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(130, " Sim");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(131, "p")(132, "strong");
    \u0275\u0275text(133, "Senha:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(134, " App Password necess\xE1ria");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(135, "div", 47)(136, "div", 40)(137, "div", 50);
    \u0275\u0275element(138, "i", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(139, "h4", 43);
    \u0275\u0275text(140, "Outlook");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(141, "div", 45)(142, "p")(143, "strong");
    \u0275\u0275text(144, "Servidor:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(145, " smtp-mail.outlook.com");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(146, "p")(147, "strong");
    \u0275\u0275text(148, "Porta:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(149, " 587");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(150, "p")(151, "strong");
    \u0275\u0275text(152, "Seguro:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(153, " Sim");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(154, "p")(155, "strong");
    \u0275\u0275text(156, "Auth:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(157, " STARTTLS");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(158, "div", 47)(159, "div", 40)(160, "div", 52);
    \u0275\u0275element(161, "i", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(162, "h4", 43);
    \u0275\u0275text(163, "Outros");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(164, "div", 45)(165, "p")(166, "strong");
    \u0275\u0275text(167, "Porta 25:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(168, " N\xE3o segura");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(169, "p")(170, "strong");
    \u0275\u0275text(171, "Porta 465:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(172, " SSL");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(173, "p")(174, "strong");
    \u0275\u0275text(175, "Porta 587:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(176, " TLS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(177, "p")(178, "strong");
    \u0275\u0275text(179, "Porta 2525:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(180, " Alternativa");
    \u0275\u0275elementEnd()()()()()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx.isSaving());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.isSaving() ? 4 : 5);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx.successMessage() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.errorMessage() ? 8 : -1);
    \u0275\u0275advance(9);
    \u0275\u0275property("formGroup", ctx.smtpForm);
    \u0275\u0275advance(5);
    \u0275\u0275classMap("w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 " + (((tmp_5_0 = ctx.smtpForm.get("host")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx.smtpForm.get("host")) == null ? null : tmp_5_0.touched) ? "border-red-300 bg-red-50" : "border-gray-300"));
    \u0275\u0275advance(13);
    \u0275\u0275classMap("w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 " + (((tmp_6_0 = ctx.smtpForm.get("user")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx.smtpForm.get("user")) == null ? null : tmp_6_0.touched) ? "border-red-300 bg-red-50" : "border-gray-300"));
    \u0275\u0275advance(6);
    \u0275\u0275classMap("w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 " + (((tmp_7_0 = ctx.smtpForm.get("password")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx.smtpForm.get("password")) == null ? null : tmp_7_0.touched) ? "border-red-300 bg-red-50" : "border-gray-300"));
    \u0275\u0275advance(7);
    \u0275\u0275property("placeholder", ((tmp_8_0 = ctx.currentCompany()) == null ? null : tmp_8_0.name) || "Nome da Empresa");
    \u0275\u0275advance(22);
    \u0275\u0275twoWayProperty("ngModel", ctx.testEmail);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(18, _c0));
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx.getPrimaryColor());
    \u0275\u0275property("disabled", ctx.isTesting() || !ctx.testEmail || ctx.smtpForm.invalid);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.isTesting() ? 72 : 73);
  }
}, "SmtpConfigComponent_Template"), dependencies: [CommonModule, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, FormsModule, NgModel, ConfigHeaderComponent, MainLayoutComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=smtp-config.component.css.map */"] }));
var SmtpConfigComponent = _SmtpConfigComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SmtpConfigComponent, [{
    type: Component,
    args: [{ selector: "app-smtp-config", standalone: true, imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfigHeaderComponent, MainLayoutComponent], template: `
    <app-main-layout>
      <app-config-header title="Configura\xE7\xE3o SMTP">
        <div class="flex items-center space-x-3">
          <button 
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
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

        <!-- SMTP Configuration Form -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-envelope text-blue-500 mr-2"></i>
              Configura\xE7\xE3o do Servidor SMTP
            </h3>
            <p class="text-sm text-gray-600 mt-1">Configure o servidor de email para sua empresa enviar notifica\xE7\xF5es</p>
          </div>
          
          <div class="p-6">
            <form [formGroup]="smtpForm" (ngSubmit)="saveConfiguration()" class="space-y-6">
              <!-- Server Configuration -->
              <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div class="lg:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Servidor SMTP *
                  </label>
                  <input
                    type="text"
                    formControlName="host"
                    [class]="'w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ' + 
                            (smtpForm.get('host')?.invalid && smtpForm.get('host')?.touched ? 
                             'border-red-300 bg-red-50' : 'border-gray-300')"
                    placeholder="smtp.sendgrid.net">
                  <p class="text-xs text-gray-500 mt-1">Endere\xE7o do servidor SMTP</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Porta *
                  </label>
                  <input
                    type="number"
                    formControlName="port"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="587">
                  <p class="text-xs text-gray-500 mt-1">Porta SMTP</p>
                </div>
              </div>

              <!-- Authentication -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Usu\xE1rio *
                  </label>
                  <input
                    type="text"
                    formControlName="user"
                    [class]="'w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ' + 
                            (smtpForm.get('user')?.invalid && smtpForm.get('user')?.touched ? 
                             'border-red-300 bg-red-50' : 'border-gray-300')"
                    placeholder="apikey">
                  <p class="text-xs text-gray-500 mt-1">Para SendGrid, use sempre "apikey"</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    formControlName="password"
                    [class]="'w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ' + 
                            (smtpForm.get('password')?.invalid && smtpForm.get('password')?.touched ? 
                             'border-red-300 bg-red-50' : 'border-gray-300')"
                    placeholder="SG.xxxxxxxxxx...">
                  <p class="text-xs text-gray-500 mt-1">API Key do SendGrid (come\xE7a com SG.)</p>
                </div>
              </div>

              <!-- Sender Information -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Remetente *
                  </label>
                  <input
                    type="text"
                    formControlName="fromName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [placeholder]="currentCompany()?.name || 'Nome da Empresa'">
                  <p class="text-xs text-gray-500 mt-1">Nome que aparecer\xE1 nos emails enviados</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email do Remetente *
                  </label>
                  <input
                    type="email"
                    formControlName="fromEmail"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="noreply@suaempresa.com">
                  <p class="text-xs text-gray-500 mt-1">Email que aparecer\xE1 como remetente</p>
                </div>
              </div>

              <!-- Security Options -->
              <div class="space-y-3">
                <h4 class="text-md font-medium text-gray-900">Op\xE7\xF5es de Seguran\xE7a</h4>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    formControlName="secure"
                    id="secureConnection"
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                  <label for="secureConnection" class="ml-2 text-sm text-gray-700">
                    Usar conex\xE3o segura (SSL/TLS)
                  </label>
                </div>
                <p class="text-xs text-gray-500">Recomendado para a maioria dos provedores de email</p>
              </div>

              <!-- Test Email Section -->
              <div class="pt-6 border-t border-gray-200">
                <h4 class="text-md font-medium text-gray-900 mb-4">Testar Configura\xE7\xE3o</h4>
                <div class="flex space-x-3">
                  <input
                    type="email"
                    [(ngModel)]="testEmail"
                    [ngModelOptions]="{standalone: true}"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu-email@exemplo.com">
                  <button
                    type="button"
                    class="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    [style.background-color]="getPrimaryColor()"
                    (click)="sendTestEmail()"
                    [disabled]="isTesting() || !testEmail || smtpForm.invalid">
                    @if (isTesting()) {
                      <i class="fas fa-spinner fa-spin mr-1"></i>
                      Enviando...
                    } @else {
                      <i class="fas fa-paper-plane mr-1"></i>
                      Testar
                    }
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">Envie um email de teste para verificar se a configura\xE7\xE3o est\xE1 funcionando</p>
              </div>
            </form>
          </div>
        </div>

        <!-- Quick Setup Guides -->
        <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-question-circle text-blue-500 mr-2"></i>
              Guias de Configura\xE7\xE3o R\xE1pida
            </h3>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- SendGrid (Recomendado) -->
              <div class="border border-green-200 rounded-lg p-4 bg-green-50">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <i class="fas fa-paper-plane text-white text-sm"></i>
                  </div>
                  <h4 class="ml-3 text-sm font-semibold text-gray-900">SendGrid (Recomendado)</h4>
                  <span class="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Configurado</span>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Servidor:</strong> smtp.sendgrid.net</p>
                  <p><strong>Porta:</strong> 587</p>
                  <p><strong>Usu\xE1rio:</strong> apikey</p>
                  <p><strong>Senha:</strong> Sua API Key do SendGrid</p>
                  <p class="text-green-700"><strong>\u2713</strong> Maior taxa de entrega</p>
                </div>
              </div>

              <!-- Gmail -->
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <i class="fab fa-google text-white text-sm"></i>
                  </div>
                  <h4 class="ml-3 text-sm font-semibold text-gray-900">Gmail</h4>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Servidor:</strong> smtp.gmail.com</p>
                  <p><strong>Porta:</strong> 587</p>
                  <p><strong>Seguro:</strong> Sim</p>
                  <p><strong>Senha:</strong> App Password necess\xE1ria</p>
                </div>
              </div>

              <!-- Outlook -->
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <i class="fab fa-microsoft text-white text-sm"></i>
                  </div>
                  <h4 class="ml-3 text-sm font-semibold text-gray-900">Outlook</h4>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Servidor:</strong> smtp-mail.outlook.com</p>
                  <p><strong>Porta:</strong> 587</p>
                  <p><strong>Seguro:</strong> Sim</p>
                  <p><strong>Auth:</strong> STARTTLS</p>
                </div>
              </div>

              <!-- Generic -->
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
                    <i class="fas fa-server text-white text-sm"></i>
                  </div>
                  <h4 class="ml-3 text-sm font-semibold text-gray-900">Outros</h4>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <p><strong>Porta 25:</strong> N\xE3o segura</p>
                  <p><strong>Porta 465:</strong> SSL</p>
                  <p><strong>Porta 587:</strong> TLS</p>
                  <p><strong>Porta 2525:</strong> Alternativa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: ["/* angular:styles/component:scss;219558ef63f119a92210704329b58a3cdceaa4fb296db559e672f74512827dc7;/Users/geovanelopes/Documents/GitHub/kanban-angular-saas/src/app/components/smtp-config/smtp-config.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=smtp-config.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SmtpConfigComponent, { className: "SmtpConfigComponent", filePath: "src/app/components/smtp-config/smtp-config.component.ts", lineNumber: 286 });
})();
export {
  SmtpConfigComponent
};
//# sourceMappingURL=chunk-IHXTPLHC.js.map
