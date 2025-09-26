import { Component, inject, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-template-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditorModule],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.9/tinymce.min.js' }
  ],
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.scss']
})
export class TemplateModalComponent implements AfterViewInit {
  private firestoreService = inject(FirestoreService);
  private fb = inject(FormBuilder);

  @Input() ownerId: string = '';
  @Input() boardId: string = '';
  
  @Output() templateSaved = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  isVisible = false;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  currentTemplate: any = null;

  public tinymceEditor: any = null;

  // Configuração completa do TinyMCE com todos os recursos gratuitos
  public tinymceConfig = {
    height: 400,
    menubar: 'edit view insert format table tools help',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic underline strikethrough | forecolor backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | ' +
      'table tabledelete | tableprops tablerowprops tablecellprops | ' +
      'tableinsertrowbefore tableinsertrowafter tabledeleterow | ' +
      'tableinsertcolbefore tableinsertcolafter tabledeletecol | ' +
      'link image media | code preview fullscreen | ' +
      'emoticons charmap insertdatetime | help',
    content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; }',
    placeholder: 'Digite o conteúdo do template...',
    branding: false,
    table_default_attributes: {
      border: '1',
      cellpadding: '5',
      cellspacing: '0',
      style: 'border-collapse: collapse; width: 100%;'
    },
    table_default_styles: {
      'border-collapse': 'collapse',
      'width': '100%'
    },
    image_advtab: true,
    link_default_target: '_blank',
    convert_urls: false,
    remove_script_host: false,
    relative_urls: false
  };

  templateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    subject: ['', [Validators.required]],
    recipients: [''],
    body: ['', [Validators.required]]
  });

  variables: { name: string; value: string }[] = [];

  ngAfterViewInit() {
  }

  // Método para inserir variáveis no TinyMCE
  insertVariable(variable: string) {
    if (this.tinymceEditor) {
      try {
        this.tinymceEditor.insertContent(variable);
        this.tinymceEditor.focus();
        return;
      } catch (error) {
        console.warn('Falha ao inserir no TinyMCE:', error);
      }
    }

    // Fallback para o formulário
    const currentContent = this.templateForm.get('body')?.value || '';
    const newContent = currentContent + ' ' + variable;
    this.templateForm.patchValue({ body: newContent });
  }

  // Método quando o TinyMCE é inicializado
  onEditorInit(editor: any) {
    this.tinymceEditor = editor;
    console.log('TinyMCE inicializado');
  }

  showCreateModal() {
    this.isEditing = false;
    this.currentTemplate = null;
    this.isVisible = true;
    this.resetForm();
    this.loadDynamicVariables();
  }

  showEditModal(template: any) {
    this.isEditing = true;
    this.currentTemplate = template;
    this.isVisible = true;
    this.populateForm(template);
    this.loadDynamicVariables();
  }

  hide() {
    this.isVisible = false;
    this.resetForm();
    this.closeModal.emit();
  }

  private resetForm() {
    this.templateForm.reset({
      name: '',
      subject: '',
      recipients: '',
      body: ''
    });
    this.errorMessage = '';
    this.isLoading = false;
  }

  private populateForm(template: any) {
    console.log('Carregando template:', template);
    this.templateForm.patchValue({
      name: template.name || '',
      subject: template.subject || '',
      recipients: template.recipients || '',
      body: template.body || ''
    });

    console.log('Template carregado:', template.body);
  }

  private async loadDynamicVariables() {
    try {
      // Começa com variáveis padrão do sistema
      const base: { name: string; value: string }[] = [
        { name: 'Nome do Responsável', value: '{{nomeResponsavel}}' },
        { name: 'Email do Responsável', value: '{{emailResponsavel}}' },
        { name: 'Nome da Fase Atual', value: '{{currentPhaseName}}' },
        { name: 'Data Atual', value: '{{currentDate}}' },
        { name: 'Link do Registro', value: '{{leadLink}}' }
      ];

      // Tenta carregar campos do formulário inicial para gerar variáveis dinâmicas
      const initial = await this.firestoreService.getInitialFormConfig(this.boardId);
      const dynamic: { name: string; value: string }[] = [];
      const pushField = (f: any) => {
        const key = f.apiFieldName?.trim() || f.name?.trim();
        if (!key) return;
        dynamic.push({ name: f.label || key, value: `{{${key}}}` });
      };
      if (initial?.fields && Array.isArray(initial.fields)) {
        initial.fields.forEach(pushField);
      }

      // Fallback: alguns campos comuns
      if (dynamic.length === 0) {
        dynamic.push(
          { name: 'Nome', value: '{{name}}' },
          { name: 'Email', value: '{{email}}' },
          { name: 'Telefone', value: '{{phone}}' }
        );
      }

      this.variables = [...dynamic, ...base];
    } catch {
      this.variables = [
        { name: 'Nome', value: '{{name}}' },
        { name: 'Email', value: '{{email}}' },
        { name: 'Telefone', value: '{{phone}}' },
        { name: 'Data Atual', value: '{{currentDate}}' }
      ];
    }
  }




  async saveTemplate() {
    if (!this.templateForm.valid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formData = this.templateForm.value;
      
      const templateData = {
        name: formData.name,
        subject: formData.subject,
        recipients: formData.recipients || '',
        body: formData.body || ''
      };

      if (this.isEditing && this.currentTemplate) {
        // Atualizar template existente
        await this.firestoreService.updateEmailTemplate(
          this.ownerId,
          this.boardId,
          this.currentTemplate.id,
          templateData
        );
      } else {
        // Criar novo template
        await this.firestoreService.createEmailTemplate(
          this.ownerId,
          this.boardId,
          templateData
        );
      }

      this.templateSaved.emit();
      this.hide();
    } catch (error: any) {
      console.error('Erro ao salvar template:', error);
      this.errorMessage = 'Erro ao salvar template. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.hide();
    }
  }
}