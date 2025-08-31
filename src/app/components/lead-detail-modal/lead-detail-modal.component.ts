import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Lead, Column } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';

export interface LeadHistory {
  id?: string;
  type: 'move' | 'comment' | 'update' | 'system';
  text: string;
  user?: string;
  timestamp: any;
  attachment?: {
    name: string;
    url: string;
    type: string;
    size: number;
  };
}

export interface PhaseHistory {
  [phaseId: string]: {
    phaseId: string;
    enteredAt: any;
    exitedAt?: any;
    duration?: number;
  };
}

@Component({
  selector: 'app-lead-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lead-detail-modal.component.html',
  styleUrls: ['./lead-detail-modal.component.scss']
})
export class LeadDetailModalComponent {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);

  @Input() ownerId: string = '';
  @Input() boardId: string = '';
  @Input() columns: Column[] = [];
  @Input() users: any[] = [];
  
  @Output() leadUpdated = new EventEmitter<void>();
  @Output() leadDeleted = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  isVisible = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  currentLead: Lead | null = null;
  leadHistory: LeadHistory[] = [];
  phaseHistory: PhaseHistory = {};
  
  // Form para atualização do lead
  leadForm: FormGroup = this.fb.group({});
  
  // Sistema de comentários
  commentText = '';
  selectedFile: File | null = null;
  attachmentPreview = '';
  isUploadingComment = false;

  // Link público
  publicLink = '';

  async show(lead: Lead) {
    this.currentLead = lead;
    this.isVisible = true;
    this.resetForm();
    await this.loadLeadData();
  }

  hide() {
    this.isVisible = false;
    this.resetForm();
    this.closeModal.emit();
  }

  private resetForm() {
    this.leadForm = this.fb.group({});
    this.commentText = '';
    this.selectedFile = null;
    this.attachmentPreview = '';
    this.errorMessage = '';
    this.publicLink = '';
    this.leadHistory = [];
    this.phaseHistory = {};
  }

  private async loadLeadData() {
    if (!this.currentLead) return;

    try {
      // Carregar histórico do lead
      const history = await this.firestoreService.getLeadHistory(
        this.ownerId,
        this.boardId,
        this.currentLead.id!
      );
      this.leadHistory = history as LeadHistory[];

      // Extrair histórico de fases
      this.phaseHistory = this.currentLead.phaseHistory || {};

      // Carregar campos do formulário atual
      await this.loadCurrentFormFields();

      // Construir formulário dinâmico baseado na fase atual
      await this.buildDynamicForm();

      // Gerar link público
      this.generatePublicLink();

    } catch (error) {
      console.error('Erro ao carregar dados do lead:', error);
      this.errorMessage = 'Erro ao carregar dados do lead.';
    }
  }

  private async buildDynamicForm() {
    if (!this.currentLead) return;

    const formConfig: any = {};
    
    // Adicionar campo de responsável
    formConfig['responsibleUserId'] = [this.currentLead.responsibleUserId || ''];
    
    // Adicionar campo de temperatura (padrão)
    formConfig['temperature'] = [this.currentLead.fields?.['temperature'] || ''];
    
    // Adicionar campos dinâmicos
    this.currentFormFields.forEach((field: any) => {
      const currentValue = this.currentLead!.fields?.[field.name] || '';
      formConfig[field.name] = [currentValue];
    });

    this.leadForm = this.fb.group(formConfig);
  }

  getCurrentColumn(): Column | null {
    if (!this.currentLead) return null;
    return this.columns.find(col => col.id === this.currentLead!.columnId) || null;
  }

  getInitialColumn(): Column | null {
    return this.columns.find(col => col.order === 0) || null;
  }

  getInitialFields(): any[] {
    const initialColumn = this.getInitialColumn();
    if (!initialColumn) return [];
    
    // Retornar campos básicos do lead
    const fields = [
      { name: 'companyName', label: 'Empresa' },
      { name: 'cnpj', label: 'CNPJ' },
      { name: 'contactName', label: 'Contato' },
      { name: 'contactEmail', label: 'Email' },
      { name: 'contactPhone', label: 'Telefone' },
      { name: 'temperature', label: 'Temperatura' }
    ];

    return fields.map(field => ({
      ...field,
      value: this.currentLead?.fields?.[field.name] || 'Não informado'
    }));
  }

  currentFormFields: any[] = [];

  private async loadCurrentFormFields() {
    const currentColumn = this.getCurrentColumn();
    if (!currentColumn) {
      this.currentFormFields = [];
      return;
    }

    try {
      const phaseFormConfig = await this.firestoreService.getPhaseFormConfig(
        this.ownerId,
        this.boardId,
        currentColumn.id!
      );

      this.currentFormFields = (phaseFormConfig as any)?.fields || [];
    } catch (error) {
      console.error('Erro ao buscar campos do formulário:', error);
      this.currentFormFields = [];
    }
  }

  getPhaseHistoryItems(): any[] {
    const items: any[] = [];
    
    Object.values(this.phaseHistory).forEach((phase: any) => {
      const column = this.columns.find(col => col.id === phase.phaseId);
      if (column) {
        const enteredAt = phase.enteredAt?.toDate ? phase.enteredAt.toDate() : new Date(phase.enteredAt);
        const exitedAt = phase.exitedAt?.toDate ? phase.exitedAt.toDate() : (phase.exitedAt ? new Date(phase.exitedAt) : null);
        
        let duration = '';
        if (phase.duration) {
          const days = Math.floor(phase.duration / (1000 * 60 * 60 * 24));
          const hours = Math.floor((phase.duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          if (days > 0) {
            duration = `${days}d ${hours}h`;
          } else {
            duration = `${hours}h`;
          }
        }

        items.push({
          phaseName: column.name,
          phaseColor: column.color,
          enteredAt: enteredAt.toLocaleString('pt-BR'),
          exitedAt: exitedAt?.toLocaleString('pt-BR') || 'Atual',
          duration: duration || 'Em andamento'
        });
      }
    });

    return items.sort((a, b) => new Date(a.enteredAt).getTime() - new Date(b.enteredAt).getTime());
  }

  getActivityLog(): LeadHistory[] {
    return this.leadHistory
      .sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
  }

  getAvailablePhases(): Column[] {
    const currentColumn = this.getCurrentColumn();
    if (!currentColumn) return [];

    // Fases de finalização não permitem movimento
    if (currentColumn.endStageType && currentColumn.endStageType !== 'none') {
      return [];
    }

    // Retornar todas as fases exceto a atual
    return this.columns.filter(col => col.id !== currentColumn.id);
  }

  getAdvancePhases(): Column[] {
    const currentColumn = this.getCurrentColumn();
    if (!currentColumn) return [];

    // Fases de finalização não permitem movimento
    if (currentColumn.endStageType && currentColumn.endStageType !== 'none') {
      return [];
    }

    // Retornar fases com order maior que a atual (avanço)
    return this.columns
      .filter(col => col.id !== currentColumn.id && col.order > currentColumn.order)
      .sort((a, b) => a.order - b.order);
  }

  getRetreatPhases(): Column[] {
    const currentColumn = this.getCurrentColumn();
    if (!currentColumn) return [];

    // Se estiver na primeira fase, não pode retroceder
    if (currentColumn.order === 0) return [];

    // Retornar fases com order menor que a atual (retrocesso)
    return this.columns
      .filter(col => col.id !== currentColumn.id && col.order < currentColumn.order)
      .sort((a, b) => b.order - a.order); // Ordem decrescente para mostrar as mais próximas primeiro
  }

  async saveChanges() {
    if (!this.currentLead || !this.leadForm.valid) return;

    this.isSaving = true;
    this.errorMessage = '';

    try {
      const formData = this.leadForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Preparar dados de atualização
      const updateData: Partial<Lead> = {
        fields: {
          ...this.currentLead.fields,
          ...formData
        }
      };

      // Atualizar responsável se mudou
      if (formData.responsibleUserId !== this.currentLead.responsibleUserId) {
        const selectedUser = this.users.find(u => u.uid === formData.responsibleUserId);
        updateData.responsibleUserId = formData.responsibleUserId;
        updateData.responsibleUserName = selectedUser?.displayName || '';
        updateData.responsibleUserEmail = selectedUser?.email || '';

        // Adicionar ao histórico
        await this.firestoreService.addLeadHistory(
          this.ownerId,
          this.boardId,
          this.currentLead.id!,
          {
            type: 'update',
            text: `Responsável alterado para <strong>${selectedUser?.displayName || 'Ninguém'}</strong>`,
            user: currentUser.displayName || currentUser.email
          }
        );
      }

      // Salvar alterações
      await this.firestoreService.updateLead(
        this.ownerId,
        this.boardId,
        this.currentLead.id!,
        updateData
      );

      this.leadUpdated.emit();
      
      // Recarregar dados
      await this.loadLeadData();

    } catch (error: any) {
      console.error('Erro ao salvar alterações:', error);
      this.errorMessage = 'Erro ao salvar alterações. Tente novamente.';
    } finally {
      this.isSaving = false;
    }
  }

  async moveLead(targetColumnId: string) {
    if (!this.currentLead) return;

    this.isLoading = true;

    try {
      const oldColumn = this.getCurrentColumn();
      const newColumn = this.columns.find(col => col.id === targetColumnId);
      const currentUser = this.authService.getCurrentUser();
      
      if (!oldColumn || !newColumn || !currentUser) return;

      // Atualizar histórico de fases
      const now = new Date();
      const phaseHistory = { ...this.phaseHistory };

      // Finalizar fase atual
      if (phaseHistory[oldColumn.id!]) {
        const enteredAt = phaseHistory[oldColumn.id!].enteredAt?.toDate() || new Date();
        phaseHistory[oldColumn.id!].exitedAt = now;
        phaseHistory[oldColumn.id!].duration = now.getTime() - enteredAt.getTime();
      }

      // Iniciar nova fase
      phaseHistory[targetColumnId] = {
        phaseId: targetColumnId,
        enteredAt: now,
        exitedAt: undefined,
        duration: undefined
      };

      // Salvar movimento
      await this.firestoreService.moveLead(
        this.ownerId,
        this.boardId,
        this.currentLead.id!,
        targetColumnId
      );

      // Adicionar ao histórico
      await this.firestoreService.addLeadHistory(
        this.ownerId,
        this.boardId,
        this.currentLead.id!,
        {
          type: 'move',
          text: `Moveu de <strong>${oldColumn.name}</strong> para <strong>${newColumn.name}</strong>`,
          user: currentUser.displayName || currentUser.email
        }
      );

      // Atualizar histórico de fases
      await this.firestoreService.updateLead(
        this.ownerId,
        this.boardId,
        this.currentLead.id!,
        { phaseHistory }
      );

      this.leadUpdated.emit();
      this.hide();

    } catch (error) {
      console.error('Erro ao mover lead:', error);
      this.errorMessage = 'Erro ao mover lead. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Verificar tamanho do arquivo (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.errorMessage = 'Arquivo muito grande. O tamanho máximo é 10MB.';
        event.target.value = ''; // Limpar input
        return;
      }

      // Verificar tipos de arquivo permitidos
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
        'application/pdf', 
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/zip',
        'application/x-rar-compressed'
      ];

      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Tipo de arquivo não permitido. Use: PDF, DOC, DOCX, JPG, PNG, GIF, TXT, ZIP, RAR.';
        event.target.value = ''; // Limpar input
        return;
      }

      this.selectedFile = file;
      this.attachmentPreview = `📎 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
      this.errorMessage = ''; // Limpar erro anterior
    }
  }

  clearAttachment() {
    this.selectedFile = null;
    this.attachmentPreview = '';
  }

  async addComment() {
    if (!this.currentLead || (!this.commentText.trim() && !this.selectedFile)) {
      this.errorMessage = 'Digite um comentário ou anexe um arquivo.';
      return;
    }

    this.isUploadingComment = true;
    this.errorMessage = '';

    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      let attachment = null;
      
      // Upload do arquivo se selecionado
      if (this.selectedFile) {
        console.log('Iniciando upload do arquivo:', this.selectedFile.name);
        const filePath = `leads/${this.currentLead.id}/comments/${Date.now()}_${this.selectedFile.name}`;
        
        try {
          const downloadURL = await this.storageService.uploadFile(this.selectedFile, filePath);
          console.log('Upload concluído:', downloadURL);
          
          attachment = {
            name: this.selectedFile.name,
            url: downloadURL,
            type: this.selectedFile.type,
            size: this.selectedFile.size
          };
        } catch (uploadError) {
          console.error('Erro no upload:', uploadError);
          throw new Error('Falha no upload do arquivo. Verifique sua conexão.');
        }
      }

      // Adicionar comentário ao histórico
      const historyData = {
        type: 'comment' as const,
        text: this.commentText.trim() || 'Anexou um arquivo',
        user: currentUser.displayName || currentUser.email,
        timestamp: new Date(),
        attachment
      };

      console.log('Adicionando ao histórico:', historyData);
      
      await this.firestoreService.addLeadHistory(
        this.ownerId,
        this.boardId,
        this.currentLead.id!,
        historyData
      );

      console.log('Comentário adicionado com sucesso');

      // Limpar formulário
      this.commentText = '';
      this.clearAttachment();

      // Recarregar histórico
      await this.loadLeadData();

    } catch (error: any) {
      console.error('Erro ao adicionar comentário:', error);
      this.errorMessage = error.message || 'Erro ao adicionar comentário. Tente novamente.';
    } finally {
      this.isUploadingComment = false;
    }
  }

  private generatePublicLink() {
    if (!this.currentLead) return;

    const currentColumn = this.getCurrentColumn();
    if (!currentColumn) return;

    // Gerar link público baseado no padrão do sistema original
    this.publicLink = `https://www.supplik.com.br/kanban/?page=form&userId=${this.ownerId}&boardId=${this.boardId}&leadId=${this.currentLead.id}&columnId=${currentColumn.id}`;
  }

  copyPublicLink() {
    if (this.publicLink) {
      navigator.clipboard.writeText(this.publicLink);
      // Aqui você pode adicionar uma notificação de que o link foi copiado
    }
  }

  async deleteLead() {
    if (!this.currentLead) return;

    const confirmed = confirm('Tem certeza que deseja apagar este lead? Esta ação não pode ser desfeita.');
    if (!confirmed) return;

    this.isLoading = true;

    try {
      await this.firestoreService.deleteLead(
        this.ownerId,
        this.boardId,
        this.currentLead.id!
      );

      this.leadDeleted.emit();
      this.hide();

    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      this.errorMessage = 'Erro ao excluir lead. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.hide();
    }
  }

  formatDateTime(timestamp: any): string {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('pt-BR');
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'move': return 'fas fa-arrow-right';
      case 'comment': return 'fas fa-comment';
      case 'update': return 'fas fa-edit';
      default: return 'fas fa-info-circle';
    }
  }
}