import { Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { DashboardService } from '../services/dashboard-service';
import { DateRangeState } from '../shared/date-range/date-range-state/date-range-state';
import { DateRange } from '../shared/date-range/date-range/date-range';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiErrorService } from '../services/api-error-service';
import { RouterLink } from "@angular/router";
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

@Component({
  selector: 'ep-dashboard',
  imports: [DecimalPipe, DatePipe, DateRange, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly Math = Math;

  private readonly apiErrorService = inject(ApiErrorService);

  private readonly dashboardService = inject(DashboardService);

  readonly dateRange = new DateRangeState();

  protected readonly getDashboardData = this.dashboardService.dashboard(this.dateRange.query);

  protected readonly dashboardError = computed(() => {
    const error = this.getDashboardData.error();

    if (!error) {
      return null;
    }
    
    // here i don't want to display error message in a snackBar, instead i want to display in a template
    return this.apiErrorService.getMessage(error);
  });


  protected readonly categoryCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('categoryChart');
  private readonly expenseByCategory = computed(
    () => this.getDashboardData.value()?.expenseByCategory ?? []
  );

  private categoryChart?: Chart<'bar'>;

  private readonly chartEffect = effect((onCleanup) => {

    const canvas = this.categoryCanvas();

    const data = this.expenseByCategory();

    const chart = new Chart(canvas.nativeElement, {
      type: 'bar',

      data: {
        labels: data.map(x => x.category),

        datasets: [
          {
            label: 'Expenses',
            data: data.map(x => x.totalAmount),

            backgroundColor: 'rgba(13, 110, 253, 0.75)',
            borderColor: '#0d6efd',
            borderWidth: 1,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            callbacks: {
              label: context =>
                ` ${context.parsed.y}`,
            },
          },
        },

        scales: {
          x: {
            title: {
              display: true,
              text: 'Category',
            },
          },

          y: {
            beginAtZero: true,

            title: {
              display: true,
              text: 'Amount',
            },
          },
        },
      },
    });

    onCleanup(() => {
      chart.destroy();
    });
  });

}
