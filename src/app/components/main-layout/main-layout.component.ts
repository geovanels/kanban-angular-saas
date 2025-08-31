import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalHeaderComponent } from '../global-header/global-header.component';
import { GlobalFooterComponent } from '../global-footer/global-footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, GlobalHeaderComponent, GlobalFooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Global Header -->
      <app-global-header></app-global-header>
      
      <!-- Main Content -->
      <main class="flex-1">
        <ng-content></ng-content>
      </main>
      
      <!-- Global Footer -->
      <app-global-footer></app-global-footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class MainLayoutComponent {
}