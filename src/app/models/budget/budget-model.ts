export interface BudgetModel {
  id: string;
  name: string;
  amount: number;

  totalSpent: number,
  remaining: number,
  percentageUsed: number,
  isOverBudget: boolean,

  categoryId: string | null;
  categoryName: string | null;
  startDate: string
  endDate: string;
  isActive: boolean;

  createdAt: string;
  updatedAt: string | null;
}
