import {
  BrandingService
} from "./chunk-VURM7YH2.js";
import {
  ToastService
} from "./chunk-RDMWVNUM.js";
import {
  Router
} from "./chunk-2S4XXET5.js";
import {
  AuthService,
  SubdomainService
} from "./chunk-NDNGZ4HQ.js";
import {
  AsyncPipe,
  CommonModule,
  Component,
  NgClass,
  NgForOf,
  NgIf,
  __async,
  __name,
  __publicField,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction4,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-GMR7JISZ.js";

// src/app/components/global-header/global-header.component.ts
function GlobalHeaderComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r0.getCompanyLogo(), \u0275\u0275sanitizeUrl);
  }
}
__name(GlobalHeaderComponent_Conditional_4_Template, "GlobalHeaderComponent_Conditional_4_Template");
function GlobalHeaderComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("background-color", ctx_r0.getPrimaryColor());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getCompanyInitials(), " ");
  }
}
__name(GlobalHeaderComponent_Conditional_5_Template, "GlobalHeaderComponent_Conditional_5_Template");
function GlobalHeaderComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 24)(2, "a", 25);
    \u0275\u0275element(3, "i", 26);
    \u0275\u0275text(4, " Minha Empresa ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "a", 27);
    \u0275\u0275element(6, "i", 28);
    \u0275\u0275text(7, " Configura\xE7\xE3o SMTP ");
    \u0275\u0275elementEnd()()();
  }
}
__name(GlobalHeaderComponent_Conditional_18_Template, "GlobalHeaderComponent_Conditional_18_Template");
function GlobalHeaderComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 29);
    \u0275\u0275elementStart(1, "span", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_1_0 = ctx_r0.currentCompany()) == null ? null : tmp_1_0.name);
  }
}
__name(GlobalHeaderComponent_Conditional_21_Template, "GlobalHeaderComponent_Conditional_21_Template");
function GlobalHeaderComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 19);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("src", (tmp_1_0 = ctx_r0.currentUser()) == null ? null : tmp_1_0.photoURL, \u0275\u0275sanitizeUrl);
  }
}
__name(GlobalHeaderComponent_Conditional_24_Template, "GlobalHeaderComponent_Conditional_24_Template");
function GlobalHeaderComponent_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "i", 31);
    \u0275\u0275elementEnd();
  }
}
__name(GlobalHeaderComponent_Conditional_25_Template, "GlobalHeaderComponent_Conditional_25_Template");
function GlobalHeaderComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 24)(2, "div", 32)(3, "p", 33);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 34);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 35);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function GlobalHeaderComponent_Conditional_26_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.logout());
    }, "GlobalHeaderComponent_Conditional_26_Template_button_click_7_listener"));
    \u0275\u0275element(8, "i", 36);
    \u0275\u0275text(9, " Sair ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(((tmp_1_0 = ctx_r0.currentUser()) == null ? null : tmp_1_0.displayName) || "Usu\xE1rio");
    \u0275\u0275advance();
    \u0275\u0275property("title", \u0275\u0275interpolate((tmp_2_0 = ctx_r0.currentUser()) == null ? null : tmp_2_0.email));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate((tmp_3_0 = ctx_r0.currentUser()) == null ? null : tmp_3_0.email);
  }
}
__name(GlobalHeaderComponent_Conditional_26_Template, "GlobalHeaderComponent_Conditional_26_Template");
function GlobalHeaderComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "div", 38)(2, "a", 39);
    \u0275\u0275element(3, "i", 40);
    \u0275\u0275text(4, " Quadros ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "a", 41);
    \u0275\u0275element(6, "i", 42);
    \u0275\u0275text(7, " Usu\xE1rios ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "a", 43);
    \u0275\u0275element(9, "i", 26);
    \u0275\u0275text(10, " Minha Empresa ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "a", 44);
    \u0275\u0275element(12, "i", 28);
    \u0275\u0275text(13, " SMTP ");
    \u0275\u0275elementEnd()()();
  }
}
__name(GlobalHeaderComponent_div_27_Template, "GlobalHeaderComponent_div_27_Template");
var _GlobalHeaderComponent = class _GlobalHeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  subdomainService = inject(SubdomainService);
  brandingService = inject(BrandingService);
  configMenuOpen = false;
  userMenuOpen = false;
  mobileMenuOpen = false;
  currentUser = /* @__PURE__ */ __name(() => this.authService.getCurrentUser(), "currentUser");
  currentCompany() {
    return this.subdomainService.getCurrentCompany();
  }
  hasCompanyLogo() {
    return this.brandingService.hasLogo();
  }
  getCompanyLogo() {
    return this.brandingService.getLogoUrl();
  }
  getPrimaryColor() {
    return this.brandingService.getPrimaryColor();
  }
  getCompanyInitials() {
    const company = this.currentCompany();
    if (!company?.name)
      return "T";
    const words = company.name.split(" ").filter((word) => word.length > 0);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  }
  isCurrentRoute(route) {
    return this.router.url === route || this.router.url.startsWith(route + "/");
  }
  isConfigRoute() {
    return this.router.url.includes("/empresa/");
  }
  toggleConfigMenu() {
    this.configMenuOpen = !this.configMenuOpen;
    this.userMenuOpen = false;
  }
  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    this.configMenuOpen = false;
  }
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  logout() {
    return __async(this, null, function* () {
      try {
        const result = yield this.authService.logout();
        if (result.success) {
          this.subdomainService.clearCurrentCompany();
          window.location.href = "/login";
        }
      } catch (error) {
      }
    });
  }
};
__name(_GlobalHeaderComponent, "GlobalHeaderComponent");
__publicField(_GlobalHeaderComponent, "\u0275fac", /* @__PURE__ */ __name(function GlobalHeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _GlobalHeaderComponent)();
}, "GlobalHeaderComponent_Factory"));
__publicField(_GlobalHeaderComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GlobalHeaderComponent, selectors: [["app-global-header"]], decls: 28, vars: 20, consts: [[1, "bg-white", "border-b", "border-gray-200", "shadow-sm", "sticky", "top-0", "z-50"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8"], [1, "flex", "justify-between", "items-center", "h-16"], [1, "flex", "items-center", "space-x-3"], ["alt", "Logo da Empresa", 1, "h-10", "w-auto", "rounded", 3, "src"], [1, "h-10", "w-10", "rounded-lg", "flex", "items-center", "justify-center", "text-white", "font-bold", "text-lg", 3, "background-color"], [1, "hidden", "md:flex", "items-center", "space-x-6"], ["href", "/dashboard", 1, "flex", "items-center", "px-3", "py-2", "text-sm", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md", "transition-colors"], [1, "fas", "fa-th-large", "mr-2"], ["href", "/usuarios", 1, "flex", "items-center", "px-3", "py-2", "text-sm", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md", "transition-colors"], [1, "fas", "fa-users", "mr-2"], [1, "relative", 3, "click", "clickOutside"], [1, "flex", "items-center", "px-3", "py-2", "text-sm", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md", "transition-colors"], [1, "fas", "fa-cog", "mr-2"], [1, "fas", "fa-chevron-down", "ml-1", "text-xs"], [1, "absolute", "right-0", "mt-2", "w-56", "bg-white", "rounded-md", "shadow-lg", "ring-1", "ring-black", "ring-opacity-5"], [1, "flex", "items-center", "space-x-4"], [1, "flex", "items-center", "space-x-2", "text-sm", "text-gray-600"], [1, "flex", "items-center", "p-2", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md", "transition-colors"], ["alt", "Avatar", 1, "w-8", "h-8", "rounded-full", 3, "src"], [1, "w-8", "h-8", "bg-gray-300", "rounded-full", "flex", "items-center", "justify-center"], [1, "absolute", "right-0", "mt-2", "w-48", "bg-white", "rounded-md", "shadow-lg", "ring-1", "ring-black", "ring-opacity-5"], ["class", "md:hidden border-t border-gray-200", 4, "ngIf"], [1, "h-10", "w-10", "rounded-lg", "flex", "items-center", "justify-center", "text-white", "font-bold", "text-lg"], [1, "py-1"], ["href", "/empresa/branding", 1, "flex", "items-center", "px-4", "py-2", "text-sm", "text-gray-700", "hover:bg-gray-100"], [1, "fas", "fa-building", "mr-3"], ["href", "/empresa/smtp", 1, "flex", "items-center", "px-4", "py-2", "text-sm", "text-gray-700", "hover:bg-gray-100"], [1, "fas", "fa-envelope", "mr-3"], [1, "fas", "fa-building", "text-xs"], [1, "font-medium"], [1, "fas", "fa-user", "text-gray-600", "text-sm"], [1, "px-4", "py-2", "border-b", "border-gray-100", "max-w-[16rem]"], [1, "text-sm", "font-medium", "text-gray-900"], [1, "text-xs", "text-gray-500", "truncate", 3, "title"], [1, "w-full", "text-left", "px-4", "py-2", "text-sm", "text-red-700", "hover:bg-red-50", 3, "click"], [1, "fas", "fa-sign-out-alt", "mr-2"], [1, "md:hidden", "border-t", "border-gray-200"], [1, "px-2", "pt-2", "pb-3", "space-y-1"], ["href", "/dashboard", 1, "flex", "items-center", "px-3", "py-2", "text-base", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md"], [1, "fas", "fa-th-large", "mr-3"], ["href", "/usuarios", 1, "flex", "items-center", "px-3", "py-2", "text-base", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md"], [1, "fas", "fa-users", "mr-3"], ["href", "/empresa/branding", 1, "flex", "items-center", "px-3", "py-2", "text-base", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md"], ["href", "/empresa/smtp", 1, "flex", "items-center", "px-3", "py-2", "text-base", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md"]], template: /* @__PURE__ */ __name(function GlobalHeaderComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
    \u0275\u0275conditionalCreate(4, GlobalHeaderComponent_Conditional_4_Template, 1, 1, "img", 4)(5, GlobalHeaderComponent_Conditional_5_Template, 2, 3, "div", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "nav", 6)(7, "a", 7);
    \u0275\u0275element(8, "i", 8);
    \u0275\u0275text(9, " Quadros ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "a", 9);
    \u0275\u0275element(11, "i", 10);
    \u0275\u0275text(12, " Usu\xE1rios ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 11);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function GlobalHeaderComponent_Template_div_click_13_listener() {
      return ctx.toggleConfigMenu();
    }, "GlobalHeaderComponent_Template_div_click_13_listener"))("clickOutside", /* @__PURE__ */ __name(function GlobalHeaderComponent_Template_div_clickOutside_13_listener() {
      return ctx.configMenuOpen = false;
    }, "GlobalHeaderComponent_Template_div_clickOutside_13_listener"));
    \u0275\u0275elementStart(14, "button", 12);
    \u0275\u0275element(15, "i", 13);
    \u0275\u0275text(16, " Configura\xE7\xF5es ");
    \u0275\u0275element(17, "i", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(18, GlobalHeaderComponent_Conditional_18_Template, 8, 0, "div", 15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 16)(20, "div", 17);
    \u0275\u0275conditionalCreate(21, GlobalHeaderComponent_Conditional_21_Template, 3, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 11);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function GlobalHeaderComponent_Template_div_click_22_listener() {
      return ctx.toggleUserMenu();
    }, "GlobalHeaderComponent_Template_div_click_22_listener"))("clickOutside", /* @__PURE__ */ __name(function GlobalHeaderComponent_Template_div_clickOutside_22_listener() {
      return ctx.userMenuOpen = false;
    }, "GlobalHeaderComponent_Template_div_clickOutside_22_listener"));
    \u0275\u0275elementStart(23, "button", 18);
    \u0275\u0275conditionalCreate(24, GlobalHeaderComponent_Conditional_24_Template, 1, 1, "img", 19)(25, GlobalHeaderComponent_Conditional_25_Template, 2, 0, "div", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(26, GlobalHeaderComponent_Conditional_26_Template, 10, 4, "div", 21);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(27, GlobalHeaderComponent_div_27_Template, 14, 0, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_10_0;
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx.hasCompanyLogo() ? 4 : 5);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("text-blue-600", ctx.isCurrentRoute("/dashboard"))("bg-blue-50", ctx.isCurrentRoute("/dashboard"));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("text-blue-600", ctx.isCurrentRoute("/usuarios"))("bg-blue-50", ctx.isCurrentRoute("/usuarios"));
    \u0275\u0275advance(4);
    \u0275\u0275classProp("text-blue-600", ctx.configMenuOpen || ctx.isConfigRoute())("bg-blue-50", ctx.configMenuOpen || ctx.isConfigRoute());
    \u0275\u0275advance(3);
    \u0275\u0275classProp("rotate-180", ctx.configMenuOpen);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.configMenuOpen ? 18 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx.currentCompany() ? 21 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(((tmp_10_0 = ctx.currentUser()) == null ? null : tmp_10_0.photoURL) ? 24 : 25);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.userMenuOpen ? 26 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.mobileMenuOpen);
  }
}, "GlobalHeaderComponent_Template"), dependencies: [CommonModule, NgIf], styles: ["\n\n.rotate-180[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n@media (max-width: 768px) {\n  .mobile-menu-button[_ngcontent-%COMP%] {\n    display: block;\n  }\n}\n/*# sourceMappingURL=global-header.component.css.map */"] }));
var GlobalHeaderComponent = _GlobalHeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlobalHeaderComponent, [{
    type: Component,
    args: [{ selector: "app-global-header", standalone: true, imports: [CommonModule], template: `
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Company Logo/Brand -->
          <div class="flex items-center space-x-3">
            @if (hasCompanyLogo()) {
              <img [src]="getCompanyLogo()" 
                   alt="Logo da Empresa" 
                   class="h-10 w-auto rounded">
            } @else {
              <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                   [style.background-color]="getPrimaryColor()">
                {{ getCompanyInitials() }}
              </div>
            }
          </div>

          <!-- Navigation Menu -->
          <nav class="hidden md:flex items-center space-x-6">
            <a href="/dashboard" 
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
               [class.text-blue-600]="isCurrentRoute('/dashboard')"
               [class.bg-blue-50]="isCurrentRoute('/dashboard')">
              <i class="fas fa-th-large mr-2"></i>
              Quadros
            </a>
            
            <a href="/usuarios" 
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
               [class.text-blue-600]="isCurrentRoute('/usuarios')"
               [class.bg-blue-50]="isCurrentRoute('/usuarios')">
              <i class="fas fa-users mr-2"></i>
              Usu\xE1rios
            </a>
            
            <!-- Configura\xE7\xF5es Dropdown -->
            <div class="relative" (click)="toggleConfigMenu()" (clickOutside)="configMenuOpen = false">
              <button class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      [class.text-blue-600]="configMenuOpen || isConfigRoute()"
                      [class.bg-blue-50]="configMenuOpen || isConfigRoute()">
                <i class="fas fa-cog mr-2"></i>
                Configura\xE7\xF5es
                <i class="fas fa-chevron-down ml-1 text-xs" [class.rotate-180]="configMenuOpen"></i>
              </button>
              
              @if (configMenuOpen) {
                <div class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div class="py-1">
                    <a href="/empresa/branding" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i class="fas fa-building mr-3"></i>
                      Minha Empresa
                    </a>
                    <a href="/empresa/smtp" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i class="fas fa-envelope mr-3"></i>
                      Configura\xE7\xE3o SMTP
                    </a>
                  </div>
                </div>
              }
            </div>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              @if (currentCompany()) {
                <i class="fas fa-building text-xs"></i>
                <span class="font-medium">{{ currentCompany()?.name }}</span>
              }
            </div>
            
            <div class="relative" (click)="toggleUserMenu()" (clickOutside)="userMenuOpen = false">
              <button class="flex items-center p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                @if (currentUser()?.photoURL) {
                  <img [src]="currentUser()?.photoURL" alt="Avatar" class="w-8 h-8 rounded-full">
                } @else {
                  <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-gray-600 text-sm"></i>
                  </div>
                }
              </button>
              
              @if (userMenuOpen) {
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div class="py-1">
                    <div class="px-4 py-2 border-b border-gray-100 max-w-[16rem]">
                      <p class="text-sm font-medium text-gray-900">{{ currentUser()?.displayName || 'Usu\xE1rio' }}</p>
                      <p class="text-xs text-gray-500 truncate" title="{{ currentUser()?.email }}">{{ currentUser()?.email }}</p>
                    </div>
                    <button (click)="logout()" class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                      <i class="fas fa-sign-out-alt mr-2"></i>
                      Sair
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="md:hidden border-t border-gray-200" *ngIf="mobileMenuOpen">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a href="/dashboard" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
            <i class="fas fa-th-large mr-3"></i>
            Quadros
          </a>
          <a href="/usuarios" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
            <i class="fas fa-users mr-3"></i>
            Usu\xE1rios
          </a>
          <a href="/empresa/branding" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
            <i class="fas fa-building mr-3"></i>
            Minha Empresa
          </a>
          <a href="/empresa/smtp" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
            <i class="fas fa-envelope mr-3"></i>
            SMTP
          </a>
        </div>
      </div>
    </header>
  `, styles: ["/* angular:styles/component:scss;9bffb8ba41ab66291548f49bf5a5246d6e65be2e8705a5fdbea060d14d86cd0e;/Users/geovanelopes/Documents/GitHub/kanban-angular-saas/src/app/components/global-header/global-header.component.ts */\n.rotate-180 {\n  transform: rotate(180deg);\n}\n@media (max-width: 768px) {\n  .mobile-menu-button {\n    display: block;\n  }\n}\n/*# sourceMappingURL=global-header.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GlobalHeaderComponent, { className: "GlobalHeaderComponent", filePath: "src/app/components/global-header/global-header.component.ts", lineNumber: 149 });
})();

// src/app/components/global-footer/global-footer.component.ts
var _GlobalFooterComponent = class _GlobalFooterComponent {
};
__name(_GlobalFooterComponent, "GlobalFooterComponent");
__publicField(_GlobalFooterComponent, "\u0275fac", /* @__PURE__ */ __name(function GlobalFooterComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _GlobalFooterComponent)();
}, "GlobalFooterComponent_Factory"));
__publicField(_GlobalFooterComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GlobalFooterComponent, selectors: [["app-global-footer"]], decls: 15, vars: 0, consts: [[1, "bg-gray-50", "border-t", "border-gray-200", "mt-auto"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-4"], [1, "flex", "items-center", "justify-center"], [1, "flex", "items-center", "space-x-2", "text-sm", "text-gray-500"], [1, "flex", "items-center", "space-x-1"], [1, "w-5", "h-5", "bg-gradient-to-br", "from-blue-500", "to-blue-600", "rounded", "flex", "items-center", "justify-center"], [1, "fas", "fa-tasks", "text-white", "text-xs"], [1, "font-semibold", "text-gray-700"]], template: /* @__PURE__ */ __name(function GlobalFooterComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "footer", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "span");
    \u0275\u0275text(5, "Powered by");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "div", 4)(7, "div", 5);
    \u0275\u0275domElement(8, "i", 6);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(9, "span", 7);
    \u0275\u0275text(10, "Task Board");
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(11, "span");
    \u0275\u0275text(12, "\u2022");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(13, "span");
    \u0275\u0275text(14, "Sistema de Gest\xE3o Kanban");
    \u0275\u0275domElementEnd()()()()();
  }
}, "GlobalFooterComponent_Template"), dependencies: [CommonModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=global-footer.component.css.map */"] }));
var GlobalFooterComponent = _GlobalFooterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlobalFooterComponent, [{
    type: Component,
    args: [{ selector: "app-global-footer", standalone: true, imports: [CommonModule], template: `
    <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-center">
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span>Powered by</span>
            <div class="flex items-center space-x-1">
              <div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                <i class="fas fa-tasks text-white text-xs"></i>
              </div>
              <span class="font-semibold text-gray-700">Task Board</span>
            </div>
            <span>\u2022</span>
            <span>Sistema de Gest\xE3o Kanban</span>
          </div>
        </div>
      </div>
    </footer>
  `, styles: ["/* angular:styles/component:scss;219558ef63f119a92210704329b58a3cdceaa4fb296db559e672f74512827dc7;/Users/geovanelopes/Documents/GitHub/kanban-angular-saas/src/app/components/global-footer/global-footer.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=global-footer.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GlobalFooterComponent, { className: "GlobalFooterComponent", filePath: "src/app/components/global-footer/global-footer.component.ts", lineNumber: 33 });
})();

// src/app/components/toast/toast-container.component.ts
var _c0 = /* @__PURE__ */ __name((a0, a1, a2, a3) => ({ "bg-green-600": a0, "bg-red-600": a1, "bg-blue-600": a2, "bg-yellow-600": a3 }), "_c0");
function ToastContainerComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "div", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 5);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ToastContainerComponent_div_1_Template_button_click_4_listener() {
      const m_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toast.dismiss(m_r2.id));
    }, "ToastContainerComponent_div_1_Template_button_click_4_listener"));
    \u0275\u0275text(5, "\u2715");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const m_r2 = ctx.$implicit;
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction4(2, _c0, m_r2.type === "success", m_r2.type === "error", m_r2.type === "info", m_r2.type === "warning"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r2.text);
  }
}
__name(ToastContainerComponent_div_1_Template, "ToastContainerComponent_div_1_Template");
var _ToastContainerComponent = class _ToastContainerComponent {
  toast = inject(ToastService);
};
__name(_ToastContainerComponent, "ToastContainerComponent");
__publicField(_ToastContainerComponent, "\u0275fac", /* @__PURE__ */ __name(function ToastContainerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToastContainerComponent)();
}, "ToastContainerComponent_Factory"));
__publicField(_ToastContainerComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ToastContainerComponent, selectors: [["app-toast-container"]], decls: 3, vars: 3, consts: [[1, "fixed", "top-4", "right-4", "z-50", "space-y-2", "w-80"], ["class", "shadow rounded px-4 py-3 text-white", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "shadow", "rounded", "px-4", "py-3", "text-white", 3, "ngClass"], [1, "flex", "items-start", "justify-between"], [1, "pr-3", "text-sm"], [1, "text-white/80", "hover:text-white", "ml-2", 3, "click"]], template: /* @__PURE__ */ __name(function ToastContainerComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275template(1, ToastContainerComponent_div_1_Template, 6, 7, "div", 1);
    \u0275\u0275pipe(2, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", \u0275\u0275pipeBind1(2, 1, ctx.toast.messages$));
  }
}, "ToastContainerComponent_Template"), dependencies: [CommonModule, NgClass, NgForOf, AsyncPipe], encapsulation: 2 }));
var ToastContainerComponent = _ToastContainerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastContainerComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "app-toast-container",
      imports: [CommonModule],
      template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 w-80">
      <div *ngFor="let m of (toast.messages$ | async)" 
           class="shadow rounded px-4 py-3 text-white"
           [ngClass]="{
             'bg-green-600': m.type === 'success',
             'bg-red-600': m.type === 'error',
             'bg-blue-600': m.type === 'info',
             'bg-yellow-600': m.type === 'warning'
           }">
        <div class="flex items-start justify-between">
          <div class="pr-3 text-sm">{{ m.text }}</div>
          <button class="text-white/80 hover:text-white ml-2" (click)="toast.dismiss(m.id)">\u2715</button>
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ToastContainerComponent, { className: "ToastContainerComponent", filePath: "src/app/components/toast/toast-container.component.ts", lineNumber: 27 });
})();

