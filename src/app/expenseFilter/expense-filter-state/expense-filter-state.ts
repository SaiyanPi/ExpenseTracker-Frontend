import { signal } from "@angular/core";

export class ExpenseFilterState {
  readonly categoryId = signal<string | null>(null);
  readonly budgetId = signal<string | null>(null);
  readonly startDate = signal<string | null>(null);
  readonly endDate = signal<string | null>(null);
  readonly minAmount = signal<number | null>(null);
  readonly maxAmount = signal<number | null>(null);

  reset(): void {
    this.categoryId.set(null);
    this.budgetId.set(null);
    this.startDate.set(null);
    this.endDate.set(null);
    this.minAmount.set(null);
    this.maxAmount.set(null);
  }
}
