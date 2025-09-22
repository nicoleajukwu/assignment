import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  constructor(private router: Router) {}

  goToSchedule() {
    this.router.navigate(['/schedule']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
