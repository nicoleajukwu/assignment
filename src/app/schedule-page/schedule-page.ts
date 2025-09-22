import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-schedule-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.css'
})
export class SchedulePage {
  meetingTitle = '';
  meetingDescription = '';
  datetime = '';

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    const meetingData = {
      title: this.meetingTitle,
      description: this.meetingDescription,
      datetime: this.datetime
    };
    this.http.post('http://localhost:3000/api/schedule', meetingData)
      .subscribe({
        next: () => alert('Meeting scheduled and saved!'),
        error: err => alert('Failed to schedule meeting')
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['']);
  }
}