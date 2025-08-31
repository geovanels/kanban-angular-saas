import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { BrandingService } from '../../services/branding.service';
import { SubdomainService } from '../../services/subdomain.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-branding-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="branding-config-container">
      <!-- Preview do Branding -->
      <div class="card">
        <div class="card-header">
          <h3><i class="fas fa-palette"></i> Identidade Visual</h3>
          <p class="text-muted">Personalize a aparência do sistema para sua empresa</p>
        </div>
        
        <div class="card-body">
          <!-- Preview -->
          <div class="branding-preview mb-4">
            <div class="preview-header" [style.background-color]="colorForm.get('primaryColor')?.value">
              <div class="d-flex align-items-center gap-3 p-3">
                <div class="logo-preview">
                  <img 
                    *ngIf="currentCompany()?.logoUrl" 
                    [src]="currentCompany()?.logoUrl"
                    [alt]="currentCompany()?.name + ' Logo'"
                    class="preview-logo">
                  <div 
                    *ngIf="!currentCompany()?.logoUrl"
                    class="preview-logo-placeholder">
                    <i class="fas fa-building"></i>
                  </div>
                </div>
                <div class="text-white">
                  <h4 class="mb-0">{{ currentCompany()?.name || 'Nome da Empresa' }}</h4>
                  <small class="opacity-75">Sistema Kanban</small>
                </div>
              </div>
            </div>
            <div class="preview-content p-3">
              <div class="d-flex gap-2 mb-3">
                <button class="btn btn-primary btn-sm" [style.background-color]="colorForm.get('primaryColor')?.value">
                  Botão Primário
                </button>
                <button class="btn btn-outline-primary btn-sm" [style.border-color]="colorForm.get('primaryColor')?.value" [style.color]="colorForm.get('primaryColor')?.value">
                  Botão Secundário
                </button>
              </div>
              <div class="text-muted">
                <i class="fas fa-info-circle" [style.color]="colorForm.get('primaryColor')?.value"></i>
                Prévia de como ficará a interface com suas cores personalizadas
              </div>
            </div>
          </div>

          <form [formGroup]="colorForm" (ngSubmit)="saveColors()">
            <div class="row">
              <!-- Logo Upload -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"><strong>Logo da Empresa</strong></label>
                  <div class="logo-upload-area" (click)="logoFileInput.click()">
                    <div *ngIf="!currentCompany()?.logoUrl" class="upload-placeholder">
                      <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
                      <p class="mb-0">Clique para fazer upload do logo</p>
                      <small class="text-muted">PNG, JPG ou SVG - Máx. 5MB</small>
                    </div>
                    <div *ngIf="currentCompany()?.logoUrl" class="current-logo">
                      <img [src]="currentCompany()?.logoUrl" [alt]="currentCompany()?.name + ' Logo'" class="uploaded-logo">
                      <div class="logo-overlay">
                        <i class="fas fa-edit"></i>
                        <p class="mb-0">Clique para alterar</p>
                      </div>
                    </div>
                  </div>
                  <input 
                    #logoFileInput
                    type="file" 
                    class="d-none"
                    accept="image/*"
                    (change)="onLogoSelected($event)">
                </div>

                <!-- Ações do Logo -->
                <div class="d-flex gap-2 mb-3" *ngIf="currentCompany()?.logoUrl">
                  <button 
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    (click)="removeLogo()">
                    <i class="fas fa-trash"></i>
                    Remover Logo
                  </button>
                </div>
              </div>

              <!-- Configurações de Cor -->
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"><strong>Cor Primária</strong></label>
                  <div class="input-group">
                    <input 
                      type="color" 
                      class="form-control form-control-color"
                      formControlName="primaryColor">
                    <input 
                      type="text" 
                      class="form-control"
                      formControlName="primaryColor"
                      placeholder="#007bff">
                  </div>
                  <div class="form-text">Cor principal da interface (botões, links, etc.)</div>
                </div>

                <div class="mb-3">
                  <label class="form-label"><strong>Cor Secundária</strong></label>
                  <div class="input-group">
                    <input 
                      type="color" 
                      class="form-control form-control-color"
                      formControlName="secondaryColor">
                    <input 
                      type="text" 
                      class="form-control"
                      formControlName="secondaryColor"
                      placeholder="#6c757d">
                  </div>
                  <div class="form-text">Cor para elementos secundários</div>
                </div>

                <!-- Paleta Sugerida -->
                <div class="mb-3">
                  <label class="form-label"><strong>Paletas Sugeridas</strong></label>
                  <div class="color-presets">
                    <button 
                      type="button"
                      class="color-preset"
                      *ngFor="let preset of colorPresets"
                      [title]="preset.name"
                      [style.background-color]="preset.primary"
                      (click)="applyColorPreset(preset)">
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 flex-wrap">
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="isLoading()">
                <i class="fas fa-save"></i>
                {{ isLoading() ? 'Salvando...' : 'Salvar Cores' }}
              </button>
              
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                (click)="resetColors()">
                <i class="fas fa-undo"></i>
                Restaurar Padrão
              </button>
              
              <button 
                type="button" 
                class="btn btn-outline-info"
                (click)="generatePalette()"
                [disabled]="!colorForm.get('primaryColor')?.value">
                <i class="fas fa-magic"></i>
                Gerar Palette
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- CSS Personalizado -->
      <div class="card mt-3">
        <div class="card-header">
          <h6><i class="fas fa-code"></i> CSS Personalizado</h6>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">CSS Personalizado (Avançado)</label>
            <textarea 
              class="form-control font-monospace"
              rows="6"
              [(ngModel)]="customCss"
              placeholder="/* Adicione seu CSS personalizado aqui */
