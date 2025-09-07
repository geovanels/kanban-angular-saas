import {
  MainLayoutComponent
} from "./chunk-ZIJNLXLI.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  Router,
  ɵNgNoValidate
} from "./chunk-5BCXWPYT.js";
import "./chunk-PTOBJH2A.js";
import {
  AuthService,
  FirestoreService,
  SubdomainService
} from "./chunk-L2S3FEQE.js";
import {
  CommonModule,
  Component,
  EventEmitter,
  HostListener,
  Input,
  NgIf,
  Output,
  ViewChild,
  __async,
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
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-GHLOFODZ.js";

// src/app/components/create-board-modal/create-board-modal.component.ts
function CreateBoardModalComponent_div_0_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.errorMessage, " ");
  }
}
function CreateBoardModalComponent_div_0_div_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 22);
  }
}
function CreateBoardModalComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275listener("click", function CreateBoardModalComponent_div_0_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBackdropClick($event));
    });
    \u0275\u0275elementStart(1, "div", 2)(2, "div", 3)(3, "h2", 4);
    \u0275\u0275text(4, "Novo Quadro Kanban");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 5);
    \u0275\u0275listener("click", function CreateBoardModalComponent_div_0_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.hide());
    });
    \u0275\u0275text(6, " \xD7 ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "form", 6);
    \u0275\u0275listener("ngSubmit", function CreateBoardModalComponent_div_0_Template_form_ngSubmit_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.createBoard());
    });
    \u0275\u0275elementStart(8, "div")(9, "label", 7);
    \u0275\u0275text(10, " Nome do Quadro * ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 8);
    \u0275\u0275twoWayListener("ngModelChange", function CreateBoardModalComponent_div_0_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.boardName, $event) || (ctx_r1.boardName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "label", 9);
    \u0275\u0275text(14, " Descri\xE7\xE3o (Opcional) ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "textarea", 10);
    \u0275\u0275twoWayListener("ngModelChange", function CreateBoardModalComponent_div_0_Template_textarea_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.boardDescription, $event) || (ctx_r1.boardDescription = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(16, CreateBoardModalComponent_div_0_div_16_Template, 2, 1, "div", 11);
    \u0275\u0275elementStart(17, "div", 12)(18, "div", 13);
    \u0275\u0275element(19, "i", 14);
    \u0275\u0275elementStart(20, "div", 15)(21, "strong");
    \u0275\u0275text(22, "Ap\xF3s criar o quadro:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "ul", 16)(24, "li");
    \u0275\u0275text(25, "Configure as fases do seu processo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "li");
    \u0275\u0275text(27, "Defina os campos do formul\xE1rio conforme sua necessidade");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "li");
    \u0275\u0275text(29, "Personalize para qualquer tipo de processo (vendas, compras, viagens, etc.)");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(30, "div", 17)(31, "button", 18);
    \u0275\u0275listener("click", function CreateBoardModalComponent_div_0_Template_button_click_31_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.hide());
    });
    \u0275\u0275text(32, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "button", 19);
    \u0275\u0275template(34, CreateBoardModalComponent_div_0_div_34_Template, 1, 0, "div", 20);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("disabled", ctx_r1.isLoading);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.boardName);
    \u0275\u0275property("disabled", ctx_r1.isLoading);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.boardDescription);
    \u0275\u0275property("disabled", ctx_r1.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.errorMessage);
    \u0275\u0275advance(15);
    \u0275\u0275property("disabled", ctx_r1.isLoading);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-color", ctx_r1.getPrimaryColor())("opacity", ctx_r1.isLoading || !ctx_r1.boardName.trim() ? "0.6" : "1");
    \u0275\u0275property("disabled", ctx_r1.isLoading || !ctx_r1.boardName.trim());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isLoading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isLoading ? "Criando..." : "Criar Quadro", " ");
  }
}
var CreateBoardModalComponent = class _CreateBoardModalComponent {
  authService = inject(AuthService);
  firestoreService = inject(FirestoreService);
  subdomainService = inject(SubdomainService);
  boardCreated = new EventEmitter();
  closeModal = new EventEmitter();
  boardName = "";
  boardDescription = "";
  isLoading = false;
  errorMessage = "";
  isVisible = false;
  show() {
    this.isVisible = true;
    this.resetForm();
  }
  hide() {
    this.isVisible = false;
    this.closeModal.emit();
  }
  resetForm() {
    this.boardName = "";
    this.boardDescription = "";
    this.errorMessage = "";
    this.isLoading = false;
  }
  createBoard() {
    return __async(this, null, function* () {
      if (!this.boardName.trim()) {
        this.errorMessage = "Nome do quadro \xE9 obrigat\xF3rio";
        return;
      }
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.errorMessage = "Usu\xE1rio n\xE3o autenticado";
        return;
      }
      this.isLoading = true;
      this.errorMessage = "";
      try {
        const boardData = {
          name: this.boardName.trim(),
          description: this.boardDescription.trim(),
          companyId: "",
          // Será preenchido pelo FirestoreService
          createdAt: null
          // será preenchido pelo serverTimestamp
        };
        const boardRef = yield this.firestoreService.createBoard(currentUser.uid, boardData);
        yield this.firestoreService.updateBoard(currentUser.uid, boardRef.id, {
          ownerEmail: currentUser.email || ""
        });
        this.boardCreated.emit();
        this.hide();
      } catch (error) {
        console.error("Erro ao criar quadro:", error);
        this.errorMessage = "Erro ao criar quadro. Tente novamente.";
      } finally {
        this.isLoading = false;
      }
    });
  }
  onBackdropClick(event) {
    if (event.target === event.currentTarget) {
      this.hide();
    }
  }
  getPrimaryColor() {
    const company = this.subdomainService.getCurrentCompany();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || "#3B82F6";
  }
  static \u0275fac = function CreateBoardModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CreateBoardModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CreateBoardModalComponent, selectors: [["app-create-board-modal"]], outputs: { boardCreated: "boardCreated", closeModal: "closeModal" }, decls: 1, vars: 1, consts: [["class", "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", 3, "click", 4, "ngIf"], [1, "fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center", "z-50", 3, "click"], [1, "bg-white", "rounded-xl", "shadow-2xl", "w-full", "max-w-md", "p-6"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-gray-900"], [1, "text-gray-400", "hover:text-gray-600", "text-2xl", "font-bold", 3, "click", "disabled"], [1, "space-y-4", 3, "ngSubmit"], ["for", "boardName", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["type", "text", "id", "boardName", "name", "boardName", "placeholder", "Ex: Vendas 2024", "maxlength", "100", "required", "", 1, "w-full", "p-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", "transition-colors", 3, "ngModelChange", "ngModel", "disabled"], ["for", "boardDescription", 1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["id", "boardDescription", "name", "boardDescription", "rows", "3", "placeholder", "Descreva o prop\xF3sito deste quadro...", "maxlength", "500", 1, "w-full", "p-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", "transition-colors", "resize-none", 3, "ngModelChange", "ngModel", "disabled"], ["class", "text-red-500 text-sm", 4, "ngIf"], [1, "bg-blue-50", "border", "border-blue-200", "rounded-lg", "p-3"], [1, "flex", "items-start"], [1, "fas", "fa-info-circle", "text-blue-500", "mt-0.5", "mr-2"], [1, "text-sm", "text-blue-700"], [1, "mt-1", "ml-2", "list-disc"], [1, "flex", "justify-end", "gap-3", "pt-4"], ["type", "button", 1, "px-4", "py-2", "text-gray-700", "bg-gray-200", "hover:bg-gray-300", "rounded-lg", "font-medium", "transition-colors", 3, "click", "disabled"], ["type", "submit", 1, "px-6", "py-2", "text-white", "rounded-lg", "font-medium", "transition-colors", "flex", "items-center", 3, "disabled"], ["class", "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2", 4, "ngIf"], [1, "text-red-500", "text-sm"], [1, "animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-white", "mr-2"]], template: function CreateBoardModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, CreateBoardModalComponent_div_0_Template, 36, 14, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", ctx.isVisible);
    }
  }, dependencies: [CommonModule, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm], styles: ["\n\n.fixed[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.2s ease-out;\n}\n.bg-white[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=create-board-modal.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreateBoardModalComponent, [{
    type: Component,
    args: [{ selector: "app-create-board-modal", standalone: true, imports: [CommonModule, FormsModule], template: `<div *ngIf="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="onBackdropClick($event)">
  <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Novo Quadro Kanban</h2>
      <button 
        (click)="hide()" 
        class="text-gray-400 hover:text-gray-600 text-2xl font-bold"
        [disabled]="isLoading">
        &times;
      </button>
    </div>

    <form (ngSubmit)="createBoard()" class="space-y-4">
      <div>
        <label for="boardName" class="block text-sm font-medium text-gray-700 mb-1">
          Nome do Quadro *
        </label>
        <input 
          type="text" 
          id="boardName"
          [(ngModel)]="boardName"
          name="boardName"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Ex: Vendas 2024"
          maxlength="100"
          required
          [disabled]="isLoading">
      </div>

      <div>
        <label for="boardDescription" class="block text-sm font-medium text-gray-700 mb-1">
          Descri\xE7\xE3o (Opcional)
        </label>
        <textarea 
          id="boardDescription"
          [(ngModel)]="boardDescription"
          name="boardDescription"
          rows="3"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          placeholder="Descreva o prop\xF3sito deste quadro..."
          maxlength="500"
          [disabled]="isLoading"></textarea>
      </div>

      <div *ngIf="errorMessage" class="text-red-500 text-sm">
        {{ errorMessage }}
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div class="flex items-start">
          <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
          <div class="text-sm text-blue-700">
            <strong>Ap\xF3s criar o quadro:</strong>
            <ul class="mt-1 ml-2 list-disc">
              <li>Configure as fases do seu processo</li>
              <li>Defina os campos do formul\xE1rio conforme sua necessidade</li>
              <li>Personalize para qualquer tipo de processo (vendas, compras, viagens, etc.)</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4">
        <button 
          type="button" 
          (click)="hide()"
          class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
          [disabled]="isLoading">
          Cancelar
        </button>
        
        <button 
          type="submit" 
          [disabled]="isLoading || !boardName.trim()"
          class="px-6 py-2 text-white rounded-lg font-medium transition-colors flex items-center"
          [style.background-color]="getPrimaryColor()"
          [style.opacity]="isLoading || !boardName.trim() ? '0.6' : '1'">
          <div *ngIf="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {{ isLoading ? 'Criando...' : 'Criar Quadro' }}
        </button>
      </div>
    </form>
  </div>
</div>`, styles: ["/* src/app/components/create-board-modal/create-board-modal.component.scss */\n.fixed {\n  animation: fadeIn 0.2s ease-out;\n}\n.bg-white {\n  animation: slideUp 0.3s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=create-board-modal.component.css.map */\n"] }]
  }], null, { boardCreated: [{
    type: Output
  }], closeModal: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CreateBoardModalComponent, { className: "CreateBoardModalComponent", filePath: "src/app/components/create-board-modal/create-board-modal.component.ts", lineNumber: 15 });
})();

