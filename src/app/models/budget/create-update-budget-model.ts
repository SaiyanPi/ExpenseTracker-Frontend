export interface CreateUpdateBudgetModel {
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  categoryId: string | null;
}
