import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  standalone: true,
  selector: 'app-toast-container',
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 w-80">
      <div *ngFor="let m of (toast.messages$ | async)" 
           class="shadow rounded px-4 py-3 text-white"
           [ngClass]="{
             'bg-green-600': m.type === 'success',
             'bg-red-600': m.type === 'error',
             'bg-blue-600': m.type === 'info',
             'bg-yellow-600': m.type === 'warning'
           }">
        <div class="flex items-start justify-between">
          <div class="pr-3 text-sm">{{ m.text }}</div>
          <button class="text-white/80 hover:text-white ml-2" (click)="toast.dismiss(m.id)">✕</button>
        </div>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  toast = inject(ToastService);
}


