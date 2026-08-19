import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { BudgetService } from '../../services/budget-service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CreateUpdateExpenseModel } from '../../models/expense/create-update-expense-model';
import { EditExpenseDialog } from '../../expenses/edit-expense-dialog/edit-expense-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from '../../services/expense-service';
import { ApiErrorService } from '../../services/api-error-service';
import { firstValueFrom } from 'rxjs';
import { CreateExpenseDialog } from '../../expenses/create-expense-dialog/create-expense-dialog';

@Component({
  selector: 'ep-budget-detail',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './budget-detail.html',
  styleUrl: './budget-detail.css',
})
export class BudgetDetail {
  readonly Math = Math;
  
  private readonly budgetService = inject(BudgetService);

  // Route-based navigation not an input signal-based
  private readonly route = inject(ActivatedRoute);
  readonly budgetId = this.route.snapshot.paramMap.get('budgetId')!;

  private readonly dialog = inject(MatDialog);

  protected readonly openExpenseMenu = signal<string | null>(null);

  private readonly expenseService = inject(ExpenseService);

  private readonly apiErrorService = inject(ApiErrorService);


  protected readonly getBudgetDetailsWithExpense =
    this.budgetService.budgetDetailsWithExpenses(this.budgetId);


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

  protected openEditExpenseDialog(expense: CreateUpdateExpenseModel): void {
    const dialogRef = this.dialog.open(EditExpenseDialog, {
      width: '600px',
      data: expense
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBudgetDetailsWithExpense.reload();
        this.apiErrorService.showSuccess('Expense updated successfully.');
      }
    });
  }

  protected async deleteExpense(id: string) {
    try {
      await firstValueFrom(this.expenseService.delete(id));
      this.getBudgetDetailsWithExpense.reload();
      this.apiErrorService.showSuccess('Expense deleted successfully.');
    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }

  protected openCreateExpenseDialog(): void {
    const budgetDetails = this.getBudgetDetailsWithExpense.value();
    const dialogRef = this.dialog.open(CreateExpenseDialog, {
      width: '600px',
      data: {
      budgetId: this.budgetId,
      categoryId: budgetDetails?.categoryId ?? undefined
    }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBudgetDetailsWithExpense.reload();
        this.apiErrorService.showSuccess('Expense created successfully.');
      }
    });
  }


  // for UI
  readonly budgetStatus = computed(() => {
    const budget = this.getBudgetDetailsWithExpense.value();

    if (!budget) {
      return null;
    }

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
  });

  readonly isBudgetUpcoming = computed(() => this.budgetStatus() === 'upcoming');
  readonly isBudgetExpired = computed(() => this.budgetStatus() === 'expired');
  readonly isBudgetCurrentlyActive = computed(() => this.budgetStatus() === 'active');


  // for UI
  readonly spendingStatus = computed(() => {
    const budget = this.getBudgetDetailsWithExpense.value();

    if (!budget) {
      return null;
    }

    if (budget.isOverBudget) {
      return 'over';
    }

    if (budget.percentageUsed >= 80) {
      return 'warning';
    }

    return 'healthy';

  })

  // readonly isSpendingOver = computed(() => this.spendingStatus() === 'over');
  // readonly isSpending = computed(() => this.budgetStatus() === 'expired');
  // readonly isBudgetCurrentlyActive = computed(() => this.budgetStatus() === 'active');
}
