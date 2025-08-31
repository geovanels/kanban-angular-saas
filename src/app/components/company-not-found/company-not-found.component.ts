import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="company-not-found-container">
      <h2>Empresa não encontrada</h2>
      <p>A empresa que você está procurando não foi encontrada ou está inativa.</p>
      <a href="https://apps.taskboard.com.br" class="btn btn-primary">
        Voltar ao portal principal
      </a>
    </div>
  `,
  styles: [`
    .company-not-found-container {
      padding: 40px;
      text-align: center;
      min-height: 50vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .btn {
      padding: 12px 24px;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
    }
  `]
})
export class CompanyNotFoundComponent {
}