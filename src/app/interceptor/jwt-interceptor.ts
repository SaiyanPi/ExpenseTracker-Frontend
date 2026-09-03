import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const loggedUser = authService.currentUser();

  const isAuthRequest =
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/register-user') ||
    req.url.includes('/api/auth/refresh-token');

  const authReq =  loggedUser && !isAuthRequest ? req.clone({ setHeaders:
    { Authorization: `Bearer ${loggedUser.token}`}}) : req;


  return next(authReq).pipe(
    catchError(error => {

      // Don't attempt refresh for:
      // - non-401 errors
      // - login
      // - register
      // - refresh-token itself
      if (error.status !== 401 || isAuthRequest) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap(user => {
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
          return next(retryReq);
        }),

        catchError(refreshError => {
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
