import { MatDialog } from '@angular/material/dialog';
import { Component, inject, signal } from '@angular/core';
import { ApiErrorService } from '../services/api-error-service';
import { ChangePasswordDialog } from './change-password-dialog/change-password-dialog';
import { ConfirmDeleteDialog } from './confirm-delete-dialog/confirm-delete-dialog';
import { AccountService } from '../services/account-service';
import { AuthService } from '../services/auth-service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile-service';

@Component({
  selector: 'ep-account-setting',
  imports: [],
  templateUrl: './account-setting.html',
  styleUrl: './account-setting.css',
})
export class AccountSetting {
  private readonly dialog = inject(MatDialog);

  private readonly accountService = inject(AccountService);

  private readonly authService = inject(AuthService);

  private readonly apiErrorService = inject(ApiErrorService);

  private readonly router = inject(Router);

  private readonly profileService = inject(ProfileService);

  protected readonly profile = this.profileService.profile;

  protected readonly isRequestingConfirmation = signal(false);

  protected openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog, {
      width: '400px'
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiErrorService.showSuccess('Password updated successfully.');
      }
    });
  }


  protected confirmDeleteDialog( ): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteAccount();
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


  protected async requestEmailConfirmation(): Promise<void> {
    if (this.isRequestingConfirmation()) {
      return;
    }
    this.isRequestingConfirmation.set(true);
    try {
      await firstValueFrom(this.accountService.requestEmailConfirmation());
      this.apiErrorService.showSuccess('Confirmation link sent to email.');
    } catch (error) {
      this.apiErrorService.handle(error);

    } finally {
      this.isRequestingConfirmation.set(false);
    }
  }


}
