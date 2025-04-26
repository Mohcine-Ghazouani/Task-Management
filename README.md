# Task Management

This is a full-stack task management application built using Vite-React, Laravel, and MySQL. The application provides a structured environment where users can interact based on their roles (administrator or member). Administrators can create, assign, and manage tasks, update team members, and monitor all activities, while members can track their assigned tasks, update statuses, and collaborate through comments. The application also features secure role-based access control, real-time task updates, and a modern, responsive user interface.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)

## Features 

- Role-Based Access Control – Admins & Members
- Add, edit, delete, and view tasks
- Protected views and conditional rendering based on roles
- Responsive design using Tailwind CSS
- Admins: Create, assign, and manage tasks, oversee team progress, and notify members
- Members: View and update their tasks, add comments, and stay in sync with the team
- Every action is role-protected, ensuring a secure and efficient workflow

## Technologies Used

- Backend: Laravel with dev-breeze
- Frontend: Vite+React, Tailwind CSS
- Database: MySQL

## Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 18
- NPM or Yarn
- MySQL or other database

## Installation

### Backend

1. Clone the repository:

    ```sh
    git clone https://github.com/Mohcine-Ghazouani/Task-Management.git
    cd Task-Management/backend
    ```

2. Install dependencies:

    ```sh
    composer install
    ```

3. Rename the `.env.example` file in the `backend` directory to `.env` and update the necessary environment variables:

    ```bash
    cp .env.example .env
    
    php artisan key:generate            // Generate a new application key
    ```

    Update the following environment variables in the `.env` file:
    ```bash
    APP_URL=http://localhost:8000       // update this line
    FRONTEND_URL=http://localhost:3000  // Add this line

        // update this lines with your database credentials:
    
    DB_CONNECTION=mysql                 
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=db_task_managment
    DB_USERNAME=root
    DB_PASSWORD=
    ```
4. migrate and seed the database:

    ```sh
    php artisan migrate

    // optional

    php artisan db:seed --class=UsersTableSeeder
    php artisan db:seed --class=TasksTableSeeder
    ```

5. Start the backend server:

    ```sh
    php artisan serve
    ```

### Frontend

1. Navigate to the frontend directory:

    ```sh
    cd Task-Management/frontend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the frontend server:

    ```sh
    npm run dev
    ```

## Running the Application

- The backend server will run on `http://localhost:8000`.
- The frontend server will run on `http://localhost:3000`.

