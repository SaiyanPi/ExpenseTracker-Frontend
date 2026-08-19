import { ExpenseModel } from "../expense/expense-model";
import { PagedResultModel } from "../paged/paged-result-model";

export interface BudgetDetailModel {
  id: string;
  name: string;
  limit: number;

  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  isOverBudget: boolean;
  
  isActive: boolean;
  startDate: string;
  endDate: string;
  categoryId: string | null;
  categoryName: string | null,
  expenses: PagedResultModel<ExpenseModel>;
}
