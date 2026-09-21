import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppRealtimeService } from './services/app-realtime-service';

@Component({
  selector: 'ep-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // instantiate AppRealtimeService
  private readonly appRealtime = inject(AppRealtimeService);

  protected readonly title = signal('ExpenseTracker');
}
