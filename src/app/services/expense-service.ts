import { HttpClient, httpResource } from '@angular/common/http';
import { inject, ResourceRef, Service } from '@angular/core';
import { PagedResultModel } from '../models/pagination/paged-result-model';
import { ExpenseModel } from '../models/expense/expense-model';
import { Observable } from 'rxjs';
import { CreateUpdateExpenseModel } from '../models/expense/create-update-expense-model';
import { PagedQueryModel } from '../models/pagination/paged-query-model';

@Service()
export class ExpenseService {

  private readonly http = inject(HttpClient);

  expenses(query: () => PagedQueryModel): ResourceRef<PagedResultModel<ExpenseModel> | undefined> {
  return httpResource<PagedResultModel<ExpenseModel>>(() => {
    const q = query();
    return {
      url: 'http://localhost:5167/api/v1/expenses/my',
      params: {
        page: q.page,
        pageSize: q.pageSize,
        ...(q.sortBy !== null? { sortBy: q.sortBy }: {}),
        sortDesc: q.sortDesc
      }
    };
  });
}

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
}
