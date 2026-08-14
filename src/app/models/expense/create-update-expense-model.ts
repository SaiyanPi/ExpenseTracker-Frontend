export interface CreateUpdateExpenseModel {
  title: string;
  description: string;
  amount: number;
  date: string | null;
  categoryId: string | null;
  budgetId: string | null;
}
