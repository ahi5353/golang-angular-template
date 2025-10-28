import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { ProtectedComponent } from './protected/protected';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] }
];
