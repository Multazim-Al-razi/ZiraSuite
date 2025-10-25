# Use the official Node.js runtime as a parent image
FROM node:18-alpine

# Install system dependencies that might be needed
RUN apk add --no-cache \
    libc6-compat \
    curl

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000 for the authentication gateway
EXPOSE 3000

# Define the command to run the application
CMD ["node", "server.js"]