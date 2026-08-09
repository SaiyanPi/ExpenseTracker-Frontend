export interface BudgetModel {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  startOn: string
  endsOn: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}
