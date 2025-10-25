#!/bin/bash

# Deployment script for Zira Suite Supabase Authentication Integration
# This script prepares and deploys the application to Render

echo "Zira Suite Supabase Authentication Deployment Script"
echo "====================================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✓ Verified project directory"

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Error: Docker is not installed or not in PATH." >&2
  exit 1
fi

echo "✓ Docker is installed"

# Build the Docker image
echo "Building Docker image..."
docker build -t zira-suite-auth .

if [ $? -eq 0 ]; then
    echo "✓ Docker image built successfully"
else
    echo "✗ Docker build failed"
    exit 1
fi

# Verify environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "Warning: Environment variables SUPABASE_URL or SUPABASE_ANON_KEY not set in shell."
    echo "These are configured in the render.yaml file for deployment."
fi

echo
echo "Deployment Preparation Complete!"
echo
echo "To deploy to Render:"
echo "1. Make sure your repository is pushed to GitHub/GitLab/Bitbucket"
echo "2. Go to https://dashboard.render.com"
echo "3. Create a new Web Service"
echo "4. Connect to your repository"
echo "5. Use the render.yaml file for automatic configuration"
echo "6. The environment variables are already configured in render.yaml"
echo
echo "Your application is configured with:"
echo "- Supabase URL: https://efoifbextrouwrutykiq.supabase.co"
echo "- Node environment: production"
echo "- Port: 3000"
echo
echo "The deployment is ready!"