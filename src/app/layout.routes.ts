import { Routes } from "@angular/router";
import { Layout } from "./layout/layout";
import { BudgetDetail } from "./budgets/budget-detail/budget-detail";
import { CategoryDetail } from "./categories/category-detail/category-detail";
import { Expenses } from "./expenses/expenses";
import { Budgets } from "./budgets/budgets";
import { Categories } from "./categories/categories";
import { Dashboard } from "./dashboard/dashboard";
import { AccountSetting } from "./account-setting/account-setting";
import { Profile } from "./profile/profile";

export const layoutRoutes: Routes = [
  { path: '',
    component: Layout,
    children: [
      { path: 'profile', component: Profile },

      { path: 'account-setting', component: AccountSetting },

      { path: 'dashboard', component: Dashboard },

      { path: 'categories', component: Categories },

      { path: 'budgets', component: Budgets },

      { path: 'expenses', component: Expenses },

      // Route-based navigation not an input signal-based
      { path: 'budgets/:budgetId', component: BudgetDetail },

      { path: 'categories/:categoryId', component: CategoryDetail }
    ]
  }
];