// src/app/components/company-breadcrumb/company-breadcrumb.component.ts
var _c0 = ["*"];
function CompanyBreadcrumbComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElement(0, "img", 6);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275domProperty("src", ctx_r0.companyLogo, \u0275\u0275sanitizeUrl)("alt", "Logo " + ctx_r0.companyName);
  }
}
function CompanyBreadcrumbComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 11);
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
function CompanyBreadcrumbComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 9);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.subtitle);
  }
}
var CompanyBreadcrumbComponent = class _CompanyBreadcrumbComponent {
  title = "Meus quadros Kanban";
  subtitle;
  subdomainService = inject(SubdomainService);
  router = inject(Router);
  get companyName() {
    return this.subdomainService.getCurrentCompany()?.name || "Task Board";
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
  static \u0275fac = function CompanyBreadcrumbComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CompanyBreadcrumbComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CompanyBreadcrumbComponent, selectors: [["app-company-breadcrumb"]], inputs: { title: "title", subtitle: "subtitle" }, ngContentSelectors: _c0, decls: 14, vars: 3, consts: [[1, "bg-gray-50", "border-b", "border-gray-200"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-4"], [1, "flex", "items-center", "space-x-4"], [1, "flex", "items-center", "space-x-3"], [1, "text-gray-500", "hover:text-gray-700", "p-1", "rounded", "hover:bg-gray-100", "transition-colors", 3, "click"], [1, "fas", "fa-arrow-left"], [1, "h-10", "w-auto", "rounded", 3, "src", "alt"], [1, "h-10", "w-10", "rounded-lg", "flex", "items-center", "justify-center", "text-white", "font-bold", 3, "background-color"], [1, "text-lg", "font-semibold", "text-gray-900"], [1, "text-sm", "text-gray-600"], [1, "flex-1", "flex", "justify-end"], [1, "h-10", "w-10", "rounded-lg", "flex", "items-center", "justify-center", "text-white", "font-bold"]], template: function CompanyBreadcrumbComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "button", 4);
      \u0275\u0275domListener("click", function CompanyBreadcrumbComponent_Template_button_click_4_listener() {
        return ctx.goBack();
      });
      \u0275\u0275domElement(5, "i", 5);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(6, CompanyBreadcrumbComponent_Conditional_6_Template, 1, 2, "img", 6)(7, CompanyBreadcrumbComponent_Conditional_7_Template, 2, 3, "div", 7);
      \u0275\u0275domElementStart(8, "div")(9, "h2", 8);
      \u0275\u0275text(10);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(11, CompanyBreadcrumbComponent_Conditional_11_Template, 2, 1, "p", 9);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(12, "div", 10);
      \u0275\u0275projection(13);
      \u0275\u0275domElementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.hasCustomLogo() ? 6 : 7);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", ctx.title, " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.subtitle ? 11 : -1);
    }
  }, dependencies: [CommonModule], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=company-breadcrumb.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompanyBreadcrumbComponent, [{
    type: Component,
    args: [{ selector: "app-company-breadcrumb", standalone: true, imports: [CommonModule], template: `
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-4">
          <!-- Company Logo -->
          <div class="flex items-center space-x-3">
            <!-- Back Button -->
            <button 
              (click)="goBack()"
              class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors">
              <i class="fas fa-arrow-left"></i>
            </button>
            
            @if (hasCustomLogo()) {
              <img [src]="companyLogo" 
                   [alt]="'Logo ' + companyName" 
                   class="h-10 w-auto rounded">
            } @else {
              <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                   [style.background-color]="primaryColor">
                {{ getCompanyInitials() }}
              </div>
            }
            
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CompanyBreadcrumbComponent, { className: "CompanyBreadcrumbComponent", filePath: "src/app/components/company-breadcrumb/company-breadcrumb.component.ts", lineNumber: 58 });
})();

// src/app/components/dashboard/dashboard.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function DashboardComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 9);
    \u0275\u0275element(2, "i", 10);
    \u0275\u0275elementStart(3, "p", 11);
    \u0275\u0275text(4, "Carregando seus quadros...");
    \u0275\u0275elementEnd()()();
  }
}
function DashboardComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 12);
    \u0275\u0275element(2, "i", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 14);
    \u0275\u0275text(4, "Nenhum quadro encontrado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6, "Crie seu primeiro quadro Kanban para come\xE7ar a organizar suas tarefas.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 16);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_8_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showCreateBoardModal());
    });
    \u0275\u0275element(8, "i", 4);
    \u0275\u0275text(9, " Criar Primeiro Quadro ");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_Conditional_9_For_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const board_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", board_r4.description, " ");
  }
}
function DashboardComponent_Conditional_9_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 34)(2, "button", 35);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_9_For_2_Conditional_10_Template_button_click_2_listener($event) {
      \u0275\u0275restoreView(_r5);
      const board_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.editBoard(board_r4));
    });
    \u0275\u0275element(3, "i", 36);
    \u0275\u0275text(4, " Editar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 35);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_9_For_2_Conditional_10_Template_button_click_5_listener($event) {
      \u0275\u0275restoreView(_r5);
      const board_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.duplicateBoard(board_r4));
    });
    \u0275\u0275element(6, "i", 37);
    \u0275\u0275text(7, " Duplicar ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "hr", 38);
    \u0275\u0275elementStart(9, "button", 39);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_9_For_2_Conditional_10_Template_button_click_9_listener($event) {
      \u0275\u0275restoreView(_r5);
      const board_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.deleteBoard(board_r4.id));
    });
    \u0275\u0275element(10, "i", 40);
    \u0275\u0275text(11, " Excluir ");
    \u0275\u0275elementEnd()()();
  }
}
function DashboardComponent_Conditional_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_9_For_2_Template_div_click_0_listener() {
      const board_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openBoard(board_r4.id));
    });
    \u0275\u0275elementStart(1, "div", 19)(2, "div", 20)(3, "div", 21)(4, "h3", 22);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, DashboardComponent_Conditional_9_For_2_Conditional_6_Template, 2, 1, "p", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 24)(8, "button", 25);
    \u0275\u0275listener("click", function DashboardComponent_Conditional_9_For_2_Template_button_click_8_listener($event) {
      const board_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.toggleBoardMenu(board_r4.id));
    });
    \u0275\u0275element(9, "i", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, DashboardComponent_Conditional_9_For_2_Conditional_10_Template, 12, 0, "div", 27);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 28)(12, "div", 29)(13, "div", 30)(14, "span", 11);
    \u0275\u0275element(15, "i", 31);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 11);
    \u0275\u0275element(18, "i", 32);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 33);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const board_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", board_r4.name, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(board_r4.description ? 6 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.activeBoardMenu === board_r4.id ? 10 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r1.getBoardColumnCount(board_r4.id), " colunas ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.getBoardTaskCount(board_r4.id), " leads ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatDate(board_r4.createdAt), " ");
  }
}
function DashboardComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275repeaterCreate(1, DashboardComponent_Conditional_9_For_2_Template, 22, 6, "div", 17, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.boards);
  }
}
function DashboardComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-create-board-modal", 41, 0);
    \u0275\u0275listener("boardCreated", function DashboardComponent_Conditional_10_Template_app_create_board_modal_boardCreated_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBoardCreated($event));
    })("closeModal", function DashboardComponent_Conditional_10_Template_app_create_board_modal_closeModal_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showCreateModal = false);
    });
    \u0275\u0275elementEnd();
  }
}
var DashboardComponent = class _DashboardComponent {
  authService = inject(AuthService);
  firestoreService = inject(FirestoreService);
  subdomainService = inject(SubdomainService);
  router = inject(Router);
  createBoardModal;
  boards = [];
  isLoading = false;
  currentUser = null;
  showConfigMenu = false;
  showCreateModal = false;
  activeBoardMenu = null;
  subscription;
  // Estatísticas dos boards
  boardStats = {};
  ngOnInit() {
    return __async(this, null, function* () {
      this.currentUser = this.authService.getCurrentUser();
      if (this.currentUser) {
        yield this.loadBoards();
      }
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngAfterViewInit() {
  }
  loadBoards() {
    return __async(this, null, function* () {
      if (!this.currentUser) {
        return;
      }
      this.isLoading = true;
      try {
        this.boards = yield this.firestoreService.getBoards(this.currentUser.uid);
        yield this.loadBoardStatistics();
      } catch (error) {
      } finally {
        this.isLoading = false;
      }
    });
  }
  loadBoardStatistics() {
    return __async(this, null, function* () {
      for (const board of this.boards) {
        if (board.id) {
          try {
            const columns = yield this.firestoreService.getColumns(this.currentUser.uid, board.id);
            const leads = yield this.firestoreService.getLeads(this.currentUser.uid, board.id);
            this.boardStats[board.id] = {
              columnCount: columns.length,
              leadCount: leads.length
            };
          } catch (error) {
            this.boardStats[board.id] = {
              columnCount: 0,
              leadCount: 0
            };
          }
        }
      }
    });
  }
  logout() {
    return __async(this, null, function* () {
      const result = yield this.authService.logout();
      if (result.success) {
        window.location.href = "/login";
      }
    });
  }
  openBoard(boardId) {
    const board = this.boards.find((b) => b.id === boardId);
    if (board && board.owner) {
      this.router.navigate(["/kanban", boardId], {
        queryParams: { ownerId: board.owner }
      });
    } else {
      this.router.navigate(["/kanban", boardId], {
        queryParams: { ownerId: this.currentUser.uid }
      });
    }
  }
  formatDate(timestamp) {
    if (!timestamp)
      return "";
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1e3).toLocaleDateString("pt-BR");
    }
    return new Date(timestamp).toLocaleDateString("pt-BR");
  }
  showCreateBoardModal() {
    this.showCreateModal = true;
    setTimeout(() => {
      if (this.createBoardModal) {
        this.createBoardModal.show();
      }
    }, 0);
  }
  onBoardCreated(event) {
    this.loadBoards();
    this.showCreateModal = false;
  }
  toggleBoardMenu(boardId) {
    this.activeBoardMenu = this.activeBoardMenu === boardId ? null : boardId;
  }
  editBoard(board) {
    this.activeBoardMenu = null;
  }
  duplicateBoard(board) {
    this.activeBoardMenu = null;
  }
  deleteBoard(boardId) {
    return __async(this, null, function* () {
      const board = this.boards.find((b) => b.id === boardId);
      const boardName = board?.name || "Quadro";
      const confirmMessage = `\u26A0\uFE0F ATEN\xC7\xC3O: Esta a\xE7\xE3o n\xE3o pode ser desfeita!

Deseja excluir o quadro "${boardName}"?

Isso ir\xE1 remover PERMANENTEMENTE:
\u2022 Todas as colunas/fases
\u2022 Todos os leads/registros
\u2022 Todos os templates de email
\u2022 Todas as automa\xE7\xF5es
\u2022 Todo o hist\xF3rico e configura\xE7\xF5es

Digite "EXCLUIR" para confirmar:`;
      const confirmation = prompt(confirmMessage);
      if (confirmation === "EXCLUIR") {
        try {
          yield this.firestoreService.deleteBoard(this.currentUser.uid, boardId);
          yield this.loadBoards();
          alert(`\u2705 Quadro "${boardName}" foi exclu\xEDdo com sucesso!`);
        } catch (error) {
          alert("\u274C Erro ao excluir o quadro. Tente novamente.");
        }
      }
      this.activeBoardMenu = null;
    });
  }
  getBoardColumnCount(boardId) {
    return this.boardStats[boardId]?.columnCount || 0;
  }
  getBoardTaskCount(boardId) {
    return this.boardStats[boardId]?.leadCount || 0;
  }
  toggleConfigMenu() {
    this.showConfigMenu = !this.showConfigMenu;
  }
  // Método adicional para fechar menu ao clicar fora
  closeConfigMenu() {
    this.showConfigMenu = false;
  }
  // Fechar menu do board ao clicar fora
  closeBoardMenu(event) {
    const target = event.target;
    if (!target.closest(".board-menu-container")) {
      this.activeBoardMenu = null;
    }
  }
  static \u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], viewQuery: function DashboardComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(CreateBoardModalComponent, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.createBoardModal = _t.first);
    }
  }, hostBindings: function DashboardComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("click", function DashboardComponent_click_HostBindingHandler($event) {
        return ctx.closeBoardMenu($event);
      }, \u0275\u0275resolveDocument);
    }
  }, decls: 11, vars: 2, consts: [["createBoardModal", ""], ["title", "Meus quadros Kanban"], [1, "flex", "space-x-2"], [1, "bg-blue-500", "hover:bg-blue-600", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", "flex", "items-center", 3, "click"], [1, "fas", "fa-plus", "mr-2"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-8"], [1, "flex", "items-center", "justify-center", "py-12"], [1, "text-center", "py-12"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-6"], [1, "text-center"], [1, "fas", "fa-spinner", "fa-spin", "text-4xl", "text-gray-400", "mb-4"], [1, "text-gray-600"], [1, "w-24", "h-24", "mx-auto", "bg-gray-100", "rounded-full", "flex", "items-center", "justify-center", "mb-4"], [1, "fas", "fa-th-large", "text-3xl", "text-gray-400"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-2"], [1, "text-gray-600", "mb-6"], [1, "bg-blue-500", "hover:bg-blue-600", "text-white", "px-6", "py-3", "rounded-lg", "font-medium", "transition-colors", 3, "click"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200", "hover:shadow-md", "transition-shadow", "cursor-pointer", "group"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200", "hover:shadow-md", "transition-shadow", "cursor-pointer", "group", 3, "click"], [1, "p-6", "border-b", "border-gray-100"], [1, "flex", "items-start", "justify-between"], [1, "flex-1"], [1, "font-semibold", "text-gray-900", "group-hover:text-blue-600", "transition-colors"], [1, "text-sm", "text-gray-600", "mt-1", "line-clamp-2"], [1, "relative", "ml-4", "board-menu-container"], [1, "p-2", "text-gray-600", "hover:text-gray-800", "hover:bg-gray-100", "rounded-md", "transition-all", 2, "display", "flex", "align-items", "center", "justify-content", "center", "min-width", "32px", "min-height", "32px", 3, "click"], [1, "fas", "fa-ellipsis-v"], [1, "absolute", "right-0", "mt-2", "w-48", "bg-white", "rounded-md", "shadow-lg", "border", "border-gray-200", "z-50", 2, "box-shadow", "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"], [1, "p-4", "bg-gray-50"], [1, "flex", "items-center", "justify-between", "text-sm"], [1, "flex", "items-center", "space-x-4"], [1, "fas", "fa-columns", "mr-1"], [1, "fas", "fa-tasks", "mr-1"], [1, "text-xs", "text-gray-500"], [1, "py-1"], [1, "w-full", "text-left", "px-4", "py-2", "text-sm", "text-gray-700", "hover:bg-gray-100", 3, "click"], [1, "fas", "fa-edit", "mr-2"], [1, "fas", "fa-copy", "mr-2"], [1, "my-1"], [1, "w-full", "text-left", "px-4", "py-2", "text-sm", "text-red-700", "hover:bg-red-50", 3, "click"], [1, "fas", "fa-trash", "mr-2"], [3, "boardCreated", "closeModal"]], template: function DashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-main-layout")(1, "app-company-breadcrumb", 1)(2, "div", 2)(3, "button", 3);
      \u0275\u0275listener("click", function DashboardComponent_Template_button_click_3_listener() {
        return ctx.showCreateBoardModal();
      });
      \u0275\u0275element(4, "i", 4);
      \u0275\u0275text(5, " Novo Quadro ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(6, "div", 5);
      \u0275\u0275conditionalCreate(7, DashboardComponent_Conditional_7_Template, 5, 0, "div", 6)(8, DashboardComponent_Conditional_8_Template, 10, 0, "div", 7)(9, DashboardComponent_Conditional_9_Template, 3, 0, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(10, DashboardComponent_Conditional_10_Template, 2, 0, "app-create-board-modal");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.isLoading ? 7 : ctx.boards.length === 0 ? 8 : 9);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.showCreateModal ? 10 : -1);
    }
  }, dependencies: [CommonModule, CreateBoardModalComponent, MainLayoutComponent, CompanyBreadcrumbComponent], styles: ["\n\n.line-clamp-2[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.board-menu-container[_ngcontent-%COMP%] {\n  position: relative;\n}\n.board-menu-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  opacity: 1 !important;\n  visibility: visible !important;\n}\n.board-menu-container[_ngcontent-%COMP%]   .absolute[_ngcontent-%COMP%] {\n  position: absolute !important;\n  z-index: 1000 !important;\n}\n/*# sourceMappingURL=dashboard.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardComponent, [{
    type: Component,
    args: [{ selector: "app-dashboard", standalone: true, imports: [CommonModule, CreateBoardModalComponent, MainLayoutComponent, CompanyBreadcrumbComponent], template: '<app-main-layout>\n  <!-- Company Breadcrumb -->\n  <app-company-breadcrumb title="Meus quadros Kanban">\n    <div class="flex space-x-2">\n      <button \n        (click)="showCreateBoardModal()"\n        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">\n        <i class="fas fa-plus mr-2"></i>\n        Novo Quadro\n      </button>\n    </div>\n  </app-company-breadcrumb>\n\n  <!-- Main Content -->\n  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">\n    @if (isLoading) {\n      <!-- Loading State -->\n      <div class="flex items-center justify-center py-12">\n        <div class="text-center">\n          <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>\n          <p class="text-gray-600">Carregando seus quadros...</p>\n        </div>\n      </div>\n    } @else if (boards.length === 0) {\n      <!-- Empty State -->\n      <div class="text-center py-12">\n        <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">\n          <i class="fas fa-th-large text-3xl text-gray-400"></i>\n        </div>\n        <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhum quadro encontrado</h3>\n        <p class="text-gray-600 mb-6">Crie seu primeiro quadro Kanban para come\xE7ar a organizar suas tarefas.</p>\n        <button \n          (click)="showCreateBoardModal()"\n          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">\n          <i class="fas fa-plus mr-2"></i>\n          Criar Primeiro Quadro\n        </button>\n      </div>\n    } @else {\n      <!-- Boards Grid -->\n      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">\n        @for (board of boards; track board.id) {\n          <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"\n               (click)="openBoard(board.id!)">\n            <!-- Board Header -->\n            <div class="p-6 border-b border-gray-100">\n              <div class="flex items-start justify-between">\n                <div class="flex-1">\n                  <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">\n                    {{ board.name }}\n                  </h3>\n                  @if (board.description) {\n                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">\n                      {{ board.description }}\n                    </p>\n                  }\n                </div>\n                \n                <!-- Board Actions -->\n                <div class="relative ml-4 board-menu-container">\n                  <button \n                    (click)="$event.stopPropagation(); toggleBoardMenu(board.id!)"\n                    class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-all"\n                    style="display: flex; align-items: center; justify-content: center; min-width: 32px; min-height: 32px;">\n                    <i class="fas fa-ellipsis-v"></i>\n                  </button>\n                  \n                  @if (activeBoardMenu === board.id) {\n                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50" \n                         style="box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">\n                      <div class="py-1">\n                        <button \n                          (click)="$event.stopPropagation(); editBoard(board)"\n                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">\n                          <i class="fas fa-edit mr-2"></i>\n                          Editar\n                        </button>\n                        <button \n                          (click)="$event.stopPropagation(); duplicateBoard(board)"\n                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">\n                          <i class="fas fa-copy mr-2"></i>\n                          Duplicar\n                        </button>\n                        <hr class="my-1">\n                        <button \n                          (click)="$event.stopPropagation(); deleteBoard(board.id!)"\n                          class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50">\n                          <i class="fas fa-trash mr-2"></i>\n                          Excluir\n                        </button>\n                      </div>\n                    </div>\n                  }\n                </div>\n              </div>\n            </div>\n\n            <!-- Board Stats -->\n            <div class="p-4 bg-gray-50">\n              <div class="flex items-center justify-between text-sm">\n                <div class="flex items-center space-x-4">\n                  <span class="text-gray-600">\n                    <i class="fas fa-columns mr-1"></i>\n                    {{ getBoardColumnCount(board.id!) }} colunas\n                  </span>\n                  <span class="text-gray-600">\n                    <i class="fas fa-tasks mr-1"></i>\n                    {{ getBoardTaskCount(board.id!) }} leads\n                  </span>\n                </div>\n                <div class="text-xs text-gray-500">\n                  {{ formatDate(board.createdAt) }}\n                </div>\n              </div>\n            </div>\n          </div>\n        }\n      </div>\n    }\n  </div>\n\n  <!-- Create Board Modal -->\n  @if (showCreateModal) {\n    <app-create-board-modal \n      #createBoardModal\n      (boardCreated)="onBoardCreated($event)"\n      (closeModal)="showCreateModal = false">\n    </app-create-board-modal>\n  }\n</app-main-layout>', styles: ["/* src/app/components/dashboard/dashboard.component.scss */\n.line-clamp-2 {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.board-menu-container {\n  position: relative;\n}\n.board-menu-container button {\n  opacity: 1 !important;\n  visibility: visible !important;\n}\n.board-menu-container .absolute {\n  position: absolute !important;\n  z-index: 1000 !important;\n}\n/*# sourceMappingURL=dashboard.component.css.map */\n"] }]
  }], null, { createBoardModal: [{
    type: ViewChild,
    args: [CreateBoardModalComponent]
  }], closeBoardMenu: [{
    type: HostListener,
    args: ["document:click", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/components/dashboard/dashboard.component.ts", lineNumber: 19 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-RLZWZXQ3.js.map
