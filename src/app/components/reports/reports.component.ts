import { Component, inject, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  totalLeads: number;
  onTime: number;
  overdue: number;
  compliance: number;
}

interface PhaseMetric {
  phaseId: string;
  phaseName: string;
  phaseColor: string;
  leadsCount: number;
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
  leads: Lead[] = [];
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
  filteredLeads: Lead[] = [];
  slaIndicators: SLAIndicator[] = [];
  phaseMetrics: PhaseMetric[] = [];
  summaryStats = {
    totalLeads: 0,
    newLeadsThisPeriod: 0,
    convertedLeads: 0,
    avgConversionTime: 0,
    activeLeads: 0,
    overdueLeads: 0
  };

  // Chart data
  chartData = {
    phaseDistribution: [] as any[],
    leadsOverTime: [] as any[],
    conversionFunnel: [] as any[]
  };

  // Display options
  currentView: 'overview' | 'sla' | 'phases' | 'leads' | 'charts' = 'overview';
  exportFormats = ['PDF', 'Excel', 'CSV'];
  viewTabs = [
    { key: 'overview', name: 'Visão Geral', icon: 'fa-chart-pie' },
    { key: 'sla', name: 'SLA', icon: 'fa-clock' },
    { key: 'phases', name: 'Fases', icon: 'fa-columns' },
    { key: 'leads', name: 'Leads', icon: 'fa-users' },
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

    // Load available boards
    await this.loadAvailableBoards();

    // If boardId is set (from input or URL), load data directly
    if (this.boardId && this.ownerId) {
      await this.loadData();
      this.setupFormSubscriptions();
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
    this.filtersForm.valueChanges.subscribe(() => {
      this.generateReport();
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
    this.setupFormSubscriptions();
    this.generateReport();
  }

  setDateRangeFilter(range: 'week' | 'month' | '3months' | '6months' | 'all') {
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
      case 'all':
        this.filtersForm.patchValue({
          startDate: '',
          endDate: ''
        });
        return;
    }
    
    this.filtersForm.patchValue({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  }

  private async loadData() {
    this.isLoading = true;
    try {
      // Load board info
      const boards = await this.firestoreService.getBoards(this.ownerId);
      this.board = boards.find(b => b.id === this.boardId) || null;

      // Load leads and columns in parallel
      const [leads, columns] = await Promise.all([
        this.firestoreService.getLeads(this.ownerId, this.boardId),
        this.firestoreService.getColumns(this.ownerId, this.boardId)
      ]);

      this.leads = leads;
      this.columns = columns;
      this.users = []; // Será implementado posteriormente

      console.log('Dados carregados:', {
        boardId: this.boardId,
        leadsCount: leads.length,
        columnsCount: columns.length,
        leads: leads.slice(0, 3) // Log first 3 leads for debugging
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
    console.log('Aplicando filtros:', filters);
    console.log('Total de leads antes do filtro:', this.leads.length);
    
    this.filteredLeads = this.leads.filter(lead => {
      // Date filter - only apply if dates are provided and valid
      if (filters.startDate && filters.endDate) {
        const leadDate = this.getLeadDate(lead);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // Include end of day
        
        console.log('Verificando data do lead:', {
          leadDate: leadDate,
          startDate: startDate,
          endDate: endDate,
          isInRange: leadDate >= startDate && leadDate <= endDate
        });
        
        if (leadDate < startDate || leadDate > endDate) {
          return false;
        }
      }

      // Phase filter
      if (filters.phases && filters.phases.length > 0 && !filters.phases.includes(lead.columnId)) {
        return false;
      }

      // Responsible filter
      if (filters.responsible && filters.responsible.length > 0 && lead.responsibleUserId && 
          !filters.responsible.includes(lead.responsibleUserId)) {
        return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        const isOverdue = this.isLeadOverdue(lead);
        const isConcluded = this.isLeadConcluded(lead);
        
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
    
    console.log('Leads após filtro:', this.filteredLeads.length);
    console.log('Primeiros leads filtrados:', this.filteredLeads.slice(0, 3));
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
      totalLeads: this.filteredLeads.length,
      newLeadsThisPeriod: this.filteredLeads.filter(lead => {
        const leadDate = this.getLeadDate(lead);
        return leadDate >= startDate && leadDate <= endDate;
      }).length,
      convertedLeads: this.filteredLeads.filter(lead => this.isLeadConcluded(lead)).length,
      avgConversionTime: this.calculateAverageConversionTime(),
      activeLeads: this.filteredLeads.filter(lead => !this.isLeadConcluded(lead)).length,
      overdueLeads: this.filteredLeads.filter(lead => this.isLeadOverdue(lead) && !this.isLeadConcluded(lead)).length
    };
  }

  private calculateAverageConversionTime(): number {
    const convertedLeads = this.filteredLeads.filter(lead => this.isLeadConcluded(lead));
    if (convertedLeads.length === 0) return 0;

    const totalTime = convertedLeads.reduce((sum, lead) => {
      const createdDate = this.getLeadDate(lead);
      const movedDate = lead.movedToCurrentColumnAt?.toDate ? 
        lead.movedToCurrentColumnAt.toDate() : new Date();
      return sum + (movedDate.getTime() - createdDate.getTime());
    }, 0);

    return Math.round(totalTime / convertedLeads.length / (1000 * 60 * 60 * 24)); // Days
  }

  private calculateSLAIndicators() {
    this.slaIndicators = this.columns
      .filter(col => col.slaDays && col.slaDays > 0)
      .map(column => {
        const leadsInPhase = this.filteredLeads.filter(lead => lead.columnId === column.id);
        const overdueLeads = leadsInPhase.filter(lead => this.isLeadOverdue(lead));
        const onTimeLeads = leadsInPhase.length - overdueLeads.length;
        
        return {
          phaseId: column.id!,
          phaseName: column.name,
          phaseColor: column.color,
          slaDays: column.slaDays,
          totalLeads: leadsInPhase.length,
          onTime: onTimeLeads,
          overdue: overdueLeads.length,
          compliance: leadsInPhase.length > 0 ? Math.round((onTimeLeads / leadsInPhase.length) * 100) : 100
        };
      });
  }

  private calculatePhaseMetrics() {
    this.phaseMetrics = this.columns.map(column => {
      const leadsInPhase = this.filteredLeads.filter(lead => lead.columnId === column.id);
      const avgTime = this.calculateAverageTimeInPhase(leadsInPhase);
      const conversionRate = this.calculatePhaseConversionRate(column);

      return {
        phaseId: column.id!,
        phaseName: column.name,
        phaseColor: column.color,
        leadsCount: leadsInPhase.length,
        avgTimeInPhase: avgTime,
        conversionRate: conversionRate
      };
    });
  }

  private calculateAverageTimeInPhase(leads: Lead[]): number {
    if (leads.length === 0) return 0;

    const totalTime = leads.reduce((sum, lead) => {
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

    return Math.round(totalTime / leads.length / (1000 * 60 * 60 * 24)); // Days
  }

  private calculatePhaseConversionRate(column: Column): number {
    const currentIndex = this.columns.findIndex(c => c.id === column.id);
    if (currentIndex === this.columns.length - 1) return 0; // Last phase

    const leadsInCurrentPhase = this.filteredLeads.filter(lead => lead.columnId === column.id).length;
    const nextPhases = this.columns.slice(currentIndex + 1);
    const leadsInNextPhases = this.filteredLeads.filter(lead => 
      nextPhases.some(p => p.id === lead.columnId)
    ).length;

    const totalProgressed = leadsInCurrentPhase + leadsInNextPhases;
    return totalProgressed > 0 ? Math.round((leadsInNextPhases / totalProgressed) * 100) : 0;
  }

  private generateChartData() {
    // Phase distribution
    this.chartData.phaseDistribution = this.phaseMetrics.map(metric => ({
      name: metric.phaseName,
      value: metric.leadsCount,
      color: metric.phaseColor
    }));

    // Leads over time (simplified)
    this.chartData.leadsOverTime = this.generateLeadsOverTimeData();

    // Conversion funnel
    this.chartData.conversionFunnel = this.phaseMetrics.map((metric, index) => ({
      phase: metric.phaseName,
      leads: metric.leadsCount,
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
      
      const leadsInWeek = this.filteredLeads.filter(lead => {
        const leadDate = this.getLeadDate(lead);
        return leadDate >= current && leadDate <= weekEnd;
      }).length;

      data.push({
        period: `${current.getDate()}/${current.getMonth() + 1}`,
        leads: leadsInWeek
      });

      current.setDate(current.getDate() + 7);
    }

    return data;
  }

  // View methods
  setView(view: 'overview' | 'sla' | 'phases' | 'leads' | 'charts') {
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
    if (this.chartData.leadsOverTime.length === 0) return 0;
    const maxValue = Math.max(...this.chartData.leadsOverTime.map(d => d.leads));
    return maxValue > 0 ? (value / maxValue * 100) : 0;
  }
}