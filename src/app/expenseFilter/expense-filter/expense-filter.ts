import { Component, inject, input, output } from '@angular/core';
import { ExpenseFilterState } from '../expense-filter-state/expense-filter-state';
import { BudgetService } from '../../services/budget-service';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'ep-expense-filter',
  imports: [],
  templateUrl: './expense-filter.html',
  styleUrl: './expense-filter.css',
})
export class ExpenseFilter {
  // for export purpose because i am reusing this component
  readonly fromExport = input(false);
  readonly exportFormat = input<'pdf' | 'csv' | 'xlsx'>('pdf');
  readonly exportFormatChange = output<'pdf' | 'csv' | 'xlsx'>();
  readonly exportRequested = output<void>();


  readonly expenseFilters = input.required<ExpenseFilterState>();

  protected readonly budgets = inject(BudgetService).budgets();

  protected readonly categories = inject(CategoryService).categories();

  resetFilters(): void {
    this.expenseFilters().reset();
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.expenseFilters().categoryId.set(value === '' ? null : value);
  }

  onBudgetChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.expenseFilters().budgetId.set(value === '' ? null : value);
  }

  onStartDateChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.expenseFilters().startDate.set(value === '' ? null : value);
  }

  onEndDateChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.expenseFilters().endDate.set(value === '' ? null : value);
  }

  onMinAmountChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.expenseFilters().minAmount.set(value === '' ? null : Number(value));
  }

  onMaxAmountChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.expenseFilters().maxAmount.set(value === '' ? null : Number(value));
  }


  // for export purpose
  onExportFormatChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.exportFormatChange.emit(value as 'pdf' | 'csv' | 'xlsx');
  }
}
