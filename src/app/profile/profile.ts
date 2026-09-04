import { Component, effect, inject, Signal, signal } from '@angular/core';
import { ProfileService } from '../services/profile-service';
import { form, FormField, required } from '@angular/forms/signals';
import { UpdateProfileRequestModel } from '../models/profile/update-profile-request-model';
import { ApiErrorService } from '../services/api-error-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'ep-profile',
  imports: [FormField],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  private readonly profileService = inject(ProfileService);

  protected readonly profile = this.profileService.getProfile();

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
  }

  // populate the form
  protected editFullName(): void {
    const user = this.profile.value();
    if (!user) { return; }

    this.updateProfileFields.set({
      fullName: user.fullName,
      phoneNumber: user.phoneNumber
    });

    this.editingField.set('fullName');
  }

  // populate the form
  protected editPhoneNumber(): void {
    const user = this.profile.value();
    if (!user) { return; }

    this.updateProfileFields.set({
      fullName: user.fullName,
      phoneNumber: user.phoneNumber
    });

    this.editingField.set('phoneNumber');
  }


  protected async saveProfile(): Promise<void> {
    if (this.updateProfileForm().invalid()) {
      return;
    }

    try {
      await firstValueFrom( this.profileService.updateProfile(this.updateProfileFields()));

      this.editingField.set(null);
      this.profile.reload();

    } catch (error) {
      const result = this.apiErrorService.handle(error);

      this.serverValidationErrors.set(result.validationErrors);

      console.log(this.serverValidationErrors());
    }
  }


  protected cancelEdit(): void {
    this.editingField.set(null);
  }


}
