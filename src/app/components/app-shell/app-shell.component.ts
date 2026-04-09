import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastContainerComponent } from '../toast/toast-container.component';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';
import { BrandingService } from '../../services/branding.service';
import { SubdomainService } from '../../services/subdomain.service';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, ToastContainerComponent, NotificationBellComponent],
  template: `
    <div class="app-shell">
      <!-- Mobile top bar (hidden when sidebar is visible) -->
      <div class="mobile-topbar">
        <button class="mobile-menu-btn" (click)="mobileMenuOpen = true">
          <img *ngIf="hasLogo()" [src]="getLogo()" alt="Logo" class="mobile-logo">
          <i *ngIf="!hasLogo()" class="fas fa-bars"></i>
        </button>
        <span class="mobile-title">{{ pageTitle }}</span>
        <app-notification-bell></app-notification-bell>
      </div>

      <!-- Desktop notification bell (fixed top-right) -->
      <div class="desktop-notification-bell">
        <app-notification-bell></app-notification-bell>
      </div>

      <!-- Sidebar -->
      <app-sidebar
        [collapsed]="sidebarCollapsed"
        [mobileOpen]="mobileMenuOpen"
        (toggle)="onSidebarToggle()"
        (mobileClose)="mobileMenuOpen = false"
        (boardsLoaded)="onBoardsLoaded($event)">
      </app-sidebar>

      <!-- Mobile backdrop -->
      <div
        class="mobile-backdrop"
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
export class AppShellComponent implements OnDestroy {
  private brandingService = inject(BrandingService);
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);
  private routerSub?: Subscription;

  sidebarCollapsed = true;
  mobileMenuOpen = false;
  pageTitle = 'Meus Quadros';

  private boardsMap: Record<string, string> = {};

  constructor() {
    try {
      const saved = localStorage.getItem('sidebar-collapsed-v2');
      this.sidebarCollapsed = saved === 'false' ? false : true;
    } catch {}

    this.updatePageTitle(this.router.url);
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => this.updatePageTitle(e.urlAfterRedirects || e.url));
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  onBoardsLoaded(boards: Array<{ id?: string; name: string }>) {
    this.boardsMap = {};
    boards.forEach(b => { if (b.id) this.boardsMap[b.id] = b.name; });
    this.updatePageTitle(this.router.url);
  }

  private updatePageTitle(url: string) {
    const kanbanMatch = url.match(/\/kanban\/([^/?]+)/);
    if (kanbanMatch) {
      const boardId = kanbanMatch[1];
      this.pageTitle = this.boardsMap[boardId] || 'Kanban';
    } else if (url.includes('/dashboard')) {
      this.pageTitle = 'Meus Quadros';
    } else if (url.includes('/settings')) {
      this.pageTitle = 'Configurações';
    } else {
      this.pageTitle = this.subdomainService.getCurrentCompany()?.name || 'Task Board';
    }
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

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) {
      this.mobileMenuOpen = false;
    }
  }
}
