import { Component, computed, inject } from '@angular/core';
import { NotificationService } from '../services/notification-service';
import { PaginationState } from '../shared/pagination/pagination-state/pagination-state';
import { SearchState } from '../shared/search/search-state/search-state/search-state';
import { SearchPagedQueryModel } from '../models/search/search-paged-query-model';
import { ApiErrorService } from '../services/api-error-service';
import { firstValueFrom } from 'rxjs';
import { NotificationType } from '../enums/notification-type';
import { NotificationModel } from '../models/notification/notification-model';
import { DatePipe } from '@angular/common';
import { Search } from '../shared/search/search/search';

@Component({
  selector: 'ep-notifications',
  imports: [DatePipe, Search],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  private readonly notificationService = inject(NotificationService);

  readonly pagination = new PaginationState();
  readonly searchState = new SearchState()

  protected readonly query = computed<SearchPagedQueryModel>(() => ({
    ...this.pagination.query(),
    search: this.searchState.search()
  }));

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly getNotifications = this.notificationService.allNotifications(this.query);

  protected getNotificationIcon(type: string): string {
    switch (type) {
      case NotificationType.BudgetExceeded:
        return 'bi bi-wallet2';

      default:
        return 'bi bi-bell';
    }
  }

  protected getNotificationClass(type: string): string {
    switch (type) {
      case NotificationType.BudgetExceeded:
        return 'notification-icon budget';

      default:
        return 'notification-icon default';
    }
  }


  protected readonly getAllUnreadCount = this.notificationService.allUnreadCount;

  protected async markAsRead(notification: NotificationModel): Promise<void> {
    if (notification.isRead) {
      return;
    }

    try {
      await firstValueFrom(
        this.notificationService.markAsRead(notification.id)
      );

      this.getNotifications.reload();
      this.getAllUnreadCount.reload();

    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }

  protected async markAllAsRead(): Promise<void> {
    try {
      await firstValueFrom(
        this.notificationService.markAllAsRead()
      );

      this.getNotifications.reload();
      this.getAllUnreadCount.reload();

      this.apiErrorService.showSuccess('All notifications marked as read.');

    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }
}
