import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Lead, Column } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';

export interface LeadFormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

@Component({
  selector: 'app-lead-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lead-modal.component.html',
  styleUrls: ['./lead-modal.component.scss']
})
export class LeadModalComponent {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);

  @Input() ownerId: string = '';
  @Input() boardId: string = '';
  @Input() columns: Column[] = [];
  
  @Output() leadCreated = new EventEmitter<void>();
  @Output() leadUpdated = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  isVisible = false;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  currentLead: Lead | null = null;

  leadForm: FormGroup = this.fb.group({});
  formFields: LeadFormField[] = [];
  selectedFiles: File[] = [];

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    // Campos padrão do sistema original
    this.formFields = [
      { name: 'companyName', label: 'Nome da Empresa', type: 'text', required: true },
      { name: 'cnpj', label: 'CNPJ', type: 'text', required: true },
      { name: 'contactName', label: 'Nome do Contato', type: 'text', required: true },
      { name: 'contactEmail', label: 'Email do Contato', type: 'email', required: true },
      { name: 'contactPhone', label: 'Telefone do Contato', type: 'tel', required: true },
      { name: 'temperature', label: 'Temperatura', type: 'select', required: false, options: ['frio', 'morno', 'quente'] },
      { name: 'description', label: 'Observações', type: 'textarea', required: false }
    ];

    this.buildForm();
  }

  private buildForm() {
    const group: any = {};
    
    this.formFields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      if (field.type === 'email') {
        validators.push(Validators.email);
      }
      group[field.name] = ['', validators];
    });

    this.leadForm = this.fb.group(group);
  }

  showCreateModal() {
    this.isEditing = false;
    this.currentLead = null;
    this.isVisible = true;
    this.resetForm();
  }

  showEditModal(lead: Lead) {
    this.isEditing = true;
    this.currentLead = lead;
    this.isVisible = true;
    this.populateForm(lead);
  }

  hide() {
    this.isVisible = false;
    this.resetForm();
    this.closeModal.emit();
  }

  private resetForm() {
    this.leadForm.reset();
    this.errorMessage = '';
    this.selectedFiles = [];
    this.isLoading = false;
  }

  private populateForm(lead: Lead) {
    if (lead.fields) {
      Object.keys(lead.fields).forEach(key => {
        if (this.leadForm.controls[key]) {
          this.leadForm.patchValue({ [key]: lead.fields[key] });
        }
      });
    }
  }

  async saveLead() {
    if (!this.leadForm.valid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formData = this.leadForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      if (this.isEditing && this.currentLead) {
        // Atualizar lead existente
        await this.firestoreService.updateLead(
          this.ownerId,
          this.boardId,
          this.currentLead.id!,
          { fields: formData }
        );

        // Adicionar ao histórico
        await this.firestoreService.addLeadHistory(
          this.ownerId,
          this.boardId,
          this.currentLead.id!,
          {
            type: 'update',
            text: 'Lead atualizado',
            user: currentUser.displayName || currentUser.email
          }
        );

        this.leadUpdated.emit();
      } else {
        // Criar novo lead
        const firstColumn = this.columns.find(col => col.order === 0);
        if (!firstColumn) {
          throw new Error('Nenhuma coluna inicial encontrada');
        }

        const newLead: Omit<Lead, 'id'> = {
          fields: formData,
          columnId: firstColumn.id!,
          companyId: '', // Será preenchido pelo FirestoreService
          boardId: this.boardId,
          createdAt: null, // será preenchido pelo serverTimestamp
          movedToCurrentColumnAt: null,
          responsibleUserId: currentUser.uid,
          responsibleUserName: currentUser.displayName || '',
          responsibleUserEmail: currentUser.email || '',
          phaseHistory: {},
          executedAutomations: {}
        };

        const leadRef = await this.firestoreService.createLead(this.ownerId, this.boardId, newLead);

        // Adicionar ao histórico
        await this.firestoreService.addLeadHistory(
          this.ownerId,
          this.boardId,
          leadRef.id,
          {
            type: 'creation',
            text: `Lead criado na fase <b>${firstColumn.name}</b>`,
            user: currentUser.displayName || currentUser.email
          }
        );

        this.leadCreated.emit();
      }

      this.hide();
    } catch (error: any) {
      console.error('Erro ao salvar lead:', error);
      this.errorMessage = 'Erro ao salvar lead. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.hide();
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.leadForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (control.errors['email']) {
        return 'Email inválido';
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const field = this.formFields.find(f => f.name === fieldName);
    return field?.label || fieldName;
  }
}