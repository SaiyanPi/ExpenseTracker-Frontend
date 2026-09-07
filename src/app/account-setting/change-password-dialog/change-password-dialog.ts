import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { ChangePasswordModelRequestModel } from '../../models/account-setting/change-password-model-request-model';
import { AccountService } from '../../services/account-service';
import { firstValueFrom } from 'rxjs';
import { MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { ApiErrorService } from '../../services/api-error-service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ep-change-password-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormRoot,
    FormField
  ],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.css',
})
export class ChangePasswordDialog {
  private readonly passwordService = inject(AccountService);

  private readonly dialogRef = inject(MatDialogRef<ChangePasswordDialog>);

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly showCurrentPassword = signal(false);
  protected readonly showNewPassword = signal(false);

  protected readonly fields = signal({
    currentPassword: '',
    newPassword: ''
  })

  protected readonly passwordForm = form(
    this.fields,
    f => {
      required(f.currentPassword);
      required(f.newPassword);
    },
    {
      submission: {
        action: async () => await this.updatePassword()
      }
    }
  )

  // form field server error clear
  private readonly clearNewPasswordServerError = effect(() => {
    this.passwordForm.newPassword().value();
    this.apiErrorService.clearServerError(this.serverValidationErrors, 'NewPassword');
  });


  protected async updatePassword() {
    const { currentPassword, newPassword } = this.passwordForm().value();
    const request: ChangePasswordModelRequestModel = { currentPassword, newPassword }

    try {
      await firstValueFrom(this.passwordService.changePassword(request));
      this.dialogRef.close(true);
    } catch (error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
    }
  }

  protected toggleCurrentPassword(): void {
    this.showCurrentPassword.update(value => !value);
  }

  protected toggleNewPassword(): void {
    this.showNewPassword.update(value => !value);
  }
}
