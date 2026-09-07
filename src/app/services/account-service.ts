import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePasswordModelRequestModel } from '../models/account-setting/change-password-model-request-model';

@Service()
export class AccountService{
  private readonly http = inject(HttpClient);

  changePassword(request: ChangePasswordModelRequestModel): Observable<void> {
      return this.http.post<void>('http://localhost:5167/api/auth/change-password', request);
  }
}
