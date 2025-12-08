import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { AuthGuard } from './auth/auth-guard';
import { GuestGuard } from './auth/guest-guard';
import { InitialLoadComponent } from './initial-load/initial-load';
import { AccountListComponent } from './accounts/account-list/account-list';
import { AccountCreateComponent } from './accounts/account-create/account-create';
import { MainLayoutComponent } from './layout/main-layout';
import { SampleComponent } from './sample/sample';

export const routes: Routes = [
  { path: '', component: InitialLoadComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'accounts', component: AccountListComponent },
      { path: 'accounts/create', component: AccountCreateComponent },
      { path: 'sample', component: SampleComponent }
    ]
  }
];
