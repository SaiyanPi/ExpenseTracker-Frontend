import { Component, inject, signal } from '@angular/core';
import { ExpenseService } from '../services/expense-service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiErrorService } from '../services/api-error-service';
import { CreateExpenseDialog } from './create-expense-dialog/create-expense-dialog';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'ep-expenses',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  private readonly expenseService = inject(ExpenseService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  private readonly apiErrorService = inject(ApiErrorService);

  private readonly dialog = inject(MatDialog);

  protected readonly openExpenseMenu = signal<string | null>(null);

  protected toggleExpenseMenu(id: string): void {
    this.openExpenseMenu.update(current => current === id ? null : id);
  }


  protected readonly getExpenses = this.expenseService.expenses();

  protected openCreateExpenseDialog(): void {
    const dialogRef = this.dialog.open(CreateExpenseDialog, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getExpenses.reload();
        this.apiErrorService.showSuccess('Budget created successfully.');
      }
    });
  }

  protected async deleteExpense(id: string) {
    try {
      await firstValueFrom(this.expenseService.delete(id));
      this.getExpenses.reload();
      this.apiErrorService.showSuccess('Expense deleted successfully.');
    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }
}
