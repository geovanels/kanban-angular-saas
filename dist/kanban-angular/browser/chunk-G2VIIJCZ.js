import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Router,
  Validators,
  ɵNgNoValidate
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
  NgIf,
  __async,
  debounceTime,
  distinctUntilChanged,
  inject,
  of,
  setClassMetadata,
  signal,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-GHLOFODZ.js";

// src/app/components/login/login.component.ts
function LoginComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275element(1, "i", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage(), " ");
  }
}
function LoginComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275element(1, "i", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
function LoginComponent_div_18_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("login", "email"), " ");
  }
}
function LoginComponent_div_18_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("login", "password"), " ");
  }
}
function LoginComponent_div_18_i_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 46);
  }
}
function LoginComponent_div_18_i_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 9);
  }
}
function LoginComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "form", 26);
    \u0275\u0275listener("ngSubmit", function LoginComponent_div_18_Template_form_ngSubmit_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.signInWithEmail());
    });
    \u0275\u0275elementStart(2, "div", 27)(3, "label", 28);
    \u0275\u0275element(4, "i", 29);
    \u0275\u0275text(5, " Email ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "input", 30);
    \u0275\u0275template(7, LoginComponent_div_18_div_7_Template, 2, 1, "div", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 27)(9, "label", 32);
    \u0275\u0275element(10, "i", 33);
    \u0275\u0275text(11, " Senha ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "input", 34);
    \u0275\u0275template(13, LoginComponent_div_18_div_13_Template, 2, 1, "div", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 35);
    \u0275\u0275template(15, LoginComponent_div_18_i_15_Template, 1, 0, "i", 36)(16, LoginComponent_div_18_i_16_Template, 1, 0, "i", 37);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 38)(19, "span");
    \u0275\u0275text(20, "ou");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "button", 39);
    \u0275\u0275listener("click", function LoginComponent_div_18_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.signInWithGoogle());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(22, "svg", 40);
    \u0275\u0275element(23, "path", 41)(24, "path", 42)(25, "path", 43)(26, "path", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275text(27, " Entrar com Google ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r0.loginForm);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("is-invalid", ((tmp_2_0 = ctx_r0.loginForm.get("email")) == null ? null : tmp_2_0.touched) && ((tmp_2_0 = ctx_r0.loginForm.get("email")) == null ? null : tmp_2_0.invalid));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_3_0 = ctx_r0.loginForm.get("email")) == null ? null : tmp_3_0.touched) && ((tmp_3_0 = ctx_r0.loginForm.get("email")) == null ? null : tmp_3_0.invalid));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("is-invalid", ((tmp_4_0 = ctx_r0.loginForm.get("password")) == null ? null : tmp_4_0.touched) && ((tmp_4_0 = ctx_r0.loginForm.get("password")) == null ? null : tmp_4_0.invalid));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_5_0 = ctx_r0.loginForm.get("password")) == null ? null : tmp_5_0.touched) && ((tmp_5_0 = ctx_r0.loginForm.get("password")) == null ? null : tmp_5_0.invalid));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.isLoading() || !ctx_r0.loginFormValid);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isLoading());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.isLoading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.isLoading() ? "Entrando..." : "Entrar", " ");
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.isLoading());
  }
}
function LoginComponent_div_19_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("register", "ownerName"), " ");
  }
}
function LoginComponent_div_19_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("register", "ownerPhone"), " ");
  }
}
function LoginComponent_div_19_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("register", "ownerEmail"), " ");
  }
}
function LoginComponent_div_19_div_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("register", "companyName"), " ");
  }
}
function LoginComponent_div_19_div_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 78);
    \u0275\u0275element(1, "i", 46);
    \u0275\u0275text(2, " Verificando disponibilidade... ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_div_19_div_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 79);
    \u0275\u0275element(1, "i", 22);
    \u0275\u0275text(2, " Alias dispon\xEDvel! ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_div_19_div_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 80);
    \u0275\u0275element(1, "i", 81);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.aliasError(), " ");
  }
}
function LoginComponent_div_19_div_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82)(1, "strong");
    \u0275\u0275text(2, "Seu dom\xEDnio ser\xE1:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "code", 83);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.getAliasPreview());
  }
}
function LoginComponent_div_19_div_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("register", "subdomain"), " ");
  }
}
function LoginComponent_div_19_div_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("register", "password"), " ");
  }
}
function LoginComponent_div_19_div_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getFieldError("register", "confirmPassword"), " ");
  }
}
function LoginComponent_div_19_div_81_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1, " Voc\xEA deve aceitar os termos para continuar ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_div_19_i_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 46);
  }
}
function LoginComponent_div_19_i_84_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 84);
  }
}
function LoginComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "form", 26);
    \u0275\u0275listener("ngSubmit", function LoginComponent_div_19_Template_form_ngSubmit_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.registerUser());
    });
    \u0275\u0275elementStart(2, "div", 47)(3, "h4", 48);
    \u0275\u0275element(4, "i", 49);
    \u0275\u0275text(5, " Informa\xE7\xF5es do Respons\xE1vel ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 50)(7, "div", 51)(8, "div", 27)(9, "label", 52);
    \u0275\u0275text(10, "Nome Completo *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(11, "input", 53);
    \u0275\u0275template(12, LoginComponent_div_19_div_12_Template, 2, 1, "div", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 51)(14, "div", 27)(15, "label", 52);
    \u0275\u0275text(16, "Telefone *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 54);
    \u0275\u0275template(18, LoginComponent_div_19_div_18_Template, 2, 1, "div", 31);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 27)(20, "label", 52);
    \u0275\u0275text(21, "Email *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(22, "input", 55);
    \u0275\u0275template(23, LoginComponent_div_19_div_23_Template, 2, 1, "div", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 47)(25, "h4", 48);
    \u0275\u0275element(26, "i", 10);
    \u0275\u0275text(27, " Informa\xE7\xF5es da Empresa ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 27)(29, "label", 52);
    \u0275\u0275text(30, "Nome da Empresa *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(31, "input", 56);
    \u0275\u0275template(32, LoginComponent_div_19_div_32_Template, 2, 1, "div", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 47)(34, "h4", 48);
    \u0275\u0275element(35, "i", 57);
    \u0275\u0275text(36, " Configura\xE7\xE3o do Subdom\xEDnio ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 27)(38, "label", 52);
    \u0275\u0275text(39, "Alias/Subdom\xEDnio *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 58);
    \u0275\u0275element(41, "input", 59);
    \u0275\u0275elementStart(42, "div", 60);
    \u0275\u0275text(43, ".taskboard.com.br");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div", 61);
    \u0275\u0275template(45, LoginComponent_div_19_div_45_Template, 3, 0, "div", 62)(46, LoginComponent_div_19_div_46_Template, 3, 0, "div", 63)(47, LoginComponent_div_19_div_47_Template, 3, 1, "div", 64);
    \u0275\u0275elementEnd();
    \u0275\u0275template(48, LoginComponent_div_19_div_48_Template, 5, 1, "div", 65)(49, LoginComponent_div_19_div_49_Template, 2, 1, "div", 31);
    \u0275\u0275elementStart(50, "button", 66);
    \u0275\u0275listener("click", function LoginComponent_div_19_Template_button_click_50_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.generateSuggestions());
    });
    \u0275\u0275element(51, "i", 67);
    \u0275\u0275text(52, " Gerar Sugest\xF5es ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(53, "div", 47)(54, "h4", 48);
    \u0275\u0275element(55, "i", 68);
    \u0275\u0275text(56, " Configura\xE7\xE3o de Acesso ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "div", 50)(58, "div", 51)(59, "div", 27)(60, "label", 52);
    \u0275\u0275text(61, "Senha *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(62, "input", 69);
    \u0275\u0275template(63, LoginComponent_div_19_div_63_Template, 2, 1, "div", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div", 51)(65, "div", 27)(66, "label", 52);
    \u0275\u0275text(67, "Confirmar Senha *");
    \u0275\u0275elementEnd();
    \u0275\u0275element(68, "input", 70);
    \u0275\u0275template(69, LoginComponent_div_19_div_69_Template, 2, 1, "div", 31);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(70, "div", 27)(71, "div", 71);
    \u0275\u0275element(72, "input", 72);
    \u0275\u0275elementStart(73, "label", 73);
    \u0275\u0275text(74, " Aceito os ");
    \u0275\u0275elementStart(75, "a", 74);
    \u0275\u0275text(76, "termos de uso");
    \u0275\u0275elementEnd();
    \u0275\u0275text(77, " e ");
    \u0275\u0275elementStart(78, "a", 75);
    \u0275\u0275text(79, "pol\xEDtica de privacidade");
    \u0275\u0275elementEnd();
    \u0275\u0275text(80, " * ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(81, LoginComponent_div_19_div_81_Template, 2, 0, "div", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(82, "button", 76);
    \u0275\u0275template(83, LoginComponent_div_19_i_83_Template, 1, 0, "i", 36)(84, LoginComponent_div_19_i_84_Template, 1, 0, "i", 77);
    \u0275\u0275text(85);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_19_0;
    let tmp_20_0;
    let tmp_21_0;
    let tmp_22_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r0.registerForm);
    \u0275\u0275advance(10);
    \u0275\u0275classProp("is-invalid", ((tmp_2_0 = ctx_r0.registerForm.get("ownerName")) == null ? null : tmp_2_0.touched) && ((tmp_2_0 = ctx_r0.registerForm.get("ownerName")) == null ? null : tmp_2_0.invalid));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_3_0 = ctx_r0.registerForm.get("ownerName")) == null ? null : tmp_3_0.touched) && ((tmp_3_0 = ctx_r0.registerForm.get("ownerName")) == null ? null : tmp_3_0.invalid));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("is-invalid", ((tmp_4_0 = ctx_r0.registerForm.get("ownerPhone")) == null ? null : tmp_4_0.touched) && ((tmp_4_0 = ctx_r0.registerForm.get("ownerPhone")) == null ? null : tmp_4_0.invalid));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_5_0 = ctx_r0.registerForm.get("ownerPhone")) == null ? null : tmp_5_0.touched) && ((tmp_5_0 = ctx_r0.registerForm.get("ownerPhone")) == null ? null : tmp_5_0.invalid));
    \u0275\u0275advance(4);
    \u0275\u0275classProp("is-invalid", ((tmp_6_0 = ctx_r0.registerForm.get("ownerEmail")) == null ? null : tmp_6_0.touched) && ((tmp_6_0 = ctx_r0.registerForm.get("ownerEmail")) == null ? null : tmp_6_0.invalid));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_7_0 = ctx_r0.registerForm.get("ownerEmail")) == null ? null : tmp_7_0.touched) && ((tmp_7_0 = ctx_r0.registerForm.get("ownerEmail")) == null ? null : tmp_7_0.invalid));
    \u0275\u0275advance(8);
    \u0275\u0275classProp("is-invalid", ((tmp_8_0 = ctx_r0.registerForm.get("companyName")) == null ? null : tmp_8_0.touched) && ((tmp_8_0 = ctx_r0.registerForm.get("companyName")) == null ? null : tmp_8_0.invalid));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_9_0 = ctx_r0.registerForm.get("companyName")) == null ? null : tmp_9_0.touched) && ((tmp_9_0 = ctx_r0.registerForm.get("companyName")) == null ? null : tmp_9_0.invalid));
    \u0275\u0275advance(9);
    \u0275\u0275classProp("is-invalid", (ctx_r0.subdomainControl == null ? null : ctx_r0.subdomainControl.touched) && (ctx_r0.subdomainControl == null ? null : ctx_r0.subdomainControl.invalid) || ctx_r0.aliasError())("is-valid", ctx_r0.aliasAvailable() === true);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.isCheckingAlias());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.aliasAvailable() === true);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.aliasError());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.subdomainControl == null ? null : ctx_r0.subdomainControl.value);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (ctx_r0.subdomainControl == null ? null : ctx_r0.subdomainControl.touched) && (ctx_r0.subdomainControl == null ? null : ctx_r0.subdomainControl.invalid));
    \u0275\u0275advance(13);
    \u0275\u0275classProp("is-invalid", ((tmp_17_0 = ctx_r0.registerForm.get("password")) == null ? null : tmp_17_0.touched) && ((tmp_17_0 = ctx_r0.registerForm.get("password")) == null ? null : tmp_17_0.invalid));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_18_0 = ctx_r0.registerForm.get("password")) == null ? null : tmp_18_0.touched) && ((tmp_18_0 = ctx_r0.registerForm.get("password")) == null ? null : tmp_18_0.invalid));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("is-invalid", ((tmp_19_0 = ctx_r0.registerForm.get("confirmPassword")) == null ? null : tmp_19_0.touched) && (ctx_r0.registerForm.errors == null ? null : ctx_r0.registerForm.errors["passwordMismatch"]));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_20_0 = ctx_r0.registerForm.get("confirmPassword")) == null ? null : tmp_20_0.touched) && (ctx_r0.registerForm.errors == null ? null : ctx_r0.registerForm.errors["passwordMismatch"]));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("is-invalid", ((tmp_21_0 = ctx_r0.registerForm.get("agreeTerms")) == null ? null : tmp_21_0.touched) && ((tmp_21_0 = ctx_r0.registerForm.get("agreeTerms")) == null ? null : tmp_21_0.invalid));
    \u0275\u0275advance(9);
    \u0275\u0275property("ngIf", ((tmp_22_0 = ctx_r0.registerForm.get("agreeTerms")) == null ? null : tmp_22_0.touched) && ((tmp_22_0 = ctx_r0.registerForm.get("agreeTerms")) == null ? null : tmp_22_0.invalid));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.isLoading() || !ctx_r0.registerFormValid);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isLoading());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.isLoading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.isLoading() ? "Criando empresa..." : "Criar Empresa", " ");
  }
}
var LoginComponent = class _LoginComponent {
  authService = inject(AuthService);
  companyService = inject(CompanyService);
  subdomainService = inject(SubdomainService);
  router = inject(Router);
  fb = inject(FormBuilder);
  // Forms
  loginForm;
  registerForm;
  // UI State
  currentView = signal("login", ...ngDevMode ? [{ debugName: "currentView" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  errorMessage = signal("", ...ngDevMode ? [{ debugName: "errorMessage" }] : []);
  successMessage = signal("", ...ngDevMode ? [{ debugName: "successMessage" }] : []);
  // Registration state
  userCreated = signal(false, ...ngDevMode ? [{ debugName: "userCreated" }] : []);
  currentUser = signal(null, ...ngDevMode ? [{ debugName: "currentUser" }] : []);
  // Alias validation
  isCheckingAlias = signal(false, ...ngDevMode ? [{ debugName: "isCheckingAlias" }] : []);
  aliasAvailable = signal(null, ...ngDevMode ? [{ debugName: "aliasAvailable" }] : []);
  aliasError = signal("", ...ngDevMode ? [{ debugName: "aliasError" }] : []);
  ngOnInit() {
    this.initializeForms();
    this.setupAliasValidation();
  }
  initializeForms() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
    this.registerForm = this.fb.group({
      ownerName: ["", [Validators.required, Validators.minLength(2)]],
      ownerEmail: ["", [Validators.required, Validators.email]],
      ownerPhone: ["", [Validators.required, this.phoneValidator]],
      companyName: ["", [Validators.required, Validators.minLength(2)]],
      subdomain: ["", [Validators.required, Validators.minLength(3), this.aliasValidator.bind(this)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }
  setupAliasValidation() {
    this.registerForm.get("subdomain")?.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), switchMap((alias) => {
      if (!alias || alias.length < 3) {
        this.aliasAvailable.set(null);
        this.aliasError.set("");
        return of(null);
      }
      const aliasRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
      if (!aliasRegex.test(alias)) {
        this.aliasAvailable.set(false);
        this.aliasError.set("Use apenas letras min\xFAsculas, n\xFAmeros e h\xEDfens. N\xE3o pode come\xE7ar ou terminar com h\xEDfen.");
        return of(false);
      }
      const reserved = ["www", "api", "admin", "app", "apps", "mail", "ftp", "blog", "shop", "store", "support", "help"];
      if (reserved.includes(alias)) {
        this.aliasAvailable.set(false);
        this.aliasError.set("Este alias \xE9 reservado. Escolha outro.");
        return of(false);
      }
      this.isCheckingAlias.set(true);
      this.aliasError.set("");
      return this.companyService.isSubdomainAvailable(alias);
    })).subscribe({
      next: (available) => {
        this.isCheckingAlias.set(false);
        if (available !== null) {
          this.aliasAvailable.set(available);
          if (!available) {
            this.aliasError.set("Este alias j\xE1 est\xE1 em uso. Escolha outro.");
          } else {
            this.aliasError.set("");
          }
        }
      },
      error: () => {
        this.isCheckingAlias.set(false);
        this.aliasError.set("Erro ao verificar disponibilidade.");
      }
    });
  }
  signInWithEmail() {
    return __async(this, null, function* () {
      if (this.loginForm.invalid) {
        this.markFormGroupTouched(this.loginForm);
        return;
      }
      this.isLoading.set(true);
      this.clearMessages();
      const { email, password } = this.loginForm.value;
      const result = yield this.authService.signInWithEmail(email, password);
      if (result.success) {
        yield this.handleSuccessfulLogin();
      } else {
        this.errorMessage.set(this.getErrorMessage(result.error));
      }
      this.isLoading.set(false);
    });
  }
  signInWithGoogle() {
    return __async(this, null, function* () {
      this.isLoading.set(true);
      this.clearMessages();
      try {
        const result = yield this.authService.signInWithGoogle();
        yield this.handleSuccessfulLogin();
      } catch (error) {
        this.errorMessage.set(this.getErrorMessage(error));
      }
      this.isLoading.set(false);
    });
  }
  registerUser() {
    return __async(this, null, function* () {
      if (this.registerForm.invalid) {
        this.markFormGroupTouched(this.registerForm);
        return;
      }
      if (this.aliasAvailable() !== true) {
        this.errorMessage.set("Aguarde a verifica\xE7\xE3o do alias ou escolha outro.");
        return;
      }
      this.isLoading.set(true);
      this.clearMessages();
      try {
        const formData = this.registerForm.value;
        const authResult = yield this.authService.createUserWithEmail(formData.ownerEmail, formData.password);
        if (!authResult.success) {
          throw new Error(authResult.error || "Erro ao criar usu\xE1rio");
        }
        yield this.authService.updateUserProfile({
          displayName: formData.ownerName,
          phoneNumber: formData.ownerPhone
        });
        const companyData = {
          subdomain: formData.subdomain,
          name: formData.companyName,
          contactEmail: formData.ownerEmail,
          ownerId: authResult.user?.uid || "",
          ownerEmail: formData.ownerEmail,
          plan: "free",
          smtpConfig: {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            user: "",
            password: "",
            fromName: formData.companyName,
            fromEmail: formData.ownerEmail
          },
          apiConfig: {
            enabled: true,
            token: this.generateApiToken(),
            endpoint: `https://${formData.subdomain}.taskboard.com.br/api/v1/lead-intake`,
            webhookUrl: ""
          },
          features: {
            maxBoards: 1,
            maxUsers: 2,
            maxLeadsPerMonth: 100,
            maxEmailsPerMonth: 50,
            customBranding: false,
            apiAccess: false,
            webhooks: false,
            advancedReports: false,
            whiteLabel: false
          },
          status: "active"
        };
        const companyId = yield this.companyService.createCompany(companyData);
        const newCompany = yield this.companyService.getCompany(companyId);
        if (newCompany) {
          this.subdomainService.setCurrentCompany(newCompany);
        }
        yield this.createDefaultBoard(authResult.user?.uid || "", companyId);
        this.successMessage.set(`Empresa criada com sucesso! Seu subdom\xEDnio: ${formData.subdomain}.taskboard.com.br`);
        setTimeout(() => {
          if (this.subdomainService.isDevelopment()) {
            window.location.href = `http://localhost:${window.location.port}?subdomain=${formData.subdomain}`;
          } else {
            window.location.href = `https://${formData.subdomain}.taskboard.com.br`;
          }
        }, 2e3);
      } catch (error) {
        const errorMessage = error?.code ? this.getFirebaseErrorMessage(error.code) : error?.message || "Erro ao criar empresa. Tente novamente.";
        this.errorMessage.set(errorMessage);
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  createDefaultBoard(userId, companyId) {
    return __async(this, null, function* () {
      try {
        const { FirestoreService } = yield import("./chunk-AUVV2O3G.js");
        const firestoreService = new FirestoreService();
        const defaultBoard = {
          name: "Quadro Principal",
          description: "Seu primeiro quadro Kanban",
          companyId,
          createdAt: null
          // Será preenchido pelo serverTimestamp
        };
        yield firestoreService.createBoard(userId, defaultBoard);
      } catch (error) {
      }
    });
  }
  handleSuccessfulLogin() {
    return __async(this, null, function* () {
      try {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser?.email) {
          this.errorMessage.set("Erro ao obter dados do usu\xE1rio");
          return;
        }
        try {
          const userCompany = yield this.companyService.getCompanyByUserEmail(currentUser.email);
          if (userCompany) {
            this.subdomainService.setCurrentCompany(userCompany);
            if (this.subdomainService.isDevelopment()) {
              localStorage.setItem("dev-subdomain", userCompany.subdomain);
              this.router.navigate(["/dashboard"]);
            } else {
              const companyUrl = this.subdomainService.getCompanyUrl(userCompany.subdomain);
              window.location.href = companyUrl + "/dashboard";
            }
          } else {
            this.errorMessage.set("Usu\xE1rio n\xE3o pertence a nenhuma empresa. Entre em contato com o suporte.");
          }
        } catch (searchError) {
          this.router.navigate(["/dashboard"]);
        }
      } catch (error) {
        this.errorMessage.set("Erro ao processar login. Tente novamente.");
      }
    });
  }
  generateSuggestions() {
    const companyName = this.registerForm.get("companyName")?.value;
    if (!companyName)
      return;
    const suggestions = this.generateAliasSuggestions(companyName);
    const firstAvailable = suggestions[0];
    if (firstAvailable) {
      this.registerForm.patchValue({ subdomain: firstAvailable });
    }
  }
  generateAliasSuggestions(companyName) {
    const base = companyName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    return [
      base,
      `${base}-digital`,
      `${base}-corp`,
      `${base}-br`,
      `${base}${Math.floor(Math.random() * 100)}`,
      `${base}-${(/* @__PURE__ */ new Date()).getFullYear()}`
    ].filter((alias) => alias.length >= 3 && alias.length <= 30);
  }
  switchView(view) {
    this.currentView.set(view);
    this.clearMessages();
    this.resetForms();
  }
  resetForms() {
    this.loginForm.reset();
    this.registerForm.reset();
    this.aliasAvailable.set(null);
    this.aliasError.set("");
  }
  clearMessages() {
    this.errorMessage.set("");
    this.successMessage.set("");
  }
  markFormGroupTouched(formGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
  // Firebase Error Handler
  getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
      "auth/email-already-in-use": "Este email j\xE1 est\xE1 sendo utilizado. Tente fazer login ou use outro email.",
      "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
      "auth/invalid-email": "Por favor, insira um email v\xE1lido.",
      "auth/user-not-found": "Usu\xE1rio n\xE3o encontrado. Verifique o email ou crie uma conta.",
      "auth/wrong-password": "Senha incorreta. Tente novamente.",
      "auth/user-disabled": "Esta conta foi desabilitada. Entre em contato com o suporte.",
      "auth/too-many-requests": "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.",
      "auth/network-request-failed": "Erro de conex\xE3o. Verifique sua internet e tente novamente.",
      "auth/invalid-credential": "Email ou senha incorretos.",
      "auth/account-exists-with-different-credential": "J\xE1 existe uma conta com este email usando um m\xE9todo diferente.",
      "auth/popup-closed-by-user": "Login cancelado pelo usu\xE1rio.",
      "auth/popup-blocked": "Pop-up bloqueado pelo navegador. Habilite pop-ups e tente novamente.",
      "auth/credential-already-in-use": "Esta credencial j\xE1 est\xE1 sendo usada por outra conta.",
      "auth/requires-recent-login": "Esta opera\xE7\xE3o requer login recente. Fa\xE7a login novamente.",
      "auth/quota-exceeded": "Cota excedida. Tente novamente mais tarde.",
      "auth/internal-error": "Erro interno do servidor. Tente novamente.",
      "auth/operation-not-allowed": "Opera\xE7\xE3o n\xE3o permitida. Entre em contato com o suporte."
    };
    return errorMessages[errorCode] || "Ocorreu um erro inesperado. Tente novamente.";
  }
  // Validators
  phoneValidator(control) {
    if (!control.value)
      return null;
    const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }
  urlValidator(control) {
    if (!control.value)
      return null;
    const urlRegex = /^https?:\/\/.+\..+/;
    return urlRegex.test(control.value) ? null : { invalidUrl: true };
  }
  aliasValidator(control) {
    if (!control.value)
      return null;
    const aliasRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (control.value.length < 3)
      return { minLength: true };
    if (control.value.length > 30)
      return { maxLength: true };
    return aliasRegex.test(control.value) ? null : { invalidAlias: true };
  }
  passwordMatchValidator(group) {
    const password = group.get("password")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  // Getters para template
  get loginFormValid() {
    return this.loginForm.valid;
  }
  get registerFormValid() {
    return this.registerForm.valid && this.aliasAvailable() === true;
  }
  get subdomainControl() {
    return this.registerForm.get("subdomain");
  }
  getFieldError(formName, fieldName) {
    const form = formName === "login" ? this.loginForm : this.registerForm;
    const control = form.get(fieldName);
    if (!control?.errors || !control.touched)
      return "";
    const errors = control.errors;
    if (errors["required"])
      return "Este campo \xE9 obrigat\xF3rio";
    if (errors["email"])
      return "E-mail inv\xE1lido";
    if (errors["minlength"])
      return `M\xEDnimo de ${errors["minlength"].requiredLength} caracteres`;
    if (errors["invalidPhone"])
      return "Telefone inv\xE1lido. Use formato: (11) 99999-9999";
    if (errors["invalidUrl"])
      return "URL inv\xE1lida. Use formato: https://exemplo.com";
    if (errors["invalidAlias"])
      return "Use apenas letras min\xFAsculas, n\xFAmeros e h\xEDfens";
    if (errors["passwordMismatch"])
      return "Senhas n\xE3o coincidem";
    return "Campo inv\xE1lido";
  }
  getAliasPreview() {
    const alias = this.registerForm.get("subdomain")?.value;
    return alias ? `${alias}.taskboard.com.br` : "seudominio.taskboard.com.br";
  }
  generateApiToken() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  getErrorMessage(error) {
    if (error?.code) {
      return this.getFirebaseErrorMessage(error.code);
    }
    if (typeof error === "string") {
      if (error.includes("user-not-found")) {
        return "Usu\xE1rio n\xE3o encontrado. Verifique o email ou crie uma conta.";
      }
      if (error.includes("wrong-password")) {
        return "Senha incorreta. Tente novamente.";
      }
      if (error.includes("invalid-email")) {
        return "Por favor, insira um email v\xE1lido.";
      }
      if (error.includes("email-already-in-use")) {
        return "Este email j\xE1 est\xE1 sendo utilizado. Tente fazer login ou use outro email.";
      }
      if (error.includes("weak-password")) {
        return "A senha deve ter pelo menos 6 caracteres.";
      }
      if (error.includes("too-many-requests")) {
        return "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.";
      }
    }
    return error?.message || "Ocorreu um erro inesperado. Tente novamente.";
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 36, vars: 8, consts: [[1, "auth-container"], [1, "auth-card"], [1, "auth-header"], [1, "logo-container"], [1, "fas", "fa-tasks", "logo-icon"], [1, "auth-title"], [1, "auth-subtitle"], [1, "auth-tabs"], [1, "auth-tab", 3, "click"], [1, "fas", "fa-sign-in-alt"], [1, "fas", "fa-building"], ["class", "alert alert-success", 4, "ngIf"], ["class", "alert alert-danger", 4, "ngIf"], ["class", "auth-content", 4, "ngIf"], [1, "auth-footer"], [1, "footer-features"], [1, "feature-item"], [1, "fas", "fa-cloud"], [1, "fas", "fa-shield-alt"], [1, "fas", "fa-mobile-alt"], [1, "copyright"], [1, "alert", "alert-success"], [1, "fas", "fa-check-circle"], [1, "alert", "alert-danger"], [1, "fas", "fa-exclamation-circle"], [1, "auth-content"], [1, "auth-form", 3, "ngSubmit", "formGroup"], [1, "form-group"], ["for", "email", 1, "form-label"], [1, "fas", "fa-envelope"], ["type", "email", "id", "email", "formControlName", "email", "placeholder", "seu@email.com", 1, "form-control"], ["class", "invalid-feedback", 4, "ngIf"], ["for", "password", 1, "form-label"], [1, "fas", "fa-lock"], ["type", "password", "id", "password", "formControlName", "password", "placeholder", "Sua senha", 1, "form-control"], ["type", "submit", 1, "btn", "btn-primary", "btn-block", 3, "disabled"], ["class", "fas fa-spinner fa-spin", 4, "ngIf"], ["class", "fas fa-sign-in-alt", 4, "ngIf"], [1, "auth-divider"], [1, "btn", "btn-google", "btn-block", 3, "click", "disabled"], ["viewBox", "0 0 24 24", 1, "google-icon"], ["fill", "#4285F4", "d", "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"], ["fill", "#34A853", "d", "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"], ["fill", "#FBBC05", "d", "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"], ["fill", "#EA4335", "d", "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"], [1, "invalid-feedback"], [1, "fas", "fa-spinner", "fa-spin"], [1, "form-section"], [1, "section-title"], [1, "fas", "fa-user"], [1, "row"], [1, "col-md-6"], [1, "form-label"], ["type", "text", "formControlName", "ownerName", "placeholder", "Jo\xE3o Silva", 1, "form-control"], ["type", "tel", "formControlName", "ownerPhone", "placeholder", "(11) 99999-9999", 1, "form-control"], ["type", "email", "formControlName", "ownerEmail", "placeholder", "joao@empresa.com", 1, "form-control"], ["type", "text", "formControlName", "companyName", "placeholder", "Minha Empresa Ltda", 1, "form-control"], [1, "fas", "fa-link"], [1, "input-group"], ["type", "text", "formControlName", "subdomain", "placeholder", "minhaempresa", 1, "form-control"], [1, "input-group-text"], [1, "mt-2"], ["class", "text-info", 4, "ngIf"], ["class", "text-success", 4, "ngIf"], ["class", "text-danger", 4, "ngIf"], ["class", "domain-preview mt-2", 4, "ngIf"], ["type", "button", 1, "btn", "btn-outline-secondary", "btn-sm", "mt-2", 3, "click"], [1, "fas", "fa-magic"], [1, "fas", "fa-key"], ["type", "password", "formControlName", "password", "placeholder", "M\xEDnimo 6 caracteres", 1, "form-control"], ["type", "password", "formControlName", "confirmPassword", "placeholder", "Digite a senha novamente", 1, "form-control"], [1, "form-check"], ["type", "checkbox", "formControlName", "agreeTerms", "id", "agreeTerms", 1, "form-check-input"], ["for", "agreeTerms", 1, "form-check-label"], ["href", "/termos", "target", "_blank"], ["href", "/privacidade", "target", "_blank"], ["type", "submit", 1, "btn", "btn-success", "btn-block", "btn-lg", 3, "disabled"], ["class", "fas fa-rocket", 4, "ngIf"], [1, "text-info"], [1, "text-success"], [1, "text-danger"], [1, "fas", "fa-times-circle"], [1, "domain-preview", "mt-2"], [1, "domain-url"], [1, "fas", "fa-rocket"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275element(4, "i", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "h1", 5);
      \u0275\u0275text(6, "TaskBoard");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "p", 6);
      \u0275\u0275text(8, "Sistema Kanban Multi-Empresas");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 7)(10, "button", 8);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_10_listener() {
        return ctx.switchView("login");
      });
      \u0275\u0275element(11, "i", 9);
      \u0275\u0275text(12, " Entrar ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "button", 8);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_13_listener() {
        return ctx.switchView("register");
      });
      \u0275\u0275element(14, "i", 10);
      \u0275\u0275text(15, " Criar Empresa ");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(16, LoginComponent_div_16_Template, 3, 1, "div", 11)(17, LoginComponent_div_17_Template, 3, 1, "div", 12)(18, LoginComponent_div_18_Template, 28, 12, "div", 13)(19, LoginComponent_div_19_Template, 86, 35, "div", 13);
      \u0275\u0275elementStart(20, "div", 14)(21, "div", 15)(22, "div", 16);
      \u0275\u0275element(23, "i", 17);
      \u0275\u0275elementStart(24, "span");
      \u0275\u0275text(25, "100% Nuvem");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 16);
      \u0275\u0275element(27, "i", 18);
      \u0275\u0275elementStart(28, "span");
      \u0275\u0275text(29, "Seguro");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "div", 16);
      \u0275\u0275element(31, "i", 19);
      \u0275\u0275elementStart(32, "span");
      \u0275\u0275text(33, "Responsivo");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(34, "p", 20);
      \u0275\u0275text(35, " \xA9 2024 TaskBoard - Sistema Kanban Multi-Empresas ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275classProp("active", ctx.currentView() === "login");
      \u0275\u0275advance(3);
      \u0275\u0275classProp("active", ctx.currentView() === "register");
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.successMessage());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.currentView() === "login");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.currentView() === "register");
    }
  }, dependencies: [CommonModule, NgIf, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: [`

.auth-container[_ngcontent-%COMP%] {
  min-height: 100vh;
  background:
    linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 100%);
  position: relative;
  overflow-x: hidden;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
}
.auth-container[_ngcontent-%COMP%]::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="white" opacity="0.05"/><circle cx="80" cy="80" r="1" fill="white" opacity="0.05"/><circle cx="40" cy="60" r="0.5" fill="white" opacity="0.03"/></svg>');
  background-size: 100px 100px;
  animation: _ngcontent-%COMP%_float 30s infinite linear;
  pointer-events: none;
}
@keyframes _ngcontent-%COMP%_float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(-20px, -20px) rotate(360deg);
  }
}
.auth-card[_ngcontent-%COMP%] {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: _ngcontent-%COMP%_slideUp 0.6s ease-out;
  position: relative;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}
@keyframes _ngcontent-%COMP%_slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.auth-header[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.auth-header[_ngcontent-%COMP%]::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="0.8" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.6" fill="white" opacity="0.08"/></svg>');
  background-size: 80px 80px;
  animation: _ngcontent-%COMP%_float 20s infinite linear;
  pointer-events: none;
}
.logo-icon[_ngcontent-%COMP%] {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  animation: _ngcontent-%COMP%_pulse 2s infinite;
}
@keyframes _ngcontent-%COMP%_pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
.auth-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}
.auth-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
  opacity: 0.9;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}
.auth-body[_ngcontent-%COMP%] {
  padding: 2rem;
}
.auth-tabs[_ngcontent-%COMP%] {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}
.auth-tab[_ngcontent-%COMP%] {
  flex: 1;
  padding: 1rem;
  text-align: center;
  background: none;
  border: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}
.auth-tab[_ngcontent-%COMP%]:hover {
  color: #4f46e5;
}
.auth-tab.active[_ngcontent-%COMP%] {
  color: #4f46e5;
}
.auth-tab.active[_ngcontent-%COMP%]::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background:
    linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 100%);
  border-radius: 2px;
}
.auth-form[_ngcontent-%COMP%] {
  space-y: 1.5rem;
}
.form-group[_ngcontent-%COMP%] {
  margin-bottom: 1.5rem;
}
.form-label[_ngcontent-%COMP%] {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
.form-control[_ngcontent-%COMP%] {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: #fafafa;
}
.form-control[_ngcontent-%COMP%]:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
.form-control.is-invalid[_ngcontent-%COMP%] {
  border-color: #ef4444;
  background: #fef2f2;
}
.form-control.is-invalid[_ngcontent-%COMP%]:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
.invalid-feedback[_ngcontent-%COMP%] {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: block;
}
.btn[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
}
.btn[_ngcontent-%COMP%]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
.btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}
.btn-primary[_ngcontent-%COMP%]:active:not(:disabled) {
  transform: translateY(-1px);
}
.btn-success[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #28a745 0%,
      #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}
.btn-success[_ngcontent-%COMP%]:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}
.btn-success[_ngcontent-%COMP%]:active:not(:disabled) {
  transform: translateY(-1px);
}
.btn-block[_ngcontent-%COMP%] {
  width: 100%;
}
.text-center[_ngcontent-%COMP%] {
  text-align: center;
}
.mt-3[_ngcontent-%COMP%] {
  margin-top: 1rem;
}
.mb-3[_ngcontent-%COMP%] {
  margin-bottom: 1rem;
}
.alert[_ngcontent-%COMP%] {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}
.alert-danger[_ngcontent-%COMP%] {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}
.alert-success[_ngcontent-%COMP%] {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}
.spinner-border[_ngcontent-%COMP%] {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.15em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: _ngcontent-%COMP%_spinner-border 0.75s linear infinite;
}
@keyframes _ngcontent-%COMP%_spinner-border {
  to {
    transform: rotate(360deg);
  }
}
.spinner-border-sm[_ngcontent-%COMP%] {
  width: 0.875rem;
  height: 0.875rem;
  border-width: 0.125em;
}
.subdomain-info[_ngcontent-%COMP%] {
  background:
    linear-gradient(
      135deg,
      #f3f4f6 0%,
      #e5e7eb 100%);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}
.subdomain-info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.subdomain-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
  color: #6b7280;
  font-size: 0.8rem;
  margin: 0;
}
.company-badge[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
}
.company-badge[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
  margin-right: 0.5rem;
  font-size: 0.7rem;
}
@media (max-width: 640px) {
  .auth-container[_ngcontent-%COMP%] {
    padding: 1rem;
  }
  .auth-card[_ngcontent-%COMP%] {
    margin-top: 2rem;
    border-radius: 12px;
  }
  .auth-header[_ngcontent-%COMP%] {
    padding: 1.5rem;
  }
  .auth-body[_ngcontent-%COMP%] {
    padding: 1.5rem;
  }
  .auth-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {
    font-size: 1.25rem;
  }
  .logo-icon[_ngcontent-%COMP%] {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
.text-muted[_ngcontent-%COMP%] {
  color: #6b7280 !important;
}
.text-danger[_ngcontent-%COMP%] {
  color: #dc2626 !important;
}
.text-success[_ngcontent-%COMP%] {
  color: #16a34a !important;
}
.d-none[_ngcontent-%COMP%] {
  display: none !important;
}
.d-block[_ngcontent-%COMP%] {
  display: block !important;
}
.d-flex[_ngcontent-%COMP%] {
  display: flex !important;
}
.align-items-center[_ngcontent-%COMP%] {
  align-items: center !important;
}
.justify-content-center[_ngcontent-%COMP%] {
  justify-content: center !important;
}
.w-100[_ngcontent-%COMP%] {
  width: 100% !important;
}
.was-validated[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]:valid {
  border-color: #28a745;
  background: #f0fdf4;
}
.was-validated[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]:valid:focus {
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}
.was-validated[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]:invalid {
  border-color: #dc2626;
  background: #fef2f2;
}
.was-validated[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]:invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
.auth-content[_ngcontent-%COMP%] {
  padding: 2rem;
}
.auth-divider[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
}
.auth-divider[_ngcontent-%COMP%]::before, 
.auth-divider[_ngcontent-%COMP%]::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}
.auth-divider[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  background: white;
}
.btn-google[_ngcontent-%COMP%] {
  background: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}
.btn-google[_ngcontent-%COMP%]:hover:not(:disabled) {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.google-icon[_ngcontent-%COMP%] {
  width: 20px;
  height: 20px;
}
.form-section[_ngcontent-%COMP%] {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}
.form-section[_ngcontent-%COMP%]:last-child {
  border-bottom: none;
  margin-bottom: 1rem;
}
.section-title[_ngcontent-%COMP%] {
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.section-title[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
  color: #667eea;
  font-size: 0.9rem;
}
.row[_ngcontent-%COMP%] {
  display: flex;
  gap: 1rem;
  margin: 0 -0.5rem;
}
.col-md-6[_ngcontent-%COMP%] {
  flex: 1;
  padding: 0 0.5rem;
}
.input-group[_ngcontent-%COMP%] {
  display: flex;
  align-items: stretch;
}
.input-group[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%] {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
.input-group-text[_ngcontent-%COMP%] {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-left: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 0.875rem 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  white-space: nowrap;
}
.domain-preview[_ngcontent-%COMP%] {
  background: #f0f9ff;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e0f2fe;
  font-size: 0.9rem;
  color: #075985;
}
.domain-url[_ngcontent-%COMP%] {
  background: #075985;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  margin-left: 0.5rem;
  font-size: 0.85rem;
}
.form-check[_ngcontent-%COMP%] {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0;
}
.form-check-input[_ngcontent-%COMP%] {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  flex-shrink: 0;
  margin-top: 0.125rem;
  transition: all 0.2s ease;
}
.form-check-input[_ngcontent-%COMP%]:checked {
  background: #667eea;
  border-color: #667eea;
}
.form-check-input.is-invalid[_ngcontent-%COMP%] {
  border-color: #ef4444;
}
.form-check-label[_ngcontent-%COMP%] {
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.5;
}
.form-check-label[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {
  color: #667eea;
  text-decoration: none;
}
.form-check-label[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {
  text-decoration: underline;
}
.auth-footer[_ngcontent-%COMP%] {
  background: #f8fafc;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}
.footer-features[_ngcontent-%COMP%] {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}
.feature-item[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.85rem;
}
.feature-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
  color: #667eea;
  font-size: 1rem;
}
.copyright[_ngcontent-%COMP%] {
  color: #9ca3af;
  font-size: 0.8rem;
  margin: 0;
}
.btn-lg[_ngcontent-%COMP%] {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
}
.btn-sm[_ngcontent-%COMP%] {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}
.text-info[_ngcontent-%COMP%] {
  color: #0ea5e9 !important;
}
.logo-container[_ngcontent-%COMP%] {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.auth-title[_ngcontent-%COMP%] {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.auth-subtitle[_ngcontent-%COMP%] {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}
.btn-outline-secondary[_ngcontent-%COMP%] {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #6b7280;
}
.btn-outline-secondary[_ngcontent-%COMP%]:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
}
@media (max-width: 640px) {
  .auth-content[_ngcontent-%COMP%] {
    padding: 1.5rem;
  }
  .row[_ngcontent-%COMP%] {
    flex-direction: column;
    gap: 0;
  }
  .col-md-6[_ngcontent-%COMP%] {
    padding: 0;
  }
  .footer-features[_ngcontent-%COMP%] {
    flex-direction: column;
    gap: 1rem;
  }
  .form-section[_ngcontent-%COMP%] {
    margin-bottom: 1.5rem;
  }
}
*[_ngcontent-%COMP%] {
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}
/*# sourceMappingURL=login.component.css.map */`] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: true, imports: [CommonModule, ReactiveFormsModule], template: `<div class="auth-container">
  <div class="auth-card">
    <!-- Header -->
    <div class="auth-header">
      <div class="logo-container">
        <i class="fas fa-tasks logo-icon"></i>
      </div>
      <h1 class="auth-title">TaskBoard</h1>
      <p class="auth-subtitle">Sistema Kanban Multi-Empresas</p>
    </div>

    <!-- Tab Navigation -->
    <div class="auth-tabs">
      <button 
        class="auth-tab"
        [class.active]="currentView() === 'login'"
        (click)="switchView('login')">
        <i class="fas fa-sign-in-alt"></i>
        Entrar
      </button>
      <button 
        class="auth-tab"
        [class.active]="currentView() === 'register'"
        (click)="switchView('register')">
        <i class="fas fa-building"></i>
        Criar Empresa
      </button>
    </div>

    <!-- Messages -->
    <div class="alert alert-success" *ngIf="successMessage()">
      <i class="fas fa-check-circle"></i>
      {{ successMessage() }}
    </div>
    
    <div class="alert alert-danger" *ngIf="errorMessage()">
      <i class="fas fa-exclamation-circle"></i>
      {{ errorMessage() }}
    </div>

    <!-- Login Form -->
    <div class="auth-content" *ngIf="currentView() === 'login'">
      <form [formGroup]="loginForm" (ngSubmit)="signInWithEmail()" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">
            <i class="fas fa-envelope"></i>
            Email
          </label>
          <input 
            type="email" 
            id="email"
            class="form-control"
            formControlName="email"
            placeholder="seu@email.com"
            [class.is-invalid]="loginForm.get('email')?.touched && loginForm.get('email')?.invalid">
          <div class="invalid-feedback" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid">
            {{ getFieldError('login', 'email') }}
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <i class="fas fa-lock"></i>
            Senha
          </label>
          <input 
            type="password" 
            id="password"
            class="form-control"
            formControlName="password"
            placeholder="Sua senha"
            [class.is-invalid]="loginForm.get('password')?.touched && loginForm.get('password')?.invalid">
          <div class="invalid-feedback" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid">
            {{ getFieldError('login', 'password') }}
          </div>
        </div>

        <button 
          type="submit" 
          class="btn btn-primary btn-block"
          [disabled]="isLoading() || !loginFormValid">
          <i class="fas fa-spinner fa-spin" *ngIf="isLoading()"></i>
          <i class="fas fa-sign-in-alt" *ngIf="!isLoading()"></i>
          {{ isLoading() ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div class="auth-divider">
        <span>ou</span>
      </div>

      <button 
        class="btn btn-google btn-block"
        (click)="signInWithGoogle()"
        [disabled]="isLoading()">
        <svg class="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Entrar com Google
      </button>
    </div>

    <!-- Register Form -->
    <div class="auth-content" *ngIf="currentView() === 'register'">
      <form [formGroup]="registerForm" (ngSubmit)="registerUser()" class="auth-form">
        <!-- Informa\xE7\xF5es do Respons\xE1vel -->
        <div class="form-section">
          <h4 class="section-title">
            <i class="fas fa-user"></i>
            Informa\xE7\xF5es do Respons\xE1vel
          </h4>
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Nome Completo *</label>
                <input 
                  type="text" 
                  class="form-control"
                  formControlName="ownerName"
                  placeholder="Jo\xE3o Silva"
                  [class.is-invalid]="registerForm.get('ownerName')?.touched && registerForm.get('ownerName')?.invalid">
                <div class="invalid-feedback" *ngIf="registerForm.get('ownerName')?.touched && registerForm.get('ownerName')?.invalid">
                  {{ getFieldError('register', 'ownerName') }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Telefone *</label>
                <input 
                  type="tel" 
                  class="form-control"
                  formControlName="ownerPhone"
                  placeholder="(11) 99999-9999"
                  [class.is-invalid]="registerForm.get('ownerPhone')?.touched && registerForm.get('ownerPhone')?.invalid">
                <div class="invalid-feedback" *ngIf="registerForm.get('ownerPhone')?.touched && registerForm.get('ownerPhone')?.invalid">
                  {{ getFieldError('register', 'ownerPhone') }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email *</label>
            <input 
              type="email" 
              class="form-control"
              formControlName="ownerEmail"
              placeholder="joao@empresa.com"
              [class.is-invalid]="registerForm.get('ownerEmail')?.touched && registerForm.get('ownerEmail')?.invalid">
            <div class="invalid-feedback" *ngIf="registerForm.get('ownerEmail')?.touched && registerForm.get('ownerEmail')?.invalid">
              {{ getFieldError('register', 'ownerEmail') }}
            </div>
          </div>
        </div>

        <!-- Informa\xE7\xF5es da Empresa -->
        <div class="form-section">
          <h4 class="section-title">
            <i class="fas fa-building"></i>
            Informa\xE7\xF5es da Empresa
          </h4>
          
          <div class="form-group">
            <label class="form-label">Nome da Empresa *</label>
            <input 
              type="text" 
              class="form-control"
              formControlName="companyName"
              placeholder="Minha Empresa Ltda"
              [class.is-invalid]="registerForm.get('companyName')?.touched && registerForm.get('companyName')?.invalid">
            <div class="invalid-feedback" *ngIf="registerForm.get('companyName')?.touched && registerForm.get('companyName')?.invalid">
              {{ getFieldError('register', 'companyName') }}
            </div>
          </div>

        </div>

        <!-- Configura\xE7\xE3o do Subdom\xEDnio -->
        <div class="form-section">
          <h4 class="section-title">
            <i class="fas fa-link"></i>
            Configura\xE7\xE3o do Subdom\xEDnio
          </h4>
          
          <div class="form-group">
            <label class="form-label">Alias/Subdom\xEDnio *</label>
            <div class="input-group">
              <input 
                type="text" 
                class="form-control"
                formControlName="subdomain"
                placeholder="minhaempresa"
                [class.is-invalid]="(subdomainControl?.touched && subdomainControl?.invalid) || aliasError()"
                [class.is-valid]="aliasAvailable() === true">
              <div class="input-group-text">.taskboard.com.br</div>
            </div>
            
            <!-- Status da verifica\xE7\xE3o -->
            <div class="mt-2">
              <div class="text-info" *ngIf="isCheckingAlias()">
                <i class="fas fa-spinner fa-spin"></i>
                Verificando disponibilidade...
              </div>
              <div class="text-success" *ngIf="aliasAvailable() === true">
                <i class="fas fa-check-circle"></i>
                Alias dispon\xEDvel!
              </div>
              <div class="text-danger" *ngIf="aliasError()">
                <i class="fas fa-times-circle"></i>
                {{ aliasError() }}
              </div>
            </div>

            <!-- Preview do dom\xEDnio -->
            <div class="domain-preview mt-2" *ngIf="subdomainControl?.value">
              <strong>Seu dom\xEDnio ser\xE1:</strong>
              <code class="domain-url">{{ getAliasPreview() }}</code>
            </div>

            <div class="invalid-feedback" *ngIf="subdomainControl?.touched && subdomainControl?.invalid">
              {{ getFieldError('register', 'subdomain') }}
            </div>

            <button 
              type="button" 
              class="btn btn-outline-secondary btn-sm mt-2"
              (click)="generateSuggestions()">
              <i class="fas fa-magic"></i>
              Gerar Sugest\xF5es
            </button>
          </div>
        </div>

        <!-- Senha -->
        <div class="form-section">
          <h4 class="section-title">
            <i class="fas fa-key"></i>
            Configura\xE7\xE3o de Acesso
          </h4>
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Senha *</label>
                <input 
                  type="password" 
                  class="form-control"
                  formControlName="password"
                  placeholder="M\xEDnimo 6 caracteres"
                  [class.is-invalid]="registerForm.get('password')?.touched && registerForm.get('password')?.invalid">
                <div class="invalid-feedback" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid">
                  {{ getFieldError('register', 'password') }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label class="form-label">Confirmar Senha *</label>
                <input 
                  type="password" 
                  class="form-control"
                  formControlName="confirmPassword"
                  placeholder="Digite a senha novamente"
                  [class.is-invalid]="registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch']">
                <div class="invalid-feedback" *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.errors?.['passwordMismatch']">
                  {{ getFieldError('register', 'confirmPassword') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Termos -->
        <div class="form-group">
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              formControlName="agreeTerms"
              id="agreeTerms"
              [class.is-invalid]="registerForm.get('agreeTerms')?.touched && registerForm.get('agreeTerms')?.invalid">
            <label class="form-check-label" for="agreeTerms">
              Aceito os <a href="/termos" target="_blank">termos de uso</a> e <a href="/privacidade" target="_blank">pol\xEDtica de privacidade</a> *
            </label>
            <div class="invalid-feedback" *ngIf="registerForm.get('agreeTerms')?.touched && registerForm.get('agreeTerms')?.invalid">
              Voc\xEA deve aceitar os termos para continuar
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          class="btn btn-success btn-block btn-lg"
          [disabled]="isLoading() || !registerFormValid">
          <i class="fas fa-spinner fa-spin" *ngIf="isLoading()"></i>
          <i class="fas fa-rocket" *ngIf="!isLoading()"></i>
          {{ isLoading() ? 'Criando empresa...' : 'Criar Empresa' }}
        </button>
      </form>
    </div>

    <!-- Footer Info -->
    <div class="auth-footer">
      <div class="footer-features">
        <div class="feature-item">
          <i class="fas fa-cloud"></i>
          <span>100% Nuvem</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-shield-alt"></i>
          <span>Seguro</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-mobile-alt"></i>
          <span>Responsivo</span>
        </div>
      </div>
      
      <p class="copyright">
        \xA9 2024 TaskBoard - Sistema Kanban Multi-Empresas
      </p>
    </div>
  </div>
</div>`, styles: [`/* src/app/components/login/login.component.scss */
.auth-container {
  min-height: 100vh;
  background:
    linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 100%);
  position: relative;
  overflow-x: hidden;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    sans-serif;
}
.auth-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="white" opacity="0.05"/><circle cx="80" cy="80" r="1" fill="white" opacity="0.05"/><circle cx="40" cy="60" r="0.5" fill="white" opacity="0.03"/></svg>');
  background-size: 100px 100px;
  animation: float 30s infinite linear;
  pointer-events: none;
}
@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(-20px, -20px) rotate(360deg);
  }
}
.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
  position: relative;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}
@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.auth-header {
  background:
    linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.auth-header::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="0.8" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.6" fill="white" opacity="0.08"/></svg>');
  background-size: 80px 80px;
  animation: float 20s infinite linear;
  pointer-events: none;
}
.logo-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
.auth-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}
.auth-header p {
  opacity: 0.9;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}
.auth-body {
  padding: 2rem;
}
.auth-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}
.auth-tab {
  flex: 1;
  padding: 1rem;
  text-align: center;
  background: none;
  border: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}
.auth-tab:hover {
  color: #4f46e5;
}
.auth-tab.active {
  color: #4f46e5;
}
.auth-tab.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background:
    linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 100%);
  border-radius: 2px;
}
.auth-form {
  space-y: 1.5rem;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
.form-control {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: #fafafa;
}
.form-control:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
.form-control.is-invalid {
  border-color: #ef4444;
  background: #fef2f2;
}
.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
.invalid-feedback {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: block;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary {
  background:
    linear-gradient(
      135deg,
      #667eea 0%,
      #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}
.btn-primary:active:not(:disabled) {
  transform: translateY(-1px);
}
.btn-success {
  background:
    linear-gradient(
      135deg,
      #28a745 0%,
      #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}
.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}
.btn-success:active:not(:disabled) {
  transform: translateY(-1px);
}
.btn-block {
  width: 100%;
}
.text-center {
  text-align: center;
}
.mt-3 {
  margin-top: 1rem;
}
.mb-3 {
  margin-bottom: 1rem;
}
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}
.alert-danger {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}
.alert-success {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.15em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}
@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
  border-width: 0.125em;
}
.subdomain-info {
  background:
    linear-gradient(
      135deg,
      #f3f4f6 0%,
      #e5e7eb 100%);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}
.subdomain-info h4 {
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.subdomain-info p {
  color: #6b7280;
  font-size: 0.8rem;
  margin: 0;
}
.company-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
}
.company-badge i {
  margin-right: 0.5rem;
  font-size: 0.7rem;
}
@media (max-width: 640px) {
  .auth-container {
    padding: 1rem;
  }
  .auth-card {
    margin-top: 2rem;
    border-radius: 12px;
  }
  .auth-header {
    padding: 1.5rem;
  }
  .auth-body {
    padding: 1.5rem;
  }
  .auth-header h1 {
    font-size: 1.25rem;
  }
  .logo-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
.text-muted {
  color: #6b7280 !important;
}
.text-danger {
  color: #dc2626 !important;
}
.text-success {
  color: #16a34a !important;
}
.d-none {
  display: none !important;
}
.d-block {
  display: block !important;
}
.d-flex {
  display: flex !important;
}
.align-items-center {
  align-items: center !important;
}
.justify-content-center {
  justify-content: center !important;
}
.w-100 {
  width: 100% !important;
}
.was-validated .form-control:valid {
  border-color: #28a745;
  background: #f0fdf4;
}
.was-validated .form-control:valid:focus {
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}
.was-validated .form-control:invalid {
  border-color: #dc2626;
  background: #fef2f2;
}
.was-validated .form-control:invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
.auth-content {
  padding: 2rem;
}
.auth-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
}
.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}
.auth-divider span {
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  background: white;
}
.btn-google {
  background: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}
.btn-google:hover:not(:disabled) {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.google-icon {
  width: 20px;
  height: 20px;
}
.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}
.form-section:last-child {
  border-bottom: none;
  margin-bottom: 1rem;
}
.section-title {
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.section-title i {
  color: #667eea;
  font-size: 0.9rem;
}
.row {
  display: flex;
  gap: 1rem;
  margin: 0 -0.5rem;
}
.col-md-6 {
  flex: 1;
  padding: 0 0.5rem;
}
.input-group {
  display: flex;
  align-items: stretch;
}
.input-group .form-control {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
.input-group-text {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-left: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 0.875rem 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  white-space: nowrap;
}
.domain-preview {
  background: #f0f9ff;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e0f2fe;
  font-size: 0.9rem;
  color: #075985;
}
.domain-url {
  background: #075985;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  margin-left: 0.5rem;
  font-size: 0.85rem;
}
.form-check {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0;
}
.form-check-input {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  flex-shrink: 0;
  margin-top: 0.125rem;
  transition: all 0.2s ease;
}
.form-check-input:checked {
  background: #667eea;
  border-color: #667eea;
}
.form-check-input.is-invalid {
  border-color: #ef4444;
}
.form-check-label {
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.5;
}
.form-check-label a {
  color: #667eea;
  text-decoration: none;
}
.form-check-label a:hover {
  text-decoration: underline;
}
.auth-footer {
  background: #f8fafc;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}
.footer-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.85rem;
}
.feature-item i {
  color: #667eea;
  font-size: 1rem;
}
.copyright {
  color: #9ca3af;
  font-size: 0.8rem;
  margin: 0;
}
.btn-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
}
.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}
.text-info {
  color: #0ea5e9 !important;
}
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.auth-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}
.btn-outline-secondary {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #6b7280;
}
.btn-outline-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
}
@media (max-width: 640px) {
  .auth-content {
    padding: 1.5rem;
  }
  .row {
    flex-direction: column;
    gap: 0;
  }
  .col-md-6 {
    padding: 0;
  }
  .footer-features {
    flex-direction: column;
    gap: 1rem;
  }
  .form-section {
    margin-bottom: 1.5rem;
  }
}
* {
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}
/*# sourceMappingURL=login.component.css.map */
`] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/components/login/login.component.ts", lineNumber: 26 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-G2VIIJCZ.js.map
