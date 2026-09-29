import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
  selector: 'ep-notifications',
  imports: [DatePipe, Search],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications {
  private readonly notificationService = inject(NotificationService);

  private readonly router = inject(Router);

  readonly pagination = new PaginationState();
  readonly searchState = new SearchState()

  protected readonly query = computed<SearchPagedQueryModel>(() => ({
    ...this.pagination.query(),
    search: this.searchState.search()
  }));

  private readonly apiErrorService = inject(ApiErrorService);

  protected readonly getNotifications = this.notificationService.allNotifications(this.query);

  // occumulated notifications - load more notification
  readonly notifications = signal<NotificationModel[]>([]);

  // Append/replace API results
  private readonly notificationsEffect = effect(() => {
    const result = this.getNotifications.value();

    if (!result) {
      return;
    }

    const currentPage = this.pagination.query().page;

    if (currentPage === 1) {

      // First page / refreshed search
      this.notifications.set(result.items);
      return;
    }

    // Load more
    this.notifications.update(current => [
      ...current,
      ...result.items
    ]);

  });

  // load more
  protected loadMore(): void {
    if (this.getNotifications.isLoading()) {
      return;
    }
    this.pagination.next(this.hasMoreNotifications());
  }

  // has more? - load more notification
  readonly hasMoreNotifications = computed(() => {
    const result = this.getNotifications.value();

    if (!result) {
      return false;
    }
    return this.notifications().length < result.totalCount;
  });


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

  protected handleNotificationClick(notification: NotificationModel): void {
    if (!notification.isRead) {
      this.markAsRead(notification);
      return;
    }

    if (notification.type === NotificationType.BudgetExceeded && notification.relatedEntityId) {
      this.router.navigate(['/layout/budgets', notification.relatedEntityId]);
    }
  }

  protected async markAsRead(notification: NotificationModel): Promise<void> {
    if (notification.isRead) {
      return;
    }
    try {
      await firstValueFrom(
        this.notificationService.markAsRead(notification.id)
      );
      this.notifications.update(notifications =>
        notifications.map(item =>
          item.id === notification.id
            ? { ...item, isRead: true }
            : item
        )
      );
      this.getAllUnreadCount.reload();
      this.apiErrorService.showSuccess('Notification marked as read.');
    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }

  protected async markAllAsRead(): Promise<void> {
    try {
      await firstValueFrom(
        this.notificationService.markAllAsRead()
      );
      this.notifications.update(notifications =>
        notifications.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
      this.getAllUnreadCount.reload();
      this.apiErrorService.showSuccess('All notifications marked as read.');
    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }
}
