import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BoardStoreService } from '../../services/board-store.service';
import { FirestoreService, Column } from '../../services/firestore.service';
import { ToastService } from '../toast/toast.service';
import { ColumnModalComponent } from '../column-modal/column-modal.component';
import { AutomationModal } from '../automation-modal/automation-modal';
import { PhaseFormModalComponent } from '../phase-form-modal/phase-form-modal.component';

@Component({
  selector: 'app-board-flow',
  standalone: true,
  imports: [CommonModule, ColumnModalComponent, AutomationModal, PhaseFormModalComponent],
  templateUrl: './board-flow.component.html',
  styleUrls: ['./board-flow.component.scss']
})
export class BoardFlowComponent implements OnInit, OnDestroy {
  boardStore = inject(BoardStoreService);
  private firestoreService = inject(FirestoreService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private subs: Subscription[] = [];

  @ViewChild('flowScroller') flowScroller?: ElementRef;
  @ViewChild('flowCustomBar') flowCustomBar?: ElementRef;
  @ViewChild(ColumnModalComponent) columnModal!: ColumnModalComponent;
  @ViewChild(PhaseFormModalComponent) phaseFormModal!: PhaseFormModalComponent;

  columns: Column[] = [];
  automations: any[] = [];

  flowConfig: { allowed: Record<string, string[]> } = { allowed: {} };
  flowOrder: string[] = [];
  flowEdges: Array<{ fromId: string; toId: string }> = [];
  pendingFromId: string | null = null;

  flowThumbPercent = 100;
  flowThumbLeftPercent = 0;

  selectedPhaseIdForAutomations: string | null = null;
  showAutomationModal = false;
  selectedAutomation: any = null;
  showAutomationDeleteConfirm = false;
  automationPendingDelete: any = null;

  isManualReorder = false;

  ngOnInit() {
    this.subs.push(this.boardStore.columns$.subscribe(c => {
      this.columns = c;
      this.syncFlowOrderWithColumns();
    }));
    this.subs.push(this.boardStore.automations$.subscribe(a => this.automations = a));
    this.loadFlowConfig();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateFlowThumb(), 300);
  }

  getColumnById(id: string): Column | undefined {
    return this.columns.find(c => c.id === id);
  }

  // Flow config
  async loadFlowConfig() {
    try {
      const cfg = await this.firestoreService.getFlowConfig(this.boardStore.boardId);
      this.flowConfig = (cfg as any) || { allowed: {} };
      const sortedIds = [...this.columns].sort((a, b) => (a.order || 0) - (b.order || 0)).map(c => c.id!);
      this.flowOrder = sortedIds;

      const edges: Array<{ fromId: string; toId: string }> = [];
      const allowed = this.flowConfig.allowed || {};
      Object.keys(allowed).forEach(fromId => {
        (allowed[fromId] || []).forEach(toId => edges.push({ fromId, toId }));
      });
      this.flowEdges = edges;
    } catch {
      this.flowConfig = { allowed: {} };
      this.flowOrder = [...this.columns].sort((a, b) => (a.order || 0) - (b.order || 0)).map(c => c.id!);
    }
  }

