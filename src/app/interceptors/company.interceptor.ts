import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyService } from '../services/company.service';

@Injectable()
export class CompanyInterceptor implements HttpInterceptor {
  private companyService = inject(CompanyService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adicionar header com subdomínio atual para APIs internas
    const subdomain = this.companyService.getCompanySubdomain();
    
    if (subdomain && req.url.includes('/api/')) {
      const modifiedReq = req.clone({
        setHeaders: {
          'X-Company-Subdomain': subdomain
        }
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}