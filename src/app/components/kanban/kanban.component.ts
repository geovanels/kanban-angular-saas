import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Board, Column, Lead } from '../../services/firestore.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { LeadModalComponent } from '../lead-modal/lead-modal.component';
import { ColumnModalComponent } from '../column-modal/column-modal.component';
import { PhaseFormModalComponent } from '../phase-form-modal/phase-form-modal.component';
import { LeadDetailModalComponent } from '../lead-detail-modal/lead-detail-modal.component';
import { TemplateModalComponent } from '../template-modal/template-modal.component';
import { AutomationModal } from '../automation-modal/automation-modal';
import { AutomationHistoryModal } from '../automation-history-modal/automation-history-modal';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule, LeadModalComponent, ColumnModalComponent, PhaseFormModalComponent, LeadDetailModalComponent, TemplateModalComponent, AutomationModal, AutomationHistoryModal],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
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
  currentUser: any = null;
  boardId: string = '';
  ownerId: string = '';
  
  private subscriptions: Subscription[] = [];
  isLoading = true;
  
  // Abas
  activeTab: string = 'kanban';
  tabs = [
    { id: 'kanban', name: 'Kanban', icon: 'fa-columns' },
    { id: 'reports', name: 'Relatórios', icon: 'fa-chart-bar' },
    { id: 'outbox', name: 'Caixa de Saída', icon: 'fa-paper-plane' },
    { id: 'templates', name: 'Templates', icon: 'fa-envelope' },
    { id: 'automations', name: 'Automações', icon: 'fa-cogs' },
    { id: 'api', name: 'API', icon: 'fa-code' }
  ];

  // API Configuration
  apiEndpoint = 'https://your-domain.com/functions/v1/lead-intake';
  apiToken = 'KzB47@p!qR9$tW2m&e*J';

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.boardId = this.route.snapshot.paramMap.get('boardId') || '';
    this.ownerId = this.route.snapshot.queryParamMap.get('ownerId') || this.currentUser?.uid || '';
    
    console.log('KanbanComponent - boardId:', this.boardId, 'ownerId:', this.ownerId);
    
    if (this.currentUser && this.boardId && this.ownerId) {
      this.loadBoardData();
      this.subscribeToRealtimeUpdates();
    } else {
      console.error('Parâmetros faltando:', { currentUser: !!this.currentUser, boardId: this.boardId, ownerId: this.ownerId });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
    return this.leads.filter(lead => lead.columnId === columnId);
  }

  getColumnConnectedTo(): string[] {
    return this.columns.map(col => `column-${col.id}`);
  }

  async onLeadDrop(event: CdkDragDrop<Lead[]>) {
    const leadId = event.item.data;
    const targetColumnId = event.container.id.replace('column-', '');
    
    if (event.previousContainer === event.container) {
      // Reordenar dentro da mesma coluna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Mover para outra coluna
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Atualizar no Firestore
      try {
        await this.firestoreService.moveLead(
          this.ownerId,
          this.boardId,
          leadId,
          targetColumnId
        );
      } catch (error) {
        console.error('Erro ao mover lead:', error);
        // Reverter a mudança visual se houver erro
        this.subscribeToRealtimeUpdates();
      }
    }
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

  onLeadCreated() {
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

  // Propriedades para gerenciar colunas
  showColumnMenu: string | null = null;

  // Lista de usuários para o modal de detalhes
  users: any[] = [];

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
  toggleColumnMenu(columnId: string) {
    this.showColumnMenu = this.showColumnMenu === columnId ? null : columnId;
  }

  showCreateColumnModal() {
    this.columnModal.showCreateModal();
    this.showColumnMenu = null;
  }

  editColumn(column: Column) {
    this.columnModal.showEditModal(column);
    this.showColumnMenu = null;
  }

  async showColumnForm(column: Column) {
    try {
      const existingConfig = await this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, column.id!);
      this.phaseFormModal.showModal(column, existingConfig as any || undefined);
    } catch (error) {
      console.error('Erro ao carregar configuração do formulário:', error);
      this.phaseFormModal.showModal(column, undefined);
    }
    this.showColumnMenu = null;
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
    this.showColumnMenu = null;
  }

  onColumnCreated() {
    console.log('Nova fase criada!');
  }

  onColumnUpdated() {
    console.log('Fase atualizada!');
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
    // Template foi salvo, fechar modal
    this.templateModal.hide();
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
