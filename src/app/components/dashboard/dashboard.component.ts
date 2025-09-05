import { Component, inject, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Board } from '../../services/firestore.service';
import { SubdomainService } from '../../services/subdomain.service';
import { CreateBoardModalComponent } from '../create-board-modal/create-board-modal.component';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { CompanyBreadcrumbComponent } from '../company-breadcrumb/company-breadcrumb.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CreateBoardModalComponent, MainLayoutComponent, CompanyBreadcrumbComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);

  @ViewChild(CreateBoardModalComponent) createBoardModal!: CreateBoardModalComponent;

  boards: Board[] = [];
  isLoading = false;
  currentUser: any = null;
  showConfigMenu = false;
  showCreateModal = false;
  activeBoardMenu: string | null = null;
  private subscription?: Subscription;
  
  // Estatísticas dos boards
  boardStats: { [boardId: string]: { columnCount: number; leadCount: number } } = {};

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.currentUser) {
      await this.loadBoards();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    // ViewChild will be available after view initialization
  }

  async loadBoards() {
    if (!this.currentUser) {
      return;
    }

    this.isLoading = true;
    try {
      this.boards = await this.firestoreService.getBoards(this.currentUser.uid);
      
      // Carregar estatísticas para cada board
      await this.loadBoardStatistics();
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      this.isLoading = false;
    }
  }
  
  private async loadBoardStatistics() {
    for (const board of this.boards) {
      if (board.id) {
        try {
          // Carregar colunas do board
          const columns = await this.firestoreService.getColumns(this.currentUser.uid, board.id);
          
          // Carregar leads do board
          const leads = await this.firestoreService.getLeads(this.currentUser.uid, board.id);
          
          // Armazenar estatísticas
          this.boardStats[board.id] = {
            columnCount: columns.length,
            leadCount: leads.length
          };
        } catch (error) {
          // Em caso de erro, usar valores padrão
          this.boardStats[board.id!] = {
            columnCount: 0,
            leadCount: 0
          };
        }
      }
    }
  }

  async logout() {
    const result = await this.authService.logout();
    if (result.success) {
      window.location.href = '/login';
    }
  }

  openBoard(boardId: string) {
    // Encontrar o board para passar o ownerId também
    const board = this.boards.find(b => b.id === boardId);
    if (board && board.owner) {
      this.router.navigate(['/kanban', boardId], { 
        queryParams: { ownerId: board.owner }
      });
    } else {
      // Fallback: tentar com o usuário atual
      this.router.navigate(['/kanban', boardId], { 
        queryParams: { ownerId: this.currentUser.uid }
      });
    }
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return '';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR');
    }
    return new Date(timestamp).toLocaleDateString('pt-BR');
  }

  showCreateBoardModal() {
    this.showCreateModal = true;
    // Wait for Angular to render the modal, then show it
    setTimeout(() => {
      if (this.createBoardModal) {
        this.createBoardModal.show();
      }
    }, 0);
  }

  onBoardCreated(event?: any) {
    // Recarregar a lista de quadros
    this.loadBoards();
    this.showCreateModal = false;
  }

  toggleBoardMenu(boardId: string) {
    this.activeBoardMenu = this.activeBoardMenu === boardId ? null : boardId;
  }

  editBoard(board: Board) {
    // TODO: Implementar edição de quadro
    this.activeBoardMenu = null;
  }

  duplicateBoard(board: Board) {
    // TODO: Implementar duplicação de quadro
    this.activeBoardMenu = null;
  }

  async deleteBoard(boardId: string) {
    const board = this.boards.find(b => b.id === boardId);
    const boardName = board?.name || 'Quadro';
    
    const confirmMessage = `⚠️ ATENÇÃO: Esta ação não pode ser desfeita!\n\n` +
      `Deseja excluir o quadro "${boardName}"?\n\n` +
      `Isso irá remover PERMANENTEMENTE:\n` +
      `• Todas as colunas/fases\n` +
      `• Todos os leads/registros\n` +
      `• Todos os templates de email\n` +
      `• Todas as automações\n` +
      `• Todo o histórico e configurações\n\n` +
      `Digite "EXCLUIR" para confirmar:`;
    
    const confirmation = prompt(confirmMessage);
    
    if (confirmation === 'EXCLUIR') {
      try {
        await this.firestoreService.deleteBoard(this.currentUser.uid, boardId);
        await this.loadBoards();
        
        // Mostrar feedback visual
        alert(`✅ Quadro "${boardName}" foi excluído com sucesso!`);
      } catch (error) {
        alert('❌ Erro ao excluir o quadro. Tente novamente.');
      }
    }
    
    this.activeBoardMenu = null;
  }

  getBoardColumnCount(boardId: string): number {
    return this.boardStats[boardId]?.columnCount || 0;
  }

  getBoardTaskCount(boardId: string): number {
    return this.boardStats[boardId]?.leadCount || 0;
  }

  toggleConfigMenu() {
    this.showConfigMenu = !this.showConfigMenu;
  }

  // Método adicional para fechar menu ao clicar fora
  closeConfigMenu() {
    this.showConfigMenu = false;
  }

  // Fechar menu do board ao clicar fora
  @HostListener('document:click', ['$event'])
  closeBoardMenu(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.board-menu-container')) {
      this.activeBoardMenu = null;
    }
  }

  // 🧹 MÉTODO TEMPORÁRIO PARA LIMPEZA DE QUADROS
  async clearAllData() {
    const confirmation = prompt(
      '🧹 LIMPEZA DE QUADROS (Preserva usuários/empresas/SMTP)\n\n' +
      '✅ SERÁ PRESERVADO:\n' +
      '• Dados dos usuários\n' +
      '• Configurações das empresas\n' +
      '• Configurações de SMTP\n' +
      '• Configurações de branding\n' +
      '• Links da empresa\n\n' +
      '❌ SERÁ REMOVIDO:\n' +
      '• Todos os quadros Kanban\n' +
      '• Todas as fases/colunas\n' +
      '• Todos os leads/registros\n' +
      '• Templates de email dos quadros\n' +
      '• Automações dos quadros\n' +
      '• Caixa de saída\n' +
      '• Histórico de automações\n\n' +
      'Digite "LIMPAR QUADROS" para confirmar:'
    );

    if (confirmation === 'LIMPAR QUADROS') {
      try {
        this.isLoading = true;
        await this.firestoreService.clearAllData(this.currentUser.uid);
        
        // Recarregar a lista de quadros (deve ficar vazia)
        await this.loadBoards();
        
        alert('✅ Banco de dados limpo com sucesso!');
        
      } catch (error) {
        alert('❌ Erro durante a limpeza. Tente novamente.');
      } finally {
        this.isLoading = false;
      }
    }
  }
}