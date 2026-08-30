import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { Categories } from "./categories/categories";
import { Budgets } from "./budgets/budgets";
import { Expenses } from "./expenses/expenses";
import { BudgetDetail } from "./budgets/budget-detail/budget-detail";
import { CategoryDetail } from "./categories/category-detail/category-detail";
import { Dashboard } from "./dashboard/dashboard";

export const routes: Routes = [
  { path: '', component: Dashboard },

  { path: 'login', component: Login },

  { path: 'categories', component: Categories },

  { path: 'budgets', component: Budgets },

  { path: 'expenses', component: Expenses },

  // Route-based navigation not an input signal-based
  { path: 'budgets/:budgetId', component: BudgetDetail },

  { path: 'categories/:categoryId', component: CategoryDetail }

]
