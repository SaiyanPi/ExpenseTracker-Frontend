import { Component, inject, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense-service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'ep-category-detail',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.css',
})
export class CategoryDetail {
  private readonly expenseService = inject(ExpenseService);

  // Route-based navigation not an input signal-based
  private readonly route = inject(ActivatedRoute);
  readonly categoryId = this.route.snapshot.paramMap.get('categoryId')!;

  protected readonly openCategoryMenu = signal<string | null>(null);


  protected readonly getCategoryDetailsWithExpense =
    this.expenseService.categoryDetailsWithExpenses(this.categoryId);


  protected toggleCategoryMenu(id: string): void {
    this.openCategoryMenu.update(current => current === id ? null : id);
  }

}
