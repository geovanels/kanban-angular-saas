import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-center">
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span>Powered by</span>
            <div class="flex items-center space-x-1">
              <div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                <i class="fas fa-tasks text-white text-xs"></i>
              </div>
              <span class="font-semibold text-gray-700">Task Board</span>
            </div>
            <span>•</span>
            <span>Sistema de Gestão Kanban</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class GlobalFooterComponent {
}