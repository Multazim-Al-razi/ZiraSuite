import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

import authRoutes from './routes/auth.js';
import { authGuard } from './src/auth/session/authGuard.js';
import { requireAuth, validateSessionTimeout } from './middleware/auth.js';

// For ES modules, we need to get the directory name this way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'html'); // This would require a template engine, but for now we'll serve HTML directly

// Public routes
app.use('/auth', authRoutes);

// Apply auth guard to protected routes
app.use('/dashboard', authGuard);
app.use('/api', authGuard);
app.use('/reports', authGuard);
app.use('/settings', authGuard);

// Public route for login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/views/login.html'));
});

// Middleware to check session timeout for all requests
app.use(validateSessionTimeout);

// Fallback route - redirect unauthenticated users to login
app.get('*', (req, res, next) => {
  // Check if this is a protected route
  const protectedRoutes = ['/dashboard', '/api', '/reports', '/settings'];
  
  if (protectedRoutes.some(route => req.path.startsWith(route)) && !req.user) {
    // Redirect to login page
    return res.redirect('/login');
  }
  
  next();
});

// Example protected route
app.get('/dashboard', requireAuth, (req, res) => {
  res.send('<h1>Dashboard - Protected Route</h1><p>Welcome, ' + req.user.email + '!</p><button onclick="window.handleLogout()">Logout</button>');
});

// Example API route
app.get('/api/data', requireAuth, (req, res) => {
  res.json({ 
    message: 'This is protected data', 
    user: req.user.email 
  });
});

// Proxy middleware to forward requests to the existing ManagerServer application
// This will handle authentication first, then forward authorized requests to the ManagerServer
const managerServerProxy = createProxyMiddleware({
  target: process.env.MANAGER_SERVER_URL || 'http://manager-server:8080', // Default to manager-server service
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Add authentication information to the forwarded request if needed
    if (req.user) {
      proxyReq.setHeader('x-user-id', req.user.id);
      proxyReq.setHeader('x-user-email', req.user.email);
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    // If ManagerServer is not available, provide a helpful error message
    res.status(500).send(`
      <h1>Service Temporarily Unavailable</h1>
      <p>The ManagerServer application is not currently accessible.</p>
      <p>Please check that the MANAGER_SERVER_URL environment variable is correctly configured.</p>
      <a href="/login">Login</a>
    `);
  }
});

// Route all other requests (that are not auth-related) to the ManagerServer
// But only if the user is authenticated
app.use('*', requireAuth, managerServerProxy);

// Health check endpoint for the integrated application
app.get('/', (req, res) => {
  if (req.user) {
    // If authenticated, redirect to the ManagerServer application
    res.redirect('/dashboard'); // or wherever the main application starts
  } else {
    // If not authenticated, show the login page link
    res.send(`
      <h1>Zira Suite - Supabase Auth Gateway</h1>
      <p>This server handles authentication before forwarding requests to the ManagerServer application.</p>
      <a href="/login">Login</a>
    `);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Authentication Gateway running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Forwarding authenticated requests to ManagerServer at: ${process.env.MANAGER_SERVER_URL || 'http://manager-server:8080'}`);
});

export default app;