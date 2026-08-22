import { HttpClient, httpResource } from '@angular/common/http';
import { inject, ResourceRef, Service } from '@angular/core';
import { CategoryModel } from '../models/category/category-model';
import { PagedResultModel } from '../models/pagination/paged-result-model';
import { Observable } from 'rxjs';
import { CreateUpdateCategoryModel } from '../models/category/create-update-category-model';
import { PagedQueryModel } from '../models/pagination/paged-query-model';
import { MAX_PAGE_SIZE } from '../shared/constants/service.constants';

@Service()
export class CategoryService {

  private readonly http = inject(HttpClient);

  categories(query?: () => PagedQueryModel): ResourceRef<PagedResultModel<CategoryModel> | undefined> {
    return httpResource<PagedResultModel<CategoryModel>>(() => {
      const q = query?.();
      return {
        url: 'http://localhost:5167/api/v1/categories/my',
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
      };
    });
  }

  create(request: CreateUpdateCategoryModel): Observable<void> {
    return this.http.post<void>('http://localhost:5167/api/v1/categories', request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:5167/api/v1/categories/${id}`);
  }

  update(id: string, category: CreateUpdateCategoryModel): Observable<void> {
    return this.http.put<void>(`http://localhost:5167/api/v1/categories/${id}`, category);
  }
}
