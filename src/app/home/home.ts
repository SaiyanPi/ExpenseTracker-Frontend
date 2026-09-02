import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'ep-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly authService = inject(AuthService);
  protected readonly user = this.authService.currentUser
  protected readonly userName = this.authService.name;
  private readonly router = inject(Router);

  navigateToDashboard() {
    this.router.navigate(['/app/dashboard']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
