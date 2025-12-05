import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-initial-load',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './initial-load.html',
  styleUrl: './initial-load.css',
})
export class InitialLoadComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<{ redirectTo: string }>('/api/initial-route').subscribe({
      next: (response) => {
        if (response && response.redirectTo) {
          this.router.navigate([response.redirectTo]);
        } else {
          console.error('Invalid response from initial-route', response);
          this.router.navigate(['/login']); // Fallback
        }
      },
      error: (err) => {
        console.error('Failed to get initial route', err);
        this.router.navigate(['/login']); // Fallback on error
      }
    });
  }
}
