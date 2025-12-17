import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountCreateComponent } from '../account-create/account-create';

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
  displayedColumns: string[] = ['id', 'username'];
  dataSource: User[] = [];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
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
}
