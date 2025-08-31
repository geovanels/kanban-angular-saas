import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="public-form-container">
      <h2>Formulário Público</h2>
      <p>Em desenvolvimento...</p>
    </div>
  `,
  styles: [`
    .public-form-container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class PublicFormComponent {
}