import { signal } from "@angular/core";

export class SearchState {
  readonly search = signal<string | null>(null);

  setSearch(value: string): void {
    const search = value.trim();
    this.search.set(search === '' ? null : search);
  }

  reset(): void {
    this.search.set(null);
  }
}
