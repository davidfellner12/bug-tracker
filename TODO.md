# To-Do Plan for Bug Tracker with Sentry Project

## Project Structure
- [x] Create root folder
- [x] Create backend/ and frontend/ directories
- [x] Initialize Git repo and .gitignore

## Backend (Flask)
- [x] Set up Flask app in app.py
- [x] Implement in-memory storage for bugs
- [x] Create API endpoints:
    - [x] GET /bugs — list all bugs
    - [x] POST /bugs — create new bug
    - [x] PUT /bugs/<id> — update bug
    - [x] DELETE /bugs/<id> — delete bug
- [x] Add input validation & error handling
- [x] Integrate Sentry SDK with Flask
- [x] Add CORS (for frontend API calls)
- [x] Add example error route to test Sentry

## Frontend (React)
- [ ] Bootstrap with create-react-app or Vite
- [ ] Implement a structured component architecture:
    - [ ] Organize components into logical directories (e.g., `components`, `pages`, `hooks`).
    - [ ] Develop core UI components (e.g., buttons, forms, tables).
    - [ ] Build feature-specific components:
        - [ ] Bug list display
        - [ ] Bug creation form
        - [ ] Bug edit/update UI
        - [ ] Bug delete button
- [ ] Connect frontend to backend APIs
- [ ] Integrate Sentry for React
- [ ] Display basic error messages in UI
- [ ] Add a test button to trigger an error

## Sentry Integration
- [x] Create a free account on sentry.io
- [x] Create a backend project (Python/Flask)
- [x] Create a frontend project (React/JS)
- [x] Add DSNs to both codebases
- [ ] Confirm Sentry receives error and performance data

## Testing
- [ ] Manual test: Create/update/delete bugs
- [ ] Trigger errors to test Sentry
- [ ] Test for edge cases (missing title, 404 bug ID)

## Deployment (Optional)
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Deploy backend to Render/Railway/Heroku
- [ ] Set environment variables for Sentry DSNs
- [ ] Test live deployment with Sentry monitoring

## Documentation
- [x] Write README.md
- [ ] Add setup instructions
- [ ] Add .env.example for Sentry keys
- [ ] Create CONTRIBUTING.md (optional)
- [ ] Add LICENSE (e.g., MIT)

## Stretch Goals (Optional Features)
- [ ] Filter bugs by status and priority
- [ ] Add authentication (e.g., Firebase or JWT)
- [ ] Use a real database (SQLite or PostgreSQL)
- [ ] Unit tests (backend or frontend)
- [ ] Dark mode toggle
- [ ] Dockerize the app