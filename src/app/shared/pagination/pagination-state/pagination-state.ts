import { computed, signal } from '@angular/core';
import { PagedQueryModel } from '../../../models/pagination/paged-query-model';

// this is a state class not a component

export class PaginationState {

  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly sortBy = signal<string | null>(null);
  readonly sortDesc = signal(false);

  readonly query = computed<PagedQueryModel>(() => ({
    page: this.page(),
    pageSize: this.pageSize(),
    sortBy: this.sortBy(),
    sortDesc: this.sortDesc()
  }));

  next(hasNext: boolean): void {
    if (hasNext) {
      this.page.update(page => page + 1);
    }
  }

  previous(hasPrevious: boolean): void {
    if (hasPrevious) {
      this.page.update(page => page - 1);
    }
  }

  changePageSize(pageSize: number): void {
    this.pageSize.set(pageSize);
    this.page.set(1);
  }

  changeSort(sortBy: string | null): void {
    this.sortBy.set(sortBy);
    this.sortDesc.set(false);
    this.page.set(1);
  }

  toggleSortDirection(): void {
    this.sortDesc.update(value => !value);
    this.page.set(1);
  }

  reset(): void {
    this.page.set(1);
    this.pageSize.set(10);
    this.sortBy.set(null);
    this.sortDesc.set(false);
  }

}
