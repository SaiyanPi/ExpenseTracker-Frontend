import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { inject, Service, signal } from '@angular/core';
import { AuthService } from './auth-service';
import { NotificationModel } from '../models/notification/notification-model';

@Service()
export class SignalRService {
  private readonly authService = inject(AuthService);

  private hubConnection?: HubConnection;

  readonly connected = signal(false);

  private readonly _notificationReceived =
    signal<NotificationModel | null>(null);

  readonly notificationReceived =
    this._notificationReceived.asReadonly();

  async start(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5167/hubs/notifications', {
        accessTokenFactory: () =>
          this.authService.currentUser()?.token ?? '',
      })
      .withAutomaticReconnect()
      .build();

    this.registerEvents();
    this.registerConnectionEvents();

    await this.hubConnection.start();

    this.connected.set(true);

    console.log('🟢 SignalR connected');
  }

  async stop(): Promise<void> {
    if (!this.hubConnection) {
      return;
    }

    await this.hubConnection.stop();

    this.connected.set(false);
    this.hubConnection = undefined;

    this._notificationReceived.set(null);

    console.log('🔴 SignalR disconnected');
  }

  private registerEvents(): void {
    this.hubConnection?.on(
      'NotificationReceived',
      (notification: NotificationModel) => {
        console.log(
          '🔔 Notification received:',
          notification
        );

        this._notificationReceived.set(notification);
      }
    );
  }

  private registerConnectionEvents(): void {
    this.hubConnection?.onreconnecting(() => {
      this.connected.set(false);

      console.log('🟡 SignalR reconnecting...');
    });

    this.hubConnection?.onreconnected(() => {
      this.connected.set(true);

      console.log('🟢 SignalR reconnected');
    });

    this.hubConnection?.onclose(() => {
      this.connected.set(false);

      console.log('🔴 SignalR connection closed');
    });
  }
}
