export interface ExpenseFilterModel {
  categoryId: string | null;
  budgetId: string | null;
  startDate: string | null;
  endDate: string | null;
  minAmount: number | null;
  maxAmount: number | null;
}
