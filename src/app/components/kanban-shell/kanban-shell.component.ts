import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BoardStoreService } from '../../services/board-store.service';

@Component({
  selector: 'app-kanban-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kanban-shell.component.html',
  styleUrls: ['./kanban-shell.component.scss']
})
export class KanbanShellComponent implements OnInit {
  boardStore = inject(BoardStoreService);
  private route = inject(ActivatedRoute);

  tabs = [
    { path: './', name: 'Kanban', icon: 'fa-columns', exact: true },
    { path: './form', name: 'Formulário', icon: 'fa-list', exact: false },
    { path: './flow', name: 'Fluxo', icon: 'fa-project-diagram', exact: false },
    { path: './reports', name: 'Relatórios', icon: 'fa-chart-bar', exact: false },
    { path: './outbox', name: 'Caixa de Saída', icon: 'fa-paper-plane', exact: false },
    { path: './templates', name: 'Templates', icon: 'fa-envelope', exact: false },
    { path: './api', name: 'API', icon: 'fa-code', exact: false },
    { path: './automations', name: 'Automações', icon: 'fa-gears', exact: false },
  ];

  mobileTabsOpen = false;

  async ngOnInit() {
    const boardId = this.route.snapshot.paramMap.get('boardId') || '';
    const ownerId = this.route.snapshot.queryParamMap.get('ownerId') || '';
    await this.boardStore.initialize(boardId, ownerId);
  }

  toggleMobileTabs() {
    this.mobileTabsOpen = !this.mobileTabsOpen;
  }
}
