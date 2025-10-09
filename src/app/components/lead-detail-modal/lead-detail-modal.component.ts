import { Component, inject, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrls: ['./lead-detail-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadDetailModalComponent {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private storageService = inject(StorageService);
  private subdomainService = inject(SubdomainService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

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
  successMessage = '';
  currentLead: Lead | null = null;
  cachedInitialFields: any[] = [];
  formReady = false;
  isLoadingFields = false;
  isLoadingHistory = false;
  fieldsReady = false;
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

  // Cache de configurações de formulários
  private static formConfigCache = new Map<string, any>();
  private static cacheTimestamp = new Map<string, number>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  async show(lead: Lead) {
    // RESET COMPLETO DE ESTADO
    this.fullStateReset();

    this.currentLead = lead;
    this.isVisible = true;

    // Forçar detecção inicial
    this.cdr.detectChanges();

    // Carregar dados imediatamente (sem setTimeout desnecessário)
    this.loadLeadDataAsync();
  }

  private async loadLeadDataAsync() {
    try {
      // Gerar link público imediatamente (síncrono)
      this.generatePublicLink();

      // Carregar tudo em paralelo para máxima performance
      Promise.all([
        this.loadBasicLeadData(),
        this.loadFormFieldsAsync(),
        this.loadHistoryAsync()
      ]).catch(error => {
        console.error('Erro ao carregar dados do lead:', error);
        this.errorMessage = 'Erro ao carregar dados do lead';
        this.isLoadingFields = false;
        this.isLoadingHistory = false;
        this.cdr.detectChanges();
      });

    } catch (error) {
      this.errorMessage = 'Erro ao carregar dados do lead';
      this.isLoadingFields = false;
      this.isLoadingHistory = false;
      this.cdr.detectChanges();
    }
  }

  private async loadBasicLeadData() {
    if (!this.currentLead) return;

    try {
      // Buscar versão mais recente do lead
      const latest = await this.firestoreService.getLead(this.ownerId, this.boardId, this.currentLead.id!);
      if (latest) {
        this.currentLead = latest;
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Erro ao carregar dados básicos do lead:', error);
    }
  }

  private async loadFormFieldsAsync() {
    try {
      this.isLoadingFields = true;
      this.fieldsReady = false;

      // Carregar configuração inicial com cache
      const initialCacheKey = `initial_${this.boardId}`;
      this.initialFormConfig = await this.getCachedFormConfig(
        initialCacheKey,
        () => this.firestoreService.getInitialFormConfig(this.boardId)
      );

      // Forçar detecção de mudanças após carregar configuração inicial
      this.cdr.detectChanges();

      // Carregar formulário da fase atual (já configura os campos)
      await this.loadCurrentPhaseForm();

      // Finalizar carregamento
      this.isLoadingFields = false;
      this.fieldsReady = true;

      // Forçar detecção de mudanças final
      this.cdr.detectChanges();

    } catch (error) {
      this.isLoadingFields = false;
      this.fieldsReady = true;
      this.cdr.detectChanges();
    }
  }

  private async getCachedFormConfig(cacheKey: string, fetchFn: () => Promise<any>): Promise<any> {
    const now = Date.now();
    const cached = LeadDetailModalComponent.formConfigCache.get(cacheKey);
    const timestamp = LeadDetailModalComponent.cacheTimestamp.get(cacheKey);

    // Retornar cache se ainda válido
    if (cached && timestamp && (now - timestamp) < LeadDetailModalComponent.CACHE_TTL) {
      return cached;
    }

    // Buscar novo e cachear
    const config = await fetchFn();
    LeadDetailModalComponent.formConfigCache.set(cacheKey, config);
    LeadDetailModalComponent.cacheTimestamp.set(cacheKey, now);
    return config;
  }

  private async loadHistoryAsync() {
    try {
      this.isLoadingHistory = true;

      // Subscribir histórico em tempo real diretamente (mais rápido que buscar + subscribir)
      if (this.unsubscribeHistory) {
        this.unsubscribeHistory();
        this.unsubscribeHistory = null;
      }

      this.unsubscribeHistory = this.firestoreService.subscribeToLeadHistory(
        this.ownerId,
        this.boardId,
        this.currentLead!.id!,
        (items) => {
          this.leadHistory = items as any;
          this.isLoadingHistory = false;
          this.cdr.detectChanges();
        }
      ) as any;

    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      this.isLoadingHistory = false;
      this.cdr.detectChanges();
    }
  }

  private async loadCurrentPhaseForm() {
    try {
      // Extrair histórico de fases (já disponível)
      this.phaseHistory = this.currentLead?.phaseHistory || {};

      // Carregar apenas configurações de fase e fluxo (initial já foi carregado) - COM CACHE
      const phaseCacheKey = `phase_${this.boardId}_${this.currentLead!.columnId}`;
      const flowCacheKey = `flow_${this.boardId}`;

      const [phaseFormConfig, flowConfig] = await Promise.allSettled([
        this.getCachedFormConfig(phaseCacheKey, () =>
          this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, this.currentLead!.columnId)
        ),
        this.getCachedFormConfig(flowCacheKey, () =>
          this.firestoreService.getFlowConfig(this.boardId)
        )
      ]);

      // Processar resultado do formulário da fase
      if (phaseFormConfig.status === 'fulfilled') {
        this.currentFormFields = (phaseFormConfig.value as any)?.fields || [];
      } else {
        this.currentFormFields = (this.initialFormConfig?.fields || []).map((f: any) => ({ ...f }));
      }

      // Carregar campos globais de todas as configurações de fase
      await this.loadGlobalFieldsAsync();

      // Processar resultado do fluxo
      this.flowConfig = flowConfig.status === 'fulfilled' && flowConfig.value ? flowConfig.value : { allowed: {} };

      // Configurar campos do formulário de forma mais eficiente
      this.setupFormFieldsOptimized();
      
      
    } catch (error) {
      this.currentFormFields = [];
    }
  }

  async loadGlobalFieldsAsync() {
    try {
      
      const globalFields: any[] = [];
      const initialFieldNames = new Set<string>(); // Nomes dos campos do formulário inicial
      
      // PRIMEIRO: Marcar todos os campos do formulário inicial (para excluir dos globais)
      
      if (this.initialFormConfig?.fields) {
        this.initialFormConfig.fields.forEach((field: any) => {
          initialFieldNames.add(field.name);
          
        });
      }
      
      // SEGUNDO: Verificar campos da fase atual que são globais (EXCETO os do formulário inicial)
      try {
        const currentPhaseFields = this.currentFormFields || [];
        
        currentPhaseFields.forEach((field: any, index: number) => {
          
          
          const isGlobalCandidate = field.allowEditInAnyPhase === true;
          const isFromInitialForm = initialFieldNames.has(field.name);
          
          // Adicionar apenas campos globais que NÃO estão no formulário inicial
          if (isGlobalCandidate && !isFromInitialForm) {
            globalFields.push(field);
          } else if (isGlobalCandidate && isFromInitialForm) {
          } else {
          }
        });
      } catch (error) {
      }
      
      // TERCEIRO: Buscar campos globais em TODAS as configurações de fase (não apenas a atual) - EM PARALELO
      try {
        // Buscar configurações de todas as fases em paralelo para melhor performance
        const otherColumns = this.columns.filter(col => col.id !== this.currentLead?.columnId);

        const phaseConfigPromises = otherColumns.map(column => {
          const cacheKey = `phase_${this.boardId}_${column.id}`;
          return this.getCachedFormConfig(cacheKey, () =>
            this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, column.id!)
          ).catch(() => null); // Retornar null em caso de erro
        });

        const phaseConfigs = await Promise.all(phaseConfigPromises);

        phaseConfigs.forEach((phaseConfig) => {
          if (!phaseConfig) return;

          const phaseFields = (phaseConfig as any)?.fields || [];

          phaseFields.forEach((field: any) => {
            const isGlobalCandidate = field.allowEditInAnyPhase === true;
            const isFromInitialForm = initialFieldNames.has(field.name);
            const alreadyAdded = globalFields.some(gf => gf.name === field.name);

            // Adicionar campos globais de outras fases que não estão no inicial e ainda não foram adicionados
            if (isGlobalCandidate && !isFromInitialForm && !alreadyAdded) {
              globalFields.push(field);
            }
          });
        });
      } catch (error) {
      }
      
      this.globalFormFields = globalFields;
      
    } catch (error) {
      this.globalFormFields = [];
    }
  }

  private setupFormFieldsOptimized() {
    try {
      // SEMPRE criar nova instância do formulário para evitar problemas de reutilização
      this.leadForm = this.fb.group({});
      this.formReady = false;
      
      const formConfig: any = {};
      
      // Processar campos da fase central + campos editáveis do formulário inicial
      const centralFields = this.getCentralFields();
      const editableInitialFields = this.getInitialFieldsOnly().filter(f => f.isEditable);
      
      
      // Combinar todos os campos que precisam estar no formulário
      const allFields = [...centralFields];
      
      // Adicionar campos editáveis do formulário inicial (evitando duplicatas)
      const centralFieldNames = new Set(centralFields.map((f: any) => f.name || f.apiFieldName));
      editableInitialFields.forEach((field: any) => {
        // Usar o formControlName como chave principal pois é isso que o HTML espera
        const fieldKey = field.formControlName || field.name;
        if (!centralFieldNames.has(fieldKey) && !centralFieldNames.has(field.name)) {
          // Converter campo inicial para formato de campo de formulário
          // IMPORTANTE: usar formControlName como name para coincidir com o HTML
          allFields.push({
            name: fieldKey, // Usar formControlName aqui
            apiFieldName: field.name, // Manter name original como apiFieldName
            type: field.fieldType,
            label: field.label,
            placeholder: field.placeholder,
            options: field.options,
            isFromInitialForm: true, // Marcar explicitamente que vem do formulário inicial
            allowEditInAnyPhase: field.allowEditInAnyPhase // Preservar a configuração
          });
        }
      });
      
      
      allFields.forEach((field: any, index: number) => {
        const key = field.apiFieldName || field.name;
        const currentValue = this.getFieldValue(key) ?? this.getFieldValue(field.name);

        // Determinar se o campo deve estar desabilitado
        // Um campo está desabilitado se:
        // 1. Vem do formulário inicial (marcado explicitamente)
        // 2. Lead não está na fase inicial
        // 3. Campo não tem allowEditInAnyPhase = true
        const isFromInitialForm = field.isFromInitialForm === true;
        const initialPhaseId = this.getInitialPhaseId();
        const currentColumnId = this.currentLead?.columnId;
        const isInInitialPhase = currentColumnId === initialPhaseId;
        const allowedInAnyPhase = field.allowEditInAnyPhase === true;
        const shouldDisable = isFromInitialForm && !isInInitialPhase && !allowedInAnyPhase;

        if (field.type === 'checkbox') {
          // Otimização específica para checkbox - processar de forma mais simples
          const options = field.options || [];
          options.forEach((opt: string, i: number) => {
            const checkboxName = field.name + '_' + i;
            let isChecked = false;

            // Verificação simples e rápida
            if (Array.isArray(currentValue)) {
              isChecked = currentValue.includes(opt);
            } else if (typeof currentValue === 'string' && currentValue) {
              isChecked = currentValue.includes(opt);
            }

            formConfig[checkboxName] = shouldDisable ? [{ value: isChecked, disabled: true }] : [isChecked];
          });
        } else if (field.type === 'responsavel') {
          // Campo Responsável: usar UID como identificador
          let responsibleValue = this.currentLead?.responsibleUserId || '';


          formConfig[field.name] = shouldDisable ? [{ value: responsibleValue, disabled: true }] : [responsibleValue];
        } else {
          // Outros tipos de campo - processamento normal
          formConfig[field.name] = shouldDisable ? [{ value: currentValue ?? '', disabled: true }] : [currentValue ?? ''];
        }
      });

      // Criar formulário completamente novo
      this.leadForm = this.fb.group(formConfig);

      // Aplicar valores usando patchValue para garantir sincronização
      const patchValues: any = {};
      Object.keys(formConfig).forEach(key => {
        patchValues[key] = formConfig[key][0]; // Extrair valor do array [valor]
      });

      this.leadForm.patchValue(patchValues, { emitEvent: false });
      this.formReady = true;


      // Forçar detecção de mudanças para atualizar a interface
      this.cdr.detectChanges();
      
      // Tentar aplicar valor do responsável novamente após um delay (caso seja problema de timing)
      setTimeout(() => {
        const responsavelField = allFields.find(f => f.type === 'responsavel');
        if (responsavelField && this.currentLead?.responsibleUserId) {
          const responsavelControl = this.leadForm.get(responsavelField.name);
          
          if (responsavelControl) {
            responsavelControl.setValue(this.currentLead.responsibleUserId, { emitEvent: false });
            responsavelControl.markAsDirty();
            responsavelControl.updateValueAndValidity();
            this.cdr.detectChanges();
            
            // Tentar via DOM também (fallback)
            setTimeout(() => {
              const selectElement = document.querySelector(`select[formcontrolname="${responsavelField.name}"]`) as HTMLSelectElement;
              if (selectElement) {
                selectElement.value = this.currentLead!.responsibleUserId!;
              }
            }, 50);
          }
        }
      }, 200);
      
    } catch (error) {
      this.leadForm = this.fb.group({});
      this.formReady = true;
    }
  }

  private populateFormFields() {
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
  }

  hide() {
    this.isVisible = false;
    this.resetForm();
    if (this.unsubscribeHistory) { this.unsubscribeHistory(); this.unsubscribeHistory = null; }
    this.closeModal.emit();
  }

  private fullStateReset() {
    
    // Limpar dados do lead
    this.currentLead = null;
    
    // Limpar configurações
    this.initialFormConfig = null;
    this.currentFormFields = [];
    this.globalFormFields = [];
    this.cachedInitialFields = [];
    
    // Limpar estado de loading/ready
    this.fieldsReady = false;
    this.isLoadingFields = true;
    this.isLoadingHistory = true;
    this.formReady = false;
    
    // Limpar histórico e subscription
    if (this.unsubscribeHistory) {
      this.unsubscribeHistory();
      this.unsubscribeHistory = null;
    }
    this.leadHistory = [];
    this.phaseHistory = {};
    
    // Reset do formulário e dados relacionados
    this.resetForm();
    
    // Limpar configuração de fluxo
    this.flowConfig = { allowed: {} };
    
  }

  private resetForm() {
    this.leadForm = this.fb.group({});
    this.commentText = '';
    this.selectedFile = null;
    this.attachmentPreview = '';
    this.errorMessage = '';
    this.publicLink = '';
    this.showDeleteConfirm = false;
    this.isSaving = false;
    this.isLoading = false;
    this.isUploadingComment = false;
    this.isUploadingAttachment = false;
  }

  private async loadLeadData() {
    if (!this.currentLead) return;

    // Limpar cache dos campos para recalcular
    this.cachedInitialFields = [];

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
      this.errorMessage = 'Erro ao carregar dados do lead.';
    }
  }

  private async buildDynamicForm() {
    if (!this.currentLead) return;

    const formConfig: any = {};
    this.formReady = false;

    // 1. Adicionar campos do formulário inicial (se configurados)
    const initialFields = this.initialFormConfig?.fields || [];
    const initialPhaseId = this.getInitialPhaseId();
    const currentColumnId = this.currentLead?.columnId;


    initialFields.forEach((field: any) => {
      const key = field.apiFieldName || field.name;
      let currentValue = this.getFieldValue(key);
      if (currentValue === undefined || currentValue === null || (typeof currentValue === 'string' && currentValue.trim() === '')) {
        currentValue = this.getFieldValue(field.name);
      }

      // Campo Responsável: usar responsibleUserId do lead
      if (field.type === 'responsavel') {
        currentValue = this.currentLead?.responsibleUserId || currentValue || '';
      }

      // Determinar se o campo deve estar desabilitado
      const isInInitialPhase = currentColumnId === initialPhaseId;
      const shouldDisable = !isInInitialPhase && field.allowEditInAnyPhase !== true;


      formConfig[field.name] = [{ value: currentValue ?? '', disabled: shouldDisable }];
    });

    // 2. Adicionar campos dinâmicos da fase (se configurados)
    (this.currentFormFields || []).forEach((field: any) => {
      // Evitar duplicar campos que já foram adicionados do formulário inicial
      if (formConfig[field.name]) {
        return;
      }

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

  private formatFieldValue(field: any, value: any): string {
    if (field.type === 'checkbox') {
      // Se o valor for um array, juntar as opções
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : 'Nenhuma opção selecionada';
      }
      
      // Se o valor for uma string, pode ser um array serializado ou string simples
      if (value && typeof value === 'string') {
        // Tentar parsing JSON primeiro
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.length > 0 ? parsed.join(', ') : 'Nenhuma opção selecionada';
          }
        } catch {}
        
        // Se não é JSON, pode ser uma string com valores separados por vírgula
        if (value.includes(',')) {
          const options = value.split(',').map(v => v.trim()).filter(v => v);
          return options.length > 0 ? options.join(', ') : 'Nenhuma opção selecionada';
        }
        
        // String simples
        return value;
      }
      
      // Valor vazio ou null
      return 'Nenhuma opção selecionada';
    }
    
    return value !== null && value !== undefined ? String(value) : 'Não informado';
  }

  getInitialFields(): any[] {
    // Redirecionamento para o novo método
    return this.getInitialFieldsOnly();
  }
  
  private isFieldGlobal(field: any): boolean {
    // IMPORTANTE: Um campo é considerado global apenas se estiver no formulário inicial 
    // E tiver allowEditInAnyPhase = true
    
    if (!this.initialFormConfig?.fields) {
      return false;
    }
    
    // Verificar se o campo existe no formulário inicial e tem allowEditInAnyPhase = true
    const initialField = this.initialFormConfig.fields.find((initialField: any) => 
      initialField.name === field.name || 
      initialField.apiFieldName === field.name ||
      initialField.name === field.apiFieldName ||
      initialField.apiFieldName === field.apiFieldName
    );
    
    return initialField && initialField.allowEditInAnyPhase === true;
  }

  currentFormFields: any[] = [];
  globalFormFields: any[] = [];

  hasRequiredToAdvance(): boolean {
    try {
      return Array.isArray(this.currentFormFields) && this.currentFormFields.some((f: any) => !!f?.requiredToAdvance);
    } catch { return false; }
  }

  getGlobalFields(): any[] {
    
    // Retornar todos os campos em globalFormFields, pois já foram filtrados em loadGlobalFieldsAsync()
    
    this.globalFormFields.forEach((field: any, index: number) => {
      const formValue = this.leadForm?.get(field.name)?.value;
      
      // Debug específico para campo responsável
      if (field.type === 'responsavel') {
        const userByEmail = this.users.find(u => u.email === formValue);
        const formControl = this.leadForm?.get(field.name);
      }
    });
    
    return this.globalFormFields;
  }

  getPhaseSpecificFields(): any[] {
    
    // Filtrar campos da fase que NÃO são globais (não têm allowEditInAnyPhase = true)
    const phaseOnlyFields = this.currentFormFields.filter((field: any) => field.allowEditInAnyPhase !== true);
    
    
    return phaseOnlyFields;
  }

  getAllRelevantFields(): any[] {
    // Retornar todos os campos relevantes para exibir na parte central:
    // 1. Campos da fase atual
    // 2. Campos globais de outras fases (que podem ser editados em qualquer fase)
    // 3. Campos do formulário inicial

    const phaseFields = this.currentFormFields || [];
    const globalFields = this.getGlobalFields() || [];
    const initialFields = this.initialFormConfig?.fields || [];

    // Evitar duplicatas comparando por nome do campo
    const allFields = [...phaseFields];
    const fieldNames = new Set(phaseFields.map((f: any) => f.name || f.apiFieldName));

    // Adicionar campos globais
    globalFields.forEach((globalField: any) => {
      const fieldName = globalField.name || globalField.apiFieldName;
      if (!fieldNames.has(fieldName)) {
        allFields.push(globalField);
        fieldNames.add(fieldName);
      }
    });

    // Adicionar campos do formulário inicial
    initialFields.forEach((initialField: any) => {
      const fieldName = initialField.name || initialField.apiFieldName;
      if (!fieldNames.has(fieldName)) {
        allFields.push(initialField);
        fieldNames.add(fieldName);
      }
    });

    return allFields;
  }

  getCentralFields(): any[] {

    // Campos para exibir na parte central:
    // 1. Campos do formulário inicial com allowEditInAnyPhase
    // 2. Campos da fase atual (apenas os NÃO globais)
    // 3. TODOS os campos globais
    const initialFields = this.initialFormConfig?.fields || [];
    const phaseOnlyFields = this.getPhaseSpecificFields() || []; // Apenas campos não-globais da fase
    const globalFields = this.getGlobalFields() || [];

    const centralFields: any[] = [];
    const fieldNames = new Set<string>();

    // 1. Adicionar campos do formulário inicial editáveis
    initialFields.forEach((field: any) => {
      if (field.allowEditInAnyPhase) {
        const fieldName = field.name || field.apiFieldName;
        if (!fieldNames.has(fieldName)) {
          centralFields.push(field);
          fieldNames.add(fieldName);
        }
      }
    });

    // 2. Adicionar campos apenas da fase (não-globais)
    phaseOnlyFields.forEach((field: any) => {
      const fieldName = field.name || field.apiFieldName;
      if (!fieldNames.has(fieldName)) {
        centralFields.push(field);
        fieldNames.add(fieldName);
      }
    });

    // 3. Adicionar TODOS os campos globais
    globalFields.forEach((globalField: any) => {
      const fieldName = globalField.name || globalField.apiFieldName;
      if (!fieldNames.has(fieldName)) {
        centralFields.push(globalField);
        fieldNames.add(fieldName);
      }
    });

    return centralFields;
  }

  getInitialFieldsOnly(): any[] {

    // Se ainda não temos dados suficientes, retornar array vazio mas logar detalhes
    if (!this.currentLead) {
      return [];
    }

    if (!this.initialFormConfig) {
      return [];
    }

    // USAR CACHE para evitar recalcular em cada ciclo de detecção de mudanças
    if (this.cachedInitialFields.length > 0) {
      return this.cachedInitialFields;
    }

    // Campos APENAS do formulário inicial (para o lado esquerdo)
    // Não incluir campos globais de outras fases
    try {
      if (this.initialFormConfig?.fields?.length) {
        
        const sorted = this.initialFormConfig.fields
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        const result = sorted.map((f: any, index: number) => {
          const fieldName = f.apiFieldName || f.name;
          const rawValue = this.getFieldValue(fieldName) ?? this.getFieldValue(f.name);
          
          
          const formattedValue = rawValue !== null && rawValue !== undefined 
            ? this.formatFieldValue(f, rawValue) 
            : 'Não informado';
          
          // Um campo inicial é editável se:
          // 1. Estamos na fase inicial (lead está na fase onde foi criado) OU
          // 2. O campo tem allowEditInAnyPhase = true
          const isInInitialPhase = this.currentLead?.columnId === this.getInitialPhaseId();
          const isEditable = isInInitialPhase || f.allowEditInAnyPhase === true;
          
          const result = {
            name: fieldName,
            label: f.label || f.name || f.apiFieldName,
            value: formattedValue,
            isEditable: isEditable,
            fieldType: f.type,
            formControlName: f.name,
            placeholder: f.placeholder,
            options: f.options || (f.type === 'temperatura' ? ['Quente', 'Morno', 'Frio'] : [])
          };


          return result;
        });

        // Cachear o resultado
        this.cachedInitialFields = result;
        return result;
      } else {
        // Fallback dinâmico com deduplicação por grupos de sinônimos
        const fallbackFields = this.buildDedupedDisplayFields().map(field => ({
          ...field,
          isEditable: false,
          fieldType: 'text',
          formControlName: field.name,
          placeholder: '',
          options: []
        }));
        // Cachear o resultado
        this.cachedInitialFields = fallbackFields;
        return fallbackFields;
      }
    } catch (error) {
      return [];
    }
  }

  hasEditableGlobalFields(): boolean {
    // Verificar se há campos editáveis no formulário inicial
    const initialFields = this.getInitialFieldsOnly();
    return initialFields.some(field => field.isEditable);
  }

  private getInitialPhaseId(): string | null {
    // Retorna o ID da primeira fase (fase inicial) do board
    // Assume que a primeira coluna na ordem é a fase inicial
    if (!this.columns || this.columns.length === 0) {
      return null;
    }

    // Procurar por coluna marcada como isInitialPhase
    const initialColumn = this.columns.find((col: any) => col.isInitialPhase);
    if (initialColumn) {
      return initialColumn.id;
    }

    // Fallback: retornar a primeira coluna ordenada
    const sortedColumns = [...this.columns].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return sortedColumns[0]?.id || null;
  }

  async saveGlobalFields() {
    // Usar a mesma lógica de saveChanges, que já trata campos globais e de fase
    await this.saveChanges();
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

        items.push(item);
      }
    });


    // Fallback: se não houver históricos registrados, exibir fase atual como entrada
    if (items.length === 0 && this.currentLead) {
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

        items.push(fallbackItem);
      }
    }

    const sortedItems = items.sort((a, b) => new Date(a.enteredAt).getTime() - new Date(b.enteredAt).getTime());
    
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

      // Mapear todos os campos relevantes (fase atual + globais)
      const relevantFields = this.getAllRelevantFields();
      relevantFields.forEach((f: any) => {
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
      const respFieldDef = relevantFields.find((f: any) => f.type === 'responsavel');
      const respFieldName = respFieldDef?.name;
      const newRespId = respFieldName ? formData[respFieldName] : formData.responsibleUserId;

      // Atualizar se mudou OU se tinha responsável e foi removido
      const responsibleChanged = newRespId !== this.currentLead.responsibleUserId;
      if (responsibleChanged) {
        if (newRespId) {
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
        } else {
          // Responsável foi removido
          updateData.responsibleUserId = '';
          updateData.responsibleUserName = '';
          updateData.responsibleUserEmail = '';

          // Adicionar ao histórico
          await this.firestoreService.addLeadHistory(
            this.ownerId,
            this.boardId,
            this.currentLead.id!,
            {
              type: 'update',
              text: `Responsável removido`,
              user: currentUser.displayName || currentUser.email
            }
          );
        }
      }

      // Registrar diffs de campos (histórico) — incluindo campos da fase e globais
      try {
        const beforeFields = (this.currentLead.fields || {}) as any;
        const changedKeys = Object.keys(mapped).filter(k => `${beforeFields[k] ?? ''}` !== `${mapped[k] ?? ''}`);
        if (changedKeys.length) {
          const changesList = changedKeys.map(k => {
            const field = relevantFields.find((f: any) => (f.apiFieldName || f.name) === k);
            const label = field?.label || this.humanizeKey(k);
            const isGlobal = this.getGlobalFields().some((f: any) => (f.apiFieldName || f.name) === k);
            let beforeVal = beforeFields[k] ?? '';
            let afterVal = mapped[k] ?? '';
            
            // Se o campo representa responsável, mostrar nome do usuário
            const isResp = relevantFields.some((f: any) => (f.apiFieldName === k || f.name === k) && (f.type === 'responsavel' || f.originalType === 'responsavel'));
            if (isResp) {
              const beforeUser = this.users.find(u => u.uid === beforeVal || u.email === beforeVal);
              const afterUser = this.users.find(u => u.uid === afterVal || u.email === afterVal);
              beforeVal = beforeUser?.displayName || beforeVal;
              afterVal = afterUser?.displayName || afterVal;
            }
            
            const fieldType = isGlobal ? ' (Global)' : ' (Fase atual)';
            return `<li><strong>${label}${fieldType}:</strong> "${beforeVal}" → "${afterVal}"</li>`;
          }).join('');
          await this.firestoreService.addLeadHistory(
            this.ownerId,
            this.boardId,
            this.currentLead.id!,
            {
              type: 'update',
              text: `Formulário atualizado:<ul class="list-disc ml-4">${changesList}</ul>`,
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

      // Atualizar responsibleUserId se foi alterado
      if (responsibleChanged && newRespId) {
        this.currentLead.responsibleUserId = newRespId;
      } else if (responsibleChanged && !newRespId) {
        this.currentLead.responsibleUserId = undefined;
      }

      const afterValues: any = {};
      // Atualizar valores de todos os campos relevantes
      relevantFields.forEach((f: any) => {
        const key = f.apiFieldName || f.name;
        if (f.type === 'responsavel') {
          // Para campo responsável, usar o responsibleUserId atualizado
          afterValues[f.name] = this.currentLead.responsibleUserId || '';
        } else {
          afterValues[f.name] = mapped.hasOwnProperty(key) ? mapped[key] : (this.getFieldValue(key) ?? '');
        }
      });
      if (Object.keys(afterValues).length) {
        this.leadForm.patchValue(afterValues, { emitEvent: false });
      }
      this.leadUpdated.emit();

      // Mostrar mensagem de sucesso
      this.showSuccessMessage('Alterações salvas com sucesso!');

    } catch (error: any) {
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
        const filePath = `leads/${this.currentLead.id}/comments/${Date.now()}_${this.selectedFile.name}`;
        
        try {
          const downloadURL = await this.storageService.uploadFile(this.selectedFile, filePath);
          
          attachment = {
            name: this.selectedFile.name,
            url: downloadURL,
            type: this.selectedFile.type,
            size: this.selectedFile.size
          };
        } catch (uploadError) {
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

      
      await this.firestoreService.addLeadHistory(
        this.ownerId,
        this.boardId,
        this.currentLead.id!,
        historyData
      );


      // Limpar formulário
      this.commentText = '';
      this.clearAttachment();

      // Recarregar histórico
      await this.loadLeadData();

    } catch (error: any) {
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
      this.showSuccessMessage('Link copiado para a área de transferência!');
    }
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  onResponsavelChange(event: any, fieldName: string) {
    const selectedValue = event.target.value;
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex];
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