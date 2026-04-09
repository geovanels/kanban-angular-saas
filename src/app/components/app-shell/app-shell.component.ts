import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastContainerComponent } from '../toast/toast-container.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, ToastContainerComponent],
  template: `
    <div class="app-shell">
      <!-- Mobile top bar -->
      <div class="mobile-topbar lg:hidden">
        <button class="mobile-menu-btn" (click)="mobileMenuOpen = true">
          <i class="fas fa-bars"></i>
        </button>
        <span class="mobile-title">Task Board</span>
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
  sidebarCollapsed = false;
  mobileMenuOpen = false;

  constructor() {
    try {
      this.sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {}
  }

  onSidebarToggle() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) {
      this.mobileMenuOpen = false;
    }
  }
}
