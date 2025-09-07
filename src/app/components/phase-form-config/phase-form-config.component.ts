import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ConfigHeaderComponent } from '../config-header/config-header.component';
import { FirestoreService, Column } from '../../services/firestore.service';
import { SubdomainService } from '../../services/subdomain.service';
import { VisualFormBuilderComponent } from '../visual-form-builder/visual-form-builder';

@Component({
  standalone: true,
  selector: 'app-phase-form-config',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfigHeaderComponent, VisualFormBuilderComponent],
  template: `
    <app-config-header title="Formulário da Fase"></app-config-header>

    <div class="max-w-6xl mx-auto p-4 space-y-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fase</label>
            <select class="w-full border rounded px-3 py-2" [(ngModel)]="selectedColumnId" (change)="onColumnChange()">
              <option [ngValue]="null">Selecione...</option>
              <option *ngFor="let c of columns" [value]="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4" *ngIf="selectedColumnId">
        <h2 class="text-lg font-semibold mb-4">Campos do formulário desta fase</h2>

        <app-visual-form-builder
          #builder
          [fields]="fields"
          (fieldsChanged)="onFieldsChanged($event)">
        </app-visual-form-builder>

        <div class="flex justify-end mt-6">
          <button class="px-4 py-2 text-white rounded-lg" [style.background-color]="getPrimaryColor()" (click)="save()" [disabled]="isSaving">
            {{ isSaving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class PhaseFormConfigComponent implements OnInit {
  private firestore = inject(FirestoreService);
  private subdomainService = inject(SubdomainService);
  private fb = inject(FormBuilder);

  @ViewChild('builder') builder!: VisualFormBuilderComponent;

  boardId: string | null = null;
  columns: Column[] = [];
  selectedColumnId: string | null = null;
  fields: any[] = [];
  isSaving = false;

  async ngOnInit() {
    const lastBoardId = localStorage.getItem('last-board-id');
    if (lastBoardId) {
      this.boardId = lastBoardId;
      this.columns = await this.firestore.getColumns('', lastBoardId);
    }
  }

  async onColumnChange() {
    if (!this.boardId || !this.selectedColumnId) return;
    const config = await this.firestore.getPhaseFormConfig('', this.boardId, this.selectedColumnId);
    this.fields = (config as any)?.fields || [];
  }

  onFieldsChanged(f: any[]) {
    this.fields = f;
  }

  async save() {
    if (!this.boardId || !this.selectedColumnId) return;
    this.isSaving = true;
    try {
      const existing = await this.firestore.getPhaseFormConfig('', this.boardId, this.selectedColumnId);
      const payload = { columnId: this.selectedColumnId, fields: this.fields };
      if (existing?.id) {
        await this.firestore.updatePhaseFormConfig('', this.boardId, existing.id, payload);
      } else {
        await this.firestore.createPhaseFormConfig('', this.boardId, payload);
      }
      alert('Formulário salvo.');
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


