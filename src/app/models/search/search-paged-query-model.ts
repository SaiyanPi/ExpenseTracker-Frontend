import { PagedQueryModel } from './../pagination/paged-query-model';

export interface SearchPagedQueryModel extends PagedQueryModel{
  search: string | null
}
