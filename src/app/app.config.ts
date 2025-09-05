import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { environment } from '../environments/environment';
import { CompanyInterceptor } from './interceptors/company.interceptor';
import { BrandingService } from './services/branding.service';
import { SubdomainService } from './services/subdomain.service';

import { routes } from './app.routes';

// App initializer para aplicar branding na inicialização
function initializeBranding(brandingService: BrandingService, subdomainService: SubdomainService) {
  return () => {
    return new Promise<void>((resolve) => {
      // Delay para garantir que os serviços estejam prontos
      setTimeout(() => {
        const company = subdomainService.getCurrentCompany();
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
    provideFunctions(() => {
      const functions = getFunctions();
      // Conectar ao emulador em desenvolvimento
      if (!environment.production) {
        // Verificar se já não está conectado ao emulador
        if (!(functions as any)._delegate?._emulator) {
          try {
            connectFunctionsEmulator(functions, 'localhost', 5001);
          } catch (error) {
            console.warn('Emulador Functions já conectado:', error);
          }
        }
      }
      return functions;
    }),
    // Inicializador de branding
    {
      provide: APP_INITIALIZER,
      useFactory: initializeBranding,
      deps: [BrandingService, SubdomainService],
      multi: true
    },
    // HTTP Interceptor para adicionar headers da empresa
    { 
      provide: 'HTTP_INTERCEPTORS', 
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
