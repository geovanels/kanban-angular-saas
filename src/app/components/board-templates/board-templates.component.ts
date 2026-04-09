import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BoardStoreService } from '../../services/board-store.service';
import { FirestoreService } from '../../services/firestore.service';
import { TemplateModalComponent } from '../template-modal/template-modal.component';
import { formatDate } from '../../utils/format.utils';

@Component({
  selector: 'app-board-templates',
  standalone: true,
  imports: [CommonModule, TemplateModalComponent],
  templateUrl: './board-templates.component.html'
})
export class BoardTemplatesComponent implements OnInit, OnDestroy {
  boardStore = inject(BoardStoreService);
  private firestoreService = inject(FirestoreService);
  private sub?: Subscription;

  @ViewChild(TemplateModalComponent) templateModal!: TemplateModalComponent;

  emailTemplates: any[] = [];

  ngOnInit() {
    this.sub = this.boardStore.emailTemplates$.subscribe(t => this.emailTemplates = t);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  formatDate = formatDate;

  createTemplate() {
    this.templateModal.showCreateModal();
  }

  editTemplate(template: any) {
    this.templateModal.showEditModal(template);
  }

  async deleteTemplate(template: any) {
    if (confirm('Tem certeza que deseja excluir este template?')) {
      try {
        await this.firestoreService.deleteEmailTemplate(this.boardStore.ownerId, this.boardStore.boardId, template.id);
      } catch (error) {
        console.error('Erro ao excluir template:', error);
      }
    }
  }

  onTemplateSaved() {}
}
