import { inject, ResourceRef, Service } from '@angular/core';
import { BudgetModel } from '../models/budget/budget-model';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateUpdateBudgetModel } from '../models/budget/create-update-budget-model';
import { Observable } from 'rxjs';
import { BudgetDetailModel } from '../models/budget/budget-detail-model';
import { PagedResultModel } from '../models/paged/paged-result-model';

@Service()
export class BudgetService {
  private readonly http = inject(HttpClient);

  budgets(): ResourceRef<PagedResultModel<BudgetModel> | undefined> {
    return httpResource<PagedResultModel<BudgetModel>>(() => ({
      url: 'http://localhost:5167/api/v1/budgets/my'
    }));
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

  budgetDetailsWithExpenses(budgetId: string): ResourceRef<BudgetDetailModel | undefined> {
    return httpResource<BudgetDetailModel>(() =>
      `http://localhost:5167/api/v1/budgets/budget-detail-with-expenses?budgetId=${budgetId}`
    );
  }
}
