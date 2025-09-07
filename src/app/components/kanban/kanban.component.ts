import { Component, inject, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
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

  @ViewChild(LeadModalComponent) leadModal!: LeadModalComponent;
  @ViewChild(ColumnModalComponent) columnModal!: ColumnModalComponent;
  @ViewChild(PhaseFormModalComponent) phaseFormModal!: PhaseFormModalComponent;
  @ViewChild(LeadDetailModalComponent) leadDetailModal!: LeadDetailModalComponent;
  @ViewChild(TemplateModalComponent) templateModal!: TemplateModalComponent;
  @ViewChild(AutomationModal) automationModal!: AutomationModal;

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
    { id: 'automations', name: 'Automações', icon: 'fa-cogs' },
    { id: 'api', name: 'API', icon: 'fa-code' }
  ];

  // API Configuration
  apiEndpoint = '';
  apiToken = 'KzB47@p!qR9$tW2m&e*J';

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
    } else {
      console.error('Parâmetros faltando:', { currentUser: !!this.currentUser, boardId: this.boardId, ownerId: this.ownerId });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
      }
    );
    this.subscriptions.push({ unsubscribe: columnsUnsub } as Subscription);

    // Subscrever leads
    const leadsUnsub = this.firestoreService.subscribeToLeads(
      this.ownerId,
      this.boardId,
      (leads) => {
        console.log('Leads recebidos:', leads);
        this.leads = leads;
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

        // Processar automações para mudança de fase
        if (lead) {
          console.log('🔄 Processando automações para mudança de fase:', {
            leadId: lead.id,
            oldColumn: previousColumnId,
            newColumn: targetColumnId
          });
          
          try {
            await this.automationService.processPhaseChangeAutomations(
              lead,
              targetColumnId,
              previousColumnId,
              this.boardId,
              this.ownerId
            );
          } catch (automationError) {
            console.error('Erro ao processar automações de mudança de fase:', automationError);
          }
        }
      } catch (error) {
        console.error('Erro ao mover lead:', error);
        // Reverter a mudança visual se houver erro
        this.subscribeToRealtimeUpdates();
      }
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
    
    // Processar automações para novo lead
    // Aguardar um pouco para garantir que o lead foi persistido
    setTimeout(async () => {
      try {
        await this.automationService.processNewLeadAutomations(
          this.leads[this.leads.length - 1], // Último lead criado
          this.boardId,
          this.ownerId
        );
      } catch (error) {
        console.error('Erro ao processar automações de novo lead:', error);
      }
    }, 1000);
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

  // Formulário inicial (aba nova)
  initialFormFields: any[] = [];
  apiExampleJson: string = '';

  // Fluxo (transitions) config
  flowConfig: { allowed: Record<string, string[]> } = { allowed: {} };
  // Fluxo - nós e arestas para canvas
  flowNodes: Array<{ id: string; name: string; x: number; y: number; color?: string }>= [];
  flowEdges: Array<{ fromId: string; toId: string }>= [];
  isConnecting = false;
  connectFromId: string | null = null;
  flowMouse = { x: 0, y: 0 };
  // drag
  draggingNodeId: string | null = null;
  dragOffset = { x: 0, y: 0 };
  flowMoveEnabled = false;

  private async loadFlowConfig() {
    try {
      const cfg = await this.firestoreService.getFlowConfig(this.boardId);
      this.flowConfig = (cfg as any) || { allowed: {} };
      this.buildFlowEdgesFromConfig();
      // Se houver posições salvas, restaurar
      const nodes = (cfg as any)?.nodes as any[];
      if (Array.isArray(nodes) && nodes.length) {
        this.flowNodes = this.columns.map((c, idx) => {
          const saved = nodes.find(n => n.id === c.id);
          return {
            id: c.id!,
            name: c.name,
            x: saved?.x ?? 60 + idx * 200,
            y: saved?.y ?? 160,
            color: c.color
          };
        });
      } else {
        this.layoutFlowNodes();
      }
    } catch {
      this.flowConfig = { allowed: {} };
    }
  }

  async saveFlowConfig() {
    try {
      // Persistir com base nas arestas atuais
      const allowed: Record<string, string[]> = {};
      for (const edge of this.flowEdges) {
        if (!allowed[edge.fromId]) allowed[edge.fromId] = [];
        if (!allowed[edge.fromId].includes(edge.toId)) allowed[edge.fromId].push(edge.toId);
      }
      this.flowConfig = { allowed };
      const nodes = this.flowNodes.map(n => ({ id: n.id, x: n.x, y: n.y }));
      await this.firestoreService.saveFlowConfig(this.boardId, { allowed, nodes });
      this.toast.success('Fluxo salvo.');
    } catch {
      this.toast.error('Erro ao salvar fluxo.');
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

  // --- Canvas style flow ---
  private layoutFlowNodes() {
    const paddingX = 200;
    const startX = 60;
    const y = 160;
    this.flowNodes = this.columns.map((c, idx) => ({
      id: c.id!,
      name: c.name,
      x: startX + idx * paddingX,
      y,
      color: c.color
    }));
  }

  private buildFlowEdgesFromConfig() {
    const edges: Array<{ fromId: string; toId: string }> = [];
    const allowed = this.flowConfig.allowed || {};
    Object.keys(allowed).forEach(fromId => {
      (allowed[fromId] || []).forEach(toId => edges.push({ fromId, toId }));
    });
    this.flowEdges = edges;
  }

  onFlowMouseMove(evt: MouseEvent) {
    const target = evt.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.flowMouse = { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    // se estiver arrastando
    if (this.draggingNodeId) {
      const node = this.flowNodes.find(n => n.id === this.draggingNodeId);
      if (node) {
        const grid = 20;
        const nextX = this.flowMouse.x - this.dragOffset.x;
        const nextY = this.flowMouse.y - this.dragOffset.y;
        node.x = Math.round(nextX / grid) * grid;
        node.y = Math.round(nextY / grid) * grid;
      }
    }
  }

  startConnect(fromId: string, evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isConnecting = true;
    this.connectFromId = fromId;
    const target = evt.currentTarget as HTMLElement;
    const container = (target.closest('.relative') as HTMLElement) || document.body;
    const rect = container.getBoundingClientRect();
    this.flowMouse = { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  }

  endConnect(toId: string, evt: MouseEvent) {
    evt.stopPropagation();
    if (!this.isConnecting || !this.connectFromId) return;
    if (this.connectFromId !== toId) {
      const exists = this.flowEdges.some(e => e.fromId === this.connectFromId && e.toId === toId);
      if (!exists) {
        this.flowEdges.push({ fromId: this.connectFromId, toId });
      }
    }
    this.isConnecting = false;
    this.connectFromId = null;
    // Sincronizar com config em memória para refletir listas
    const allowed = this.flowConfig.allowed[this.connectFromId || ''] || [];
    // no-op, manter somente edges -> config ao salvar
  }

  cancelConnect() {
    this.isConnecting = false;
    this.connectFromId = null;
    this.draggingNodeId = null;
  }

  removeEdge(edge: { fromId: string; toId: string }) {
    this.flowEdges = this.flowEdges.filter(e => !(e.fromId === edge.fromId && e.toId === edge.toId));
  }

  getNodeById(id: string) {
    return this.flowNodes.find(n => n.id === id)!;
  }

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

  buildTempCurve(): string {
    if (!this.isConnecting || !this.connectFromId) return '';
    const a = this.getNodeById(this.connectFromId);
    if (!a) return '';
    const startX = a.x + 120;
    const startY = a.y + 30;
    const endX = this.flowMouse.x;
    const endY = this.flowMouse.y;
    const dx = Math.max(40, Math.abs(endX - startX) * 0.5);
    const c1x = startX + dx, c1y = startY;
    const c2x = endX - dx, c2y = endY;
    return `M ${startX},${startY} C ${c1x},${c1y} ${c2x},${c2y} ${endX},${endY}`;
  }

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

  onNodeDragStart(node: { id: string; x: number; y: number }, evt: MouseEvent) {
    if (!this.flowMoveEnabled) return;
    if (evt.button !== 0) return; // apenas botão esquerdo
    evt.preventDefault();
    // evitar conflito com conexão: se botão roxo foi clicado, ele já chama startConnect com stopPropagation
    this.draggingNodeId = node.id;
    const target = evt.currentTarget as HTMLElement;
    const container = (target.closest('.relative') as HTMLElement) || document.body;
    const rect = container.getBoundingClientRect();
    const mouseX = evt.clientX - rect.left;
    const mouseY = evt.clientY - rect.top;
    this.dragOffset = { x: mouseX - node.x, y: mouseY - node.y };
  }

  onFlowMouseUp(evt: MouseEvent) {
    // finalizar drag e conexão
    const wasDragging = !!this.draggingNodeId;
    this.draggingNodeId = null;
    if (this.isConnecting) {
      this.isConnecting = false;
      this.connectFromId = null;
    }
    // auto-desabilitar mover após soltar
    if (wasDragging) {
      this.flowMoveEnabled = false;
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onWindowMouseUp(evt: MouseEvent) {
    // Garante término do drag/conexão mesmo fora da área
    this.onFlowMouseUp(evt);
    this.flowMoveEnabled = false; // desativa mover até novo hover
  }

  @HostListener('window:touchend', ['$event'])
  onWindowTouchEnd(evt: TouchEvent) {
    const wasDragging = !!this.draggingNodeId;
    this.draggingNodeId = null;
    this.isConnecting = false;
    this.connectFromId = null;
    if (wasDragging) {
      this.flowMoveEnabled = false;
    }
    this.flowMoveEnabled = false;
  }

  onNodeMouseEnter(node: { id: string }) {
    // Ativa mover apenas quando o mouse está sobre o card do nó (se não estiver conectando)
    if (!this.isConnecting) {
      this.flowMoveEnabled = true;
    }
  }

  onNodeMouseLeave(node: { id: string }) {
    // Desativa mover ao sair do card, se não estiver arrastando ou conectando
    if (!this.draggingNodeId && !this.isConnecting) {
      this.flowMoveEnabled = false;
    }
  }

  autoAlignFlow() {
    this.layoutFlowNodes();
    this.toast.success('Fluxo alinhado');
  }

  toggleFlowMove() {
    this.flowMoveEnabled = !this.flowMoveEnabled;
    if (!this.flowMoveEnabled) this.draggingNodeId = null;
  }

  getColumnById(columnId: string): Column | undefined {
    return this.columns.find(c => c.id === columnId);
  }

  // Automações por fase (na aba Fluxo)
  selectedPhaseIdForAutomations: string | null = null;
  openPhaseAutomations(phaseId: string) {
    this.selectedPhaseIdForAutomations = phaseId;
  }
  closePhaseAutomations() { this.selectedPhaseIdForAutomations = null; }
  getAutomationsForPhase(phaseId: string) {
    return (this.automations || []).filter(a => a?.trigger?.phase === phaseId);
  }
  createAutomationForPhase(phaseId: string) {
    this.selectedAutomation = {
      name: 'Automação da fase',
      active: true,
      trigger: { type: 'card-enters-phase', phase: phaseId },
      actions: []
    };
    this.showAutomationModal = true;
  }

  private async loadInitialForm() {
    try {
      const cfg = await this.firestoreService.getInitialFormConfig(this.boardId);
      this.initialFormFields = (cfg as any)?.fields || [];
      this.buildApiExampleFromFields();
    } catch {
      this.initialFormFields = [];
      this.buildApiExampleFromFields();
    }
  }

  async saveInitialForm() {
    try {
      await this.firestoreService.saveInitialFormConfig(this.boardId, { fields: this.initialFormFields });
      this.toast.success('Formulário inicial salvo.');
    } catch {
      this.toast.error('Erro ao salvar formulário inicial.');
    }
  }

  onInitialFieldsChanged(fields: any[]) {
    this.initialFormFields = fields;
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
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      alert('Erro ao reenviar email. Tente novamente.');
    }
  }

  async deleteEmail(email: any) {
    if (confirm('Tem certeza que deseja excluir este email?')) {
      try {
        await this.firestoreService.deleteOutboxEmail(this.ownerId, this.boardId, email.id);
        console.log('Email excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir email:', error);
        alert('Erro ao excluir email. Tente novamente.');
      }
    }
  }

  // Métodos para gerenciar colunas

  showCreateColumnModal() {
    this.columnModal.showCreateModal();
  }

  editColumn(column: Column) {
    this.columnModal.showEditModal(column);
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
    console.log('Configuração de formulário salva!');
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
  getTriggerDescription(trigger: any): string {
    if (!trigger) return 'Não especificado';
    
    const descriptions: any = {
      'new-lead-created': 'Quando um novo lead é criado',
      'card-enters-phase': 'Quando lead entra em uma fase',
      'card-in-phase-for-time': 'Quando lead fica muito tempo na fase',
      'form-not-answered': 'Quando formulário não é respondido',
      'sla-overdue': 'Quando SLA da fase vence'
    };

    let description = descriptions[trigger.type] || trigger.type;
    
    if (trigger.phase && this.columns.length > 0) {
      const column = this.columns.find(col => col.id === trigger.phase);
      if (column) {
        description += ` (${column.name})`;
      }
    }

    if (trigger.days) {
      description += ` (${trigger.days} dias)`;
    }

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

  async deleteAutomation(automation: any) {
    if (confirm('Tem certeza que deseja excluir esta automação?')) {
      try {
        await this.firestoreService.deleteAutomation(this.ownerId, this.boardId, automation.id);
        console.log('Automação excluída:', automation.id);
      } catch (error) {
        console.error('Erro ao excluir automação:', error);
      }
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
    
    this.selectedAutomation = automation;
    this.showAutomationModal = true;
  }

  onCloseAutomationModal() {
    this.showAutomationModal = false;
    this.selectedAutomation = null;
  }

  async onSaveAutomation(automationData: any) {
    try {
      if (automationData.id) {
        // Editando automação existente
        await this.firestoreService.updateAutomation(this.ownerId, this.boardId, automationData.id, automationData);
        console.log('Automação atualizada com sucesso:', automationData.name);
      } else {
        // Criando nova automação
        await this.firestoreService.createAutomation(this.ownerId, this.boardId, automationData);
        console.log('Automação criada com sucesso:', automationData.name);
      }
    } catch (error) {
      console.error('Erro ao salvar automação:', error);
      alert('Erro ao salvar automação. Verifique o console para detalhes.');
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
