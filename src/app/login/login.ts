import { Component, effect, inject, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { LoginRequestModel } from '../models/auth/login-request-model';
import { ApiErrorService } from '../services/api-error-service';

@Component({
  selector: 'ep-login',
  imports: [FormField, FormRoot ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly apiErrorService = inject(ApiErrorService);
  protected readonly isLoggingIn = signal(false);

  // protected readonly loginFailed = signal(false);
  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly fields = signal({
    email: '',
    password: ''
  })

  protected readonly credentials = form(
    this.fields,
    f => {
      required(f.email);
      email(f.email);
      required(f.password);
    },
    {
      submission: {
        action: async () => await this.login()
      }
    }
  )

  // unlike in the category component here are multiple fields so using effect for clearing every
  // field is tedious so to reduce the boilerplate code, helper is create
  private watchField<T>(
    field: () => { value: Signal<T> },
    errorKey: string
  ) {
    effect(() => {
      field().value();
      this.apiErrorService.clearServerError(this.serverValidationErrors, errorKey);
    });
  }

  // and then use helper to clear the field errors
  constructor() {
    this.watchField(this.credentials.email, 'Email');
    this.watchField(this.credentials.password, 'Password');
  }

  private async login() {
    // this.loginFailed.set(false);
    this.isLoggingIn.set(true);

    // Clearing serverValidationErrors them before every login attempt:
    this.serverValidationErrors.set({});

    const { email, password } = this.credentials().value();
    const request: LoginRequestModel = { email, password };

    try {
      await firstValueFrom(this.authService.login(request));
      await this.router.navigateByUrl('/categories');
      return;
    } catch(error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
      return [{ kind: 'server', message: 'Something went wrong.' }];
    } finally {
      this.isLoggingIn.set(false);
    }
  }

}
