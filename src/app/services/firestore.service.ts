import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, setDoc, 
         updateDoc, deleteDoc, query, where, onSnapshot, serverTimestamp,
         writeBatch, orderBy, collectionGroup } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CompanyService } from './company.service';
import { Company } from '../models/company.model';
import { AuthService } from './auth.service';

export interface Board {
  id?: string;
  name: string;
  description?: string;
  createdAt: any;
  userId?: string;
  owner?: string;
  ownerEmail?: string;
  status?: 'active' | 'archived';
  // Multi-empresa
  companyId: string;
}

export interface Column {
  id?: string;
  name: string;
  order: number;
  color: string;
  endStageType?: 'success' | 'failure' | 'none';
  boardId: string;
  slaDays?: number;
  createdAt?: any;
  updatedAt?: any;
  // Multi-empresa
  companyId: string;
}

export interface Lead {
  id?: string;
  fields: {
    companyName?: string;
    cnpj?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    [key: string]: any;
  };
  columnId: string;
  createdAt: any;
  movedToCurrentColumnAt: any;
  responsibleUserId?: string;
  responsibleUserName?: string;
  responsibleUserEmail?: string;
  phaseHistory?: { [key: string]: any };
  executedAutomations?: { [key: string]: any };
  // Multi-empresa
  companyId: string;
  boardId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  
  // Current company context
  private currentCompanyId: string | null = null;
  private currentCompany: Company | null = null;

  // COMPANY CONTEXT METHODS
  async initializeCompanyContext(): Promise<Company | null> {
    try {
      const subdomain = this.companyService.getCompanySubdomain();
      if (!subdomain) {
        return null;
      }

      this.currentCompany = await this.companyService.getCompanyBySubdomain(subdomain);
      if (!this.currentCompany) {
        return null;
      }

      this.currentCompanyId = this.currentCompany.id!;
      return this.currentCompany;
    } catch (error) {
      return null;
    }
  }

  getCurrentCompany(): Company | null {
    return this.currentCompany;
  }

  getCurrentCompanyId(): string | null {
    return this.currentCompanyId;
  }

  setCompanyContext(company: Company) {
    this.currentCompany = company;
    this.currentCompanyId = company.id!;
  }

  // BOARDS (Updated for multi-company)
  async getBoards(userId: string) {
    try {
      // Verificar se há contexto de empresa
      let companyId = this.currentCompanyId;
      
      if (!companyId) {
        try {
          await this.initializeCompanyContext();
          companyId = this.currentCompanyId;
        } catch (error) {
          return [];
        }
      }
      
      if (!companyId) {
        return [];
      }

      try {
        // Buscar boards da empresa atual
        const boardsRef = collection(this.firestore, 'companies', companyId, 'boards');
        const querySnapshot = await getDocs(boardsRef);
        let allBoards = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          companyId: companyId 
        } as Board));
        
        // Se não encontrou boards na nova estrutura, buscar na estrutura antiga
        if (allBoards.length === 0) {
          try {
            const oldBoardsRef = collection(this.firestore, 'users', userId, 'boards');
            const oldSnapshot = await getDocs(oldBoardsRef);
            const oldBoards = oldSnapshot.docs.map(doc => ({ 
              id: doc.id, 
              ...doc.data(),
              companyId: companyId 
            } as Board));
            
            allBoards = oldBoards;
          } catch (oldError) {
            // Ignore old structure errors
          }
        }
        
        // Filtrar apenas quadros ativos
        allBoards = allBoards.filter(board => (board.status || 'active') === 'active');
        
