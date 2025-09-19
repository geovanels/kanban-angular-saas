import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubdomainService } from '../../services/subdomain.service';

@Component({
  selector: 'app-company-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-4">
          <!-- Page Title -->
          <div class="flex items-center space-x-3">
            <!-- Back Button -->
            <button 
              (click)="goBack()"
              class="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors">
              <i class="fas fa-arrow-left"></i>
            </button>
            
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h2>
              @if (subtitle) {
                <p class="text-sm text-gray-600">{{ subtitle }}</p>
              }
            </div>
          </div>
          
          <!-- Actions Slot -->
          <div class="flex-1 flex justify-end">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CompanyBreadcrumbComponent {
  @Input() title: string = 'Meus quadros Kanban';
  @Input() subtitle?: string;
  
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);
  
  get companyName(): string {
    return this.subdomainService.getCurrentCompany()?.name || 'Task Board';
  }

  get companyLogo(): string {
    const company = this.subdomainService.getCurrentCompany();
    
    // Sempre priorizar logo da empresa configurado
    if (company?.logoUrl && company.logoUrl.trim() !== '') {
      return company.logoUrl;
    }
    
    // Fallback para brandingConfig logo
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== '') {
      return company.brandingConfig.logo;
    }
    
    return '';
  }

  hasCustomLogo(): boolean {
    const company = this.subdomainService.getCurrentCompany();
    
    // Verificar se tem logo da empresa configurado
    if (company?.logoUrl && company.logoUrl.trim() !== '') {
      return true;
    }
    
    // Fallback para brandingConfig logo
    if (company?.brandingConfig?.logo && company.brandingConfig.logo.trim() !== '') {
      return true;
    }
    
    return false;
  }

  get primaryColor(): string {
    const company = this.subdomainService.getCurrentCompany();
    return company?.brandingConfig?.primaryColor || '#3B82F6';
  }

  getCompanyInitials(): string {
    const name = this.companyName;
    if (!name || name === 'Task Board') return 'TB';
    
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    
    return 'TB';
  }

  goBack() {
    // Para páginas de configuração, voltar para dashboard
    const currentUrl = this.router.url;
    if (currentUrl.includes('/empresa/') || currentUrl.includes('/usuarios')) {
      this.router.navigate(['/dashboard']);
    } else {
      // Para outras páginas, usar navegação padrão do browser
      window.history.back();
    }
  }
}