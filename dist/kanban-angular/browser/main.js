import {
  getStorage,
  provideStorage
} from "./chunk-SLZ5Q73G.js";
import {
  getFunctions,
  provideFunctions
} from "./chunk-XKYK3QHQ.js";
import {
  BrandingService
} from "./chunk-JM2YM2QH.js";
import {
  AbstractControl,
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  DomSanitizer,
  FormControl,
  FormControlDirective,
  FormGroupDirective,
  NgControl,
  NgControlStatus,
  NgSelectOption,
  NumberValueAccessor,
  RadioControlValueAccessor,
  ReactiveFormsModule,
  Router,
  RouterOutlet,
  SelectControlValueAccessor,
  SelectMultipleControlValueAccessor,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  bootstrapApplication,
  provideRouter,
  ɵNgSelectMultipleOption
} from "./chunk-5BCXWPYT.js";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient
} from "./chunk-PTOBJH2A.js";
import {
  AuthService,
  CompanyService,
  FirestoreService,
  SubdomainService,
  getAuth,
  getFirestore,
  initializeApp,
  provideAuth,
  provideFirebaseApp,
  provideFirestore
} from "./chunk-L2S3FEQE.js";
import {
  APP_INITIALIZER,
  AsyncPipe,
  BehaviorSubject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  ComponentRef$1,
  ContentChildren,
  DOCUMENT,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgClass,
  NgForOf,
  NgIf,
  NgModule,
  NgTemplateOutlet,
  NgZone,
  NoopNgZone,
  Observable,
  Optional,
  Output,
  Pipe,
  Renderer2,
  Subject,
  TemplateRef,
  Type,
  VERSION,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  __async,
  __objRest,
  __restKey,
  __spreadProps,
  __spreadValues,
  debounceTime,
  distinctUntilChanged,
  filter,
  importProvidersFrom,
  inject,
  isObservable,
  map,
  merge,
  of,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  setClassMetadata,
  signal,
  startWith,
  switchMap,
  take,
  tap,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵdomTemplate,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-GHLOFODZ.js";

// node_modules/@ngx-formly/core/fesm2022/ngx-formly-core.mjs
var _c0 = ["container"];
function FormlyField_ng_template_0_Template(rf, ctx) {
}
function LegacyFormlyField_ng_template_0_Template(rf, ctx) {
}
var _c1 = ["*"];
function FormlyGroup_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "formly-field", 0);
  }
  if (rf & 2) {
    const f_r1 = ctx.$implicit;
    \u0275\u0275property("field", f_r1);
  }
}
var _c2 = ["fieldComponent"];
function disableTreeValidityCall(form, callback) {
  const _updateTreeValidity = form._updateTreeValidity.bind(form);
  form._updateTreeValidity = () => {
  };
  callback();
  form._updateTreeValidity = _updateTreeValidity;
}
function getFieldId(formId, field, index) {
  if (field.id) {
    return field.id;
  }
  let type = field.type;
  if (!type && field.template) {
    type = "template";
  }
  if (type instanceof Type) {
    type = type.prototype.constructor.name;
  }
  return [formId, type, field.key, index].join("_");
}
function hasKey(field) {
  return !isNil(field.key) && field.key !== "" && (!Array.isArray(field.key) || field.key.length > 0);
}
function getKeyPath(field) {
  if (!hasKey(field)) {
    return [];
  }
  if (field._keyPath?.key !== field.key) {
    let path = [];
    if (typeof field.key === "string") {
      const key = field.key.indexOf("[") === -1 ? field.key : field.key.replace(/\[(\w+)\]/g, ".$1");
      path = key.indexOf(".") !== -1 ? key.split(".") : [key];
    } else if (Array.isArray(field.key)) {
      path = field.key.slice(0);
    } else {
      path = [`${field.key}`];
    }
    defineHiddenProp(field, "_keyPath", {
      key: field.key,
      path
    });
  }
  return field._keyPath.path.slice(0);
}
var FORMLY_VALIDATORS = ["required", "pattern", "minLength", "maxLength", "min", "max"];
function assignFieldValue(field, value) {
  let paths = getKeyPath(field);
  if (paths.length === 0) {
    return;
  }
  let root = field;
  while (root.parent) {
    root = root.parent;
    paths = [...getKeyPath(root), ...paths];
  }
  if (value === void 0 && field.resetOnHide) {
    const k = paths.pop();
    const m = paths.reduce((model, path) => model[path] || {}, root.model);
    delete m[k];
    return;
  }
  assignModelValue(root.model, paths, value);
}
function assignModelValue(model, paths, value) {
  for (let i = 0; i < paths.length - 1; i++) {
    const path = paths[i];
    if (!model[path] || !isObject(model[path])) {
      model[path] = /^\d+$/.test(paths[i + 1]) ? [] : {};
    }
    model = model[path];
  }
  model[paths[paths.length - 1]] = clone(value);
}
function getFieldValue(field) {
  let model = field.parent ? field.parent.model : field.model;
  for (const path of getKeyPath(field)) {
    if (!model) {
      return model;
    }
    model = model[path];
  }
  return model;
}
function reverseDeepMerge(dest, ...args) {
  args.forEach((src) => {
    for (const srcArg in src) {
      if (isNil(dest[srcArg]) || isBlankString(dest[srcArg])) {
        dest[srcArg] = clone(src[srcArg]);
      } else if (objAndSameType(dest[srcArg], src[srcArg])) {
        reverseDeepMerge(dest[srcArg], src[srcArg]);
      }
    }
  });
  return dest;
}
function isNil(value) {
  return value == null;
}
function isUndefined(value) {
  return value === void 0;
}
function isBlankString(value) {
  return value === "";
}
function isFunction(value) {
  return typeof value === "function";
}
function objAndSameType(obj1, obj2) {
  return isObject(obj1) && isObject(obj2) && Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2) && !(Array.isArray(obj1) || Array.isArray(obj2));
}
function isObject(x) {
  return x != null && typeof x === "object";
}
function isPromise(obj) {
  return !!obj && typeof obj.then === "function";
}
function clone(value) {
  if (!isObject(value) || isObservable(value) || value instanceof TemplateRef || /* instanceof SafeHtmlImpl */
  value.changingThisBreaksApplicationSecurity || ["RegExp", "FileList", "File", "Blob"].indexOf(value.constructor?.name) !== -1) {
    return value;
  }
  if (value instanceof Set) {
    return new Set(value);
  }
  if (value instanceof Map) {
    return new Map(value);
  }
  if (value instanceof Uint8Array) {
    return new Uint8Array(value);
  }
  if (value instanceof Uint16Array) {
    return new Uint16Array(value);
  }
  if (value instanceof Uint32Array) {
    return new Uint32Array(value);
  }
  if (value._isAMomentObject && isFunction(value.clone)) {
    return value.clone();
  }
  if (value instanceof AbstractControl) {
    return null;
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (Array.isArray(value)) {
    return value.slice(0).map((v) => clone(v));
  }
  const proto = Object.getPrototypeOf(value);
  let c = Object.create(proto);
  c = Object.setPrototypeOf(c, proto);
  return Object.keys(value).reduce((newVal, prop) => {
    const propDesc = Object.getOwnPropertyDescriptor(value, prop);
    if (propDesc.get) {
      Object.defineProperty(newVal, prop, propDesc);
    } else {
      newVal[prop] = clone(value[prop]);
    }
    return newVal;
  }, c);
}
function defineHiddenProp(field, prop, defaultValue) {
  Object.defineProperty(field, prop, {
    enumerable: false,
    writable: true,
    configurable: true
  });
  field[prop] = defaultValue;
}
function observeDeep(source, paths, setFn) {
  let observers = [];
  const unsubscribe = () => {
    observers.forEach((observer2) => observer2());
    observers = [];
  };
  const observer = observe(source, paths, ({
    firstChange,
    currentValue
  }) => {
    !firstChange && setFn();
    unsubscribe();
    if (isObject(currentValue) && currentValue.constructor.name === "Object") {
      Object.keys(currentValue).forEach((prop) => {
        observers.push(observeDeep(source, [...paths, prop], setFn));
      });
    }
  });
  return () => {
    observer.unsubscribe();
    unsubscribe();
  };
}
function observe(o, paths, setFn) {
  if (!o._observers) {
    defineHiddenProp(o, "_observers", {});
  }
  let target = o;
  for (let i = 0; i < paths.length - 1; i++) {
    if (!target[paths[i]] || !isObject(target[paths[i]])) {
      target[paths[i]] = /^\d+$/.test(paths[i + 1]) ? [] : {};
    }
    target = target[paths[i]];
  }
  const key = paths[paths.length - 1];
  const prop = paths.join(".");
  if (!o._observers[prop]) {
    o._observers[prop] = {
      value: target[key],
      onChange: []
    };
  }
  const state = o._observers[prop];
  if (target[key] !== state.value) {
    state.value = target[key];
  }
  if (setFn && state.onChange.indexOf(setFn) === -1) {
    state.onChange.push(setFn);
    setFn({
      currentValue: state.value,
      firstChange: true
    });
    if (state.onChange.length >= 1 && isObject(target)) {
      const {
        enumerable
      } = Object.getOwnPropertyDescriptor(target, key) || {
        enumerable: true
      };
      Object.defineProperty(target, key, {
        enumerable,
        configurable: true,
        get: () => state.value,
        set: (currentValue) => {
          if (currentValue !== state.value) {
            const previousValue = state.value;
            state.value = currentValue;
            state.onChange.forEach((changeFn) => changeFn({
              previousValue,
              currentValue,
              firstChange: false
            }));
          }
        }
      });
    }
  }
  return {
    setValue(currentValue, emitEvent = true) {
      if (currentValue === state.value) {
        return;
      }
      const previousValue = state.value;
      state.value = currentValue;
      state.onChange.forEach((changeFn) => {
        if (changeFn !== setFn && emitEvent) {
          changeFn({
            previousValue,
            currentValue,
            firstChange: false
          });
        }
      });
    },
    unsubscribe() {
      state.onChange = state.onChange.filter((changeFn) => changeFn !== setFn);
      if (state.onChange.length === 0) {
        delete o._observers[prop];
      }
    }
  };
}
function getField(f, key) {
  key = Array.isArray(key) ? key.join(".") : key;
  if (!f.fieldGroup) {
    return void 0;
  }
  for (let i = 0, len = f.fieldGroup.length; i < len; i++) {
    const c = f.fieldGroup[i];
    const k = Array.isArray(c.key) ? c.key.join(".") : c.key;
    if (k === key) {
      return c;
    }
    if (c.fieldGroup && (isNil(k) || key.indexOf(`${k}.`) === 0)) {
      const field = getField(c, isNil(k) ? key : key.slice(k.length + 1));
      if (field) {
        return field;
      }
    }
  }
  return void 0;
}
function markFieldForCheck(field) {
  field._componentRefs?.forEach((ref) => {
    if (ref instanceof ComponentRef$1) {
      const changeDetectorRef = ref.injector.get(ChangeDetectorRef);
      changeDetectorRef.markForCheck();
    } else {
      ref.markForCheck();
    }
  });
}
function isNoopNgZone(ngZone) {
  return ngZone instanceof NoopNgZone;
}
function isHiddenField(field) {
  const isHidden = (f) => f.hide || f.expressions?.hide || f.hideExpression;
  let setDefaultValue = !field.resetOnHide || !isHidden(field);
  if (!isHidden(field) && field.resetOnHide) {
    let parent = field.parent;
    while (parent && !isHidden(parent)) {
      parent = parent.parent;
    }
    setDefaultValue = !parent || !isHidden(parent);
  }
  return !setDefaultValue;
}
function isSignalRequired() {
  return +VERSION.major > 18 || +VERSION.major >= 18 && +VERSION.minor >= 1;
}
function evalStringExpression(expression, argNames) {
  try {
    return Function(...argNames, `return ${expression};`);
  } catch (error) {
    console.error(error);
  }
}
function evalExpression(expression, thisArg, argVal) {
  if (typeof expression === "function") {
    return expression.apply(thisArg, argVal);
  } else {
    return expression ? true : false;
  }
}
function unregisterControl(field, emitEvent = false) {
  const control = field.formControl;
  const fieldIndex = control._fields ? control._fields.indexOf(field) : -1;
  if (fieldIndex !== -1) {
    control._fields.splice(fieldIndex, 1);
  }
  const form = control.parent;
  if (!form) {
    return;
  }
  const opts = {
    emitEvent
  };
  if (form instanceof UntypedFormArray) {
    const key = form.controls.findIndex((c) => c === control);
    if (key !== -1) {
      form.removeAt(key, opts);
    }
  } else if (form instanceof UntypedFormGroup) {
    const paths = getKeyPath(field);
    const key = paths[paths.length - 1];
    if (form.get([key]) === control) {
      form.removeControl(key, opts);
    }
  }
  control.setParent(null);
}
function findControl(field) {
  if (field.formControl) {
    return field.formControl;
  }
  if (field.shareFormControl === false) {
    return null;
  }
  return field.form?.get(getKeyPath(field));
}
function registerControl(field, control, emitEvent = false) {
  control = control || field.formControl;
  if (!control._fields) {
    defineHiddenProp(control, "_fields", []);
  }
  if (control._fields.indexOf(field) === -1) {
    control._fields.push(field);
  }
  if (!field.formControl && control) {
    defineHiddenProp(field, "formControl", control);
    control.setValidators(null);
    control.setAsyncValidators(null);
    field.props.disabled = !!field.props.disabled;
    const disabledObserver = observe(field, ["props", "disabled"], ({
      firstChange,
      currentValue
    }) => {
      if (!firstChange) {
        currentValue ? field.formControl.disable() : field.formControl.enable();
      }
    });
    if (control instanceof FormControl) {
      control.registerOnDisabledChange(disabledObserver.setValue);
    }
  }
  if (!field.form || !hasKey(field)) {
    return;
  }
  let form = field.form;
  const paths = getKeyPath(field);
  const value = getFieldValue(field);
  if (!(isNil(control.value) && isNil(value)) && control.value !== value && control instanceof FormControl) {
    control.patchValue(value);
  }
  for (let i = 0; i < paths.length - 1; i++) {
    const path = paths[i];
    if (!form.get([path])) {
      form.setControl(path, new UntypedFormGroup({}), {
        emitEvent
      });
    }
    form = form.get([path]);
  }
  const key = paths[paths.length - 1];
  if (!field._hide && form.get([key]) !== control) {
    form.setControl(key, control, {
      emitEvent
    });
  }
}
function updateValidity(c, onlySelf = false) {
  const status = c.status;
  const value = c.value;
  c.updateValueAndValidity({
    emitEvent: false,
    onlySelf
  });
  if (status !== c.status) {
    c.statusChanges.emit(c.status);
  }
  if (value !== c.value) {
    c.valueChanges.emit(c.value);
  }
}
function clearControl(form) {
  delete form?._fields;
  form.setValidators(null);
  form.setAsyncValidators(null);
  if (form instanceof UntypedFormGroup || form instanceof UntypedFormArray) {
    Object.values(form.controls).forEach((c) => clearControl(c));
  }
}
var FieldExpressionExtension = class {
  onPopulate(field) {
    if (field._expressions) {
      return;
    }
    defineHiddenProp(field, "_expressions", {});
    observe(field, ["hide"], ({
      currentValue,
      firstChange
    }) => {
      defineHiddenProp(field, "_hide", !!currentValue);
      if (!firstChange || firstChange && currentValue === true) {
        field.props.hidden = currentValue;
        field.options._hiddenFieldsForCheck.push({
          field
        });
      }
    });
    if (field.hideExpression) {
      observe(field, ["hideExpression"], ({
        currentValue: expr
      }) => {
        field._expressions.hide = this.parseExpressions(field, "hide", typeof expr === "boolean" ? () => expr : expr);
      });
    }
    const evalExpr = (key, expr) => {
      if (typeof expr === "string" || isFunction(expr)) {
        field._expressions[key] = this.parseExpressions(field, key, expr);
      } else if (expr instanceof Observable) {
        field._expressions[key] = {
          value$: expr.pipe(tap((v) => {
            this.evalExpr(field, key, v);
            field.options._detectChanges(field);
          }))
        };
      }
    };
    field.expressions = field.expressions || {};
    for (const key of Object.keys(field.expressions)) {
      observe(field, ["expressions", key], ({
        currentValue: expr
      }) => {
        evalExpr(key, isFunction(expr) ? (...args) => expr(field, args[3]) : expr);
      });
    }
    field.expressionProperties = field.expressionProperties || {};
    for (const key of Object.keys(field.expressionProperties)) {
      observe(field, ["expressionProperties", key], ({
        currentValue
      }) => evalExpr(key, currentValue));
    }
  }
  postPopulate(field) {
    if (field.parent) {
      return;
    }
    if (!field.options.checkExpressions) {
      let checkLocked = false;
      field.options.checkExpressions = (f, ignoreCache) => {
        if (checkLocked) {
          return;
        }
        checkLocked = true;
        const fieldChanged = this.checkExpressions(f, ignoreCache);
        const options = field.options;
        options._hiddenFieldsForCheck.sort((f2) => f2.field.hide ? -1 : 1).forEach((f2) => this.changeHideState(f2.field, f2.field.hide ?? f2.default, !ignoreCache));
        options._hiddenFieldsForCheck = [];
        if (fieldChanged) {
          this.checkExpressions(field);
        }
        checkLocked = false;
      };
    }
  }
  parseExpressions(field, path, expr) {
    let parentExpression;
    if (field.parent && ["hide", "props.disabled"].includes(path)) {
      const rootValue = (f) => {
        return path === "hide" ? f.hide : f.props.disabled;
      };
      parentExpression = () => {
        let root = field.parent;
        while (root.parent && !rootValue(root)) {
          root = root.parent;
        }
        return rootValue(root);
      };
    }
    expr = expr || (() => false);
    if (typeof expr === "string") {
      expr = evalStringExpression(expr, ["model", "formState", "field"]);
    }
    let currentValue;
    return {
      callback: (ignoreCache) => {
        try {
          const exprValue = evalExpression(parentExpression ? (...args) => parentExpression(field) || expr(...args) : expr, {
            field
          }, [field.model, field.options.formState, field, ignoreCache]);
          if (ignoreCache || currentValue !== exprValue && (!isObject(exprValue) || isObservable(exprValue) || JSON.stringify(exprValue) !== JSON.stringify(currentValue))) {
            currentValue = exprValue;
            this.evalExpr(field, path, exprValue);
            return true;
          }
          return false;
        } catch (error) {
          error.message = `[Formly Error] [Expression "${path}"] ${error.message}`;
          throw error;
        }
      }
    };
  }
  checkExpressions(field, ignoreCache = false) {
    if (!field) {
      return false;
    }
    let fieldChanged = false;
    if (field._expressions) {
      for (const key of Object.keys(field._expressions)) {
        field._expressions[key].callback?.(ignoreCache) && (fieldChanged = true);
      }
    }
    field.fieldGroup?.forEach((f) => this.checkExpressions(f, ignoreCache) && (fieldChanged = true));
    return fieldChanged;
  }
  changeDisabledState(field, value) {
    if (field.fieldGroup) {
      field.fieldGroup.filter((f) => !f._expressions.hasOwnProperty("props.disabled")).forEach((f) => this.changeDisabledState(f, value));
    }
    if (hasKey(field) && field.props.disabled !== value) {
      field.props.disabled = value;
    }
  }
  changeHideState(field, hide, resetOnHide) {
    if (field.fieldGroup) {
      field.fieldGroup.filter((f) => f && !f._expressions.hide).forEach((f) => this.changeHideState(f, hide, resetOnHide));
    }
    if (field.formControl && hasKey(field)) {
      defineHiddenProp(field, "_hide", !!(hide || field.hide));
      const c = field.formControl;
      if (c._fields?.length > 1) {
        updateValidity(c);
      }
      if (hide === true && (!c._fields || c._fields.every((f) => !!f._hide))) {
        unregisterControl(field, true);
        if (resetOnHide && field.resetOnHide) {
          assignFieldValue(field, void 0);
          field.formControl.reset({
            value: void 0,
            disabled: field.formControl.disabled
          });
          field.options.fieldChanges.next({
            value: void 0,
            field,
            type: "valueChanges"
          });
          if (field.fieldGroup && field.formControl instanceof UntypedFormArray) {
            field.fieldGroup.length = 0;
          }
        }
      } else if (hide === false) {
        if (field.resetOnHide && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field))) {
          assignFieldValue(field, field.defaultValue);
        }
        registerControl(field, void 0, true);
        if (field.resetOnHide && field.fieldArray && field.fieldGroup?.length !== field.model?.length) {
          field.options.build(field);
        }
      }
    }
    if (field.options.fieldChanges) {
      field.options.fieldChanges.next({
        field,
        type: "hidden",
        value: hide
      });
    }
  }
  evalExpr(field, prop, value) {
    if (prop.indexOf("model.") === 0) {
      const key = prop.replace(/^model\./, ""), parent = field.fieldGroup ? field : field.parent;
      let control = field?.key === key ? field.formControl : field.form.get(key);
      if (!control && field.get(key)) {
        control = field.get(key).formControl;
      }
      assignFieldValue({
        key,
        parent,
        model: field.model
      }, value);
      if (control && !(isNil(control.value) && isNil(value)) && control.value !== value) {
        control.patchValue(value);
      }
    } else {
      try {
        let target = field;
        const paths = this._evalExpressionPath(field, prop);
        const lastIndex = paths.length - 1;
        for (let i = 0; i < lastIndex; i++) {
          target = target[paths[i]];
        }
        target[paths[lastIndex]] = value;
      } catch (error) {
        error.message = `[Formly Error] [Expression "${prop}"] ${error.message}`;
        throw error;
      }
      if (["templateOptions.disabled", "props.disabled"].includes(prop) && hasKey(field)) {
        this.changeDisabledState(field, value);
      }
    }
    this.emitExpressionChanges(field, prop, value);
  }
  emitExpressionChanges(field, property, value) {
    if (!field.options.fieldChanges) {
      return;
    }
    field.options.fieldChanges.next({
      field,
      type: "expressionChanges",
      property,
      value
    });
  }
  _evalExpressionPath(field, prop) {
    if (field._expressions[prop] && field._expressions[prop].paths) {
      return field._expressions[prop].paths;
    }
    let paths = [];
    if (prop.indexOf("[") === -1) {
      paths = prop.split(".");
    } else {
      prop.split(/[[\]]{1,2}/).filter((p) => p).forEach((path) => {
        const arrayPath = path.match(/['|"](.*?)['|"]/);
        if (arrayPath) {
          paths.push(arrayPath[1]);
        } else {
          paths.push(...path.split(".").filter((p) => p));
        }
      });
    }
    if (field._expressions[prop]) {
      field._expressions[prop].paths = paths;
    }
    return paths;
  }
};
var CoreExtension = class {
  constructor(config) {
    this.config = config;
    this.formId = 0;
  }
  prePopulate(field) {
    const root = field.parent;
    this.initRootOptions(field);
    this.initFieldProps(field);
    if (root) {
      Object.defineProperty(field, "options", {
        get: () => root.options,
        configurable: true
      });
      Object.defineProperty(field, "model", {
        get: () => hasKey(field) && field.fieldGroup ? getFieldValue(field) : root.model,
        configurable: true
      });
    }
    Object.defineProperty(field, "get", {
      value: (key) => getField(field, key),
      configurable: true
    });
    this.getFieldComponentInstance(field).prePopulate?.(field);
  }
  onPopulate(field) {
    this.initFieldOptions(field);
    this.getFieldComponentInstance(field).onPopulate?.(field);
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f, index) => {
        if (f) {
          Object.defineProperty(f, "parent", {
            get: () => field,
            configurable: true
          });
          Object.defineProperty(f, "index", {
            get: () => index,
            configurable: true
          });
        }
        this.formId++;
      });
    }
  }
  postPopulate(field) {
    this.getFieldComponentInstance(field).postPopulate?.(field);
  }
  initFieldProps(field) {
    field.props ??= field.templateOptions;
    Object.defineProperty(field, "templateOptions", {
      get: () => field.props,
      set: (props) => field.props = props,
      configurable: true
    });
  }
  initRootOptions(field) {
    if (field.parent) {
      return;
    }
    const options = field.options;
    field.options.formState = field.options.formState || {};
    if (!options.showError) {
      options.showError = this.config.extras.showError;
    }
    if (!options.fieldChanges) {
      defineHiddenProp(options, "fieldChanges", new Subject());
    }
    if (!options._hiddenFieldsForCheck) {
      options._hiddenFieldsForCheck = [];
    }
    options._detectChanges = (f) => {
      if (f._componentRefs) {
        markFieldForCheck(f);
      }
      f.fieldGroup?.forEach((f2) => f2 && options._detectChanges(f2));
    };
    options.detectChanges = (f) => {
      f.options.checkExpressions?.(f);
      options._detectChanges(f);
    };
    options.resetModel = (model) => {
      model = clone(model ?? options._initialModel);
      if (field.model) {
        Object.keys(field.model).forEach((k) => delete field.model[k]);
        Object.assign(field.model, model || {});
      }
      if (!isSignalRequired()) {
        observe(options, ["parentForm", "submitted"]).setValue(false, false);
      }
      options.build(field);
      field.form.reset(field.model);
    };
    options.updateInitialValue = (model) => options._initialModel = clone(model ?? field.model);
    field.options.updateInitialValue();
  }
  initFieldOptions(field) {
    reverseDeepMerge(field, {
      id: getFieldId(`formly_${this.formId}`, field, field.index),
      hooks: {},
      modelOptions: {},
      validation: {
        messages: {}
      },
      props: !field.type || !hasKey(field) ? {} : {
        label: "",
        placeholder: "",
        disabled: false
      }
    });
    if (this.config.extras.resetFieldOnHide && field.resetOnHide !== false) {
      field.resetOnHide = true;
    }
    if (field.type !== "formly-template" && (field.template || field.expressions?.template || field.expressionProperties?.template)) {
      field.type = "formly-template";
    }
    if (!field.type && field.fieldGroup) {
      field.type = "formly-group";
    }
    if (field.type) {
      this.config.getMergedField(field);
    }
    if (hasKey(field) && !isUndefined(field.defaultValue) && isUndefined(getFieldValue(field)) && !isHiddenField(field)) {
      assignFieldValue(field, field.defaultValue);
    }
    field.wrappers = field.wrappers || [];
  }
  getFieldComponentInstance(field) {
    const componentRefInstance = () => {
      let componentRef = this.config.resolveFieldTypeRef(field);
      const fieldComponentRef = field._componentRefs?.slice(-1)[0];
      if (fieldComponentRef instanceof ComponentRef$1 && fieldComponentRef?.componentType === componentRef?.componentType) {
        componentRef = fieldComponentRef;
      }
      return componentRef?.instance;
    };
    if (!field._proxyInstance) {
      defineHiddenProp(field, "_proxyInstance", new Proxy({}, {
        get: (_, prop) => componentRefInstance()?.[prop],
        set: (_, prop, value) => componentRefInstance()[prop] = value
      }));
    }
    return field._proxyInstance;
  }
};
var FieldFormExtension = class {
  prePopulate(field) {
    if (!this.root) {
      this.root = field;
    }
    if (field.parent) {
      Object.defineProperty(field, "form", {
        get: () => field.parent.formControl,
        configurable: true
      });
    }
  }
  onPopulate(field) {
    if (field.hasOwnProperty("fieldGroup") && !hasKey(field)) {
      defineHiddenProp(field, "formControl", field.form);
    } else {
      this.addFormControl(field);
    }
  }
  postPopulate(field) {
    if (this.root !== field) {
      return;
    }
    this.root = null;
    const markForCheck = this.setValidators(field);
    if (markForCheck && field.parent) {
      let parent = field.parent;
      while (parent) {
        if (hasKey(parent) || !parent.parent) {
          updateValidity(parent.formControl, true);
        }
        parent = parent.parent;
      }
    }
  }
  addFormControl(field) {
    let control = findControl(field);
    if (field.fieldArray) {
      return;
    }
    if (!control) {
      const controlOptions = {
        updateOn: field.modelOptions.updateOn
      };
      if (field.fieldGroup) {
        control = new UntypedFormGroup({}, controlOptions);
      } else {
        const value = hasKey(field) ? getFieldValue(field) : field.defaultValue;
        control = new UntypedFormControl({
          value,
          disabled: !!field.props.disabled
        }, __spreadProps(__spreadValues({}, controlOptions), {
          initialValueIsDefault: true
        }));
      }
    } else {
      if (control instanceof FormControl) {
        const value = hasKey(field) ? getFieldValue(field) : field.defaultValue;
        control.defaultValue = value;
      }
    }
    registerControl(field, control);
  }
  setValidators(field, disabled = false) {
    if (disabled === false && hasKey(field) && field.props?.disabled) {
      disabled = true;
    }
    let markForCheck = false;
    field.fieldGroup?.forEach((f) => f && this.setValidators(f, disabled) && (markForCheck = true));
    if (hasKey(field) || !field.parent || !hasKey(field) && !field.fieldGroup) {
      const {
        formControl: c
      } = field;
      if (c) {
        if (hasKey(field) && c instanceof FormControl) {
          if (disabled && c.enabled) {
            c.disable({
              emitEvent: false,
              onlySelf: true
            });
            markForCheck = true;
          }
          if (!disabled && c.disabled) {
            c.enable({
              emitEvent: false,
              onlySelf: true
            });
            markForCheck = true;
          }
        }
        if (null === c.validator && this.hasValidators(field, "_validators")) {
          c.setValidators(() => {
            const v = Validators.compose(this.mergeValidators(field, "_validators"));
            return v ? v(c) : null;
          });
          markForCheck = true;
        }
        if (null === c.asyncValidator && this.hasValidators(field, "_asyncValidators")) {
          c.setAsyncValidators(() => {
            const v = Validators.composeAsync(this.mergeValidators(field, "_asyncValidators"));
            return v ? v(c) : of(null);
          });
          markForCheck = true;
        }
        if (markForCheck) {
          updateValidity(c, true);
          let parent = c.parent;
          for (let i = 1; i < getKeyPath(field).length; i++) {
            if (parent) {
              updateValidity(parent, true);
              parent = parent.parent;
            }
          }
        }
      }
    }
    return markForCheck;
  }
  hasValidators(field, type) {
    const c = field.formControl;
    if (c?._fields?.length > 1 && c._fields.some((f) => f[type].length > 0)) {
      return true;
    } else if (field[type].length > 0) {
      return true;
    }
    return field.fieldGroup?.some((f) => f?.fieldGroup && !hasKey(f) && this.hasValidators(f, type));
  }
  mergeValidators(field, type) {
    const validators = [];
    const c = field.formControl;
    if (c?._fields?.length > 1) {
      c._fields.filter((f) => !f._hide).forEach((f) => validators.push(...f[type]));
    } else if (field[type]) {
      validators.push(...field[type]);
    }
    if (field.fieldGroup) {
      field.fieldGroup.filter((f) => f?.fieldGroup && !hasKey(f)).forEach((f) => validators.push(...this.mergeValidators(f, type)));
    }
    return validators;
  }
};
var FieldValidationExtension = class {
  constructor(config) {
    this.config = config;
  }
  onPopulate(field) {
    this.initFieldValidation(field, "validators");
    this.initFieldValidation(field, "asyncValidators");
  }
  initFieldValidation(field, type) {
    const validators = [];
    if (type === "validators" && !(field.hasOwnProperty("fieldGroup") && !hasKey(field))) {
      validators.push(this.getPredefinedFieldValidation(field));
    }
    if (field[type]) {
      for (const validatorName of Object.keys(field[type])) {
        validatorName === "validation" ? validators.push(...field[type].validation.map((v) => this.wrapNgValidatorFn(field, v))) : validators.push(this.wrapNgValidatorFn(field, field[type][validatorName], validatorName));
      }
    }
    defineHiddenProp(field, "_" + type, validators);
  }
  getPredefinedFieldValidation(field) {
    let VALIDATORS = [];
    FORMLY_VALIDATORS.forEach((opt) => observe(field, ["props", opt], ({
      currentValue,
      firstChange
    }) => {
      VALIDATORS = VALIDATORS.filter((o) => o !== opt);
      if (opt === "required" && currentValue != null && typeof currentValue !== "boolean") {
        console.warn(`Formly: Invalid prop 'required' of type '${typeof currentValue}', expected 'boolean' (Field:${field.key}).`);
      }
      if (currentValue != null && currentValue !== false) {
        VALIDATORS.push(opt);
      }
      if (!firstChange && field.formControl) {
        updateValidity(field.formControl);
      }
    }));
    return (control) => {
      if (VALIDATORS.length === 0) {
        return null;
      }
      return Validators.compose(VALIDATORS.map((opt) => () => {
        const value = field.props[opt];
        switch (opt) {
          case "required":
            return Validators.required(control);
          case "pattern":
            return Validators.pattern(value)(control);
          case "minLength":
            const minLengthResult = Validators.minLength(value)(control);
            const minLengthKey = this.config.getValidatorMessage("minlength") || field.validation?.messages?.minlength ? "minlength" : "minLength";
            return minLengthResult ? {
              [minLengthKey]: minLengthResult.minlength
            } : null;
          case "maxLength":
            const maxLengthResult = Validators.maxLength(value)(control);
            const maxLengthKey = this.config.getValidatorMessage("maxlength") || field.validation?.messages?.maxlength ? "maxlength" : "maxLength";
            return maxLengthResult ? {
              [maxLengthKey]: maxLengthResult.maxlength
            } : null;
          case "min":
            return Validators.min(value)(control);
          case "max":
            return Validators.max(value)(control);
          default:
            return null;
        }
      }))(control);
    };
  }
  wrapNgValidatorFn(field, validator, validatorName) {
    let validatorOption;
    if (typeof validator === "string") {
      validatorOption = clone(this.config.getValidator(validator));
    }
    if (typeof validator === "object" && validator.name) {
      validatorOption = clone(this.config.getValidator(validator.name));
      if (validator.options) {
        validatorOption.options = validator.options;
      }
    }
    if (typeof validator === "object" && validator.expression) {
      const _a = validator, {
        expression
      } = _a, options = __objRest(_a, [
        "expression"
      ]);
      validatorOption = {
        name: validatorName,
        validation: expression,
        options: Object.keys(options).length > 0 ? options : null
      };
    }
    if (typeof validator === "function") {
      validatorOption = {
        name: validatorName,
        validation: validator
      };
    }
    return (control) => {
      const errors = validatorOption.validation(control, field, validatorOption.options);
      if (isPromise(errors)) {
        return errors.then((v) => this.handleResult(field, validatorName ? !!v : v, validatorOption));
      }
      if (isObservable(errors)) {
        return errors.pipe(map((v) => this.handleResult(field, validatorName ? !!v : v, validatorOption)));
      }
      return this.handleResult(field, validatorName ? !!errors : errors, validatorOption);
    };
  }
  handleResult(field, errors, {
    name,
    options
  }) {
    if (typeof errors === "boolean") {
      errors = errors ? null : {
        [name]: options ? options : true
      };
    }
    const ctrl = field.formControl;
    ctrl?._childrenErrors?.[name]?.();
    if (isObject(errors)) {
      Object.keys(errors).forEach((name2) => {
        const errorPath = errors[name2].errorPath ? errors[name2].errorPath : options?.errorPath;
        const childCtrl = errorPath ? field.formControl.get(errorPath) : null;
        if (childCtrl) {
          const _a = errors[name2], {
            errorPath: _errorPath
          } = _a, opts = __objRest(_a, [
            "errorPath"
          ]);
          childCtrl.setErrors(__spreadProps(__spreadValues({}, childCtrl.errors || {}), {
            [name2]: opts
          }));
          !ctrl._childrenErrors && defineHiddenProp(ctrl, "_childrenErrors", {});
          ctrl._childrenErrors[name2] = () => {
            const _a2 = childCtrl.errors || {}, {
              [name2]: _toDelete
            } = _a2, childErrors = __objRest(_a2, [
              __restKey(name2)
            ]);
            childCtrl.setErrors(Object.keys(childErrors).length === 0 ? null : childErrors);
          };
        }
      });
    }
    return errors;
  }
};
var _FieldType = class _FieldType {
  constructor() {
    this.field = {};
  }
  set _formlyControls(controls) {
    const f = this.field;
    f._localFields = controls.map((c) => c.control._fields || []).flat().filter((f2) => f2.formControl !== this.field.formControl);
  }
  get model() {
    return this.field.model;
  }
  get form() {
    return this.field.form;
  }
  get options() {
    return this.field.options;
  }
  get key() {
    return this.field.key;
  }
  get formControl() {
    return this.field.formControl;
  }
  get props() {
    return this.field.props || {};
  }
  /** @deprecated Use `props` instead. */
  get to() {
    return this.props;
  }
  get showError() {
    return this.options.showError(this);
  }
  get id() {
    return this.field.id;
  }
  get formState() {
    return this.options?.formState || {};
  }
};
_FieldType.\u0275fac = function FieldType_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FieldType)();
};
_FieldType.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FieldType,
  viewQuery: function FieldType_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(NgControl, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._formlyControls = _t);
    }
  },
  inputs: {
    field: "field"
  },
  standalone: false
});
var FieldType = _FieldType;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldType, [{
    type: Directive
  }], null, {
    _formlyControls: [{
      type: ViewChildren,
      args: [NgControl]
    }],
    field: [{
      type: Input
    }]
  });
})();
var _FormlyTemplateType = class _FormlyTemplateType extends FieldType {
  get template() {
    if (this.field && this.field.template !== this.innerHtml.template) {
      this.innerHtml = {
        template: this.field.template,
        content: this.props.safeHtml ? this.sanitizer.bypassSecurityTrustHtml(this.field.template) : this.field.template
      };
    }
    return this.innerHtml.content;
  }
  constructor(sanitizer) {
    super();
    this.sanitizer = sanitizer;
    this.innerHtml = {};
  }
};
_FormlyTemplateType.\u0275fac = function FormlyTemplateType_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyTemplateType)(\u0275\u0275directiveInject(DomSanitizer));
};
_FormlyTemplateType.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyTemplateType,
  selectors: [["formly-template"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 1,
  vars: 1,
  consts: [[3, "innerHtml"]],
  template: function FormlyTemplateType_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("innerHtml", ctx.template, \u0275\u0275sanitizeHtml);
    }
  },
  encapsulation: 2,
  changeDetection: 0
});
var FormlyTemplateType = _FormlyTemplateType;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyTemplateType, [{
    type: Component,
    args: [{
      selector: "formly-template",
      template: `<div [innerHtml]="template"></div>`,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [{
    type: DomSanitizer
  }], null);
})();
var _FormlyConfig = class _FormlyConfig {
  constructor() {
    this.types = {};
    this.validators = {};
    this.wrappers = {};
    this.messages = {};
    this.extras = {
      checkExpressionOn: "modelChange",
      lazyRender: true,
      resetFieldOnHide: true,
      renderFormlyFieldElement: true,
      showError(field) {
        return field.formControl?.invalid && (field.formControl?.touched || field.options.parentForm?.submitted || !!field.field.validation?.show);
      }
    };
    this.extensions = {};
    this.presets = {};
    this.extensionsByPriority = {};
    this.componentRefs = {};
  }
  addConfig(config) {
    if (Array.isArray(config)) {
      config.forEach((c) => this.addConfig(c));
      return;
    }
    if (config.types) {
      config.types.forEach((type) => this.setType(type));
    }
    if (config.validators) {
      config.validators.forEach((validator) => this.setValidator(validator));
    }
    if (config.wrappers) {
      config.wrappers.forEach((wrapper) => this.setWrapper(wrapper));
    }
    if (config.validationMessages) {
      config.validationMessages.forEach((validation) => this.addValidatorMessage(validation.name, validation.message));
    }
    if (config.extensions) {
      this.setSortedExtensions(config.extensions);
    }
    if (config.extras) {
      this.extras = __spreadValues(__spreadValues({}, this.extras), config.extras);
    }
    if (config.presets) {
      this.presets = __spreadValues(__spreadValues({}, this.presets), config.presets.reduce((acc, curr) => __spreadProps(__spreadValues({}, acc), {
        [curr.name]: curr.config
      }), {}));
    }
  }
  /**
   * Allows you to specify a custom type which you can use in your field configuration.
   * You can pass an object of options, or an array of objects of options.
   */
  setType(options) {
    if (Array.isArray(options)) {
      options.forEach((option) => this.setType(option));
    } else {
      if (!this.types[options.name]) {
        this.types[options.name] = {
          name: options.name
        };
      }
      ["component", "extends", "defaultOptions", "wrappers"].forEach((prop) => {
        if (options.hasOwnProperty(prop)) {
          this.types[options.name][prop] = options[prop];
        }
      });
    }
  }
  getType(name, throwIfNotFound = false) {
    if (name instanceof Type) {
      return {
        component: name,
        name: name.prototype.constructor.name
      };
    }
    if (!this.types[name]) {
      if (throwIfNotFound) {
        throw new Error(`[Formly Error] The type "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`);
      }
      return null;
    }
    this.mergeExtendedType(name);
    return this.types[name];
  }
  /** @ignore */
  getMergedField(field = {}) {
    const type = this.getType(field.type);
    if (!type) {
      return;
    }
    if (type.defaultOptions) {
      reverseDeepMerge(field, type.defaultOptions);
    }
    const extendDefaults = type.extends && this.getType(type.extends).defaultOptions;
    if (extendDefaults) {
      reverseDeepMerge(field, extendDefaults);
    }
    if (field?.optionsTypes) {
      field.optionsTypes.forEach((option) => {
        const defaultOptions = this.getType(option).defaultOptions;
        if (defaultOptions) {
          reverseDeepMerge(field, defaultOptions);
        }
      });
    }
    const componentRef = this.resolveFieldTypeRef(field);
    if (componentRef?.instance?.defaultOptions) {
      reverseDeepMerge(field, componentRef.instance.defaultOptions);
    }
    if (!field.wrappers && type.wrappers) {
      field.wrappers = [...type.wrappers];
    }
  }
  /** @ignore @internal */
  resolveFieldTypeRef(field = {}) {
    const type = this.getType(field.type);
    if (!type) {
      return null;
    }
    if (!type.component) {
      return null;
    }
    if (!this.componentRefs[type.name]) {
      const {
        _viewContainerRef,
        _injector
      } = field.options;
      if (!_viewContainerRef || !_injector) {
        return null;
      }
      const componentRef = _viewContainerRef.createComponent(type.component, {
        injector: _injector
      });
      this.componentRefs[type.name] = componentRef;
      try {
        componentRef.destroy();
      } catch (e) {
        console.error(`An error occurred while destroying the Formly component type "${field.type}"`, e);
      }
    }
    return this.componentRefs[type.name];
  }
  /** @ignore @internal */
  clearRefs() {
    this.componentRefs = {};
  }
  setWrapper(options) {
    this.wrappers[options.name] = options;
    if (options.types) {
      options.types.forEach((type) => {
        this.setTypeWrapper(type, options.name);
      });
    }
  }
  getWrapper(name) {
    if (name instanceof Type) {
      return {
        component: name,
        name: name.prototype.constructor.name
      };
    }
    if (!this.wrappers[name]) {
      throw new Error(`[Formly Error] The wrapper "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`);
    }
    return this.wrappers[name];
  }
  /** @ignore */
  setTypeWrapper(type, name) {
    if (!this.types[type]) {
      this.types[type] = {};
    }
    if (!this.types[type].wrappers) {
      this.types[type].wrappers = [];
    }
    if (this.types[type].wrappers.indexOf(name) === -1) {
      this.types[type].wrappers.push(name);
    }
  }
  setValidator(options) {
    this.validators[options.name] = options;
  }
  getValidator(name) {
    if (!this.validators[name]) {
      throw new Error(`[Formly Error] The validator "${name}" could not be found. Please make sure that is registered through the FormlyModule declaration.`);
    }
    return this.validators[name];
  }
  addValidatorMessage(name, message) {
    this.messages[name] = message;
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      const deprecated = {
        minlength: "minLength",
        maxlength: "maxLength"
      };
      if (deprecated[name]) {
        console.warn(`Formly deprecation: passing validation messages key '${name}' is deprecated since v6.0, use '${deprecated[name]}' instead.`);
        this.messages[deprecated[name]] = message;
      }
    }
  }
  getValidatorMessage(name) {
    return this.messages[name];
  }
  setSortedExtensions(extensionOptions) {
    extensionOptions.forEach((extensionOption) => {
      const priority = extensionOption.priority ?? 1;
      this.extensionsByPriority[priority] = __spreadProps(__spreadValues({}, this.extensionsByPriority[priority]), {
        [extensionOption.name]: extensionOption.extension
      });
    });
    this.extensions = Object.keys(this.extensionsByPriority).map(Number).sort((a, b) => a - b).reduce((acc, prio) => __spreadValues(__spreadValues({}, acc), this.extensionsByPriority[prio]), {});
  }
  mergeExtendedType(name) {
    if (!this.types[name].extends) {
      return;
    }
    const extendedType = this.getType(this.types[name].extends);
    if (!this.types[name].component) {
      this.types[name].component = extendedType.component;
    }
    if (!this.types[name].wrappers) {
      this.types[name].wrappers = extendedType.wrappers;
    }
  }
};
_FormlyConfig.\u0275fac = function FormlyConfig_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyConfig)();
};
_FormlyConfig.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _FormlyConfig,
  factory: _FormlyConfig.\u0275fac,
  providedIn: "root"
});
var FormlyConfig = _FormlyConfig;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyConfig, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _FormlyTemplate = class _FormlyTemplate {
  constructor(ref) {
    this.ref = ref;
  }
  ngOnChanges() {
    this.name = this.name || "formly-group";
  }
};
_FormlyTemplate.\u0275fac = function FormlyTemplate_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyTemplate)(\u0275\u0275directiveInject(TemplateRef));
};
_FormlyTemplate.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FormlyTemplate,
  selectors: [["", "formlyTemplate", ""]],
  inputs: {
    name: [0, "formlyTemplate", "name"]
  },
  standalone: false,
  features: [\u0275\u0275NgOnChangesFeature]
});
var FormlyTemplate = _FormlyTemplate;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyTemplate, [{
    type: Directive,
    args: [{
      selector: "[formlyTemplate]"
    }]
  }], () => [{
    type: TemplateRef
  }], {
    name: [{
      type: Input,
      args: ["formlyTemplate"]
    }]
  });
})();
var _FormlyFieldTemplates = class _FormlyFieldTemplates {
};
_FormlyFieldTemplates.\u0275fac = function FormlyFieldTemplates_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyFieldTemplates)();
};
_FormlyFieldTemplates.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _FormlyFieldTemplates,
  factory: _FormlyFieldTemplates.\u0275fac
});
var FormlyFieldTemplates = _FormlyFieldTemplates;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyFieldTemplates, [{
    type: Injectable
  }], null, null);
})();
var _FormlyField = class _FormlyField {
  get containerRef() {
    return this.config.extras.renderFormlyFieldElement ? this.viewContainerRef : this.hostContainerRef;
  }
  get elementRef() {
    if (this.config.extras.renderFormlyFieldElement) {
      return this._elementRef;
    }
    if (this.componentRefs?.[0] instanceof ComponentRef$1) {
      return this.componentRefs[0].location;
    }
    return null;
  }
  constructor(config, renderer, _elementRef, hostContainerRef, form) {
    this.config = config;
    this.renderer = renderer;
    this._elementRef = _elementRef;
    this.hostContainerRef = hostContainerRef;
    this.form = form;
    this.hostObservers = [];
    this.componentRefs = [];
    this.hooksObservers = [];
    this.detectFieldBuild = false;
    this.valueChangesUnsubscribe = () => {
    };
  }
  ngAfterContentInit() {
    this.triggerHook("afterContentInit");
  }
  ngAfterViewInit() {
    this.triggerHook("afterViewInit");
  }
  ngDoCheck() {
    if (this.detectFieldBuild && this.field && this.field.options) {
      this.render();
    }
  }
  ngOnInit() {
    this.triggerHook("onInit");
  }
  ngOnChanges(changes) {
    this.triggerHook("onChanges", changes);
  }
  ngOnDestroy() {
    this.resetRefs(this.field);
    this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
    this.hooksObservers.forEach((unsubscribe) => unsubscribe());
    this.valueChangesUnsubscribe();
    this.triggerHook("onDestroy");
  }
  renderField(containerRef, f, wrappers = []) {
    if (this.containerRef === containerRef) {
      this.resetRefs(this.field);
      this.containerRef.clear();
      wrappers = this.field?.wrappers;
    }
    if (wrappers?.length > 0) {
      const [wrapper, ...wps] = wrappers;
      const {
        component
      } = this.config.getWrapper(wrapper);
      const ref = containerRef.createComponent(component);
      this.attachComponentRef(ref, f);
      observe(ref.instance, ["fieldComponent"], ({
        currentValue,
        previousValue,
        firstChange
      }) => {
        if (currentValue) {
          if (previousValue && previousValue._lContainer === currentValue._lContainer) {
            return;
          }
          const viewRef = previousValue ? previousValue.detach() : null;
          if (viewRef && !viewRef.destroyed) {
            currentValue.insert(viewRef);
          } else {
            this.renderField(currentValue, f, wps);
          }
          !firstChange && ref.changeDetectorRef.detectChanges();
        }
      });
    } else if (f?.type) {
      const inlineType = this.form?.templates?.find((ref2) => ref2.name === f.type);
      let ref;
      if (inlineType) {
        ref = containerRef.createEmbeddedView(inlineType.ref, {
          $implicit: f
        });
      } else {
        const {
          component
        } = this.config.getType(f.type, true);
        ref = containerRef.createComponent(component);
      }
      this.attachComponentRef(ref, f);
    }
  }
  triggerHook(name, changes) {
    if (name === "onInit" || name === "onChanges" && changes.field && !changes.field.firstChange) {
      this.valueChangesUnsubscribe();
      this.valueChangesUnsubscribe = this.fieldChanges(this.field);
    }
    if (this.field?.hooks?.[name]) {
      if (!changes || changes.field) {
        const r = this.field.hooks[name](this.field);
        if (isObservable(r) && ["onInit", "afterContentInit", "afterViewInit"].indexOf(name) !== -1) {
          const sub = r.subscribe();
          this.hooksObservers.push(() => sub.unsubscribe());
        }
      }
    }
    if (name === "onChanges" && changes.field) {
      this.resetRefs(changes.field.previousValue);
      this.render();
    }
  }
  attachComponentRef(ref, field) {
    this.componentRefs.push(ref);
    field._componentRefs.push(ref);
    if (ref instanceof ComponentRef$1) {
      Object.assign(ref.instance, {
        field
      });
    }
  }
  render() {
    if (!this.field) {
      return;
    }
    if (!this.field.options) {
      this.detectFieldBuild = true;
      return;
    }
    this.detectFieldBuild = false;
    this.hostObservers.forEach((hostObserver) => hostObserver.unsubscribe());
    this.hostObservers = [observe(this.field, ["hide"], ({
      firstChange,
      currentValue
    }) => {
      const containerRef = this.containerRef;
      if (this.config.extras.lazyRender === false) {
        firstChange && this.renderField(containerRef, this.field);
        if (!firstChange || firstChange && currentValue) {
          this.elementRef && this.renderer.setStyle(this.elementRef.nativeElement, "display", currentValue ? "none" : "");
        }
      } else {
        if (currentValue) {
          containerRef.clear();
          if (this.field.className) {
            this.renderer.removeAttribute(this.elementRef.nativeElement, "class");
          }
        } else {
          this.renderField(containerRef, this.field);
          if (this.field.className) {
            this.renderer.setAttribute(this.elementRef.nativeElement, "class", this.field.className);
          }
        }
      }
      !firstChange && this.field.options.detectChanges(this.field);
    }), observe(this.field, ["className"], ({
      firstChange,
      currentValue
    }) => {
      if ((!firstChange || firstChange && currentValue) && (!this.config.extras.lazyRender || this.field.hide !== true)) {
        this.elementRef && this.renderer.setAttribute(this.elementRef.nativeElement, "class", currentValue);
      }
    })];
    if (!isSignalRequired()) {
      ["touched", "pristine", "status"].forEach((prop) => this.hostObservers.push(observe(this.field, ["formControl", prop], ({
        firstChange
      }) => !firstChange && markFieldForCheck(this.field))));
    } else if (this.field.formControl) {
      const events = this.field.formControl.events.subscribe(() => markFieldForCheck(this.field));
      this.hostObservers.push(events);
    }
  }
  resetRefs(field) {
    if (field) {
      if (field._localFields) {
        field._localFields = [];
      } else {
        defineHiddenProp(this.field, "_localFields", []);
      }
      if (field._componentRefs) {
        field._componentRefs = field._componentRefs.filter((ref) => this.componentRefs.indexOf(ref) === -1);
      } else {
        defineHiddenProp(this.field, "_componentRefs", []);
      }
    }
    this.componentRefs = [];
  }
  fieldChanges(field) {
    if (!field) {
      return () => {
      };
    }
    const propsObserver = observeDeep(field, ["props"], () => field.options.detectChanges(field));
    const subscribes = [() => {
      propsObserver();
    }];
    for (const key of Object.keys(field._expressions || {})) {
      const expressionObserver = observe(field, ["_expressions", key], ({
        currentValue,
        previousValue
      }) => {
        if (previousValue?.subscription) {
          previousValue.subscription.unsubscribe();
          previousValue.subscription = null;
        }
        if (isObservable(currentValue.value$)) {
          currentValue.subscription = currentValue.value$.subscribe();
        }
      });
      subscribes.push(() => {
        if (field._expressions[key]?.subscription) {
          field._expressions[key].subscription.unsubscribe();
        }
        expressionObserver.unsubscribe();
      });
    }
    for (const path of [["focus"], ["template"], ["fieldGroupClassName"], ["validation", "show"]]) {
      const fieldObserver = observe(field, path, ({
        firstChange
      }) => !firstChange && field.options.detectChanges(field));
      subscribes.push(() => fieldObserver.unsubscribe());
    }
    if (field.formControl && !field.fieldGroup) {
      const control = field.formControl;
      let valueChanges = control.valueChanges.pipe(map((value) => {
        field.parsers?.map((parserFn) => value = parserFn(value, field));
        if (!Object.is(value, field.formControl.value)) {
          field.formControl.setValue(value);
        }
        return value;
      }), distinctUntilChanged((x, y) => {
        if (x !== y || Array.isArray(x) || isObject(x)) {
          return false;
        }
        return true;
      }));
      if (control.value !== getFieldValue(field)) {
        valueChanges = valueChanges.pipe(startWith(control.value));
      }
      const {
        updateOn,
        debounce
      } = field.modelOptions;
      if ((!updateOn || updateOn === "change") && debounce?.default > 0) {
        valueChanges = valueChanges.pipe(debounceTime(debounce.default));
      }
      const sub = valueChanges.subscribe((value) => {
        if (control._fields?.length > 1 && control instanceof FormControl) {
          control.patchValue(value, {
            emitEvent: false,
            onlySelf: true
          });
        }
        if (hasKey(field)) {
          assignFieldValue(field, value);
        }
        field.options.fieldChanges.next({
          value,
          field,
          type: "valueChanges"
        });
      });
      subscribes.push(() => sub.unsubscribe());
    }
    let templateFieldsSubs = [];
    observe(field, ["_localFields"], ({
      currentValue
    }) => {
      templateFieldsSubs.forEach((unsubscribe) => unsubscribe());
      templateFieldsSubs = (currentValue || []).map((f) => this.fieldChanges(f));
    });
    return () => {
      subscribes.forEach((unsubscribe) => unsubscribe());
      templateFieldsSubs.forEach((unsubscribe) => unsubscribe());
    };
  }
};
_FormlyField.\u0275fac = function FormlyField_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyField)(\u0275\u0275directiveInject(FormlyConfig), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ViewContainerRef), \u0275\u0275directiveInject(FormlyFieldTemplates, 8));
};
_FormlyField.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyField,
  selectors: [["formly-field"]],
  viewQuery: function FormlyField_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 7, ViewContainerRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.viewContainerRef = _t.first);
    }
  },
  inputs: {
    field: "field"
  },
  features: [\u0275\u0275NgOnChangesFeature],
  decls: 2,
  vars: 0,
  consts: [["container", ""]],
  template: function FormlyField_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domTemplate(0, FormlyField_ng_template_0_Template, 0, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  },
  styles: ["[_nghost-%COMP%]:empty{display:none}"]
});
var FormlyField = _FormlyField;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyField, [{
    type: Component,
    args: [{
      selector: "formly-field",
      template: "<ng-template #container></ng-template>",
      standalone: true,
      styles: [":host:empty{display:none}\n"]
    }]
  }], () => [{
    type: FormlyConfig
  }, {
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: ViewContainerRef
  }, {
    type: FormlyFieldTemplates,
    decorators: [{
      type: Optional
    }]
  }], {
    field: [{
      type: Input
    }],
    viewContainerRef: [{
      type: ViewChild,
      args: ["container", {
        read: ViewContainerRef,
        static: true
      }]
    }]
  });
})();
var _LegacyFormlyField = class _LegacyFormlyField extends FormlyField {
};
_LegacyFormlyField.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275LegacyFormlyField_BaseFactory;
  return function LegacyFormlyField_Factory(__ngFactoryType__) {
    return (\u0275LegacyFormlyField_BaseFactory || (\u0275LegacyFormlyField_BaseFactory = \u0275\u0275getInheritedFactory(_LegacyFormlyField)))(__ngFactoryType__ || _LegacyFormlyField);
  };
})();
_LegacyFormlyField.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _LegacyFormlyField,
  selectors: [["formly-field"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["container", ""]],
  template: function LegacyFormlyField_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, LegacyFormlyField_ng_template_0_Template, 0, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  },
  styles: ["[_nghost-%COMP%]:empty{display:none}"]
});
var LegacyFormlyField = _LegacyFormlyField;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LegacyFormlyField, [{
    type: Component,
    args: [{
      selector: "formly-field",
      template: "<ng-template #container></ng-template>",
      standalone: false,
      styles: [":host:empty{display:none}\n"]
    }]
  }], null, null);
})();
var _FormlyGroup = class _FormlyGroup extends FieldType {
};
_FormlyGroup.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FormlyGroup_BaseFactory;
  return function FormlyGroup_Factory(__ngFactoryType__) {
    return (\u0275FormlyGroup_BaseFactory || (\u0275FormlyGroup_BaseFactory = \u0275\u0275getInheritedFactory(_FormlyGroup)))(__ngFactoryType__ || _FormlyGroup);
  };
})();
_FormlyGroup.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyGroup,
  selectors: [["formly-group"]],
  hostVars: 2,
  hostBindings: function FormlyGroup_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275classMap(ctx.field.fieldGroupClassName || "");
    }
  },
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  ngContentSelectors: _c1,
  decls: 3,
  vars: 0,
  consts: [[3, "field"]],
  template: function FormlyGroup_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275repeaterCreate(0, FormlyGroup_For_1_Template, 1, 1, "formly-field", 0, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275projection(2);
    }
    if (rf & 2) {
      \u0275\u0275repeater(ctx.field.fieldGroup);
    }
  },
  dependencies: [LegacyFormlyField],
  encapsulation: 2,
  changeDetection: 0
});
var FormlyGroup = _FormlyGroup;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyGroup, [{
    type: Component,
    args: [{
      selector: "formly-group",
      template: `
    @for (f of field.fieldGroup; track $index) {
      <formly-field [field]="f"></formly-field>
    }
    <ng-content></ng-content>
  `,
      host: {
        "[class]": 'field.fieldGroupClassName || ""'
      },
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var FORMLY_CONFIG = new InjectionToken("FORMLY_CONFIG");
function withDefaultConfig(config) {
  return {
    types: [{
      name: "formly-group",
      component: FormlyGroup
    }, {
      name: "formly-template",
      component: FormlyTemplateType
    }],
    extensions: [{
      name: "core",
      extension: new CoreExtension(config),
      priority: -250
    }, {
      name: "field-validation",
      extension: new FieldValidationExtension(config),
      priority: -200
    }, {
      name: "field-form",
      extension: new FieldFormExtension(),
      priority: -150
    }, {
      name: "field-expression",
      extension: new FieldExpressionExtension(),
      priority: -100
    }]
  };
}
var _FormlyFormBuilder = class _FormlyFormBuilder {
  constructor(config, injector, viewContainerRef, parentForm, configs = []) {
    this.config = config;
    this.injector = injector;
    this.viewContainerRef = viewContainerRef;
    this.parentForm = parentForm;
    if (configs) {
      configs.forEach((c) => config.addConfig(c));
    }
  }
  buildForm(form, fieldGroup = [], model, options) {
    this.build({
      fieldGroup,
      model,
      form,
      options
    });
  }
  build(field) {
    if (!this.config.extensions.core) {
      throw new Error("NgxFormly: missing `forRoot()` call. use `forRoot()` when registering the `FormlyModule`.");
    }
    if (!field.parent) {
      this._setOptions(field);
    }
    disableTreeValidityCall(field.form, () => {
      this._build(field);
      if (!field.parent || field.fieldArray) {
        const options = field.options;
        if (field.parent && isHiddenField(field)) {
          options._hiddenFieldsForCheck?.push({
            field,
            default: false
          });
        }
        options.checkExpressions?.(field, true);
        options._detectChanges?.(field);
      }
    });
  }
  _build(field) {
    if (!field) {
      return;
    }
    const extensions = Object.values(this.config.extensions);
    extensions.forEach((extension) => extension.prePopulate?.(field));
    extensions.forEach((extension) => extension.onPopulate?.(field));
    field.fieldGroup?.forEach((f) => this._build(f));
    extensions.forEach((extension) => extension.postPopulate?.(field));
  }
  _setOptions(field) {
    field.form = field.form || new UntypedFormGroup({});
    field.model = field.model || {};
    field.options = field.options || {};
    const options = field.options;
    if (!options._viewContainerRef) {
      defineHiddenProp(options, "_viewContainerRef", this.viewContainerRef);
    }
    if (!options._injector) {
      defineHiddenProp(options, "_injector", this.injector);
    }
    if (!options.build) {
      options.build = (f = field) => {
        this.build(f);
        return f;
      };
    }
    if (!options.parentForm && this.parentForm) {
      defineHiddenProp(options, "parentForm", this.parentForm);
      if (!isSignalRequired()) {
        observe(options, ["parentForm", "submitted"], ({
          firstChange
        }) => {
          if (!firstChange) {
            options.detectChanges(field);
          }
        });
      }
    }
  }
};
_FormlyFormBuilder.\u0275fac = function FormlyFormBuilder_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyFormBuilder)(\u0275\u0275inject(FormlyConfig), \u0275\u0275inject(Injector), \u0275\u0275inject(ViewContainerRef, 8), \u0275\u0275inject(FormGroupDirective, 8), \u0275\u0275inject(FORMLY_CONFIG, 8));
};
_FormlyFormBuilder.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _FormlyFormBuilder,
  factory: _FormlyFormBuilder.\u0275fac,
  providedIn: "root"
});
var FormlyFormBuilder = _FormlyFormBuilder;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyFormBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: FormlyConfig
  }, {
    type: Injector
  }, {
    type: ViewContainerRef,
    decorators: [{
      type: Optional
    }]
  }, {
    type: FormGroupDirective,
    decorators: [{
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [FORMLY_CONFIG]
    }]
  }], null);
})();
var _FormlyForm = class _FormlyForm {
  /** The form instance which allow to track model value and validation status. */
  set form(form) {
    this.field.form = form;
  }
  get form() {
    return this.field.form;
  }
  /** The model to be represented by the form. */
  set model(model) {
    if (this.config.extras.immutable && this._modelChangeValue === model) {
      return;
    }
    this.setField({
      model
    });
  }
  get model() {
    return this.field.model;
  }
  /** The field configurations for building the form. */
  set fields(fieldGroup) {
    this.setField({
      fieldGroup
    });
  }
  get fields() {
    return this.field.fieldGroup;
  }
  /** Options for the form. */
  set options(options) {
    this.setField({
      options
    });
  }
  get options() {
    return this.field.options;
  }
  set templates(templates) {
    this.fieldTemplates.templates = templates;
  }
  constructor(builder, config, ngZone, fieldTemplates) {
    this.builder = builder;
    this.config = config;
    this.ngZone = ngZone;
    this.fieldTemplates = fieldTemplates;
    this.modelChange = new EventEmitter();
    this.field = {
      type: "formly-group"
    };
    this._modelChangeValue = {};
    this.valueChangesUnsubscribe = () => {
    };
  }
  ngDoCheck() {
    if (this.config.extras.checkExpressionOn === "changeDetectionCheck") {
      this.checkExpressionChange();
    }
  }
  ngOnChanges(changes) {
    if (changes.fields && this.form) {
      clearControl(this.form);
    }
    if (changes.fields || changes.form || changes.model && this._modelChangeValue !== changes.model.currentValue) {
      this.valueChangesUnsubscribe();
      this.builder.build(this.field);
      this.valueChangesUnsubscribe = this.valueChanges();
    }
  }
  ngOnDestroy() {
    this.valueChangesUnsubscribe();
    this.config.clearRefs();
  }
  checkExpressionChange() {
    this.field.options.checkExpressions?.(this.field);
  }
  valueChanges() {
    this.valueChangesUnsubscribe();
    let formEvents = null;
    if (isSignalRequired()) {
      let submitted = this.options?.parentForm?.submitted;
      formEvents = this.form.events.subscribe(() => {
        if (submitted !== this.options?.parentForm?.submitted) {
          this.options.detectChanges(this.field);
          submitted = this.options?.parentForm?.submitted;
        }
      });
    }
    const fieldChangesDetection = [observeDeep(this.field.options, ["formState"], () => this.field.options.detectChanges(this.field))];
    const valueChanges = this.field.options.fieldChanges.pipe(filter(({
      field,
      type
    }) => hasKey(field) && type === "valueChanges"), switchMap(() => isNoopNgZone(this.ngZone) ? of(null) : this.ngZone.onStable.asObservable().pipe(take(1)))).subscribe(() => this.ngZone.runGuarded(() => {
      this.checkExpressionChange();
      this.modelChange.emit(this._modelChangeValue = clone(this.model));
    }));
    return () => {
      fieldChangesDetection.forEach((fnc) => fnc());
      formEvents?.unsubscribe();
      valueChanges.unsubscribe();
    };
  }
  setField(field) {
    if (this.config.extras.immutable) {
      this.field = __spreadValues(__spreadValues({}, this.field), clone(field));
    } else {
      Object.keys(field).forEach((p) => this.field[p] = field[p]);
    }
  }
};
_FormlyForm.\u0275fac = function FormlyForm_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyForm)(\u0275\u0275directiveInject(FormlyFormBuilder), \u0275\u0275directiveInject(FormlyConfig), \u0275\u0275directiveInject(NgZone), \u0275\u0275directiveInject(FormlyFieldTemplates));
};
_FormlyForm.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyForm,
  selectors: [["formly-form"]],
  contentQueries: function FormlyForm_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      \u0275\u0275contentQuery(dirIndex, FormlyTemplate, 4);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.templates = _t);
    }
  },
  inputs: {
    form: "form",
    model: "model",
    fields: "fields",
    options: "options"
  },
  outputs: {
    modelChange: "modelChange"
  },
  features: [\u0275\u0275ProvidersFeature([FormlyFormBuilder, FormlyFieldTemplates]), \u0275\u0275NgOnChangesFeature],
  decls: 1,
  vars: 1,
  consts: [[3, "field"]],
  template: function FormlyForm_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "formly-field", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("field", ctx.field);
    }
  },
  dependencies: [FormlyField],
  encapsulation: 2,
  changeDetection: 0
});
var FormlyForm = _FormlyForm;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyForm, [{
    type: Component,
    args: [{
      selector: "formly-form",
      template: '<formly-field [field]="field"></formly-field>',
      providers: [FormlyFormBuilder, FormlyFieldTemplates],
      imports: [FormlyField],
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true
    }]
  }], () => [{
    type: FormlyFormBuilder
  }, {
    type: FormlyConfig
  }, {
    type: NgZone
  }, {
    type: FormlyFieldTemplates
  }], {
    form: [{
      type: Input
    }],
    model: [{
      type: Input
    }],
    fields: [{
      type: Input
    }],
    options: [{
      type: Input
    }],
    modelChange: [{
      type: Output
    }],
    templates: [{
      type: ContentChildren,
      args: [FormlyTemplate]
    }]
  });
})();
var _LegacyFormlyForm = class _LegacyFormlyForm extends FormlyForm {
};
_LegacyFormlyForm.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275LegacyFormlyForm_BaseFactory;
  return function LegacyFormlyForm_Factory(__ngFactoryType__) {
    return (\u0275LegacyFormlyForm_BaseFactory || (\u0275LegacyFormlyForm_BaseFactory = \u0275\u0275getInheritedFactory(_LegacyFormlyForm)))(__ngFactoryType__ || _LegacyFormlyForm);
  };
})();
_LegacyFormlyForm.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _LegacyFormlyForm,
  selectors: [["formly-form"]],
  standalone: false,
  features: [\u0275\u0275ProvidersFeature([FormlyFormBuilder, FormlyFieldTemplates]), \u0275\u0275InheritDefinitionFeature],
  decls: 1,
  vars: 1,
  consts: [[3, "field"]],
  template: function LegacyFormlyForm_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "formly-field", 0);
    }
    if (rf & 2) {
      \u0275\u0275property("field", ctx.field);
    }
  },
  dependencies: [LegacyFormlyField],
  encapsulation: 2,
  changeDetection: 0
});
var LegacyFormlyForm = _LegacyFormlyForm;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LegacyFormlyForm, [{
    type: Component,
    args: [{
      selector: "formly-form",
      template: '<formly-field [field]="field"></formly-field>',
      providers: [FormlyFormBuilder, FormlyFieldTemplates],
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: false
    }]
  }], null, null);
})();
var _FormlyAttributes = class _FormlyAttributes {
  get props() {
    return this.field.props || {};
  }
  get fieldAttrElements() {
    return this.field?.["_elementRefs"] || [];
  }
  constructor(renderer, elementRef, _document) {
    this.renderer = renderer;
    this.elementRef = elementRef;
    this.uiAttributesCache = {};
    this.uiEvents = {
      listeners: [],
      events: ["click", "keyup", "keydown", "keypress", "focus", "blur", "change", "wheel"],
      callback: (eventName, $event) => {
        switch (eventName) {
          case "focus":
            return this.onFocus($event);
          case "blur":
            return this.onBlur($event);
          case "change":
            return this.onChange($event);
          default:
            return this.props[eventName](this.field, $event);
        }
      }
    };
    this.document = _document;
  }
  ngOnChanges(changes) {
    if (changes.field) {
      this.field.name && this.setAttribute("name", this.field.name);
      this.uiEvents.listeners.forEach((listener) => listener());
      this.uiEvents.events.forEach((eventName) => {
        if (this.props?.[eventName] || ["focus", "blur", "change"].indexOf(eventName) !== -1) {
          this.uiEvents.listeners.push(this.renderer.listen(this.elementRef.nativeElement, eventName, (e) => this.uiEvents.callback(eventName, e)));
        }
      });
      if (this.props?.attributes) {
        observe(this.field, ["props", "attributes"], ({
          currentValue,
          previousValue
        }) => {
          if (previousValue) {
            Object.keys(previousValue).forEach((attr) => this.removeAttribute(attr));
          }
          if (currentValue) {
            Object.keys(currentValue).forEach((attr) => {
              if (currentValue[attr] != null) {
                this.setAttribute(attr, currentValue[attr]);
              }
            });
          }
        });
      }
      this.detachElementRef(changes.field.previousValue);
      this.attachElementRef(changes.field.currentValue);
      if (this.fieldAttrElements.length === 1) {
        !this.id && this.field.id && this.setAttribute("id", this.field.id);
        this.focusObserver = observe(this.field, ["focus"], ({
          currentValue
        }) => {
          this.toggleFocus(currentValue);
        });
      }
    }
    if (changes.id) {
      this.setAttribute("id", this.id);
    }
  }
  /**
   * We need to re-evaluate all the attributes on every change detection cycle, because
   * by using a HostBinding we run into certain edge cases. This means that whatever logic
   * is in here has to be super lean or we risk seriously damaging or destroying the performance.
   *
   * Formly issue: https://github.com/ngx-formly/ngx-formly/issues/1317
   * Material issue: https://github.com/angular/components/issues/14024
   */
  ngDoCheck() {
    if (!this.uiAttributes) {
      const element = this.elementRef.nativeElement;
      this.uiAttributes = [...FORMLY_VALIDATORS, "tabindex", "placeholder", "readonly", "disabled", "step"].filter((attr) => !element.hasAttribute || !element.hasAttribute(attr));
    }
    for (let i = 0; i < this.uiAttributes.length; i++) {
      const attr = this.uiAttributes[i];
      const value = this.props[attr];
      if (this.uiAttributesCache[attr] !== value && (!this.props.attributes || !this.props.attributes.hasOwnProperty(attr.toLowerCase()))) {
        this.uiAttributesCache[attr] = value;
        if (value || value === 0) {
          this.setAttribute(attr, value === true ? attr : `${value}`);
        } else {
          this.removeAttribute(attr);
        }
      }
    }
  }
  ngOnDestroy() {
    this.uiEvents.listeners.forEach((listener) => listener());
    this.detachElementRef(this.field);
    this.focusObserver?.unsubscribe();
  }
  toggleFocus(value) {
    const element = this.fieldAttrElements ? this.fieldAttrElements[0] : null;
    if (!element || !element.nativeElement.focus) {
      return;
    }
    const isFocused = !!this.document.activeElement && this.fieldAttrElements.some(({
      nativeElement
    }) => this.document.activeElement === nativeElement || nativeElement.contains(this.document.activeElement));
    if (value && !isFocused) {
      Promise.resolve().then(() => element.nativeElement.focus());
    } else if (!value && isFocused) {
      Promise.resolve().then(() => element.nativeElement.blur());
    }
  }
  onFocus($event) {
    this.focusObserver?.setValue(true);
    this.props.focus?.(this.field, $event);
  }
  onBlur($event) {
    this.focusObserver?.setValue(false);
    this.props.blur?.(this.field, $event);
  }
  // handle custom `change` event, for regular ones rely on DOM listener
  onHostChange($event) {
    if ($event instanceof Event) {
      return;
    }
    this.onChange($event);
  }
  onChange($event) {
    this.props.change?.(this.field, $event);
    this.field.formControl?.markAsDirty();
  }
  attachElementRef(f) {
    if (!f) {
      return;
    }
    if (f["_elementRefs"]?.indexOf(this.elementRef) === -1) {
      f["_elementRefs"].push(this.elementRef);
    } else {
      defineHiddenProp(f, "_elementRefs", [this.elementRef]);
    }
  }
  detachElementRef(f) {
    const index = f?.["_elementRefs"] ? this.fieldAttrElements.indexOf(this.elementRef) : -1;
    if (index !== -1) {
      f["_elementRefs"].splice(index, 1);
    }
  }
  setAttribute(attr, value) {
    this.renderer.setAttribute(this.elementRef.nativeElement, attr, value);
  }
  removeAttribute(attr) {
    this.renderer.removeAttribute(this.elementRef.nativeElement, attr);
  }
};
_FormlyAttributes.\u0275fac = function FormlyAttributes_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyAttributes)(\u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(DOCUMENT));
};
_FormlyAttributes.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FormlyAttributes,
  selectors: [["", "formlyAttributes", ""]],
  hostBindings: function FormlyAttributes_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("change", function FormlyAttributes_change_HostBindingHandler($event) {
        return ctx.onHostChange($event);
      });
    }
  },
  inputs: {
    field: [0, "formlyAttributes", "field"],
    id: "id"
  },
  features: [\u0275\u0275NgOnChangesFeature]
});
var FormlyAttributes = _FormlyAttributes;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyAttributes, [{
    type: Directive,
    args: [{
      selector: "[formlyAttributes]",
      standalone: true,
      host: {
        "(change)": "onHostChange($event)"
      }
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], {
    field: [{
      type: Input,
      args: ["formlyAttributes"]
    }],
    id: [{
      type: Input
    }]
  });
})();
var _LegacyFormlyAttributes = class _LegacyFormlyAttributes extends FormlyAttributes {
};
_LegacyFormlyAttributes.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275LegacyFormlyAttributes_BaseFactory;
  return function LegacyFormlyAttributes_Factory(__ngFactoryType__) {
    return (\u0275LegacyFormlyAttributes_BaseFactory || (\u0275LegacyFormlyAttributes_BaseFactory = \u0275\u0275getInheritedFactory(_LegacyFormlyAttributes)))(__ngFactoryType__ || _LegacyFormlyAttributes);
  };
})();
_LegacyFormlyAttributes.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _LegacyFormlyAttributes,
  selectors: [["", "formlyAttributes", ""]],
  hostBindings: function LegacyFormlyAttributes_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("change", function LegacyFormlyAttributes_change_HostBindingHandler($event) {
        return ctx.onHostChange($event);
      });
    }
  },
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature]
});
var LegacyFormlyAttributes = _LegacyFormlyAttributes;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LegacyFormlyAttributes, [{
    type: Directive,
    args: [{
      selector: "[formlyAttributes]",
      host: {
        "(change)": "onHostChange($event)"
      }
    }]
  }], null, null);
})();
var _FormlyValidationMessage = class _FormlyValidationMessage {
  constructor(config) {
    this.config = config;
  }
  ngOnChanges() {
    const EXPR_VALIDATORS = FORMLY_VALIDATORS.map((v) => `templateOptions.${v}`);
    this.errorMessage$ = merge(this.field.formControl.statusChanges, !this.field.options ? of(null) : this.field.options.fieldChanges.pipe(filter(({
      field,
      type,
      property
    }) => {
      return field === this.field && type === "expressionChanges" && (property.indexOf("validation") !== -1 || EXPR_VALIDATORS.indexOf(property) !== -1);
    }))).pipe(startWith(null), switchMap(() => isObservable(this.errorMessage) ? this.errorMessage : of(this.errorMessage)));
  }
  get errorMessage() {
    const fieldForm = this.field.formControl;
    for (const error in fieldForm.errors) {
      if (fieldForm.errors.hasOwnProperty(error)) {
        let message = this.config.getValidatorMessage(error);
        if (isObject(fieldForm.errors[error])) {
          if (fieldForm.errors[error].errorPath) {
            return void 0;
          }
          if (fieldForm.errors[error].message) {
            message = fieldForm.errors[error].message;
          }
        }
        if (this.field.validation?.messages?.[error]) {
          message = this.field.validation.messages[error];
        }
        if (this.field.validators?.[error]?.message) {
          message = this.field.validators[error].message;
        }
        if (this.field.asyncValidators?.[error]?.message) {
          message = this.field.asyncValidators[error].message;
        }
        if (typeof message === "function") {
          return message(fieldForm.errors[error], this.field);
        }
        return message;
      }
    }
    return void 0;
  }
};
_FormlyValidationMessage.\u0275fac = function FormlyValidationMessage_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyValidationMessage)(\u0275\u0275directiveInject(FormlyConfig));
};
_FormlyValidationMessage.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyValidationMessage,
  selectors: [["formly-validation-message"]],
  inputs: {
    field: "field"
  },
  features: [\u0275\u0275NgOnChangesFeature],
  decls: 2,
  vars: 3,
  template: function FormlyValidationMessage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275text(0);
      \u0275\u0275pipe(1, "async");
    }
    if (rf & 2) {
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(1, 1, ctx.errorMessage$));
    }
  },
  dependencies: [AsyncPipe],
  encapsulation: 2,
  changeDetection: 0
});
var FormlyValidationMessage = _FormlyValidationMessage;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyValidationMessage, [{
    type: Component,
    args: [{
      selector: "formly-validation-message",
      template: "{{ errorMessage$ | async }}",
      changeDetection: ChangeDetectionStrategy.OnPush,
      standalone: true,
      imports: [AsyncPipe]
    }]
  }], () => [{
    type: FormlyConfig
  }], {
    field: [{
      type: Input
    }]
  });
})();
var _LegacyFormlyValidationMessage = class _LegacyFormlyValidationMessage extends FormlyValidationMessage {
};
_LegacyFormlyValidationMessage.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275LegacyFormlyValidationMessage_BaseFactory;
  return function LegacyFormlyValidationMessage_Factory(__ngFactoryType__) {
    return (\u0275LegacyFormlyValidationMessage_BaseFactory || (\u0275LegacyFormlyValidationMessage_BaseFactory = \u0275\u0275getInheritedFactory(_LegacyFormlyValidationMessage)))(__ngFactoryType__ || _LegacyFormlyValidationMessage);
  };
})();
_LegacyFormlyValidationMessage.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _LegacyFormlyValidationMessage,
  selectors: [["formly-validation-message"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 2,
  vars: 3,
  template: function LegacyFormlyValidationMessage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275text(0);
      \u0275\u0275pipe(1, "async");
    }
    if (rf & 2) {
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(1, 1, ctx.errorMessage$));
    }
  },
  dependencies: [AsyncPipe],
  encapsulation: 2,
  changeDetection: 0
});
var LegacyFormlyValidationMessage = _LegacyFormlyValidationMessage;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LegacyFormlyValidationMessage, [{
    type: Component,
    args: [{
      selector: "formly-validation-message",
      template: "{{ errorMessage$ | async }}",
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var _FieldArrayType = class _FieldArrayType extends FieldType {
  onPopulate(field) {
    if (hasKey(field)) {
      const control = findControl(field);
      registerControl(field, control ? control : new UntypedFormArray([], {
        updateOn: field.modelOptions.updateOn
      }));
    }
    field.fieldGroup = field.fieldGroup || [];
    const length = Array.isArray(field.model) ? field.model.length : 0;
    if (field.fieldGroup.length > length) {
      for (let i = field.fieldGroup.length - 1; i >= length; --i) {
        unregisterControl(field.fieldGroup[i], true);
        field.fieldGroup.splice(i, 1);
      }
    }
    for (let i = field.fieldGroup.length; i < length; i++) {
      const f = __spreadValues({}, clone(typeof field.fieldArray === "function" ? field.fieldArray(field) : field.fieldArray));
      if (f.key !== null) {
        f.key = `${i}`;
      }
      field.fieldGroup.push(f);
    }
  }
  add(i, initialModel, {
    markAsDirty
  } = {
    markAsDirty: true
  }) {
    markAsDirty && this.formControl.markAsDirty();
    i = i == null ? this.field.fieldGroup.length : i;
    if (!this.model) {
      assignFieldValue(this.field, []);
    }
    this.model.splice(i, 0, initialModel ? clone(initialModel) : void 0);
    this.markFieldForCheck(this.field.fieldGroup[i]);
    this._build();
  }
  remove(i, {
    markAsDirty
  } = {
    markAsDirty: true
  }) {
    markAsDirty && this.formControl.markAsDirty();
    this.model.splice(i, 1);
    const field = this.field.fieldGroup[i];
    this.field.fieldGroup.splice(i, 1);
    this.field.fieldGroup.forEach((f, key) => this.updateArrayElementKey(f, `${key}`));
    unregisterControl(field, true);
    this._build();
  }
  _build() {
    const fields = this.field.formControl._fields ?? [this.field];
    fields.forEach((f) => this.options.build(f));
    this.options.fieldChanges.next({
      field: this.field,
      value: getFieldValue(this.field),
      type: "valueChanges"
    });
  }
  updateArrayElementKey(f, newKey) {
    if (hasKey(f)) {
      f.key = newKey;
      return;
    }
    if (!f.fieldGroup?.length) {
      return;
    }
    for (let i = 0; i < f.fieldGroup.length; i++) {
      this.updateArrayElementKey(f.fieldGroup[i], newKey);
    }
  }
  markFieldForCheck(f) {
    if (!f) {
      return;
    }
    f.fieldGroup?.forEach((c) => this.markFieldForCheck(c));
    if (f.hide === false) {
      this.options._hiddenFieldsForCheck.push({
        field: f
      });
    }
  }
};
_FieldArrayType.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FieldArrayType_BaseFactory;
  return function FieldArrayType_Factory(__ngFactoryType__) {
    return (\u0275FieldArrayType_BaseFactory || (\u0275FieldArrayType_BaseFactory = \u0275\u0275getInheritedFactory(_FieldArrayType)))(__ngFactoryType__ || _FieldArrayType);
  };
})();
_FieldArrayType.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FieldArrayType,
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature]
});
var FieldArrayType = _FieldArrayType;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldArrayType, [{
    type: Directive
  }], null, null);
})();
var _FieldWrapper = class _FieldWrapper extends FieldType {
  set _formlyControls(_) {
  }
  set _staticContent(content) {
    this.fieldComponent = content;
  }
};
_FieldWrapper.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FieldWrapper_BaseFactory;
  return function FieldWrapper_Factory(__ngFactoryType__) {
    return (\u0275FieldWrapper_BaseFactory || (\u0275FieldWrapper_BaseFactory = \u0275\u0275getInheritedFactory(_FieldWrapper)))(__ngFactoryType__ || _FieldWrapper);
  };
})();
_FieldWrapper.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FieldWrapper,
  viewQuery: function FieldWrapper_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c2, 5, ViewContainerRef);
      \u0275\u0275viewQuery(_c2, 7, ViewContainerRef);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.fieldComponent = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._staticContent = _t.first);
    }
  },
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature]
});
var FieldWrapper = _FieldWrapper;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldWrapper, [{
    type: Directive
  }], null, {
    fieldComponent: [{
      type: ViewChild,
      args: ["fieldComponent", {
        read: ViewContainerRef
      }]
    }],
    _staticContent: [{
      type: ViewChild,
      args: ["fieldComponent", {
        read: ViewContainerRef,
        static: true
      }]
    }]
  });
})();
var _FormlyModule = class _FormlyModule {
  static forRoot(config = {}) {
    return {
      ngModule: _FormlyModule,
      providers: [{
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: withDefaultConfig,
        deps: [FormlyConfig]
      }, {
        provide: FORMLY_CONFIG,
        useValue: config,
        multi: true
      }, FormlyConfig, FormlyFormBuilder]
    };
  }
  static forChild(config = {}) {
    return {
      ngModule: _FormlyModule,
      providers: [{
        provide: FORMLY_CONFIG,
        multi: true,
        useFactory: withDefaultConfig,
        deps: [FormlyConfig]
      }, {
        provide: FORMLY_CONFIG,
        useValue: config,
        multi: true
      }, FormlyFormBuilder]
    };
  }
};
_FormlyModule.\u0275fac = function FormlyModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyModule)();
};
_FormlyModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyModule,
  declarations: [FormlyTemplate, LegacyFormlyForm, LegacyFormlyField, LegacyFormlyAttributes, LegacyFormlyValidationMessage, FormlyGroup, FormlyTemplateType],
  imports: [CommonModule],
  exports: [FormlyTemplate, LegacyFormlyForm, LegacyFormlyField, LegacyFormlyAttributes, LegacyFormlyValidationMessage, FormlyGroup]
});
_FormlyModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule]
});
var FormlyModule = _FormlyModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyModule, [{
    type: NgModule,
    args: [{
      declarations: [FormlyTemplate, LegacyFormlyForm, LegacyFormlyField, LegacyFormlyAttributes, LegacyFormlyValidationMessage, FormlyGroup, FormlyTemplateType],
      exports: [FormlyTemplate, LegacyFormlyForm, LegacyFormlyField, LegacyFormlyAttributes, LegacyFormlyValidationMessage, FormlyGroup],
      imports: [CommonModule]
    }]
  }], null, null);
})();

