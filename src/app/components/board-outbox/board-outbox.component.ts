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
  templateUrl: './board-outbox.component.html'
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
