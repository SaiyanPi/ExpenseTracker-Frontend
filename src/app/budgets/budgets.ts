import { Component, inject, signal } from '@angular/core';
import { BudgetService } from '../services/budget-service';
import { ApiErrorService } from '../services/api-error-service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
// import { form, required } from '@angular/forms/signals';
// import { firstValueFrom } from 'rxjs';
// import { CreateUpdateBudgetModel } from '../models/budget/create-update-budget-model';

@Component({
  selector: 'ep-budgets',
  imports: [DatePipe],
  templateUrl: './budgets.html',
  styleUrl: './budgets.css',
})
export class Budgets {
  private readonly budgetService = inject(BudgetService);

  protected readonly serverValidationErrors = signal<Record<string, string[]>>({});

  private readonly apiErrorService = inject(ApiErrorService);

  private readonly creationFailed = signal(false);

  private readonly dialog = inject(MatDialog);

  protected readonly getBudgets = this.budgetService.budgets();

  // protected readonly field = signal({
  //   name: ''
  // })
  // protected readonly budgetForm = form(
  //   this.field,
  //   f => {
  //     required(f.name);
  //   },
  //   {
  //     submission: {
  //       action: async () => await this.createCategory()
  //     }
  //   }
  // )

  // // clearing server error from a field once the input value changes
  // private readonly clearNameServerError = effect(() => {
  //   this.budgetForm.name().value();
  //   this.apiErrorService.clearServerError(this.serverValidationErrors, 'Name');
  // });


  // private async createCategory() {
  //   this.serverValidationErrors.set({});
  //   this.creationFailed.set(false);
  //   const { name } = this.budgetForm().value();
  //   try{
  //     await firstValueFrom(this.budgetService.create({ name }));

  //     this.field.set({ name:'' });
  //     this.budgetForm().reset();

  //     this.getBudgets.reload();
  //     this.apiErrorService.showSuccess('Category created successfully.');
  //     return;
  //   } catch(error) {
  //     const result = this.apiErrorService.handle(error);
  //     this.serverValidationErrors.set(result.validationErrors);
  //     return [{ kind: 'server', message: 'Something went wrong.' }];
  //   }
  // }

  // protected async deleteCategory(id: string) {
  //   try {
  //     await firstValueFrom(this.budgetService.delete(id));
  //     this.getCategories.reload();
  //     this.apiErrorService.showSuccess('Category deleted successfully.');
  //   } catch (error) {
  //     this.apiErrorService.handle(error);
  //   }
  // }

  // protected openEditDialog(category: CreateUpdateBudgetModel): void {
  //   const dialogRef = this.dialog.open(EditBudgetDialog, {
  //     width: '450px',
  //     data: category
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getCategories.reload();
  //       this.apiErrorService.showSuccess('Category updated successfully.');
  //     }
  //   });
  // }
}
