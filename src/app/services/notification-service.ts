import { computed, effect, inject, Service, signal } from '@angular/core';
import { SignalRService } from './signal-r-service';
import { NotificationModel } from '../models/notification/notification-model';

@Service()
export class NotificationService {
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
}