// node_modules/@ngx-formly/bootstrap/fesm2022/ngx-formly-bootstrap-form-field.mjs
function FormlyWrapperFormField_ng_template_0_label_0_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function FormlyWrapperFormField_ng_template_0_label_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 6);
    \u0275\u0275text(1);
    \u0275\u0275template(2, FormlyWrapperFormField_ng_template_0_label_0_span_2_Template, 2, 0, "span", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("for", ctx_r0.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.props.label, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.props.required && ctx_r0.props.hideRequiredMarker !== true);
  }
}
function FormlyWrapperFormField_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FormlyWrapperFormField_ng_template_0_label_0_Template, 3, 3, "label", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", ctx_r0.props.label && ctx_r0.props.hideLabel !== true);
  }
}
function FormlyWrapperFormField_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementContainer(1, 9);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const labelTemplate_r2 = \u0275\u0275reference(1);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", labelTemplate_r2);
  }
}
function FormlyWrapperFormField_ng_template_4_Template(rf, ctx) {
}
function FormlyWrapperFormField_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementContainer(1, 9);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const labelTemplate_r2 = \u0275\u0275reference(1);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", labelTemplate_r2);
  }
}
function FormlyWrapperFormField_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "formly-validation-message", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("display", "block");
    \u0275\u0275advance();
    \u0275\u0275property("id", \u0275\u0275interpolate1("", ctx_r0.id, "-formly-validation-error"))("field", ctx_r0.field);
  }
}
function FormlyWrapperFormField_small_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.props.description);
  }
}
var _c02 = ["fieldTypeTemplate"];
var _FormlyWrapperFormField = class _FormlyWrapperFormField extends FieldWrapper {
};
_FormlyWrapperFormField.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FormlyWrapperFormField_BaseFactory;
  return function FormlyWrapperFormField_Factory(__ngFactoryType__) {
    return (\u0275FormlyWrapperFormField_BaseFactory || (\u0275FormlyWrapperFormField_BaseFactory = \u0275\u0275getInheritedFactory(_FormlyWrapperFormField)))(__ngFactoryType__ || _FormlyWrapperFormField);
  };
})();
_FormlyWrapperFormField.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyWrapperFormField,
  selectors: [["formly-wrapper-form-field"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 9,
  vars: 8,
  consts: [["labelTemplate", ""], ["fieldComponent", ""], [4, "ngIf"], ["class", "invalid-feedback", 3, "display", 4, "ngIf"], ["class", "form-text text-muted", 4, "ngIf"], ["class", "form-label", 4, "ngIf"], [1, "form-label"], ["aria-hidden", "true", 4, "ngIf"], ["aria-hidden", "true"], [3, "ngTemplateOutlet"], [1, "invalid-feedback"], ["role", "alert", 3, "id", "field"], [1, "form-text", "text-muted"]],
  template: function FormlyWrapperFormField_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormlyWrapperFormField_ng_template_0_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementStart(2, "div");
      \u0275\u0275template(3, FormlyWrapperFormField_ng_container_3_Template, 2, 1, "ng-container", 2)(4, FormlyWrapperFormField_ng_template_4_Template, 0, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(6, FormlyWrapperFormField_ng_container_6_Template, 2, 1, "ng-container", 2)(7, FormlyWrapperFormField_div_7_Template, 2, 5, "div", 3)(8, FormlyWrapperFormField_small_8_Template, 2, 1, "small", 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275classProp("form-floating", ctx.props.labelPosition === "floating")("has-error", ctx.showError);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.props.labelPosition !== "floating");
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.props.labelPosition === "floating");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.showError);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.props.description);
    }
  },
  dependencies: [NgIf, NgTemplateOutlet, LegacyFormlyValidationMessage],
  styles: ["[_nghost-%COMP%]{display:block;margin-bottom:1rem}"]
});
var FormlyWrapperFormField = _FormlyWrapperFormField;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyWrapperFormField, [{
    type: Component,
    args: [{
      selector: "formly-wrapper-form-field",
      template: `
    <ng-template #labelTemplate>
      <label *ngIf="props.label && props.hideLabel !== true" [attr.for]="id" class="form-label">
        {{ props.label }}
        <span *ngIf="props.required && props.hideRequiredMarker !== true" aria-hidden="true">*</span>
      </label>
    </ng-template>

    <div [class.form-floating]="props.labelPosition === 'floating'" [class.has-error]="showError">
      <ng-container *ngIf="props.labelPosition !== 'floating'">
        <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
      </ng-container>

      <ng-template #fieldComponent></ng-template>

      <ng-container *ngIf="props.labelPosition === 'floating'">
        <ng-container [ngTemplateOutlet]="labelTemplate"></ng-container>
      </ng-container>

      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message
          id="{{ id }}-formly-validation-error"
          [field]="field"
          role="alert"
        ></formly-validation-message>
      </div>

      <small *ngIf="props.description" class="form-text text-muted">{{ props.description }}</small>
    </div>
  `,
      styles: [":host{display:block;margin-bottom:1rem}\n"]
    }]
  }], null, null);
})();
function withFormlyFormField() {
  return {
    wrappers: [{
      name: "form-field",
      component: FormlyWrapperFormField
    }]
  };
}
var _FormlyBootstrapFormFieldModule = class _FormlyBootstrapFormFieldModule {
};
_FormlyBootstrapFormFieldModule.\u0275fac = function FormlyBootstrapFormFieldModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyBootstrapFormFieldModule)();
};
_FormlyBootstrapFormFieldModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyBootstrapFormFieldModule,
  declarations: [FormlyWrapperFormField],
  imports: [CommonModule, ReactiveFormsModule, FormlyModule]
});
_FormlyBootstrapFormFieldModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule, ReactiveFormsModule, FormlyModule.forChild(withFormlyFormField())]
});
var FormlyBootstrapFormFieldModule = _FormlyBootstrapFormFieldModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyBootstrapFormFieldModule, [{
    type: NgModule,
    args: [{
      declarations: [FormlyWrapperFormField],
      imports: [CommonModule, ReactiveFormsModule, FormlyModule.forChild(withFormlyFormField())]
    }]
  }], null, null);
})();
var _FieldType2 = class _FieldType2 extends FieldType {
  set content(templateRef) {
    if (templateRef && this.hostContainerRef) {
      this.hostContainerRef.createEmbeddedView(templateRef);
    }
  }
  constructor(hostContainerRef) {
    super();
    this.hostContainerRef = hostContainerRef;
  }
};
_FieldType2.\u0275fac = function FieldType_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FieldType2)(\u0275\u0275directiveInject(ViewContainerRef, 8));
};
_FieldType2.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
  type: _FieldType2,
  viewQuery: function FieldType_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c02, 7);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.content = _t.first);
    }
  },
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature]
});
var FieldType2 = _FieldType2;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldType2, [{
    type: Directive
  }], () => [{
    type: ViewContainerRef,
    decorators: [{
      type: Optional
    }]
  }], {
    content: [{
      type: ViewChild,
      args: ["fieldTypeTemplate", {
        static: true
      }]
    }]
  });
})();

