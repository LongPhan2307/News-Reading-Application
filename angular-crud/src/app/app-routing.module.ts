import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProfileComponent } from './profile/profile.component';
import { AddCategoryComponent} from './components/add-category/add-category.component';
import { CategoriesListComponent} from './components/categories-list/categories-list.component';
import { CategoryDetailsComponent} from './components/category-details/category-details.component';

import { authInterceptorProviders } from './helpers/auth.interceptor';
const routes: Routes = [
  {path: '', redirectTo: 'categories', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile/:id', component: ProfileComponent },
  {path: 'categories', component: CategoriesListComponent},
  {path: 'categories/:id', component: CategoryDetailsComponent},
  {path: 'add', component: AddCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [authInterceptorProviders]
})
export class AppRoutingModule { }
