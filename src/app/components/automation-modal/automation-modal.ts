import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-automation-modal',
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

  loadAutomationData() {
    if (this.automation) {
      this.automationForm.patchValue({
        id: this.automation.id,
        name: this.automation.name,
        triggerType: this.automation.triggerType,
        triggerPhase: this.automation.triggerPhase,
        triggerDays: this.automation.triggerDays
      });

      const actionsArray = this.automationForm.get('actions') as FormArray;
      actionsArray.clear();
      
      if (this.automation.actions) {
        this.automation.actions.forEach((action: any) => {
          actionsArray.push(this.fb.group(action));
        });
      }

      this.onTriggerTypeChange();
    }
  }

  onTriggerTypeChange() {
    const triggerType = this.automationForm.get('triggerType')?.value;
    
    this.showTriggerPhase = triggerType === 'card-enters-phase' || 
                           triggerType === 'card-in-phase-for-time' || 
                           triggerType === 'form-not-answered';
    
    this.showTriggerTime = triggerType === 'card-in-phase-for-time';

    const triggerPhaseCtrl = this.automationForm.get('triggerPhase');
    const triggerDaysCtrl = this.automationForm.get('triggerDays');

    if (this.showTriggerPhase) {
      triggerPhaseCtrl?.setValidators([Validators.required]);
      if (this.fixedPhaseId) {
        triggerPhaseCtrl?.setValue(this.fixedPhaseId);
      }
    } else {
      triggerPhaseCtrl?.clearValidators();
      triggerPhaseCtrl?.setValue('');
    }
    triggerPhaseCtrl?.updateValueAndValidity({ emitEvent: false });
    
    if (this.showTriggerTime) {
      triggerDaysCtrl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      triggerDaysCtrl?.clearValidators();
      triggerDaysCtrl?.setValue(1);
    }
    triggerDaysCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  get actionsFormArray(): FormArray {
    return this.automationForm.get('actions') as FormArray;
  }

  addAction() {
    const actionGroup = this.fb.group({
      type: ['send-email'],
      templateId: [''],
      phaseId: [''],
      userId: [''],
      note: ['']
    });
    
    this.actionsFormArray.push(actionGroup);
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
