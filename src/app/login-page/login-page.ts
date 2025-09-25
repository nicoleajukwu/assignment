import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.http.post<any>('http://localhost:3000/api/login', { email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('auth_user', JSON.stringify(res.user));
          this.router.navigate(['/schedule']);
        },
        error: (err) => {
          this.error = err?.error?.error || 'Login failed';
          this.loading = false;
        },
        complete: () => { this.loading = false; }
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
