import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule-page',
  standalone: true,
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.css'
})
export class SchedulePage {
  constructor(private router: Router) {}

  logout() {
    // Add any logout logic here (e.g., clearing tokens)
    this.router.navigate(['']);
  }
}