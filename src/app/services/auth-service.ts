import { JwtClaimsModel } from './../models/auth/jwt-claims-model';
import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Service, signal, untracked } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponseModel } from '../models/auth/login-response-model';
import { LoginRequestModel } from '../models/auth/login-request-model';
import { jwtDecode } from 'jwt-decode';

const USER_LOCAL_STORAGE_KEY = 'rememberMe';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly user = signal<LoginResponseModel | undefined>(this.retrieveUser());

  readonly currentUser = this.user.asReadonly();

  constructor() {
    effect(() => {
      // every time the user signal changes, we store it in local storage
      const user = this.user();
      untracked(() => {
        if (user) {
          window.localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
        } else {
          window.localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
        }
      });
    });
  }

  private retrieveUser(): LoginResponseModel | undefined {
    const value = window.localStorage.getItem(USER_LOCAL_STORAGE_KEY);
    if (value) {
      return JSON.parse(value) as LoginResponseModel;
    }
    return undefined;
  }

  private readonly claims = computed(() => {
    const token = this.user()?.token;
    return token ? jwtDecode<JwtClaimsModel>(token) : null;
  });

  readonly name = computed(() =>
    this.claims()?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? null
  );

readonly email = computed(() =>
  this.claims()?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ?? null
);

  login(request: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http
    .post<LoginResponseModel>('http://localhost:5167/api/auth/login', request )
    .pipe(tap(user => this.user.set(user)));;
  }
}
