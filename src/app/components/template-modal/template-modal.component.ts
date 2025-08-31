import { Component, inject, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-template-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
  @ViewChild('htmlEditor', { static: false }) htmlEditor!: ElementRef;

  isVisible = false;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  currentTemplate: any = null;
  showHtmlMode = false;
  
  public editorContent = '';

  templateForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    subject: ['', [Validators.required]],
    recipients: [''],
    body: ['', [Validators.required]]
  });

  variables = [
    { name: 'Nome da Empresa', value: '{{companyName}}' },
    { name: 'CNPJ', value: '{{cnpj}}' },
    { name: 'Nome do Contato', value: '{{contactName}}' },
    { name: 'Email do Contato', value: '{{contactEmail}}' },
    { name: 'Telefone do Contato', value: '{{contactPhone}}' },
    { name: 'Nome do Responsável', value: '{{nomeResponsavel}}' },
    { name: 'Email do Responsável', value: '{{emailResponsavel}}' },
    { name: 'Nome da Fase Atual', value: '{{currentPhaseName}}' },
    { name: 'Data Atual', value: '{{currentDate}}' },
    { name: 'Link do Lead', value: '{{leadLink}}' }
  ];

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

  onVisualEditorChange(event: any) {
    this.editorContent = event.target.innerHTML;
    console.log('Visual editor changed:', this.editorContent);
  }

  onHtmlEditorChange(content: string) {
    this.editorContent = content;
    console.log('HTML editor changed:', this.editorContent);
  }

  showCreateModal() {
    this.isEditing = false;
    this.currentTemplate = null;
    this.isVisible = true;
    this.resetForm();
  }

  showEditModal(template: any) {
    this.isEditing = true;
    this.currentTemplate = template;
    this.isVisible = true;
    this.populateForm(template);
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
    
    // Aguardar o próximo tick do Angular e definir o conteúdo no editor visual
    setTimeout(() => {
      if (this.visualEditor && this.editorContent) {
        this.visualEditor.nativeElement.innerHTML = this.editorContent;
      }
    }, 100);
  }

  toggleHtmlMode() {
    this.showHtmlMode = !this.showHtmlMode;
    
    if (this.showHtmlMode) {
      // Indo para modo HTML
      setTimeout(() => {
        if (this.htmlEditor) {
          this.htmlEditor.nativeElement.value = this.editorContent;
        }
      }, 100);
    } else {
      // Voltando para modo visual
      if (this.htmlEditor) {
        this.editorContent = this.htmlEditor.nativeElement.value;
        setTimeout(() => {
          if (this.visualEditor) {
            this.visualEditor.nativeElement.innerHTML = this.editorContent;
          }
        }, 100);
      }
    }
  }

  insertVariable(variable: string) {
    if (this.showHtmlMode && this.htmlEditor) {
      const textarea = this.htmlEditor.nativeElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + variable + text.substring(end);
      textarea.value = newText;
      textarea.selectionStart = textarea.selectionEnd = start + variable.length;
      this.editorContent = newText;
    } else if (!this.showHtmlMode && this.visualEditor) {
      this.editorContent += variable;
      this.visualEditor.nativeElement.innerHTML = this.editorContent;
    }
  }

  onVisualEditorInput(event: any) {
    this.editorContent = event.target.innerHTML;
  }

  onHtmlEditorInput(event: any) {
    this.editorContent = event.target.value;
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