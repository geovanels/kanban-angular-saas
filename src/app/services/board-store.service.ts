import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { FirestoreService, Board, Column, Lead } from './firestore.service';
import { SubdomainService } from './subdomain.service';
import { CompanyService } from './company.service';
import { AutomationService } from './automation.service';
import { ApiService } from './api.service';
import { extractNameFromEmail } from '../utils/format.utils';

@Injectable()
export class BoardStoreService implements OnDestroy {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private subdomainService = inject(SubdomainService);
  private companyService = inject(CompanyService);
  private automationService = inject(AutomationService);
  private apiService = inject(ApiService);

  // Core identifiers
  boardId = '';
  ownerId = '';
  currentUser: any = null;

  // Reactive state
  board$ = new BehaviorSubject<Board | null>(null);
  columns$ = new BehaviorSubject<Column[]>([]);
  leads$ = new BehaviorSubject<Lead[]>([]);
  automations$ = new BehaviorSubject<any[]>([]);
  emailTemplates$ = new BehaviorSubject<any[]>([]);
  outboxEmails$ = new BehaviorSubject<any[]>([]);
  initialFormFields$ = new BehaviorSubject<any[]>([]);
  phaseCardFields$ = new BehaviorSubject<Record<string, any[]>>({});
  phaseFormConfigs$ = new BehaviorSubject<Record<string, any>>({});
  users$ = new BehaviorSubject<any[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(true);

  // API config
  apiEndpoint = '';
  apiToken = 'KzB47@p!qR9$tW2m&e*J';

  // Automation tracking
  private _leadsStreamInitialized = false;
  private _lastLeadsById: Record<string, Lead> = {};
  private timeAutomationIntervalId: any = null;
  private subscriptions: Subscription[] = [];
  private unsubscribers: Array<() => void> = [];

  async initialize(boardId: string, ownerId: string) {
    this.currentUser = this.authService.getCurrentUser();
    this.boardId = boardId;
    this.ownerId = ownerId || this.currentUser?.uid || '';

    try { localStorage.setItem('last-board-id', this.boardId); } catch {}

    const company = this.subdomainService.getCurrentCompany();
    if (company) {
      this.firestoreService.setCompanyContext(company);
    }

    if (this.currentUser && this.boardId && this.ownerId) {
      await this.loadBoardData();
      this.subscribeToRealtimeUpdates();
      this.initializeApiEndpoint();
      this.loadInitialForm();
      this.loadFlowConfig();

      this.automationService.initializeGlobalLeadMonitor(this.boardId, this.ownerId);

      this.timeAutomationIntervalId = setInterval(async () => {
        try {
          const leads = this.leads$.value;
          const columns = this.columns$.value;
          if (leads.length > 0 && columns.length > 0) {
            await this.automationService.processTimeBasedAutomations(leads, columns, this.boardId, this.ownerId);
          }
        } catch (error) {
          console.warn('Erro nas automações de tempo:', error);
        }
      }, 60000);
    }
  }

  private async loadBoardData() {
    try {
      await this.loadUsers();
      this.isLoading$.next(false);
    } catch (error) {
      console.error('Erro ao carregar dados do quadro:', error);
      this.isLoading$.next(false);
    }
  }

  private async loadUsers() {
    try {
      const company = this.subdomainService.getCurrentCompany();
      if (!company?.id) {
        this.users$.next([]);
        return;
      }
      const companyUsers = await this.companyService.getAllCompanyUsers(company.id);
      const users = companyUsers
        .filter(user => !user.inviteStatus || user.inviteStatus === 'accepted')
        .map(user => ({
          uid: user.uid || (user.email === this.currentUser?.email ? this.currentUser?.uid : ''),
          displayName: user.displayName || extractNameFromEmail(user.email),
          email: user.email
        }));
      this.users$.next(users);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      this.users$.next([{
        uid: this.currentUser?.uid,
        displayName: this.currentUser?.displayName,
        email: this.currentUser?.email
      }]);
    }
  }

  private subscribeToRealtimeUpdates() {
    // Columns
    const columnsUnsub = this.firestoreService.subscribeToColumns(
      this.ownerId, this.boardId,
      (columns) => {
        this.columns$.next(columns);
        this.loadCardFieldConfigs();
        this.loadAllPhaseFormConfigs();
      }
    );
    this.unsubscribers.push(columnsUnsub);

    // Leads
    const leadsUnsub = this.firestoreService.subscribeToLeads(
      this.ownerId, this.boardId,
      async (leads) => {
        const currentById: Record<string, Lead> = Object.create(null);
        for (const l of leads as any) currentById[l.id!] = l as any;

        if (!this._leadsStreamInitialized) {
          this._lastLeadsById = currentById;
          this._leadsStreamInitialized = true;
        } else {
          const newLeads: Lead[] = [];
          const moved: Array<{ lead: Lead; from: string; to: string }> = [];
          const prev = this._lastLeadsById || {};

          for (const [id, lead] of Object.entries(currentById)) {
            const prevLead = prev[id];
            if (!prevLead) {
              newLeads.push(lead as Lead);
            } else if (prevLead.columnId !== (lead as Lead).columnId) {
              moved.push({ lead: lead as Lead, from: prevLead.columnId, to: (lead as Lead).columnId });
            }
          }
          this._lastLeadsById = currentById;

          try {
            for (const nl of newLeads) {
              try { await this.automationService.processNewLeadAutomations(nl, this.boardId, this.ownerId); } catch {}
            }
            for (const mv of moved) {
              try { await this.automationService.processPhaseChangeAutomations(mv.lead, mv.to, mv.from, this.boardId, this.ownerId); } catch {}
            }
          } catch {}
        }

        const enrichedLeads = (leads as any).map((l: any) => ({
          ...l,
          historyCommentsCount: l.historyCommentsCount ?? 0,
          attachmentsCount: l.attachmentsCount ?? 0
        }));
        this.leads$.next(enrichedLeads);
        this.isLoading$.next(false);
      }
    );
    this.unsubscribers.push(leadsUnsub);

    // Outbox
    const outboxUnsub = this.firestoreService.subscribeToOutboxEmails(
      this.ownerId, this.boardId,
      (emails) => this.outboxEmails$.next(emails)
    );
    this.unsubscribers.push(outboxUnsub);

    // Templates
    const templatesUnsub = this.firestoreService.subscribeToEmailTemplates(
      this.ownerId, this.boardId,
      (templates) => this.emailTemplates$.next(templates)
    );
    this.unsubscribers.push(templatesUnsub);

    // Automations
    const automationsUnsub = this.firestoreService.subscribeToAutomations(
      this.ownerId, this.boardId,
      (automations) => this.automations$.next(automations || [])
    );
    this.unsubscribers.push(automationsUnsub);
  }

  private async loadCardFieldConfigs() {
    try {
      const columns = this.columns$.value;
      const map: Record<string, any[]> = {};
      for (const col of columns) {
        try {
          const cfg = await this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, col.id!);
          const fields = (cfg as any)?.fields || [];
          const filteredFields = fields.filter((f: any) => !!f?.showInCard || !!f?.showInAllPhases);
          map[col.id!] = filteredFields.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        } catch {
          map[col.id!] = [];
        }
      }
      this.phaseCardFields$.next(map);
    } catch {
      this.phaseCardFields$.next({});
    }
  }

