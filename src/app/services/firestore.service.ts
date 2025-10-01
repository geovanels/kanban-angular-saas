
import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, setDoc,
         updateDoc, deleteDoc, query, where, onSnapshot,
         writeBatch, orderBy, collectionGroup, limit } from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { CompanyService } from './company.service';
import { SubdomainService } from './subdomain.service';
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
  endStageType?: 'success' | 'fail' | 'none';
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
  // UI derived counts (not persisted necessarily)
  historyCommentsCount?: number;
  attachmentsCount?: number;
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

  // Utilitário para tratar getDocs com permissões
  private async safeGetDocs(collectionRef: any, operationName: string = 'buscar dados'): Promise<any[]> {
    try {
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(collectionRef));
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() as any }));
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.log(`Permissões para ${operationName} não configuradas - retornando array vazio`);
        return [];
      }
      console.error(`Erro crítico ao ${operationName}:`, error);
      return [];
    }
  }
  private currentCompany: Company | null = null;

  // COMPANY CONTEXT METHODS
  async initializeCompanyContext(): Promise<Company | null> {
    try {
      // 1) Tentar SubdomainService (empresa já carregada no app)
      const subdomainService = this.injector.get(SubdomainService);
      const fromSubdomain = subdomainService?.getCurrentCompany?.();
      if (fromSubdomain?.id) {
        this.setCompanyContext(fromSubdomain);
        return fromSubdomain;
      }

      // 2) Tentar por subdomínio disponível
      const subdomain = this.companyService.getCompanySubdomain();
      if (subdomain) {
        const bySub = await this.companyService.getCompanyBySubdomain(subdomain);
        if (bySub?.id) {
          this.setCompanyContext(bySub);
          return bySub;
        }
      }

      // 3) Tentar por email do usuário autenticado
      const currentUser = this.authService.getCurrentUser();
      if (currentUser?.email) {
        const byEmail = await this.companyService.getCompanyByUserEmail(currentUser.email);
        if (byEmail?.id) {
          this.setCompanyContext(byEmail);
          return byEmail;
        }
      }

      return null;
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
        // Buscar boards da empresa atual (tudo dentro do InjectionContext)
        const boardsRef = runInInjectionContext(this.injector, () => collection(this.firestore, 'companies', companyId, 'boards'));
        const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(boardsRef));
        let allBoards = querySnapshot.docs.map((doc: any) => ({ 
          id: doc.id, 
          ...doc.data(),
          companyId: companyId 
        } as Board));
        
        // Se não encontrou boards na nova estrutura, buscar na estrutura antiga
        if (allBoards.length === 0) {
          try {
            const oldBoardsRef = runInInjectionContext(this.injector, () => collection(this.firestore, 'users', userId, 'boards'));
            const oldSnapshot = await runInInjectionContext(this.injector, () => getDocs(oldBoardsRef));
            const oldBoards = oldSnapshot.docs.map((doc: any) => ({ 
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
        allBoards = allBoards.filter((board: any) => (board.status || 'active') === 'active');
        
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

      const boardsRef = runInInjectionContext(this.injector, () => collection(this.firestore, 'companies', this.currentCompanyId!, 'boards'));
      const newBoard = {
        ...board,
        companyId: this.currentCompanyId,
        owner: userId,
        ownerEmail: '', // será preenchido pelo componente
        status: 'active' as const,
        createdAt: serverTimestamp()
      };
      return await runInInjectionContext(this.injector, () => addDoc(boardsRef, newBoard));
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

      const boardRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId));
      return await runInInjectionContext(this.injector, () => updateDoc(boardRef, updates));
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

      
      // 1. Excluir todas as subcoleções primeiro
      await this.deleteBoardSubcollections(boardId);
      
      // 2. Por último, excluir o documento principal do board
      const boardRef = doc(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId);
      await deleteDoc(boardRef);
      
    } catch (error) {
      console.error('❌ Erro ao excluir quadro:', error);
      throw error;
    }
  }

  private async deleteBoardSubcollections(boardId: string): Promise<void> {
    if (!this.currentCompanyId) return;

    const basePath = `companies/${this.currentCompanyId}/boards/${boardId}`;

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
      
    } catch (error) {
      console.error('❌ Erro ao excluir subcoleções:', error);
      throw error;
    }
  }

  private async deleteCollection(collectionPath: string): Promise<void> {
    try {
      const collectionRef = collection(this.firestore, collectionPath);
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(collectionRef));
      
      if (snapshot.empty) {
        return;
      }

      
      // Excluir em lotes de 500 documentos (limite do Firestore)
      const batchSize = 500;
      const batches: Promise<void>[] = [];
      
      for (let i = 0; i < snapshot.docs.length; i += batchSize) {
        const batchDocs = snapshot.docs.slice(i, i + batchSize);
        const batch = writeBatch(this.firestore);
        
        batchDocs.forEach((doc: any) => {
          batch.delete(doc.ref);
        });
        
        batches.push(batch.commit());
      }
      
      await Promise.all(batches);
      
    } catch (error) {
      console.warn(`⚠️ Erro ao excluir coleção ${collectionPath}:`, error);
      // Não propagar o erro para não interromper a exclusão de outras coleções
    }
  }

  // COLUMNS (Updated for multi-company)
  async getColumns(userId: string, boardId: string) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    
    if (!this.currentCompanyId) {
      return [];
    }

    const columnsRef = runInInjectionContext(this.injector, () => collection(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'columns'));
    const q = query(columnsRef, orderBy('order'));
    const columns = await this.safeGetDocs(q, 'buscar colunas');
    return columns.map(doc => ({ 
      ...doc,
      companyId: this.currentCompanyId,
      boardId: boardId
    } as Column));
  }

  async createColumn(userId: string, boardId: string, column: Omit<Column, 'id' | 'boardId'>) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const columnsRef = runInInjectionContext(this.injector, () => collection(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'columns'));
      const newColumn = {
        ...column,
        companyId: this.currentCompanyId,
        boardId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      return await runInInjectionContext(this.injector, () => addDoc(columnsRef, newColumn));
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

      const columnRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'columns', columnId));
      return await runInInjectionContext(this.injector, () => updateDoc(columnRef, updates));
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

      const columnRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'columns', columnId));
      return await runInInjectionContext(this.injector, () => deleteDoc(columnRef));
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

      const leadsRef = runInInjectionContext(this.injector, () => collection(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'leads'));
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(leadsRef));
      return snapshot.docs.map((doc: any) => ({ 
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

      const leadsRef = runInInjectionContext(this.injector, () => collection(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'leads'));
      const nowTs = serverTimestamp();
      const initialPhaseHistory = {
        [lead.columnId]: {
          phaseId: lead.columnId,
          enteredAt: nowTs
        }
      } as any;
      const newLead = {
        ...lead,
        companyId: this.currentCompanyId,
        boardId: boardId,
        createdAt: nowTs,
        movedToCurrentColumnAt: nowTs,
        phaseHistory: (lead as any).phaseHistory && Object.keys((lead as any).phaseHistory).length ? (lead as any).phaseHistory : initialPhaseHistory,
        executedAutomations: (lead as any).executedAutomations || {}
      };
      return await runInInjectionContext(this.injector, () => addDoc(leadsRef, newLead));
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

      const leadRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'leads', leadId));
      return await runInInjectionContext(this.injector, () => updateDoc(leadRef, updates));
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      throw error;
    }
  }

  async getLead(userId: string, boardId: string, leadId: string): Promise<Lead | null> {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      if (!this.currentCompanyId) return null;

      const leadRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'leads', leadId));
      const snap = await runInInjectionContext(this.injector, () => getDoc(leadRef));
      if (!snap.exists()) return null;
      const data = snap.data() as any;
      return { id: leadId, ...data, companyId: this.currentCompanyId, boardId } as Lead;
    } catch (error) {
      console.error('Erro ao buscar lead por id:', error);
      return null;
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

      const leadRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'leads', leadId));
      return await runInInjectionContext(this.injector, () => deleteDoc(leadRef));
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

      // Buscar dados atuais do lead para obter phaseHistory
      const leadRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'leads', leadId));
      const leadSnap = await runInInjectionContext(this.injector, () => getDoc(leadRef));
      
      if (!leadSnap.exists()) {
        throw new Error('Lead não encontrado');
      }

      const leadData = leadSnap.data() as any;
      const currentColumnId = leadData.columnId;
      const now = new Date();
      
      // Atualizar histórico de fases
      const phaseHistory = { ...(leadData.phaseHistory || {}) };
      
      // Finalizar fase atual se existir
      if (currentColumnId && phaseHistory[currentColumnId]) {
        const enteredAt = phaseHistory[currentColumnId].enteredAt?.toDate() || new Date(phaseHistory[currentColumnId].enteredAt || now);
        phaseHistory[currentColumnId].exitedAt = now;
        phaseHistory[currentColumnId].duration = now.getTime() - enteredAt.getTime();
      }
      
      // Iniciar nova fase
      phaseHistory[newColumnId] = {
        phaseId: newColumnId,
        enteredAt: now
      };


      const updates = {
        columnId: newColumnId,
        movedToCurrentColumnAt: serverTimestamp(),
        phaseHistory: phaseHistory
      };
      
      return await runInInjectionContext(this.injector, () => updateDoc(leadRef, updates));
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

    return runInInjectionContext(this.injector, () => {
      const boardsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards');
      return onSnapshot(boardsRef, (snapshot: any) => {
        const boards = snapshot.docs.map((doc: any) => ({ 
          id: doc.id, 
          ...doc.data(),
          companyId: this.currentCompanyId
        } as Board)).filter((board: any) => (board.status || 'active') === 'active');
        callback(boards);
      });
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

    return runInInjectionContext(this.injector, () => {
      const columnsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'columns');
      const q = query(columnsRef, orderBy('order'));
      return onSnapshot(q, (snapshot: any) => {
        const columns = snapshot.docs.map((doc: any) => ({ 
          id: doc.id, 
          ...doc.data(),
          companyId: this.currentCompanyId,
          boardId: boardId
        } as Column));
        callback(columns);
      });
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

    return runInInjectionContext(this.injector, () => {
      const leadsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads');
      return onSnapshot(leadsRef, (snapshot: any) => {
        const leads = snapshot.docs.map((doc: any) => ({ 
          id: doc.id, 
          ...doc.data(),
          companyId: this.currentCompanyId,
          boardId: boardId
        } as Lead));
        callback(leads);
      });
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
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(q));
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() as any }));
    } catch (error) {
      console.error('Erro ao buscar histórico do lead:', error);
      return [];
    }
  }

  // Subscribe real-time to lead history
  subscribeToLeadHistory(userId: string, boardId: string, leadId: string, callback: (items: any[]) => void) {
    if (!this.currentCompanyId) {
      // try initialize context lazily; if still unavailable, return noop and empty list
      this.initializeCompanyContext().then(() => {}).catch(() => {});
    }
    if (!this.currentCompanyId) {
      callback([]);
      return () => {};
    }

    const historyRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'leads', leadId, 'history');
    const qHist = query(historyRef, orderBy('timestamp', 'desc'));
    return runInInjectionContext(this.injector, () => onSnapshot(qHist, (snapshot: any) => {
      const items = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      callback(items);
    }, (err: any) => {
      console.error('Erro na subscrição do histórico do lead:', err);
      callback([]);
    }));
  }

  // PHASE FORM CONFIGURATIONS
  // INITIAL FORM CONFIG (one per board)
  async getInitialFormConfig(boardId: string): Promise<any | null> {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) return null;

    try {
      const docRef = doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/initialForm/config`);
      const snap = await runInInjectionContext(this.injector, () => getDoc(docRef));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
      return null;
    } catch {
      return null;
    }
  }

  async saveInitialFormConfig(boardId: string, config: any): Promise<void> {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) throw new Error('Contexto da empresa não inicializado');

    const docRef = runInInjectionContext(this.injector, () => doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/initialForm/config`));
    await runInInjectionContext(this.injector, () => setDoc(docRef, {
      ...config,
      boardId,
      companyId: this.currentCompanyId,
      updatedAt: serverTimestamp(),
      createdAt: config?.createdAt || serverTimestamp()
    }));
  }
  async createPhaseFormConfig(userId: string, boardId: string, formConfig: any) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) throw new Error('Contexto da empresa não inicializado');

    const formConfigsRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/phaseFormConfigs`);
    const newConfig = {
      ...formConfig,
      boardId,
      companyId: this.currentCompanyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(formConfigsRef, newConfig);
  }

  async updatePhaseFormConfig(userId: string, boardId: string, configId: string, updates: any) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) throw new Error('Contexto da empresa não inicializado');

    const configRef = doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/phaseFormConfigs/${configId}`);
    const updatedConfig = {
      ...updates,
      boardId,
      companyId: this.currentCompanyId,
      updatedAt: serverTimestamp()
    };
    return await updateDoc(configRef, updatedConfig);
  }

  async getPhaseFormConfig(userId: string, boardId: string, columnId: string) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) return null;

    const formConfigsRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/phaseFormConfigs`);
    const q1 = query(formConfigsRef, where('columnId', '==', columnId));
    const snapshot1 = await runInInjectionContext(this.injector, () => getDocs(q1));

    if (!snapshot1.empty) {
      const docSnap = snapshot1.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }

    // Fallback: estrutura alternativa sem prefixo de empresa
    try {
      const altRef = collection(this.firestore, `boards/${boardId}/phaseFormConfigs`);
      const q2 = query(altRef, where('columnId', '==', columnId));
      const snapshot2 = await runInInjectionContext(this.injector, () => getDocs(q2));
      if (!snapshot2.empty) {
        const docSnap = snapshot2.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as any;
      }
    } catch {}

    return null;
  }

  async getAllPhaseFormConfigs(userId: string, boardId: string) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) return [];

    try {
      const formConfigsRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/phaseFormConfigs`);
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(formConfigsRef));
      
      const configs: any[] = [];
      snapshot.docs.forEach(doc => {
        configs.push({ id: doc.id, ...doc.data() });
      });
      
      return configs;
    } catch (error) {
      console.warn('Erro ao carregar configurações de fase:', error);
      
      // Fallback: estrutura alternativa sem prefixo de empresa
      try {
        const altRef = collection(this.firestore, `boards/${boardId}/phaseFormConfigs`);
        const snapshot = await runInInjectionContext(this.injector, () => getDocs(altRef));
        
        const configs: any[] = [];
        snapshot.docs.forEach(doc => {
          configs.push({ id: doc.id, ...doc.data() });
        });
        
        return configs;
      } catch {
        return [];
      }
    }
  }

  async deletePhaseFormConfig(userId: string, boardId: string, configId: string) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) throw new Error('Contexto da empresa não inicializado');

    const configRef = doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/phaseFormConfigs/${configId}`);
    return await deleteDoc(configRef);
  }

  async getInitialColumnId(boardId: string): Promise<string | null> {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) return null;

    const columnsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'columns');
    const qInitial = query(columnsRef, where('isInitialPhase', '==', true), orderBy('order'), limit(1));
    const snap = await runInInjectionContext(this.injector, () => getDocs(qInitial));
    if (!snap.empty) return snap.docs[0].id;
    return null;
  }

  // FLOW CONFIG (allowed transitions between phases)
  async getFlowConfig(boardId: string): Promise<any | null> {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) return null;

    try {
      const flowDoc = doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/flow/config`);
      const snap = await runInInjectionContext(this.injector, () => getDoc(flowDoc));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as any;
      }
      return null;
    } catch {
      return null;
    }
  }

  async saveFlowConfig(boardId: string, config: any): Promise<void> {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) throw new Error('Contexto da empresa não inicializado');

    const flowDoc = runInInjectionContext(this.injector, () => doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/flow/config`));
    await runInInjectionContext(this.injector, () => setDoc(flowDoc, {
      ...config,
      boardId,
      companyId: this.currentCompanyId,
      updatedAt: serverTimestamp(),
      createdAt: config?.createdAt || serverTimestamp()
    }));
  }

  async unsetOtherInitialPhases(boardId: string, keepColumnId: string): Promise<void> {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) return;

    const columnsRef = collection(this.firestore, 'companies', this.currentCompanyId, 'boards', boardId, 'columns');
    const snap = await runInInjectionContext(this.injector, () => getDocs(columnsRef));
    const updates: Promise<any>[] = [];
    snap.docs.forEach((d: any) => {
      if (d.id !== keepColumnId && d.data()['isInitialPhase']) {
        updates.push(updateDoc(doc(this.firestore, 'companies', this.currentCompanyId!, 'boards', boardId, 'columns', d.id), { isInitialPhase: false }));
      }
    });
    await Promise.all(updates);
  }

  // EMAIL OUTBOX MANAGEMENT (usando coleção 'mail' como no sistema original)
  async getOutboxEmails(userId: string, boardId: string) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      return [];
    }

    const emailsRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/mail`);
    const q = query(emailsRef, orderBy('createdAt', 'desc'));
    const snapshot = await runInInjectionContext(this.injector, () => getDocs(q));
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async createOutboxEmail(userId: string, boardId: string, emailData: any) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      throw new Error('Contexto da empresa não inicializado');
    }

    const emailsRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/mail`);
    const newEmail = {
      ...emailData,
      companyId: this.currentCompanyId,
      boardId: boardId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(emailsRef, newEmail);
  }

  async updateOutboxEmail(userId: string, boardId: string, emailId: string, updates: any) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      throw new Error('Contexto da empresa não inicializado');
    }

    const emailRef = doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/mail/${emailId}`);
    const updatedEmail = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    return await updateDoc(emailRef, updatedEmail);
  }

  // Buscar outbox recente para evitar duplicatas (mesmo lead/automação/assunto em curto intervalo)
  // IMPORTANTE: Para otimizar estas queries, criar índices compostos no Firestore:
  // 1. companies/{companyId}/boards/{boardId}/mail: (leadId ASC, createdAt DESC)
  // 2. companies/{companyId}/boards/{boardId}/mail: (automationId ASC, leadId ASC, createdAt DESC)
  // 3. companies/{companyId}/boards/{boardId}/mail: (templateId ASC, leadId ASC, createdAt DESC)
  async findRecentOutboxEmail(userId: string, boardId: string, criteria: { automationId?: string; leadId?: string; subject?: string; templateId?: string; withinMs?: number }): Promise<string | null> {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) return null;

    // Default aumentado para 4 horas para cobrir todas as verificações de deduplicação
    const withinMs = criteria.withinMs ?? 4 * 60 * 60 * 1000; // 4 horas por padrão
    try {
      const emailsRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/mail`);
      let qBase: any = emailsRef;
      
      // Aplicar filtros específicos
      if (criteria.automationId) qBase = query(qBase, where('automationId', '==', criteria.automationId));
      if (criteria.leadId) qBase = query(qBase, where('leadId', '==', criteria.leadId));
      if (criteria.templateId) qBase = query(qBase, where('templateId', '==', criteria.templateId));
      
      qBase = query(qBase, orderBy('createdAt', 'desc'), limit(10)); // Aumentar limite para busca mais precisa
      const snap = await runInInjectionContext(this.injector, () => getDocs(qBase));
      const now = Date.now();
      
      for (const d of snap.docs) {
        const data: any = d.data();
        const created = data?.createdAt?.toDate ? data.createdAt.toDate().getTime() : (data?.createdAt ? new Date(data.createdAt).getTime() : 0);
        
        if (created && now - created <= withinMs) {
          // Verificar critérios adicionais
          let matches = true;
          
          if (criteria.subject && criteria.subject !== data.subject) {
            matches = false;
          }
          
          if (criteria.templateId && criteria.templateId !== data.templateId) {
            matches = false;
          }
          
          if (criteria.automationId && criteria.automationId !== data.automationId) {
            matches = false;
          }
          
          if (criteria.leadId && criteria.leadId !== data.leadId) {
            matches = false;
          }
          
          if (matches) {
            console.log('🔍 Email duplicado encontrado:', {
              emailId: d.id,
              leadId: data.leadId,
              automationId: data.automationId,
              templateId: data.templateId,
              subject: data.subject,
              createdAgo: Math.round((now - created) / 1000 / 60) + 'min'
            });
            return d.id;
          }
        }
      }
    } catch (e) {
      console.warn('Erro ao buscar emails recentes para deduplicação:', e);
    }
    return null;
  }

  async deleteOutboxEmail(userId: string, boardId: string, emailId: string) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      throw new Error('Contexto da empresa não inicializado');
    }

    const emailRef = doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/mail/${emailId}`);
    return await deleteDoc(emailRef);
  }

  subscribeToOutboxEmails(userId: string, boardId: string, callback: (emails: any[]) => void) {
    if (!this.currentCompanyId) {
      console.warn('Contexto da empresa não definido, retornando array vazio');
      callback([]);
      return () => {};
    }

    const emailsRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/mail`);
    const q = query(emailsRef, orderBy('createdAt', 'desc'));
    return runInInjectionContext(this.injector, () => 
      onSnapshot(q, (snapshot: any) => {
        const emails = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }));
        callback(emails);
      })
    );
  }

  async clearOutboxEmails(userId: string, boardId: string): Promise<void> {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const outboxRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/mail`);
      const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(outboxRef));
      
      const deletePromises = querySnapshot.docs.map((docSnapshot: any) => 
        deleteDoc(docSnapshot.ref)
      );
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Erro ao limpar caixa de saída:', error);
      throw error;
    }
  }

  // EMAIL TEMPLATES MANAGEMENT
  async getEmailTemplates(userId: string, boardId: string) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      if (!this.currentCompanyId) {
        console.warn('Contexto da empresa não inicializado - retornando array vazio');
        return [];
      }

      const templatesPath = `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates`;
      
      const templatesRef = collection(this.firestore, templatesPath);
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(templatesRef));
      const templates = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      
      return templates;
    } catch (error: any) {
      // Tratar erros de permissão silenciosamente
      if (error.code === 'permission-denied') {
        return [];
      }
      // Outros erros são mantidos para debug
      console.error('Erro crítico ao buscar templates:', error);
      return [];
    }
  }

  async createEmailTemplate(userId: string, boardId: string, templateData: any) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      throw new Error('Contexto da empresa não inicializado');
    }

    const templatesPath = `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates`;
    const templatesRef = collection(this.firestore, templatesPath);
    const newTemplate = {
      ...templateData,
      boardId: boardId, // Adicionar boardId para o filtro do collectionGroup
      companyId: this.currentCompanyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return await addDoc(templatesRef, newTemplate);
  }

  async updateEmailTemplate(userId: string, boardId: string, templateId: string, updates: any) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      throw new Error('Contexto da empresa não inicializado');
    }

    const templatePath = `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates/${templateId}`;
    const templateRef = doc(this.firestore, templatePath);
    const updatedTemplate = {
      ...updates,
      boardId: boardId, // Garantir que o boardId esteja sempre presente
      companyId: this.currentCompanyId,
      updatedAt: serverTimestamp()
    };
    return await updateDoc(templateRef, updatedTemplate);
  }

  async deleteEmailTemplate(userId: string, boardId: string, templateId: string) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      throw new Error('Contexto da empresa não inicializado');
    }

    const templatePath = `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates/${templateId}`;
    const templateRef = doc(this.firestore, templatePath);
    return await deleteDoc(templateRef);
  }

  subscribeToEmailTemplates(userId: string, boardId: string, callback: (templates: any[]) => void) {
    if (!this.currentCompanyId) {
      callback([]);
      return () => {}; // Retorna função de limpeza vazia
    }
    
    // Usar apenas estrutura multi-empresa
    const templatesPath = `companies/${this.currentCompanyId}/boards/${boardId}/emailTemplates`;
    
    const templatesRef = collection(this.firestore, templatesPath);
    
    return runInInjectionContext(this.injector, () => 
      onSnapshot(templatesRef, 
        (snapshot: any) => {
          const templates = snapshot.docs.map((doc: any) => ({ 
            id: doc.id, 
            path: doc.ref.path, 
            ...doc.data() 
          }));
          callback(templates);
        },
        (error: any) => {
          // Tratar erros de permissão silenciosamente em desenvolvimento
          if (error.code === 'permission-denied') {
            callback([]);
            return;
          }
          // Outros erros são mantidos para debug
          console.error('Erro crítico ao subscrever templates:', error);
          callback([]);
        }
      )
    );
  }

  // AUTOMATIONS MANAGEMENT
  async getAutomations(userId: string, boardId: string) {
    try {
      // Usar estrutura multi-empresa se há contexto de empresa
      if (this.currentCompanyId) {
        const automationsPath = `companies/${this.currentCompanyId}/boards/${boardId}/automations`;
        
        const automationsRef = collection(this.firestore, automationsPath);
        const snapshot = await runInInjectionContext(this.injector, () => getDocs(automationsRef));
        const automations = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        
        return automations;
      }
      
      // Fallback para estrutura antiga se não há contexto de empresa
      const automationsPath = `users/${userId}/boards/${boardId}/automations`;
      
      const automationsRef = collection(this.firestore, automationsPath);
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(automationsRef));
      const automations = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      
      return automations;
    } catch (error: any) {
      // Tratar erros de permissão silenciosamente
      if (error.code === 'permission-denied') {
        return [];
      }
      // Outros erros são mantidos para debug
      console.error('Erro crítico ao buscar automações:', error);
      return [];
    }
  }

  async createAutomation(userId: string, boardId: string, automationData: any) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      throw new Error('Contexto da empresa não inicializado');
    }

    const automationsRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/automations`);
    const newAutomation = {
      ...automationData,
      boardId: boardId,
      companyId: this.currentCompanyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: true
    };
    return await addDoc(automationsRef, newAutomation);
  }

  async updateAutomation(userId: string, boardId: string, automationId: string, updates: any) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      throw new Error('Contexto da empresa não inicializado');
    }

    const automationRef = doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/automations/${automationId}`);
    const updatedAutomation = {
      ...updates,
      boardId: boardId,
      companyId: this.currentCompanyId,
      updatedAt: serverTimestamp()
    };
    return await updateDoc(automationRef, updatedAutomation);
  }


  async deleteAutomation(userId: string, boardId: string, automationId: string) {
    if (!this.currentCompanyId) {
      await this.initializeCompanyContext();
    }
    if (!this.currentCompanyId) {
      throw new Error('Contexto da empresa não inicializado');
    }

    const automationRef = doc(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/automations/${automationId}`);
    return await deleteDoc(automationRef);
  }

  // AUTOMATION HISTORY MANAGEMENT
  subscribeToAutomationHistory(userId: string, boardId: string, automationId: string, callback: (historyItems: any[]) => void) {
    if (!this.currentCompanyId) {
      callback([]);
      return () => {};
    }

    const historyRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/automationHistory`);
    const q = query(historyRef, where("automationId", "==", automationId));

    return runInInjectionContext(this.injector, () => 
      onSnapshot(q,
        (snapshot: any) => {
          const historyItems = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
          callback(historyItems);
        },
        (error: any) => {
          console.error('Erro ao buscar histórico de automação (multi-empresa):', error);
          callback([]);
        }
      )
    );
  }

  async addAutomationHistoryItem(userId: string, boardId: string, historyItem: any) {
    try {
      if (!this.currentCompanyId) {
        await this.initializeCompanyContext();
      }
      if (!this.currentCompanyId) {
        throw new Error('Contexto da empresa não inicializado');
      }

      const historyRef = collection(this.firestore, `companies/${this.currentCompanyId}/boards/${boardId}/automationHistory`);
      const docRef = await addDoc(historyRef, {
        ...historyItem,
        companyId: this.currentCompanyId,
        boardId: boardId,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar item de histórico de automação:', error);
      throw error;
    }
  }

  subscribeToAutomations(userId: string, boardId: string, callback: (automations: any[]) => void) {
    if (!this.currentCompanyId) {
      callback([]);
      return () => {}; // Retorna função de limpeza vazia
    }
    
    // Usar apenas estrutura multi-empresa
    const automationsPath = `companies/${this.currentCompanyId}/boards/${boardId}/automations`;
    
    const automationsRef = collection(this.firestore, automationsPath);
    
    return runInInjectionContext(this.injector, () => 
      onSnapshot(automationsRef, 
        (snapshot: any) => {
          const automations = snapshot.docs.map((doc: any) => ({ 
            id: doc.id, 
            path: doc.ref.path, 
            ...doc.data() 
          }));
          callback(automations);
        },
        (error: any) => {
          // Tratar erros de permissão silenciosamente em desenvolvimento
          if (error.code === 'permission-denied') {
            callback([]);
            return;
          }
          // Outros erros são mantidos para debug
          console.error('Erro crítico ao subscrever automações:', error);
          callback([]);
        }
      )
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
        const boardsSnapshot = await runInInjectionContext(this.injector, () => getDocs(boardsRef));
        
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
              const subcollectionSnapshot = await runInInjectionContext(this.injector, () => getDocs(subcollectionRef));
              
              subcollectionSnapshot.docs.forEach((doc: any) => {
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
            const structureSnapshot = await runInInjectionContext(this.injector, () => getDocs(structureRef));
            
            structureSnapshot.docs.forEach((doc: any) => {
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