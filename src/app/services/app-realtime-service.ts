import { effect, inject, Service, untracked } from '@angular/core';
import { AuthService } from './auth-service';
import { SignalRService } from './signal-r-service';

@Service()
export class AppRealtimeService {
  private readonly authService = inject(AuthService);
  private readonly signalRService = inject(SignalRService);

  constructor() {
    // Start/stop SignalR based on currentUser
    effect(() => {
      const user = this.authService.currentUser();

      untracked(async () => {
        if (user) {
          await this.signalRService.start();
        } else {
          await this.signalRService.stop();
        }
      });
    });
  }
}