// node_modules/@ngx-formly/bootstrap/fesm2022/ngx-formly-bootstrap-input.mjs
function FormlyFieldInput_ng_template_0_input_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-invalid", ctx_r0.showError);
    \u0275\u0275property("type", ctx_r0.type)("formControl", ctx_r0.formControl)("formlyAttributes", ctx_r0.field);
    \u0275\u0275attribute("aria-describedby", ctx_r0.id + "-formly-validation-error")("aria-invalid", ctx_r0.showError);
  }
}
function FormlyFieldInput_ng_template_0_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 4);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-invalid", ctx_r0.showError);
    \u0275\u0275property("formControl", ctx_r0.formControl)("formlyAttributes", ctx_r0.field);
    \u0275\u0275attribute("aria-describedby", ctx_r0.id + "-formly-validation-error")("aria-invalid", ctx_r0.showError);
  }
}
function FormlyFieldInput_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FormlyFieldInput_ng_template_0_input_0_Template, 1, 7, "input", 2)(1, FormlyFieldInput_ng_template_0_ng_template_1_Template, 1, 6, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const numberTmp_r2 = \u0275\u0275reference(2);
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", ctx_r0.type !== "number")("ngIfElse", numberTmp_r2);
  }
}
var _FormlyFieldInput = class _FormlyFieldInput extends FieldType2 {
  get type() {
    return this.props.type || "text";
  }
};
_FormlyFieldInput.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FormlyFieldInput_BaseFactory;
  return function FormlyFieldInput_Factory(__ngFactoryType__) {
    return (\u0275FormlyFieldInput_BaseFactory || (\u0275FormlyFieldInput_BaseFactory = \u0275\u0275getInheritedFactory(_FormlyFieldInput)))(__ngFactoryType__ || _FormlyFieldInput);
  };
})();
_FormlyFieldInput.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyFieldInput,
  selectors: [["formly-field-input"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["fieldTypeTemplate", ""], ["numberTmp", ""], ["class", "form-control", 3, "type", "formControl", "formlyAttributes", "is-invalid", 4, "ngIf", "ngIfElse"], [1, "form-control", 3, "type", "formControl", "formlyAttributes"], ["type", "number", 1, "form-control", 3, "formControl", "formlyAttributes"]],
  template: function FormlyFieldInput_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormlyFieldInput_ng_template_0_Template, 3, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  },
  dependencies: [NgIf, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, FormControlDirective, LegacyFormlyAttributes],
  encapsulation: 2,
  changeDetection: 0
});
var FormlyFieldInput = _FormlyFieldInput;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyFieldInput, [{
    type: Component,
    args: [{
      selector: "formly-field-input",
      template: `
    <ng-template #fieldTypeTemplate>
      <input
        *ngIf="type !== 'number'; else numberTmp"
        [type]="type"
        [formControl]="formControl"
        class="form-control"
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
        [attr.aria-describedby]="id + '-formly-validation-error'"
        [attr.aria-invalid]="showError"
      />
      <ng-template #numberTmp>
        <input
          type="number"
          [formControl]="formControl"
          class="form-control"
          [formlyAttributes]="field"
          [class.is-invalid]="showError"
          [attr.aria-describedby]="id + '-formly-validation-error'"
          [attr.aria-invalid]="showError"
        />
      </ng-template>
    </ng-template>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
function withFormlyFieldInput() {
  return {
    types: [{
      name: "input",
      component: FormlyFieldInput,
      wrappers: ["form-field"]
    }, {
      name: "string",
      extends: "input"
    }, {
      name: "number",
      extends: "input",
      defaultOptions: {
        props: {
          type: "number"
        }
      }
    }, {
      name: "integer",
      extends: "input",
      defaultOptions: {
        props: {
          type: "number"
        }
      }
    }]
  };
}
var _FormlyBootstrapInputModule = class _FormlyBootstrapInputModule {
};
_FormlyBootstrapInputModule.\u0275fac = function FormlyBootstrapInputModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyBootstrapInputModule)();
};
_FormlyBootstrapInputModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyBootstrapInputModule,
  declarations: [FormlyFieldInput],
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlyModule]
});
_FormlyBootstrapInputModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlyModule.forChild(withFormlyFieldInput())]
});
var FormlyBootstrapInputModule = _FormlyBootstrapInputModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyBootstrapInputModule, [{
    type: NgModule,
    args: [{
      declarations: [FormlyFieldInput],
      imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlyModule.forChild(withFormlyFieldInput())]
    }]
  }], null, null);
})();

// node_modules/@ngx-formly/bootstrap/fesm2022/ngx-formly-bootstrap-textarea.mjs
function FormlyFieldTextArea_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "textarea", 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classProp("is-invalid", ctx_r0.showError);
    \u0275\u0275property("formControl", ctx_r0.formControl)("cols", ctx_r0.props.cols)("rows", ctx_r0.props.rows)("formlyAttributes", ctx_r0.field);
    \u0275\u0275attribute("aria-describedby", ctx_r0.id + "-formly-validation-error")("aria-invalid", ctx_r0.showError);
  }
}
var _FormlyFieldTextArea = class _FormlyFieldTextArea extends FieldType2 {
  constructor() {
    super(...arguments);
    this.defaultOptions = {
      props: {
        cols: 1,
        rows: 1
      }
    };
  }
};
_FormlyFieldTextArea.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FormlyFieldTextArea_BaseFactory;
  return function FormlyFieldTextArea_Factory(__ngFactoryType__) {
    return (\u0275FormlyFieldTextArea_BaseFactory || (\u0275FormlyFieldTextArea_BaseFactory = \u0275\u0275getInheritedFactory(_FormlyFieldTextArea)))(__ngFactoryType__ || _FormlyFieldTextArea);
  };
})();
_FormlyFieldTextArea.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyFieldTextArea,
  selectors: [["formly-field-textarea"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["fieldTypeTemplate", ""], [1, "form-control", 3, "formControl", "cols", "rows", "formlyAttributes"]],
  template: function FormlyFieldTextArea_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormlyFieldTextArea_ng_template_0_Template, 1, 8, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  },
  dependencies: [DefaultValueAccessor, NgControlStatus, FormControlDirective, LegacyFormlyAttributes],
  encapsulation: 2,
  changeDetection: 0
});
var FormlyFieldTextArea = _FormlyFieldTextArea;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyFieldTextArea, [{
    type: Component,
    args: [{
      selector: "formly-field-textarea",
      template: `
    <ng-template #fieldTypeTemplate>
      <textarea
        [formControl]="formControl"
        [cols]="props.cols"
        [rows]="props.rows"
        class="form-control"
        [class.is-invalid]="showError"
        [formlyAttributes]="field"
        [attr.aria-describedby]="id + '-formly-validation-error'"
        [attr.aria-invalid]="showError"
      ></textarea>
    </ng-template>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
function withFormlyFieldTextArea() {
  return {
    types: [{
      name: "textarea",
      component: FormlyFieldTextArea,
      wrappers: ["form-field"]
    }]
  };
}
var _FormlyBootstrapTextAreaModule = class _FormlyBootstrapTextAreaModule {
};
_FormlyBootstrapTextAreaModule.\u0275fac = function FormlyBootstrapTextAreaModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyBootstrapTextAreaModule)();
};
_FormlyBootstrapTextAreaModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyBootstrapTextAreaModule,
  declarations: [FormlyFieldTextArea],
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlyModule]
});
_FormlyBootstrapTextAreaModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlyModule.forChild(withFormlyFieldTextArea())]
});
var FormlyBootstrapTextAreaModule = _FormlyBootstrapTextAreaModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyBootstrapTextAreaModule, [{
    type: NgModule,
    args: [{
      declarations: [FormlyFieldTextArea],
      imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlyModule.forChild(withFormlyFieldTextArea())]
    }]
  }], null, null);
})();

