import { DashboardQueryModel } from './../../../models/dashboard/dashboard-query-model';
import { computed, signal } from "@angular/core";

export class DateRangeState {
  readonly startDate = signal<string | null>(null);
  readonly endDate = signal<string | null>(null);

  readonly query = computed<DashboardQueryModel>(() => ({
    startDate: this.startDate(),
    endDate: this.endDate()
  }))

  setStartDate(value: string): void {
    this.startDate.set(value || null);
  }

  setEndDate(value: string): void {
    this.endDate.set(value || null);
  }

  reset(): void {
    this.startDate.set(null);
    this.endDate.set(null);
  }
}
