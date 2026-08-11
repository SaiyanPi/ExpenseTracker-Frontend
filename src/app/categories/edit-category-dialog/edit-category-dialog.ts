import { ApiErrorService } from './../../services/api-error-service';
import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from '../../services/category-service';
import { firstValueFrom } from 'rxjs';
import { CategoryModel } from '../../models/category/category-model';
import { CreateUpdateCategoryModel } from '../../models/category/create-update-category-model';

@Component({
  selector: 'ep-edit-category-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormRoot,
    FormField
  ],
  templateUrl: './edit-category-dialog.html',
  styleUrl: './edit-category-dialog.css',
})
export class EditCategoryDialog {
  protected readonly category = inject<CategoryModel>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<EditCategoryDialog>);

  private readonly categoryService = inject(CategoryService);

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly field = signal({
    name: ''
  })

  protected readonly categoryForm = form(
    this.field,
    f => {
      required(f.name);
    },
    {
      submission: {
        action: async () => await this.updateCategory()
      }
    }
  )

  // form field server error clear
  private readonly clearNameServerError = effect(() => {
    this.categoryForm.name().value();
    this.apiErrorService.clearServerError(this.serverValidationErrors, 'Name');
  });

  constructor() {
    this.field.set({
      name: this.category.name
    });
  }

  protected async updateCategory() {
    const { name } = this.categoryForm().value();
    // ⚠️⚠️
    const request: CreateUpdateCategoryModel = { name };

    try {
      await firstValueFrom(this.categoryService.update(this.category.id, request));
      this.dialogRef.close(true);
      //this.apiErrorService.showSuccess('Category updated successfully.');
    } catch (error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
    }
  }

}
