import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-advanced-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-filters.component.html',
  styleUrls: ['./advanced-filters.component.scss']
})
export class AdvancedFiltersComponent implements OnInit {
  private firestoreService = inject(FirestoreService);

  @Input() boardId: string = '';
  @Input() ownerId: string = '';
  @Input() columns: any[] = [];
  @Input() currentUser: any = null;
  
  // Filter states
  @Input() filterQuery: string = '';
  @Input() filterOnlyMine: boolean = false;
  @Input() dynamicFilters: { [key: string]: any } = {};
  @Input() showAdvancedFilters: boolean = false;
  
  // Filter fields
  availableFilterFields: any[] = [];
  initialFormFields: any[] = [];
  phaseFormConfigs: {[key: string]: any} = {};

  // Events
  @Output() filterQueryChange = new EventEmitter<string>();
  @Output() filterOnlyMineChange = new EventEmitter<boolean>();
  @Output() dynamicFiltersChange = new EventEmitter<{[key: string]: any}>();
  @Output() showAdvancedFiltersChange = new EventEmitter<boolean>();
  @Output() filtersApplied = new EventEmitter<void>();

  async ngOnInit() {
    if (this.boardId && this.ownerId) {
      await this.loadInitialFormFields();
      await this.loadAllPhaseFormConfigs();
      this.loadAvailableFilterFields();
    }
  }

  private async loadInitialFormFields() {
    if (!this.boardId) return;
    
    try {
      const formConfig = await this.firestoreService.getInitialFormConfig(this.boardId);
      if (formConfig && formConfig.fields) {
        this.initialFormFields = formConfig.fields || [];
        console.log('📋 [AdvancedFilters] Campos do formulário carregados:', this.initialFormFields);
      } else {
        this.initialFormFields = [];
      }
    } catch (error) {
      console.log('ℹ️ [AdvancedFilters] Nenhuma configuração de formulário encontrada');
      this.initialFormFields = [];
    }
  }

  async loadAllPhaseFormConfigs() {
    for (const column of this.columns) {
      try {
        const config = await this.firestoreService.getPhaseFormConfig(this.ownerId, this.boardId, column.id!);
        if (config?.fields) {
          this.phaseFormConfigs[column.id!] = config;
        }
      } catch (e) {
        // Ignorar erro se não houver configuração para esta fase
      }
    }
    
    // Recarregar campos disponíveis para filtro após carregar configurações de fases
    this.loadAvailableFilterFields();
  }

  // Migrar campos existentes para incluir showInFilters
  private migrateFieldsToIncludeShowInFilters() {
    console.log('🔧 [AdvancedFilters] Migrando campos para incluir showInFilters...');
    
    // Migrar campos do formulário inicial
    if (this.initialFormFields) {
      let needsMigration = false;
      this.initialFormFields.forEach(field => {
        if (!('showInFilters' in field)) {
          field.showInFilters = false;
          needsMigration = true;
          console.log(`🔧 [AdvancedFilters] Adicionado showInFilters: false ao campo ${field.name} (campo antigo)`);
        } else {
          console.log(`✅ [AdvancedFilters] Campo ${field.name} já tem showInFilters: ${field.showInFilters}`);
        }
      });
      
      if (needsMigration) {
        console.log('🔧 [AdvancedFilters] Alguns campos do formulário inicial foram migrados em memória');
      } else {
        console.log('✅ [AdvancedFilters] Todos os campos do formulário inicial já têm showInFilters');
      }
    }
    
    // Migrar campos das fases
    Object.entries(this.phaseFormConfigs || {}).forEach(([phaseId, config]: [string, any]) => {
      if (config?.fields) {
        let needsMigration = false;
        config.fields.forEach((field: any) => {
          if (!('showInFilters' in field)) {
            field.showInFilters = false;
            needsMigration = true;
            console.log(`🔧 [AdvancedFilters] Adicionado showInFilters: false ao campo ${field.name} da fase ${phaseId} (campo antigo)`);
          } else {
            console.log(`✅ [AdvancedFilters] Campo ${field.name} da fase ${phaseId} já tem showInFilters: ${field.showInFilters}`);
          }
        });
        
        if (needsMigration) {
          console.log(`🔧 [AdvancedFilters] Alguns campos da fase ${phaseId} foram migrados em memória`);
        } else {
          console.log(`✅ [AdvancedFilters] Todos os campos da fase ${phaseId} já têm showInFilters`);
        }
      }
    });
  }

