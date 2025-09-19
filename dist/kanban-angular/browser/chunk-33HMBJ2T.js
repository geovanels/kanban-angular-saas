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
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-GMR7JISZ.js";

// src/app/components/company-breadcrumb/company-breadcrumb.component.ts
var _c0 = ["*"];
function CompanyBreadcrumbComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.subtitle);
  }
}
__name(CompanyBreadcrumbComponent_Conditional_9_Template, "CompanyBreadcrumbComponent_Conditional_9_Template");
var _CompanyBreadcrumbComponent = class _CompanyBreadcrumbComponent {
  title = "Meus quadros Kanban";
  subtitle;
  subdomainService = inject(SubdomainService);
  router = inject(Router);
  get companyName() {
    return this.subdomainService.getCurrentCompany()?.name || "Task Board";
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
    if (!name || name === "Task Board")
      return "TB";
    const words = name.split(" ").filter((word) => word.length > 0);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    return "TB";
  }
  goBack() {
    const currentUrl = this.router.url;
    if (currentUrl.includes("/empresa/") || currentUrl.includes("/usuarios")) {
      this.router.navigate(["/dashboard"]);
    } else {
      window.history.back();
    }
  }
};
__name(_CompanyBreadcrumbComponent, "CompanyBreadcrumbComponent");
__publicField(_CompanyBreadcrumbComponent, "\u0275fac", /* @__PURE__ */ __name(function CompanyBreadcrumbComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CompanyBreadcrumbComponent)();
}, "CompanyBreadcrumbComponent_Factory"));
__publicField(_CompanyBreadcrumbComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CompanyBreadcrumbComponent, selectors: [["app-company-breadcrumb"]], inputs: { title: "title", subtitle: "subtitle" }, ngContentSelectors: _c0, decls: 12, vars: 2, consts: [[1, "bg-gray-50", "border-b", "border-gray-200"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-4"], [1, "flex", "items-center", "space-x-4"], [1, "flex", "items-center", "space-x-3"], [1, "text-gray-500", "hover:text-gray-700", "p-1", "rounded", "hover:bg-gray-100", "transition-colors", 3, "click"], [1, "fas", "fa-arrow-left"], [1, "text-lg", "font-semibold", "text-gray-900"], [1, "text-sm", "text-gray-600"], [1, "flex-1", "flex", "justify-end"]], template: /* @__PURE__ */ __name(function CompanyBreadcrumbComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projectionDef();
    \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "button", 4);
    \u0275\u0275domListener("click", /* @__PURE__ */ __name(function CompanyBreadcrumbComponent_Template_button_click_4_listener() {
      return ctx.goBack();
    }, "CompanyBreadcrumbComponent_Template_button_click_4_listener"));
    \u0275\u0275domElement(5, "i", 5);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(6, "div")(7, "h2", 6);
    \u0275\u0275text(8);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(9, CompanyBreadcrumbComponent_Conditional_9_Template, 2, 1, "p", 7);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(10, "div", 8);
    \u0275\u0275projection(11);
    \u0275\u0275domElementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ctx.title, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.subtitle ? 9 : -1);
  }
}, "CompanyBreadcrumbComponent_Template"), dependencies: [CommonModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=company-breadcrumb.component.css.map */"] }));
var CompanyBreadcrumbComponent = _CompanyBreadcrumbComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompanyBreadcrumbComponent, [{
    type: Component,
    args: [{ selector: "app-company-breadcrumb", standalone: true, imports: [CommonModule], template: `
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-4">
          <!-- Page Title -->
          <div class="flex items-center space-x-3">
            <!-- Back Button -->
            <button 
              (click)="goBack()"
              class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors">
              <i class="fas fa-arrow-left"></i>
            </button>
            
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h2>
              @if (subtitle) {
                <p class="text-sm text-gray-600">{{ subtitle }}</p>
              }
            </div>
          </div>
          
          <!-- Actions Slot -->
          <div class="flex-1 flex justify-end">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `, styles: ["/* angular:styles/component:scss;219558ef63f119a92210704329b58a3cdceaa4fb296db559e672f74512827dc7;/Users/geovanelopes/Documents/GitHub/kanban-angular-saas/src/app/components/company-breadcrumb/company-breadcrumb.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=company-breadcrumb.component.css.map */\n"] }]
  }], null, { title: [{
    type: Input
  }], subtitle: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CompanyBreadcrumbComponent, { className: "CompanyBreadcrumbComponent", filePath: "src/app/components/company-breadcrumb/company-breadcrumb.component.ts", lineNumber: 47 });
})();

export {
  CompanyBreadcrumbComponent
};
//# sourceMappingURL=chunk-33HMBJ2T.js.map
