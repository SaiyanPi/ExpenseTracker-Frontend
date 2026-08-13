import { HttpClient, httpResource } from '@angular/common/http';
import { inject, ResourceRef, Service } from '@angular/core';
import { PagedResultModel } from '../models/paged/paged-result-model';
import { ExpenseModel } from '../models/expense/expense-model';

@Service()
export class ExpenseService {
  private readonly http = inject(HttpClient);

  expenses(): ResourceRef<PagedResultModel<ExpenseModel> | undefined> {
    return httpResource<PagedResultModel<ExpenseModel>>(() => ({
      url: 'http://localhost:5167/api/v1/expenses/my'
    }));
  }

  // create(request: CreateUpdateCategoryModel): Observable<void> {
  //   return this.http.post<void>('http://localhost:5167/api/v1/categories', request);
  // }

  // delete(id: string): Observable<void> {
  //   return this.http.delete<void>(`http://localhost:5167/api/v1/categories/${id}`);
  // }

  // update(id: string, category: CreateUpdateCategoryModel): Observable<void> {
  //   return this.http.put<void>(`http://localhost:5167/api/v1/categories/${id}`, category);
  // }
}
