// import { PagedQueryModel } from "../pagination/paged-query-model";
import { SearchPagedQueryModel } from "../search/search-paged-query-model";

export interface FilterExpenseQueryModel extends SearchPagedQueryModel{
  categoryId: string | null;
  budgetId: string | null;
  startDate: string | null;
  endDate: string | null;
  minAmount: number | null;
  maxAmount: number | null;
}
