import { Component, signal } from '@angular/core';
import { Layout } from "./layout/layout";

@Component({
  selector: 'ep-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ExpenseTrackerFrontEnd');
}
