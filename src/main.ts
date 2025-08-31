import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

// Disable console logs in production for security
if (environment.production) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  // Keep console.error for debugging critical issues
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
