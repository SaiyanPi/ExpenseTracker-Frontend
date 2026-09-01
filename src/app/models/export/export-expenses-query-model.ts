import { ExpenseFilterModel } from "../filter-expense/expense-filter-model";

export interface ExportExpensesQueryModel extends ExpenseFilterModel {
  format: 'csv' | 'pdf' | 'xlsx';
}