// node_modules/@ngx-formly/core/fesm2022/ngx-formly-core-select.mjs
var _FormlySelectOptionsPipe = class _FormlySelectOptionsPipe {
  transform(options, field) {
    if (!(options instanceof Observable)) {
      options = this.observableOf(options, field);
    } else {
      this.dispose();
    }
    return options.pipe(map((value) => this.transformOptions(value, field)));
  }
  ngOnDestroy() {
    this.dispose();
  }
  transformOptions(options, field) {
    const to = this.transformSelectProps(field);
    const opts = [];
    const groups = {};
    options?.forEach((option) => {
      const o = this.transformOption(option, to);
      if (o.group) {
        const id = groups[o.label];
        if (id === void 0) {
          groups[o.label] = opts.push(o) - 1;
        } else {
          o.group.forEach((o2) => opts[id].group.push(o2));
        }
      } else {
        opts.push(o);
      }
    });
    return opts;
  }
  transformOption(option, props) {
    const group = props.groupProp(option);
    if (Array.isArray(group)) {
      return {
        label: props.labelProp(option),
        group: group.map((opt) => this.transformOption(opt, props))
      };
    }
    option = {
      label: props.labelProp(option),
      value: props.valueProp(option),
      disabled: !!props.disabledProp(option)
    };
    if (group) {
      return {
        label: group,
        group: [option]
      };
    }
    return option;
  }
  transformSelectProps(field) {
    const props = field?.props || field?.templateOptions || {};
    const selectPropFn = (prop) => typeof prop === "function" ? prop : (o) => o[prop];
    return {
      groupProp: selectPropFn(props.groupProp || "group"),
      labelProp: selectPropFn(props.labelProp || "label"),
      valueProp: selectPropFn(props.valueProp || "value"),
      disabledProp: selectPropFn(props.disabledProp || "disabled")
    };
  }
  dispose() {
    if (this._options) {
      this._options.complete();
      this._options = null;
    }
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }
  observableOf(options, f) {
    this.dispose();
    if (f && f.options && f.options.fieldChanges) {
      this._subscription = f.options.fieldChanges.pipe(filter(({
        property,
        type,
        field
      }) => {
        return type === "expressionChanges" && (property.indexOf("templateOptions.options") === 0 || property.indexOf("props.options") === 0) && field === f && Array.isArray(field.props.options) && !!this._options;
      }), tap(() => this._options.next(f.props.options))).subscribe();
    }
    this._options = new BehaviorSubject(options);
    return this._options.asObservable();
  }
};
_FormlySelectOptionsPipe.\u0275fac = function FormlySelectOptionsPipe_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlySelectOptionsPipe)();
};
_FormlySelectOptionsPipe.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
  name: "formlySelectOptions",
  type: _FormlySelectOptionsPipe,
  pure: true
});
var FormlySelectOptionsPipe = _FormlySelectOptionsPipe;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlySelectOptionsPipe, [{
    type: Pipe,
    args: [{
      name: "formlySelectOptions",
      standalone: true
    }]
  }], null, null);
})();
var _LegacyFormlySelectOptionsPipe = class _LegacyFormlySelectOptionsPipe extends FormlySelectOptionsPipe {
};
_LegacyFormlySelectOptionsPipe.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275LegacyFormlySelectOptionsPipe_BaseFactory;
  return function LegacyFormlySelectOptionsPipe_Factory(__ngFactoryType__) {
    return (\u0275LegacyFormlySelectOptionsPipe_BaseFactory || (\u0275LegacyFormlySelectOptionsPipe_BaseFactory = \u0275\u0275getInheritedFactory(_LegacyFormlySelectOptionsPipe)))(__ngFactoryType__ || _LegacyFormlySelectOptionsPipe);
  };
})();
_LegacyFormlySelectOptionsPipe.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
  name: "formlySelectOptions",
  type: _LegacyFormlySelectOptionsPipe,
  pure: true,
  standalone: false
});
var LegacyFormlySelectOptionsPipe = _LegacyFormlySelectOptionsPipe;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LegacyFormlySelectOptionsPipe, [{
    type: Pipe,
    args: [{
      name: "formlySelectOptions",
      standalone: false
    }]
  }], null, null);
})();
var _FormlySelectModule = class _FormlySelectModule {
};
_FormlySelectModule.\u0275fac = function FormlySelectModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlySelectModule)();
};
_FormlySelectModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlySelectModule,
  declarations: [LegacyFormlySelectOptionsPipe],
  exports: [LegacyFormlySelectOptionsPipe]
});
_FormlySelectModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
var FormlySelectModule = _FormlySelectModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlySelectModule, [{
    type: NgModule,
    args: [{
      declarations: [LegacyFormlySelectOptionsPipe],
      exports: [LegacyFormlySelectOptionsPipe]
    }]
  }], null, null);
})();

