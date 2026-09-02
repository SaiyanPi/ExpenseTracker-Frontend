import { Component, effect, inject, Signal, signal } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { RegisterRequestModel } from '../models/auth/register-request-model';
import { firstValueFrom } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ApiErrorService } from '../services/api-error-service';

@Component({
  selector: 'ep-register',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly apiErrorService = inject(ApiErrorService);
  protected readonly isRegistering = signal(false);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly fields = signal({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: ''
  })

  protected readonly credentials = form(
    this.fields,
    f => {
      required(f.fullName);
      required(f.email);
      email(f.email);
      required(f.password);
      required(f.phoneNumber);
    },
    {
      submission: {
        action: async () => await this.register()
      }
    }
  )

  private watchField<T>(
    field: () => { value: Signal<T> },
    errorKey: string
  ) {
    effect(() => {
      field().value();
      this.apiErrorService.clearServerError(this.serverValidationErrors, errorKey);
    });
  }

  constructor() {
    this.watchField(this.credentials.fullName, 'FullName');
    this.watchField(this.credentials.email, 'Email');
    this.watchField(this.credentials.password, 'Password');
    this.watchField(this.credentials.phoneNumber, 'PhoneNumber');
  }

  private async register() {
    this.isRegistering.set(true);

    // Clearing serverValidationErrors them before every login attempt:
    this.serverValidationErrors.set({});

    const { fullName, email, password, phoneNumber } = this.credentials().value();
    const request: RegisterRequestModel = { fullName, email, password, phoneNumber };

    try {
      await firstValueFrom(this.authService.register(request));
      await this.router.navigateByUrl('/login');
      return;
    } catch(error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
      return [{ kind: 'server', message: 'Something went wrong.' }];
    } finally {
      this.isRegistering.set(false);
    }
  }
}
