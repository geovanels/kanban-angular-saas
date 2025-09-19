import {
  CompanyBreadcrumbComponent
} from "./chunk-33HMBJ2T.js";
import {
  MainLayoutComponent
} from "./chunk-BGRXE4K2.js";
import {
  ActivatedRoute,
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  Router,
  ɵNgSelectMultipleOption
} from "./chunk-2S4XXET5.js";
import {
  AuthService,
  FirestoreService
} from "./chunk-NDNGZ4HQ.js";
import {
  CommonModule,
  Component,
  EventEmitter,
  Input,
  NgForOf,
  NgIf,
  Output,
  SlicePipe,
  __async,
  __name,
  __publicField,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind3,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction4,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-GMR7JISZ.js";

// src/app/components/advanced-filters/advanced-filters.component.ts
function AdvancedFiltersComponent_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getDynamicFilterCount() + (ctx_r0.filterOnlyMine ? 1 : 0), " ");
  }
}
__name(AdvancedFiltersComponent_span_7_Template, "AdvancedFiltersComponent_span_7_Template");
function AdvancedFiltersComponent_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function AdvancedFiltersComponent_button_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.clearFilters());
    }, "AdvancedFiltersComponent_button_8_Template_button_click_0_listener"));
    \u0275\u0275element(1, "i", 12);
    \u0275\u0275elementEnd();
  }
}
__name(AdvancedFiltersComponent_button_8_Template, "AdvancedFiltersComponent_button_8_Template");
function AdvancedFiltersComponent_div_9_div_12_div_3_input_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 36);
    \u0275\u0275listener("input", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_div_12_div_3_input_3_Template_input_input_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const field_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.setDynamicFilter(field_r5.name, $event.target.value));
    }, "AdvancedFiltersComponent_div_9_div_12_div_3_input_3_Template_input_input_0_listener"));
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("type", field_r5.type === "number" ? "number" : "text")("value", ctx_r0.dynamicFilters[field_r5.name] || "")("placeholder", "Filtrar por " + field_r5.label.toLowerCase());
  }
}
__name(AdvancedFiltersComponent_div_9_div_12_div_3_input_3_Template, "AdvancedFiltersComponent_div_9_div_12_div_3_input_3_Template");
function AdvancedFiltersComponent_div_9_div_12_div_3_input_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 37);
    \u0275\u0275listener("input", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_div_12_div_3_input_4_Template_input_input_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const field_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.setDynamicFilter(field_r5.name, $event.target.value));
    }, "AdvancedFiltersComponent_div_9_div_12_div_3_input_4_Template_input_input_0_listener"));
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", ctx_r0.dynamicFilters[field_r5.name] || "");
  }
}
__name(AdvancedFiltersComponent_div_9_div_12_div_3_input_4_Template, "AdvancedFiltersComponent_div_9_div_12_div_3_input_4_Template");
function AdvancedFiltersComponent_div_9_div_12_div_3_select_5_option_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r8 = ctx.$implicit;
    \u0275\u0275property("value", option_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r8, " ");
  }
}
__name(AdvancedFiltersComponent_div_9_div_12_div_3_select_5_option_3_Template, "AdvancedFiltersComponent_div_9_div_12_div_3_select_5_option_3_Template");
function AdvancedFiltersComponent_div_9_div_12_div_3_select_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 38);
    \u0275\u0275listener("change", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_div_12_div_3_select_5_Template_select_change_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const field_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.setDynamicFilter(field_r5.name, $event.target.value));
    }, "AdvancedFiltersComponent_div_9_div_12_div_3_select_5_Template_select_change_0_listener"));
    \u0275\u0275elementStart(1, "option", 39);
    \u0275\u0275text(2, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, AdvancedFiltersComponent_div_9_div_12_div_3_select_5_option_3_Template, 2, 2, "option", 40);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", ctx_r0.dynamicFilters[field_r5.name] || "");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r0.getFieldOptions(field_r5));
  }
}
__name(AdvancedFiltersComponent_div_9_div_12_div_3_select_5_Template, "AdvancedFiltersComponent_div_9_div_12_div_3_select_5_Template");
function AdvancedFiltersComponent_div_9_div_12_div_3_select_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 38);
    \u0275\u0275listener("change", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_div_12_div_3_select_6_Template_select_change_0_listener($event) {
      \u0275\u0275restoreView(_r9);
      const field_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.setDynamicFilter(field_r5.name, $event.target.value));
    }, "AdvancedFiltersComponent_div_9_div_12_div_3_select_6_Template_select_change_0_listener"));
    \u0275\u0275elementStart(1, "option", 39);
    \u0275\u0275text(2, "Todas as temperaturas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "option", 42);
    \u0275\u0275text(4, "\u{1F525} Quente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "option", 43);
    \u0275\u0275text(6, "\u{1F321}\uFE0F Morno");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 44);
    \u0275\u0275text(8, "\u2744\uFE0F Frio");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const field_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275property("value", ctx_r0.dynamicFilters[field_r5.name] || "");
  }
}
__name(AdvancedFiltersComponent_div_9_div_12_div_3_select_6_Template, "AdvancedFiltersComponent_div_9_div_12_div_3_select_6_Template");
function AdvancedFiltersComponent_div_9_div_12_div_3_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "input", 45);
    \u0275\u0275listener("change", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_div_12_div_3_div_7_Template_input_change_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      const field_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.setDynamicFilter(field_r5.name, $event.target.checked));
    }, "AdvancedFiltersComponent_div_9_div_12_div_3_div_7_Template_input_change_1_listener"));
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 46);
    \u0275\u0275text(3, "Apenas marcados");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const field_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r0.dynamicFilters[field_r5.name] === true);
  }
}
__name(AdvancedFiltersComponent_div_9_div_12_div_3_div_7_Template, "AdvancedFiltersComponent_div_9_div_12_div_3_div_7_Template");
function AdvancedFiltersComponent_div_9_div_12_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "label", 31);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, AdvancedFiltersComponent_div_9_div_12_div_3_input_3_Template, 1, 3, "input", 32)(4, AdvancedFiltersComponent_div_9_div_12_div_3_input_4_Template, 1, 1, "input", 33)(5, AdvancedFiltersComponent_div_9_div_12_div_3_select_5_Template, 4, 2, "select", 34)(6, AdvancedFiltersComponent_div_9_div_12_div_3_select_6_Template, 9, 1, "select", 34)(7, AdvancedFiltersComponent_div_9_div_12_div_3_div_7_Template, 4, 1, "div", 35);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", field_r5.label, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r5.type === "text" || field_r5.type === "email" || field_r5.type === "tel" || field_r5.type === "number" || field_r5.type === "cnpj" || field_r5.type === "cpf");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r5.type === "date");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r5.type === "select" || field_r5.type === "radio");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r5.type === "temperatura");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r5.type === "checkbox");
  }
}
__name(AdvancedFiltersComponent_div_9_div_12_div_3_Template, "AdvancedFiltersComponent_div_9_div_12_div_3_Template");
function AdvancedFiltersComponent_div_9_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "h4", 28);
    \u0275\u0275text(2, "Filtros Din\xE2micos");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, AdvancedFiltersComponent_div_9_div_12_div_3_Template, 8, 6, "div", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r0.availableFilterFields);
  }
}
__name(AdvancedFiltersComponent_div_9_div_12_Template, "AdvancedFiltersComponent_div_9_div_12_Template");
function AdvancedFiltersComponent_div_9_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275element(1, "i", 48);
    \u0275\u0275elementStart(2, "p", 49);
    \u0275\u0275text(3, " Nenhum campo configurado para filtros.");
    \u0275\u0275element(4, "br");
    \u0275\u0275text(5, ' Configure campos com "Mostrar em filtros" ativado no formul\xE1rio. ');
    \u0275\u0275elementEnd()();
  }
}
__name(AdvancedFiltersComponent_div_9_div_13_Template, "AdvancedFiltersComponent_div_9_div_13_Template");
function AdvancedFiltersComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14)(2, "div", 15)(3, "h3", 16);
    \u0275\u0275text(4, "Filtros Avan\xE7ados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 17);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleAdvancedFilters());
    }, "AdvancedFiltersComponent_div_9_Template_button_click_5_listener"));
    \u0275\u0275element(6, "i", 12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 18)(8, "label", 19)(9, "input", 20);
    \u0275\u0275twoWayListener("ngModelChange", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.filterOnlyMine, $event) || (ctx_r0.filterOnlyMine = $event);
      return \u0275\u0275resetView($event);
    }, "AdvancedFiltersComponent_div_9_Template_input_ngModelChange_9_listener"));
    \u0275\u0275listener("ngModelChange", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_Template_input_ngModelChange_9_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleOnlyMine());
    }, "AdvancedFiltersComponent_div_9_Template_input_ngModelChange_9_listener"));
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 21);
    \u0275\u0275text(11, "Mostrar apenas meus registros");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(12, AdvancedFiltersComponent_div_9_div_12_Template, 4, 1, "div", 22)(13, AdvancedFiltersComponent_div_9_div_13_Template, 6, 0, "div", 23);
    \u0275\u0275elementStart(14, "div", 24)(15, "button", 25);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.clearFilters());
    }, "AdvancedFiltersComponent_div_9_Template_button_click_15_listener"));
    \u0275\u0275text(16, " Limpar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 26);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function AdvancedFiltersComponent_div_9_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleAdvancedFilters());
    }, "AdvancedFiltersComponent_div_9_Template_button_click_17_listener"));
    \u0275\u0275text(18, " Aplicar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.filterOnlyMine);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r0.availableFilterFields.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.availableFilterFields.length === 0);
  }
}
__name(AdvancedFiltersComponent_div_9_Template, "AdvancedFiltersComponent_div_9_Template");
var _AdvancedFiltersComponent = class _AdvancedFiltersComponent {
  firestoreService = inject(FirestoreService);
  boardId = "";
  ownerId = "";
  columns = [];
  currentUser = null;
  // Filter states
  filterQuery = "";
  filterOnlyMine = false;
  dynamicFilters = {};
  showAdvancedFilters = false;
  // Filter fields
  availableFilterFields = [];
  initialFormFields = [];
  phaseFormConfigs = {};
  // Events
  filterQueryChange = new EventEmitter();
  filterOnlyMineChange = new EventEmitter();
  dynamicFiltersChange = new EventEmitter();
  showAdvancedFiltersChange = new EventEmitter();
  filtersApplied = new EventEmitter();
  ngOnInit() {
    return __async(this, null, function* () {
      if (this.boardId && this.ownerId) {
        yield this.loadInitialFormFields();
        yield this.loadAllPhaseFormConfigs();
        this.loadAvailableFilterFields();
      }
    });
  }
  loadInitialFormFields() {
    return __async(this, null, function* () {
      if (!this.boardId)
        return;
      try {
        const formConfig = yield this.firestoreService.getInitialFormConfig(this.boardId);
        if (formConfig && formConfig.fields) {
          this.initialFormFields = formConfig.fields || [];
          console.log("\u{1F4CB} [AdvancedFilters] Campos do formul\xE1rio carregados:", this.initialFormFields);
        } else {
          this.initialFormFields = [];
        }
      } catch (error) {
        console.log("\u2139\uFE0F [AdvancedFilters] Nenhuma configura\xE7\xE3o de formul\xE1rio encontrada");
        this.initialFormFields = [];
      }
    });
  }
  loadAllPhaseFormConfigs() {
    return __async(this, null, function* () {
      for (const column of this.columns) {
        try {
          const config = yield this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, column.id);
          if (config?.fields) {
            this.phaseFormConfigs[column.id] = config;
          }
        } catch (e) {
        }
      }
      this.loadAvailableFilterFields();
    });
  }
  // Migrar campos existentes para incluir showInFilters
  migrateFieldsToIncludeShowInFilters() {
    console.log("\u{1F527} [AdvancedFilters] Migrando campos para incluir showInFilters...");
    if (this.initialFormFields) {
      let needsMigration = false;
      this.initialFormFields.forEach((field) => {
        if (!("showInFilters" in field)) {
          field.showInFilters = false;
          needsMigration = true;
          console.log(`\u{1F527} [AdvancedFilters] Adicionado showInFilters: false ao campo ${field.name} (campo antigo)`);
        } else {
          console.log(`\u2705 [AdvancedFilters] Campo ${field.name} j\xE1 tem showInFilters: ${field.showInFilters}`);
        }
      });
      if (needsMigration) {
        console.log("\u{1F527} [AdvancedFilters] Alguns campos do formul\xE1rio inicial foram migrados em mem\xF3ria");
      } else {
        console.log("\u2705 [AdvancedFilters] Todos os campos do formul\xE1rio inicial j\xE1 t\xEAm showInFilters");
      }
    }
    Object.entries(this.phaseFormConfigs || {}).forEach(([phaseId, config]) => {
      if (config?.fields) {
        let needsMigration = false;
        config.fields.forEach((field) => {
          if (!("showInFilters" in field)) {
            field.showInFilters = false;
            needsMigration = true;
            console.log(`\u{1F527} [AdvancedFilters] Adicionado showInFilters: false ao campo ${field.name} da fase ${phaseId} (campo antigo)`);
          } else {
            console.log(`\u2705 [AdvancedFilters] Campo ${field.name} da fase ${phaseId} j\xE1 tem showInFilters: ${field.showInFilters}`);
          }
        });
        if (needsMigration) {
          console.log(`\u{1F527} [AdvancedFilters] Alguns campos da fase ${phaseId} foram migrados em mem\xF3ria`);
        } else {
          console.log(`\u2705 [AdvancedFilters] Todos os campos da fase ${phaseId} j\xE1 t\xEAm showInFilters`);
        }
      }
    });
  }
  loadAvailableFilterFields() {
    console.log("\u{1F50D} [AdvancedFilters] loadAvailableFilterFields INICIADO");
    console.log("\u{1F50D} [AdvancedFilters] initialFormFields:", this.initialFormFields);
    console.log("\u{1F50D} [AdvancedFilters] phaseFormConfigs:", this.phaseFormConfigs);
    this.migrateFieldsToIncludeShowInFilters();
    const allFields = [];
    if (this.initialFormFields) {
      console.log("\u{1F50D} [AdvancedFilters] Processando campos do formul\xE1rio inicial...");
      this.initialFormFields.forEach((field, index) => {
        console.log(`\u{1F50D} [AdvancedFilters] Campo inicial ${index + 1}:`, field);
        console.log(`\u{1F50D} [AdvancedFilters] Campo inicial ${index + 1} - Detalhes:`, {
          name: field.name,
          type: field.type,
          showInFilters: field.showInFilters,
          hasShowInFilters: "showInFilters" in field,
          keys: Object.keys(field)
        });
        if (field.name && field.type && field.showInFilters) {
          const filterField = {
            name: field.name,
            label: field.label || field.name,
            type: field.type,
            source: "initial"
          };
          allFields.push(filterField);
          console.log("\u2705 [AdvancedFilters] Campo adicionado aos filtros:", filterField);
        } else {
          console.log("\u274C [AdvancedFilters] Campo N\xC3O adicionado aos filtros (falta name, type ou showInFilters = false)");
        }
      });
    } else {
      console.log("\u26A0\uFE0F [AdvancedFilters] Nenhum initialFormFields encontrado");
    }
    console.log("\u{1F50D} [AdvancedFilters] Processando campos das fases...");
    Object.entries(this.phaseFormConfigs || {}).forEach(([phaseId, config]) => {
      console.log(`\u{1F50D} [AdvancedFilters] Fase ${phaseId}:`, config);
      if (config?.fields) {
        config.fields.forEach((field, index) => {
          console.log(`\u{1F50D} [AdvancedFilters] Campo da fase ${phaseId} - ${index + 1}:`, field);
          console.log(`\u{1F50D} [AdvancedFilters] Campo da fase ${phaseId} - ${index + 1} - Detalhes:`, {
            name: field.name,
            type: field.type,
            showInFilters: field.showInFilters,
            hasShowInFilters: "showInFilters" in field,
            keys: Object.keys(field)
          });
          if (field.name && field.type && field.showInFilters && !allFields.find((f) => f.name === field.name)) {
            const filterField = {
              name: field.name,
              label: field.label || field.name,
              type: field.type,
              source: "phase",
              phaseId
            };
            allFields.push(filterField);
            console.log("\u2705 [AdvancedFilters] Campo da fase adicionado aos filtros:", filterField);
          } else {
            console.log("\u274C [AdvancedFilters] Campo da fase N\xC3O adicionado (falta name, type, showInFilters = false, ou j\xE1 existe)");
          }
        });
      }
    });
    console.log("\u{1F50D} [AdvancedFilters] Todos os campos coletados:", allFields);
    this.availableFilterFields = allFields.filter((field) => {
      const supportedTypes = ["text", "email", "select", "radio", "checkbox", "date", "number", "tel", "cnpj", "cpf", "temperatura"];
      const isSupported = supportedTypes.includes(field.type.toLowerCase());
      console.log(`\u{1F50D} [AdvancedFilters] Campo ${field.name} (${field.type}) - Suportado: ${isSupported}`);
      return isSupported;
    });
    console.log("\u{1F50D} [AdvancedFilters] Campos filtrados finais (availableFilterFields):", this.availableFilterFields);
    console.log("\u{1F50D} [AdvancedFilters] availableFilterFields.length:", this.availableFilterFields.length);
    console.log("\u{1F50D} [AdvancedFilters] showAdvancedFilters:", this.showAdvancedFilters);
  }
  // Obter opções disponíveis para um campo
  getFieldOptions(field) {
    if (field.type === "select" || field.type === "radio") {
      const originalField = this.findOriginalField(field.name, field.source);
      if (originalField && originalField.options && Array.isArray(originalField.options)) {
        return originalField.options;
      }
    }
    if (field.type === "temperatura") {
      return ["Quente", "Morno", "Frio"];
    }
    return [];
  }
  findOriginalField(fieldName, source) {
    if (source === "initial") {
      return this.initialFormFields?.find((f) => f.name === fieldName);
    } else if (source === "phase") {
      for (const config of Object.values(this.phaseFormConfigs)) {
        const found = config?.fields?.find((f) => f.name === fieldName);
        if (found)
          return found;
      }
    }
    return null;
  }
  // Event handlers
  onFilterQueryChange(value) {
    this.filterQuery = value;
    this.filterQueryChange.emit(value);
    this.filtersApplied.emit();
  }
  toggleOnlyMine() {
    this.filterOnlyMine = !this.filterOnlyMine;
    this.filterOnlyMineChange.emit(this.filterOnlyMine);
    this.filtersApplied.emit();
  }
  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
    this.showAdvancedFiltersChange.emit(this.showAdvancedFilters);
  }
  setDynamicFilter(fieldName, value) {
    if (value === "" || value === null || value === void 0) {
      delete this.dynamicFilters[fieldName];
    } else {
      this.dynamicFilters[fieldName] = value;
    }
    this.dynamicFiltersChange.emit(this.dynamicFilters);
    this.filtersApplied.emit();
  }
  clearFilters() {
    this.filterQuery = "";
    this.filterOnlyMine = false;
    this.dynamicFilters = {};
    this.filterQueryChange.emit(this.filterQuery);
    this.filterOnlyMineChange.emit(this.filterOnlyMine);
    this.dynamicFiltersChange.emit(this.dynamicFilters);
    this.filtersApplied.emit();
  }
  hasActiveFilters() {
    return this.filterQuery.length > 0 || this.filterOnlyMine || Object.keys(this.dynamicFilters).length > 0;
  }
  getDynamicFilterCount() {
    return Object.keys(this.dynamicFilters).length;
  }
};
__name(_AdvancedFiltersComponent, "AdvancedFiltersComponent");
__publicField(_AdvancedFiltersComponent, "\u0275fac", /* @__PURE__ */ __name(function AdvancedFiltersComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AdvancedFiltersComponent)();
}, "AdvancedFiltersComponent_Factory"));
__publicField(_AdvancedFiltersComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdvancedFiltersComponent, selectors: [["app-advanced-filters"]], inputs: { boardId: "boardId", ownerId: "ownerId", columns: "columns", currentUser: "currentUser", filterQuery: "filterQuery", filterOnlyMine: "filterOnlyMine", dynamicFilters: "dynamicFilters", showAdvancedFilters: "showAdvancedFilters" }, outputs: { filterQueryChange: "filterQueryChange", filterOnlyMineChange: "filterOnlyMineChange", dynamicFiltersChange: "dynamicFiltersChange", showAdvancedFiltersChange: "showAdvancedFiltersChange", filtersApplied: "filtersApplied" }, decls: 10, vars: 8, consts: [[1, "mb-4"], [1, "flex", "items-center", "space-x-2"], [1, "relative", "flex-1"], ["type", "text", "placeholder", "Pesquisar...", 1, "w-full", "pl-10", "pr-12", "py-2", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "ngModelChange", "ngModel"], [1, "fas", "fa-search", "absolute", "left-3", "top-1/2", "transform", "-translate-y-1/2", "text-gray-400"], [1, "absolute", "right-2", "top-1/2", "transform", "-translate-y-1/2", "p-1.5", "hover:bg-gray-100", "rounded", "transition-colors", 3, "click"], [1, "fas", "fa-filter", "text-sm"], ["class", "absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center", "style", "font-size: 10px;", 4, "ngIf"], ["class", "px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg transition-colors", 3, "click", 4, "ngIf"], ["class", "fixed top-20 left-4 w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 z-[9999]", 4, "ngIf"], [1, "absolute", "-top-1", "-right-1", "bg-blue-500", "text-white", "text-xs", "rounded-full", "w-4", "h-4", "flex", "items-center", "justify-center", 2, "font-size", "10px"], [1, "px-3", "py-2", "bg-red-100", "hover:bg-red-200", "text-red-700", "border", "border-red-300", "rounded-lg", "transition-colors", 3, "click"], [1, "fas", "fa-times"], [1, "fixed", "top-20", "left-4", "w-full", "max-w-lg", "bg-white", "rounded-xl", "shadow-xl", "border", "border-gray-200", "z-[9999]"], [1, "p-6"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "text-lg", "font-semibold", "text-gray-900"], [1, "text-gray-400", "hover:text-gray-600", 3, "click"], [1, "mb-6", "p-3", "bg-gray-50", "rounded-lg"], [1, "flex", "items-center", "space-x-2", "cursor-pointer"], ["type", "checkbox", 1, "rounded", "border-gray-300", "text-blue-600", "focus:ring-blue-500", 3, "ngModelChange", "ngModel"], [1, "text-sm", "text-gray-700", "font-medium"], ["class", "space-y-4", 4, "ngIf"], ["class", "text-center py-6", 4, "ngIf"], [1, "flex", "justify-end", "space-x-3", "mt-6", "pt-4", "border-t", "border-gray-200"], [1, "px-4", "py-2", "text-gray-600", "bg-gray-100", "hover:bg-gray-200", "rounded-lg", "transition-colors", 3, "click"], [1, "px-4", "py-2", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-lg", "transition-colors", 3, "click"], [1, "space-y-4"], [1, "text-sm", "font-medium", "text-gray-700", "mb-3"], ["class", "space-y-2", 4, "ngFor", "ngForOf"], [1, "space-y-2"], [1, "block", "text-sm", "font-medium", "text-gray-700"], ["class", "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent", 3, "type", "value", "placeholder", "input", 4, "ngIf"], ["type", "date", "class", "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent", 3, "value", "input", 4, "ngIf"], ["class", "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent", 3, "value", "change", 4, "ngIf"], ["class", "flex items-center space-x-2", 4, "ngIf"], [1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "input", "type", "value", "placeholder"], ["type", "date", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "input", "value"], [1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", 3, "change", "value"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], ["value", "Quente"], ["value", "Morno"], ["value", "Frio"], ["type", "checkbox", 1, "rounded", "border-gray-300", "text-blue-600", "focus:ring-blue-500", 3, "change", "checked"], [1, "text-sm", "text-gray-700"], [1, "text-center", "py-6"], [1, "fas", "fa-filter", "text-gray-300", "text-3xl", "mb-3"], [1, "text-gray-500", "text-sm"]], template: /* @__PURE__ */ __name(function AdvancedFiltersComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "input", 3);
    \u0275\u0275twoWayListener("ngModelChange", /* @__PURE__ */ __name(function AdvancedFiltersComponent_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275twoWayBindingSet(ctx.filterQuery, $event) || (ctx.filterQuery = $event);
      return $event;
    }, "AdvancedFiltersComponent_Template_input_ngModelChange_3_listener"));
    \u0275\u0275listener("ngModelChange", /* @__PURE__ */ __name(function AdvancedFiltersComponent_Template_input_ngModelChange_3_listener($event) {
      return ctx.onFilterQueryChange($event);
    }, "AdvancedFiltersComponent_Template_input_ngModelChange_3_listener"));
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "i", 4);
    \u0275\u0275elementStart(5, "button", 5);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function AdvancedFiltersComponent_Template_button_click_5_listener() {
      return ctx.toggleAdvancedFilters();
    }, "AdvancedFiltersComponent_Template_button_click_5_listener"));
    \u0275\u0275element(6, "i", 6);
    \u0275\u0275template(7, AdvancedFiltersComponent_span_7_Template, 2, 1, "span", 7);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(8, AdvancedFiltersComponent_button_8_Template, 2, 0, "button", 8);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, AdvancedFiltersComponent_div_9_Template, 19, 3, "div", 9);
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx.filterQuery);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-blue-600", ctx.showAdvancedFilters)("bg-blue-50", ctx.showAdvancedFilters);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx.hasActiveFilters());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.hasActiveFilters());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.showAdvancedFilters);
  }
}, "AdvancedFiltersComponent_Template"), dependencies: [CommonModule, NgForOf, NgIf, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel], styles: ["\n\n.advanced-filters-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 9998;\n}\n.advanced-filters-modal[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);\n  z-index: 9999;\n  max-height: 90vh;\n  overflow-y: auto;\n}\n.filter-badge[_ngcontent-%COMP%] {\n  display: flex;\n  height: 1.25rem;\n  width: 1.25rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 9999px;\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));\n  font-size: 0.75rem;\n  line-height: 1rem;\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\n.search-input[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 0.5rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  padding-left: 2.5rem;\n  padding-right: 1rem;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  border-color: transparent;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow:\n    var(--tw-ring-offset-shadow),\n    var(--tw-ring-shadow),\n    var(--tw-shadow, 0 0 #0000);\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));\n}\n.search-input[_ngcontent-%COMP%] {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.filter-button[_ngcontent-%COMP%] {\n  border-radius: 0.5rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.filter-button[_ngcontent-%COMP%]:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));\n}\n.filter-button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.filter-button[_ngcontent-%COMP%]    > [_ngcontent-%COMP%]:not([hidden])    ~ [_ngcontent-%COMP%]:not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.filter-button[_ngcontent-%COMP%] {\n  transition-property:\n    color,\n    background-color,\n    border-color,\n    text-decoration-color,\n    fill,\n    stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.filter-button.active[_ngcontent-%COMP%] {\n  --tw-border-opacity: 1;\n  border-color: rgb(147 197 253 / var(--tw-border-opacity, 1));\n  --tw-bg-opacity: 1;\n  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));\n}\n.clear-button[_ngcontent-%COMP%] {\n  border-radius: 0.5rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(252 165 165 / var(--tw-border-opacity, 1));\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  --tw-text-opacity: 1;\n  color: rgb(185 28 28 / var(--tw-text-opacity, 1));\n}\n.clear-button[_ngcontent-%COMP%]:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 202 202 / var(--tw-bg-opacity, 1));\n}\n.clear-button[_ngcontent-%COMP%] {\n  transition-property:\n    color,\n    background-color,\n    border-color,\n    text-decoration-color,\n    fill,\n    stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.form-input[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 0.375rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  border-color: transparent;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow:\n    var(--tw-ring-offset-shadow),\n    var(--tw-ring-shadow),\n    var(--tw-shadow, 0 0 #0000);\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));\n}\n.form-input[_ngcontent-%COMP%] {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.form-select[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: 0.375rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.form-select[_ngcontent-%COMP%]:focus {\n  border-color: transparent;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow:\n    var(--tw-ring-offset-shadow),\n    var(--tw-ring-shadow),\n    var(--tw-shadow, 0 0 #0000);\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));\n}\n.form-select[_ngcontent-%COMP%] {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.form-checkbox[_ngcontent-%COMP%] {\n  border-radius: 0.25rem;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  --tw-text-opacity: 1;\n  color: rgb(37 99 235 / var(--tw-text-opacity, 1));\n}\n.form-checkbox[_ngcontent-%COMP%]:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));\n}\n/*# sourceMappingURL=advanced-filters.component.css.map */"] }));
var AdvancedFiltersComponent = _AdvancedFiltersComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdvancedFiltersComponent, [{
    type: Component,
    args: [{ selector: "app-advanced-filters", standalone: true, imports: [CommonModule, FormsModule], template: `<!-- Search and Filter Controls -->
<div class="mb-4">
  <!-- Search Bar with Integrated Filter Button -->
  <div class="flex items-center space-x-2">
    <div class="relative flex-1">
      <input 
        type="text" 
        [(ngModel)]="filterQuery"
        (ngModelChange)="onFilterQueryChange($event)"
        placeholder="Pesquisar..."
        class="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      
      <!-- Filter Button Inside Search -->
      <button 
        (click)="toggleAdvancedFilters()"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
        [class.text-blue-600]="showAdvancedFilters"
        [class.bg-blue-50]="showAdvancedFilters">
        <i class="fas fa-filter text-sm"></i>
        <span *ngIf="hasActiveFilters()" class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" style="font-size: 10px;">
          {{ getDynamicFilterCount() + (filterOnlyMine ? 1 : 0) }}
        </span>
      </button>
    </div>
    
    <!-- Clear Filters Button -->
    <button 
      *ngIf="hasActiveFilters()"
      (click)="clearFilters()"
      class="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg transition-colors">
      <i class="fas fa-times"></i>
    </button>
  </div>
</div>

<!-- Advanced Filters Modal -->
<div *ngIf="showAdvancedFilters" 
     class="fixed top-20 left-4 w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 z-[9999]">
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Filtros Avan\xE7ados</h3>
      <button 
        (click)="toggleAdvancedFilters()"
        class="text-gray-400 hover:text-gray-600">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <!-- Quick Filter: Show Only Mine -->
    <div class="mb-6 p-3 bg-gray-50 rounded-lg">
      <label class="flex items-center space-x-2 cursor-pointer">
        <input 
          type="checkbox" 
          [(ngModel)]="filterOnlyMine"
          (ngModelChange)="toggleOnlyMine()"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
        <span class="text-sm text-gray-700 font-medium">Mostrar apenas meus registros</span>
      </label>
    </div>
    
    <!-- Dynamic Filter Fields -->
    <div *ngIf="availableFilterFields.length > 0" class="space-y-4">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Filtros Din\xE2micos</h4>
      
      <div *ngFor="let field of availableFilterFields" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          {{ field.label }}
        </label>
        
        <!-- Text/Email/Tel/Number Fields -->
        <input 
          *ngIf="field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number' || field.type === 'cnpj' || field.type === 'cpf'"
          [type]="field.type === 'number' ? 'number' : 'text'"
          [value]="dynamicFilters[field.name] || ''"
          (input)="setDynamicFilter(field.name, $any($event.target).value)"
          [placeholder]="'Filtrar por ' + field.label.toLowerCase()"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        
        <!-- Date Fields -->
        <input 
          *ngIf="field.type === 'date'"
          type="date"
          [value]="dynamicFilters[field.name] || ''"
          (input)="setDynamicFilter(field.name, $any($event.target).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        
        <!-- Select/Radio Fields -->
        <select 
          *ngIf="field.type === 'select' || field.type === 'radio'"
          [value]="dynamicFilters[field.name] || ''"
          (change)="setDynamicFilter(field.name, $any($event.target).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Todos</option>
          <option *ngFor="let option of getFieldOptions(field)" [value]="option">
            {{ option }}
          </option>
        </select>
        
        <!-- Temperatura Field -->
        <select 
          *ngIf="field.type === 'temperatura'"
          [value]="dynamicFilters[field.name] || ''"
          (change)="setDynamicFilter(field.name, $any($event.target).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Todas as temperaturas</option>
          <option value="Quente">\u{1F525} Quente</option>
          <option value="Morno">\u{1F321}\uFE0F Morno</option>
          <option value="Frio">\u2744\uFE0F Frio</option>
        </select>
        
        <!-- Checkbox Fields -->
        <div *ngIf="field.type === 'checkbox'" class="flex items-center space-x-2">
          <input 
            type="checkbox"
            [checked]="dynamicFilters[field.name] === true"
            (change)="setDynamicFilter(field.name, $any($event.target).checked)"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          <span class="text-sm text-gray-700">Apenas marcados</span>
        </div>
      </div>
    </div>
    
    <!-- No Fields Available -->
    <div *ngIf="availableFilterFields.length === 0" class="text-center py-6">
      <i class="fas fa-filter text-gray-300 text-3xl mb-3"></i>
      <p class="text-gray-500 text-sm">
        Nenhum campo configurado para filtros.<br>
        Configure campos com "Mostrar em filtros" ativado no formul\xE1rio.
      </p>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
      <button 
        (click)="clearFilters()"
        class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        Limpar
      </button>
      <button 
        (click)="toggleAdvancedFilters()"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        Aplicar
      </button>
    </div>
  </div>
</div>`, styles: ["/* src/app/components/advanced-filters/advanced-filters.component.scss */\n.advanced-filters-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 9998;\n}\n.advanced-filters-modal {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);\n  z-index: 9999;\n  max-height: 90vh;\n  overflow-y: auto;\n}\n.filter-badge {\n  display: flex;\n  height: 1.25rem;\n  width: 1.25rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 9999px;\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));\n  font-size: 0.75rem;\n  line-height: 1rem;\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\n.search-input {\n  width: 100%;\n  border-radius: 0.5rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  padding-left: 2.5rem;\n  padding-right: 1rem;\n}\n.search-input:focus {\n  border-color: transparent;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow:\n    var(--tw-ring-offset-shadow),\n    var(--tw-ring-shadow),\n    var(--tw-shadow, 0 0 #0000);\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));\n}\n.search-input {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.filter-button {\n  border-radius: 0.5rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.filter-button:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));\n}\n.filter-button {\n  display: flex;\n  align-items: center;\n}\n.filter-button > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.filter-button {\n  transition-property:\n    color,\n    background-color,\n    border-color,\n    text-decoration-color,\n    fill,\n    stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.filter-button.active {\n  --tw-border-opacity: 1;\n  border-color: rgb(147 197 253 / var(--tw-border-opacity, 1));\n  --tw-bg-opacity: 1;\n  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));\n}\n.clear-button {\n  border-radius: 0.5rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(252 165 165 / var(--tw-border-opacity, 1));\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  --tw-text-opacity: 1;\n  color: rgb(185 28 28 / var(--tw-text-opacity, 1));\n}\n.clear-button:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 202 202 / var(--tw-bg-opacity, 1));\n}\n.clear-button {\n  transition-property:\n    color,\n    background-color,\n    border-color,\n    text-decoration-color,\n    fill,\n    stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.form-input {\n  width: 100%;\n  border-radius: 0.375rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.form-input:focus {\n  border-color: transparent;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow:\n    var(--tw-ring-offset-shadow),\n    var(--tw-ring-shadow),\n    var(--tw-shadow, 0 0 #0000);\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));\n}\n.form-input {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.form-select {\n  width: 100%;\n  border-radius: 0.375rem;\n  border-width: 1px;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.form-select:focus {\n  border-color: transparent;\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow:\n    var(--tw-ring-offset-shadow),\n    var(--tw-ring-shadow),\n    var(--tw-shadow, 0 0 #0000);\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));\n}\n.form-select {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 200ms;\n}\n.form-checkbox {\n  border-radius: 0.25rem;\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n  --tw-text-opacity: 1;\n  color: rgb(37 99 235 / var(--tw-text-opacity, 1));\n}\n.form-checkbox:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));\n}\n/*# sourceMappingURL=advanced-filters.component.css.map */\n"] }]
  }], null, { boardId: [{
    type: Input
  }], ownerId: [{
    type: Input
  }], columns: [{
    type: Input
  }], currentUser: [{
    type: Input
  }], filterQuery: [{
    type: Input
  }], filterOnlyMine: [{
    type: Input
  }], dynamicFilters: [{
    type: Input
  }], showAdvancedFilters: [{
    type: Input
  }], filterQueryChange: [{
    type: Output
  }], filterOnlyMineChange: [{
    type: Output
  }], dynamicFiltersChange: [{
    type: Output
  }], showAdvancedFiltersChange: [{
    type: Output
  }], filtersApplied: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdvancedFiltersComponent, { className: "AdvancedFiltersComponent", filePath: "src/app/components/advanced-filters/advanced-filters.component.ts", lineNumber: 13 });
})();

