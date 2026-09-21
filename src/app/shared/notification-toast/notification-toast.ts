import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification-service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ep-notification-toast',
  imports: [MatIcon],
  templateUrl: './notification-toast.html',
  styleUrl: './notification-toast.css',
})
export class NotificationToast {
  private readonly notificationService = inject(NotificationService);

  readonly notification = this.notificationService.latestNotification;

  close(): void {
    this.notificationService.clearLatestNotification();
  }
}
