import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SubdomainService } from '../../services/subdomain.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <button 
              (click)="goToDashboard()"
              class="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <i class="fas fa-arrow-left"></i>
            </button>
            
            <h1 class="text-xl font-semibold text-gray-900">
              {{ title }}
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    header {
      position: sticky;
      top: 0;
      z-index: 10;
    }
  `]
})
export class ConfigHeaderComponent {
  @Input() title: string = '';
  
  private router = inject(Router);
  private subdomainService = inject(SubdomainService);

  get companyName(): string {
    return this.subdomainService.getCurrentCompany()?.name || 'Sistema Kanban';
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

  goToDashboard() {
    this.router.navigate(['/dashboard']);
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
    if (!name || name === 'Sistema Kanban') return 'SK';
    
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else if (words.length >= 2) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    
    return 'SK';
  }
}