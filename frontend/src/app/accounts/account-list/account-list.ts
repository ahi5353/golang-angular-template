import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface User {
  id: number;
  username: string;
}

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './account-list.html',
  styleUrls: ['./account-list.css']
})
export class AccountListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username'];
  dataSource: User[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<User[]>('/api/users').subscribe({
      next: (users) => {
        this.dataSource = users;
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/accounts/create']);
  }
}
