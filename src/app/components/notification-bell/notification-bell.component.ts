import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService, AppNotification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Bell Button -->
      <button (click)="toggleDropdown($event)"
              class="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
        <i class="fas fa-bell text-lg"></i>
        @if (unreadCount > 0) {
          <span class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        }
      </button>

      <!-- Dropdown -->
      @if (isOpen) {
        <div class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 max-h-[28rem] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 class="text-sm font-semibold text-gray-900">Notificações</h3>
            @if (unreadCount > 0) {
              <button (click)="markAllRead()" class="text-xs text-blue-600 hover:text-blue-800 font-medium">
                Marcar todas como lidas
              </button>
            }
          </div>

          <!-- Notification List -->
          <div class="overflow-y-auto flex-1">
            @if (notifications.length === 0) {
              <div class="px-4 py-8 text-center text-gray-400">
                <i class="far fa-bell-slash text-3xl mb-2"></i>
                <p class="text-sm">Nenhuma notificação</p>
              </div>
            } @else {
              @for (notification of notifications; track notification.id) {
                <button (click)="onNotificationClick(notification)"
                        class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition-colors"
                        [class.bg-blue-50]="!notification.read"
                        [class.hover:bg-blue-100]="!notification.read">
                  <div class="flex items-start space-x-3">
                    <!-- Icon -->
                    <div class="flex-shrink-0 mt-0.5">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center"
                           [ngClass]="getIconBgClass(notification.type)">
                        <i [class]="getIconClass(notification.type)" class="text-xs"></i>
                      </div>
                    </div>
                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ notification.title }}
                      </p>
                      <p class="text-xs text-gray-600 mt-0.5 line-clamp-2">
                        {{ notification.message }}
                      </p>
                      <p class="text-[10px] text-gray-400 mt-1">
                        {{ formatTime(notification.createdAt) }}
                      </p>
                    </div>
                    <!-- Unread dot -->
                    @if (!notification.read) {
                      <div class="flex-shrink-0 mt-1.5">
                        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    }
                  </div>
                </button>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private subs: Subscription[] = [];

  notifications: AppNotification[] = [];
  unreadCount = 0;
  isOpen = false;

  ngOnInit() {
    this.notificationService.startListening();

    this.subs.push(
      this.notificationService.notifications.subscribe(n => this.notifications = n),
      this.notificationService.unreadCount.subscribe(c => this.unreadCount = c)
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.notificationService.stopListening();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-notification-bell')) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  async onNotificationClick(notification: AppNotification) {
    if (!notification.read && notification.id) {
      await this.notificationService.markAsRead(notification.id);
    }

    this.isOpen = false;

    if (notification.metadata?.boardId) {
      this.router.navigate(['/kanban', notification.metadata.boardId]);
    }
  }

  async markAllRead() {
    await this.notificationService.markAllAsRead();
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'assignment': return 'fas fa-user-plus text-blue-600';
      case 'deadline-warning': return 'fas fa-calendar-exclamation text-orange-600';
      case 'sla-warning': return 'fas fa-clock text-red-600';
      case 'mention': return 'fas fa-at text-purple-600';
      default: return 'fas fa-bell text-gray-600';
    }
  }

  getIconBgClass(type: string): string {
    switch (type) {
      case 'assignment': return 'bg-blue-100';
      case 'deadline-warning': return 'bg-orange-100';
      case 'sla-warning': return 'bg-red-100';
      case 'mention': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  }

  formatTime(timestamp: any): string {
    if (!timestamp) return '';

    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Agora';
    if (diffMin < 60) return `${diffMin}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}
