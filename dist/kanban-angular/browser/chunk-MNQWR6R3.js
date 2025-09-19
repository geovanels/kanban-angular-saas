import {
  ToastService
} from "./chunk-RDMWVNUM.js";
import {
  ActivatedRoute,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NumberValueAccessor,
  RadioControlValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-2S4XXET5.js";
import "./chunk-L3ANR23A.js";
import {
  CompanyService,
  FirestoreService,
  SubdomainService
} from "./chunk-NDNGZ4HQ.js";
import {
  CommonModule,
  Component,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  __async,
  __name,
  __publicField,
  __spreadProps,
  __spreadValues,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-GMR7JISZ.js";

// src/app/components/public-form/public-form.component.ts
var _c0 = /* @__PURE__ */ __name(() => [], "_c0");
var _c1 = /* @__PURE__ */ __name(() => ["Quente", "Morno", "Frio"], "_c1");
function PublicFormComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "img", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r0.companyLogo, \u0275\u0275sanitizeUrl);
  }
}
__name(PublicFormComponent_div_2_Template, "PublicFormComponent_div_2_Template");
function PublicFormComponent_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.companyName());
  }
}
__name(PublicFormComponent_span_7_Template, "PublicFormComponent_span_7_Template");
function PublicFormComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275text(1, "Carregando...");
    \u0275\u0275elementEnd();
  }
}
__name(PublicFormComponent_div_9_Template, "PublicFormComponent_div_9_Template");
function PublicFormComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275text(1, "Nenhum campo configurado para esta fase.");
    \u0275\u0275elementEnd();
  }
}
__name(PublicFormComponent_div_10_Template, "PublicFormComponent_div_10_Template");
function PublicFormComponent_form_11_div_1_input_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 31);
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("formControlName", f_r3.name);
  }
}
__name(PublicFormComponent_form_11_div_1_input_4_Template, "PublicFormComponent_form_11_div_1_input_4_Template");
function PublicFormComponent_form_11_div_1_input_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 32);
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("formControlName", f_r3.name);
  }
}
__name(PublicFormComponent_form_11_div_1_input_5_Template, "PublicFormComponent_form_11_div_1_input_5_Template");
function PublicFormComponent_form_11_div_1_input_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 33);
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("formControlName", f_r3.name);
  }
}
__name(PublicFormComponent_form_11_div_1_input_6_Template, "PublicFormComponent_form_11_div_1_input_6_Template");
function PublicFormComponent_form_11_div_1_input_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 34);
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("formControlName", f_r3.name);
  }
}
__name(PublicFormComponent_form_11_div_1_input_7_Template, "PublicFormComponent_form_11_div_1_input_7_Template");
function PublicFormComponent_form_11_div_1_textarea_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "textarea", 35);
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("formControlName", f_r3.name);
  }
}
__name(PublicFormComponent_form_11_div_1_textarea_8_Template, "PublicFormComponent_form_11_div_1_textarea_8_Template");
function PublicFormComponent_form_11_div_1_select_9_ng_container_3_option_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r4 = ctx.$implicit;
    \u0275\u0275property("value", opt_r4.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opt_r4.label);
  }
}
__name(PublicFormComponent_form_11_div_1_select_9_ng_container_3_option_1_Template, "PublicFormComponent_form_11_div_1_select_9_ng_container_3_option_1_Template");
function PublicFormComponent_form_11_div_1_select_9_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, PublicFormComponent_form_11_div_1_select_9_ng_container_3_option_1_Template, 2, 2, "option", 39);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", f_r3.options);
  }
}
__name(PublicFormComponent_form_11_div_1_select_9_ng_container_3_Template, "PublicFormComponent_form_11_div_1_select_9_ng_container_3_Template");
function PublicFormComponent_form_11_div_1_select_9_ng_template_4_option_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r5 = ctx.$implicit;
    \u0275\u0275property("value", opt_r5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opt_r5);
  }
}
__name(PublicFormComponent_form_11_div_1_select_9_ng_template_4_option_0_Template, "PublicFormComponent_form_11_div_1_select_9_ng_template_4_option_0_Template");
function PublicFormComponent_form_11_div_1_select_9_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PublicFormComponent_form_11_div_1_select_9_ng_template_4_option_0_Template, 2, 2, "option", 39);
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("ngForOf", f_r3.options || \u0275\u0275pureFunction0(1, _c0));
  }
}
__name(PublicFormComponent_form_11_div_1_select_9_ng_template_4_Template, "PublicFormComponent_form_11_div_1_select_9_ng_template_4_Template");
function PublicFormComponent_form_11_div_1_select_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 36)(1, "option", 37);
    \u0275\u0275text(2, "Selecione...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, PublicFormComponent_form_11_div_1_select_9_ng_container_3_Template, 2, 1, "ng-container", 38)(4, PublicFormComponent_form_11_div_1_select_9_ng_template_4_Template, 1, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const simpleOpts_r6 = \u0275\u0275reference(5);
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("formControlName", f_r3.name);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", f_r3.options && f_r3.options.length && typeof f_r3.options[0] === "object")("ngIfElse", simpleOpts_r6);
  }
}
__name(PublicFormComponent_form_11_div_1_select_9_Template, "PublicFormComponent_form_11_div_1_select_9_Template");
function PublicFormComponent_form_11_div_1_div_10_label_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 43);
    \u0275\u0275element(1, "input", 44);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const opt_r7 = ctx.$implicit;
    const f_r3 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("value", (opt_r7 == null ? null : opt_r7.value) ?? opt_r7)("formControlName", f_r3.name);
    \u0275\u0275attribute("name", f_r3.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((opt_r7 == null ? null : opt_r7.label) ?? opt_r7);
  }
}
__name(PublicFormComponent_form_11_div_1_div_10_label_1_Template, "PublicFormComponent_form_11_div_1_div_10_label_1_Template");
function PublicFormComponent_form_11_div_1_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275template(1, PublicFormComponent_form_11_div_1_div_10_label_1_Template, 4, 4, "label", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", f_r3.options || \u0275\u0275pureFunction0(1, _c0));
  }
}
__name(PublicFormComponent_form_11_div_1_div_10_Template, "PublicFormComponent_form_11_div_1_div_10_Template");
function PublicFormComponent_form_11_div_1_select_11_option_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r8 = ctx.$implicit;
    \u0275\u0275property("value", opt_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(opt_r8);
  }
}
__name(PublicFormComponent_form_11_div_1_select_11_option_3_Template, "PublicFormComponent_form_11_div_1_select_11_option_3_Template");
function PublicFormComponent_form_11_div_1_select_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 36)(1, "option", 37);
    \u0275\u0275text(2, "Selecione...");
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, PublicFormComponent_form_11_div_1_select_11_option_3_Template, 2, 2, "option", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("formControlName", f_r3.name);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", f_r3.options && f_r3.options.length ? f_r3.options : \u0275\u0275pureFunction0(2, _c1));
  }
}
__name(PublicFormComponent_form_11_div_1_select_11_Template, "PublicFormComponent_form_11_div_1_select_11_Template");
function PublicFormComponent_form_11_div_1_input_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 31);
  }
  if (rf & 2) {
    const f_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("formControlName", f_r3.name);
  }
}
__name(PublicFormComponent_form_11_div_1_input_12_Template, "PublicFormComponent_form_11_div_1_input_12_Template");
function PublicFormComponent_form_11_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "label", 21);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerStart(3, 22);
    \u0275\u0275template(4, PublicFormComponent_form_11_div_1_input_4_Template, 1, 1, "input", 23)(5, PublicFormComponent_form_11_div_1_input_5_Template, 1, 1, "input", 24)(6, PublicFormComponent_form_11_div_1_input_6_Template, 1, 1, "input", 25)(7, PublicFormComponent_form_11_div_1_input_7_Template, 1, 1, "input", 26)(8, PublicFormComponent_form_11_div_1_textarea_8_Template, 1, 1, "textarea", 27)(9, PublicFormComponent_form_11_div_1_select_9_Template, 6, 3, "select", 28)(10, PublicFormComponent_form_11_div_1_div_10_Template, 2, 2, "div", 29)(11, PublicFormComponent_form_11_div_1_select_11_Template, 4, 3, "select", 28)(12, PublicFormComponent_form_11_div_1_input_12_Template, 1, 1, "input", 30);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r3.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitch", f_r3.type);
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "text");
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "email");
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "tel");
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "number");
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "textarea");
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "select");
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "radio");
    \u0275\u0275advance();
    \u0275\u0275property("ngSwitchCase", "temperatura");
  }
}
__name(PublicFormComponent_form_11_div_1_Template, "PublicFormComponent_form_11_div_1_Template");
function PublicFormComponent_form_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 16);
    \u0275\u0275listener("ngSubmit", /* @__PURE__ */ __name(function PublicFormComponent_form_11_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmit());
    }, "PublicFormComponent_form_11_Template_form_ngSubmit_0_listener"));
    \u0275\u0275template(1, PublicFormComponent_form_11_div_1_Template, 13, 10, "div", 17);
    \u0275\u0275elementStart(2, "div", 18)(3, "button", 19);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.form);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.currentFields);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background-color", ctx_r0.primaryColor());
    \u0275\u0275property("disabled", ctx_r0.saving());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.saving() ? "Salvando..." : "Salvar", " ");
  }
}
__name(PublicFormComponent_form_11_Template, "PublicFormComponent_form_11_Template");
var _PublicFormComponent = class _PublicFormComponent {
  route = inject(ActivatedRoute);
  fs = inject(FirestoreService);
  subdomain = inject(SubdomainService);
  toast = inject(ToastService);
  fb = inject(FormBuilder);
  companyService = inject(CompanyService);
  form = this.fb.group({});
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : []);
  fieldsLoaded = signal(false, ...ngDevMode ? [{ debugName: "fieldsLoaded" }] : []);
  companyName = signal(null, ...ngDevMode ? [{ debugName: "companyName" }] : []);
  primaryColor = signal(this.subdomain.getCurrentCompany()?.brandingConfig?.primaryColor || "#3B82F6", ...ngDevMode ? [{ debugName: "primaryColor" }] : []);
  companyLogo = null;
  userId = "";
  boardId = "";
  columnId = "";
  leadId = "";
  currentFields = [];
  lead = null;
  companyUsers = [];
  ngOnInit() {
    return __async(this, null, function* () {
      const qp = this.route.snapshot.queryParamMap;
      const sub = qp.get("subdomain") || void 0;
      const companyIdParam = qp.get("companyId") || "";
      this.userId = qp.get("userId") || "";
      this.boardId = qp.get("boardId") || "";
      this.leadId = qp.get("leadId") || "";
      this.columnId = qp.get("columnId") || "";
      try {
        let company = null;
        if (companyIdParam) {
          company = yield this.companyService.getCompany(companyIdParam);
        }
        if (!company && sub) {
          company = yield this.companyService.getCompanyBySubdomain(sub);
        }
        if (!company) {
          company = yield this.subdomain.initializeFromSubdomain();
        }
        if (company) {
          this.subdomain.setCurrentCompany(company);
          this.companyName.set(company.name || sub || null);
          this.primaryColor.set(company.brandingConfig?.primaryColor || "#3B82F6");
          const sd = company.subdomain;
          this.companyLogo = (company.brandingConfig?.logo && company.brandingConfig.logo.trim() !== "" ? company.brandingConfig.logo : null) || (sd === "gobuyer" ? "https://apps.gobuyer.com.br/sso/assets/images/logos/logo-gobuyer.png" : null);
        } else if (sub) {
          this.companyName.set(sub);
        }
      } catch {
        this.companyName.set(sub || null);
      }
      try {
        if (this.leadId) {
          this.lead = yield this.fs.getLead(this.userId, this.boardId, this.leadId);
        }
      } catch {
      }
      try {
        const phaseCfg = yield this.fs.getPhaseFormConfig(this.userId, this.boardId, this.columnId);
        const fields = phaseCfg?.fields || [];
        this.currentFields = fields.sort((a, b) => (a.order || 0) - (b.order || 0));
        const hasResp = this.currentFields.some((f) => f.type === "responsavel");
        if (hasResp) {
          const company = this.subdomain.getCurrentCompany();
          if (company?.id) {
            try {
              const users = yield this.companyService.getAllCompanyUsers(company.id);
              this.companyUsers = users || [];
              this.currentFields = this.currentFields.map((f) => {
                if (f.type === "responsavel") {
                  return __spreadProps(__spreadValues({}, f), {
                    type: "select",
                    originalType: "responsavel",
                    options: users.map((u) => ({ value: u.uid || u.email, label: u.displayName || u.email }))
                  });
                }
                return f;
              });
            } catch {
            }
          }
        }
        const formGroup = {};
        this.currentFields.forEach((f) => {
          const key = f.apiFieldName || f.name;
          const val = this.lead?.fields?.[key] ?? "";
          formGroup[f.name] = [val];
          if (f.type === "radio" && Array.isArray(f.options)) {
            f.options = f.options.map((o) => typeof o === "object" ? o : { value: o, label: o });
          }
        });
        this.form = this.fb.group(formGroup);
        this.fieldsLoaded.set(this.currentFields.length > 0);
      } catch {
        this.currentFields = [];
        this.fieldsLoaded.set(false);
      }
      this.loading.set(false);
    });
  }
  mapFormToLeadFields() {
    const values = this.form.value;
    const mapped = {};
    this.currentFields.forEach((f) => {
      const apiKey = f.apiFieldName || f.name;
      mapped[apiKey] = values[f.name];
    });
    return mapped;
  }
  onSubmit() {
    return __async(this, null, function* () {
      if (!this.lead || !this.leadId)
        return;
      this.saving.set(true);
      try {
        const mapped = this.mapFormToLeadFields();
        const updates = {
          fields: __spreadValues(__spreadValues({}, this.lead.fields || {}), mapped)
        };
        try {
          const respField = this.currentFields.find((f) => f.originalType === "responsavel" || f.type === "responsavel" || (f.name || "").toLowerCase() === "responsavel");
          if (respField) {
            const fieldName = respField.name;
            const selectedId = this.form.get(fieldName)?.value;
            if (selectedId) {
              const match = this.companyUsers.find((u) => u.uid && u.uid === selectedId || u.email && u.email === selectedId);
              updates.responsibleUserId = match?.uid || selectedId;
              updates.responsibleUserName = match?.displayName || "";
              updates.responsibleUserEmail = match?.email || "";
            }
          }
        } catch {
        }
        yield this.fs.updateLead(this.userId, this.boardId, this.leadId, updates);
        try {
          this.toast.success("Formul\xE1rio salvo.");
        } catch {
        }
      } catch (e) {
        console.error(e);
        try {
          this.toast.error("Erro ao salvar formul\xE1rio.");
        } catch {
        }
      } finally {
        this.saving.set(false);
      }
    });
  }
};
__name(_PublicFormComponent, "PublicFormComponent");
__publicField(_PublicFormComponent, "\u0275fac", /* @__PURE__ */ __name(function PublicFormComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PublicFormComponent)();
}, "PublicFormComponent_Factory"));
__publicField(_PublicFormComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicFormComponent, selectors: [["app-public-form"]], decls: 16, vars: 5, consts: [["simpleOpts", ""], [1, "min-h-screen", "bg-gray-50", "py-10", "px-4"], [1, "max-w-2xl", "mx-auto"], ["class", "mb-6 text-center", 4, "ngIf"], [1, "bg-white", "border", "border-gray-200", "rounded-xl", "shadow-sm"], [1, "px-6", "py-4", "border-b", "border-gray-200", "flex", "items-center", "justify-between"], [1, "text-lg", "font-semibold", "text-gray-900"], ["class", "text-xs text-gray-500", 4, "ngIf"], [1, "p-6"], ["class", "text-sm text-gray-500", 4, "ngIf"], ["class", "space-y-4", 3, "formGroup", "ngSubmit", 4, "ngIf"], [1, "mt-6", "text-center", "text-xs", "text-gray-400"], [1, "mb-6", "text-center"], ["alt", "Logo da empresa", 1, "h-10", "inline-block", 3, "src"], [1, "text-xs", "text-gray-500"], [1, "text-sm", "text-gray-500"], [1, "space-y-4", 3, "ngSubmit", "formGroup"], ["class", "space-y-1", 4, "ngFor", "ngForOf"], [1, "pt-2"], ["type", "submit", 1, "px-4", "py-2", "text-white", "rounded-lg", 3, "disabled"], [1, "space-y-1"], [1, "block", "text-sm", "font-medium", "text-gray-700"], [3, "ngSwitch"], ["type", "text", "class", "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", 3, "formControlName", 4, "ngSwitchCase"], ["type", "email", "class", "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", 3, "formControlName", 4, "ngSwitchCase"], ["type", "tel", "class", "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", 3, "formControlName", 4, "ngSwitchCase"], ["type", "number", "class", "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", 3, "formControlName", 4, "ngSwitchCase"], ["rows", "3", "class", "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", 3, "formControlName", 4, "ngSwitchCase"], ["class", "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", 3, "formControlName", 4, "ngSwitchCase"], ["class", "flex flex-col gap-2", 4, "ngSwitchCase"], ["type", "text", "class", "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500", 3, "formControlName", 4, "ngSwitchDefault"], ["type", "text", 1, "w-full", "p-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", 3, "formControlName"], ["type", "email", 1, "w-full", "p-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", 3, "formControlName"], ["type", "tel", 1, "w-full", "p-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", 3, "formControlName"], ["type", "number", 1, "w-full", "p-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", 3, "formControlName"], ["rows", "3", 1, "w-full", "p-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", 3, "formControlName"], [1, "w-full", "p-3", "border", "border-gray-300", "rounded-lg", "focus:ring-2", "focus:ring-blue-500", "focus:border-blue-500", 3, "formControlName"], ["value", ""], [4, "ngIf", "ngIfElse"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "flex", "flex-col", "gap-2"], ["class", "inline-flex items-center gap-2 text-sm text-gray-700", 4, "ngFor", "ngForOf"], [1, "inline-flex", "items-center", "gap-2", "text-sm", "text-gray-700"], ["type", "radio", 1, "text-blue-600", "focus:ring-blue-500", 3, "value", "formControlName"]], template: /* @__PURE__ */ __name(function PublicFormComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2);
    \u0275\u0275template(2, PublicFormComponent_div_2_Template, 2, 1, "div", 3);
    \u0275\u0275elementStart(3, "div", 4)(4, "div", 5)(5, "h1", 6);
    \u0275\u0275text(6, "Formul\xE1rio");
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, PublicFormComponent_span_7_Template, 2, 1, "span", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 8);
    \u0275\u0275template(9, PublicFormComponent_div_9_Template, 2, 0, "div", 9)(10, PublicFormComponent_div_10_Template, 2, 0, "div", 9)(11, PublicFormComponent_form_11_Template, 5, 6, "form", 10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 11);
    \u0275\u0275text(13, " Powered by ");
    \u0275\u0275elementStart(14, "strong");
    \u0275\u0275text(15, "Task Board");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx.companyLogo);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx.companyName());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx.loading());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.loading() && !ctx.fieldsLoaded());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.fieldsLoaded());
  }
}, "PublicFormComponent_Template"), dependencies: [CommonModule, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], encapsulation: 2 }));
var PublicFormComponent = _PublicFormComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicFormComponent, [{
    type: Component,
    args: [{
      selector: "app-public-form",
      standalone: true,
      imports: [CommonModule, ReactiveFormsModule],
      template: `
    <div class="min-h-screen bg-gray-50 py-10 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Company Logo on top -->
        <div *ngIf="companyLogo" class="mb-6 text-center">
          <img [src]="companyLogo" alt="Logo da empresa" class="h-10 inline-block" />
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h1 class="text-lg font-semibold text-gray-900">Formul\xE1rio</h1>
            <span class="text-xs text-gray-500" *ngIf="companyName()">{{ companyName() }}</span>
          </div>

          <div class="p-6">
            <div *ngIf="loading()" class="text-sm text-gray-500">Carregando...</div>
            <div *ngIf="!loading() && !fieldsLoaded()" class="text-sm text-gray-500">Nenhum campo configurado para esta fase.</div>

            <form *ngIf="fieldsLoaded()" [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
              <div *ngFor="let f of currentFields" class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">{{ f.label }}</label>
                <ng-container [ngSwitch]="f.type">
                  <input *ngSwitchCase="'text'" type="text" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <input *ngSwitchCase="'email'" type="email" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <input *ngSwitchCase="'tel'" type="tel" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <input *ngSwitchCase="'number'" type="number" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <textarea *ngSwitchCase="'textarea'" rows="3" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                  <select *ngSwitchCase="'select'" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <ng-container *ngIf="f.options && f.options.length && typeof f.options[0] === 'object'; else simpleOpts">
                      <option *ngFor="let opt of f.options" [value]="opt.value">{{ opt.label }}</option>
                    </ng-container>
                    <ng-template #simpleOpts>
                      <option *ngFor="let opt of (f.options || [])" [value]="opt">{{ opt }}</option>
                    </ng-template>
                  </select>
                  <!-- Campo Radio -->
                  <div *ngSwitchCase="'radio'" class="flex flex-col gap-2">
                    <label *ngFor="let opt of (f.options || [])" class="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input type="radio" [attr.name]="f.name" [value]="opt?.value ?? opt" [formControlName]="f.name" class="text-blue-600 focus:ring-blue-500">
                      <span>{{ opt?.label ?? opt }}</span>
                    </label>
                  </div>
                  <select *ngSwitchCase="'temperatura'" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option *ngFor="let opt of (f.options && f.options.length ? f.options : ['Quente','Morno','Frio'])" [value]="opt">{{ opt }}</option>
                  </select>
                  <input *ngSwitchDefault type="text" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </ng-container>
              </div>

              <div class="pt-2">
                <button type="submit" [disabled]="saving()" class="px-4 py-2 text-white rounded-lg" [style.background-color]="primaryColor()">
                  {{ saving() ? 'Salvando...' : 'Salvar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
        <!-- Powered by footer -->
        <div class="mt-6 text-center text-xs text-gray-400">
          Powered by <strong>Task Board</strong>
        </div>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicFormComponent, { className: "PublicFormComponent", filePath: "src/app/components/public-form/public-form.component.ts", lineNumber: 80 });
})();
export {
  PublicFormComponent
};
//# sourceMappingURL=chunk-MNQWR6R3.js.map
