export interface ExpenseModel {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;

  categoryId: string | null;
  categoryName: string | null;

  budgetId: string | null
  budgetName: string | null;

  createdAt: string;
  updatedAt: string | null;
}
