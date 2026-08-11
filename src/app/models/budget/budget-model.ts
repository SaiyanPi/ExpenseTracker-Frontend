export interface BudgetModel {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  startDate: string
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}
