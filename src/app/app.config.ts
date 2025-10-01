import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideStorage, getStorage, connectStorageEmulator } from '@angular/fire/storage';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { ReactiveFormsModule } from '@angular/forms';
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

function shouldUseEmulators(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const flag = (window.localStorage?.getItem('useEmulators') || '').toLowerCase();
    return flag === '1' || flag === 'true' || flag === 'yes';
  } catch {
    return false;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();
      if (shouldUseEmulators()) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true } as any);
      }
      return auth;
    }),
    provideFirestore(() => {
      const db = getFirestore();
      if (shouldUseEmulators()) {
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
      }
      return db;
    }),
    provideStorage(() => {
      const storage = getStorage();
      if (shouldUseEmulators()) {
        connectStorageEmulator(storage, '127.0.0.1', 9199);
      }
      return storage;
    }),
    provideFunctions(() => {
      const fn = getFunctions();
      if (shouldUseEmulators()) {
        connectFunctionsEmulator(fn, '127.0.0.1', 5001);
      }
      return fn;
    }),
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
      ReactiveFormsModule
    ),
    // Garantir que os serviços sejam instanciados
    BrandingService,
    SubdomainService
  ]
};
