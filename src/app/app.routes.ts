import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { RegisterPage } from './register-page/register-page';
import { SchedulePage } from './schedule-page/schedule-page';

export const routes: Routes = [
    { path: '', component: LoginPage }, // Default route
    { path: 'register', component: RegisterPage },
    { path: 'schedule', component: SchedulePage }, // About page
];