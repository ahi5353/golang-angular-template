import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './account-create.html',
  styleUrls: ['./account-create.css']
})
export class AccountCreateComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  createAccount(): void {
    this.http.post('/api/users', { username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to create account. Username might be taken.';
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/accounts']);
  }
}
