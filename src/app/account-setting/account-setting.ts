import { MatDialog } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { ApiErrorService } from '../services/api-error-service';
import { ChangePasswordDialog } from './change-password-dialog/change-password-dialog';

@Component({
  selector: 'ep-account-setting',
  imports: [],
  templateUrl: './account-setting.html',
  styleUrl: './account-setting.css',
})
export class AccountSetting {
  private readonly dialog = inject(MatDialog);

  private readonly apiErrorService = inject(ApiErrorService);


  protected openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiErrorService.showSuccess('Password updated successfully.');
      }
    });
  }
}
