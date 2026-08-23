import { Component, inject } from '@angular/core';
import { ExpenseService } from '../../services/expense-service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PaginationState } from '../../shared/pagination/pagination-state/pagination-state';
import { Pagination, SortOption } from '../../shared/pagination/pagination/pagination';

@Component({
  selector: 'ep-category-detail',
  imports: [DatePipe, DecimalPipe, Pagination],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.css',
})
export class CategoryDetail {
  private readonly expenseService = inject(ExpenseService);

  readonly pagination = new PaginationState();

  // Route-based navigation not an input signal-based
  private readonly route = inject(ActivatedRoute);
  readonly categoryId = this.route.snapshot.paramMap.get('categoryId')!;

  protected readonly getCategoryDetailsWithExpense =
    this.expenseService.categoryDetailsWithExpenses(this.categoryId, this.pagination.query);

  readonly sortOptions: SortOption[] = [
    { label: 'Name', value: 'Title' },
    { label: 'Amount', value: 'Amount' },
    { label: 'Expense date', value: 'Date' }
  ];
}
