import { Component, effect, inject, signal, Signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExpenseModel } from '../../models/expense/expense-model';
import { ExpenseService } from '../../services/expense-service';
import { ApiErrorService } from '../../services/api-error-service';
import { CreateUpdateExpenseModel } from '../../models/expense/create-update-expense-model';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../../services/category-service';
import { BudgetService } from '../../services/budget-service';

@Component({
  selector: 'ep-edit-expense-dialog',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormRoot,
    FormField
  ],
  templateUrl: './edit-expense-dialog.html',
  styleUrl: './edit-expense-dialog.css',
})
export class EditExpenseDialog {
  protected readonly expense = inject<ExpenseModel>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<EditExpenseDialog>);

  private readonly expenseService = inject(ExpenseService);

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly categories = inject(CategoryService).categories();

  protected readonly budgets = inject(BudgetService).budgets();

  protected readonly fields = signal({
    title: '',
    description: '',
    amount: 0,
    date: '',
    categoryId: '',
    budgetId: ''
  })

  protected readonly expenseForm = form(
    this.fields,
    f => {
      required(f.title);

      required(f.description);

      required(f.amount);
    },
    {
      submission: {
        action: async () => await this.updateExpense()
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
    this.watchField(this.expenseForm.title, 'Title');
    this.watchField(this.expenseForm.description, 'Description');
    this.watchField(this.expenseForm.amount, 'Amount');
    this.watchField(this.expenseForm.date, 'Date');
    this.watchField(this.expenseForm.categoryId, 'CategoryId');
    this.watchField(this.expenseForm.budgetId, 'BudgetId');

    // populate fields with their current values
    this.fields.set({
      title: this.expense.title,
      description: this.expense.description,
      amount: this.expense.amount,
      date: this.expense.date.split('T')[0],
      categoryId: this.expense.categoryId ?? '',
      budgetId: this.expense.budgetId ?? '',
    });
  }

  protected async updateExpense() {
    const { title, description, amount, date, categoryId, budgetId } = this.expenseForm().value();
    const request: CreateUpdateExpenseModel =
      { title, description, amount, date: date || null, categoryId: categoryId || null, budgetId: budgetId || null };

      try {
      await firstValueFrom(this.expenseService.update(this.expense.id, request));
      this.dialogRef.close(true);
      //this.apiErrorService.showSuccess('Budget updated successfully.');
    } catch (error) {
      const result = this.apiErrorService.handle(error);
      this.serverValidationErrors.set(result.validationErrors);
    }
  }
}
