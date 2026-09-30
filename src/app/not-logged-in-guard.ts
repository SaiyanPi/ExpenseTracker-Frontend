import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth-service';
import { inject } from '@angular/core';

export const notLoggedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // return authService.currentUser() === undefined || router.parseUrl('/layout/dashboard');
  return !authService.isAuthenticated() || router.parseUrl('/layout/dashboard');
};
