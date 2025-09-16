import { Injectable, inject } from '@angular/core';
import { FirestoreService, Lead, Column } from './firestore.service';
import { SmtpService } from './smtp.service';
import { SubdomainService } from './subdomain.service';
import { CompanyService } from './company.service';
import { Observable, from } from 'rxjs';

export interface AutomationTrigger {
  type: 'new-lead-created' | 'card-enters-phase' | 'card-in-phase-for-time' | 'form-not-answered' | 'sla-overdue';
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

  // Processar automações quando um novo lead é criado
  async processNewLeadAutomations(lead: Lead, boardId: string, ownerId: string): Promise<void> {
    try {
      // Buscar automações ativas do quadro
      const automations = await this.firestoreService.getAutomations(ownerId, boardId);
      const newLeadAutomations = (automations as Automation[]).filter(automation => {
        if (!automation || !automation.active) return false;
        // Aceitar dois formatos de trigger: tipo plano ou objeto
        const type = (automation as any).triggerType || (automation as any).trigger?.type;
        // Se automação exigir fase (alguns setups), só dispare se lead entrou na fase inicial
        const triggerPhase = (automation as any).triggerPhase || (automation as any).trigger?.phase;
        if (triggerPhase) {
          // Se há triggerPhase, só execute se o lead estiver nessa fase E for a fase inicial
          return type === 'new-lead-created' && lead.columnId === triggerPhase;
        }
        return type === 'new-lead-created';
      });

      // Executar cada automação
      for (const automation of newLeadAutomations) {
        await this.executeAutomation(automation, lead, boardId, ownerId);
      }
    } catch (error) {
      console.error('Erro ao processar automações de novo lead:', error);
    }
  }

  // Processar automações quando um lead muda de fase
  async processPhaseChangeAutomations(lead: Lead, newColumnId: string, oldColumnId: string, boardId: string, ownerId: string): Promise<void> {
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
      // Deduplicar envios muito próximos para mesma automação/lead/assunto
      const existing = await this.firestoreService.findRecentOutboxEmail(ownerId, boardId, {
        automationId: automation?.id || undefined,
        leadId: lead.id,
        subject: processedSubject,
        withinMs: 60 * 1000
      });
      if (existing) outboxId = existing;

      const ref: any = outboxId ? { id: outboxId } : await this.firestoreService.createOutboxEmail(ownerId, boardId, {
        to: toValue,
        subject: processedSubject,
        html: processedContent,
        leadId: lead.id,
        automationId: automation?.id || null,
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
    try {
      if (!leads || leads.length === 0) {
        return;
      }
      
      const automations = await this.firestoreService.getAutomations(ownerId, boardId);
      const list = (automations as Automation[]).filter(a => a && a.active);
      
      if (list.length === 0) {
        return;
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
              if (elapsed >= days * DAY && !this.hasRecentlyExecuted(lead, automation.id, DAY)) {
                await this.executeAutomation(automation, lead, boardId, ownerId);
                await this.markExecuted(ownerId, boardId, lead, automation.id);
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
              if (phaseId && lead.columnId !== phaseId) {
                continue;
              }

              const fields = await getFormFieldsForPhase(targetPhase);
              
              if (!fields || fields.length === 0) {
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

              if (!moved || now - moved < waitDays * DAY) {
                continue;
              }

              // Considerar não respondido se todos os campos do form estão vazios
              const fieldValues: any = {};
              const fieldAnalysis: any[] = [];
              
              const allEmpty = fields.every((f: any) => {
                const key = f.apiFieldName || f.name;
                const val = (lead as any).fields?.[key];
                fieldValues[key] = val;
                
                let isEmpty = true;
                if (val !== undefined && val !== null && val !== '') {
                  const strVal = `${val}`.trim();
                  isEmpty = strVal === '' || strVal === 'undefined' || strVal === 'null';
                }
                
                fieldAnalysis.push({
                  fieldName: f.name,
                  apiFieldName: f.apiFieldName,
                  value: val,
                  isEmpty: isEmpty,
                  type: typeof val
                });
                
                return isEmpty;
              });

              if (allEmpty && !this.hasRecentlyExecuted(lead, automation.id, DAY)) {
                try {
                  await this.executeAutomation(automation, lead, boardId, ownerId);
                  await this.markExecuted(ownerId, boardId, lead, automation.id);
                } catch (executeError) {
                  console.error(`Erro ao executar automação form-not-answered para lead ${lead.id}:`, executeError);
                }
              }
            }
          } catch (e) {
            console.warn('Falha ao avaliar automação baseada em tempo para lead:', lead.id, e);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao processar automações baseadas em tempo:', error);
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
}