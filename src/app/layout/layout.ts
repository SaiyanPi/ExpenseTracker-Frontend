import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { ProfileService } from '../services/profile-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../services/notification-service';
import { NotificationToast } from '../shared/notification-toast/notification-toast';

@Component({
  selector: 'ep-layout',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    RouterOutlet,
    RouterLink,
    NotificationToast
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly profileService = inject(ProfileService);

  // protected readonly profile = this.profileService.getProfile();
  protected readonly profile = this.profileService.profile;

  private readonly snackBar = inject(MatSnackBar);

  private readonly notificationService = inject(NotificationService);

  readonly latestNotification = this.notificationService.latestNotification;

  readonly notifications = this.notificationService.notifications;

  readonly unreadCount = this.notificationService.unreadCount;

  constructor() {
    this.profileService.loadProfile().subscribe();

    effect(() => {
      const notification = this.latestNotification();

      if (!notification) {
        return;
      }

      console.log('📢 Showing notification:', notification);

      // this.snackBar.open(notification.message,
      //   'Dismiss',
      //   {
      //     duration: 10000,
      //     horizontalPosition: 'right',
      //     verticalPosition: 'top',
      //   }
      // );
    });
  }

  protected readonly isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );
}
