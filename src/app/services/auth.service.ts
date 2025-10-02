import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, createUserWithEmailAndPassword,
         signOut, signInWithPopup, onAuthStateChanged, updateProfile, sendPasswordResetEmail, signInAnonymously, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  
  user$ = user(this.auth);
  
  async signInWithEmail(email: string, password: string) {
    try {
      console.log('🔐 [signInWithEmail] Tentando login com email:', email);
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('✅ [signInWithEmail] Login com email realizado com sucesso');
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error('❌ [signInWithEmail] Erro no login:', {
        code: error.code,
        message: error.message,
        fullError: error
      });

      // Verificar se o erro é de credencial inválida
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        // Verificar se o usuário existe e quais métodos de login ele tem
        try {
          console.log('🔍 [signInWithEmail] Verificando métodos de login disponíveis para:', email);
          const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
          console.log('🔍 [signInWithEmail] Métodos encontrados:', signInMethods, 'Length:', signInMethods.length, 'Tipo:', typeof signInMethods);

          // Se o usuário existe mas só tem Google como método
          if (signInMethods.length > 0 && !signInMethods.includes('password')) {
            console.log('⚠️ [signInWithEmail] Conta só tem Google, sem senha. Métodos:', signInMethods);
            return {
              success: false,
              error: 'google-only-account',
              errorMessage: 'Esta conta usa login com Google. Você pode entrar com Google ou definir uma senha usando "Esqueceu a senha?".'
            };
          }

          // Se não tem nenhum método, pode ser que o Firebase não encontrou ou é auth/invalid-credential
          // Para auth/invalid-credential, assumir que é conta Google
          if (signInMethods.length === 0) {
            console.log('⚠️ [signInWithEmail] Nenhum método encontrado. Assumindo conta Google para auth/invalid-credential');

            // Para invalid-credential, assumir que é conta Google sem senha
            if (error.code === 'auth/invalid-credential') {
              return {
                success: false,
                error: 'google-only-account',
                errorMessage: 'Esta conta usa login com Google. Você pode entrar com Google ou definir uma senha usando "Esqueceu a senha?".'
              };
            }

            // Para outros casos, realmente não existe
            return {
              success: false,
              error: 'auth/user-not-found',
              errorMessage: 'Usuário não encontrado. Verifique o email ou crie uma conta.'
            };
          }

        } catch (checkError: any) {
          console.error('❌ [signInWithEmail] Erro ao verificar métodos de login:', checkError);

          // Se falhou ao verificar, assumir que é conta Google sem senha para auth/invalid-credential
          if (error.code === 'auth/invalid-credential') {
            console.log('⚠️ [signInWithEmail] Assumindo conta Google sem senha devido a falha na verificação');
            return {
              success: false,
              error: 'google-only-account',
              errorMessage: 'Esta conta usa login com Google. Você pode entrar com Google ou definir uma senha usando "Esqueceu a senha?".'
            };
          }
        }
      }

      return { success: false, error: error.code || error.message };
    }
  }

  async createUserWithEmail(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateUserProfile(profile: { displayName?: string; phoneNumber?: string; photoURL?: string }) {
    try {
      const currentUser = (this.auth as any).currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Atualizar perfil no Firebase Auth
      await updateProfile(currentUser, {
        displayName: profile.displayName,
        photoURL: profile.photoURL
      });

      // Salvar informações adicionais no Firestore
      await setDoc(doc(this.firestore, 'users', currentUser.uid), {
        email: currentUser.email,
        displayName: profile.displayName || currentUser.displayName,
        phoneNumber: profile.phoneNumber,
        photoURL: profile.photoURL || currentUser.photoURL,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signUpWithEmail(email: string, password: string, displayName: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Atualizar perfil
      await this.updateUserProfile({ displayName });
      
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async sendPasswordReset(email: string) {
    try {
      // Verificar se o usuário existe e quais métodos de login ele tem
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);

      console.log('🔐 [sendPasswordReset] Métodos de login para', email, ':', signInMethods);

      // Se o usuário não existe
      if (signInMethods.length === 0) {
        return {
          success: false,
          error: 'Usuário não encontrado. Verifique o email ou crie uma conta.'
        };
      }

      // Configurações personalizadas para o email de recuperação
      const actionCodeSettings = {
        url: `${window.location.origin}/login?recovered=true`, // URL para onde o usuário será redirecionado após redefinir a senha
        handleCodeInApp: false, // Usar a página padrão do Firebase para redefinir senha
      };

      await sendPasswordResetEmail(this.auth, email, actionCodeSettings);

      // Mensagem especial se a conta só tem Google
      if (!signInMethods.includes('password')) {
        return {
          success: true,
          message: 'Email enviado! Você poderá definir uma senha para sua conta Google e fazer login com email e senha também.'
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('❌ [sendPasswordReset] Erro ao enviar email:', error);
      return { success: false, error: error.message };
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();

      const result = await runInInjectionContext(this.injector, () => signInWithPopup(this.auth, provider));

      console.log('🔐 [signInWithGoogle] Login com Google realizado:', {
        email: result.user.email,
        uid: result.user.uid,
        providerId: result.providerId
      });

      // Verificar se o usuário está cadastrado em alguma empresa
      if (!await this.isUserRegistered(result.user.email)) {
        // Fazer logout do usuário se não estiver cadastrado
        await signOut(this.auth);
        throw new Error('Usuário não está cadastrado no sistema. Entre em contato com o administrador para receber um convite.');
      }

      // Criar ou atualizar usuário no Firestore
      await this.createOrUpdateUser(result.user);

      console.log('✅ [signInWithGoogle] Login com Google concluído com sucesso');
      return result;
    } catch (error: any) {
      console.error('❌ [signInWithGoogle] Erro no login com Google:', error);

      // Tratar erro de conta já existente com credencial diferente
      if (error.code === 'auth/account-exists-with-different-credential') {
        console.log('🔗 [signInWithGoogle] Detectada conta existente com credencial diferente');
        throw new Error('Já existe uma conta com este email. Por favor, faça login com o método que você usou originalmente (email/senha ou Google).');
      }

      throw error;
    }
  }

  private async isUserRegistered(email: string | null): Promise<boolean> {
    try {
      console.log('🔐 [isUserRegistered] Verificando registro para:', email);

      if (!email) {
        console.log('❌ [isUserRegistered] Email é nulo ou indefinido');
        return false;
      }

      // Importar CompanyService dinamicamente para evitar dependência circular
      const { CompanyService } = await import('./company.service');
      const companyService = this.injector.get(CompanyService);

      // Verificar se o usuário pertence a alguma empresa
      const company = await companyService.getCompanyByUserEmail(email);
      const isRegistered = company !== null;

      console.log('🔐 [isUserRegistered] Resultado:', {
        email,
        isRegistered,
        companyName: company?.name || 'N/A',
        companyId: company?.id || 'N/A'
      });

      return isRegistered;
    } catch (error) {
      console.error('❌ [isUserRegistered] Erro ao verificar usuário cadastrado:', error);
      return false;
    }
  }

  private async createOrUpdateUser(user: any) {
    try {
      // Verificar se o usuário já existe no Firestore
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await runInInjectionContext(this.injector, () => getDoc(userDocRef));
      
      if (!userDoc.exists()) {
        await runInInjectionContext(this.injector, () => setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
          lastLogin: new Date()
        }));
      } else {
        // Atualizar lastLogin
        await runInInjectionContext(this.injector, () => updateDoc(userDocRef, {
          lastLogin: new Date()
        }));
      }
    } catch (error) {
      console.error('Erro ao criar/atualizar usuário:', error);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async signInAnonymouslyForPublicForms() {
    try {
      const result = await signInAnonymously(this.auth);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    return (this.auth as any).currentUser;
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  // Verificar se usuário tem empresa configurada
  async getUserCompany(userId: string): Promise<any> {
    try {
      const userDoc = await runInInjectionContext(this.injector, () => getDoc(doc(this.firestore, 'users', userId)));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData['companyId'] || null;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar empresa do usuário:', error);
      return null;
    }
  }

  // Associar usuário a uma empresa
  async linkUserToCompany(userId: string, companyId: string): Promise<void> {
    try {
      await setDoc(doc(this.firestore, 'users', userId), {
        companyId,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao associar usuário à empresa:', error);
      throw error;
    }
  }

  // Processar convite pendente após login completo
  async processPendingInvite(companyId: string, email: string, token: string): Promise<boolean> {
    try {
      console.log('🔄 Debug processPendingInvite - Iniciando processamento', {
        companyId,
        email,
        token: token?.substring(0, 8) + '...'
      });
      
      // Aguardar um pouco para garantir que o usuário foi autenticado corretamente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Importar CompanyService dinamicamente para evitar dependência circular
      const { CompanyService } = await import('./company.service');
      const companyService = this.injector.get(CompanyService);
      
      // Validar convite
      console.log('🔍 Debug processPendingInvite - Validando convite...');
      const validation = await companyService.validateInviteWithCompanyId(companyId, email, token);
      
      if (!validation.valid) {
        console.log('❌ Debug processPendingInvite - Validação falhou');
        return false;
      }

      const { company, companyUser } = validation;
      if (!company || !companyUser) {
        console.log('❌ Debug processPendingInvite - Empresa ou usuário não encontrado', {
          hasCompany: !!company,
          hasCompanyUser: !!companyUser
        });
        return false;
      }

      // Atualizar status do convite
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        console.log('❌ Debug processPendingInvite - Usuário atual não encontrado');
        return false;
      }
      
      console.log('📝 Debug processPendingInvite - Atualizando status do convite...', {
        currentUserUid: currentUser.uid,
        currentUserDisplayName: currentUser.displayName,
        companyUserDisplayName: companyUser.displayName,
        companyUserStatus: companyUser.inviteStatus
      });
      
      const updateData = {
        uid: currentUser.uid,
        displayName: currentUser.displayName || companyUser.displayName,
        inviteStatus: 'accepted' as const,
        inviteToken: null,
        acceptedAt: new Date()
      };
      
      await companyService.updateUserInCompany(company.id!, email, updateData);
      console.log('✅ Debug processPendingInvite - Status do convite atualizado com sucesso');

      // Associar usuário à empresa no documento users
      console.log('🔗 Debug processPendingInvite - Associando usuário à empresa...');
      await this.linkUserToCompany(currentUser.uid, company.id!);
      console.log('✅ Debug processPendingInvite - Usuário associado à empresa com sucesso');

      return true;
      
    } catch (error) {
      console.error('❌ Debug processPendingInvite - Erro ao processar convite pendente:', error);
      return false;
    }
  }
}