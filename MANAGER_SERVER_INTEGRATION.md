# ManagerServer Integration Guide

This document explains how to properly integrate the Supabase Authentication Gateway with your existing ManagerServer-linux-x64 application.

## Architecture Overview

```
Internet → Auth Gateway (Port 3000) → ManagerServer (Port 8080)
```

The authentication gateway acts as a reverse proxy that:
1. Handles all authentication requests
2. Validates user sessions
3. Forwards authenticated requests to the ManagerServer
4. Blocks unauthenticated access to protected resources

## Integration Steps

### 1. Prepare ManagerServer for Containerization

Since ManagerServer-linux-x64 is a compiled binary, you'll need to create a Dockerfile for it:

Create `ManagerServer-linux-x64/Dockerfile`:
```Dockerfile
FROM mcr.microsoft.com/dotnet/runtime:6.0-alpine

# Install system dependencies needed for ManagerServer
RUN apk add --no-cache \
    libc6-compat \
    libgdiplus \
    libstdc++

WORKDIR /app

# Copy the ManagerServer files
COPY . .

# Make the ManagerServer binary executable
RUN chmod +x ./ManagerServer

# Expose the port ManagerServer runs on (adjust if different)
EXPOSE 8080

# Run ManagerServer
CMD ["./ManagerServer"]
```

### 2. Environment Configuration

The authentication gateway requires the following environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key  
- `MANAGER_SERVER_URL`: URL of the ManagerServer (default: http://manager-server:8080)

### 3. Deployment Options

#### Option A: Docker Compose (Recommended for local development)
Use the provided `docker-compose.yml` file to run both services together.

#### Option B: Separate Deployments
1. Deploy ManagerServer to a service that supports .NET applications
2. Update the `MANAGER_SERVER_URL` in the authentication gateway to point to your deployed ManagerServer

#### Option C: Render Deployment
For Render deployment, you'll need to:
1. Deploy ManagerServer as a separate service
2. Update the `MANAGER_SERVER_URL` in the authentication gateway's environment variables

### 4. Network Configuration

When both services run in the same Docker network (as in docker-compose), they can communicate using service names:
- Auth Gateway can reach ManagerServer at `http://manager-server:8080`
- External requests go through the Auth Gateway at port 3000

### 5. Authentication Flow

1. User requests a protected resource
2. Auth Gateway checks for valid session
3. If unauthenticated, redirects to login
4. If authenticated, forwards request to ManagerServer with user headers:
   - `x-user-id`: User's ID from Supabase
   - `x-user-email`: User's email from Supabase
5. ManagerServer receives the request with user information

### 6. Troubleshooting

If the integration isn't working:

1. Check that ManagerServer is running and accessible at the configured URL
2. Verify that the ports are correctly configured
3. Check the Auth Gateway logs for proxy errors
4. Ensure ManagerServer can handle the forwarded requests with authentication headers

### 7. Security Considerations

- The Auth Gateway should be the only publicly accessible service
- ManagerServer should only be accessible from within the container network
- Authentication headers are added to requests for ManagerServer to use if needed