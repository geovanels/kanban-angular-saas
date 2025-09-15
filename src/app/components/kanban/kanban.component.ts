import { Component, inject, OnInit, OnDestroy, ViewChild, HostListener, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Board, Column, Lead } from '../../services/firestore.service';
import { SubdomainService } from '../../services/subdomain.service';
import { AutomationService } from '../../services/automation.service';
import { ApiService } from '../../services/api.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { LeadModalComponent } from '../lead-modal/lead-modal.component';
import { ColumnModalComponent } from '../column-modal/column-modal.component';
import { PhaseFormModalComponent } from '../phase-form-modal/phase-form-modal.component';
import { LeadDetailModalComponent } from '../lead-detail-modal/lead-detail-modal.component';
import { TemplateModalComponent } from '../template-modal/template-modal.component';
import { AutomationModal } from '../automation-modal/automation-modal';
import { AutomationHistoryModal } from '../automation-history-modal/automation-history-modal';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { VisualFormBuilderComponent } from '../visual-form-builder/visual-form-builder';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, LeadModalComponent, ColumnModalComponent, PhaseFormModalComponent, LeadDetailModalComponent, TemplateModalComponent, AutomationModal, AutomationHistoryModal, MainLayoutComponent, VisualFormBuilderComponent],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private subdomainService = inject(SubdomainService);
  private automationService = inject(AutomationService);
  private apiService = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(LeadModalComponent) leadModal!: LeadModalComponent;
  @ViewChild(ColumnModalComponent) columnModal!: ColumnModalComponent;
  @ViewChild(PhaseFormModalComponent) phaseFormModal!: PhaseFormModalComponent;
  @ViewChild(LeadDetailModalComponent) leadDetailModal!: LeadDetailModalComponent;
  @ViewChild(TemplateModalComponent) templateModal!: TemplateModalComponent;
  @ViewChild(AutomationModal) automationModal!: AutomationModal;
  @ViewChild('flowScroller') flowScrollerRef!: ElementRef<HTMLDivElement>;
  flowThumbPercent = 10;
  flowThumbLeftPercent = 0;
  private isDraggingFlowBar = false;

  board: Board | null = null;
  columns: Column[] = [];
  leads: Lead[] = [];
  isDraggingLead = false;
  // Arrays estáveis por coluna para drag & drop e render
  displayedLeadsByColumn: Record<string, Lead[]> = {};
  // Ordem local por coluna (ids) – persistido em localStorage por board
  leadOrderByColumn: Record<string, string[]> = {};
  // Controle de mover cards
  cardMoveEnabled = true;
  currentUser: any = null;
  boardId: string = '';
  ownerId: string = '';
  // Campos configurados para exibir no card por fase
  phaseCardFields: Record<string, any[]> = {};
  
  private subscriptions: Subscription[] = [];
  isLoading = true;
  
  // Abas
  activeTab: string = 'kanban';
  tabs = [
    { id: 'kanban', name: 'Kanban', icon: 'fa-columns' },
    { id: 'initial-form', name: 'Formulário inicial', icon: 'fa-list' },
    { id: 'flow', name: 'Fluxo', icon: 'fa-project-diagram' },
    { id: 'reports', name: 'Relatórios', icon: 'fa-chart-bar' },
    { id: 'outbox', name: 'Caixa de Saída', icon: 'fa-paper-plane' },
    { id: 'templates', name: 'Templates', icon: 'fa-envelope' },
    { id: 'api', name: 'API', icon: 'fa-code' }
  ];

  // API Configuration
  apiEndpoint = '';
  apiToken = 'KzB47@p!qR9$tW2m&e*J';

  private timeAutomationIntervalId: any = null;

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.boardId = this.route.snapshot.paramMap.get('boardId') || '';
    try { localStorage.setItem('last-board-id', this.boardId); } catch {}
    this.ownerId = this.route.snapshot.queryParamMap.get('ownerId') || this.currentUser?.uid || '';
    
    console.log('KanbanComponent - boardId:', this.boardId, 'ownerId:', this.ownerId);
    
    // Definir contexto da empresa no FirestoreService
    const company = this.subdomainService.getCurrentCompany();
    if (company) {
      console.log('Definindo contexto da empresa no FirestoreService:', company.name, company.id);
      this.firestoreService.setCompanyContext(company);
    } else {
      console.warn('Empresa não encontrada no contexto');
    }
    
    if (this.currentUser && this.boardId && this.ownerId) {
      this.loadBoardData();
      this.subscribeToRealtimeUpdates();
      this.initializeApiEndpoint();
      // Carregar formulário inicial do board
      this.loadInitialForm();
      // Carregar fluxo de transições
      this.loadFlowConfig();
      // Agendador periódico para automações de tempo (a cada 60s)
      try {
        this.timeAutomationIntervalId = setInterval(async () => {
          try {
            await this.automationService.processTimeBasedAutomations(this.leads, this.columns, this.boardId, this.ownerId);
          } catch {}
        }, 60000);
      } catch {}
    } else {
      console.error('Parâmetros faltando:', { currentUser: !!this.currentUser, boardId: this.boardId, ownerId: this.ownerId });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.timeAutomationIntervalId) {
      try { clearInterval(this.timeAutomationIntervalId); } catch {}
      this.timeAutomationIntervalId = null;
    }
  }

  private initializeApiEndpoint() {
    // Exibir sempre a URL correta da Cloud Function (dev/prod)
    const company = this.subdomainService.getCurrentCompany();
    const companyId = company?.id || '{COMPANY_ID}';
    this.apiEndpoint = this.apiService.getLeadIntakeUrl(companyId, this.boardId);
  }

  private getFunctionsPort(): number {
    // 1. Verificar localStorage (configuração salva pelo usuário)
    const storedPort = localStorage.getItem('firebase-functions-port');
    if (storedPort) {
      return parseInt(storedPort, 10);
    }
    
    // 2. Tentar detectar pela configuração do Firebase (se disponível)
    try {
      const firebaseConfig = (window as any).__FIREBASE_DEFAULTS__;
      if (firebaseConfig?.emulatorHosts?.functions) {
        const functionsHost = firebaseConfig.emulatorHosts.functions;
        const portMatch = functionsHost.match(/:(\d+)$/);
        if (portMatch) {
          return parseInt(portMatch[1], 10);
        }
      }
    } catch (error) {
      // Ignorar erro se não conseguir detectar
    }
    
    // 3. Usar porta padrão (3001 é onde o server.js está rodando)
    return 3001;
  }

  // Company logo methods
  hasCompanyLogo(): boolean {
    const company = this.subdomainService.getCurrentCompany();
    
    // Se tem logo customizado
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== '') {
      return true;
    }
    
    // Se é a Gobuyer, sempre tem logo
    if (company?.subdomain === 'gobuyer') {
      return true;
    }
    
    return false;
  }

  getCompanyLogo(): string {
    const company = this.subdomainService.getCurrentCompany();
    
    // Se tem logo customizado, usar ele
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== '') {
      return company.brandingConfig.logo;
    }
    
    // Se é a Gobuyer, usar logo padrão da Gobuyer
    if (company?.subdomain === 'gobuyer') {
      return 'https://apps.gobuyer.com.br/sso/assets/images/logos/logo-gobuyer.png';
    }
    
    return '';
  }

  getPrimaryColor(): string {
    const company = this.subdomainService.getCurrentCompany();
    return company?.brandingConfig?.primaryColor || '#3B82F6';
  }

  getCompanyInitials(): string {
    const company = this.subdomainService.getCurrentCompany();
    const name = company?.name || 'Task Board';
    
    if (!name || name === 'Task Board') return 'TB';
    
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    
    return 'TB';
  }

  private async loadBoardData() {
    try {
      // Carregar dados do quadro (implementar se necessário)
      await this.loadUsers();
      await this.debugFirestoreCollections();
      this.isLoading = false;
    } catch (error) {
      console.error('Erro ao carregar dados do quadro:', error);
      this.isLoading = false;
    }
  }

  private async debugFirestoreCollections() {
    try {
      console.log('=== DEBUG: Testando acesso às coleções ===');
      console.log('ownerId:', this.ownerId, 'boardId:', this.boardId);
      
      // Testar estrutura atual
      console.log('Testando: users/' + this.ownerId + '/boards/' + this.boardId + '/emailTemplates');
      const templates = await this.firestoreService.getEmailTemplates(this.ownerId, this.boardId);
      console.log('Templates encontrados (método direto):', templates);
      
      console.log('Testando: users/' + this.ownerId + '/boards/' + this.boardId + '/automations');
      const automations = await this.firestoreService.getAutomations(this.ownerId, this.boardId);
      console.log('Automações encontradas (método direto):', automations);

      // Testar estrutura alternativa - talvez os dados estejam direto na coleção boards/{boardId}/
      console.log('=== Testando estrutura alternativa ===');
      console.log('Testando: boards/' + this.boardId + '/emailTemplates');
      try {
        const alternativeTemplates = await this.firestoreService.getEmailTemplates('', this.boardId);
        console.log('Templates encontrados (estrutura alternativa):', alternativeTemplates);
      } catch (error) {
        console.log('Erro na estrutura alternativa para templates:', error);
      }

      // Debug removal - method was removed
      
    } catch (error) {
      console.error('Erro no debug das coleções:', error);
    }
  }

  private async loadUsers() {
    try {
      // Simular carregamento de usuários - em um caso real, você buscaria do Firestore
      this.users = [
        {
          uid: this.currentUser?.uid,
          displayName: this.currentUser?.displayName,
          email: this.currentUser?.email
        }
      ];
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  }

  private subscribeToRealtimeUpdates() {
    console.log('Subscribing to updates with ownerId:', this.ownerId, 'boardId:', this.boardId);
    
    // Subscrever colunas
    const columnsUnsub = this.firestoreService.subscribeToColumns(
      this.ownerId,
      this.boardId,
      (columns) => {
        console.log('Colunas recebidas:', columns);
        this.columns = columns;
        this.loadCardFieldConfigs();
        // Sincronizar editor de fluxo: garantir que novas fases entrem na ordem
        try { this.syncFlowOrderWithColumns(); } catch {}
      }
    );
    this.subscriptions.push({ unsubscribe: columnsUnsub } as Subscription);

    // Subscrever leads
    const leadsUnsub = this.firestoreService.subscribeToLeads(
      this.ownerId,
      this.boardId,
      async (leads) => {
        console.log('Leads recebidos:', leads);
        // Detectar novos leads e mudanças de fase para acionar automações
        const currentById: Record<string, Lead> = Object.create(null);
        for (const l of leads as any) currentById[l.id!] = l as any;

        if (!this._leadsStreamInitialized) {
          // Primeira carga: somente inicializa o snapshot anterior
          this._lastLeadsById = currentById;
          this._leadsStreamInitialized = true;
        } else {
          // Novos leads
          const newLeads: Lead[] = [];
          // Movidos de fase
          const moved: Array<{ lead: Lead; from: string; to: string }> = [];

          const prev = this._lastLeadsById || {};
          // Detect additions and moves
          for (const [id, lead] of Object.entries(currentById)) {
            const prevLead = prev[id];
            if (!prevLead) {
              newLeads.push(lead as Lead);
            } else if (prevLead.columnId !== (lead as Lead).columnId) {
              moved.push({ lead: lead as Lead, from: prevLead.columnId, to: (lead as Lead).columnId });
            }
          }

          // Atualizar snapshot anterior antes de executar para evitar reentrância
          this._lastLeadsById = currentById;

          try {
            // Processar automações fora do ciclo de render
            for (const nl of newLeads) {
              try {
                await this.automationService.processNewLeadAutomations(nl, this.boardId, this.ownerId);
              } catch (e) { console.warn('Falha ao processar automação de novo lead:', e); }
            }
            for (const mv of moved) {
              try {
                await this.automationService.processPhaseChangeAutomations(mv.lead, mv.to, mv.from, this.boardId, this.ownerId);
              } catch (e) { console.warn('Falha ao processar automação de mudança de fase:', e); }
            }
          } catch {}
        }

        // Enriquecer contadores simples com base no histórico (se disponível em cache ou structure) — placeholder 0
        this.leads = (leads as any).map((l: any) => ({
          ...l,
          historyCommentsCount: l.historyCommentsCount ?? 0,
          attachmentsCount: l.attachmentsCount ?? 0
        }));
        // Processar automações baseadas em tempo sempre que os leads mudarem
        try {
          await this.automationService.processTimeBasedAutomations(this.leads, this.columns, this.boardId, this.ownerId);
        } catch (e) { console.warn('Falha ao processar automações por tempo:', e); }
        this.isLoading = false;
        this.ensureLeadOrderLoaded();
        this.rebuildDisplayedLeads();
      }
    );
    this.subscriptions.push({ unsubscribe: leadsUnsub } as Subscription);

    // Subscrever emails da caixa de saída
    const outboxUnsub = this.firestoreService.subscribeToOutboxEmails(
      this.ownerId,
      this.boardId,
      (emails) => {
        console.log('Emails da caixa de saída recebidos:', emails);
        this.outboxEmails = emails;
        this.updateEmailStatusCounts();
      }
    );
    this.subscriptions.push({ unsubscribe: outboxUnsub } as Subscription);

    // Subscrever templates de email
    const templatesUnsub = this.firestoreService.subscribeToEmailTemplates(
      this.ownerId,
      this.boardId,
      (templates) => {
        console.log('Templates recebidos:', templates);
        this.emailTemplates = templates;
      }
    );
    this.subscriptions.push({ unsubscribe: templatesUnsub } as Subscription);

    // Subscrever automações
    console.log('=== SUBSCRIÇÃO DE AUTOMAÇÕES ===');
    console.log('ownerId:', this.ownerId, 'boardId:', this.boardId);
    console.log('Iniciando subscrição...');
    
    const automationsUnsub = this.firestoreService.subscribeToAutomations(
      this.ownerId,
      this.boardId,
      (automations) => {
        console.log('=== CALLBACK DE AUTOMAÇÕES EXECUTADO ===');
        console.log('Automações recebidas:', automations);
        console.log('Número de automações:', automations.length);
        console.log('Tipo dos dados:', typeof automations, Array.isArray(automations));
        
        if (automations && automations.length > 0) {
          console.log('Primeira automação completa:', automations[0]);
          console.log('Campos da primeira automação:', Object.keys(automations[0]));
        } else {
          console.log('Nenhuma automação encontrada ou array vazio');
        }
        
        // Atribuir as automações (mesmo se for array vazio)
        this.automations = automations || [];
        console.log('this.automations definido como:', this.automations);
        
        // Limpar automações inválidas se existirem
        this.cleanupInvalidAutomations();
        
        // Automações carregadas do banco de dados
        
        console.log('=== FIM CALLBACK AUTOMAÇÕES ===');
      }
    );
    this.subscriptions.push({ unsubscribe: automationsUnsub } as Subscription);
  }

  private async loadCardFieldConfigs() {
    try {
      const map: Record<string, any[]> = {};
      for (const col of this.columns) {
        try {
          const cfg = await this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, col.id!);
          const fields = (cfg as any)?.fields || [];
          map[col.id!] = fields.filter((f: any) => !!f?.showInCard || !!f?.showInAllPhases).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        } catch {
          map[col.id!] = [];
        }
      }
      this.phaseCardFields = map;
    } catch {
      this.phaseCardFields = {};
    }
  }

  private isPlainObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  private flattenObject(source: any, maxDepth: number = 3): Record<string, any> {
    const out: Record<string, any> = {};
    if (!this.isPlainObject(source) || maxDepth < 0) return out;
    for (const [key, val] of Object.entries(source)) {
      if (this.isPlainObject(val) && maxDepth > 0) {
        const nested = this.flattenObject(val, maxDepth - 1);
        for (const [nk, nv] of Object.entries(nested)) {
          if (out[nk] === undefined) out[nk] = nv;
        }
      } else if (val !== undefined && val !== null) {
        out[key] = val as any;
      }
    }
    return out;
  }

  private collectLeadFields(lead: Lead): Record<string, any> {
    const base = ((lead as any).fields || {}) as any;
    const containers = ['fields', 'leadData', 'data', 'payload'];
    const merged: Record<string, any> = {};
    const candidates: any[] = [base];
    containers.forEach(k => { if (this.isPlainObject(base[k])) candidates.push(base[k]); });
    if (this.isPlainObject(base.fields?.fields)) candidates.push(base.fields.fields);
    for (const obj of candidates) {
      for (const [k, v] of Object.entries(obj)) {
        if (merged[k] === undefined && v !== undefined && v !== null && `${v}`.trim?.() !== '') merged[k] = v;
      }
    }
    const deep = this.flattenObject(base, 3);
    for (const [k, v] of Object.entries(deep)) {
      if (merged[k] === undefined && v !== undefined && v !== null && `${v}`.trim?.() !== '') merged[k] = v;
    }
    return merged;
  }

  private readFieldValue(lead: Lead, key: string, labelHint?: string): any {
    const fields: any = this.collectLeadFields(lead);
    if (!key && !labelHint) return undefined;
    const candidates: string[] = [];
    if (key) candidates.push(key);
    const synonymsGroup: Record<string, string[]> = {
      companyName: ['companyName','empresa','nomeEmpresa','nameCompany','company','company_name','empresa_nome','nameComapny'],
      contactName: ['contactName','name','nome','nomeLead','nameLead','leadName'],
      contactEmail: ['contactEmail','email','emailLead','contatoEmail','leadEmail'],
      contactPhone: ['contactPhone','phone','telefone','celular','phoneLead','telefoneContato'],
      cnpj: ['cnpj','cnpjCompany','cnpjEmpresa','companyCnpj']
    };
    const keyLower = (key || '').toLowerCase();
    // If key is a canonical or one of its synonyms, include the whole group (both directions)
    Object.values(synonymsGroup).forEach(group => {
      if (group.some(g => g.toLowerCase() === keyLower)) {
        group.forEach(k => { if (!candidates.includes(k)) candidates.push(k); });
      }
    });
    // If label hints the semantic, include the corresponding group
    const hint = (labelHint || '').toLowerCase();
    const labelMapHints: Array<{ words: string[]; groupKey: keyof typeof synonymsGroup }> = [
      { words: ['empresa'], groupKey: 'companyName' },
      { words: ['contato','nome do contato','responsável','responsavel'], groupKey: 'contactName' },
      { words: ['email','e-mail'], groupKey: 'contactEmail' },
      { words: ['telefone','celular','whatsapp','whats'], groupKey: 'contactPhone' },
      { words: ['cnpj'], groupKey: 'cnpj' }
    ];
    for (const m of labelMapHints) {
      if (m.words.some(w => hint.includes(w))) {
        synonymsGroup[m.groupKey].forEach(k => { if (!candidates.includes(k)) candidates.push(k); });
      }
    }
    const lowerMap: Record<string, string> = Object.keys(fields).reduce((acc: any, k: string) => { acc[k.toLowerCase()] = k; return acc; }, {});
    // Normalized map (remove non-alphanumerics) for fuzzy matching
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedMap: Record<string, string> = Object.keys(fields).reduce((acc: any, k: string) => { acc[normalize(k)] = k; return acc; }, {});
    const visited = new Set<string>();
    for (const k of candidates) {
      const lk = k.toLowerCase();
      if (visited.has(lk)) continue; visited.add(lk);
      const original = lowerMap[lk] || normalizedMap[normalize(k)] || k;
      const v = fields[original];
      if (v !== undefined && v !== null && `${v}`.trim?.() !== '') return v;
    }
    return undefined;
  }

  getCardFieldsForLead(lead: Lead): Array<{ label: string; value: any; type?: string }> {
    // Unir configuração da fase com fallback do formulário inicial (sem duplicar)
    const phaseList = this.phaseCardFields[lead.columnId] || [];
    const fallbackInitial = (this.initialFormFields || [])
      .filter((f: any) => !!f?.showInCard || !!f?.showInAllPhases)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    // Debug logging
    console.log('🔍 Debug getCardFieldsForLead:', {
      leadId: lead.id,
      columnId: lead.columnId,
      phaseListLength: phaseList.length,
      fallbackInitialLength: fallbackInitial.length,
      initialFormFields: this.initialFormFields?.map((f: any) => ({
        name: f.name,
        type: f.type,
        showInCard: f.showInCard,
        showInAllPhases: f.showInAllPhases
      })),
      phaseList: phaseList.map((f: any) => ({
        name: f.name,
        type: f.type,
        showInCard: f.showInCard,
        showInAllPhases: f.showInAllPhases
      })),
      fallbackInitial: fallbackInitial.map((f: any) => ({
        name: f.name,
        type: f.type,
        showInCard: f.showInCard,
        showInAllPhases: f.showInAllPhases
      }))
    });

    const merged: any[] = [...phaseList];
    const seen = new Set<string>();
    const keyOf = (f: any) => (f.apiFieldName && f.apiFieldName.trim()) || (f.name && f.name.trim()) || (f.label && f.label.trim()) || '';
    for (const f of merged) seen.add(keyOf(f).toLowerCase());
    for (const f of fallbackInitial) {
      const k = keyOf(f).toLowerCase();
      if (!seen.has(k)) { merged.push(f); seen.add(k); }
    }

    const out: Array<{ label: string; value: any; type?: string }> = [];
    const isTitleField = (f: any): boolean => {
      const key = (f.apiFieldName || f.name || '').toLowerCase();
      const lbl = (f.label || f.name || '').toLowerCase();
      const norm = (s: string) => s.replace(/[^a-z0-9]/g, '');
      const companyGroup = ['companyname','empresa','nomeempresa','namecompany','company','company_name','empresa_nome','namecomapny'];
      const cnpjGroup = ['cnpj','cnpjcompany','cnpjempresa','companycnpj'];
      const k = norm(key); const l = norm(lbl);
      return companyGroup.includes(k) || companyGroup.includes(l) || cnpjGroup.includes(k) || cnpjGroup.includes(l);
    };
    for (const f of merged) {
      if (isTitleField(f)) continue;
      const value = this.readFieldValue(lead, f.apiFieldName || f.name, f.label || f.name);
      console.log('🔍 Processing field:', {
        field: f.name,
        type: f.type,
        apiFieldName: f.apiFieldName,
        label: f.label,
        value: value,
        showInCard: f.showInCard,
        showInAllPhases: f.showInAllPhases
      });
      if (value !== undefined && value !== null && `${value}`.trim() !== '') {
        out.push({ label: f.label || f.name || f.apiFieldName, value, type: (f.type || '').toLowerCase() });
      }
    }
    
    console.log('🔍 Final card fields output:', out);
    return out;
  }

  // Exibir temperatura em todas as fases quando marcada em qualquer config
  getTemperatureGlobalItem(lead: Lead): { label: string; value: any } | null {
    try {
      // procurar um campo com type temperatura no form inicial
      const sources = [
        ...(this.phaseCardFields[lead.columnId] || []),
        ...(this.initialFormFields || [])
      ];
      
      console.log('🌡️ getTemperatureGlobalItem DEBUG:', {
        leadId: lead.id,
        columnId: lead.columnId,
        phaseCardFields: this.phaseCardFields[lead.columnId],
        initialFormFields: this.initialFormFields,
        sourcesLength: sources.length,
        sources: sources
      });
      
      const tempField = (sources as any[]).find(f => {
        const isTemperatura = (f.type || '').toLowerCase() === 'temperatura';
        const hasVisibilityFlag = f.showInCard || f.showInAllPhases;
        console.log('🌡️ Checking field:', {
          name: f.name,
          type: f.type,
          isTemperatura: isTemperatura,
          showInCard: f.showInCard,
          showInAllPhases: f.showInAllPhases,
          hasVisibilityFlag: hasVisibilityFlag,
          matches: isTemperatura && hasVisibilityFlag
        });
        return isTemperatura && hasVisibilityFlag;
      });
      
      console.log('🌡️ Found tempField:', tempField);
      
      if (!tempField) return null;
      const val = this.readFieldValue(lead, tempField.apiFieldName || tempField.name, tempField.label || tempField.name);
      console.log('🌡️ Temperature value:', val);
      if (val === undefined || val === null || `${val}`.trim() === '') return null;
      return { label: tempField.label || 'Temperatura', value: val };
    } catch (error) {
      console.error('🌡️ getTemperatureGlobalItem error:', error);
      return null;
    }
  }

  // Recupera o item de temperatura apenas se estiver marcado para exibir no card
  getTemperatureCardItem(lead: Lead): { label: string; value: any } | null {
    try {
      const items = this.getCardFieldsForLead(lead);
      const temp = (items as any[]).find(i => (i.type || '').toLowerCase() === 'temperatura');
      return temp ? { label: temp.label, value: temp.value } : null;
    } catch {
      return null;
    }
  }

  getLeadsForColumn(columnId: string): Lead[] {
    // método legado – manter compatibilidade, mas preferimos displayedLeadsByColumn no template
    const all = this.leads.filter(lead => lead.columnId === columnId);
    const filtered = all.filter(lead => this.leadMatchesFilters ? this.leadMatchesFilters(lead) : true);
    const order = this.leadOrderByColumn[columnId] || [];
    return filtered.sort((a, b) => (order.indexOf(a.id!) - order.indexOf(b.id!)) || 0);
  }

  getColumnConnectedTo(): string[] {
    return this.columns.map(col => `column-${col.id}`);
  }

  async onLeadDrop(event: CdkDragDrop<Lead[]>) {
    // garantir término de estado de arraste
    this.isDraggingLead = false;
    const leadId = event.item.data;
    const targetColumnId = event.container.id.replace('column-', '');
    const previousColumnId = event.previousContainer.id.replace('column-', '');
    
    if (event.previousContainer === event.container) {
      // Reordenar dentro da mesma coluna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // Atualizar ordem local dessa coluna (considerando apenas visíveis)
      const visibleIds = (event.container.data as Lead[]).map(l => l.id!);
      const currentOrder = this.leadOrderByColumn[targetColumnId] || [];
      const remaining = currentOrder.filter(id => !visibleIds.includes(id));
      this.leadOrderByColumn[targetColumnId] = [...visibleIds, ...remaining];
      this.saveLeadOrder();
      return;
    } else {
      // Mover para outra coluna
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Buscar dados completos do lead
      const lead = this.leads.find(l => l.id === leadId);
      // Validar campos obrigatórios para avançar (da fase de origem)
      try {
        const missing = await this.getRequiredToAdvanceMissing(lead as Lead, previousColumnId);
        if (missing.length > 0) {
          // Reverter visualmente
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          this.toast.error(`Preencha os campos obrigatórios para avançar: ${missing.join(', ')}`);
          return;
        }
      } catch {}
      
      // Validar fluxo de transição
      const allowedFrom = this.flowConfig.allowed[previousColumnId] || [];
      if (!allowedFrom.includes(targetColumnId)) {
        // Reverter visualmente
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );
        this.toast.error('Transição não permitida pelo fluxo.');
        return;
      }

      // Atualizar no Firestore
      try {
        await this.firestoreService.moveLead(
          this.ownerId,
          this.boardId,
          leadId,
          targetColumnId
        );

        // Ajustar ordens locais das duas colunas
        const targetVisibleIds = (event.container.data as Lead[]).map(l => l.id!);
        const sourceVisibleIds = (event.previousContainer.data as Lead[]).map(l => l.id!);
        const sourceOrder = this.leadOrderByColumn[previousColumnId] || [];
        const targetOrder = this.leadOrderByColumn[targetColumnId] || [];
        const leadIdStr = String(leadId);
        // remover do source
        const sourceRemaining = sourceOrder.filter(id => id !== leadIdStr);
        // inserir no target respeitando posição visível
        const targetRemaining = targetOrder.filter(id => !targetVisibleIds.includes(id) && id !== leadIdStr);
        this.leadOrderByColumn[previousColumnId] = [...sourceVisibleIds, ...sourceRemaining.filter(id => !sourceVisibleIds.includes(id))];
        this.leadOrderByColumn[targetColumnId] = [...targetVisibleIds, ...targetRemaining];
        this.saveLeadOrder();

        // Atualizar histórico de fases do lead (para exibição no detalhe)
        try {
          if (lead) {
            const now = new Date();
            const phaseHistory: any = { ...(lead as any).phaseHistory || {} };
            // finalizar fase anterior
            if (phaseHistory[previousColumnId]) {
              const enteredAt = (phaseHistory[previousColumnId].enteredAt?.toDate && phaseHistory[previousColumnId].enteredAt.toDate()) || new Date(phaseHistory[previousColumnId].enteredAt || now);
              phaseHistory[previousColumnId].exitedAt = now;
              phaseHistory[previousColumnId].duration = now.getTime() - enteredAt.getTime();
            }
            // iniciar nova fase
            phaseHistory[targetColumnId] = {
              phaseId: targetColumnId,
              enteredAt: now
            };
            await this.firestoreService.updateLead(this.ownerId, this.boardId, lead.id!, { phaseHistory } as any);
          }
        } catch {}
      } catch (error) {
        console.error('Erro ao mover lead:', error);
        // Reverter a mudança visual se houver erro
        this.subscribeToRealtimeUpdates();
      }
    }
  }

  // Verifica campos requiredToAdvance não preenchidos da fase sourceColumnId do lead
  private async getRequiredToAdvanceMissing(lead: Lead, sourceColumnId?: string): Promise<string[]> {
    try {
      const colId = sourceColumnId || lead.columnId;
      const cfg = await this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, colId);
      const fields = (cfg as any)?.fields || [];
      const required = fields.filter((f: any) => !!f?.requiredToAdvance);
      const missing: string[] = [];
      for (const f of required) {
        const key = f.apiFieldName || f.name;
        const value = this.readFieldValue(lead, key, f.label || f.name);
        const empty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        if (empty) missing.push(f.label || f.name || key);
      }
      return missing;
    } catch {
      return [];
    }
  }

  // trackBy para manter estabilidade dos itens
  trackByLeadId(index: number, lead: Lead) { return lead.id; }

  private ensureLeadOrderLoaded() {
    const key = `lead-order-${this.boardId}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        this.leadOrderByColumn = JSON.parse(raw) || {};
      }
    } catch {}
  }

  private saveLeadOrder() {
    const key = `lead-order-${this.boardId}`;
    try { localStorage.setItem(key, JSON.stringify(this.leadOrderByColumn)); } catch {}
  }

  private rebuildDisplayedLeads() {
    const map: Record<string, Lead[]> = {};
    for (const col of this.columns) {
      const all = this.leads.filter(l => l.columnId === col.id);
      const filtered = all.filter(l => this.leadMatchesFilters ? this.leadMatchesFilters(l) : true);
      const order = this.leadOrderByColumn[col.id!] || [];
      const withKnown = filtered.filter(l => order.includes(l.id!)).sort((a, b) => order.indexOf(a.id!) - order.indexOf(b.id!));
      const without = filtered.filter(l => !order.includes(l.id!));
      map[col.id!] = [...withKnown, ...without];
      // se não há ordem para a coluna, inicializar
      if (!this.leadOrderByColumn[col.id!]) {
        this.leadOrderByColumn[col.id!] = map[col.id!].map(l => l.id!);
      }
    }
    this.displayedLeadsByColumn = map;
    this.saveLeadOrder();
  }

  async logout() {
    const result = await this.authService.logout();
    if (result.success) {
      this.router.navigate(['/login']);
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  formatDate(timestamp: any): string {
    if (!timestamp) {
      console.log('formatDate: timestamp is null/undefined');
      return 'Data não disponível';
    }
    
    try {
      // Firebase Timestamp format
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR');
      }
      // Firebase serverTimestamp format
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-BR');
      }
      // Regular Date format
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString('pt-BR');
      }
      // String or number format
      return new Date(timestamp).toLocaleDateString('pt-BR');
    } catch (error) {
      console.log('formatDate error:', error, 'timestamp:', timestamp);
      return 'Data inválida';
    }
  }

  // Data e hora (pt-BR) – aceita Timestamp do Firestore, Date, string ou number
  formatDateTime(timestamp: any): string {
    if (!timestamp) {
      return '—';
    }
    try {
      // Firestore Timestamp com seconds
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString('pt-BR');
      }
      // serverTimestamp / Timestamp com toDate
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString('pt-BR');
      }
      // Date
      if (timestamp instanceof Date) {
        return timestamp.toLocaleString('pt-BR');
      }
      // String/number
      return new Date(timestamp).toLocaleString('pt-BR');
    } catch {
      return '—';
    }
  }

  // Para a Caixa de Saída: priorizar hora de envio (delivery.endTime) e cair para createdAt
  getEmailDisplayDate(email: any): any {
    const sent = email?.delivery?.endTime;
    if (sent) return sent;
    return email?.createdAt || null;
  }

  getColumnBorderColor(column: Column): string {
    return column.color || '#e5e7eb';
  }

  getLeadPriorityClass(lead: Lead): string {
    const temperature = lead.fields?.['temperature'];
    if (temperature === 'quente') return 'border-l-red-500';
    if (temperature === 'morno') return 'border-l-yellow-500';
    return 'border-l-transparent';
  }

  getLeadInitials(lead: Lead): string {
    const name = lead.fields?.['companyName'] || lead.fields?.['contactName'] || '';
    return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  getCompanyName(lead: Lead): string {
    const val = this.readFieldValue(lead, 'companyName');
    return (val !== undefined && val !== null && `${val}`.trim() !== '') ? `${val}` : 'Empresa não informada';
  }

  getCnpj(lead: Lead): string | null {
    const val = this.readFieldValue(lead, 'cnpj', 'CNPJ');
    if (val === undefined || val === null) return null;
    const s = `${val}`.trim();
    return s ? s : null;
  }

  showCreateLeadModal() {
    this.leadModal.showCreateModal();
  }

  showEditLeadModal(lead: Lead) {
    this.leadModal.showEditModal(lead);
  }

  showLeadDetailModal(lead: Lead) {
    this.leadDetailModal.show(lead);
  }

  onCardClick(lead: Lead, evt?: MouseEvent) {
    if (this.isDraggingLead) return; // evita abrir modal se estava arrastando
    this.showLeadDetailModal(lead);
  }

  onLeadDragStarted() {
    this.isDraggingLead = true;
  }

  onLeadDragEnded() {
    // pequena defasagem para não considerar o click após o drop como click do card
    setTimeout(() => { this.isDraggingLead = false; }, 0);
  }

  toggleCardMove() {
    this.cardMoveEnabled = !this.cardMoveEnabled;
    if (!this.cardMoveEnabled) this.isDraggingLead = false;
  }

  @HostListener('window:mouseup')
  onWindowMouseUpForCards() {
    // Garante término do drag do card caso mouseup ocorra fora da lista
    this.isDraggingLead = false;
  }

  @HostListener('window:touchend')
  onWindowTouchEndForCards() {
    this.isDraggingLead = false;
  }

  async onLeadCreated() {
    // Os leads serão atualizados automaticamente via real-time subscription
    console.log('Novo lead criado!');
  }

  onLeadUpdated() {
    // Os leads serão atualizados automaticamente via real-time subscription
    console.log('Lead atualizado!');
  }

  onLeadDeleted() {
    // Os leads serão atualizados automaticamente via real-time subscription
    console.log('Lead excluído!');
  }

  switchTab(tabId: string) {
    this.activeTab = tabId;
  }

  getActiveLeads(): Lead[] {
    return this.leads.filter(lead => {
      const column = this.columns.find(col => col.id === lead.columnId);
      return column && (!column.endStageType || column.endStageType === 'none');
    });
  }

  // Propriedades para Caixa de Saída
  outboxEmails: any[] = [];
  activeEmailStatus: string = 'all';
  emailStatuses = [
    { id: 'all', name: 'Todos', count: 0 },
    { id: 'scheduled', name: 'Agendados', count: 0 },
    { id: 'success', name: 'Enviados', count: 0 },
    { id: 'error', name: 'Com Erro', count: 0 }
  ];

  // Propriedades para Templates
  emailTemplates: any[] = [];

  // Propriedades para Automações
  automations: any[] = [];
  private _leadsStreamInitialized = false;
  private _lastLeadsById: Record<string, Lead> = {};

  // Formulário inicial (aba nova)
  initialFormFields: any[] = [];
  apiExampleJson: string = '';

  // Fluxo (transitions) config
  flowConfig: { allowed: Record<string, string[]> } = { allowed: {} };
  // Novo layout do fluxo: ordem horizontal e toggles adjacentes
  flowOrder: string[] = [];
  flowTogglesByPhase: Record<string, { allowNext: boolean; allowPrev: boolean }> = {};
  // Editor manual de conexões
  flowEdges: Array<{ fromId: string; toId: string }> = [];
  connectMode = false;
  pendingFromId: string | null = null;

  private async loadFlowConfig() {
    try {
      const cfg = await this.firestoreService.getFlowConfig(this.boardId);
      this.flowConfig = (cfg as any) || { allowed: {} };
      // Inicializar ordem com a order das colunas
      this.flowOrder = [...this.columns].sort((a,b)=>(a.order||0)-(b.order||0)).map(c=>c.id!);
      // Inicializar toggles a partir do allowed atual
      this.flowTogglesByPhase = {};
      for (let i = 0; i < this.flowOrder.length; i++) {
        const id = this.flowOrder[i];
        const prevId = this.flowOrder[i-1];
        const nextId = this.flowOrder[i+1];
        const allowedFrom = this.flowConfig.allowed[id] || [];
        this.flowTogglesByPhase[id] = {
          allowNext: !!(nextId && allowedFrom.includes(nextId)),
          allowPrev: !!(prevId && allowedFrom.includes(prevId))
        };
      }
      // Converter allowed -> edges para exibir
      const edges: Array<{ fromId: string; toId: string }> = [];
      const allowed = this.flowConfig.allowed || {};
      Object.keys(allowed).forEach(fromId => {
        (allowed[fromId] || []).forEach(toId => edges.push({ fromId, toId }));
      });
      this.flowEdges = edges;
    } catch {
      this.flowConfig = { allowed: {} };
      this.flowOrder = [...this.columns].sort((a,b)=>(a.order||0)-(b.order||0)).map(c=>c.id!);
    }
  }

  async saveFlowConfig() {
    try {
      // Construir allowed com base nas conexões manuais, sanitizando IDs
      const normalizeId = (v: any) => (typeof v === 'string' ? v.trim() : String(v || '').trim());
      const allowed: Record<string, string[]> = {};
      for (const edge of (this.flowEdges || [])) {
        const fromId = normalizeId(edge.fromId);
        const toId = normalizeId(edge.toId);
        if (!fromId || !toId) continue;
        if (!allowed[fromId]) allowed[fromId] = [];
        if (!allowed[fromId].includes(toId)) allowed[fromId].push(toId);
      }
      // Manter apenas IDs existentes
      const validIds = new Set(this.columns.map(c => c.id));
      Object.keys(allowed).forEach(fromId => {
        if (!validIds.has(fromId)) delete allowed[fromId];
        else allowed[fromId] = (allowed[fromId] || []).filter(toId => validIds.has(toId));
      });
      const orderClean = (this.flowOrder || []).map(normalizeId).filter(id => validIds.has(id));

      this.flowConfig = { allowed };
      await this.firestoreService.saveFlowConfig(this.boardId, { allowed, order: orderClean });
      this.toast.success('Fluxo salvo.');
    } catch (error: any) {
      console.error('Erro ao salvar fluxo', { error });
      const message = error?.message || 'Erro ao salvar fluxo.';
      this.toast.error(message);
    }
  }

  // Flow helpers (UI)
  getAllowedTargets(fromId: string): Column[] {
    const ids = this.flowConfig.allowed[fromId] || [];
    return this.columns.filter(c => ids.includes(c.id!));
  }

  getAvailableTargets(fromId: string): Column[] {
    const ids = this.flowConfig.allowed[fromId] || [];
    return this.columns.filter(c => c.id !== fromId && !ids.includes(c.id!));
  }

  onFlowDropToAllowed(fromId: string, event: CdkDragDrop<Column[]>) {
    const dropped: Column = event.item.data as Column;
    const list = this.flowConfig.allowed[fromId] || (this.flowConfig.allowed[fromId] = []);
    if (!list.includes(dropped.id!)) list.push(dropped.id!);
  }

  onFlowDropToAvailable(fromId: string, event: CdkDragDrop<Column[]>) {
    const dropped: Column = event.item.data as Column;
    const list = this.flowConfig.allowed[fromId] || [];
    this.flowConfig.allowed[fromId] = list.filter(id => id !== dropped.id);
  }

  // Reordenação horizontal dos cartões de fases no editor de fluxo
  onFlowReorder(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.flowOrder, event.previousIndex, event.currentIndex);
  }

  private syncFlowOrderWithColumns() {
    const sortedIds = [...this.columns].sort((a,b)=>(a.order||0)-(b.order||0)).map(c=>c.id!);
    if (!Array.isArray(this.flowOrder) || this.flowOrder.length === 0) {
      this.flowOrder = sortedIds;
      return;
    }
    // Inserir novas fases que não estão na ordem ainda
    const existing = new Set(this.flowOrder);
    for (const id of sortedIds) {
      if (!existing.has(id)) this.flowOrder.push(id);
    }
    // Remover fases que foram apagadas
    this.flowOrder = this.flowOrder.filter(id => sortedIds.includes(id));
  }

  // Fluxo: scroll helpers
  scrollFlowBy(delta: number) {
    try {
      const el = this.flowScrollerRef?.nativeElement;
      if (el) el.scrollBy({ left: delta, behavior: 'smooth' });
    } catch {}
  }

  // Atualiza o tamanho e posição do thumb customizado
  private updateFlowThumb() {
    try {
      const el = this.flowScrollerRef?.nativeElement;
      if (!el) return;
      const total = el.scrollWidth;
      const viewport = el.clientWidth;
      const scrollLeft = el.scrollLeft;
      const percent = Math.max(5, Math.min(100, (viewport / total) * 100));
      const left = Math.max(0, Math.min(100 - percent, (scrollLeft / (total - viewport)) * 100));
      this.flowThumbPercent = percent;
      this.flowThumbLeftPercent = isFinite(left) ? left : 0;
      this.cdr.markForCheck();
    } catch {}
  }

  @HostListener('window:resize')
  onWindowResizeFlow() { this.updateFlowThumb(); }

  ngAfterViewInit() {
    // Atualizar thumb quando a view estiver pronta
    setTimeout(() => this.updateFlowThumb(), 0);
    try {
      const el = this.flowScrollerRef?.nativeElement;
      if (el) {
        this.ngZone.runOutsideAngular(() => {
          el.addEventListener('scroll', () => {
            this.ngZone.run(() => this.updateFlowThumb());
          }, { passive: true });
        });
      }
    } catch {}
  }

  // Click/drag na barra personalizada
  onFlowBarPointerDown(evt: MouseEvent) {
    evt.preventDefault();
    const el = this.flowScrollerRef?.nativeElement;
    const bar = (evt.currentTarget as HTMLElement);
    if (!el || !bar) return;
    const rect = bar.getBoundingClientRect();
    const moveTo = (clientX: number) => {
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      el.scrollLeft = (el.scrollWidth - el.clientWidth) * ratio;
      this.updateFlowThumb();
    };
    moveTo(evt.clientX);
    this.isDraggingFlowBar = true;
    const onMove = (e: MouseEvent) => moveTo(e.clientX);
    const onUp = () => {
      this.isDraggingFlowBar = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseup', onUp, { once: true });
    });
  }

  onFlowBarTouchStart(evt: TouchEvent) {
    const el = this.flowScrollerRef?.nativeElement;
    const bar = (evt.currentTarget as HTMLElement);
    if (!el || !bar || evt.touches.length === 0) return;
    const rect = bar.getBoundingClientRect();
    const moveTo = (clientX: number) => {
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      el.scrollLeft = (el.scrollWidth - el.clientWidth) * ratio;
      this.updateFlowThumb();
    };
    moveTo(evt.touches[0].clientX);
    const onMove = (e: TouchEvent) => {
      if (e.touches.length > 0) moveTo(e.touches[0].clientX);
    };
    const onEnd = () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('touchend', onEnd, { once: true });
    });
  }

  toggleConnectMode() { this.connectMode = !this.connectMode; this.pendingFromId = null; }
  beginEdge(fromId: string) {
    // Conectores sempre ativos: iniciar conexão sem depender de modo
    this.pendingFromId = fromId;
  }
  completeEdge(toId: string) {
    if (!this.pendingFromId) return;
    const fromId = this.pendingFromId;
    if (fromId !== toId && !this.flowEdges.some(e => e.fromId === fromId && e.toId === toId)) {
      this.flowEdges.push({ fromId, toId });
    }
    this.pendingFromId = null;
  }
  removeEdge(edge: { fromId: string; toId: string }) {
    this.flowEdges = this.flowEdges.filter(e => !(e.fromId === edge.fromId && e.toId === edge.toId));
  }

  // Helpers para template (evitam funções inline no HTML)
  hasOutgoingConnections(phaseId: string): boolean {
    return Array.isArray(this.flowEdges) && this.flowEdges.some(e => e.fromId === phaseId);
  }
  getOutgoingConnections(phaseId: string): Array<{ fromId: string; toId: string }> {
    return (this.flowEdges || []).filter(e => e.fromId === phaseId);
  }

  getEdgeArrow(edge: { fromId: string; toId: string }): string {
    const from = this.columns.find(c => c.id === edge.fromId);
    const to = this.columns.find(c => c.id === edge.toId);
    if (!from || !to) return '→';
    return (to.order > from.order) ? '→' : '←';
  }

  // legacy handlers removed (no-op to satisfy template references if any remain)
  onFlowMouseMove(evt: MouseEvent) { /* no-op */ }

  startConnect(fromId: string, evt: MouseEvent) { /* no-op */ }

  endConnect(toId: string, evt: MouseEvent) { /* no-op */ }

  cancelConnect() { /* no-op */ }

  getNodeById(id: string) { return { id, name: '', x: 0, y: 0 } as any; }

  buildCurvePath(fromId: string, toId: string): string {
    const a = this.getNodeById(fromId);
    const b = this.getNodeById(toId);
    if (!a || !b) return '';
    const startX = a.x + 120; // right side
    const startY = a.y + 30;
    const endX = b.x;
    const endY = b.y + 30;
    const dx = Math.max(40, Math.abs(endX - startX) * 0.5);
    const c1x = startX + dx, c1y = startY;
    const c2x = endX - dx, c2y = endY;
    return `M ${startX},${startY} C ${c1x},${c1y} ${c2x},${c2y} ${endX},${endY}`;
  }

  buildTempCurve(): string { return ''; }

  getEdgeColor(fromId: string, toId: string): string {
    // verde para avanço (order cresce), laranja para retrocesso
    const from = this.columns.find(c => c.id === fromId);
    const to = this.columns.find(c => c.id === toId);
    if (!from || !to) return '#9CA3AF';
    return (to.order > from.order) ? '#16a34a' : '#ea580c';
  }

  getEdgeMarker(fromId: string, toId: string): string {
    const from = this.columns.find(c => c.id === fromId);
    const to = this.columns.find(c => c.id === toId);
    if (!from || !to) return '';
    return (to.order > from.order) ? 'url(#arrow-green)' : 'url(#arrow-orange)';
  }

  onNodeDragStart(node: { id: string; x: number; y: number }, evt: MouseEvent) { /* no-op */ }

  onFlowMouseUp(evt: MouseEvent) { /* no-op */ }

  @HostListener('window:mouseup', ['$event'])
  onWindowMouseUp(evt: MouseEvent) { /* no-op */ }

  @HostListener('window:touchend', ['$event'])
  onWindowTouchEnd(evt: TouchEvent) { /* no-op */ }

  onNodeMouseEnter(node: { id: string }) { /* no-op */ }

  onNodeMouseLeave(node: { id: string }) { /* no-op */ }

  autoAlignFlow() { this.toast.success('Fluxo alinhado'); }

  toggleFlowMove() { /* no-op */ }

  getColumnById(columnId: string): Column | undefined {
    return this.columns.find(c => c.id === columnId);
  }

  // Quantidade de automações ativas associadas a uma fase
  getAutomationCount(columnId: string): number {
    try {
      const isInitial = this.isInitialPhaseId(columnId);
      return (this.automations || []).filter((a: any) => {
        const active = a?.active !== false;
        if (!active) return false;
        const trigger = a?.trigger || {};
        const type = a?.triggerType ?? trigger.type;
        const phase = a?.triggerPhase ?? trigger.phase;
        if (type === 'new-lead-created') {
          // Se não tem fase vinculada, considerar como da fase inicial
          if (!phase) return isInitial;
          return phase === columnId;
        }
        return phase === columnId;
      }).length;
    } catch {
      return 0;
    }
  }

  isInitialPhaseId(phaseId: string): boolean {
    const col = this.getColumnById(phaseId);
    if (!col) return false;
    // considerar flag explícita ou menor ordem como inicial
    const minOrder = Math.min(...this.columns.map(c => c.order || 0));
    return !!col.isInitialPhase || (col.order || 0) === minOrder;
  }

  getAllowedTriggerTypesForPhase(phaseId: string): string[] {
    const base = ['new-lead-created', 'card-enters-phase', 'card-in-phase-for-time', 'form-not-answered', 'sla-overdue'];
    return base;
  }

  // Automações por fase (na aba Fluxo)
  selectedPhaseIdForAutomations: string | null = null;
  openPhaseAutomations(phaseId: string) {
    this.selectedPhaseIdForAutomations = phaseId;
  }
  closePhaseAutomations() { this.selectedPhaseIdForAutomations = null; }
  getAutomationsForPhase(phaseId: string) {
    return (this.automations || []).filter(a => {
      const trigger = a?.trigger || {};
      const type = a?.triggerType ?? trigger.type;
      const phase = a?.triggerPhase ?? trigger.phase;
      if (type === 'new-lead-created') {
        // Se a automação não estiver vinculada a uma fase específica,
        // exibir na fase inicial; se estiver, exibir na fase vinculada
        if (!phase) return this.isInitialPhaseId(phaseId);
        return phase === phaseId;
      }
      return phase === phaseId;
    });
  }
  createAutomationForPhase(phaseId: string) {
    const defaultType = this.isInitialPhaseId(phaseId) ? 'new-lead-created' : 'card-enters-phase';
    this.selectedAutomation = {
      name: 'Automação da fase',
      active: true,
      trigger: { type: defaultType, phase: phaseId },
      triggerType: defaultType,
      triggerPhase: phaseId,
      actions: []
    } as any;
    this.showAutomationModal = true;
  }

  private async loadInitialForm() {
    try {
      const cfg = await this.firestoreService.getInitialFormConfig(this.boardId);
      console.log('🔍 RAW CONFIG from database:', cfg);
      this.initialFormFields = (cfg as any)?.fields || [];
      console.log('🔍 loadInitialForm loaded fields:', this.initialFormFields.map(f => ({
        name: f.name,
        type: f.type,
        showInCard: f.showInCard,
        showInAllPhases: f.showInAllPhases
      })));
      console.log('🔍 ALL FIELD DETAILS:', this.initialFormFields);
      
      // Verificar especificamente por campos de temperatura
      const tempFields = this.initialFormFields.filter(f => f.type === 'temperatura' || f.name?.toLowerCase().includes('temp'));
      console.log('🌡️ CAMPOS DE TEMPERATURA ENCONTRADOS:', tempFields);
      
      this.buildApiExampleFromFields();
    } catch (error) {
      console.log('🔍 loadInitialForm error:', error);
      this.initialFormFields = [];
      this.buildApiExampleFromFields();
    }
  }

  async saveInitialForm() {
    try {
      console.log('💾 saveInitialForm INICIADO');
      console.log('💾 boardId:', this.boardId);
      console.log('💾 initialFormFields:', this.initialFormFields);
      console.log('💾 Total de campos:', this.initialFormFields?.length);
      
      // Log detalhado de cada campo
      this.initialFormFields?.forEach((field, index) => {
        console.log(`💾 Campo ${index + 1}:`, {
          name: field.name,
          label: field.label,
          type: field.type,
          showInCard: field.showInCard,
          showInAllPhases: field.showInAllPhases,
          completeField: field
        });
      });
      
      const dataToSave = { fields: this.initialFormFields };
      console.log('💾 Dados que serão salvos:', dataToSave);
      
      await this.firestoreService.saveInitialFormConfig(this.boardId, dataToSave);
      
      console.log('💾 saveInitialForm SUCESSO - dados salvos no Firestore');
      this.toast.success('Formulário inicial salvo.');
    } catch (error) {
      console.error('💾 saveInitialForm ERRO:', error);
      this.toast.error('Erro ao salvar formulário inicial.');
    }
  }

  onInitialFieldsChanged(fields: any[]) {
    console.log('🔄 onInitialFieldsChanged CHAMADO');
    console.log('🔄 Campos recebidos:', fields);
    console.log('🔄 Número de campos:', fields?.length);
    
    // Log detalhado dos campos recebidos
    fields?.forEach((field, index) => {
      console.log(`🔄 Campo recebido ${index + 1}:`, {
        name: field.name,
        label: field.label,
        type: field.type,
        showInCard: field.showInCard,
        showInAllPhases: field.showInAllPhases
      });
    });
    
    this.initialFormFields = fields;
    console.log('🔄 initialFormFields atualizado:', this.initialFormFields);
    
    this.buildApiExampleFromFields();
    console.log('🔄 onInitialFieldsChanged CONCLUÍDO');
  }

  private buildApiExampleFromFields() {
    const body: any = {};
    for (const field of this.initialFormFields || []) {
      const key = (field.apiFieldName && field.apiFieldName.trim()) ? field.apiFieldName.trim() : (field.name || 'campo');
      body[key] = this.getSampleForField(field);
    }
    this.apiExampleJson = JSON.stringify(body, null, 2);
  }

  private getSampleForField(field: any): any {
    const type = (field.type || 'text').toLowerCase();
    if (type === 'email') return 'email@exemplo.com';
    if (type === 'tel' || type === 'phone') return '(11) 99999-9999';
    if (type === 'number') return 123;
    if (type === 'select' && Array.isArray(field.options) && field.options.length) return field.options[0];
    if (type === 'temperatura') return 'Quente';
    if (type === 'textarea') return 'Texto livre';
    return 'Valor de exemplo';
  }

  // Configuração de formulário da fase permanece no menu/ícone da própria fase via modal


  // Lista de usuários para o modal de detalhes
  users: any[] = [];

  // Estado para acordeão mobile
  expandedMobileColumnId: string | null = null;

  toggleMobileColumn(columnId: string) {
    this.expandedMobileColumnId = this.expandedMobileColumnId === columnId ? null : columnId;
  }

  isMobileColumnOpen(columnId: string): boolean {
    return this.expandedMobileColumnId === columnId;
  }

  // Filtros
  filterQuery: string = '';
  filterOnlyMine: boolean = false;
  filterTag: string | null = null;

  setTextFilter() {
    const value = prompt('Filtrar por palavra: (nome, contato, email...)', this.filterQuery || '');
    if (value !== null) {
      this.filterQuery = value.trim();
    }
  }

  toggleOnlyMine() {
    this.filterOnlyMine = !this.filterOnlyMine;
  }

  setTagFilter() {
    const value = prompt('Filtrar por etiqueta (tag):', this.filterTag || '');
    if (value !== null) {
      this.filterTag = value.trim() || null;
    }
  }

  clearFilters() {
    this.filterQuery = '';
    this.filterOnlyMine = false;
    this.filterTag = null;
  }

  private leadMatchesFilters(lead: Lead): boolean {
    // Only mine
    if (this.filterOnlyMine) {
      const me = this.currentUser?.email || this.currentUser?.uid;
      const owner = lead.responsibleUserEmail || (lead as any).responsibleUserId;
      if (me && owner && `${owner}`.toLowerCase() !== `${me}`.toLowerCase()) return false;
    }
    // Text query
    if (this.filterQuery) {
      const q = this.filterQuery.toLowerCase();
      const fields = (lead as any).fields || {};
      const haystack = [
        fields['companyName'], fields['contactName'], fields['contactEmail'], fields['contactPhone'],
        lead['responsibleUserName'], lead['responsibleUserEmail']
      ]
        .filter(Boolean)
        .map((v: any) => `${v}`.toLowerCase())
        .join(' ');
      if (!haystack.includes(q)) return false;
    }
    // Tag filter (supports fields.tags as array or comma-separated string)
    if (this.filterTag) {
      const fields = (lead as any).fields || {};
      const tags = (fields['tags'] || fields['etiquetas'] || []) as any;
      let list: string[] = [];
      if (Array.isArray(tags)) list = tags.map(t => `${t}`.toLowerCase());
      else if (typeof tags === 'string') list = tags.split(',').map(s => s.trim().toLowerCase());
      if (!list.includes(this.filterTag.toLowerCase())) return false;
    }
    return true;
  }

  // (mantido apenas a versão acima)

  // Métodos para Caixa de Saída
  updateEmailStatusCounts() {
    // Contar emails baseado na estrutura original: delivery.state
    const statusCounts = {
      all: this.outboxEmails.length,
      scheduled: this.outboxEmails.filter(email => !email.delivery || email.delivery.state === 'PENDING').length,
      success: this.outboxEmails.filter(email => email.delivery?.state === 'SUCCESS').length,
      error: this.outboxEmails.filter(email => email.delivery?.state === 'ERROR').length
    };

    this.emailStatuses = [
      { id: 'all', name: 'Todos', count: statusCounts.all },
      { id: 'scheduled', name: 'Na Fila', count: statusCounts.scheduled },
      { id: 'success', name: 'Enviados', count: statusCounts.success },
      { id: 'error', name: 'Com Erro', count: statusCounts.error }
    ];
  }

  getFilteredEmails(): any[] {
    if (this.activeEmailStatus === 'all') {
      return this.outboxEmails;
    }
    
    return this.outboxEmails.filter(email => {
      switch (this.activeEmailStatus) {
        case 'scheduled':
          return !email.delivery || email.delivery.state === 'PENDING';
        case 'success':
          return email.delivery?.state === 'SUCCESS';
        case 'error':
          return email.delivery?.state === 'ERROR';
        default:
          return false;
      }
    });
  }

  getEmailStatusLabel(email: any): string {
    if (!email.delivery) {
      return 'Na Fila';
    }
    
    switch (email.delivery.state) {
      case 'SUCCESS':
        return 'Enviado';
      case 'ERROR':
        return 'Erro';
      case 'PENDING':
        return 'Na Fila';
      default:
        return email.delivery.state || 'Desconhecido';
    }
  }

  viewEmail(email: any) {
    console.log('Visualizar email:', email);
    const sentAt = email.delivery?.endTime ? new Date(email.delivery.endTime.seconds * 1000).toLocaleString('pt-BR') : '---';
    const createdAt = email.createdAt ? new Date(email.createdAt.seconds * 1000).toLocaleString('pt-BR') : '---';
    
    alert(`Visualizar Email:\n\nPara: ${email.to || 'Não especificado'}\nAssunto: ${email.subject || 'Sem assunto'}\nStatus: ${this.getEmailStatusLabel(email)}\nCriado em: ${createdAt}\nEnviado em: ${sentAt}\n\nConteúdo:\n${email.html || email.text || 'Sem conteúdo disponível'}`);
  }

  async retryEmail(email: any) {
    try {
      await this.firestoreService.updateOutboxEmail(
        this.ownerId,
        this.boardId,
        email.id,
        { 
          status: 'scheduled',
          scheduledAt: new Date(),
          retryCount: (email.retryCount || 0) + 1
        }
      );
      console.log('Email reagendado para reenvio');
      try { this.toast.success('Email reagendado para reenvio.'); } catch {}
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      try { this.toast.error('Erro ao reenviar email. Tente novamente.'); } catch {}
    }
  }

  // Outbox delete confirmation modal
  showOutboxDeleteConfirm = false;
  emailPendingDelete: any = null;

  openOutboxDeleteConfirm(email: any, event?: Event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    this.emailPendingDelete = email;
    this.showOutboxDeleteConfirm = true;
  }

  cancelOutboxDelete() {
    this.showOutboxDeleteConfirm = false;
    this.emailPendingDelete = null;
  }

  async confirmOutboxDelete() {
    if (!this.emailPendingDelete) return;
    try {
      const email = this.emailPendingDelete;
      await this.firestoreService.deleteOutboxEmail(this.ownerId, this.boardId, email.id);
      console.log('Email excluído com sucesso');
      try { this.toast.success('Mensagem excluída.'); } catch {}
    } catch (error) {
      console.error('Erro ao excluir email:', error);
      try { this.toast.error('Erro ao excluir mensagem. Tente novamente.'); } catch {}
    } finally {
      this.cancelOutboxDelete();
    }
  }

  // Métodos para gerenciar colunas

  showCreateColumnModal() {
    this.columnModal.showCreateModal();
  }

  editColumn(column: Column) {
    this.columnModal.showEditModal(column);
  }

  onPhaseCardClick(phaseId: string, evt?: MouseEvent) {
    // Abrir edição da fase ao clicar no card do fluxo
    const col = this.getColumnById(phaseId);
    if (col) {
      this.editColumn(col);
    }
  }


  async deleteColumn(column: Column) {
    if (confirm(`Tem certeza que deseja excluir a fase "${column.name}"? Esta ação não pode ser desfeita.`)) {
      try {
        await this.firestoreService.deleteColumn(this.ownerId, this.boardId, column.id!);
        console.log('Fase excluída com sucesso');
      } catch (error) {
        console.error('Erro ao excluir fase:', error);
        alert('Erro ao excluir fase. Tente novamente.');
      }
    }
  }

  onColumnCreated() {
    console.log('Nova fase criada!');
  }

  onColumnUpdated() {
    console.log('Fase atualizada!');
  }

  onColumnDeleted() {
    console.log('Fase excluída!');
    // Após exclusão, sincronizar ordem do fluxo para refletir a mudança
    try { this.syncFlowOrderWithColumns(); this.updateFlowThumb(); } catch {}
  }

  async showColumnForm(column: Column) {
    try {
      const existingConfig = await this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, column.id!);
      this.phaseFormModal.showModal(column, existingConfig as any || undefined);
    } catch (error) {
      console.error('Erro ao carregar configuração do formulário:', error);
      this.phaseFormModal.showModal(column, undefined);
    }
  }

  onPhaseFormConfigSaved() {
    console.log('Configuração de formulário salva! Recarregando campos de card por fase...');
    this.loadCardFieldConfigs();
    try { this.toast.success('Configuração salva. Cards atualizados.'); } catch {}
  }


  // Métodos para SLA
  getSlaStatus(lead: Lead): { status: string; text: string; colorClass: string; borderClass: string } {
    const column = this.columns.find(col => col.id === lead.columnId);
    
    if (!column || !column.slaDays || column.slaDays <= 0 || !lead.movedToCurrentColumnAt) {
      return { status: 'none', text: '', colorClass: '', borderClass: '' };
    }

    const movedDate = lead.movedToCurrentColumnAt.seconds 
      ? new Date(lead.movedToCurrentColumnAt.seconds * 1000)
      : new Date(lead.movedToCurrentColumnAt);
    
    const now = new Date();
    const slaDeadline = new Date(movedDate.getTime() + column.slaDays * 24 * 60 * 60 * 1000);
    const diffMillis = slaDeadline.getTime() - now.getTime();
    const diffDays = diffMillis / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      // SLA vencido
      const overdueDays = Math.abs(Math.floor(diffDays));
      return {
        status: 'overdue',
        text: `Atrasado ${overdueDays}d`,
        colorClass: 'text-red-600',
        borderClass: 'border-l-red-500'
      };
    } else if (diffDays < column.slaDays * 0.25) {
      // SLA em risco (menos de 25% do tempo restante)
      const remainingHours = Math.ceil(diffMillis / (1000 * 60 * 60));
      return {
        status: 'at-risk',
        text: `${remainingHours}h restantes`,
        colorClass: 'text-yellow-600',
        borderClass: 'border-l-yellow-500'
      };
    } else {
      // SLA OK
      const remainingDays = Math.ceil(diffDays);
      return {
        status: 'ok',
        text: `${remainingDays}d restantes`,
        colorClass: 'text-green-600',
        borderClass: 'border-l-green-500'
      };
    }
  }

  getLeadStatusColor(lead: Lead): string {
    const temperature = lead.fields?.['temperature'];
    if (temperature === 'quente') return 'bg-red-100 text-red-800';
    if (temperature === 'morno') return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  }

  // Cor do ícone de temperatura para valores dinâmicos (ex.: 'Quente', 'Morno', 'Frio')
  getTemperatureColorClass(value: any): string {
    const norm = (v: string) => v
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const s = norm(String(value || ''));
    if (s.includes('quente') || s.includes('hot')) return 'text-red-600';
    if (s.includes('morno') || s.includes('morna') || s.includes('warm')) return 'text-yellow-600';
    if (s.includes('frio') || s.includes('fria') || s.includes('cold')) return 'text-blue-600';
    return 'text-blue-600';
  }

  // Helpers para layout mobile
  getDaysSince(dateLike: any): number {
    if (!dateLike) return 0;
    let d: Date;
    if ((dateLike as any).seconds) d = new Date((dateLike as any).seconds * 1000);
    else if ((dateLike as any).toDate) d = (dateLike as any).toDate();
    else if (dateLike instanceof Date) d = dateLike as Date;
    else d = new Date(dateLike);
    const diffMs = Date.now() - d.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  getLeadResponsibleName(lead: Lead): string {
    return (lead.responsibleUserName || lead.responsibleUserEmail || '').toString();
  }

  getLeadDueDateLabel(lead: Lead): string | null {
    const due = (lead as any).fields?.dueDate || (lead as any).dueDate;
    if (!due) return null;
    try {
      if ((due as any).seconds) return new Date((due as any).seconds * 1000).toLocaleDateString('pt-BR');
      if ((due as any).toDate) return (due as any).toDate().toLocaleDateString('pt-BR');
      const d = new Date(due);
      return isNaN(d.getTime()) ? null : d.toLocaleDateString('pt-BR');
    } catch { return null; }
  }

  // Métodos para Templates e Automações
  getTriggerDescription(automationOrTrigger: any): string {
    if (!automationOrTrigger) return 'Não especificado';

    // Aceita tanto o objeto automação completo quanto apenas o trigger
    const trigger = automationOrTrigger.trigger ? automationOrTrigger.trigger : automationOrTrigger;

    const descriptions: any = {
      'new-lead-created': 'Quando um novo lead é criado',
      'card-enters-phase': 'Quando lead entra em uma fase',
      'card-in-phase-for-time': 'Quando lead fica muito tempo na fase',
      'form-not-answered': 'Quando formulário não é respondido',
      'sla-overdue': 'Quando SLA da fase vence'
    };

    const type = trigger.type || automationOrTrigger.triggerType;
    let description = descriptions[type] || type || 'Não especificado';

    const phaseId = trigger.phase || automationOrTrigger.triggerPhase;
    if (phaseId && this.columns.length > 0) {
      const column = this.columns.find(col => col.id === phaseId);
      if (column) description += ` (${column.name})`;
    }

    const days = trigger.days || automationOrTrigger.triggerDays;
    if (days) description += ` (${days} dias)`;

    return description;
  }

  async toggleAutomationStatus(automationId: string, currentStatus: boolean) {
    try {
      await this.firestoreService.updateAutomation(
        this.ownerId, 
        this.boardId, 
        automationId, 
        { active: !currentStatus }
      );
      console.log('Status da automação alterado:', automationId);
    } catch (error) {
      console.error('Erro ao alterar status da automação:', error);
    }
  }

  // Modal de exclusão de automação
  showAutomationDeleteConfirm = false;
  automationPendingDelete: any = null;

  openDeleteAutomationConfirm(automation: any, event?: Event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    this.automationPendingDelete = automation;
    this.showAutomationDeleteConfirm = true;
  }

  cancelDeleteAutomation() {
    this.showAutomationDeleteConfirm = false;
    this.automationPendingDelete = null;
  }

  async confirmDeleteAutomation() {
    if (!this.automationPendingDelete) return;
    try {
      const pending = this.automationPendingDelete as any;
      const autoId = pending?.id || pending?.docId || (pending?.path ? String(pending.path).split('/').pop() : null);
      if (!autoId) {
        console.error('Automação sem id para exclusão:', pending);
        this.toast.error('Não foi possível identificar esta automação. Atualize a página e tente novamente.');
        return;
      }
      await this.firestoreService.deleteAutomation(this.ownerId, this.boardId, autoId);
      this.toast.success('Automação excluída.');
    } catch (error) {
      console.error('Erro ao excluir automação:', error);
      this.toast.error('Erro ao excluir automação.');
    } finally {
      this.cancelDeleteAutomation();
    }
  }


  toggleAutomation(automation: any) {
    this.toggleAutomationStatus(automation.id, automation.active);
  }


  getActionsCount(actions: any[]): number {
    return actions ? actions.length : 0;
  }

  getValidAutomations(): any[] {
    return this.automations.filter(automation => 
      automation && 
      automation.name && 
      automation.name.trim() !== '' &&
      automation.name !== 'Automação sem nome'
    );
  }

  async cleanupInvalidAutomations() {
    const invalidAutomations = this.automations.filter(automation => 
      !automation || 
      !automation.name || 
      automation.name.trim() === '' ||
      automation.name === 'Automação sem nome'
    );

    if (invalidAutomations.length > 0) {
      console.log('Encontradas automações inválidas, removendo:', invalidAutomations);
      
      for (const invalidAutomation of invalidAutomations) {
        if (invalidAutomation.id) {
          try {
            await this.firestoreService.deleteAutomation(this.ownerId, this.boardId, invalidAutomation.id);
            console.log('Automação inválida removida:', invalidAutomation.id);
          } catch (error) {
            console.error('Erro ao remover automação inválida:', error);
          }
        }
      }
    }
  }

  // Métodos para Templates
  createTemplate() {
    this.templateModal.showCreateModal();
  }

  editTemplate(template: any) {
    this.templateModal.showEditModal(template);
  }

  async deleteTemplate(template: any) {
    if (confirm('Tem certeza que deseja excluir este template?')) {
      try {
        await this.firestoreService.deleteEmailTemplate(this.ownerId, this.boardId, template.id);
        console.log('Template excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir template:', error);
      }
    }
  }

  onTemplateSaved() {
    // Template foi salvo ou modal foi fechado - não precisa fazer nada
    // O modal já se fechou internamente
  }

  // Variáveis para o modal de automação
  showAutomationModal = false;
  selectedAutomation: any = null;

  // Variáveis para o modal de histórico
  showHistoryModal = false;
  selectedAutomationForHistory: any = null;

  // Métodos para Automações
  createAutomation(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('=== BOTÃO NOVA AUTOMAÇÃO CLICADO ===');
    
    this.selectedAutomation = null;
    this.showAutomationModal = true;
  }

  editAutomation(automation: any, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('=== EDITAR AUTOMAÇÃO ===', automation);
    
    // Passar cópia profunda para evitar duplicação/efeitos colaterais no array
    this.selectedAutomation = JSON.parse(JSON.stringify(automation));
    this.showAutomationModal = true;
  }

  onCloseAutomationModal() {
    this.showAutomationModal = false;
    this.selectedAutomation = null;
  }

  async onSaveAutomation(automationData: any) {
    try {
      // Sanitizar payload: remover id e campos undefined
      const sanitize = (obj: any) => {
        const out: any = {};
        Object.keys(obj || {}).forEach(k => {
          const v = (obj as any)[k];
          if (v !== undefined) out[k] = v;
        });
        return out;
      };
      const payload: any = sanitize({ ...automationData });
      delete payload.id;
      if (Array.isArray(payload.actions)) {
        payload.actions = payload.actions.map((a: any) => sanitize(a));
      }

      if (automationData.id) {
        // Editando automação existente
        await this.firestoreService.updateAutomation(this.ownerId, this.boardId, automationData.id, payload);
        console.log('Automação atualizada com sucesso:', automationData.name);
      } else {
        // Criando nova automação
        await this.firestoreService.createAutomation(this.ownerId, this.boardId, payload);
        console.log('Automação criada com sucesso:', automationData.name);
      }
      this.toast.success('Automação salva com sucesso.');
      this.onCloseAutomationModal();
    } catch (error) {
      console.error('Erro ao salvar automação:', error);
      this.toast.error('Erro ao salvar automação. Tente novamente.');
    }
  }

  showAutomationHistory(automation: any, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('=== MOSTRAR HISTÓRICO DE AUTOMAÇÃO ===', automation);
    
    this.selectedAutomationForHistory = automation;
    this.showHistoryModal = true;
  }

  onCloseHistoryModal() {
    this.showHistoryModal = false;
    this.selectedAutomationForHistory = null;
  }

  // Outbox Methods
  async clearOutbox() {
    if (confirm('Deseja excluir todos os emails da caixa de saída? Esta ação não pode ser desfeita.')) {
      try {
        // Buscar e excluir todos os emails do outbox
        await this.firestoreService.clearOutboxEmails(this.ownerId, this.boardId);
        console.log('✅ Caixa de saída limpa com sucesso');
      } catch (error) {
        console.error('❌ Erro ao limpar caixa de saída:', error);
        alert('Erro ao limpar caixa de saída. Tente novamente.');
      }
    }
  }

  // API Methods
  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Texto copiado:', text);
      // Aqui você pode adicionar uma notificação de sucesso se quiser
    }).catch(err => {
      console.error('Erro ao copiar texto:', err);
    });
  }
}

