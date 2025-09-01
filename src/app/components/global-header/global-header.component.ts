import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SubdomainService } from '../../services/subdomain.service';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Task Board Logo/Brand -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-tasks text-white text-lg"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Task Board</h1>
              <p class="text-xs text-gray-500">Sistema de Gestão Kanban</p>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="hidden md:flex items-center space-x-6">
            <a href="/dashboard" 
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
               [class.text-blue-600]="isCurrentRoute('/dashboard')"
               [class.bg-blue-50]="isCurrentRoute('/dashboard')">
              <i class="fas fa-th-large mr-2"></i>
              Quadros
            </a>
            
            <a href="/usuarios" 
               class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
               [class.text-blue-600]="isCurrentRoute('/usuarios')"
               [class.bg-blue-50]="isCurrentRoute('/usuarios')">
              <i class="fas fa-users mr-2"></i>
              Usuários
            </a>
            
            <!-- Configurações Dropdown -->
            <div class="relative" (click)="toggleConfigMenu()" (clickOutside)="configMenuOpen = false">
              <button class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      [class.text-blue-600]="configMenuOpen || isConfigRoute()"
                      [class.bg-blue-50]="configMenuOpen || isConfigRoute()">
                <i class="fas fa-cog mr-2"></i>
                Configurações
                <i class="fas fa-chevron-down ml-1 text-xs" [class.rotate-180]="configMenuOpen"></i>
              </button>
              
              @if (configMenuOpen) {
                <div class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div class="py-1">
                    <a href="/empresa/branding" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i class="fas fa-building mr-3"></i>
                      Minha Empresa
                    </a>
                    <a href="/empresa/smtp" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i class="fas fa-envelope mr-3"></i>
                      Configuração SMTP
                    </a>
                  </div>
                </div>
              }
            </div>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              @if (currentCompany()) {
                <i class="fas fa-building text-xs"></i>
                <span class="font-medium">{{ currentCompany()?.name }}</span>
              }
            </div>
            
            <div class="relative" (click)="toggleUserMenu()" (clickOutside)="userMenuOpen = false">
              <button class="flex items-center p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                @if (currentUser()?.photoURL) {
                  <img [src]="currentUser()?.photoURL" alt="Avatar" class="w-8 h-8 rounded-full">
                } @else {
                  <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <i class="fas fa-user text-gray-600 text-sm"></i>
                  </div>
                }
              </button>
              
              @if (userMenuOpen) {
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div class="py-1">
                    <div class="px-4 py-2 border-b border-gray-100">
                      <p class="text-sm font-medium text-gray-900">{{ currentUser()?.displayName || 'Usuário' }}</p>
                      <p class="text-xs text-gray-500">{{ currentUser()?.email }}</p>
                    </div>
                    <button (click)="logout()" class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                      <i class="fas fa-sign-out-alt mr-2"></i>
                      Sair
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="md:hidden border-t border-gray-200" *ngIf="mobileMenuOpen">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a href="/dashboard" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
            <i class="fas fa-th-large mr-3"></i>
            Quadros
          </a>
          <a href="/usuarios" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
            <i class="fas fa-users mr-3"></i>
            Usuários
          </a>
          <a href="/empresa/branding" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
            <i class="fas fa-building mr-3"></i>
            Minha Empresa
          </a>
          <a href="/empresa/smtp" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md">
            <i class="fas fa-envelope mr-3"></i>
            SMTP
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .rotate-180 {
      transform: rotate(180deg);
    }
    
    @media (max-width: 768px) {
      .mobile-menu-button {
        display: block;
      }
    }
  `]
})
export class GlobalHeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);

  configMenuOpen = false;
  userMenuOpen = false;
  mobileMenuOpen = false;

  currentUser = () => this.authService.getCurrentUser();
  
  currentCompany() {
    return this.subdomainService.getCurrentCompany();
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  isConfigRoute(): boolean {
    return this.router.url.includes('/empresa/');
  }

  toggleConfigMenu() {
    this.configMenuOpen = !this.configMenuOpen;
    this.userMenuOpen = false;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    this.configMenuOpen = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  async logout() {
    const result = await this.authService.logout();
    if (result.success) {
      this.router.navigate(['/login']);
    }
  }
}