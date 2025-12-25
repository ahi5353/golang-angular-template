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
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
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
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.error = 'パスワードが一致しません';
      return;
    }

    this.authService.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        // Automatically login after registration
        this.authService.login({ username: this.username, password: this.password }).subscribe({
          next: () => {
            this.themeService.loadTheme(); // Reload theme after successful login
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Auto-login failed', err);
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.error = err?.error?.error || '登録に失敗しました';
      }
    });
  }
}