.custom-class {
  color: #333;
  font-weight: bold;
}">
            </textarea>
            <div class="form-text">Cuidado: CSS inválido pode quebrar a interface</div>
          </div>
          
          <div class="d-flex gap-2">
            <button 
              class="btn btn-outline-primary"
              (click)="previewCustomCss()"
              [disabled]="!customCss">
              <i class="fas fa-eye"></i>
              Prévia
            </button>
            
            <button 
              class="btn btn-primary"
              (click)="saveCustomCss()"
              [disabled]="!customCss">
              <i class="fas fa-save"></i>
              Salvar CSS
            </button>
            
            <button 
              class="btn btn-outline-danger"
              (click)="clearCustomCss()">
              <i class="fas fa-trash"></i>
              Limpar
            </button>
          </div>
        </div>
      </div>

      <!-- URLs de Branding -->
      <div class="card mt-3">
        <div class="card-header">
          <h6><i class="fas fa-link"></i> URLs de Recursos</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">URL do Logo</label>
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    [value]="currentCompany()?.logoUrl || 'Nenhum logo configurado'"
                    readonly>
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    (click)="copyToClipboard(currentCompany()?.logoUrl || '')"
                    [disabled]="!currentCompany()?.logoUrl">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Subdomínio</label>
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    [value]="getCompanyUrl()"
                    readonly>
                  <button 
                    class="btn btn-outline-secondary" 
                    type="button"
                    (click)="copyToClipboard(getCompanyUrl())">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagens -->
      <div class="alert alert-success mt-3" *ngIf="successMessage()">
        <i class="fas fa-check-circle"></i>
        {{ successMessage() }}
      </div>
      
      <div class="alert alert-danger mt-3" *ngIf="errorMessage()">
        <i class="fas fa-exclamation-circle"></i>
        {{ errorMessage() }}
      </div>

      <!-- Palette Gerada -->
      <div class="card mt-3" *ngIf="generatedPalette()">
        <div class="card-header">
          <h6><i class="fas fa-palette"></i> Palette de Cores Gerada</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-2" *ngFor="let color of generatedPalette() | keyvalue">
              <div class="text-center mb-2">
                <div 
                  class="color-swatch"
                  [style.background-color]="color.value"
                  [title]="color.key">
                </div>
                <small class="d-block">{{ color.key }}</small>
                <small class="text-muted">{{ color.value }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .branding-config-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .branding-preview {
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }
    
    .preview-header {
      background: linear-gradient(135deg, var(--bs-primary, #007bff) 0%, var(--bs-primary, #0056b3) 100%);
    }
    
    .preview-logo {
      width: 50px;
      height: 50px;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 4px;
    }
    
    .preview-logo-placeholder {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }
    
    .logo-upload-area {
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      min-height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .logo-upload-area:hover {
      border-color: #007bff;
      background-color: #f8f9fa;
    }
    
    .upload-placeholder {
      color: #6c757d;
    }
    
    .current-logo {
      position: relative;
    }
    
    .uploaded-logo {
      max-width: 100%;
      max-height: 120px;
      object-fit: contain;
    }
    
    .logo-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .current-logo:hover .logo-overlay {
      opacity: 1;
    }
    
    .form-control-color {
      width: 60px;
      padding: 4px;
    }
    
    .color-presets {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .color-preset {
      width: 30px;
      height: 30px;
      border: 2px solid #fff;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s ease;
    }
    
    .color-preset:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .color-swatch {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      margin: 0 auto 8px;
      border: 2px solid #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .font-monospace {
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.875rem;
    }
  `]
})
export class BrandingConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private brandingService = inject(BrandingService);
  private subdomainService = inject(SubdomainService);

  colorForm: FormGroup;
  currentCompany = signal<Company | null>(null);
  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  customCss = signal<string>('');
  generatedPalette = signal<{ [key: string]: string } | null>(null);

  colorPresets = [
    { name: 'Azul', primary: '#007bff', secondary: '#6c757d' },
    { name: 'Verde', primary: '#28a745', secondary: '#17a2b8' },
    { name: 'Vermelho', primary: '#dc3545', secondary: '#fd7e14' },
    { name: 'Roxo', primary: '#6f42c1', secondary: '#e83e8c' },
    { name: 'Laranja', primary: '#fd7e14', secondary: '#20c997' },
    { name: 'Índigo', primary: '#6610f2', secondary: '#6f42c1' }
  ];

  constructor() {
    this.colorForm = this.fb.group({
      primaryColor: ['#007bff'],
      secondaryColor: ['#6c757d']
    });
  }

  ngOnInit() {
    this.currentCompany.set(this.subdomainService.getCurrentCompany());
    this.loadCurrentBranding();
  }

  loadCurrentBranding() {
    const company = this.currentCompany();
    if (company) {
      this.colorForm.patchValue({
        primaryColor: company.primaryColor || '#007bff',
        secondaryColor: company.secondaryColor || '#6c757d'
      });
    }
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadLogo(file);
    }
  }

  uploadLogo(file: File) {
    this.isLoading.set(true);
    this.clearMessages();

    this.brandingService.uploadLogo(file).subscribe({
      next: (response) => {
        if (response.success) {
          const company = this.currentCompany();
          if (company && response.logoUrl) {
            company.logoUrl = response.logoUrl;
            this.currentCompany.set(company);
          }
          this.showSuccess('Logo enviado com sucesso!');
        } else {
          this.showError('Falha ao enviar logo: ' + (response.error || 'Erro desconhecido'));
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao fazer upload do logo:', error);
        this.showError('Erro ao fazer upload do logo: ' + (error.message || 'Erro desconhecido'));
        this.isLoading.set(false);
      }
    });
  }

  removeLogo() {
    if (confirm('Tem certeza que deseja remover o logo?')) {
      const company = this.currentCompany();
      if (company) {
        company.logoUrl = undefined;
        this.currentCompany.set(company);
        this.showSuccess('Logo removido com sucesso!');
      }
    }
  }

  async saveColors() {
    if (this.colorForm.invalid) return;

    this.isLoading.set(true);
    this.clearMessages();

    try {
      const formValue = this.colorForm.value;
      await this.brandingService.updateColors({
        primaryColor: formValue.primaryColor,
        secondaryColor: formValue.secondaryColor
      });

      this.showSuccess('Cores atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cores:', error);
      this.showError('Erro ao salvar cores. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  applyColorPreset(preset: any) {
    this.colorForm.patchValue({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    });
  }

  resetColors() {
    this.colorForm.patchValue({
      primaryColor: '#007bff',
      secondaryColor: '#6c757d'
    });
    this.brandingService.resetToDefault();
    this.showSuccess('Cores restauradas para o padrão!');
  }

  generatePalette() {
    const primaryColor = this.colorForm.get('primaryColor')?.value;
    if (primaryColor) {
      const palette = this.brandingService.generateColorPalette(primaryColor);
      this.generatedPalette.set(palette);
    }
  }

  previewCustomCss() {
    const css = this.customCss();
    if (css) {
      this.brandingService.applyCustomCss(css);
      this.showSuccess('Prévia do CSS aplicada! Recarregue para remover.');
    }
  }

  saveCustomCss() {
    const css = this.customCss();
    if (css) {
      this.brandingService.applyCustomCss(css);
      this.showSuccess('CSS personalizado salvo!');
    }
  }

  clearCustomCss() {
    this.customCss.set('');
    this.brandingService.removeCustomCss();
    this.showSuccess('CSS personalizado removido!');
  }

  getCompanyUrl(): string {
    const company = this.currentCompany();
    return company ? this.subdomainService.getCompanyUrl(company.subdomain) : '';
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('Copiado para área de transferência!');
    }).catch(() => {
      this.showError('Erro ao copiar para área de transferência.');
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