// src/app/components/main-layout/main-layout.component.ts
var _c02 = ["*"];
var _MainLayoutComponent = class _MainLayoutComponent {
};
__name(_MainLayoutComponent, "MainLayoutComponent");
__publicField(_MainLayoutComponent, "\u0275fac", /* @__PURE__ */ __name(function MainLayoutComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _MainLayoutComponent)();
}, "MainLayoutComponent_Factory"));
__publicField(_MainLayoutComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MainLayoutComponent, selectors: [["app-main-layout"]], ngContentSelectors: _c02, decls: 6, vars: 0, consts: [[1, "min-h-screen", "flex", "flex-col"], [1, "flex-1"]], template: /* @__PURE__ */ __name(function MainLayoutComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projectionDef();
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "app-global-header");
    \u0275\u0275elementStart(2, "main", 1);
    \u0275\u0275projection(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "app-global-footer")(5, "app-toast-container");
    \u0275\u0275elementEnd();
  }
}, "MainLayoutComponent_Template"), dependencies: [CommonModule, GlobalHeaderComponent, GlobalFooterComponent, ToastContainerComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n/*# sourceMappingURL=main-layout.component.css.map */"] }));
var MainLayoutComponent = _MainLayoutComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MainLayoutComponent, [{
    type: Component,
    args: [{ selector: "app-main-layout", standalone: true, imports: [CommonModule, GlobalHeaderComponent, GlobalFooterComponent, ToastContainerComponent], template: `
    <div class="min-h-screen flex flex-col">
      <!-- Global Header -->
      <app-global-header></app-global-header>
      
      <!-- Main Content -->
      <main class="flex-1">
        <ng-content></ng-content>
      </main>
      
      <!-- Global Footer -->
      <app-global-footer></app-global-footer>

      <!-- Toast Container -->
      <app-toast-container></app-toast-container>
    </div>
  `, styles: ["/* angular:styles/component:scss;189b4b61fdb5160d2334e130ea0b07376c066e6c4f53324082f9858a80e3631d;/Users/geovanelopes/Documents/GitHub/kanban-angular-saas/src/app/components/main-layout/main-layout.component.ts */\n:host {\n  display: block;\n  min-height: 100vh;\n}\n/*# sourceMappingURL=main-layout.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MainLayoutComponent, { className: "MainLayoutComponent", filePath: "src/app/components/main-layout/main-layout.component.ts", lineNumber: 35 });
})();

export {
  MainLayoutComponent
};
//# sourceMappingURL=chunk-BGRXE4K2.js.map
