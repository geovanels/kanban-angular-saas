import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BoardStoreService } from '../../services/board-store.service';
import { FirestoreService } from '../../services/firestore.service';
import { ToastService } from '../toast/toast.service';
import { VisualFormBuilderComponent } from '../visual-form-builder/visual-form-builder';

@Component({
  selector: 'app-board-form-config',
  standalone: true,
  imports: [CommonModule, VisualFormBuilderComponent],
  template: `
    <div class="form-config-page">
      <div class="form-config-header">
        <h2 class="text-lg font-semibold text-gray-900">Formulário inicial do quadro</h2>
        <button class="px-4 py-2 text-white text-sm rounded-lg transition-colors hover:brightness-90"
                [style.background-color]="boardStore.getPrimaryColor()"
                (click)="save()">
          <i class="fas fa-save mr-2"></i>Salvar
        </button>
      </div>

      <div class="form-config-body">
        <app-visual-form-builder
          [fields]="fields"
          (fieldsChanged)="onFieldsChanged($event)">
        </app-visual-form-builder>
      </div>
    </div>
  `,
  styles: [`
    .form-config-page {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 120px);
      overflow: hidden;
    }
    .form-config-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      flex-shrink: 0;
    }
    .form-config-body {
      flex: 1;
      overflow: hidden;
    }
    .form-config-body app-visual-form-builder {
      display: block;
      height: 100%;
    }
  `]
})
export class BoardFormConfigComponent implements OnInit, OnDestroy {
  boardStore = inject(BoardStoreService);
  private firestoreService = inject(FirestoreService);
  private toast = inject(ToastService);
  private sub?: Subscription;

  fields: any[] = [];

  ngOnInit() {
    this.sub = this.boardStore.initialFormFields$.subscribe(f => this.fields = [...f]);
    this.boardStore.loadInitialForm();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onFieldsChanged(fields: any[]) {
    this.fields = fields;
  }

  async save() {
    try {
      await this.firestoreService.saveInitialFormConfig(this.boardStore.boardId, { fields: this.fields });
      this.boardStore.initialFormFields$.next(this.fields);
      this.toast.success('Formulário inicial salvo.');
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
      this.toast.error('Erro ao salvar formulário inicial.');
    }
  }
}
