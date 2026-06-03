import { Component, inject, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Lead, Column, Board } from '../../services/firestore.service';
import { CompanyBreadcrumbComponent } from '../company-breadcrumb/company-breadcrumb.component';
import { AdvancedFiltersComponent } from '../advanced-filters/advanced-filters.component';
import * as XLSX from 'xlsx';


interface SLAIndicator {
  phaseId: string;
  phaseName: string;
  phaseColor: string;
  slaDays: number;
  totalRecords: number;
  onTime: number;
  overdue: number;
  compliance: number;
}

interface PhaseMetric {
  phaseId: string;
  phaseName: string;
  phaseColor: string;
  recordsCount: number;
  avgTimeInPhase: number;
  conversionRate: number;
}

interface UserPerformance {
  name: string;
  email: string;
  totalLeads: number;
  concludedLeads: number;
  overdueLeads: number;
  activeLeads: number;
  winRate: number;
  avgConversionDays: number;
}

interface StagnantLead {
  lead: Lead;
  daysInPhase: number;
  phaseName: string;
  phaseColor: string;
  contactName: string;
}

interface FunnelStage {
  phase: string;
  color: string;
  count: number;
  percentage: number;
  dropOff: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, CompanyBreadcrumbComponent, AdvancedFiltersComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  @Input() boardId: string = '';
  @Input() ownerId: string = '';
  currentUser: any = null;
  board: Board | null = null;
  availableBoards: Board[] = [];
  
  // Data
  records: Lead[] = [];
  columns: Column[] = [];
  users: any[] = [];
  
  // Kanban-style filters - now handled by AdvancedFiltersComponent
  filterQuery: string = '';
  filterOnlyMine: boolean = false;
  dynamicFilters: { [key: string]: any } = {};
  showAdvancedFilters: boolean = false;

  // Loading states
  isLoading = false;
  isGeneratingReport = false;


  // Report data
  filteredRecords: Lead[] = [];
  groupedRecords: { column: Column; leads: Lead[] }[] = [];
  groupByPhase = true;
  slaIndicators: SLAIndicator[] = [];
  phaseMetrics: PhaseMetric[] = [];
  summaryStats = {
    totalRecords: 0,
    newRecordsThisPeriod: 0,
    concludedRecords: 0,
    avgConversionTime: 0,
    activeRecords: 0,
    overdueRecords: 0
  };

  // Chart data
  chartData = {
    phaseDistribution: [] as any[],
    registrosOverTime: [] as any[],
    conversionFunnel: [] as any[],
    dynamicCharts: [] as any[]
  };

  // Dynamic chart configuration
  availableChartFields: string[] = [];
  selectedChartField: string = '';
  chartType: 'bar' | 'pie' = 'bar';

  // Display options
  currentView: 'overview' | 'sla' | 'phases' | 'health' | 'registros' = 'overview';
  exportFormats = ['PDF', 'Excel', 'CSV'];

  // Health & Performance data
  winRate = 0;
  lossRate = 0;
  leadVelocity = 0;
  stagnantLeads: StagnantLead[] = [];
  userPerformance: UserPerformance[] = [];
  funnelStages: FunnelStage[] = [];
  leadsOverTimeChart: { label: string; value: number }[] = [];

  // Column management for registros table
  availableColumns: any[] = [];
  selectedColumns: string[] = [];
  showColumnSelector = false;
  viewTabs = [
    { key: 'overview', name: 'Visão Geral', icon: 'fa-chart-pie' },
    { key: 'health', name: 'Saúde do Pipeline', icon: 'fa-heartbeat' },
    { key: 'sla', name: 'SLA', icon: 'fa-clock' },
    { key: 'phases', name: 'Fases', icon: 'fa-columns' },
    { key: 'registros', name: 'Registros', icon: 'fa-users' }
  ];

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    // Use provided inputs first, fallback to URL params, then to current user
    if (!this.ownerId) {
      this.ownerId = this.currentUser?.uid || '';
    }
    
    // Get route parameters only if boardId not provided via input
    if (!this.boardId) {
      this.route.queryParams.subscribe(params => {
        if (params['boardId']) {
          this.boardId = params['boardId'];
        }
      });
    }


    // Load available boards
    await this.loadAvailableBoards();

