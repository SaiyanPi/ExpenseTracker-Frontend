import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth-service';
import { inject } from '@angular/core';

export const loggedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(AuthService);

  return userService.currentUser() !== undefined || router.parseUrl('/');
};
