# Social Media Content Scheduler

A full-stack MERN application for scheduling and managing social media posts across multiple platforms (Twitter, Facebook, Instagram). Features include user authentication, post scheduling, automatic publishing, and a comprehensive dashboard.

# Demo Credentials

email: demo@example.com
password: 123456

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Assumptions](#assumptions)
- [Performance Optimizations](#performance-optimizations)
- [Security Features](#security-features)
- [Deployment](#deployment)

## ✨ Features

### Core Functionality

- **User Authentication**: JWT-based authentication with HTTP-only cookies
- **Post Management**: Create, edit, delete, and view posts
- **Multi-Platform Support**: Schedule posts for Twitter, Facebook, and Instagram
- **Scheduling**: Schedule posts for future publication with date/time picker
- **Automatic Publishing**: Background job publishes scheduled posts automatically
- **Dashboard**: Statistics and upcoming posts overview
- **Pagination**: Efficient pagination (10 posts per page)
- **Status Filtering**: Filter posts by status (draft, scheduled, published, failed)

### User Experience

- **Responsive Design**: Mobile-friendly interface
- **Real-time Validation**: Client-side form validation with error messages
- **Loading States**: Visual feedback during API calls
- **Toast Notifications**: User-friendly success/error messages
- **Protected Routes**: Automatic redirect to login for unauthenticated users

## 🛠 Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Tailwind CSS 4** - Styling
- **React Toastify** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Background job scheduling
- **express-validator** - Input validation

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Git** - Version control

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Social Media Scheduler"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Copy the template below and create .env file
# See Environment Variables section for details

# Start development server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
# Copy the template below and create .env file

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or next available port)

### 4. Verify Setup

1. **Backend Health Check**: Visit `http://localhost:5000` - Should see: `✅ Social Media Scheduler Backend is running...`
2. **Frontend**: Visit `http://localhost:5173` - Should see login page
3. **MongoDB Connection**: Check backend console for: `✅ MongoDB Connected: <host>`

### 5. Create Your First Account

1. Click "Register" on the login page
2. Fill in name, email, and password (min 6 characters)
3. You'll be automatically logged in and redirected to the dashboard

## 🔐 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection
MONGODB_URL=mongodb://localhost:27017/social-media-scheduler
# Or for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/social-media-scheduler

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port (optional, defaults to 5000)
PORT=5000

# Frontend URL for CORS (optional, defaults to http://localhost:5173)
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

**Important**:

- Replace `JWT_SECRET` with a strong random string (use `openssl rand -base64 32` to generate)
- For production, use a secure MongoDB connection string
- Set `NODE_ENV=production` for production deployment

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

**Note**: For production, update this to your deployed backend URL.

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Optional message",
  "data": { ... }
}
```

### Authentication

All protected routes require a valid JWT token stored in an HTTP-only cookie. The token is automatically sent with requests when `withCredentials: true` is set (already configured).

---

### 🔓 Public Endpoints

#### 1. Register User

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**

- `name`: Required, minimum 2 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Email already exists."
}
```

---

#### 2. Login User

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

---

### 🔒 Protected Endpoints

All endpoints below require authentication. Include the JWT token in cookies (handled automatically by the frontend).

---

#### 3. Get Current User

**GET** `/api/auth/me`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

#### 4. Logout User

**POST** `/api/auth/logout`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful."
}
```

---

#### 5. Get All Posts

**GET** `/api/posts`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)
- `status` (optional): Filter by status (`draft`, `scheduled`, `published`, `failed`)

**Example:**

```
GET /api/posts?page=1&limit=10&status=scheduled
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "content": "Hello world!",
      "platforms": ["Twitter", "Facebook"],
      "scheduledAt": "2024-12-25T10:00:00.000Z",
      "status": "scheduled",
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

---

#### 6. Get Single Post

**GET** `/api/posts/:id`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "content": "Hello world!",
    "platforms": ["Twitter", "Facebook"],
    "scheduledAt": "2024-12-25T10:00:00.000Z",
    "status": "scheduled",
    "imageUrl": "https://example.com/image.jpg",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Post not found or access denied."
}
```

---

#### 7. Create Post

**POST** `/api/posts`

**Request Body:**

```json
{
  "content": "Check out this amazing post!",
  "platforms": ["Twitter", "Facebook", "Instagram"],
  "scheduledAt": "2024-12-25T10:00:00.000Z",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Validation:**

- `content`: Required, maximum 500 characters
- `platforms`: Required, array with at least one platform, valid values: `["Twitter", "Facebook", "Instagram"]`
- `scheduledAt`: Required, must be a future date/time (ISO 8601 format)
- `imageUrl`: Optional, must be a valid URL if provided

**Success Response (201):**

```json
{
  "success": true,
  "message": "Post created successfully.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "content": "Check out this amazing post!",
    "platforms": ["Twitter", "Facebook", "Instagram"],
    "scheduledAt": "2024-12-25T10:00:00.000Z",
    "status": "scheduled",
    "imageUrl": "https://example.com/image.jpg",
    "user": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Scheduled time must be a future date/time."
}
```

---

#### 8. Update Post

**PUT** `/api/posts/:id`

**Request Body:** (All fields optional, only include fields to update)

```json
{
  "content": "Updated content",
  "platforms": ["Twitter"],
  "scheduledAt": "2024-12-26T10:00:00.000Z",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

**Note**: Published posts cannot be edited.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Post updated successfully.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "content": "Updated content",
    "platforms": ["Twitter"],
    "scheduledAt": "2024-12-26T10:00:00.000Z",
    "status": "scheduled",
    "imageUrl": "https://example.com/new-image.jpg",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Published posts cannot be edited."
}
```

---

#### 9. Delete Post

**DELETE** `/api/posts/:id`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Post deleted successfully."
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Post not found or access denied."
}
```

---

#### 10. Get Dashboard Statistics

**GET** `/api/dashboard/stats`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "totalPosts": 50,
    "scheduledPosts": 20,
    "publishedPosts": 25,
    "failedPosts": 3,
    "draftPosts": 2,
    "platforms": [
      {
        "platform": "Twitter",
        "count": 30
      },
      {
        "platform": "Facebook",
        "count": 25
      },
      {
        "platform": "Instagram",
        "count": 15
      }
    ]
  }
}
```

