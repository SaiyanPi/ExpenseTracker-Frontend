import { CreateUpdateExpenseModel } from './../models/expense/create-update-expense-model';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { ExpenseService } from '../services/expense-service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiErrorService } from '../services/api-error-service';
import { CreateExpenseDialog } from './create-expense-dialog/create-expense-dialog';
import { MatDialog } from '@angular/material/dialog';
import { EditExpenseDialog } from './edit-expense-dialog/edit-expense-dialog';
import { PaginationState } from '../shared/pagination/pagination-state/pagination-state';
import { Pagination, SortOption } from '../shared/pagination/pagination/pagination';
import { ExpenseFilterState } from '../expenseFilter/expense-filter-state/expense-filter-state';
import { FilterExpenseQueryModel } from '../models/pagination/filter-expense-query-model';
import { ExpenseFilter } from '../expenseFilter/expense-filter/expense-filter';

@Component({
  selector: 'ep-expenses',
  imports: [DecimalPipe, DatePipe, Pagination, ExpenseFilter],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})

export class Expenses {

  private readonly expenseService = inject(ExpenseService);

  readonly pagination = new PaginationState();
  readonly expenseFilters = new ExpenseFilterState();

  protected readonly filterQuery = computed<FilterExpenseQueryModel>(() => ({
    categoryId: this.expenseFilters.categoryId(),
    budgetId: this.expenseFilters.budgetId(),
    startDate: this.expenseFilters.startDate(),
    endDate: this.expenseFilters.endDate(),
    minAmount: this.expenseFilters.minAmount(),
    maxAmount: this.expenseFilters.maxAmount(),

    ...this.pagination.query(),
  }));

  protected readonly getExpenses = this.expenseService.filterExpenses(this.filterQuery);

  readonly sortOptions: SortOption[] = [
    { label: 'Name', value: 'Title' },
    { label: 'Amount', value: 'Amount' },
    { label: 'Expense date', value: 'Date' },
    { label: 'Created date', value: 'CreatedAt' }
  ];

  readonly showFilters = signal(false);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly openExpenseMenu = signal<string | null>(null);

  private readonly apiErrorService = inject(ApiErrorService);

  private readonly dialog = inject(MatDialog);


  protected toggleExpenseMenu(id: string): void {
    this.openExpenseMenu.update(current => current === id ? null : id);
  }

  protected toggleExpenseFilter(): void {
    this.showFilters.update(value => !value);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.item-actions')) {
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
