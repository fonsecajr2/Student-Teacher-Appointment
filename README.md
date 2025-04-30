# Student-Teacher Appointment System

## Project Overview

This project is a web application designed to facilitate appointment scheduling between students and teachers. It includes user authentication, appointment management, messaging, and role-based access control to provide a seamless experience for students, teachers, and administrators.

## Live Demo

You can test and use the app in the next link: https://student-teacher-appointment-eight.vercel.app/
You can use default admin: admin@gmail.com password: 123456

## Key Features

- User registration and login with Firebase Authentication
- Role-based dashboards for Students, Teachers, and Admins
- Appointment creation, viewing, updating, and cancellation
- Messaging system for communication between users
- User management including approval of students and management of teachers
- Protected routes and role-based access control
- Comprehensive logging of key actions for monitoring and debugging

## Technologies Used

- React with JSX for frontend UI
- Firebase Authentication and Firestore for backend services
- Vite as the build tool and development server
- JavaScript ES6+ features
- Tailwind CSS (inferred from index.css import) for styling

## Project Structure

- `src/`
  - `components/` - React components for UI
  - `context/` - React context providers for authentication and role management
  - `pages/` - React pages for different routes and dashboards
  - `routes/` - Route components including protected routes
  - `services/` - Service modules handling Firebase interactions for auth, appointments, messaging, and users
  - `utils/` - Utility modules including a custom logger
  - `App.jsx` - Main application component
  - `main.jsx` - Entry point for React app

## Logging

A custom logger utility is implemented in `src/utils/logger.js` which logs key actions such as user authentication, appointment operations, messaging, and user management. Logs include timestamps and log levels (INFO, ERROR, etc.) and are output to the console.

## Running the Project

1. Ensure you have Node.js and npm installed.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open the application in your browser at the URL provided by Vite (usually `http://localhost:3000`).

## Notes

- Firebase configuration and initialization are handled in `src/services/firebase.js`.
- Role-based access control is managed via React context and protected routes.
- The project uses Firestore as the database for storing users, appointments, and messages.

## License

This project is open source and available under the MIT License.
