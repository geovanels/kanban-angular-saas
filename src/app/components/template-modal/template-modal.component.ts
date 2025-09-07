import { Component, inject, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-template-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
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

  // Editor HTML nativo
  @ViewChild('visualEditor', { static: false }) visualEditor!: ElementRef;

  isVisible = false;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  currentTemplate: any = null;
  // Toggle leve para HTML plano (sem plugin custom do CKEditor)
  showHtmlMode = false;
  
  public editorContent = '';
  
  // CKEditor configuration
  public Editor: any = ClassicEditor;
  public editorConfig = {
    toolbar: {
      items: [
        'heading', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'link', 'bulletedList', 'numberedList', '|',
        'outdent', 'indent', '|',
        'insertTable', 'blockQuote', '|',
        'fontSize', 'fontColor', 'fontBackgroundColor', '|',
        'alignment', '|',
        'undo', 'redo'
      ]
    },
    shouldNotGroupWhenFull: true,
    placeholder: 'Digite o conteúdo do seu template de email aqui...',
    fontSize: {
      options: [9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
    },
    fontColor: {
      colors: [
        { color: '#000000', label: 'Black' },
        { color: '#4d4d4d', label: 'Dim grey' },
        { color: '#999999', label: 'Grey' },
        { color: '#e6e6e6', label: 'Light grey' },
        { color: '#ffffff', label: 'White', hasBorder: true },
        { color: '#e64545', label: 'Red' },
        { color: '#ff9500', label: 'Orange' },
        { color: '#ffff00', label: 'Yellow' },
        { color: '#00ff00', label: 'Light green' },
        { color: '#00ffff', label: 'Cyan' },
        { color: '#0080ff', label: 'Light blue' },
        { color: '#8000ff', label: 'Purple' }
      ]
    }
  };

  templateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    subject: ['', [Validators.required]],
    recipients: [''],
    body: ['', [Validators.required]]
  });

  variables: { name: string; value: string }[] = [];

  ngAfterViewInit() {
    console.log('Template modal inicializado');
  }

  execCommand(command: string) {
    document.execCommand(command, false);
  }

  createLink() {
    const url = window.prompt('Digite a URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }

  // Legacy handlers removidos

  // CKEditor is bound via formControl; no manual syncing to avoid loops

  // Método para inserir variáveis no CKEditor (concat na posição final)
  insertVariable(variable: string) {
    const currentContent = this.templateForm.get('body')?.value || '';
    const newContent = currentContent + ' ' + variable;
    this.templateForm.patchValue({ body: newContent });
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
    this.editorContent = '';
  }

  private populateForm(template: any) {
    console.log('Carregando template:', template);
    this.templateForm.patchValue({
      name: template.name || '',
      subject: template.subject || '',
      recipients: template.recipients || '',
      body: template.body || ''
    });

    // Carregar conteúdo no editor
    this.editorContent = template.body || '';
    console.log('Conteúdo do editor definido:', this.editorContent);
    
    // CKEditor será preenchido automaticamente através do modelo do formulário
    // Aguardar o próximo tick do Angular e definir o conteúdo no editor visual (fallback)
    setTimeout(() => {
      if (this.visualEditor && this.editorContent) {
        this.visualEditor.nativeElement.innerHTML = this.editorContent;
      }
    }, 100);
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

  toggleHtmlMode() {
    // sincroniza editorContent com o form antes de alternar
    this.editorContent = this.templateForm.get('body')?.value || '';
    this.showHtmlMode = !this.showHtmlMode;
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
      
      // Usar o conteúdo do CKEditor
      const body = this.editorContent || '';
      console.log('Salvando template, conteúdo:', body);
      
      console.log('Salvando template com body final:', body);
      
      // Atualizar o form control com o conteúdo do editor
      this.templateForm.patchValue({ body });

      const templateData = {
        name: formData.name,
        subject: formData.subject,
        recipients: formData.recipients || '',
        body: body
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