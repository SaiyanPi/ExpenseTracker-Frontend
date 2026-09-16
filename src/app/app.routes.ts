import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { Home } from "./home/home";
import { Register } from "./register/register";
import { ForgotPassword } from "./forgot-password/forgot-password";
import { ResetPassword } from "./reset-password/reset-password";
import { loggedInGuard } from "./logged-in-guard";

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },

  { path: 'forgot-password', component: ForgotPassword },

  { path: 'reset-password', component: ResetPassword },

  { path: 'register', component: Register },

  { path: 'layout',
    canActivate: [loggedInGuard],
    loadChildren: () => import('./layout.routes').then(m => m.layoutRoutes)
  },

  {
    path: '**',
    redirectTo: ''
  }

]
