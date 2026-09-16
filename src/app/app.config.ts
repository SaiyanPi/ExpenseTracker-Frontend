import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { routes } from './app.routes';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideSignalFormsConfig } from '@angular/forms/signals';
import { jwtInterceptor } from './interceptor/jwt-interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideSignalFormsConfig({
      classes: {
        'is-invalid': field => field.state().invalid() && field.state().touched()
      }
    }),

    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};
