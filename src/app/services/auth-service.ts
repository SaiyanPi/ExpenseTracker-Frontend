import { JwtClaimsModel } from './../models/auth/jwt-claims-model';
import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Service, signal, untracked } from '@angular/core';
import { finalize, Observable, shareReplay, tap, throwError } from 'rxjs';
import { LoginRegisterResponseModel } from '../models/auth/login-resiter-response-model';
import { LoginRequestModel } from '../models/auth/login-request-model';
import { jwtDecode } from 'jwt-decode';
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

  // private logoutTimer?: ReturnType<typeof setTimeout>;

  // private startTokenExpirationTimer(expiresAt: string): void {
  //   console.log('expiresAt from API:', expiresAt);

  // const expiresIn = new Date(expiresAt).getTime() - Date.now();

  // // console.log('Parsed date:', new Date(expiresAt));
  // // console.log('Now:', new Date());
  // // console.log('expiresIn (ms):', expiresIn);

  //   if (expiresIn <= 0) {
  //      console.log('Token already expired!');
  //     this.logout();
  //     return;
  //   }
  //   this.logoutTimer = setTimeout(() => {
  //     console.log('Token expired. Logging out.');
  //     this.logout();
  //   }, expiresIn);
  // }

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

      // const expiresAt = new Date(user.expiresAt).getTime();
      // if (expiresAt <= Date.now()) {
      //   window.localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
      //   return undefined;
      // }

      return user;
    } catch {
      // Corrupted/invalid localStorage value
      window.localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
      return undefined;
    }
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
          // this.startTokenExpirationTimer(user.expiresAt);
        }),

        finalize(() => {
          this.refreshRequest$ = null;
        }),

        shareReplay(1)
      );
    return this.refreshRequest$;
  }


  logout(): void {
    // if (this.logoutTimer) {
    //   clearTimeout(this.logoutTimer);
    //   this.logoutTimer = undefined;
    // }
    this.user.set(undefined);
    this.router.navigate(['/home']);
  }

}
