import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
export class DashboardComponent implements OnInit, OnDestroy {
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

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.currentUser) {
      // Se é usuário da Gobuyer e não há contexto de empresa, configurar
      if (this.currentUser.email?.includes('gobuyer.com.br')) {
        await this.ensureGobuyerContext();
      }
      
      await this.loadBoards();
    }
  }

  private async ensureGobuyerContext() {
    try {
      const currentCompany = this.subdomainService.getCurrentCompany();
      
      if (!currentCompany) {
        // Set up Gobuyer development context
        if (this.subdomainService.isDevelopment()) {
          localStorage.setItem('dev-subdomain', 'gobuyer');
        }
        
        // Try to get real Gobuyer company from service
        // This will attempt to load the real company data
        await this.subdomainService.initializeFromSubdomain();
      }
    } catch (error) {
      // Handle context setup errors silently
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async loadBoards() {
    if (!this.currentUser) {
      return;
    }

    this.isLoading = true;
    try {
      this.boards = await this.firestoreService.getBoards(this.currentUser.uid);
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      this.isLoading = false;
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
    console.log('Editar quadro:', board);
    this.activeBoardMenu = null;
  }

  duplicateBoard(board: Board) {
    // TODO: Implementar duplicação de quadro
    console.log('Duplicar quadro:', board);
    this.activeBoardMenu = null;
  }

  async deleteBoard(boardId: string) {
    if (confirm('Tem certeza que deseja excluir este quadro?')) {
      try {
        await this.firestoreService.deleteBoard(this.currentUser.uid, boardId);
        await this.loadBoards();
      } catch (error) {
        console.error('Erro ao excluir quadro:', error);
      }
    }
    this.activeBoardMenu = null;
  }

  getBoardColumnCount(boardId: string): number {
    // TODO: Implementar contagem real de colunas
    return 3; // Valor placeholder
  }

  getBoardTaskCount(boardId: string): number {
    // TODO: Implementar contagem real de leads
    return 0; // Valor placeholder
  }

  toggleConfigMenu() {
    this.showConfigMenu = !this.showConfigMenu;
  }

  // Método adicional para fechar menu ao clicar fora
  closeConfigMenu() {
    this.showConfigMenu = false;
  }
}