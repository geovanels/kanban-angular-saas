import { Component, inject, OnInit, OnDestroy, ViewChild, HostListener, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Board, Column, Lead } from '../../services/firestore.service';
import { SubdomainService } from '../../services/subdomain.service';
import { CompanyService } from '../../services/company.service';
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
import { ReportsComponent } from '../reports/reports.component';
import { AdvancedFiltersComponent } from '../advanced-filters/advanced-filters.component';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, LeadModalComponent, ColumnModalComponent, PhaseFormModalComponent, LeadDetailModalComponent, TemplateModalComponent, AutomationModal, AutomationHistoryModal, MainLayoutComponent, VisualFormBuilderComponent, ReportsComponent],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private subdomainService = inject(SubdomainService);
  private companyService = inject(CompanyService);
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
  @ViewChild('kanbanBoard') kanbanBoardRef!: ElementRef<HTMLDivElement>;
  flowThumbPercent = 10;
  flowThumbLeftPercent = 0;
  private isDraggingFlowBar = false;
  private isManualReorder = false;

  // Drag to scroll
  private isDraggingScroll = false;
  private scrollStartX = 0;
  private scrollStartY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;

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
    
    
    // Definir contexto da empresa no FirestoreService
    const company = this.subdomainService.getCurrentCompany();
    if (company) {
      this.firestoreService.setCompanyContext(company);
    } else {
      console.warn('Empresa não encontrada no contexto');
    }
    
    if (this.currentUser && this.boardId && this.ownerId) {
      // Load saved filters first
      this.loadFilterState();
      this.loadBoardData();
      this.subscribeToRealtimeUpdates();
      this.initializeApiEndpoint();
      // Carregar formulário inicial do board
      this.loadInitialForm();
      // Carregar fluxo de transições
      this.loadFlowConfig();

      // Inicializar monitor global de automações para leads da API
      console.log(`🚀 Iniciando monitor global de automações para board ${this.boardId}`);
      this.automationService.initializeGlobalLeadMonitor(this.boardId, this.ownerId);
      // Agendador periódico para automações de tempo (a cada 60s)
      // Apenas uma instância por board deve executar as automações
      try {
        this.timeAutomationIntervalId = setInterval(async () => {
          try {
            // Só executar se tiver leads carregados e dados válidos
            if (this.leads && this.leads.length > 0 && this.columns && this.columns.length > 0) {
              await this.automationService.processTimeBasedAutomations(this.leads, this.columns, this.boardId, this.ownerId);
            }
          } catch (error) {
            console.warn('Erro nas automações de tempo:', error);
          }
        }, 60000);
      } catch (error) {
        console.error('Erro ao configurar automações de tempo:', error);
      }
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

    // Parar monitor global de automações
    if (this.boardId && this.ownerId) {
      this.automationService.stopGlobalLeadMonitor(this.boardId, this.ownerId);
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
      
      // Testar estrutura atual
      const templates = await this.firestoreService.getEmailTemplates(this.ownerId, this.boardId);
      
      const automations = await this.firestoreService.getAutomations(this.ownerId, this.boardId);

      // Testar estrutura alternativa - talvez os dados estejam direto na coleção boards/{boardId}/
      try {
        const alternativeTemplates = await this.firestoreService.getEmailTemplates('', this.boardId);
      } catch (error) {
      }

      // Debug removal - method was removed
      
    } catch (error) {
      console.error('Erro no debug das coleções:', error);
    }
  }

  private async loadUsers() {
    try {
      const company = this.subdomainService.getCurrentCompany();
      if (!company || !company.id) {
        console.warn('Empresa não encontrada para carregar usuários');
        this.users = [];
        return;
      }

      // Carregar usuários reais da empresa
      const companyUsers = await this.companyService.getAllCompanyUsers(company.id);
      
      // Filtrar apenas usuários ativos
      this.users = companyUsers
        .filter(user => !user.inviteStatus || user.inviteStatus === 'accepted')
        .map(user => ({
          uid: user.uid,
          displayName: user.displayName || this.extractNameFromEmail(user.email),
          email: user.email
        }));

      console.log('Usuários carregados:', this.users.length);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      // Fallback para usuário atual se houver erro
      this.users = [
        {
          uid: this.currentUser?.uid,
          displayName: this.currentUser?.displayName,
          email: this.currentUser?.email
        }
      ];
    }
  }

  private extractNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];
    return localPart
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private subscribeToRealtimeUpdates() {
    
    // Subscrever colunas
    const columnsUnsub = this.firestoreService.subscribeToColumns(
      this.ownerId,
      this.boardId,
      (columns) => {
        this.columns = columns;
        this.loadCardFieldConfigs();
        // Carregar configurações de formulários de todas as fases
        this.loadAllPhaseFormConfigs();
        // Sincronizar editor de fluxo: garantir que novas fases entrem na ordem
        try { 
          // Sync flow order with columns
          this.syncFlowOrderWithColumns(); 
        } catch {}
      }
    );
    this.subscriptions.push({ unsubscribe: columnsUnsub } as Subscription);

    // Subscrever leads
    const leadsUnsub = this.firestoreService.subscribeToLeads(
      this.ownerId,
      this.boardId,
      async (leads) => {
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
        this.emailTemplates = templates;
      }
    );
    this.subscriptions.push({ unsubscribe: templatesUnsub } as Subscription);

    // Subscrever automações
    
    const automationsUnsub = this.firestoreService.subscribeToAutomations(
      this.ownerId,
      this.boardId,
      (automations) => {
        
        if (automations && automations.length > 0) {
        } else {
        }
        
        // Atribuir as automações (mesmo se for array vazio)
        this.automations = automations || [];
        
        // Limpar automações inválidas se existirem
        this.cleanupInvalidAutomations();
        
        // Automações carregadas do banco de dados
        
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
          const filteredFields = fields.filter((f: any) => !!f?.showInCard || !!f?.showInAllPhases);
          map[col.id!] = filteredFields.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        } catch (error) {
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

  async loadAllPhaseFormConfigs() {
    for (const column of this.columns) {
      try {
        const config = await this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, column.id!);
        if (config?.fields) {
          this.phaseFormConfigs[column.id!] = config;
        }
      } catch (e) {
        // Ignorar erro se não houver configuração para esta fase
      }
    }
    
    // Recarregar campos disponíveis para filtro após carregar configurações de fases
    this.loadAvailableFilterFields();
  }

  getAllFieldsForDisplay(): any[] {
    const initialFields: any[] = [];
    const phaseFields: any[] = [];
    
    // 1. Campos do formulário inicial (aparecem primeiro)
    (this.initialFormFields || []).forEach(f => {
      const showInCard = f?.showInCard;
      const showInAllPhases = f?.showInAllPhases;
      
      // Filtrar nameContact e emailContact que podem ter valores antigos no banco
      if (f.name === 'nameContact' || f.name === 'emailContact') {
        return;
      }
      
      if (showInCard === true || showInAllPhases === true) {
        initialFields.push(f);
      }
    });
    
    // 2. Campos de configurações de fases (aparecem depois)
    Object.values(this.phaseFormConfigs).forEach((config: any) => {
      if (config?.fields) {
        config.fields.forEach((f: any) => {
          if (f?.showInAllPhases === true) {
            phaseFields.push(f);
          }
        });
      }
    });
    
    // 3. Remover duplicatas (manter a primeira ocorrência)
    const allFields = [...initialFields, ...phaseFields];
    const uniqueFields = allFields.filter((field, index, array) => 
      array.findIndex(f => f.name === field.name) === index
    );
    
    return uniqueFields;
  }

  getCardFieldsForLead(lead: Lead): Array<{ label: string; value: any; type?: string }> {
    // NOVA SOLUÇÃO: Buscar campos globais + campos específicos da fase atual
    const allFieldsForDisplay = this.getAllFieldsForDisplay();
    
    // Adicionar campos específicos da fase atual com showInCard
    const currentPhaseFields: any[] = [];
    if (lead.columnId && this.phaseFormConfigs[lead.columnId]) {
      const phaseConfig = this.phaseFormConfigs[lead.columnId];
      if (phaseConfig?.fields) {
        phaseConfig.fields.forEach((f: any) => {
          if (f?.showInCard === true) {
            currentPhaseFields.push(f);
          }
        });
      }
    }
    
    // Combinar campos globais e da fase atual
    const allFields = [...allFieldsForDisplay, ...currentPhaseFields];
    
    // Remover duplicatas (manter a primeira ocorrência)
    const uniqueFields = allFields.filter((field, index, array) => 
      array.findIndex(f => f.name === field.name) === index
    );
    
    const fieldsToShow = uniqueFields.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));


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
    
    for (const f of fieldsToShow) {
      const isTitle = isTitleField(f);
      const value = this.readFieldValue(lead, f.apiFieldName || f.name, f.label || f.name);
      const hasValue = value !== undefined && value !== null && `${value}`.trim() !== '';
      
      if (!isTitle && hasValue) {
        const item = { label: f.label || f.name || f.apiFieldName, value, type: (f.type || '').toLowerCase() };
        out.push(item);
      }
    }
    return out;
  }

  // Exibir temperatura em todas as fases quando marcada em qualquer config
  getTemperatureGlobalItem(lead: Lead): { label: string; value: any } | null {
    try {
      // Buscar campo temperatura em TODAS as configurações possíveis
      const allSources = [
        // Campos do formulário inicial
        ...(this.initialFormFields || []),
        // Campos da fase atual
        ...(this.phaseCardFields[lead.columnId] || [])
      ];
      
      // Adicionar campos de todas as outras fases que têm showInAllPhases
      Object.values(this.phaseFormConfigs).forEach((config: any) => {
        if (config?.fields) {
          config.fields.forEach((f: any) => {
            if (f?.showInAllPhases === true) {
              allSources.push(f);
            }
          });
        }
      });
      
      
      const tempField = (allSources as any[]).find(f => {
        const isTemperatura = (f.type || '').toLowerCase() === 'temperatura';
        const hasVisibilityFlag = f.showInCard || f.showInAllPhases;
        return isTemperatura && hasVisibilityFlag;
      });
      
      if (!tempField) {
        return null;
      }
      
      
      const val = this.readFieldValue(lead, tempField.apiFieldName || tempField.name, tempField.label || tempField.name);
      if (val === undefined || val === null || `${val}`.trim() === '') {
        return null;
      }
      
      const result = { label: tempField.label || 'Temperatura', value: val };
      return result;
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
  phaseFormConfigs: {[key: string]: any} = {};
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
      // Sempre sincronizar com a ordem atual das colunas do banco
      const currentColumnOrder = [...this.columns].sort((a,b)=>(a.order||0)-(b.order||0)).map(c=>c.id!);
      
      // Checking flow initialization
      
      // Não sobrescrever flowOrder durante reordenação manual
      if (!this.isManualReorder) {
        this.flowOrder = currentColumnOrder;
      } else {
      }
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
      // Não sobrescrever flowOrder durante reordenação manual
      if (!this.isManualReorder) {
        this.flowOrder = [...this.columns].sort((a,b)=>(a.order||0)-(b.order||0)).map(c=>c.id!);
      }
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

  // Novo método para salvar o estado atual das conexões (sem reconstruir)
  async saveCurrentFlowConfig() {
    try {
      console.log('💾 Salvando configuração atual do fluxo:', {
        allowed: this.flowConfig.allowed,
        order: this.flowOrder
      });

      // Sanitizar IDs e validar
      const normalizeId = (v: any) => (typeof v === 'string' ? v.trim() : String(v || '').trim());
      const validIds = new Set(this.columns.map(c => c.id));
      
      // Limpar conexões inválidas
      const cleanedAllowed: Record<string, string[]> = {};
      Object.entries(this.flowConfig.allowed || {}).forEach(([fromId, toIds]) => {
        const cleanFromId = normalizeId(fromId);
        if (validIds.has(cleanFromId)) {
          cleanedAllowed[cleanFromId] = (toIds || [])
            .map(id => normalizeId(id))
            .filter(id => validIds.has(id));
        }
      });

      const orderClean = (this.flowOrder || []).map(normalizeId).filter(id => validIds.has(id));

      // Salvar no banco
      await this.firestoreService.saveFlowConfig(this.boardId, { 
        allowed: cleanedAllowed, 
        order: orderClean 
      });
      
      console.log('✅ Configuração do fluxo salva com sucesso');
      
    } catch (error: any) {
      console.error('❌ Erro ao salvar configuração do fluxo:', error);
      throw error; // Re-throw para que as funções chamadoras possam tratar
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

  async onFlowDropToAllowed(fromId: string, event: CdkDragDrop<Column[]>) {
    const dropped: Column = event.item.data as Column;
    const list = this.flowConfig.allowed[fromId] || (this.flowConfig.allowed[fromId] = []);
    
    if (!list.includes(dropped.id!)) {
      console.log('➕ Adicionando conexão:', {
        from: this.getColumnById(fromId)?.name,
        to: dropped.name,
        beforeAdd: [...list]
      });
      
      list.push(dropped.id!);
      
      console.log('➕ Após adição:', {
        newList: [...list]
      });
      
      // Salvar a configuração após adicionar
      try {
        await this.saveCurrentFlowConfig();
        console.log('✅ Configuração salva após adição da conexão');
      } catch (error) {
        console.error('❌ Erro ao salvar configuração após adição:', error);
      }
    }
  }

  async onFlowDropToAvailable(fromId: string, event: CdkDragDrop<Column[]>) {
    const dropped: Column = event.item.data as Column;
    const list = this.flowConfig.allowed[fromId] || [];
    
    console.log('🗑️ Removendo conexão:', {
      from: this.getColumnById(fromId)?.name,
      to: dropped.name,
      beforeRemoval: [...list],
      droppedId: dropped.id
    });
    
    this.flowConfig.allowed[fromId] = list.filter(id => id !== dropped.id);
    
    console.log('🗑️ Após remoção:', {
      newList: [...this.flowConfig.allowed[fromId]]
    });
    
    // Salvar a configuração após remover
    try {
      await this.saveCurrentFlowConfig();
      console.log('✅ Configuração salva após remoção da conexão');
    } catch (error) {
      console.error('❌ Erro ao salvar configuração após remoção:', error);
    }
  }

  // Reordenação horizontal dos cartões de fases no editor de fluxo
  async onFlowReorder(event: CdkDragDrop<string[]>) {
    console.log('🎯 onFlowReorder CHAMADO!', {
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
      isEqual: event.previousIndex === event.currentIndex,
      movedPhaseId: this.flowOrder[event.previousIndex],
      allPhases: this.flowOrder.map((id, index) => ({ index, id, name: this.getColumnById(id)?.name })),
      containerData: event.container.data,
      previousContainer: event.previousContainer.data
    });
    
    if (event.previousIndex === event.currentIndex) {
      console.log('❌ onFlowReorder - Movimento aparentemente para o mesmo índice');
      console.log('⚠️ Vamos investigar se realmente é o mesmo local...');
      
      // Verificar se há diferença real nos dados do container
      const containerIds = event.container.data;
      const previousContainerIds = event.previousContainer.data;
      
      console.log('🔍 Container atual:', containerIds);
      console.log('🔍 Container anterior:', previousContainerIds);
      console.log('🔍 Fases com nomes:', containerIds.map((id, index) => `${index}: ${this.getColumnById(id)?.name}`));
      
      // Se os containers são diferentes ou se há mudança real, continuar
      if (event.container !== event.previousContainer || 
          JSON.stringify(containerIds) !== JSON.stringify(previousContainerIds)) {
        console.log('✅ Detectada mudança real, continuando reordenação...');
      } else {
        console.log('❌ Nenhuma mudança real detectada');
        console.log('💡 Tentativa: Vou tentar forçar o movimento manualmente...');
        
        // Tentar detectar se há intenção de movimento baseado no local do mouse
        // Se o usuário arrastou para uma posição diferente, vamos tentar processar
        console.log('⚠️ FORÇANDO movimento para testar...');
        // Não retornar aqui, deixar continuar para testar
      }
    }
    
    // Sinalizar que estamos fazendo reordenação manual
    this.isManualReorder = true;
    
    console.log('🔄 Flow Reorder - Iniciando reordenação', {
      from: event.previousIndex,
      to: event.currentIndex,
      previousOrder: [...this.flowOrder],
      movedColumnId: this.flowOrder[event.previousIndex],
      targetPosition: event.currentIndex
    });
    
    // Criar uma cópia para comparação
    const originalOrder = [...this.flowOrder];
    
    // Atualizar ordem local
    moveItemInArray(this.flowOrder, event.previousIndex, event.currentIndex);
    
    console.log('🔄 Flow Reorder - flowOrder imediatamente após moveItemInArray:', [...this.flowOrder]);
    
    // Forçar detecção de mudanças para atualizar DOM
    this.cdr.detectChanges();
    console.log('🔄 Flow Reorder - DOM atualizado, ordem visual deve refletir:', [...this.flowOrder]);
    
    console.log('🔄 Flow Reorder - Nova ordem local:', {
      newOrder: [...this.flowOrder],
      changes: this.flowOrder.map((id, index) => {
        const originalIndex = originalOrder.indexOf(id);
        return { id, from: originalIndex, to: index, changed: originalIndex !== index };
      })
    });
    
    try {
      // Persistir nova ordem no banco de dados - atualizar TODOS os índices
      const updatePromises = this.flowOrder.map(async (columnId, newIndex) => {
        const column = this.columns.find(c => c.id === columnId);
        const originalIndex = originalOrder.indexOf(columnId);
        
        if (column && originalIndex !== newIndex) {
          console.log(`🔄 Atualizando coluna "${column.name}" - posição: ${originalIndex} → ${newIndex}`);
          await this.firestoreService.updateColumn(this.ownerId, this.boardId, columnId, { order: newIndex });
          // Atualizar também o objeto local
          column.order = newIndex;
        }
      });
      
      await Promise.all(updatePromises);
      
      // Reordenar array de colunas localmente para manter consistência
      this.columns.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      console.log('✅ Flow Reorder - Reordenação salva com sucesso', {
        finalOrder: this.columns.map(c => ({ id: c.id, name: c.name, order: c.order }))
      });
      
      console.log('✅ Flow Reorder - Aguardando para resetar flag isManualReorder');
      // Aguardar menos tempo para permitir que subscriptions sejam processadas
      setTimeout(() => {
        console.log('🔄 Flow Reorder - Resetando flag isManualReorder para false');
        this.isManualReorder = false;
      }, 500);
      
    } catch (error) {
      console.error('❌ Flow Reorder - Erro ao salvar nova ordem:', error);
      
      // Reverter mudanças locais em caso de erro
      this.flowOrder = originalOrder;
      this.isManualReorder = false;
      
      // Mostrar erro para o usuário
      alert('Erro ao reordenar fases. Tente novamente.');
    }
  }

  private syncFlowOrderWithColumns() {
    // Não interferir durante reordenação manual
    if (this.isManualReorder) {
      console.log('🔄 syncFlowOrderWithColumns - Pulando sincronização durante reordenação manual');
      return;
    }
    
    const sortedIds = [...this.columns].sort((a,b)=>(a.order||0)-(b.order||0)).map(c=>c.id!);
    
    // Checking synchronization
    
    if (!Array.isArray(this.flowOrder) || this.flowOrder.length === 0) {
      this.flowOrder = sortedIds;
      return;
    }
    
    // Verificar se flowOrder está sincronizado com a ordem atual das colunas
    const flowOrderMatchesColumnOrder = this.flowOrder.every((id, index) => sortedIds[index] === id);
    
    if (flowOrderMatchesColumnOrder) {
      console.log('🔄 syncFlowOrderWithColumns - FlowOrder já está sincronizado, não alterando');
      return;
    }
    
    // Apenas adicionar novas fases ou remover fases deletadas, preservando ordem existente
    const existing = new Set(this.flowOrder);
    const validIds = new Set(sortedIds);
    
    // Remover fases que foram apagadas
    this.flowOrder = this.flowOrder.filter(id => validIds.has(id));
    
    // Inserir novas fases que não estão na ordem ainda (no final)
    for (const id of sortedIds) {
      if (!existing.has(id)) {
        const phaseName = this.getColumnById(id)?.name || 'Nome não encontrado';
        this.flowOrder.push(id);
        console.log(`🔄 syncFlowOrderWithColumns - Adicionada nova fase: ${id} (${phaseName})`);
      }
    }
    
    // Forçar atualização visual se houve mudanças
    if (this.flowOrder.length !== existing.size) {
      console.log('🔄 syncFlowOrderWithColumns - Forçando atualização visual após mudanças');
      this.cdr.detectChanges();
    }
    
    console.log('🔄 syncFlowOrderWithColumns - Sincronização concluída', {
      finalFlowOrder: [...this.flowOrder]
    });
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
    const base = ['new-lead-created', 'card-enters-phase', 'card-in-phase-for-time', 'form-not-answered', 'form-answered', 'sla-overdue'];
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
      
      this.initialFormFields = (cfg as any)?.fields || [];
      
      // Process loaded fields
      
      // Verificar especificamente por campos de temperatura
      const tempFields = this.initialFormFields.filter(f => f.type === 'temperatura' || f.name?.toLowerCase().includes('temp'));
      
      this.buildApiExampleFromFields();
      
      // Carregar campos disponíveis para filtro
      this.loadAvailableFilterFields();
    } catch (error) {
      this.initialFormFields = [];
      this.buildApiExampleFromFields();
    }
  }

  async saveInitialForm() {
    try {
      console.log('💾 saveInitialForm INICIADO');
      console.log('💾 this.initialFormFields antes de salvar:', this.initialFormFields);
      
      // Log detalhado de cada campo que será salvo
      this.initialFormFields?.forEach((field, index) => {
        console.log(`💾 Campo ${index + 1} a ser salvo:`, {
          name: field.name,
          type: field.type,
          showInFilters: field.showInFilters,
          hasShowInFilters: 'showInFilters' in field,
          completeField: field
        });
      });
      
      const dataToSave = { fields: this.initialFormFields };
      console.log('💾 Dados que serão enviados ao Firestore:', dataToSave);
      
      await this.firestoreService.saveInitialFormConfig(this.boardId, dataToSave);
      
      // Recarregar campos disponíveis para filtro após salvar
      console.log('💾 Recarregando filtros após salvar formulário inicial...');
      this.loadAvailableFilterFields();
      
      this.toast.success('Formulário inicial salvo.');
    } catch (error) {
      console.error('💾 saveInitialForm ERRO:', error);
      this.toast.error('Erro ao salvar formulário inicial.');
    }
  }

  onInitialFieldsChanged(fields: any[]) {
    console.log('🔄 onInitialFieldsChanged CHAMADO com:', fields);
    
    // Log detalhado de cada campo recebido
    fields.forEach((field, index) => {
      console.log(`🔄 Campo recebido ${index + 1}:`, {
        name: field.name,
        label: field.label,
        type: field.type,
        showInFilters: field.showInFilters,
        completeField: field
      });
    });
    
    this.initialFormFields = fields;
    
    // Recarregar filtros quando campos mudam
    console.log('🔄 Recarregando filtros após mudança de campos...');
    this.loadAvailableFilterFields();
    
    this.buildApiExampleFromFields();
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
  // Novos filtros dinâmicos baseados em campos do formulário
  dynamicFilters: Record<string, any> = {};
  availableFilterFields: any[] = [];
  showAdvancedFilters: boolean = false;


  toggleOnlyMine() {
    this.filterOnlyMine = !this.filterOnlyMine;
    this.applyFilters();
  }

  clearFilters() {
    this.filterQuery = '';
    this.filterOnlyMine = false;
    this.dynamicFilters = {};
    this.applyFilters();
  }

  // Migrar campos existentes para incluir showInFilters
  private migrateFieldsToIncludeShowInFilters() {
    
    // Migrar campos do formulário inicial
    if (this.initialFormFields) {
      let needsMigration = false;
      this.initialFormFields.forEach(field => {
        if (!('showInFilters' in field)) {
          field.showInFilters = false;
          needsMigration = true;
          console.log(`🔧 Adicionado showInFilters: false ao campo ${field.name} (campo antigo)`);
        } else {
        }
      });
      
      if (needsMigration) {
        console.log('🔧 Alguns campos do formulário inicial foram migrados em memória');
      } else {
      }
    }
    
    // Migrar campos das fases
    Object.entries(this.phaseFormConfigs || {}).forEach(([phaseId, config]: [string, any]) => {
      if (config?.fields) {
        let needsMigration = false;
        config.fields.forEach((field: any) => {
          if (!('showInFilters' in field)) {
            field.showInFilters = false;
            needsMigration = true;
            console.log(`🔧 Adicionado showInFilters: false ao campo ${field.name} da fase ${phaseId} (campo antigo)`);
          } else {
            console.log(`✅ Campo ${field.name} da fase ${phaseId} já tem showInFilters: ${field.showInFilters}`);
          }
        });
        
        if (needsMigration) {
          console.log(`🔧 Alguns campos da fase ${phaseId} foram migrados em memória`);
        } else {
          console.log(`✅ Todos os campos da fase ${phaseId} já têm showInFilters`);
        }
      }
    });
  }

  // Carregar campos disponíveis para filtro
  private loadAvailableFilterFields() {
    
    // Executar migração primeiro
    this.migrateFieldsToIncludeShowInFilters();
    
    const allFields: any[] = [];
    
    // Adicionar campos do formulário inicial que têm showInFilters = true
    if (this.initialFormFields) {
      this.initialFormFields.forEach((field, index) => {
        
        if (field.name && field.type && field.showInFilters) {
          const filterField = {
            name: field.name,
            label: field.label || field.name,
            type: field.type,
            source: 'initial'
          };
          allFields.push(filterField);
        } else {
        }
      });
    } else {
      console.log('⚠️ Nenhum initialFormFields encontrado');
    }
    
    // Adicionar campos de fases que têm showInFilters = true
    Object.entries(this.phaseFormConfigs || {}).forEach(([phaseId, config]: [string, any]) => {
      if (config?.fields) {
        config.fields.forEach((field: any, index: number) => {
          
          if (field.name && field.type && field.showInFilters && !allFields.find(f => f.name === field.name)) {
            const filterField = {
              name: field.name,
              label: field.label || field.name,
              type: field.type,
              source: 'phase',
              phaseId: phaseId
            };
            allFields.push(filterField);
          } else {
          }
        });
      }
    });
    
    
    // Filtrar apenas campos apropriados para filtro
    this.availableFilterFields = allFields.filter(field => {
      const supportedTypes = ['text', 'email', 'select', 'radio', 'checkbox', 'date', 'number', 'tel', 'cnpj', 'cpf', 'temperatura'];
      const isSupported = supportedTypes.includes(field.type.toLowerCase());
      return isSupported;
    });
    
  }

  // Obter opções disponíveis para um campo
  getFieldOptions(field: any): string[] {
    // Para campos select, radio e temperatura, verificar se há opções definidas
    if (field.type === 'select' || field.type === 'radio') {
      // Buscar o campo original para obter as opções
      const originalField = this.findOriginalField(field.name, field.source);
      if (originalField && originalField.options && Array.isArray(originalField.options)) {
        return originalField.options;
      }
    }
    
    // Para temperatura, sempre retornar as opções padrão se não encontrar definidas
    if (field.type === 'temperatura') {
      const originalField = this.findOriginalField(field.name, field.source);
      if (originalField && originalField.options && Array.isArray(originalField.options)) {
        return originalField.options;
      }
      // Opções padrão para temperatura
      return ['Quente', 'Morno', 'Frio'];
    }
    
    // Para outros tipos, buscar valores únicos nos leads existentes
    return this.getUniqueValuesFromLeads(field.name);
  }

  // Encontrar campo original baseado no nome e fonte
  private findOriginalField(fieldName: string, source: string): any {
    if (source === 'initial') {
      return this.initialFormFields?.find(f => f.name === fieldName);
    } else if (source === 'phase') {
      // Buscar em todas as fases
      for (const config of Object.values(this.phaseFormConfigs || {})) {
        const field = (config as any)?.fields?.find((f: any) => f.name === fieldName);
        if (field) return field;
      }
    }
    return null;
  }

  // Buscar valores únicos de um campo nos leads
  private getUniqueValuesFromLeads(fieldName: string): string[] {
    const values = new Set<string>();
    
    this.leads.forEach(lead => {
      const value = this.getLeadFieldValue(lead, fieldName);
      if (value != null && value !== '') {
        values.add(String(value));
      }
    });
    
    return Array.from(values).sort();
  }

  private leadMatchesFilters(lead: Lead): boolean {
    // Only mine filter
    if (this.filterOnlyMine) {
      const currentUserEmail = this.currentUser?.email;
      const currentUserId = this.currentUser?.uid;
      const leadResponsibleEmail = lead.responsibleUserEmail;
      const leadResponsibleId = (lead as any).responsibleUserId;
      
      // Check if lead is assigned to current user by email or ID
      const isAssignedToMe = 
        (currentUserEmail && leadResponsibleEmail && leadResponsibleEmail.toLowerCase() === currentUserEmail.toLowerCase()) ||
        (currentUserId && leadResponsibleId && leadResponsibleId === currentUserId);
      
      if (!isAssignedToMe) return false;
    }
    
    // Text query filter
    if (this.filterQuery && this.filterQuery.trim()) {
      const q = this.filterQuery.toLowerCase().trim();
      const fields = (lead as any).fields || {};
      
      // Build searchable text from all relevant fields
      const searchableFields = [
        // Fixed lead properties
        lead.responsibleUserName,
        lead.responsibleUserEmail
      ];
      
      // Add all dynamic field values from lead.fields
      if (fields && typeof fields === 'object') {
        Object.values(fields).forEach(value => {
          if (value != null && value !== '') {
            searchableFields.push(String(value));
          }
        });
      }
      
      // Also search in phaseHistory if exists
      if (lead.phaseHistory && typeof lead.phaseHistory === 'object') {
        Object.values(lead.phaseHistory).forEach(phaseData => {
          if (phaseData && typeof phaseData === 'object') {
            Object.values(phaseData).forEach(value => {
              if (value != null && value !== '') {
                searchableFields.push(String(value));
              }
            });
          }
        });
      }
      
      const haystack = searchableFields
        .filter(field => field != null && field !== '')
        .map(field => String(field).toLowerCase())
        .join(' ');
      
      // Split query into words for better matching
      const queryWords = q.split(' ').filter(word => word.length > 0);
      const matchesAll = queryWords.every(word => haystack.includes(word));
      
      if (!matchesAll) return false;
    }
    
    
    // Filtros dinâmicos baseados em campos do formulário
    for (const [fieldName, filterValue] of Object.entries(this.dynamicFilters)) {
      if (!filterValue || filterValue === '') continue;
      
      const leadValue = this.getLeadFieldValue(lead, fieldName);
      
      // Se o lead não tem o campo, excluir do resultado
      if (leadValue === undefined || leadValue === null || leadValue === '') {
        return false;
      }
      
      const field = this.availableFilterFields.find(f => f.name === fieldName);
      if (!field) continue;
      
      // Aplicar filtro baseado no tipo do campo
      if (!this.matchesDynamicFilter(leadValue, filterValue, field.type)) {
        return false;
      }
    }
    
    return true;
  }

  // Obter valor de um campo específico do lead
  private getLeadFieldValue(lead: Lead, fieldName: string): any {
    if (!lead || !fieldName) return undefined;
    
    // Verificar em fields (campos do formulário)
    if (lead.fields && lead.fields[fieldName] !== undefined) {
      return lead.fields[fieldName];
    }
    
    // Verificar em phaseHistory (dados de fases específicas)
    if (lead.phaseHistory) {
      for (const [phaseId, phaseData] of Object.entries(lead.phaseHistory)) {
        if (phaseData && typeof phaseData === 'object' && phaseData[fieldName] !== undefined) {
          return phaseData[fieldName];
        }
      }
    }
    
    // Verificar campos diretos do lead
    const leadAsAny = lead as any;
    if (leadAsAny[fieldName] !== undefined) {
      return leadAsAny[fieldName];
    }
    
    return undefined;
  }

  // Verificar se um valor corresponde ao filtro dinâmico
  private matchesDynamicFilter(leadValue: any, filterValue: any, fieldType: string): boolean {
    if (!leadValue && !filterValue) return true;
    if (!leadValue || !filterValue) return false;
    
    const leadStr = String(leadValue).toLowerCase();
    const filterStr = String(filterValue).toLowerCase();
    
    switch (fieldType.toLowerCase()) {
      case 'text':
      case 'email':
      case 'tel':
        // Busca parcial (contém)
        return leadStr.includes(filterStr);
        
      case 'select':
      case 'radio':
        // Correspondência exata
        return leadStr === filterStr;
        
      case 'checkbox':
        // Para checkbox, verificar se está marcado
        return filterValue === true ? (leadValue === true || leadValue === 'true' || leadValue === 'on') : true;
        
      case 'number':
        // Comparação numérica
        const leadNum = parseFloat(leadValue);
        const filterNum = parseFloat(filterValue);
        return !isNaN(leadNum) && !isNaN(filterNum) && leadNum === filterNum;
        
      case 'date':
        // Comparação de data (apenas dia)
        try {
          const leadDate = new Date(leadValue).toDateString();
          const filterDate = new Date(filterValue).toDateString();
          return leadDate === filterDate;
        } catch {
          return false;
        }
        
      default:
        // Fallback para busca parcial
        return leadStr.includes(filterStr);
    }
  }

  /**
   * Apply filters and update the displayed leads
   */
  applyFilters() {
    // Rebuild displayed leads with current filters
    this.rebuildDisplayedLeads();
    
    // Trigger change detection to update the UI
    this.cdr.detectChanges();
    
    // Save filter state to localStorage
    this.saveFilterState();
  }

  /**
   * Save filter state to localStorage
   */
  private saveFilterState() {
    if (!this.boardId) return;
    
    try {
      const filterState = {
        filterQuery: this.filterQuery,
        filterOnlyMine: this.filterOnlyMine,
        dynamicFilters: this.dynamicFilters
      };
      localStorage.setItem(`kanban-filters-${this.boardId}`, JSON.stringify(filterState));
    } catch (error) {
      console.warn('Could not save filter state to localStorage:', error);
    }
  }

  /**
   * Load filter state from localStorage
   */
  private loadFilterState() {
    if (!this.boardId) return;
    
    try {
      const saved = localStorage.getItem(`kanban-filters-${this.boardId}`);
      if (saved) {
        const filterState = JSON.parse(saved);
        this.filterQuery = filterState.filterQuery || '';
        this.filterOnlyMine = filterState.filterOnlyMine || false;
        this.dynamicFilters = filterState.dynamicFilters || {};
      }
    } catch (error) {
      console.warn('Could not load filter state from localStorage:', error);
    }
  }

  /**
   * Check if any filters are active
   */
  hasActiveFilters(): boolean {
    const hasDynamicFilters = Object.keys(this.dynamicFilters).some(key => this.dynamicFilters[key] && this.dynamicFilters[key] !== '');
    return !!(this.filterQuery || this.filterOnlyMine || hasDynamicFilters);
  }

  // Métodos para filtros dinâmicos
  setDynamicFilter(fieldName: string, value: any) {
    if (value === null || value === undefined || value === '') {
      delete this.dynamicFilters[fieldName];
    } else {
      this.dynamicFilters[fieldName] = value;
    }
    this.applyFilters();
  }

  onDynamicFilterChange(fieldName: string, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.setDynamicFilter(fieldName, value);
  }

  getDynamicFilterValue(fieldName: string): any {
    return this.dynamicFilters[fieldName] || '';
  }

  removeDynamicFilter(fieldName: string) {
    delete this.dynamicFilters[fieldName];
    this.applyFilters();
  }

  getActiveDynamicFiltersCount(): number {
    return Object.keys(this.dynamicFilters).filter(key => this.dynamicFilters[key] && this.dynamicFilters[key] !== '').length;
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

  // Métodos para debugging de drag
  onDragEntered() {
    console.log('🔄 Drag entered flow area');
  }

  onDragExited() {
    console.log('🔄 Drag exited flow area');
  }

  onDragStarted(phaseId: string) {
    const phaseName = this.getColumnById(phaseId)?.name;
    const currentIndex = this.flowOrder.indexOf(phaseId);
    console.log('🔄 Drag started for phase:', phaseName, 'at index:', currentIndex);
  }

  onDragEnded(phaseId: string) {
    console.log('🔄 Drag ended for phase:', this.getColumnById(phaseId)?.name);
  }

  // Funções de reordenação com botões
  async movePhaseUp(currentIndex: number, event: Event) {
    event.stopPropagation(); // Prevenir click na fase
    
    if (currentIndex <= 0) return;
    
    console.log('⬅️ Movendo fase para esquerda:', {
      from: currentIndex,
      to: currentIndex - 1,
      phaseName: this.getColumnById(this.flowOrder[currentIndex])?.name
    });
    
    await this.movePhase(currentIndex, currentIndex - 1);
  }

  async movePhaseDown(currentIndex: number, event: Event) {
    event.stopPropagation(); // Prevenir click na fase
    
    if (currentIndex >= this.flowOrder.length - 1) return;
    
    console.log('➡️ Movendo fase para direita:', {
      from: currentIndex,
      to: currentIndex + 1,
      phaseName: this.getColumnById(this.flowOrder[currentIndex])?.name
    });
    
    await this.movePhase(currentIndex, currentIndex + 1);
  }

  private async movePhase(fromIndex: number, toIndex: number) {
    this.isManualReorder = true;
    
    const originalOrder = [...this.flowOrder];
    
    // Mover no array local
    const movedPhase = this.flowOrder.splice(fromIndex, 1)[0];
    this.flowOrder.splice(toIndex, 0, movedPhase);
    
    console.log('🔄 Movimento executado:', {
      originalOrder: originalOrder.map((id, i) => `${i}: ${this.getColumnById(id)?.name}`),
      newOrder: this.flowOrder.map((id, i) => `${i}: ${this.getColumnById(id)?.name}`)
    });
    
    // Forçar atualização visual
    this.cdr.detectChanges();
    
    try {
      // Salvar nova ordem no banco
      const updatePromises = this.flowOrder.map(async (columnId, newIndex) => {
        const column = this.columns.find(c => c.id === columnId);
        if (column && column.order !== newIndex) {
          console.log(`💾 Salvando ${column.name} na posição ${newIndex}`);
          await this.firestoreService.updateColumn(this.ownerId, this.boardId, columnId, { order: newIndex });
          column.order = newIndex;
        }
      });
      
      await Promise.all(updatePromises);
      
      console.log('✅ Reordenação salva com sucesso!');
      
      setTimeout(() => {
        this.isManualReorder = false;
      }, 500);
      
    } catch (error) {
      console.error('❌ Erro ao salvar reordenação:', error);
      // Reverter em caso de erro
      this.flowOrder = originalOrder;
      this.isManualReorder = false;
      this.cdr.detectChanges();
    }
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
      
      for (const invalidAutomation of invalidAutomations) {
        if (invalidAutomation.id) {
          try {
            await this.firestoreService.deleteAutomation(this.ownerId, this.boardId, invalidAutomation.id);
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

    console.log('🔧 Editando automação (ANTES do JSON.parse):', automation);

    // Passar cópia profunda para evitar duplicação/efeitos colaterais no array
    this.selectedAutomation = JSON.parse(JSON.stringify(automation));

    console.log('🔧 Automação selecionada (DEPOIS do JSON.parse):', this.selectedAutomation);

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
      } else {
        // Criando nova automação
        await this.firestoreService.createAutomation(this.ownerId, this.boardId, payload);
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

  // Filter Methods
  onFilterQueryChange(query: string) {
    this.filterQuery = query;
    this.applyFilters();
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  getDynamicFilterCount(): number {
    return Object.keys(this.dynamicFilters).filter(key => 
      this.dynamicFilters[key] && this.dynamicFilters[key] !== ''
    ).length;
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

  // Drag to scroll methods
  onKanbanMouseDown(event: MouseEvent) {
    if (!this.kanbanBoardRef) return;

    // Ignorar se clicar em botões, inputs ou cards arrastáveis
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('textarea') ||
        target.closest('.kanban-card') || target.closest('.cdk-drag')) {
      return;
    }

    this.isDraggingScroll = true;
    const el = this.kanbanBoardRef.nativeElement;
    this.scrollStartX = event.pageX - el.offsetLeft;
    this.scrollStartY = event.pageY - el.offsetTop;
    this.scrollLeft = el.scrollLeft;
    this.scrollTop = el.scrollTop;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  }

  onKanbanMouseMove(event: MouseEvent) {
    if (!this.isDraggingScroll || !this.kanbanBoardRef) return;

    event.preventDefault();
    const el = this.kanbanBoardRef.nativeElement;
    const x = event.pageX - el.offsetLeft;
    const y = event.pageY - el.offsetTop;
    const walkX = (x - this.scrollStartX) * 2; // Multiplicador para scroll mais rápido
    const walkY = (y - this.scrollStartY) * 2;
    el.scrollLeft = this.scrollLeft - walkX;
    el.scrollTop = this.scrollTop - walkY;
  }

  onKanbanMouseUp() {
    if (!this.kanbanBoardRef) return;
    this.isDraggingScroll = false;
    const el = this.kanbanBoardRef.nativeElement;
    el.style.cursor = 'grab';
    el.style.userSelect = 'auto';
  }

  onKanbanMouseLeave() {
    if (!this.kanbanBoardRef) return;
    this.isDraggingScroll = false;
    const el = this.kanbanBoardRef.nativeElement;
    el.style.cursor = 'grab';
    el.style.userSelect = 'auto';
  }

  getLeadTitle(lead: any): string {
    const fields = lead?.fields || {};
    // Suportar variações de nomes de campos
    const title = fields['companyName'] ||
                  fields['nameComapny'] ||  // typo comum no banco
                  fields['nameCompany'] ||
                  fields['contactName'] ||
                  fields['nameContact'] ||  // variação alternativa
                  fields['contactEmail'] ||
                  fields['emailContact'] ||
                  'Sem título';
    return title;
  }

}

