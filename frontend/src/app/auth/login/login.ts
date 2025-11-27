import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      () => this.router.navigate(['/']),
      err => this.error = err.error.error
    );
  }
}
