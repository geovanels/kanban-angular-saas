import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
         query, where, onSnapshot, orderBy, limit, writeBatch } from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { SubdomainService } from './subdomain.service';
import { Lead, Column } from './firestore.service';

export interface AppNotification {
  id?: string;
  userId: string;
  type: 'assignment' | 'deadline-warning' | 'sla-warning' | 'mention';
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
  metadata: {
    boardId: string;
    leadId: string;
    boardName?: string;
    leadName?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private subdomainService = inject(SubdomainService);
  private injector = inject(Injector);

  private notifications$ = new BehaviorSubject<AppNotification[]>([]);
  private unreadCount$ = new BehaviorSubject<number>(0);
  private unsubscribe: (() => void) | null = null;
  private deadlineCheckCache = new Set<string>();

  get notifications() { return this.notifications$.asObservable(); }
  get unreadCount() { return this.unreadCount$.asObservable(); }

  private getCompanyId(): string | null {
    return this.subdomainService.getCurrentCompany()?.id || null;
  }

  private getNotificationsRef() {
    const companyId = this.getCompanyId();
    if (!companyId) return null;
    return collection(this.firestore, 'companies', companyId, 'notifications');
  }

  // Iniciar listener real-time para notificações do usuário atual
  startListening() {
    this.stopListening();

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const ref = this.getNotificationsRef();
    if (!ref) return;

    const q = query(
      ref,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    this.unsubscribe = runInInjectionContext(this.injector, () =>
      onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AppNotification[];

        this.notifications$.next(notifications);
        this.unreadCount$.next(notifications.filter(n => !n.read).length);
      }, (error) => {
        console.error('Erro ao escutar notificações:', error);
      })
    );
  }

  stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  // Criar uma notificação
  async createNotification(data: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): Promise<void> {
    const ref = this.getNotificationsRef();
    if (!ref) return;

    // Não notificar o próprio usuário
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && data.userId === currentUser.uid) return;

    try {
      await runInInjectionContext(this.injector, () =>
        addDoc(ref, {
          ...data,
          read: false,
          createdAt: serverTimestamp()
        })
      );
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  }

