import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { LoginRequestModel } from '../models/auth/login-request-model';

@Component({
  selector: 'ep-login',
  imports: [FormField, FormRoot],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loginFailed = signal(false);

  protected readonly fields = signal({
    email: '',
    password: ''
  })

  protected readonly credentials = form(
    this.fields,
    f => {
      required(f.email);
      required(f.password);
    },
    {
      submission: {
        action: async () => await this.login()
      }
    }
  )

  private async login() {
    this.loginFailed.set(false);
    const { email, password } = this.credentials().value();
    const request: LoginRequestModel = { email, password };

    try {
      await firstValueFrom(this.authService.login(request));
      await this.router.navigateByUrl('/');
      return;
    } catch {
      this.loginFailed.set(true);
    }
  }
}
