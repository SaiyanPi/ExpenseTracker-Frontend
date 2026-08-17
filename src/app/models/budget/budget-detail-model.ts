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
  expenses: PagedResultModel<ExpenseModel>;
}
