import { Component, inject, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SubdomainService } from '../../services/subdomain.service';
import { BrandingService } from '../../services/branding.service';
import { FirestoreService, Board } from '../../services/firestore.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);
  private brandingService = inject(BrandingService);
  private firestoreService = inject(FirestoreService);

  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() mobileClose = new EventEmitter<void>();
  @Output() boardsLoaded = new EventEmitter<Board[]>();

  boards: Board[] = [];
  settingsOpen = true;
  userMenuOpen = false;
  private boardsUnsub?: () => void;

  currentUser = () => this.authService.getCurrentUser();

  ngOnInit() {
    const user = this.currentUser();
    if (user) {
      this.boardsUnsub = this.firestoreService.subscribeToBoards(
        user.uid,
        (boards) => {
          this.boards = boards;
          this.boardsLoaded.emit(boards);
        }
      );
    }
    try {
      const saved = localStorage.getItem('sidebar-collapsed-v2');
      this.collapsed = saved === 'false' ? false : true;
    } catch {}
  }

  ngOnDestroy() {
    if (this.boardsUnsub) this.boardsUnsub();
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    try { localStorage.setItem('sidebar-collapsed-v2', String(this.collapsed)); } catch {}
    this.toggle.emit();
  }

  get company() {
    return this.subdomainService.getCurrentCompany();
  }

  hasCompanyLogo(): boolean {
    return this.brandingService.hasLogo();
  }

  getCompanyLogo(): string {
    return this.brandingService.getLogoUrl();
  }

  getPrimaryColor(): string {
    return this.brandingService.getPrimaryColor();
  }

  getCompanyInitials(): string {
    const company = this.company;
    if (!company?.name) return 'TB';
    const words = company.name.split(' ').filter((w: string) => w.length > 0);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return words.slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
  }

  getCompanyFirstLetter(): string {
    const company = this.company;
    if (!company?.name) return 'T';
    return company.name.trim()[0].toUpperCase();
  }

  getUserInitials(): string {
    const user = this.currentUser();
    const name = user?.displayName || user?.email || '';
    if (!name) return 'U';
    const words = name.split(' ').filter((w: string) => w.length > 0);
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/') || this.router.url.startsWith(route + '?');
  }

  isBoardActive(boardId: string): boolean {
    return this.router.url.startsWith('/kanban/' + boardId);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.mobileClose.emit();
  }

  openBoard(boardId: string) {
    const board = this.boards.find(b => b.id === boardId);
    const ownerId = board?.owner || this.currentUser()?.uid;
    this.router.navigate(['/kanban', boardId], {
      queryParams: { ownerId }
    });
    this.mobileClose.emit();
  }

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  async logout() {
    try {
      const result = await this.authService.logout();
      if (result.success) {
        this.subdomainService.clearCurrentCompany();
        window.location.href = '/login';
      }
    } catch {}
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.userMenuOpen) {
      this.userMenuOpen = false;
    }
  }
}
