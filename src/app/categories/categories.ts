import { Component, effect, inject, signal } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { DatePipe } from '@angular/common';
import { FormRoot, FormField, form, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiErrorService } from '../services/api-error-service';

@Component({
  selector: 'ep-categories',
  imports: [DatePipe, FormRoot, FormField, MatSnackBarModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private readonly categoryService = inject(CategoryService);

  protected readonly getCategories = this.categoryService.categories();

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});
  
  private readonly apiErrorService = inject(ApiErrorService);

  private readonly creationFailed = signal(false);

  protected readonly field = signal({
    name: ''
  })
  protected readonly category = form(
    this.field,
    f => {
      required(f.name);
    },
    {
      submission: {
        action: async () => await this.createCategory()
      }
    }
  )

  // clearing server error from a field once the input value changes
  private readonly clearNameServerError = effect(() => {
    this.category.name().value();
    this.apiErrorService.clearServerError(this.serverValidationErrors, 'Name');
  });


  private async createCategory() {
    this.serverValidationErrors.set({});
    this.creationFailed.set(false);
    const { name } = this.category().value();
    try{
      await firstValueFrom(this.categoryService.create({ name }));

      this.field.set({ name:'' });
      this.category().reset();

      this.getCategories.reload();
      return;
    } catch(error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
      return [{ kind: 'server', message: 'Something went wrong.' }];
    }
  }

}