// node_modules/@ngx-formly/bootstrap/fesm2022/ngx-formly-bootstrap-radio.mjs
function FormlyFieldRadio_ng_template_0_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "input", 3);
    \u0275\u0275elementStart(2, "label", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const option_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("form-check-inline", ctx_r2.props.formCheck === "inline");
    \u0275\u0275advance();
    \u0275\u0275classProp("is-invalid", ctx_r2.showError);
    \u0275\u0275property("id", ctx_r2.id + "_" + i_r2)("name", ctx_r2.field.name || ctx_r2.id)("value", option_r1.value)("formControl", option_r1.disabled ? ctx_r2.disabledControl : ctx_r2.formControl)("formlyAttributes", ctx_r2.field);
    \u0275\u0275attribute("value", option_r1.value)("aria-describedby", ctx_r2.id + "-formly-validation-error")("aria-invalid", ctx_r2.showError);
    \u0275\u0275advance();
    \u0275\u0275property("for", ctx_r2.id + "_" + i_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r1.label, " ");
  }
}
function FormlyFieldRadio_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FormlyFieldRadio_ng_template_0_div_0_Template, 4, 14, "div", 1);
    \u0275\u0275pipe(1, "formlySelectOptions");
    \u0275\u0275pipe(2, "async");
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngForOf", \u0275\u0275pipeBind1(2, 4, \u0275\u0275pipeBind2(1, 1, ctx_r2.props.options, ctx_r2.field)));
  }
}
var _FormlyFieldRadio = class _FormlyFieldRadio extends FieldType2 {
  constructor() {
    super(...arguments);
    this.defaultOptions = {
      props: {
        formCheck: "default"
      }
    };
  }
  get disabledControl() {
    return new UntypedFormControl({
      value: this.formControl.value,
      disabled: true
    });
  }
};
_FormlyFieldRadio.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FormlyFieldRadio_BaseFactory;
  return function FormlyFieldRadio_Factory(__ngFactoryType__) {
    return (\u0275FormlyFieldRadio_BaseFactory || (\u0275FormlyFieldRadio_BaseFactory = \u0275\u0275getInheritedFactory(_FormlyFieldRadio)))(__ngFactoryType__ || _FormlyFieldRadio);
  };
})();
_FormlyFieldRadio.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyFieldRadio,
  selectors: [["formly-field-radio"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["fieldTypeTemplate", ""], ["class", "form-check", 3, "form-check-inline", 4, "ngFor", "ngForOf"], [1, "form-check"], ["type", "radio", 1, "form-check-input", 3, "id", "name", "value", "formControl", "formlyAttributes"], [1, "form-check-label", 3, "for"]],
  template: function FormlyFieldRadio_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormlyFieldRadio_ng_template_0_Template, 3, 6, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  },
  dependencies: [NgForOf, DefaultValueAccessor, RadioControlValueAccessor, NgControlStatus, FormControlDirective, LegacyFormlyAttributes, AsyncPipe, LegacyFormlySelectOptionsPipe],
  encapsulation: 2,
  changeDetection: 0
});
var FormlyFieldRadio = _FormlyFieldRadio;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyFieldRadio, [{
    type: Component,
    args: [{
      selector: "formly-field-radio",
      template: `
    <ng-template #fieldTypeTemplate>
      <div
        *ngFor="let option of props.options | formlySelectOptions: field | async; let i = index"
        class="form-check"
        [class.form-check-inline]="props.formCheck === 'inline'"
      >
        <input
          type="radio"
          [id]="id + '_' + i"
          class="form-check-input"
          [name]="field.name || id"
          [class.is-invalid]="showError"
          [attr.value]="option.value"
          [value]="option.value"
          [formControl]="option.disabled ? disabledControl : formControl"
          [formlyAttributes]="field"
          [attr.aria-describedby]="id + '-formly-validation-error'"
          [attr.aria-invalid]="showError"
        />
        <label class="form-check-label" [for]="id + '_' + i">
          {{ option.label }}
        </label>
      </div>
    </ng-template>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
function withFormlyFieldRadio() {
  return {
    types: [{
      name: "radio",
      component: FormlyFieldRadio,
      wrappers: ["form-field"]
    }]
  };
}
var _FormlyBootstrapRadioModule = class _FormlyBootstrapRadioModule {
};
_FormlyBootstrapRadioModule.\u0275fac = function FormlyBootstrapRadioModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyBootstrapRadioModule)();
};
_FormlyBootstrapRadioModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyBootstrapRadioModule,
  declarations: [FormlyFieldRadio],
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlySelectModule, FormlyModule]
});
_FormlyBootstrapRadioModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlySelectModule, FormlyModule.forChild(withFormlyFieldRadio())]
});
var FormlyBootstrapRadioModule = _FormlyBootstrapRadioModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyBootstrapRadioModule, [{
    type: NgModule,
    args: [{
      declarations: [FormlyFieldRadio],
      imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlySelectModule, FormlyModule.forChild(withFormlyFieldRadio())]
    }]
  }], null, null);
})();

// node_modules/@ngx-formly/bootstrap/fesm2022/ngx-formly-bootstrap-checkbox.mjs
var _c03 = (a0, a1) => ({
  "form-check-inline": a0,
  "form-switch": a1
});
function FormlyFieldCheckbox_ng_template_0_label_2_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function FormlyFieldCheckbox_ng_template_0_label_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 4);
    \u0275\u0275text(1);
    \u0275\u0275template(2, FormlyFieldCheckbox_ng_template_0_label_2_span_2_Template, 2, 0, "span", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("for", ctx_r0.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.props.label, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.props.required && ctx_r0.props.hideRequiredMarker !== true);
  }
}
function FormlyFieldCheckbox_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "input", 2);
    \u0275\u0275template(2, FormlyFieldCheckbox_ng_template_0_label_2_Template, 3, 3, "label", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(11, _c03, ctx_r0.props.formCheck === "inline" || ctx_r0.props.formCheck === "inline-switch", ctx_r0.props.formCheck === "switch" || ctx_r0.props.formCheck === "inline-switch"));
    \u0275\u0275advance();
    \u0275\u0275classProp("is-invalid", ctx_r0.showError)("position-static", ctx_r0.props.formCheck === "nolabel");
    \u0275\u0275property("indeterminate", ctx_r0.props.indeterminate && ctx_r0.formControl.value == null)("formControl", ctx_r0.formControl)("formlyAttributes", ctx_r0.field);
    \u0275\u0275attribute("aria-describedby", ctx_r0.id + "-formly-validation-error")("aria-invalid", ctx_r0.showError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.props.formCheck !== "nolabel");
  }
}
var _FormlyFieldCheckbox = class _FormlyFieldCheckbox extends FieldType2 {
  constructor() {
    super(...arguments);
    this.defaultOptions = {
      props: {
        indeterminate: true,
        hideLabel: true,
        formCheck: "default"
      }
    };
  }
};
_FormlyFieldCheckbox.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FormlyFieldCheckbox_BaseFactory;
  return function FormlyFieldCheckbox_Factory(__ngFactoryType__) {
    return (\u0275FormlyFieldCheckbox_BaseFactory || (\u0275FormlyFieldCheckbox_BaseFactory = \u0275\u0275getInheritedFactory(_FormlyFieldCheckbox)))(__ngFactoryType__ || _FormlyFieldCheckbox);
  };
})();
_FormlyFieldCheckbox.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyFieldCheckbox,
  selectors: [["formly-field-checkbox"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["fieldTypeTemplate", ""], [1, "form-check", 3, "ngClass"], ["type", "checkbox", 1, "form-check-input", 3, "indeterminate", "formControl", "formlyAttributes"], ["class", "form-check-label", 3, "for", 4, "ngIf"], [1, "form-check-label", 3, "for"], ["aria-hidden", "true", 4, "ngIf"], ["aria-hidden", "true"]],
  template: function FormlyFieldCheckbox_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormlyFieldCheckbox_ng_template_0_Template, 3, 14, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  },
  dependencies: [NgClass, NgIf, CheckboxControlValueAccessor, NgControlStatus, FormControlDirective, LegacyFormlyAttributes],
  encapsulation: 2,
  changeDetection: 0
});
var FormlyFieldCheckbox = _FormlyFieldCheckbox;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyFieldCheckbox, [{
    type: Component,
    args: [{
      selector: "formly-field-checkbox",
      template: `
    <ng-template #fieldTypeTemplate>
      <div
        class="form-check"
        [ngClass]="{
          'form-check-inline': props.formCheck === 'inline' || props.formCheck === 'inline-switch',
          'form-switch': props.formCheck === 'switch' || props.formCheck === 'inline-switch',
        }"
      >
        <input
          type="checkbox"
          [class.is-invalid]="showError"
          class="form-check-input"
          [class.position-static]="props.formCheck === 'nolabel'"
          [indeterminate]="props.indeterminate && formControl.value == null"
          [formControl]="formControl"
          [formlyAttributes]="field"
          [attr.aria-describedby]="id + '-formly-validation-error'"
          [attr.aria-invalid]="showError"
        />
        <label *ngIf="props.formCheck !== 'nolabel'" [for]="id" class="form-check-label">
          {{ props.label }}
          <span *ngIf="props.required && props.hideRequiredMarker !== true" aria-hidden="true">*</span>
        </label>
      </div>
    </ng-template>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
function withFormlyFieldCheckbox() {
  return {
    types: [{
      name: "checkbox",
      component: FormlyFieldCheckbox,
      wrappers: ["form-field"]
    }, {
      name: "boolean",
      extends: "checkbox"
    }]
  };
}
var _FormlyBootstrapCheckboxModule = class _FormlyBootstrapCheckboxModule {
};
_FormlyBootstrapCheckboxModule.\u0275fac = function FormlyBootstrapCheckboxModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyBootstrapCheckboxModule)();
};
_FormlyBootstrapCheckboxModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyBootstrapCheckboxModule,
  declarations: [FormlyFieldCheckbox],
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlyModule]
});
_FormlyBootstrapCheckboxModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlyModule.forChild(withFormlyFieldCheckbox())]
});
var FormlyBootstrapCheckboxModule = _FormlyBootstrapCheckboxModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyBootstrapCheckboxModule, [{
    type: NgModule,
    args: [{
      declarations: [FormlyFieldCheckbox],
      imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlyModule.forChild(withFormlyFieldCheckbox())]
    }]
  }], null, null);
})();

