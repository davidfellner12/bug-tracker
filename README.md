# Bug Tracker with Sentry Integration

A full-stack Bug Tracker application built with Flask (backend) and React (frontend), integrated with [Sentry](https://sentry.io/) for error tracking and performance monitoring.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Project Structure](#project-structure)  
- [Features](#features)  
- [Getting Started](#getting-started)  
- [Backend Setup (Flask)](#backend-setup-flask)  
- [Frontend Setup (React)](#frontend-setup-react)  
- [Sentry Integration](#sentry-integration)  
- [Testing](#testing)  
- [Deployment](#deployment)  
- [Documentation](#documentation)  
- [Stretch Goals](#stretch-goals)  
- [License](#license)  

---

## Project Overview

This project provides a simple bug tracking system with full CRUD functionality for bugs, supporting features like bug creation, updates, deletion, and listing. It includes Sentry integration on both backend and frontend for real-time error reporting and monitoring.

---

## Project Structure

This project provides a simple bug tracking system with full CRUD functionality for bugs, supporting features like bug creation, updates, deletion, and listing. It includes Sentry integration on both backend and frontend for real-time error reporting and monitoring.

root/
├── backend/ # Flask backend API
├── frontend/ # React frontend app
├── .gitignore
├── README.md
---

## Features

- **Backend (Flask):** RESTful API with CRUD endpoints for bugs, in-memory storage, input validation, error handling, CORS support, and Sentry integration.
- **Frontend (React):** User interface to list, add, edit, and delete bugs; connected to backend API; error boundary and Sentry integration.
- **Sentry Integration:** Real-time error monitoring for backend and frontend.
- **Testing:** Manual testing instructions for all CRUD operations and error scenarios.
- **Deployment:** Optional deployment instructions for frontend and backend on popular platforms.

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- Python 3.8+
- Git
- Sentry account for error monitoring (optional but recommended)

---

## Backend Setup (Flask)

1. Navigate to the `backend/` directory.
2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
Install dependencies:

bash
Kopieren
Bearbeiten
pip install -r requirements.txt
Set environment variables for Sentry DSN (optional):

bash
Kopieren
Bearbeiten
export SENTRY_DSN=<your-backend-dsn>
Run the Flask app:

bash
Kopieren
Bearbeiten
python app.py
API endpoints:

GET /bugs — List all bugs

POST /bugs — Create a new bug

PUT /bugs/<id> — Update a bug

DELETE /bugs/<id> — Delete a bug

Frontend Setup (React)
Navigate to the frontend/ directory.

Install dependencies:

bash
Kopieren
Bearbeiten
npm install
Set environment variables for Sentry DSN in .env (optional):

ini
Kopieren
Bearbeiten
REACT_APP_SENTRY_DSN=<your-frontend-dsn>
Start the React development server:

bash
Kopieren
Bearbeiten
npm start
Sentry Integration
Create a free account at sentry.io.

Create separate projects for backend (Python/Flask) and frontend (React).

Add the DSN URLs to your backend and frontend environment variables.

Confirm that errors and performance data are correctly sent to Sentry.

Use provided test error routes/buttons to verify integration.

Testing
Perform manual testing for creating, updating, and deleting bugs.

Trigger test errors on frontend/backend to verify Sentry captures issues.

Test edge cases such as missing fields or invalid bug IDs.

Deployment (Optional)
Deploy frontend to platforms like Vercel or Netlify.

Deploy backend to platforms such as Render, Railway, or Heroku.

Set environment variables (Sentry DSNs) in your deployment environment.

Test the live app and ensure Sentry captures live errors.

Documentation
Detailed setup and usage instructions in this README.

.env.example files to guide setting up environment variables.

Stretch Goals (Optional Features)
Bug filtering by status and priority.

Authentication with JWT.

Switch from in-memory storage to a real database (SQLite/PostgreSQL).

Add unit tests for backend and frontend.

Dark mode toggle UI.

Dockerize the entire application for easy setup.

License
This project is licensed under the MIT License. See the LICENSE file for details.
