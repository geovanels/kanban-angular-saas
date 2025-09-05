import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Lead, Column } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { MaskService } from '../../services/mask.service';

interface LeadFormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  options?: string[];
  placeholder?: string;
  includeInApi?: boolean;
  apiFieldName?: string;
  showInCard?: boolean;
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
  private maskService = inject(MaskService);

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

  private async initializeForm() {
    // Tentar carregar campos da primeira fase configurada
    await this.loadFormFieldsFromInitialPhase();
    
    // Se não encontrou campos da fase, usar campos padrão (fallback)
    if (this.formFields.length === 0) {
      this.formFields = [
        { name: 'companyName', label: 'Nome da Empresa', type: 'text', required: true, order: 0, includeInApi: true, showInCard: false },
        { name: 'cnpj', label: 'CNPJ', type: 'cnpj', required: true, order: 1, includeInApi: true, showInCard: false },
        { name: 'contactName', label: 'Nome do Contato', type: 'text', required: true, order: 2, includeInApi: true, showInCard: false },
        { name: 'contactEmail', label: 'Email do Contato', type: 'email', required: true, order: 3, includeInApi: true, showInCard: false },
        { name: 'contactPhone', label: 'Telefone do Contato', type: 'tel', required: true, order: 4, includeInApi: true, showInCard: false },
        { name: 'temperature', label: 'Temperatura', type: 'temperatura', required: false, order: 5, options: ['Quente', 'Morno', 'Frio'], includeInApi: true, showInCard: false },
        { name: 'description', label: 'Observações', type: 'textarea', required: false, order: 6, includeInApi: true, showInCard: false }
      ];
    }

    this.buildForm();
  }

  private async loadFormFieldsFromInitialPhase() {
    try {
      if (this.boardId && this.ownerId) {
        console.log('🔍 Carregando campos do formulário da fase inicial...', { 
          boardId: this.boardId, 
          ownerId: this.ownerId 
        });
        
        // Buscar fase inicial (marcada como isInitialPhase)
        const columns = await this.firestoreService.getColumns(this.ownerId, this.boardId);
        console.log('📋 Colunas encontradas:', columns);
        
        // Encontrar fase inicial ou usar a primeira fase como fallback
        const initialColumn = columns.find((col: any) => col.isInitialPhase) || 
                             columns.sort((a, b) => (a.order || 0) - (b.order || 0))[0];
        
        if (initialColumn) {
          console.log('🎯 Fase inicial encontrada:', initialColumn);
          
          // Buscar configuração do formulário da fase inicial
          const phaseFormConfig = await this.firestoreService.getPhaseFormConfig(
            this.ownerId, 
            this.boardId, 
            initialColumn.id!
          );
          console.log('⚙️ Configuração da fase encontrada:', phaseFormConfig);
          
          if (phaseFormConfig && (phaseFormConfig as any).fields) {
            this.formFields = (phaseFormConfig as any).fields
              .map((field: any) => {
                // Reconstruct temperatura fields properly
                if (field.type === 'temperatura') {
                  if (!field.options || field.options.length === 0) {
                    field.options = ['Quente', 'Morno', 'Frio'];
                  }
                  console.log('🌡️ Campo temperatura reconstruído:', field);
                }
                // Ensure all required properties exist
                return {
                  ...field,
                  includeInApi: field.includeInApi !== false,
                  order: field.order || 0
                };
              })
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            console.log('✅ Formulário carregado da fase inicial:', this.formFields);
          } else {
            console.log('⚠️ Nenhuma configuração de formulário encontrada para a fase');
          }
        } else {
          console.log('⚠️ Nenhuma coluna encontrada no quadro');
        }
      } else {
        console.log('⚠️ BoardId ou OwnerId não definidos:', { boardId: this.boardId, ownerId: this.ownerId });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar campos do formulário da fase:', error);
      // Continua com campos padrão
    }
  }

  private buildForm() {
    const group: any = {};
    
    this.formFields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      
      // Add field type-specific validators
      switch (field.type) {
        case 'email':
          validators.push(Validators.email);
          break;
        case 'cnpj':
          validators.push((control: any) => {
            const value = control.value;
            if (!value) return null;
            return this.maskService.validateCNPJ(value) ? null : { cnpj: true };
          });
          break;
        case 'cpf':
          validators.push((control: any) => {
            const value = control.value;
            if (!value) return null;
            return this.maskService.validateCPF(value) ? null : { cpf: true };
          });
          break;
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

  onFileSelected(event: any, fieldName?: string) {
    const files = event.target.files;
    if (files) {
      if (fieldName) {
        // Armazenar arquivos específicos do campo
        this.leadForm.patchValue({ [fieldName]: Array.from(files) });
      } else {
        // Fallback para compatibilidade
        this.selectedFiles = Array.from(files);
      }
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
      if (control.errors['cnpj']) {
        return 'CNPJ inválido';
      }
      if (control.errors['cpf']) {
        return 'CPF inválido';
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const field = this.formFields.find(f => f.name === fieldName);
    return field?.label || fieldName;
  }

  // Getter para acessar o maskService no template
  get maskHelper() {
    return this.maskService;
  }
}