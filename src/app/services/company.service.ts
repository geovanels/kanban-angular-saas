import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  getDocs,
  orderBy,
  onSnapshot
} from '@angular/fire/firestore';
import { Company, CompanyUser, CompanySettings } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private firestore = inject(Firestore);

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
      console.error('Erro ao atualizar empresa:', error);
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
      return [];
    }
  }

  async removeUserFromCompany(companyId: string, userEmail: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'companies', companyId, 'users', userEmail);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Erro ao remover usuário da empresa:', error);
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
      console.error('Erro ao atualizar função do usuário:', error);
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
      console.error('Erro ao excluir empresa:', error);
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
      console.error('Erro ao criar configurações padrão:', error);
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
      console.error('Erro ao buscar configurações da empresa:', error);
      throw error;
    }
  }

  async updateCompanySettings(companyId: string, settings: Partial<CompanySettings>): Promise<void> {
    try {
      const settingsRef = doc(this.firestore, 'companies', companyId, 'settings', 'general');
      await updateDoc(settingsRef, settings);
    } catch (error) {
      console.error('Erro ao atualizar configurações da empresa:', error);
      throw error;
    }
  }

  // ===== SUBDOMAIN MANAGEMENT =====
  
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    try {
      const company = await this.getCompanyBySubdomain(subdomain);
      return company === null;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade do subdomínio:', error);
      return false;
    }
  }

  async seedGobuyerCompany(): Promise<void> {
    try {
      // Verificar se a empresa Gobuyer já existe
      const existingCompany = await this.getCompanyBySubdomain('gobuyer');
      if (existingCompany) {
        // Empresa Gobuyer já existe
        return;
      }

      // Criando empresa Gobuyer
      
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
      // Empresa Gobuyer criada com sucesso

      // Migrar dados existentes se houver
      await this.migrateBoardsFromUsers(companyId);
      
    } catch (error) {
      console.error('Erro ao criar empresa Gobuyer:', error);
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
      console.error('Erro ao buscar empresa do usuário:', error);
      return null;
    }
  }

  // ===== DEVELOPMENT SEED =====

  private async migrateExistingData(companyId: string): Promise<void> {
    try {
      // Migrando dados existentes para a empresa Gobuyer
      
      // 1. Adicionar usuários conhecidos do Firebase Auth (emails da Gobuyer)
      const gobuyerUsers = [
        { email: 'geovane.lopes@gobuyer.com.br', role: 'admin' as const },
        { email: 'admin@gobuyer.com.br', role: 'admin' as const },
        { email: 'contato@gobuyer.com.br', role: 'manager' as const },
        { email: 'suporte@gobuyer.com.br', role: 'user' as const }
      ];
      
      for (const user of gobuyerUsers) {
        await this.addUserToCompany(companyId, user.email, user.role);
      }
      
      // 2. Migrar quadros existentes da estrutura antiga para nova
      await this.migrateLegacyBoards(companyId);
      
      // Migração de dados concluída
      
    } catch (error) {
      console.error('Erro na migração de dados:', error);
    }
  }

  private async migrateLegacyBoards(companyId: string): Promise<void> {
    try {
      // Migrando quadros existentes para a empresa Gobuyer
      
      // Verificar se há quadros na nova estrutura
      const newBoardsRef = collection(this.firestore, 'companies', companyId, 'boards');
      const newBoardsSnapshot = await getDocs(newBoardsRef);
      
      if (newBoardsSnapshot.empty) {
        // Procurar quadros na estrutura antiga (users/{userId}/boards)
        const migrated = await this.migrateBoardsFromUsers(companyId);
        
        if (!migrated) {
          // Nenhum quadro encontrado, criando quadro padrão da Gobuyer
          await this.createDefaultBoard(companyId);
        }
      } else {
        // Quadros já existem na nova estrutura
        // Garantir que todos os quadros tenham companyId
        await this.updateBoardsWithCompanyId(companyId);
      }
      
    } catch (error) {
      console.error('Erro ao migrar quadros:', error);
    }
  }

  private async migrateBoardsFromUsers(companyId: string): Promise<boolean> {
    try {
      // Listar todos os usuários na coleção 'users' para encontrar quadros
      const usersRef = collection(this.firestore, 'users');
      const usersSnapshot = await getDocs(usersRef);
      let migratedAny = false;

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        
        // Verificar se há quadros para este usuário
        const oldBoardsRef = collection(this.firestore, 'users', userId, 'boards');
        const oldBoardsSnapshot = await getDocs(oldBoardsRef);
        
        if (!oldBoardsSnapshot.empty) {
          // Encontrados quadros do usuário para migração
          
          for (const boardDoc of oldBoardsSnapshot.docs) {
            const boardData = boardDoc.data();
            
            // Migrar quadro para a nova estrutura
            const newBoardRef = doc(collection(this.firestore, 'companies', companyId, 'boards'));
            await setDoc(newBoardRef, {
              ...boardData,
              companyId: companyId,
              migratedFrom: `users/${userId}/boards/${boardDoc.id}`,
              migratedAt: new Date()
            });
            
            // Quadro migrado com sucesso
            
            // Migrar colunas
            await this.migrateBoardColumns(userId, boardDoc.id, companyId, newBoardRef.id);
            
            // Migrar leads
            await this.migrateBoardLeads(userId, boardDoc.id, companyId, newBoardRef.id);
            
            migratedAny = true;
          }
        }
      }
      
      return migratedAny;
    } catch (error) {
      console.error('Erro ao migrar quadros de usuários:', error);
      return false;
    }
  }

  private async migrateBoardColumns(oldUserId: string, oldBoardId: string, companyId: string, newBoardId: string): Promise<void> {
    try {
      const oldColumnsRef = collection(this.firestore, 'users', oldUserId, 'boards', oldBoardId, 'columns');
      const oldColumnsSnapshot = await getDocs(oldColumnsRef);
      
      for (const columnDoc of oldColumnsSnapshot.docs) {
        const columnData = columnDoc.data();
        
        const newColumnRef = doc(collection(this.firestore, 'companies', companyId, 'boards', newBoardId, 'columns'));
        await setDoc(newColumnRef, {
          ...columnData,
          companyId: companyId,
          migratedFrom: `users/${oldUserId}/boards/${oldBoardId}/columns/${columnDoc.id}`
        });
      }
      
      // Colunas migradas para o quadro
    } catch (error) {
      console.error('Erro ao migrar colunas:', error);
    }
  }

  private async migrateBoardLeads(oldUserId: string, oldBoardId: string, companyId: string, newBoardId: string): Promise<void> {
    try {
      const oldLeadsRef = collection(this.firestore, 'users', oldUserId, 'boards', oldBoardId, 'leads');
      const oldLeadsSnapshot = await getDocs(oldLeadsRef);
      
      for (const leadDoc of oldLeadsSnapshot.docs) {
        const leadData = leadDoc.data();
        
        const newLeadRef = doc(collection(this.firestore, 'companies', companyId, 'boards', newBoardId, 'leads'));
        await setDoc(newLeadRef, {
          ...leadData,
          companyId: companyId,
          migratedFrom: `users/${oldUserId}/boards/${oldBoardId}/leads/${leadDoc.id}`
        });
      }
      
      // Leads migrados para o quadro
    } catch (error) {
      console.error('Erro ao migrar leads:', error);
    }
  }

  private async createDefaultBoard(companyId: string): Promise<void> {
    const boardData = {
      name: 'Leads Gobuyer',
      description: 'Quadro principal para gerenciamento de leads da Gobuyer Digital',
      companyId: companyId,
      createdAt: null // será preenchido pelo serverTimestamp
    };

    const boardRef = doc(collection(this.firestore, 'companies', companyId, 'boards'));
    await setDoc(boardRef, boardData);
    
    // Criar colunas padrão
    const defaultColumns = [
      { name: 'Novo Lead', order: 0, color: '#4A90E2', endStageType: 'none' },
      { name: 'Em Contato', order: 1, color: '#F5A623', endStageType: 'none' },
      { name: 'Proposta Enviada', order: 2, color: '#7ED321', endStageType: 'none' },
      { name: 'Fechado', order: 3, color: '#50E3C2', endStageType: 'won' },
      { name: 'Perdido', order: 4, color: '#D0021B', endStageType: 'lost' }
    ];

    for (const columnData of defaultColumns) {
      const colRef = doc(collection(this.firestore, 'companies', companyId, 'boards', boardRef.id, 'columns'));
      await setDoc(colRef, { ...columnData, companyId });
    }
    
    // Quadro padrão criado com sucesso
  }

  private async updateBoardsWithCompanyId(companyId: string): Promise<void> {
    try {
      const boardsRef = collection(this.firestore, 'companies', companyId, 'boards');
      const boardsSnapshot = await getDocs(boardsRef);
      
      for (const boardDoc of boardsSnapshot.docs) {
        const boardData = boardDoc.data();
        
        if (!boardData['companyId']) {
          await updateDoc(boardDoc.ref, { companyId });
          // CompanyId adicionado ao quadro
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar quadros com companyId:', error);
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