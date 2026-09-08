import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePasswordRequestModel } from '../models/account-setting/change-password-request-model';

@Service()
export class AccountService{
  private readonly http = inject(HttpClient);

  changePassword(request: ChangePasswordRequestModel): Observable<void> {
      return this.http.post<void>('http://localhost:5167/api/auth/change-password', request);
  }

  deleteAccount() : Observable<void> {
    return this.http.delete<void>(`http://localhost:5167/api/profile/my/delete`);
  }
}
