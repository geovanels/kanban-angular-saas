import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';
import { SubdomainService } from '../../services/subdomain.service';
import { CompanyUser, Company } from '../../models/company.model';
import { ConfigHeaderComponent } from '../config-header/config-header.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfigHeaderComponent, MainLayoutComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);

  users = signal<CompanyUser[]>([]);
  currentCompany = signal<Company | null>(null);
  currentUser = signal<any>(null);
  isLoading = signal(false);
  
  // Invite user form
  showInviteForm = signal(false);
  inviteEmail = signal('');
  inviteRole = signal<'admin' | 'manager' | 'user'>('user');
  inviteLoading = signal(false);
  inviteError = signal<string | null>(null);
  inviteSuccess = signal<string | null>(null);

  // Delete company
  showDeleteConfirmation = signal(false);
  deleteConfirmation = signal('');
  deleteLoading = signal(false);
  deleteError = signal<string | null>(null);

  async ngOnInit() {
    await this.loadUserData();
    
    // Garantir que a empresa Gobuyer existe
    await this.ensureGobuyerCompany();
    
    // Primeiro, tentar sincronizar o usuário atual com a empresa
    await this.forceAddCurrentUser();
    
    // Depois carregar todos os usuários
    await this.loadCompanyUsers();
  }

  private async ensureGobuyerCompany() {
    try {
      await this.companyService.seedGobuyerCompany();
      
      // Recarregar dados da empresa
      const company = this.subdomainService.getCurrentCompany();
      this.currentCompany.set(company);
    } catch (error) {
      console.error('Erro ao garantir empresa Gobuyer:', error);
    }
  }

  private async forceAddCurrentUser() {
    const currentUser = this.authService.getCurrentUser();
    const company = this.currentCompany();
    
    if (!currentUser || !company || !currentUser.email) return;

    try {
      // Determinar role baseado no email do proprietário
      const role = currentUser.email === company.ownerEmail ? 'admin' : 'user';
      
      // Forçar adição do usuário à empresa (será ignorado se já existir)
      await this.companyService.addUserToCompany(company.id!, currentUser.email, role);
    } catch (error) {
      // Erro silencioso pois pode ser normal se o usuário já existir
    }
  }

  private async syncCurrentUserToCompany() {
    const currentUser = this.authService.getCurrentUser();
    const company = this.currentCompany();
    
    if (!currentUser || !company || !currentUser.email) return;

    try {
      // Verificar se o usuário atual já está na lista da empresa
      const existingUser = this.users().find(u => u.email === currentUser.email);
      
      if (!existingUser) {
        // Determinar role baseado no email do proprietário
        const role = currentUser.email === company.ownerEmail ? 'admin' : 'user';
        
        // Adicionar usuário à empresa
        await this.companyService.addUserToCompany(company.id!, currentUser.email, role);
        
        // Recarregar lista
        await this.loadCompanyUsers();
      }
    } catch (error) {
      console.error('Erro ao sincronizar usuário atual:', error);
    }
  }

  private async loadUserData() {
    const company = this.subdomainService.getCurrentCompany();
    const user = this.authService.getCurrentUser();
    
    this.currentCompany.set(company);
    this.currentUser.set(user);
  }

  private async loadCompanyUsers() {
    const company = this.currentCompany();
    if (!company) {
      // Nenhuma empresa encontrada para carregar usuários
      return;
    }

    // Carregando usuários da empresa
    this.isLoading.set(true);
    try {
      let users = await this.companyService.getCompanyUsers(company.id!);
      // Usuários encontrados na empresa
      
      // Se não há usuários, adicionar o usuário atual automaticamente
      if (users.length === 0) {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.email) {
          // Adicionando usuário atual à empresa
          await this.companyService.addUserToCompany(
            company.id!, 
            currentUser.email, 
            currentUser.email === company.ownerEmail ? 'admin' : 'user'
          );
          users = await this.companyService.getCompanyUsers(company.id!);
        }
      }
      
      // Enriquecer dados dos usuários com informações do Firebase Auth se disponível
      const enrichedUsers = await Promise.all(users.map(async (user) => {
        try {
          // Tentar obter dados adicionais do Firebase Auth se o usuário estiver logado
          const currentUser = this.authService.getCurrentUser();
          if (currentUser && currentUser.email === user.email) {
            return {
              ...user,
              displayName: currentUser.displayName || user.displayName || this.extractNameFromEmail(user.email),
              photoURL: currentUser.photoURL,
              emailVerified: currentUser.emailVerified,
              uid: currentUser.uid
            };
          }
          
          // Para outros usuários, usar dados disponíveis e inferir nome do email se necessário
          return {
            ...user,
            displayName: user.displayName || this.extractNameFromEmail(user.email)
          };
        } catch (error) {
          console.warn('Erro ao enriquecer dados do usuário:', user.email, error);
          return {
            ...user,
            displayName: user.displayName || this.extractNameFromEmail(user.email)
          };
        }
      }));
      
      // Usuários enriquecidos processados
      this.users.set(enrichedUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private extractNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];
    // Converter pontos e underscores em espaços e capitalizar
    return localPart
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  async inviteUser() {
    const email = this.inviteEmail().trim();
    const role = this.inviteRole();
    const company = this.currentCompany();

    if (!email || !company) return;

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.inviteError.set('Email inválido');
      return;
    }

    // Verificar se usuário já existe
    const existingUser = this.users().find(u => u.email === email);
    if (existingUser) {
      this.inviteError.set('Este usuário já faz parte da empresa');
      return;
    }

    this.inviteLoading.set(true);
    this.inviteError.set(null);
    this.inviteSuccess.set(null);

    try {
      await this.companyService.addUserToCompany(company.id!, email, role);
      
      this.inviteSuccess.set(`Convite enviado para ${email}`);
      this.inviteEmail.set('');
      this.inviteRole.set('user');
      
      // Recarregar lista de usuários
      await this.loadCompanyUsers();
      
      // Esconder formulário após sucesso
      setTimeout(() => {
        this.showInviteForm.set(false);
        this.inviteSuccess.set(null);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao convidar usuário:', error);
      this.inviteError.set('Erro ao enviar convite. Tente novamente.');
    } finally {
      this.inviteLoading.set(false);
    }
  }

  async removeUser(userEmail: string) {
    const company = this.currentCompany();
    const currentUser = this.currentUser();
    
    if (!company || !currentUser) return;
    
    // Não permitir remover a si mesmo
    if (userEmail === currentUser.email) {
      alert('Você não pode remover a si mesmo. Use a opção "Excluir Empresa" se deseja sair.');
      return;
    }

    if (!confirm(`Deseja remover o usuário ${userEmail} da empresa?`)) {
      return;
    }

    this.isLoading.set(true);
    try {
      await this.companyService.removeUserFromCompany(company.id!, userEmail);
      await this.loadCompanyUsers();
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      alert('Erro ao remover usuário. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async changeUserRole(userEmail: string, newRole: 'admin' | 'manager' | 'user') {
    const company = this.currentCompany();
    if (!company) return;

    this.isLoading.set(true);
    try {
      // Atualizar role do usuário
      await this.companyService.updateUserRole(company.id!, userEmail, newRole);
      await this.loadCompanyUsers();
    } catch (error) {
      console.error('Erro ao alterar função do usuário:', error);
      alert('Erro ao alterar função do usuário. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async resendInvite(userEmail: string) {
    const company = this.currentCompany();
    if (!company) return;

    try {
      // Re-adicionar o usuário à empresa (que funciona como reenviar convite)
      const user = this.users().find(u => u.email === userEmail);
      if (user) {
        await this.companyService.addUserToCompany(company.id!, userEmail, user.role);
        alert(`Convite reenviado para ${userEmail}`);
      }
    } catch (error) {
      console.error('Erro ao reenviar convite:', error);
      alert('Erro ao reenviar convite. Tente novamente.');
    }
  }

  canManageUsers(): boolean {
    const currentUser = this.currentUser();
    const company = this.currentCompany();
    
    if (!currentUser || !company) return false;
    
    const userInCompany = this.users().find(u => u.email === currentUser.email);
    return userInCompany?.role === 'admin';
  }

  canDeleteCompany(): boolean {
    const currentUser = this.currentUser();
    const company = this.currentCompany();
    
    if (!currentUser || !company) return false;
    
    // Apenas o dono da empresa pode excluir
    return company.ownerEmail === currentUser.email;
  }

  async deleteCompany() {
    const company = this.currentCompany();
    const confirmation = this.deleteConfirmation().trim();
    
    if (!company || confirmation !== company.name) {
      this.deleteError.set('Digite exatamente o nome da empresa para confirmar');
      return;
    }

    this.deleteLoading.set(true);
    this.deleteError.set(null);

    try {
      await this.companyService.deleteCompany(company.id!);
      
      // Logout e redirect
      await this.authService.logout();
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      this.deleteError.set('Erro ao excluir empresa. Tente novamente.');
    } finally {
      this.deleteLoading.set(false);
    }
  }

  showInviteFormToggle() {
    this.showInviteForm.set(!this.showInviteForm());
    this.inviteError.set(null);
    this.inviteSuccess.set(null);
    this.inviteEmail.set('');
  }

  showDeleteModal() {
    this.showDeleteConfirmation.set(true);
    this.deleteConfirmation.set('');
    this.deleteError.set(null);
  }

  hideDeleteModal() {
    this.showDeleteConfirmation.set(false);
    this.deleteConfirmation.set('');
    this.deleteError.set(null);
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'user': return 'Usuário';
      default: return role;
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin': return 'badge-danger';
      case 'manager': return 'badge-warning';
      case 'user': return 'badge-info';
      default: return 'badge-secondary';
    }
  }
}