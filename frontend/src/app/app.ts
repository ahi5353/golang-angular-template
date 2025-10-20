import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
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
