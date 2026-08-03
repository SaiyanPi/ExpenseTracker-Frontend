import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { jwtInterceptor } from './interceptor/jwt-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideSignalFormsConfig({
      classes: {
        'is-invalid': field => field.state().invalid() && field.state().touched()
      }
    }),
    
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};
