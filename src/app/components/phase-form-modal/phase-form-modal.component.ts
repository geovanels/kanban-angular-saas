import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Column } from '../../services/firestore.service';
import { VisualFormBuilder, FormField } from '../visual-form-builder/visual-form-builder';

export interface PhaseFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'number' | 'date';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface PhaseFormConfig {
  id?: string;
  columnId: string;
  fields: PhaseFormField[];
  createdAt?: any;
  updatedAt?: any;
}

@Component({
  selector: 'app-phase-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormlyModule, FormlyBootstrapModule, VisualFormBuilder],
  templateUrl: './phase-form-modal.component.html',
  styleUrls: ['./phase-form-modal.component.scss']
})
export class PhaseFormModalComponent {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private fb = inject(FormBuilder);

  @Input() ownerId: string = '';
  @Input() boardId: string = '';
  @Input() column: Column | null = null;
  
  @Output() formConfigSaved = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  isVisible = false;
  isLoading = false;
  errorMessage = '';
  currentFormConfig: PhaseFormConfig | null = null;

  // NGX Formly Configuration
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-6',
          key: 'fieldName',
          type: 'input',
          props: {
            label: 'Nome do Campo',
            placeholder: 'Ex: companyName',
            required: true,
          },
          validators: {
            validation: ['required']
          }
        },
        {
          className: 'col-6',
          key: 'fieldLabel',
          type: 'input',
          props: {
            label: 'Rótulo do Campo',
            placeholder: 'Ex: Nome da Empresa',
            required: true,
          }
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-6',
          key: 'fieldType',
          type: 'select',
          props: {
            label: 'Tipo do Campo',
            required: true,
            options: [
              { value: 'input', label: 'Texto' },
              { value: 'email', label: 'Email' },
              { value: 'number', label: 'Número' },
              { value: 'tel', label: 'Telefone' },
              { value: 'textarea', label: 'Texto Longo' },
              { value: 'select', label: 'Lista de Opções' },
              { value: 'checkbox', label: 'Caixa de Seleção' },
              { value: 'radio', label: 'Botões de Opção' },
              { value: 'date', label: 'Data' }
            ]
          }
        },
        {
          className: 'col-6',
          key: 'required',
          type: 'checkbox',
          props: {
            label: 'Campo Obrigatório'
          }
        }
      ]
    },
    {
      key: 'placeholder',
      type: 'input',
      props: {
        label: 'Texto de Exemplo',
        placeholder: 'Ex: Digite o nome da empresa'
      }
    },
    {
      key: 'options',
      type: 'textarea',
      props: {
        label: 'Opções (separadas por vírgula)',
        placeholder: 'Ex: Opção 1, Opção 2, Opção 3',
        rows: 3
      },
      hideExpression: (model: any) => {
        return !['select', 'radio', 'checkbox'].includes(model.fieldType);
      }
    }
  ];

  // Form fields list - using FormField interface from VisualFormBuilder
  formFields: FormField[] = [];
  
  formConfigForm: FormGroup = this.fb.group({
    fields: this.fb.array([])
  });

  fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Telefone' },
    { value: 'number', label: 'Número' },
    { value: 'date', label: 'Data' },
    { value: 'select', label: 'Lista de Opções' },
    { value: 'textarea', label: 'Texto Longo' }
  ];

  get fieldsArray() {
    return this.formConfigForm.get('fields') as FormArray;
  }

  showModal(column: Column, existingConfig?: PhaseFormConfig) {
    this.column = column;
    this.currentFormConfig = existingConfig || null;
    this.isVisible = true;
    this.initializeForm();
  }

  hide() {
    this.isVisible = false;
    this.resetForm();
    this.closeModal.emit();
  }

  private initializeForm() {
    this.formFields = [];
    
    if (this.currentFormConfig?.fields) {
      // Convert PhaseFormField to FormField format
      this.formFields = this.currentFormConfig.fields.map((field, index) => ({
        id: `field_${index + 1}`,
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        placeholder: field.placeholder,
        options: field.options,
        description: undefined
      }));
    }
    
    // Reset NGX Formly form
    this.model = {};
    this.form.reset();
  }

  private createFieldGroup(field?: PhaseFormField): FormGroup {
    const group = this.fb.group({
      name: [field?.name || '', [Validators.required]],
      label: [field?.label || '', [Validators.required]],
      type: [field?.type || 'text', [Validators.required]],
      required: [field?.required || false],
      placeholder: [field?.placeholder || ''],
      options: [field?.options?.join('\n') || '']
    });

    return group;
  }

  // Visual Form Builder event handlers
  onFormFieldsChanged(fields: FormField[]) {
    this.formFields = fields;
  }

  onFormBuilderSave(fields: FormField[]) {
    this.formFields = fields;
    this.saveFormConfig();
  }

  getFieldTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'input': 'Texto',
      'email': 'Email',
      'number': 'Número',
      'tel': 'Telefone',
      'textarea': 'Texto Longo',
      'select': 'Lista de Opções',
      'checkbox': 'Caixa de Seleção',
      'radio': 'Botões de Opção',
      'date': 'Data',
      'text': 'Texto'
    };
    return typeMap[type] || type;
  }


  async saveFormConfig() {
    if (this.formFields.length === 0) {
      this.errorMessage = 'Por favor, adicione pelo menos um campo ao formulário.';
      return;
    }

    if (!this.column) {
      this.errorMessage = 'Fase não encontrada.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Validar nomes únicos
      const fieldNames = this.formFields.map(f => f.name);
      const uniqueNames = new Set(fieldNames);
      if (fieldNames.length !== uniqueNames.size) {
        this.errorMessage = 'Cada campo deve ter um nome único.';
        this.isLoading = false;
        return;
      }

      // Convert FormField back to PhaseFormField format for saving
      const phaseFields: PhaseFormField[] = this.formFields.map(field => ({
        name: field.name,
        label: field.label,
        type: field.type as any,
        required: field.required,
        placeholder: field.placeholder,
        options: field.options
      }));

      const formConfig: PhaseFormConfig = {
        columnId: this.column.id!,
        fields: phaseFields,
        updatedAt: new Date()
      };

      if (this.currentFormConfig?.id) {
        // Atualizar configuração existente
        await this.firestoreService.updatePhaseFormConfig(
          this.ownerId,
          this.boardId,
          this.currentFormConfig.id,
          formConfig
        );
      } else {
        // Criar nova configuração
        formConfig.createdAt = new Date();
        await this.firestoreService.createPhaseFormConfig(
          this.ownerId,
          this.boardId,
          formConfig
        );
      }

      this.formConfigSaved.emit();
      this.hide();
    } catch (error: any) {
      console.error('Erro ao salvar configuração do formulário:', error);
      this.errorMessage = 'Erro ao salvar configuração. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm() {
    this.formConfigForm.reset();
    this.errorMessage = '';
    this.isLoading = false;
    this.currentFormConfig = null;
    this.column = null;
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.hide();
    }
  }

  generateFieldName(label: string): string {
    return label.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]/g, '') // Remove caracteres especiais
      .substring(0, 30);
  }

  onLabelChange(index: number) {
    const fieldGroup = this.fieldsArray.at(index) as FormGroup;
    const label = fieldGroup.get('label')?.value;
    const currentName = fieldGroup.get('name')?.value;
    
    // Se o nome estiver vazio ou for igual ao nome gerado anterior, atualizar automaticamente
    if (!currentName || currentName === this.generateFieldName(fieldGroup.get('label')?.value)) {
      fieldGroup.patchValue({ name: this.generateFieldName(label) });
    }
  }
}