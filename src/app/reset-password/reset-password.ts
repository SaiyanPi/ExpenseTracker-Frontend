import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required, validate } from '@angular/forms/signals';
import { PasswordResetModel } from '../models/password-reset/password-reset-model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { firstValueFrom } from 'rxjs';
import { ApiErrorService } from '../services/api-error-service';

@Component({
  selector: 'ep-reset-password',
  imports: [FormRoot, FormField, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  // private readonly dialogRef = inject(MatDialogRef<ChangePasswordDialog>);

  protected readonly showNewPassword = signal(false);

  protected readonly showConfirmPassword = signal(false);

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  private readonly route = inject(ActivatedRoute);
  protected readonly userId = this.route.snapshot.queryParamMap.get('userId');
  protected readonly token = this.route.snapshot.queryParamMap.get('token');

  protected readonly fields = signal({
    newPassword: '',
    confirmPassword: ''
  })

  protected readonly resetPasswordForm = form(
    this.fields,
    f => {
      required(f.newPassword);
      required(f.confirmPassword);
      validate(f.confirmPassword, ({ value, valueOf }) => {
        if (value() !== valueOf(f.newPassword)) {
          return {
            kind: 'passwordMismatch',
            message: 'Passwords do not match.'
          };
        }
        return null;
      });
    },
    {
      submission: {
        action: async () => await this.resetPassword()
      }
    }
  )

  // form field server error clear
  private readonly clearNewPasswordServerError = effect(() => {
    this.resetPasswordForm.newPassword().value();
    this.apiErrorService.clearServerError(this.serverValidationErrors, 'NewPassword');
  });

  protected async resetPassword() {
    if (!this.userId || !this.token) {
      // Invalid reset link
      return;
    }

    const { newPassword } = this.resetPasswordForm().value();
    const request: PasswordResetModel = { newPassword }

    try {
      await firstValueFrom(this.authService.resetPassword(
        this.userId,
        this.token,
        request));
      this.apiErrorService.showSuccess("Your password has been reset successfully.You can now log in with your new password.")
      await this.router.navigateByUrl('/login');
    } catch (error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
    }
  }

  protected toggleNewPassword(): void {
    this.showNewPassword.update(value => !value);
  }

  protected toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }
}
