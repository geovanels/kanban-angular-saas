import { Component, inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService, Column } from '../../services/firestore.service';
import { VisualFormBuilderComponent } from '../visual-form-builder/visual-form-builder';
import { SubdomainService } from '../../services/subdomain.service';

@Component({
  selector: 'app-phase-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, VisualFormBuilderComponent],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
         [class.hidden]="!isVisible" (click)="onCloseModal()">
      <div class="bg-white rounded-lg p-6 w-full max-w-7xl max-h-[95vh] overflow-hidden" 
           (click)="$event.stopPropagation()">
        
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            Configurar Formulário da Fase: {{ currentColumn?.name }}
          </h2>
          <button (click)="onCloseModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Visual Form Builder -->
        <app-visual-form-builder
          #formBuilder
          [fields]="formFields"
          (fieldsChanged)="onFieldsChanged($event)">
        </app-visual-form-builder>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button
            type="button"
            (click)="onCloseModal()"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            (click)="saveFormConfig()"
            [disabled]="isSaving"
            class="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            [style.background-color]="getPrimaryColor()">
            {{ isSaving ? 'Salvando...' : 'Salvar Configuração' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PhaseFormModalComponent {
  private firestoreService = inject(FirestoreService);
  private subdomainService = inject(SubdomainService);
  
  @Input() ownerId: string = '';
  @Input() boardId: string = '';
  @Output() formConfigSaved = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
  
  @ViewChild('formBuilder') formBuilderComponent!: VisualFormBuilderComponent;
  
  isVisible: boolean = false;
  isSaving: boolean = false;
  currentColumn: Column | null = null;
  currentConfig: any = null;
  formFields: any[] = [];

  showModal(column: Column, existingConfig?: any) {
    this.currentColumn = column;
    this.currentConfig = existingConfig;
    this.isVisible = true;
    
    if (existingConfig && existingConfig.fields) {
      this.formFields = existingConfig.fields
        .map((field: any) => {
          // Reconstruct temperatura fields properly
          if (field.type === 'temperatura' && (!field.options || field.options.length === 0)) {
            field.options = ['Quente', 'Morno', 'Frio'];
          }
          // Ensure all required properties exist
          return {
            ...field,
            includeInApi: field.includeInApi !== false, // Default to true
            showInCard: field.showInCard || false, // Default to false
            order: field.order || 0
          };
        })
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    } else {
      // Configuração padrão
      this.formFields = [
        { name: 'companyName', label: 'Nome da Empresa', type: 'text', required: true, order: 0 },
        { name: 'cnpj', label: 'CNPJ', type: 'text', required: true, order: 1 },
        { name: 'contactName', label: 'Nome do Contato', type: 'text', required: true, order: 2 },
        { name: 'phone', label: 'Telefone', type: 'tel', required: true, order: 3 },
        { name: 'email', label: 'E-mail', type: 'email', required: true, order: 4 },
        { name: 'segmentOrService', label: 'Segmento/Serviço', type: 'text', required: false, order: 5 },
        { name: 'description', label: 'Observações', type: 'textarea', required: false, order: 6 }
      ];
    }
  }

  onFieldsChanged(fields: any[]) {
    this.formFields = fields;
  }

  async saveFormConfig() {
    if (!this.currentColumn || !this.ownerId || !this.boardId) {
      console.error('Dados necessários não fornecidos');
      return;
    }

    this.isSaving = true;
    
    try {
      const config = {
        columnId: this.currentColumn.id!,
        columnName: this.currentColumn.name,
        fields: this.formFields.map((field, index) => {
          // Limpar campos undefined para evitar erro do Firebase
          const cleanField: any = {
            name: field.name || '',
            label: field.label || '',
            type: field.type || 'text',
            required: field.required || false,
            order: index,
            includeInApi: field.includeInApi !== false,
            showInCard: field.showInCard || false
          };

          // Só adicionar se não for undefined ou string vazia
          if (field.placeholder && field.placeholder.trim()) {
            cleanField.placeholder = field.placeholder.trim();
          }
          if (field.apiFieldName && field.apiFieldName.trim()) {
            cleanField.apiFieldName = field.apiFieldName.trim();
          }
          if (field.options && Array.isArray(field.options) && field.options.length > 0) {
            cleanField.options = field.options;
          }
          
          // Auto-adicionar opções para temperatura se não tiver
          if (field.type === 'temperatura' && (!field.options || field.options.length === 0)) {
            cleanField.options = ['Quente', 'Morno', 'Frio'];
          }

          return cleanField;
        }),
        createdAt: this.currentConfig ? this.currentConfig.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (this.currentConfig && this.currentConfig.id) {
        // Atualizar configuração existente
        await this.firestoreService.updatePhaseFormConfig(this.ownerId, this.boardId, this.currentConfig.id, config);
      } else {
        // Criar nova configuração
        await this.firestoreService.createPhaseFormConfig(this.ownerId, this.boardId, config);
      }

      console.log('✅ Configuração do formulário salva com sucesso');
      this.formConfigSaved.emit();
      this.hideModal();
      
    } catch (error) {
      console.error('❌ Erro ao salvar configuração do formulário:', error);
      alert('Erro ao salvar configuração. Tente novamente.');
    } finally {
      this.isSaving = false;
    }
  }

  hideModal() {
    this.isVisible = false;
    this.currentColumn = null;
    this.currentConfig = null;
    this.formFields = [];
  }

  onCloseModal() {
    this.hideModal();
    this.closeModal.emit();
  }

  getPrimaryColor(): string {
    const company = this.subdomainService.getCurrentCompany();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || '#3B82F6';
  }
}