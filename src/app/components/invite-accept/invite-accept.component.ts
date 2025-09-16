import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';
import { SubdomainService } from '../../services/subdomain.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-invite-accept',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invite-accept.component.html',
  styleUrls: ['./invite-accept.component.scss']
})
export class InviteAcceptComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);

  // State
  inviteToken = signal<string | null>(null);
  companyId = signal<string | null>(null);
  company = signal<Company | null>(null);
  userEmail = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // Form
  displayName = signal('');
  password = signal('');
  confirmPassword = signal('');

  async ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');
    const companyId = this.route.snapshot.queryParamMap.get('companyId');
    
    if (!token || !email || !companyId) {
      this.error.set('Link de convite inválido ou expirado.');
      return;
    }

    this.inviteToken.set(token);
    this.userEmail.set(email);
    this.companyId.set(companyId);
    
    // Extrair nome do email para pré-preencher o campo
    this.displayName.set(this.extractNameFromEmail(email));

    // Buscar empresa pelo ID
    await this.loadCompanyFromInvite(companyId);
  }

  private extractNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    return name
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private async loadCompanyFromInvite(companyId: string) {
    this.loading.set(true);
    try {
      console.log('🔍 Debug - Carregando empresa pelo ID:', companyId);
      
      // Buscar empresa diretamente pelo ID (sem precisar de permissões especiais)
      const company = await this.companyService.getCompany(companyId);
      
      if (company) {
        console.log('🏢 Debug - Empresa encontrada:', company.name);
        this.company.set(company);
        this.subdomainService.setCurrentCompany(company);
        
        // Tentar carregar o nome do usuário do convite
        await this.loadUserNameFromInvite(companyId);
      } else {
        console.log('❌ Debug - Empresa não encontrada');
        this.error.set('Empresa não encontrada. O convite pode estar expirado.');
        return;
      }
      
      console.log('✅ Debug - Formulário de aceitação pronto');
      
    } catch (error) {
      console.error('❌ Debug - Erro ao carregar empresa:', error);
      this.error.set('Erro ao carregar informações da empresa.');
    } finally {
      this.loading.set(false);
    }
  }

  private async loadUserNameFromInvite(companyId: string) {
    try {
      const email = this.userEmail();
      if (!email) return;

      console.log('👤 Debug - Tentando carregar nome do usuário do convite...');
      const companyUser = await this.companyService.getCompanyUser(companyId, email);
      
      if (companyUser && companyUser.displayName) {
        console.log('✅ Debug - Nome encontrado no convite:', companyUser.displayName);
        this.displayName.set(companyUser.displayName);
      } else {
        console.log('ℹ️ Debug - Nome não encontrado no convite, usando extração do email');
        // Manter o nome extraído do email como fallback
      }
    } catch (error) {
      console.log('⚠️ Debug - Erro ao carregar nome do convite (usando fallback):', error);
      // Se der erro, mantém o nome extraído do email
    }
  }

  async acceptInvite() {
    const email = this.userEmail();
    const name = this.displayName().trim();
    const pwd = this.password().trim();
    const confirmPwd = this.confirmPassword().trim();
    const token = this.inviteToken();

    console.log('🔍 Debug Form - Validando campos:', { 
      email: !!email, 
      name: !!name && name.length > 0, 
      pwd: !!pwd && pwd.length > 0, 
      confirmPwd: !!confirmPwd && confirmPwd.length > 0,
      token: !!token 
    });

    if (!email || !name || !pwd || !confirmPwd || !token) {
      this.error.set('Todos os campos são obrigatórios.');
      return;
    }

    if (pwd.length < 6) {
      this.error.set('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (pwd !== confirmPwd) {
      this.error.set('As senhas não conferem.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      console.log('🔐 Debug - Tentando criar conta do usuário...');
      // Tentar criar conta do usuário
      let result = await this.authService.signUpWithEmail(email, pwd, name);
      
      // Se o email já estiver em uso, tentar fazer login
      if (!result.success && result.error?.includes('email-already-in-use')) {
        console.log('👤 Debug - Email já existe, tentando fazer login...');
        result = await this.authService.signInWithEmail(email, pwd);
        
        if (!result.success) {
          throw new Error('Email já cadastrado. Verifique sua senha ou faça login normalmente.');
        }
        
        console.log('✅ Debug - Login realizado com sucesso');
      } else if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log('✅ Debug - Conta criada ou login realizado, processando convite...');
      
      // Primeiro, tentar processar o convite diretamente
      const companyId = this.companyId();
      if (!companyId) {
        throw new Error('ID da empresa não encontrado.');
      }

      const company = this.company();
      if (company) {
        // Definir empresa no serviço de subdomínio
        this.subdomainService.setCurrentCompany(company);
        console.log('✅ Debug - Empresa definida no contexto');
      }

      // Tentar processar o convite imediatamente
      console.log('🔄 Debug - Tentando processar convite imediatamente...');
      const inviteProcessed = await this.authService.processPendingInvite(companyId, email, token);
      
      if (inviteProcessed) {
        console.log('✅ Debug - Convite processado com sucesso imediatamente');
      } else {
        // Se não conseguir processar imediatamente, salvar para tentar depois
        console.log('💾 Debug - Salvando convite para processamento posterior...');
        const inviteData = {
          companyId: companyId,
          email: email,
          token: token,
          timestamp: Date.now()
        };
        localStorage.setItem('pendingInvite', JSON.stringify(inviteData));
      }

      console.log('🎉 Debug - Convite aceito com sucesso!');
      this.success.set(true);
      
      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);

    } catch (error: any) {
      console.error('❌ Debug - Erro ao aceitar convite:', error);
      
      let errorMessage = 'Erro ao aceitar convite. Tente novamente.';
      if (error?.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este email já está em uso. Faça login em vez disso.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido.';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      this.error.set(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  getPrimaryColor(): string {
    const company = this.company();
    return company?.primaryColor || company?.brandingConfig?.primaryColor || '#3B82F6';
  }
}