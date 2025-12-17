import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountCreateComponent } from '../account-create/account-create';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

interface User {
  id: number;
  username: string;
}

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './account-list.html',
  styleUrls: ['./account-list.css']
})
export class AccountListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'actions'];
  dataSource: User[] = [];
  currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.http.get<User>('/api/user').subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Failed to fetch current user', err);
      }
    });
  }

  loadUsers(): void {
    this.http.get<User[]>('/api/users').subscribe({
      next: (users) => {
        this.dataSource = users;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AccountCreateComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadUsers();
        this.snackBar.open('Account created successfully', 'Close', {
          duration: 3000
        });
      }
    });
  }

  deleteUser(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.http.delete(`/api/users/${userId}`).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open('Account deleted successfully', 'Close', {
              duration: 3000
            });
          },
          error: (err) => {
            console.error('Failed to delete user', err);
            this.snackBar.open('Failed to delete account', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}
