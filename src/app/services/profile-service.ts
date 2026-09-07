import { HttpClient, HttpEvent, httpResource } from '@angular/common/http';
import { inject, ResourceRef, Service, signal } from '@angular/core';
import { UserProfileModel } from '../models/profile/user-profile-model';
import { UpdateProfileRequestModel } from '../models/profile/update-profile-request-model';
import { Observable } from 'rxjs';

@Service()
export class ProfileService {
  private readonly http = inject(HttpClient);

    // To maintain the reactive state for the changes to propagate in other component
    // once the profile image is uploaded here, i want changes to propagate in layout component as well
  
    private readonly _profile = signal<UserProfileModel | null>(null);

    readonly profile = this._profile.asReadonly();

    updateUserProfile(profile: UserProfileModel): void {
      this._profile.set(profile);
    }
    // -----------------------


  getProfile(): ResourceRef<UserProfileModel | undefined> {
    return httpResource<UserProfileModel>(() => ({
      url: 'http://localhost:5167/api/profile/my'
    }));
  }

  updateProfile(request: UpdateProfileRequestModel): Observable<UserProfileModel> {
    return this.http.put<UserProfileModel>(
      'http://localhost:5167/api/profile/my/update', request
    );
  }

  updateProfileImage(image: File): Observable<HttpEvent<void>> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.put<void>(
      'http://localhost:5167/api/profile/my/image/update', formData,
      {
        observe: 'events',
        reportProgress: true
      }
    );
  }

}
