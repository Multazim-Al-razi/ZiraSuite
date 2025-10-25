import { requireAuth } from '../../middleware/auth.js';

/**
 * Authentication guard middleware to protect application routes
 * Redirects unauthenticated users to login page
 */
export const authGuard = (req, res, next) => {
  // Check if this is a protected route
  const protectedRoutes = ['/dashboard', '/api', '/reports', '/settings'];
  
  // If the current path is a protected route and user is not authenticated
  if (protectedRoutes.some(route => req.path.startsWith(route)) && !req.user) {
    // Redirect to login page
    return res.redirect('/login');
  }
  
  // If user is authenticated or route is not protected, continue
  next();
};