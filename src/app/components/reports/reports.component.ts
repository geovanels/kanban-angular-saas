import { Component, inject, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Lead, Column, Board } from '../../services/firestore.service';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { CompanyBreadcrumbComponent } from '../company-breadcrumb/company-breadcrumb.component';

interface ReportFilters {
  startDate: string;
  endDate: string;
  phases: string[];
  responsible: string[];
  status: 'all' | 'active' | 'concluded' | 'overdue';
}

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MainLayoutComponent, CompanyBreadcrumbComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  @Input() boardId: string = '';
  @Input() ownerId: string = '';
  currentUser: any = null;
  board: Board | null = null;
  availableBoards: Board[] = [];
  
  // Data
  records: Lead[] = [];
  columns: Column[] = [];
  users: any[] = [];
  
  // Filters
  filtersForm: FormGroup = this.fb.group({
    startDate: [''], // Start empty to show all data initially
    endDate: [''],   // Start empty to show all data initially
    phases: [[]],
    responsible: [[]],
    status: ['all']
  });

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
    conversionFunnel: [] as any[]
  };

  // Display options
  currentView: 'overview' | 'sla' | 'phases' | 'registros' | 'charts' = 'overview';
  exportFormats = ['PDF', 'Excel', 'CSV'];
  viewTabs = [
    { key: 'overview', name: 'Visão Geral', icon: 'fa-chart-pie' },
    { key: 'sla', name: 'SLA', icon: 'fa-clock' },
    { key: 'phases', name: 'Fases', icon: 'fa-columns' },
    { key: 'registros', name: 'Leads', icon: 'fa-users' },
    { key: 'charts', name: 'Gráficos', icon: 'fa-chart-bar' }
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

    // Setup form subscriptions immediately for real-time filtering
    this.setupFormSubscriptions();

    // Load available boards
    await this.loadAvailableBoards();

    // If boardId is set (from input or URL), load data directly
    if (this.boardId && this.ownerId) {
      await this.loadData();
      this.generateReport();
    }
  }

  ngOnDestroy() {
    // Cleanup subscriptions if any
  }

  private getDefaultStartDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 6); // Last 6 months
    return date.toISOString().split('T')[0];
  }

  private getDefaultEndDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private setupFormSubscriptions() {
    // Subscribe to form changes for real-time filtering - no debounce for quick response
    this.filtersForm.valueChanges.subscribe(values => {
      console.log('=== FORM VALUES CHANGED ===');
      console.log('New values:', values);
      console.log('Current state:', {
        boardId: this.boardId,
        ownerId: this.ownerId,
        recordsCount: this.records.length,
        hasData: this.boardId && this.ownerId && this.records.length > 0
      });
      
      if (this.boardId && this.ownerId && this.records.length > 0) {
        console.log('Conditions met - generating report...');
        this.generateReport();
      } else {
        console.log('Conditions not met - skipping report generation');
      }
    });
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
    this.generateReport();
  }

  setDateRangeFilter(range: 'week' | 'month' | '3months' | '6months' | 'all') {
    console.log('=== Aplicando filtro de período:', range, '===');
    console.log('Total de registros disponíveis:', this.records.length);
    
    if (range === 'all') {
      console.log('Removendo filtros de data - mostrando todos os dados');
      this.filtersForm.patchValue({
        startDate: '',
        endDate: ''
      });
      return; // Let the form subscription handle the update
    }
    
    const endDate = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    console.log('Definindo período:', { 
      range, 
      startDate: startDateStr, 
      endDate: endDateStr,
      startDateObj: startDate,
      endDateObj: endDate
    });
    
    // Patch the form - this will trigger the subscription automatically
    this.filtersForm.patchValue({
      startDate: startDateStr,
      endDate: endDateStr
    });
  }

  clearFilters() {
    console.log('Limpando todos os filtros...');
    this.filtersForm.reset({
      startDate: '',
      endDate: '',
      phases: [],
      responsible: [],
      status: 'all'
    });
  }

  private async loadData() {
    this.isLoading = true;
    try {
      // Load board info
      const boards = await this.firestoreService.getBoards(this.ownerId);
      this.board = boards.find(b => b.id === this.boardId) || null;

      // Load registros and columns in parallel
      const [registros, columns] = await Promise.all([
        this.firestoreService.getLeads(this.ownerId, this.boardId),
        this.firestoreService.getColumns(this.ownerId, this.boardId)
      ]);

      this.records = registros;
      this.columns = columns;
      this.users = []; // Será implementado posteriormente

      console.log('Dados carregados:', {
        boardId: this.boardId,
        recordsCount: registros.length,
        columnsCount: columns.length,
        registros: registros.slice(0, 3) // Log first 3 registros for debugging
      });

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
      const filters = this.filtersForm.value;
      this.applyFilters(filters);
      this.calculateSummaryStats();
      this.calculateSLAIndicators();
      this.calculatePhaseMetrics();
      this.generateChartData();
    } finally {
      this.isGeneratingReport = false;
    }
  }

  private applyFilters(filters: ReportFilters) {
    console.log('=== INICIANDO FILTROS ===');
    console.log('Filtros recebidos:', filters);
    console.log('Total de registros disponíveis:', this.records.length);
    
    // Log das primeiras datas dos registros para debug
    if (this.records.length > 0) {
      console.log('Amostra de datas dos registros:', this.records.slice(0, 3).map(record => ({
        id: record.id,
        createdAt: record.createdAt,
        date: this.getLeadDate(record)
      })));
    }
    
    this.filteredRecords = this.records.filter(record => {
      let passedDateFilter = true;
      
      // Date filter - apply if ANY date filter is provided
      if ((filters.startDate && filters.startDate.trim() !== '') || 
          (filters.endDate && filters.endDate.trim() !== '')) {
        
        console.log('Aplicando filtro de data...');
        const leadDate = this.getLeadDate(record);
        
        // Check start date if provided
        if (filters.startDate && filters.startDate.trim() !== '') {
          const startDate = new Date(filters.startDate);
          if (leadDate < startDate) {
            console.log(`Lead ${record.id} excluído: data ${leadDate.toISOString().split('T')[0]} < ${startDate.toISOString().split('T')[0]}`);
            return false;
          }
        }
        
        // Check end date if provided  
        if (filters.endDate && filters.endDate.trim() !== '') {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999); // Include end of day
          if (leadDate > endDate) {
            console.log(`Lead ${record.id} excluído: data ${leadDate.toISOString().split('T')[0]} > ${endDate.toISOString().split('T')[0]}`);
            return false;
          }
        }
        
        console.log(`Lead ${record.id} passou no filtro de data: ${leadDate.toISOString().split('T')[0]}`);
      } else {
        console.log('Nenhum filtro de data aplicado - campos vazios');
      }

      // Phase filter
      if (filters.phases && filters.phases.length > 0 && !filters.phases.includes(record.columnId)) {
        return false;
      }

      // Responsible filter
      if (filters.responsible && filters.responsible.length > 0 && record.responsibleUserId && 
          !filters.responsible.includes(record.responsibleUserId)) {
        return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        const isOverdue = this.isLeadOverdue(record);
        const isConcluded = this.isLeadConcluded(record);
        
        switch (filters.status) {
          case 'active':
            return !isConcluded;
          case 'concluded':
            return isConcluded;
          case 'overdue':
            return isOverdue && !isConcluded;
        }
      }

      return true;
    });
    
    console.log('=== RESULTADO DOS FILTROS ===');
    console.log(`${this.records.length} registros total -> ${this.filteredRecords.length} registros filtrados`);
    console.log('Primeiros registros filtrados:', this.filteredRecords.slice(0, 3).map(record => ({
      id: record.id,
      date: this.getLeadDate(record).toISOString().split('T')[0]
    })));
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
    const filters = this.filtersForm.value;
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);

    this.summaryStats = {
      totalRecords: this.filteredRecords.length,
      newRecordsThisPeriod: this.filteredRecords.filter(record => {
        const leadDate = this.getLeadDate(record);
        return leadDate >= startDate && leadDate <= endDate;
      }).length,
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
  }

  private generateLeadsOverTimeData(): any[] {
    // Simplified implementation - group by week
    const filters = this.filtersForm.value;
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
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
  setView(view: 'overview' | 'sla' | 'phases' | 'registros' | 'charts') {
    this.currentView = view;
  }

  isStandaloneView(): boolean {
    // Check if accessed via direct URL (has query params) vs embedded in kanban
    return !!this.route.snapshot.queryParams['boardId'];
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
}