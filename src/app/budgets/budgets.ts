import { Component, inject, signal } from '@angular/core';
import { BudgetService } from '../services/budget-service';
import { ApiErrorService } from '../services/api-error-service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, DecimalPipe } from '@angular/common';
// import { form, required } from '@angular/forms/signals';
// import { firstValueFrom } from 'rxjs';
// import { CreateUpdateBudgetModel } from '../models/budget/create-update-budget-model';
import { HostListener } from '@angular/core';
import { CreateBudgetDialog } from './create-budget-dialog/create-budget-dialog';
import { firstValueFrom } from 'rxjs';
import { CreateUpdateBudgetModel } from '../models/budget/create-update-budget-model';
import { EditBudgetDialog } from './edit-budget-dialog/edit-budget-dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ep-budgets',
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css',
})
export class Budgets {
  private readonly budgetService = inject(BudgetService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  protected readonly openBudgetMenu = signal<string | null>(null);

  private readonly apiErrorService = inject(ApiErrorService);

  private readonly dialog = inject(MatDialog);


  protected readonly getBudgets = this.budgetService.budgets();

  protected toggleBudgetMenu(id: string): void {
    this.openBudgetMenu.update(current => current === id ? null : id);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.budget-actions')) {
      this.openBudgetMenu.set(null);
    }
  }


  protected openCreateBudgetDialog(): void {
    const dialogRef = this.dialog.open(CreateBudgetDialog, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBudgets.reload();
        this.apiErrorService.showSuccess('Budget created successfully.');
      }
    });
  }


  protected async deleteBudget(id: string) {
    try {
      await firstValueFrom(this.budgetService.delete(id));
      this.getBudgets.reload();
      this.apiErrorService.showSuccess('Budget deleted successfully.');
    } catch (error) {
      this.apiErrorService.handle(error);
    }
  }


  protected openEditBudgetDialog(budget: CreateUpdateBudgetModel): void {
    const dialogRef = this.dialog.open(EditBudgetDialog, {
      width: '600px',
      data: budget
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getBudgets.reload();
        this.apiErrorService.showSuccess('Budget updated successfully.');
      }
    });
  }

}
