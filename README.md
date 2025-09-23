
# Meeting Scheduler App

This is a full-stack web application for user registration, login, and meeting scheduling. It uses Angular for the frontend and Node.js/Express with MySQL for the backend.

## Features

- User registration and login (with password hashing and JWT session)
- Schedule meetings with a title, description, and date/time
- Each meeting is linked to the logged-in user
- View and manage meetings per user

## How to Run

### 1. Start the Backend (Node.js/Express)

Open a terminal and run:

```bash
cd backend
node server.js
```

The backend will start on [http://localhost:3000](http://localhost:3000) and connect to your MySQL database (configure credentials in `.env`).

### 2. Start the Frontend (Angular)

Open a separate terminal and run:

```bash
ng serve
```

The frontend will start on [http://localhost:4200](http://localhost:4200).

### 3. Usage

1. Register a new user account.
2. Log in with your credentials.
3. Schedule meetings using the form (meeting title and date/time are required).
4. Log out when finished.

## Prerequisites

- Node.js and npm installed
- MySQL server running and a database created (see backend `.env` for config)

## Notes

- The backend must be running before you can register, log in, or schedule meetings.
- All meeting data is stored in the MySQL `meetings` table, linked to the user by `user_id`.
- The frontend and backend communicate via REST API endpoints.