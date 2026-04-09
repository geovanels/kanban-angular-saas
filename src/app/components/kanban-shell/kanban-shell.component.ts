import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BoardStoreService } from '../../services/board-store.service';

@Component({
  selector: 'app-kanban-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kanban-shell.component.html',
  styleUrls: ['./kanban-shell.component.scss']
})
export class KanbanShellComponent implements OnInit, OnDestroy {
  boardStore = inject(BoardStoreService);
  private route = inject(ActivatedRoute);
  private paramSub?: Subscription;

  tabs = [
    { path: './', name: 'Kanban', icon: 'fa-columns', exact: true },
    { path: './form', name: 'Formulário', icon: 'fa-list', exact: false },
    { path: './flow', name: 'Fluxo', icon: 'fa-project-diagram', exact: false },
    { path: './reports', name: 'Relatórios', icon: 'fa-chart-bar', exact: false },
    { path: './outbox', name: 'Caixa de Saída', icon: 'fa-paper-plane', exact: false },
    { path: './templates', name: 'Templates', icon: 'fa-envelope', exact: false },
    { path: './api', name: 'API', icon: 'fa-code', exact: false },
  ];

  mobileTabsOpen = false;

  ngOnInit() {
    // Subscribe to route param changes so switching boards re-initializes
    this.paramSub = this.route.paramMap.subscribe(async params => {
      const boardId = params.get('boardId') || '';
      const ownerId = this.route.snapshot.queryParamMap.get('ownerId') || '';
      if (boardId) {
        await this.boardStore.initialize(boardId, ownerId);
      }
    });
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
  }

  toggleMobileTabs() {
    this.mobileTabsOpen = !this.mobileTabsOpen;
  }
}
