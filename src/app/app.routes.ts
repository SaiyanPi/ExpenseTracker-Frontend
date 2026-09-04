import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { Categories } from "./categories/categories";
import { Budgets } from "./budgets/budgets";
import { Expenses } from "./expenses/expenses";
import { BudgetDetail } from "./budgets/budget-detail/budget-detail";
import { CategoryDetail } from "./categories/category-detail/category-detail";
import { Dashboard } from "./dashboard/dashboard";
import { Home } from "./home/home";
import { Register } from "./register/register";
import { Layout } from "./layout/layout";
import { Profile } from "./profile/profile";

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'login', component: Login },
  
  { path: 'register', component: Register },

  { path: 'app', component: Layout, children: [

    { path: 'profile', component: Profile },

    { path: 'dashboard', component: Dashboard },

    { path: 'categories', component: Categories },

    { path: 'budgets', component: Budgets },

    { path: 'expenses', component: Expenses },

    // Route-based navigation not an input signal-based
    { path: 'budgets/:budgetId', component: BudgetDetail },

    { path: 'categories/:categoryId', component: CategoryDetail }
  ]},

  {
    path: '**',
    redirectTo: ''
  }

]
