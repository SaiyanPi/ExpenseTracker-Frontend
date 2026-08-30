export interface ExportExpensesQueryModel {
  format: 'csv' | 'pdf';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  categoryId?: string;
  budgetId?: string;
  userId?: string;
}