  async saveFlowConfig() {
    try {
      const normalize = (v: any) => (typeof v === 'string' ? v.trim() : String(v || '').trim());
      const allowed: Record<string, string[]> = {};
      for (const edge of (this.flowEdges || [])) {
        const fromId = normalize(edge.fromId);
        const toId = normalize(edge.toId);
        if (!fromId || !toId) continue;
        if (!allowed[fromId]) allowed[fromId] = [];
        if (!allowed[fromId].includes(toId)) allowed[fromId].push(toId);
      }
      await this.firestoreService.saveFlowConfig(this.boardStore.boardId, { allowed, edges: this.flowEdges, order: this.flowOrder });
      this.flowConfig = { allowed };
      this.toast.success('Fluxo salvo com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
      this.toast.error('Erro ao salvar fluxo.');
    }
  }

  private syncFlowOrderWithColumns() {
    if (this.isManualReorder) return;
    const sortedIds = [...this.columns].sort((a, b) => (a.order || 0) - (b.order || 0)).map(c => c.id!);
    if (!Array.isArray(this.flowOrder) || this.flowOrder.length === 0) {
      this.flowOrder = sortedIds;
      return;
    }
    const flowOrderMatchesColumnOrder = this.flowOrder.length === sortedIds.length && this.flowOrder.every((id, index) => sortedIds[index] === id);
    if (flowOrderMatchesColumnOrder) return;
    const existing = new Set(this.flowOrder);
    const validIds = new Set(sortedIds);
    this.flowOrder = this.flowOrder.filter(id => validIds.has(id));
    for (const id of sortedIds) {
      if (!existing.has(id)) this.flowOrder.push(id);
    }
    if (this.flowOrder.length !== existing.size) this.cdr.detectChanges();
  }

  // Edge management
  beginEdge(phaseId: string) {
    this.pendingFromId = phaseId;
  }

  completeEdge(toId: string) {
    if (!this.pendingFromId || this.pendingFromId === toId) { this.pendingFromId = null; return; }
    const exists = this.flowEdges.some(e => e.fromId === this.pendingFromId && e.toId === toId);
    if (!exists) this.flowEdges.push({ fromId: this.pendingFromId, toId });
    this.pendingFromId = null;
  }

  removeEdge(edge: { fromId: string; toId: string }) {
    this.flowEdges = this.flowEdges.filter(e => !(e.fromId === edge.fromId && e.toId === edge.toId));
  }

  hasOutgoingConnections(phaseId: string): boolean {
    return this.flowEdges.some(e => e.fromId === phaseId);
  }

  getOutgoingConnections(phaseId: string) {
    return this.flowEdges.filter(e => e.fromId === phaseId);
  }

  getEdgeArrow(e: { fromId: string; toId: string }): string {
    const fi = this.flowOrder.indexOf(e.fromId);
    const ti = this.flowOrder.indexOf(e.toId);
    return ti > fi ? '→' : '←';
  }

  // Phase reorder
  movePhaseUp(index: number, event?: Event) {
    event?.stopPropagation();
    if (index <= 0) return;
    this.isManualReorder = true;
    [this.flowOrder[index - 1], this.flowOrder[index]] = [this.flowOrder[index], this.flowOrder[index - 1]];
    this.isManualReorder = false;
  }

  movePhaseDown(index: number, event?: Event) {
    event?.stopPropagation();
    if (index >= this.flowOrder.length - 1) return;
    this.isManualReorder = true;
    [this.flowOrder[index], this.flowOrder[index + 1]] = [this.flowOrder[index + 1], this.flowOrder[index]];
    this.isManualReorder = false;
  }

  // Column modal
  showCreateColumnModal() {
    this.columnModal.showCreateModal();
  }

  onColumnSaved() {}

  // Phase form
  showColumnForm(column: Column) {
    this.phaseFormModal.showModal(column);
  }

  onPhaseFormConfigSaved() {}

  // Automations drawer
  openPhaseAutomations(phaseId: string) {
    this.selectedPhaseIdForAutomations = phaseId;
  }

  closePhaseAutomations() {
    this.selectedPhaseIdForAutomations = null;
  }

  getAutomationsForPhase(phaseId: string): any[] {
    return this.automations.filter(a => {
      const triggerPhase = a?.trigger?.phase || a?.triggerPhase;
      return triggerPhase === phaseId;
    });
  }

  createAutomationForPhase(phaseId: string) {
    this.selectedAutomation = { trigger: { type: 'card-enters-phase', phase: phaseId } };
    this.showAutomationModal = true;
  }

  editAutomation(automation: any) {
    this.selectedAutomation = JSON.parse(JSON.stringify(automation));
    this.showAutomationModal = true;
  }

  async toggleAutomation(automation: any) {
    try {
      await this.firestoreService.updateAutomation(this.boardStore.ownerId, this.boardStore.boardId, automation.id, { active: !automation.active });
    } catch {}
  }

  onCloseAutomationModal() {
    this.showAutomationModal = false;
    this.selectedAutomation = null;
  }

  async onSaveAutomation(data: any) {
    try {
      const payload = { ...data };
      delete payload.id;
      if (data.id) {
        await this.firestoreService.updateAutomation(this.boardStore.ownerId, this.boardStore.boardId, data.id, payload);
      } else {
        await this.firestoreService.createAutomation(this.boardStore.ownerId, this.boardStore.boardId, payload);
      }
      this.toast.success('Automação salva.');
      this.onCloseAutomationModal();
    } catch {
      this.toast.error('Erro ao salvar automação.');
    }
  }

  openDeleteAutomationConfirm(automation: any, event?: Event) {
    event?.preventDefault(); event?.stopPropagation();
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
      await this.firestoreService.deleteAutomation(this.boardStore.ownerId, this.boardStore.boardId, this.automationPendingDelete.id);
      this.toast.success('Automação excluída.');
    } catch {
      this.toast.error('Erro ao excluir automação.');
    } finally {
      this.cancelDeleteAutomation();
    }
  }

  onPhaseCardClick(phaseId: string, event: Event) {
    // Could open column edit modal
  }

  // Scrollbar
  updateFlowThumb() {
    const el = this.flowScroller?.nativeElement;
    if (!el) return;
    const ratio = el.clientWidth / el.scrollWidth;
    this.flowThumbPercent = Math.min(ratio * 100, 100);
    this.flowThumbLeftPercent = (el.scrollLeft / el.scrollWidth) * 100;
  }

  @HostListener('window:resize')
  onResize() { this.updateFlowThumb(); }

  onFlowScroll() { this.updateFlowThumb(); }

  onFlowBarPointerDown(event: MouseEvent) {
    const bar = this.flowCustomBar?.nativeElement;
    const scroller = this.flowScroller?.nativeElement;
    if (!bar || !scroller) return;
    const rect = bar.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    scroller.scrollLeft = ratio * scroller.scrollWidth - scroller.clientWidth / 2;
    this.updateFlowThumb();
  }

  onFlowBarTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    if (!touch) return;
    this.onFlowBarPointerDown(touch as any);
  }

  getTriggerDescription(automationOrTrigger: any): string {
    if (!automationOrTrigger) return 'Não especificado';
    const trigger = automationOrTrigger.trigger || automationOrTrigger;
    const descriptions: any = {
      'new-lead-created': 'Quando um novo lead é criado',
      'card-enters-phase': 'Quando lead entra em uma fase',
      'card-in-phase-for-time': 'Quando lead fica muito tempo na fase',
      'form-not-answered': 'Quando formulário não é respondido',
      'sla-overdue': 'Quando SLA da fase vence'
    };
    const type = trigger.type || automationOrTrigger.triggerType;
    let desc = descriptions[type] || type || 'Não especificado';
    const phaseId = trigger.phase || automationOrTrigger.triggerPhase;
    if (phaseId) {
      const col = this.columns.find(c => c.id === phaseId);
      if (col) desc += ` (${col.name})`;
    }
    return desc;
  }
}
