import { PagedQueryModel } from "./paged-query-model";

export interface FilterExpenseQueryModel extends PagedQueryModel{
  categoryId: string | null;
  budgetId: string | null;
  startDate: string | null;
  endDate: string | null;
  minAmount: number | null;
  maxAmount: number | null;
}
