import {
  ActivatedRoute,
  DefaultValueAccessor,
  FormsModule,
  MinLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  Router,
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
  NgIf,
  __async,
  __name,
  __publicField,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-GMR7JISZ.js";

// src/app/components/invite-accept/invite-accept.component.ts
function InviteAcceptComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13);
    \u0275\u0275element(1, "img", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.company().brandingConfig.logo, \u0275\u0275sanitizeUrl)("alt", ctx_r0.company().name);
  }
}
__name(InviteAcceptComponent_div_3_Template, "InviteAcceptComponent_div_3_Template");
function InviteAcceptComponent_p_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 15);
    \u0275\u0275text(1, " Voc\xEA foi convidado para participar da ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.company().name);
  }
}
__name(InviteAcceptComponent_p_6_Template, "InviteAcceptComponent_p_6_Template");
function InviteAcceptComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "div", 16);
    \u0275\u0275elementStart(2, "p", 17);
    \u0275\u0275text(3, "Carregando...");
    \u0275\u0275elementEnd()();
  }
}
__name(InviteAcceptComponent_div_7_Template, "InviteAcceptComponent_div_7_Template");
function InviteAcceptComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19)(2, "div", 20);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 21);
    \u0275\u0275element(4, "path", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "div", 23)(6, "p", 24);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 25)(9, "button", 26);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function InviteAcceptComponent_div_8_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToLogin());
    }, "InviteAcceptComponent_div_8_Template_button_click_9_listener"));
    \u0275\u0275text(10, " Ir para Login ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
__name(InviteAcceptComponent_div_8_Template, "InviteAcceptComponent_div_8_Template");
function InviteAcceptComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 19)(2, "div", 20);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 28);
    \u0275\u0275element(4, "path", 29);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "div", 23)(6, "p", 30);
    \u0275\u0275text(7, " Convite aceito com sucesso! Redirecionando para o dashboard... ");
    \u0275\u0275elementEnd()()()();
  }
}
__name(InviteAcceptComponent_div_9_Template, "InviteAcceptComponent_div_9_Template");
function InviteAcceptComponent_form_10_span_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 45);
    \u0275\u0275element(1, "div", 46);
    \u0275\u0275elementEnd();
  }
}
__name(InviteAcceptComponent_form_10_span_22_Template, "InviteAcceptComponent_form_10_span_22_Template");
function InviteAcceptComponent_form_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 31);
    \u0275\u0275listener("ngSubmit", /* @__PURE__ */ __name(function InviteAcceptComponent_form_10_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.acceptInvite());
    }, "InviteAcceptComponent_form_10_Template_form_ngSubmit_0_listener"));
    \u0275\u0275elementStart(1, "div", 32)(2, "div")(3, "label", 33);
    \u0275\u0275text(4, " Email ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "input", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "label", 35);
    \u0275\u0275text(8, " Nome completo ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 36);
    \u0275\u0275listener("ngModelChange", /* @__PURE__ */ __name(function InviteAcceptComponent_form_10_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.displayName.set($event));
    }, "InviteAcceptComponent_form_10_Template_input_ngModelChange_9_listener"));
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div")(11, "label", 37);
    \u0275\u0275text(12, " Senha ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 38);
    \u0275\u0275listener("ngModelChange", /* @__PURE__ */ __name(function InviteAcceptComponent_form_10_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.password.set($event));
    }, "InviteAcceptComponent_form_10_Template_input_ngModelChange_13_listener"));
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 39);
    \u0275\u0275text(15, "M\xEDnimo de 6 caracteres");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "label", 40);
    \u0275\u0275text(18, " Confirmar senha ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "input", 41);
    \u0275\u0275listener("ngModelChange", /* @__PURE__ */ __name(function InviteAcceptComponent_form_10_Template_input_ngModelChange_19_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmPassword.set($event));
    }, "InviteAcceptComponent_form_10_Template_input_ngModelChange_19_listener"));
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div")(21, "button", 42);
    \u0275\u0275template(22, InviteAcceptComponent_form_10_span_22_Template, 2, 0, "span", 43);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 2)(25, "p", 15);
    \u0275\u0275text(26, " J\xE1 possui uma conta? ");
    \u0275\u0275elementStart(27, "button", 44);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function InviteAcceptComponent_form_10_Template_button_click_27_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.goToLogin());
    }, "InviteAcceptComponent_form_10_Template_button_click_27_listener"));
    \u0275\u0275text(28, " Fazer login ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r0.userEmail());
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r0.displayName());
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r0.password());
    \u0275\u0275advance(6);
    \u0275\u0275property("ngModel", ctx_r0.confirmPassword());
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-color", ctx_r0.getPrimaryColor());
    \u0275\u0275property("disabled", ctx_r0.loading());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.loading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.loading() ? "Criando conta..." : "Aceitar convite e criar conta", " ");
  }
}
__name(InviteAcceptComponent_form_10_Template, "InviteAcceptComponent_form_10_Template");
var _InviteAcceptComponent = class _InviteAcceptComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  companyService = inject(CompanyService);
  authService = inject(AuthService);
  subdomainService = inject(SubdomainService);
  // State
  inviteToken = signal(null, ...ngDevMode ? [{ debugName: "inviteToken" }] : []);
  companyId = signal(null, ...ngDevMode ? [{ debugName: "companyId" }] : []);
  company = signal(null, ...ngDevMode ? [{ debugName: "company" }] : []);
  userEmail = signal(null, ...ngDevMode ? [{ debugName: "userEmail" }] : []);
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
  error = signal(null, ...ngDevMode ? [{ debugName: "error" }] : []);
  success = signal(false, ...ngDevMode ? [{ debugName: "success" }] : []);
  // Form
  displayName = signal("", ...ngDevMode ? [{ debugName: "displayName" }] : []);
  password = signal("", ...ngDevMode ? [{ debugName: "password" }] : []);
  confirmPassword = signal("", ...ngDevMode ? [{ debugName: "confirmPassword" }] : []);
  ngOnInit() {
    return __async(this, null, function* () {
      const token = this.route.snapshot.queryParamMap.get("token");
      const email = this.route.snapshot.queryParamMap.get("email");
      const companyId = this.route.snapshot.queryParamMap.get("companyId");
      if (!token || !email || !companyId) {
        this.error.set("Link de convite inv\xE1lido ou expirado.");
        return;
      }
      this.inviteToken.set(token);
      this.userEmail.set(email);
      this.companyId.set(companyId);
      this.displayName.set(this.extractNameFromEmail(email));
      yield this.loadCompanyFromInvite(companyId);
    });
  }
  extractNameFromEmail(email) {
    const name = email.split("@")[0];
    return name.split(/[._-]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  }
  loadCompanyFromInvite(companyId) {
    return __async(this, null, function* () {
      this.loading.set(true);
      try {
        console.log("\u{1F50D} Debug - Carregando empresa pelo ID:", companyId);
        const company = yield this.companyService.getCompany(companyId);
        if (company) {
          console.log("\u{1F3E2} Debug - Empresa encontrada:", company.name);
          this.company.set(company);
          this.subdomainService.setCurrentCompany(company);
          yield this.loadUserNameFromInvite(companyId);
        } else {
          console.log("\u274C Debug - Empresa n\xE3o encontrada");
          this.error.set("Empresa n\xE3o encontrada. O convite pode estar expirado.");
          return;
        }
        console.log("\u2705 Debug - Formul\xE1rio de aceita\xE7\xE3o pronto");
      } catch (error) {
        console.error("\u274C Debug - Erro ao carregar empresa:", error);
        this.error.set("Erro ao carregar informa\xE7\xF5es da empresa.");
      } finally {
        this.loading.set(false);
      }
    });
  }
  loadUserNameFromInvite(companyId) {
    return __async(this, null, function* () {
      try {
        const email = this.userEmail();
        if (!email)
          return;
        console.log("\u{1F464} Debug - Tentando carregar nome do usu\xE1rio do convite...");
        const companyUser = yield this.companyService.getCompanyUser(companyId, email);
        if (companyUser && companyUser.displayName) {
          console.log("\u2705 Debug - Nome encontrado no convite:", companyUser.displayName);
          this.displayName.set(companyUser.displayName);
        } else {
          console.log("\u2139\uFE0F Debug - Nome n\xE3o encontrado no convite, usando extra\xE7\xE3o do email");
        }
      } catch (error) {
        console.log("\u26A0\uFE0F Debug - Erro ao carregar nome do convite (usando fallback):", error);
      }
    });
  }
  acceptInvite() {
    return __async(this, null, function* () {
      const email = this.userEmail();
      const name = this.displayName().trim();
      const pwd = this.password().trim();
      const confirmPwd = this.confirmPassword().trim();
      const token = this.inviteToken();
      console.log("\u{1F50D} Debug Form - Validando campos:", {
        email: !!email,
        name: !!name && name.length > 0,
        pwd: !!pwd && pwd.length > 0,
        confirmPwd: !!confirmPwd && confirmPwd.length > 0,
        token: !!token
      });
      if (!email || !name || !pwd || !confirmPwd || !token) {
        this.error.set("Todos os campos s\xE3o obrigat\xF3rios.");
        return;
      }
      if (pwd.length < 6) {
        this.error.set("A senha deve ter pelo menos 6 caracteres.");
        return;
      }
      if (pwd !== confirmPwd) {
        this.error.set("As senhas n\xE3o conferem.");
        return;
      }
      this.loading.set(true);
      this.error.set(null);
      try {
        console.log("\u{1F510} Debug - Tentando criar conta do usu\xE1rio...");
        let result = yield this.authService.signUpWithEmail(email, pwd, name);
        if (!result.success && result.error?.includes("email-already-in-use")) {
          console.log("\u{1F464} Debug - Email j\xE1 existe, tentando fazer login...");
          result = yield this.authService.signInWithEmail(email, pwd);
          if (!result.success) {
            throw new Error("Email j\xE1 cadastrado. Verifique sua senha ou fa\xE7a login normalmente.");
          }
          console.log("\u2705 Debug - Login realizado com sucesso");
        } else if (!result.success) {
          throw new Error(result.error);
        }
        console.log("\u2705 Debug - Conta criada ou login realizado, processando convite...");
        const companyId = this.companyId();
        if (!companyId) {
          throw new Error("ID da empresa n\xE3o encontrado.");
        }
        const company = this.company();
        if (company) {
          this.subdomainService.setCurrentCompany(company);
          console.log("\u2705 Debug - Empresa definida no contexto");
        }
        console.log("\u{1F504} Debug - Tentando processar convite imediatamente...");
        const inviteProcessed = yield this.authService.processPendingInvite(companyId, email, token);
        if (inviteProcessed) {
          console.log("\u2705 Debug - Convite processado com sucesso imediatamente");
        } else {
          console.log("\u{1F4BE} Debug - Salvando convite para processamento posterior...");
          const inviteData = {
            companyId,
            email,
            token,
            timestamp: Date.now()
          };
          localStorage.setItem("pendingInvite", JSON.stringify(inviteData));
        }
        console.log("\u{1F389} Debug - Convite aceito com sucesso!");
        this.success.set(true);
        setTimeout(() => {
          this.router.navigate(["/dashboard"]);
        }, 2e3);
      } catch (error) {
        console.error("\u274C Debug - Erro ao aceitar convite:", error);
        let errorMessage = "Erro ao aceitar convite. Tente novamente.";
        if (error?.code) {
          switch (error.code) {
            case "auth/email-already-in-use":
              errorMessage = "Este email j\xE1 est\xE1 em uso. Fa\xE7a login em vez disso.";
              break;
            case "auth/weak-password":
              errorMessage = "A senha \xE9 muito fraca. Use pelo menos 6 caracteres.";
              break;
            case "auth/invalid-email":
              errorMessage = "Email inv\xE1lido.";
              break;
            default:
              errorMessage = error.message || errorMessage;
          }
        }
        this.error.set(errorMessage);
      } finally {
        this.loading.set(false);
      }
    });
  }
  goToLogin() {
    this.router.navigate(["/login"]);
  }
  getPrimaryColor() {
    const company = this.company();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || "#3B82F6";
  }
};
__name(_InviteAcceptComponent, "InviteAcceptComponent");
__publicField(_InviteAcceptComponent, "\u0275fac", /* @__PURE__ */ __name(function InviteAcceptComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _InviteAcceptComponent)();
}, "InviteAcceptComponent_Factory"));
__publicField(_InviteAcceptComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InviteAcceptComponent, selectors: [["app-invite-accept"]], decls: 18, vars: 6, consts: [[1, "min-h-screen", "bg-gray-50", "flex", "items-center", "justify-center", "py-12", "px-4", "sm:px-6", "lg:px-8", "pb-16"], [1, "max-w-md", "w-full", "space-y-8"], [1, "text-center"], ["class", "flex justify-center mb-4", 4, "ngIf"], [1, "text-3xl", "font-extrabold", "text-gray-900", "mb-2"], ["class", "text-sm text-gray-600", 4, "ngIf"], ["class", "text-center", 4, "ngIf"], ["class", "bg-red-50 border border-red-200 rounded-md p-4", 4, "ngIf"], ["class", "bg-green-50 border border-green-200 rounded-md p-4", 4, "ngIf"], ["class", "mt-8 space-y-6", 3, "ngSubmit", 4, "ngIf"], [1, "fixed", "bottom-0", "left-0", "right-0", "bg-white", "border-t", "border-gray-200", "py-3"], [1, "text-xs", "text-gray-500"], [1, "text-gray-700"], [1, "flex", "justify-center", "mb-4"], [1, "h-12", "w-auto", 3, "src", "alt"], [1, "text-sm", "text-gray-600"], [1, "animate-spin", "rounded-full", "h-8", "w-8", "border-b-2", "border-blue-600", "mx-auto"], [1, "mt-2", "text-sm", "text-gray-600"], [1, "bg-red-50", "border", "border-red-200", "rounded-md", "p-4"], [1, "flex"], [1, "flex-shrink-0"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "h-5", "w-5", "text-red-400"], ["fill-rule", "evenodd", "d", "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", "clip-rule", "evenodd"], [1, "ml-3"], [1, "text-sm", "text-red-800"], [1, "mt-4", "text-center"], [1, "text-sm", "text-red-600", "hover:text-red-500", "underline", 3, "click"], [1, "bg-green-50", "border", "border-green-200", "rounded-md", "p-4"], ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "h-5", "w-5", "text-green-400"], ["fill-rule", "evenodd", "d", "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", "clip-rule", "evenodd"], [1, "text-sm", "text-green-800"], [1, "mt-8", "space-y-6", 3, "ngSubmit"], [1, "space-y-4"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["type", "email", "readonly", "", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "shadow-sm", "bg-gray-50", "text-gray-500", "cursor-not-allowed", "focus:outline-none", 3, "value"], ["for", "displayName", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["id", "displayName", "name", "displayName", "type", "text", "required", "", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "shadow-sm", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", 3, "ngModelChange", "ngModel"], ["for", "password", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["id", "password", "name", "password", "type", "password", "required", "", "minlength", "6", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "shadow-sm", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", 3, "ngModelChange", "ngModel"], [1, "mt-1", "text-sm", "text-gray-500"], ["for", "confirmPassword", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["id", "confirmPassword", "name", "confirmPassword", "type", "password", "required", "", "minlength", "6", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "shadow-sm", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "group", "relative", "w-full", "flex", "justify-center", "py-2", "px-4", "border", "border-transparent", "text-sm", "font-medium", "rounded-md", "text-white", "hover:opacity-90", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-blue-500", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "disabled"], ["class", "absolute left-0 inset-y-0 flex items-center pl-3", 4, "ngIf"], ["type", "button", 1, "font-medium", "text-blue-600", "hover:text-blue-500", 3, "click"], [1, "absolute", "left-0", "inset-y-0", "flex", "items-center", "pl-3"], [1, "animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-white"]], template: /* @__PURE__ */ __name(function InviteAcceptComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275template(3, InviteAcceptComponent_div_3_Template, 2, 2, "div", 3);
    \u0275\u0275elementStart(4, "h2", 4);
    \u0275\u0275text(5, " Aceitar Convite ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, InviteAcceptComponent_p_6_Template, 4, 1, "p", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, InviteAcceptComponent_div_7_Template, 4, 0, "div", 6)(8, InviteAcceptComponent_div_8_Template, 11, 1, "div", 7)(9, InviteAcceptComponent_div_9_Template, 8, 0, "div", 8)(10, InviteAcceptComponent_form_10_Template, 29, 9, "form", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 10)(12, "div", 2)(13, "p", 11);
    \u0275\u0275text(14, " Powered by ");
    \u0275\u0275elementStart(15, "strong", 12);
    \u0275\u0275text(16, "TaskBoard");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17, " - Sistema de Gest\xE3o Kanban ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_0_0;
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", (tmp_0_0 = ctx.company()) == null ? null : tmp_0_0.brandingConfig == null ? null : tmp_0_0.brandingConfig.logo);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx.company());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.loading() && !ctx.error() && !ctx.success());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.error());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.success());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.loading() && !ctx.error() && !ctx.success() && ctx.company());
  }
}, "InviteAcceptComponent_Template"), dependencies: [CommonModule, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, NgModel, NgForm], styles: ["\n\n/*# sourceMappingURL=invite-accept.component.css.map */"] }));
var InviteAcceptComponent = _InviteAcceptComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InviteAcceptComponent, [{
    type: Component,
    args: [{ selector: "app-invite-accept", standalone: true, imports: [CommonModule, FormsModule], template: `<div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pb-16">
  <div class="max-w-md w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <div *ngIf="company()?.brandingConfig?.logo" class="flex justify-center mb-4">
        <img [src]="company()!.brandingConfig!.logo" [alt]="company()!.name" class="h-12 w-auto">
      </div>
      <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
        Aceitar Convite
      </h2>
      <p *ngIf="company()" class="text-sm text-gray-600">
        Voc\xEA foi convidado para participar da <strong>{{ company()!.name }}</strong>
      </p>
    </div>

    <!-- Loading -->
    <div *ngIf="loading() && !error() && !success()" class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-600">Carregando...</p>
    </div>

    <!-- Error -->
    <div *ngIf="error()" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-800">{{ error() }}</p>
        </div>
      </div>
      
      <div class="mt-4 text-center">
        <button 
          (click)="goToLogin()"
          class="text-sm text-red-600 hover:text-red-500 underline">
          Ir para Login
        </button>
      </div>
    </div>

    <!-- Success -->
    <div *ngIf="success()" class="bg-green-50 border border-green-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-green-800">
            Convite aceito com sucesso! Redirecionando para o dashboard...
          </p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <form *ngIf="!loading() && !error() && !success() && company()" (ngSubmit)="acceptInvite()" class="mt-8 space-y-6">
      <div class="space-y-4">
        <!-- Email (readonly) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input 
            type="email" 
            [value]="userEmail()" 
            readonly 
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none">
        </div>

        <!-- Nome -->
        <div>
          <label for="displayName" class="block text-sm font-medium text-gray-700 mb-1">
            Nome completo
          </label>
          <input 
            id="displayName"
            name="displayName"
            type="text" 
            [ngModel]="displayName()" 
            (ngModelChange)="displayName.set($event)"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <!-- Senha -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input 
            id="password"
            name="password"
            type="password" 
            [ngModel]="password()" 
            (ngModelChange)="password.set($event)"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <p class="mt-1 text-sm text-gray-500">M\xEDnimo de 6 caracteres</p>
        </div>

        <!-- Confirmar Senha -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirmar senha
          </label>
          <input 
            id="confirmPassword"
            name="confirmPassword"
            type="password" 
            [ngModel]="confirmPassword()" 
            (ngModelChange)="confirmPassword.set($event)"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <button 
          type="submit" 
          [disabled]="loading()"
          [style.background-color]="getPrimaryColor()"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          
          <span *ngIf="loading()" class="absolute left-0 inset-y-0 flex items-center pl-3">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </span>
          
          {{ loading() ? 'Criando conta...' : 'Aceitar convite e criar conta' }}
        </button>
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          J\xE1 possui uma conta? 
          <button 
            type="button"
            (click)="goToLogin()"
            class="font-medium text-blue-600 hover:text-blue-500">
            Fazer login
          </button>
        </p>
      </div>
    </form>
  </div>
</div>

<!-- Footer -->
<div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
  <div class="text-center">
    <p class="text-xs text-gray-500">
      Powered by <strong class="text-gray-700">TaskBoard</strong> - Sistema de Gest\xE3o Kanban
    </p>
  </div>
</div>`, styles: ["/* src/app/components/invite-accept/invite-accept.component.scss */\n/*# sourceMappingURL=invite-accept.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InviteAcceptComponent, { className: "InviteAcceptComponent", filePath: "src/app/components/invite-accept/invite-accept.component.ts", lineNumber: 17 });
})();
export {
  InviteAcceptComponent
};
//# sourceMappingURL=chunk-3GREIZG5.js.map
