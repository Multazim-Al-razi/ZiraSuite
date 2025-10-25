import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Health check endpoint
app.get('/', (req, res) => {
  res.send('<h1>Supabase Auth Integration - Home</h1><a href="/login">Login</a>');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});