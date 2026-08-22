import { CreateUpdateExpenseModel } from './../models/expense/create-update-expense-model';
import { Component, HostListener, inject, signal } from '@angular/core';
import { ExpenseService } from '../services/expense-service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiErrorService } from '../services/api-error-service';
import { CreateExpenseDialog } from './create-expense-dialog/create-expense-dialog';
import { MatDialog } from '@angular/material/dialog';
import { EditExpenseDialog } from './edit-expense-dialog/edit-expense-dialog';
import { PaginationState } from '../shared/pagination/pagination-state/pagination-state';
import { Pagination, SortOption } from '../shared/pagination/pagination/pagination';

@Component({
  selector: 'ep-expenses',
  imports: [DecimalPipe, DatePipe, Pagination],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})

export class Expenses {
  
  private readonly expenseService = inject(ExpenseService);

  readonly pagination = new PaginationState();

  protected readonly getExpenses = this.expenseService.expenses(this.pagination.query);

  readonly sortOptions: SortOption[] = [
    { label: 'Title', value: 'Title' },
    { label: 'Amount', value: 'Amount' },
    { label: 'Expense date', value: 'Date' },
    { label: 'Created date', value: 'CreatedAt' }
  ];


  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly openExpenseMenu = signal<string | null>(null);

  private readonly apiErrorService = inject(ApiErrorService);

  private readonly dialog = inject(MatDialog);


  protected toggleExpenseMenu(id: string): void {
    this.openExpenseMenu.update(current => current === id ? null : id);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.expense-actions')) {
      this.openExpenseMenu.set(null);
    }
  }

  protected openCreateExpenseDialog(): void {
    const dialogRef = this.dialog.open(CreateExpenseDialog, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getExpenses.reload();
        this.apiErrorService.showSuccess('Expense created successfully.');
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

  protected openEditExpenseDialog(expense: CreateUpdateExpenseModel): void {
    const dialogRef = this.dialog.open(EditExpenseDialog, {
      width: '600px',
      data: expense
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getExpenses.reload();
        this.apiErrorService.showSuccess('Expense updated successfully.');
      }
    });
  }

}
