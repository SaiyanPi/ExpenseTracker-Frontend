import { CategorySummaryModel } from "./category-summary-model";
import { DailyExpensesModel } from "./daily-expenses-model";
import { RecentExpensesModel } from "./recent-expenses-model";

export interface DashboardSummaryModel {
  totalExpenses: number;
  totalBudgets: number;
  topCategory: CategorySummaryModel | null;
  expenseByCategory: CategorySummaryModel[];
  dailyExpenses: DailyExpensesModel[];
  recentExpenses: RecentExpensesModel[];
}
