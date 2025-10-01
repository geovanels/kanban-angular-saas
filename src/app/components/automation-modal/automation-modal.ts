import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-automation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './automation-modal.html',
  styleUrls: ['./automation-modal.scss']
})
export class AutomationModal implements OnInit {
  @Input() isVisible = false;
  @Input() automation: any = null;
  @Input() phases: any[] = [];
  @Input() emailTemplates: any[] = [];
  @Input() users: any[] = [];
  @Input() allowedTriggerTypes: string[] | null = null; // se null, usa padrão
  @Input() fixedPhaseId: string | null = null;
  @Input() allowedTransitions: Record<string, string[]> = {};
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() saveAutomation = new EventEmitter<any>();

  automationForm: FormGroup;
  modalTitle = 'Criar Automação';
  isEditing = false;
  showTriggerPhase = false;
  showTriggerTime = false;

  constructor(private fb: FormBuilder) {
    this.automationForm = this.createForm();
  }

  getFixedPhaseName(): string {
    if (!this.fixedPhaseId || !Array.isArray(this.phases)) return 'Fase selecionada';
    const found = this.phases.find((p: any) => p && p.id === this.fixedPhaseId);
    return (found && found.name) ? found.name : 'Fase selecionada';
  }

  ngOnInit() {
    if (this.automation) {
      this.isEditing = true;
      this.modalTitle = 'Editar Automação';
      this.loadAutomationData();
    }
    // Se veio atrelado a uma fase fixa, predefinir a fase
    if (this.fixedPhaseId) {
      this.automationForm.get('triggerPhase')?.setValue(this.fixedPhaseId);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: [''],
      // Nome opcional (gera automático no submit caso vazio)
      name: [''],
      triggerType: ['new-lead-created', Validators.required],
      triggerPhase: [''],
      triggerDays: [1],
      actions: this.fb.array([])
    });
  }

  private createActionGroup(existing?: any): FormGroup {
    const group = this.fb.group({
      type: ['send-email'],
      templateId: [''],
      phaseId: [''],
      userId: [''],
      note: ['']
    });
    if (existing) {
      group.patchValue(existing);
    }
    return group;
  }

  loadAutomationData() {
    if (this.automation) {
      console.log('📝 Carregando dados da automação:', this.automation);

      // Suportar dois formatos: direto (triggerType) ou aninhado (trigger.type)
      const trigger = this.automation.trigger || {};
      const triggerType = this.automation.triggerType ?? trigger.type ?? 'new-lead-created';
      const triggerPhase = this.automation.triggerPhase ?? trigger.phase ?? '';
      const triggerDays = this.automation.triggerDays ?? trigger.days ?? 1;

      console.log('🔍 Valores extraídos:', { triggerType, triggerPhase, triggerDays });

      this.automationForm.patchValue({
        id: this.automation.id,
        name: this.automation.name,
        triggerType: triggerType,
        triggerPhase: triggerPhase,
        triggerDays: triggerDays
      });

      console.log('📋 Form após patchValue:', this.automationForm.value);

      const actionsArray = this.automationForm.get('actions') as FormArray;
      actionsArray.clear();

      if (this.automation.actions) {
        this.automation.actions.forEach((action: any) => {
          actionsArray.push(this.createActionGroup(action));
        });
      }

      // Delay para garantir que o Angular atualize a view antes de chamar onTriggerTypeChange
      setTimeout(() => {
        this.onTriggerTypeChange();
      }, 0);
    }
  }

  onTriggerTypeChange() {
    const triggerType = this.automationForm.get('triggerType')?.value;

    this.showTriggerPhase = triggerType === 'card-enters-phase' ||
                           triggerType === 'card-in-phase-for-time' ||
                           triggerType === 'form-not-answered' ||
                           triggerType === 'form-answered' ||
                           triggerType === 'sla-overdue';

    this.showTriggerTime = triggerType === 'card-in-phase-for-time' || triggerType === 'form-not-answered' || triggerType === 'form-answered';

    const triggerPhaseCtrl = this.automationForm.get('triggerPhase');
    const triggerDaysCtrl = this.automationForm.get('triggerDays');

    if (this.showTriggerPhase) {
      triggerPhaseCtrl?.setValidators([Validators.required]);
      const currentVal = triggerPhaseCtrl?.value;
      const desired = this.fixedPhaseId || currentVal || (this.phases && this.phases[0]?.id) || '';
      if (desired) triggerPhaseCtrl?.setValue(desired);
    } else {
      triggerPhaseCtrl?.clearValidators();
      triggerPhaseCtrl?.setValue('');
    }
    triggerPhaseCtrl?.updateValueAndValidity({ emitEvent: false });

    if (this.showTriggerTime) {
      // Para form-answered, permitir 0 (imediato)
      const minValue = triggerType === 'form-answered' ? 0 : 1;
      triggerDaysCtrl?.setValidators([Validators.required, Validators.min(minValue)]);
      // Definir valor padrão adequado
      if (triggerType === 'form-answered' && !triggerDaysCtrl?.value) {
        triggerDaysCtrl?.setValue(0);
      }
    } else {
      triggerDaysCtrl?.clearValidators();
      triggerDaysCtrl?.setValue(1);
    }
    triggerDaysCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  // Lista de fases permitidas para a ação "mover para fase"
  getAllowedPhasesForMoveAction(): any[] {
    try {
      const fromPhaseId = this.fixedPhaseId || this.automationForm.get('triggerPhase')?.value || '';
      if (!fromPhaseId) {
        // Sem fase definida ainda, não listar nada para evitar confusão
        return [];
      }
      const allowedIds = (this.allowedTransitions && this.allowedTransitions[fromPhaseId]) || [];
      if (Array.isArray(allowedIds) && allowedIds.length > 0) {
        return (this.phases || []).filter((p: any) => allowedIds.includes(p.id));
      }
      // Fallback: sem configuração de fluxo, listar todas exceto a própria fase
      return (this.phases || []).filter((p: any) => p.id !== fromPhaseId);
    } catch {
      return (this.phases || []);
    }
  }

  get actionsFormArray(): FormArray {
    return this.automationForm.get('actions') as FormArray;
  }

  addAction() {
    this.actionsFormArray.push(this.createActionGroup());
  }

  removeAction(index: number) {
    this.actionsFormArray.removeAt(index);
  }

  onSubmit() {
    if (this.automationForm.valid) {
      const formValue = this.automationForm.value;
      
      const automationData = {
        ...formValue,
        name: formValue.name || `Automação ${this.getAutomationTypeName(formValue.triggerType)}`,
        actions: formValue.actions.filter((action: any) => this.isValidAction(action))
      };

      this.saveAutomation.emit(automationData);
      this.closeModal();
    }
  }

  isValidAction(action: any): boolean {
    switch (action.type) {
      case 'send-email':
        return !!action.templateId;
      case 'move-to-phase':
        return !!action.phaseId;
      case 'assign-user':
        return !!action.userId;
      case 'add-note':
        return !!action.note && action.note.trim().length > 0;
      default:
        return false;
    }
  }

  canSubmit(): boolean {
    if (!this.automationForm.valid) return false;
    // Exigir ao menos 1 ação válida
    const actions = (this.actionsFormArray?.value || []) as any[];
    return actions.some(a => this.isValidAction(a));
  }

  getAutomationTypeName(triggerType: string): string {
    const types: { [key: string]: string } = {
      'new-lead-created': 'Criar novo registro (apenas fase inicial)',
      'card-enters-phase': 'Um card entrou na fase',
      'card-in-phase-for-time': 'Um card está na fase por um tempo',
      'form-not-answered': 'Formulário da fase não respondido',
      'form-answered': 'Formulário da fase respondido',
      'sla-overdue': 'SLA Vencido'
    };
    return types[triggerType] || 'Sem Nome';
  }

  closeModal() {
    this.automationForm.reset();
    this.actionsFormArray.clear();
    this.isEditing = false;
    this.modalTitle = 'Criar Automação';
    this.showTriggerPhase = false;
    this.showTriggerTime = false;
    this.closeModalEvent.emit();
  }
}
