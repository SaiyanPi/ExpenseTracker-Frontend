import { HttpClient, httpResource } from '@angular/common/http';
import { inject, ResourceRef, Service } from '@angular/core';
import { CategoryModel } from '../models/category/category-model';
import { PagedResultModel } from '../models/paged/paged-result-model';
import { Observable } from 'rxjs';
import { CreateCategoryModel } from '../models/category/create-category-model';

@Service()
export class CategoryService {
  private readonly http = inject(HttpClient);

  categories(): ResourceRef<PagedResultModel<CategoryModel> | undefined> {
    return httpResource<PagedResultModel<CategoryModel>>(() => ({
      url: 'http://localhost:5167/api/v1/categories/my'
    }));
  }

  create(category: CreateCategoryModel): Observable<void> {
    return this.http.post<void>('http://localhost:5167/api/v1/categories', category);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:5167/api/v1/categories/${id}`);
  }
}
