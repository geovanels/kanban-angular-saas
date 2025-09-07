import {
  Router
} from "./chunk-5BCXWPYT.js";
import {
  AuthService,
  SubdomainService
} from "./chunk-L2S3FEQE.js";
import {
  AsyncPipe,
  BehaviorSubject,
  CommonModule,
  Component,
  Injectable,
  NgClass,
  NgForOf,
  NgIf,
  __async,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
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
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-GHLOFODZ.js";

// src/app/components/toast/toast.service.ts
var ToastService = class _ToastService {
  messagesSubject = new BehaviorSubject([]);
  messages$ = this.messagesSubject.asObservable();
  show(text, type = "info", timeoutMs = 3e3) {
    const id = Math.random().toString(36).slice(2);
    const msg = { id, text, type, timeoutMs };
    const list = this.messagesSubject.value.slice();
    list.push(msg);
    this.messagesSubject.next(list);
    if (timeoutMs > 0) {
      setTimeout(() => this.dismiss(id), timeoutMs);
    }
  }
  success(text, timeoutMs = 3e3) {
    this.show(text, "success", timeoutMs);
  }
  error(text, timeoutMs = 4e3) {
    this.show(text, "error", timeoutMs);
  }
  info(text, timeoutMs = 3e3) {
    this.show(text, "info", timeoutMs);
  }
  warning(text, timeoutMs = 3e3) {
    this.show(text, "warning", timeoutMs);
  }
  dismiss(id) {
    this.messagesSubject.next(this.messagesSubject.value.filter((m) => m.id !== id));
  }
  static \u0275fac = function ToastService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ToastService, factory: _ToastService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/components/global-header/global-header.component.ts
function GlobalHeaderComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 25)(2, "a", 26);
    \u0275\u0275element(3, "i", 27);
    \u0275\u0275text(4, " Minha Empresa ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "a", 28);
    \u0275\u0275element(6, "i", 29);
    \u0275\u0275text(7, " Configura\xE7\xE3o SMTP ");
    \u0275\u0275elementEnd()()();
  }
}
function GlobalHeaderComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 30);
    \u0275\u0275elementStart(1, "span", 31);
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
function GlobalHeaderComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 21);
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("src", (tmp_1_0 = ctx_r0.currentUser()) == null ? null : tmp_1_0.photoURL, \u0275\u0275sanitizeUrl);
  }
}
function GlobalHeaderComponent_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275element(1, "i", 32);
    \u0275\u0275elementEnd();
  }
}
function GlobalHeaderComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 25)(2, "div", 33)(3, "p", 34);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 35);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 36);
    \u0275\u0275listener("click", function GlobalHeaderComponent_Conditional_31_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.logout());
    });
    \u0275\u0275element(8, "i", 37);
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
function GlobalHeaderComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 39)(2, "a", 40);
    \u0275\u0275element(3, "i", 41);
    \u0275\u0275text(4, " Quadros ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "a", 42);
    \u0275\u0275element(6, "i", 43);
    \u0275\u0275text(7, " Usu\xE1rios ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "a", 44);
    \u0275\u0275element(9, "i", 27);
    \u0275\u0275text(10, " Minha Empresa ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "a", 45);
    \u0275\u0275element(12, "i", 29);
    \u0275\u0275text(13, " SMTP ");
    \u0275\u0275elementEnd()()();
  }
}
var GlobalHeaderComponent = class _GlobalHeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  subdomainService = inject(SubdomainService);
  configMenuOpen = false;
  userMenuOpen = false;
  mobileMenuOpen = false;
  currentUser = () => this.authService.getCurrentUser();
  currentCompany() {
    return this.subdomainService.getCurrentCompany();
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
  static \u0275fac = function GlobalHeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GlobalHeaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GlobalHeaderComponent, selectors: [["app-global-header"]], decls: 33, vars: 19, consts: [[1, "bg-white", "border-b", "border-gray-200", "shadow-sm", "sticky", "top-0", "z-50"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8"], [1, "flex", "justify-between", "items-center", "h-16"], [1, "flex", "items-center", "space-x-3"], [1, "w-10", "h-10", "bg-gradient-to-br", "from-blue-500", "to-blue-600", "rounded-lg", "flex", "items-center", "justify-center"], [1, "fas", "fa-tasks", "text-white", "text-lg"], [1, "text-xl", "font-bold", "text-gray-900"], [1, "text-xs", "text-gray-500"], [1, "hidden", "md:flex", "items-center", "space-x-6"], ["href", "/dashboard", 1, "flex", "items-center", "px-3", "py-2", "text-sm", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md", "transition-colors"], [1, "fas", "fa-th-large", "mr-2"], ["href", "/usuarios", 1, "flex", "items-center", "px-3", "py-2", "text-sm", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md", "transition-colors"], [1, "fas", "fa-users", "mr-2"], [1, "relative", 3, "click", "clickOutside"], [1, "flex", "items-center", "px-3", "py-2", "text-sm", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md", "transition-colors"], [1, "fas", "fa-cog", "mr-2"], [1, "fas", "fa-chevron-down", "ml-1", "text-xs"], [1, "absolute", "right-0", "mt-2", "w-56", "bg-white", "rounded-md", "shadow-lg", "ring-1", "ring-black", "ring-opacity-5"], [1, "flex", "items-center", "space-x-4"], [1, "flex", "items-center", "space-x-2", "text-sm", "text-gray-600"], [1, "flex", "items-center", "p-2", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md", "transition-colors"], ["alt", "Avatar", 1, "w-8", "h-8", "rounded-full", 3, "src"], [1, "w-8", "h-8", "bg-gray-300", "rounded-full", "flex", "items-center", "justify-center"], [1, "absolute", "right-0", "mt-2", "w-48", "bg-white", "rounded-md", "shadow-lg", "ring-1", "ring-black", "ring-opacity-5"], ["class", "md:hidden border-t border-gray-200", 4, "ngIf"], [1, "py-1"], ["href", "/empresa/branding", 1, "flex", "items-center", "px-4", "py-2", "text-sm", "text-gray-700", "hover:bg-gray-100"], [1, "fas", "fa-building", "mr-3"], ["href", "/empresa/smtp", 1, "flex", "items-center", "px-4", "py-2", "text-sm", "text-gray-700", "hover:bg-gray-100"], [1, "fas", "fa-envelope", "mr-3"], [1, "fas", "fa-building", "text-xs"], [1, "font-medium"], [1, "fas", "fa-user", "text-gray-600", "text-sm"], [1, "px-4", "py-2", "border-b", "border-gray-100", "max-w-[16rem]"], [1, "text-sm", "font-medium", "text-gray-900"], [1, "text-xs", "text-gray-500", "truncate", 3, "title"], [1, "w-full", "text-left", "px-4", "py-2", "text-sm", "text-red-700", "hover:bg-red-50", 3, "click"], [1, "fas", "fa-sign-out-alt", "mr-2"], [1, "md:hidden", "border-t", "border-gray-200"], [1, "px-2", "pt-2", "pb-3", "space-y-1"], ["href", "/dashboard", 1, "flex", "items-center", "px-3", "py-2", "text-base", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md"], [1, "fas", "fa-th-large", "mr-3"], ["href", "/usuarios", 1, "flex", "items-center", "px-3", "py-2", "text-base", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md"], [1, "fas", "fa-users", "mr-3"], ["href", "/empresa/branding", 1, "flex", "items-center", "px-3", "py-2", "text-base", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md"], ["href", "/empresa/smtp", 1, "flex", "items-center", "px-3", "py-2", "text-base", "font-medium", "text-gray-700", "hover:text-blue-600", "hover:bg-blue-50", "rounded-md"]], template: function GlobalHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
      \u0275\u0275element(5, "i", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div")(7, "h1", 6);
      \u0275\u0275text(8, "Task Board");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "p", 7);
      \u0275\u0275text(10, "Sistema de Gest\xE3o Kanban");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "nav", 8)(12, "a", 9);
      \u0275\u0275element(13, "i", 10);
      \u0275\u0275text(14, " Quadros ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "a", 11);
      \u0275\u0275element(16, "i", 12);
      \u0275\u0275text(17, " Usu\xE1rios ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 13);
      \u0275\u0275listener("click", function GlobalHeaderComponent_Template_div_click_18_listener() {
        return ctx.toggleConfigMenu();
      })("clickOutside", function GlobalHeaderComponent_Template_div_clickOutside_18_listener() {
        return ctx.configMenuOpen = false;
      });
      \u0275\u0275elementStart(19, "button", 14);
      \u0275\u0275element(20, "i", 15);
      \u0275\u0275text(21, " Configura\xE7\xF5es ");
      \u0275\u0275element(22, "i", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(23, GlobalHeaderComponent_Conditional_23_Template, 8, 0, "div", 17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 18)(25, "div", 19);
      \u0275\u0275conditionalCreate(26, GlobalHeaderComponent_Conditional_26_Template, 3, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "div", 13);
      \u0275\u0275listener("click", function GlobalHeaderComponent_Template_div_click_27_listener() {
        return ctx.toggleUserMenu();
      })("clickOutside", function GlobalHeaderComponent_Template_div_clickOutside_27_listener() {
        return ctx.userMenuOpen = false;
      });
      \u0275\u0275elementStart(28, "button", 20);
      \u0275\u0275conditionalCreate(29, GlobalHeaderComponent_Conditional_29_Template, 1, 1, "img", 21)(30, GlobalHeaderComponent_Conditional_30_Template, 2, 0, "div", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(31, GlobalHeaderComponent_Conditional_31_Template, 10, 4, "div", 23);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(32, GlobalHeaderComponent_div_32_Template, 14, 0, "div", 24);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_9_0;
      \u0275\u0275advance(12);
      \u0275\u0275classProp("text-blue-600", ctx.isCurrentRoute("/dashboard"))("bg-blue-50", ctx.isCurrentRoute("/dashboard"));
      \u0275\u0275advance(3);
      \u0275\u0275classProp("text-blue-600", ctx.isCurrentRoute("/usuarios"))("bg-blue-50", ctx.isCurrentRoute("/usuarios"));
      \u0275\u0275advance(4);
      \u0275\u0275classProp("text-blue-600", ctx.configMenuOpen || ctx.isConfigRoute())("bg-blue-50", ctx.configMenuOpen || ctx.isConfigRoute());
      \u0275\u0275advance(3);
      \u0275\u0275classProp("rotate-180", ctx.configMenuOpen);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.configMenuOpen ? 23 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.currentCompany() ? 26 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(((tmp_9_0 = ctx.currentUser()) == null ? null : tmp_9_0.photoURL) ? 29 : 30);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.userMenuOpen ? 31 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.mobileMenuOpen);
    }
  }, dependencies: [CommonModule, NgIf], styles: ["\n\n.rotate-180[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n@media (max-width: 768px) {\n  .mobile-menu-button[_ngcontent-%COMP%] {\n    display: block;\n  }\n}\n/*# sourceMappingURL=global-header.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlobalHeaderComponent, [{
    type: Component,
    args: [{ selector: "app-global-header", standalone: true, imports: [CommonModule], template: `
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Task Board Logo/Brand -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-tasks text-white text-lg"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Task Board</h1>
              <p class="text-xs text-gray-500">Sistema de Gest\xE3o Kanban</p>
            </div>
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GlobalHeaderComponent, { className: "GlobalHeaderComponent", filePath: "src/app/components/global-header/global-header.component.ts", lineNumber: 145 });
})();

// src/app/components/global-footer/global-footer.component.ts
var GlobalFooterComponent = class _GlobalFooterComponent {
  static \u0275fac = function GlobalFooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GlobalFooterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GlobalFooterComponent, selectors: [["app-global-footer"]], decls: 15, vars: 0, consts: [[1, "bg-gray-50", "border-t", "border-gray-200", "mt-auto"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-4"], [1, "flex", "items-center", "justify-center"], [1, "flex", "items-center", "space-x-2", "text-sm", "text-gray-500"], [1, "flex", "items-center", "space-x-1"], [1, "w-5", "h-5", "bg-gradient-to-br", "from-blue-500", "to-blue-600", "rounded", "flex", "items-center", "justify-center"], [1, "fas", "fa-tasks", "text-white", "text-xs"], [1, "font-semibold", "text-gray-700"]], template: function GlobalFooterComponent_Template(rf, ctx) {
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
  }, dependencies: [CommonModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=global-footer.component.css.map */"] });
};
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
var _c0 = (a0, a1, a2, a3) => ({ "bg-green-600": a0, "bg-red-600": a1, "bg-blue-600": a2, "bg-yellow-600": a3 });
function ToastContainerComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "div", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 5);
    \u0275\u0275listener("click", function ToastContainerComponent_div_1_Template_button_click_4_listener() {
      const m_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toast.dismiss(m_r2.id));
    });
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
var ToastContainerComponent = class _ToastContainerComponent {
  toast = inject(ToastService);
  static \u0275fac = function ToastContainerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastContainerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ToastContainerComponent, selectors: [["app-toast-container"]], decls: 3, vars: 3, consts: [[1, "fixed", "top-4", "right-4", "z-50", "space-y-2", "w-80"], ["class", "shadow rounded px-4 py-3 text-white", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "shadow", "rounded", "px-4", "py-3", "text-white", 3, "ngClass"], [1, "flex", "items-start", "justify-between"], [1, "pr-3", "text-sm"], [1, "text-white/80", "hover:text-white", "ml-2", 3, "click"]], template: function ToastContainerComponent_Template(rf, ctx) {
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
  }, dependencies: [CommonModule, NgClass, NgForOf, AsyncPipe], encapsulation: 2 });
};
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
var MainLayoutComponent = class _MainLayoutComponent {
  static \u0275fac = function MainLayoutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MainLayoutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MainLayoutComponent, selectors: [["app-main-layout"]], ngContentSelectors: _c02, decls: 6, vars: 0, consts: [[1, "min-h-screen", "flex", "flex-col"], [1, "flex-1"]], template: function MainLayoutComponent_Template(rf, ctx) {
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
  }, dependencies: [CommonModule, GlobalHeaderComponent, GlobalFooterComponent, ToastContainerComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n/*# sourceMappingURL=main-layout.component.css.map */"] });
};
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
  ToastService,
  MainLayoutComponent
};
//# sourceMappingURL=chunk-ZIJNLXLI.js.map
