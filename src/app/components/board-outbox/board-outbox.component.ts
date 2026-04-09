import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BoardStoreService } from '../../services/board-store.service';
import { FirestoreService } from '../../services/firestore.service';
import { ToastService } from '../toast/toast.service';
import { formatDateTime } from '../../utils/format.utils';

@Component({
  selector: 'app-board-outbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-outbox.component.html',
  styles: [`
    .outbox-page {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 120px);
      background: #f4f5f8;
    }
    .outbox-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }
    .outbox-tabs {
      display: flex;
      gap: 0;
      padding: 0 20px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }
    .tab-btn {
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      border-bottom: 2px solid transparent;
      transition: all 150ms;
      cursor: pointer;
      background: none;
      border-top: none;
      border-left: none;
      border-right: none;
    }
    .tab-btn:hover { color: #374151; }
    .tab-btn.active {
      color: #111827;
      border-bottom-color: #111827;
      font-weight: 600;
    }
    .tab-count {
      margin-left: 6px;
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 10px;
      background: #f3f4f6;
      color: #6b7280;
    }
    .tab-btn.active .tab-count {
      background: #111827;
      color: white;
    }
    .outbox-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    }
    .outbox-table {
      width: 100%;
      background: white;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      border-collapse: separate;
      border-spacing: 0;
      overflow: hidden;
    }
    .outbox-table thead th {
      padding: 10px 14px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }
    .outbox-table tbody td {
      padding: 10px 14px;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: middle;
    }
    .outbox-table tbody tr:last-child td {
      border-bottom: none;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .status-dot.pending { background: #fbbf24; }
    .status-dot.success { background: #34d399; }
    .status-dot.error { background: #f87171; }
    .status-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 500;
    }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.success { background: #d1fae5; color: #065f46; }
    .status-badge.error { background: #fee2e2; color: #991b1b; }
    .action-btn {
      padding: 4px 6px;
      border-radius: 4px;
      font-size: 12px;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 100ms;
    }
    .action-btn:hover { background: #f3f4f6; }
    .outbox-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      background: white;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .page-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      background: white;
      color: #374151;
      cursor: pointer;
      transition: all 100ms;
    }
    .page-btn:hover:not(:disabled) { background: #f3f4f6; }
    .page-btn:disabled { opacity: 0.4; cursor: default; }
  `]
})
export class BoardOutboxComponent implements OnInit, OnDestroy {
  boardStore = inject(BoardStoreService);
  private firestoreService = inject(FirestoreService);
  private toast = inject(ToastService);
  private sub?: Subscription;

  outboxEmails: any[] = [];
  activeEmailStatus = 'all';
  emailStatuses = [
    { id: 'all', name: 'Todos', count: 0 },
    { id: 'scheduled', name: 'Na Fila', count: 0 },
    { id: 'success', name: 'Enviados', count: 0 },
    { id: 'error', name: 'Com Erro', count: 0 }
  ];

  // Pagination
  currentPage = 1;
  pageSize = 20;

  showDeleteConfirm = false;
  emailPendingDelete: any = null;

  ngOnInit() {
    this.sub = this.boardStore.outboxEmails$.subscribe(emails => {
      this.outboxEmails = emails;
      this.updateStatusCounts();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  formatDateTime = formatDateTime;

  getEmailDisplayDate(email: any): any {
    return email?.delivery?.endTime || email?.createdAt;
  }

  updateStatusCounts() {
    this.emailStatuses = [
      { id: 'all', name: 'Todos', count: this.outboxEmails.length },
      { id: 'scheduled', name: 'Na Fila', count: this.outboxEmails.filter(e => !e.delivery || e.delivery.state === 'PENDING').length },
      { id: 'success', name: 'Enviados', count: this.outboxEmails.filter(e => e.delivery?.state === 'SUCCESS').length },
      { id: 'error', name: 'Com Erro', count: this.outboxEmails.filter(e => e.delivery?.state === 'ERROR').length }
    ];
  }

  getFilteredEmails(): any[] {
    if (this.activeEmailStatus === 'all') return this.outboxEmails;
    return this.outboxEmails.filter(email => {
      switch (this.activeEmailStatus) {
        case 'scheduled': return !email.delivery || email.delivery.state === 'PENDING';
        case 'success': return email.delivery?.state === 'SUCCESS';
        case 'error': return email.delivery?.state === 'ERROR';
        default: return false;
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.getFilteredEmails().length / this.pageSize);
  }

  getPaginatedEmails(): any[] {
    const filtered = this.getFilteredEmails();
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  getEmailStatusLabel(email: any): string {
    if (!email.delivery) return 'Na Fila';
    switch (email.delivery.state) {
      case 'SUCCESS': return 'Enviado';
      case 'ERROR': return 'Erro';
      case 'PENDING': return 'Na Fila';
      default: return email.delivery.state || 'Desconhecido';
    }
  }

  viewEmail(email: any) {
    const sentAt = email.delivery?.endTime ? new Date(email.delivery.endTime.seconds * 1000).toLocaleString('pt-BR') : '---';
    const createdAt = email.createdAt ? new Date(email.createdAt.seconds * 1000).toLocaleString('pt-BR') : '---';
    alert(`Visualizar Email:\n\nPara: ${email.to || 'Não especificado'}\nAssunto: ${email.subject || 'Sem assunto'}\nStatus: ${this.getEmailStatusLabel(email)}\nCriado em: ${createdAt}\nEnviado em: ${sentAt}\n\nConteúdo:\n${email.html || email.text || 'Sem conteúdo disponível'}`);
  }

  async retryEmail(email: any) {
    try {
      await this.firestoreService.updateOutboxEmail(this.boardStore.ownerId, this.boardStore.boardId, email.id, {
        status: 'scheduled', scheduledAt: new Date(), retryCount: (email.retryCount || 0) + 1
      });
      this.toast.success('Email reagendado para reenvio.');
    } catch {
      this.toast.error('Erro ao reenviar email.');
    }
  }

  async clearOutbox() {
    if (!confirm('Limpar toda a caixa de saída?')) return;
    try {
      for (const email of this.outboxEmails) {
        await this.firestoreService.deleteOutboxEmail(this.boardStore.ownerId, this.boardStore.boardId, email.id);
      }
      this.toast.success('Caixa de saída limpa.');
    } catch {
      this.toast.error('Erro ao limpar caixa de saída.');
    }
  }

  openDeleteConfirm(email: any, event?: Event) {
    event?.preventDefault(); event?.stopPropagation();
    this.emailPendingDelete = email;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.emailPendingDelete = null;
  }

  async confirmDelete() {
    if (!this.emailPendingDelete) return;
    try {
      await this.firestoreService.deleteOutboxEmail(this.boardStore.ownerId, this.boardStore.boardId, this.emailPendingDelete.id);
      this.toast.success('Mensagem excluída.');
    } catch {
      this.toast.error('Erro ao excluir mensagem.');
    } finally {
      this.cancelDelete();
    }
  }
}
