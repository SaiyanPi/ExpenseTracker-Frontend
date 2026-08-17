import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { Home } from "./home/home";
import { Categories } from "./categories/categories";
import { Budgets } from "./budgets/budgets";
import { Expenses } from "./expenses/expenses";
import { BudgetDetail } from "./budgets/budget-detail/budget-detail";

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },

  { path: 'categories', component: Categories },

  { path: 'budgets', component: Budgets },

  { path: 'expenses', component: Expenses },

  // Route-based navigation not an input signal-based
  { path: 'budgets/:budgetId', component: BudgetDetail }

]
