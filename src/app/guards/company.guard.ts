import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { SubdomainService } from '../services/subdomain.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return new Observable(observer => {
      // Verificar se já foi inicializado
      this.subdomainService.isInitialized$.subscribe(isInitialized => {
        if (isInitialized) {
          const company = this.subdomainService.getCurrentCompany();
          
          // Se não há empresa, verificar se é a rota de login
          if (!company) {
            const currentUrl = this.router.url;
            if (currentUrl === '/login' || currentUrl === '/') {
              // Permitir acesso ao login quando não há empresa (apps.taskboard.com.br)
              observer.next(true);
              observer.complete();
            } else {
              // Empresa não encontrada em outras rotas
              this.handleNoCompany();
              observer.next(false);
              observer.complete();
            }
          } else {
            observer.next(true);
            observer.complete();
          }
        } else {
          // Inicializar contexto da empresa
          this.subdomainService.initializeFromSubdomain().then(async (company) => {
            // Empresa inicializada com sucesso
            
            if (company) {
              observer.next(true);
            } else {
              // Verificar se é rota de login sem empresa (apps.taskboard.com.br)
              const currentUrl = this.router.url;
              // Verificando URL atual
              
              if (currentUrl === '/login' || currentUrl === '/' || currentUrl.startsWith('/login?')) {
                // Se é login e há parâmetro subdomain=gobuyer, tentar criar empresa
                const urlParams = new URLSearchParams(window.location.search);
                const subdomain = urlParams.get('subdomain');
                
                if (subdomain === 'gobuyer') {
                  // Subdomain Gobuyer detectado
                  // Permitir acesso - a empresa será criada no login
                }
                
                observer.next(true);
              } else {
                this.handleNoCompany();
                observer.next(false);
              }
            }
            observer.complete();
          }).catch(error => {
            console.error('Erro ao inicializar guard da empresa:', error);
            // Em caso de erro, permitir acesso se for rota de login
            const currentUrl = this.router.url;
            if (currentUrl === '/login' || currentUrl === '/' || currentUrl.startsWith('/login?')) {
              observer.next(true);
            } else {
              this.handleError(error);
              observer.next(false);
            }
            observer.complete();
          });
        }
      });
    });
  }

  private handleNoCompany() {
    // Nenhuma empresa encontrada
    // Redirecionar para página de erro ou página principal
    // this.router.navigate(['/empresa-nao-encontrada']);
  }

  private handleError(error: any) {
    // Erro no guard da empresa
    // Redirecionar para página de erro
    // this.router.navigate(['/erro']);
  }
}