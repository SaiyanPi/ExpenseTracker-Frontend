import { Routes } from "@angular/router";
import { Login } from "./login/login";
import { Home } from "./home/home";
import { Categories } from "./categories/categories";

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'categories', component: Categories },
]
