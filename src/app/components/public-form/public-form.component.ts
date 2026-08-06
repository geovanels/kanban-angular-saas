import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService, Lead } from '../../services/firestore.service';
import { CompanyService } from '../../services/company.service';
import { SubdomainService } from '../../services/subdomain.service';
import { ToastService } from '../toast/toast.service';
import { AuthService } from '../../services/auth.service';
import { formatCurrencyBRL, parseCurrencyToNumber } from '../../utils/format.utils';

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

        <!-- Tela de sucesso após envio -->
        <div *ngIf="submitted()" class="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div class="p-10 text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" [style.background-color]="primaryColor() + '1A'">
              <svg class="h-8 w-8" [style.color]="primaryColor()" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Formulário enviado com sucesso!</h2>
            <p class="text-sm text-gray-500">Suas respostas foram registradas. Obrigado por preencher o formulário.</p>
          </div>
        </div>

        <!-- Formulário -->
        <div *ngIf="!submitted()" class="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h1 class="text-lg font-semibold text-gray-900">Formulário</h1>
            <span class="text-xs text-gray-500" *ngIf="companyName()">{{ companyName() }}</span>
          </div>

          <div *ngIf="readOnly()" class="px-6 py-3 bg-amber-50 border-b border-amber-200 text-sm text-amber-800 flex items-center gap-2">
            <i class="fas fa-eye"></i>
            <span>Modo consulta: o registro já avançou desta fase. As respostas estão somente para visualização.</span>
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
                  <input *ngSwitchCase="'currency'" type="text" inputmode="decimal" [formControlName]="f.name"
                         (input)="onCurrencyInput($event, f.name)"
                         placeholder="R$ 0,00"
                         class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <textarea *ngSwitchCase="'textarea'" rows="3" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                  <select *ngSwitchCase="'select'" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <ng-container *ngIf="f.options && f.options.length && isObjectOption(f.options[0]); else simpleOpts">
                      <option *ngFor="let opt of f.options" [value]="opt.value">{{ opt.label }}</option>
                    </ng-container>
                    <ng-template #simpleOpts>
                      <option *ngFor="let opt of (f.options || [])" [value]="opt">{{ opt }}</option>
                    </ng-template>
                  </select>
                  <!-- Campo Radio -->
                  <div *ngSwitchCase="'radio'" class="flex flex-col gap-2">
                    <label *ngFor="let opt of (f.options || [])" class="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input type="radio" [attr.name]="f.name" [value]="isObjectOption(opt) ? opt.value : opt" [formControlName]="f.name" class="text-blue-600 focus:ring-blue-500">
                      <span>{{ isObjectOption(opt) ? opt.label : opt }}</span>
                    </label>
                  </div>
                  <!-- Campo Checkbox -->
                  <div *ngSwitchCase="'checkbox'" class="flex flex-col gap-2">
                    <label *ngFor="let opt of (f.options || []); let i = index" class="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" [attr.name]="f.name + '_' + i" [value]="isObjectOption(opt) ? opt.value : opt" [formControlName]="f.name + '_' + i" class="text-blue-600 focus:ring-blue-500">
                      <span>{{ isObjectOption(opt) ? opt.label : opt }}</span>
                    </label>
                  </div>
                  <select *ngSwitchCase="'temperatura'" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option *ngFor="let opt of (f.options && f.options.length ? f.options : ['Quente','Morno','Frio'])" [value]="opt">{{ opt }}</option>
                  </select>
                  <input *ngSwitchDefault type="text" [formControlName]="f.name" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </ng-container>
              </div>

              <div class="pt-2" *ngIf="!readOnly()">
                <button type="submit" [disabled]="saving()" class="px-4 py-2 text-white rounded-lg" [style.background-color]="primaryColor()">
                  {{ saving() ? 'Enviando...' : 'Enviar' }}
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
  private authService = inject(AuthService);

  form: FormGroup = this.fb.group({});
  loading = signal(true);
  saving = signal(false);
  fieldsLoaded = signal(false);
  submitted = signal(false);
  readOnly = signal(false);
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

    // Debug: Parâmetros recebidos
    // console.log('Parâmetros:', { subdomain: sub, companyId: companyIdParam, userId: this.userId, boardId: this.boardId, leadId: this.leadId, columnId: this.columnId });

    // Fazer autenticação anônima para acessar Firestore
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        const authResult = await this.authService.signInAnonymouslyForPublicForms();
        if (!authResult.success) {
          console.warn('Erro no login anônimo:', authResult.error);
        }
      }
    } catch (error) {
      console.warn('Erro na autenticação anônima:', error);
    }

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
      } else {
      }
    } catch (error) { 
      this.companyName.set(sub || null); 
    }

    // Definir contexto da empresa ANTES de chamar métodos do FirestoreService
    // para evitar verificações de autenticação
    try {
      const company = this.subdomain.getCurrentCompany();
      if (company) {
        this.fs.setCompanyContext(company);
      }
    } catch (error) {
      console.warn('Erro ao definir contexto da empresa:', error);
    }

    try {
      if (this.leadId) {
        this.lead = await this.fs.getLead(this.userId, this.boardId, this.leadId);
      }
    } catch (error) {
      // Continuar mesmo se não conseguir carregar o lead
    }

    // Se o columnId do link for diferente da fase atual do lead,
    // o formulário deve servir apenas para consulta (somente leitura)
    if (this.lead && this.columnId && this.lead.columnId && this.columnId !== this.lead.columnId) {
      this.readOnly.set(true);
    }

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

        if (f.type === 'checkbox') {
          // Para checkboxes, criar controles individuais para cada opção
          (f.options || []).forEach((opt: string, i: number) => {
            const checkboxName = f.name + '_' + i;
            // Verificar se a opção está selecionada no valor salvo
            const isChecked = Array.isArray(val) ? val.includes(opt) : false;
            formGroup[checkboxName] = [isChecked];
          });
        } else if (f.type === 'currency') {
          formGroup[f.name] = [val !== '' ? formatCurrencyBRL(val) : ''];
        } else {
          formGroup[f.name] = [val];
        }
        
        // Normalizar radios para array/objetos
        if (f.type === 'radio' && Array.isArray(f.options)) {
          f.options = f.options.map((o: any) => typeof o === 'object' ? o : { value: o, label: o });
        }
      });
      this.form = this.fb.group(formGroup);
      if (this.readOnly()) {
        this.form.disable({ emitEvent: false });
      }
      this.fieldsLoaded.set(this.currentFields.length > 0);
    } catch (error) {
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

      if (f.type === 'checkbox') {
        // Para checkboxes, coletar todas as opções selecionadas
        const selectedOptions: string[] = [];
        (f.options || []).forEach((opt: string, i: number) => {
          const checkboxName = f.name + '_' + i;
          if (values[checkboxName]) {
            selectedOptions.push(opt);
          }
        });
        mapped[apiKey] = selectedOptions;
      } else if (f.type === 'currency') {
        mapped[apiKey] = parseCurrencyToNumber(values[f.name]);
      } else {
        mapped[apiKey] = values[f.name];
      }
    });
    return mapped;
  }

  onCurrencyInput(event: Event, fieldName: string) {
    const input = event.target as HTMLInputElement;
    const formatted = formatCurrencyBRL(input.value);
    input.value = formatted;
    this.form.get(fieldName)?.setValue(formatted, { emitEvent: false });
  }

  // Evita o formulário ficar travado em "Salvando..." para sempre quando um
  // write do Firestore não resolve (ex.: rede corporativa bloqueando streaming).
  // Estoura com erro após o timeout para o usuário ver a falha e tentar de novo.
  private withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout (${ms / 1000}s): ${label}`)), ms)
      )
    ]);
  }

  async onSubmit() {
    if (!this.lead || !this.leadId) return;
    if (this.readOnly()) return;
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
          if (selectedId && selectedId !== this.lead.responsibleUserId) {
            const selectedUser = this.companyUsers.find(u => (u.uid && u.uid === selectedId) || (u.email && u.email === selectedId));
            updates.responsibleUserId = selectedUser?.uid || selectedId;
            updates.responsibleUserName = selectedUser?.displayName || '';
            updates.responsibleUserEmail = selectedUser?.email || '';

            // Adicionar ao histórico para mudança de responsável
            
            // Garantir que o contexto da empresa está inicializado
            const company = this.subdomain.getCurrentCompany();
            if (company) {
              this.fs.setCompanyContext(company);
            }
            
            await this.withTimeout(this.fs.addLeadHistory(
              this.userId,
              this.boardId,
              this.leadId,
              {
                type: 'update',
                text: `Responsável alterado para <strong>${selectedUser?.displayName || 'Ninguém'}</strong> via formulário público`,
                user: 'Formulário Público'
              }
            ), 10000, 'histórico de responsável');
          }
        }
      } catch {}

      // Registrar diffs de campos (histórico) - igual ao modal de detalhes
      try {
        const beforeFields = (this.lead.fields || {}) as any;
        const changedKeys = Object.keys(mapped).filter(k => `${beforeFields[k] ?? ''}` !== `${mapped[k] ?? ''}`);
        
        if (changedKeys.length) {
          const changesList = changedKeys.map(k => {
            const field = this.currentFields.find((f: any) => (f.apiFieldName || f.name) === k);
            const label = field?.label || this.humanizeKey(k);
            let beforeVal = beforeFields[k] ?? '';
            let afterVal = mapped[k] ?? '';

            // Se o campo representa responsável, mostrar nome do usuário
            if (field && (field.type === 'responsavel' || field.originalType === 'responsavel')) {
              const beforeUser = this.companyUsers.find(u => u.uid === beforeVal || u.email === beforeVal);
              const afterUser = this.companyUsers.find(u => u.uid === afterVal || u.email === afterVal);
              beforeVal = beforeUser?.displayName || beforeVal;
              afterVal = afterUser?.displayName || afterVal;
            }

            // Para campos monetários, formatar como BRL
            if (field && field.type === 'currency') {
              beforeVal = beforeVal !== '' && beforeVal !== null ? formatCurrencyBRL(beforeVal) : '';
              afterVal = afterVal !== '' && afterVal !== null ? formatCurrencyBRL(afterVal) : '';
            }

            // Para arrays (checkbox), formatar melhor
            if (Array.isArray(afterVal)) {
              afterVal = afterVal.join(', ');
            }
            if (Array.isArray(beforeVal)) {
              beforeVal = beforeVal.join(', ');
            }

            return `<li><strong>${label}:</strong> "${beforeVal}" → "${afterVal}"</li>`;
          }).join('');

          // Adicionar ao histórico
          
          // Garantir que o contexto da empresa está inicializado
          const company = this.subdomain.getCurrentCompany();
          if (company) {
            this.fs.setCompanyContext(company);
          }
          
          await this.withTimeout(this.fs.addLeadHistory(
            this.userId,
            this.boardId,
            this.leadId,
            {
              type: 'update',
              text: `Formulário público preenchido:<ul class="list-disc ml-4">${changesList}</ul>`,
              user: 'Formulário Público'
            }
          ), 10000, 'histórico de alterações');
        }
      } catch (error) {
        console.warn('Erro ao registrar histórico:', error);
      }

      await this.withTimeout(
        this.fs.updateLead(this.userId, this.boardId, this.leadId, updates),
        20000,
        'salvar formulário'
      );
      this.saving.set(false);
      this.submitted.set(true);
    } catch (e: any) {
      const isTimeout = `${e?.message || ''}`.includes('Timeout');
      try {
        this.toast.error(isTimeout
          ? 'A conexão está demorando para responder. Verifique sua rede e tente novamente.'
          : 'Erro ao salvar formulário. Tente novamente.');
      } catch {}
      this.saving.set(false);
    }
  }

  private humanizeKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  isObjectOption(option: any): boolean {
    return typeof option === 'object' && option !== null;
  }
}


