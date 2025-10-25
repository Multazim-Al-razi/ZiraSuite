# Zira Suite - Supabase Authentication Integration

This project implements a complete authentication system using Supabase for the Zira Suite accounting application. The system provides secure user authentication, session management, and protected route access.

## Features

- **User Authentication**: Secure login with email and password using Supabase Auth
- **Session Management**: Automatic 30-minute inactivity timeout
- **Protected Routes**: Middleware to protect application routes
- **Secure Cookies**: HttpOnly, secure, and sameSite cookies for session storage
- **Error Handling**: Comprehensive authentication error handling and logging
- **Responsive UI**: Clean, responsive login interface

## Architecture

- **Frontend**: HTML, CSS, JavaScript for login interface
- **Backend**: Node.js/Express server with authentication middleware
- **Authentication**: Supabase Auth service
- **Session Management**: Custom session management with timeout
- **Deployment**: Docker container ready for Render deployment

## Configuration

The application is pre-configured with your Supabase project credentials:

- **Supabase URL**: `https://efoifbextrouwrutykiq.supabase.co`
- **Environment**: Production

## Deployment

The application is configured for deployment to Render with:

- Dockerfile for containerization
- render.yaml for Render service configuration
- Environment variables pre-configured
- Port 3000 exposed

### Deployment Steps

1. Push this code to a GitHub, GitLab, or Bitbucket repository
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Create a new Web Service
4. Connect to your repository
5. Render will automatically detect the `render.yaml` file
6. The service will deploy with the pre-configured environment variables

## Files Included

- `server.js` - Main application server
- `config/supabase.js` - Supabase client configuration
- `middleware/auth.js` - Authentication middleware
- `src/controllers/authController.js` - Authentication endpoints
- `src/auth/session/` - Session management components
- `src/views/login.html` - Login page UI
- `public/css/login.css` - Login page styling
- `public/js/login.js` - Login page JavaScript
- `Dockerfile` - Container configuration
- `render.yaml` - Render deployment configuration
- `package.json` - Dependencies and scripts

## Security Features

- Passwords never stored - using Supabase Auth
- Secure session cookies (httpOnly, secure, sameSite)
- Automatic session timeout after 30 minutes of inactivity
- JWT token validation
- Protection against session hijacking
- Comprehensive error logging for security monitoring

## Environment Variables

The following environment variables are configured for production:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `NODE_ENV`: Set to "production"

## MCP Connection

This project is configured for seamless integration with KiloCode's MCP (Multi-Cloud Platform) connection feature. The deployment configuration includes:

- Cloud-agnostic deployment files
- Standardized environment variable management
- Containerized architecture for portability
- Pre-configured for Render deployment

## Support

For issues with the authentication system, check:

1. Supabase project configuration in your dashboard
2. Network connectivity to Supabase services
3. Environment variables in your deployment platform

---

This project is production-ready and configured for immediate deployment to Render.