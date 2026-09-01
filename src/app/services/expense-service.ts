import { HttpClient, httpResource } from '@angular/common/http';
import { inject, ResourceRef, Service } from '@angular/core';
import { PagedResultModel } from '../models/pagination/paged-result-model';
import { ExpenseModel } from '../models/expense/expense-model';
import { Observable } from 'rxjs';
import { CreateUpdateExpenseModel } from '../models/expense/create-update-expense-model';
import { PagedQueryModel } from '../models/pagination/paged-query-model';
import { FilterExpenseQueryModel } from '../models/filter-expense/filter-expense-query-model';
import { FilterExpenseModel } from '../models/expense/filter-expense-model';
import { ExportExpensesQueryModel } from '../models/export/export-expenses-query-model';

@Service()
export class ExpenseService {

  private readonly http = inject(HttpClient);

  // expenses(query: () => PagedQueryModel): ResourceRef<PagedResultModel<ExpenseModel> | undefined> {
  //   return httpResource<PagedResultModel<ExpenseModel>>(() => {
  //     const q = query();
  //     return {
  //       url: 'http://localhost:5167/api/v1/expenses/my',
  //       params: {
  //         page: q.page,
  //         pageSize: q.pageSize,
  //         ...(q.sortBy !== null? { sortBy: q.sortBy }: {}),
  //         sortDesc: q.sortDesc
  //       }
  //     };
  //   });
  // }

  create(request: CreateUpdateExpenseModel): Observable<void> {
    return this.http.post<void>('http://localhost:5167/api/v1/expenses', request);
  }

  delete(expenseId: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:5167/api/v1/expenses/${expenseId}`);
  }

  update(expenseId: string, expense: CreateUpdateExpenseModel): Observable<void> {
    return this.http.put<void>(`http://localhost:5167/api/v1/expenses/${expenseId}`, expense);
  }

  categoryDetailsWithExpenses(categoryId: string, query: () => PagedQueryModel)
    : ResourceRef<PagedResultModel<ExpenseModel> | undefined> {
    return httpResource<PagedResultModel<ExpenseModel>>(() => {
      const q = query();
      return {
        url: 'http://localhost:5167/api/v1/expenses/category-expenses/my',
        params: {
          categoryId: categoryId,

          page: q.page,
          pageSize: q.pageSize,
          ...(q.sortBy !== null? { sortBy: q.sortBy }: {}),
          sortDesc: q.sortDesc
        }
      };
    }
    );
  }

  filterExpenses(query: () => FilterExpenseQueryModel): ResourceRef<FilterExpenseModel | undefined> {
    return httpResource<FilterExpenseModel>(() =>{
      const q = query();
      return {
        url: 'http://localhost:5167/api/v1/expenses/filter',
        params: {
          ...(q.categoryId !== null? { categoryId: q.categoryId }: {}),
          ...(q.budgetId !== null? { budgetId: q.budgetId }: {}),
          ...(q.startDate !== null? { startDate: q.startDate }: {}),
          ...(q.endDate !== null? { endDate: q.endDate }: {}),
          ...(q.minAmount !== null? { minAmount: q.minAmount }: {}),
          ...(q.maxAmount !== null? { maxAmount: q.maxAmount }: {}),
          ...(q.search !== null? { search: q.search }: {}),
          page: q.page,
          pageSize: q.pageSize,
          ...(q.sortBy !== null? { sortBy: q.sortBy }: {}),
          sortDesc: q.sortDesc
        }
      };
    });
  }

  exportExpenses(query: ExportExpensesQueryModel): Observable<Blob> {
    return this.http.get(
      'http://localhost:5167/api/v1/expenses/export',
      {
        params: {
          ...(query.categoryId ? { categoryId: query.categoryId } : {}),
          ...(query.budgetId ? { budgetId: query.budgetId } : {}),
          ...(query.startDate ? { startDate: query.startDate } : {}),
          ...(query.endDate ? { endDate: query.endDate } : {}),
          ...(query.minAmount != null ? { minAmount: query.minAmount } : {}),
          ...(query.maxAmount != null ? { maxAmount: query.maxAmount } : {}),
          format: query.format
        },
        responseType: 'blob'
      }
    );
  }
  
}
