import {
  ConfigHeaderComponent
} from "./chunk-BZTML4PP.js";
import {
  MainLayoutComponent
} from "./chunk-BGRXE4K2.js";
import "./chunk-VURM7YH2.js";
import "./chunk-RDMWVNUM.js";
import {
  FormsModule,
  NgControlStatusGroup,
  NgForm,
  NgSelectOption,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-2S4XXET5.js";
import "./chunk-L3ANR23A.js";
import {
  AuthService,
  CompanyService,
  SubdomainService
} from "./chunk-NDNGZ4HQ.js";
import {
  CommonModule,
  Component,
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
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-GMR7JISZ.js";

// src/app/components/user-management/user-management.component.ts
var _forTrack0 = /* @__PURE__ */ __name(($index, $item) => $item.email, "_forTrack0");
function UserManagementComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInviteFormToggle());
    }, "UserManagementComponent_Conditional_2_Template_button_click_0_listener"));
    \u0275\u0275element(1, "i", 11);
    \u0275\u0275text(2, " Convidar Usu\xE1rio ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("background-color", ctx_r1.getPrimaryColor());
    \u0275\u0275property("disabled", ctx_r1.inviteLoading());
  }
}
__name(UserManagementComponent_Conditional_2_Template, "UserManagementComponent_Conditional_2_Template");
function UserManagementComponent_Conditional_6_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275element(1, "i", 32);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.inviteSuccess(), " ");
  }
}
__name(UserManagementComponent_Conditional_6_Conditional_7_Template, "UserManagementComponent_Conditional_6_Conditional_7_Template");
function UserManagementComponent_Conditional_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "i", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.inviteError(), " ");
  }
}
__name(UserManagementComponent_Conditional_6_Conditional_8_Template, "UserManagementComponent_Conditional_6_Conditional_8_Template");
function UserManagementComponent_Conditional_6_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 34);
    \u0275\u0275text(1, " Enviando... ");
  }
}
__name(UserManagementComponent_Conditional_6_Conditional_32_Template, "UserManagementComponent_Conditional_6_Conditional_32_Template");
function UserManagementComponent_Conditional_6_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 35);
    \u0275\u0275text(1, " Enviar Convite ");
  }
}
__name(UserManagementComponent_Conditional_6_Conditional_33_Template, "UserManagementComponent_Conditional_6_Conditional_33_Template");
function UserManagementComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 12);
    \u0275\u0275element(2, "i", 13);
    \u0275\u0275elementStart(3, "strong", 14);
    \u0275\u0275text(4, "Convidar Usu\xE1rio");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6, "O usu\xE1rio receber\xE1 um email de convite para se juntar \xE0 empresa.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, UserManagementComponent_Conditional_6_Conditional_7_Template, 3, 1, "div", 16);
    \u0275\u0275conditionalCreate(8, UserManagementComponent_Conditional_6_Conditional_8_Template, 3, 1, "div", 17);
    \u0275\u0275elementStart(9, "form", 18);
    \u0275\u0275listener("submit", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_6_Template_form_submit_9_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.inviteUser();
      return \u0275\u0275resetView($event.preventDefault());
    }, "UserManagementComponent_Conditional_6_Template_form_submit_9_listener"));
    \u0275\u0275elementStart(10, "div", 19)(11, "div")(12, "label", 20);
    \u0275\u0275text(13, "Nome do Usu\xE1rio *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 21);
    \u0275\u0275listener("input", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_6_Template_input_input_14_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.inviteName.set($event.target.value));
    }, "UserManagementComponent_Conditional_6_Template_input_input_14_listener"));
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div")(16, "label", 20);
    \u0275\u0275text(17, "Email do Usu\xE1rio *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 22);
    \u0275\u0275listener("input", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_6_Template_input_input_18_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.inviteEmail.set($event.target.value));
    }, "UserManagementComponent_Conditional_6_Template_input_input_18_listener"));
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 23)(20, "div")(21, "label", 20);
    \u0275\u0275text(22, "Fun\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "select", 24);
    \u0275\u0275listener("change", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_6_Template_select_change_23_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.inviteRole.set($event.target.value));
    }, "UserManagementComponent_Conditional_6_Template_select_change_23_listener"));
    \u0275\u0275elementStart(24, "option", 25);
    \u0275\u0275text(25, "Usu\xE1rio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "option", 26);
    \u0275\u0275text(27, "Gerente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "option", 27);
    \u0275\u0275text(29, "Administrador");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(30, "div", 28)(31, "button", 29);
    \u0275\u0275conditionalCreate(32, UserManagementComponent_Conditional_6_Conditional_32_Template, 2, 0)(33, UserManagementComponent_Conditional_6_Conditional_33_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "button", 30);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_6_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInviteForm.set(false));
    }, "UserManagementComponent_Conditional_6_Template_button_click_34_listener"));
    \u0275\u0275element(35, "i", 31);
    \u0275\u0275text(36, " Cancelar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r1.inviteSuccess() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.inviteError() ? 8 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r1.inviteName());
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.inviteEmail());
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r1.inviteRole());
    \u0275\u0275advance(8);
    \u0275\u0275styleProp("background-color", ctx_r1.getPrimaryColor());
    \u0275\u0275property("disabled", ctx_r1.inviteLoading() || !ctx_r1.inviteEmail().trim() || !ctx_r1.inviteName().trim());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.inviteLoading() ? 32 : 33);
  }
}
__name(UserManagementComponent_Conditional_6_Template, "UserManagementComponent_Conditional_6_Template");
function UserManagementComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "i", 36);
    \u0275\u0275elementStart(2, "p", 37);
    \u0275\u0275text(3, "Carregando usu\xE1rios...");
    \u0275\u0275elementEnd()();
  }
}
__name(UserManagementComponent_Conditional_7_Template, "UserManagementComponent_Conditional_7_Template");
function UserManagementComponent_Conditional_8_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 42);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_8_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showInviteFormToggle());
    }, "UserManagementComponent_Conditional_8_Conditional_6_Template_button_click_0_listener"));
    \u0275\u0275element(1, "i", 11);
    \u0275\u0275text(2, " Convidar Primeiro Usu\xE1rio ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("background-color", ctx_r1.getPrimaryColor());
  }
}
__name(UserManagementComponent_Conditional_8_Conditional_6_Template, "UserManagementComponent_Conditional_8_Conditional_6_Template");
function UserManagementComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "i", 38);
    \u0275\u0275elementStart(2, "h5", 39);
    \u0275\u0275text(3, "Nenhum usu\xE1rio encontrado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 40);
    \u0275\u0275text(5, "Convide usu\xE1rios para colaborar na sua empresa.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, UserManagementComponent_Conditional_8_Conditional_6_Template, 3, 2, "button", 41);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r1.canManageUsers() ? 6 : -1);
  }
}
__name(UserManagementComponent_Conditional_8_Template, "UserManagementComponent_Conditional_8_Template");
function UserManagementComponent_Conditional_9_For_18_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", user_r5.displayName.charAt(0).toUpperCase(), " ");
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Conditional_4_Template, "UserManagementComponent_Conditional_9_For_18_Conditional_4_Template");
function UserManagementComponent_Conditional_9_For_18_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 53);
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Conditional_5_Template, "UserManagementComponent_Conditional_9_For_18_Conditional_5_Template");
function UserManagementComponent_Conditional_9_For_18_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 56);
    \u0275\u0275text(1, "(Voc\xEA)");
    \u0275\u0275elementEnd();
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Conditional_9_Template, "UserManagementComponent_Conditional_9_For_18_Conditional_9_Template");
function UserManagementComponent_Conditional_9_For_18_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 57);
    \u0275\u0275text(1, "(Propriet\xE1rio)");
    \u0275\u0275elementEnd();
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Conditional_10_Template, "UserManagementComponent_Conditional_9_For_18_Conditional_10_Template");
function UserManagementComponent_Conditional_9_For_18_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 64);
    \u0275\u0275listener("change", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_9_For_18_Conditional_15_Template_select_change_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const user_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.changeUserRole(user_r5.email, $event.target.value));
    }, "UserManagementComponent_Conditional_9_For_18_Conditional_15_Template_select_change_0_listener"));
    \u0275\u0275elementStart(1, "option", 25);
    \u0275\u0275text(2, "Usu\xE1rio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "option", 26);
    \u0275\u0275text(4, "Gerente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "option", 27);
    \u0275\u0275text(6, "Administrador");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", user_r5.role)("disabled", ctx_r1.isLoading());
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Conditional_15_Template, "UserManagementComponent_Conditional_9_For_18_Conditional_15_Template");
function UserManagementComponent_Conditional_9_For_18_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.getRoleBadgeClass(user_r5.role));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getRoleLabel(user_r5.role), " ");
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Conditional_16_Template, "UserManagementComponent_Conditional_9_For_18_Conditional_16_Template");
function UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 69);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const user_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.resendInvite(user_r5.email));
    }, "UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_1_Template_button_click_0_listener"));
    \u0275\u0275element(1, "i", 70);
    \u0275\u0275text(2, " Reenviar ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_1_Template, "UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_1_Template");
function UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 71);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const user_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.inactivateUser(user_r5.email));
    }, "UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_2_Template_button_click_0_listener"));
    \u0275\u0275element(1, "i", 72);
    \u0275\u0275text(2, " Inativar ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_2_Template, "UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_2_Template");
function UserManagementComponent_Conditional_9_For_18_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275conditionalCreate(1, UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_1_Template, 3, 1, "button", 65);
    \u0275\u0275conditionalCreate(2, UserManagementComponent_Conditional_9_For_18_Conditional_23_Conditional_2_Template, 3, 1, "button", 66);
    \u0275\u0275elementStart(3, "button", 67);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_9_For_18_Conditional_23_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r7);
      const user_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeUser(user_r5.email));
    }, "UserManagementComponent_Conditional_9_For_18_Conditional_23_Template_button_click_3_listener"));
    \u0275\u0275element(4, "i", 68);
    \u0275\u0275text(5, " Excluir ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(user_r5.inviteStatus === "pending" ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(user_r5.inviteStatus === "accepted" ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.isLoading());
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Conditional_23_Template, "UserManagementComponent_Conditional_9_For_18_Conditional_23_Template");
function UserManagementComponent_Conditional_9_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 48)(1, "td", 49)(2, "div", 50)(3, "div", 51);
    \u0275\u0275conditionalCreate(4, UserManagementComponent_Conditional_9_For_18_Conditional_4_Template, 2, 1, "div", 52)(5, UserManagementComponent_Conditional_9_For_18_Conditional_5_Template, 1, 0, "i", 53);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 54)(7, "div", 55);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, UserManagementComponent_Conditional_9_For_18_Conditional_9_Template, 2, 0, "span", 56);
    \u0275\u0275conditionalCreate(10, UserManagementComponent_Conditional_9_For_18_Conditional_10_Template, 2, 0, "span", 57);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "td", 49)(12, "div", 58);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 49);
    \u0275\u0275conditionalCreate(15, UserManagementComponent_Conditional_9_For_18_Conditional_15_Template, 7, 2, "select", 59)(16, UserManagementComponent_Conditional_9_For_18_Conditional_16_Template, 2, 3, "span", 60);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 49)(18, "span");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td", 61);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 62);
    \u0275\u0275conditionalCreate(23, UserManagementComponent_Conditional_9_For_18_Conditional_23_Template, 6, 3, "div", 63);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_13_0;
    let tmp_14_0;
    let tmp_16_0;
    let tmp_20_0;
    const user_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(user_r5.displayName ? 4 : 5);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", user_r5.displayName || "Usu\xE1rio sem nome", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(user_r5.email === ((tmp_13_0 = ctx_r1.currentUser()) == null ? null : tmp_13_0.email) ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(user_r5.email === ((tmp_14_0 = ctx_r1.currentCompany()) == null ? null : tmp_14_0.ownerEmail) ? 10 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(user_r5.email);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canManageUsers() && user_r5.email !== ((tmp_16_0 = ctx_r1.currentCompany()) == null ? null : tmp_16_0.ownerEmail) ? 15 : 16);
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r1.getStatusBadgeClass(user_r5.inviteStatus || "accepted"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getStatusLabel(user_r5.inviteStatus || "accepted"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatJoinedDate(user_r5.joinedAt), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canManageUsers() && user_r5.email !== ((tmp_20_0 = ctx_r1.currentUser()) == null ? null : tmp_20_0.email) && user_r5.email !== ((tmp_20_0 = ctx_r1.currentCompany()) == null ? null : tmp_20_0.ownerEmail) ? 23 : -1);
  }
}
__name(UserManagementComponent_Conditional_9_For_18_Template, "UserManagementComponent_Conditional_9_For_18_Template");
function UserManagementComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "table", 43)(2, "thead", 44)(3, "tr")(4, "th", 45);
    \u0275\u0275text(5, "Usu\xE1rio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 45);
    \u0275\u0275text(7, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 45);
    \u0275\u0275text(9, "Fun\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 45);
    \u0275\u0275text(11, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 45);
    \u0275\u0275text(13, "Membro desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 46);
    \u0275\u0275text(15, "A\xE7\xF5es");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody", 47);
    \u0275\u0275repeaterCreate(17, UserManagementComponent_Conditional_9_For_18_Template, 24, 11, "tr", 48, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r1.users());
  }
}
__name(UserManagementComponent_Conditional_9_Template, "UserManagementComponent_Conditional_9_Template");
function UserManagementComponent_Conditional_10_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 79)(1, "td", 49)(2, "div", 50)(3, "div", 80);
    \u0275\u0275element(4, "i", 81);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 54)(6, "div", 55);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(8, "td", 82);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 49)(11, "span", 83);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td", 61);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 49)(16, "span", 84);
    \u0275\u0275element(17, "i", 85);
    \u0275\u0275text(18, " Pendente ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 86)(20, "button", 87);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_10_For_23_Template_button_click_20_listener() {
      const invite_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.resendInvite(invite_r11.email));
    }, "UserManagementComponent_Conditional_10_For_23_Template_button_click_20_listener"));
    \u0275\u0275element(21, "i", 35);
    \u0275\u0275text(22, " Reenviar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "button", 88);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_10_For_23_Template_button_click_23_listener() {
      const invite_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.markInviteAsAccepted(invite_r11.email));
    }, "UserManagementComponent_Conditional_10_For_23_Template_button_click_23_listener"));
    \u0275\u0275element(24, "i", 89);
    \u0275\u0275text(25, " Aceitar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "button", 90);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_10_For_23_Template_button_click_26_listener() {
      const invite_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deletePendingInvite(invite_r11.email));
    }, "UserManagementComponent_Conditional_10_For_23_Template_button_click_26_listener"));
    \u0275\u0275element(27, "i", 68);
    \u0275\u0275text(28, " Excluir ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const invite_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", invite_r11.displayName || "Nome n\xE3o informado", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", invite_r11.email, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", invite_r11.role || "user", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatDate(invite_r11.joinedAt), " ");
  }
}
__name(UserManagementComponent_Conditional_10_For_23_Template, "UserManagementComponent_Conditional_10_For_23_Template");
function UserManagementComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 73)(2, "h3", 74);
    \u0275\u0275element(3, "i", 75);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 7)(6, "table", 43)(7, "thead", 76)(8, "tr")(9, "th", 77);
    \u0275\u0275text(10, "Usu\xE1rio Convidado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th", 77);
    \u0275\u0275text(12, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th", 77);
    \u0275\u0275text(14, "Fun\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th", 77);
    \u0275\u0275text(16, "Convidado em");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th", 77);
    \u0275\u0275text(18, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th", 78);
    \u0275\u0275text(20, "A\xE7\xF5es");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "tbody", 47);
    \u0275\u0275repeaterCreate(22, UserManagementComponent_Conditional_10_For_23_Template, 29, 4, "tr", 79, _forTrack0);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" Convites Pendentes (", ctx_r1.pendingInvites().length, ") ");
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r1.pendingInvites());
  }
}
__name(UserManagementComponent_Conditional_10_Template, "UserManagementComponent_Conditional_10_Template");
function UserManagementComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9)(1, "div", 91)(2, "div", 92)(3, "h3", 93);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 94);
    \u0275\u0275element(6, "p", 95);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 96)(8, "button", 97);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_11_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.cancelModalAction());
    }, "UserManagementComponent_Conditional_11_Template_button_click_8_listener"));
    \u0275\u0275text(9, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 98);
    \u0275\u0275listener("click", /* @__PURE__ */ __name(function UserManagementComponent_Conditional_11_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.confirmModalAction());
    }, "UserManagementComponent_Conditional_11_Template_button_click_10_listener"));
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.confirmTitle());
    \u0275\u0275advance(2);
    \u0275\u0275property("innerHTML", ctx_r1.confirmMessage(), \u0275\u0275sanitizeHtml);
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r1.confirmButtonClass() === "btn-danger" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.confirmButtonText(), " ");
  }
}
__name(UserManagementComponent_Conditional_11_Template, "UserManagementComponent_Conditional_11_Template");
var _UserManagementComponent = class _UserManagementComponent {
  companyService = inject(CompanyService);
  authService = inject(AuthService);
  subdomainService = inject(SubdomainService);
  users = signal([], ...ngDevMode ? [{ debugName: "users" }] : []);
  pendingInvites = signal([], ...ngDevMode ? [{ debugName: "pendingInvites" }] : []);
  currentCompany = signal(null, ...ngDevMode ? [{ debugName: "currentCompany" }] : []);
  currentUser = signal(null, ...ngDevMode ? [{ debugName: "currentUser" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  // Invite user form
  showInviteForm = signal(false, ...ngDevMode ? [{ debugName: "showInviteForm" }] : []);
  inviteEmail = signal("", ...ngDevMode ? [{ debugName: "inviteEmail" }] : []);
  inviteName = signal("", ...ngDevMode ? [{ debugName: "inviteName" }] : []);
  inviteRole = signal("user", ...ngDevMode ? [{ debugName: "inviteRole" }] : []);
  inviteLoading = signal(false, ...ngDevMode ? [{ debugName: "inviteLoading" }] : []);
  inviteError = signal(null, ...ngDevMode ? [{ debugName: "inviteError" }] : []);
  inviteSuccess = signal(null, ...ngDevMode ? [{ debugName: "inviteSuccess" }] : []);
  // Confirmation modals
  showConfirmModal = signal(false, ...ngDevMode ? [{ debugName: "showConfirmModal" }] : []);
  confirmAction = signal(null, ...ngDevMode ? [{ debugName: "confirmAction" }] : []);
  confirmTitle = signal("", ...ngDevMode ? [{ debugName: "confirmTitle" }] : []);
  confirmMessage = signal("", ...ngDevMode ? [{ debugName: "confirmMessage" }] : []);
  confirmButtonText = signal("Confirmar", ...ngDevMode ? [{ debugName: "confirmButtonText" }] : []);
  confirmButtonClass = signal("btn-danger", ...ngDevMode ? [{ debugName: "confirmButtonClass" }] : []);
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.ensureCompanyContext();
      yield this.loadUserData();
      yield this.forceAddCurrentUser();
      yield this.loadCompanyUsers();
    });
  }
  forceAddCurrentUser() {
    return __async(this, null, function* () {
      const currentUser = this.authService.getCurrentUser();
      const company = this.currentCompany();
      console.log("Force adding current user - User:", currentUser?.email, "Company:", company?.name, "ID:", company?.id);
      if (!currentUser || !company || !currentUser.email || !company.id) {
        console.log("Missing data for force add user");
        return;
      }
      try {
        const existingUsers = yield this.companyService.getCompanyUsers(company.id);
        const userExists = existingUsers.some((u) => u.email === currentUser.email);
        console.log("User already exists in company:", userExists);
        if (!userExists) {
          const role = currentUser.email === company.ownerEmail ? "admin" : "user";
          console.log("Adding user with role:", role);
          yield this.companyService.addUserToCompany(company.id, currentUser.email, role);
          console.log("User added successfully");
        }
      } catch (error) {
        console.error("Error in forceAddCurrentUser:", error);
      }
    });
  }
  syncCurrentUserToCompany() {
    return __async(this, null, function* () {
      const currentUser = this.authService.getCurrentUser();
      const company = this.currentCompany();
      if (!currentUser || !company || !currentUser.email)
        return;
      try {
        const existingUser = this.users().find((u) => u.email === currentUser.email);
        if (!existingUser) {
          const role = currentUser.email === company.ownerEmail ? "admin" : "user";
          yield this.companyService.addUserToCompany(company.id, currentUser.email, role);
          yield this.loadCompanyUsers();
        }
      } catch (error) {
        console.error("Erro ao sincronizar usu\xE1rio atual:", error);
      }
    });
  }
  loadUserData() {
    return __async(this, null, function* () {
      const company = this.subdomainService.getCurrentCompany();
      const user = this.authService.getCurrentUser();
      this.currentCompany.set(company);
      this.currentUser.set(user);
    });
  }
  ensureCompanyContext() {
    return __async(this, null, function* () {
      let company = this.subdomainService.getCurrentCompany();
      if (!company) {
        try {
          company = yield this.subdomainService.initializeFromSubdomain();
        } catch {
        }
      }
      if (!company) {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser?.email) {
          try {
            const found = yield this.companyService.getCompanyByUserEmail(currentUser.email);
            if (found) {
              this.subdomainService.setCurrentCompany(found);
              this.currentCompany.set(found);
            }
          } catch {
          }
        }
      } else {
        this.currentCompany.set(company);
      }
    });
  }
  loadCompanyUsers() {
    return __async(this, null, function* () {
      let company = this.currentCompany();
      if (!company || !company.id) {
        yield this.ensureCompanyContext();
        company = this.currentCompany();
        if (!company || !company.id)
          return;
      }
      this.isLoading.set(true);
      try {
        let allUsers = yield this.companyService.getAllCompanyUsers(company.id);
        const activeUsers = allUsers.filter((user) => {
          return !user.inviteStatus || user.inviteStatus === "accepted" || user.uid && user.uid.trim() !== "";
        });
        const pendingUsers = allUsers.filter((user) => {
          return user.inviteStatus === "pending";
        });
        let users = activeUsers;
        if (users.length === 0) {
          const currentUser = this.authService.getCurrentUser();
          console.log("No users found, current user:", currentUser);
          if (currentUser && currentUser.email) {
            const role = currentUser.email === company.ownerEmail ? "admin" : "user";
            const fakeUser = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || this.extractNameFromEmail(currentUser.email),
              role,
              permissions: [],
              joinedAt: /* @__PURE__ */ new Date(),
              photoURL: currentUser.photoURL,
              emailVerified: currentUser.emailVerified,
              inviteStatus: "accepted"
            };
            users = [fakeUser];
            this.companyService.addUserToCompany(company.id, currentUser.email, fakeUser.role).catch(() => {
            });
          }
        }
        const enrichedUsers = users.map((user) => {
          try {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser && currentUser.email === user.email) {
              return __spreadProps(__spreadValues({}, user), {
                displayName: currentUser.displayName || user.displayName || this.extractNameFromEmail(user.email),
                photoURL: currentUser.photoURL || user.photoURL,
                emailVerified: currentUser.emailVerified || user.emailVerified,
                uid: currentUser.uid || user.uid,
                // Preservar dados do convite se existirem
                inviteStatus: user.inviteStatus || "accepted",
                inviteToken: user.inviteToken
              });
            }
            return __spreadProps(__spreadValues({}, user), {
              displayName: user.displayName || this.extractNameFromEmail(user.email),
              // Preservar dados do convite
              inviteStatus: user.inviteStatus || "accepted",
              inviteToken: user.inviteToken
            });
          } catch (error) {
            console.warn("Erro ao enriquecer dados do usu\xE1rio:", user.email, error);
            return __spreadProps(__spreadValues({}, user), {
              displayName: user.displayName || this.extractNameFromEmail(user.email),
              // Preservar dados do convite mesmo em erro
              inviteStatus: user.inviteStatus || "accepted",
              inviteToken: user.inviteToken
            });
          }
        });
        this.users.set(enrichedUsers);
        this.pendingInvites.set(pendingUsers);
        console.log("\u{1F4CA} Debug Users Loaded:", {
          total: allUsers.length,
          active: enrichedUsers.length,
          pending: pendingUsers.length,
          pendingDetails: pendingUsers.map((u) => ({
            email: u.email,
            name: u.displayName,
            status: u.inviteStatus,
            joinedAt: u.joinedAt,
            token: u.inviteToken ? "present" : "missing"
          }))
        });
      } catch (error) {
        console.error("Erro ao carregar usu\xE1rios:", error);
        this.pendingInvites.set([]);
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  extractNameFromEmail(email) {
    const localPart = email.split("@")[0];
    return localPart.replace(/[._]/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  }
  inviteUser() {
    return __async(this, null, function* () {
      const email = this.inviteEmail().trim();
      const name = this.inviteName().trim();
      const role = this.inviteRole();
      const company = this.currentCompany();
      if (!email || !company)
        return;
      if (!name) {
        this.inviteError.set("Nome \xE9 obrigat\xF3rio");
        return;
      }
      if (name.length < 2) {
        this.inviteError.set("Nome deve ter pelo menos 2 caracteres");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.inviteError.set("Email inv\xE1lido");
        return;
      }
      const existingUser = this.users().find((u) => u.email === email);
      if (existingUser) {
        this.inviteError.set("Este usu\xE1rio j\xE1 faz parte da empresa");
        return;
      }
      this.inviteLoading.set(true);
      this.inviteError.set(null);
      this.inviteSuccess.set(null);
      try {
        yield this.companyService.addUserToCompany(company.id, email, role, name);
        this.inviteSuccess.set(`Convite enviado para ${name} (${email})`);
        this.inviteEmail.set("");
        this.inviteName.set("");
        this.inviteRole.set("user");
        yield this.loadCompanyUsers();
        setTimeout(() => {
          this.showInviteForm.set(false);
          this.inviteSuccess.set(null);
        }, 2e3);
      } catch (error) {
        console.error("Erro ao convidar usu\xE1rio:", error);
        let errorMessage = "Erro ao enviar convite. Tente novamente.";
        if (error?.message) {
          if (error.message.includes("Configura\xE7\xE3o SMTP")) {
            errorMessage = `\u274C ${error.message}. Configure o SMTP na se\xE7\xE3o de configura\xE7\xF5es antes de enviar convites.`;
          } else if (error.message.includes("email de convite")) {
            errorMessage = error.message;
          } else {
            errorMessage = `Erro: ${error.message}`;
          }
        }
        this.inviteError.set(errorMessage);
      } finally {
        this.inviteLoading.set(false);
      }
    });
  }
  removeUser(userEmail) {
    console.log("\u{1F680} Debug - removeUser chamado para:", userEmail);
    const company = this.currentCompany();
    const currentUser = this.currentUser();
    console.log("\u{1F3E2} Debug - Company:", !!company);
    console.log("\u{1F464} Debug - Current user:", !!currentUser);
    if (!company || !currentUser) {
      console.log("\u274C Debug - Company ou usu\xE1rio n\xE3o encontrado");
      return;
    }
    if (userEmail === currentUser.email) {
      this.showConfirmation("A\xE7\xE3o n\xE3o permitida", 'Voc\xEA n\xE3o pode remover a si mesmo. Use a op\xE7\xE3o "Excluir Empresa" se deseja sair.', () => {
      }, "Entendi", "btn-primary");
      return;
    }
    const user = this.users().find((u) => u.email === userEmail);
    const userName = user?.displayName || userEmail;
    this.showConfirmation("Confirmar exclus\xE3o", `Deseja realmente remover <strong>${userName}</strong> (${userEmail}) da empresa?<br><br>Esta a\xE7\xE3o n\xE3o pode ser desfeita.`, () => this.confirmRemoveUser(userEmail), "Excluir Usu\xE1rio", "btn-danger");
  }
  confirmRemoveUser(userEmail) {
    return __async(this, null, function* () {
      const company = this.currentCompany();
      if (!company) {
        console.error("\u{1F6AB} Debug - Empresa n\xE3o encontrada");
        return;
      }
      console.log("\u{1F5D1}\uFE0F Debug - Iniciando remo\xE7\xE3o do usu\xE1rio:", { userEmail, companyId: company.id });
      this.isLoading.set(true);
      try {
        console.log("\u{1F504} Debug - Chamando removeUserFromCompany...");
        yield this.companyService.removeUserFromCompany(company.id, userEmail);
        console.log("\u2705 Debug - Usu\xE1rio removido do Firestore");
        console.log("\u{1F504} Debug - Recarregando lista de usu\xE1rios...");
        yield this.loadCompanyUsers();
        console.log("\u2705 Debug - Lista de usu\xE1rios recarregada");
        this.inviteSuccess.set(`Usu\xE1rio ${userEmail} removido com sucesso.`);
        setTimeout(() => {
          this.inviteSuccess.set(null);
        }, 3e3);
      } catch (error) {
        console.error("\u274C Debug - Erro ao remover usu\xE1rio:", error);
        this.showConfirmation("Erro ao remover usu\xE1rio", "Ocorreu um erro ao tentar remover o usu\xE1rio. Tente novamente.", () => {
        }, "Fechar", "btn-primary");
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  changeUserRole(userEmail, newRole) {
    return __async(this, null, function* () {
      const company = this.currentCompany();
      if (!company)
        return;
      this.isLoading.set(true);
      try {
        yield this.companyService.updateUserRole(company.id, userEmail, newRole);
        yield this.loadCompanyUsers();
      } catch (error) {
        console.error("Erro ao alterar fun\xE7\xE3o do usu\xE1rio:", error);
        this.showConfirmation("Erro ao alterar fun\xE7\xE3o", "Ocorreu um erro ao alterar a fun\xE7\xE3o do usu\xE1rio. Tente novamente.", () => {
        }, "Fechar", "btn-primary");
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  resendInvite(userEmail) {
    return __async(this, null, function* () {
      const company = this.currentCompany();
      if (!company)
        return;
      this.isLoading.set(true);
      try {
        const user = this.users().find((u) => u.email === userEmail);
        if (user) {
          yield this.companyService.addUserToCompany(company.id, userEmail, user.role, user.displayName);
          this.inviteSuccess.set(`Convite reenviado para ${userEmail}`);
          setTimeout(() => {
            this.inviteSuccess.set(null);
          }, 3e3);
          yield this.loadCompanyUsers();
        }
      } catch (error) {
        console.error("Erro ao reenviar convite:", error);
        let errorMessage = "Erro ao reenviar convite. Tente novamente.";
        if (error?.message && error.message.includes("Configura\xE7\xE3o SMTP")) {
          errorMessage = `\u274C ${error.message}. Configure o SMTP na se\xE7\xE3o de configura\xE7\xF5es antes de reenviar convites.`;
        }
        this.inviteError.set(errorMessage);
        setTimeout(() => {
          this.inviteError.set(null);
        }, 5e3);
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  inactivateUser(userEmail) {
    const company = this.currentCompany();
    if (!company)
      return;
    const user = this.users().find((u) => u.email === userEmail);
    const userName = user?.displayName || userEmail;
    this.showConfirmation("Confirmar inativa\xE7\xE3o", `Deseja realmente inativar <strong>${userName}</strong> (${userEmail})?<br><br>O usu\xE1rio n\xE3o poder\xE1 mais acessar o sistema at\xE9 ser reativado.`, () => this.confirmInactivateUser(userEmail), "Inativar Usu\xE1rio", "btn-danger");
  }
  confirmInactivateUser(userEmail) {
    return __async(this, null, function* () {
      const company = this.currentCompany();
      if (!company)
        return;
      this.isLoading.set(true);
      try {
        yield this.companyService.updateUserInCompany(company.id, userEmail, {
          inviteStatus: "inactive"
        });
        yield this.loadCompanyUsers();
        this.inviteSuccess.set(`Usu\xE1rio ${userEmail} foi inativado com sucesso.`);
        setTimeout(() => {
          this.inviteSuccess.set(null);
        }, 3e3);
      } catch (error) {
        console.error("Erro ao inativar usu\xE1rio:", error);
        this.showConfirmation("Erro ao inativar usu\xE1rio", "Ocorreu um erro ao tentar inativar o usu\xE1rio. Tente novamente.", () => {
        }, "Fechar", "btn-primary");
      } finally {
        this.isLoading.set(false);
      }
    });
  }
  deletePendingInvite(userEmail) {
    return __async(this, null, function* () {
      const company = this.currentCompany();
      if (!company?.id)
        return;
      this.showConfirmation("Excluir Convite Pendente", `Tem certeza que deseja excluir o convite pendente para ${userEmail}? Esta a\xE7\xE3o n\xE3o pode ser desfeita.`, () => __async(this, null, function* () {
        try {
          yield this.companyService.removeUserFromCompany(company.id, userEmail);
          yield this.loadCompanyUsers();
          this.inviteSuccess.set(`Convite para ${userEmail} foi exclu\xEDdo com sucesso.`);
          setTimeout(() => {
            this.inviteSuccess.set(null);
          }, 3e3);
        } catch (error) {
          console.error("Erro ao excluir convite:", error);
          this.inviteError.set("Erro ao excluir convite. Tente novamente.");
          setTimeout(() => {
            this.inviteError.set(null);
          }, 3e3);
        }
      }), "Excluir", "btn-danger");
    });
  }
  markInviteAsAccepted(userEmail) {
    return __async(this, null, function* () {
      const company = this.currentCompany();
      if (!company?.id)
        return;
      this.showConfirmation("Marcar Convite como Aceito", `Deseja marcar o convite de ${userEmail} como aceito? Isso ir\xE1 ativar o usu\xE1rio na empresa.`, () => __async(this, null, function* () {
        try {
          yield this.companyService.updateUserInCompany(company.id, userEmail, {
            inviteStatus: "accepted",
            inviteToken: null,
            acceptedAt: /* @__PURE__ */ new Date()
          });
          yield this.loadCompanyUsers();
          this.inviteSuccess.set(`Convite de ${userEmail} marcado como aceito com sucesso.`);
          setTimeout(() => {
            this.inviteSuccess.set(null);
          }, 3e3);
        } catch (error) {
          console.error("Erro ao marcar convite como aceito:", error);
          this.inviteError.set("Erro ao atualizar convite. Tente novamente.");
          setTimeout(() => {
            this.inviteError.set(null);
          }, 3e3);
        }
      }), "Marcar como Aceito", "btn-success");
    });
  }
  formatDate(date) {
    if (!date)
      return "N/A";
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Data inv\xE1lida";
    }
  }
  canManageUsers() {
    const currentUser = this.currentUser();
    const company = this.currentCompany();
    if (!currentUser || !company)
      return false;
    if (company.ownerEmail === currentUser.email) {
      return true;
    }
    if (this.users().length > 0) {
      const userInCompany = this.users().find((u) => u.email === currentUser.email);
      return userInCompany?.role === "admin";
    }
    return true;
  }
  showInviteFormToggle() {
    this.showInviteForm.set(!this.showInviteForm());
    this.inviteError.set(null);
    this.inviteSuccess.set(null);
    this.inviteEmail.set("");
    this.inviteName.set("");
  }
  showConfirmation(title, message, action, buttonText = "Confirmar", buttonClass = "btn-danger") {
    console.log("\u{1F4F1} Debug Modal - Mostrando confirma\xE7\xE3o:", { title, buttonText });
    this.confirmTitle.set(title);
    this.confirmMessage.set(message);
    this.confirmAction.set(action);
    this.confirmButtonText.set(buttonText);
    this.confirmButtonClass.set(buttonClass);
    this.showConfirmModal.set(true);
    console.log("\u2705 Debug Modal - Modal configurado e aberto");
  }
  confirmModalAction() {
    console.log("\u{1F504} Debug Modal - Confirmando a\xE7\xE3o...");
    const action = this.confirmAction();
    console.log("\u{1F3AF} Debug Modal - A\xE7\xE3o encontrada:", !!action);
    if (action) {
      console.log("\u25B6\uFE0F Debug Modal - Executando a\xE7\xE3o...");
      action();
    } else {
      console.log("\u274C Debug Modal - Nenhuma a\xE7\xE3o para executar");
    }
    this.showConfirmModal.set(false);
    console.log("\u2705 Debug Modal - Modal fechado");
  }
  cancelModalAction() {
    this.showConfirmModal.set(false);
    this.confirmAction.set(null);
  }
  getRoleLabel(role) {
    switch (role) {
      case "admin":
        return "Administrador";
      case "manager":
        return "Gerente";
      case "user":
        return "Usu\xE1rio";
      default:
        return role;
    }
  }
  getRoleBadgeClass(role) {
    switch (role) {
      case "admin":
        return "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800";
      case "manager":
        return "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800";
      case "user":
        return "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800";
      default:
        return "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800";
    }
  }
  getStatusLabel(status) {
    switch (status) {
      case "pending":
        return "Convite Pendente";
      case "accepted":
        return "Ativo";
      case "expired":
        return "Convite Expirado";
      case "inactive":
        return "Inativo";
      default:
        return "Desconhecido";
    }
  }
  getStatusBadgeClass(status) {
    switch (status) {
      case "pending":
        return "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800";
      case "accepted":
        return "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800";
      case "expired":
        return "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800";
      case "inactive":
        return "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800";
      default:
        return "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800";
    }
  }
  getPrimaryColor() {
    const company = this.subdomainService.getCurrentCompany();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || "#3B82F6";
  }
  formatJoinedDate(joinedAt) {
    if (!joinedAt) {
      return "Data n\xE3o dispon\xEDvel";
    }
    try {
      if (joinedAt && typeof joinedAt.toDate === "function") {
        return joinedAt.toDate().toLocaleDateString("pt-BR");
      }
      if (joinedAt instanceof Date) {
        return joinedAt.toLocaleDateString("pt-BR");
      }
      if (typeof joinedAt === "string") {
        return new Date(joinedAt).toLocaleDateString("pt-BR");
      }
      return "Data n\xE3o dispon\xEDvel";
    } catch (error) {
      console.warn("Erro ao formatar data:", joinedAt, error);
      return "Data n\xE3o dispon\xEDvel";
    }
  }
};
__name(_UserManagementComponent, "UserManagementComponent");
__publicField(_UserManagementComponent, "\u0275fac", /* @__PURE__ */ __name(function UserManagementComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _UserManagementComponent)();
}, "UserManagementComponent_Factory"));
__publicField(_UserManagementComponent, "\u0275cmp", /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserManagementComponent, selectors: [["app-user-management"]], decls: 12, vars: 5, consts: [["title", "Gerenciar Usu\xE1rios"], [1, "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "background-color", "disabled"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-8"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "p-6"], [1, "mb-6", "p-4", "bg-blue-50", "border", "border-blue-200", "rounded-lg"], [1, "text-center", "py-8"], [1, "overflow-x-auto"], [1, "mt-8"], [1, "fixed", "inset-0", "bg-gray-600", "bg-opacity-50", "overflow-y-auto", "h-full", "w-full", "z-50", "flex", "items-center", "justify-center"], [1, "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "click", "disabled"], [1, "fas", "fa-plus", "mr-1"], [1, "flex", "items-center", "mb-3"], [1, "fas", "fa-info-circle", "text-blue-500", "mr-2"], [1, "text-blue-800"], [1, "text-blue-700", "text-sm", "mb-4"], [1, "mb-4", "p-3", "bg-green-50", "border", "border-green-200", "rounded", "text-green-800"], [1, "mb-4", "p-3", "bg-red-50", "border", "border-red-200", "rounded", "text-red-800"], [1, "space-y-4", 3, "submit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["type", "text", "name", "name", "placeholder", "Jo\xE3o Silva", "required", "", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "input", "value"], ["type", "email", "name", "email", "placeholder", "usuario@exemplo.com", "required", "", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "input", "value"], [1, "grid", "grid-cols-1", "md:grid-cols-1", "gap-4"], ["name", "role", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "change", "value"], ["value", "user"], ["value", "manager"], ["value", "admin"], [1, "flex", "space-x-3"], ["type", "submit", 1, "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", "disabled:opacity-50", 3, "disabled"], ["type", "button", 1, "bg-gray-500", "hover:bg-gray-600", "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "fas", "fa-times", "mr-1"], [1, "fas", "fa-check-circle", "mr-2"], [1, "fas", "fa-exclamation-circle", "mr-2"], [1, "fas", "fa-spinner", "fa-spin", "mr-1"], [1, "fas", "fa-paper-plane", "mr-1"], [1, "fas", "fa-spinner", "fa-spin", "text-2xl", "text-gray-400", "mb-4"], [1, "text-gray-600"], [1, "fas", "fa-users", "text-4xl", "text-gray-300", "mb-4"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-2"], [1, "text-gray-600", "mb-4"], [1, "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "background-color"], [1, "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "min-w-full", "divide-y", "divide-gray-200"], [1, "bg-gray-50"], [1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-gray-500", "uppercase", "tracking-wider"], [1, "px-6", "py-3", "text-right", "text-xs", "font-medium", "text-gray-500", "uppercase", "tracking-wider"], [1, "bg-white", "divide-y", "divide-gray-200"], [1, "hover:bg-gray-50"], [1, "px-6", "py-4", "whitespace-nowrap"], [1, "flex", "items-center"], [1, "flex-shrink-0", "h-10", "w-10"], [1, "h-10", "w-10", "rounded-full", "bg-blue-500", "flex", "items-center", "justify-center", "text-white", "font-medium"], [1, "fas", "fa-user-circle", "text-2xl", "text-gray-400"], [1, "ml-4"], [1, "text-sm", "font-medium", "text-gray-900"], [1, "text-xs", "text-blue-600", "font-medium"], [1, "text-xs", "text-purple-600", "font-medium"], [1, "text-sm", "text-gray-900"], [1, "text-sm", "border", "border-gray-300", "rounded", "px-2", "py-1", "focus:ring-blue-500", "focus:border-blue-500", 3, "value", "disabled"], [3, "class"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "text-gray-500"], [1, "px-6", "py-4", "whitespace-nowrap", "text-right", "text-sm", "font-medium"], [1, "flex", "space-x-2", "justify-end"], [1, "text-sm", "border", "border-gray-300", "rounded", "px-2", "py-1", "focus:ring-blue-500", "focus:border-blue-500", 3, "change", "value", "disabled"], ["title", "Reenviar convite", 1, "text-blue-600", "hover:text-blue-800", "text-sm", 3, "disabled"], ["title", "Inativar usu\xE1rio", 1, "text-orange-600", "hover:text-orange-800", "text-sm", 3, "disabled"], ["title", "Excluir usu\xE1rio", 1, "text-red-600", "hover:text-red-800", "text-sm", 3, "click", "disabled"], [1, "fas", "fa-trash", "mr-1"], ["title", "Reenviar convite", 1, "text-blue-600", "hover:text-blue-800", "text-sm", 3, "click", "disabled"], [1, "fas", "fa-envelope", "mr-1"], ["title", "Inativar usu\xE1rio", 1, "text-orange-600", "hover:text-orange-800", "text-sm", 3, "click", "disabled"], [1, "fas", "fa-user-slash", "mr-1"], [1, "border-t", "border-gray-200", "pt-6"], [1, "text-lg", "font-medium", "text-gray-900", "mb-4"], [1, "fas", "fa-clock", "text-yellow-500", "mr-2"], [1, "bg-yellow-50"], [1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-yellow-700", "uppercase", "tracking-wider"], [1, "px-6", "py-3", "text-right", "text-xs", "font-medium", "text-yellow-700", "uppercase", "tracking-wider"], [1, "hover:bg-yellow-50"], [1, "w-10", "h-10", "bg-yellow-100", "rounded-full", "flex", "items-center", "justify-center"], [1, "fas", "fa-user", "text-yellow-600"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "text-gray-900"], [1, "inline-flex", "px-2", "py-1", "text-xs", "font-semibold", "rounded-full", "bg-blue-100", "text-blue-800"], [1, "inline-flex", "px-2", "py-1", "text-xs", "font-semibold", "rounded-full", "bg-yellow-100", "text-yellow-800"], [1, "fas", "fa-clock", "mr-1"], [1, "px-6", "py-4", "whitespace-nowrap", "text-right", "text-sm", "font-medium", "space-x-2"], ["type", "button", "title", "Reenviar convite", 1, "text-blue-600", "hover:text-blue-900", "transition-colors", 3, "click"], ["type", "button", "title", "Marcar como aceito", 1, "text-green-600", "hover:text-green-900", "transition-colors", 3, "click"], [1, "fas", "fa-check", "mr-1"], ["type", "button", "title", "Excluir convite", 1, "text-red-600", "hover:text-red-900", "transition-colors", 3, "click"], [1, "relative", "bg-white", "rounded-lg", "shadow-xl", "max-w-md", "mx-auto"], [1, "px-6", "py-4", "border-b", "border-gray-200"], [1, "text-lg", "font-semibold", "text-gray-900"], [1, "px-6", "py-4"], [1, "text-gray-700", 3, "innerHTML"], [1, "px-6", "py-4", "border-t", "border-gray-200", "flex", "justify-end", "space-x-3"], ["type", "button", 1, "px-4", "py-2", "text-sm", "font-medium", "text-gray-700", "bg-gray-200", "hover:bg-gray-300", "rounded-md", "transition-colors", 3, "click"], ["type", "button", 1, "px-4", "py-2", "text-sm", "font-medium", "text-white", "rounded-md", "transition-colors", 3, "click"]], template: /* @__PURE__ */ __name(function UserManagementComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "app-main-layout")(1, "app-config-header", 0);
    \u0275\u0275conditionalCreate(2, UserManagementComponent_Conditional_2_Template, 3, 3, "button", 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 2)(4, "div", 3)(5, "div", 4);
    \u0275\u0275conditionalCreate(6, UserManagementComponent_Conditional_6_Template, 37, 9, "div", 5);
    \u0275\u0275conditionalCreate(7, UserManagementComponent_Conditional_7_Template, 4, 0, "div", 6)(8, UserManagementComponent_Conditional_8_Template, 7, 1, "div", 6)(9, UserManagementComponent_Conditional_9_Template, 19, 0, "div", 7);
    \u0275\u0275conditionalCreate(10, UserManagementComponent_Conditional_10_Template, 24, 1, "div", 8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(11, UserManagementComponent_Conditional_11_Template, 12, 5, "div", 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx.canManageUsers() ? 2 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx.showInviteForm() ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.isLoading() ? 7 : ctx.users().length === 0 ? 8 : 9);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx.pendingInvites().length > 0 && ctx.canManageUsers() ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx.showConfirmModal() ? 11 : -1);
  }
}, "UserManagementComponent_Template"), dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, NgControlStatusGroup, NgForm, ConfigHeaderComponent, MainLayoutComponent], styles: ["\n\n.user-management-container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}\n.invite-form[_ngcontent-%COMP%] {\n  background-color: #f8f9fa;\n  border: 1px solid #dee2e6;\n  border-radius: 8px;\n  padding: 20px;\n}\n.user-avatar[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background-color: #007bff;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: bold;\n  flex-shrink: 0;\n}\n.avatar-initials[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: bold;\n}\n.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  border-top: none;\n  font-weight: 600;\n  color: #495057;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: middle;\n}\n.badge[_ngcontent-%COMP%] {\n  padding: 6px 12px;\n  font-size: 12px;\n  font-weight: 500;\n}\n.badge-danger[_ngcontent-%COMP%] {\n  background-color: #dc3545;\n  color: white;\n}\n.badge-warning[_ngcontent-%COMP%] {\n  background-color: #ffc107;\n  color: #212529;\n}\n.badge-info[_ngcontent-%COMP%] {\n  background-color: #17a2b8;\n  color: white;\n}\n.badge-secondary[_ngcontent-%COMP%] {\n  background-color: #6c757d;\n  color: white;\n}\n.danger-zone[_ngcontent-%COMP%] {\n  border: 1px solid #dc3545;\n  border-radius: 6px;\n  padding: 20px;\n  background-color: #fff5f5;\n}\n.danger-zone[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  color: #dc3545 !important;\n}\n.modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1040;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.modal[_ngcontent-%COMP%] {\n  z-index: 1050;\n}\n.modal-dialog[_ngcontent-%COMP%] {\n  max-width: 500px;\n  margin: 1.75rem auto;\n}\n.btn[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n}\n.btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.btn-sm[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n  font-size: 12px;\n}\n.form-control[_ngcontent-%COMP%]:focus, \n.form-select[_ngcontent-%COMP%]:focus {\n  border-color: #007bff;\n  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.alert[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  border: none;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.gap-2[_ngcontent-%COMP%] {\n  gap: 8px;\n}\n.d-flex[_ngcontent-%COMP%] {\n  display: flex;\n}\n.align-items-center[_ngcontent-%COMP%] {\n  align-items: center;\n}\n.justify-content-between[_ngcontent-%COMP%] {\n  justify-content: space-between;\n}\n.ms-2[_ngcontent-%COMP%] {\n  margin-left: 8px;\n}\n.mt-2[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.mb-2[_ngcontent-%COMP%] {\n  margin-bottom: 8px;\n}\n.mb-3[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.mb-4[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.py-4[_ngcontent-%COMP%] {\n  padding-top: 24px;\n  padding-bottom: 24px;\n}\n.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.text-muted[_ngcontent-%COMP%] {\n  color: #6c757d !important;\n}\n.text-primary[_ngcontent-%COMP%] {\n  color: #007bff !important;\n}\n.text-success[_ngcontent-%COMP%] {\n  color: #28a745 !important;\n}\n.text-danger[_ngcontent-%COMP%] {\n  color: #dc3545 !important;\n}\n.fw-bold[_ngcontent-%COMP%] {\n  font-weight: bold;\n}\n.small[_ngcontent-%COMP%] {\n  font-size: 0.875em;\n}\n@media (max-width: 768px) {\n  .user-management-container[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n  .invite-form[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%] {\n    gap: 10px;\n  }\n  .invite-form[_ngcontent-%COMP%]   .col-md-2[_ngcontent-%COMP%], \n   .invite-form[_ngcontent-%COMP%]   .col-md-4[_ngcontent-%COMP%], \n   .invite-form[_ngcontent-%COMP%]   .col-md-6[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .table-responsive[_ngcontent-%COMP%] {\n    font-size: 14px;\n  }\n  .user-avatar[_ngcontent-%COMP%] {\n    width: 32px;\n    height: 32px;\n    font-size: 14px;\n  }\n}\n/*# sourceMappingURL=user-management.component.css.map */"] }));
var UserManagementComponent = _UserManagementComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserManagementComponent, [{
    type: Component,
    args: [{ selector: "app-user-management", standalone: true, imports: [CommonModule, FormsModule, ConfigHeaderComponent, MainLayoutComponent], template: `<app-main-layout>
  <app-config-header title="Gerenciar Usu\xE1rios">
    @if (canManageUsers()) {
      <button 
        class="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        [style.background-color]="getPrimaryColor()"
        (click)="showInviteFormToggle()"
        [disabled]="inviteLoading()">
        <i class="fas fa-plus mr-1"></i>
        Convidar Usu\xE1rio
      </button>
    }
  </app-config-header>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6">
        <!-- Invite Form -->
        @if (showInviteForm()) {
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center mb-3">
              <i class="fas fa-info-circle text-blue-500 mr-2"></i>
              <strong class="text-blue-800">Convidar Usu\xE1rio</strong>
            </div>
            <p class="text-blue-700 text-sm mb-4">O usu\xE1rio receber\xE1 um email de convite para se juntar \xE0 empresa.</p>

            @if (inviteSuccess()) {
              <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-800">
                <i class="fas fa-check-circle mr-2"></i>
                {{ inviteSuccess() }}
              </div>
            }

            @if (inviteError()) {
              <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ inviteError() }}
              </div>
            }

            <form (submit)="inviteUser(); $event.preventDefault()" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Usu\xE1rio *</label>
                  <input
                    type="text"
                    name="name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [value]="inviteName()"
                    (input)="inviteName.set($any($event.target).value)"
                    placeholder="Jo\xE3o Silva"
                    required>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email do Usu\xE1rio *</label>
                  <input
                    type="email"
                    name="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [value]="inviteEmail()"
                    (input)="inviteEmail.set($any($event.target).value)"
                    placeholder="usuario@exemplo.com"
                    required>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fun\xE7\xE3o</label>
                  <select
                    name="role"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [value]="inviteRole()"
                    (change)="inviteRole.set($any($event.target).value)">
                    <option value="user">Usu\xE1rio</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
              
              <div class="flex space-x-3">
                <button
                  type="submit"
                  class="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  [style.background-color]="getPrimaryColor()"
                  [disabled]="inviteLoading() || !inviteEmail().trim() || !inviteName().trim()">
                  @if (inviteLoading()) {
                    <i class="fas fa-spinner fa-spin mr-1"></i>
                    Enviando...
                  } @else {
                    <i class="fas fa-paper-plane mr-1"></i>
                    Enviar Convite
                  }
                </button>
                
                <button
                  type="button"
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  (click)="showInviteForm.set(false)">
                  <i class="fas fa-times mr-1"></i>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        }

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-gray-400 mb-4"></i>
            <p class="text-gray-600">Carregando usu\xE1rios...</p>
          </div>
        }

        <!-- Empty State -->
        @else if (users().length === 0) {
          <div class="text-center py-8">
            <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
            <h5 class="text-lg font-semibold text-gray-900 mb-2">Nenhum usu\xE1rio encontrado</h5>
            <p class="text-gray-600 mb-4">Convide usu\xE1rios para colaborar na sua empresa.</p>
            @if (canManageUsers()) {
              <button 
                class="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                [style.background-color]="getPrimaryColor()"
                (click)="showInviteFormToggle()">
                <i class="fas fa-plus mr-1"></i>
                Convidar Primeiro Usu\xE1rio
              </button>
            }
          </div>
        }

        <!-- Users Table -->
        @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usu\xE1rio</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fun\xE7\xE3o</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membro desde</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">A\xE7\xF5es</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (user of users(); track user.email) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          @if (user.displayName) {
                            <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                              {{ user.displayName.charAt(0).toUpperCase() }}
                            </div>
                          } @else {
                            <i class="fas fa-user-circle text-2xl text-gray-400"></i>
                          }
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ user.displayName || 'Usu\xE1rio sem nome' }}
                          </div>
                          @if (user.email === currentUser()?.email) {
                            <span class="text-xs text-blue-600 font-medium">(Voc\xEA)</span>
                          }
                          @if (user.email === currentCompany()?.ownerEmail) {
                            <span class="text-xs text-purple-600 font-medium">(Propriet\xE1rio)</span>
                          }
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ user.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (canManageUsers() && user.email !== currentCompany()?.ownerEmail) {
                        <select
                          class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                          [value]="user.role"
                          [disabled]="isLoading()"
                          (change)="changeUserRole(user.email, $any($event.target).value)">
                          <option value="user">Usu\xE1rio</option>
                          <option value="manager">Gerente</option>
                          <option value="admin">Administrador</option>
                        </select>
                      } @else {
                        <span [class]="getRoleBadgeClass(user.role)">
                          {{ getRoleLabel(user.role) }}
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="getStatusBadgeClass(user.inviteStatus || 'accepted')">
                        {{ getStatusLabel(user.inviteStatus || 'accepted') }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatJoinedDate(user.joinedAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      @if (canManageUsers() && user.email !== currentUser()?.email && user.email !== currentCompany()?.ownerEmail) {
                        <div class="flex space-x-2 justify-end">
                          <!-- Reenviar convite - apenas para status pending -->
                          @if (user.inviteStatus === 'pending') {
                            <button
                              class="text-blue-600 hover:text-blue-800 text-sm"
                              (click)="resendInvite(user.email)"
                              [disabled]="isLoading()"
                              title="Reenviar convite">
                              <i class="fas fa-envelope mr-1"></i>
                              Reenviar
                            </button>
                          }
                          
                          <!-- Inativar - apenas para usu\xE1rios aceitos -->
                          @if (user.inviteStatus === 'accepted') {
                            <button
                              class="text-orange-600 hover:text-orange-800 text-sm"
                              (click)="inactivateUser(user.email)"
                              [disabled]="isLoading()"
                              title="Inativar usu\xE1rio">
                              <i class="fas fa-user-slash mr-1"></i>
                              Inativar
                            </button>
                          }
                          
                          <!-- Excluir - dispon\xEDvel para todos -->
                          <button
                            class="text-red-600 hover:text-red-800 text-sm"
                            (click)="removeUser(user.email)"
                            [disabled]="isLoading()"
                            title="Excluir usu\xE1rio">
                            <i class="fas fa-trash mr-1"></i>
                            Excluir
                          </button>
                        </div>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- Pending Invites Section -->
        @if (pendingInvites().length > 0 && canManageUsers()) {
          <div class="mt-8">
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                <i class="fas fa-clock text-yellow-500 mr-2"></i>
                Convites Pendentes ({{ pendingInvites().length }})
              </h3>
              
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-yellow-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Usu\xE1rio Convidado</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Email</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Fun\xE7\xE3o</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Convidado em</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-yellow-700 uppercase tracking-wider">A\xE7\xF5es</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (invite of pendingInvites(); track invite.email) {
                      <tr class="hover:bg-yellow-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                              <i class="fas fa-user text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">
                                {{ invite.displayName || 'Nome n\xE3o informado' }}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ invite.email }}
                        </td>
                        
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {{ invite.role || 'user' }}
                          </span>
                        </td>
                        
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(invite.joinedAt) }}
                        </td>
                        
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <i class="fas fa-clock mr-1"></i>
                            Pendente
                          </span>
                        </td>
                        
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            type="button"
                            (click)="resendInvite(invite.email)"
                            class="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Reenviar convite">
                            <i class="fas fa-paper-plane mr-1"></i>
                            Reenviar
                          </button>
                          
                          <button
                            type="button"
                            (click)="markInviteAsAccepted(invite.email)"
                            class="text-green-600 hover:text-green-900 transition-colors"
                            title="Marcar como aceito">
                            <i class="fas fa-check mr-1"></i>
                            Aceitar
                          </button>
                          
                          <button
                            type="button"
                            (click)="deletePendingInvite(invite.email)"
                            class="text-red-600 hover:text-red-900 transition-colors"
                            title="Excluir convite">
                            <i class="fas fa-trash mr-1"></i>
                            Excluir
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

  </div>

  <!-- Modal de Confirma\xE7\xE3o -->
  @if (showConfirmModal()) {
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md mx-auto">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ confirmTitle() }}</h3>
        </div>
        
        <!-- Content -->
        <div class="px-6 py-4">
          <p class="text-gray-700" [innerHTML]="confirmMessage()"></p>
        </div>
        
        <!-- Actions -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            (click)="cancelModalAction()">
            Cancelar
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
            [class]="confirmButtonClass() === 'btn-danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
            (click)="confirmModalAction()">
            {{ confirmButtonText() }}
          </button>
        </div>
      </div>
    </div>
  }
</app-main-layout>

`, styles: ["/* src/app/components/user-management/user-management.component.scss */\n.user-management-container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}\n.invite-form {\n  background-color: #f8f9fa;\n  border: 1px solid #dee2e6;\n  border-radius: 8px;\n  padding: 20px;\n}\n.user-avatar {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background-color: #007bff;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: bold;\n  flex-shrink: 0;\n}\n.avatar-initials {\n  font-size: 16px;\n  font-weight: bold;\n}\n.table th {\n  border-top: none;\n  font-weight: 600;\n  color: #495057;\n}\n.table td {\n  vertical-align: middle;\n}\n.badge {\n  padding: 6px 12px;\n  font-size: 12px;\n  font-weight: 500;\n}\n.badge-danger {\n  background-color: #dc3545;\n  color: white;\n}\n.badge-warning {\n  background-color: #ffc107;\n  color: #212529;\n}\n.badge-info {\n  background-color: #17a2b8;\n  color: white;\n}\n.badge-secondary {\n  background-color: #6c757d;\n  color: white;\n}\n.danger-zone {\n  border: 1px solid #dc3545;\n  border-radius: 6px;\n  padding: 20px;\n  background-color: #fff5f5;\n}\n.danger-zone h6 {\n  color: #dc3545 !important;\n}\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1040;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.modal {\n  z-index: 1050;\n}\n.modal-dialog {\n  max-width: 500px;\n  margin: 1.75rem auto;\n}\n.btn {\n  border-radius: 6px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n}\n.btn:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.btn-sm {\n  padding: 4px 8px;\n  font-size: 12px;\n}\n.form-control:focus,\n.form-select:focus {\n  border-color: #007bff;\n  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.alert {\n  border-radius: 8px;\n  border: none;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.gap-2 {\n  gap: 8px;\n}\n.d-flex {\n  display: flex;\n}\n.align-items-center {\n  align-items: center;\n}\n.justify-content-between {\n  justify-content: space-between;\n}\n.ms-2 {\n  margin-left: 8px;\n}\n.mt-2 {\n  margin-top: 8px;\n}\n.mb-2 {\n  margin-bottom: 8px;\n}\n.mb-3 {\n  margin-bottom: 16px;\n}\n.mb-4 {\n  margin-bottom: 24px;\n}\n.py-4 {\n  padding-top: 24px;\n  padding-bottom: 24px;\n}\n.text-center {\n  text-align: center;\n}\n.text-muted {\n  color: #6c757d !important;\n}\n.text-primary {\n  color: #007bff !important;\n}\n.text-success {\n  color: #28a745 !important;\n}\n.text-danger {\n  color: #dc3545 !important;\n}\n.fw-bold {\n  font-weight: bold;\n}\n.small {\n  font-size: 0.875em;\n}\n@media (max-width: 768px) {\n  .user-management-container {\n    padding: 10px;\n  }\n  .invite-form .row {\n    gap: 10px;\n  }\n  .invite-form .col-md-2,\n  .invite-form .col-md-4,\n  .invite-form .col-md-6 {\n    width: 100%;\n  }\n  .table-responsive {\n    font-size: 14px;\n  }\n  .user-avatar {\n    width: 32px;\n    height: 32px;\n    font-size: 14px;\n  }\n}\n/*# sourceMappingURL=user-management.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserManagementComponent, { className: "UserManagementComponent", filePath: "src/app/components/user-management/user-management.component.ts", lineNumber: 18 });
})();
export {
  UserManagementComponent
};
//# sourceMappingURL=chunk-NGFC3DD6.js.map
