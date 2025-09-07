import {
  ConfigHeaderComponent
} from "./chunk-43C7U4XV.js";
import {
  MainLayoutComponent
} from "./chunk-ZIJNLXLI.js";
import {
  FormsModule,
  NgControlStatusGroup,
  NgForm,
  NgSelectOption,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-5BCXWPYT.js";
import "./chunk-PTOBJH2A.js";
import {
  AuthService,
  CompanyService,
  SubdomainService
} from "./chunk-L2S3FEQE.js";
import {
  CommonModule,
  Component,
  __async,
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
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-GHLOFODZ.js";

// src/app/components/user-management/user-management.component.ts
var _forTrack0 = ($index, $item) => $item.email;
function UserManagementComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInviteFormToggle());
    });
    \u0275\u0275element(1, "i", 9);
    \u0275\u0275text(2, " Convidar Usu\xE1rio ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("background-color", ctx_r1.getPrimaryColor());
    \u0275\u0275property("disabled", ctx_r1.inviteLoading());
  }
}
function UserManagementComponent_Conditional_6_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "i", 29);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.inviteSuccess(), " ");
  }
}
function UserManagementComponent_Conditional_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "i", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.inviteError(), " ");
  }
}
function UserManagementComponent_Conditional_6_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 31);
    \u0275\u0275text(1, " Enviando... ");
  }
}
function UserManagementComponent_Conditional_6_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 32);
    \u0275\u0275text(1, " Enviar Convite ");
  }
}
function UserManagementComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 10);
    \u0275\u0275element(2, "i", 11);
    \u0275\u0275elementStart(3, "strong", 12);
    \u0275\u0275text(4, "Convidar Usu\xE1rio");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "p", 13);
    \u0275\u0275text(6, "O usu\xE1rio receber\xE1 um email de convite para se juntar \xE0 empresa.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, UserManagementComponent_Conditional_6_Conditional_7_Template, 3, 1, "div", 14);
    \u0275\u0275conditionalCreate(8, UserManagementComponent_Conditional_6_Conditional_8_Template, 3, 1, "div", 15);
    \u0275\u0275elementStart(9, "form", 16);
    \u0275\u0275listener("submit", function UserManagementComponent_Conditional_6_Template_form_submit_9_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.inviteUser();
      return \u0275\u0275resetView($event.preventDefault());
    });
    \u0275\u0275elementStart(10, "div", 17)(11, "div", 18)(12, "label", 19);
    \u0275\u0275text(13, "Email do Usu\xE1rio *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 20);
    \u0275\u0275listener("input", function UserManagementComponent_Conditional_6_Template_input_input_14_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.inviteEmail.set($event.target.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div")(16, "label", 19);
    \u0275\u0275text(17, "Fun\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "select", 21);
    \u0275\u0275listener("change", function UserManagementComponent_Conditional_6_Template_select_change_18_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.inviteRole.set($event.target.value));
    });
    \u0275\u0275elementStart(19, "option", 22);
    \u0275\u0275text(20, "Usu\xE1rio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "option", 23);
    \u0275\u0275text(22, "Gerente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "option", 24);
    \u0275\u0275text(24, "Administrador");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(25, "div", 25)(26, "button", 26);
    \u0275\u0275conditionalCreate(27, UserManagementComponent_Conditional_6_Conditional_27_Template, 2, 0)(28, UserManagementComponent_Conditional_6_Conditional_28_Template, 2, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 27);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_6_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInviteForm.set(false));
    });
    \u0275\u0275element(30, "i", 28);
    \u0275\u0275text(31, " Cancelar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275conditional(ctx_r1.inviteSuccess() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.inviteError() ? 8 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r1.inviteEmail());
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.inviteRole());
    \u0275\u0275advance(8);
    \u0275\u0275styleProp("background-color", ctx_r1.getPrimaryColor());
    \u0275\u0275property("disabled", ctx_r1.inviteLoading() || !ctx_r1.inviteEmail().trim());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.inviteLoading() ? 27 : 28);
  }
}
function UserManagementComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "i", 33);
    \u0275\u0275elementStart(2, "p", 34);
    \u0275\u0275text(3, "Carregando usu\xE1rios...");
    \u0275\u0275elementEnd()();
  }
}
function UserManagementComponent_Conditional_8_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_8_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.showInviteFormToggle());
    });
    \u0275\u0275element(1, "i", 9);
    \u0275\u0275text(2, " Convidar Primeiro Usu\xE1rio ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("background-color", ctx_r1.getPrimaryColor());
  }
}
function UserManagementComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "i", 35);
    \u0275\u0275elementStart(2, "h5", 36);
    \u0275\u0275text(3, "Nenhum usu\xE1rio encontrado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 37);
    \u0275\u0275text(5, "Convide usu\xE1rios para colaborar na sua empresa.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, UserManagementComponent_Conditional_8_Conditional_6_Template, 3, 2, "button", 38);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r1.canManageUsers() ? 6 : -1);
  }
}
function UserManagementComponent_Conditional_9_For_18_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", user_r5.displayName.charAt(0).toUpperCase(), " ");
  }
}
function UserManagementComponent_Conditional_9_For_18_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 50);
  }
}
function UserManagementComponent_Conditional_9_For_18_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 53);
    \u0275\u0275text(1, "(Voc\xEA)");
    \u0275\u0275elementEnd();
  }
}
function UserManagementComponent_Conditional_9_For_18_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1, "(Propriet\xE1rio)");
    \u0275\u0275elementEnd();
  }
}
function UserManagementComponent_Conditional_9_For_18_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 62);
    \u0275\u0275listener("change", function UserManagementComponent_Conditional_9_For_18_Conditional_15_Template_select_change_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const user_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.changeUserRole(user_r5.email, $event.target.value));
    });
    \u0275\u0275elementStart(1, "option", 22);
    \u0275\u0275text(2, "Usu\xE1rio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "option", 23);
    \u0275\u0275text(4, "Gerente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "option", 24);
    \u0275\u0275text(6, "Administrador");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const user_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", user_r5.role)("disabled", ctx_r1.isLoading());
  }
}
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
function UserManagementComponent_Conditional_9_For_18_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 61)(1, "button", 63);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_9_For_18_Conditional_23_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r7);
      const user_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.resendInvite(user_r5.email));
    });
    \u0275\u0275element(2, "i", 64);
    \u0275\u0275text(3, " Reenviar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 65);
    \u0275\u0275listener("click", function UserManagementComponent_Conditional_9_For_18_Conditional_23_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r7);
      const user_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeUser(user_r5.email));
    });
    \u0275\u0275element(5, "i", 66);
    \u0275\u0275text(6, " Remover ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.isLoading());
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.isLoading());
  }
}
function UserManagementComponent_Conditional_9_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 45)(1, "td", 46)(2, "div", 47)(3, "div", 48);
    \u0275\u0275conditionalCreate(4, UserManagementComponent_Conditional_9_For_18_Conditional_4_Template, 2, 1, "div", 49)(5, UserManagementComponent_Conditional_9_For_18_Conditional_5_Template, 1, 0, "i", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 51)(7, "div", 52);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, UserManagementComponent_Conditional_9_For_18_Conditional_9_Template, 2, 0, "span", 53);
    \u0275\u0275conditionalCreate(10, UserManagementComponent_Conditional_9_For_18_Conditional_10_Template, 2, 0, "span", 54);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "td", 46)(12, "div", 55);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td", 46);
    \u0275\u0275conditionalCreate(15, UserManagementComponent_Conditional_9_For_18_Conditional_15_Template, 7, 2, "select", 56)(16, UserManagementComponent_Conditional_9_For_18_Conditional_16_Template, 2, 3, "span", 57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 46)(18, "span", 58);
    \u0275\u0275text(19, " Ativo ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td", 59);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td", 60);
    \u0275\u0275conditionalCreate(23, UserManagementComponent_Conditional_9_For_18_Conditional_23_Template, 7, 2, "div", 61);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_13_0;
    let tmp_14_0;
    let tmp_16_0;
    let tmp_18_0;
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
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", (user_r5.joinedAt == null ? null : user_r5.joinedAt.toLocaleDateString("pt-BR")) || "Data n\xE3o dispon\xEDvel", " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canManageUsers() && user_r5.email !== ((tmp_18_0 = ctx_r1.currentUser()) == null ? null : tmp_18_0.email) && user_r5.email !== ((tmp_18_0 = ctx_r1.currentCompany()) == null ? null : tmp_18_0.ownerEmail) ? 23 : -1);
  }
}
function UserManagementComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "table", 40)(2, "thead", 41)(3, "tr")(4, "th", 42);
    \u0275\u0275text(5, "Usu\xE1rio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th", 42);
    \u0275\u0275text(7, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th", 42);
    \u0275\u0275text(9, "Fun\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 42);
    \u0275\u0275text(11, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th", 42);
    \u0275\u0275text(13, "Membro desde");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th", 43);
    \u0275\u0275text(15, "A\xE7\xF5es");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody", 44);
    \u0275\u0275repeaterCreate(17, UserManagementComponent_Conditional_9_For_18_Template, 24, 8, "tr", 45, _forTrack0);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r1.users());
  }
}
var UserManagementComponent = class _UserManagementComponent {
  companyService = inject(CompanyService);
  authService = inject(AuthService);
  subdomainService = inject(SubdomainService);
  users = signal([], ...ngDevMode ? [{ debugName: "users" }] : []);
  currentCompany = signal(null, ...ngDevMode ? [{ debugName: "currentCompany" }] : []);
  currentUser = signal(null, ...ngDevMode ? [{ debugName: "currentUser" }] : []);
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
  // Invite user form
  showInviteForm = signal(false, ...ngDevMode ? [{ debugName: "showInviteForm" }] : []);
  inviteEmail = signal("", ...ngDevMode ? [{ debugName: "inviteEmail" }] : []);
  inviteRole = signal("user", ...ngDevMode ? [{ debugName: "inviteRole" }] : []);
  inviteLoading = signal(false, ...ngDevMode ? [{ debugName: "inviteLoading" }] : []);
  inviteError = signal(null, ...ngDevMode ? [{ debugName: "inviteError" }] : []);
  inviteSuccess = signal(null, ...ngDevMode ? [{ debugName: "inviteSuccess" }] : []);
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
        let users = yield this.companyService.getCompanyUsers(company.id);
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
              emailVerified: currentUser.emailVerified
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
                photoURL: currentUser.photoURL,
                emailVerified: currentUser.emailVerified,
                uid: currentUser.uid
              });
            }
            return __spreadProps(__spreadValues({}, user), {
              displayName: user.displayName || this.extractNameFromEmail(user.email)
            });
          } catch (error) {
            console.warn("Erro ao enriquecer dados do usu\xE1rio:", user.email, error);
            return __spreadProps(__spreadValues({}, user), {
              displayName: user.displayName || this.extractNameFromEmail(user.email)
            });
          }
        });
        this.users.set(enrichedUsers);
      } catch (error) {
        console.error("Erro ao carregar usu\xE1rios:", error);
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
      const role = this.inviteRole();
      const company = this.currentCompany();
      if (!email || !company)
        return;
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
        yield this.companyService.addUserToCompany(company.id, email, role);
        this.inviteSuccess.set(`Convite enviado para ${email}`);
        this.inviteEmail.set("");
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
    return __async(this, null, function* () {
      const company = this.currentCompany();
      const currentUser = this.currentUser();
      if (!company || !currentUser)
        return;
      if (userEmail === currentUser.email) {
        alert('Voc\xEA n\xE3o pode remover a si mesmo. Use a op\xE7\xE3o "Excluir Empresa" se deseja sair.');
        return;
      }
      if (!confirm(`Deseja remover o usu\xE1rio ${userEmail} da empresa?`)) {
        return;
      }
      this.isLoading.set(true);
      try {
        yield this.companyService.removeUserFromCompany(company.id, userEmail);
        yield this.loadCompanyUsers();
      } catch (error) {
        console.error("Erro ao remover usu\xE1rio:", error);
        alert("Erro ao remover usu\xE1rio. Tente novamente.");
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
        alert("Erro ao alterar fun\xE7\xE3o do usu\xE1rio. Tente novamente.");
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
      try {
        const user = this.users().find((u) => u.email === userEmail);
        if (user) {
          yield this.companyService.addUserToCompany(company.id, userEmail, user.role);
          alert(`Convite reenviado para ${userEmail}`);
        }
      } catch (error) {
        console.error("Erro ao reenviar convite:", error);
        alert("Erro ao reenviar convite. Tente novamente.");
      }
    });
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
        return "badge-danger";
      case "manager":
        return "badge-warning";
      case "user":
        return "badge-info";
      default:
        return "badge-secondary";
    }
  }
  getPrimaryColor() {
    const company = this.subdomainService.getCurrentCompany();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || "#3B82F6";
  }
  static \u0275fac = function UserManagementComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserManagementComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserManagementComponent, selectors: [["app-user-management"]], decls: 10, vars: 3, consts: [["title", "Gerenciar Usu\xE1rios"], [1, "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "background-color", "disabled"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "py-8"], [1, "bg-white", "rounded-lg", "shadow-sm", "border", "border-gray-200"], [1, "p-6"], [1, "mb-6", "p-4", "bg-blue-50", "border", "border-blue-200", "rounded-lg"], [1, "text-center", "py-8"], [1, "overflow-x-auto"], [1, "text-white", "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "transition-colors", 3, "click", "disabled"], [1, "fas", "fa-plus", "mr-1"], [1, "flex", "items-center", "mb-3"], [1, "fas", "fa-info-circle", "text-blue-500", "mr-2"], [1, "text-blue-800"], [1, "text-blue-700", "text-sm", "mb-4"], [1, "mb-4", "p-3", "bg-green-50", "border", "border-green-200", "rounded", "text-green-800"], [1, "mb-4", "p-3", "bg-red-50", "border", "border-red-200", "rounded", "text-red-800"], [1, "space-y-4", 3, "submit"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4"], [1, "md:col-span-2"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["type", "email", "name", "email", "placeholder", "usuario@exemplo.com", "required", "", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "input", "value"], ["name", "role", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-md", "focus:ring-blue-500", "focus:border-blue-500", 3, "change", "value"], ["value", "user"], ["value", "manager"], ["value", "admin"], [1, "flex", "space-x-3"], ["type", "submit", 1, "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", "disabled:opacity-50", 3, "disabled"], ["type", "button", 1, "bg-gray-500", "hover:bg-gray-600", "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "fas", "fa-times", "mr-1"], [1, "fas", "fa-check-circle", "mr-2"], [1, "fas", "fa-exclamation-circle", "mr-2"], [1, "fas", "fa-spinner", "fa-spin", "mr-1"], [1, "fas", "fa-paper-plane", "mr-1"], [1, "fas", "fa-spinner", "fa-spin", "text-2xl", "text-gray-400", "mb-4"], [1, "text-gray-600"], [1, "fas", "fa-users", "text-4xl", "text-gray-300", "mb-4"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-2"], [1, "text-gray-600", "mb-4"], [1, "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "background-color"], [1, "text-white", "px-4", "py-2", "rounded-md", "text-sm", "font-medium", "transition-colors", 3, "click"], [1, "min-w-full", "divide-y", "divide-gray-200"], [1, "bg-gray-50"], [1, "px-6", "py-3", "text-left", "text-xs", "font-medium", "text-gray-500", "uppercase", "tracking-wider"], [1, "px-6", "py-3", "text-right", "text-xs", "font-medium", "text-gray-500", "uppercase", "tracking-wider"], [1, "bg-white", "divide-y", "divide-gray-200"], [1, "hover:bg-gray-50"], [1, "px-6", "py-4", "whitespace-nowrap"], [1, "flex", "items-center"], [1, "flex-shrink-0", "h-10", "w-10"], [1, "h-10", "w-10", "rounded-full", "bg-blue-500", "flex", "items-center", "justify-center", "text-white", "font-medium"], [1, "fas", "fa-user-circle", "text-2xl", "text-gray-400"], [1, "ml-4"], [1, "text-sm", "font-medium", "text-gray-900"], [1, "text-xs", "text-blue-600", "font-medium"], [1, "text-xs", "text-purple-600", "font-medium"], [1, "text-sm", "text-gray-900"], [1, "text-sm", "border", "border-gray-300", "rounded", "px-2", "py-1", "focus:ring-blue-500", "focus:border-blue-500", 3, "value", "disabled"], [3, "class"], [1, "inline-flex", "px-2", "py-1", "text-xs", "font-semibold", "rounded-full", "bg-green-100", "text-green-800"], [1, "px-6", "py-4", "whitespace-nowrap", "text-sm", "text-gray-500"], [1, "px-6", "py-4", "whitespace-nowrap", "text-right", "text-sm", "font-medium"], [1, "flex", "space-x-2", "justify-end"], [1, "text-sm", "border", "border-gray-300", "rounded", "px-2", "py-1", "focus:ring-blue-500", "focus:border-blue-500", 3, "change", "value", "disabled"], [1, "text-blue-600", "hover:text-blue-800", "text-sm", 3, "click", "disabled"], [1, "fas", "fa-envelope", "mr-1"], [1, "text-red-600", "hover:text-red-800", "text-sm", 3, "click", "disabled"], [1, "fas", "fa-trash", "mr-1"]], template: function UserManagementComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "app-main-layout")(1, "app-config-header", 0);
      \u0275\u0275conditionalCreate(2, UserManagementComponent_Conditional_2_Template, 3, 3, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3)(5, "div", 4);
      \u0275\u0275conditionalCreate(6, UserManagementComponent_Conditional_6_Template, 32, 8, "div", 5);
      \u0275\u0275conditionalCreate(7, UserManagementComponent_Conditional_7_Template, 4, 0, "div", 6)(8, UserManagementComponent_Conditional_8_Template, 7, 1, "div", 6)(9, UserManagementComponent_Conditional_9_Template, 19, 0, "div", 7);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.canManageUsers() ? 2 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.showInviteForm() ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 7 : ctx.users().length === 0 ? 8 : 9);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, NgControlStatusGroup, NgForm, ConfigHeaderComponent, MainLayoutComponent], styles: ["\n\n.user-management-container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}\n.invite-form[_ngcontent-%COMP%] {\n  background-color: #f8f9fa;\n  border: 1px solid #dee2e6;\n  border-radius: 8px;\n  padding: 20px;\n}\n.user-avatar[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background-color: #007bff;\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: bold;\n  flex-shrink: 0;\n}\n.avatar-initials[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: bold;\n}\n.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  border-top: none;\n  font-weight: 600;\n  color: #495057;\n}\n.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  vertical-align: middle;\n}\n.badge[_ngcontent-%COMP%] {\n  padding: 6px 12px;\n  font-size: 12px;\n  font-weight: 500;\n}\n.badge-danger[_ngcontent-%COMP%] {\n  background-color: #dc3545;\n  color: white;\n}\n.badge-warning[_ngcontent-%COMP%] {\n  background-color: #ffc107;\n  color: #212529;\n}\n.badge-info[_ngcontent-%COMP%] {\n  background-color: #17a2b8;\n  color: white;\n}\n.badge-secondary[_ngcontent-%COMP%] {\n  background-color: #6c757d;\n  color: white;\n}\n.danger-zone[_ngcontent-%COMP%] {\n  border: 1px solid #dc3545;\n  border-radius: 6px;\n  padding: 20px;\n  background-color: #fff5f5;\n}\n.danger-zone[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  color: #dc3545 !important;\n}\n.modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1040;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.modal[_ngcontent-%COMP%] {\n  z-index: 1050;\n}\n.modal-dialog[_ngcontent-%COMP%] {\n  max-width: 500px;\n  margin: 1.75rem auto;\n}\n.btn[_ngcontent-%COMP%] {\n  border-radius: 6px;\n  font-weight: 500;\n  transition: all 0.2s ease;\n}\n.btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n.btn-sm[_ngcontent-%COMP%] {\n  padding: 4px 8px;\n  font-size: 12px;\n}\n.form-control[_ngcontent-%COMP%]:focus, \n.form-select[_ngcontent-%COMP%]:focus {\n  border-color: #007bff;\n  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.alert[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  border: none;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.gap-2[_ngcontent-%COMP%] {\n  gap: 8px;\n}\n.d-flex[_ngcontent-%COMP%] {\n  display: flex;\n}\n.align-items-center[_ngcontent-%COMP%] {\n  align-items: center;\n}\n.justify-content-between[_ngcontent-%COMP%] {\n  justify-content: space-between;\n}\n.ms-2[_ngcontent-%COMP%] {\n  margin-left: 8px;\n}\n.mt-2[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.mb-2[_ngcontent-%COMP%] {\n  margin-bottom: 8px;\n}\n.mb-3[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.mb-4[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.py-4[_ngcontent-%COMP%] {\n  padding-top: 24px;\n  padding-bottom: 24px;\n}\n.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.text-muted[_ngcontent-%COMP%] {\n  color: #6c757d !important;\n}\n.text-primary[_ngcontent-%COMP%] {\n  color: #007bff !important;\n}\n.text-success[_ngcontent-%COMP%] {\n  color: #28a745 !important;\n}\n.text-danger[_ngcontent-%COMP%] {\n  color: #dc3545 !important;\n}\n.fw-bold[_ngcontent-%COMP%] {\n  font-weight: bold;\n}\n.small[_ngcontent-%COMP%] {\n  font-size: 0.875em;\n}\n@media (max-width: 768px) {\n  .user-management-container[_ngcontent-%COMP%] {\n    padding: 10px;\n  }\n  .invite-form[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%] {\n    gap: 10px;\n  }\n  .invite-form[_ngcontent-%COMP%]   .col-md-2[_ngcontent-%COMP%], \n   .invite-form[_ngcontent-%COMP%]   .col-md-4[_ngcontent-%COMP%], \n   .invite-form[_ngcontent-%COMP%]   .col-md-6[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .table-responsive[_ngcontent-%COMP%] {\n    font-size: 14px;\n  }\n  .user-avatar[_ngcontent-%COMP%] {\n    width: 32px;\n    height: 32px;\n    font-size: 14px;\n  }\n}\n/*# sourceMappingURL=user-management.component.css.map */"] });
};
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
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2">
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
                  [disabled]="inviteLoading() || !inviteEmail().trim()">
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
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ (user.joinedAt?.toLocaleDateString('pt-BR')) || 'Data n\xE3o dispon\xEDvel' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      @if (canManageUsers() && user.email !== currentUser()?.email && user.email !== currentCompany()?.ownerEmail) {
                        <div class="flex space-x-2 justify-end">
                          <button
                            class="text-blue-600 hover:text-blue-800 text-sm"
                            (click)="resendInvite(user.email)"
                            [disabled]="isLoading()">
                            <i class="fas fa-envelope mr-1"></i>
                            Reenviar
                          </button>
                          <button
                            class="text-red-600 hover:text-red-800 text-sm"
                            (click)="removeUser(user.email)"
                            [disabled]="isLoading()">
                            <i class="fas fa-trash mr-1"></i>
                            Remover
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
      </div>
    </div>

  </div>
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
//# sourceMappingURL=chunk-D3VUIBLT.js.map
