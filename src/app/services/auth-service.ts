import { HttpClient } from '@angular/common/http';
import { effect, inject, Service, signal, untracked } from '@angular/core';
import { finalize, Observable, shareReplay, tap, throwError } from 'rxjs';
import { LoginRegisterResponseModel } from '../models/auth/login-resiter-response-model';
import { LoginRequestModel } from '../models/auth/login-request-model';
import { Router } from '@angular/router';
import { RegisterRequestModel } from '../models/auth/register-request-model';

const USER_LOCAL_STORAGE_KEY = 'rememberMe';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly user = signal<LoginRegisterResponseModel | undefined>(this.retrieveUser());

  private refreshRequest$: Observable<LoginRegisterResponseModel> | null = null;

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


  private retrieveUser(): LoginRegisterResponseModel | undefined {
    const value = window.localStorage.getItem(USER_LOCAL_STORAGE_KEY);
    if (!value) {
      return undefined;
    }

    try {
      const user = JSON.parse(value) as LoginRegisterResponseModel;
      return user;
    } catch {
      // Corrupted/invalid localStorage value
      window.localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
      return undefined;
    }
  }


  login(request: LoginRequestModel): Observable<LoginRegisterResponseModel> {
    return this.http
    .post<LoginRegisterResponseModel>('http://localhost:5167/api/auth/login', request )
    .pipe(tap(user => {
      this.user.set(user);
      // this.startTokenExpirationTimer(user.expiresAt);
    }));
  }


  register(request: RegisterRequestModel): Observable<LoginRegisterResponseModel> {
    return this.http
    .post<LoginRegisterResponseModel>('http://localhost:5167/api/auth/register-user', request )
    .pipe(tap(user => {
      this.user.set(user);
      // this.startTokenExpirationTimer(user.expiresAt);
    }));
  }


  refreshToken(): Observable<LoginRegisterResponseModel> {
    // If a refresh is already happening,
    // return the same observable.
    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    const refreshToken = this.currentUser()?.refreshToken;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    this.refreshRequest$ = this.http
      .post<LoginRegisterResponseModel>(
        'http://localhost:5167/api/auth/refresh-token',
        {
          refreshToken
        }
      )
      .pipe(
        tap(user => {
          this.user.set(user);
        }),

        finalize(() => {
          this.refreshRequest$ = null;
        }),

        shareReplay(1)
      );
    return this.refreshRequest$;
  }


  logout(): void {
    this.user.set(undefined);
    this.router.navigate(['/home']);
  }

}
