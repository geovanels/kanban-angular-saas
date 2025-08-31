import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubdomainService } from './services/subdomain.service';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private subdomainService = inject(SubdomainService);
  private firestoreService = inject(FirestoreService);
  
  protected readonly title = signal('Sistema Kanban');

  async ngOnInit() {
    try {
      console.log('🚀 Inicializando aplicação multi-empresa...');
      console.log('🌍 URL atual:', window.location.href);
      
      // Inicializar contexto da empresa baseado no subdomínio
      const company = await this.subdomainService.initializeFromSubdomain();
      
      if (company) {
        console.log('✅ Empresa carregada:', company);
        
        // Definir contexto da empresa no FirestoreService
        this.firestoreService.setCompanyContext(company);
        
        // Atualizar título da aplicação com nome da empresa
        this.title.set(`${company.name} - Sistema Kanban`);
        
        // Atualizar favicon e título da página se necessário
        this.updatePageTitle(company.name);
        
      } else {
        console.log('ℹ️ Nenhuma empresa encontrada - modo login/registro');
        this.title.set('Sistema Kanban - Login');
      }
      
    } catch (error) {
      console.error('❌ Erro ao inicializar aplicação:', error);
    }
  }

  private updatePageTitle(companyName: string) {
    if (typeof document !== 'undefined') {
      document.title = `${companyName} - Sistema Kanban`;
    }
  }
}
