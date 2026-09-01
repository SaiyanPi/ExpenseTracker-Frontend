// import { PagedQueryModel } from "../pagination/paged-query-model";
import { SearchPagedQueryModel } from "../search/search-paged-query-model";
import { ExpenseFilterModel } from "./expense-filter-model";

export interface FilterExpenseQueryModel extends ExpenseFilterModel, SearchPagedQueryModel {}
