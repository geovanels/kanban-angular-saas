import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Lead, Column } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { SubdomainService } from '../../services/subdomain.service';

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
  private subdomainService = inject(SubdomainService);
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
  formReady = false;
  leadHistory: LeadHistory[] = [];
  phaseHistory: PhaseHistory = {};
  // Fluxo de transições (permitidas)
  private flowConfig: { allowed: Record<string, string[]> } = { allowed: {} };
  
  // Form para atualização do lead
  leadForm: FormGroup = this.fb.group({});
  
  // Sistema de comentários
  commentText = '';
  selectedFile: File | null = null;
  attachmentPreview = '';
  isUploadingComment = false;
  isUploadingAttachment = false;
  showDeleteConfirm = false;

  // Link público
  publicLink = '';
  private unsubscribeHistory: (() => void) | null = null;
  // Configuração do formulário inicial (somente leitura)
  initialFormConfig: any | null = null;

  async show(lead: Lead) {
    this.currentLead = lead;
    this.isVisible = true;
    this.resetForm();
    await this.loadLeadData();
    // Repopular o formulário com os dados salvos do lead
    try {
      const values: any = {};
      (this.currentFormFields || []).forEach((f: any) => {
        const key = f.apiFieldName || f.name;
        values[f.name] = this.getFieldValue(key) ?? '';
      });
      if (Object.keys(values).length) {
        this.leadForm.patchValue(values, { emitEvent: false });
      }
    } catch {}
    // Subscribir histórico em tempo real
    try {
      if (this.unsubscribeHistory) { this.unsubscribeHistory(); this.unsubscribeHistory = null; }
      this.unsubscribeHistory = this.firestoreService.subscribeToLeadHistory(
        this.ownerId,
        this.boardId,
        this.currentLead.id!,
        (items) => { this.leadHistory = items as any; }
      ) as any;
    } catch {}
  }

  hide() {
    this.isVisible = false;
    this.resetForm();
    if (this.unsubscribeHistory) { this.unsubscribeHistory(); this.unsubscribeHistory = null; }
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
    this.formReady = false;
  }

  private async loadLeadData() {
    if (!this.currentLead) return;

    try {
      // Buscar versão mais recente do lead para garantir phaseHistory atualizado
      try {
        const latest = await this.firestoreService.getLead(this.ownerId, this.boardId, this.currentLead.id!);
        if (latest) {
          this.currentLead = latest;
        }
      } catch {}

      // Carregar histórico do lead
      const history = await this.firestoreService.getLeadHistory(
        this.ownerId,
        this.boardId,
        this.currentLead.id!
      );
      this.leadHistory = history as LeadHistory[];

      // Extrair histórico de fases
      this.phaseHistory = this.currentLead.phaseHistory || {};

      // Carregar configuração do formulário inicial do board
      this.initialFormConfig = await this.firestoreService.getInitialFormConfig(this.boardId);

      // Carregar configuração do formulário da fase atual
      try {
        const phaseCfg = await this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, this.currentLead.columnId);
        this.currentFormFields = (phaseCfg as any)?.fields || [];
      } catch (e) {
        console.warn('Sem configuração da fase atual, tentando formulário inicial como fallback.', e);
        this.currentFormFields = (this.initialFormConfig?.fields || []).map((f: any) => ({ ...f }));
      }

      // Carregar fluxo de transições para validar movimentos e listas
      try {
        const cfg = await this.firestoreService.getFlowConfig(this.boardId);
        this.flowConfig = (cfg as any) || { allowed: {} };
      } catch {
        this.flowConfig = { allowed: {} };
      }

      // Construir formulário dinâmico baseado na fase atual
      await this.buildDynamicForm();
      this.formReady = true;

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
    this.formReady = false;
    
    // Adicionar campos dinâmicos da fase (se configurados)
    (this.currentFormFields || []).forEach((field: any) => {
      const key = field.apiFieldName || field.name;
      let currentValue = this.getFieldValue(key);
      if (currentValue === undefined || currentValue === null || (typeof currentValue === 'string' && currentValue.trim() === '')) {
        currentValue = this.getFieldValue(field.name);
      }
      // Temperatura: normalizar para uma das opções
      if (field.type === 'temperatura') {
        const options = field.options && field.options.length ? field.options : ['Quente','Morno','Frio'];
        if (typeof currentValue === 'string') {
          const match = options.find((o: string) => o.toLowerCase() === currentValue.toLowerCase());
          currentValue = match || '';
        }
      }
      // Campo Responsável: armazenar uid do usuário se houver mapeamento nos campos do lead
      if (field.type === 'responsavel') {
        // tentar ler do lead o responsibleUserId
        const responsibleId = this.currentLead?.responsibleUserId || currentValue;
        formConfig[field.name] = [responsibleId ?? ''];
      } else {
        formConfig[field.name] = [currentValue ?? ''];
      }
    });

    this.leadForm = this.fb.group(formConfig);
    this.formReady = true;
  }

  getCurrentColumn(): Column | null {
    if (!this.currentLead) return null;
    return this.columns.find(col => col.id === this.currentLead!.columnId) || null;
  }

  getInitialColumn(): Column | null {
    return this.columns.find(col => col.order === 0) || null;
  }

  getInitialFields(): any[] {
    // Se houver configuração de formulário inicial, usar esses campos na ordem definida
    if (this.initialFormConfig?.fields?.length) {
      const sorted = this.initialFormConfig.fields
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      return sorted.map((f: any) => ({
        name: f.apiFieldName || f.name,
        label: f.label || f.name || f.apiFieldName,
        value: this.getFieldValue(f.apiFieldName || f.name) ?? this.getFieldValue(f.name) ?? 'Não informado'
      }));
    }

    // Fallback dinâmico com deduplicação por grupos de sinônimos
    return this.buildDedupedDisplayFields();
  }

  currentFormFields: any[] = [];

  hasRequiredToAdvance(): boolean {
    try {
      return Array.isArray(this.currentFormFields) && this.currentFormFields.some((f: any) => !!f?.requiredToAdvance);
    } catch { return false; }
  }


  getPhaseHistoryItems(): any[] {
    console.log('📊 Gerando histórico de fases:', {
      leadId: this.currentLead?.id,
      phaseHistory: this.phaseHistory,
      phaseHistoryKeys: Object.keys(this.phaseHistory || {}),
      phaseHistoryLength: Object.keys(this.phaseHistory || {}).length,
      availableColumns: this.columns.map(c => ({ id: c.id, name: c.name }))
    });

    const items: any[] = [];
    
    Object.values(this.phaseHistory).forEach((phase: any) => {
      const column = this.columns.find(col => col.id === phase.phaseId);
      console.log('📊 Processando fase:', {
        phaseId: phase.phaseId,
        columnFound: !!column,
        columnName: column?.name,
        phase: phase
      });

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
        } else if (!exitedAt) {
          // Calcular duração em tempo real para fase atual
          const now = new Date();
          const elapsed = now.getTime() - enteredAt.getTime();
          const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
          const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          if (days > 0) {
            duration = `${days}d ${hours}h (em andamento)`;
          } else {
            duration = `${hours}h (em andamento)`;
          }
        }

        const item = {
          phaseName: column.name,
          phaseColor: column.color,
          enteredAt: enteredAt.toLocaleString('pt-BR'),
          exitedAt: exitedAt?.toLocaleString('pt-BR') || 'Atual',
          duration: duration || 'Em andamento',
          isCurrentPhase: !exitedAt && this.currentLead?.columnId === phase.phaseId
        };

        console.log('📊 Item de histórico criado:', item);
        items.push(item);
      }
    });

    console.log('📊 Total de itens processados:', items.length);

    // Fallback: se não houver históricos registrados, exibir fase atual como entrada
    if (items.length === 0 && this.currentLead) {
      console.log('📊 Nenhum histórico encontrado, criando fallback para fase atual');
      const currentColumn = this.getCurrentColumn();
      if (currentColumn) {
        const enteredAt = (this.currentLead.movedToCurrentColumnAt?.toDate && this.currentLead.movedToCurrentColumnAt.toDate())
          || this.currentLead.movedToCurrentColumnAt
          || (this.currentLead.createdAt?.toDate && this.currentLead.createdAt.toDate())
          || this.currentLead.createdAt
          || new Date();
        
        const fallbackItem = {
          phaseName: currentColumn.name,
          phaseColor: currentColumn.color,
          enteredAt: (enteredAt instanceof Date ? enteredAt : new Date(enteredAt)).toLocaleString('pt-BR'),
          exitedAt: 'Atual',
          duration: 'Em andamento',
          isCurrentPhase: true
        };

        console.log('📊 Item fallback criado:', fallbackItem);
        items.push(fallbackItem);
      }
    }

    const sortedItems = items.sort((a, b) => new Date(a.enteredAt).getTime() - new Date(b.enteredAt).getTime());
    console.log('📊 Itens finais ordenados:', sortedItems);
    
    return sortedItems;
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

    // Validar: todos os campos marcados como requiredToAdvance devem estar preenchidos
    const missing = (this.currentFormFields || []).filter((f: any) => {
      if (!f.requiredToAdvance) return false;
      const key = f.apiFieldName || f.name;
      const val = this.leadForm.get(f.name)?.value ?? this.getFieldValue(key);
      return val === undefined || val === null || `${val}`.trim() === '';
    });
    if (missing.length) {
      // Se há pendências, impedir avanço exibindo somente mensagem informativa no UI (mantemos retorno vazio)
      return [];
    }

    // Restringir por fluxo (se houver regra definida para a fase atual)
    const allowed = this.flowConfig.allowed[currentColumn.id!] || [];
    // Agora: exige aresta explícita no fluxo
    return this.columns
      .filter(col => col.id !== currentColumn.id && col.order > currentColumn.order)
      .filter(col => allowed.includes(col.id!))
      .sort((a, b) => a.order - b.order);
  }

  getRetreatPhases(): Column[] {
    const currentColumn = this.getCurrentColumn();
    if (!currentColumn) return [];

    // Se estiver na primeira fase, não pode retroceder
    if (currentColumn.order === 0) return [];

    const allowed = this.flowConfig.allowed[currentColumn.id!] || [];
    // Agora: exige aresta explícita no fluxo
    return this.columns
      .filter(col => col.id !== currentColumn.id && col.order < currentColumn.order)
      .filter(col => allowed.includes(col.id!))
      .sort((a, b) => b.order - a.order); // Ordem decrescente para mostrar as mais próximas primeiro
  }

  async saveChanges() {
    if (!this.currentLead || !this.leadForm.valid) return;

    this.isSaving = true;
    this.errorMessage = '';

    try {
      const formData = this.leadForm.value;
      // Mapear apiFieldName -> name para persistir com a chave correta usada na API quando existir
      const mapped: any = { ...formData };
      (this.currentFormFields || []).forEach((f: any) => {
        if (f.apiFieldName && f.apiFieldName !== f.name && mapped.hasOwnProperty(f.name)) {
          mapped[f.apiFieldName] = mapped[f.name];
          delete mapped[f.name];
        }
      });
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Preparar dados de atualização
      const updateData: Partial<Lead> = {
        fields: {
          ...this.currentLead.fields,
          ...mapped
        }
      };

      // Atualizar responsável se mudou
      // Atualizar responsável via campo do formulário caso exista tipo 'responsavel'
      const respFieldDef = (this.currentFormFields || []).find((f: any) => f.type === 'responsavel');
      const respFieldName = respFieldDef?.name;
      const newRespId = respFieldName ? formData[respFieldName] : formData.responsibleUserId;
      if (newRespId && newRespId !== this.currentLead.responsibleUserId) {
        const selectedUser = this.users.find(u => u.uid === newRespId);
        updateData.responsibleUserId = newRespId;
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

      // Registrar diffs de campos (histórico) — incluindo campos do formulário da fase
      try {
        const beforeFields = (this.currentLead.fields || {}) as any;
        const changedKeys = Object.keys(mapped).filter(k => `${beforeFields[k] ?? ''}` !== `${mapped[k] ?? ''}`);
        if (changedKeys.length) {
          const changesList = changedKeys.map(k => {
            const label = (this.currentFormFields || []).find((f: any) => (f.apiFieldName || f.name) === k)?.label || this.humanizeKey(k);
            let beforeVal = beforeFields[k] ?? '';
            let afterVal = mapped[k] ?? '';
            // Se o campo representa responsável, mostrar nome do usuário
            const isResp = (this.currentFormFields || []).some((f: any) => (f.apiFieldName === k || f.name === k) && (f.type === 'responsavel' || f.originalType === 'responsavel'));
            if (isResp) {
              const beforeUser = this.users.find(u => u.uid === beforeVal || u.email === beforeVal);
              const afterUser = this.users.find(u => u.uid === afterVal || u.email === afterVal);
              beforeVal = beforeUser?.displayName || beforeVal;
              afterVal = afterUser?.displayName || afterVal;
            }
            return `<li><strong>${label}:</strong> "${beforeVal}" → "${afterVal}"</li>`;
          }).join('');
          await this.firestoreService.addLeadHistory(
            this.ownerId,
            this.boardId,
            this.currentLead.id!,
            {
              type: 'update',
              text: `Formulário da fase salvo:<ul class="list-disc ml-4">${changesList}</ul>`,
              user: currentUser.displayName || currentUser.email
            }
          );
        }
      } catch {}

      // Salvar alterações
      await this.firestoreService.updateLead(
        this.ownerId,
        this.boardId,
        this.currentLead.id!,
        updateData
      );

      // Atualizar estado local e manter valores selecionados no form
      this.currentLead.fields = {
        ...(this.currentLead.fields || {}),
        ...mapped
      } as any;
      const afterValues: any = {};
      (this.currentFormFields || []).forEach((f: any) => {
        const key = f.apiFieldName || f.name;
        afterValues[f.name] = mapped.hasOwnProperty(key) ? mapped[key] : (this.getFieldValue(key) ?? '');
      });
      if (Object.keys(afterValues).length) {
        this.leadForm.patchValue(afterValues, { emitEvent: false });
      }
      this.leadUpdated.emit();

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

      // Validar fluxo
      const allowed = this.flowConfig.allowed[oldColumn.id!] || [];
      if (!allowed.includes(targetColumnId)) {
        this.errorMessage = 'Transição não permitida pelo fluxo.';
        return;
      }

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
        enteredAt: now
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

  async uploadAttachment() {
    if (!this.currentLead || !this.selectedFile) return;
    this.isUploadingAttachment = true;
    this.errorMessage = '';
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) throw new Error('Usuário não autenticado');

      const filePath = `leads/${this.currentLead.id}/attachments/${Date.now()}_${this.selectedFile.name}`;
      const downloadURL = await this.storageService.uploadFile(this.selectedFile, filePath);

      await this.firestoreService.addLeadHistory(
        this.ownerId,
        this.boardId,
        this.currentLead.id!,
        {
          type: 'comment',
          text: 'Anexou um arquivo',
          user: currentUser.displayName || currentUser.email,
          timestamp: new Date(),
          attachment: {
            name: this.selectedFile.name,
            url: downloadURL,
            type: this.selectedFile.type,
            size: this.selectedFile.size
          }
        }
      );

      this.clearAttachment();
      await this.loadLeadData();
    } catch (e: any) {
      this.errorMessage = e.message || 'Erro ao anexar arquivo';
    } finally {
      this.isUploadingAttachment = false;
    }
  }

  private generatePublicLink() {
    if (!this.currentLead) return;

    const currentColumn = this.getCurrentColumn();
    if (!currentColumn) return;

    // Gerar link público usando o SubdomainService
    const company = this.subdomainService.getCurrentCompany();
    if (company) {
      const isDev = this.subdomainService.isDevelopment();
      
      if (isDev) {
        // Em desenvolvimento: /form?subdomain=X&outros_params
        const baseUrl = this.subdomainService.getBaseUrl();
        this.publicLink = `${baseUrl}/form?subdomain=${company.subdomain}&companyId=${company.id}&userId=${this.ownerId}&boardId=${this.boardId}&leadId=${this.currentLead.id}&columnId=${currentColumn.id}`;
      } else {
        // Em produção: https://subdomain.taskboard.com.br/form?params
        this.publicLink = `https://${company.subdomain}.taskboard.com.br/form?companyId=${company.id}&userId=${this.ownerId}&boardId=${this.boardId}&leadId=${this.currentLead.id}&columnId=${currentColumn.id}`;
      }
    }
  }

  copyPublicLink() {
    if (this.publicLink) {
      navigator.clipboard.writeText(this.publicLink);
      // Aqui você pode adicionar uma notificação de que o link foi copiado
    }
  }

  async deleteLead() {
    if (!this.currentLead) return;
    // Confirmação será exibida via modal estilizado
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

  openDeleteConfirm() {
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  async confirmDelete() {
    await this.deleteLead();
    this.showDeleteConfirm = false;
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

  copyLeadId() {
    if (this.currentLead?.id) {
      navigator.clipboard.writeText(this.currentLead.id);
    }
  }

  

  private isPlainObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  private flattenObject(source: any, maxDepth: number = 3): Record<string, any> {
    const out: Record<string, any> = {};
    if (!this.isPlainObject(source) || maxDepth < 0) return out;
    for (const [key, val] of Object.entries(source)) {
      if (this.isPlainObject(val) && maxDepth > 0) {
        // Pull up nested primitives one level deeper as loose fields as well
        const nested = this.flattenObject(val, maxDepth - 1);
        for (const [nk, nv] of Object.entries(nested)) {
          if (out[nk] === undefined) out[nk] = nv;
        }
      } else if (val !== undefined && val !== null) {
        out[key] = val as any;
      }
    }
    return out;
  }

  private collectLeadFields(): Record<string, any> {
    // Accept various shapes produced by different API versions
    // Examples: { fields: {...} }, { fields: { fields: {...} } }, { fields: { leadData: {...} } }, etc.
    const base = (this.currentLead?.fields || {}) as any;
    const containers = ['fields', 'leadData', 'data', 'payload'];

    // Merge shallow base, known containers and a generic recursive flatten (limited depth)
    const merged: Record<string, any> = {};
    const candidates: any[] = [base];
    containers.forEach(k => {
      if (this.isPlainObject(base[k])) candidates.push(base[k]);
    });
    // Common double nesting like fields.fields
    if (this.isPlainObject(base.fields?.fields)) candidates.push(base.fields.fields);

    for (const obj of candidates) {
      for (const [k, v] of Object.entries(obj)) {
        if (merged[k] === undefined && v !== undefined && v !== null && `${v}`.trim?.() !== '') {
          merged[k] = v;
        }
      }
    }

    // Fallback: recursive pick of primitives inside nested objects
    const deep = this.flattenObject(base, 3);
    for (const [k, v] of Object.entries(deep)) {
      if (merged[k] === undefined && v !== undefined && v !== null && `${v}`.trim?.() !== '') {
        merged[k] = v;
      }
    }

    return merged;
  }

  private getFieldValue(requestedName: string): any {
    const fields = this.collectLeadFields();
    if (!requestedName) return undefined;

    const synonyms: { [canonical: string]: string[] } = {
      companyName: ['companyName', 'empresa', 'nomeEmpresa', 'nameCompany', 'company', 'company_name', 'empresa_nome', 'nameComapny'],
      cnpj: ['cnpj', 'cnpjCompany'],
      contactName: ['contactName', 'name', 'nome', 'nomeLead', 'nameLead', 'leadName'],
      contactEmail: ['contactEmail', 'email', 'emailLead', 'contatoEmail', 'leadEmail'],
      contactPhone: ['contactPhone', 'phone', 'telefone', 'celular', 'phoneLead', 'telefoneContato'],
      temperature: ['temperature', 'temperatura', 'qualificacao', 'leadTemperature']
    };

    const lowerMap: { [k: string]: string } = Object.keys(fields).reduce((acc: any, k: string) => {
      acc[k.toLowerCase()] = k;
      return acc;
    }, {});

    const req = requestedName.toLowerCase();

    // Construir lista de candidatos: pedido, seus sinônimos e canônicos equivalentes
    const candidates: string[] = [requestedName];

    // Adicionar sinônimos se o requestedName já for canônico
    if (synonyms[requestedName]) {
      candidates.push(...synonyms[requestedName]);
    }

    // Se requestedName é um alias, adicionar o canônico correspondente e os aliases dele
    for (const [canonical, aliases] of Object.entries(synonyms)) {
      if (canonical.toLowerCase() === req || aliases.some(a => a.toLowerCase() === req)) {
        candidates.push(canonical, ...aliases);
      }
    }

    // Remover duplicados preservando ordem
    const visited = new Set<string>();
    for (const c of candidates) {
      const key = c.toLowerCase();
      if (visited.has(key)) continue;
      visited.add(key);
      const original = lowerMap[key];
      if (original !== undefined) {
        const val = fields[original];
        if (val !== undefined && val !== null && (typeof val !== 'string' || val.trim() !== '')) {
          return val;
        }
      }
    }
    return undefined;
  }

  private humanizeKey(key: string): string {
    // Converte camelCase/snake_case para Título com espaços
    const withSpaces = key
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }

  private getLabelForOriginalKey(originalKey: string, canonicalKey: string): string {
    // 1) Se houver configuração de formulário inicial, tente achar o label pelo nome original ou canônico
    const fieldsCfg = (this.initialFormConfig?.fields || []) as any[];
    if (Array.isArray(fieldsCfg) && fieldsCfg.length) {
      const found = fieldsCfg.find(f => {
        const apiName = (f.apiFieldName || '').toString();
        const name = (f.name || '').toString();
        return apiName === originalKey || name === originalKey || apiName === canonicalKey || name === canonicalKey;
      });
      if (found?.label) return found.label;
    }
    // 2) Preferir humanizar a chave original (ex.: nameLead → Name Lead)
    const humanOriginal = this.humanizeKey(originalKey);
    if (humanOriginal) return humanOriginal;
    // 3) Fallback: humanizar canônico
    return this.humanizeKey(canonicalKey);
  }

  private buildDedupedDisplayFields(): Array<{ name: string; label: string; value: any }> {
    const raw = this.collectLeadFields();

    const groups: Record<string, string[]> = {
      companyName: ['companyName', 'empresa', 'nomeEmpresa', 'nameCompany', 'company', 'company_name', 'empresa_nome', 'nameComapny'],
      cnpj: ['cnpj', 'cnpjCompany'],
      contactName: ['contactName', 'name', 'nome', 'nomeLead', 'nameLead', 'leadName'],
      contactEmail: ['contactEmail', 'email', 'emailLead', 'contatoEmail', 'leadEmail'],
      contactPhone: ['contactPhone', 'phone', 'telefone', 'celular', 'phoneLead', 'telefoneContato'],
      temperature: ['temperature', 'temperatura', 'qualificacao', 'leadTemperature']
    };

    const labelMap: Record<string, string> = {
      companyName: 'Nome da empresa',
      cnpj: 'CNPJ da empresa',
      contactName: 'Nome do contato',
      contactEmail: 'E-mail de contato',
      contactPhone: 'Telefone',
      temperature: 'Temperatura'
    };

    const lowerMap: Record<string, string> = Object.keys(raw).reduce((acc: any, k: string) => {
      acc[k.toLowerCase()] = k; return acc;
    }, {});

    const usedOriginalKeys = new Set<string>();
    const out: Array<{ name: string; label: string; value: any; order: number }> = [];

    const pickFromAliases = (aliases: string[]) => {
      for (const a of aliases) {
        const orig = lowerMap[a.toLowerCase()];
        if (orig && raw[orig] !== undefined && raw[orig] !== null && `${raw[orig]}`.trim() !== '') {
          usedOriginalKeys.add(orig);
          return { key: orig, value: raw[orig] };
        }
      }
      return null;
    };

    const orderMap: Record<string, number> = { companyName: 1, cnpj: 2, contactName: 3, contactEmail: 4, contactPhone: 5, temperature: 6 };

    // Inserir grupos canônicos sem duplicar
    for (const canonical of Object.keys(groups)) {
      const found = pickFromAliases(groups[canonical]);
      if (found) {
        const label = this.getLabelForOriginalKey(found.key, canonical) || labelMap[canonical] || this.humanizeKey(canonical);
        out.push({ name: canonical, label, value: found.value, order: orderMap[canonical] || 999 });
      }
    }

    // Conjunto com todas as chaves-aliás para filtrar duplicados
    const aliasLowerSet = new Set<string>(
      Object.values(groups).flat().map(k => k.toLowerCase())
    );

    // Incluir quaisquer outros campos não cobertos pelos grupos (e não-aliás)
    Object.keys(raw).forEach(orig => {
      const isAlias = aliasLowerSet.has(orig.toLowerCase());
      if (!usedOriginalKeys.has(orig) && !isAlias) {
        out.push({ name: orig, label: this.humanizeKey(orig), value: raw[orig], order: 999 });
      }
    });

    return out
      .filter(item => item.value !== undefined && item.value !== null && `${item.value}`.trim() !== '')
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
      .map(({ order, ...rest }) => rest);
  }
}