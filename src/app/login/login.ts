import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { LoginRequestModel } from '../models/auth/login-request-model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponseModel } from '../models/error/api-error-response-model';

@Component({
  selector: 'ep-login',
  imports: [FormField, FormRoot],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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
      await this.router.navigateByUrl('/');
      return;
    } catch(error) {
      if (error instanceof HttpErrorResponse) {

        const apiError = error.error as ApiErrorResponseModel;

        this.serverValidationErrors.set(apiError.details ?? {});

        // const errors = [{ kind: 'server', message: apiError.message }];
        // if (apiError.details) {
        //   for (const messages of Object.values(apiError.details)) {
        //     for (const message of messages) {
        //       errors.push({ kind: 'validation', message });
        //     }
        //   }
        // }
        // return errors;
        
        return [{ kind: 'server', message: apiError.message }];

      }
      return [{ kind: 'server', message: 'Something went wrong.' }];
    }
  }

}
