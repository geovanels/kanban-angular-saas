import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-automation-history-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './automation-history-modal.html',
  styleUrl: './automation-history-modal.scss'
})
export class AutomationHistoryModal implements OnInit, OnDestroy {
  private firestoreService = inject(FirestoreService);

  @Input() isVisible = false;
  @Input() automationId = '';
  @Input() automationName = '';
  @Input() ownerId = '';
  @Input() boardId = '';
  @Input() leads: any[] = [];
  @Output() closeModalEvent = new EventEmitter<void>();

  historyItems: any[] = [];
  paginatedItems: any[] = [];
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  private subscription?: () => void;

  ngOnInit() {
    if (this.isVisible && this.automationId) {
      this.loadHistory();
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  ngOnChanges() {
    if (this.isVisible && this.automationId) {
      this.loadHistory();
    } else if (!this.isVisible) {
      this.unsubscribe();
    }
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription();
      this.subscription = undefined;
    }
  }

  async loadHistory() {
    this.isLoading = true;
    this.unsubscribe();

    try {
      this.subscription = this.firestoreService.subscribeToAutomationHistory(
        this.ownerId,
        this.boardId,
        this.automationId,
        (historyData) => {
          this.historyItems = historyData.sort((a, b) => {
            const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
            const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
            return timeB - timeA;
          });
          this.currentPage = 1;
          this.updatePagination();
          this.isLoading = false;
        }
      );
    } catch (error) {
      console.error('Erro ao carregar histórico de automação:', error);
      this.isLoading = false;
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.historyItems.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.historyItems.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getLeadName(leadId: string): string {
    const lead = this.leads.find(l => l.id === leadId);
    return lead ? (lead.fields?.companyName || lead.fields?.title || 'Lead sem nome') : 'Lead removido';
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      return 'N/A';
    }

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'success': 'Sucesso',
      'error': 'Erro',
      'pending': 'Pendente',
      'scheduled': 'Agendada'
    };
    return statusMap[status] || 'Desconhecido';
  }

  closeModal() {
    this.unsubscribe();
    this.closeModalEvent.emit();
  }
}