  private loadAvailableFilterFields() {
    console.log('🔍 [AdvancedFilters] loadAvailableFilterFields INICIADO');
    console.log('🔍 [AdvancedFilters] initialFormFields:', this.initialFormFields);
    console.log('🔍 [AdvancedFilters] phaseFormConfigs:', this.phaseFormConfigs);
    
    // Executar migração primeiro
    this.migrateFieldsToIncludeShowInFilters();
    
    const allFields: any[] = [];
    
    // Adicionar campos do formulário inicial que têm showInFilters = true
    if (this.initialFormFields) {
      console.log('🔍 [AdvancedFilters] Processando campos do formulário inicial...');
      this.initialFormFields.forEach((field, index) => {
        console.log(`🔍 [AdvancedFilters] Campo inicial ${index + 1}:`, field);
        console.log(`🔍 [AdvancedFilters] Campo inicial ${index + 1} - Detalhes:`, {
          name: field.name,
          type: field.type,
          showInFilters: field.showInFilters,
          hasShowInFilters: 'showInFilters' in field,
          keys: Object.keys(field)
        });
        
        if (field.name && field.type && field.showInFilters) {
          const filterField = {
            name: field.name,
            label: field.label || field.name,
            type: field.type,
            source: 'initial'
          };
          allFields.push(filterField);
          console.log('✅ [AdvancedFilters] Campo adicionado aos filtros:', filterField);
        } else {
          console.log('❌ [AdvancedFilters] Campo NÃO adicionado aos filtros (falta name, type ou showInFilters = false)');
        }
      });
    } else {
      console.log('⚠️ [AdvancedFilters] Nenhum initialFormFields encontrado');
    }
    
    // Adicionar campos de fases que têm showInFilters = true
    console.log('🔍 [AdvancedFilters] Processando campos das fases...');
    Object.entries(this.phaseFormConfigs || {}).forEach(([phaseId, config]: [string, any]) => {
      console.log(`🔍 [AdvancedFilters] Fase ${phaseId}:`, config);
      if (config?.fields) {
        config.fields.forEach((field: any, index: number) => {
          console.log(`🔍 [AdvancedFilters] Campo da fase ${phaseId} - ${index + 1}:`, field);
          console.log(`🔍 [AdvancedFilters] Campo da fase ${phaseId} - ${index + 1} - Detalhes:`, {
            name: field.name,
            type: field.type,
            showInFilters: field.showInFilters,
            hasShowInFilters: 'showInFilters' in field,
            keys: Object.keys(field)
          });
          
          if (field.name && field.type && field.showInFilters && !allFields.find(f => f.name === field.name)) {
            const filterField = {
              name: field.name,
              label: field.label || field.name,
              type: field.type,
              source: 'phase',
              phaseId: phaseId
            };
            allFields.push(filterField);
            console.log('✅ [AdvancedFilters] Campo da fase adicionado aos filtros:', filterField);
          } else {
            console.log('❌ [AdvancedFilters] Campo da fase NÃO adicionado (falta name, type, showInFilters = false, ou já existe)');
          }
        });
      }
    });
    
    console.log('🔍 [AdvancedFilters] Todos os campos coletados:', allFields);
    
    // Filtrar apenas campos apropriados para filtro
    this.availableFilterFields = allFields.filter(field => {
      const supportedTypes = ['text', 'email', 'select', 'radio', 'checkbox', 'date', 'number', 'tel', 'cnpj', 'cpf', 'temperatura'];
      const isSupported = supportedTypes.includes(field.type.toLowerCase());
      console.log(`🔍 [AdvancedFilters] Campo ${field.name} (${field.type}) - Suportado: ${isSupported}`);
      return isSupported;
    });
    
    console.log('🔍 [AdvancedFilters] Campos filtrados finais (availableFilterFields):', this.availableFilterFields);
    console.log('🔍 [AdvancedFilters] availableFilterFields.length:', this.availableFilterFields.length);
    console.log('🔍 [AdvancedFilters] showAdvancedFilters:', this.showAdvancedFilters);
  }

  // Obter opções disponíveis para um campo
  getFieldOptions(field: any): string[] {
    // Para campos select, radio e temperatura, verificar se há opções definidas
    if (field.type === 'select' || field.type === 'radio') {
      // Buscar o campo original para obter as opções
      const originalField = this.findOriginalField(field.name, field.source);
      if (originalField && originalField.options && Array.isArray(originalField.options)) {
        return originalField.options;
      }
    }
    
    // Para temperatura, sempre retornar as opções padrão se não encontrar definidas
    if (field.type === 'temperatura') {
      return ['Quente', 'Morno', 'Frio'];
    }
    
    return [];
  }

  private findOriginalField(fieldName: string, source: string): any {
    if (source === 'initial') {
      return this.initialFormFields?.find(f => f.name === fieldName);
    } else if (source === 'phase') {
      // Buscar em todas as configurações de fases
      for (const config of Object.values(this.phaseFormConfigs)) {
        const found = (config as any)?.fields?.find((f: any) => f.name === fieldName);
        if (found) return found;
      }
    }
    return null;
  }

  // Event handlers
  onFilterQueryChange(value: string) {
    this.filterQuery = value;
    this.filterQueryChange.emit(value);
    this.filtersApplied.emit();
  }

  toggleOnlyMine() {
    this.filterOnlyMine = !this.filterOnlyMine;
    this.filterOnlyMineChange.emit(this.filterOnlyMine);
    this.filtersApplied.emit();
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
    this.showAdvancedFiltersChange.emit(this.showAdvancedFilters);
  }

  setDynamicFilter(fieldName: string, value: any) {
    if (value === '' || value === null || value === undefined) {
      delete this.dynamicFilters[fieldName];
    } else {
      this.dynamicFilters[fieldName] = value;
    }
    this.dynamicFiltersChange.emit(this.dynamicFilters);
    this.filtersApplied.emit();
  }

  clearFilters() {
    this.filterQuery = '';
    this.filterOnlyMine = false;
    this.dynamicFilters = {};
    
    this.filterQueryChange.emit(this.filterQuery);
    this.filterOnlyMineChange.emit(this.filterOnlyMine);
    this.dynamicFiltersChange.emit(this.dynamicFilters);
    this.filtersApplied.emit();
  }

  hasActiveFilters(): boolean {
    return this.filterQuery.length > 0 || 
           this.filterOnlyMine || 
           Object.keys(this.dynamicFilters).length > 0;
  }

  getDynamicFilterCount(): number {
    return Object.keys(this.dynamicFilters).length;
  }
}