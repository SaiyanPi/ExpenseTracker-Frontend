import { HttpErrorResponse } from '@angular/common/http';
import { inject, Service, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiErrorResponseModel } from '../models/error/api-error-response-model';
import { ValidationResultModel } from '../models/error/validation-result-model';

@Service()
export class ApiErrorService {
  private readonly snackBar = inject(MatSnackBar);

  // displaying server validation errors in the form fields
  handle(error: unknown): ValidationResultModel {

    if (!(error instanceof HttpErrorResponse)) {
      this.snackBar.open('Something went wrong.', 'Close');
      return { validationErrors: {} };
    }

    const apiError = error.error as ApiErrorResponseModel;

    if (apiError.details) {
      return {
        validationErrors: this.normalizeKeys(apiError.details)
      };
    }

    this.snackBar.open(apiError.message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });

    return { validationErrors: {} };
  }

  private normalizeKeys(details: Record<string, string[]>): Record<string, string[]> {

    const normalized: Record<string, string[]> = {};

    for (const [key, value] of Object.entries(details)) {
      normalized[key.split('.').pop()!] = value;
    }

    return normalized;
  }

  // success snack bar notification
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  // failure snack bar notification
  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // clearing server field error
  clearServerError(
    errors: WritableSignal<Record<string, string[]>>,
    field: string
  ): void {
    errors.update(current => {
      if (!(field in current)) {
        return current;
      }

      const updated = { ...current };
      delete updated[field];
      return updated;
    });
  }

}
