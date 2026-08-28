import { Component, computed, inject, signal } from '@angular/core';
import { BudgetService } from '../services/budget-service';
import { ApiErrorService } from '../services/api-error-service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, DecimalPipe } from '@angular/common';
// import { form, required } from '@angular/forms/signals';
// import { firstValueFrom } from 'rxjs';
// import { CreateUpdateBudgetModel } from '../models/budget/create-update-budget-model';
import { HostListener } from '@angular/core';
import { CreateBudgetDialog } from './create-budget-dialog/create-budget-dialog';
import { firstValueFrom } from 'rxjs';
import { CreateUpdateBudgetModel } from '../models/budget/create-update-budget-model';
import { EditBudgetDialog } from './edit-budget-dialog/edit-budget-dialog';
import { RouterLink } from '@angular/router';
import { Pagination, SortOption } from '../shared/pagination/pagination/pagination';
import { PaginationState } from '../shared/pagination/pagination-state/pagination-state';
import { Search } from '../shared/search/search/search';
import { SearchState } from '../shared/search/search-state/search-state/search-state';
import { SearchPagedQueryModel } from '../models/search/search-paged-query-model';

@Component({
  selector: 'ep-budgets',
  imports: [DatePipe, DecimalPipe, RouterLink, Pagination, Search],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css',
})
export class Budgets {
  readonly Math = Math;

  private readonly budgetService = inject(BudgetService);

  readonly pagination = new PaginationState();
  readonly searchState = new SearchState()

  protected readonly query = computed<SearchPagedQueryModel>(() => ({
    ...this.pagination.query(),
    search: this.searchState.search()
  }));

  protected readonly getBudgets = this.budgetService.budgets(this.query);

  readonly sortOptions: SortOption[] = [
    { label: 'Name', value: 'Name' },
    { label: 'Amount', value: 'Amount' },
    { label: 'End date', value: 'EndDate' },
    { label: 'Start date', value: 'StartDate' },
    { label: 'Usage', value: 'percentageUsed' }
  ];


  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly openBudgetMenu = signal<string | null>(null);

  private readonly apiErrorService = inject(ApiErrorService);

  private readonly dialog = inject(MatDialog);



  protected toggleBudgetMenu(id: string): void {
    this.openBudgetMenu.update(current => current === id ? null : id);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.item-actions')) {
      this.openBudgetMenu.set(null);
    }
  }


  protected openCreateBudgetDialog(): void {
    const dialogRef = this.dialog.open(CreateBudgetDialog, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBudgets.reload();
        this.apiErrorService.showSuccess('Budget created successfully.');
      }
    });
  }


  protected async deleteBudget(id: string) {
    try {
      await firstValueFrom(this.budgetService.delete(id));
      this.getBudgets.reload();
      this.apiErrorService.showSuccess('Budget deleted successfully.');
    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }


  protected openEditBudgetDialog(budget: CreateUpdateBudgetModel): void {
    // if (this.budgetStatus(budget) === 'expired') {
    //   this.apiErrorService.showError('Expired budget cannot be updated.');
    //   return;
    // }

    const dialogRef = this.dialog.open(EditBudgetDialog, {
      width: '600px',
      data: budget
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBudgets.reload();
        this.apiErrorService.showSuccess('Budget updated successfully.');
      }
    });
  }


  protected readonly budgetStatus = (budget: {
    startDate: string;
    endDate: string;
  }) => {
    const today = new Date();
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);

    // Ignore time portion
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (today < startDate) {
      return 'upcoming';
    }

    if (today > endDate) {
      return 'expired';
    }

    return 'active';

  };


  protected readonly spendingStatus = (budget: {
    percentageUsed: number;
    isOverBudget: boolean;
  }) => {
    if (budget.isOverBudget) {
      return 'over';
    }

    if (budget.percentageUsed >= 80) {
      return 'warning';
    }

    return 'healthy';
  };
}
