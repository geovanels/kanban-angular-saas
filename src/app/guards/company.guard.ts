import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { SubdomainService } from '../services/subdomain.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);

  private isPublicRoute(url: string): boolean {
    return url === '/login' || url === '/' || url.startsWith('/login?') || url.startsWith('/form');
  }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const targetUrl = state.url;

    return new Observable(observer => {
      // Verificar se já foi inicializado
      this.subdomainService.isInitialized$.subscribe((isInitialized: any) => {
        if (isInitialized) {
          const company = this.subdomainService.getCurrentCompany();

          // Se não há empresa, verificar se é rota pública
          if (!company) {
            if (this.isPublicRoute(targetUrl)) {
              observer.next(true);
              observer.complete();
            } else {
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
            if (company) {
              observer.next(true);
            } else {
              if (this.isPublicRoute(targetUrl)) {
                observer.next(true);
              } else {
                this.handleNoCompany();
                observer.next(false);
              }
            }
            observer.complete();
          }).catch(error => {
            console.error('Erro ao inicializar guard da empresa:', error);
            if (this.isPublicRoute(targetUrl)) {
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