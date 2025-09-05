import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Column } from '../../services/firestore.service';

@Component({
  selector: 'app-column-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './column-modal.component.html',
  styleUrls: ['./column-modal.component.scss']
})
export class ColumnModalComponent {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private fb = inject(FormBuilder);

  @Input() ownerId: string = '';
  @Input() boardId: string = '';
  @Input() columns: Column[] = [];
  
  @Output() columnCreated = new EventEmitter<void>();
  @Output() columnUpdated = new EventEmitter<void>();
  @Output() columnDeleted = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  isVisible = false;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  currentColumn: Column | null = null;

  predefinedColors = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#14B8A6', // Teal
    '#F43F5E', // Rose
    '#A855F7', // Purple
    '#EAB308', // Yellow
    '#059669', // Emerald
    '#DC2626'  // Red-600
  ];

  columnForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    color: [this.predefinedColors[0]], // Usar primeira cor da paleta como padrão
    endStageType: ['none'],
    slaDays: [0, [Validators.min(0)]],
    isInitialPhase: [false]
  });

  endStageTypes = [
    { value: 'none', label: 'Nenhuma (fase normal)' },
    { value: 'success', label: 'Sucesso (lead convertido)' },
    { value: 'fail', label: 'Fracasso (lead perdido)' }
  ];

  showCreateModal() {
    this.isEditing = false;
    this.currentColumn = null;
    this.isVisible = true;
    this.resetForm();
  }

  showEditModal(column: Column) {
    this.isEditing = true;
    this.currentColumn = column;
    this.isVisible = true;
    this.populateForm(column);
  }

  hide() {
    this.isVisible = false;
    this.resetForm();
    this.closeModal.emit();
  }

  private resetForm() {
    // Selecionar cor baseada no número de colunas existentes
    const defaultColor = this.getNextAvailableColor();
    
    this.columnForm.reset({
      name: '',
      color: defaultColor,
      endStageType: 'none',
      slaDays: 0,
      isInitialPhase: false
    });
    this.errorMessage = '';
    this.isLoading = false;
  }

  private getNextAvailableColor(): string {
    // Cores já usadas pelas colunas existentes
    const usedColors = this.columns.map(col => col.color).filter(color => color);
    
    // Encontrar primeira cor disponível que não está sendo usada
    for (const color of this.predefinedColors) {
      if (!usedColors.includes(color)) {
        return color;
      }
    }
    
    // Se todas as cores estão sendo usadas, retornar cor baseada no índice
    const colorIndex = this.columns.length % this.predefinedColors.length;
    return this.predefinedColors[colorIndex];
  }

  private populateForm(column: Column) {
    this.columnForm.patchValue({
      name: column.name,
      color: column.color || '#3B82F6',
      endStageType: column.endStageType || 'none',
      slaDays: column.slaDays || 0,
      isInitialPhase: (column as any).isInitialPhase || false
    });
  }

  async saveColumn() {
    if (!this.columnForm.valid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formData = this.columnForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      if (this.isEditing && this.currentColumn) {
        // Atualizar coluna existente
        await this.firestoreService.updateColumn(
          this.ownerId,
          this.boardId,
          this.currentColumn.id!,
          {
            name: formData.name,
            color: formData.color,
            endStageType: formData.endStageType,
            slaDays: formData.slaDays,
            isInitialPhase: formData.isInitialPhase,
            updatedAt: new Date()
          }
        );

        this.columnUpdated.emit();
      } else {
        // Criar nova coluna
        const nextOrder = Math.max(...this.columns.map(col => col.order || 0), -1) + 1;
        
        const newColumn: Omit<Column, 'id'> = {
          name: formData.name,
          color: formData.color,
          order: nextOrder,
          endStageType: formData.endStageType,
          slaDays: formData.slaDays,
          isInitialPhase: formData.isInitialPhase,
          boardId: this.boardId,
          companyId: '', // Será preenchido pelo FirestoreService
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await this.firestoreService.createColumn(this.ownerId, this.boardId, newColumn);
        this.columnCreated.emit();
      }

      this.hide();
    } catch (error: any) {
      console.error('Erro ao salvar coluna:', error);
      this.errorMessage = 'Erro ao salvar fase. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.hide();
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.columnForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: any = {
      'name': 'Nome da Fase',
      'color': 'Cor',
      'endStageType': 'Tipo de Finalização',
      'slaDays': 'SLA (dias)'
    };
    return labels[fieldName] || fieldName;
  }

  async deleteColumn() {
    if (!this.currentColumn || !this.currentColumn.id) {
      return;
    }

    const confirmed = confirm(`Deseja excluir a fase "${this.currentColumn.name}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.firestoreService.deleteColumn(
        this.ownerId,
        this.boardId,
        this.currentColumn.id
      );

      this.columnDeleted.emit();
      this.hide();
    } catch (error: any) {
      console.error('Erro ao excluir coluna:', error);
      this.errorMessage = 'Erro ao excluir fase. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }
}