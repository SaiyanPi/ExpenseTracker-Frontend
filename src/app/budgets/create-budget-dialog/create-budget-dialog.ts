import { Component, effect, inject, Signal, signal } from '@angular/core';
import { BudgetModel } from '../../models/budget/budget-model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { BudgetService } from '../../services/budget-service';
import { ApiErrorService } from '../../services/api-error-service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { form, FormField, FormRoot, min, minLength, required } from '@angular/forms/signals';
import { CreateUpdateBudgetModel } from '../../models/budget/create-update-budget-model';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'ep-create-budget-dialog',
  imports: [MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormRoot,
    FormField
  ],
  templateUrl: './create-budget-dialog.html',
  styleUrl: './create-budget-dialog.css',
})
export class CreateBudgetDialog {
  protected readonly budget = inject<BudgetModel>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<CreateBudgetDialog>);

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
      minLength(f.name, 3);

      required(f.amount);
      min(f.amount, 100);

      required(f.startDate);
      required(f.endDate);

      required(f.categoryId);
    },
    {
      submission: {
        action: async () => await this.createBudget()
      }
    }
  )

  // form field server error clear
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
    this.watchField(this.budgetForm.name, 'Name');
    this.watchField(this.budgetForm.amount, 'Amount');
    this.watchField(this.budgetForm.startDate, 'StartDate');
    this.watchField(this.budgetForm.endDate, 'EndDate');
  }

  protected async createBudget() {
    const { name, amount, startDate, endDate, categoryId } = this.budgetForm().value();
    const request: CreateUpdateBudgetModel = { name, amount, startDate, endDate, categoryId: categoryId || null };

    try {
      await firstValueFrom(this.budgetService.create(request));
      this.dialogRef.close(true);
      //this.apiErrorService.showSuccess('Category updated successfully.');
    } catch (error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
    }
  }
}
