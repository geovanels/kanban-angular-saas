import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubdomainService } from '../../services/subdomain.service';

@Component({
  selector: 'app-company-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-4">
          <!-- Company Logo -->
          <div class="flex items-center space-x-3">
            @if (companyLogo && companyLogo !== defaultLogo) {
              <img [src]="companyLogo" 
                   [alt]="'Logo ' + companyName" 
                   class="h-10 w-auto rounded">
            } @else {
              <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                   [style.background-color]="primaryColor">
                {{ getCompanyInitials() }}
              </div>
            }
            
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
  
  get companyName(): string {
    return this.subdomainService.getCurrentCompany()?.name || 'Task Board';
  }

  get companyLogo(): string {
    const company = this.subdomainService.getCurrentCompany();
    return company?.brandingConfig?.logo || this.defaultLogo;
  }

  get defaultLogo(): string {
    return 'https://apps.gobuyer.com.br/sso/assets/images/logos/logo-gobuyer.png';
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
}