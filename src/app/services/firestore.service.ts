import { Injectable, inject, Injector } from '@angular/core';
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
  isInitialPhase?: boolean;
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
  private authService = inject(AuthService);
  private injector = inject(Injector);
  
  private get companyService() {
    return this.injector.get(CompanyService);
  }
  
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
        throw new Error('Contexto da empresa não inicializado');
      }

      console.log('🗑️ Iniciando exclusão completa do quadro:', boardId);
      
      // 1. Excluir todas as subcoleções primeiro
      await this.deleteBoardSubcollections(boardId);
      
      // 2. Por último, excluir o documento principal do board
      const boardRef = doc(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId);
      await deleteDoc(boardRef);
      
      console.log('✅ Quadro excluído completamente:', boardId);
    } catch (error) {
      console.error('❌ Erro ao excluir quadro:', error);
      throw error;
    }
  }

  private async deleteBoardSubcollections(boardId: string): Promise<void> {
    if (!this.currentCompanyId) return;

    const basePath = `companies/${this.currentCompanyId}/boards/${boardId}`;
    console.log('🔄 Excluindo subcoleções do quadro:', basePath);

    try {
      // Excluir em lotes para melhor performance
      const subcollections = [
        'leads',
        'columns', 
        'emailTemplates',
        'automations',
        'phaseFormConfigs',
        'outboxEmails',
        'mail',
        'automationHistory'
      ];

      for (const subcollection of subcollections) {
        await this.deleteCollection(`${basePath}/${subcollection}`);
      }
      
      console.log('✅ Subcoleções excluídas com sucesso');
    } catch (error) {
      console.error('❌ Erro ao excluir subcoleções:', error);
      throw error;
    }
  }

  private async deleteCollection(collectionPath: string): Promise<void> {
    try {
      const collectionRef = collection(this.firestore, collectionPath);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`📭 Coleção ${collectionPath} já está vazia`);
        return;
      }

      console.log(`🗑️ Excluindo ${snapshot.docs.length} documentos de ${collectionPath}`);
      
      // Excluir em lotes de 500 documentos (limite do Firestore)
      const batchSize = 500;
      const batches: Promise<void>[] = [];
      
      for (let i = 0; i < snapshot.docs.length; i += batchSize) {
        const batchDocs = snapshot.docs.slice(i, i + batchSize);
        const batch = writeBatch(this.firestore);
        
        batchDocs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        batches.push(batch.commit());
      }
      
      await Promise.all(batches);
      console.log(`✅ ${snapshot.docs.length} documentos excluídos de ${collectionPath}`);
      
    } catch (error) {
      console.warn(`⚠️ Erro ao excluir coleção ${collectionPath}:`, error);
      // Não propagar o erro para não interromper a exclusão de outras coleções
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

  async clearOutboxEmails(userId: string, boardId: string): Promise<void> {
    try {
      const outboxRef = collection(this.firestore, `users/${userId}/boards/${boardId}/mail`);
      const querySnapshot = await getDocs(outboxRef);
      
      const deletePromises = querySnapshot.docs.map(docSnapshot => 
        deleteDoc(docSnapshot.ref)
      );
      
      await Promise.all(deletePromises);
      console.log(`✅ Excluídos ${deletePromises.length} emails da caixa de saída`);
    } catch (error) {
      console.error('❌ Erro ao limpar caixa de saída:', error);
      throw error;
    }
  }

  // EMAIL TEMPLATES MANAGEMENT
  async getEmailTemplates(userId: string, boardId: string) {
    try {
      // Usar estrutura multi-empresa se há contexto de empresa
      if (this.currentCompanyId) {
        const templatesPath = `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates`;
        console.log('Buscando templates em (multi-empresa):', templatesPath);
        
        const templatesRef = collection(this.firestore, templatesPath);
        const snapshot = await getDocs(templatesRef);
        const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        console.log(`Templates encontrados (multi-empresa): ${templates.length} itens`);
        return templates;
      }
      
      // Fallback para estrutura antiga
      const templatesPath = userId ? `users/${userId}/boards/${boardId}/emailTemplates` : `boards/${boardId}/emailTemplates`;
      console.log('Buscando templates em (estrutura antiga):', templatesPath);
      
      const templatesRef = collection(this.firestore, templatesPath);
      const snapshot = await getDocs(templatesRef);
      const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      console.log(`Templates encontrados (estrutura antiga): ${templates.length} itens`);
      return templates;
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      return [];
    }
  }

  async createEmailTemplate(userId: string, boardId: string, templateData: any) {
    // Usar estrutura multi-empresa se há contexto de empresa
    const templatesPath = this.currentCompanyId 
      ? `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates`
      : `users/${userId}/boards/${boardId}/emailTemplates`;
    
    const templatesRef = collection(this.firestore, templatesPath);
    const newTemplate = {
      ...templateData,
      boardId: boardId, // Adicionar boardId para o filtro do collectionGroup
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    console.log('Criando template em:', templatesPath, newTemplate);
    return await addDoc(templatesRef, newTemplate);
  }

  async updateEmailTemplate(userId: string, boardId: string, templateId: string, updates: any) {
    // Usar estrutura multi-empresa se há contexto de empresa
    const templatePath = this.currentCompanyId 
      ? `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates/${templateId}`
      : `users/${userId}/boards/${boardId}/emailTemplates/${templateId}`;
    
    const templateRef = doc(this.firestore, templatePath);
    const updatedTemplate = {
      ...updates,
      boardId: boardId, // Garantir que o boardId esteja sempre presente
      updatedAt: serverTimestamp()
    };
    console.log('Atualizando template em:', templatePath, updatedTemplate);
    return await updateDoc(templateRef, updatedTemplate);
  }

  async deleteEmailTemplate(userId: string, boardId: string, templateId: string) {
    // Usar estrutura multi-empresa se há contexto de empresa
    const templatePath = this.currentCompanyId 
      ? `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates/${templateId}`
      : `users/${userId}/boards/${boardId}/emailTemplates/${templateId}`;
    
    const templateRef = doc(this.firestore, templatePath);
    return await deleteDoc(templateRef);
  }

  subscribeToEmailTemplates(userId: string, boardId: string, callback: (templates: any[]) => void) {
    console.log(`Iniciando subscrição de templates para boardId: ${boardId}`);
    
    if (!this.currentCompanyId) {
      console.warn('Contexto da empresa não definido, retornando array vazio');
      callback([]);
      return () => {}; // Retorna função de limpeza vazia
    }
    
    // Usar apenas estrutura multi-empresa
    const templatesPath = `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates`;
    console.log('Subscribing templates em:', templatesPath);
    
    const templatesRef = collection(this.firestore, templatesPath);
    
    return onSnapshot(templatesRef, 
      snapshot => {
        const templates = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          path: doc.ref.path, 
          ...doc.data() 
        }));
        console.log(`Templates encontrados (multi-empresa) para boardId: ${boardId}:`, templates.length);
        callback(templates);
      },
      error => {
        console.error('Erro ao subscrever templates (multi-empresa):', error);
        callback([]);
      }
    );
  }

  // AUTOMATIONS MANAGEMENT
  async getAutomations(userId: string, boardId: string) {
    try {
      console.log('Buscando automações para boardId:', boardId);
      
      // Usar estrutura multi-empresa se há contexto de empresa
      if (this.currentCompanyId) {
        const automationsPath = `companies/${this.currentCompanyId}/boards/${boardId}/automations`;
        console.log('Buscando automações em (multi-empresa):', automationsPath);
        
        const automationsRef = collection(this.firestore, automationsPath);
        const snapshot = await getDocs(automationsRef);
        const automations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        console.log(`Automações encontradas (multi-empresa): ${automations.length} itens`);
        return automations;
      }
      
      // Fallback para estrutura antiga se não há contexto de empresa
      console.log('Contexto de empresa não definido, usando estrutura antiga');
      const automationsPath = `users/${userId}/boards/${boardId}/automations`;
      console.log('Buscando automações em (estrutura antiga):', automationsPath);
      
      const automationsRef = collection(this.firestore, automationsPath);
      const snapshot = await getDocs(automationsRef);
      const automations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      console.log(`Automações encontradas (estrutura antiga): ${automations.length} itens`);
      return automations;
    } catch (error) {
      console.error('Erro ao buscar automações:', error);
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
    console.log(`Iniciando subscrição de automações para boardId: ${boardId}`);
    
    if (!this.currentCompanyId) {
      console.warn('Contexto da empresa não definido, retornando array vazio');
      callback([]);
      return () => {}; // Retorna função de limpeza vazia
    }
    
    // Usar apenas estrutura multi-empresa
    const automationsPath = `companies/${this.currentCompanyId}/boards/${boardId}/automations`;
    console.log('Subscribing automações em:', automationsPath);
    
    const automationsRef = collection(this.firestore, automationsPath);
    
    return onSnapshot(automationsRef, 
      snapshot => {
        const automations = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          path: doc.ref.path, 
          ...doc.data() 
        }));
        console.log(`Automações encontradas (multi-empresa) para boardId: ${boardId}:`, automations.length);
        callback(automations);
      },
      error => {
        console.error('Erro ao subscrever automações (multi-empresa):', error);
        callback([]);
      }
    );
  }

  // 🧹 MÉTODO TEMPORÁRIO PARA LIMPEZA DE QUADROS (PRESERVA USUÁRIOS/EMPRESAS/SMTP)
  async clearAllData(currentUserId: string): Promise<void> {
    try {
      const batch = writeBatch(this.firestore);
      let operationCount = 0;
      
      // Limpar apenas a empresa atual (respeitando permissões)
      if (this.currentCompanyId) {
        // Listar todos os boards da empresa atual
        const boardsRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards`);
        const boardsSnapshot = await getDocs(boardsRef);
        
        for (const boardDoc of boardsSnapshot.docs) {
          const boardId = boardDoc.id;
          
          // Subcoleções para limpar (relacionadas aos quadros)
          const subcollections = [
            'leads', 'columns', 'emailTemplates', 'automations', 
            'phaseFormConfigs', 'outboxEmails', 'mail', 'automationHistory'
          ];
          
          // Limpar cada subcoleção do board
          for (const subcollectionName of subcollections) {
            try {
              const subcollectionRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/${subcollectionName}`);
              const subcollectionSnapshot = await getDocs(subcollectionRef);
              
              subcollectionSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
                operationCount++;
              });
            } catch (error) {
              // Sem permissão para acessar subcoleção - pular silenciosamente
            }
          }
          
          // Excluir o board
          batch.delete(boardDoc.ref);
          operationCount++;
        }
      }
      
      // Limpar apenas estruturas antigas do usuário atual (preservando usuários)
      if (currentUserId) {
        // Limpar apenas estruturas antigas relacionadas a quadros
        const oldBoardStructures = [
          'boards', 'emailTemplates', 'automations', 
          'outboxEmails', 'leads', 'columns'
        ];
        
        for (const structureName of oldBoardStructures) {
          try {
            const structureRef = collection(this.firestore, `users/${currentUserId}/${structureName}`);
            const structureSnapshot = await getDocs(structureRef);
            
            structureSnapshot.docs.forEach(doc => {
              batch.delete(doc.ref);
              operationCount++;
            });
          } catch (error) {
            // Sem permissão para acessar estrutura antiga - pular silenciosamente
          }
        }
      }
      
      // Executar limpeza em lotes
      if (operationCount > 0) {
        await batch.commit();
      }
      
    } catch (error) {
      throw error;
    }
  }


}