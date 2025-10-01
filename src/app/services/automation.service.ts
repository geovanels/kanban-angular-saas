import { Injectable, inject } from '@angular/core';
import { FirestoreService, Lead, Column } from './firestore.service';
import { SmtpService } from './smtp.service';
import { SubdomainService } from './subdomain.service';
import { CompanyService } from './company.service';
import { Observable, from } from 'rxjs';

export interface AutomationTrigger {
  type: 'new-lead-created' | 'card-enters-phase' | 'card-in-phase-for-time' | 'form-not-answered' | 'form-answered' | 'sla-overdue';
  phaseId?: string;
  days?: number;
}

export interface AutomationAction {
  type: 'send-email' | 'move-to-phase' | 'assign-user' | 'add-note';
  templateId?: string;
  phaseId?: string;
  userId?: string;
  note?: string;
}

export interface Automation {
  id: string;
  name: string;
  active: boolean;
  triggerType: string;
  triggerPhase?: string;
  triggerDays?: number;
  actions: AutomationAction[];
  boardId: string;
  createdAt: any;
  updatedAt: any;
}

@Injectable({
  providedIn: 'root'
})
export class AutomationService {
  private firestoreService = inject(FirestoreService);
  private smtpService = inject(SmtpService);
  private subdomainService = inject(SubdomainService);
  private companyService = inject(CompanyService);

  // Lock para evitar execução simultânea de automações de tempo
  private timeAutomationLocks = new Map<string, boolean>();

  // Lock para evitar processamento duplo de novo lead
  private newLeadLocks = new Map<string, boolean>();

  // Monitor global para novos leads (independente do Kanban component)
  private globalLeadMonitors = new Map<string, any>();

  // Inicializar monitor global para automações de novos leads
  public initializeGlobalLeadMonitor(boardId: string, ownerId: string): void {
    const monitorKey = `${ownerId}_${boardId}`;

    if (this.globalLeadMonitors.has(monitorKey)) {
      console.log(`🔄 Monitor global já ativo para board ${boardId}`);
      return;
    }

    console.log(`🚀 Iniciando monitor global de leads para board ${boardId}`);

    // Subscribir diretamente aos leads via Firestore (independente do Kanban)
    const unsubscribe = this.firestoreService.subscribeToLeads(
      ownerId,
      boardId,
      async (leads) => {
        // Processar apenas novos leads detectados globalmente
        const lastProcessed = this.globalLeadMonitors.get(monitorKey)?.lastProcessed || {};
        const currentLeads = leads as any[];

        for (const lead of currentLeads) {
          if (!lastProcessed[lead.id]) {
            console.log(`🆕 NOVO LEAD DETECTADO GLOBALMENTE: ${lead.id} - Processando automações...`);
            try {
              await this.processNewLeadAutomations(lead, boardId, ownerId);
              lastProcessed[lead.id] = true;
            } catch (error) {
              console.error(`❌ Erro ao processar automação global para lead ${lead.id}:`, error);
            }
          }
        }

        // Atualizar cache de leads processados
        this.globalLeadMonitors.set(monitorKey, {
          unsubscribe,
          lastProcessed
        });
      }
    );

    this.globalLeadMonitors.set(monitorKey, {
      unsubscribe,
      lastProcessed: {}
    });
  }

  // Parar monitor global
  public stopGlobalLeadMonitor(boardId: string, ownerId: string): void {
    const monitorKey = `${ownerId}_${boardId}`;
    const monitor = this.globalLeadMonitors.get(monitorKey);

    if (monitor?.unsubscribe) {
      monitor.unsubscribe();
      this.globalLeadMonitors.delete(monitorKey);
      console.log(`🛑 Monitor global parado para board ${boardId}`);
    }
  }

