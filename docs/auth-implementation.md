# Authentication Implementation Guide

## Overview
This document provides setup and configuration instructions for the Supabase authentication system integrated into the accounting application.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- A Supabase project with authentication enabled

### Environment Configuration
1. Create a `.env` file in the project root
2. Add your Supabase credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

### Installation
1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

## Architecture

### Components
- **Supabase Client**: Handles communication with Supabase authentication service
- **Session Management**: Tracks user sessions with 30-minute timeout
- **Authentication Middleware**: Protects routes and validates sessions
- **Login UI**: Provides user interface for authentication

### Flow
1. User accesses protected route
2. If not authenticated, redirected to login page
3. User enters credentials and submits
4. Credentials validated against Supabase
5. Session created and stored
6. User redirected to requested resource
7. Subsequent requests validated against session

## API Endpoints

### Authentication
- `POST /auth/login` - Authenticate user with email and password
- `POST /auth/logout` - Log out current user
- `GET /auth/session` - Validate current session

### Protected Routes
- `/dashboard` - Main application dashboard
- `/api/*` - API endpoints
- `/reports` - Financial reports
- `/settings` - User settings

## Security Features
- Secure session cookies (httpOnly, secure, sameSite)
- 30-minute inactivity timeout
- JWT token validation
- Rate limiting (to be implemented)
- Brute force protection (to be implemented)

## Session Management
- Sessions expire after 30 minutes of inactivity
- Session refresh on user activity
- Automatic redirect to login on session expiration
- Secure session storage

## Error Handling
- Proper error responses for authentication failures
- Security monitoring logging
- User-friendly error messages