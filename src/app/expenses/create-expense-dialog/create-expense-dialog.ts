import { Component, effect, inject, Signal, signal } from '@angular/core';
import { CreateUpdateExpenseModel } from '../../models/expense/create-update-expense-model';
import { firstValueFrom } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from '../../services/expense-service';
import { ApiErrorService } from '../../services/api-error-service';
import { disabled, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryService } from '../../services/category-service';
import { BudgetService } from '../../services/budget-service';

export interface CreateExpenseDialogData {
  budgetId?: string;
  categoryId?: string;
}

@Component({
  selector: 'ep-create-expense-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormRoot,
    FormField
  ],
  templateUrl: './create-expense-dialog.html',
  styleUrl: './create-expense-dialog.css',
})
export class CreateExpenseDialog {

  protected readonly dialogData = inject<CreateExpenseDialogData>(MAT_DIALOG_DATA, {
    optional: true
  });

  private readonly dialogRef = inject(MatDialogRef<CreateExpenseDialog>);

  private readonly expenseService = inject(ExpenseService);

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly categories = inject(CategoryService).categories();

  protected readonly activeBudgets = inject(BudgetService).activeBudgets();

  protected readonly fields = signal({
    title: '',
    description: '',
    amount: 0,
    date: '',
    categoryId: this.dialogData?.categoryId ?? '',  // for creating expense with already fixed categoryId
    budgetId: this.dialogData?.budgetId ?? '' // for creating expense with already fixed budgetId
  })

  protected readonly expenseForm = form(
    this.fields,
    f => {
      required(f.title);

      required(f.description);

      required(f.amount);

      disabled(f.categoryId, {
        when: () => !!this.dialogData?.categoryId
      });

      disabled(f.budgetId, {
        when: () => !!this.dialogData?.budgetId
      });
    },
    {
      submission: {
        action: async () => await this.createExpense()
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
    // form fields server error clear
    this.watchField(this.expenseForm.title, 'Title');
    this.watchField(this.expenseForm.description, 'Description');
    this.watchField(this.expenseForm.date, 'Date');
    this.watchField(this.expenseForm.categoryId, 'CategoryId');
    this.watchField(this.expenseForm.budgetId, 'BudgetId');
  }

  protected async createExpense() {
    const { title, description, amount, date, categoryId, budgetId } = this.expenseForm().value();
    const request: CreateUpdateExpenseModel =
      { title, description, amount, date: date || null, categoryId: categoryId || null, budgetId: budgetId || null };

    try {
      await firstValueFrom(this.expenseService.create(request));
      this.dialogRef.close(true);
      //this.apiErrorService.showSuccess('Category updated successfully.');
    } catch (error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
    }
  }
}
