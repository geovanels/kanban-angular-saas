import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService, Lead } from '../../services/firestore.service';
import { CompanyService } from '../../services/company.service';
import { SubdomainService } from '../../services/subdomain.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-public-form',
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
            <h1 class="text-lg font-semibold text-gray-900">Formulário</h1>
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
})
export class PublicFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fs = inject(FirestoreService);
  private subdomain = inject(SubdomainService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);

  form: FormGroup = this.fb.group({});
  loading = signal(true);
  saving = signal(false);
  fieldsLoaded = signal(false);
  companyName = signal<string | null>(null);
  primaryColor = signal<string>(this.subdomain.getCurrentCompany()?.brandingConfig?.primaryColor || '#3B82F6');
  companyLogo: string | null = null;

  userId = '';
  boardId = '';
  columnId = '';
  leadId = '';
  currentFields: any[] = [];
  lead: Lead | null = null;
  private companyUsers: Array<{ uid?: string; email?: string; displayName?: string }> = [];

  async ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    const sub = qp.get('subdomain') || undefined;
    const companyIdParam = qp.get('companyId') || '';
    this.userId = qp.get('userId') || '';
    this.boardId = qp.get('boardId') || '';
    this.leadId = qp.get('leadId') || '';
    this.columnId = qp.get('columnId') || '';

    try {
      let company: any = null;
      // 1) Preferir companyId do link
      if (companyIdParam) {
        company = await this.companyService.getCompany(companyIdParam);
      }
      // 2) Tentar por subdomain explícito
      if (!company && sub) {
        company = await this.companyService.getCompanyBySubdomain(sub);
      }
      // 3) Fallback: detectar pelo host
      if (!company) {
        company = await this.subdomain.initializeFromSubdomain();
      }
      if (company) {
        this.subdomain.setCurrentCompany(company);
        this.companyName.set(company.name || sub || null);
        this.primaryColor.set(company.brandingConfig?.primaryColor || '#3B82F6');
        const sd = company.subdomain;
        // Logo: usar logo da empresa; fallback opcional para gobuyer
        this.companyLogo = (company.brandingConfig?.logo && company.brandingConfig.logo.trim() !== '' ? company.brandingConfig.logo : null)
          || (sd === 'gobuyer' ? 'https://apps.gobuyer.com.br/sso/assets/images/logos/logo-gobuyer.png' : null);
      } else if (sub) {
        // fallback simples apenas com o nome
        this.companyName.set(sub);
      }
    } catch { this.companyName.set(sub || null); }

    try {
      if (this.leadId) {
        this.lead = await this.fs.getLead(this.userId, this.boardId, this.leadId);
      }
    } catch {}

    try {
      // Preferir formulário da fase
      const phaseCfg = await this.fs.getPhaseFormConfig(this.userId, this.boardId, this.columnId);
      const fields = (phaseCfg as any)?.fields || [];
      this.currentFields = fields.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      // Se houver campo 'responsavel', carregar usuários da empresa
      const hasResp = this.currentFields.some((f: any) => f.type === 'responsavel');
      if (hasResp) {
        const company = this.subdomain.getCurrentCompany();
        if (company?.id) {
          try {
            const users = await this.companyService.getAllCompanyUsers(company.id);
            this.companyUsers = users || [];
            // Transformar o campo responsavel em select
            this.currentFields = this.currentFields.map((f: any) => {
              if (f.type === 'responsavel') {
                return {
                  ...f,
                  type: 'select',
                  originalType: 'responsavel',
                  options: users.map(u => ({ value: u.uid || u.email, label: u.displayName || u.email }))
                };
              }
              return f;
            });
          } catch {}
        }
      }
      const formGroup: any = {};
      this.currentFields.forEach((f: any) => {
        const key = f.apiFieldName || f.name;
        const val = (this.lead as any)?.fields?.[key] ?? '';
        formGroup[f.name] = [val];
        // Normalizar radios para array/objetos
        if (f.type === 'radio' && Array.isArray(f.options)) {
          f.options = f.options.map((o: any) => typeof o === 'object' ? o : { value: o, label: o });
        }
      });
      this.form = this.fb.group(formGroup);
      this.fieldsLoaded.set(this.currentFields.length > 0);
    } catch {
      this.currentFields = [];
      this.fieldsLoaded.set(false);
    }

    this.loading.set(false);
  }

  private mapFormToLeadFields(): any {
    const values = this.form.value;
    const mapped: any = {};
    this.currentFields.forEach((f: any) => {
      const apiKey = f.apiFieldName || f.name;
      mapped[apiKey] = values[f.name];
    });
    return mapped;
  }

  async onSubmit() {
    if (!this.lead || !this.leadId) return;
    this.saving.set(true);
    try {
      const mapped = this.mapFormToLeadFields();
      const updates: any = {
        fields: { ...(this.lead.fields || {}), ...mapped }
      };

      // Se houver campo de responsável, atualizar campos raiz do lead
      try {
        const respField = this.currentFields.find((f: any) => f.originalType === 'responsavel' || f.type === 'responsavel' || (f.name || '').toLowerCase() === 'responsavel');
        if (respField) {
          const fieldName = respField.name;
          const selectedId = this.form.get(fieldName)?.value;
          if (selectedId) {
            const match = this.companyUsers.find(u => (u.uid && u.uid === selectedId) || (u.email && u.email === selectedId));
            updates.responsibleUserId = match?.uid || selectedId;
            updates.responsibleUserName = match?.displayName || '';
            updates.responsibleUserEmail = match?.email || '';
          }
        }
      } catch {}

      await this.fs.updateLead(this.userId, this.boardId, this.leadId, updates);
      try { this.toast.success('Formulário salvo.'); } catch {}
    } catch (e) {
      console.error(e);
      try { this.toast.error('Erro ao salvar formulário.'); } catch {}
    } finally {
      this.saving.set(false);
    }
  }
}


