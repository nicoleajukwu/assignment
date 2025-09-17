import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-schedule-page',
  imports: [DatePipe],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.css'
})
export class SchedulePage {
  calendarForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.calendarForm = this.fb.group({
      date: [''],
      event: ['']
    });
  }

  onSubmit() {
    const formData = this.calendarForm.value;
    console.log('Submitted Data:', formData);
    // Here you can handle the data payload as needed
  }
}