---

#### 11. Get Upcoming Posts

**GET** `/api/dashboard/upcoming`

**Query Parameters:**

- `limit` (optional): Number of posts to return (default: 5)

**Example:**

```
GET /api/dashboard/upcoming?limit=10
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "content": "Upcoming post",
      "platforms": ["Twitter"],
      "scheduledAt": "2024-12-25T10:00:00.000Z",
      "status": "scheduled"
    }
  ]
}
```

---

### Error Responses

All endpoints may return the following error responses:

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Not authorized to access this resource."
}
```

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Validation error message."
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Resource not found."
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Internal server error."
}
```

---

## 📁 Project Structure

```
social-media-scheduler/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── jwt.js             # JWT token generation
│   │   ├── controllers/
│   │   │   ├── authController.js  # Authentication logic
│   │   │   ├── postController.js  # Post CRUD operations
│   │   │   └── dashboardController.js # Dashboard stats
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT authentication middleware
│   │   │   ├── validation.js      # Input validation
│   │   │   └── errorHandler.js   # Global error handler
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Post.js            # Post schema
│   │   │   └── PublicationLog.js  # Publication log schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # Auth endpoints
│   │   │   ├── postRoutes.js      # Post endpoints
│   │   │   └── dashboardRoutes.js # Dashboard endpoints
│   │   ├── services/
│   │   │   └── scheduler.js       # Background job scheduler
│   │   ├── utils/
│   │   │   └── constants.js       # Constants and enums
│   │   └── server.js              # Express app setup
│   ├── .env                        # Environment variables (not in git)
│   ├── .env.example                # Environment template
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   │   ├── Loader.jsx     # Loading spinner
│   │   │   │   └── Toast.jsx      # Toast notifications
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx  # Login form
│   │   │   │   └── RegisterForm.jsx # Registration form
│   │   │   ├── posts/
│   │   │   │   ├── PostForm.jsx   # Create/Edit post form
│   │   │   │   ├── PostList.jsx   # Posts list with pagination
│   │   │   │   ├── PostCard.jsx   # Post card component
│   │   │   │   └── PostTable.jsx  # Post table component
│   │   │   └── dashboard/
│   │   │       ├── StatsCard.jsx  # Statistics card
│   │   │       └── UpcomingPosts.jsx # Upcoming posts list
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Register page
│   │   │   ├── Dashboard.jsx     # Dashboard page
│   │   │   ├── Posts.jsx          # Posts list page
│   │   │   ├── CreatePost.jsx     # Create post page
│   │   │   └── EditPost.jsx       # Edit post page
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── utils/
│   │   │   ├── constants.js       # Frontend constants
│   │   │   ├── PrivateRoute.jsx   # Protected route wrapper
│   │   │   └── validation.js      # Validation schemas
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── .env                        # Environment variables (not in git)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md                       # This file
```

---

## 💡 Assumptions

### Business Logic Assumptions

1. **Post Scheduling**:

   - All posts must have a scheduled date/time in the future
   - Posts are automatically published when their scheduled time is reached
   - The scheduler runs every minute to check for posts to publish

2. **Post Status**:

   - **Draft**: Currently not implemented in the UI (status exists but cannot be created)
   - **Scheduled**: Post is ready and will be published at the scheduled time
   - **Published**: Post has been published (cannot be edited)
   - **Failed**: Post failed to publish (can be edited and rescheduled)

