import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-create-board-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss']
})
export class CreateBoardModalComponent {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);

  @Output() boardCreated = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  boardName = '';
  boardDescription = '';
  isLoading = false;
  errorMessage = '';
  isVisible = false;

  show() {
    this.isVisible = true;
    this.resetForm();
  }

  hide() {
    this.isVisible = false;
    this.closeModal.emit();
  }

  resetForm() {
    this.boardName = '';
    this.boardDescription = '';
    this.errorMessage = '';
    this.isLoading = false;
  }

  async createBoard() {
    if (!this.boardName.trim()) {
      this.errorMessage = 'Nome do quadro é obrigatório';
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Usuário não autenticado';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Criar o quadro
      const boardData = {
        name: this.boardName.trim(),
        description: this.boardDescription.trim(),
        companyId: '', // Será preenchido pelo FirestoreService
        createdAt: null // será preenchido pelo serverTimestamp
      };

      const boardRef = await this.firestoreService.createBoard(currentUser.uid, boardData);
      
      // Atualizar com email do usuário após criação
      await this.firestoreService.updateBoard(currentUser.uid, boardRef.id, {
        ownerEmail: currentUser.email || ''
      });

      // Definir campos fixos para leads (igual ao sistema original)
      const fixedLeadFields = [
        { name: "companyName", label: "Nome da Empresa", type: "text", required: true },
        { name: "cnpj", label: "CNPJ", type: "cnpj", required: true },
        { name: "contactName", label: "Nome Contato", type: "text", required: true },
        { name: "contactEmail", label: "Email Contato", type: "email", required: true },
        { name: "contactPhone", label: "Telefone Contato", type: "tel", required: true }
      ];

      // Criar coluna inicial "Novo Lead"
      await this.firestoreService.createColumn(currentUser.uid, boardRef.id, {
        name: "Novo Lead",
        order: 0,
        color: "#4A90E2",
        endStageType: 'none',
        companyId: '' // Será preenchido pelo FirestoreService
      });

      // Emitir evento de sucesso
      this.boardCreated.emit();
      this.hide();
      
    } catch (error: any) {
      console.error('Erro ao criar quadro:', error);
      this.errorMessage = 'Erro ao criar quadro. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.hide();
    }
  }
}