  // Processar automações quando um novo lead é criado
  async processNewLeadAutomations(lead: Lead, boardId: string, ownerId: string): Promise<void> {
    try {
      console.log(`🆕 PROCESSANDO NOVO LEAD - ID: ${lead.id} - Board: ${boardId} - Owner: ${ownerId}`);

      // Chave única para lock de processamento de novo lead
      const newLeadLockKey = `newlead_${ownerId}_${boardId}_${lead.id}`;

      // Verificar se já está sendo processado
      if (this.newLeadLocks.get(newLeadLockKey)) {
        console.log('🔒 Novo lead já está sendo processado (lock ativo), pulando:', {
          leadId: lead.id,
          boardId: boardId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Definir lock temporário
      this.newLeadLocks.set(newLeadLockKey, true);

      try {
        // Buscar automações ativas do quadro
        console.log(`🔍 Buscando automações para board ${boardId}...`);
        const automations = await this.firestoreService.getAutomations(ownerId, boardId);
        console.log(`📋 Total de automações encontradas: ${(automations as Automation[])?.length || 0}`);

        const newLeadAutomations = (automations as Automation[]).filter(automation => {
          if (!automation || !automation.active) {
            console.log(`⚠️ Automação ${automation?.id || 'N/A'} não está ativa ou é inválida`);
            return false;
          }

          // Aceitar dois formatos de trigger: tipo plano ou objeto
          const type = (automation as any).triggerType || (automation as any).trigger?.type;
          console.log(`🔧 Automação ${automation.id} - Tipo: ${type} - Ativa: ${automation.active}`);

          // Se automação exigir fase (alguns setups), só dispare se lead entrou na fase inicial
          const triggerPhase = (automation as any).triggerPhase || (automation as any).trigger?.phase;

          if (triggerPhase) {
            console.log(`🎯 Automação ${automation.id} configurada para fase específica: ${triggerPhase} - Lead está na fase: ${lead.columnId}`);
            // Se há triggerPhase, só execute se o lead estiver nessa fase E for a fase inicial
            const shouldExecute = type === 'new-lead-created' && lead.columnId === triggerPhase;
            console.log(`✅ Deve executar automação ${automation.id}: ${shouldExecute}`);
            return shouldExecute;
          }

          const shouldExecute = type === 'new-lead-created';
          console.log(`✅ Deve executar automação ${automation.id} (sem fase específica): ${shouldExecute}`);
          return shouldExecute;
        });

        console.log(`🎯 Automações de novo lead filtradas: ${newLeadAutomations.length}`);
        newLeadAutomations.forEach(auto => {
          console.log(`  - ${auto.id}: ${auto.name} (${auto.actions?.length || 0} ações)`);
        });

        // Executar cada automação
        for (const automation of newLeadAutomations) {
          console.log(`▶️ Verificando automação: ${automation.id} - ${automation.name}`);

          // Verificar se já foi executada anteriormente
          const alreadyExecuted = await this.hasRecentlyExecuted(lead, automation.id, 365 * 24 * 60 * 60 * 1000); // 1 ano
          if (alreadyExecuted) {
            console.log(`⏭️ Automação ${automation.id} já foi executada para este lead, pulando`);
            continue;
          }

          // Verificar se o lead foi criado há menos de 5 minutos (evitar disparar para leads antigos)
          let leadCreatedAt: number | null = null;
          const createdTs = (lead.createdAt as any);
          if (createdTs?.toDate) {
            leadCreatedAt = createdTs.toDate().getTime();
          } else if (createdTs?.seconds) {
            leadCreatedAt = createdTs.seconds * 1000;
          } else if (createdTs) {
            try {
              leadCreatedAt = new Date(createdTs).getTime();
            } catch {
              leadCreatedAt = null;
            }
          }

          const now = Date.now();
          const fiveMinutes = 5 * 60 * 1000;

          if (leadCreatedAt && (now - leadCreatedAt) > fiveMinutes) {
            console.log(`⏭️ Lead foi criado há mais de 5 minutos (${Math.floor((now - leadCreatedAt) / 60000)} min), não é um lead novo, pulando automação de novo lead`);
            continue;
          }

          console.log(`▶️ Executando automação: ${automation.id} - ${automation.name}`);
          try {
            await this.executeAutomation(automation, lead, boardId, ownerId);
            await this.markExecuted(ownerId, boardId, lead, automation.id);
            console.log(`✅ Automação ${automation.id} executada com sucesso`);
          } catch (execError) {
            console.error(`❌ Erro ao executar automação ${automation.id}:`, execError);
          }
        }

        if (newLeadAutomations.length === 0) {
          console.log(`⚠️ NENHUMA AUTOMAÇÃO DE NOVO LEAD CONFIGURADA para board ${boardId}`);
        }

      } finally {
        // Liberar lock após um breve delay para evitar reentrância
        setTimeout(() => {
          this.newLeadLocks.delete(newLeadLockKey);
          console.log('🔓 Lock de novo lead liberado:', newLeadLockKey);
        }, 5000); // 5 segundos
      }
    } catch (error) {
      console.error('❌ ERRO GERAL ao processar automações de novo lead:', error);
    }
  }

  // Lock para evitar processamento duplo de mudança de fase
  private phaseChangeLocks = new Map<string, boolean>();

  // Processar automações quando um lead muda de fase
  async processPhaseChangeAutomations(lead: Lead, newColumnId: string, oldColumnId: string, boardId: string, ownerId: string): Promise<void> {
    try {
      // Chave única para lock de processamento de mudança de fase
      const phaseChangeLockKey = `phasechange_${ownerId}_${boardId}_${lead.id}_${newColumnId}`;
      
      // Verificar se já está sendo processado
      if (this.phaseChangeLocks.get(phaseChangeLockKey)) {
        console.log('🔒 Mudança de fase já está sendo processada (lock ativo), pulando:', {
          leadId: lead.id,
          newColumnId: newColumnId,
          oldColumnId: oldColumnId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Definir lock temporário
      this.phaseChangeLocks.set(phaseChangeLockKey, true);

      try {
        // Buscar automações ativas do quadro
        const automations = await this.firestoreService.getAutomations(ownerId, boardId);

        const phaseChangeAutomations = (automations as Automation[]).filter(automation => {
          const isActive = automation.active;
          const isCardEntersPhase = automation.triggerType === 'card-enters-phase';
          const matchesPhase = automation.triggerPhase === newColumnId;
          return isActive && isCardEntersPhase && matchesPhase;
        });

        // Executar cada automação
        for (const automation of phaseChangeAutomations) {
          await this.executeAutomation(automation, lead, boardId, ownerId);
        }
      } finally {
        // Liberar lock após um breve delay
        setTimeout(() => {
          this.phaseChangeLocks.delete(phaseChangeLockKey);
          console.log('🔓 Lock de mudança de fase liberado:', phaseChangeLockKey);
        }, 3000); // 3 segundos
      }
    } catch (error) {
      console.error('Erro ao processar automações de mudança de fase:', error);
    }
  }

  // Executar uma automação específica
  private async executeAutomation(automation: Automation, lead: Lead, boardId: string, ownerId: string): Promise<void> {
    try {
      // Executar cada ação da automação
      for (const action of automation.actions) {
        await this.executeAction(action, lead, boardId, ownerId, automation);
      }

      // Registrar no histórico
      await this.addAutomationHistory(automation, lead, boardId, ownerId, 'success');
    } catch (error) {
      console.error(`Erro ao executar automação ${automation.name}:`, error);
      
      // Registrar erro no histórico
      await this.addAutomationHistory(automation, lead, boardId, ownerId, 'error', (error as Error).message);
    }
  }

  // Executar uma ação específica
  private async executeAction(action: AutomationAction, lead: Lead, boardId: string, ownerId: string, automation: Automation): Promise<void> {
    switch (action.type) {
      case 'send-email':
        await this.executeSendEmailAction(action, lead, boardId, ownerId);
        break;
      
      case 'move-to-phase':
        await this.executeMoveToPhaseAction(action, lead, boardId, ownerId);
        break;
      
      case 'assign-user':
        await this.executeAssignUserAction(action, lead, boardId, ownerId);
        break;
      
      case 'add-note':
        await this.executeAddNoteAction(action, lead, boardId, ownerId);
        break;
      
      default:
        console.warn(`Tipo de ação não reconhecido: ${action.type}`);
    }
  }

  // Executar ação de envio de email
  private async executeSendEmailAction(action: AutomationAction, lead: Lead, boardId: string, ownerId: string, automation?: Automation): Promise<void> {
    if (!action.templateId) {
      throw new Error('Template de email não especificado');
    }

    // Chave única para lock de envio de email - incluir timestamp para melhor rastreamento
    const emailLockKey = `email_${ownerId}_${boardId}_${lead.id}_${action.templateId}_${automation?.id || 'manual'}`;

    // Verificar se já está sendo enviado o mesmo email
    const existingLock = this.timeAutomationLocks.get(emailLockKey);
    if (existingLock) {
      const lockAge = Date.now() - (existingLock as any).timestamp;
      // Se o lock tem mais de 2 minutos, considerar expirado (proteção contra locks travados)
      if (lockAge < 120000) {
        console.log('🔒 Email já está sendo enviado (lock ativo), pulando:', {
          leadId: lead.id,
          templateId: action.templateId,
          automationId: automation?.id,
          lockAge: Math.round(lockAge / 1000) + 's',
          timestamp: new Date().toISOString()
        });
        return;
      } else {
        console.warn('⚠️ Lock expirado detectado (>2min), removendo e prosseguindo:', emailLockKey);
        this.timeAutomationLocks.delete(emailLockKey);
      }
    }

    // Definir lock temporário com timestamp
    this.timeAutomationLocks.set(emailLockKey, { timestamp: Date.now(), leadId: lead.id } as any);

    try {
      // Buscar template
      const templates = await this.firestoreService.getEmailTemplates(ownerId, boardId);
      const template = (templates as any[]).find(t => t.id === action.templateId);
      if (!template) throw new Error(`Template de email não encontrado: ${action.templateId}`);

      // Destinatários: preferir os definidos no template (podem conter variáveis),
      // senão cair para ação (toEmail) e, por fim, e-mail do lead
      const recipientFromTemplateRaw = (template as any).recipients || '';
      const recipientFromTemplate = this.processEmailTemplate(recipientFromTemplateRaw, lead) || '';
      const parseEmails = (input: string): string[] => {
        if (!input) return [];
        return input
          .split(/[;,]/)
          .map(s => s.trim())
          .filter(s => /.+@.+\..+/.test(s));
      };
      const templateEmails = parseEmails(recipientFromTemplate);
      const fallbackEmails = parseEmails((action as any).toEmail || '')
        .concat(parseEmails((lead.fields as any).contactEmail || ''))
        .concat(parseEmails((lead.fields as any).email || ''))
        .concat(parseEmails((lead.fields as any).emailLead || ''))
        .concat(parseEmails((lead.fields as any).contatoEmail || ''));
      const allRecipients = (templateEmails.length ? templateEmails : fallbackEmails);
      const toValue = allRecipients.join(',');
      if (!toValue) {
        throw new Error('Destinatário não definido (template/ação/lead)');
      }

      // Conteúdo/assunto a partir do template salvo (usar body como fonte principal)
      const body = (template as any).body || (template as any).content || '';
      const processedContent = this.processEmailTemplate(body, lead, boardId, ownerId);
      const processedSubject = this.processEmailTemplate((template as any).subject || (template as any).name || 'Mensagem', lead, boardId, ownerId);

      // Criar registro na caixa de saída (estado inicial pendente)
      let outboxId: string | null = null;
      try {
        // Verificação quádrupla de deduplicação

        // 1. Verificar por automação + lead + assunto (2 horas)
        const existing = await this.firestoreService.findRecentOutboxEmail(ownerId, boardId, {
          automationId: automation?.id || undefined,
          leadId: lead.id,
          subject: processedSubject,
          withinMs: 2 * 60 * 60 * 1000
        });
        if (existing) {
          console.log('📧 Email duplicado detectado (automação + assunto, 2h), pulando envio:', {
            leadId: lead.id,
            automationId: automation?.id,
            subject: processedSubject,
            existingEmailId: existing,
            timestamp: new Date().toISOString()
          });
          return;
        }

        // 2. Verificar por template + lead (4 horas)
        const recentTemplate = await this.firestoreService.findRecentOutboxEmail(ownerId, boardId, {
          templateId: action.templateId,
          leadId: lead.id,
          withinMs: 4 * 60 * 60 * 1000
        });
        if (recentTemplate) {
          console.log('📧 Template duplicado detectado (template + lead, 4h), pulando envio:', {
            leadId: lead.id,
            templateId: action.templateId,
            subject: processedSubject,
            existingEmailId: recentTemplate,
            timestamp: new Date().toISOString()
          });
          return;
        }

        // 3. Verificar por lead + assunto + destinatário (1 hora) - mais restritivo
        const recentRecipient = await this.firestoreService.findRecentOutboxEmail(ownerId, boardId, {
          leadId: lead.id,
          subject: processedSubject,
          withinMs: 60 * 60 * 1000
        });
        if (recentRecipient) {
          console.log('📧 Email duplicado detectado (lead + assunto, 1h), pulando envio:', {
            leadId: lead.id,
            subject: processedSubject,
            to: toValue,
            existingEmailId: recentRecipient,
            timestamp: new Date().toISOString()
          });
          return;
        }

        // 4. Verificação extra: criar hash simples do conteúdo para detectar emails 100% idênticos (6 horas)
        const contentHash = this.generateSimpleHash(processedSubject + processedContent + toValue);
        const hashKey = `emailhash_${ownerId}_${boardId}_${lead.id}_${contentHash}`;
        const recentHash = this.timeAutomationLocks.get(hashKey);
        if (recentHash && Date.now() - (recentHash as any) < 6 * 60 * 60 * 1000) {
          console.log('📧 Email com conteúdo idêntico detectado (hash, 6h), pulando envio:', {
            leadId: lead.id,
            contentHash: contentHash,
            subject: processedSubject,
            timestamp: new Date().toISOString()
          });
          return;
        }
        // Registrar hash do email
        this.timeAutomationLocks.set(hashKey, Date.now() as any);

        const ref: any = outboxId ? { id: outboxId } : await this.firestoreService.createOutboxEmail(ownerId, boardId, {
          to: toValue,
          subject: processedSubject,
          html: processedContent,
          leadId: lead.id,
          automationId: automation?.id || null,
          templateId: action.templateId || null,
          delivery: { state: 'PENDING' }
        } as any);
        outboxId = ref?.id || null;
      } catch (e) {
        // Continua mesmo se não conseguir registrar a saída
        console.warn('⚠️ Não foi possível registrar o email na caixa de saída antes do envio.', e);
      }

      // Enviar email
      await new Promise<void>((resolve, reject) => {
        this.smtpService.sendEmail({ to: toValue, subject: processedSubject, html: processedContent }).subscribe({
          next: async (response: any) => {
            // Atualizar status no outbox
            try {
              if (outboxId) {
                await this.firestoreService.updateOutboxEmail(ownerId, boardId, outboxId, {
                  delivery: { state: 'SUCCESS', messageId: (response as any)?.messageId || 'sent' }
                });
              }
            } catch {}
            resolve();
          },
          error: async (error: any) => {
            try {
              if (outboxId) {
                await this.firestoreService.updateOutboxEmail(ownerId, boardId, outboxId, {
                  delivery: { state: 'ERROR', error: (error as any)?.error || (error as any)?.message || 'Erro' }
                });
              }
            } catch {}
            reject(error);
          }
        });
      });

      console.log('✅ Email enviado com sucesso:', {
        leadId: lead.id,
        templateId: action.templateId,
        automationId: automation?.id,
        subject: processedSubject,
        to: toValue,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erro ao enviar email:', {
        leadId: lead.id,
        templateId: action.templateId,
        automationId: automation?.id,
        error: (error as any)?.message || error,
        timestamp: new Date().toISOString()
      });
      throw error;
    } finally {
      // Liberar lock
      this.timeAutomationLocks.delete(emailLockKey);
      console.log('🔓 Lock de email liberado:', emailLockKey);
    }
  }

  // Executar ação de mover para fase
  private async executeMoveToPhaseAction(action: AutomationAction, lead: Lead, boardId: string, ownerId: string): Promise<void> {
    if (!action.phaseId) {
      throw new Error('Fase de destino não especificada');
    }

    try {
      // Atualizar lead para nova fase e phaseHistory
      const now = new Date();
      const phaseHistory: any = { ...((lead as any).phaseHistory || {}) };
      const oldColumnId = lead.columnId;

      // Finalizar fase anterior
      if (oldColumnId && phaseHistory[oldColumnId]) {
        const enteredAt = (phaseHistory[oldColumnId].enteredAt?.toDate && phaseHistory[oldColumnId].enteredAt.toDate()) || new Date(phaseHistory[oldColumnId].enteredAt || now);
        phaseHistory[oldColumnId].exitedAt = now;
        phaseHistory[oldColumnId].duration = now.getTime() - enteredAt.getTime();
      }
      
      // Iniciar nova fase
      phaseHistory[action.phaseId] = {
        phaseId: action.phaseId,
        enteredAt: now
      };

      await this.firestoreService.updateLead(ownerId, boardId, lead.id!, {
        columnId: action.phaseId,
        movedToCurrentColumnAt: now,
        phaseHistory
      });

      // Registrar no histórico do lead
      try {
        await this.firestoreService.addLeadHistory(ownerId, boardId, lead.id!, {
          type: 'move',
          text: `Moveu automaticamente para outra fase`,
          user: 'Automação'
        });
      } catch (historyError) {
        console.warn('Erro ao registrar histórico de movimentação:', historyError);
      }
      
    } catch (error) {
      console.error('Erro ao executar ação de mover para fase:', error);
      throw error;
    }
  }

  // Executar ação de atribuir usuário
  private async executeAssignUserAction(action: AutomationAction, lead: Lead, boardId: string, ownerId: string): Promise<void> {
    if (!action.userId) {
      throw new Error('Usuário não especificado');
    }

    // Buscar dados do usuário para preencher nome e email
    const companyId = this.subdomainService.getCurrentCompany()?.id;
    let userName = '';
    let userEmail = '';
    
    if (companyId && action.userId) {
      try {
        // Primeiro tentar buscar por email (assumindo que userId pode ser email)
        const user = await this.companyService.getCompanyUser(companyId, action.userId);
        if (user) {
          userName = user.displayName || '';
          userEmail = user.email || action.userId;
        } else {
          // Fallback: tentar buscar na lista de usuários da empresa por uid
          const users = await this.companyService.getCompanyUsers(companyId);
          const foundUser = users.find(u => u.uid === action.userId || u.email === action.userId);
          if (foundUser) {
            userName = foundUser.displayName || '';
            userEmail = foundUser.email || '';
          }
        }
      } catch (error) {
        console.warn('Erro ao buscar dados do usuário:', error);
      }
    }

    // Atualizar lead com usuário atribuído e seus dados
    await this.firestoreService.updateLead(ownerId, boardId, lead.id!, {
      responsibleUserId: action.userId,
      responsibleUserName: userName,
      responsibleUserEmail: userEmail
    });
  }

  // Executar ação de adicionar nota
  private async executeAddNoteAction(action: AutomationAction, lead: Lead, boardId: string, ownerId: string): Promise<void> {
    if (!action.note) {
      throw new Error('Nota não especificada');
    }

    // Processar nota com dados do lead
    const processedNote = this.processEmailTemplate(action.note, lead, boardId, ownerId);

    // Adicionar nota ao lead (implementar se necessário)
    const currentNotes = lead.fields['notes'] || '';
    const newNotes = currentNotes + '\n\n[AUTOMAÇÃO] ' + new Date().toLocaleString('pt-BR') + ':\n' + processedNote;

    await this.firestoreService.updateLead(ownerId, boardId, lead.id!, {
      fields: {
        ...lead.fields,
        notes: newNotes
      }
    });
  }

  // Processar template com dados do lead
  private processEmailTemplate(template: string, lead: Lead, boardId?: string, ownerId?: string): string {
    if (!template) return '';

    let processed = template;
    
    // Substituir variáveis do lead
    const variables: Record<string, string> = {
      '{{contactName}}': (lead.fields as any).contactName || '',
      '{{companyName}}': (lead.fields as any).companyName || '',
      '{{contactEmail}}': (lead.fields as any).contactEmail || '',
      '{{contactPhone}}': (lead.fields as any).contactPhone || '',
      '{{cnpj}}': (lead.fields as any).cnpj || ''
    };

    // Variáveis de responsável (aceitar PT-BR e canônicas)
    const respName = (lead as any).responsibleUserName || (lead.fields as any).responsibleUserName || '';
    const respEmail = (lead as any).responsibleUserEmail || (lead.fields as any).responsibleUserEmail || '';
    // Link público do formulário da fase
    const leadLink = this.buildLeadPublicLink(lead, boardId, ownerId);

    Object.assign(variables, {
      '{{responsibleUserName}}': respName,
      '{{responsibleUserEmail}}': respEmail,
      '{{nomeResponsavel}}': respName,
      '{{emailResponsavel}}': respEmail,
      '{{responsavel}}': respName,
      '{{leadLink}}': leadLink
    });

    // Substituir todas as variáveis
    Object.entries(variables).forEach(([placeholder, value]) => {
      processed = processed.replace(new RegExp(placeholder, 'g'), value);
    });

    // Substituir outros campos personalizados
    Object.entries(lead.fields).forEach(([key, value]) => {
      if (typeof value === 'string') {
        processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
    });

    // Substituir também campos diretos do lead (fora de fields)
    const rootReplacements: Array<[string, any]> = [
      ['id', (lead as any).id],
      ['responsibleUserId', (lead as any).responsibleUserId],
      ['responsibleUserName', (lead as any).responsibleUserName],
      ['responsibleUserEmail', (lead as any).responsibleUserEmail]
    ];
    rootReplacements.forEach(([k, v]) => {
      if (typeof v === 'string') {
        processed = processed.replace(new RegExp(`{{${k}}}`, 'g'), v);
      }
    });

    return processed;
  }

  private buildLeadPublicLink(lead: Lead, boardId?: string, ownerId?: string): string {
    try {
      const company = this.subdomainService.getCurrentCompany();
      if (!company || !boardId || !ownerId || !lead?.id || !lead?.columnId) return '';
      const params = new URLSearchParams({
        companyId: company.id as any,
        userId: ownerId,
        boardId: boardId,
        leadId: lead.id!,
        columnId: lead.columnId
      });
      if (this.subdomainService.isDevelopment()) {
        const base = this.subdomainService.getBaseUrl();
        params.set('subdomain', company.subdomain);
        return `${base}/form?${params.toString()}`;
      }
      return `https://${company.subdomain}.taskboard.com.br/form?${params.toString()}`;
    } catch {
      return '';
    }
  }

  // Adicionar item ao histórico de automação
  private async addAutomationHistory(automation: Automation, lead: Lead, boardId: string, ownerId: string, status: 'success' | 'error', errorMessage?: string): Promise<void> {
    const historyItem = {
      automationId: automation.id,
      automationName: automation.name,
      leadId: lead.id,
      leadName: lead.fields.contactName || lead.fields.companyName || 'Lead sem nome',
      status: status,
      executedAt: new Date(),
      actions: automation.actions.map(action => ({
        type: action.type,
        details: this.getActionDetails(action)
      })),
      ...(errorMessage && { errorMessage })
    };

    try {
      await this.firestoreService.addAutomationHistoryItem(ownerId, boardId, historyItem);
    } catch (error) {
      console.error('Erro ao adicionar ao histórico de automação:', error);
    }
  }

  // Obter detalhes da ação para histórico
  private getActionDetails(action: AutomationAction): string {
    switch (action.type) {
      case 'send-email':
        return `Template: ${action.templateId}`;
      case 'move-to-phase':
        return `Fase: ${action.phaseId}`;
      case 'assign-user':
        return `Usuário: ${action.userId}`;
      case 'add-note':
        return `Nota: ${action.note?.substring(0, 50)}...`;
      default:
        return '';
    }
  }

  // Método para processar automações de tempo (SLA, tempo em fase)
  async processTimeBasedAutomations(leads: Lead[], columns: Column[], boardId: string, ownerId: string): Promise<void> {
    const lockKey = `${ownerId}-${boardId}`;

    // Verificar se já está executando para este board
    if (this.timeAutomationLocks.get(lockKey)) {
      console.log('⏳ Automações de tempo já em execução para este board, pulando...');
      return;
    }

    // Definir lock
    this.timeAutomationLocks.set(lockKey, true);

    try {
      if (!leads || leads.length === 0) {
        console.log('⚠️ Nenhum lead encontrado para processar automações de tempo');
        return;
      }

      console.log(`🔄 Processando automações de tempo para ${leads.length} leads no board ${boardId}`);

      const automations = await this.firestoreService.getAutomations(ownerId, boardId);
      const list = (automations as Automation[]).filter(a => a && a.active);

      if (list.length === 0) {
        console.log('ℹ️ Nenhuma automação ativa encontrada');
        return;
      }

      // Log das automações ativas
      const formNotAnsweredAutomations = list.filter(a => {
        const type = (a as any).triggerType || (a as any).trigger?.type;
        return type === 'form-not-answered';
      });

      if (formNotAnsweredAutomations.length > 0) {
        console.log(`📝 Encontradas ${formNotAnsweredAutomations.length} automações 'form-not-answered' ativas:`,
          formNotAnsweredAutomations.map(a => ({
            id: a.id,
            name: a.name,
            phase: (a as any).triggerPhase,
            days: (a as any).triggerDays || 1
          }))
        );
      }
      
      

      // Cache de config de formulário por fase para verificar "form-not-answered"
      const formConfigCache: Record<string, any | null> = {};
      const getFormFieldsForPhase = async (phaseId: string): Promise<any[]> => {
        if (formConfigCache.hasOwnProperty(phaseId)) return (formConfigCache[phaseId]?.fields || []);
        const cfg = await this.firestoreService.getPhaseFormConfig(ownerId, boardId, phaseId);
        formConfigCache[phaseId] = cfg as any;
        return ((cfg as any)?.fields || []);
      };

      const DAY = 24 * 60 * 60 * 1000;
      const now = Date.now();

      for (const automation of list) {
        const type = (automation as any).triggerType || (automation as any).trigger?.type;
        const phaseId = (automation as any).triggerPhase || (automation as any).trigger?.phase || '';
        const days = (automation as any).triggerDays || (automation as any).trigger?.days || 0;

        if (!type) continue;

        // Avaliar cada lead
        for (const lead of leads) {
          // Filtrar por fase se definido
          if (phaseId && lead.columnId !== phaseId) continue;
          
          const movedTs = (lead.movedToCurrentColumnAt as any);
          const moved = movedTs?.toDate ? movedTs.toDate().getTime() : (movedTs?.seconds ? movedTs.seconds * 1000 : (new Date(movedTs)).getTime());
          const daysPassed = moved ? Math.floor((now - moved) / DAY) : 'N/A';

          try {
            if (type === 'card-in-phase-for-time') {
              if (!days || days <= 0) continue;
              const movedTs = (lead.movedToCurrentColumnAt as any);
              const moved = movedTs?.toDate ? movedTs.toDate().getTime() : (movedTs?.seconds ? movedTs.seconds * 1000 : (new Date(movedTs)).getTime());
              if (!moved) continue;
              const elapsed = now - moved;
              const exactDaysPassed = Math.floor(elapsed / DAY);

              // Executar apenas UMA VEZ quando atingir exatamente o número de dias configurado
              if (exactDaysPassed >= days && !this.hasRecentlyExecutedForDays(lead, automation.id, days, 365 * DAY)) {
                console.log(`🕐 Executando automação de tempo: ${days} dias na fase ${phaseId} para lead ${lead.id} (única execução)`);
                await this.executeAutomation(automation, lead, boardId, ownerId);
                await this.markExecutedForDays(ownerId, boardId, lead, automation.id, days);
              }
            } else if (type === 'sla-overdue') {
              const column = columns.find(c => c.id === lead.columnId);
              const slaDays = column?.slaDays || 0;
              if (!slaDays || slaDays <= 0) continue;
              const movedTs = (lead.movedToCurrentColumnAt as any);
              const moved = movedTs?.toDate ? movedTs.toDate().getTime() : (movedTs?.seconds ? movedTs.seconds * 1000 : (new Date(movedTs)).getTime());
              if (!moved) continue;
              if (now - moved > slaDays * DAY && !this.hasRecentlyExecuted(lead, automation.id, DAY)) {
                await this.executeAutomation(automation, lead, boardId, ownerId);
                await this.markExecuted(ownerId, boardId, lead, automation.id);
              }
            } else if (type === 'form-not-answered') {
              // Verificar se a automação é para a fase atual ou uma fase específica
              const targetPhase = phaseId || lead.columnId;

              console.log(`🔍 Analisando form-not-answered - Lead ${lead.id} - Fase atual: ${lead.columnId} - Fase alvo: ${targetPhase}`);

              if (phaseId && lead.columnId !== phaseId) {
                console.log(`⏭️ Lead não está na fase configurada (${phaseId}), pulando automação`);
                continue;
              }

              const fields = await getFormFieldsForPhase(targetPhase);

              console.log(`📝 Campos do formulário da fase ${targetPhase}:`, fields?.length || 0, 'campos');

              if (!fields || fields.length === 0) {
                console.log(`⚠️ Nenhum formulário configurado para fase ${targetPhase}, pulando automação`);
                continue; // sem formulário, não dispara
              }

              // Disparar apenas após "days" dias sem resposta (default 1)
              const waitDays = days && days > 0 ? days : 1;
              const movedTs = (lead.movedToCurrentColumnAt as any);
              let moved = null;

              if (movedTs?.toDate) {
                moved = movedTs.toDate().getTime();
              } else if (movedTs?.seconds) {
                moved = movedTs.seconds * 1000;
              } else if (movedTs) {
                try {
                  moved = new Date(movedTs).getTime();
                } catch {
                  moved = null;
                }
              }

              // Fallback: usar createdAt se movedToCurrentColumnAt não existir
              if (!moved) {
                const createdTs = (lead.createdAt as any);
                if (createdTs?.toDate) {
                  moved = createdTs.toDate().getTime();
                } else if (createdTs?.seconds) {
                  moved = createdTs.seconds * 1000;
                } else if (createdTs) {
                  try {
                    moved = new Date(createdTs).getTime();
                  } catch {
                    moved = Date.now(); // último recurso
                  }
                }
              }

              const daysPassed = moved ? Math.floor((now - moved) / DAY) : 0;
              const timeInPhase = moved ? now - moved : 0;

              console.log(`⏰ Lead ${lead.id} - Tempo na fase: ${daysPassed} dias (${Math.floor(timeInPhase / (60 * 60 * 1000))}h) - Aguardando: ${waitDays} dias`);

              if (!moved || now - moved < waitDays * DAY) {
                console.log(`⏳ Ainda não passou o tempo necessário (${waitDays} dias), pulando automação`);
                continue;
              }

              // Considerar não respondido se todos os campos do form estão vazios
              const fieldValues: any = {};
              const fieldAnalysis: any[] = [];

              const allEmpty = fields.every((f: any) => {
                // Tentar ambos os nomes de campo (apiFieldName e name) para maior compatibilidade
                const primaryKey = f.apiFieldName || f.name;
                const secondaryKey = f.name || f.apiFieldName;

                const leadFields = (lead as any).fields || {};
                let val = leadFields[primaryKey];

                // Se não encontrou com primaryKey, tentar secondaryKey
                if ((val === undefined || val === null || val === '') && primaryKey !== secondaryKey) {
                  val = leadFields[secondaryKey];
                }

                fieldValues[primaryKey] = val;

                let isEmpty = true;
                if (val !== undefined && val !== null && val !== '') {
                  const strVal = `${val}`.trim();
                  isEmpty = strVal === '' || strVal === 'undefined' || strVal === 'null';
                }

                fieldAnalysis.push({
                  fieldName: f.name,
                  apiFieldName: f.apiFieldName,
                  primaryKey: primaryKey,
                  secondaryKey: secondaryKey,
                  value: val,
                  isEmpty: isEmpty,
                  type: typeof val
                });

                return isEmpty;
              });

              console.log(`📊 Análise dos campos do formulário para lead ${lead.id}:`, {
                totalFields: fields.length,
                allEmpty: allEmpty,
                fieldAnalysis: fieldAnalysis,
                leadName: (lead.fields as any)?.contactName || (lead.fields as any)?.companyName || 'Sem nome'
              });

              const recentlyExecuted = this.hasRecentlyExecuted(lead, automation.id, DAY);
              console.log(`🔄 Já executado recentemente (${automation.name}): ${recentlyExecuted}`);

              if (allEmpty && !recentlyExecuted) {
                console.log(`✅ ✨ DISPARANDO AUTOMAÇÃO form-not-answered ✨`, {
                  leadId: lead.id,
                  leadName: (lead.fields as any)?.contactName || (lead.fields as any)?.companyName || 'Sem nome',
                  automationId: automation.id,
                  automationName: automation.name,
                  phaseId: targetPhase,
                  waitDays: waitDays,
                  daysPassed: daysPassed,
                  totalFields: fields.length,
                  actions: automation.actions?.map(a => a.type).join(', ')
                });
                try {
                  await this.executeAutomation(automation, lead, boardId, ownerId);
                  await this.markExecuted(ownerId, boardId, lead, automation.id);
                  console.log(`✅ Automação form-not-answered executada com sucesso para lead ${lead.id}`);
                } catch (executeError) {
                  console.error(`❌ Erro ao executar automação form-not-answered para lead ${lead.id}:`, executeError);
                }
              } else {
                const reasons = [];
                if (!allEmpty) reasons.push(`Campos preenchidos: ${fieldAnalysis.filter(f => !f.isEmpty).length}/${fields.length}`);
                if (recentlyExecuted) reasons.push('Já executado nas últimas 24h');

                console.log(`⏭️ Não executando automação form-not-answered para lead ${lead.id}:`, {
                  leadName: (lead.fields as any)?.contactName || (lead.fields as any)?.companyName || 'Sem nome',
                  reasons: reasons.join(', '),
                  allEmpty: allEmpty,
                  recentlyExecuted: recentlyExecuted,
                  fieldsWithValues: fieldAnalysis.filter(f => !f.isEmpty).map(f => ({
                    field: f.fieldName,
                    apiField: f.apiFieldName,
                    value: typeof f.value === 'string' ? f.value.substring(0, 50) : f.value
                  }))
                });
              }
            } else if (type === 'form-answered') {
              // Verificar se a automação é para a fase atual ou uma fase específica
              const targetPhase = phaseId || lead.columnId;

              console.log(`🔍 Analisando form-answered - Lead ${lead.id} - Fase atual: ${lead.columnId} - Fase alvo: ${targetPhase}`);

              if (phaseId && lead.columnId !== phaseId) {
                console.log(`⏭️ Lead não está na fase configurada (${phaseId}), pulando automação`);
                continue;
              }

              const fields = await getFormFieldsForPhase(targetPhase);

              console.log(`📝 Campos do formulário da fase ${targetPhase}:`, fields?.length || 0, 'campos');

              if (!fields || fields.length === 0) {
                console.log(`⚠️ Nenhum formulário configurado para fase ${targetPhase}, pulando automação`);
                continue; // sem formulário, não dispara
              }

              // Disparar apenas após "days" dias (default 0 = imediato)
              const waitDays = days && days > 0 ? days : 0;
              const movedTs = (lead.movedToCurrentColumnAt as any);
              let moved = null;

              if (movedTs?.toDate) {
                moved = movedTs.toDate().getTime();
              } else if (movedTs?.seconds) {
                moved = movedTs.seconds * 1000;
              } else if (movedTs) {
                try {
                  moved = new Date(movedTs).getTime();
                } catch {
                  moved = null;
                }
              }

              // Fallback: usar createdAt se movedToCurrentColumnAt não existir
              if (!moved) {
                const createdTs = (lead.createdAt as any);
                if (createdTs?.toDate) {
                  moved = createdTs.toDate().getTime();
                } else if (createdTs?.seconds) {
                  moved = createdTs.seconds * 1000;
                } else if (createdTs) {
                  try {
                    moved = new Date(createdTs).getTime();
                  } catch {
                    moved = Date.now(); // último recurso
                  }
                }
              }

              const daysPassed = moved ? Math.floor((now - moved) / DAY) : 0;
              const timeInPhase = moved ? now - moved : 0;

              console.log(`⏰ Lead ${lead.id} - Tempo na fase: ${daysPassed} dias (${Math.floor(timeInPhase / (60 * 60 * 1000))}h) - Aguardando: ${waitDays} dias`);

              if (waitDays > 0 && (!moved || now - moved < waitDays * DAY)) {
                console.log(`⏳ Ainda não passou o tempo necessário (${waitDays} dias), pulando automação`);
                continue;
              }

              // Considerar respondido se pelo menos um campo do form está preenchido
              const fieldValues: any = {};
              const fieldAnalysis: any[] = [];

              const hasAnswers = fields.some((f: any) => {
                // Tentar ambos os nomes de campo (apiFieldName e name) para maior compatibilidade
                const primaryKey = f.apiFieldName || f.name;
                const secondaryKey = f.name || f.apiFieldName;

                const leadFields = (lead as any).fields || {};
                let val = leadFields[primaryKey];

                // Se não encontrou com primaryKey, tentar secondaryKey
                if ((val === undefined || val === null || val === '') && primaryKey !== secondaryKey) {
                  val = leadFields[secondaryKey];
                }

                fieldValues[primaryKey] = val;

                let isEmpty = true;
                if (val !== undefined && val !== null && val !== '') {
                  const strVal = `${val}`.trim();
                  isEmpty = strVal === '' || strVal === 'undefined' || strVal === 'null';
                }

                fieldAnalysis.push({
                  fieldName: f.name,
                  apiFieldName: f.apiFieldName,
                  primaryKey: primaryKey,
                  secondaryKey: secondaryKey,
                  value: val,
                  isEmpty: isEmpty,
                  type: typeof val
                });

                return !isEmpty;
              });

              console.log(`📊 Análise dos campos do formulário para lead ${lead.id}:`, {
                totalFields: fields.length,
                hasAnswers: hasAnswers,
                fieldAnalysis: fieldAnalysis,
                leadName: (lead.fields as any)?.contactName || (lead.fields as any)?.companyName || 'Sem nome'
              });

              const recentlyExecuted = this.hasRecentlyExecuted(lead, automation.id, DAY);
              console.log(`🔄 Já executado recentemente (${automation.name}): ${recentlyExecuted}`);

              if (hasAnswers && !recentlyExecuted) {
                console.log(`✅ ✨ DISPARANDO AUTOMAÇÃO form-answered ✨`, {
                  leadId: lead.id,
                  leadName: (lead.fields as any)?.contactName || (lead.fields as any)?.companyName || 'Sem nome',
                  automationId: automation.id,
                  automationName: automation.name,
                  phaseId: targetPhase,
                  waitDays: waitDays,
                  daysPassed: daysPassed,
                  totalFields: fields.length,
                  answeredFields: fieldAnalysis.filter(f => !f.isEmpty).length,
                  actions: automation.actions?.map(a => a.type).join(', ')
                });
                try {
                  await this.executeAutomation(automation, lead, boardId, ownerId);
                  await this.markExecuted(ownerId, boardId, lead, automation.id);
                  console.log(`✅ Automação form-answered executada com sucesso para lead ${lead.id}`);
                } catch (executeError) {
                  console.error(`❌ Erro ao executar automação form-answered para lead ${lead.id}:`, executeError);
                }
              } else {
                const reasons = [];
                if (!hasAnswers) reasons.push(`Nenhum campo preenchido (0/${fields.length})`);
                if (recentlyExecuted) reasons.push('Já executado nas últimas 24h');

                console.log(`⏭️ Não executando automação form-answered para lead ${lead.id}:`, {
                  leadName: (lead.fields as any)?.contactName || (lead.fields as any)?.companyName || 'Sem nome',
                  reasons: reasons.join(', '),
                  hasAnswers: hasAnswers,
                  recentlyExecuted: recentlyExecuted,
                  fieldsWithValues: fieldAnalysis.filter(f => !f.isEmpty).map(f => ({
                    field: f.fieldName,
                    apiField: f.apiFieldName,
                    value: typeof f.value === 'string' ? f.value.substring(0, 50) : f.value
                  }))
                });
              }
            }
          } catch (e) {
            console.warn('Falha ao avaliar automação baseada em tempo para lead:', lead.id, e);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao processar automações baseadas em tempo:', error);
    } finally {
      // Liberar lock
      this.timeAutomationLocks.delete(lockKey);
    }
  }

  private hasRecentlyExecuted(lead: Lead, automationId: string, withinMs: number): boolean {
    try {
      const executedAutomations = (lead as any).executedAutomations || {};
      const record = executedAutomations[automationId];

      if (!record) {
        return false;
      }

      let timestamp = null;
      const lastExecutedAt = record.lastExecutedAt;

      if (lastExecutedAt?.toDate) {
        timestamp = lastExecutedAt.toDate().getTime();
      } else if (lastExecutedAt?.seconds) {
        timestamp = lastExecutedAt.seconds * 1000;
      } else if (lastExecutedAt) {
        try {
          timestamp = new Date(lastExecutedAt).getTime();
        } catch {
          timestamp = null;
        }
      }

      if (!timestamp) {
        return false;
      }

      const elapsed = Date.now() - timestamp;
      const isRecent = elapsed < withinMs;

      return isRecent;
    } catch (error) {
      console.error(`Erro ao verificar execução recente para automação ${automationId}:`, error);
      return false;
    }
  }

  private hasRecentlyExecutedForDays(lead: Lead, automationId: string, days: number, withinMs: number): boolean {
    try {
      const executedAutomations = (lead as any).executedAutomations || {};
      const key = `${automationId}_${days}days`;
      const record = executedAutomations[key];

      if (!record) {
        return false;
      }

      let timestamp = null;
      const lastExecutedAt = record.lastExecutedAt;

      if (lastExecutedAt?.toDate) {
        timestamp = lastExecutedAt.toDate().getTime();
      } else if (lastExecutedAt?.seconds) {
        timestamp = lastExecutedAt.seconds * 1000;
      } else if (lastExecutedAt) {
        try {
          timestamp = new Date(lastExecutedAt).getTime();
        } catch {
          timestamp = null;
        }
      }

      if (!timestamp) {
        return false;
      }

      const elapsed = Date.now() - timestamp;
      const isRecent = elapsed < withinMs;


      return isRecent;
    } catch (error) {
      console.error(`Erro ao verificar execução recente para automação ${automationId} (${days} dias):`, error);
      return false;
    }
  }

  private async markExecuted(ownerId: string, boardId: string, lead: Lead, automationId: string) {
    try {
      const exec = { ...((lead as any).executedAutomations || {}) };
      const now = new Date();
      exec[automationId] = { lastExecutedAt: now };

      await this.firestoreService.updateLead(ownerId, boardId, lead.id!, { executedAutomations: exec } as any);
    } catch (error) {
      console.error(`Erro ao marcar automação ${automationId} como executada para lead ${lead.id}:`, error);
    }
  }

  private async markExecutedForDays(ownerId: string, boardId: string, lead: Lead, automationId: string, days: number) {
    try {
      const exec = { ...((lead as any).executedAutomations || {}) };
      const now = new Date();
      const key = `${automationId}_${days}days`;
      exec[key] = { lastExecutedAt: now, automationId, days };

      console.log(`✅ Marcando execução para ${key}: ${now.toISOString()}`);

      await this.firestoreService.updateLead(ownerId, boardId, lead.id!, { executedAutomations: exec } as any);
    } catch (error) {
      console.error(`Erro ao marcar automação ${automationId} (${days} dias) como executada para lead ${lead.id}:`, error);
    }
  }

  // Gerar hash simples de uma string (para detectar conteúdo duplicado)
  private generateSimpleHash(str: string): string {
    let hash = 0;
    if (!str || str.length === 0) return '0';
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
}