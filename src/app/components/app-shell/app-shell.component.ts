import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastContainerComponent } from '../toast/toast-container.component';
import { BrandingService } from '../../services/branding.service';
import { SubdomainService } from '../../services/subdomain.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, ToastContainerComponent],
  template: `
    <div class="app-shell">
      <!-- Mobile top bar -->
      <div class="mobile-topbar lg:hidden">
        <button class="mobile-menu-btn" (click)="mobileMenuOpen = true">
          <img *ngIf="hasLogo()" [src]="getLogo()" alt="Logo" class="mobile-logo">
          <i *ngIf="!hasLogo()" class="fas fa-bars"></i>
        </button>
        <span class="mobile-title">{{ companyName }}</span>
      </div>

      <!-- Sidebar -->
      <app-sidebar
        [collapsed]="sidebarCollapsed"
        [mobileOpen]="mobileMenuOpen"
        (toggle)="onSidebarToggle()"
        (mobileClose)="mobileMenuOpen = false">
      </app-sidebar>

      <!-- Mobile backdrop -->
      <div
        class="mobile-backdrop lg:hidden"
        [class.visible]="mobileMenuOpen"
        (click)="mobileMenuOpen = false">
      </div>

      <!-- Main content -->
      <div class="main-content"
           [class.sidebar-expanded]="!sidebarCollapsed"
           [class.sidebar-collapsed]="sidebarCollapsed">
        <router-outlet></router-outlet>
      </div>

      <app-toast-container></app-toast-container>
    </div>
  `,
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent {
  private brandingService = inject(BrandingService);
  private subdomainService = inject(SubdomainService);

  sidebarCollapsed = true;
  mobileMenuOpen = false;

  constructor() {
    try {
      const saved = localStorage.getItem('sidebar-collapsed');
      // Default collapsed, only expand if user explicitly set it
      this.sidebarCollapsed = saved === null ? true : saved === 'true';
    } catch {}
  }

  onSidebarToggle() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  hasLogo(): boolean {
    return this.brandingService.hasLogo();
  }

  getLogo(): string {
    return this.brandingService.getLogoUrl();
  }

  get companyName(): string {
    return this.subdomainService.getCurrentCompany()?.name || 'Task Board';
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) {
      this.mobileMenuOpen = false;
    }
  }
}
