import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  title = 'frontend';
  message: string | undefined;

  constructor(private http: HttpClient) {}

  ping() {
    this.http.get<{ message: string }>('/api/ping')
      .subscribe(response => {
        this.message = response.message;
      });
  }
}