3. **Post Editing**:

   - Published posts cannot be edited (enforced both frontend and backend)
   - Only the post owner can edit/delete their posts

4. **Platforms**:

   - Currently supports Twitter, Facebook, and Instagram
   - Multiple platforms can be selected for a single post
   - Platform integration is simulated (no actual API calls)

5. **Authentication**:
   - JWT tokens expire after 7 days
   - Tokens are stored in HTTP-only cookies for security
   - Users must log in again after token expiration

### Technical Assumptions

1. **Database**:

   - MongoDB is running and accessible
   - Database connection is established before server starts
   - Indexes are automatically created by Mongoose

2. **CORS**:

   - In development, any localhost origin is allowed
   - In production, specific origins must be configured

3. **Pagination**:

   - Default page size is 10 posts
   - Pagination resets to page 1 when filters change

4. **Image URLs**:

   - Image URLs are validated but not stored/uploaded
   - Assumes external image hosting service

5. **Scheduler**:

   - Runs every minute (cron: `* * * * *`)
   - Processes posts in FIFO order (by creation time)
   - Creates publication logs for tracking

6. **Error Handling**:
   - All errors are caught and returned in a consistent format
   - 401 errors for `/api/auth/me` are silently handled (expected when not logged in)

---

## ⚡ Performance Optimizations

### Database Indexes

The following indexes are implemented for optimal query performance:

**Post Model:**

- `{ user: 1, createdAt: -1 }` - User posts sorted by date
- `{ user: 1, status: 1 }` - Filter posts by user and status
- `{ status: 1, scheduledAt: 1 }` - Scheduler queries
- `{ user: 1, scheduledAt: 1 }` - User's scheduled posts
- `{ status: 1, scheduledAt: 1, createdAt: 1 }` - Compound index for scheduler

**PublicationLog Model:**

- `{ post: 1 }` - Post lookups
- `{ user: 1, publishedAt: -1 }` - User's publication history
- `{ status: 1, publishedAt: -1 }` - Status filtering

### Query Optimizations

- **Lean Queries**: Used for read-only operations (`.lean()`) to return plain JavaScript objects instead of Mongoose documents
- **Pagination**: Implemented with `.skip()` and `.limit()` to avoid loading all records
- **Parallel Queries**: Dashboard stats use `Promise.all()` for concurrent database queries
- **Field Selection**: Uses `.select()` to limit returned fields when possible

---

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Password Hashing**: bcrypt with salt rounds (10)
- **Token Expiration**: 7-day expiration for security
- **Protected Routes**: Middleware validates tokens on all protected endpoints

### Input Validation

- **Server-side Validation**: express-validator for all inputs
- **Client-side Validation**: Zod schemas for immediate feedback
- **SQL Injection Protection**: Mongoose ODM prevents injection
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Restricted origins in production

### Data Security

- **User Isolation**: Users can only access their own posts
- **Password Security**: Passwords are never returned in API responses
- **Error Messages**: Generic error messages to prevent information leakage

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. **Set Environment Variables**:

   - `MONGODB_URL`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random string
   - `FRONTEND_URL`: Your deployed frontend URL
   - `NODE_ENV`: `production`

2. **Build Command**: (Not needed, runs directly)

   ```
   npm start
   ```

3. **Start Command**:
   ```
   npm start
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Set Environment Variables**:

   - `VITE_API_URL`: Your deployed backend API URL

2. **Build Command**:

   ```
   npm run build
   ```

3. **Output Directory**: `dist`

4. **Install Command**:
   ```
   npm install
   ```

### Production Checklist

- [ ] Update `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB Atlas with proper security
- [ ] Update CORS to allow only your frontend domain
- [ ] Enable HTTPS for both frontend and backend
- [ ] Set secure cookie flags (`secure: true`)
- [ ] Configure proper error logging
- [ ] Set up monitoring and alerts

---

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**:

   - [ ] User can register
   - [ ] User can login
   - [ ] User can logout
   - [ ] Protected routes redirect to login
   - [ ] Token persists across page refreshes

2. **Posts**:

   - [ ] Create post with all fields
   - [ ] View posts list with pagination
   - [ ] Filter posts by status
   - [ ] Edit scheduled post
   - [ ] Cannot edit published post
   - [ ] Delete post
   - [ ] View single post

3. **Dashboard**:

   - [ ] Statistics display correctly
   - [ ] Upcoming posts show next 5
   - [ ] Platform statistics accurate

4. **Scheduler**:
   - [ ] Posts are published at scheduled time
   - [ ] Publication logs are created
   - [ ] Failed posts are marked correctly

---

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

**Built with ❤️ using the MERN stack**

#
