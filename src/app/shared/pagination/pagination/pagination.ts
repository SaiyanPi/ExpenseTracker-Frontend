import { Component, input } from '@angular/core';
import { PaginationState } from '../pagination-state/pagination-state';
import { PagedResultModel } from '../../../models/pagination/paged-result-model';
import { PAGE_SIZE_OPTIONS } from '../../constants/pagination.constants';

export interface SortOption {
  label: string;
  value: string;
}

@Component({
  selector: 'ep-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})

export class Pagination {
  readonly paginationState = input.required<PaginationState>();

  readonly result = input<PagedResultModel<unknown> | undefined>();
  readonly loading = input(false);

  readonly sortOptions = input<SortOption[]>([]);

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  nextPage(): void {
    this.paginationState().next(this.result()?.hasNext ?? false);
  }

  previousPage(): void {
    this.paginationState().previous(this.result()?.hasPrevious ?? false);
  }

  changePageSize(event: Event): void {
    const size = Number((event.target as HTMLSelectElement).value);
    this.paginationState().changePageSize(size);
  }

  changeSortBy(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.paginationState().changeSort(value || null);
  }

  toggleSortDirection(): void {
    this.paginationState().toggleSortDirection();
  }

  reset(): void {
    this.paginationState().reset();
  }
}