// node_modules/@ngx-formly/bootstrap/fesm2022/ngx-formly-bootstrap-multicheckbox.mjs
var _c04 = (a0, a1) => ({
  "form-check-inline": a0,
  "form-switch": a1
});
function FormlyFieldMultiCheckbox_ng_template_0_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "input", 3);
    \u0275\u0275listener("change", function FormlyFieldMultiCheckbox_ng_template_0_div_0_Template_input_change_1_listener($event) {
      const option_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onChange(option_r2.value, $event.target.checked));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "label", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const option_r2 = ctx.$implicit;
    const i_r4 = ctx.index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(12, _c04, ctx_r2.props.formCheck === "inline" || ctx_r2.props.formCheck === "inline-switch", ctx_r2.props.formCheck === "switch" || ctx_r2.props.formCheck === "inline-switch"));
    \u0275\u0275advance();
    \u0275\u0275classProp("is-invalid", ctx_r2.showError);
    \u0275\u0275property("id", ctx_r2.id + "_" + i_r4)("value", option_r2.value)("checked", ctx_r2.isChecked(option_r2))("formlyAttributes", ctx_r2.field)("disabled", ctx_r2.formControl.disabled || option_r2.disabled);
    \u0275\u0275attribute("aria-describedby", ctx_r2.id + "-formly-validation-error")("aria-invalid", ctx_r2.showError);
    \u0275\u0275advance();
    \u0275\u0275property("for", ctx_r2.id + "_" + i_r4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r2.label, " ");
  }
}
function FormlyFieldMultiCheckbox_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FormlyFieldMultiCheckbox_ng_template_0_div_0_Template, 4, 15, "div", 1);
    \u0275\u0275pipe(1, "formlySelectOptions");
    \u0275\u0275pipe(2, "async");
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngForOf", \u0275\u0275pipeBind1(2, 4, \u0275\u0275pipeBind2(1, 1, ctx_r2.props.options, ctx_r2.field)));
  }
}
var _FormlyFieldMultiCheckbox = class _FormlyFieldMultiCheckbox extends FieldType2 {
  constructor() {
    super(...arguments);
    this.defaultOptions = {
      props: {
        formCheck: "default"
        // 'default' | 'inline' | 'switch' | 'inline-switch'
      }
    };
  }
  onChange(value, checked) {
    this.formControl.markAsDirty();
    if (this.props.type === "array") {
      this.formControl.patchValue(checked ? [...this.formControl.value || [], value] : [...this.formControl.value || []].filter((o) => o !== value));
    } else {
      this.formControl.patchValue(__spreadProps(__spreadValues({}, this.formControl.value), {
        [value]: checked
      }));
    }
    this.formControl.markAsTouched();
  }
  isChecked(option) {
    const value = this.formControl.value;
    return value && (this.props.type === "array" ? value.indexOf(option.value) !== -1 : value[option.value]);
  }
};
_FormlyFieldMultiCheckbox.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FormlyFieldMultiCheckbox_BaseFactory;
  return function FormlyFieldMultiCheckbox_Factory(__ngFactoryType__) {
    return (\u0275FormlyFieldMultiCheckbox_BaseFactory || (\u0275FormlyFieldMultiCheckbox_BaseFactory = \u0275\u0275getInheritedFactory(_FormlyFieldMultiCheckbox)))(__ngFactoryType__ || _FormlyFieldMultiCheckbox);
  };
})();
_FormlyFieldMultiCheckbox.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyFieldMultiCheckbox,
  selectors: [["formly-field-multicheckbox"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["fieldTypeTemplate", ""], ["class", "form-check", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "form-check", 3, "ngClass"], ["type", "checkbox", 1, "form-check-input", 3, "change", "id", "value", "checked", "formlyAttributes", "disabled"], [1, "form-check-label", 3, "for"]],
  template: function FormlyFieldMultiCheckbox_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormlyFieldMultiCheckbox_ng_template_0_Template, 3, 6, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  },
  dependencies: [NgClass, NgForOf, LegacyFormlyAttributes, AsyncPipe, LegacyFormlySelectOptionsPipe],
  encapsulation: 2,
  changeDetection: 0
});
var FormlyFieldMultiCheckbox = _FormlyFieldMultiCheckbox;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyFieldMultiCheckbox, [{
    type: Component,
    args: [{
      selector: "formly-field-multicheckbox",
      template: `
    <ng-template #fieldTypeTemplate>
      <div
        *ngFor="let option of props.options | formlySelectOptions: field | async; let i = index"
        class="form-check"
        [ngClass]="{
          'form-check-inline': props.formCheck === 'inline' || props.formCheck === 'inline-switch',
          'form-switch': props.formCheck === 'switch' || props.formCheck === 'inline-switch',
        }"
      >
        <input
          type="checkbox"
          [id]="id + '_' + i"
          class="form-check-input"
          [class.is-invalid]="showError"
          [value]="option.value"
          [checked]="isChecked(option)"
          [formlyAttributes]="field"
          [disabled]="formControl.disabled || option.disabled"
          [attr.aria-describedby]="id + '-formly-validation-error'"
          [attr.aria-invalid]="showError"
          (change)="onChange(option.value, $any($event.target).checked)"
        />
        <label class="form-check-label" [for]="id + '_' + i">
          {{ option.label }}
        </label>
      </div>
    </ng-template>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
function withFormlyFieldMultiCheckbox() {
  return {
    types: [{
      name: "multicheckbox",
      component: FormlyFieldMultiCheckbox,
      wrappers: ["form-field"]
    }]
  };
}
var _FormlyBootstrapMultiCheckboxModule = class _FormlyBootstrapMultiCheckboxModule {
};
_FormlyBootstrapMultiCheckboxModule.\u0275fac = function FormlyBootstrapMultiCheckboxModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyBootstrapMultiCheckboxModule)();
};
_FormlyBootstrapMultiCheckboxModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyBootstrapMultiCheckboxModule,
  declarations: [FormlyFieldMultiCheckbox],
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlySelectModule, FormlyModule]
});
_FormlyBootstrapMultiCheckboxModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlySelectModule, FormlyModule.forChild(withFormlyFieldMultiCheckbox())]
});
var FormlyBootstrapMultiCheckboxModule = _FormlyBootstrapMultiCheckboxModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyBootstrapMultiCheckboxModule, [{
    type: NgModule,
    args: [{
      declarations: [FormlyFieldMultiCheckbox],
      imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlySelectModule, FormlyModule.forChild(withFormlyFieldMultiCheckbox())]
    }]
  }], null, null);
})();

// node_modules/@ngx-formly/bootstrap/fesm2022/ngx-formly-bootstrap-select.mjs
function FormlyFieldSelect_ng_template_0_select_0_ng_container_1_ng_container_1_option_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("ngValue", opt_r1.value)("disabled", opt_r1.disabled);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", opt_r1.label, " ");
  }
}
function FormlyFieldSelect_ng_template_0_select_0_ng_container_1_ng_container_1_ng_template_2_option_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const child_r2 = ctx.$implicit;
    \u0275\u0275property("ngValue", child_r2.value)("disabled", child_r2.disabled);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", child_r2.label, " ");
  }
}
function FormlyFieldSelect_ng_template_0_select_0_ng_container_1_ng_container_1_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "optgroup", 9);
    \u0275\u0275template(1, FormlyFieldSelect_ng_template_0_select_0_ng_container_1_ng_container_1_ng_template_2_option_1_Template, 2, 3, "option", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("label", opt_r1.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", opt_r1.group);
  }
}
function FormlyFieldSelect_ng_template_0_select_0_ng_container_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, FormlyFieldSelect_ng_template_0_select_0_ng_container_1_ng_container_1_option_1_Template, 2, 3, "option", 7)(2, FormlyFieldSelect_ng_template_0_select_0_ng_container_1_ng_container_1_ng_template_2_Template, 2, 2, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const opt_r1 = ctx.$implicit;
    const optgroup_r3 = \u0275\u0275reference(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !opt_r1.group)("ngIfElse", optgroup_r3);
  }
}
function FormlyFieldSelect_ng_template_0_select_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, FormlyFieldSelect_ng_template_0_select_0_ng_container_1_ng_container_1_Template, 4, 2, "ng-container", 6);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const opts_r4 = ctx.ngIf;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", opts_r4);
  }
}
function FormlyFieldSelect_ng_template_0_select_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 4);
    \u0275\u0275template(1, FormlyFieldSelect_ng_template_0_select_0_ng_container_1_Template, 2, 1, "ng-container", 5);
    \u0275\u0275pipe(2, "formlySelectOptions");
    \u0275\u0275pipe(3, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-invalid", ctx_r4.showError);
    \u0275\u0275property("formControl", ctx_r4.formControl)("compareWith", ctx_r4.props.compareWith)("formlyAttributes", ctx_r4.field);
    \u0275\u0275attribute("aria-describedby", ctx_r4.id + "-formly-validation-error")("aria-invalid", ctx_r4.showError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(3, 11, \u0275\u0275pipeBind2(2, 8, ctx_r4.props.options, ctx_r4.field)));
  }
}
function FormlyFieldSelect_ng_template_0_ng_template_1_option_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngValue", void 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.props.placeholder);
  }
}
function FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_ng_container_1_option_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("ngValue", opt_r6.value)("disabled", opt_r6.disabled);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", opt_r6.label, " ");
  }
}
function FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_ng_container_1_ng_template_2_option_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const child_r7 = ctx.$implicit;
    \u0275\u0275property("ngValue", child_r7.value)("disabled", child_r7.disabled);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", child_r7.label, " ");
  }
}
function FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_ng_container_1_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "optgroup", 9);
    \u0275\u0275template(1, FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_ng_container_1_ng_template_2_option_1_Template, 2, 3, "option", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const opt_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("label", opt_r6.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", opt_r6.group);
  }
}
function FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_ng_container_1_option_1_Template, 2, 3, "option", 7)(2, FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_ng_container_1_ng_template_2_Template, 2, 2, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const opt_r6 = ctx.$implicit;
    const optgroup_r8 = \u0275\u0275reference(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !opt_r6.group)("ngIfElse", optgroup_r8);
  }
}
function FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_ng_container_1_Template, 4, 2, "ng-container", 6);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const opts_r9 = ctx.ngIf;
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", opts_r9);
  }
}
function FormlyFieldSelect_ng_template_0_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "select", 11);
    \u0275\u0275template(1, FormlyFieldSelect_ng_template_0_ng_template_1_option_1_Template, 2, 2, "option", 12)(2, FormlyFieldSelect_ng_template_0_ng_template_1_ng_container_2_Template, 2, 1, "ng-container", 5);
    \u0275\u0275pipe(3, "formlySelectOptions");
    \u0275\u0275pipe(4, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-invalid", ctx_r4.showError);
    \u0275\u0275property("formControl", ctx_r4.formControl)("compareWith", ctx_r4.props.compareWith)("formlyAttributes", ctx_r4.field);
    \u0275\u0275attribute("aria-describedby", ctx_r4.id + "-formly-validation-error")("aria-invalid", ctx_r4.showError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r4.props.placeholder);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(4, 12, \u0275\u0275pipeBind2(3, 9, ctx_r4.props.options, ctx_r4.field)));
  }
}
function FormlyFieldSelect_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, FormlyFieldSelect_ng_template_0_select_0_Template, 4, 13, "select", 3)(1, FormlyFieldSelect_ng_template_0_ng_template_1_Template, 5, 14, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const singleSelect_r10 = \u0275\u0275reference(2);
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", ctx_r4.props.multiple)("ngIfElse", singleSelect_r10);
  }
}
var _FormlyFieldSelect = class _FormlyFieldSelect extends FieldType2 {
  constructor() {
    super(...arguments);
    this.defaultOptions = {
      props: {
        compareWith(o1, o2) {
          return o1 === o2;
        }
      }
    };
  }
};
_FormlyFieldSelect.\u0275fac = /* @__PURE__ */ (() => {
  let \u0275FormlyFieldSelect_BaseFactory;
  return function FormlyFieldSelect_Factory(__ngFactoryType__) {
    return (\u0275FormlyFieldSelect_BaseFactory || (\u0275FormlyFieldSelect_BaseFactory = \u0275\u0275getInheritedFactory(_FormlyFieldSelect)))(__ngFactoryType__ || _FormlyFieldSelect);
  };
})();
_FormlyFieldSelect.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyFieldSelect,
  selectors: [["formly-field-select"]],
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["fieldTypeTemplate", ""], ["singleSelect", ""], ["optgroup", ""], ["class", "form-select", "multiple", "", 3, "formControl", "compareWith", "is-invalid", "formlyAttributes", 4, "ngIf", "ngIfElse"], ["multiple", "", 1, "form-select", 3, "formControl", "compareWith", "formlyAttributes"], [4, "ngIf"], [4, "ngFor", "ngForOf"], [3, "ngValue", "disabled", 4, "ngIf", "ngIfElse"], [3, "ngValue", "disabled"], [3, "label"], [3, "ngValue", "disabled", 4, "ngFor", "ngForOf"], [1, "form-select", 3, "formControl", "compareWith", "formlyAttributes"], [3, "ngValue", 4, "ngIf"], [3, "ngValue"]],
  template: function FormlyFieldSelect_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormlyFieldSelect_ng_template_0_Template, 3, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  },
  dependencies: [NgForOf, NgIf, NgSelectOption, \u0275NgSelectMultipleOption, SelectControlValueAccessor, SelectMultipleControlValueAccessor, NgControlStatus, FormControlDirective, LegacyFormlyAttributes, AsyncPipe, LegacyFormlySelectOptionsPipe],
  encapsulation: 2,
  changeDetection: 0
});
var FormlyFieldSelect = _FormlyFieldSelect;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyFieldSelect, [{
    type: Component,
    args: [{
      selector: "formly-field-select",
      template: `
    <ng-template #fieldTypeTemplate>
      <select
        *ngIf="props.multiple; else singleSelect"
        class="form-select"
        multiple
        [formControl]="formControl"
        [compareWith]="props.compareWith"
        [class.is-invalid]="showError"
        [formlyAttributes]="field"
        [attr.aria-describedby]="id + '-formly-validation-error'"
        [attr.aria-invalid]="showError"
      >
        <ng-container *ngIf="props.options | formlySelectOptions: field | async as opts">
          <ng-container *ngFor="let opt of opts">
            <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">
              {{ opt.label }}
            </option>
            <ng-template #optgroup>
              <optgroup [label]="opt.label">
                <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                  {{ child.label }}
                </option>
              </optgroup>
            </ng-template>
          </ng-container>
        </ng-container>
      </select>

      <ng-template #singleSelect>
        <select
          class="form-select"
          [formControl]="formControl"
          [compareWith]="props.compareWith"
          [class.is-invalid]="showError"
          [formlyAttributes]="field"
          [attr.aria-describedby]="id + '-formly-validation-error'"
          [attr.aria-invalid]="showError"
        >
          <option *ngIf="props.placeholder" [ngValue]="undefined">{{ props.placeholder }}</option>
          <ng-container *ngIf="props.options | formlySelectOptions: field | async as opts">
            <ng-container *ngFor="let opt of opts">
              <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">
                {{ opt.label }}
              </option>
              <ng-template #optgroup>
                <optgroup [label]="opt.label">
                  <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                    {{ child.label }}
                  </option>
                </optgroup>
              </ng-template>
            </ng-container>
          </ng-container>
        </select>
      </ng-template>
    </ng-template>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
function withFormlyFieldSelect() {
  return {
    types: [{
      name: "select",
      component: FormlyFieldSelect,
      wrappers: ["form-field"]
    }, {
      name: "enum",
      extends: "select"
    }]
  };
}
var _FormlyBootstrapSelectModule = class _FormlyBootstrapSelectModule {
};
_FormlyBootstrapSelectModule.\u0275fac = function FormlyBootstrapSelectModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyBootstrapSelectModule)();
};
_FormlyBootstrapSelectModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyBootstrapSelectModule,
  declarations: [FormlyFieldSelect],
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlySelectModule, FormlyModule]
});
_FormlyBootstrapSelectModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlySelectModule, FormlyModule.forChild(withFormlyFieldSelect())]
});
var FormlyBootstrapSelectModule = _FormlyBootstrapSelectModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyBootstrapSelectModule, [{
    type: NgModule,
    args: [{
      declarations: [FormlyFieldSelect],
      imports: [CommonModule, ReactiveFormsModule, FormlyBootstrapFormFieldModule, FormlySelectModule, FormlyModule.forChild(withFormlyFieldSelect())]
    }]
  }], null, null);
})();