    // If boardId is set (from input or URL), load data directly
    if (this.boardId && this.ownerId) {
      await this.loadData();
      this.initializeColumns();
      this.generateReport();
    }
  }

  ngOnDestroy() {
    // Cleanup subscriptions if any
  }



  private async loadAvailableBoards() {
    if (!this.ownerId) return;
    
    try {
      this.availableBoards = await this.firestoreService.getBoards(this.ownerId);
    } catch (error) {
      console.error('Erro ao carregar boards disponíveis:', error);
    }
  }

  async selectBoard(boardId: string) {
    this.boardId = boardId;
    await this.loadData();
    this.initializeColumns();
    this.generateReport();
  }


  private async loadData() {
    this.isLoading = true;
    try {
      // Load board info
      const boards = await this.firestoreService.getBoards(this.ownerId);
      this.board = boards.find(b => b.id === this.boardId) || null;

      // Load registros, columns, and form config in parallel
      const [registros, columns] = await Promise.all([
        this.firestoreService.getLeads(this.ownerId, this.boardId),
        this.firestoreService.getColumns(this.ownerId, this.boardId)
      ]);

      this.records = registros;
      this.columns = columns;
      this.users = []; // Será implementado posteriormente

      // Note: Form field configuration now handled by AdvancedFiltersComponent

    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
    } finally {
      this.isLoading = false;
    }
  }

  generateReport() {
    if (this.isGeneratingReport) return;

    this.isGeneratingReport = true;
    try {
      // Apply current filters
      this.applyFilters();
      this.calculateSummaryStats();
      this.calculateSLAIndicators();
      this.calculatePhaseMetrics();
      this.generateChartData();
      this.calculateHealthMetrics();
      this.calculateUserPerformance();
      this.calculateFunnelStages();
      this.calculateLeadsOverTime();

      // Força a detecção de mudanças para garantir que os gráficos sejam renderizados
      this.cdr.detectChanges();
    } finally {
      this.isGeneratingReport = false;
    }
  }


  private getLeadDate(lead: Lead): Date {
    if (lead.createdAt?.toDate) {
      return lead.createdAt.toDate();
    } else if (lead.createdAt?.seconds) {
      return new Date(lead.createdAt.seconds * 1000);
    } else if (lead.createdAt) {
      return new Date(lead.createdAt);
    }
    return new Date();
  }

  isLeadOverdue(lead: Lead): boolean {
    const currentColumn = this.columns.find(c => c.id === lead.columnId);
    if (!currentColumn?.slaDays) return false;

    const movedDate = lead.movedToCurrentColumnAt?.toDate ? 
      lead.movedToCurrentColumnAt.toDate() : 
      (lead.movedToCurrentColumnAt?.seconds ? 
        new Date(lead.movedToCurrentColumnAt.seconds * 1000) : 
        new Date(lead.movedToCurrentColumnAt || lead.createdAt));

    const daysPassed = (Date.now() - movedDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysPassed > currentColumn.slaDays;
  }

  isLeadConcluded(lead: Lead): boolean {
    const currentColumn = this.columns.find(c => c.id === lead.columnId);
    return !!(currentColumn?.endStageType && currentColumn.endStageType !== 'none');
  }

  private calculateSummaryStats() {
    const startDate = this.dynamicFilters.startDate ? new Date(this.dynamicFilters.startDate) : null;
    const endDate = this.dynamicFilters.endDate ? new Date(this.dynamicFilters.endDate) : null;

    this.summaryStats = {
      totalRecords: this.filteredRecords.length,
      newRecordsThisPeriod: startDate && endDate ? this.filteredRecords.filter(record => {
        const leadDate = this.getLeadDate(record);
        return leadDate >= startDate && leadDate <= endDate;
      }).length : this.filteredRecords.length,
      concludedRecords: this.filteredRecords.filter(record => this.isLeadConcluded(record)).length,
      avgConversionTime: this.calculateAverageConversionTime(),
      activeRecords: this.filteredRecords.filter(record => !this.isLeadConcluded(record)).length,
      overdueRecords: this.filteredRecords.filter(record => this.isLeadOverdue(record) && !this.isLeadConcluded(record)).length
    };
  }

  private calculateAverageConversionTime(): number {
    const concludedRecords = this.filteredRecords.filter(record => this.isLeadConcluded(record));
    if (concludedRecords.length === 0) return 0;

    const totalTime = concludedRecords.reduce((sum, lead) => {
      const createdDate = this.getLeadDate(lead);
      const movedDate = lead.movedToCurrentColumnAt?.toDate ? 
        lead.movedToCurrentColumnAt.toDate() : new Date();
      return sum + (movedDate.getTime() - createdDate.getTime());
    }, 0);

    return Math.round(totalTime / concludedRecords.length / (1000 * 60 * 60 * 24)); // Days
  }

  private calculateSLAIndicators() {
    this.slaIndicators = this.columns
      .filter(col => col.slaDays && col.slaDays > 0)
      .map(column => {
        const registrosInPhase = this.filteredRecords.filter(record => record.columnId === column.id);
        const overdueRecords = registrosInPhase.filter(record => this.isLeadOverdue(record));
        const onTimeLeads = registrosInPhase.length - overdueRecords.length;
        
        return {
          phaseId: column.id!,
          phaseName: column.name,
          phaseColor: column.color,
          slaDays: column.slaDays,
          totalRecords: registrosInPhase.length,
          onTime: onTimeLeads,
          overdue: overdueRecords.length,
          compliance: registrosInPhase.length > 0 ? Math.round((onTimeLeads / registrosInPhase.length) * 100) : 100
        };
      });
  }

  private calculatePhaseMetrics() {
    this.phaseMetrics = this.columns.map(column => {
      const registrosInPhase = this.filteredRecords.filter(record => record.columnId === column.id);
      const avgTime = this.calculateAverageTimeInPhase(registrosInPhase);
      const conversionRate = this.calculatePhaseConversionRate(column);

      return {
        phaseId: column.id!,
        phaseName: column.name,
        phaseColor: column.color,
        recordsCount: registrosInPhase.length,
        avgTimeInPhase: avgTime,
        conversionRate: conversionRate
      };
    });
  }

  private calculateAverageTimeInPhase(registros: Lead[]): number {
    if (registros.length === 0) return 0;

    const totalTime = registros.reduce((sum, lead) => {
      const phaseHistory = (lead as any).phaseHistory || {};
      const phaseEntry = Object.values(phaseHistory).find((p: any) => p.phaseId === lead.columnId) as any;
      
      if (phaseEntry?.duration) {
        return sum + phaseEntry.duration;
      } else if (phaseEntry?.enteredAt) {
        const enteredDate = phaseEntry.enteredAt.toDate ? 
          phaseEntry.enteredAt.toDate() : new Date(phaseEntry.enteredAt);
        return sum + (Date.now() - enteredDate.getTime());
      }
      
      return sum;
    }, 0);

    return Math.round(totalTime / registros.length / (1000 * 60 * 60 * 24)); // Days
  }

  private calculatePhaseConversionRate(column: Column): number {
    const currentIndex = this.columns.findIndex(c => c.id === column.id);
    if (currentIndex === this.columns.length - 1) return 0; // Last phase

    const registrosInCurrentPhase = this.filteredRecords.filter(record => record.columnId === column.id).length;
    const nextPhases = this.columns.slice(currentIndex + 1);
    const registrosInNextPhases = this.filteredRecords.filter(record => 
      nextPhases.some(p => p.id === record.columnId)
    ).length;

    const totalProgressed = registrosInCurrentPhase + registrosInNextPhases;
    return totalProgressed > 0 ? Math.round((registrosInNextPhases / totalProgressed) * 100) : 0;
  }

  private generateChartData() {
    // Phase distribution
    this.chartData.phaseDistribution = this.phaseMetrics.map(metric => ({
      name: metric.phaseName,
      value: metric.recordsCount,
      color: metric.phaseColor
    }));

    // Leads over time (simplified)
    this.chartData.registrosOverTime = this.generateLeadsOverTimeData();

    // Conversion funnel
    this.chartData.conversionFunnel = this.phaseMetrics.map((metric, index) => ({
      phase: metric.phaseName,
      registros: metric.recordsCount,
      order: index
    }));

    // Generate dynamic charts
    this.generateDynamicCharts();
  }

  private generateLeadsOverTimeData(): any[] {
    // Simplified implementation - group by week
    const startDate = this.dynamicFilters.startDate ? new Date(this.dynamicFilters.startDate) : new Date(new Date().setMonth(new Date().getMonth() - 6));
    const endDate = this.dynamicFilters.endDate ? new Date(this.dynamicFilters.endDate) : new Date();
    const data: any[] = [];

    const current = new Date(startDate);
    while (current <= endDate) {
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const registrosInWeek = this.filteredRecords.filter(record => {
        const leadDate = this.getLeadDate(record);
        return leadDate >= current && leadDate <= weekEnd;
      }).length;

      data.push({
        period: `${current.getDate()}/${current.getMonth() + 1}`,
        registros: registrosInWeek
      });

      current.setDate(current.getDate() + 7);
    }

    return data;
  }

  // View methods
  setView(view: 'overview' | 'sla' | 'phases' | 'health' | 'registros') {
    this.currentView = view;
  }

  isStandaloneView(): boolean {
    // Check if accessed via direct URL (has query params) vs embedded in kanban
    // If boardId was provided via @Input (embedded), it's not standalone
    // If boardId comes from route query params, it's standalone
    return !!this.route.snapshot.queryParams['boardId'] && !this.boardIdFromInput;
  }

  private get boardIdFromInput(): boolean {
    // Check if boardId was set via @Input before route processing
    return this.boardId !== '' && !this.route.snapshot.queryParams['boardId'];
  }

  // Export methods
  async exportReport(format: string) {
    try {
      // TODO: Implement export functionality
      alert(`Exportação em ${format} será implementada em breve!`);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert('Erro ao exportar relatório. Tente novamente.');
    }
  }

  // Utility methods
  formatDate(date: any): string {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('pt-BR');
  }

  formatDuration(days: number): string {
    if (days === 0) return '-';
    if (days === 1) return '1 dia';
    return `${days} dias`;
  }

  getResponsibleName(userId: string): string {
    const user = this.users.find(u => u.uid === userId);
    return user?.displayName || user?.email || 'Não atribuído';
  }

  getColumnName(columnId: string): string {
    const column = this.columns.find(c => c.id === columnId);
    return column?.name || 'Fase desconhecida';
  }

  getColumnColor(columnId: string): string {
    const column = this.columns.find(c => c.id === columnId);
    return column?.color || '#6B7280';
  }

  goBack() {
    // Check if we came from a specific board URL or from dashboard
    if (this.route.snapshot.queryParams['boardId']) {
      // Came from direct URL, go to kanban
      this.router.navigate(['/kanban', this.boardId], {
        queryParams: { ownerId: this.ownerId }
      });
    } else {
      // Came from dashboard, go back to dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  getChartBarHeight(value: number): number {
    if (this.chartData.registrosOverTime.length === 0) return 0;
    const maxValue = Math.max(...this.chartData.registrosOverTime.map(d => d.registros));
    return maxValue > 0 ? (value / maxValue * 100) : 0;
  }

  getPhasePercentage(value: number): number {
    if (!this.chartData.phaseDistribution.length) return 0;
    const maxValue = Math.max(...this.chartData.phaseDistribution.map(item => item.value));
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  }

  // Column management methods
  private initializeColumns() {
    this.initializeAvailableColumns();
    this.loadSelectedColumns();
  }



  private initializeAvailableColumns() {
    // Reset available columns
    this.availableColumns = [];

    // Always add essential system columns
    const systemColumns = [
      { key: 'currentPhase', label: 'Fase Atual', type: 'system', field: 'columnId' },
      { key: 'createdAt', label: 'Criado em', type: 'system', field: 'createdAt' },
      { key: 'status', label: 'Status', type: 'system', field: 'status' },
      { key: 'responsibleUser', label: 'Responsável', type: 'system', field: 'responsibleUserEmail' }
    ];

    this.availableColumns.push(...systemColumns);

    // Add form fields from the board's initial form configuration
    const formFields = (this.board as any)?.initialFormFields || [];

    // First, add common form fields that we know exist
    const commonFormFields = [
      { name: 'contactName', label: 'Nome do Contato', type: 'text' },
      { name: 'contactEmail', label: 'Email do Contato', type: 'email' },
      { name: 'contactPhone', label: 'Telefone do Contato', type: 'tel' },
      { name: 'companyName', label: 'Nome da Empresa', type: 'text' },
      { name: 'cnpj', label: 'CNPJ', type: 'text' }
    ];

    // Add common fields first (they might be overridden if exist in form config)
    commonFormFields.forEach(field => {
      this.availableColumns.push({
        key: field.name,
        label: field.label,
        type: 'form',
        field: `fields.${field.name}`,
        fieldType: field.type
      });
    });

    // Then add configured form fields (will not duplicate if already added)
    formFields.forEach((field: any) => {
      if (field.name && field.label) {
        // Check if this field already exists
        const existingColumn = this.availableColumns.find(col => col.key === field.name);
        if (!existingColumn) {
          this.availableColumns.push({
            key: field.name,
            label: field.label || field.name,
            type: 'form',
            field: `fields.${field.name}`,
            fieldType: field.type || 'text'
          });
        } else {
          // Update existing column with form config
          existingColumn.label = field.label || existingColumn.label;
          existingColumn.fieldType = field.type || existingColumn.fieldType;
        }
      }
    });
  }

  private loadSelectedColumns() {
    if (!this.boardId) return;
    
    try {
      const saved = localStorage.getItem(`report-columns-${this.boardId}`);
      if (saved) {
        this.selectedColumns = JSON.parse(saved);
      } else {
        // Default columns - include the most important fields
        this.selectedColumns = [
          'contactName',
          'contactEmail',
          'contactPhone',
          'companyName',
          'currentPhase',
          'createdAt',
          'status'
        ];
      }
    } catch (error) {
      console.warn('Could not load selected columns from localStorage:', error);
      this.selectedColumns = ['contactName', 'contactEmail', 'contactPhone', 'companyName', 'currentPhase', 'createdAt', 'status'];
    }
  }

  private saveSelectedColumns() {
    if (!this.boardId) return;
    
    try {
      localStorage.setItem(`report-columns-${this.boardId}`, JSON.stringify(this.selectedColumns));
    } catch (error) {
      console.warn('Could not save selected columns to localStorage:', error);
    }
  }

  toggleColumnSelector() {
    this.showColumnSelector = !this.showColumnSelector;
  }

  isColumnSelected(columnKey: string): boolean {
    return this.selectedColumns.includes(columnKey);
  }

  toggleColumn(columnKey: string) {
    if (this.isColumnSelected(columnKey)) {
      this.selectedColumns = this.selectedColumns.filter(key => key !== columnKey);
    } else {
      this.selectedColumns.push(columnKey);
    }
    this.saveSelectedColumns();
  }

  getSelectedColumns() {
    return this.availableColumns.filter(col => this.selectedColumns.includes(col.key));
  }

  getColumnValue(lead: Lead, column: any): string {
    switch (column.key) {
      case 'currentPhase':
        return this.getColumnName(lead.columnId);
      case 'createdAt':
        return this.formatDate(lead.createdAt);
      case 'status':
        if (this.isLeadConcluded(lead)) return 'Concluído';
        if (this.isLeadOverdue(lead)) return 'Em Atraso';
        return 'Ativo';
      case 'responsibleUser':
        return lead.responsibleUserName || lead.responsibleUserEmail || 'Não atribuído';
      
      // Form fields - using same logic as Kanban component
      case 'contactName':
        return this.readFieldValue(lead, 'contactName');
      case 'contactEmail':
        return this.readFieldValue(lead, 'contactEmail');
      case 'contactPhone':
        return this.readFieldValue(lead, 'contactPhone');
      case 'companyName':
        return this.readFieldValue(lead, 'companyName');
      case 'cnpj':
        return this.readFieldValue(lead, 'cnpj');
      
      default:
        // For dynamic/initial form fields, use the robust resolver (handles
        // casing, nested containers and label hints) instead of an exact lookup.
        const resolved = this.readFieldValue(lead, column.key, column.label);
        if (resolved !== '-') return resolved;

        // Fallback to nested property access
        const nestedValue = this.getNestedProperty(lead, column.field);
        return nestedValue ? String(nestedValue) : '-';
    }
  }

  // Resolve um valor de campo do lead de forma robusta, espelhando a lógica do
  // componente Kanban: junta campos de containers aninhados, casa por sinônimo,
  // por dica de label e com matching case-insensitive/fuzzy.
  private readFieldValue(lead: Lead, key: string, labelHint?: string): string {
    if (!key && !labelHint) return '-';

    const synonymsGroup: Record<string, string[]> = {
      companyName: ['companyName','empresa','nomeEmpresa','nameCompany','company','company_name','empresa_nome','nameComapny'],
      contactName: ['contactName','nameContact','name','nome','nomeContato','nomeLead','nameLead','leadName','nomeCompleto'],
      contactEmail: ['contactEmail','emailContact','email','emailLead','contatoEmail','leadEmail','e-mail'],
      contactPhone: ['contactPhone','phoneContact','phone','telefone','celular','whatsapp','phoneLead','telefoneContato'],
      cnpj: ['cnpj','cnpjCompany','cnpjEmpresa','companyCnpj']
    };

    const candidates: string[] = [];
    if (key) candidates.push(key);

    const keyLower = (key || '').toLowerCase();
    // Se a chave é canônica ou um sinônimo, inclui o grupo inteiro
    Object.values(synonymsGroup).forEach(group => {
      if (group.some(g => g.toLowerCase() === keyLower)) {
        group.forEach(k => { if (!candidates.includes(k)) candidates.push(k); });
      }
    });

    // Se o label sugere o significado, inclui o grupo correspondente
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

    // IMPORTANTE: o nível superior de lead.fields é a fonte da verdade (é onde a
    // edição grava). Containers aninhados (leadData/data/fields.fields) são
    // legados/importação e podem ficar desatualizados. Por isso resolvemos
    // primeiro no topo e só caímos para o merge aninhado se não encontrar nada.
    const topLevel = this.isPlainObject((lead as any)?.fields) ? (lead as any).fields : {};
    const fromTop = this.matchFieldValue(topLevel, candidates);
    if (fromTop !== undefined) return String(fromTop);

    const fromNested = this.matchFieldValue(this.collectLeadFields(lead), candidates);
    if (fromNested !== undefined) return String(fromNested);

    return '-';
  }

  // Procura o primeiro candidato presente no objeto de campos, com matching
  // case-insensitive e fuzzy (ignorando caracteres especiais).
  private matchFieldValue(fields: Record<string, any>, candidates: string[]): any {
    if (!this.isPlainObject(fields)) return undefined;
    const lowerMap: Record<string, string> = Object.keys(fields).reduce((acc: any, k: string) => { acc[k.toLowerCase()] = k; return acc; }, {});
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedMap: Record<string, string> = Object.keys(fields).reduce((acc: any, k: string) => { acc[normalize(k)] = k; return acc; }, {});

    const visited = new Set<string>();
    for (const candidate of candidates) {
      const lk = candidate.toLowerCase();
      if (visited.has(lk)) continue; visited.add(lk);
      const original = lowerMap[lk] || normalizedMap[normalize(candidate)] || candidate;
      const value = fields[original];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return value;
      }
    }
    return undefined;
  }

  // Junta os campos do lead a partir de múltiplos containers possíveis e achata
  // objetos aninhados (espelha collectLeadFields do Kanban).
  private collectLeadFields(lead: Lead): Record<string, any> {
    const base = ((lead as any)?.fields || {}) as any;
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

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => {
      return current && current[prop] !== undefined ? current[prop] : null;
    }, obj);
  }

  // Helper methods for template
  getSystemColumns() {
    return this.availableColumns.filter(col => col.type === 'system');
  }

  getFormColumns() {
    return this.availableColumns.filter(col => col.type === 'form');
  }

  hasFormColumns(): boolean {
    return this.availableColumns.filter(col => col.type === 'form').length > 0;
  }

  // Método de debug temporário
  debugLeadStructure() {
    if (this.records.length === 0) {
      alert('Nenhum registro disponível para debug');
      return;
    }

    const lead = this.records[0];

    // Mostrar no alerta
    const debugInfo = {
      leadId: lead.id,
      fieldsKeys: lead.fields ? Object.keys(lead.fields) : 'no fields',
      contactNameResult: this.readFieldValue(lead, 'contactName'),
      contactEmailResult: this.readFieldValue(lead, 'contactEmail'),
      companyNameResult: this.readFieldValue(lead, 'companyName'),
      allFields: lead.fields
    };

    alert('DEBUG INFO (veja console para detalhes):\n' + JSON.stringify(debugInfo, null, 2));
  }


  private calculateHealthMetrics() {
    const total = this.filteredRecords.length;
    if (total === 0) {
      this.winRate = 0;
      this.lossRate = 0;
      this.leadVelocity = 0;
      this.stagnantLeads = [];
      return;
    }

    // Win/Loss rates
    const concluded = this.filteredRecords.filter(r => this.isLeadConcluded(r));
    const lost = concluded.filter(r => {
      const col = this.columns.find(c => c.id === r.columnId);
      return col?.endStageType === 'fail';
    });
    const won = concluded.filter(r => {
      const col = this.columns.find(c => c.id === r.columnId);
      return col?.endStageType === 'success';
    });

    this.winRate = total > 0 ? Math.round((won.length / total) * 100) : 0;
    this.lossRate = total > 0 ? Math.round((lost.length / total) * 100) : 0;

    // Lead velocity (avg days from creation to conclusion)
    if (won.length > 0) {
      const totalDays = won.reduce((sum, lead) => {
        const created = this.getLeadDate(lead);
        const moved = lead.movedToCurrentColumnAt?.toDate ?
          lead.movedToCurrentColumnAt.toDate() :
          (lead.movedToCurrentColumnAt?.seconds ?
            new Date(lead.movedToCurrentColumnAt.seconds * 1000) : new Date());
        return sum + (moved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      }, 0);
      this.leadVelocity = Math.round(totalDays / won.length);
    } else {
      this.leadVelocity = 0;
    }

    // Stagnant leads (active leads in same phase > 7 days)
    const activeLeads = this.filteredRecords.filter(r => !this.isLeadConcluded(r));
    this.stagnantLeads = activeLeads
      .map(lead => {
        const movedDate = lead.movedToCurrentColumnAt?.toDate ?
          lead.movedToCurrentColumnAt.toDate() :
          (lead.movedToCurrentColumnAt?.seconds ?
            new Date(lead.movedToCurrentColumnAt.seconds * 1000) :
            this.getLeadDate(lead));
        const daysInPhase = Math.round((Date.now() - movedDate.getTime()) / (1000 * 60 * 60 * 24));
        const col = this.columns.find(c => c.id === lead.columnId);
        return {
          lead,
          daysInPhase,
          phaseName: col?.name || 'Desconhecida',
          phaseColor: col?.color || '#6B7280',
          contactName: this.readFieldValue(lead, 'contactName')
        };
      })
      .filter(s => s.daysInPhase >= 7)
      .sort((a, b) => b.daysInPhase - a.daysInPhase)
      .slice(0, 20);
  }

  private calculateUserPerformance() {
    const userMap = new Map<string, { name: string; email: string; leads: Lead[] }>();

    this.filteredRecords.forEach(lead => {
      const userId = lead.responsibleUserId || '_unassigned';
      const name = lead.responsibleUserName || lead.responsibleUserEmail || 'Não atribuído';
      const email = lead.responsibleUserEmail || '';

      if (!userMap.has(userId)) {
        userMap.set(userId, { name, email, leads: [] });
      }
      userMap.get(userId)!.leads.push(lead);
    });

    this.userPerformance = Array.from(userMap.entries()).map(([_, data]) => {
      const total = data.leads.length;
      const concluded = data.leads.filter(l => this.isLeadConcluded(l));
      const won = concluded.filter(l => {
        const col = this.columns.find(c => c.id === l.columnId);
        return col?.endStageType === 'success';
      });
      const overdue = data.leads.filter(l => this.isLeadOverdue(l) && !this.isLeadConcluded(l));
      const active = data.leads.filter(l => !this.isLeadConcluded(l));

      let avgDays = 0;
      if (concluded.length > 0) {
        const totalDays = concluded.reduce((sum, lead) => {
          const created = this.getLeadDate(lead);
          const moved = lead.movedToCurrentColumnAt?.toDate ?
            lead.movedToCurrentColumnAt.toDate() : new Date();
          return sum + (moved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        }, 0);
        avgDays = Math.round(totalDays / concluded.length);
      }

      return {
        name: data.name,
        email: data.email,
        totalLeads: total,
        concludedLeads: won.length,
        overdueLeads: overdue.length,
        activeLeads: active.length,
        winRate: total > 0 ? Math.round((won.length / total) * 100) : 0,
        avgConversionDays: avgDays
      };
    }).sort((a, b) => b.totalLeads - a.totalLeads);
  }

  private calculateFunnelStages() {
    const firstPhaseCount = this.filteredRecords.length;
    if (firstPhaseCount === 0) {
      this.funnelStages = [];
      return;
    }

    let cumulativeFromRight = 0;
    const reversedColumns = [...this.columns].reverse();
    const cumulativeCounts = new Map<string, number>();

    reversedColumns.forEach(col => {
      const count = this.filteredRecords.filter(r => r.columnId === col.id).length;
      cumulativeFromRight += count;
      cumulativeCounts.set(col.id!, cumulativeFromRight);
    });

    let prevCount = firstPhaseCount;
    this.funnelStages = this.columns.map((col, index) => {
      const passedThrough = cumulativeCounts.get(col.id!) || 0;
      const count = this.filteredRecords.filter(r => r.columnId === col.id).length;
      const percentage = firstPhaseCount > 0 ? Math.round((passedThrough / firstPhaseCount) * 100) : 0;
      const dropOff = index > 0 ? Math.round(((prevCount - passedThrough) / prevCount) * 100) : 0;
      prevCount = passedThrough;
      return {
        phase: col.name,
        color: col.color,
        count,
        percentage,
        dropOff
      };
    });
  }

  private calculateLeadsOverTime() {
    const now = new Date();
    const daysBack = 30;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysBack);

    const dayMap = new Map<string, number>();
    for (let i = 0; i <= daysBack; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      dayMap.set(key, 0);
    }

    this.filteredRecords.forEach(record => {
      const date = this.getLeadDate(record);
      if (date >= startDate && date <= now) {
        const key = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (dayMap.has(key)) {
          dayMap.set(key, (dayMap.get(key) || 0) + 1);
        }
      }
    });

    this.leadsOverTimeChart = Array.from(dayMap.entries()).map(([label, value]) => ({ label, value }));
  }

  private groupRecordsByPhase() {
    this.groupedRecords = this.columns
      .map(col => ({
        column: col,
        leads: this.filteredRecords.filter(r => r.columnId === col.id)
      }))
      .filter(g => g.leads.length > 0);
  }

  toggleGroupByPhase() {
    this.groupByPhase = !this.groupByPhase;
  }

  getLeadsOverTimeMax(): number {
    if (this.leadsOverTimeChart.length === 0) return 0;
    return Math.max(...this.leadsOverTimeChart.map(d => d.value), 1);
  }

  applyFilters() {
    this.filteredRecords = this.records.filter(record => {
      // Search query filter
      if (this.filterQuery && this.filterQuery.trim()) {
        const searchTerm = this.filterQuery.toLowerCase();
        const searchableFields = [
          this.readFieldValue(record, 'contactName'),
          this.readFieldValue(record, 'contactEmail'),
          this.readFieldValue(record, 'companyName'),
          this.readFieldValue(record, 'contactPhone'),
          this.getColumnName(record.columnId)
        ];
        
        const matches = searchableFields.some(field => 
          field.toLowerCase().includes(searchTerm)
        );
        
        if (!matches) return false;
      }

      // Only mine filter
      if (this.filterOnlyMine && record.responsibleUserId !== this.currentUser?.uid) {
        return false;
      }

      // Dynamic filters
      for (const [fieldName, filterValue] of Object.entries(this.dynamicFilters)) {
        if (filterValue && typeof filterValue === 'string' && filterValue.trim()) {
          const recordValue = this.readFieldValue(record, fieldName).toLowerCase();
          const searchValue = filterValue.toLowerCase();
          if (!recordValue.includes(searchValue)) return false;
        }
      }

      return true;
    });

    // Recalcular métricas dos relatórios após aplicar filtros
    this.calculateSummaryStats();
    this.calculateSLAIndicators();
    this.calculatePhaseMetrics();
    this.generateChartData();
    this.calculateHealthMetrics();
    this.calculateUserPerformance();
    this.calculateFunnelStages();
    this.calculateLeadsOverTime();
    this.groupRecordsByPhase();

    // Regenerar gráfico dinâmico com os registros filtrados
    if (this.selectedChartField) {
      const chartData = this.generateChartForField(this.selectedChartField);
      this.chartData.dynamicCharts = [chartData];
    }
  }

  exportToExcel() {
    if (this.filteredRecords.length === 0) {
      alert('Não há registros para exportar.');
      return;
    }

    // Usa as mesmas colunas selecionadas na tabela (e o mesmo resolvedor de valores)
    const columns = this.getSelectedColumns();
    const exportData = this.filteredRecords.map(record => {
      const row: any = {};
      columns.forEach(column => {
        const value = this.getColumnValue(record, column);
        row[column.label] = value === '-' ? '' : value;
      });
      return row;
    });

    if (exportData.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    // Gerar planilha .xlsx nativa
    const headers = columns.map(c => c.label);
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

    // Largura aproximada das colunas com base no conteúdo
    worksheet['!cols'] = headers.map(header => {
      const maxLen = Math.max(
        header.length,
        ...exportData.map(row => String(row[header] ?? '').length)
      );
      return { wch: Math.min(Math.max(maxLen + 2, 10), 60) };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros');

    const boardName = this.board?.name || 'Board';
    const currentDate = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    XLSX.writeFile(workbook, `${boardName}_Relatório_${currentDate}.xlsx`);
  }

  // Dynamic Charts Methods
  private generateAvailableChartFields() {
    // Usar apenas os campos configurados com showInFilters: true
    // Baseado nos logs: segmento, origem, temperatura
    const fields = new Set<string>();

    // Add default fields
    fields.add('fase');
    fields.add('responsavel');

    // Add only the 3 specific fields that are configured
    // These are the only ones with showInFilters: true according to the logs
    fields.add('segmento');
    fields.add('origem');
    fields.add('temperatura');

    this.availableChartFields = Array.from(fields).sort();
    
    // Set default selection
    if (!this.selectedChartField && this.availableChartFields.length > 0) {
      this.selectedChartField = this.availableChartFields.includes('segmento') ? 'segmento' : this.availableChartFields[0];
    }
  }

  private generateDynamicCharts() {
    this.generateAvailableChartFields();
    
    if (!this.selectedChartField) return;
    
    const chartData = this.generateChartForField(this.selectedChartField);
    this.chartData.dynamicCharts = [chartData];
  }

  private generateChartForField(fieldName: string): any {
    const data = new Map<string, number>();

    // IMPORTANTE: Usar this.filteredRecords que já está filtrado pela pesquisa geral
    // e pelos filtros dinâmicos aplicados
    this.filteredRecords.forEach(record => {
      let value = '';
      
      switch (fieldName) {
        case 'fase':
          value = this.getColumnName(record.columnId) || 'Sem Fase';
          break;
        case 'responsavel':
          value = record.responsibleUserName || record.responsibleUserEmail || record.responsibleUserId || 'Não Atribuído';
          break;
        case 'origem':
          value = record.fields?.['origem'] || record.fields?.['source'] || 'Não Informado';
          break;
        case 'segmento':
          value = record.fields?.['segmento'] || record.fields?.['segment'] || 'Não Informado';
          break;
        case 'temperatura':
          value = record.fields?.['temperatura'] || 'Não Informado';
          break;
        default:
          value = record.fields?.[fieldName] || 'Não Informado';
      }
      
      value = String(value).trim() || 'Não Informado';
      data.set(value, (data.get(value) || 0) + 1);
    });
    
    // Convert to chart format
    const chartItems = Array.from(data.entries())
      .map(([name, count]) => ({
        name,
        value: count,
        color: this.generateColorForItem(name)
      }))
      .sort((a, b) => b.value - a.value) // Sort by count descending
      .slice(0, 10); // Limit to top 10

    return {
      fieldName,
      fieldLabel: this.getFieldLabel(fieldName),
      items: chartItems,
      total: this.filteredRecords.length
    };
  }

  onChartFieldChange() {
    this.generateDynamicCharts();
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'fase': 'Fases',
      'responsavel': 'Responsáveis',
      'origem': 'Origem',
      'segmento': 'Segmento',
      'source': 'Origem',
      'segment': 'Segmento',
      'contactName': 'Nome do Contato',
      'companyName': 'Nome da Empresa',
      'produto': 'Produto',
      'interesse': 'Interesse'
    };
    
    return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }

  private generateColorForItem(itemName: string): string {
    // Generate consistent colors based on item name
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
    ];
    
    let hash = 0;
    for (let i = 0; i < itemName.length; i++) {
      hash = itemName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  getDynamicChartMaxValue(): number {
    if (!this.chartData.dynamicCharts.length || !this.chartData.dynamicCharts[0].items.length) return 0;
    const maxValue = Math.max(...this.chartData.dynamicCharts[0].items.map((item: any) => item.value));
    return maxValue;
  }

  getDynamicChartPercentage(value: number): number {
    const maxValue = this.getDynamicChartMaxValue();
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  }

  // TrackBy function para otimizar renderização
  trackByIndex(index: number, item: any): number {
    return index;
  }
}