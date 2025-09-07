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


  async ngOnInit() {
    await this.ensureCompanyContext();
    await this.loadUserData();
    
    // Primeiro, tentar sincronizar o usuário atual com a empresa
    await this.forceAddCurrentUser();
    
    // Depois carregar todos os usuários
    await this.loadCompanyUsers();
  }


  private async forceAddCurrentUser() {
    const currentUser = this.authService.getCurrentUser();
    const company = this.currentCompany();
    
    console.log('Force adding current user - User:', currentUser?.email, 'Company:', company?.name, 'ID:', company?.id);
    
    if (!currentUser || !company || !currentUser.email || !company.id) {
      console.log('Missing data for force add user');
      return;
    }

    try {
      // Verificar se usuário já existe antes de adicionar
      const existingUsers = await this.companyService.getCompanyUsers(company.id);
      const userExists = existingUsers.some(u => u.email === currentUser.email);
      
      console.log('User already exists in company:', userExists);
      
      if (!userExists) {
        // Determinar role baseado no email do proprietário
        const role = currentUser.email === company.ownerEmail ? 'admin' : 'user';
        console.log('Adding user with role:', role);
        
        // Forçar adição do usuário à empresa
        await this.companyService.addUserToCompany(company.id, currentUser.email, role);
        console.log('User added successfully');
      }
    } catch (error) {
      console.error('Error in forceAddCurrentUser:', error);
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

  private async ensureCompanyContext() {
    let company = this.subdomainService.getCurrentCompany();
    if (!company) {
      try {
        company = await this.subdomainService.initializeFromSubdomain();
      } catch {}
    }
    if (!company) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?.email) {
        try {
          const found = await this.companyService.getCompanyByUserEmail(currentUser.email);
          if (found) {
            this.subdomainService.setCurrentCompany(found);
            this.currentCompany.set(found);
          }
        } catch {}
      }
    } else {
      this.currentCompany.set(company);
    }
  }

  private async loadCompanyUsers() {
    let company = this.currentCompany();
    
    if (!company || !company.id) {
      await this.ensureCompanyContext();
      company = this.currentCompany();
      if (!company || !company.id) return;
    }

    this.isLoading.set(true);
    try {
      let users = await this.companyService.getCompanyUsers(company.id);
      
      // Se falhou por permissões, criar usuário fake baseado no usuário atual
      if (users.length === 0) {
        const currentUser = this.authService.getCurrentUser();
        console.log('No users found, current user:', currentUser);
        
        if (currentUser && currentUser.email) {
          // Criar usuário para mostrar na interface enquanto não temos acesso ao Firestore
          const role: 'admin' | 'manager' | 'user' = currentUser.email === company.ownerEmail ? 'admin' : 'user';
          const fakeUser = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || this.extractNameFromEmail(currentUser.email),
            role: role,
            permissions: [],
            joinedAt: new Date(),
            photoURL: currentUser.photoURL,
            emailVerified: currentUser.emailVerified
          };
          
          users = [fakeUser];
          
          // Tentar adicionar no background (sem aguardar)
          this.companyService.addUserToCompany(
            company.id, 
            currentUser.email, 
            fakeUser.role
          ).catch(() => {
            // Erro silencioso
          });
        }
      }
      
      // Enriquecer dados dos usuários com informações do Firebase Auth se disponível
      const enrichedUsers = users.map((user) => {
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
      });
      
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
      
    } catch (error: any) {
      console.error('Erro ao convidar usuário:', error);
      
      let errorMessage = 'Erro ao enviar convite. Tente novamente.';
      
      if (error?.message) {
        if (error.message.includes('Configuração SMTP')) {
          errorMessage = `❌ ${error.message}. Configure o SMTP na seção de configurações antes de enviar convites.`;
        } else if (error.message.includes('email de convite')) {
          errorMessage = error.message;
        } else {
          errorMessage = `Erro: ${error.message}`;
        }
      }
      
      this.inviteError.set(errorMessage);
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
    
    // Verificar se é o proprietário da empresa (sempre pode gerenciar)
    if (company.ownerEmail === currentUser.email) {
      return true;
    }
    
    // Se os usuários já foram carregados, verificar role
    if (this.users().length > 0) {
      const userInCompany = this.users().find(u => u.email === currentUser.email);
      return userInCompany?.role === 'admin';
    }
    
    // Se ainda não carregou os usuários, assumir que pode gerenciar
    // (será refinado quando os dados carregarem)
    return true;
  }


  showInviteFormToggle() {
    this.showInviteForm.set(!this.showInviteForm());
    this.inviteError.set(null);
    this.inviteSuccess.set(null);
    this.inviteEmail.set('');
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

  getPrimaryColor(): string {
    const company = this.subdomainService.getCurrentCompany();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || '#3B82F6';
  }
}