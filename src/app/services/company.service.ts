import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionGroup,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  onSnapshot
} from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { Company, CompanyUser, CompanySettings } from '../models/company.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  private firestoreService = inject(FirestoreService);

  // ===== COMPANY MANAGEMENT =====
  
  async createCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const companyRef = doc(collection(this.firestore, 'companies'));
      const now = new Date();
      
      // Gerar configurações padrão
      const defaultCompany: Company = {
        ...companyData,
        id: companyRef.id,
        smtpConfig: companyData.smtpConfig || {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          user: '',
          password: '',
          fromName: companyData.name,
          fromEmail: companyData.contactEmail || ''
        },
        apiConfig: {
          enabled: true,
          token: this.generateApiToken(),
          endpoint: `https://${companyData.subdomain}.taskboard.com.br/api/v1/lead-intake`,
          webhookUrl: ''
        },
        features: this.getFeaturesByPlan(companyData.plan),
        status: 'active',
        createdAt: now,
        updatedAt: now
      };

      await setDoc(companyRef, defaultCompany);
      
      // Criar configurações padrão
      await this.createDefaultSettings(companyRef.id, companyData.ownerId);
      
      return companyRef.id;
    } catch (error) {
      // Erro ao criar empresa
      throw error;
    }
  }

  async getCompanyBySubdomain(subdomain: string): Promise<Company | null> {
    return this.queryCompanyBySubdomain(subdomain);
  }

  private async queryCompanyBySubdomain(subdomain: string): Promise<Company | null> {
    try {
      return await runInInjectionContext(this.injector, async () => {
        const companiesRef = collection(this.firestore, 'companies');
        const q = query(companiesRef, where('subdomain', '==', subdomain));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          return null;
        }
        
        const docData = querySnapshot.docs[0];
        const company = { id: docData.id, ...docData.data() } as Company;
        return company;
      });
    } catch (error) {
      // Erro silencioso para segurança
      console.error('Erro ao buscar empresa por subdomínio:', subdomain, error);
      return null;
    }
  }

  async getCompany(companyId: string): Promise<Company | null> {
    try {
      return await runInInjectionContext(this.injector, async () => {
        const companyRef = doc(this.firestore, 'companies', companyId);
        const docSnap = await getDoc(companyRef);
        
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Company;
        }
        
        return null;
      });
    } catch (error) {
      // Erro ao buscar empresa
      throw error;
    }
  }

  async getCompaniesByOwner(ownerId: string): Promise<Company[]> {
    try {
      return await runInInjectionContext(this.injector, async () => {
        const companiesRef = collection(this.firestore, 'companies');
        const q = query(companiesRef, where('ownerId', '==', ownerId));
        const querySnapshot = await getDocs(q);
        
        const companies: Company[] = [];
        querySnapshot.docs.forEach((doc: any) => {
          companies.push({ id: doc.id, ...doc.data() } as Company);
        });
        
        return companies;
      });
    } catch (error) {
      // Erro ao buscar empresas do proprietário
      return [];
    }
  }

  async updateCompany(companyId: string, updates: Partial<Company>): Promise<void> {
    try {
      const companyRef = doc(this.firestore, 'companies', companyId);
      await updateDoc(companyRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  }

  // ===== COMPANY USERS =====
  
  async addUserToCompany(companyId: string, userEmail: string, role: 'admin' | 'manager' | 'user', displayName?: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'companies', companyId, 'users', userEmail);
      // Usar nome fornecido ou extrair do email como fallback
      const userName = displayName?.trim() || this.extractNameFromEmail(userEmail);
      
      const companyUser: CompanyUser = {
        uid: '', // Será preenchido quando o usuário fizer login
        email: userEmail,
        displayName: userName,
        role,
        permissions: this.getPermissionsByRole(role),
        joinedAt: new Date(),
        inviteStatus: 'pending', // Novo campo para controlar status do convite
        inviteToken: this.generateInviteToken() // Token único para o convite
      };
      
      await setDoc(userRef, companyUser);
      
      try {
        await this.sendInvitationEmail(userEmail, role, companyId, companyUser.inviteToken!, userName);
      } catch (emailError: any) {
        console.error('Erro ao enviar email de convite:', emailError);
        let errorMessage = 'Usuário adicionado com sucesso, mas houve erro ao enviar email de convite.';
        
        if (emailError?.message && emailError.message.includes('Configuração SMTP')) {
          errorMessage = `Erro ao enviar convite: ${emailError.message}`;
        } else if (emailError?.message) {
          errorMessage = `Erro ao enviar convite: ${emailError.message}`;
        } else {
          errorMessage += ' Verifique a configuração do SMTP.';
        }
        
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      throw error;
    }
  }

  private extractNameFromEmail(email: string): string {
    const name = email.split('@')[0];
    return name
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private generateInviteToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private async sendInvitationEmail(userEmail: string, role: string, companyId: string, inviteToken: string, displayName?: string): Promise<void> {
    try {
      // Importar SmtpService dinamicamente para evitar dependência circular
      const { SmtpService } = await import('./smtp.service');
      const smtpService = this.injector.get(SmtpService);
      
      const company = await this.getCompany(companyId);
      if (!company) throw new Error('Empresa não encontrada');
      
      const roleTranslations: { [key: string]: string } = {
        'admin': 'Administrador',
        'manager': 'Gerente',
        'user': 'Usuário'
      };

      const inviteLink = `${window.location.origin}/accept-invite?token=${inviteToken}&email=${encodeURIComponent(userEmail)}&companyId=${companyId}`;
      const subject = `Convite para participar da ${company.name}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <!-- Header do TaskBoard -->
          <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="display: inline-block; background: ${company.brandingConfig?.primaryColor || '#3B82F6'}; color: white; padding: 15px; border-radius: 50%; margin-bottom: 15px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            ${company.brandingConfig?.logo ? `<img src="${company.brandingConfig.logo}" alt="${company.name}" style="max-height: 60px; margin-bottom: 15px;">` : ''}
            <h1 style="color: ${company.brandingConfig?.primaryColor || '#3B82F6'}; margin: 10px 0 5px 0; font-size: 28px;">
              TaskBoard
            </h1>
            <p style="color: #666; margin: 0; font-size: 14px;">Sistema de Gestão Kanban</p>
          </div>
          
          <!-- Conteúdo do convite -->
          <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; font-size: 24px;">🎉 Você foi convidado!</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Olá${displayName ? ` ${displayName}` : ''},</p>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Você foi convidado para fazer parte da empresa <strong>${company.name}</strong> no <strong>TaskBoard</strong> 
              com a função de <strong>${roleTranslations[role]}</strong>.
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              O TaskBoard é um sistema de gestão Kanban que permite organizar e acompanhar projetos de forma visual e colaborativa.
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Para aceitar o convite e criar sua conta, clique no botão abaixo:
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${inviteLink}" 
                 style="background: linear-gradient(135deg, ${company.brandingConfig?.primaryColor || '#3B82F6'} 0%, #5a67d8 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: 600;
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                        transition: transform 0.2s ease;">
                🚀 Aceitar Convite e Criar Conta
              </a>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid ${company.brandingConfig?.primaryColor || '#3B82F6'};">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>💡 Sobre o TaskBoard:</strong><br>
                • Organize projetos em quadros Kanban visuais<br>
                • Colabore em tempo real com sua equipe<br>
                • Acompanhe o progresso de leads e projetos<br>
                • Gerencie usuários e permissões
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; color: #888; font-size: 13px; line-height: 1.6;">
            <p>Se você não conseguir clicar no botão, copie e cole este link no seu navegador:</p>
            <p style="background: white; padding: 10px; border-radius: 6px; word-break: break-all; border: 1px solid #e1e5e9;">
              <a href="${inviteLink}" style="color: #3B82F6;">${inviteLink}</a>
            </p>
            <p style="margin-top: 20px;">
              Este convite foi enviado por <strong>${company.name}</strong> através do <strong>TaskBoard</strong>.<br>
              <em>Se você já possui uma conta, faça login normalmente em vez de usar este link.</em>
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e5e9;">
              <p style="margin: 0; color: #aaa; font-size: 12px;">
                © 2024 TaskBoard - Sistema de Gestão Kanban<br>
                Transformando a gestão de projetos em uma experiência visual
              </p>
            </div>
          </div>
        </div>
      `;

      await smtpService.sendEmail({
        to: userEmail,
        subject: subject,
        html: html
      }).toPromise();
      
    } catch (error) {
      throw error;
    }
  }

  async getCompanyUsers(companyId: string): Promise<CompanyUser[]> {
    try {
      const usersRef = collection(this.firestore, 'companies', companyId, 'users');
      const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(usersRef));
      
      const users = querySnapshot.docs.map((doc: any) => {
        const userData = doc.data();
        return {
          ...userData,
          // Preservar o UID do documento se existir, senão manter vazio
          uid: userData.uid || '',
          // Garantir que o email seja sempre o ID do documento
          email: doc.id
        } as CompanyUser;
      });
      
      return users;
      
    } catch (error) {
      console.warn('Erro ao buscar usuários da empresa:', error);
      // Silenciar erro de permissões - é esperado
      return [];
    }
  }

  async removeUserFromCompany(companyId: string, userEmail: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'companies', companyId, 'users', userEmail);
      await runInInjectionContext(this.injector, () => deleteDoc(userRef));
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
      throw error;
    }
  }

  async updateUserRole(companyId: string, userEmail: string, newRole: 'admin' | 'manager' | 'user'): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'companies', companyId, 'users', userEmail);
      await updateDoc(userRef, {
        role: newRole,
        permissions: this.getPermissionsByRole(newRole)
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUserInCompany(companyId: string, userEmail: string, updates: Partial<CompanyUser>): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'companies', companyId, 'users', userEmail);
      await updateDoc(userRef, updates);
    } catch (error) {
      throw error;
    }
  }

  async getCompanyUser(companyId: string, userEmail: string): Promise<CompanyUser | null> {
    try {
      const userRef = doc(this.firestore, 'companies', companyId, 'users', userEmail);
      const userDoc = await runInInjectionContext(this.injector, () => getDoc(userRef));
      
      if (userDoc.exists()) {
        return {
          uid: userDoc.id,
          ...userDoc.data()
        } as CompanyUser;
      }
      
      return null;
    } catch (error) {
      console.warn('Erro ao buscar usuário da empresa:', error);
      return null;
    }
  }

  async deleteCompany(companyId: string): Promise<void> {
    try {
      // Excluir todos os usuários da empresa
      const usersRef = collection(this.firestore, 'companies', companyId, 'users');
      const usersSnapshot = await runInInjectionContext(this.injector, () => getDocs(usersRef));
      
      for (const userDoc of usersSnapshot.docs) {
        await runInInjectionContext(this.injector, () => deleteDoc(userDoc.ref));
      }

      // Excluir configurações da empresa
      const settingsRef = doc(this.firestore, 'companies', companyId, 'settings', 'general');
      const settingsDoc = await runInInjectionContext(this.injector, () => getDoc(settingsRef));
      if (settingsDoc.exists()) {
        await runInInjectionContext(this.injector, () => deleteDoc(settingsRef));
      }

      // Excluir todos os quadros da empresa (e seus dados relacionados)
      const boardsRef = collection(this.firestore, 'companies', companyId, 'boards');
      const boardsSnapshot = await runInInjectionContext(this.injector, () => getDocs(boardsRef));
      
      for (const boardDoc of boardsSnapshot.docs) {
        const boardId = boardDoc.id;
        
        // Excluir colunas do quadro
        const columnsRef = collection(this.firestore, 'companies', companyId, 'boards', boardId, 'columns');
        const columnsSnapshot = await runInInjectionContext(this.injector, () => getDocs(columnsRef));
        for (const colDoc of columnsSnapshot.docs) {
          await runInInjectionContext(this.injector, () => deleteDoc(colDoc.ref));
        }
        
        // Excluir leads do quadro
        const leadsRef = collection(this.firestore, 'companies', companyId, 'boards', boardId, 'leads');
        const leadsSnapshot = await runInInjectionContext(this.injector, () => getDocs(leadsRef));
        for (const leadDoc of leadsSnapshot.docs) {
          await runInInjectionContext(this.injector, () => deleteDoc(leadDoc.ref));
        }
        
        // Excluir o quadro
        await runInInjectionContext(this.injector, () => deleteDoc(boardDoc.ref));
      }

      // Finalmente, excluir a empresa
      const companyRef = doc(this.firestore, 'companies', companyId);
      await runInInjectionContext(this.injector, () => deleteDoc(companyRef));
      
    } catch (error) {
      throw error;
    }
  }

  // ===== COMPANY SETTINGS =====
  
  async createDefaultSettings(companyId: string, ownerId: string): Promise<void> {
    try {
      const settingsRef = doc(this.firestore, 'companies', companyId, 'settings', 'general');
      const defaultSettings: CompanySettings = {
        companyId,
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        dateFormat: 'DD/MM/YYYY',
        notifications: {
          emailOnNewLead: true,
          emailOnLeadMove: true,
          emailOnLeadComment: false
        },
        formSettings: {
          allowPublicForm: true,
          requireCaptcha: false,
          thankyouMessage: 'Obrigado! Entraremos em contato em breve.'
        }
      };
      
      await setDoc(settingsRef, defaultSettings);
    } catch (error) {
      throw error;
    }
  }

  async getCompanySettings(companyId: string): Promise<CompanySettings | null> {
    try {
      const settingsRef = doc(this.firestore, 'companies', companyId, 'settings', 'general');
      const docSnap = await runInInjectionContext(this.injector, () => getDoc(settingsRef));
      
      if (docSnap.exists()) {
        return docSnap.data() as CompanySettings;
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  }

  async updateCompanySettings(companyId: string, settings: Partial<CompanySettings>): Promise<void> {
    try {
      const settingsRef = doc(this.firestore, 'companies', companyId, 'settings', 'general');
      await updateDoc(settingsRef, settings);
    } catch (error) {
      throw error;
    }
  }

  // ===== SUBDOMAIN MANAGEMENT =====
  
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    try {
      const company = await this.getCompanyBySubdomain(subdomain);
      return company === null;
    } catch (error) {
      return false;
    }
  }


  getCompanySubdomain(): string | null {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // Para desenvolvimento local
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Pode usar um parâmetro de query ou localStorage para simular
        return localStorage.getItem('dev-subdomain') || null;
      }
      
      // Para produção: extrair subdomínio de algo.taskboard.com.br
      if (hostname.includes('taskboard.com.br')) {
        const parts = hostname.split('.');
        if (parts.length >= 3) {
          return parts[0]; // primeira parte antes do primeiro ponto
        }
      }
    }
    
    return null;
  }

  async getCompanyByUserEmail(userEmail: string): Promise<Company | null> {
    try {
      return await runInInjectionContext(this.injector, async () => {
        // 1) Procurar por owner
        const companiesRef = collection(this.firestore, 'companies');
        const ownerQuery = query(companiesRef, where('ownerEmail', '==', userEmail), limit(1));
        const ownerSnap = await runInInjectionContext(this.injector, () => getDocs(ownerQuery));
        
        if (!ownerSnap.empty) {
          const d = ownerSnap.docs[0];
          return { id: d.id, ...d.data() } as Company;
        }

        // 2) Procurar por usuário em qualquer empresa via collectionGroup('users')
        const usersGroup = collectionGroup(this.firestore, 'users');
        const usersSnap = await runInInjectionContext(this.injector, () => getDocs(query(usersGroup, where('email', '==', userEmail), limit(1))));
        
        if (!usersSnap.empty) {
          const userDoc = usersSnap.docs[0];
          const companyRef = userDoc.ref.parent?.parent; // companies/{companyId}
          if (companyRef) {
            const companyDoc = await runInInjectionContext(this.injector, () => getDoc(companyRef));
            if (companyDoc.exists()) {
              return { id: companyDoc.id, ...companyDoc.data() } as Company;
            }
          }
        }

        return null;
      });
    } catch (error) {
      console.error('Erro na busca:', error);
      return null;
    }
  }

  // Método específico para validação de convites sem dependência de consultas complexas
  async validateInviteWithCompanyId(companyId: string, email: string, token: string): Promise<{ valid: boolean; company?: Company; companyUser?: CompanyUser }> {
    try {
      // Buscar empresa diretamente pelo ID
      const company = await this.getCompany(companyId);
      if (!company) {
        return { valid: false };
      }

      // Buscar usuário na empresa
      const companyUser = await this.getCompanyUser(companyId, email);
      if (!companyUser) {
        return { valid: false };
      }

      // Validar token
      if (companyUser.inviteToken !== token) {
        return { valid: false };
      }

      // Validar status
      if (companyUser.inviteStatus !== 'pending') {
        return { valid: false };
      }

      return { valid: true, company, companyUser };
      
    } catch (error) {
      console.error('Erro na validação:', error);
      return { valid: false };
    }
  }

  // ===== UTILITY METHODS =====
  
  private generateApiToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getFeaturesByPlan(plan: string): any {
    switch (plan) {
      case 'free':
        return {
          maxBoards: 1,
          maxUsers: 2,
          maxLeadsPerMonth: 100,
          maxEmailsPerMonth: 50,
          customBranding: false,
          apiAccess: false,
          webhooks: false,
          advancedReports: false,
          whiteLabel: false
        };
      case 'starter':
        return {
          maxBoards: 3,
          maxUsers: 5,
          maxLeadsPerMonth: 1000,
          maxEmailsPerMonth: 500,
          customBranding: true,
          apiAccess: true,
          webhooks: false,
          advancedReports: false,
          whiteLabel: false
        };
      case 'professional':
        return {
          maxBoards: 10,
          maxUsers: 20,
          maxLeadsPerMonth: 5000,
          maxEmailsPerMonth: 2500,
          customBranding: true,
          apiAccess: true,
          webhooks: true,
          advancedReports: true,
          whiteLabel: false
        };
      case 'enterprise':
        return {
          maxBoards: -1, // ilimitado
          maxUsers: -1,
          maxLeadsPerMonth: -1,
          maxEmailsPerMonth: -1,
          customBranding: true,
          apiAccess: true,
          webhooks: true,
          advancedReports: true,
          whiteLabel: true
        };
      default:
        return this.getFeaturesByPlan('free');
    }
  }

  private getPermissionsByRole(role: string): string[] {
    switch (role) {
      case 'admin':
        return ['*']; // todas as permissões
      case 'manager':
        return [
          'leads.read', 'leads.create', 'leads.update', 'leads.delete',
          'boards.read', 'boards.create', 'boards.update',
          'users.read', 'users.invite',
          'templates.read', 'templates.create', 'templates.update', 'templates.delete',
          'automations.read', 'automations.create', 'automations.update', 'automations.delete',
          'reports.read'
        ];
      case 'user':
        return [
          'leads.read', 'leads.create', 'leads.update',
          'boards.read',
          'templates.read',
          'automations.read'
        ];
      default:
        return ['leads.read'];
    }
  }

  // ===== REAL-TIME SUBSCRIPTIONS =====
  
  subscribeToCompany(companyId: string, callback: (company: Company | null) => void) {
    const companyRef = doc(this.firestore, 'companies', companyId);
    return runInInjectionContext(this.injector, () => 
      onSnapshot(companyRef, (doc: any) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() } as Company);
        } else {
          callback(null);
        }
      })
    );
  }
}