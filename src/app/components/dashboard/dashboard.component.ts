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
    this.createBoardModal.show();
  }

  onBoardCreated() {
    // Recarregar a lista de quadros
    this.loadBoards();
  }

  toggleConfigMenu() {
    this.showConfigMenu = !this.showConfigMenu;
  }

  // Método adicional para fechar menu ao clicar fora
  closeConfigMenu() {
    this.showConfigMenu = false;
  }
}