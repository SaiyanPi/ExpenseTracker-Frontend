import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { Home } from "./home/home";
import { Register } from "./register/register";
import { ForgotPassword } from "./forgot-password/forgot-password";
import { ResetPassword } from "./reset-password/reset-password";
import { loggedInGuard } from "./logged-in-guard";
import { notLoggedInGuard } from "./not-logged-in-guard";
import { AuthService } from "./services/auth-service";
import { inject } from "@angular/core";

export const routes: Routes = [
  { path: '', component: Home, canActivate: [notLoggedInGuard] },

  { path: 'login', component: Login, canActivate: [notLoggedInGuard] },

  { path: 'forgot-password', component: ForgotPassword, canActivate: [notLoggedInGuard] },

  { path: 'reset-password', component: ResetPassword, canActivate: [notLoggedInGuard] },

  { path: 'register', component: Register, canActivate: [notLoggedInGuard] },

  { path: 'layout',
    canActivate: [loggedInGuard],
    loadChildren: () => import('./layout.routes').then(m => m.layoutRoutes)
  },

  {
    path: '**',
    redirectTo: () => {
      const authService = inject(AuthService);

      return authService.isAuthenticated()
        ? '/layout/dashboard'
        : '/';
    }
  }

]
