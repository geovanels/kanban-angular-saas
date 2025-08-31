import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-automation-modal',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './automation-modal.html',
  styleUrl: './automation-modal.scss'
})
export class AutomationModal implements OnInit {
  @Input() isVisible = false;
  @Input() automation: any = null;
  @Input() phases: any[] = [];
  @Input() emailTemplates: any[] = [];
  @Input() users: any[] = [];
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
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: [''],
      name: ['', Validators.required],
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

    if (!this.showTriggerPhase) {
      this.automationForm.get('triggerPhase')?.setValue('');
    }
    
    if (!this.showTriggerTime) {
      this.automationForm.get('triggerDays')?.setValue(1);
    }
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

  getAutomationTypeName(triggerType: string): string {
    const types: { [key: string]: string } = {
      'new-lead-created': 'Novo Lead',
      'card-enters-phase': 'Entrada em Fase',
      'card-in-phase-for-time': 'Tempo em Fase',
      'form-not-answered': 'Formulário Pendente',
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
