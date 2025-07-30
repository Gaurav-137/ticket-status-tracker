
# Ticket Status Tracker

This is a full-stack MERN application (MongoDB, Express, React, Node.js) that provides a comprehensive system for managing support or development tickets. It features user management, automated ticket status progression, and email notifications.

The project is a monorepo containing two main packages:
-   `/frontend`: A React + TypeScript application for the user interface.
-   `/backend`: A Node.js + Express API server that handles business logic and data persistence.

## Features

-   **User Authentication**: Simple email-based user registration and login.
-   **Full CRUD for Tickets**: Users can create, read, update, and delete their own tickets.
-   **Automated Status Progression**: Tickets automatically advance through a predefined workflow (`Open` -> `In Progress` -> `Review` -> `Testing` -> `Done`) based on configurable timers.
-   **Manual Status Control**: Users can manually override the status of a ticket at any time.
-   **Status History**: Each ticket maintains a log of its status changes with timestamps.
-   **Batch Email Notifications**: When tickets reach the "Done" status, a single consolidated email is sent to the ticket owner.
-   **RESTful API**: A well-defined API for managing users and tickets.

## Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Job Scheduling**: `node-cron` for automated status updates.
-   **Email**: `Nodemailer` for sending notifications.
-   **Monorepo Management**: `Concurrently`

---

## Setup and Installation

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.
-   A Gmail account with an "App Password" for email notifications. ([How to create an App Password](https://support.google.com/accounts/answer/185833))

### 1. Configure Backend Environment

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create an environment file:**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```

3.  **Edit the `.env` file** and fill in your details:
    -   `PORT`: The port for the backend server (default is `5001`).
    -   `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/ticket_tracker`).
    -   `EMAIL_HOST`, `EMAIL_PORT`: SMTP server details (defaults for Gmail are fine).
    -   `EMAIL_USER`: Your full Gmail address.
    -   `EMAIL_PASS`: Your 16-character Gmail App Password.
    -   `EMAIL_FROM`: The "From" header for emails.

### 2. Install Dependencies & Run

1.  **Navigate back to the project root directory:**
    ```bash
    cd ..
    ```

2.  **Install all dependencies** for both the root project and the backend:
    ```bash
    npm install
    ```

3.  **Start both frontend and backend servers concurrently:**
    ```bash
    npm run dev
    ```

    This command will:
    -   Start the backend server on `http://localhost:5001`.
    -   Start the frontend server on `http://localhost:3000`.

4.  **Open the application** in your browser at `http://localhost:3000`.

---

## API Documentation

The backend exposes the following RESTful endpoints.

### Auth Routes

-   `POST /api/auth/register`
-   `POST /api/auth/login`

### Ticket Routes

-   `GET /api/tickets/user/:userId`
-   `POST /api/tickets`
-   `GET /api/tickets/:id`
-   `PUT /api/tickets/:id`
-   `DELETE /api/tickets/:id`
-   `PATCH /api/tickets/:id/status`
-   `GET /api/tickets/:id/history`

---

## Database Schema

### User Schema
-   `name` (String, required)
-   `email` (String, required, unique)

### Ticket Schema
-   `title` (String, required)
-   `description` (String, required)
-   `status` (String, enum: `['Open', 'In Progress', 'Review', 'Testing', 'Done']`)
-   `owner` (ObjectId, ref: `User`)
-   `history` (Array of `status`, `timestamp`)
