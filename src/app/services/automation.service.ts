import { Injectable, inject } from '@angular/core';
import { FirestoreService, Lead, Column } from './firestore.service';
import { SmtpService } from './smtp.service';
import { SubdomainService } from './subdomain.service';
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

  // Processar automações quando um novo lead é criado
  async processNewLeadAutomations(lead: Lead, boardId: string, ownerId: string): Promise<void> {
    console.log('🤖 Processando automações para novo lead:', lead.id);
    
    try {
      // Buscar automações ativas do quadro
      const automations = await this.firestoreService.getAutomations(ownerId, boardId);
      const newLeadAutomations = (automations as Automation[]).filter(automation => 
        automation.active && automation.triggerType === 'new-lead-created'
      );

      console.log(`📋 Encontradas ${newLeadAutomations.length} automações para novo lead`);

      // Executar cada automação
      for (const automation of newLeadAutomations) {
        await this.executeAutomation(automation, lead, boardId, ownerId);
      }
    } catch (error) {
      console.error('❌ Erro ao processar automações de novo lead:', error);
    }
  }

  // Processar automações quando um lead muda de fase
  async processPhaseChangeAutomations(lead: Lead, newColumnId: string, oldColumnId: string, boardId: string, ownerId: string): Promise<void> {
    console.log('🤖 Processando automações para mudança de fase:', { leadId: lead.id, oldColumnId, newColumnId });
    
    try {
      // Buscar automações ativas do quadro
      const automations = await this.firestoreService.getAutomations(ownerId, boardId);
      const phaseChangeAutomations = (automations as Automation[]).filter(automation => 
        automation.active && 
        automation.triggerType === 'card-enters-phase' &&
        automation.triggerPhase === newColumnId
      );

      console.log(`📋 Encontradas ${phaseChangeAutomations.length} automações para entrada na fase`);

      // Executar cada automação
      for (const automation of phaseChangeAutomations) {
        await this.executeAutomation(automation, lead, boardId, ownerId);
      }
    } catch (error) {
      console.error('❌ Erro ao processar automações de mudança de fase:', error);
    }
  }

  // Executar uma automação específica
  private async executeAutomation(automation: Automation, lead: Lead, boardId: string, ownerId: string): Promise<void> {
    console.log(`🚀 Executando automação: ${automation.name}`, automation);

    try {
      // Executar cada ação da automação
      for (const action of automation.actions) {
        await this.executeAction(action, lead, boardId, ownerId, automation);
      }

      // Registrar no histórico
      await this.addAutomationHistory(automation, lead, boardId, ownerId, 'success');
      
      console.log(`✅ Automação executada com sucesso: ${automation.name}`);
    } catch (error) {
      console.error(`❌ Erro ao executar automação ${automation.name}:`, error);
      
      // Registrar erro no histórico
      await this.addAutomationHistory(automation, lead, boardId, ownerId, 'error', (error as Error).message);
    }
  }

  // Executar uma ação específica
  private async executeAction(action: AutomationAction, lead: Lead, boardId: string, ownerId: string, automation: Automation): Promise<void> {
    console.log(`🎯 Executando ação: ${action.type}`, action);

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
        console.warn(`⚠️ Tipo de ação não reconhecido: ${action.type}`);
    }
  }

  // Executar ação de envio de email
  private async executeSendEmailAction(action: AutomationAction, lead: Lead, boardId: string, ownerId: string): Promise<void> {
    if (!action.templateId) {
      throw new Error('Template de email não especificado');
    }

    console.log('📧 Executando ação de envio de email:', { templateId: action.templateId, leadEmail: lead.fields.contactEmail });

    // Buscar template de email
    const templates = await this.firestoreService.getEmailTemplates(ownerId, boardId);
    const template = (templates as any[]).find(t => t.id === action.templateId);
    
    if (!template) {
      throw new Error(`Template de email não encontrado: ${action.templateId}`);
    }

    // Verificar se o lead tem email
    if (!lead.fields.contactEmail) {
      console.warn('⚠️ Lead não possui email para envio:', lead.id);
      return;
    }

    // Processar template com dados do lead
    const processedContent = this.processEmailTemplate(template.content, lead);
    const processedSubject = this.processEmailTemplate(template.subject || template.name, lead);

    // Enviar email via SmtpService
    const emailData = {
      to: lead.fields.contactEmail,
      subject: processedSubject,
      html: processedContent
    };

    return new Promise((resolve, reject) => {
      this.smtpService.sendEmail(emailData).subscribe({
        next: (response) => {
          console.log('✅ Email enviado com sucesso:', response);
          resolve();
        },
        error: (error) => {
          console.error('❌ Erro ao enviar email:', error);
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

    console.log('➡️ Executando ação de mover para fase:', { leadId: lead.id, phaseId: action.phaseId });

    // Atualizar lead para nova fase
    await this.firestoreService.updateLead(ownerId, boardId, lead.id!, {
      columnId: action.phaseId,
      movedToCurrentColumnAt: new Date()
    });
  }

  // Executar ação de atribuir usuário
  private async executeAssignUserAction(action: AutomationAction, lead: Lead, boardId: string, ownerId: string): Promise<void> {
    if (!action.userId) {
      throw new Error('Usuário não especificado');
    }

    console.log('👤 Executando ação de atribuir usuário:', { leadId: lead.id, userId: action.userId });

    // Atualizar lead com usuário atribuído
    await this.firestoreService.updateLead(ownerId, boardId, lead.id!, {
      responsibleUserId: action.userId,
      responsibleUserName: '', // Será preenchido pelo serviço se necessário
      responsibleUserEmail: ''  // Será preenchido pelo serviço se necessário
    });
  }

  // Executar ação de adicionar nota
  private async executeAddNoteAction(action: AutomationAction, lead: Lead, boardId: string, ownerId: string): Promise<void> {
    if (!action.note) {
      throw new Error('Nota não especificada');
    }

    console.log('📝 Executando ação de adicionar nota:', { leadId: lead.id, note: action.note });

    // Processar nota com dados do lead
    const processedNote = this.processEmailTemplate(action.note, lead);

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
  private processEmailTemplate(template: string, lead: Lead): string {
    if (!template) return '';

    let processed = template;
    
    // Substituir variáveis do lead
    const variables = {
      '{{contactName}}': lead.fields.contactName || '',
      '{{companyName}}': lead.fields.companyName || '',
      '{{contactEmail}}': lead.fields.contactEmail || '',
      '{{contactPhone}}': lead.fields.contactPhone || '',
      '{{cnpj}}': lead.fields.cnpj || ''
    };

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

    return processed;
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
      console.log('📊 Item adicionado ao histórico de automação:', historyItem);
    } catch (error) {
      console.error('❌ Erro ao adicionar ao histórico de automação:', error);
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
  async processTimeBasedAutomations(): Promise<void> {
    // Este método pode ser chamado por um cron job ou service worker
    // para verificar automações baseadas em tempo
    console.log('🕒 Processando automações baseadas em tempo...');
    // Implementar lógica de automações de tempo se necessário
  }
}