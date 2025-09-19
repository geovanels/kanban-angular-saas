import {
  CommonModule,
  Component,
  __name,
  __publicField,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext
} from "./chunk-GMR7JISZ.js";

// src/app/components/company-not-found/company-not-found.component.ts
var _CompanyNotFoundComponent = class _CompanyNotFoundComponent {
};
__name(_CompanyNotFoundComponent, "CompanyNotFoundComponent");
__publicField(_CompanyNotFoundComponent, "\u0275fac", /* @__PURE__ */ __name(function CompanyNotFoundComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CompanyNotFoundComponent)();
}, "CompanyNotFoundComponent_Factory"));
__publicField(_CompanyNotFoundComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CompanyNotFoundComponent, selectors: [["app-company-not-found"]], decls: 7, vars: 0, consts: [[1, "company-not-found-container"], ["href", "https://apps.taskboard.com.br", 1, "btn", "btn-primary"]], template: /* @__PURE__ */ __name(function CompanyNotFoundComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 0)(1, "h2");
    \u0275\u0275text(2, "Empresa n\xE3o encontrada");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "p");
    \u0275\u0275text(4, "A empresa que voc\xEA est\xE1 procurando n\xE3o foi encontrada ou est\xE1 inativa.");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "a", 1);
    \u0275\u0275text(6, " Voltar ao portal principal ");
    \u0275\u0275domElementEnd()();
  }
}, "CompanyNotFoundComponent_Template"), dependencies: [CommonModule], styles: ["\n\n.company-not-found-container[_ngcontent-%COMP%] {\n  padding: 40px;\n  text-align: center;\n  min-height: 50vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  background: #007bff;\n  color: white;\n  text-decoration: none;\n  border-radius: 6px;\n  margin-top: 20px;\n}\n/*# sourceMappingURL=company-not-found.component.css.map */"] }));
var CompanyNotFoundComponent = _CompanyNotFoundComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompanyNotFoundComponent, [{
    type: Component,
    args: [{ selector: "app-company-not-found", standalone: true, imports: [CommonModule], template: `
    <div class="company-not-found-container">
      <h2>Empresa n\xE3o encontrada</h2>
      <p>A empresa que voc\xEA est\xE1 procurando n\xE3o foi encontrada ou est\xE1 inativa.</p>
      <a href="https://apps.taskboard.com.br" class="btn btn-primary">
        Voltar ao portal principal
      </a>
    </div>
  `, styles: ["/* angular:styles/component:scss;1c85c248dce3ac9b749284c0bd3f5eea0ee7a3e6735e88e0bbdeda29568b8625;/Users/geovanelopes/Documents/GitHub/kanban-angular-saas/src/app/components/company-not-found/company-not-found.component.ts */\n.company-not-found-container {\n  padding: 40px;\n  text-align: center;\n  min-height: 50vh;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.btn {\n  padding: 12px 24px;\n  background: #007bff;\n  color: white;\n  text-decoration: none;\n  border-radius: 6px;\n  margin-top: 20px;\n}\n/*# sourceMappingURL=company-not-found.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CompanyNotFoundComponent, { className: "CompanyNotFoundComponent", filePath: "src/app/components/company-not-found/company-not-found.component.ts", lineNumber: 38 });
})();
export {
  CompanyNotFoundComponent
};
//# sourceMappingURL=chunk-LY3IRNDC.js.map
