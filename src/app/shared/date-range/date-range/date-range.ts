import { Component, input } from '@angular/core';
import { DateRangeState } from '../date-range-state/date-range-state';

@Component({
  selector: 'ep-date-range',
  imports: [],
  templateUrl: './date-range.html',
  styleUrl: './date-range.css',
})
export class DateRange {
  // readonly errorMessage = input<string | null>(null);

  readonly dateRangeState = input.required<DateRangeState>();

  readonly loading = input(false);

  onStartDateChange(value: string): void {
    this.dateRangeState().setStartDate(value);
  }

  onEndDateChange(value: string): void {
    this.dateRangeState().setEndDate(value);
  }

  reset(): void {
    this.dateRangeState().reset();
  }
}
