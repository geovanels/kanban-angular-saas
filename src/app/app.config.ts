import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { environment } from '../environments/environment';
import { CompanyInterceptor } from './interceptors/company.interceptor';
import { BrandingService } from './services/branding.service';
import { SubdomainService } from './services/subdomain.service';
import { CompanyService } from './services/company.service';

import { routes } from './app.routes';

// App initializer para aplicar branding na inicialização
function initializeBranding(brandingService: BrandingService, subdomainService: SubdomainService, companyService: CompanyService) {
  return () => {
    return new Promise<void>((resolve) => {
      // Delay para garantir que os serviços estejam prontos
      setTimeout(() => {
        // Restaurar empresa persistida (se houver)
        let company = subdomainService.getCurrentCompany() || subdomainService.restorePersistedCompany();
        if (!company) {
          // Fallback por subdomínio na URL
          companyService.getCompanyBySubdomain(companyService.getCompanySubdomain() || '').then(found => {
            if (found) {
              subdomainService.setCurrentCompany(found);
              brandingService.applyCompanyBranding(found);
            }
            resolve();
          }).catch(() => resolve());
          return;
        }
        if (company && company.brandingConfig) {
          brandingService.applyCompanyBranding(company);
        }
        resolve();
      }, 200);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    // Inicializador de branding
    {
      provide: APP_INITIALIZER,
      useFactory: initializeBranding,
      deps: [BrandingService, SubdomainService, CompanyService],
      multi: true
    },
    // HTTP Interceptor para adicionar headers da empresa
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: CompanyInterceptor, 
      multi: true 
    },
    importProvidersFrom(
      ReactiveFormsModule,
      FormlyModule.forRoot({
        validationMessages: [
          { name: 'required', message: 'Este campo é obrigatório' },
        ],
      }),
      FormlyBootstrapModule
    ),
    // Garantir que os serviços sejam instanciados
    BrandingService,
    SubdomainService
  ]
};
