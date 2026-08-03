import { HttpClient, httpResource } from '@angular/common/http';
import { inject, ResourceRef, Service } from '@angular/core';
import { CategoryModel } from '../models/category/category-model';
import { PagedResultModel } from '../models/paged/paged-result-model';

@Service()
export class CategoryService {
  private readonly http = inject(HttpClient);

  categories(): ResourceRef<PagedResultModel<CategoryModel> | undefined> {
    return httpResource<PagedResultModel<CategoryModel>>(() => ({
      url: 'http://localhost:5167/api/v1/categories/my'
    }));
  }
}
