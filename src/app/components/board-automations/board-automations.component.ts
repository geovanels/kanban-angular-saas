import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BoardStoreService } from '../../services/board-store.service';
import { FirestoreService, Column } from '../../services/firestore.service';
import { ToastService } from '../toast/toast.service';
import { AutomationModal } from '../automation-modal/automation-modal';
import { AutomationHistoryModal } from '../automation-history-modal/automation-history-modal';
import { formatDate } from '../../utils/format.utils';

@Component({
  selector: 'app-board-automations',
  standalone: true,
  imports: [CommonModule, AutomationModal, AutomationHistoryModal],
  templateUrl: './board-automations.component.html'
})
export class BoardAutomationsComponent implements OnInit, OnDestroy {
  boardStore = inject(BoardStoreService);
  private firestoreService = inject(FirestoreService);
  private toast = inject(ToastService);
  private subs: Subscription[] = [];

  automations: any[] = [];
  columns: Column[] = [];

  showAutomationModal = false;
  selectedAutomation: any = null;
  showHistoryModal = false;
  selectedAutomationForHistory: any = null;
  showDeleteConfirm = false;
  automationPendingDelete: any = null;

  ngOnInit() {
    this.subs.push(this.boardStore.automations$.subscribe(a => this.automations = a));
    this.subs.push(this.boardStore.columns$.subscribe(c => this.columns = c));
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  formatDate = formatDate;

  getValidAutomations(): any[] {
    return this.automations.filter(a => a?.name?.trim() && a.name !== 'Automação sem nome');
  }

  getTriggerDescription(automationOrTrigger: any): string {
    if (!automationOrTrigger) return 'Não especificado';
    const trigger = automationOrTrigger.trigger || automationOrTrigger;
    const descriptions: any = {
      'new-lead-created': 'Quando um novo registro é criado',
      'card-enters-phase': 'Quando registro entra em uma fase',
      'card-in-phase-for-time': 'Quando registro fica muito tempo na fase',
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
    const days = trigger.days || automationOrTrigger.triggerDays;
    if (days) desc += ` (${days} dias)`;
    return desc;
  }

  getActionsCount(actions: any[]): number {
    return actions?.length || 0;
  }

  createAutomation(event?: Event) {
    event?.preventDefault(); event?.stopPropagation();
    this.selectedAutomation = null;
    this.showAutomationModal = true;
  }

  editAutomation(automation: any, event?: Event) {
    event?.preventDefault(); event?.stopPropagation();
    this.selectedAutomation = JSON.parse(JSON.stringify(automation));
    this.showAutomationModal = true;
  }

  onCloseAutomationModal() {
    this.showAutomationModal = false;
    this.selectedAutomation = null;
  }

  async onSaveAutomation(data: any) {
    try {
      const sanitize = (obj: any) => {
        const out: any = {};
        Object.keys(obj || {}).forEach(k => { if (obj[k] !== undefined) out[k] = obj[k]; });
        return out;
      };
      const payload: any = sanitize({ ...data });
      delete payload.id;
      if (Array.isArray(payload.actions)) {
        payload.actions = payload.actions.map((a: any) => sanitize(a));
      }
      if (data.id) {
        await this.firestoreService.updateAutomation(this.boardStore.ownerId, this.boardStore.boardId, data.id, payload);
      } else {
        await this.firestoreService.createAutomation(this.boardStore.ownerId, this.boardStore.boardId, payload);
      }
      this.toast.success('Automação salva com sucesso.');
      this.onCloseAutomationModal();
    } catch {
      this.toast.error('Erro ao salvar automação.');
    }
  }

  async toggleAutomation(automation: any) {
    try {
      await this.firestoreService.updateAutomation(this.boardStore.ownerId, this.boardStore.boardId, automation.id, { active: !automation.active });
    } catch {
      this.toast.error('Erro ao alterar status.');
    }
  }

  openDeleteConfirm(automation: any, event?: Event) {
    event?.preventDefault(); event?.stopPropagation();
    this.automationPendingDelete = automation;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.automationPendingDelete = null;
  }

  async confirmDelete() {
    if (!this.automationPendingDelete) return;
    try {
      const id = this.automationPendingDelete.id;
      if (id) await this.firestoreService.deleteAutomation(this.boardStore.ownerId, this.boardStore.boardId, id);
      this.toast.success('Automação excluída.');
    } catch {
      this.toast.error('Erro ao excluir automação.');
    } finally {
      this.cancelDelete();
    }
  }

  showAutomationHistory(automation: any, event?: Event) {
    event?.preventDefault(); event?.stopPropagation();
    this.selectedAutomationForHistory = automation;
    this.showHistoryModal = true;
  }

  onCloseHistoryModal() {
    this.showHistoryModal = false;
    this.selectedAutomationForHistory = null;
  }
}
