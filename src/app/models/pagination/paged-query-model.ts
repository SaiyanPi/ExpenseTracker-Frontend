export interface PagedQueryModel {
  page: number;
  pageSize: number;
  sortBy: string | null;
  sortDesc: boolean;
}
