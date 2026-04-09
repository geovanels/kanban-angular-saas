import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
         query, where, onSnapshot, orderBy, limit, writeBatch } from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { SubdomainService } from './subdomain.service';
import { CompanyService } from './company.service';
import { SmtpService } from './smtp.service';
import { Lead, Column } from './firestore.service';

export interface AppNotification {
  id?: string;
  userId: string;
  type: 'assignment' | 'deadline-warning' | 'sla-warning' | 'mention';
  title: string;
  message: string;
  read: boolean;
  emailSent: boolean;
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
  private companyService = inject(CompanyService);
  private smtpService = inject(SmtpService);
  private injector = inject(Injector);

  private notifications$ = new BehaviorSubject<AppNotification[]>([]);
  private unreadCount$ = new BehaviorSubject<number>(0);
  private unsubscribe: (() => void) | null = null;
  private deadlineCheckCache = new Set<string>();
  private emailDigestIntervalId: any = null;

  get notifications() { return this.notifications$.asObservable(); }
  get unreadCount() { return this.unreadCount$.asObservable(); }

  private getCompanyId(): string | null {
    const companyId = this.subdomainService.getCurrentCompany()?.id || null;
    if (!companyId) {
      // Fallback: tentar obter do localStorage
      try {
        const stored = localStorage.getItem('current-company');
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.id || null;
        }
      } catch {}
    }
    return companyId;
  }

  private getNotificationsRef(overrideCompanyId?: string) {
    const companyId = overrideCompanyId || this.getCompanyId();
    if (!companyId) return null;
    return collection(this.firestore, 'companies', companyId, 'notifications');
  }

  // Iniciar listener real-time para notificações do usuário atual
  startListening() {
    this.stopListening();

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.warn('🔔 Listener não iniciado: usuário não autenticado');
      return;
    }

    const ref = this.getNotificationsRef();
    if (!ref) {
      console.warn('🔔 Listener não iniciado: contexto da empresa não encontrado');
      return;
    }

    const companyId = this.getCompanyId();
    console.log(`🔔 Iniciando listener de notificações para userId=${currentUser.uid}, companyId=${companyId}`);

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
        console.log(`🔔 ${notifications.length} notificações carregadas, ${notifications.filter(n => !n.read).length} não lidas`);
      }, (error) => {
        console.error('🔔 Erro ao escutar notificações:', error);
        // Fallback: tentar query simples sem orderBy
        console.log('🔔 Tentando query simplificada...');
        const simpleQ = query(ref, where('userId', '==', currentUser.uid));
        this.unsubscribe = runInInjectionContext(this.injector, () =>
          onSnapshot(simpleQ, (snap) => {
            const notifs = snap.docs
              .map(d => ({ id: d.id, ...d.data() }) as AppNotification)
              .sort((a, b) => {
                const ta = a.createdAt?.toDate?.()?.getTime() || 0;
                const tb = b.createdAt?.toDate?.()?.getTime() || 0;
                return tb - ta;
              })
              .slice(0, 50);
            this.notifications$.next(notifs);
            this.unreadCount$.next(notifs.filter(n => !n.read).length);
            console.log(`🔔 Fallback: ${notifs.length} notificações carregadas`);
          }, (err) => {
            console.error('🔔 Fallback também falhou:', err);
          })
        );
      })
    );

    // Iniciar digest de email a cada 1 hora
    this.startEmailDigestTimer();
  }

  stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    if (this.emailDigestIntervalId) {
      clearInterval(this.emailDigestIntervalId);
      this.emailDigestIntervalId = null;
    }
  }

  // Criar uma notificação
  async createNotification(data: Omit<AppNotification, 'id' | 'createdAt' | 'read' | 'emailSent'>): Promise<void> {
    const companyId = this.getCompanyId();
    console.log(`🔔 createNotification chamado: type=${data.type}, userId=${data.userId}, companyId=${companyId}`);

    const ref = this.getNotificationsRef();
    if (!ref) {
      console.warn('🔔 Notificação não criada: contexto da empresa não encontrado (companyId null)');
      return;
    }

    // Não notificar o próprio usuário
    const currentUser = this.authService.getCurrentUser();
    console.log(`🔔 currentUser.uid=${currentUser?.uid}, data.userId=${data.userId}, são iguais? ${currentUser?.uid === data.userId}`);
    if (currentUser && data.userId === currentUser.uid) {
      console.log('🔔 Notificação ignorada: é o próprio usuário');
      return;
    }

    if (!data.userId) {
      console.warn('🔔 Notificação não criada: userId vazio');
      return;
    }

    try {
      const docData = {
        ...data,
        read: false,
        emailSent: false,
        createdAt: serverTimestamp()
      };
      console.log('🔔 Salvando notificação no Firestore:', JSON.stringify(docData, null, 2));
      await runInInjectionContext(this.injector, () =>
        addDoc(ref, docData)
      );
      console.log(`🔔 ✅ Notificação criada com sucesso: [${data.type}] para userId=${data.userId}`);
    } catch (error) {
      console.error('🔔 ❌ Erro ao criar notificação:', error);
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

  // Marcar como não lida
  async markAsUnread(notificationId: string): Promise<void> {
    const companyId = this.getCompanyId();
    if (!companyId) return;

    try {
      const docRef = doc(this.firestore, 'companies', companyId, 'notifications', notificationId);
      await runInInjectionContext(this.injector, () =>
        updateDoc(docRef, { read: false })
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como não lida:', error);
    }
  }

  // Excluir notificação
  async deleteNotification(notificationId: string): Promise<void> {
    const companyId = this.getCompanyId();
    if (!companyId) return;

    try {
      const docRef = doc(this.firestore, 'companies', companyId, 'notifications', notificationId);
      await runInInjectionContext(this.injector, () =>
        deleteDoc(docRef)
      );
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
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

      const leadName = this.getLeadDisplayName(lead);

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

  // Obter nome de exibição do lead (suporta variações de campos)
  getLeadDisplayName(lead: Lead): string {
    const f = lead.fields || {};
    return f['companyName'] || f['nameComapny'] || f['nameCompany'] ||
           f['contactName'] || f['nameContact'] || f['nome'] || f['name'] ||
           f['empresa'] || f['nomeEmpresa'] || f['nameLead'] || f['nomeLead'] ||
           f['contactEmail'] || f['emailContact'] || 'Sem título';
  }

  // Extrair menções @NomeUsuário do texto
  extractMentions(text: string, users: { uid: string; displayName: string; email: string }[]): { uid: string; displayName: string }[] {
    const mentions: { uid: string; displayName: string }[] = [];
    const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedText = normalize(text);

    // Para cada usuário, verifica se @NomeCompleto aparece no texto
    for (const user of users) {
      if (!user.uid) continue; // Sem uid, não pode notificar
      const displayName = (user.displayName || '').trim();
      const emailPrefix = (user.email || '').split('@')[0].trim();

      if (displayName && normalizedText.includes('@' + normalize(displayName))) {
        if (!mentions.some(m => m.uid === user.uid)) {
          mentions.push({ uid: user.uid, displayName: displayName });
        }
      } else if (emailPrefix && normalizedText.includes('@' + normalize(emailPrefix))) {
        if (!mentions.some(m => m.uid === user.uid)) {
          mentions.push({ uid: user.uid, displayName: displayName || user.email });
        }
      }
    }

    return mentions;
  }

  // --- Email Digest ---

  private startEmailDigestTimer() {
    if (this.emailDigestIntervalId) return;

    // Executar a primeira vez após 5 minutos, depois a cada 1 hora
    setTimeout(() => {
      this.sendEmailDigest();
      this.emailDigestIntervalId = setInterval(() => {
        this.sendEmailDigest();
      }, 60 * 60 * 1000); // 1 hora
    }, 5 * 60 * 1000); // 5 min inicial
  }

  async sendEmailDigest(): Promise<void> {
    const companyId = this.getCompanyId();
    if (!companyId) return;

    const ref = this.getNotificationsRef();
    if (!ref) return;

    try {
      // Buscar notificações não lidas e não enviadas por email
      const q = query(ref, where('read', '==', false), where('emailSent', '==', false));
      const snapshot = await runInInjectionContext(this.injector, () => getDocs(q));

      if (snapshot.empty) return;

      // Agrupar por userId
      const byUser = new Map<string, AppNotification[]>();
      snapshot.docs.forEach(d => {
        const data = { id: d.id, ...d.data() } as AppNotification;
        const list = byUser.get(data.userId) || [];
        list.push(data);
        byUser.set(data.userId, list);
      });

      // Buscar usuários da empresa para resolver userId → email
      const companyUsers = await this.companyService.getCompanyUsers(companyId);
      const company = this.subdomainService.getCurrentCompany();
      const companyName = company?.name || 'Sistema';
      const primaryColor = (company as any)?.primaryColor || (company as any)?.brandingConfig?.primaryColor || '#4F46E5';
      const companyUrl = company?.subdomain
        ? this.subdomainService.getCompanyUrl(company.subdomain)
        : '';

      for (const [userId, notifications] of byUser.entries()) {
        // Encontrar email do usuário pelo UID
        const user = companyUsers.find(u => u.uid === userId);
        if (!user?.email) continue;

        const userName = user.displayName || user.email.split('@')[0];

        // Gerar HTML do email
        const html = this.buildDigestEmailHtml(notifications, userName, companyName, primaryColor, companyUrl);

        // Enviar email
        try {
          await firstValueFrom(this.smtpService.sendEmail({
            to: user.email,
            subject: `${notifications.length} notificação${notifications.length > 1 ? 'ões' : ''} pendente${notifications.length > 1 ? 's' : ''} — ${companyName}`,
            html
          }));

          // Marcar como emailSent
          const batch = writeBatch(this.firestore);
          notifications.forEach(n => {
            if (n.id) {
              const docRef = doc(this.firestore, 'companies', companyId, 'notifications', n.id);
              batch.update(docRef, { emailSent: true });
            }
          });
          await batch.commit();

          console.log(`📧 Digest enviado para ${user.email} com ${notifications.length} notificações`);
        } catch (emailError) {
          console.warn(`Erro ao enviar digest para ${user.email}:`, emailError);
        }
      }
    } catch (error) {
      console.error('Erro ao processar email digest:', error);
    }
  }

  private buildDigestEmailHtml(
    notifications: AppNotification[],
    userName: string,
    companyName: string,
    primaryColor: string,
    companyUrl: string
  ): string {
    const notificationRows = notifications.map(n => {
      const icon = this.getEmailIcon(n.type);
      const bgColor = this.getEmailIconBg(n.type);
      const time = n.createdAt?.toDate
        ? n.createdAt.toDate().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        : '';

      return `
        <tr>
          <td style="padding: 16px 20px; border-bottom: 1px solid #F3F4F6;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="44" valign="top">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background-color: ${bgColor}; text-align: center; line-height: 36px; font-size: 16px;">
                    ${icon}
                  </div>
                </td>
                <td style="padding-left: 12px;">
                  <div style="font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px;">${n.title}</div>
                  <div style="font-size: 13px; color: #4B5563; line-height: 1.4;">${n.message}</div>
                  <div style="font-size: 11px; color: #9CA3AF; margin-top: 4px;">${time}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F3F4F6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="560" style="max-width: 560px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${primaryColor}, ${this.adjustColor(primaryColor, -30)}); border-radius: 12px 12px 0 0; padding: 32px 24px; text-align: center;">
              <div style="font-size: 28px; margin-bottom: 8px;">🔔</div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF;">Você tem notificações pendentes</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.85);">
                Olá <strong>${userName}</strong>, aqui está o resumo das suas atividades em <strong>${companyName}</strong>
              </p>
            </td>
          </tr>

          <!-- Badge Count -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 20px 24px 12px; text-align: center;">
              <span style="display: inline-block; background-color: #EF4444; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 20px;">
                ${notifications.length} notificação${notifications.length > 1 ? 'ões' : ''} não lida${notifications.length > 1 ? 's' : ''}
              </span>
            </td>
          </tr>

          <!-- Notifications List -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 0;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${notificationRows}
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 24px; text-align: center;">
              ${companyUrl ? `
              <a href="${companyUrl}" style="display: inline-block; background-color: ${primaryColor}; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 8px;">
                Ver todas as notificações
              </a>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; border-radius: 0 0 12px 12px; padding: 20px 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                Este é um resumo automático de notificações não lidas.<br>
                Acesse o sistema para marcar como lidas e parar de receber este email.
              </p>
              <p style="margin: 8px 0 0; font-size: 11px; color: #D1D5DB;">
                ${companyName} • Enviado automaticamente
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private getEmailIcon(type: string): string {
    switch (type) {
      case 'assignment': return '👤';
      case 'deadline-warning': return '📅';
      case 'sla-warning': return '⏰';
      case 'mention': return '💬';
      default: return '🔔';
    }
  }

  private getEmailIconBg(type: string): string {
    switch (type) {
      case 'assignment': return '#DBEAFE';
      case 'deadline-warning': return '#FEF3C7';
      case 'sla-warning': return '#FEE2E2';
      case 'mention': return '#EDE9FE';
      default: return '#F3F4F6';
    }
  }

  private adjustColor(hex: string, amount: number): string {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xFF) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  // Limpar cache (chamar ao trocar de board)
  clearCache() {
    this.deadlineCheckCache.clear();
  }
}
