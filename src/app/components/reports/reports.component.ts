import { Component, inject, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Lead, Column, Board } from '../../services/firestore.service';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { CompanyBreadcrumbComponent } from '../company-breadcrumb/company-breadcrumb.component';
import { AdvancedFiltersComponent } from '../advanced-filters/advanced-filters.component';


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

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, MainLayoutComponent, CompanyBreadcrumbComponent, AdvancedFiltersComponent],
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
  currentView: 'overview' | 'sla' | 'phases' | 'registros' = 'overview';
  exportFormats = ['PDF', 'Excel', 'CSV'];
  
  // Column management for registros table
  availableColumns: any[] = [];
  selectedColumns: string[] = [];
  showColumnSelector = false;
  viewTabs = [
    { key: 'overview', name: 'Visão Geral', icon: 'fa-chart-pie' },
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
      console.log('📊 ngOnInit - Carregando dados para boardId:', this.boardId);
      await this.loadData();
      this.initializeColumns();
      this.generateReport();
      console.log('📊 ngOnInit - Dados carregados e relatório gerado');
    } else {
      console.log('📊 ngOnInit - Não há boardId ou ownerId definido');
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
      
      // Debug: verificar estrutura dos dados de responsáveis
      console.log('🔍 Debug estrutura dos registros:', {
        totalRegistros: registros.length,
        primeiroRegistro: registros[0],
        camposResponsavel: registros.map(r => ({
          id: r.id,
          responsibleUserName: r.responsibleUserName,
          responsibleUserId: r.responsibleUserId,
          responsibleUserEmail: r.responsibleUserEmail
        })).slice(0, 5) // primeiros 5
      });

      // Note: Form field configuration now handled by AdvancedFiltersComponent

      console.log('Dados carregados:', {
        boardId: this.boardId,
        recordsCount: registros.length,
        columnsCount: columns.length,
        formFieldsCount: (this.board as any)?.initialFormFields?.length || 0,
        registros: registros.slice(0, 3) // Log first 3 registros for debugging
      });

      // Debug form fields structure
      if (registros.length > 0 && registros[0].fields) {
        console.log('📋 Campos disponíveis no primeiro registro:', Object.keys(registros[0].fields));
      }

    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
    } finally {
      this.isLoading = false;
    }
  }

  generateReport() {
    if (this.isGeneratingReport) return;
    
    console.log('📊 === INICIO generateReport ===');
    console.log('📊 Dados disponíveis:', {
      records: this.records.length,
      columns: this.columns.length,
      filterQuery: this.filterQuery,
      dynamicFilters: this.dynamicFilters
    });
    
    this.isGeneratingReport = true;
    try {
      // Apply current filters
      this.applyFilters();
      this.calculateSummaryStats();
      this.calculateSLAIndicators();
      this.calculatePhaseMetrics();
      this.generateChartData();
      
      // Força a detecção de mudanças para garantir que os gráficos sejam renderizados
      this.cdr.detectChanges();
      
      console.log('📊 === FIM generateReport ===');
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
    console.log('📊 === INICIO calculatePhaseMetrics ===');
    console.log('📊 Colunas disponíveis:', this.columns);
    console.log('📊 Registros filtrados:', this.filteredRecords.length);

    this.phaseMetrics = this.columns.map(column => {
      const registrosInPhase = this.filteredRecords.filter(record => record.columnId === column.id);
      const avgTime = this.calculateAverageTimeInPhase(registrosInPhase);
      const conversionRate = this.calculatePhaseConversionRate(column);

      console.log(`📊 Fase ${column.name}:`, {
        columnId: column.id,
        registrosInPhase: registrosInPhase.length,
        avgTime,
        conversionRate,
        color: column.color
      });

      return {
        phaseId: column.id!,
        phaseName: column.name,
        phaseColor: column.color,
        recordsCount: registrosInPhase.length,
        avgTimeInPhase: avgTime,
        conversionRate: conversionRate
      };
    });

    console.log('📊 phaseMetrics final:', this.phaseMetrics);
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
    console.log('📊 === INICIO generateChartData ===');
    console.log('📊 phaseMetrics disponíveis:', this.phaseMetrics);
    console.log('📊 columns disponíveis:', this.columns);
    console.log('📊 filteredRecords disponíveis:', this.filteredRecords.length);

    // Phase distribution
    this.chartData.phaseDistribution = this.phaseMetrics.map(metric => ({
      name: metric.phaseName,
      value: metric.recordsCount,
      color: metric.phaseColor
    }));

    // Debug: Log chart data
    console.log('📊 Chart Data Generated:', {
      phaseMetrics: this.phaseMetrics,
      phaseDistribution: this.chartData.phaseDistribution,
      columnsCount: this.columns.length,
      recordsCount: this.filteredRecords.length
    });

    console.log('📊 phaseDistribution final:', this.chartData.phaseDistribution);
    console.log('📊 Primeiro item do phaseDistribution:', this.chartData.phaseDistribution[0]);
    console.log('📊 Segundo item do phaseDistribution:', this.chartData.phaseDistribution[1]);

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
  setView(view: 'overview' | 'sla' | 'phases' | 'registros') {
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
      console.log(`Exportando relatório em formato ${format}`);
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
    
    console.log('🔍 Campos do formulário para colunas:', formFields);
    
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

    console.log('📊 Colunas disponíveis inicializadas:', this.availableColumns);
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
          'companyName', 
          'currentPhase',
          'createdAt',
          'status'
        ];
      }
    } catch (error) {
      console.warn('Could not load selected columns from localStorage:', error);
      this.selectedColumns = ['contactName', 'contactEmail', 'companyName', 'currentPhase', 'createdAt', 'status'];
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
        // For dynamic form fields, try to get from fields object
        const value = lead.fields?.[column.key];
        if (value !== undefined && value !== null && value !== '') {
          return String(value);
        }
        
        // Fallback to nested property access
        const nestedValue = this.getNestedProperty(lead, column.field);
        return nestedValue ? String(nestedValue) : '-';
    }
  }

  // Method inspired by the Kanban component's readFieldValue
  private readFieldValue(lead: Lead, key: string): string {
    if (!lead.fields) return '-';

    // Synonyms mapping based on Kanban component
    const synonymsGroup: Record<string, string[]> = {
      companyName: ['companyName','empresa','nomeEmpresa','nameCompany','company','company_name','empresa_nome','nameComapny'],
      contactName: ['contactName','name','nome','nomeLead','nameLead','leadName'],
      contactEmail: ['contactEmail','email','emailLead','contatoEmail','leadEmail'],
      contactPhone: ['contactPhone','phone','telefone','celular','phoneLead','telefoneContato'],
      cnpj: ['cnpj','cnpjCompany','cnpjEmpresa','companyCnpj']
    };

    // Get all possible field names for this key
    const candidates = synonymsGroup[key] || [key];
    
    // Try each candidate until we find a value
    for (const candidate of candidates) {
      const value = lead.fields[candidate];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return String(value);
      }
    }
    
    return '-';
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
    console.log('🐛 DEBUG COMPLETO DO LEAD:');
    console.log('🐛 Lead completo:', lead);
    console.log('🐛 Lead.fields:', lead.fields);
    console.log('🐛 Chaves dos fields:', lead.fields ? Object.keys(lead.fields) : 'sem fields');
    console.log('🐛 Valores dos fields:', lead.fields ? Object.entries(lead.fields) : 'sem entries');

    // Testar especificamente os campos problemáticos
    console.log('🐛 TESTANDO CAMPOS PROBLEMÁTICOS:');
    console.log('🐛 contactName tentativas:', [
      lead.fields?.['contactName'],
      lead.fields?.['name'], 
      lead.fields?.['nome']
    ]);
    console.log('🐛 contactEmail tentativas:', [
      lead.fields?.['contactEmail'],
      lead.fields?.['email']
    ]);

    // Mostrar resultado do método readFieldValue
    console.log('🐛 RESULTADO DOS MÉTODOS:');
    console.log('🐛 readFieldValue(contactName):', this.readFieldValue(lead, 'contactName'));
    console.log('🐛 readFieldValue(contactEmail):', this.readFieldValue(lead, 'contactEmail'));
    console.log('🐛 readFieldValue(companyName):', this.readFieldValue(lead, 'companyName'));

    // Mostrar no alerta também
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


  applyFilters() {
    console.log('=== APLICANDO FILTROS KANBAN-STYLE ===');
    console.log('filterQuery:', this.filterQuery);
    console.log('filterOnlyMine:', this.filterOnlyMine);
    console.log('dynamicFilters:', this.dynamicFilters);
    console.log('Total de registros disponíveis:', this.records.length);
    
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
    
    console.log('=== RESULTADO DOS FILTROS ===');
    console.log(`${this.records.length} registros total -> ${this.filteredRecords.length} registros filtrados`);
    
    // Recalcular métricas dos relatórios após aplicar filtros
    this.calculateSummaryStats();
    this.calculateSLAIndicators();
    this.calculatePhaseMetrics();
    this.generateChartData();
    
    console.log('📊 Após applyFilters - chartData.phaseDistribution:', this.chartData.phaseDistribution);
    
    // Regenerar gráfico dinâmico com os registros filtrados
    if (this.selectedChartField) {
      console.log('📊 Regenerando gráfico dinâmico após aplicar filtros...');
      const chartData = this.generateChartForField(this.selectedChartField);
      this.chartData.dynamicCharts = [chartData];
    }
  }

  exportToExcel() {
    if (this.filteredRecords.length === 0) {
      alert('Não há registros para exportar.');
      return;
    }

    // Preparar dados para exportação
    const exportData = this.filteredRecords.map(record => {
      const data: any = {};
      
      // Campos básicos
      data['ID'] = record.id;
      data['Fase'] = this.getColumnName(record.columnId);
      data['Responsável'] = record.responsibleUserId || 'Não atribuído';
      data['Data de Criação'] = record.createdAt ? new Date(record.createdAt.toDate()).toLocaleDateString('pt-BR') : '';
      
      // Campos dinâmicos
      if (record.fields) {
        Object.entries(record.fields).forEach(([key, value]) => {
          data[key] = value || '';
        });
      }
      
      return data;
    });

    // Criar conteúdo CSV
    if (exportData.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escapar aspas e envolver em aspas se contiver vírgula
          const escapedValue = String(value).replace(/"/g, '""');
          return escapedValue.includes(',') ? `"${escapedValue}"` : escapedValue;
        }).join(',')
      )
    ].join('\n');

    // Criar e baixar arquivo
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const boardName = this.board?.name || 'Board';
    const currentDate = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    link.setAttribute('download', `${boardName}_Relatório_${currentDate}.csv`);
    
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Exported ${this.filteredRecords.length} records to Excel`);
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
    
    console.log('📊 Campos fixos para gráfico dinâmico:', Array.from(fields));
    
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
    console.log(`📊 Gerando gráfico para campo "${fieldName}" com ${this.filteredRecords.length} registros filtrados`);
    
    this.filteredRecords.forEach(record => {
      let value = '';
      
      switch (fieldName) {
        case 'fase':
          value = this.getColumnName(record.columnId) || 'Sem Fase';
          break;
        case 'responsavel':
          // Debug para ver todos os possíveis campos de responsável
          console.log(`📊 Debug responsável para registro ${record.id}:`, {
            responsibleUserName: record.responsibleUserName,
            responsibleUserId: record.responsibleUserId,
            responsibleUserEmail: record.responsibleUserEmail,
            allKeys: Object.keys(record)
          });
          
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
    
    console.log(`📊 Gráfico para "${fieldName}" gerado com ${chartItems.length} itens:`, chartItems);
    
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