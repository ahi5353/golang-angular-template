import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { ThemeService } from '../../services/theme.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  onSubmit(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.themeService.loadTheme(); // Reload theme after successful login
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err?.error?.error || 'ログインに失敗しました';
      }
    });
  }
}
