import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { UserProfileModel } from '../models/profile/user-profile-model';
import { UpdateProfileRequestModel } from '../models/profile/update-profile-request-model';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

@Service()
export class ProfileService {
  private readonly http = inject(HttpClient);

  // To maintain the reactive state for the changes to propagate in other component
  private readonly _profile = signal<UserProfileModel | null>(null);
  private readonly _profileLoading = signal(false);
  private readonly _profileError = signal<unknown | null>(null);

  readonly profile = this._profile.asReadonly();
  readonly profileLoading = this._profileLoading.asReadonly();
  readonly profileError = this._profileError.asReadonly();

  updateUserProfile(profile: UserProfileModel): void {
    this._profile.set(profile);
  }
  // -----------------------


  loadProfile(): Observable<UserProfileModel> {
    return this.http
    .get<UserProfileModel>('http://localhost:5167/api/profile/my')
    .pipe(
      tap(profile => {
        this._profile.set(profile);
      }),
      catchError(error => {
        this._profileError.set(error);
        return throwError(() => error);
      }),
      finalize(() => {
        this._profileLoading.set(false);
      })
    );
  }

  updateProfile(request: UpdateProfileRequestModel): Observable<UserProfileModel> {
    return this.http.put<UserProfileModel>(
      'http://localhost:5167/api/profile/my/update', request
    );
  }

  updateProfileImage(image: File): Observable<HttpEvent<UserProfileModel>> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.put<UserProfileModel>(
      'http://localhost:5167/api/profile/my/image/update', formData,
      {
        observe: 'events',
        reportProgress: true
      }
    );
  }

}
