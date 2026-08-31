import { Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { DashboardService } from '../services/dashboard-service';
import { DateRangeState } from '../shared/date-range/date-range-state/date-range-state';
import { DateRange } from '../shared/date-range/date-range/date-range';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ApiErrorService } from '../services/api-error-service';
import { RouterLink } from "@angular/router";
import { BarController, BarElement, CategoryScale, Chart, LinearScale, LineController, LineElement,
  PointElement,
  Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip);


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


  //  chart
  protected readonly categoryCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('categoryChart');
  protected readonly expensesCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('dailyExpenseChart');
  protected readonly budgetCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('budgetUtilizationChart');

  constructor() {
    effect((onCleanup) => {
      const expensesByCategoryCanvas = this.categoryCanvas();
      const dailyExpensesCanvas = this.expensesCanvas();
      const budgetUtilizationCanvas = this.budgetCanvas();

      const dashboard = this.getDashboardData.value();
      if (!dashboard) {
        return;
      }

      // expensesByCategory Chart
      const expensesByCategoryChart = new Chart(expensesByCategoryCanvas.nativeElement, {
          type: 'bar',

          data: {
            labels: dashboard?.expenseByCategory.map(x => x.category),

            datasets: [
              {
                label: 'Expenses',
                data: dashboard?.expenseByCategory.map(x => x.totalAmount),

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
                    `${context.parsed.y}`,
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


      // dailyExpenses Chart
      const dailyExpensesChart = new Chart(dailyExpensesCanvas.nativeElement, {
        type: 'line',

        data: {
          labels: dashboard?.dailyExpenses.map(x => x.date),

          datasets: [
            {
              label: 'Expenses',
              data: dashboard?.dailyExpenses.map(x => x.totalAmount),

              borderColor: '#0d6efd',
              backgroundColor: 'rgba(13, 110, 253, 0.15)',

              borderWidth: 2,

              // Smooth the line slightly
              tension: 0.3,

              // Fill the area below the line
              fill: true,

              // Points
              pointRadius: 3,
              pointHoverRadius: 5,
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
                label: context => `${context.parsed.y}`,
              },
            },
          },

          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
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


      // budgetUtilization Chart
      const budgetUtilizationChart = new Chart(budgetUtilizationCanvas.nativeElement,
        {
          type: 'bar',

          data: {
            labels: dashboard?.budgetUtilization.map(x => x.budgetName),

            datasets: [
              {
                label: 'Budget utilization',

                data: dashboard?.budgetUtilization.map(x => x.utilizationPercentage),

                backgroundColor: dashboard?.budgetUtilization.map(x => {
                  if (x.utilizationPercentage >= 100) {
                    return '#dc3545'; // Over budget
                  }

                  if (x.utilizationPercentage >= 90) {
                    return '#fd7e14'; // Near limit
                  }

                  if (x.utilizationPercentage >= 70) {
                    return '#ffc107'; // Watch
                  }

                  return '#198754'; // Comfortable
                }),

                borderWidth: 0,

                borderRadius: 4,
              },
            ],
          },

          options: {
            indexAxis: 'y',

            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                display: false,
              },

              tooltip: {
                callbacks: {
                  label: context => {
                    const budget = dashboard?.budgetUtilization[context.dataIndex];

                    return [
                      ` Utilization: ${budget.utilizationPercentage}%`,
                      ` Spent: Rs. ${budget.actualSpent ?? 0}`,
                      ` Target: Rs. ${budget.budgetTarget}`,
                    ];
                  },
                },
              },
            },

            scales: {
              x: {
                beginAtZero: true,

                suggestedMax: 110,

                title: {
                  display: true,
                  text: 'Utilization (%)',
                },

                ticks: {
                  callback: value => `${value}%`,
                },
              },

              y: {
                title: {
                  display: true,
                  text: 'Budget',
                },
              },
            },
          },
        }
      );


      onCleanup(() => {
        expensesByCategoryChart.destroy();
        dailyExpensesChart.destroy();
        budgetUtilizationChart.destroy();
      });
    });
  }
}
