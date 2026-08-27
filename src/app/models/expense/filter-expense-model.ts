import { PagedResultModel } from "../pagination/paged-result-model";
import { ExpenseModel } from "./expense-model";

export interface FilterExpenseModel {
  totalAmount: number;

  expenses: PagedResultModel<ExpenseModel>;
}
