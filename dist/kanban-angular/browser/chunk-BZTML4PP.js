import {
  Router
} from "./chunk-2S4XXET5.js";
import {
  SubdomainService
} from "./chunk-NDNGZ4HQ.js";
import {
  CommonModule,
  Component,
  Input,
  __name,
  __publicField,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-GMR7JISZ.js";

// src/app/components/config-header/config-header.component.ts
var _c0 = ["*"];
var _ConfigHeaderComponent = class _ConfigHeaderComponent {
  title = "";
  router = inject(Router);
  subdomainService = inject(SubdomainService);
  get companyName() {
    return this.subdomainService.getCurrentCompany()?.name || "Sistema Kanban";
  }
  get companyLogo() {
    const company = this.subdomainService.getCurrentCompany();
    if (company?.logoUrl && company.logoUrl.trim() !== "") {
      return company.logoUrl;
    }
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== "") {
      return company.brandingConfig.logo;
    }
    return "";
  }
  goToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
  hasCustomLogo() {
    const company = this.subdomainService.getCurrentCompany();
    if (company?.logoUrl && company.logoUrl.trim() !== "") {
      return true;
    }
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== "") {
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
};
__name(_ConfigHeaderComponent, "ConfigHeaderComponent");
__publicField(_ConfigHeaderComponent, "\u0275fac", /* @__PURE__ */ __name(function ConfigHeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ConfigHeaderComponent)();
}, "ConfigHeaderComponent_Factory"));
__publicField(_ConfigHeaderComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConfigHeaderComponent, selectors: [["app-config-header"]], inputs: { title: "title" }, ngContentSelectors: _c0, decls: 10, vars: 1, consts: [[1, "bg-white", "shadow-sm", "border-b", "border-gray-200"], [1, "max-w-full", "mx-auto", "px-4", "sm:px-6", "lg:px-8"], [1, "flex", "justify-between", "items-center", "h-16"], [1, "flex", "items-center", "space-x-4"], [1, "text-gray-500", "hover:text-gray-700", "p-2", "rounded-lg", "hover:bg-gray-100", "transition-colors", 3, "click"], [1, "fas", "fa-arrow-left"], [1, "text-xl", "font-semibold", "text-gray-900"]], template: /* @__PURE__ */ __name(function ConfigHeaderComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projectionDef();
    \u0275\u0275domElementStart(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "button", 4);
    \u0275\u0275domListener("click", /* @__PURE__ */ __name(function ConfigHeaderComponent_Template_button_click_4_listener() {
      return ctx.goToDashboard();
    }, "ConfigHeaderComponent_Template_button_click_4_listener"));
    \u0275\u0275domElement(5, "i", 5);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "h1", 6);
    \u0275\u0275text(7);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(8, "div", 3);
    \u0275\u0275projection(9);
    \u0275\u0275domElementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", ctx.title, " ");
  }
}, "ConfigHeaderComponent_Template"), dependencies: [CommonModule], styles: ["\n\nheader[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}\n/*# sourceMappingURL=config-header.component.css.map */"] }));
var ConfigHeaderComponent = _ConfigHeaderComponent;
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConfigHeaderComponent, { className: "ConfigHeaderComponent", filePath: "src/app/components/config-header/config-header.component.ts", lineNumber: 41 });
})();

export {
  ConfigHeaderComponent
};
//# sourceMappingURL=chunk-BZTML4PP.js.map
