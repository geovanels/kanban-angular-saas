import {
  Router
} from "./chunk-5BCXWPYT.js";
import {
  SubdomainService
} from "./chunk-L2S3FEQE.js";
import {
  CommonModule,
  Component,
  Input,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-GHLOFODZ.js";

// src/app/components/config-header/config-header.component.ts
var _c0 = ["*"];
function ConfigHeaderComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElement(0, "img", 6);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275domProperty("src", ctx_r0.companyLogo, \u0275\u0275sanitizeUrl)("alt", "Logo " + ctx_r0.companyName);
  }
}
function ConfigHeaderComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("background-color", ctx_r0.primaryColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getCompanyInitials(), " ");
  }
}
var ConfigHeaderComponent = class _ConfigHeaderComponent {
  title = "";
  router = inject(Router);
  subdomainService = inject(SubdomainService);
  get companyName() {
    return this.subdomainService.getCurrentCompany()?.name || "Sistema Kanban";
  }
  get companyLogo() {
    const company = this.subdomainService.getCurrentCompany();
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== "") {
      return company.brandingConfig.logo;
    }
    if (company?.subdomain === "gobuyer") {
      return "https://apps.gobuyer.com.br/sso/assets/images/logos/logo-gobuyer.png";
    }
    return "";
  }
  goToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
  hasCustomLogo() {
    const company = this.subdomainService.getCurrentCompany();
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== "") {
      return true;
    }
    if (company?.subdomain === "gobuyer") {
      return true;
    }
    return false;
  }
  get primaryColor() {
    const company = this.subdomainService.getCurrentCompany();
    return company?.brandingConfig?.primaryColor || "#3B82F6";
  }
  getCompanyInitials() {
    const name = this.companyName;
    if (!name || name === "Sistema Kanban")
      return "SK";
    const words = name.split(" ").filter((word) => word.length > 0);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    return "SK";
  }
  static \u0275fac = function ConfigHeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConfigHeaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConfigHeaderComponent, selectors: [["app-config-header"]], inputs: { title: "title" }, ngContentSelectors: _c0, decls: 12, vars: 2, consts: [[1, "bg-white", "shadow-sm", "border-b", "border-gray-200"], [1, "max-w-full", "mx-auto", "px-4", "sm:px-6", "lg:px-8"], [1, "flex", "justify-between", "items-center", "h-16"], [1, "flex", "items-center", "space-x-4"], [1, "text-gray-500", "hover:text-gray-700", "p-2", "rounded-lg", "hover:bg-gray-100", "transition-colors", 3, "click"], [1, "fas", "fa-arrow-left"], [1, "h-8", "w-auto", "rounded", 3, "src", "alt"], [1, "h-8", "w-8", "rounded", "flex", "items-center", "justify-center", "text-white", "font-bold", "text-sm", 3, "background-color"], [1, "text-xl", "font-semibold", "text-gray-900"], [1, "h-8", "w-8", "rounded", "flex", "items-center", "justify-center", "text-white", "font-bold", "text-sm"]], template: function ConfigHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElementStart(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "button", 4);
      \u0275\u0275domListener("click", function ConfigHeaderComponent_Template_button_click_4_listener() {
        return ctx.goToDashboard();
      });
      \u0275\u0275domElement(5, "i", 5);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(6, ConfigHeaderComponent_Conditional_6_Template, 1, 2, "img", 6)(7, ConfigHeaderComponent_Conditional_7_Template, 2, 3, "div", 7);
      \u0275\u0275domElementStart(8, "h1", 8);
      \u0275\u0275text(9);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(10, "div", 3);
      \u0275\u0275projection(11);
      \u0275\u0275domElementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.hasCustomLogo() ? 6 : 7);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.title, " ");
    }
  }, dependencies: [CommonModule], styles: ["\n\nheader[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}\n/*# sourceMappingURL=config-header.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfigHeaderComponent, [{
    type: Component,
    args: [{ selector: "app-config-header", standalone: true, imports: [CommonModule], template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button 
              (click)="goToDashboard()"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <i class="fas fa-arrow-left"></i>
            </button>
            
            @if (hasCustomLogo()) {
              <img [src]="companyLogo" 
                   [alt]="'Logo ' + companyName" 
                   class="h-8 w-auto rounded">
            } @else {
              <div class="h-8 w-8 rounded flex items-center justify-center text-white font-bold text-sm"
                   [style.background-color]="primaryColor">
                {{ getCompanyInitials() }}
              </div>
            }
            
            <h1 class="text-xl font-semibold text-gray-900">
              {{ title }}
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </header>
  `, styles: ["/* angular:styles/component:scss;b76958eeb0ab7f94a42bbe58a4c4d350286a3eb296dfcf6ab4fbf7446d3e43ca;/Users/geovanelopes/Documents/GitHub/kanban-angular-saas/src/app/components/config-header/config-header.component.ts */\nheader {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}\n/*# sourceMappingURL=config-header.component.css.map */\n"] }]
  }], null, { title: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConfigHeaderComponent, { className: "ConfigHeaderComponent", filePath: "src/app/components/config-header/config-header.component.ts", lineNumber: 52 });
})();

export {
  ConfigHeaderComponent
};
//# sourceMappingURL=chunk-43C7U4XV.js.map
