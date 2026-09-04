import { HttpClient, httpResource } from '@angular/common/http';
import { inject, ResourceRef, Service } from '@angular/core';
import { UserProfileModel } from '../models/profile/user-profile-model';
import { UpdateProfileRequestModel } from '../models/profile/update-profile-request-model';
import { Observable } from 'rxjs';

@Service()
export class ProfileService {
  private readonly http = inject(HttpClient);

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

}
