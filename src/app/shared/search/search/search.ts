import { Component, input } from '@angular/core';
import { SearchState } from '../search-state/search-state/search-state';

@Component({
  selector: 'ep-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  readonly searchState = input.required<SearchState>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchState().setSearch(value);
  }
}
