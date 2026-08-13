import { Component, inject } from '@angular/core';
import { ExpenseService } from '../services/expense-service';
import { DatePipe, DecimalPipe } from '@angular/common';


@Component({
  selector: 'ep-expenses',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  private readonly expenseService = inject(ExpenseService);


  protected readonly getExpenses = this.expenseService.expenses();
}
