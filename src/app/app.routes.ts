import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { CompanyGuard } from './guards/company.guard';

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
    canActivate: [CompanyGuard] // Verificar empresa antes do login
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [CompanyGuard, authGuard] // Verificar empresa e autenticação
  },
  {
    path: 'kanban/:boardId',
    loadComponent: () => import('./components/kanban/kanban.component').then(m => m.KanbanComponent),
    canActivate: [CompanyGuard, authGuard] // Verificar empresa e autenticação
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [CompanyGuard, authGuard] // Verificar empresa e autenticação
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [CompanyGuard, authGuard] // Verificar empresa e autenticação
  },
  {
    path: 'empresa/branding',
    loadComponent: () => import('./components/branding-config/branding-config.component').then(m => m.BrandingConfigComponent),
    canActivate: [CompanyGuard, authGuard]
  },
  {
    path: 'empresa/smtp',
    loadComponent: () => import('./components/smtp-config/smtp-config.component').then(m => m.SmtpConfigComponent),
    canActivate: [CompanyGuard, authGuard]
  },
  {
    path: 'empresa/integracoes',
    loadComponent: () => import('./components/api-links-config/api-links-config.component').then(m => m.ApiLinksConfigComponent),
    canActivate: [CompanyGuard, authGuard]
  },
  {
    path: 'empresa-nao-encontrada',
    loadComponent: () => import('./components/company-not-found/company-not-found.component').then(m => m.CompanyNotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
