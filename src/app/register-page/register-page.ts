import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPage {
  name = '';
  email = '';
  address = '';
  phone = '';
  password = '';
  repeatPassword = '';

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    if (this.password !== this.repeatPassword) {
      alert('Passwords do not match!');
      return;
    }
    const userData = {
      name: this.name,
      email: this.email,
      address: this.address,
      phone: this.phone,
      password: this.password
    };
    this.http.post('http://localhost:3000/api/register', userData)
      .subscribe({
        next: () => this.router.navigate(['/schedule']),
        error: err => alert('Registration failed')
      });
  }

  goToLogin() {
    this.router.navigate(['']);
  }
}
