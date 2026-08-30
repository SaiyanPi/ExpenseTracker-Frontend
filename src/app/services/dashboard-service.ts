import { httpResource } from '@angular/common/http';
import { ResourceRef, Service } from '@angular/core';
import { DashboardSummaryModel } from '../models/dashboard/dashboard-summary-model';
import { DashboardQueryModel } from '../models/dashboard/dashboard-query-model';

@Service()
export class DashboardService {
  dashboard(query: () => DashboardQueryModel): ResourceRef<DashboardSummaryModel | undefined> {
    return httpResource<DashboardSummaryModel>(() => {
      const q = query();
      return {
        url: 'http://localhost:5167/api/v1/dashboard/dashboard',
        params: {
          ...(q.startDate !== null? { startDate: q.startDate }: {}),
          ...(q.endDate !== null? { endDate: q.endDate }: {})
        }
      };
    });
  }
}