// src/app/components/reports/reports.component.ts
var _c0 = /* @__PURE__ */ __name(() => ({ key: "overview", label: "Vis\xE3o Geral", icon: "fas fa-chart-pie" }), "_c0");
var _c1 = /* @__PURE__ */ __name(() => ({ key: "sla", label: "Indicadores SLA", icon: "fas fa-clock" }), "_c1");
var _c2 = /* @__PURE__ */ __name(() => ({ key: "phases", label: "M\xE9tricas por Fase", icon: "fas fa-columns" }), "_c2");
var _c3 = /* @__PURE__ */ __name(() => ({ key: "registros", label: "Lista de Registros", icon: "fas fa-list" }), "_c3");
var _c4 = /* @__PURE__ */ __name((a0, a1, a2, a3) => [a0, a1, a2, a3], "_c4");
function ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-advanced-filters", 11);
    \u0275\u0275twoWayListener("filterQueryChange", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_filterQueryChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.filterQuery, $event) || (ctx_r1.filterQuery = $event);
      return \u0275\u0275resetView($event);
    }, "ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_filterQueryChange_0_listener"))("filterOnlyMineChange", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_filterOnlyMineChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.filterOnlyMine, $event) || (ctx_r1.filterOnlyMine = $event);
      return \u0275\u0275resetView($event);
    }, "ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_filterOnlyMineChange_0_listener"))("dynamicFiltersChange", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_dynamicFiltersChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.dynamicFilters, $event) || (ctx_r1.dynamicFilters = $event);
      return \u0275\u0275resetView($event);
    }, "ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_dynamicFiltersChange_0_listener"))("showAdvancedFiltersChange", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_showAdvancedFiltersChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.showAdvancedFilters, $event) || (ctx_r1.showAdvancedFilters = $event);
      return \u0275\u0275resetView($event);
    }, "ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_showAdvancedFiltersChange_0_listener"));
    \u0275\u0275listener("filtersApplied", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_filtersApplied_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.applyFilters());
    }, "ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template_app_advanced_filters_filtersApplied_0_listener"));
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("boardId", ctx_r1.boardId)("ownerId", ctx_r1.ownerId)("columns", ctx_r1.columns)("currentUser", ctx_r1.currentUser);
    \u0275\u0275twoWayProperty("filterQuery", ctx_r1.filterQuery)("filterOnlyMine", ctx_r1.filterOnlyMine)("dynamicFilters", ctx_r1.dynamicFilters)("showAdvancedFilters", ctx_r1.showAdvancedFilters);
  }
}
__name(ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template, "ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template");
function ReportsComponent_app_main_layout_0_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_button_7_Template_button_click_0_listener() {
      const tab_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setView(tab_r4.key));
    }, "ReportsComponent_app_main_layout_0_button_7_Template_button_click_0_listener"));
    \u0275\u0275element(1, "i");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tab_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("border-blue-500", ctx_r1.currentView === tab_r4.key)("text-blue-600", ctx_r1.currentView === tab_r4.key)("border-transparent", ctx_r1.currentView !== tab_r4.key)("text-gray-500", ctx_r1.currentView !== tab_r4.key);
    \u0275\u0275advance();
    \u0275\u0275classMap(tab_r4.icon + " mr-2");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tab_r4.label, " ");
  }
}
__name(ReportsComponent_app_main_layout_0_button_7_Template, "ReportsComponent_app_main_layout_0_button_7_Template");
function ReportsComponent_app_main_layout_0_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14);
    \u0275\u0275element(2, "i", 15);
    \u0275\u0275elementStart(3, "p", 16);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.isLoading ? "Carregando dados..." : "Gerando relat\xF3rio...");
  }
}
__name(ReportsComponent_app_main_layout_0_div_8_Template, "ReportsComponent_app_main_layout_0_div_8_Template");
function ReportsComponent_app_main_layout_0_div_9_div_1_div_62_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "p", 39);
    \u0275\u0275text(2, " \u{1F50D} Debug: Nenhum dado de fase encontrado ");
    \u0275\u0275element(3, "br");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("Fases: ", ctx_r1.columns.length, " | Registros: ", ctx_r1.filteredRecords.length, " ");
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_1_div_62_Template, "ReportsComponent_app_main_layout_0_div_9_div_1_div_62_Template");
function ReportsComponent_app_main_layout_0_div_9_div_1_div_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "div", 40)(2, "div", 19);
    \u0275\u0275element(3, "div", 41);
    \u0275\u0275elementStart(4, "span", 42);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 43);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 44);
    \u0275\u0275element(9, "div", 45);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background-color", item_r5.color);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r5.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r5.value);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-color", item_r5.color)("width", ctx_r1.getPhasePercentage(item_r5.value), "%");
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_1_div_63_Template, "ReportsComponent_app_main_layout_0_div_9_div_1_div_63_Template");
function ReportsComponent_app_main_layout_0_div_9_div_1_div_68_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275element(1, "i", 50);
    \u0275\u0275elementEnd();
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_1_div_68_div_6_Template, "ReportsComponent_app_main_layout_0_div_9_div_1_div_68_div_6_Template");
function ReportsComponent_app_main_layout_0_div_9_div_1_div_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46)(1, "div", 47)(2, "span", 42);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 43);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, ReportsComponent_app_main_layout_0_div_9_div_1_div_68_div_6_Template, 2, 0, "div", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const i_r7 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r6.phase);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.registros);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", i_r7 < ctx_r1.chartData.conversionFunnel.length - 1);
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_1_div_68_Template, "ReportsComponent_app_main_layout_0_div_9_div_1_div_68_Template");
function ReportsComponent_app_main_layout_0_div_9_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 17)(2, "div", 18)(3, "div", 19)(4, "div", 20);
    \u0275\u0275element(5, "i", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 22)(7, "p", 23);
    \u0275\u0275text(8, "Total de Registros");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 24);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "div", 18)(12, "div", 19)(13, "div", 20);
    \u0275\u0275element(14, "i", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 22)(16, "p", 23);
    \u0275\u0275text(17, "Novos no Per\xEDodo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "p", 24);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(20, "div", 18)(21, "div", 19)(22, "div", 20);
    \u0275\u0275element(23, "i", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 22)(25, "p", 23);
    \u0275\u0275text(26, "Conclu\xEDdos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "p", 24);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(29, "div", 18)(30, "div", 19)(31, "div", 20);
    \u0275\u0275element(32, "i", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 22)(34, "p", 23);
    \u0275\u0275text(35, "Tempo M\xE9dio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "p", 24);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(38, "div", 18)(39, "div", 19)(40, "div", 20);
    \u0275\u0275element(41, "i", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "div", 22)(43, "p", 23);
    \u0275\u0275text(44, "Ativos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "p", 24);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(47, "div", 18)(48, "div", 19)(49, "div", 20);
    \u0275\u0275element(50, "i", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 22)(52, "p", 23);
    \u0275\u0275text(53, "Em Atraso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(54, "p", 24);
    \u0275\u0275text(55);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(56, "div", 30)(57, "div", 18)(58, "h3", 31);
    \u0275\u0275element(59, "i", 32);
    \u0275\u0275text(60, " Registros por Fase ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "div", 33);
    \u0275\u0275template(62, ReportsComponent_app_main_layout_0_div_9_div_1_div_62_Template, 5, 2, "div", 34)(63, ReportsComponent_app_main_layout_0_div_9_div_1_div_63_Template, 10, 8, "div", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div", 18)(65, "h3", 31);
    \u0275\u0275text(66, "Funil de Convers\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "div", 36);
    \u0275\u0275template(68, ReportsComponent_app_main_layout_0_div_9_div_1_div_68_Template, 7, 3, "div", 37);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.summaryStats.totalRecords);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.summaryStats.newRecordsThisPeriod);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.summaryStats.concludedRecords);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.formatDuration(ctx_r1.summaryStats.avgConversionTime));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.summaryStats.activeRecords);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.summaryStats.overdueRecords);
    \u0275\u0275advance(7);
    \u0275\u0275property("ngIf", ctx_r1.chartData.phaseDistribution.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.chartData.phaseDistribution);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngForOf", ctx_r1.chartData.conversionFunnel);
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_1_Template, "ReportsComponent_app_main_layout_0_div_9_div_1_Template");
function ReportsComponent_app_main_layout_0_div_9_div_2_tr_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 63)(2, "div", 19);
    \u0275\u0275element(3, "div", 64);
    \u0275\u0275elementStart(4, "span", 65);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "td", 66);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 66);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 67)(11, "span", 68);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 67)(14, "span", 69);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 67)(17, "div", 70)(18, "div", 71);
    \u0275\u0275element(19, "div", 72);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 65);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const indicator_r8 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background-color", indicator_r8.phaseColor);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(indicator_r8.phaseName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", indicator_r8.slaDays, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", indicator_r8.totalRecords, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", indicator_r8.onTime, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", indicator_r8.overdue, " ");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("width", indicator_r8.compliance, "%");
    \u0275\u0275classProp("bg-green-500", indicator_r8.compliance >= 80)("bg-yellow-500", indicator_r8.compliance >= 60 && indicator_r8.compliance < 80)("bg-red-500", indicator_r8.compliance < 60);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", indicator_r8.compliance, "%");
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_2_tr_24_Template, "ReportsComponent_app_main_layout_0_div_9_div_2_tr_24_Template");
function ReportsComponent_app_main_layout_0_div_9_div_2_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73);
    \u0275\u0275element(1, "i", 74);
    \u0275\u0275elementStart(2, "p", 75);
    \u0275\u0275text(3, "Nenhuma fase possui SLA configurado");
    \u0275\u0275elementEnd()();
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_2_div_25_Template, "ReportsComponent_app_main_layout_0_div_9_div_2_div_25_Template");
function ReportsComponent_app_main_layout_0_div_9_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 51)(2, "div", 52)(3, "h3", 53);
    \u0275\u0275text(4, "Indicadores de SLA por Fase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 54);
    \u0275\u0275text(6, "An\xE1lise de cumprimento de prazos definidos para cada fase");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 55)(8, "table", 56)(9, "thead", 57)(10, "tr")(11, "th", 58);
    \u0275\u0275text(12, "Fase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 59);
    \u0275\u0275text(14, "SLA (dias)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 59);
    \u0275\u0275text(16, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 59);
    \u0275\u0275text(18, "No Prazo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 59);
    \u0275\u0275text(20, "Em Atraso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th", 59);
    \u0275\u0275text(22, "% Cumprimento");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "tbody", 60);
    \u0275\u0275template(24, ReportsComponent_app_main_layout_0_div_9_div_2_tr_24_Template, 22, 16, "tr", 61);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(25, ReportsComponent_app_main_layout_0_div_9_div_2_div_25_Template, 4, 0, "div", 62);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(24);
    \u0275\u0275property("ngForOf", ctx_r1.slaIndicators);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.slaIndicators.length === 0);
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_2_Template, "ReportsComponent_app_main_layout_0_div_9_div_2_Template");
function ReportsComponent_app_main_layout_0_div_9_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 78)(2, "h3", 53);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "div", 79);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 33)(6, "div", 80)(7, "span", 81);
    \u0275\u0275text(8, "Registros");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 82);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 80)(12, "span", 81);
    \u0275\u0275text(13, "Tempo M\xE9dio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 82);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 80)(17, "span", 81);
    \u0275\u0275text(18, "Taxa de Convers\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 82);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const metric_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(metric_r9.phaseName);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", metric_r9.phaseColor);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(metric_r9.recordsCount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formatDuration(metric_r9.avgTimeInPhase));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", metric_r9.conversionRate, "%");
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_3_div_2_Template, "ReportsComponent_app_main_layout_0_div_9_div_3_div_2_Template");
function ReportsComponent_app_main_layout_0_div_9_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 76);
    \u0275\u0275template(2, ReportsComponent_app_main_layout_0_div_9_div_3_div_2_Template, 21, 6, "div", 77);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.phaseMetrics);
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_3_Template, "ReportsComponent_app_main_layout_0_div_9_div_3_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_div_14_label_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 102)(1, "input", 103);
    \u0275\u0275listener("change", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_div_9_div_4_div_14_label_11_Template_input_change_1_listener() {
      const column_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.toggleColumn(column_r13.key));
    }, "ReportsComponent_app_main_layout_0_div_9_div_4_div_14_label_11_Template_input_change_1_listener"));
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 104);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.isColumnSelected(column_r13.key));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r13.label);
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_div_14_label_11_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_div_14_label_11_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_label_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 102)(1, "input", 103);
    \u0275\u0275listener("change", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_label_4_Template_input_change_1_listener() {
      const column_r15 = \u0275\u0275restoreView(_r14).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.toggleColumn(column_r15.key));
    }, "ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_label_4_Template_input_change_1_listener"));
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 104);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 106);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r15 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.isColumnSelected(column_r15.key));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r15.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r15.fieldType);
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_label_4_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_label_4_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 105)(1, "h5", 97);
    \u0275\u0275text(2, "Campos do Formul\xE1rio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 36);
    \u0275\u0275template(4, ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_label_4_Template, 6, 3, "label", 98);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r1.getFormColumns());
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 91)(1, "div", 92)(2, "h4", 93);
    \u0275\u0275text(3, "Selecionar Colunas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 94);
    \u0275\u0275text(5, "Escolha as colunas que deseja exibir na tabela");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 95)(7, "div", 96)(8, "h5", 97);
    \u0275\u0275text(9, "Colunas do Sistema");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 36);
    \u0275\u0275template(11, ReportsComponent_app_main_layout_0_div_9_div_4_div_14_label_11_Template, 4, 2, "label", 98);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(12, ReportsComponent_app_main_layout_0_div_9_div_4_div_14_div_12_Template, 5, 1, "div", 99);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 100)(14, "button", 101);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_div_9_div_4_div_14_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.toggleColumnSelector());
    }, "ReportsComponent_app_main_layout_0_div_9_div_4_div_14_Template_button_click_14_listener"));
    \u0275\u0275text(15, " Aplicar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(11);
    \u0275\u0275property("ngForOf", ctx_r1.getSystemColumns());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasFormColumns());
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_div_14_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_div_14_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_th_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 107);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r16 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", column_r16.label, " ");
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_th_19_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_th_19_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "div", 41);
    \u0275\u0275elementStart(2, "span", 111);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r17 = \u0275\u0275nextContext().$implicit;
    const lead_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx_r1.getColumnColor(lead_r18.columnId));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getColumnValue(lead_r18, column_r17));
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_1_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_1_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span", 112);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r17 = \u0275\u0275nextContext().$implicit;
    const lead_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-green-100", ctx_r1.isLeadConcluded(lead_r18))("text-green-800", ctx_r1.isLeadConcluded(lead_r18))("bg-red-100", ctx_r1.isLeadOverdue(lead_r18) && !ctx_r1.isLeadConcluded(lead_r18))("text-red-800", ctx_r1.isLeadOverdue(lead_r18) && !ctx_r1.isLeadConcluded(lead_r18))("bg-blue-100", !ctx_r1.isLeadConcluded(lead_r18) && !ctx_r1.isLeadOverdue(lead_r18))("text-blue-800", !ctx_r1.isLeadConcluded(lead_r18) && !ctx_r1.isLeadOverdue(lead_r18));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getColumnValue(lead_r18, column_r17), " ");
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_2_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_2_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 111);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r17 = \u0275\u0275nextContext().$implicit;
    const lead_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getColumnValue(lead_r18, column_r17), " ");
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_3_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_3_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 63);
    \u0275\u0275template(1, ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_1_Template, 4, 3, "div", 109)(2, ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_2_Template, 3, 13, "div", 0)(3, ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_div_3_Template, 2, 1, "div", 110);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r17 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", column_r17.key === "currentPhase");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", column_r17.key === "status");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", column_r17.key !== "currentPhase" && column_r17.key !== "status");
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275template(1, ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_td_1_Template, 4, 3, "td", 108);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const i_r19 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("bg-gray-50", i_r19 % 2 === 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.getSelectedColumns());
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_div_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73);
    \u0275\u0275element(1, "i", 113);
    \u0275\u0275elementStart(2, "p", 75);
    \u0275\u0275text(3, "Nenhum registro encontrado com os filtros aplicados");
    \u0275\u0275elementEnd()();
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_div_22_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_div_22_Template");
function ReportsComponent_app_main_layout_0_div_9_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 51)(2, "div", 83)(3, "div", 84)(4, "div")(5, "h3", 53);
    \u0275\u0275text(6, "Lista Detalhada de Registros");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 54);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 46)(10, "button", 85);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ReportsComponent_app_main_layout_0_div_9_div_4_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleColumnSelector());
    }, "ReportsComponent_app_main_layout_0_div_9_div_4_Template_button_click_10_listener"));
    \u0275\u0275element(11, "i", 86);
    \u0275\u0275text(12);
    \u0275\u0275element(13, "i", 87);
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, ReportsComponent_app_main_layout_0_div_9_div_4_div_14_Template, 16, 2, "div", 88);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 55)(16, "table", 56)(17, "thead", 57)(18, "tr");
    \u0275\u0275template(19, ReportsComponent_app_main_layout_0_div_9_div_4_th_19_Template, 2, 1, "th", 89);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "tbody", 60);
    \u0275\u0275template(21, ReportsComponent_app_main_layout_0_div_9_div_4_tr_21_Template, 2, 3, "tr", 90);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(22, ReportsComponent_app_main_layout_0_div_9_div_4_div_22_Template, 4, 0, "div", 62);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", ctx_r1.filteredRecords.length, " registros encontrados");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" Colunas (", ctx_r1.selectedColumns.length, ") ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.showColumnSelector);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngForOf", ctx_r1.getSelectedColumns());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.filteredRecords);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.filteredRecords.length === 0);
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_div_4_Template, "ReportsComponent_app_main_layout_0_div_9_div_4_Template");
function ReportsComponent_app_main_layout_0_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275template(1, ReportsComponent_app_main_layout_0_div_9_div_1_Template, 69, 9, "div", 0)(2, ReportsComponent_app_main_layout_0_div_9_div_2_Template, 26, 2, "div", 0)(3, ReportsComponent_app_main_layout_0_div_9_div_3_Template, 3, 1, "div", 0)(4, ReportsComponent_app_main_layout_0_div_9_div_4_Template, 23, 6, "div", 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.currentView === "overview");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.currentView === "sla");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.currentView === "phases");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.currentView === "registros");
  }
}
__name(ReportsComponent_app_main_layout_0_div_9_Template, "ReportsComponent_app_main_layout_0_div_9_Template");
function ReportsComponent_app_main_layout_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-main-layout");
    \u0275\u0275element(1, "app-company-breadcrumb", 3);
    \u0275\u0275elementStart(2, "div", 4);
    \u0275\u0275template(3, ReportsComponent_app_main_layout_0_app_advanced_filters_3_Template, 1, 8, "app-advanced-filters", 5);
    \u0275\u0275elementStart(4, "div", 6)(5, "div", 7)(6, "nav", 8);
    \u0275\u0275template(7, ReportsComponent_app_main_layout_0_button_7_Template, 3, 11, "button", 9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(8, ReportsComponent_app_main_layout_0_div_8_Template, 5, 1, "div", 10)(9, ReportsComponent_app_main_layout_0_div_9_Template, 5, 4, "div", 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("title", "Relat\xF3rios - " + ((ctx_r1.board == null ? null : ctx_r1.board.name) || "Quadro"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", !ctx_r1.isLoading && ctx_r1.boardId && ctx_r1.ownerId && ctx_r1.columns.length > 0);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", \u0275\u0275pureFunction4(9, _c4, \u0275\u0275pureFunction0(5, _c0), \u0275\u0275pureFunction0(6, _c1), \u0275\u0275pureFunction0(7, _c2), \u0275\u0275pureFunction0(8, _c3)));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isLoading || ctx_r1.isGeneratingReport);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isLoading && !ctx_r1.isGeneratingReport);
  }
}
__name(ReportsComponent_app_main_layout_0_Template, "ReportsComponent_app_main_layout_0_Template");
function ReportsComponent_div_1_app_advanced_filters_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-advanced-filters", 11);
    \u0275\u0275twoWayListener("filterQueryChange", /* @__PURE__ */ __name(function ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_filterQueryChange_0_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.filterQuery, $event) || (ctx_r1.filterQuery = $event);
      return \u0275\u0275resetView($event);
    }, "ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_filterQueryChange_0_listener"))("filterOnlyMineChange", /* @__PURE__ */ __name(function ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_filterOnlyMineChange_0_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.filterOnlyMine, $event) || (ctx_r1.filterOnlyMine = $event);
      return \u0275\u0275resetView($event);
    }, "ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_filterOnlyMineChange_0_listener"))("dynamicFiltersChange", /* @__PURE__ */ __name(function ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_dynamicFiltersChange_0_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.dynamicFilters, $event) || (ctx_r1.dynamicFilters = $event);
      return \u0275\u0275resetView($event);
    }, "ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_dynamicFiltersChange_0_listener"))("showAdvancedFiltersChange", /* @__PURE__ */ __name(function ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_showAdvancedFiltersChange_0_listener($event) {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.showAdvancedFilters, $event) || (ctx_r1.showAdvancedFilters = $event);
      return \u0275\u0275resetView($event);
    }, "ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_showAdvancedFiltersChange_0_listener"));
    \u0275\u0275listener("filtersApplied", /* @__PURE__ */ __name(function ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_filtersApplied_0_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.applyFilters());
    }, "ReportsComponent_div_1_app_advanced_filters_6_Template_app_advanced_filters_filtersApplied_0_listener"));
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("boardId", ctx_r1.boardId)("ownerId", ctx_r1.ownerId)("columns", ctx_r1.columns)("currentUser", ctx_r1.currentUser);
    \u0275\u0275twoWayProperty("filterQuery", ctx_r1.filterQuery)("filterOnlyMine", ctx_r1.filterOnlyMine)("dynamicFilters", ctx_r1.dynamicFilters)("showAdvancedFilters", ctx_r1.showAdvancedFilters);
  }
}
__name(ReportsComponent_div_1_app_advanced_filters_6_Template, "ReportsComponent_div_1_app_advanced_filters_6_Template");
function ReportsComponent_div_1_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 120);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ReportsComponent_div_1_button_10_Template_button_click_0_listener() {
      const tab_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.setView(tab_r22.key));
    }, "ReportsComponent_div_1_button_10_Template_button_click_0_listener"));
    \u0275\u0275element(1, "i");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tab_r22 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("border-blue-500", ctx_r1.currentView === tab_r22.key)("text-blue-600", ctx_r1.currentView === tab_r22.key)("border-transparent", ctx_r1.currentView !== tab_r22.key)("text-gray-500", ctx_r1.currentView !== tab_r22.key)("hover:text-gray-700", ctx_r1.currentView !== tab_r22.key);
    \u0275\u0275advance();
    \u0275\u0275classMap(\u0275\u0275interpolate1("fas ", tab_r22.icon, " mr-2"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tab_r22.name, " ");
  }
}
__name(ReportsComponent_div_1_button_10_Template, "ReportsComponent_div_1_button_10_Template");
function ReportsComponent_div_1_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 121)(2, "div", 122)(3, "div", 40)(4, "div")(5, "p", 123);
    \u0275\u0275text(6, "Total de Registros");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 124);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 125);
    \u0275\u0275element(10, "i", 126);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 127)(12, "div", 40)(13, "div")(14, "p", 128);
    \u0275\u0275text(15, "Registros Conclu\xEDdos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p", 124);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 129);
    \u0275\u0275element(19, "i", 130);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 131)(21, "div", 40)(22, "div")(23, "p", 132);
    \u0275\u0275text(24, "Registros Atrasados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "p", 124);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 133);
    \u0275\u0275element(28, "i", 134);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.summaryStats.totalRecords);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.summaryStats.concludedRecords);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.summaryStats.overdueRecords);
  }
}
__name(ReportsComponent_div_1_div_12_Template, "ReportsComponent_div_1_div_12_Template");
function ReportsComponent_div_1_div_13_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 63)(2, "div", 19);
    \u0275\u0275element(3, "div", 64);
    \u0275\u0275elementStart(4, "span", 65);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(6, "td", 66);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 67)(9, "span", 136);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td", 137);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 138);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const indicator_r23 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background-color", indicator_r23.phaseColor);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(indicator_r23.phaseName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", indicator_r23.slaDays, " ");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-green-100", indicator_r23.compliance >= 80)("text-green-800", indicator_r23.compliance >= 80)("bg-yellow-100", indicator_r23.compliance >= 60 && indicator_r23.compliance < 80)("text-yellow-800", indicator_r23.compliance >= 60 && indicator_r23.compliance < 80)("bg-red-100", indicator_r23.compliance < 60)("text-red-800", indicator_r23.compliance < 60);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", indicator_r23.compliance, "% ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", indicator_r23.onTime, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", indicator_r23.overdue, " ");
  }
}
__name(ReportsComponent_div_1_div_13_tr_19_Template, "ReportsComponent_div_1_div_13_tr_19_Template");
function ReportsComponent_div_1_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 135)(2, "h3", 31);
    \u0275\u0275text(3, "Indicadores de SLA por Fase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 55)(5, "table", 56)(6, "thead", 57)(7, "tr")(8, "th", 58);
    \u0275\u0275text(9, "Fase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 59);
    \u0275\u0275text(11, "SLA (dias)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 59);
    \u0275\u0275text(13, "% Cumprimento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 59);
    \u0275\u0275text(15, "No Prazo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th", 59);
    \u0275\u0275text(17, "Atrasados");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody", 60);
    \u0275\u0275template(19, ReportsComponent_div_1_div_13_tr_19_Template, 15, 19, "tr", 61);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275property("ngForOf", ctx_r1.slaIndicators);
  }
}
__name(ReportsComponent_div_1_div_13_Template, "ReportsComponent_div_1_div_13_Template");
function ReportsComponent_div_1_div_14_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 141)(1, "div", 78)(2, "div", 19);
    \u0275\u0275element(3, "div", 142);
    \u0275\u0275elementStart(4, "h3", 53);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 24);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 143)(9, "div", 144)(10, "p", 81);
    \u0275\u0275text(11, "Tempo M\xE9dio na Fase");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p", 145);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 144)(15, "p", 81);
    \u0275\u0275text(16, "Taxa de Convers\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p", 145);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const metric_r24 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background-color", metric_r24.phaseColor);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(metric_r24.phaseName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", metric_r24.recordsCount, " registros");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.formatDuration(metric_r24.avgTimeInPhase));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", metric_r24.conversionRate, "%");
  }
}
__name(ReportsComponent_div_1_div_14_div_2_Template, "ReportsComponent_div_1_div_14_div_2_Template");
function ReportsComponent_div_1_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 139);
    \u0275\u0275template(2, ReportsComponent_div_1_div_14_div_2_Template, 19, 6, "div", 140);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.phaseMetrics);
  }
}
__name(ReportsComponent_div_1_div_14_Template, "ReportsComponent_div_1_div_14_Template");
function ReportsComponent_div_1_div_15_div_15_label_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 102)(1, "input", 103);
    \u0275\u0275listener("change", /* @__PURE__ */ __name(function ReportsComponent_div_1_div_15_div_15_label_11_Template_input_change_1_listener() {
      const column_r28 = \u0275\u0275restoreView(_r27).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.toggleColumn(column_r28.key));
    }, "ReportsComponent_div_1_div_15_div_15_label_11_Template_input_change_1_listener"));
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 104);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r28 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.isColumnSelected(column_r28.key));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r28.label);
  }
}
__name(ReportsComponent_div_1_div_15_div_15_label_11_Template, "ReportsComponent_div_1_div_15_div_15_label_11_Template");
function ReportsComponent_div_1_div_15_div_15_div_12_label_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 102)(1, "input", 103);
    \u0275\u0275listener("change", /* @__PURE__ */ __name(function ReportsComponent_div_1_div_15_div_15_div_12_label_4_Template_input_change_1_listener() {
      const column_r30 = \u0275\u0275restoreView(_r29).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r1.toggleColumn(column_r30.key));
    }, "ReportsComponent_div_1_div_15_div_15_div_12_label_4_Template_input_change_1_listener"));
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span", 104);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 106);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r30 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(5);
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.isColumnSelected(column_r30.key));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r30.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r30.fieldType);
  }
}
__name(ReportsComponent_div_1_div_15_div_15_div_12_label_4_Template, "ReportsComponent_div_1_div_15_div_15_div_12_label_4_Template");
function ReportsComponent_div_1_div_15_div_15_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 105)(1, "h5", 97);
    \u0275\u0275text(2, "Campos do Formul\xE1rio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 36);
    \u0275\u0275template(4, ReportsComponent_div_1_div_15_div_15_div_12_label_4_Template, 6, 3, "label", 98);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r1.getFormColumns());
  }
}
__name(ReportsComponent_div_1_div_15_div_15_div_12_Template, "ReportsComponent_div_1_div_15_div_15_div_12_Template");
function ReportsComponent_div_1_div_15_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 91)(1, "div", 92)(2, "h4", 93);
    \u0275\u0275text(3, "Selecionar Colunas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 94);
    \u0275\u0275text(5, "Escolha as colunas que deseja exibir na tabela");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 95)(7, "div", 96)(8, "h5", 97);
    \u0275\u0275text(9, "Colunas do Sistema");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 36);
    \u0275\u0275template(11, ReportsComponent_div_1_div_15_div_15_label_11_Template, 4, 2, "label", 98);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(12, ReportsComponent_div_1_div_15_div_15_div_12_Template, 5, 1, "div", 99);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 100)(14, "button", 101);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ReportsComponent_div_1_div_15_div_15_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r26);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleColumnSelector());
    }, "ReportsComponent_div_1_div_15_div_15_Template_button_click_14_listener"));
    \u0275\u0275text(15, " Aplicar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(11);
    \u0275\u0275property("ngForOf", ctx_r1.getSystemColumns());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasFormColumns());
  }
}
__name(ReportsComponent_div_1_div_15_div_15_Template, "ReportsComponent_div_1_div_15_div_15_Template");
function ReportsComponent_div_1_div_15_th_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 107);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r31 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", column_r31.label, " ");
  }
}
__name(ReportsComponent_div_1_div_15_th_20_Template, "ReportsComponent_div_1_div_15_th_20_Template");
function ReportsComponent_div_1_div_15_tr_22_td_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "div", 41);
    \u0275\u0275elementStart(2, "span", 111);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r32 = \u0275\u0275nextContext().$implicit;
    const lead_r33 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-color", ctx_r1.getColumnColor(lead_r33.columnId));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getColumnValue(lead_r33, column_r32));
  }
}
__name(ReportsComponent_div_1_div_15_tr_22_td_1_div_1_Template, "ReportsComponent_div_1_div_15_tr_22_td_1_div_1_Template");
function ReportsComponent_div_1_div_15_tr_22_td_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span", 112);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r32 = \u0275\u0275nextContext().$implicit;
    const lead_r33 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-green-100", ctx_r1.isLeadConcluded(lead_r33))("text-green-800", ctx_r1.isLeadConcluded(lead_r33))("bg-red-100", ctx_r1.isLeadOverdue(lead_r33) && !ctx_r1.isLeadConcluded(lead_r33))("text-red-800", ctx_r1.isLeadOverdue(lead_r33) && !ctx_r1.isLeadConcluded(lead_r33))("bg-blue-100", !ctx_r1.isLeadConcluded(lead_r33) && !ctx_r1.isLeadOverdue(lead_r33))("text-blue-800", !ctx_r1.isLeadConcluded(lead_r33) && !ctx_r1.isLeadOverdue(lead_r33));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getColumnValue(lead_r33, column_r32), " ");
  }
}
__name(ReportsComponent_div_1_div_15_tr_22_td_1_div_2_Template, "ReportsComponent_div_1_div_15_tr_22_td_1_div_2_Template");
function ReportsComponent_div_1_div_15_tr_22_td_1_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 111);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r32 = \u0275\u0275nextContext().$implicit;
    const lead_r33 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getColumnValue(lead_r33, column_r32), " ");
  }
}
__name(ReportsComponent_div_1_div_15_tr_22_td_1_div_3_Template, "ReportsComponent_div_1_div_15_tr_22_td_1_div_3_Template");
function ReportsComponent_div_1_div_15_tr_22_td_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 63);
    \u0275\u0275template(1, ReportsComponent_div_1_div_15_tr_22_td_1_div_1_Template, 4, 3, "div", 109)(2, ReportsComponent_div_1_div_15_tr_22_td_1_div_2_Template, 3, 13, "div", 0)(3, ReportsComponent_div_1_div_15_tr_22_td_1_div_3_Template, 2, 1, "div", 110);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r32 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", column_r32.key === "currentPhase");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", column_r32.key === "status");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", column_r32.key !== "currentPhase" && column_r32.key !== "status");
  }
}
__name(ReportsComponent_div_1_div_15_tr_22_td_1_Template, "ReportsComponent_div_1_div_15_tr_22_td_1_Template");
function ReportsComponent_div_1_div_15_tr_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr");
    \u0275\u0275template(1, ReportsComponent_div_1_div_15_tr_22_td_1_Template, 4, 3, "td", 108);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.getSelectedColumns());
  }
}
__name(ReportsComponent_div_1_div_15_tr_22_Template, "ReportsComponent_div_1_div_15_tr_22_Template");
function ReportsComponent_div_1_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 135)(2, "div", 146)(3, "div", 84)(4, "h3", 53);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 147)(7, "button", 148);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ReportsComponent_div_1_div_15_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.exportToExcel());
    }, "ReportsComponent_div_1_div_15_Template_button_click_7_listener"));
    \u0275\u0275element(8, "i", 149);
    \u0275\u0275text(9, " Exportar Excel ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 46)(11, "button", 85);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ReportsComponent_div_1_div_15_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleColumnSelector());
    }, "ReportsComponent_div_1_div_15_Template_button_click_11_listener"));
    \u0275\u0275element(12, "i", 86);
    \u0275\u0275text(13);
    \u0275\u0275element(14, "i", 87);
    \u0275\u0275elementEnd();
    \u0275\u0275template(15, ReportsComponent_div_1_div_15_div_15_Template, 16, 2, "div", 88);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 55)(17, "table", 56)(18, "thead", 57)(19, "tr");
    \u0275\u0275template(20, ReportsComponent_div_1_div_15_th_20_Template, 2, 1, "th", 89);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "tbody", 60);
    \u0275\u0275template(22, ReportsComponent_div_1_div_15_tr_22_Template, 2, 1, "tr", 61);
    \u0275\u0275pipe(23, "slice");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("Lista de Registros (", ctx_r1.filteredRecords.length, ")");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" Colunas (", ctx_r1.selectedColumns.length, ") ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.showColumnSelector);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngForOf", ctx_r1.getSelectedColumns());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", \u0275\u0275pipeBind3(23, 5, ctx_r1.filteredRecords, 0, 50));
  }
}
__name(ReportsComponent_div_1_div_15_Template, "ReportsComponent_div_1_div_15_Template");
function ReportsComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 114)(1, "div", 115)(2, "div", 116)(3, "h2", 24);
    \u0275\u0275element(4, "i", 32);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, ReportsComponent_div_1_app_advanced_filters_6_Template, 1, 8, "app-advanced-filters", 5);
    \u0275\u0275elementStart(7, "div", 6)(8, "div", 7)(9, "nav", 117);
    \u0275\u0275template(10, ReportsComponent_div_1_button_10_Template, 3, 14, "button", 118);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 119);
    \u0275\u0275template(12, ReportsComponent_div_1_div_12_Template, 29, 3, "div", 0)(13, ReportsComponent_div_1_div_13_Template, 20, 1, "div", 0)(14, ReportsComponent_div_1_div_14_Template, 3, 1, "div", 0)(15, ReportsComponent_div_1_div_15_Template, 24, 9, "div", 0);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" Relat\xF3rios - ", ctx_r1.board == null ? null : ctx_r1.board.name, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isLoading && ctx_r1.boardId && ctx_r1.ownerId && ctx_r1.columns.length > 0);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r1.viewTabs);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.currentView === "overview");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.currentView === "sla");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.currentView === "phases");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.currentView === "registros");
  }
}
__name(ReportsComponent_div_1_Template, "ReportsComponent_div_1_Template");
function ReportsComponent_div_2_div_11_p_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 81);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const availableBoard_r35 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(availableBoard_r35.description);
  }
}
__name(ReportsComponent_div_2_div_11_p_5_Template, "ReportsComponent_div_2_div_11_p_5_Template");
function ReportsComponent_div_2_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 160);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ReportsComponent_div_2_div_11_Template_div_click_0_listener() {
      const availableBoard_r35 = \u0275\u0275restoreView(_r34).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectBoard(availableBoard_r35.id));
    }, "ReportsComponent_div_2_div_11_Template_div_click_0_listener"));
    \u0275\u0275elementStart(1, "div", 40)(2, "div")(3, "h3", 161);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, ReportsComponent_div_2_div_11_p_5_Template, 2, 1, "p", 162);
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "i", 163);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const availableBoard_r35 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(availableBoard_r35.name);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", availableBoard_r35.description);
  }
}
__name(ReportsComponent_div_2_div_11_Template, "ReportsComponent_div_2_div_11_Template");
function ReportsComponent_div_2_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r36 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 164)(1, "p", 75);
    \u0275\u0275text(2, "Nenhum quadro encontrado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 165);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function ReportsComponent_div_2_div_12_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r36);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goBack());
    }, "ReportsComponent_div_2_div_12_Template_button_click_3_listener"));
    \u0275\u0275text(4, " Voltar ao Dashboard ");
    \u0275\u0275elementEnd()();
  }
}
__name(ReportsComponent_div_2_div_12_Template, "ReportsComponent_div_2_div_12_Template");
function ReportsComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 150)(1, "div", 151)(2, "div", 152)(3, "div", 153)(4, "div", 154);
    \u0275\u0275element(5, "i", 155);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h2", 156);
    \u0275\u0275text(7, "Relat\xF3rios");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 16);
    \u0275\u0275text(9, "Selecione um quadro para visualizar seus relat\xF3rios");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 157);
    \u0275\u0275template(11, ReportsComponent_div_2_div_11_Template, 7, 2, "div", 158)(12, ReportsComponent_div_2_div_12_Template, 5, 0, "div", 159);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275property("ngForOf", ctx_r1.availableBoards);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.availableBoards.length === 0);
  }
}
__name(ReportsComponent_div_2_Template, "ReportsComponent_div_2_Template");
var _ReportsComponent = class _ReportsComponent {
  authService = inject(AuthService);
  firestoreService = inject(FirestoreService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  boardId = "";
  ownerId = "";
  currentUser = null;
  board = null;
  availableBoards = [];
  // Data
  records = [];
  columns = [];
  users = [];
  // Kanban-style filters - now handled by AdvancedFiltersComponent
  filterQuery = "";
  filterOnlyMine = false;
  dynamicFilters = {};
  showAdvancedFilters = false;
  // Loading states
  isLoading = false;
  isGeneratingReport = false;
  // Report data
  filteredRecords = [];
  slaIndicators = [];
  phaseMetrics = [];
  summaryStats = {
    totalRecords: 0,
    newRecordsThisPeriod: 0,
    concludedRecords: 0,
    avgConversionTime: 0,
    activeRecords: 0,
    overdueRecords: 0
  };
  // Chart data
  chartData = {
    phaseDistribution: [],
    registrosOverTime: [],
    conversionFunnel: []
  };
  // Display options
  currentView = "overview";
  exportFormats = ["PDF", "Excel", "CSV"];
  // Column management for registros table
  availableColumns = [];
  selectedColumns = [];
  showColumnSelector = false;
  viewTabs = [
    { key: "overview", name: "Vis\xE3o Geral", icon: "fa-chart-pie" },
    { key: "sla", name: "SLA", icon: "fa-clock" },
    { key: "phases", name: "Fases", icon: "fa-columns" },
    { key: "registros", name: "Registros", icon: "fa-users" }
  ];
  ngOnInit() {
    return __async(this, null, function* () {
      this.currentUser = this.authService.getCurrentUser();
      if (!this.ownerId) {
        this.ownerId = this.currentUser?.uid || "";
      }
      if (!this.boardId) {
        this.route.queryParams.subscribe((params) => {
          if (params["boardId"]) {
            this.boardId = params["boardId"];
          }
        });
      }
      yield this.loadAvailableBoards();
      if (this.boardId && this.ownerId) {
        yield this.loadData();
        this.initializeColumns();
        this.generateReport();
      }
    });
  }
  ngOnDestroy() {
  }
  loadAvailableBoards() {
    return __async(this, null, function* () {
      if (!this.ownerId)
        return;
      try {
        this.availableBoards = yield this.firestoreService.getBoards(this.ownerId);
      } catch (error) {
        console.error("Erro ao carregar boards dispon\xEDveis:", error);
      }
    });
  }
  selectBoard(boardId) {
    return __async(this, null, function* () {
      this.boardId = boardId;
      yield this.loadData();
      this.initializeColumns();
      this.generateReport();
    });
  }
  loadData() {
    return __async(this, null, function* () {
      this.isLoading = true;
      try {
        const boards = yield this.firestoreService.getBoards(this.ownerId);
        this.board = boards.find((b) => b.id === this.boardId) || null;
        const [registros, columns] = yield Promise.all([
          this.firestoreService.getLeads(this.ownerId, this.boardId),
          this.firestoreService.getColumns(this.ownerId, this.boardId)
        ]);
        this.records = registros;
        this.columns = columns;
        this.users = [];
        console.log("Dados carregados:", {
          boardId: this.boardId,
          recordsCount: registros.length,
          columnsCount: columns.length,
          formFieldsCount: this.board?.initialFormFields?.length || 0,
          registros: registros.slice(0, 3)
          // Log first 3 registros for debugging
        });
        if (registros.length > 0 && registros[0].fields) {
          console.log("\u{1F4CB} Campos dispon\xEDveis no primeiro registro:", Object.keys(registros[0].fields));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do relat\xF3rio:", error);
      } finally {
        this.isLoading = false;
      }
    });
  }
  generateReport() {
    if (this.isGeneratingReport)
      return;
    this.isGeneratingReport = true;
    try {
      this.applyFilters();
      this.calculateSummaryStats();
      this.calculateSLAIndicators();
      this.calculatePhaseMetrics();
      this.generateChartData();
    } finally {
      this.isGeneratingReport = false;
    }
  }
  getLeadDate(lead) {
    if (lead.createdAt?.toDate) {
      return lead.createdAt.toDate();
    } else if (lead.createdAt?.seconds) {
      return new Date(lead.createdAt.seconds * 1e3);
    } else if (lead.createdAt) {
      return new Date(lead.createdAt);
    }
    return /* @__PURE__ */ new Date();
  }
  isLeadOverdue(lead) {
    const currentColumn = this.columns.find((c) => c.id === lead.columnId);
    if (!currentColumn?.slaDays)
      return false;
    const movedDate = lead.movedToCurrentColumnAt?.toDate ? lead.movedToCurrentColumnAt.toDate() : lead.movedToCurrentColumnAt?.seconds ? new Date(lead.movedToCurrentColumnAt.seconds * 1e3) : new Date(lead.movedToCurrentColumnAt || lead.createdAt);
    const daysPassed = (Date.now() - movedDate.getTime()) / (1e3 * 60 * 60 * 24);
    return daysPassed > currentColumn.slaDays;
  }
  isLeadConcluded(lead) {
    const currentColumn = this.columns.find((c) => c.id === lead.columnId);
    return !!(currentColumn?.endStageType && currentColumn.endStageType !== "none");
  }
  calculateSummaryStats() {
    const startDate = this.dynamicFilters.startDate ? new Date(this.dynamicFilters.startDate) : null;
    const endDate = this.dynamicFilters.endDate ? new Date(this.dynamicFilters.endDate) : null;
    this.summaryStats = {
      totalRecords: this.filteredRecords.length,
      newRecordsThisPeriod: startDate && endDate ? this.filteredRecords.filter((record) => {
        const leadDate = this.getLeadDate(record);
        return leadDate >= startDate && leadDate <= endDate;
      }).length : this.filteredRecords.length,
      concludedRecords: this.filteredRecords.filter((record) => this.isLeadConcluded(record)).length,
      avgConversionTime: this.calculateAverageConversionTime(),
      activeRecords: this.filteredRecords.filter((record) => !this.isLeadConcluded(record)).length,
      overdueRecords: this.filteredRecords.filter((record) => this.isLeadOverdue(record) && !this.isLeadConcluded(record)).length
    };
  }
  calculateAverageConversionTime() {
    const concludedRecords = this.filteredRecords.filter((record) => this.isLeadConcluded(record));
    if (concludedRecords.length === 0)
      return 0;
    const totalTime = concludedRecords.reduce((sum, lead) => {
      const createdDate = this.getLeadDate(lead);
      const movedDate = lead.movedToCurrentColumnAt?.toDate ? lead.movedToCurrentColumnAt.toDate() : /* @__PURE__ */ new Date();
      return sum + (movedDate.getTime() - createdDate.getTime());
    }, 0);
    return Math.round(totalTime / concludedRecords.length / (1e3 * 60 * 60 * 24));
  }
  calculateSLAIndicators() {
    this.slaIndicators = this.columns.filter((col) => col.slaDays && col.slaDays > 0).map((column) => {
      const registrosInPhase = this.filteredRecords.filter((record) => record.columnId === column.id);
      const overdueRecords = registrosInPhase.filter((record) => this.isLeadOverdue(record));
      const onTimeLeads = registrosInPhase.length - overdueRecords.length;
      return {
        phaseId: column.id,
        phaseName: column.name,
        phaseColor: column.color,
        slaDays: column.slaDays,
        totalRecords: registrosInPhase.length,
        onTime: onTimeLeads,
        overdue: overdueRecords.length,
        compliance: registrosInPhase.length > 0 ? Math.round(onTimeLeads / registrosInPhase.length * 100) : 100
      };
    });
  }
  calculatePhaseMetrics() {
    this.phaseMetrics = this.columns.map((column) => {
      const registrosInPhase = this.filteredRecords.filter((record) => record.columnId === column.id);
      const avgTime = this.calculateAverageTimeInPhase(registrosInPhase);
      const conversionRate = this.calculatePhaseConversionRate(column);
      return {
        phaseId: column.id,
        phaseName: column.name,
        phaseColor: column.color,
        recordsCount: registrosInPhase.length,
        avgTimeInPhase: avgTime,
        conversionRate
      };
    });
  }
  calculateAverageTimeInPhase(registros) {
    if (registros.length === 0)
      return 0;
    const totalTime = registros.reduce((sum, lead) => {
      const phaseHistory = lead.phaseHistory || {};
      const phaseEntry = Object.values(phaseHistory).find((p) => p.phaseId === lead.columnId);
      if (phaseEntry?.duration) {
        return sum + phaseEntry.duration;
      } else if (phaseEntry?.enteredAt) {
        const enteredDate = phaseEntry.enteredAt.toDate ? phaseEntry.enteredAt.toDate() : new Date(phaseEntry.enteredAt);
        return sum + (Date.now() - enteredDate.getTime());
      }
      return sum;
    }, 0);
    return Math.round(totalTime / registros.length / (1e3 * 60 * 60 * 24));
  }
  calculatePhaseConversionRate(column) {
    const currentIndex = this.columns.findIndex((c) => c.id === column.id);
    if (currentIndex === this.columns.length - 1)
      return 0;
    const registrosInCurrentPhase = this.filteredRecords.filter((record) => record.columnId === column.id).length;
    const nextPhases = this.columns.slice(currentIndex + 1);
    const registrosInNextPhases = this.filteredRecords.filter((record) => nextPhases.some((p) => p.id === record.columnId)).length;
    const totalProgressed = registrosInCurrentPhase + registrosInNextPhases;
    return totalProgressed > 0 ? Math.round(registrosInNextPhases / totalProgressed * 100) : 0;
  }
  generateChartData() {
    this.chartData.phaseDistribution = this.phaseMetrics.map((metric) => ({
      name: metric.phaseName,
      value: metric.recordsCount,
      color: metric.phaseColor
    }));
    console.log("\u{1F4CA} Chart Data Generated:", {
      phaseMetrics: this.phaseMetrics,
      phaseDistribution: this.chartData.phaseDistribution,
      columnsCount: this.columns.length,
      recordsCount: this.filteredRecords.length
    });
    this.chartData.registrosOverTime = this.generateLeadsOverTimeData();
    this.chartData.conversionFunnel = this.phaseMetrics.map((metric, index) => ({
      phase: metric.phaseName,
      registros: metric.recordsCount,
      order: index
    }));
  }
  generateLeadsOverTimeData() {
    const startDate = this.dynamicFilters.startDate ? new Date(this.dynamicFilters.startDate) : new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() - 6));
    const endDate = this.dynamicFilters.endDate ? new Date(this.dynamicFilters.endDate) : /* @__PURE__ */ new Date();
    const data = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const registrosInWeek = this.filteredRecords.filter((record) => {
        const leadDate = this.getLeadDate(record);
        return leadDate >= current && leadDate <= weekEnd;
      }).length;
      data.push({
        period: `${current.getDate()}/${current.getMonth() + 1}`,
        registros: registrosInWeek
      });
      current.setDate(current.getDate() + 7);
    }
    return data;
  }
  // View methods
  setView(view) {
    this.currentView = view;
  }
  isStandaloneView() {
    return !!this.route.snapshot.queryParams["boardId"] && !this.boardIdFromInput;
  }
  get boardIdFromInput() {
    return this.boardId !== "" && !this.route.snapshot.queryParams["boardId"];
  }
  // Export methods
  exportReport(format) {
    return __async(this, null, function* () {
      try {
        console.log(`Exportando relat\xF3rio em formato ${format}`);
        alert(`Exporta\xE7\xE3o em ${format} ser\xE1 implementada em breve!`);
      } catch (error) {
        console.error("Erro ao exportar relat\xF3rio:", error);
        alert("Erro ao exportar relat\xF3rio. Tente novamente.");
      }
    });
  }
  // Utility methods
  formatDate(date) {
    if (!date)
      return "-";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("pt-BR");
  }
  formatDuration(days) {
    if (days === 0)
      return "-";
    if (days === 1)
      return "1 dia";
    return `${days} dias`;
  }
  getResponsibleName(userId) {
    const user = this.users.find((u) => u.uid === userId);
    return user?.displayName || user?.email || "N\xE3o atribu\xEDdo";
  }
  getColumnName(columnId) {
    const column = this.columns.find((c) => c.id === columnId);
    return column?.name || "Fase desconhecida";
  }
  getColumnColor(columnId) {
    const column = this.columns.find((c) => c.id === columnId);
    return column?.color || "#6B7280";
  }
  goBack() {
    if (this.route.snapshot.queryParams["boardId"]) {
      this.router.navigate(["/kanban", this.boardId], {
        queryParams: { ownerId: this.ownerId }
      });
    } else {
      this.router.navigate(["/dashboard"]);
    }
  }
  getChartBarHeight(value) {
    if (this.chartData.registrosOverTime.length === 0)
      return 0;
    const maxValue = Math.max(...this.chartData.registrosOverTime.map((d) => d.registros));
    return maxValue > 0 ? value / maxValue * 100 : 0;
  }
  getPhasePercentage(value) {
    if (!this.chartData.phaseDistribution.length)
      return 0;
    const maxValue = Math.max(...this.chartData.phaseDistribution.map((item) => item.value));
    return maxValue > 0 ? value / maxValue * 100 : 0;
  }
  // Column management methods
  initializeColumns() {
    this.initializeAvailableColumns();
    this.loadSelectedColumns();
  }
  initializeAvailableColumns() {
    this.availableColumns = [];
    const systemColumns = [
      { key: "currentPhase", label: "Fase Atual", type: "system", field: "columnId" },
      { key: "createdAt", label: "Criado em", type: "system", field: "createdAt" },
      { key: "status", label: "Status", type: "system", field: "status" },
      { key: "responsibleUser", label: "Respons\xE1vel", type: "system", field: "responsibleUserEmail" }
    ];
    this.availableColumns.push(...systemColumns);
    const formFields = this.board?.initialFormFields || [];
    console.log("\u{1F50D} Campos do formul\xE1rio para colunas:", formFields);
    const commonFormFields = [
      { name: "contactName", label: "Nome do Contato", type: "text" },
      { name: "contactEmail", label: "Email do Contato", type: "email" },
      { name: "contactPhone", label: "Telefone do Contato", type: "tel" },
      { name: "companyName", label: "Nome da Empresa", type: "text" },
      { name: "cnpj", label: "CNPJ", type: "text" }
    ];
    commonFormFields.forEach((field) => {
      this.availableColumns.push({
        key: field.name,
        label: field.label,
        type: "form",
        field: `fields.${field.name}`,
        fieldType: field.type
      });
    });
    formFields.forEach((field) => {
      if (field.name && field.label) {
        const existingColumn = this.availableColumns.find((col) => col.key === field.name);
        if (!existingColumn) {
          this.availableColumns.push({
            key: field.name,
            label: field.label || field.name,
            type: "form",
            field: `fields.${field.name}`,
            fieldType: field.type || "text"
          });
        } else {
          existingColumn.label = field.label || existingColumn.label;
          existingColumn.fieldType = field.type || existingColumn.fieldType;
        }
      }
    });
    console.log("\u{1F4CA} Colunas dispon\xEDveis inicializadas:", this.availableColumns);
  }
  loadSelectedColumns() {
    if (!this.boardId)
      return;
    try {
      const saved = localStorage.getItem(`report-columns-${this.boardId}`);
      if (saved) {
        this.selectedColumns = JSON.parse(saved);
      } else {
        this.selectedColumns = [
          "contactName",
          "contactEmail",
          "companyName",
          "currentPhase",
          "createdAt",
          "status"
        ];
      }
    } catch (error) {
      console.warn("Could not load selected columns from localStorage:", error);
      this.selectedColumns = ["contactName", "contactEmail", "companyName", "currentPhase", "createdAt", "status"];
    }
  }
  saveSelectedColumns() {
    if (!this.boardId)
      return;
    try {
      localStorage.setItem(`report-columns-${this.boardId}`, JSON.stringify(this.selectedColumns));
    } catch (error) {
      console.warn("Could not save selected columns to localStorage:", error);
    }
  }
  toggleColumnSelector() {
    this.showColumnSelector = !this.showColumnSelector;
  }
  isColumnSelected(columnKey) {
    return this.selectedColumns.includes(columnKey);
  }
  toggleColumn(columnKey) {
    if (this.isColumnSelected(columnKey)) {
      this.selectedColumns = this.selectedColumns.filter((key) => key !== columnKey);
    } else {
      this.selectedColumns.push(columnKey);
    }
    this.saveSelectedColumns();
  }
  getSelectedColumns() {
    return this.availableColumns.filter((col) => this.selectedColumns.includes(col.key));
  }
  getColumnValue(lead, column) {
    switch (column.key) {
      case "currentPhase":
        return this.getColumnName(lead.columnId);
      case "createdAt":
        return this.formatDate(lead.createdAt);
      case "status":
        if (this.isLeadConcluded(lead))
          return "Conclu\xEDdo";
        if (this.isLeadOverdue(lead))
          return "Em Atraso";
        return "Ativo";
      case "responsibleUser":
        return lead.responsibleUserName || lead.responsibleUserEmail || "N\xE3o atribu\xEDdo";
      // Form fields - using same logic as Kanban component
      case "contactName":
        return this.readFieldValue(lead, "contactName");
      case "contactEmail":
        return this.readFieldValue(lead, "contactEmail");
      case "contactPhone":
        return this.readFieldValue(lead, "contactPhone");
      case "companyName":
        return this.readFieldValue(lead, "companyName");
      case "cnpj":
        return this.readFieldValue(lead, "cnpj");
      default:
        const value = lead.fields?.[column.key];
        if (value !== void 0 && value !== null && value !== "") {
          return String(value);
        }
        const nestedValue = this.getNestedProperty(lead, column.field);
        return nestedValue ? String(nestedValue) : "-";
    }
  }
  // Method inspired by the Kanban component's readFieldValue
  readFieldValue(lead, key) {
    if (!lead.fields)
      return "-";
    const synonymsGroup = {
      companyName: ["companyName", "empresa", "nomeEmpresa", "nameCompany", "company", "company_name", "empresa_nome", "nameComapny"],
      contactName: ["contactName", "name", "nome", "nomeLead", "nameLead", "leadName"],
      contactEmail: ["contactEmail", "email", "emailLead", "contatoEmail", "leadEmail"],
      contactPhone: ["contactPhone", "phone", "telefone", "celular", "phoneLead", "telefoneContato"],
      cnpj: ["cnpj", "cnpjCompany", "cnpjEmpresa", "companyCnpj"]
    };
    const candidates = synonymsGroup[key] || [key];
    for (const candidate of candidates) {
      const value = lead.fields[candidate];
      if (value !== void 0 && value !== null && String(value).trim() !== "") {
        return String(value);
      }
    }
    return "-";
  }
  getNestedProperty(obj, path) {
    return path.split(".").reduce((current, prop) => {
      return current && current[prop] !== void 0 ? current[prop] : null;
    }, obj);
  }
  // Helper methods for template
  getSystemColumns() {
    return this.availableColumns.filter((col) => col.type === "system");
  }
  getFormColumns() {
    return this.availableColumns.filter((col) => col.type === "form");
  }
  hasFormColumns() {
    return this.availableColumns.filter((col) => col.type === "form").length > 0;
  }
  // Método de debug temporário
  debugLeadStructure() {
    if (this.records.length === 0) {
      alert("Nenhum registro dispon\xEDvel para debug");
      return;
    }
    const lead = this.records[0];
    console.log("\u{1F41B} DEBUG COMPLETO DO LEAD:");
    console.log("\u{1F41B} Lead completo:", lead);
    console.log("\u{1F41B} Lead.fields:", lead.fields);
    console.log("\u{1F41B} Chaves dos fields:", lead.fields ? Object.keys(lead.fields) : "sem fields");
    console.log("\u{1F41B} Valores dos fields:", lead.fields ? Object.entries(lead.fields) : "sem entries");
    console.log("\u{1F41B} TESTANDO CAMPOS PROBLEM\xC1TICOS:");
    console.log("\u{1F41B} contactName tentativas:", [
      lead.fields?.["contactName"],
      lead.fields?.["name"],
      lead.fields?.["nome"]
    ]);
    console.log("\u{1F41B} contactEmail tentativas:", [
      lead.fields?.["contactEmail"],
      lead.fields?.["email"]
    ]);
    console.log("\u{1F41B} RESULTADO DOS M\xC9TODOS:");
    console.log("\u{1F41B} readFieldValue(contactName):", this.readFieldValue(lead, "contactName"));
    console.log("\u{1F41B} readFieldValue(contactEmail):", this.readFieldValue(lead, "contactEmail"));
    console.log("\u{1F41B} readFieldValue(companyName):", this.readFieldValue(lead, "companyName"));
    const debugInfo = {
      leadId: lead.id,
      fieldsKeys: lead.fields ? Object.keys(lead.fields) : "no fields",
      contactNameResult: this.readFieldValue(lead, "contactName"),
      contactEmailResult: this.readFieldValue(lead, "contactEmail"),
      companyNameResult: this.readFieldValue(lead, "companyName"),
      allFields: lead.fields
    };
    alert("DEBUG INFO (veja console para detalhes):\n" + JSON.stringify(debugInfo, null, 2));
  }
  applyFilters() {
    console.log("=== APLICANDO FILTROS KANBAN-STYLE ===");
    console.log("filterQuery:", this.filterQuery);
    console.log("filterOnlyMine:", this.filterOnlyMine);
    console.log("dynamicFilters:", this.dynamicFilters);
    console.log("Total de registros dispon\xEDveis:", this.records.length);
    this.filteredRecords = this.records.filter((record) => {
      if (this.filterQuery && this.filterQuery.trim()) {
        const searchTerm = this.filterQuery.toLowerCase();
        const searchableFields = [
          this.readFieldValue(record, "contactName"),
          this.readFieldValue(record, "contactEmail"),
          this.readFieldValue(record, "companyName"),
          this.readFieldValue(record, "contactPhone"),
          this.getColumnName(record.columnId)
        ];
        const matches = searchableFields.some((field) => field.toLowerCase().includes(searchTerm));
        if (!matches)
          return false;
      }
      if (this.filterOnlyMine && record.responsibleUserId !== this.currentUser?.uid) {
        return false;
      }
      for (const [fieldName, filterValue] of Object.entries(this.dynamicFilters)) {
        if (filterValue && typeof filterValue === "string" && filterValue.trim()) {
          const recordValue = this.readFieldValue(record, fieldName).toLowerCase();
          const searchValue = filterValue.toLowerCase();
          if (!recordValue.includes(searchValue))
            return false;
        }
      }
      return true;
    });
    console.log("=== RESULTADO DOS FILTROS ===");
    console.log(`${this.records.length} registros total -> ${this.filteredRecords.length} registros filtrados`);
    this.calculateSummaryStats();
    this.calculateSLAIndicators();
    this.calculatePhaseMetrics();
    this.generateChartData();
  }
  exportToExcel() {
    if (this.filteredRecords.length === 0) {
      alert("N\xE3o h\xE1 registros para exportar.");
      return;
    }
    const exportData = this.filteredRecords.map((record) => {
      const data = {};
      data["ID"] = record.id;
      data["Fase"] = this.getColumnName(record.columnId);
      data["Respons\xE1vel"] = record.responsibleUserId || "N\xE3o atribu\xEDdo";
      data["Data de Cria\xE7\xE3o"] = record.createdAt ? new Date(record.createdAt.toDate()).toLocaleDateString("pt-BR") : "";
      if (record.fields) {
        Object.entries(record.fields).forEach(([key, value]) => {
          data[key] = value || "";
        });
      }
      return data;
    });
    if (exportData.length === 0) {
      alert("N\xE3o h\xE1 dados para exportar.");
      return;
    }
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(","),
      ...exportData.map((row) => headers.map((header) => {
        const value = row[header] || "";
        const escapedValue = String(value).replace(/"/g, '""');
        return escapedValue.includes(",") ? `"${escapedValue}"` : escapedValue;
      }).join(","))
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const boardName = this.board?.name || "Board";
    const currentDate = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR").replace(/\//g, "-");
    link.setAttribute("download", `${boardName}_Relat\xF3rio_${currentDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`Exported ${this.filteredRecords.length} records to Excel`);
  }
};
__name(_ReportsComponent, "ReportsComponent");
__publicField(_ReportsComponent, "\u0275fac", /* @__PURE__ */ __name(function ReportsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ReportsComponent)();
}, "ReportsComponent_Factory"));
__publicField(_ReportsComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReportsComponent, selectors: [["app-reports"]], inputs: { boardId: "boardId", ownerId: "ownerId" }, decls: 3, vars: 3, consts: [[4, "ngIf"], ["class", "p-4 md:p-8", 4, "ngIf"], ["class", "min-h-screen bg-gray-50 flex items-center justify-center", 4, "ngIf"], [3, "title"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-6"], [3, "boardId", "ownerId", "columns", "currentUser", "filterQuery", "filterOnlyMine", "dynamicFilters", "showAdvancedFilters", "filterQueryChange", "filterOnlyMineChange", "dynamicFiltersChange", "showAdvancedFiltersChange", "filtersApplied", 4, "ngIf"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200", "mb-6"], [1, "border-b", "border-gray-200"], ["aria-label", "Tabs", 1, "-mb-px", "flex", "space-x-8", "px-6"], ["class", "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300 transition-colors", 3, "border-blue-500", "text-blue-600", "border-transparent", "text-gray-500", "click", 4, "ngFor", "ngForOf"], ["class", "flex items-center justify-center py-12", 4, "ngIf"], [3, "filterQueryChange", "filterOnlyMineChange", "dynamicFiltersChange", "showAdvancedFiltersChange", "filtersApplied", "boardId", "ownerId", "columns", "currentUser", "filterQuery", "filterOnlyMine", "dynamicFilters", "showAdvancedFilters"], [1, "whitespace-nowrap", "py-4", "px-1", "border-b-2", "font-medium", "text-sm", "hover:text-gray-700", "hover:border-gray-300", "transition-colors", 3, "click"], [1, "flex", "items-center", "justify-center", "py-12"], [1, "text-center"], [1, "fas", "fa-spinner", "fa-spin", "text-4xl", "text-blue-500", "mb-4"], [1, "text-gray-600"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-6", "gap-6", "mb-8"], [1, "bg-white", "p-6", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "flex", "items-center"], [1, "flex-shrink-0"], [1, "fas", "fa-users", "text-2xl", "text-blue-500"], [1, "ml-4"], [1, "text-sm", "font-medium", "text-gray-500"], [1, "text-2xl", "font-bold", "text-gray-900"], [1, "fas", "fa-plus-circle", "text-2xl", "text-green-500"], [1, "fas", "fa-check-circle", "text-2xl", "text-purple-500"], [1, "fas", "fa-clock", "text-2xl", "text-orange-500"], [1, "fas", "fa-play-circle", "text-2xl", "text-blue-500"], [1, "fas", "fa-exclamation-triangle", "text-2xl", "text-red-500"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-4"], [1, "fas", "fa-chart-bar", "mr-2", "text-blue-500"], [1, "space-y-4"], ["class", "text-center py-4", 4, "ngIf"], ["class", "space-y-2", 4, "ngFor", "ngForOf"], [1, "space-y-2"], ["class", "relative", 4, "ngFor", "ngForOf"], [1, "text-center", "py-4"], [1, "text-gray-500", "text-sm"], [1, "flex", "items-center", "justify-between"], [1, "w-3", "h-3", "rounded-full", "mr-2"], [1, "text-sm", "font-medium", "text-gray-700"], [1, "text-sm", "font-bold", "text-gray-900"], [1, "w-full", "bg-gray-200", "rounded-full", "h-2"], [1, "h-2", "rounded-full"], [1, "relative"], [1, "flex", "items-center", "justify-between", "p-3", "rounded-lg", "bg-gray-50"], ["class", "flex justify-center py-1", 4, "ngIf"], [1, "flex", "justify-center", "py-1"], [1, "fas", "fa-chevron-down", "text-gray-400"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200", "overflow-hidden"], [1, "px-6", "py-4", "border-b", "border-gray-200"], [1, "text-lg", "font-semibold", "text-gray-900"], [1, "text-sm", "text-gray-600", "mt-1"], [1, "overflow-x-auto"], [1, "min-w-full", "divide-y", "divide-gray-200"], [1, "bg-gray-50"], [1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-gray-500", "uppercase", "tracking-wider"], [1, "px-6", "py-3", "text-center", "text-xs", "font-medium", "text-gray-500", "uppercase", "tracking-wider"], [1, "bg-white", "divide-y", "divide-gray-200"], [4, "ngFor", "ngForOf"], ["class", "px-6 py-8 text-center", 4, "ngIf"], [1, "px-6", "py-4", "whitespace-nowrap"], [1, "w-3", "h-3", "rounded-full", "mr-3"], [1, "text-sm", "font-medium", "text-gray-900"], [1, "px-6", "py-4", "whitespace-nowrap", "text-center", "text-sm", "text-gray-900"], [1, "px-6", "py-4", "whitespace-nowrap", "text-center"], [1, "inline-flex", "items-center", "px-2.5", "py-0.5", "rounded-full", "text-xs", "font-medium", "bg-green-100", "text-green-800"], [1, "inline-flex", "items-center", "px-2.5", "py-0.5", "rounded-full", "text-xs", "font-medium", "bg-red-100", "text-red-800"], [1, "flex", "items-center", "justify-center"], [1, "w-16", "bg-gray-200", "rounded-full", "h-2", "mr-2"], [1, "h-2", "rounded-full", "transition-all", "duration-300"], [1, "px-6", "py-8", "text-center"], [1, "fas", "fa-clock", "text-4xl", "text-gray-300", "mb-4"], [1, "text-gray-500"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "xl:grid-cols-3", "gap-6"], ["class", "bg-white p-6 rounded-lg shadow-sm border border-gray-200", 4, "ngFor", "ngForOf"], [1, "flex", "items-center", "justify-between", "mb-4"], [1, "w-4", "h-4", "rounded-full"], [1, "flex", "justify-between", "items-center"], [1, "text-sm", "text-gray-600"], [1, "text-lg", "font-bold", "text-gray-900"], [1, "px-6", "py-4", "border-b", "border-gray-200", "flex", "justify-between", "items-center"], [1, "flex", "items-center", "gap-3"], [1, "inline-flex", "items-center", "px-3", "py-2", "border", "border-gray-300", "shadow-sm", "text-sm", "leading-4", "font-medium", "rounded-md", "text-gray-700", "bg-white", "hover:bg-gray-50", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-blue-500", 3, "click"], [1, "fas", "fa-columns", "mr-2"], [1, "fas", "fa-chevron-down", "ml-2"], ["class", "absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10", 4, "ngIf"], ["class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap", 4, "ngFor", "ngForOf"], [3, "bg-gray-50", 4, "ngFor", "ngForOf"], [1, "absolute", "right-0", "mt-2", "w-72", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow-lg", "z-10"], [1, "px-4", "py-3", "border-b", "border-gray-200"], [1, "text-sm", "font-semibold", "text-gray-900"], [1, "text-xs", "text-gray-600", "mt-1"], [1, "max-h-80", "overflow-y-auto"], [1, "px-4", "py-2"], [1, "text-xs", "font-medium", "text-gray-500", "uppercase", "tracking-wide", "mb-2"], ["class", "flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded", 4, "ngFor", "ngForOf"], ["class", "px-4 py-2 border-t border-gray-100", 4, "ngIf"], [1, "px-4", "py-3", "border-t", "border-gray-200", "bg-gray-50"], [1, "w-full", "px-3", "py-2", "text-sm", "bg-blue-600", "text-white", "rounded-md", "hover:bg-blue-700", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", 3, "click"], [1, "flex", "items-center", "cursor-pointer", "hover:bg-gray-50", "px-2", "py-1", "rounded"], ["type", "checkbox", 1, "h-4", "w-4", "text-blue-600", "focus:ring-blue-500", "border-gray-300", "rounded", 3, "change", "checked"], [1, "ml-3", "text-sm", "text-gray-700"], [1, "px-4", "py-2", "border-t", "border-gray-100"], [1, "ml-auto", "text-xs", "text-gray-400"], [1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-gray-500", "uppercase", "tracking-wider", "whitespace-nowrap"], ["class", "px-6 py-4 whitespace-nowrap", 4, "ngFor", "ngForOf"], ["class", "flex items-center", 4, "ngIf"], ["class", "text-sm text-gray-900", 4, "ngIf"], [1, "text-sm", "text-gray-900"], [1, "inline-flex", "items-center", "px-2.5", "py-0.5", "rounded-full", "text-xs", "font-medium"], [1, "fas", "fa-search", "text-4xl", "text-gray-300", "mb-4"], [1, "p-4", "md:p-8"], [1, "max-w-7xl", "mx-auto"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "flex", "space-x-8", "px-6"], ["class", "py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200", 3, "border-blue-500", "text-blue-600", "border-transparent", "text-gray-500", "hover:text-gray-700", "click", 4, "ngFor", "ngForOf"], [1, "p-6"], [1, "py-4", "px-1", "border-b-2", "font-medium", "text-sm", "transition-colors", "duration-200", 3, "click"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6", "mb-8"], [1, "bg-gradient-to-r", "from-blue-500", "to-blue-600", "rounded-lg", "shadow", "p-6", "text-white"], [1, "text-blue-100"], [1, "text-3xl", "font-bold"], [1, "bg-blue-400", "bg-opacity-30", "p-3", "rounded-full"], [1, "fas", "fa-users", "text-2xl"], [1, "bg-gradient-to-r", "from-green-500", "to-green-600", "rounded-lg", "shadow", "p-6", "text-white"], [1, "text-green-100"], [1, "bg-green-400", "bg-opacity-30", "p-3", "rounded-full"], [1, "fas", "fa-check-circle", "text-2xl"], [1, "bg-gradient-to-r", "from-yellow-500", "to-yellow-600", "rounded-lg", "shadow", "p-6", "text-white"], [1, "text-yellow-100"], [1, "bg-yellow-400", "bg-opacity-30", "p-3", "rounded-full"], [1, "fas", "fa-clock", "text-2xl"], [1, "bg-white"], [1, "px-2", "inline-flex", "text-xs", "leading-5", "font-semibold", "rounded-full"], [1, "px-6", "py-4", "whitespace-nowrap", "text-center", "text-sm", "text-green-600", "font-medium"], [1, "px-6", "py-4", "whitespace-nowrap", "text-center", "text-sm", "text-red-600", "font-medium"], [1, "space-y-6"], ["class", "bg-white rounded-lg border border-gray-200 p-6", 4, "ngFor", "ngForOf"], [1, "bg-white", "rounded-lg", "border", "border-gray-200", "p-6"], [1, "w-4", "h-4", "rounded-full", "mr-3"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "bg-gray-50", "rounded-lg", "p-4"], [1, "text-xl", "font-semibold", "text-gray-900"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "flex", "items-center", "gap-2"], [1, "inline-flex", "items-center", "px-3", "py-2", "border", "border-gray-300", "shadow-sm", "text-sm", "leading-4", "font-medium", "rounded-md", "text-gray-700", "bg-white", "hover:bg-gray-50", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-green-500", 3, "click"], [1, "fas", "fa-file-excel", "mr-2", "text-green-600"], [1, "min-h-screen", "bg-gray-50", "flex", "items-center", "justify-center"], [1, "max-w-md", "w-full", "mx-auto"], [1, "bg-white", "rounded-lg", "shadow-lg", "p-8"], [1, "text-center", "mb-6"], [1, "w-16", "h-16", "mx-auto", "bg-blue-100", "rounded-full", "flex", "items-center", "justify-center", "mb-4"], [1, "fas", "fa-chart-bar", "text-2xl", "text-blue-500"], [1, "text-2xl", "font-bold", "text-gray-900", "mb-2"], [1, "space-y-3"], ["class", "p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors", 3, "click", 4, "ngFor", "ngForOf"], ["class", "text-center py-8", 4, "ngIf"], [1, "p-4", "border", "border-gray-200", "rounded-lg", "hover:border-blue-300", "hover:bg-blue-50", "cursor-pointer", "transition-colors", 3, "click"], [1, "font-medium", "text-gray-900"], ["class", "text-sm text-gray-600", 4, "ngIf"], [1, "fas", "fa-chevron-right", "text-gray-400"], [1, "text-center", "py-8"], [1, "mt-4", "bg-blue-500", "hover:bg-blue-600", "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "click"]], template: /* @__PURE__ */ __name(function ReportsComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ReportsComponent_app_main_layout_0_Template, 10, 14, "app-main-layout", 0)(1, ReportsComponent_div_1_Template, 16, 7, "div", 1)(2, ReportsComponent_div_2_Template, 13, 2, "div", 2);
  }
  if (rf & 2) {
    \u0275\u0275property("ngIf", ctx.boardId && ctx.isStandaloneView());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.boardId && !ctx.isStandaloneView());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.boardId);
  }
}, "ReportsComponent_Template"), dependencies: [CommonModule, NgForOf, NgIf, FormsModule, MainLayoutComponent, CompanyBreadcrumbComponent, AdvancedFiltersComponent, SlicePipe], styles: ['\n\n.line-clamp-2[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.chart-container[_ngcontent-%COMP%] {\n  position: relative;\n  height: 300px;\n}\n.chart-container[_ngcontent-%COMP%]   .chart-bar[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.chart-container[_ngcontent-%COMP%]   .chart-bar[_ngcontent-%COMP%]:hover {\n  opacity: 0.8;\n}\n.sla-indicator[_ngcontent-%COMP%]   .compliance-bar[_ngcontent-%COMP%] {\n  transition: width 0.5s ease-in-out;\n}\n.sla-indicator.high-compliance[_ngcontent-%COMP%]   .compliance-bar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      to right,\n      #10B981,\n      #059669);\n}\n.sla-indicator.medium-compliance[_ngcontent-%COMP%]   .compliance-bar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      to right,\n      #F59E0B,\n      #D97706);\n}\n.sla-indicator.low-compliance[_ngcontent-%COMP%]   .compliance-bar[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      to right,\n      #EF4444,\n      #DC2626);\n}\n.metric-card[_ngcontent-%COMP%] {\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n.metric-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);\n}\n.table-container[_ngcontent-%COMP%]   .table-row[_ngcontent-%COMP%] {\n  transition: background-color 0.2s ease;\n}\n.table-container[_ngcontent-%COMP%]   .table-row[_ngcontent-%COMP%]:hover {\n  background-color: rgba(59, 130, 246, 0.05);\n}\n.status-badge.status-active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #3B82F6,\n      #1D4ED8);\n}\n.status-badge.status-concluded[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #10B981,\n      #059669);\n}\n.status-badge.status-overdue[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #EF4444,\n      #DC2626);\n}\n.filters-section[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #F8FAFC,\n      #F1F5F9);\n  border-left: 4px solid #3B82F6;\n}\n.tab-nav[_ngcontent-%COMP%]   .tab-button[_ngcontent-%COMP%] {\n  position: relative;\n  transition: all 0.2s ease;\n}\n.tab-nav[_ngcontent-%COMP%]   .tab-button[_ngcontent-%COMP%]:hover {\n  color: #3B82F6;\n}\n.tab-nav[_ngcontent-%COMP%]   .tab-button.active[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: -1px;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background:\n    linear-gradient(\n      to right,\n      #3B82F6,\n      #1D4ED8);\n  border-radius: 1px;\n}\n.loading-spinner[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n.summary-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #FFFFFF,\n      #F8FAFC);\n  border-left: 4px solid transparent;\n  transition: all 0.2s ease;\n}\n.summary-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.summary-card.card-primary[_ngcontent-%COMP%] {\n  border-left-color: #3B82F6;\n}\n.summary-card.card-success[_ngcontent-%COMP%] {\n  border-left-color: #10B981;\n}\n.summary-card.card-warning[_ngcontent-%COMP%] {\n  border-left-color: #F59E0B;\n}\n.summary-card.card-danger[_ngcontent-%COMP%] {\n  border-left-color: #EF4444;\n}\n.chart-legend[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-bottom: 0.5rem;\n}\n.chart-legend[_ngcontent-%COMP%]   .legend-item[_ngcontent-%COMP%]   .legend-color[_ngcontent-%COMP%] {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  margin-right: 0.5rem;\n}\n@media (max-width: 768px) {\n  .filters-section[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .summary-cards[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .tab-nav[_ngcontent-%COMP%] {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media (max-width: 640px) {\n  .summary-cards[_ngcontent-%COMP%]   .grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n@media print {\n  .no-print[_ngcontent-%COMP%] {\n    display: none !important;\n  }\n  .page-break[_ngcontent-%COMP%] {\n    page-break-before: always;\n  }\n  .chart-container[_ngcontent-%COMP%] {\n    -webkit-print-color-adjust: exact;\n    color-adjust: exact;\n  }\n}\n/*# sourceMappingURL=reports.component.css.map */'] }));
var ReportsComponent = _ReportsComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReportsComponent, [{
    type: Component,
    args: [{ selector: "app-reports", standalone: true, imports: [CommonModule, FormsModule, MainLayoutComponent, CompanyBreadcrumbComponent, AdvancedFiltersComponent], template: `<!-- Standalone Reports (accessed via URL) -->
<app-main-layout *ngIf="boardId && isStandaloneView()">
  <!-- Breadcrumb -->
  <app-company-breadcrumb [title]="'Relat\xF3rios - ' + (board?.name || 'Quadro')">
  </app-company-breadcrumb>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    
    <!-- Reusable Advanced Filters Component -->
    <app-advanced-filters 
      *ngIf="!isLoading && boardId && ownerId && columns.length > 0"
      [boardId]="boardId"
      [ownerId]="ownerId" 
      [columns]="columns"
      [currentUser]="currentUser"
      [(filterQuery)]="filterQuery"
      [(filterOnlyMine)]="filterOnlyMine"
      [(dynamicFilters)]="dynamicFilters"
      [(showAdvancedFilters)]="showAdvancedFilters"
      (filtersApplied)="applyFilters()">
    </app-advanced-filters>

    <!-- Navigation Tabs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            *ngFor="let tab of [
              { key: 'overview', label: 'Vis\xE3o Geral', icon: 'fas fa-chart-pie' },
              { key: 'sla', label: 'Indicadores SLA', icon: 'fas fa-clock' },
              { key: 'phases', label: 'M\xE9tricas por Fase', icon: 'fas fa-columns' },
              { key: 'registros', label: 'Lista de Registros', icon: 'fas fa-list' }
            ]"
            (click)="setView($any(tab.key))"
            [class.border-blue-500]="currentView === tab.key"
            [class.text-blue-600]="currentView === tab.key"
            [class.border-transparent]="currentView !== tab.key"
            [class.text-gray-500]="currentView !== tab.key"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300 transition-colors">
            <i [class]="tab.icon + ' mr-2'"></i>
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="isLoading || isGeneratingReport" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
        <p class="text-gray-600">{{ isLoading ? 'Carregando dados...' : 'Gerando relat\xF3rio...' }}</p>
      </div>
    </div>

    <!-- Content based on current view -->
    <div *ngIf="!isLoading && !isGeneratingReport">

      <!-- Overview Tab -->
      <div *ngIf="currentView === 'overview'">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-users text-2xl text-blue-500"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total de Registros</p>
                <p class="text-2xl font-bold text-gray-900">{{ summaryStats.totalRecords }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-plus-circle text-2xl text-green-500"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Novos no Per\xEDodo</p>
                <p class="text-2xl font-bold text-gray-900">{{ summaryStats.newRecordsThisPeriod }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-check-circle text-2xl text-purple-500"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Conclu\xEDdos</p>
                <p class="text-2xl font-bold text-gray-900">{{ summaryStats.concludedRecords }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-clock text-2xl text-orange-500"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Tempo M\xE9dio</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatDuration(summaryStats.avgConversionTime) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-play-circle text-2xl text-blue-500"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Ativos</p>
                <p class="text-2xl font-bold text-gray-900">{{ summaryStats.activeRecords }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Em Atraso</p>
                <p class="text-2xl font-bold text-gray-900">{{ summaryStats.overdueRecords }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Phase Distribution Chart -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-chart-bar mr-2 text-blue-500"></i>
              Registros por Fase
            </h3>
            <div class="space-y-4">
              <!-- Debug Info -->
              <div *ngIf="chartData.phaseDistribution.length === 0" class="text-center py-4">
                <p class="text-gray-500 text-sm">
                  \u{1F50D} Debug: Nenhum dado de fase encontrado
                  <br>Fases: {{ columns.length }} | Registros: {{ filteredRecords.length }}
                </p>
              </div>
              
              <div *ngFor="let item of chartData.phaseDistribution" class="space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full mr-2" [style.background-color]="item.color"></div>
                    <span class="text-sm font-medium text-gray-700">{{ item.name }}</span>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ item.value }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="h-2 rounded-full" 
                       [style.background-color]="item.color"
                       [style.width.%]="getPhasePercentage(item.value)">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversion Funnel -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Funil de Convers\xE3o</h3>
            <div class="space-y-2">
              <div *ngFor="let item of chartData.conversionFunnel; let i = index" 
                   class="relative">
                <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span class="text-sm font-medium text-gray-700">{{ item.phase }}</span>
                  <span class="text-sm font-bold text-gray-900">{{ item.registros }}</span>
                </div>
                <div *ngIf="i < chartData.conversionFunnel.length - 1" 
                     class="flex justify-center py-1">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SLA Indicators Tab -->
      <div *ngIf="currentView === 'sla'">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Indicadores de SLA por Fase</h3>
            <p class="text-sm text-gray-600 mt-1">An\xE1lise de cumprimento de prazos definidos para cada fase</p>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fase</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SLA (dias)</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No Prazo</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Em Atraso</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">% Cumprimento</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let indicator of slaIndicators">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full mr-3" [style.background-color]="indicator.phaseColor"></div>
                      <span class="text-sm font-medium text-gray-900">{{ indicator.phaseName }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {{ indicator.slaDays }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {{ indicator.totalRecords }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {{ indicator.onTime }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {{ indicator.overdue }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          class="h-2 rounded-full transition-all duration-300"
                          [class.bg-green-500]="indicator.compliance >= 80"
                          [class.bg-yellow-500]="indicator.compliance >= 60 && indicator.compliance < 80"
                          [class.bg-red-500]="indicator.compliance < 60"
                          [style.width.%]="indicator.compliance">
                        </div>
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ indicator.compliance }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div *ngIf="slaIndicators.length === 0" class="px-6 py-8 text-center">
            <i class="fas fa-clock text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500">Nenhuma fase possui SLA configurado</p>
          </div>
        </div>
      </div>

      <!-- Phase Metrics Tab -->
      <div *ngIf="currentView === 'phases'">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div *ngFor="let metric of phaseMetrics" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ metric.phaseName }}</h3>
              <div class="w-4 h-4 rounded-full" [style.background-color]="metric.phaseColor"></div>
            </div>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Registros</span>
                <span class="text-lg font-bold text-gray-900">{{ metric.recordsCount }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Tempo M\xE9dio</span>
                <span class="text-lg font-bold text-gray-900">{{ formatDuration(metric.avgTimeInPhase) }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Taxa de Convers\xE3o</span>
                <span class="text-lg font-bold text-gray-900">{{ metric.conversionRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Registros List Tab -->
      <div *ngIf="currentView === 'registros'">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Lista Detalhada de Registros</h3>
                <p class="text-sm text-gray-600 mt-1">{{ filteredRecords.length }} registros encontrados</p>
              </div>
            </div>
            
            <!-- Column selector button -->
            <div class="relative">
              <button
                (click)="toggleColumnSelector()"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <i class="fas fa-columns mr-2"></i>
                Colunas ({{ selectedColumns.length }})
                <i class="fas fa-chevron-down ml-2"></i>
              </button>

              <!-- Column selector dropdown -->
              <div *ngIf="showColumnSelector" class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div class="px-4 py-3 border-b border-gray-200">
                  <h4 class="text-sm font-semibold text-gray-900">Selecionar Colunas</h4>
                  <p class="text-xs text-gray-600 mt-1">Escolha as colunas que deseja exibir na tabela</p>
                </div>
                
                <div class="max-h-80 overflow-y-auto">
                  <!-- System columns -->
                  <div class="px-4 py-2">
                    <h5 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Colunas do Sistema</h5>
                    <div class="space-y-2">
                      <label *ngFor="let column of getSystemColumns()" 
                             class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                        <input 
                          type="checkbox" 
                          [checked]="isColumnSelected(column.key)"
                          (change)="toggleColumn(column.key)"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <span class="ml-3 text-sm text-gray-700">{{ column.label }}</span>
                      </label>
                    </div>
                  </div>
                  
                  <!-- Form fields -->
                  <div *ngIf="hasFormColumns()" class="px-4 py-2 border-t border-gray-100">
                    <h5 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Campos do Formul\xE1rio</h5>
                    <div class="space-y-2">
                      <label *ngFor="let column of getFormColumns()" 
                             class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                        <input 
                          type="checkbox" 
                          [checked]="isColumnSelected(column.key)"
                          (change)="toggleColumn(column.key)"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <span class="ml-3 text-sm text-gray-700">{{ column.label }}</span>
                        <span class="ml-auto text-xs text-gray-400">{{ column.fieldType }}</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <button
                    (click)="toggleColumnSelector()"
                    class="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th *ngFor="let column of getSelectedColumns()" 
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {{ column.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let lead of filteredRecords; let i = index" [class.bg-gray-50]="i % 2 === 1">
                  <td *ngFor="let column of getSelectedColumns()" class="px-6 py-4 whitespace-nowrap">
                    <div *ngIf="column.key === 'currentPhase'" class="flex items-center">
                      <div class="w-3 h-3 rounded-full mr-2" [style.background-color]="getColumnColor(lead.columnId)"></div>
                      <span class="text-sm text-gray-900">{{ getColumnValue(lead, column) }}</span>
                    </div>
                    <div *ngIf="column.key === 'status'">
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class.bg-green-100]="isLeadConcluded(lead)"
                        [class.text-green-800]="isLeadConcluded(lead)"
                        [class.bg-red-100]="isLeadOverdue(lead) && !isLeadConcluded(lead)"
                        [class.text-red-800]="isLeadOverdue(lead) && !isLeadConcluded(lead)"
                        [class.bg-blue-100]="!isLeadConcluded(lead) && !isLeadOverdue(lead)"
                        [class.text-blue-800]="!isLeadConcluded(lead) && !isLeadOverdue(lead)">
                        {{ getColumnValue(lead, column) }}
                      </span>
                    </div>
                    <div *ngIf="column.key !== 'currentPhase' && column.key !== 'status'" class="text-sm text-gray-900">
                      {{ getColumnValue(lead, column) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div *ngIf="filteredRecords.length === 0" class="px-6 py-8 text-center">
            <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500">Nenhum registro encontrado com os filtros aplicados</p>
          </div>
        </div>
      </div>


    </div>
  </div>
</app-main-layout>

<!-- Inline Reports (used within kanban) -->
<div *ngIf="boardId && !isStandaloneView()" class="p-4 md:p-8">
  <div class="max-w-7xl mx-auto">
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        <i class="fas fa-chart-bar mr-2 text-blue-500"></i>
        Relat\xF3rios - {{ board?.name }}
      </h2>
    </div>
    
    <!-- Reusable Advanced Filters Component -->
    <app-advanced-filters 
      *ngIf="!isLoading && boardId && ownerId && columns.length > 0"
      [boardId]="boardId"
      [ownerId]="ownerId" 
      [columns]="columns"
      [currentUser]="currentUser"
      [(filterQuery)]="filterQuery"
      [(filterOnlyMine)]="filterOnlyMine"
      [(dynamicFilters)]="dynamicFilters"
      [(showAdvancedFilters)]="showAdvancedFilters"
      (filtersApplied)="applyFilters()">
    </app-advanced-filters>

    <!-- Tab Navigation for Views -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button
            *ngFor="let tab of viewTabs"
            (click)="setView($any(tab.key))"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
            [class.border-blue-500]="currentView === tab.key"
            [class.text-blue-600]="currentView === tab.key"
            [class.border-transparent]="currentView !== tab.key"
            [class.text-gray-500]="currentView !== tab.key"
            [class.hover:text-gray-700]="currentView !== tab.key">
            <i class="fas {{ tab.icon }} mr-2"></i>
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Report Content -->
      <div class="p-6">
        
        <!-- Overview Tab -->
        <div *ngIf="currentView === 'overview'">
          <!-- Summary Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100">Total de Registros</p>
                  <p class="text-3xl font-bold">{{ summaryStats.totalRecords }}</p>
                </div>
                <div class="bg-blue-400 bg-opacity-30 p-3 rounded-full">
                  <i class="fas fa-users text-2xl"></i>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100">Registros Conclu\xEDdos</p>
                  <p class="text-3xl font-bold">{{ summaryStats.concludedRecords }}</p>
                </div>
                <div class="bg-green-400 bg-opacity-30 p-3 rounded-full">
                  <i class="fas fa-check-circle text-2xl"></i>
                </div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-yellow-100">Registros Atrasados</p>
                  <p class="text-3xl font-bold">{{ summaryStats.overdueRecords }}</p>
                </div>
                <div class="bg-yellow-400 bg-opacity-30 p-3 rounded-full">
                  <i class="fas fa-clock text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SLA Indicators Tab -->
        <div *ngIf="currentView === 'sla'">
          <div class="bg-white">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Indicadores de SLA por Fase</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fase</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SLA (dias)</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">% Cumprimento</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No Prazo</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Atrasados</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let indicator of slaIndicators">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full mr-3" [style.background-color]="indicator.phaseColor"></div>
                        <span class="text-sm font-medium text-gray-900">{{ indicator.phaseName }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {{ indicator.slaDays }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            [class.bg-green-100]="indicator.compliance >= 80"
                            [class.text-green-800]="indicator.compliance >= 80"
                            [class.bg-yellow-100]="indicator.compliance >= 60 && indicator.compliance < 80"
                            [class.text-yellow-800]="indicator.compliance >= 60 && indicator.compliance < 80"
                            [class.bg-red-100]="indicator.compliance < 60"
                            [class.text-red-800]="indicator.compliance < 60">
                        {{ indicator.compliance }}%
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">
                      {{ indicator.onTime }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">
                      {{ indicator.overdue }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Phase Metrics Tab -->
        <div *ngIf="currentView === 'phases'">
          <div class="space-y-6">
            <div *ngFor="let metric of phaseMetrics" class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded-full mr-3" [style.background-color]="metric.phaseColor"></div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ metric.phaseName }}</h3>
                </div>
                <span class="text-2xl font-bold text-gray-900">{{ metric.recordsCount }} registros</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Tempo M\xE9dio na Fase</p>
                  <p class="text-xl font-semibold text-gray-900">{{ formatDuration(metric.avgTimeInPhase) }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Taxa de Convers\xE3o</p>
                  <p class="text-xl font-semibold text-gray-900">{{ metric.conversionRate }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Registros List Tab -->
        <div *ngIf="currentView === 'registros'">
          <div class="bg-white">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-900">Lista de Registros ({{ filteredRecords.length }})</h3>
              </div>
              
              <!-- Action buttons -->
              <div class="flex items-center gap-2">
                <!-- Export to Excel button -->
                <button
                  (click)="exportToExcel()"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <i class="fas fa-file-excel mr-2 text-green-600"></i>
                  Exportar Excel
                </button>
                
                <!-- Column selector button -->
                <div class="relative">
                  <button
                    (click)="toggleColumnSelector()"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <i class="fas fa-columns mr-2"></i>
                  Colunas ({{ selectedColumns.length }})
                  <i class="fas fa-chevron-down ml-2"></i>
                </button>

                <!-- Column selector dropdown (shared with standalone version) -->
                <div *ngIf="showColumnSelector" class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div class="px-4 py-3 border-b border-gray-200">
                    <h4 class="text-sm font-semibold text-gray-900">Selecionar Colunas</h4>
                    <p class="text-xs text-gray-600 mt-1">Escolha as colunas que deseja exibir na tabela</p>
                  </div>
                  
                  <div class="max-h-80 overflow-y-auto">
                    <!-- System columns -->
                    <div class="px-4 py-2">
                      <h5 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Colunas do Sistema</h5>
                      <div class="space-y-2">
                        <label *ngFor="let column of getSystemColumns()" 
                               class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                          <input 
                            type="checkbox" 
                            [checked]="isColumnSelected(column.key)"
                            (change)="toggleColumn(column.key)"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                          <span class="ml-3 text-sm text-gray-700">{{ column.label }}</span>
                        </label>
                      </div>
                    </div>
                    
                    <!-- Form fields -->
                    <div *ngIf="hasFormColumns()" class="px-4 py-2 border-t border-gray-100">
                      <h5 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Campos do Formul\xE1rio</h5>
                      <div class="space-y-2">
                        <label *ngFor="let column of getFormColumns()" 
                               class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                          <input 
                            type="checkbox" 
                            [checked]="isColumnSelected(column.key)"
                            (change)="toggleColumn(column.key)"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                          <span class="ml-3 text-sm text-gray-700">{{ column.label }}</span>
                          <span class="ml-auto text-xs text-gray-400">{{ column.fieldType }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <button
                      (click)="toggleColumnSelector()"
                      class="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Aplicar
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th *ngFor="let column of getSelectedColumns()" 
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {{ column.label }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let lead of filteredRecords | slice:0:50">
                    <td *ngFor="let column of getSelectedColumns()" class="px-6 py-4 whitespace-nowrap">
                      <div *ngIf="column.key === 'currentPhase'" class="flex items-center">
                        <div class="w-3 h-3 rounded-full mr-2" [style.background-color]="getColumnColor(lead.columnId)"></div>
                        <span class="text-sm text-gray-900">{{ getColumnValue(lead, column) }}</span>
                      </div>
                      <div *ngIf="column.key === 'status'">
                        <span 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [class.bg-green-100]="isLeadConcluded(lead)"
                          [class.text-green-800]="isLeadConcluded(lead)"
                          [class.bg-red-100]="isLeadOverdue(lead) && !isLeadConcluded(lead)"
                          [class.text-red-800]="isLeadOverdue(lead) && !isLeadConcluded(lead)"
                          [class.bg-blue-100]="!isLeadConcluded(lead) && !isLeadOverdue(lead)"
                          [class.text-blue-800]="!isLeadConcluded(lead) && !isLeadOverdue(lead)">
                          {{ getColumnValue(lead, column) }}
                        </span>
                      </div>
                      <div *ngIf="column.key !== 'currentPhase' && column.key !== 'status'" class="text-sm text-gray-900">
                        {{ getColumnValue(lead, column) }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>
    </div>
    
  </div>
</div>

<!-- Board Selection Interface -->
<div *ngIf="!boardId" class="min-h-screen bg-gray-50 flex items-center justify-center">
  <div class="max-w-md w-full mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <i class="fas fa-chart-bar text-2xl text-blue-500"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Relat\xF3rios</h2>
        <p class="text-gray-600">Selecione um quadro para visualizar seus relat\xF3rios</p>
      </div>

      <div class="space-y-3">
        <div *ngFor="let availableBoard of availableBoards" 
             (click)="selectBoard(availableBoard.id!)" 
             class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">{{ availableBoard.name }}</h3>
              <p class="text-sm text-gray-600" *ngIf="availableBoard.description">{{ availableBoard.description }}</p>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
          </div>
        </div>
        
        <div *ngIf="availableBoards.length === 0" class="text-center py-8">
          <p class="text-gray-500">Nenhum quadro encontrado</p>
          <button 
            (click)="goBack()"
            class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`, styles: ['/* src/app/components/reports/reports.component.scss */\n.line-clamp-2 {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.chart-container {\n  position: relative;\n  height: 300px;\n}\n.chart-container .chart-bar {\n  transition: all 0.3s ease;\n}\n.chart-container .chart-bar:hover {\n  opacity: 0.8;\n}\n.sla-indicator .compliance-bar {\n  transition: width 0.5s ease-in-out;\n}\n.sla-indicator.high-compliance .compliance-bar {\n  background:\n    linear-gradient(\n      to right,\n      #10B981,\n      #059669);\n}\n.sla-indicator.medium-compliance .compliance-bar {\n  background:\n    linear-gradient(\n      to right,\n      #F59E0B,\n      #D97706);\n}\n.sla-indicator.low-compliance .compliance-bar {\n  background:\n    linear-gradient(\n      to right,\n      #EF4444,\n      #DC2626);\n}\n.metric-card {\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n.metric-card:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);\n}\n.table-container .table-row {\n  transition: background-color 0.2s ease;\n}\n.table-container .table-row:hover {\n  background-color: rgba(59, 130, 246, 0.05);\n}\n.status-badge.status-active {\n  background:\n    linear-gradient(\n      135deg,\n      #3B82F6,\n      #1D4ED8);\n}\n.status-badge.status-concluded {\n  background:\n    linear-gradient(\n      135deg,\n      #10B981,\n      #059669);\n}\n.status-badge.status-overdue {\n  background:\n    linear-gradient(\n      135deg,\n      #EF4444,\n      #DC2626);\n}\n.filters-section {\n  background:\n    linear-gradient(\n      135deg,\n      #F8FAFC,\n      #F1F5F9);\n  border-left: 4px solid #3B82F6;\n}\n.tab-nav .tab-button {\n  position: relative;\n  transition: all 0.2s ease;\n}\n.tab-nav .tab-button:hover {\n  color: #3B82F6;\n}\n.tab-nav .tab-button.active::after {\n  content: "";\n  position: absolute;\n  bottom: -1px;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background:\n    linear-gradient(\n      to right,\n      #3B82F6,\n      #1D4ED8);\n  border-radius: 1px;\n}\n.loading-spinner {\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n.summary-card {\n  background:\n    linear-gradient(\n      135deg,\n      #FFFFFF,\n      #F8FAFC);\n  border-left: 4px solid transparent;\n  transition: all 0.2s ease;\n}\n.summary-card:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.summary-card.card-primary {\n  border-left-color: #3B82F6;\n}\n.summary-card.card-success {\n  border-left-color: #10B981;\n}\n.summary-card.card-warning {\n  border-left-color: #F59E0B;\n}\n.summary-card.card-danger {\n  border-left-color: #EF4444;\n}\n.chart-legend .legend-item {\n  display: flex;\n  align-items: center;\n  margin-bottom: 0.5rem;\n}\n.chart-legend .legend-item .legend-color {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  margin-right: 0.5rem;\n}\n@media (max-width: 768px) {\n  .filters-section .grid {\n    grid-template-columns: 1fr;\n  }\n  .summary-cards .grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .tab-nav {\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media (max-width: 640px) {\n  .summary-cards .grid {\n    grid-template-columns: 1fr;\n  }\n}\n@media print {\n  .no-print {\n    display: none !important;\n  }\n  .page-break {\n    page-break-before: always;\n  }\n  .chart-container {\n    -webkit-print-color-adjust: exact;\n    color-adjust: exact;\n  }\n}\n/*# sourceMappingURL=reports.component.css.map */\n'] }]
  }], null, { boardId: [{
    type: Input
  }], ownerId: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReportsComponent, { className: "ReportsComponent", filePath: "src/app/components/reports/reports.component.ts", lineNumber: 39 });
})();

export {
  ReportsComponent
};
//# sourceMappingURL=chunk-V3KCIW52.js.map
