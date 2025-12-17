import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './account-create.html',
  styleUrls: ['./account-create.css']
})
export class AccountCreateComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AccountCreateComponent>
  ) {}

  createAccount(): void {
    this.http.post('/api/users', { username: this.username, password: this.password }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.errorMessage = 'Failed to create account. Username might be taken.';
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
