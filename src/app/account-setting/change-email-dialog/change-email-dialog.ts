import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ChangeEmailRequestModel } from '../../models/change-email/change-email-request-model';
import { AccountService } from '../../services/account-service';
import { firstValueFrom } from 'rxjs';
import { ApiErrorService } from '../../services/api-error-service';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ep-change-email-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, FormRoot, FormField, MatFormField,
    MatLabel,
    MatIcon,
    MatError
  ],
  templateUrl: './change-email-dialog.html',
  styleUrl: './change-email-dialog.css',
})
export class ChangeEmailDialog {
  private readonly accountService = inject(AccountService);

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  private readonly dialogRef = inject(MatDialogRef<ChangeEmailDialog>);

  protected readonly field = signal({
    newEmail: ''
  })

  protected readonly changeEmailForm = form(
    this.field,
    f => {
      required(f.newEmail);
      email(f.newEmail);
    },
    {
      submission: {
        action: async () => await this.requestEmailChange()
      }
    }
  )


  protected async requestEmailChange() {
    const { newEmail } = this.changeEmailForm().value();
    const request: ChangeEmailRequestModel = { newEmail }

    try {
      await firstValueFrom(this.accountService.requestEmailChange(request));
      this.dialogRef.close(true);
    } catch (error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
    }
  }
}