        return allBoards;
        
      } catch (firestoreError) {
        return [];
      }
      
    } catch (error) {
      return [];
    }
  }


  async createBoard(userId: string, board: Omit<Board, 'id' | 'userId'>) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const boardsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards');
      const newBoard = {
        ...board,
        companyId: this.currentCompanyId,
        owner: userId,
        ownerEmail: '', // será preenchido pelo componente
        status: 'active' as const,
        createdAt: serverTimestamp()
      };
      return await addDoc(boardsRef, newBoard);
    } catch (error) {
      console.error('Erro ao criar quadro:', error);
      throw error;
    }
  }

  async updateBoard(userId: string, boardId: string, updates: Partial<Board>) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const boardRef = doc(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId);
      return await updateDoc(boardRef, updates);
    } catch (error) {
      console.error('Erro ao atualizar quadro:', error);
      throw error;
    }
  }

  async deleteBoard(userId: string, boardId: string) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const boardRef = doc(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId);
      return await deleteDoc(boardRef);
    } catch (error) {
      console.error('Erro ao excluir quadro:', error);
      throw error;
    }
  }

  // COLUMNS (Updated for multi-company)
  async getColumns(userId: string, boardId: string) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        console.error('Contexto da empresa não inicializado');
        return [];
      }

      const columnsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'columns');
      const q = query(columnsRef, orderBy('order'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        companyId: this.currentCompanyId,
        boardId: boardId
      } as Column));
    } catch (error) {
      console.error('Erro ao buscar colunas:', error);
      return [];
    }
  }

  async createColumn(userId: string, boardId: string, column: Omit<Column, 'id' | 'boardId'>) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const columnsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'columns');
      const newColumn = {
        ...column,
        companyId: this.currentCompanyId,
        boardId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      return await addDoc(columnsRef, newColumn);
    } catch (error) {
      console.error('Erro ao criar coluna:', error);
      throw error;
    }
  }

  async updateColumn(userId: string, boardId: string, columnId: string, updates: Partial<Column>) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const columnRef = doc(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'columns', columnId);
      return await updateDoc(columnRef, updates);
    } catch (error) {
      console.error('Erro ao atualizar coluna:', error);
      throw error;
    }
  }

  async deleteColumn(userId: string, boardId: string, columnId: string) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const columnRef = doc(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'columns', columnId);
      return await deleteDoc(columnRef);
    } catch (error) {
      console.error('Erro ao excluir coluna:', error);
      throw error;
    }
  }

  // LEADS (Updated for multi-company)
  async getLeads(userId: string, boardId: string) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        console.error('Contexto da empresa não inicializado');
        return [];
      }

      const leadsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads');
      const snapshot = await getDocs(leadsRef);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        companyId: this.currentCompanyId,
        boardId: boardId
      } as Lead));
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      return [];
    }
  }

  async createLead(userId: string, boardId: string, lead: Omit<Lead, 'id'>) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const leadsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads');
      const newLead = {
        ...lead,
        companyId: this.currentCompanyId,
        boardId: boardId,
        createdAt: serverTimestamp(),
        movedToCurrentColumnAt: serverTimestamp()
      };
      return await addDoc(leadsRef, newLead);
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  }

  async updateLead(userId: string, boardId: string, leadId: string, updates: Partial<Lead>) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const leadRef = doc(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads', leadId);
      return await updateDoc(leadRef, updates);
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      throw error;
    }
  }

  async deleteLead(userId: string, boardId: string, leadId: string) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const leadRef = doc(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads', leadId);
      return await deleteDoc(leadRef);
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      throw error;
    }
  }

  async moveLead(userId: string, boardId: string, leadId: string, newColumnId: string) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const leadRef = doc(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads', leadId);
      const updates = {
        columnId: newColumnId,
        movedToCurrentColumnAt: serverTimestamp()
      };
      return await updateDoc(leadRef, updates);
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      throw error;
    }
  }

  // REAL-TIME SUBSCRIPTIONS (Updated for multi-company)
  subscribeToBoards(userId: string, callback: (boards: Board[]) => void) {
    if (!this.currentCompanyId) {
      this.initializeCompanyContext().then(() => {
        if (this.currentCompanyId) {
          this.performBoardsSubscription(callback);
        }
      });
      return () => {};
    }
    
    return this.performBoardsSubscription(callback);
  }

  private performBoardsSubscription(callback: (boards: Board[]) => void) {
    if (!this.currentCompanyId) {
      callback([]);
      return () => {};
    }

    const boardsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards');
    return onSnapshot(boardsRef, snapshot => {
      const boards = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        companyId: this.currentCompanyId
      } as Board)).filter(board => (board.status || 'active') === 'active');
      callback(boards);
    });
  }

  subscribeToColumns(userId: string, boardId: string, callback: (columns: Column[]) => void) {
    if (!this.currentCompanyId) {
      this.initializeCompanyContext().then(() => {
        if (this.currentCompanyId) {
          this.performColumnsSubscription(boardId, callback);
        }
      });
      return () => {};
    }
    
    return this.performColumnsSubscription(boardId, callback);
  }

  private performColumnsSubscription(boardId: string, callback: (columns: Column[]) => void) {
    if (!this.currentCompanyId) {
      callback([]);
      return () => {};
    }

    const columnsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'columns');
    const q = query(columnsRef, orderBy('order'));
    return onSnapshot(q, snapshot => {
      const columns = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        companyId: this.currentCompanyId,
        boardId: boardId
      } as Column));
      callback(columns);
    });
  }

  subscribeToLeads(userId: string, boardId: string, callback: (leads: Lead[]) => void) {
    if (!this.currentCompanyId) {
      this.initializeCompanyContext().then(() => {
        if (this.currentCompanyId) {
          this.performLeadsSubscription(boardId, callback);
        }
      });
      return () => {};
    }
    
    return this.performLeadsSubscription(boardId, callback);
  }

  private performLeadsSubscription(boardId: string, callback: (leads: Lead[]) => void) {
    if (!this.currentCompanyId) {
      callback([]);
      return () => {};
    }

    const leadsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads');
    return onSnapshot(leadsRef, snapshot => {
      const leads = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        companyId: this.currentCompanyId,
        boardId: boardId
      } as Lead));
      callback(leads);
    });
  }

  // BULK OPERATIONS (Updated for multi-company)
  async updateMultipleLeads(userId: string, boardId: string, updates: { leadId: string, data: Partial<Lead> }[]) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const batch = writeBatch(this.firestore);
      
      updates.forEach(update => {
        const leadRef = doc(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'leads', update.leadId);
        batch.update(leadRef, update.data);
      });

      return await batch.commit();
    } catch (error) {
      console.error('Erro ao atualizar múltiplos leads:', error);
      throw error;
    }
  }

  // HISTORY (Updated for multi-company)
  async addLeadHistory(userId: string, boardId: string, leadId: string, historyEntry: any) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const historyRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads', leadId, 'history');
      const entry = {
        ...historyEntry,
        timestamp: serverTimestamp()
      };
      return await addDoc(historyRef, entry);
    } catch (error) {
      console.error('Erro ao adicionar histórico do lead:', error);
      throw error;
    }
  }

  async getLeadHistory(userId: string, boardId: string, leadId: string) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        console.error('Contexto da empresa não inicializado');
        return [];
      }

      const historyRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads', leadId, 'history');
      const q = query(historyRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar histórico do lead:', error);
      return [];
    }
  }

  // PHASE FORM CONFIGURATIONS
  async createPhaseFormConfig(userId: string, boardId: string, formConfig: any) {
    const formConfigsRef = collection(this.firestore, `users/${userId}/boards/${boardId}/phaseFormConfigs`);
    const newConfig = {
      ...formConfig,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(formConfigsRef, newConfig);
  }

  async updatePhaseFormConfig(userId: string, boardId: string, configId: string, updates: any) {
    const configRef = doc(this.firestore, `users/${userId}/boards/${boardId}/phaseFormConfigs/${configId}`);
    const updatedConfig = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    return await updateDoc(configRef, updatedConfig);
  }

  async getPhaseFormConfig(userId: string, boardId: string, columnId: string) {
    const formConfigsRef = collection(this.firestore, `users/${userId}/boards/${boardId}/phaseFormConfigs`);
    const q = query(formConfigsRef, where('columnId', '==', columnId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  }

  async deletePhaseFormConfig(userId: string, boardId: string, configId: string) {
    const configRef = doc(this.firestore, `users/${userId}/boards/${boardId}/phaseFormConfigs/${configId}`);
    return await deleteDoc(configRef);
  }

  // EMAIL OUTBOX MANAGEMENT (usando coleção 'mail' como no sistema original)
  async getOutboxEmails(userId: string, boardId: string) {
    const emailsRef = collection(this.firestore, `users/${userId}/boards/${boardId}/mail`);
    const q = query(emailsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    // Filtrar apenas emails que têm 'to' (como no sistema original)
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((item: any) => item.to);
  }

  async createOutboxEmail(userId: string, boardId: string, emailData: any) {
    const emailsRef = collection(this.firestore, `users/${userId}/boards/${boardId}/mail`);
    const newEmail = {
      ...emailData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(emailsRef, newEmail);
  }

  async updateOutboxEmail(userId: string, boardId: string, emailId: string, updates: any) {
    const emailRef = doc(this.firestore, `users/${userId}/boards/${boardId}/mail/${emailId}`);
    const updatedEmail = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    return await updateDoc(emailRef, updatedEmail);
  }

  async deleteOutboxEmail(userId: string, boardId: string, emailId: string) {
    const emailRef = doc(this.firestore, `users/${userId}/boards/${boardId}/mail/${emailId}`);
    return await deleteDoc(emailRef);
  }

  subscribeToOutboxEmails(userId: string, boardId: string, callback: (emails: any[]) => void) {
    const emailsRef = collection(this.firestore, `users/${userId}/boards/${boardId}/mail`);
    const q = query(emailsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, snapshot => {
      const emails = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((item: any) => item.to); // Filtrar apenas emails que têm 'to'
      callback(emails);
    });
  }

  // EMAIL TEMPLATES MANAGEMENT
  async getEmailTemplates(userId: string, boardId: string) {
    try {
      const templatesPath = userId ? `users/${userId}/boards/${boardId}/emailTemplates` : `boards/${boardId}/emailTemplates`;
      console.log('Buscando templates em:', templatesPath);
      
      const templatesRef = collection(this.firestore, templatesPath);
      
      // Tentar primeiro sem orderBy para evitar problemas de índice
      const snapshot = await getDocs(templatesRef);
      const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      console.log(`Templates encontrados: ${templates.length} itens`);
      return templates;
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      return [];
    }
  }

  async createEmailTemplate(userId: string, boardId: string, templateData: any) {
    const templatesRef = collection(this.firestore, `users/${userId}/boards/${boardId}/emailTemplates`);
    const newTemplate = {
      ...templateData,
      boardId: boardId, // Adicionar boardId para o filtro do collectionGroup
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    console.log('Criando template em:', `users/${userId}/boards/${boardId}/emailTemplates`, newTemplate);
    return await addDoc(templatesRef, newTemplate);
  }

  async updateEmailTemplate(userId: string, boardId: string, templateId: string, updates: any) {
    const templateRef = doc(this.firestore, `users/${userId}/boards/${boardId}/emailTemplates/${templateId}`);
    const updatedTemplate = {
      ...updates,
      boardId: boardId, // Garantir que o boardId esteja sempre presente
      updatedAt: serverTimestamp()
    };
    console.log('Atualizando template em:', `users/${userId}/boards/${boardId}/emailTemplates/${templateId}`, updatedTemplate);
    return await updateDoc(templateRef, updatedTemplate);
  }

  async deleteEmailTemplate(userId: string, boardId: string, templateId: string) {
    const templateRef = doc(this.firestore, `users/${userId}/boards/${boardId}/emailTemplates/${templateId}`);
    return await deleteDoc(templateRef);
  }

  subscribeToEmailTemplates(userId: string, boardId: string, callback: (templates: any[]) => void) {
    console.log(`Iniciando subscrição de templates para boardId: ${boardId}`);
    
    // Tentar primeiro com collectionGroup
    const templatesGroup = collectionGroup(this.firestore, 'emailTemplates');
    const q = query(templatesGroup, where('boardId', '==', boardId));
    
    return onSnapshot(q, 
      snapshot => {
        const templates = snapshot.docs.map(doc => ({ id: doc.id, path: doc.ref.path, ...doc.data() }));
        console.log(`Templates encontrados via collectionGroup para boardId: ${boardId}:`, templates);
        callback(templates);
      },
      error => {
        console.error('Erro ao subscrever templates via collectionGroup, tentando estrutura users:', error);
        
        // Fallback para estrutura users
        const templatesRef = collection(this.firestore, `users/${userId}/boards/${boardId}/emailTemplates`);
        const fallbackQuery = query(templatesRef);
        
        return onSnapshot(fallbackQuery, 
          snapshot => {
            const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(`Templates encontrados (fallback users) para userId: ${userId}, boardId: ${boardId}:`, templates);
            callback(templates);
          },
          fallbackError => {
            console.error('Erro ao subscrever templates (fallback users):', fallbackError);
            callback([]);
          }
        );
      }
    );
  }

  // AUTOMATIONS MANAGEMENT
  async getAutomations(userId: string, boardId: string) {
    try {
      console.log('Buscando automações para userId:', userId, 'boardId:', boardId);
      
      // Tentar primeiro a estrutura users/{userId}/boards/{boardId}/automations
      try {
        const automationsPath = `users/${userId}/boards/${boardId}/automations`;
        console.log('Tentando caminho:', automationsPath);
        
        const automationsRef = collection(this.firestore, automationsPath);
        const snapshot = await getDocs(automationsRef);
        const automations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (automations.length > 0) {
          console.log(`Automações encontradas em users/{userId}/boards/{boardId}/automations: ${automations.length} itens`);
          return automations;
        }
      } catch (error) {
        console.log('Erro ao buscar em users/{userId}/boards/{boardId}/automations:', error);
      }

      // Se não encontrou, tentar a estrutura boards/{boardId}/automations
      try {
        const alternativePath = `boards/${boardId}/automations`;
        console.log('Tentando caminho alternativo:', alternativePath);
        
        const automationsRef = collection(this.firestore, alternativePath);
        const snapshot = await getDocs(automationsRef);
        const automations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (automations.length > 0) {
          console.log(`Automações encontradas em boards/{boardId}/automations: ${automations.length} itens`);
          return automations;
        }
      } catch (error) {
        console.log('Erro ao buscar em boards/{boardId}/automations:', error);
      }

      // Se não encontrou em nenhum lugar, usar collectionGroup
      try {
        console.log('Tentando buscar usando collectionGroup');
        const automationsGroup = collectionGroup(this.firestore, 'automations');
        const snapshot = await getDocs(automationsGroup);
        const allAutomations = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          path: doc.ref.path,
          ...doc.data() 
        }));
        
        // Filtrar apenas as automações do board correto
        const filteredAutomations = allAutomations.filter(automation => {
          const pathParts = automation.path.split('/');
          return pathParts.includes(boardId);
        });
        
        console.log(`Automações encontradas via collectionGroup: ${filteredAutomations.length} itens`);
        return filteredAutomations;
      } catch (error) {
        console.log('Erro ao buscar via collectionGroup:', error);
      }

      console.log('Nenhuma automação encontrada');
      return [];
    } catch (error) {
      console.error('Erro geral ao buscar automações:', error);
      return [];
    }
  }

  async createAutomation(userId: string, boardId: string, automationData: any) {
    const automationsRef = collection(this.firestore, `users/${userId}/boards/${boardId}/automations`);
    const newAutomation = {
      ...automationData,
      boardId: boardId, // Adicionar boardId para o filtro do collectionGroup
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: true
    };
    console.log('Criando automação em:', `users/${userId}/boards/${boardId}/automations`, newAutomation);
    return await addDoc(automationsRef, newAutomation);
  }

  async updateAutomation(userId: string, boardId: string, automationId: string, updates: any) {
    const automationRef = doc(this.firestore, `users/${userId}/boards/${boardId}/automations/${automationId}`);
    const updatedAutomation = {
      ...updates,
      boardId: boardId, // Garantir que o boardId esteja sempre presente
      updatedAt: serverTimestamp()
    };
    console.log('Atualizando automação em:', `users/${userId}/boards/${boardId}/automations/${automationId}`, updatedAutomation);
    return await updateDoc(automationRef, updatedAutomation);
  }


  async deleteAutomation(userId: string, boardId: string, automationId: string) {
    const automationRef = doc(this.firestore, `users/${userId}/boards/${boardId}/automations/${automationId}`);
    console.log('Excluindo automação:', `users/${userId}/boards/${boardId}/automations/${automationId}`);
    return await deleteDoc(automationRef);
  }

  // AUTOMATION HISTORY MANAGEMENT
  subscribeToAutomationHistory(userId: string, boardId: string, automationId: string, callback: (historyItems: any[]) => void) {
    console.log('Subscribing to automation history for:', { userId, boardId, automationId });
    
    const historyRef = collection(this.firestore, `users/${userId}/boards/${boardId}/automationHistory`);
    const q = query(historyRef, where("automationId", "==", automationId));
    
    return onSnapshot(q, 
      snapshot => {
        const historyItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Histórico de automação encontrado: ${historyItems.length} itens`);
        callback(historyItems);
      },
      error => {
        console.error('Erro ao buscar histórico de automação:', error);
        // Tentar estrutura alternativa
        const altHistoryRef = collection(this.firestore, `boards/${boardId}/automationHistory`);
        const altQuery = query(altHistoryRef, where("automationId", "==", automationId));
        
        return onSnapshot(altQuery,
          snapshot => {
            const historyItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(`Histórico de automação (estrutura alternativa): ${historyItems.length} itens`);
            callback(historyItems);
          },
          altError => {
            console.error('Erro ao buscar histórico de automação (estrutura alternativa):', altError);
            callback([]);
          }
        );
      }
    );
  }

  async addAutomationHistoryItem(userId: string, boardId: string, historyItem: any) {
    try {
      const historyRef = collection(this.firestore, `users/${userId}/boards/${boardId}/automationHistory`);
      const docRef = await addDoc(historyRef, {
        ...historyItem,
        timestamp: new Date(),
        createdAt: new Date()
      });
      console.log('Item de histórico de automação adicionado:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar item de histórico de automação:', error);
      throw error;
    }
  }

  subscribeToAutomations(userId: string, boardId: string, callback: (automations: any[]) => void) {
    console.log(`=== SUBSCRIBETOAUTOMATIONS ===`);
    console.log(`userId: ${userId}, boardId: ${boardId}`);
    
    // Estratégia 1: users/{userId}/boards/{boardId}/automations
    const primaryPath = `users/${userId}/boards/${boardId}/automations`;
    console.log('Tentando subscrição no caminho primário:', primaryPath);
    
    const automationsRef = collection(this.firestore, primaryPath);
    
    const unsubscribe = onSnapshot(automationsRef, 
      snapshot => {
        const automations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Automações encontradas via subscrição (${primaryPath}):`, automations);
        
        if (automations.length > 0) {
          callback(automations);
        } else {
          // Se não encontrou no caminho primário, tentar caminho alternativo
          console.log('Nenhuma automação encontrada no caminho primário, tentando alternativo...');
          this.tryAlternativeAutomationPaths(userId, boardId, callback);
        }
      },
      error => {
        console.error('Erro na subscrição primária:', error);
        console.log('Tentando caminho alternativo devido ao erro...');
        this.tryAlternativeAutomationPaths(userId, boardId, callback);
      }
    );
    
    return unsubscribe;
  }

  private tryAlternativeAutomationPaths(userId: string, boardId: string, callback: (automations: any[]) => void) {
    // Estratégia 2: boards/{boardId}/automations
    const alternativePath = `boards/${boardId}/automations`;
    console.log('Tentando caminho alternativo:', alternativePath);
    
    const alternativeRef = collection(this.firestore, alternativePath);
    
    return onSnapshot(alternativeRef,
      snapshot => {
        const automations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Automações encontradas via caminho alternativo (${alternativePath}):`, automations);
        
        if (automations.length > 0) {
          callback(automations);
        } else {
          // Estratégia 3: collectionGroup
          console.log('Tentando collectionGroup...');
          this.tryCollectionGroupAutomations(boardId, callback);
        }
      },
      error => {
        console.error('Erro no caminho alternativo:', error);
        console.log('Tentando collectionGroup devido ao erro...');
        this.tryCollectionGroupAutomations(boardId, callback);
      }
    );
  }

  private tryCollectionGroupAutomations(boardId: string, callback: (automations: any[]) => void) {
    const automationsGroup = collectionGroup(this.firestore, 'automations');
    
    return onSnapshot(automationsGroup,
      snapshot => {
        const allAutomations = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          path: doc.ref.path,
          ...doc.data() 
        }));
        
        // Filtrar apenas as automações do board correto
        const filteredAutomations = allAutomations.filter(automation => {
          const pathParts = automation.path.split('/');
          return pathParts.includes(boardId);
        });
        
        console.log(`Automações encontradas via collectionGroup: ${filteredAutomations.length} itens`);
        callback(filteredAutomations);
      },
      error => {
        console.error('Erro no collectionGroup:', error);
        callback([]);
      }
    );
  }


}