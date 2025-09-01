import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { SubdomainService } from '../../services/subdomain.service';
import { BrandingService } from '../../services/branding.service';
import { Company } from '../../models/company.model';
import { ConfigHeaderComponent } from '../config-header/config-header.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-branding-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfigHeaderComponent, MainLayoutComponent],
  template: `
    <app-main-layout>
      <app-config-header title="Minha Empresa">
        <button 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          (click)="saveConfiguration()"
          [disabled]="isSaving()">
          @if (isSaving()) {
            <i class="fas fa-spinner fa-spin mr-1"></i>
            Salvando...
          } @else {
            <i class="fas fa-save mr-1"></i>
            Salvar Configurações
          }
        </button>
      </app-config-header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Success/Error Messages -->
        @if (successMessage()) {
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <i class="fas fa-check-circle mr-2"></i>
            {{ successMessage() }}
          </div>
        }
        
        @if (errorMessage()) {
          <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <i class="fas fa-exclamation-circle mr-2"></i>
            {{ errorMessage() }}
          </div>
        }

        <!-- Preview Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-eye text-blue-500 mr-2"></i>
              Preview da Identidade Visual
            </h3>
            <p class="text-sm text-gray-600 mt-1">Veja como ficará a aparência do sistema</p>
          </div>
          <div class="p-6">
            <div class="border border-gray-300 rounded-lg p-6 bg-gray-50">
              <!-- Simulated Header Preview -->
              <div class="flex items-center justify-between p-4 bg-white rounded border border-gray-200 mb-4" 
                   [style.background-color]="primaryColor()">
                <div class="flex items-center space-x-3">
                  @if (logoUrl()) {
                    <img [src]="logoUrl()" alt="Logo Preview" class="h-8 w-auto">
                  } @else {
                    <div class="h-8 w-8 bg-gray-300 rounded flex items-center justify-center">
                      <i class="fas fa-image text-gray-500"></i>
                    </div>
                  }
                  <h2 class="text-lg font-semibold" [style.color]="getContrastColor(primaryColor())">
                    {{ companyName() || 'Nome da Empresa' }}
                  </h2>
                </div>
                <div class="flex space-x-2">
                  <button class="px-3 py-1 rounded text-sm font-medium"
                          [style.background-color]="secondaryColor()"
                          [style.color]="getContrastColor(secondaryColor())">
                    Botão Secundário
                  </button>
                  <button class="px-3 py-1 rounded text-sm font-medium text-white"
                          [style.background-color]="primaryColor()">
                    Botão Principal
                  </button>
                </div>
              </div>
              
              <!-- Sample Content Preview -->
              <div class="bg-white rounded border border-gray-200 p-4">
                <h3 class="font-semibold mb-2" [style.color]="primaryColor()">Sample Content</h3>
                <p class="text-gray-600 text-sm mb-3">Este é um exemplo de como o conteúdo aparecerá com suas cores personalizadas.</p>
                <div class="flex space-x-2">
                  <span class="px-2 py-1 rounded text-xs font-medium"
                        [style.background-color]="primaryColor() + '20'"
                        [style.color]="primaryColor()">
                    Tag Principal
                  </span>
                  <span class="px-2 py-1 rounded text-xs font-medium"
                        [style.background-color]="secondaryColor() + '20'"
                        [style.color]="secondaryColor()">
                    Tag Secundária
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration Form -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Logo Configuration -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <i class="fas fa-image text-blue-500 mr-2"></i>
                Logo da Empresa
              </h3>
            </div>
            <div class="p-6">
              <div class="mb-6">
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                     (click)="logoInput.click()">
                  @if (logoUrl()) {
                    <img [src]="logoUrl()" alt="Logo atual" class="max-h-20 mx-auto mb-4">
                    <p class="text-sm text-gray-600">Clique para alterar o logo</p>
                  } @else {
                    <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                    <p class="text-sm text-gray-600">Clique para fazer upload do logo</p>
                    <p class="text-xs text-gray-500 mt-1">PNG, JPG ou SVG - Máx. 5MB</p>
                  }
                </div>
                <input #logoInput type="file" class="hidden" accept="image/*" (change)="onLogoSelected($event)">
              </div>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">URL do Logo (opcional)</label>
                  <input
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [(ngModel)]="logoUrl"
                    (input)="logoUrl.set($any($event.target).value)"
                    placeholder="https://exemplo.com/logo.png">
                </div>
                
                @if (logoUrl()) {
                  <button 
                    class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    (click)="removeLogo()">
                    <i class="fas fa-trash mr-1"></i>
                    Remover Logo
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Color Configuration -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <i class="fas fa-palette text-blue-500 mr-2"></i>
                Cores da Empresa
              </h3>
            </div>
            <div class="p-6 space-y-4">
              <!-- Primary Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cor Principal</label>
                <div class="flex space-x-3">
                  <input
                    type="color"
                    class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    [value]="primaryColor()"
                    (input)="primaryColor.set($any($event.target).value); applyPreviewColors()">
                  <input
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [value]="primaryColor()"
                    (input)="primaryColor.set($any($event.target).value); applyPreviewColors()"
                    placeholder="#3B82F6">
                </div>
                <p class="text-xs text-gray-500 mt-1">Cor principal da interface (botões, links, etc.)</p>
              </div>

              <!-- Secondary Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
                <div class="flex space-x-3">
                  <input
                    type="color"
                    class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    [value]="secondaryColor()"
                    (input)="secondaryColor.set($any($event.target).value); applyPreviewColors()">
                  <input
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    [value]="secondaryColor()"
                    (input)="secondaryColor.set($any($event.target).value); applyPreviewColors()"
                    placeholder="#6B7280">
                </div>
                <p class="text-xs text-gray-500 mt-1">Cor para elementos secundários</p>
              </div>

              <!-- Color Presets -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Paletas Sugeridas</label>
                <div class="flex space-x-2 flex-wrap gap-2">
                  @for (preset of colorPresets; track preset.name) {
                    <button
                      type="button"
                      class="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      [style.background-color]="preset.primary"
                      [title]="preset.name"
                      (click)="applyColorPreset(preset)">
                    </button>
                  }
                </div>
              </div>

              <!-- Reset Colors -->
              <div class="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  (click)="resetColors()">
                  <i class="fas fa-undo mr-1"></i>
                  Restaurar Cores Padrão
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Company Name -->
        <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-building text-blue-500 mr-2"></i>
              Informações da Empresa
            </h3>
          </div>
          <div class="p-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                [(ngModel)]="companyName"
                (input)="companyName.set($any($event.target).value)"
                placeholder="Nome da sua empresa">
              <p class="text-xs text-gray-500 mt-1">Este nome aparecerá no cabeçalho do sistema</p>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class BrandingConfigComponent implements OnInit {
  private companyService = inject(CompanyService);
  private subdomainService = inject(SubdomainService);
  private brandingService = inject(BrandingService);

  // Reactive signals
  currentCompany = signal<Company | null>(null);
  primaryColor = signal('#3B82F6');
  secondaryColor = signal('#6B7280');
  logoUrl = signal<string>('');
  companyName = signal<string>('');
  isSaving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  colorPresets = [
    { name: 'Azul', primary: '#3B82F6', secondary: '#6B7280' },
    { name: 'Verde', primary: '#10B981', secondary: '#6B7280' },
    { name: 'Vermelho', primary: '#EF4444', secondary: '#6B7280' },
    { name: 'Roxo', primary: '#8B5CF6', secondary: '#6B7280' },
    { name: 'Laranja', primary: '#F59E0B', secondary: '#6B7280' },
    { name: 'Rosa', primary: '#EC4899', secondary: '#6B7280' }
  ];

  ngOnInit() {
    this.loadCurrentBranding();
  }

  loadCurrentBranding() {
    const company = this.subdomainService.getCurrentCompany();
    if (company) {
      this.currentCompany.set(company);
      this.primaryColor.set(company.brandingConfig?.primaryColor || '#3B82F6');
      this.secondaryColor.set(company.brandingConfig?.secondaryColor || '#6B7280');
      this.logoUrl.set(company.brandingConfig?.logo || '');
      this.companyName.set(company.name || '');
    }
  }

  async saveConfiguration() {
    const company = this.currentCompany();
    if (!company) {
      this.showError('Empresa não encontrada');
      return;
    }

    this.isSaving.set(true);
    this.clearMessages();

    try {
      // Update company branding
      const updatedCompany: Partial<Company> = {
        name: this.companyName(),
        brandingConfig: {
          primaryColor: this.primaryColor(),
          secondaryColor: this.secondaryColor(),
          logo: this.logoUrl(),
          favicon: company.brandingConfig?.favicon || '',
          customCSS: company.brandingConfig?.customCSS || '',
          companyName: this.companyName()
        }
      };

      await this.companyService.updateCompany(company.id!, updatedCompany);
      
      // Update current company in subdomain service
      const refreshedCompany = { ...company, ...updatedCompany };
      this.subdomainService.setCurrentCompany(refreshedCompany);
      this.currentCompany.set(refreshedCompany);

      // Apply branding immediately using the branding service
      await this.brandingService.updateColors({
        primaryColor: this.primaryColor(),
        secondaryColor: this.secondaryColor()
      });
      
      this.showSuccess('Configurações de branding salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações de branding:', error);
      this.showError('Erro ao salvar configurações. Tente novamente.');
    } finally {
      this.isSaving.set(false);
    }
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // For now, we'll just create a URL for preview
      // In a real app, you would upload this to a storage service
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    if (confirm('Tem certeza que deseja remover o logo?')) {
      this.logoUrl.set('');
    }
  }

  applyColorPreset(preset: { name: string, primary: string, secondary: string }) {
    this.primaryColor.set(preset.primary);
    this.secondaryColor.set(preset.secondary);
    
    // Apply preview immediately
    this.applyPreviewColors();
  }

  resetColors() {
    this.primaryColor.set('#3B82F6');
    this.secondaryColor.set('#6B7280');
  }

  getContrastColor(hexColor: string): string {
    // Simple contrast color calculation
    if (!hexColor) return '#000000';
    
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  private applyBrandingToPage() {
    // Apply branding to current page (for immediate feedback)
    document.documentElement.style.setProperty('--primary-color', this.primaryColor());
    document.documentElement.style.setProperty('--secondary-color', this.secondaryColor());
  }

  applyPreviewColors() {
    // Apply colors immediately for preview using the branding service
    this.brandingService.updateColors({
      primaryColor: this.primaryColor(),
      secondaryColor: this.secondaryColor()
    }).catch(error => {
      // Silent error for preview - just apply styles directly
      this.applyBrandingToPage();
    });
  }

  private showSuccess(message: string) {
    this.successMessage.set(message);
    this.errorMessage.set(null);
    setTimeout(() => this.successMessage.set(null), 5000);
  }

  private showError(message: string) {
    this.errorMessage.set(message);
    this.successMessage.set(null);
    setTimeout(() => this.errorMessage.set(null), 5000);
  }

  private clearMessages() {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}