  private async loadAllPhaseFormConfigs() {
    const columns = this.columns$.value;
    const configs: Record<string, any> = { ...this.phaseFormConfigs$.value };
    for (const column of columns) {
      try {
        const config = await this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, column.id!);
        if (config?.fields) {
          configs[column.id!] = config;
        }
      } catch {}
    }
    this.phaseFormConfigs$.next(configs);
  }

  async loadInitialForm() {
    try {
      const config = await this.firestoreService.getInitialFormConfig(this.boardId);
      this.initialFormFields$.next((config as any)?.fields || []);
    } catch {
      this.initialFormFields$.next([]);
    }
  }

  async loadFlowConfig() {
    try {
      const cfg = await this.firestoreService.getFlowConfig(this.boardId);
      return cfg;
    } catch {
      return null;
    }
  }

  private initializeApiEndpoint() {
    const company = this.subdomainService.getCurrentCompany();
    const companyId = company?.id || '{COMPANY_ID}';
    this.apiEndpoint = this.apiService.getLeadIntakeUrl(companyId, this.boardId);
  }

  // Company helpers
  getCompany() {
    return this.subdomainService.getCurrentCompany();
  }

  getPrimaryColor(): string {
    const company = this.getCompany();
    return company?.brandingConfig?.primaryColor || '#3B82F6';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.unsubscribers.forEach(unsub => unsub());
    if (this.timeAutomationIntervalId) {
      clearInterval(this.timeAutomationIntervalId);
      this.timeAutomationIntervalId = null;
    }
    if (this.boardId && this.ownerId) {
      this.automationService.stopGlobalLeadMonitor(this.boardId, this.ownerId);
    }
  }
}
