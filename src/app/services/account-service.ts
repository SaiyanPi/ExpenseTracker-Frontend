import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePasswordRequestModel } from '../models/account-setting/change-password-request-model';
import { ChangeEmailRequestModel } from '../models/change-email/change-email-request-model';
import { environment } from '../../environments/environment.development';

@Service()
export class AccountService{
  private readonly http = inject(HttpClient);

  changePassword(request: ChangePasswordRequestModel): Observable<void> {
      return this.http.post<void>(`${environment.baseUrl}/auth/change-password`, request);
  }

  deleteAccount() : Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/profile/my/delete`);
  }

  requestEmailConfirmation(): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/auth/request/confirm-email`, {});
  }

  requestEmailChange(newEmail: ChangeEmailRequestModel): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/auth/change-email`, newEmail);
  }
}
