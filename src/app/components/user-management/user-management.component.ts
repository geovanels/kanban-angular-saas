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
  pendingInvites = signal<CompanyUser[]>([]);
  currentCompany = signal<Company | null>(null);
  currentUser = signal<any>(null);
  isLoading = signal(false);
  
  // Invite user form
  showInviteForm = signal(false);
  inviteEmail = signal('');
  inviteName = signal('');
  inviteRole = signal<'admin' | 'manager' | 'user'>('user');
  inviteLoading = signal(false);
  inviteError = signal<string | null>(null);
  inviteSuccess = signal<string | null>(null);
  
  // Confirmation modals
  showConfirmModal = signal(false);
  confirmAction = signal<(() => void) | null>(null);
  confirmTitle = signal('');
  confirmMessage = signal('');
  confirmButtonText = signal('Confirmar');
  confirmButtonClass = signal('btn-danger');


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

    if (!currentUser || !company || !currentUser.email || !company.id) {
      return;
    }

    try {
      // Verificar se usuário já existe antes de adicionar
      const existingUsers = await this.companyService.getCompanyUsers(company.id);
      const userExists = existingUsers.some(u => u.email === currentUser.email);

      if (!userExists) {
        // Determinar role baseado no email do proprietário
        const role = currentUser.email === company.ownerEmail ? 'admin' : 'user';

        // Forçar adição do usuário à empresa
        await this.companyService.addUserToCompany(company.id, currentUser.email, role);
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
      // Carregar TODOS os usuários (ativos e pendentes)
      let allUsers = await this.companyService.getAllCompanyUsers(company.id);
      
      // Separar usuários ativos e convites pendentes
      const activeUsers = allUsers.filter(user => {
        return !user.inviteStatus || 
               user.inviteStatus === 'accepted' || 
               (user.uid && user.uid.trim() !== '');
      });
      
      const pendingUsers = allUsers.filter(user => {
        return user.inviteStatus === 'pending';
      });
      
      let users = activeUsers;
      
      // Se falhou por permissões, criar usuário fake baseado no usuário atual
      if (users.length === 0) {
        const currentUser = this.authService.getCurrentUser();

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
            emailVerified: currentUser.emailVerified,
            inviteStatus: 'accepted' as const
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
              photoURL: currentUser.photoURL || user.photoURL,
              emailVerified: currentUser.emailVerified || user.emailVerified,
              uid: currentUser.uid || user.uid,
              // Preservar dados do convite se existirem
              inviteStatus: user.inviteStatus || 'accepted',
              inviteToken: user.inviteToken
            };
          }
          
          // Para outros usuários, usar dados disponíveis e inferir nome do email se necessário
          return {
            ...user,
            displayName: user.displayName || this.extractNameFromEmail(user.email),
            // Preservar dados do convite
            inviteStatus: user.inviteStatus || 'accepted',
            inviteToken: user.inviteToken
          };
        } catch (error) {
          console.warn('Erro ao enriquecer dados do usuário:', user.email, error);
          return {
            ...user,
            displayName: user.displayName || this.extractNameFromEmail(user.email),
            // Preservar dados do convite mesmo em erro
            inviteStatus: user.inviteStatus || 'accepted',
            inviteToken: user.inviteToken
          };
        }
      });
      
      this.users.set(enrichedUsers);
      this.pendingInvites.set(pendingUsers);

    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      this.pendingInvites.set([]);
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
    const name = this.inviteName().trim();
    const role = this.inviteRole();
    const company = this.currentCompany();

    if (!email || !company) return;

    // Validar nome
    if (!name) {
      this.inviteError.set('Nome é obrigatório');
      return;
    }

    if (name.length < 2) {
      this.inviteError.set('Nome deve ter pelo menos 2 caracteres');
      return;
    }

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
      await this.companyService.addUserToCompany(company.id!, email, role, name);
      
      this.inviteSuccess.set(`Convite enviado para ${name} (${email})`);
      this.inviteEmail.set('');
      this.inviteName.set('');
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

  removeUser(userEmail: string) {
    const company = this.currentCompany();
    const currentUser = this.currentUser();

    if (!company || !currentUser) {
      return;
    }
    
    // Não permitir remover a si mesmo
    if (userEmail === currentUser.email) {
      this.showConfirmation(
        'Ação não permitida',
        'Você não pode remover a si mesmo. Use a opção "Excluir Empresa" se deseja sair.',
        () => {},
        'Entendi',
        'btn-primary'
      );
      return;
    }

    // Buscar informações do usuário para mostrar o nome
    const user = this.users().find(u => u.email === userEmail);
    const userName = user?.displayName || userEmail;

    this.showConfirmation(
      'Confirmar exclusão',
      `Deseja realmente remover <strong>${userName}</strong> (${userEmail}) da empresa?<br><br>Esta ação não pode ser desfeita.`,
      () => this.confirmRemoveUser(userEmail),
      'Excluir Usuário',
      'btn-danger'
    );
  }

  async confirmRemoveUser(userEmail: string) {
    const company = this.currentCompany();
    if (!company) {
      console.error('🚫 Debug - Empresa não encontrada');
      return;
    }

    this.isLoading.set(true);
    try {
      await this.companyService.removeUserFromCompany(company.id!, userEmail);

      await this.loadCompanyUsers();

      // Mostrar mensagem de sucesso
      this.inviteSuccess.set(`Usuário ${userEmail} removido com sucesso.`);
      setTimeout(() => {
        this.inviteSuccess.set(null);
      }, 3000);

    } catch (error) {
      console.error('❌ Debug - Erro ao remover usuário:', error);
      
      // Mostrar erro com modal
      this.showConfirmation(
        'Erro ao remover usuário',
        'Ocorreu um erro ao tentar remover o usuário. Tente novamente.',
        () => {},
        'Fechar',
        'btn-primary'
      );
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
      this.showConfirmation(
        'Erro ao alterar função',
        'Ocorreu um erro ao alterar a função do usuário. Tente novamente.',
        () => {},
        'Fechar',
        'btn-primary'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async resendInvite(userEmail: string) {
    const company = this.currentCompany();
    if (!company) return;

    this.isLoading.set(true);
    try {
      // Re-adicionar o usuário à empresa (que funciona como reenviar convite)
      const user = this.users().find(u => u.email === userEmail);
      if (user) {
        await this.companyService.addUserToCompany(company.id!, userEmail, user.role, user.displayName);
        this.inviteSuccess.set(`Convite reenviado para ${userEmail}`);
        setTimeout(() => {
          this.inviteSuccess.set(null);
        }, 3000);
        await this.loadCompanyUsers();
      }
    } catch (error: any) {
      console.error('Erro ao reenviar convite:', error);
      
      let errorMessage = 'Erro ao reenviar convite. Tente novamente.';
      if (error?.message && error.message.includes('Configuração SMTP')) {
        errorMessage = `❌ ${error.message}. Configure o SMTP na seção de configurações antes de reenviar convites.`;
      }
      
      this.inviteError.set(errorMessage);
      setTimeout(() => {
        this.inviteError.set(null);
      }, 5000);
    } finally {
      this.isLoading.set(false);
    }
  }

  inactivateUser(userEmail: string) {
    const company = this.currentCompany();
    if (!company) return;

    // Buscar informações do usuário para mostrar o nome
    const user = this.users().find(u => u.email === userEmail);
    const userName = user?.displayName || userEmail;

    this.showConfirmation(
      'Confirmar inativação',
      `Deseja realmente inativar <strong>${userName}</strong> (${userEmail})?<br><br>O usuário não poderá mais acessar o sistema até ser reativado.`,
      () => this.confirmInactivateUser(userEmail),
      'Inativar Usuário',
      'btn-danger'
    );
  }

  async confirmInactivateUser(userEmail: string) {
    const company = this.currentCompany();
    if (!company) return;

    this.isLoading.set(true);
    try {
      // Atualizar status para inativo
      await this.companyService.updateUserInCompany(company.id!, userEmail, {
        inviteStatus: 'inactive'
      });
      
      await this.loadCompanyUsers();
      this.inviteSuccess.set(`Usuário ${userEmail} foi inativado com sucesso.`);
      setTimeout(() => {
        this.inviteSuccess.set(null);
      }, 3000);
    } catch (error) {
      console.error('Erro ao inativar usuário:', error);
      this.showConfirmation(
        'Erro ao inativar usuário',
        'Ocorreu um erro ao tentar inativar o usuário. Tente novamente.',
        () => {},
        'Fechar',
        'btn-primary'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async deletePendingInvite(userEmail: string) {
    const company = this.currentCompany();
    if (!company?.id) return;

    this.showConfirmation(
      'Excluir Convite Pendente',
      `Tem certeza que deseja excluir o convite pendente para ${userEmail}? Esta ação não pode ser desfeita.`,
      async () => {
        try {
          await this.companyService.removeUserFromCompany(company.id!, userEmail);
          await this.loadCompanyUsers();
          
          this.inviteSuccess.set(`Convite para ${userEmail} foi excluído com sucesso.`);
          setTimeout(() => {
            this.inviteSuccess.set(null);
          }, 3000);
        } catch (error) {
          console.error('Erro ao excluir convite:', error);
          this.inviteError.set('Erro ao excluir convite. Tente novamente.');
          setTimeout(() => {
            this.inviteError.set(null);
          }, 3000);
        }
      },
      'Excluir',
      'btn-danger'
    );
  }

  async markInviteAsAccepted(userEmail: string) {
    const company = this.currentCompany();
    if (!company?.id) return;

    this.showConfirmation(
      'Marcar Convite como Aceito',
      `Deseja marcar o convite de ${userEmail} como aceito? Isso irá ativar o usuário na empresa.`,
      async () => {
        try {
          await this.companyService.updateUserInCompany(company.id!, userEmail, {
            inviteStatus: 'accepted',
            inviteToken: null,
            acceptedAt: new Date()
          });
          await this.loadCompanyUsers();
          
          this.inviteSuccess.set(`Convite de ${userEmail} marcado como aceito com sucesso.`);
          setTimeout(() => {
            this.inviteSuccess.set(null);
          }, 3000);
        } catch (error) {
          console.error('Erro ao marcar convite como aceito:', error);
          this.inviteError.set('Erro ao atualizar convite. Tente novamente.');
          setTimeout(() => {
            this.inviteError.set(null);
          }, 3000);
        }
      },
      'Marcar como Aceito',
      'btn-success'
    );
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
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
    this.inviteName.set('');
  }

  showConfirmation(title: string, message: string, action: () => void, buttonText: string = 'Confirmar', buttonClass: string = 'btn-danger') {
    this.confirmTitle.set(title);
    this.confirmMessage.set(message);
    this.confirmAction.set(action);
    this.confirmButtonText.set(buttonText);
    this.confirmButtonClass.set(buttonClass);
    this.showConfirmModal.set(true);
  }

  confirmModalAction() {
    const action = this.confirmAction();

    if (action) {
      action();
    }

    this.showConfirmModal.set(false);
  }

  cancelModalAction() {
    this.showConfirmModal.set(false);
    this.confirmAction.set(null);
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
      case 'admin': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
      case 'manager': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
      case 'user': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800';
      default: return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'Convite Pendente';
      case 'accepted': return 'Ativo';
      case 'expired': return 'Convite Expirado';
      case 'inactive': return 'Inativo';
      default: return 'Desconhecido';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
      case 'accepted': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
      case 'expired': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
      case 'inactive': return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
      default: return 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
    }
  }

  getPrimaryColor(): string {
    const company = this.subdomainService.getCurrentCompany();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || '#3B82F6';
  }

  formatJoinedDate(joinedAt: any): string {
    if (!joinedAt) {
      return 'Data não disponível';
    }

    try {
      // Se for um Timestamp do Firestore, converter para Date
      if (joinedAt && typeof joinedAt.toDate === 'function') {
        return joinedAt.toDate().toLocaleDateString('pt-BR');
      }
      
      // Se já for um Date
      if (joinedAt instanceof Date) {
        return joinedAt.toLocaleDateString('pt-BR');
      }
      
      // Se for uma string, tentar converter
      if (typeof joinedAt === 'string') {
        return new Date(joinedAt).toLocaleDateString('pt-BR');
      }
      
      return 'Data não disponível';
    } catch (error) {
      console.warn('Erro ao formatar data:', joinedAt, error);
      return 'Data não disponível';
    }
  }
}