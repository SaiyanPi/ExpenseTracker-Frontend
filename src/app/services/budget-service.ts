import { inject, ResourceRef, Service } from '@angular/core';
import { BudgetModel } from '../models/budget/budget-model';
import { PagedResultModel } from '../models/paged/paged-result-model';
import { HttpClient, httpResource } from '@angular/common/http';
import { CreateUpdateBudgetModel } from '../models/budget/create-update-budget-model';
import { Observable } from 'rxjs';

@Service()
export class BudgetService {
  private readonly http = inject(HttpClient);

  budgets(): ResourceRef<PagedResultModel<BudgetModel> | undefined> {
    return httpResource<PagedResultModel<BudgetModel>>(() => ({
      url: 'http://localhost:5167/api/v1/budgets/my'
    }));
  }

  create(budget: CreateUpdateBudgetModel): Observable<void> {
    return this.http.post<void>('http://localhost:5167/api/v1/budgets', budget);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:5167/api/v1/budgets/${id}`);
  }

  update(id: string, budget: CreateUpdateBudgetModel): Observable<void> {
    return this.http.put<void>(`http://localhost:5167/api/v1/budgets/${id}`, budget);
  }
}
