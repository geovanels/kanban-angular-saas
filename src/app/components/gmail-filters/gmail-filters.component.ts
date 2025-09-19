import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'checkbox' | 'select' | 'radio' | 'temperatura';
  options?: string[];
  source?: 'initial' | 'phase';
  phaseId?: string;
}

export interface FilterValues {
  searchQuery: string;
  onlyMine: boolean;
  dynamicFilters: { [key: string]: any };
}

@Component({
  selector: 'app-gmail-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Desktop Filters -->
    <div class="hidden md:block bg-white border-b border-gray-200 px-4 py-3 relative">
      <div class="flex items-center justify-between">
        <!-- Campo de busca estilo Gmail -->
        <div class="flex-1 max-w-2xl relative">
          <div class="relative flex items-center">
            <input
              type="text"
              [placeholder]="searchPlaceholder"
              [(ngModel)]="filterValues.searchQuery"
              (input)="onSearchChange()"
              class="w-full pl-10 pr-16 py-3 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
              [class.border-blue-300]="filterValues.searchQuery"
              [class.bg-white]="filterValues.searchQuery">
            
            <!-- Ícone de busca -->
            <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            
            <!-- Botão de filtros avançados -->
            <button 
              (click)="toggleAdvancedFilters()"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              [class.bg-blue-50]="hasActiveFilters() || showAdvancedFilters"
              [class.text-blue-600]="hasActiveFilters() || showAdvancedFilters"
              [class.text-gray-400]="!hasActiveFilters() && !showAdvancedFilters"
              title="Filtros avançados">
              <i class="fas fa-sliders-h"></i>
              <span *ngIf="getActiveFiltersCount() > 0" 
                    class="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {{ getActiveFiltersCount() }}
              </span>
            </button>
            
            <!-- Botão limpar busca -->
            <button 
              *ngIf="filterValues.searchQuery"
              (click)="clearSearch()"
              class="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>
        
        <!-- Status dos filtros -->
        <div class="flex items-center gap-3 ml-4">
          <div *ngIf="hasActiveFilters()" class="text-sm text-blue-600 flex items-center gap-2">
            <i class="fas fa-filter"></i>
            <span>{{ getTotalActiveFilters() }} filtro(s)</span>
          </div>
          
          <button *ngIf="hasActiveFilters()" 
                  (click)="clearAllFilters()" 
                  class="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm hover:bg-red-100 transition-colors flex items-center gap-2">
            <i class="fas fa-times"></i>
            Limpar
          </button>
        </div>
      </div>

      <!-- Painel de filtros avançados (ABSOLUTO) -->
      <div *ngIf="showAdvancedFilters" 
           class="absolute top-full left-4 mt-2 w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 z-50">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h4 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i class="fas fa-filter text-blue-600"></i>
              Filtros Avançados
            </h4>
            <button (click)="closeAdvancedFilters()" 
                    class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <!-- Filtro "Meus Cards" -->
          <div *ngIf="showMyItemsFilter" class="mb-6 p-4 bg-blue-50 rounded-lg">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" 
                     [checked]="filterValues.onlyMine"
                     (change)="toggleOnlyMine()"
                     class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
              <span class="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                <i class="fas fa-user text-blue-600"></i>
                {{ myItemsLabel }}
              </span>
            </label>
            <p class="ml-7 mt-1 text-xs text-gray-500">
              {{ myItemsDescription }}
            </p>
          </div>
          
          <!-- Filtros por campos dinâmicos -->
          <div *ngIf="availableFields.length > 0">
            <h5 class="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <i class="fas fa-sliders-h text-gray-500"></i>
              Filtros por Campos
            </h5>
            
            <div class="space-y-4">
              <div *ngFor="let field of availableFields" 
                   class="p-4 bg-gray-50 rounded-lg">
                <label class="text-sm font-medium text-gray-700 mb-2 block">
                  {{ field.label }}
                  <span class="text-xs text-gray-500 ml-1">({{ field.type }})</span>
                </label>
                
                <!-- Campo de texto/email/tel -->
                <div *ngIf="field.type === 'text' || field.type === 'email' || field.type === 'tel'" 
                     class="flex items-center gap-2">
                  <input type="text"
                         [placeholder]="'Filtrar por ' + field.label.toLowerCase()"
                         [value]="getDynamicFilterValue(field.name)"
                         (input)="setDynamicFilter(field.name, $event.target.value)"
                         class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <button *ngIf="getDynamicFilterValue(field.name)"
                          (click)="removeDynamicFilter(field.name)"
                          class="p-2 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50">
                    <i class="fas fa-times text-sm"></i>
                  </button>
                </div>
                
                <!-- Campo de número -->
                <div *ngIf="field.type === 'number'" 
                     class="flex items-center gap-2">
                  <input type="number"
                         [placeholder]="'Filtrar por ' + field.label.toLowerCase()"
                         [value]="getDynamicFilterValue(field.name)"
                         (input)="setDynamicFilter(field.name, $event.target.value)"
                         class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <button *ngIf="getDynamicFilterValue(field.name)"
                          (click)="removeDynamicFilter(field.name)"
                          class="p-2 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50">
                    <i class="fas fa-times text-sm"></i>
                  </button>
                </div>
                
                <!-- Campo de data -->
                <div *ngIf="field.type === 'date'" 
                     class="flex items-center gap-2">
                  <input type="date"
                         [value]="getDynamicFilterValue(field.name)"
                         (change)="setDynamicFilter(field.name, $event.target.value)"
                         class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <button *ngIf="getDynamicFilterValue(field.name)"
                          (click)="removeDynamicFilter(field.name)"
                          class="p-2 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50">
                    <i class="fas fa-times text-sm"></i>
                  </button>
                </div>
                
                <!-- Checkbox -->
                <label *ngIf="field.type === 'checkbox'" 
                       class="flex items-center gap-3">
                  <input type="checkbox"
                         [checked]="getDynamicFilterValue(field.name)"
                         (change)="setDynamicFilter(field.name, $event.target.checked)"
                         class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                  <span class="text-sm text-gray-600">Apenas marcados</span>
                  <button *ngIf="getDynamicFilterValue(field.name)"
                          (click)="removeDynamicFilter(field.name)"
                          class="p-1 text-red-400 hover:text-red-600 transition-colors ml-auto rounded-full hover:bg-red-50">
                    <i class="fas fa-times text-xs"></i>
                  </button>
                </label>
                
                <!-- Select/Radio/Temperatura -->
                <div *ngIf="field.type === 'select' || field.type === 'radio' || field.type === 'temperatura'" 
                     class="flex items-center gap-2">
                  <select [value]="getDynamicFilterValue(field.name)"
                          (change)="onSelectChange(field.name, $event)"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Todos os valores</option>
                    <option *ngFor="let option of field.options" [value]="option">
                      {{ option }}
                    </option>
                  </select>
                  <button *ngIf="getDynamicFilterValue(field.name)"
                          (click)="removeDynamicFilter(field.name)"
                          class="p-2 text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50">
                    <i class="fas fa-times text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Status dos filtros dinâmicos -->
            <div *ngIf="getActiveDynamicFiltersCount() > 0" 
                 class="mt-6 pt-4 border-t border-gray-200 text-sm text-blue-600 flex items-center gap-2">
              <i class="fas fa-info-circle"></i>
              <span>{{ getActiveDynamicFiltersCount() }} filtro(s) ativo(s) por campos</span>
            </div>
          </div>
          
          <!-- Área para quando não há campos dinâmicos -->
          <div *ngIf="availableFields.length === 0 && !showMyItemsFilter" class="text-center py-4 text-gray-500 text-sm">
            <i class="fas fa-info-circle mb-2"></i>
            <p>Nenhum filtro disponível</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filters -->
    <div class="md:hidden bg-white border-b border-gray-200 px-4 py-3">
      <div class="relative">
        <div class="flex gap-2 overflow-x-auto pb-2">
          <div class="relative flex-1 max-w-xs">
            <input
              type="text"
              [placeholder]="searchPlaceholder"
              [(ngModel)]="filterValues.searchQuery"
              (input)="onSearchChange()"
              class="w-full pl-8 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white"
              [class.border-blue-300]="filterValues.searchQuery"
              [class.bg-white]="filterValues.searchQuery">
            
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
            
            <!-- Botão de filtros no mobile -->
            <button 
              (click)="toggleAdvancedFilters()"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              [class.bg-blue-50]="hasActiveFilters() || showAdvancedFilters"
              [class.text-blue-600]="hasActiveFilters() || showAdvancedFilters"
              [class.text-gray-400]="!hasActiveFilters() && !showAdvancedFilters">
              <i class="fas fa-sliders-h text-xs"></i>
              <span *ngIf="getActiveFiltersCount() > 0" 
                    class="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs">
                {{ getActiveFiltersCount() }}
              </span>
            </button>
            
            <button 
              *ngIf="filterValues.searchQuery"
              (click)="clearSearch()"
              class="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
              <i class="fas fa-times text-xs"></i>
            </button>
          </div>
          
          <button *ngIf="hasActiveFilters()" 
                  (click)="clearAllFilters()" 
                  class="px-3 py-2 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors flex items-center gap-1">
            <i class="fas fa-times"></i>
            Limpar
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: []
})
export class GmailFiltersComponent implements OnInit {
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() availableFields: FilterField[] = [];
  @Input() showMyItemsFilter: boolean = true;
  @Input() myItemsLabel: string = 'Mostrar apenas meus items';
  @Input() myItemsDescription: string = 'Exibe somente os items atribuídos a você';
  @Input() initialValues: FilterValues = {
    searchQuery: '',
    onlyMine: false,
    dynamicFilters: {}
  };

