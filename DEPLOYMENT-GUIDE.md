# Deployment Guide: Zira Suite Supabase Authentication

## Git Repository Setup

Your local Git repository has been initialized with all necessary files. Here's how to connect it to a remote repository:

### 1. Create a Remote Repository
1. Go to GitHub, GitLab, or Bitbucket
2. Create a new repository (e.g., "zira-suite-auth")
3. Copy the repository URL (e.g., `https://github.com/username/zira-suite-auth.git`)

### 2. Connect Local Repository to Remote
```bash
cd Zira_Suite/.kilocode/workflows/integrate-supabase-auth
git remote add origin [YOUR_REPOSITORY_URL]
git branch -M main
git push -u origin main
```

## Render Deployment

### 1. Prepare for Render Deployment
The following files are already configured for Render deployment:
- `render.yaml` - Contains Render service configuration
- `Dockerfile` - Container configuration
- Environment variables are pre-configured in render.yaml

### 2. Deploy to Render
1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Sign in to your Render account
3. Click "New +" and select "Web Service"
4. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
5. Select your repository that contains this code
6. Render will automatically detect the `render.yaml` file
7. The service will be configured with:
   - Name: zira-suite-auth
   - Environment: Docker
   - Region: Oregon
   - Plan: Free
   - Branch: main
   - Environment variables (SUPABASE_URL, SUPABASE_ANON_KEY, and MANAGER_SERVER_URL) are already configured

### 3. ManagerServer Integration
**Important**: This application acts as an authentication gateway for your existing ManagerServer application. For full functionality:

1. You'll need to deploy your ManagerServer-linux-x64 application separately
2. Update the `MANAGER_SERVER_URL` environment variable in Render to point to your ManagerServer instance
3. The authentication gateway will forward authenticated requests to your ManagerServer

### 4. Monitor Deployment
- Render will automatically build and deploy your authentication gateway
- You can monitor the build logs in the Render dashboard
- Once deployed, your authentication gateway will be accessible at the URL provided by Render
- Remember to update the `MANAGER_SERVER_URL` to point to your actual ManagerServer application

## Application Features

### Authentication System
- Secure login with Supabase authentication
- Session management with 30-minute timeout
- Protected routes middleware
- Secure cookie handling
- Comprehensive error handling

### Supabase Integration
- Connected to: https://efoifbextrouwrutykiq.supabase.co
- Using secure API keys
- Email/password authentication
- Session validation

### Gateway Functionality
- Acts as a proxy between users and the ManagerServer
- All requests are authenticated before being forwarded
- User information is passed to ManagerServer via headers
- Maintains the existing ManagerServer functionality

## Post-Deployment

### 1. Verify Deployment
- Access your authentication gateway using the Render URL
- Test the login functionality
- Verify protected routes work correctly
- Test session timeout behavior

### 2. Connect to ManagerServer
- Ensure your ManagerServer application is deployed and accessible
- Update the `MANAGER_SERVER_URL` environment variable in Render if needed
- Test the complete flow: login → authenticated access to ManagerServer

### 3. Security Considerations
- The .env file is in .gitignore and will not be pushed to the repository
- Environment variables are configured in Render dashboard
- Secure cookies are enabled (httpOnly, secure, sameSite)

### 4. Troubleshooting
If you encounter issues:
- Check the Render logs in the dashboard
- Verify your Supabase project is accessible
- Ensure the MANAGER_SERVER_URL is correctly configured
- Confirm your ManagerServer application is running and accessible
- Test locally before deployment using: `node server.js`

## MCP Connection

This application is configured for KiloCode's MCP (Multi-Cloud Platform) connection feature with:
- Standardized configuration files
- Cloud-agnostic deployment approach
- Containerized architecture
- Pre-configured for multi-cloud deployment

## Support

For deployment issues:
1. Check Render build logs
2. Verify Supabase project configuration
3. Confirm environment variables are set correctly
4. Ensure ManagerServer is accessible from the gateway

Your authentication gateway is production-ready and configured for immediate deployment to Render!