  // Marcar uma notificação como lida
  async markAsRead(notificationId: string): Promise<void> {
    const companyId = this.getCompanyId();
    if (!companyId) return;

    try {
      const docRef = doc(this.firestore, 'companies', companyId, 'notifications', notificationId);
      await runInInjectionContext(this.injector, () =>
        updateDoc(docRef, { read: true })
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }

  // Marcar todas como lidas
  async markAllAsRead(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    const ref = this.getNotificationsRef();
    if (!currentUser || !ref) return;

    try {
      const q = query(ref, where('userId', '==', currentUser.uid), where('read', '==', false));
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(q));

      const batch = writeBatch(this.firestore);
      snapshot.docs.forEach(d => {
        batch.update(d.ref, { read: true });
      });
      await batch.commit();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  }

  // Verificar prazos e SLA vencendo amanhã e criar notificações
  async checkDeadlineWarnings(
    leads: Lead[],
    columns: Column[],
    boardId: string,
    boardName: string,
    deadlineKeys: string[],
    formConfigs?: { initialFormFields?: any[], phaseFormConfigs?: Record<string, any> }
  ): Promise<void> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);

    for (const lead of leads) {
      if (!lead.responsibleUserId) continue;

      const leadName = lead.fields?.contactName || lead.fields?.companyName || 'Card';

      // 1. Verificar prazo/deadline
      const deadlineValue = this.findDeadlineValue(lead, deadlineKeys, formConfigs);
      if (deadlineValue) {
        let deadline: Date;
        if (/^\d{4}-\d{2}-\d{2}$/.test(deadlineValue.trim())) {
          const [y, m, d] = deadlineValue.trim().split('-').map(Number);
          deadline = new Date(y, m - 1, d, 18, 0, 0);
        } else {
          deadline = new Date(deadlineValue);
        }

        if (!isNaN(deadline.getTime())) {
          const deadlineDay = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
          // Vence amanhã
          if (deadlineDay.getTime() >= tomorrow.getTime() && deadlineDay.getTime() < dayAfterTomorrow.getTime()) {
            const cacheKey = `deadline-${lead.id}-${deadlineDay.getTime()}`;
            if (!this.deadlineCheckCache.has(cacheKey)) {
              this.deadlineCheckCache.add(cacheKey);
              await this.createNotification({
                userId: lead.responsibleUserId,
                type: 'deadline-warning',
                title: 'Prazo vencendo amanhã',
                message: `O card "${leadName}" vence amanhã no quadro "${boardName}"`,
                metadata: { boardId, leadId: lead.id!, boardName, leadName }
              });
            }
          }
        }
      }

      // 2. Verificar SLA
      const column = columns.find(c => c.id === lead.columnId);
      if (column?.slaDays && lead.movedToCurrentColumnAt) {
        const movedAt = lead.movedToCurrentColumnAt instanceof Date
          ? lead.movedToCurrentColumnAt
          : lead.movedToCurrentColumnAt?.toDate?.() || new Date(lead.movedToCurrentColumnAt);

        const slaDeadline = new Date(movedAt.getTime() + column.slaDays * 24 * 60 * 60 * 1000);
        const slaDay = new Date(slaDeadline.getFullYear(), slaDeadline.getMonth(), slaDeadline.getDate());

        // SLA vence amanhã
        if (slaDay.getTime() >= tomorrow.getTime() && slaDay.getTime() < dayAfterTomorrow.getTime()) {
          const cacheKey = `sla-${lead.id}-${slaDay.getTime()}`;
          if (!this.deadlineCheckCache.has(cacheKey)) {
            this.deadlineCheckCache.add(cacheKey);
            await this.createNotification({
              userId: lead.responsibleUserId,
              type: 'sla-warning',
              title: 'SLA vencendo amanhã',
              message: `O SLA do card "${leadName}" na fase "${column.name}" vence amanhã`,
              metadata: { boardId, leadId: lead.id!, boardName, leadName }
            });
          }
        }
      }
    }
  }

  private findDeadlineValue(lead: Lead, deadlineKeys: string[], formConfigs?: any): string | null {
    const fields = lead.fields || {};

    for (const [key, val] of Object.entries(fields)) {
      if (!val) continue;
      const norm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (deadlineKeys.some(dk => norm.includes(dk.replace(/[^a-z0-9]/g, '')))) {
        return String(val);
      }
    }

    if (formConfigs) {
      const allFormFields = [
        ...(formConfigs.initialFormFields || []),
        ...Object.values(formConfigs.phaseFormConfigs || {}).flatMap((c: any) => c?.fields || [])
      ];
      const deadlineField = allFormFields.find((f: any) => f?.isDeadline === true && f?.type === 'date');
      if (deadlineField) {
        const key = deadlineField.apiFieldName || deadlineField.name;
        return fields[key] ? String(fields[key]) : null;
      }
    }

    return null;
  }

  // Extrair menções @NomeUsuário do texto
  extractMentions(text: string, users: { uid: string; displayName: string; email: string }[]): { uid: string; displayName: string }[] {
    const mentions: { uid: string; displayName: string }[] = [];
    const mentionRegex = /@([\w\s]+?)(?=\s@|$|\s(?:[^@])|\.|,|!|\?)/g;
    let match: RegExpExecArray | null;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionName = match[1].trim().toLowerCase();
      const user = users.find(u =>
        (u.displayName || '').toLowerCase() === mentionName ||
        (u.email || '').split('@')[0].toLowerCase() === mentionName
      );
      if (user && !mentions.some(m => m.uid === user.uid)) {
        mentions.push({ uid: user.uid, displayName: user.displayName || user.email });
      }
    }

    return mentions;
  }

  // Limpar cache (chamar ao trocar de board)
  clearCache() {
    this.deadlineCheckCache.clear();
  }
}
