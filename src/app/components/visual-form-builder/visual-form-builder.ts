import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
}

export interface FieldType {
  id: string;
  name: string;
  label: string;
  icon: string;
  category: string;
  defaultConfig: Partial<FormField>;
}

@Component({
  selector: 'app-visual-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './visual-form-builder.html',
  styleUrl: './visual-form-builder.scss'
})
export class VisualFormBuilder implements OnInit {
  @Input() initialFields: FormField[] = [];
  @Output() fieldsChanged = new EventEmitter<FormField[]>();
  @Output() saveForm = new EventEmitter<FormField[]>();
  @Output() cancelForm = new EventEmitter<void>();

  // Available field types
  fieldTypes: FieldType[] = [
    {
      id: 'text',
      name: 'text',
      label: 'Texto',
      icon: 'fa-font',
      category: 'basic',
      defaultConfig: { type: 'text', required: false }
    },
    {
      id: 'email',
      name: 'email', 
      label: 'Email',
      icon: 'fa-envelope',
      category: 'basic',
      defaultConfig: { type: 'email', required: false }
    },
    {
      id: 'phone',
      name: 'tel',
      label: 'Telefone',
      icon: 'fa-phone',
      category: 'basic',
      defaultConfig: { type: 'tel', required: false }
    },
    {
      id: 'number',
      name: 'number',
      label: 'Número',
      icon: 'fa-hashtag',
      category: 'basic',
      defaultConfig: { type: 'number', required: false }
    },
    {
      id: 'textarea',
      name: 'textarea',
      label: 'Texto Longo',
      icon: 'fa-align-left',
      category: 'basic',
      defaultConfig: { type: 'textarea', required: false }
    },
    {
      id: 'select',
      name: 'select',
      label: 'Lista de Opções',
      icon: 'fa-list',
      category: 'basic',
      defaultConfig: { type: 'select', required: false, options: ['Opção 1', 'Opção 2', 'Opção 3'] }
    },
    {
      id: 'radio',
      name: 'radio',
      label: 'Botões de Opção',
      icon: 'fa-dot-circle',
      category: 'basic',
      defaultConfig: { type: 'radio', required: false, options: ['Sim', 'Não'] }
    },
    {
      id: 'checkbox',
      name: 'checkbox',
      label: 'Caixa de Seleção',
      icon: 'fa-check-square',
      category: 'basic',
      defaultConfig: { type: 'checkbox', required: false }
    },
    {
      id: 'file',
      name: 'file',
      label: 'Anexo de Documentos',
      icon: 'fa-paperclip',
      category: 'basic',
      defaultConfig: { type: 'file', required: false }
    },
    {
      id: 'date',
      name: 'date',
      label: 'Data',
      icon: 'fa-calendar',
      category: 'basic',
      defaultConfig: { type: 'date', required: false }
    }
  ];

  // Form builder state
  formFields: FormField[] = [];
  selectedField: FormField | null = null;
  showFieldConfig = false;

  // Configuration form
  configForm: FormGroup;
  private fieldIdCounter = 1;

  constructor(private fb: FormBuilder) {
    this.configForm = this.createConfigForm();
  }

  ngOnInit() {
    if (this.initialFields.length > 0) {
      this.formFields = [...this.initialFields];
      this.fieldIdCounter = Math.max(...this.formFields.map(f => parseInt(f.id.replace('field_', '')))) + 1;
    }
  }

  private createConfigForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)]],
      label: ['', Validators.required],
      placeholder: [''],
      description: [''],
      required: [false],
      options: ['']
    });
  }

  // Drag & Drop handlers
  onFieldTypeDrop(event: CdkDragDrop<FormField[]>) {
    if (event.previousContainer !== event.container) {
      const fieldType = this.fieldTypes[event.previousIndex];
      const newField = this.createFieldFromType(fieldType);
      
      const copyOfItems = [...this.formFields];
      copyOfItems.splice(event.currentIndex, 0, newField);
      this.formFields = copyOfItems;
      this.emitFieldsChange();
    }
  }

  onFieldReorder(event: CdkDragDrop<FormField[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.formFields, event.previousIndex, event.currentIndex);
      this.emitFieldsChange();
    }
  }

  private createFieldFromType(fieldType: FieldType): FormField {
    return {
      id: `field_${this.fieldIdCounter++}`,
      name: `${fieldType.name}_${this.fieldIdCounter}`,
      label: `${fieldType.label} ${this.fieldIdCounter}`,
      type: fieldType.name,
      required: false,
      ...fieldType.defaultConfig
    };
  }

  // Field management
  selectField(field: FormField) {
    this.selectedField = field;
    this.showFieldConfig = true;
    this.populateConfigForm(field);
  }

  private populateConfigForm(field: FormField) {
    this.configForm.patchValue({
      name: field.name,
      label: field.label,
      placeholder: field.placeholder || '',
      description: field.description || '',
      required: field.required,
      options: field.options ? field.options.join(', ') : ''
    });
  }

  saveFieldConfig() {
    if (this.configForm.valid && this.selectedField) {
      const formValue = this.configForm.value;
      
      // Update selected field
      this.selectedField.name = formValue.name;
      this.selectedField.label = formValue.label;
      this.selectedField.placeholder = formValue.placeholder;
      this.selectedField.description = formValue.description;
      this.selectedField.required = formValue.required;
      
      // Handle options for select, radio, etc.
      if (this.isFieldTypeWithOptions(this.selectedField.type)) {
        this.selectedField.options = formValue.options
          .split(',')
          .map((opt: string) => opt.trim())
          .filter((opt: string) => opt.length > 0);
      }

      this.showFieldConfig = false;
      this.selectedField = null;
      this.emitFieldsChange();
    }
  }

  deleteField(field: FormField) {
    const index = this.formFields.findIndex(f => f.id === field.id);
    if (index > -1) {
      this.formFields.splice(index, 1);
      if (this.selectedField?.id === field.id) {
        this.closeFieldConfig();
      }
      this.emitFieldsChange();
    }
  }

  closeFieldConfig() {
    this.showFieldConfig = false;
    this.selectedField = null;
    this.configForm.reset();
  }

  // Utility methods
  isFieldTypeWithOptions(type: string): boolean {
    return ['select', 'radio', 'checkbox'].includes(type);
  }

  getFieldTypeIcon(type: string): string {
    const fieldType = this.fieldTypes.find(ft => ft.name === type);
    return fieldType?.icon || 'fa-question';
  }

  private emitFieldsChange() {
    this.fieldsChanged.emit([...this.formFields]);
  }

  onSave() {
    this.saveForm.emit([...this.formFields]);
  }

  onCancel() {
    this.cancelForm.emit();
  }

  // Clear all fields
  clearForm() {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
      this.formFields = [];
      this.closeFieldConfig();
      this.emitFieldsChange();
    }
  }
}
