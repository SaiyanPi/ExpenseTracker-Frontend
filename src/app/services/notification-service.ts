import { computed, effect, inject, ResourceRef, Service, signal } from '@angular/core';
import { SignalRService } from './signal-r-service';
import { NotificationModel } from '../models/notification/notification-model';
import { MAX_PAGE_SIZE } from '../shared/constants/service.constants';
import { SearchPagedQueryModel } from '../models/search/search-paged-query-model';
import { PagedResultModel } from '../models/pagination/paged-result-model';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';

@Service()
export class NotificationService {
  private readonly http = inject(HttpClient);

  private readonly signalRService = inject(SignalRService);

  private readonly _notifications = signal<NotificationModel[]>([]);

  private readonly _latestNotification = signal<NotificationModel | null>(null);

  readonly notifications = this._notifications.asReadonly();

  readonly latestNotification = this._latestNotification.asReadonly();

  clearLatestNotification(): void {
    this._latestNotification.set(null);
  }

  readonly unreadCount = computed(() =>
    this._notifications()
      .filter(notification => !notification.isRead)
      .length
  );

  constructor() {
    effect(() => {
      const notification = this.signalRService.notificationReceived();

      if (!notification) {
        return;
      }

      this._latestNotification.set(notification);

      this._notifications.update(
        notifications => [
          notification,
          ...notifications,
        ]
      );

      setTimeout(() => {
        this._latestNotification.update(
          current =>
            current?.id === notification.id
              ? null
              : current
        );
      }, 10000);
    });
  }


  allNotifications(query?: () => SearchPagedQueryModel)
    : ResourceRef<PagedResultModel<NotificationModel> | undefined> {
    return httpResource<PagedResultModel<NotificationModel>>(() => {
      const q = query?.();

      return {
        url: 'http://localhost:5167/api/v1/notifications',
        params: q? {
          ...(q.search !== null? { search: q.search }: {}),
          page: q.page,
          pageSize: q.pageSize
        }: {
          page: 1,
          pageSize: MAX_PAGE_SIZE
        }
      };
    });
  }

  allUnreadCount(): ResourceRef<number | undefined> {
    return httpResource<number>(() => ({
      url: 'http://localhost:5167/api/v1/notifications/unread-count'
    }));
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.http.patch<void>(
      `http://localhost:5167/api/v1/notifications/${notificationId}/read`,
      {}
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(
      'http://localhost:5167/api/v1/notifications/read-all',
      {}
    );
  }
}