  @Output() filtersChanged = new EventEmitter<FilterValues>();

  filterValues: FilterValues = {
    searchQuery: '',
    onlyMine: false,
    dynamicFilters: {}
  };

  showAdvancedFilters = false;

  ngOnInit() {
    this.filterValues = { ...this.initialValues };
  }

  onSearchChange() {
    this.emitFiltersChanged();
  }

  toggleOnlyMine() {
    this.filterValues.onlyMine = !this.filterValues.onlyMine;
    this.emitFiltersChanged();
  }

  setDynamicFilter(fieldName: string, value: any) {
    if (value === null || value === undefined || value === '') {
      delete this.filterValues.dynamicFilters[fieldName];
    } else {
      this.filterValues.dynamicFilters[fieldName] = value;
    }
    this.emitFiltersChanged();
  }

  removeDynamicFilter(fieldName: string) {
    delete this.filterValues.dynamicFilters[fieldName];
    this.emitFiltersChanged();
  }

  getDynamicFilterValue(fieldName: string): any {
    return this.filterValues.dynamicFilters[fieldName] || '';
  }

  onSelectChange(fieldName: string, event: any) {
    const value = event.target.value;
    this.setDynamicFilter(fieldName, value);
  }

  clearSearch() {
    this.filterValues.searchQuery = '';
    this.emitFiltersChanged();
  }

  clearAllFilters() {
    this.filterValues = {
      searchQuery: '',
      onlyMine: false,
      dynamicFilters: {}
    };
    this.emitFiltersChanged();
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  closeAdvancedFilters() {
    this.showAdvancedFilters = false;
  }

  hasActiveFilters(): boolean {
    return this.getTotalActiveFilters() > 0;
  }

  getTotalActiveFilters(): number {
    let count = 0;
    if (this.filterValues.searchQuery) count++;
    if (this.filterValues.onlyMine) count++;
    count += this.getActiveDynamicFiltersCount();
    return count;
  }

  getActiveDynamicFiltersCount(): number {
    return Object.keys(this.filterValues.dynamicFilters).length;
  }

  getActiveFiltersCount(): number {
    return (this.filterValues.onlyMine ? 1 : 0) + this.getActiveDynamicFiltersCount();
  }

  private emitFiltersChanged() {
    this.filtersChanged.emit({ ...this.filterValues });
  }
}