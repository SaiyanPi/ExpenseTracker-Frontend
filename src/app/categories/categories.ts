import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { FormRoot, FormField, form, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiErrorService } from '../services/api-error-service';
import { EditCategoryDialog } from './edit-category-dialog/edit-category-dialog';
import { CreateUpdateCategoryModel } from '../models/category/create-update-category-model';

@Component({
  selector: 'ep-categories',
  imports: [FormRoot, FormField, MatSnackBarModule, MatDialogModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private readonly categoryService = inject(CategoryService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly openCategoryMenu = signal<string | null>(null);

  private readonly apiErrorService = inject(ApiErrorService);

  private readonly dialog = inject(MatDialog);


  protected readonly getCategories = this.categoryService.categories();

  protected toggleCategoryMenu(id: string): void {
    this.openCategoryMenu.update(current => current === id ? null : id);
  }
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.budget-actions')) {
      this.openCategoryMenu.set(null);
    }
  }


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
        action: async () => await this.createCategory()
      }
    }
  )

  // clearing server error from a field once the input value changes
  private readonly clearNameServerError = effect(() => {
    this.categoryForm.name().value();
    this.apiErrorService.clearServerError(this.serverValidationErrors, 'Name');
  });


  private async createCategory() {
    this.serverValidationErrors.set({});
    const { name } = this.categoryForm().value();

    try{
      await firstValueFrom(this.categoryService.create({ name }));

      this.field.set({ name:'' });
      this.categoryForm().reset();

      this.getCategories.reload();
      this.apiErrorService.showSuccess('Category created successfully.');
      return;
    } catch(error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
      return [{ kind: 'server', message: 'Something went wrong.' }];
    }
  }


  protected async deleteCategory(id: string) {
    try {
      await firstValueFrom(this.categoryService.delete(id));
      this.getCategories.reload();
      this.apiErrorService.showSuccess('Category deleted successfully.');
    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }


  protected openEditDialog(category: CreateUpdateCategoryModel): void {
    const dialogRef = this.dialog.open(EditCategoryDialog, {
      width: '450px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCategories.reload();
        this.apiErrorService.showSuccess('Category updated successfully.');
      }
    });
  }

}

