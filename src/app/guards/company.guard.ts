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
      this.subdomainService.isInitialized$.subscribe((isInitialized: any) => {
        if (isInitialized) {
          const company = this.subdomainService.getCurrentCompany();
          
          // Se não há empresa, verificar se é rota pública
          if (!company) {
            const currentUrl = this.router.url;
            if (currentUrl === '/login' || currentUrl === '/' || currentUrl.startsWith('/form')) {
              // Permitir acesso a rotas públicas quando não há empresa
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
              // Verificar se é rota pública sem empresa
              const currentUrl = this.router.url;
              // Verificando URL atual
              
              if (currentUrl === '/login' || currentUrl === '/' || currentUrl.startsWith('/login?') || currentUrl.startsWith('/form')) {
                // Permitir acesso a rotas públicas mesmo sem empresa
                observer.next(true);
              } else {
                this.handleNoCompany();
                observer.next(false);
              }
            }
            observer.complete();
          }).catch(error => {
            console.error('Erro ao inicializar guard da empresa:', error);
            // Em caso de erro, permitir acesso se for rota pública
            const currentUrl = this.router.url;
            if (currentUrl === '/login' || currentUrl === '/' || currentUrl.startsWith('/login?') || currentUrl.startsWith('/form')) {
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