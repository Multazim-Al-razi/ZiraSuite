# Deployment Instructions for Supabase Authentication Integration

## Overview
This document provides instructions for connecting the application to Supabase and deploying it to Render.

## Supabase Setup

### 1. Create a Supabase Project
- Go to [supabase.com](https://supabase.com) and sign in
- Create a new project
- Note down your Project URL and Project API keys (anon and service_role)

### 2. Configure Authentication
- Navigate to Authentication → Settings in your Supabase dashboard
- Enable Email authentication
- Configure email templates as needed
- Set up any additional providers if required

### 3. Environment Variables
In your Supabase project, you'll need these values:
- SUPABASE_URL: Your project URL (e.g., https://xxxxx.supabase.co)
- SUPABASE_ANON_KEY: Your anon public API key (starts with "eyJhb...")

## Render Deployment

### 1. Prepare for Deployment
- Ensure all code is committed to your repository
- The `render.yaml` file is already configured for deployment
- Dockerfile is included for containerized deployment

### 2. Connect to Render
- Go to [render.com](https://render.com) and sign in
- Connect your GitHub/GitLab/Bitbucket account
- Select your repository containing this code

### 3. Configure Environment Variables on Render
When setting up the web service on Render, add these environment variables:
- SUPABASE_URL: [Your Supabase project URL]
- SUPABASE_ANON_KEY: [Your Supabase anon key]

### 4. Deployment Configuration
- The service will use the Dockerfile for building
- Port: 3000 (as specified in the Dockerfile)
- Plan: Can start with Free plan for development
- Environment: Production

## Application Configuration

### 1. Update server.js for Production
The server.js file is already configured to use environment variables for:
- Port configuration (uses process.env.PORT or defaults to 300)
- Environment detection (NODE_ENV)

### 2. Session Configuration
- Session timeout is configured for 30 minutes of inactivity
- Secure cookies are used (httpOnly, secure, sameSite)

## Deployment Steps

1. Push your code to the repository
2. On Render dashboard, create a new Web Service
3. Connect to your repository
4. Select the `render.yaml` file for automatic configuration
5. Add the environment variables (SUPABASE_URL and SUPABASE_ANON_KEY)
6. Deploy the service

## Post-Deployment Verification

1. Verify the application is running at your Render URL
2. Test the login functionality with valid Supabase credentials
3. Verify protected routes redirect unauthenticated users to login
4. Test session timeout behavior (should timeout after 30 minutes of inactivity)
5. Verify logout functionality works correctly

## Troubleshooting

### Common Issues:
- **Environment Variables Missing**: Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in Render dashboard
- **Connection Issues**: Verify your Supabase project is accessible and keys are correct
- **Session Issues**: Check that your domain allows secure cookies if using HTTPS

### Logs:
- Check Render logs for runtime errors
- Verify Supabase dashboard for authentication logs
- Look for error messages in the application logs

## Security Considerations

- Never commit Supabase keys to version control
- Use environment variables for all sensitive configuration
- Ensure secure cookies are properly configured
- Implement rate limiting in production environments
- Regularly rotate API keys