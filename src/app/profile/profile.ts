import { Component, effect, inject, Signal, signal } from '@angular/core';
import { ProfileService } from '../services/profile-service';
import { form, FormField, required } from '@angular/forms/signals';
import { UpdateProfileRequestModel } from '../models/profile/update-profile-request-model';
import { ApiErrorService } from '../services/api-error-service';
import { filter, firstValueFrom, lastValueFrom, tap } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { UserProfileModel } from '../models/profile/user-profile-model';

@Component({
  selector: 'ep-profile',
  imports: [FormField, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  protected readonly uploadProgress = signal<number | null>(null);

  protected readonly uploadingProfilePicture = signal(false);

  private readonly authService = inject(AuthService);

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  private readonly profileService = inject(ProfileService);

  // protected readonly profile = this.profileService.loadProfile();
  protected readonly profile = this.profileService.profile;
  protected readonly profileLoading = this.profileService.profileLoading;
  protected readonly profileError = this.profileService.profileError;


  protected readonly updateProfileFields = signal<UpdateProfileRequestModel>({
    fullName: '',
    phoneNumber: ''
  });

  protected readonly updateProfileForm = form(this.updateProfileFields,
    f => {
      required(f.fullName);
      required(f.phoneNumber);
    }
  );

  protected readonly editingField = signal<'fullName' | 'phoneNumber' | null>(null);

  // form fields server error clear
  private watchField<T>(
    field: () => { value: Signal<T> },
    errorKey: string
  ) {
    effect(() => {
      field().value();
      this.apiErrorService.clearServerError(this.serverValidationErrors, errorKey);
    });
  }


  constructor() {
    this.watchField(this.updateProfileForm.fullName, 'FullName');
    this.watchField(this.updateProfileForm.phoneNumber, 'PhoneNumber');

    // to propagate change
    this.profileService.loadProfile().subscribe();
  }

  // populate the form
  protected editFullName(): void {
    const user = this.profile();
    if (!user) { return; }

    this.updateProfileFields.set({
      fullName: user.fullName,
      phoneNumber: user.phoneNumber
    });

    this.editingField.set('fullName');
  }

  // populate the form
  protected editPhoneNumber(): void {
    const user = this.profile();
    if (!user) { return; }

    this.updateProfileFields.set({
      fullName: user.fullName,
      phoneNumber: user.phoneNumber
    });

    this.editingField.set('phoneNumber');
  }

  // using .subscribe to the Observable doesn't gives us a error format we need for displaying
  // server error
  protected async saveProfile(): Promise<void> {
    if (this.updateProfileForm().invalid()) {
      return;
    }

    try {
      const response = await firstValueFrom( this.profileService.updateProfile(this.updateProfileFields()));
      this.editingField.set(null);

      if (response) {
        // console.log(response);
        this.profileService.updateUserProfile(response);
      }

    } catch (error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
      // console.log(this.serverValidationErrors());
    }
  }


  protected cancelEdit(): void {
    this.editingField.set(null);
  }


  protected async onProfilePictureSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Clear previous image upload validation errors
    this.apiErrorService.clearServerError(this.serverValidationErrors, 'Size');
    this.apiErrorService.clearServerError(this.serverValidationErrors, 'Format');

    this.uploadingProfilePicture.set(true);
    this.uploadProgress.set(0);

    try {
      const response = await lastValueFrom(
        this.profileService.updateProfileImage(file).pipe(

          tap(event => {

            if (
              event.type === HttpEventType.UploadProgress &&
              event.total
            ) {
              this.uploadProgress.set(
                Math.round((event.loaded / event.total) * 100)
              );
            }

          }),

          filter(
            (event): event is HttpResponse<UserProfileModel> =>
              event.type === HttpEventType.Response
          )

        )
      );

      this.uploadProgress.set(100);
      if (response.body) {
        // console.log(response.body);
        this.profileService.updateUserProfile(response.body);
      }
      // this.profile.reload(); //don't need this anymore


    } catch (error) {

      // input.value = '';
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);

    } finally {

      this.uploadingProfilePicture.set(false);

      setTimeout(() => {
        this.uploadProgress.set(null);
      }, 500);

      input.value = '';
    }
  }



  logout(): void {
    this.authService.logout();
  }
}
