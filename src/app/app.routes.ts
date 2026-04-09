import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { CompanyGuard } from './guards/company.guard';
import { BoardStoreService } from './services/board-store.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'form',
    loadComponent: () => import('./components/public-form/public-form.component').then(m => m.PublicFormComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [CompanyGuard]
  },
  {
    path: 'accept-invite',
    loadComponent: () => import('./components/invite-accept/invite-accept.component').then(m => m.InviteAcceptComponent)
  },
  {
    path: 'empresa-nao-encontrada',
    loadComponent: () => import('./components/company-not-found/company-not-found.component').then(m => m.CompanyNotFoundComponent)
  },

  // Authenticated routes under AppShell (sidebar layout)
  {
    path: '',
    loadComponent: () => import('./components/app-shell/app-shell.component').then(m => m.AppShellComponent),
    canActivate: [CompanyGuard, authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      // Kanban board with child routes (tabs)
      {
        path: 'kanban/:boardId',
        loadComponent: () => import('./components/kanban-shell/kanban-shell.component').then(m => m.KanbanShellComponent),
        providers: [BoardStoreService],
        children: [
          {
            path: '',
            loadComponent: () => import('./components/kanban/kanban.component').then(m => m.KanbanComponent)
          },
          {
            path: 'form',
            loadComponent: () => import('./components/board-form-config/board-form-config.component').then(m => m.BoardFormConfigComponent)
          },
          {
            path: 'flow',
            loadComponent: () => import('./components/board-flow/board-flow.component').then(m => m.BoardFlowComponent)
          },
          {
            path: 'reports',
            loadComponent: () => import('./components/board-reports/board-reports.component').then(m => m.BoardReportsComponent)
          },
          {
            path: 'outbox',
            loadComponent: () => import('./components/board-outbox/board-outbox.component').then(m => m.BoardOutboxComponent)
          },
          {
            path: 'templates',
            loadComponent: () => import('./components/board-templates/board-templates.component').then(m => m.BoardTemplatesComponent)
          },
          {
            path: 'api',
            loadComponent: () => import('./components/board-api/board-api.component').then(m => m.BoardApiComponent)
          }
        ]
      },

      // Reports (standalone page)
      {
        path: 'reports',
        loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
      },

      // Settings
      {
        path: 'settings/branding',
        loadComponent: () => import('./components/branding-config/branding-config.component').then(m => m.BrandingConfigComponent)
      },
      {
        path: 'settings/smtp',
        loadComponent: () => import('./components/smtp-config/smtp-config.component').then(m => m.SmtpConfigComponent)
      },
      {
        path: 'settings/integrations',
        loadComponent: () => import('./components/api-links-config/api-links-config.component').then(m => m.ApiLinksConfigComponent)
      },
      {
        path: 'settings/users',
        loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent)
      },

      // Legacy redirects
      { path: 'empresa/branding', redirectTo: '/settings/branding', pathMatch: 'full' },
      { path: 'empresa/smtp', redirectTo: '/settings/smtp', pathMatch: 'full' },
      { path: 'empresa/integracoes', redirectTo: '/settings/integrations', pathMatch: 'full' },
      { path: 'usuarios', redirectTo: '/settings/users', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/login' }
];