// node_modules/@ngx-formly/bootstrap/fesm2022/ngx-formly-bootstrap-addons.mjs
var _c05 = ["fieldTypeTemplate"];
function FormlyWrapperAddons_ng_template_0_div_1_i_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 7);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r1.props.addonLeft.class);
  }
}
function FormlyWrapperAddons_ng_template_0_div_1_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.props.addonLeft.text);
  }
}
function FormlyWrapperAddons_ng_template_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275listener("click", function FormlyWrapperAddons_ng_template_0_div_1_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addonLeftClick($event));
    });
    \u0275\u0275template(1, FormlyWrapperAddons_ng_template_0_div_1_i_1_Template, 1, 1, "i", 5)(2, FormlyWrapperAddons_ng_template_0_div_1_span_2_Template, 2, 1, "span", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("input-group-btn", ctx_r1.props.addonLeft.onClick);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.props.addonLeft.class);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.props.addonLeft.text);
  }
}
function FormlyWrapperAddons_ng_template_0_div_4_i_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 7);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngClass", ctx_r1.props.addonRight.class);
  }
}
function FormlyWrapperAddons_ng_template_0_div_4_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.props.addonRight.text);
  }
}
function FormlyWrapperAddons_ng_template_0_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275listener("click", function FormlyWrapperAddons_ng_template_0_div_4_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.addonRightClick($event));
    });
    \u0275\u0275template(1, FormlyWrapperAddons_ng_template_0_div_4_i_1_Template, 1, 1, "i", 5)(2, FormlyWrapperAddons_ng_template_0_div_4_span_2_Template, 2, 1, "span", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("input-group-btn", ctx_r1.props.addonRight.onClick);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.props.addonRight.class);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.props.addonRight.text);
  }
}
function FormlyWrapperAddons_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275template(1, FormlyWrapperAddons_ng_template_0_div_1_Template, 3, 4, "div", 3);
    \u0275\u0275elementContainer(2, null, 1);
    \u0275\u0275template(4, FormlyWrapperAddons_ng_template_0_div_4_Template, 3, 4, "div", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("has-validation", ctx_r1.showError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.props.addonLeft);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.props.addonRight);
  }
}
var _FormlyWrapperAddons = class _FormlyWrapperAddons extends FieldWrapper {
  set content(templateRef) {
    if (templateRef && this.hostContainerRef) {
      this.hostContainerRef.createEmbeddedView(templateRef);
    }
  }
  constructor(hostContainerRef) {
    super();
    this.hostContainerRef = hostContainerRef;
  }
  addonRightClick($event) {
    this.props.addonRight.onClick?.(this.field, $event);
  }
  addonLeftClick($event) {
    this.props.addonLeft.onClick?.(this.field, $event);
  }
};
_FormlyWrapperAddons.\u0275fac = function FormlyWrapperAddons_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyWrapperAddons)(\u0275\u0275directiveInject(ViewContainerRef));
};
_FormlyWrapperAddons.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _FormlyWrapperAddons,
  selectors: [["formly-wrapper-addons"]],
  viewQuery: function FormlyWrapperAddons_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c05, 7);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.content = _t.first);
    }
  },
  standalone: false,
  features: [\u0275\u0275InheritDefinitionFeature],
  decls: 2,
  vars: 0,
  consts: [["fieldTypeTemplate", ""], ["fieldComponent", ""], [1, "input-group"], ["class", "input-group-text", 3, "input-group-btn", "click", 4, "ngIf"], [1, "input-group-text", 3, "click"], [3, "ngClass", 4, "ngIf"], [4, "ngIf"], [3, "ngClass"]],
  template: function FormlyWrapperAddons_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, FormlyWrapperAddons_ng_template_0_Template, 5, 4, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
  },
  dependencies: [NgClass, NgIf],
  styles: ["formly-wrapper-form-field .input-group-btn{cursor:pointer}\n"],
  encapsulation: 2
});
var FormlyWrapperAddons = _FormlyWrapperAddons;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyWrapperAddons, [{
    type: Component,
    args: [{
      selector: "formly-wrapper-addons",
      encapsulation: ViewEncapsulation.None,
      template: '<ng-template #fieldTypeTemplate>\n  <div class="input-group" [class.has-validation]="showError">\n    <div\n      class="input-group-text"\n      *ngIf="props.addonLeft"\n      [class.input-group-btn]="props.addonLeft.onClick"\n      (click)="addonLeftClick($event)"\n    >\n      <i [ngClass]="props.addonLeft.class" *ngIf="props.addonLeft.class"></i>\n      <span *ngIf="props.addonLeft.text">{{ props.addonLeft.text }}</span>\n    </div>\n    <ng-container #fieldComponent></ng-container>\n    <div\n      class="input-group-text"\n      *ngIf="props.addonRight"\n      [class.input-group-btn]="props.addonRight.onClick"\n      (click)="addonRightClick($event)"\n    >\n      <i [ngClass]="props.addonRight.class" *ngIf="props.addonRight.class"></i>\n      <span *ngIf="props.addonRight.text">{{ props.addonRight.text }}</span>\n    </div>\n  </div>\n</ng-template>\n',
      styles: ["formly-wrapper-form-field .input-group-btn{cursor:pointer}\n"]
    }]
  }], () => [{
    type: ViewContainerRef
  }], {
    content: [{
      type: ViewChild,
      args: ["fieldTypeTemplate", {
        static: true
      }]
    }]
  });
})();
function addonsExtension(field) {
  if (!field.props || field.wrappers && field.wrappers.indexOf("addons") !== -1) {
    return;
  }
  if (field.props.addonLeft || field.props.addonRight) {
    field.wrappers = [...field.wrappers || [], "addons"];
  }
}
function withFormlyWrapperAddons() {
  return {
    wrappers: [{
      name: "addons",
      component: FormlyWrapperAddons
    }],
    extensions: [{
      name: "addons",
      extension: {
        postPopulate: addonsExtension
      }
    }]
  };
}
var _FormlyBootstrapAddonsModule = class _FormlyBootstrapAddonsModule {
};
_FormlyBootstrapAddonsModule.\u0275fac = function FormlyBootstrapAddonsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyBootstrapAddonsModule)();
};
_FormlyBootstrapAddonsModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyBootstrapAddonsModule,
  declarations: [FormlyWrapperAddons],
  imports: [CommonModule, ReactiveFormsModule, FormlyModule]
});
_FormlyBootstrapAddonsModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [CommonModule, ReactiveFormsModule, FormlyModule.forChild(withFormlyWrapperAddons())]
});
var FormlyBootstrapAddonsModule = _FormlyBootstrapAddonsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyBootstrapAddonsModule, [{
    type: NgModule,
    args: [{
      declarations: [FormlyWrapperAddons],
      imports: [CommonModule, ReactiveFormsModule, FormlyModule.forChild(withFormlyWrapperAddons())]
    }]
  }], null, null);
})();

