import { Injectable, inject, Injector } from '@angular/core';
import { 
  Firestore, 
  collection, 
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
  onSnapshot,
  serverTimestamp
} from '@angular/fire/firestore';
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
      const companiesRef = collection(this.firestore, 'companies');
      const q = query(companiesRef, where('subdomain', '==', subdomain));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() } as Company;
    } catch (error) {
      // Erro silencioso para segurança
      return null;
    }
  }

  async getCompany(companyId: string): Promise<Company | null> {
    try {
      const companyRef = doc(this.firestore, 'companies', companyId);
      const docSnap = await getDoc(companyRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Company;
      }
      
      return null;
    } catch (error) {
      // Erro ao buscar empresa
      throw error;
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
  
  async addUserToCompany(companyId: string, userEmail: string, role: 'admin' | 'manager' | 'user'): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'companies', companyId, 'users', userEmail);
      const companyUser: CompanyUser = {
        uid: '',
        email: userEmail,
        displayName: '',
        role,
        permissions: this.getPermissionsByRole(role),
        joinedAt: new Date()
      };
      
      await setDoc(userRef, companyUser);
      
      try {
        await this.sendInvitationEmail(userEmail, role, companyId);
      } catch (emailError) {
        throw new Error('Usuário adicionado com sucesso, mas houve erro ao enviar email de convite. Verifique a configuração do SMTP.');
      }
      
    } catch (error) {
      throw error;
    }
  }

  private async sendInvitationEmail(userEmail: string, role: string, companyId: string): Promise<void> {
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

      const inviteLink = `${window.location.origin}/login`;
      const subject = `Convite para participar da ${company.name}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            ${company.brandingConfig?.logo ? `<img src="${company.brandingConfig.logo}" alt="${company.name}" style="max-height: 80px;">` : ''}
            <h1 style="color: ${company.brandingConfig?.primaryColor || '#3B82F6'}; margin-top: 20px;">
              Convite para ${company.name}
            </h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Você foi convidado!</h2>
            <p>Olá,</p>
            <p>Você foi convidado para fazer parte da <strong>${company.name}</strong> com a função de <strong>${roleTranslations[role]}</strong>.</p>
            <p>Para aceitar o convite e começar a usar a plataforma, clique no botão abaixo:</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: ${company.brandingConfig?.primaryColor || '#3B82F6'}; 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      font-weight: bold;
                      display: inline-block;">
              Aceitar Convite
            </a>
          </div>
          
          <div style="font-size: 12px; color: #666; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Se você não conseguir clicar no botão, copie e cole este link no seu navegador:</p>
            <p><a href="${inviteLink}" style="color: #3B82F6;">${inviteLink}</a></p>
            <p>Este convite foi enviado por ${company.name}.</p>
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
      const querySnapshot = await getDocs(usersRef);
      
      const users = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as CompanyUser));
      
      return users;
      
    } catch (error) {
      // Silenciar erro de permissões - é esperado
      return [];
    }
  }

  async removeUserFromCompany(companyId: string, userEmail: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'companies', companyId, 'users', userEmail);
      await deleteDoc(userRef);
    } catch (error) {
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

  async deleteCompany(companyId: string): Promise<void> {
    try {
      // Excluir todos os usuários da empresa
      const usersRef = collection(this.firestore, 'companies', companyId, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      for (const userDoc of usersSnapshot.docs) {
        await deleteDoc(userDoc.ref);
      }

      // Excluir configurações da empresa
      const settingsRef = doc(this.firestore, 'companies', companyId, 'settings', 'general');
      const settingsDoc = await getDoc(settingsRef);
      if (settingsDoc.exists()) {
        await deleteDoc(settingsRef);
      }

      // Excluir todos os quadros da empresa (e seus dados relacionados)
      const boardsRef = collection(this.firestore, 'companies', companyId, 'boards');
      const boardsSnapshot = await getDocs(boardsRef);
      
      for (const boardDoc of boardsSnapshot.docs) {
        const boardId = boardDoc.id;
        
        // Excluir colunas do quadro
        const columnsRef = collection(this.firestore, 'companies', companyId, 'boards', boardId, 'columns');
        const columnsSnapshot = await getDocs(columnsRef);
        for (const colDoc of columnsSnapshot.docs) {
          await deleteDoc(colDoc.ref);
        }
        
        // Excluir leads do quadro
        const leadsRef = collection(this.firestore, 'companies', companyId, 'boards', boardId, 'leads');
        const leadsSnapshot = await getDocs(leadsRef);
        for (const leadDoc of leadsSnapshot.docs) {
          await deleteDoc(leadDoc.ref);
        }
        
        // Excluir o quadro
        await deleteDoc(boardDoc.ref);
      }

      // Finalmente, excluir a empresa
      const companyRef = doc(this.firestore, 'companies', companyId);
      await deleteDoc(companyRef);
      
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
      const docSnap = await getDoc(settingsRef);
      
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

  async seedGobuyerCompany(): Promise<void> {
    try {
      // Verificar se a empresa Gobuyer já existe
      const existingCompany = await this.getCompanyBySubdomain('gobuyer');
      if (existingCompany) {
        return;
      }

      // Criar empresa Gobuyer
      const gobuyerData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'> = {
        subdomain: 'gobuyer',
        name: 'Gobuyer Digital',
        contactEmail: 'contato@gobuyer.com.br',
        contactPhone: '+55 11 99999-9999',
        address: 'São Paulo, SP',
        cnpj: '12.345.678/0001-90',
        plan: 'professional',
        status: 'active',
        ownerId: 'system',
        ownerEmail: 'geovane.lopes@gobuyer.com.br',
        maxUsers: 50,
        maxBoards: 100,
        smtpConfig: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          user: '',
          password: '',
          fromName: 'Gobuyer Digital',
          fromEmail: 'contato@gobuyer.com.br'
        },
        apiConfig: {
          enabled: true,
          token: this.generateApiToken(),
          endpoint: 'https://gobuyer.taskboard.com.br/api/v1/lead-intake',
          webhookUrl: ''
        },
        features: this.getFeaturesByPlan('professional'),
        brandingConfig: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          logo: 'https://apps.gobuyer.com.br/sso/assets/images/logos/logo-gobuyer.png',
          favicon: '',
          customCSS: '',
          companyName: 'Gobuyer Digital'
        }
      };

      const companyId = await this.createCompany(gobuyerData);
      
    } catch (error) {
      // Error handled silently
    }
  }

  getCompanySubdomain(): string | null {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // Para desenvolvimento local
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Pode usar um parâmetro de query ou localStorage para simular
        return localStorage.getItem('dev-subdomain') || 'gobuyer';
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
      // Buscar em todas as empresas para encontrar onde este usuário está
      const companiesRef = collection(this.firestore, 'companies');
      const companiesSnapshot = await getDocs(companiesRef);
      
      for (const companyDoc of companiesSnapshot.docs) {
        const companyData = companyDoc.data() as Company;
        
        // Verificar se é o owner
        if (companyData.ownerEmail === userEmail) {
          return { id: companyDoc.id, ...companyData };
        }
        
        // Verificar se está na lista de usuários da empresa
        const usersRef = collection(this.firestore, 'companies', companyDoc.id, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        const userFound = usersSnapshot.docs.some(userDoc => 
          userDoc.data()['email'] === userEmail
        );
        
        if (userFound) {
          return { id: companyDoc.id, ...companyData };
        }
      }
      
      return null;
    } catch (error) {
      return null;
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
    return onSnapshot(companyRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Company);
      } else {
        callback(null);
      }
    });
  }
}