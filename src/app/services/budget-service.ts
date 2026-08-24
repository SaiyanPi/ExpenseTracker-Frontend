import { inject, ResourceRef, Service } from '@angular/core';
import { BudgetModel } from '../models/budget/budget-model';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateUpdateBudgetModel } from '../models/budget/create-update-budget-model';
import { Observable } from 'rxjs';
import { BudgetDetailModel } from '../models/budget/budget-detail-model';
import { PagedResultModel } from '../models/pagination/paged-result-model';
import { PagedQueryModel } from '../models/pagination/paged-query-model';
import { MAX_PAGE_SIZE } from '../shared/constants/service.constants';


@Service()
export class BudgetService {
  private readonly http = inject(HttpClient);

  budgets(query?: () => PagedQueryModel): ResourceRef<PagedResultModel<BudgetModel> | undefined> {
    return httpResource<PagedResultModel<BudgetModel>>(() => {
      const q = query?.();
      return {
        url: 'http://localhost:5167/api/v1/budgets/my',
        params: q? {
          page: q.page,
          pageSize: q.pageSize,
          ...(q.sortBy !== null? { sortBy: q.sortBy }: {}),
          sortDesc: q.sortDesc
        }: {
          page: 1,
          pageSize: MAX_PAGE_SIZE,
          sortBy: 'Name',
          sortDesc: false
        }
      }
    });
  }

  activeBudgets(query?: () => PagedQueryModel): ResourceRef<PagedResultModel<BudgetModel> | undefined> {
    return httpResource<PagedResultModel<BudgetModel>>(() => {
      const q = query?.();
      return {
        url: 'http://localhost:5167/api/v1/budgets/active',
        params: q? {
          page: q.page,
          pageSize: q.pageSize,
          ...(q.sortBy !== null? { sortBy: q.sortBy }: {}),
          sortDesc: q.sortDesc
        }: {
          page: 1,
          pageSize: MAX_PAGE_SIZE,
          sortBy: 'Name',
          sortDesc: false
        }
      }
    });
  }

  create(request: CreateUpdateBudgetModel): Observable<void> {
    return this.http.post<void>('http://localhost:5167/api/v1/budgets', request);
  }

  delete(budgetId: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:5167/api/v1/budgets/${budgetId}`);
  }

  update(budgetId: string, budget: CreateUpdateBudgetModel): Observable<void> {
    return this.http.put<void>(`http://localhost:5167/api/v1/budgets/${budgetId}`, budget);
  }

  budgetDetailsWithExpenses(budgetId: string, query: () => PagedQueryModel)
    : ResourceRef<BudgetDetailModel | undefined> {
    return httpResource<BudgetDetailModel>(() =>{
      const q = query();
      return {
        url: 'http://localhost:5167/api/v1/budgets/budget-detail-with-expenses',
        params: {
          budgetId: budgetId,

          page: q.page,
          pageSize: q.pageSize,
          ...(q.sortBy !== null? { sortBy: q.sortBy }: {}),
          sortDesc: q.sortDesc
        }
      };
    });
  }
}
