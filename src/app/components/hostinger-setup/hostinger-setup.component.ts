import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubdomainService } from '../../services/subdomain.service';

@Component({
  selector: 'app-hostinger-setup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hostinger-setup-container">
      <div class="card">
        <div class="card-header">
          <h3><i class="fas fa-server"></i> Configuração Hostinger</h3>
          <p class="text-muted">Instruções para configurar subdomínios no Hostinger</p>
        </div>
        
        <div class="card-body">
          <!-- Status Messages -->
          <div class="alert alert-success mt-3" *ngIf="successMessage()">
            <i class="fas fa-check-circle"></i>
            {{successMessage()}}
          </div>
          
          <div class="alert alert-danger mt-3" *ngIf="errorMessage()">
            <i class="fas fa-exclamation-circle"></i>
            {{errorMessage()}}
          </div>
          
          <p>Configuração em desenvolvimento...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hostinger-setup-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .card-header h3 {
      margin: 0;
      color: #495057;
    }
    
    .alert {
      border-radius: 8px;
      border: none;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  `]
})
export class HostingerSetupComponent {
  private subdomainService = inject(SubdomainService);
  
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  private showSuccess(message: string) {
    this.successMessage.set(message);
    this.errorMessage.set(null);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  private showError(message: string) {
    this.errorMessage.set(message);
    this.successMessage.set(null);
    setTimeout(() => this.errorMessage.set(null), 5000);
  }
}