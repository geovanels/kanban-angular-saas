import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ConfigHeaderComponent } from '../config-header/config-header.component';
import { FirestoreService } from '../../services/firestore.service';
import { SubdomainService } from '../../services/subdomain.service';
import { VisualFormBuilderComponent } from '../visual-form-builder/visual-form-builder';

@Component({
  standalone: true,
  selector: 'app-initial-form-config',
  imports: [CommonModule, ReactiveFormsModule, ConfigHeaderComponent, VisualFormBuilderComponent],
  template: `
    <app-config-header title="Formulário inicial"></app-config-header>

    <div class="max-w-6xl mx-auto p-4">
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4">Campos do formulário inicial do quadro</h2>

        <app-visual-form-builder
          #builder
          [fields]="fields"
          (fieldsChanged)="onFieldsChanged($event)">
        </app-visual-form-builder>

        <div class="flex justify-end mt-6">
          <button
            class="px-4 py-2 text-white rounded-lg"
            [style.background-color]="getPrimaryColor()"
            [disabled]="isSaving"
            (click)="save()">
            {{ isSaving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class InitialFormConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private firestore = inject(FirestoreService);
  private subdomainService = inject(SubdomainService);

  @ViewChild('builder') builder!: VisualFormBuilderComponent;

  boardId: string | null = null;
  fields: any[] = [];
  isSaving = false;

  async ngOnInit() {
    const company = this.subdomainService.getCurrentCompany();
    if (!company) return;

    // Se já estiver em um board selecionado no Kanban, podemos guardar isso em outro momento.
    // Por ora, tentamos ler o initialForm do último board aberto via localStorage.
    const lastBoardId = localStorage.getItem('last-board-id');
    if (lastBoardId) {
      this.boardId = lastBoardId;
      const config = await this.firestore.getInitialFormConfig(lastBoardId);
      if (config?.fields) {
        this.fields = config.fields;
      }
    }
  }

  onFieldsChanged(f: any[]) {
    this.fields = f;
  }

  async save() {
    if (!this.boardId) {
      alert('Selecione um quadro no Kanban para salvar o formulário inicial.');
      return;
    }
    this.isSaving = true;
    try {
      await this.firestore.saveInitialFormConfig(this.boardId, { fields: this.fields });
      alert('Formulário inicial salvo.');
    } catch (e) {
      alert('Erro ao salvar.');
    } finally {
      this.isSaving = false;
    }
  }

  getPrimaryColor(): string {
    const company = this.subdomainService.getCurrentCompany();
    return (company as any)?.brandingConfig?.primaryColor || '#3B82F6';
  }
}



