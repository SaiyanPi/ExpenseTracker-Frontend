import { MatDialog } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { ApiErrorService } from '../services/api-error-service';
import { ChangePasswordDialog } from './change-password-dialog/change-password-dialog';
import { AccountService } from '../services/account-service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'ep-account-setting',
  imports: [],
  templateUrl: './account-setting.html',
  styleUrl: './account-setting.css',
})
export class AccountSetting {
  private readonly dialog = inject(MatDialog);

  private readonly router = inject(Router);

  private readonly accountService = inject(AccountService);

  private readonly authService = inject(AuthService);

  private readonly apiErrorService = inject(ApiErrorService);


  protected openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiErrorService.showSuccess('Password updated successfully.');
      }
    });
  }

  protected async deleteAccount() {
    try {
      await firstValueFrom(this.accountService.deleteAccount());
      this.authService.clearAuthState();
      await this.router.navigate(['/home']);
      this.apiErrorService.showSuccess('Account deleted successfully.');
    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }
}