// node_modules/@ngx-formly/bootstrap/fesm2022/ngx-formly-bootstrap.mjs
var _FormlyBootstrapModule = class _FormlyBootstrapModule {
};
_FormlyBootstrapModule.\u0275fac = function FormlyBootstrapModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormlyBootstrapModule)();
};
_FormlyBootstrapModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _FormlyBootstrapModule,
  imports: [FormlyBootstrapFormFieldModule, FormlyBootstrapInputModule, FormlyBootstrapTextAreaModule, FormlyBootstrapRadioModule, FormlyBootstrapCheckboxModule, FormlyBootstrapMultiCheckboxModule, FormlyBootstrapSelectModule, FormlyBootstrapAddonsModule]
});
_FormlyBootstrapModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
  imports: [FormlyBootstrapFormFieldModule, FormlyBootstrapInputModule, FormlyBootstrapTextAreaModule, FormlyBootstrapRadioModule, FormlyBootstrapCheckboxModule, FormlyBootstrapMultiCheckboxModule, FormlyBootstrapSelectModule, FormlyBootstrapAddonsModule]
});
var FormlyBootstrapModule = _FormlyBootstrapModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormlyBootstrapModule, [{
    type: NgModule,
    args: [{
      imports: [FormlyBootstrapFormFieldModule, FormlyBootstrapInputModule, FormlyBootstrapTextAreaModule, FormlyBootstrapRadioModule, FormlyBootstrapCheckboxModule, FormlyBootstrapMultiCheckboxModule, FormlyBootstrapSelectModule, FormlyBootstrapAddonsModule]
    }]
  }], null, null);
})();

// src/environments/environment.ts
var environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyB8wAgN-sgQaBybaaVAw9sXUDs5Z6r7Wcw",
    authDomain: "kanban-gobuyer.firebaseapp.com",
    projectId: "kanban-gobuyer",
    storageBucket: "kanban-gobuyer.appspot.com",
    messagingSenderId: "269726968959",
    appId: "1:269726968959:web:6aaf53ba4f7bf6b64d39c9"
  }
};

// src/app/interceptors/company.interceptor.ts
var CompanyInterceptor = class _CompanyInterceptor {
  companyService = inject(CompanyService);
  intercept(req, next) {
    const subdomain = this.companyService.getCompanySubdomain();
    if (subdomain && req.url.includes("/api/")) {
      const modifiedReq = req.clone({
        setHeaders: {
          "X-Company-Subdomain": subdomain
        }
      });
      return next.handle(modifiedReq);
    }
    return next.handle(req);
  }
  static \u0275fac = function CompanyInterceptor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CompanyInterceptor)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CompanyInterceptor, factory: _CompanyInterceptor.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompanyInterceptor, [{
    type: Injectable
  }], null, null);
})();

// src/app/guards/auth.guard.ts
var authGuard = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated().pipe(map((isAuthenticated) => {
    if (isAuthenticated) {
      return true;
    } else {
      router.navigate(["/login"]);
      return false;
    }
  }));
};

// src/app/guards/company.guard.ts
var CompanyGuard = class _CompanyGuard {
  subdomainService = inject(SubdomainService);
  router = inject(Router);
  canActivate() {
    return new Observable((observer) => {
      this.subdomainService.isInitialized$.subscribe((isInitialized) => {
        if (isInitialized) {
          const company = this.subdomainService.getCurrentCompany();
          if (!company) {
            const currentUrl = this.router.url;
            if (currentUrl === "/login" || currentUrl === "/" || currentUrl.startsWith("/form")) {
              observer.next(true);
              observer.complete();
            } else {
              this.handleNoCompany();
              observer.next(false);
              observer.complete();
            }
          } else {
            observer.next(true);
            observer.complete();
          }
        } else {
          this.subdomainService.initializeFromSubdomain().then((company) => __async(this, null, function* () {
            if (company) {
              observer.next(true);
            } else {
              const currentUrl = this.router.url;
              if (currentUrl === "/login" || currentUrl === "/" || currentUrl.startsWith("/login?") || currentUrl.startsWith("/form")) {
                observer.next(true);
              } else {
                this.handleNoCompany();
                observer.next(false);
              }
            }
            observer.complete();
          })).catch((error) => {
            console.error("Erro ao inicializar guard da empresa:", error);
            const currentUrl = this.router.url;
            if (currentUrl === "/login" || currentUrl === "/" || currentUrl.startsWith("/login?") || currentUrl.startsWith("/form")) {
              observer.next(true);
            } else {
              this.handleError(error);
              observer.next(false);
            }
            observer.complete();
          });
        }
      });
    });
  }
  handleNoCompany() {
  }
  handleError(error) {
  }
  static \u0275fac = function CompanyGuard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CompanyGuard)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CompanyGuard, factory: _CompanyGuard.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompanyGuard, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/app.routes.ts
var routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    path: "login",
    loadComponent: () => import("./chunk-G2VIIJCZ.js").then((m) => m.LoginComponent),
    canActivate: [CompanyGuard]
    // Verificar empresa antes do login
  },
  {
    path: "dashboard",
    loadComponent: () => import("./chunk-RLZWZXQ3.js").then((m) => m.DashboardComponent),
    canActivate: [CompanyGuard, authGuard]
    // Verificar empresa e autenticação
  },
  {
    path: "kanban/:boardId",
    loadComponent: () => import("./chunk-AZHCZF2H.js").then((m) => m.KanbanComponent),
    canActivate: [CompanyGuard, authGuard]
    // Verificar empresa e autenticação
  },
  {
    path: "usuarios",
    loadComponent: () => import("./chunk-D3VUIBLT.js").then((m) => m.UserManagementComponent),
    canActivate: [CompanyGuard, authGuard]
    // Verificar empresa e autenticação
  },
  {
    path: "empresa/branding",
    loadComponent: () => import("./chunk-SFZLUA56.js").then((m) => m.BrandingConfigComponent),
    canActivate: [CompanyGuard, authGuard]
  },
  {
    path: "empresa/smtp",
    loadComponent: () => import("./chunk-4X4UEART.js").then((m) => m.SmtpConfigComponent),
    canActivate: [CompanyGuard, authGuard]
  },
  {
    path: "empresa/integracoes",
    loadComponent: () => import("./chunk-KPVUHVI7.js").then((m) => m.ApiLinksConfigComponent),
    canActivate: [CompanyGuard, authGuard]
  },
  {
    path: "empresa-nao-encontrada",
    loadComponent: () => import("./chunk-B7YBKQLQ.js").then((m) => m.CompanyNotFoundComponent)
  },
  {
    path: "**",
    redirectTo: "/login"
  }
];

// src/app/app.config.ts
function initializeBranding(brandingService, subdomainService, companyService) {
  return () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let company = subdomainService.getCurrentCompany() || subdomainService.restorePersistedCompany();
        if (!company) {
          companyService.getCompanyBySubdomain(companyService.getCompanySubdomain() || "").then((found) => {
            if (found) {
              subdomainService.setCurrentCompany(found);
              brandingService.applyCompanyBranding(found);
            }
            resolve();
          }).catch(() => resolve());
          return;
        }
        if (company && company.brandingConfig) {
          brandingService.applyCompanyBranding(company);
        }
        resolve();
      }, 200);
    });
  };
}
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    // Inicializador de branding
    {
      provide: APP_INITIALIZER,
      useFactory: initializeBranding,
      deps: [BrandingService, SubdomainService, CompanyService],
      multi: true
    },
    // HTTP Interceptor para adicionar headers da empresa
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CompanyInterceptor,
      multi: true
    },
    importProvidersFrom(ReactiveFormsModule, FormlyModule.forRoot({
      validationMessages: [
        { name: "required", message: "Este campo \xE9 obrigat\xF3rio" }
      ]
    }), FormlyBootstrapModule),
    // Garantir que os serviços sejam instanciados
    BrandingService,
    SubdomainService
  ]
};

// src/app/app.ts
var App = class _App {
  subdomainService = inject(SubdomainService);
  firestoreService = inject(FirestoreService);
  brandingService = inject(BrandingService);
  title = signal("Sistema Kanban", ...ngDevMode ? [{ debugName: "title" }] : []);
  ngOnInit() {
    return __async(this, null, function* () {
      try {
        const company = yield this.subdomainService.initializeFromSubdomain();
        if (company) {
          this.firestoreService.setCompanyContext(company);
          this.title.set(`${company.name} - Sistema Kanban`);
          this.updatePageTitle(company.name);
          this.brandingService.applyCompanyBranding(company);
        } else {
          this.title.set("Sistema Kanban - Login");
        }
      } catch (error) {
      }
    });
  }
  updatePageTitle(companyName) {
    if (typeof document !== "undefined") {
      document.title = `${companyName} - Sistema Kanban`;
    }
  }
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 1, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet");
    }
  }, dependencies: [RouterOutlet], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", imports: [RouterOutlet], template: "<router-outlet></router-outlet>" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 13 });
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
