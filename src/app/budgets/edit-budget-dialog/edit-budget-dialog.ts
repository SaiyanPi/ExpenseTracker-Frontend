import { Component, effect, inject, Signal, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BudgetModel } from '../../models/budget/budget-model';
import { BudgetService } from '../../services/budget-service';
import { ApiErrorService } from '../../services/api-error-service';
import { CategoryService } from '../../services/category-service';
import { CreateUpdateBudgetModel } from '../../models/budget/create-update-budget-model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'ep-edit-budget-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormRoot,
    FormField
  ],
  templateUrl: './edit-budget-dialog.html',
  styleUrl: './edit-budget-dialog.css',
})
export class EditBudgetDialog {
  protected readonly budget = inject<BudgetModel>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<EditBudgetDialog>);

  private readonly budgetService = inject(BudgetService);

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly categories = inject(CategoryService).categories();

  protected readonly fields = signal({
    name: '',
    amount: 100,
    startDate: '',
    endDate: '',
    categoryId: ''
  })

  protected readonly budgetForm = form(
    this.fields,
    f => {
      required(f.name);

      required(f.amount);

      required(f.startDate);

      required(f.endDate);

      // required(f.categoryId);
    },
    {
      submission: {
        action: async () => await this.updateBudget()
      }
    }
  )

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
    // form fields server error clear
    this.watchField(this.budgetForm.name, 'Name');
    this.watchField(this.budgetForm.amount, 'Amount');
    this.watchField(this.budgetForm.startDate, 'StartDate');
    this.watchField(this.budgetForm.endDate, 'EndDate');

    // populate fields with their current values
    this.fields.set({
      name: this.budget.name,
      amount: this.budget.amount,
      startDate: this.budget.startDate.split('T')[0],
      endDate: this.budget.endDate.split('T')[0],
      categoryId: this.budget.categoryId
    });
  }

  protected async updateBudget() {
    const { name, amount, startDate, endDate, categoryId } = this.budgetForm().value();
    const request: CreateUpdateBudgetModel = { name, amount, startDate, endDate, categoryId: categoryId || null };

    try {
      await firstValueFrom(this.budgetService.update(this.budget.id, request));
      this.dialogRef.close(true);
      //this.apiErrorService.showSuccess('Budget updated successfully.');
    } catch (error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
    }
  }
}
