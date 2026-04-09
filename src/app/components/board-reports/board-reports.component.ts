import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardStoreService } from '../../services/board-store.service';
import { ReportsComponent } from '../reports/reports.component';

@Component({
  selector: 'app-board-reports',
  standalone: true,
  imports: [CommonModule, ReportsComponent],
  template: `
    <app-reports [boardId]="boardStore.boardId" [ownerId]="boardStore.ownerId"></app-reports>
  `
})
export class BoardReportsComponent {
  boardStore = inject(BoardStoreService);
}
