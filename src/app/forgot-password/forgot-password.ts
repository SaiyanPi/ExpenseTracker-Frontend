import { Component, effect, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { AuthService } from '../services/auth-service';
import { firstValueFrom } from 'rxjs';
import { ApiErrorService } from '../services/api-error-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ep-forgot-password',
  imports: [RouterLink, FormRoot, FormField],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);

  private readonly apiErrorService = inject(ApiErrorService);
  
  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly isRequestingReset = signal(false);

  protected readonly field = signal({
    userEmail: ''
  })

  protected readonly forgotPasswordForm = form(
    this.field,
    f => {
      required(f.userEmail);
      email(f.userEmail);
    },
    {
      submission: {
        action: async () => await this.requestPasswordReset()
      }
    }
  )

  // clearing server error from a field once the input value changes
  private readonly clearEmailServerError = effect(() => {
    this.forgotPasswordForm.userEmail().value();
    this.apiErrorService.clearServerError(this.serverValidationErrors, 'UserEmail');
  });


  protected async requestPasswordReset() {
    this.serverValidationErrors.set({});
    const { userEmail } = this.forgotPasswordForm().value();
    if (this.isRequestingReset()) {
      return;
    }
    this.isRequestingReset.set(true);

    try{
      await firstValueFrom(this.authService.forgotPassword({ userEmail }));
      this.field.set({ userEmail:'' });
      this.forgotPasswordForm().reset();
      this.apiErrorService.showSuccess('Password reset link sent to email.');
      return;
    } catch(error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
      return [{ kind: 'server', message: 'Something went wrong.' }];
    } finally {
      this.isRequestingReset.set(false);
    }
  }
}
