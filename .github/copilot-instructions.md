# AI Agent Instructions for Social Media Scheduler

## Project Overview
This is a MERN stack application for scheduling and managing social media posts across multiple platforms. The project follows a clear separation between frontend (React/Vite) and backend (Node.js/Express) with MongoDB as the database.

## Architecture Patterns

### Backend (`/backend`)
- **Express API Structure**: Routes → Controllers → Services → Models pattern
- **Authentication**: JWT-based with token stored in cookies (`backend/src/config/jwt.js`)
- **Background Processing**: Scheduler service for automated post publishing (`backend/src/services/scheduler.js`)
- **Error Handling**: Centralized error middleware (`backend/src/middleware/errorHandler.js`)

### Frontend (`/frontend`)
- **State Management**: Context API for auth state (`frontend/src/context/AuthContext.jsx`)
- **Route Protection**: Higher-order component pattern (`frontend/src/utils/PrivateRoute.jsx`)
- **Component Organization**: Feature-based structure under `src/components/`
  - Common components: `common/`
  - Feature modules: `auth/`, `posts/`, `dashboard/`

## Key Integration Points
1. **API Communication**: 
   - Backend CORS configured for frontend origin (`backend/src/server.js`)
   - Frontend API service layer (`frontend/src/services/api.js`)

2. **Authentication Flow**:
   - Login/Register via `/api/auth/*` endpoints
   - JWT token handled by `cookie-parser` middleware
   - Protected routes require valid JWT

## Development Workflow

### Local Setup
```bash
# Backend (Port 5000)
cd backend
npm install
cp .env.example .env  # Configure MongoDB URI & JWT secret
npm run dev

# Frontend (Port 5173)
cd frontend
npm install
cp .env.example .env  # Configure VITE_API_URL
npm run dev
```

### Project Conventions
1. **API Error Format**:
```javascript
{
  error: {
    message: string,
    code?: string,
    details?: any
  }
}
```

2. **Component Structure**:
   - Presentational components in `components/`
   - Pages/Routes in `pages/`
   - Business logic in `services/`

3. **Validation**:
   - Backend: Express-validator middleware
   - Frontend: Form validation in utils/validation.js

## Common Tasks
- **Adding New API Endpoint**: Create route → controller → service pattern
- **Protected Routes**: Use auth middleware (`backend/src/middleware/auth.js`)
- **New Frontend Feature**: Add components → update routes → integrate with API
- **Database Changes**: Update models → migrate data → update relevant services

## Key Files for Reference
- `backend/src/server.js`: Main server configuration
- `frontend/src/App.jsx`: Root component and routing
- `backend/src/models/`: Database schema definitions
- `frontend/src/context/AuthContext.jsx`: Authentication state management