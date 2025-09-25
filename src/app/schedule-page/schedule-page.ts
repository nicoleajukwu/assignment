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
    const user = JSON.parse(localStorage.getItem('auth_user') || 'null');
    const userId = user?.id;
    if (!userId) {
      alert('You must be logged in.');
      this.router.navigate(['']);
      return;
    }
    if (!this.meetingTitle.trim()) {
      alert('Meeting title is required.');
      return;
    }
    if (!this.datetime) {
      alert('Date and time are required.');
      return;
    }
    const meetingData = {
      user_id: userId,
      title: this.meetingTitle,
      description: this.meetingDescription,
      datetime: this.datetime
    };
    this.http.post('http://localhost:3000/api/schedule', meetingData)
      .subscribe({
        next: () => {
          alert('Meeting scheduled and saved!');
          this.meetingTitle = '';
          this.meetingDescription = '';
          this.datetime = '';
        },
        error: err => {
          console.error('Failed to schedule meeting', err);
          alert('Failed to schedule meeting');
        }
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['']);
  }
}