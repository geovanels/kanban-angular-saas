import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SubdomainService } from '../../services/subdomain.service';

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  options?: string[];
  placeholder?: string;
  includeInApi?: boolean; // Flag para indicar se o campo deve ser incluído na API
  apiFieldName?: string; // Nome do campo na API (se diferente do nome)
  showInCard?: boolean; // Flag para indicar se o campo deve ser exibido no card
}

@Component({
  selector: 'app-visual-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './visual-form-builder.html',
  styleUrls: ['./visual-form-builder.scss']
})
export class VisualFormBuilderComponent implements OnInit {
  @Input() fields: FormField[] = [];
  @Output() fieldsChanged = new EventEmitter<FormField[]>();

  private fb = inject(FormBuilder);
  private subdomainService = inject(SubdomainService);
  
  fieldsForm: FormGroup;
  editingField: FormField | null = null;
  editingIndex: number = -1;
  selectedFieldType: string = '';
  selectedField: FormField | null = null;
  
  fieldTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'email', label: 'E-mail' },
    { value: 'tel', label: 'Telefone' },
    { value: 'number', label: 'Número' },
    { value: 'cnpj', label: 'CNPJ' },
    { value: 'cpf', label: 'CPF' },
    { value: 'temperatura', label: 'Temperatura' },
    { value: 'textarea', label: 'Área de Texto' },
    { value: 'select', label: 'Lista Suspensa' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Botão de Rádio' },
    { value: 'date', label: 'Data' },
    { value: 'time', label: 'Hora' },
    { value: 'file', label: 'Upload de Arquivo' }
  ];

  constructor() {
    this.fieldsForm = this.fb.group({
      name: ['', Validators.required],
      label: ['', Validators.required],
      type: ['text', Validators.required],
      required: [false],
      placeholder: [''],
      options: [''],
      includeInApi: [true], // Por padrão, incluir na API
      apiFieldName: [''], // Nome personalizado na API
      showInCard: [false] // Por padrão, não exibir no card
    });
  }

  ngOnInit() {
    // Inicializar com campos existentes se fornecidos
    if (this.fields && this.fields.length > 0) {
      this.emitFieldsChange();
    }
  }

  removeField(index: number) {
    if (confirm('Tem certeza que deseja remover este campo?')) {
      this.fields.splice(index, 1);
      // Reset selection if removing selected field
      if (this.selectedField === this.fields[index]) {
        this.selectedField = null;
        this.selectedFieldType = '';
      }
      this.emitFieldsChange();
    }
  }

  moveFieldUp(index: number) {
    if (index > 0) {
      const temp = this.fields[index];
      this.fields[index] = this.fields[index - 1];
      this.fields[index - 1] = temp;
      this.updateFieldOrders();
      this.emitFieldsChange();
    }
  }

  moveFieldDown(index: number) {
    if (index < this.fields.length - 1) {
      const temp = this.fields[index];
      this.fields[index] = this.fields[index + 1];
      this.fields[index + 1] = temp;
      this.updateFieldOrders();
      this.emitFieldsChange();
    }
  }

  onDrop(event: CdkDragDrop<FormField[]>) {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
    this.updateFieldOrders();
    this.emitFieldsChange();
  }

  private resetForm() {
    this.fieldsForm.reset({
      type: 'text',
      required: false
    });
  }

  private updateFieldOrders() {
    this.fields.forEach((field, index) => {
      field.order = index;
    });
  }

  private emitFieldsChange() {
    this.fieldsChanged.emit([...this.fields]);
  }

  // Método para obter tipo de campo formatado
  getFieldTypeLabel(type: string): string {
    const fieldType = this.fieldTypes.find(ft => ft.value === type);
    return fieldType ? fieldType.label : type;
  }

  // Novos métodos para o layout Form.io
  selectFieldType(type: string) {
    this.selectedFieldType = type;
    this.fieldsForm.patchValue({ type });
    
    // Auto-gerar nome se estiver vazio
    if (!this.fieldsForm.get('name')?.value) {
      const baseName = type + (this.fields.length + 1);
      this.fieldsForm.patchValue({ name: baseName });
    }
  }

  selectField(field: FormField, index: number) {
    this.selectedField = field;
    this.editField(index);
  }

  getFieldTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'text': 'fas fa-font',
      'email': 'fas fa-envelope',
      'tel': 'fas fa-phone',
      'number': 'fas fa-hashtag',
      'cnpj': 'fas fa-building',
      'cpf': 'fas fa-id-card',
      'temperatura': 'fas fa-thermometer-half',
      'textarea': 'fas fa-align-left',
      'select': 'fas fa-list',
      'checkbox': 'fas fa-check-square',
      'radio': 'fas fa-dot-circle',
      'date': 'fas fa-calendar',
      'time': 'fas fa-clock',
      'file': 'fas fa-upload'
    };
    return icons[type] || 'fas fa-question';
  }

  getFieldTypeDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      'text': 'Campo de texto simples',
      'email': 'Campo de e-mail com validação',
      'tel': 'Telefone com máscara DDD Brasil',
      'number': 'Campo numérico',
      'cnpj': 'CNPJ com máscara e validação',
      'cpf': 'CPF com máscara e validação',
      'temperatura': 'Lista suspensa (Quente, Morno, Frio)',
      'textarea': 'Área de texto multilinha',
      'select': 'Lista suspensa',
      'checkbox': 'Caixa de seleção',
      'radio': 'Botões de seleção única',
      'date': 'Seletor de data',
      'time': 'Seletor de hora',
      'file': 'Upload de arquivos'
    };
    return descriptions[type] || 'Campo personalizado';
  }

  addField() {
    const formValue = this.fieldsForm.value;
    
    if (!formValue.name || !formValue.label) {
      alert('Nome e rótulo são obrigatórios');
      return;
    }

    // Verificar se nome já existe
    if (this.fields.some(f => f.name === formValue.name && this.editingIndex === -1)) {
      alert('Já existe um campo com este nome');
      return;
    }

    const newField: FormField = {
      name: formValue.name,
      label: formValue.label,
      type: formValue.type || this.selectedFieldType,
      required: formValue.required || false,
      order: this.editingIndex >= 0 ? this.fields[this.editingIndex].order : this.fields.length,
      includeInApi: formValue.includeInApi !== false, // Default true
      showInCard: formValue.showInCard || false, // Default false
      // Só incluir propriedades que não sejam undefined
      ...(formValue.placeholder && formValue.placeholder.trim() && { placeholder: formValue.placeholder.trim() }),
      ...(formValue.apiFieldName && formValue.apiFieldName.trim() && { apiFieldName: formValue.apiFieldName.trim() })
    };

    // Processar opções para select, radio e temperatura
    if ((newField.type === 'select' || newField.type === 'radio') && formValue.options) {
      newField.options = formValue.options
        .split('\n')
        .map((opt: string) => opt.trim())
        .filter((opt: string) => opt);
    }

    // Auto-configurar opções para campo temperatura
    if (newField.type === 'temperatura') {
      newField.options = ['Quente', 'Morno', 'Frio'];
    }

    if (this.editingIndex >= 0) {
      // Editando campo existente
      this.fields[this.editingIndex] = newField;
      this.editingIndex = -1;
      this.selectedField = null;
    } else {
      // Adicionando novo campo
      this.fields.push(newField);
    }

    this.resetForm();
    this.emitFieldsChange();
  }

  editField(index: number) {
    const field = this.fields[index];
    this.editingIndex = index;
    this.editingField = { ...field };
    this.selectedFieldType = field.type;
    this.selectedField = field;

    this.fieldsForm.patchValue({
      name: field.name,
      label: field.label,
      type: field.type,
      required: field.required,
      placeholder: field.placeholder || '',
      options: field.options ? field.options.join('\n') : '',
      includeInApi: field.includeInApi !== false, // Default true se não especificado
      apiFieldName: field.apiFieldName || '',
      showInCard: field.showInCard || false // Default false se não especificado
    });
  }

  cancelEdit() {
    this.editingIndex = -1;
    this.editingField = null;
    this.selectedField = null;
    this.selectedFieldType = '';
    this.resetForm();
  }

  getPrimaryColor(): string {
    const company = this.subdomainService.getCurrentCompany();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || '#3B82F6';
  }

  getPlaceholderExample(type: string): string {
    const examples: { [key: string]: string } = {
      'text': 'Ex: Digite seu nome',
      'email': 'Ex: usuario@exemplo.com',
      'tel': 'Ex: (11) 99999-9999',
      'number': 'Ex: 123',
      'cnpj': 'Ex: 00.000.000/0000-00',
      'cpf': 'Ex: 000.000.000-00',
      'textarea': 'Ex: Digite suas observações...',
      'date': '',
      'time': ''
    };
    return examples[type] || 'Ex: Digite aqui';
  }

  // Gerar estrutura de dados para API baseada nos campos marcados
  generateApiSchema(): any {
    const apiFields = this.fields.filter(field => field.includeInApi !== false);
    
    const schema = {
      fields: apiFields.map(field => ({
        name: field.apiFieldName || field.name,
        originalName: field.name,
        label: field.label,
        type: this.mapFieldTypeForApi(field.type),
        required: field.required,
        validation: this.getValidationRules(field),
        ...(field.options && { options: field.options })
      })),
      totalFields: apiFields.length,
      generatedAt: new Date().toISOString()
    };

    return schema;
  }

  // Mapear tipos de campo para tipos da API
  private mapFieldTypeForApi(fieldType: string): string {
    const typeMap: { [key: string]: string } = {
      'text': 'string',
      'email': 'email',
      'tel': 'phone',
      'number': 'number',
      'cnpj': 'cnpj',
      'cpf': 'cpf',
      'temperatura': 'enum',
      'textarea': 'text',
      'select': 'enum',
      'checkbox': 'boolean',
      'radio': 'enum',
      'date': 'date',
      'time': 'time',
      'file': 'file'
    };
    return typeMap[fieldType] || 'string';
  }

  // Obter regras de validação para a API
  private getValidationRules(field: FormField): any {
    const rules: any = {};
    
    if (field.required) {
      rules.required = true;
    }

    switch (field.type) {
      case 'email':
        rules.format = 'email';
        break;
      case 'cnpj':
        rules.format = 'cnpj';
        rules.mask = '00.000.000/0000-00';
        break;
      case 'cpf':
        rules.format = 'cpf';
        rules.mask = '000.000.000-00';
        break;
      case 'tel':
        rules.format = 'phone';
        rules.mask = '(00) 00000-0000';
        break;
      case 'temperatura':
      case 'select':
      case 'radio':
        if (field.options) {
          rules.enum = field.options;
        }
        break;
      case 'file':
        rules.type = 'file';
        if (field.placeholder === 'multiple') {
          rules.multiple = true;
        }
        break;
    }

    return rules;
  }

  // Mostrar schema da API no console e como alerta
  showApiSchema(): void {
    const schema = this.generateApiSchema();
    const jsonSchema = JSON.stringify(schema, null, 2);
    
    console.log('📋 Schema da API gerado:', schema);
    console.log('📋 JSON Schema:', jsonSchema);
    
    // Mostrar em um alert formatado (para desenvolvimento)
    const summary = `
📋 Schema da API - Resumo:

✅ Campos na API: ${schema.totalFields}/${this.fields.length}
📅 Gerado em: ${new Date().toLocaleString('pt-BR')}

🔗 Campos incluídos na API:
${schema.fields.map((f: any) => `• ${f.label} (${f.name}) - Tipo: ${f.type}${f.required ? ' *' : ''}`).join('\n')}

📋 Schema completo salvo no console para cópia.
    `;
    
    alert(summary);
  }
}