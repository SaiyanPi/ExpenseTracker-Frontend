import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { LoginRequestModel } from '../models/auth/login-request-model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponseModel } from '../models/error/api-error-response-model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'ep-login',
  imports: [FormField, FormRoot, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

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

  private async login() {
    // this.loginFailed.set(false);
    // Clearing serverValidationErrors them before every login attempt:
    this.serverValidationErrors.set({});

    const { email, password } = this.credentials().value();
    const request: LoginRequestModel = { email, password };

    try {
      await firstValueFrom(this.authService.login(request));
      await this.router.navigateByUrl('/categories');
      return;
    } catch(error) {
      if (error instanceof HttpErrorResponse) {
        const apiError = error.error as ApiErrorResponseModel;

        if (apiError.details) {
          // Display field-level validation errors.
          this.serverValidationErrors.set(apiError.details);
          // 👇use snackBar only for general error not for field specific error
          // this.snackBar.open(
          //   apiError.message,
          //   'Close', { duration: 5000}
          // );
        } else {
          // Display a general error.
          this.snackBar.open(apiError.message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }

      }

      return [{ kind: 'server', message: 'Something went wrong.' }];
    }
  }

}
