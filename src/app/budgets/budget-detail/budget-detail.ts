import { Component, inject } from '@angular/core';
import { BudgetService } from '../../services/budget-service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ep-budget-detail',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './budget-detail.html',
  styleUrl: './budget-detail.css',
})
export class BudgetDetail {
  private readonly budgetService = inject(BudgetService);

  // Route-based navigation not an input signal-based
  private readonly route = inject(ActivatedRoute);
  readonly budgetId = this.route.snapshot.paramMap.get('budgetId')!;

  protected readonly getBudgetDetailsWithExpense =
    this.budgetService.budgetDetailsWithExpenses(this.budgetId);
}
