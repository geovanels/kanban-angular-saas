import {
  BehaviorSubject,
  Injectable,
  __name,
  __publicField,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-GMR7JISZ.js";

// src/app/components/toast/toast.service.ts
var _ToastService = class _ToastService {
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
};
__name(_ToastService, "ToastService");
__publicField(_ToastService, "\u0275fac", /* @__PURE__ */ __name(function ToastService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToastService)();
}, "ToastService_Factory"));
__publicField(_ToastService, "\u0275prov", /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ToastService, factory: _ToastService.\u0275fac, providedIn: "root" }));
var ToastService = _ToastService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  ToastService
};
//# sourceMappingURL=chunk-RDMWVNUM.js.map
