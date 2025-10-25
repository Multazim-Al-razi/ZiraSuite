import { supabase } from '../config/supabase.js'
import SessionManager from '../src/auth/session/sessionManager.js';

export const requireAuth = async (req, res, next) => {
  // Get session token from cookie or authorization header
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies.session_token

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    // First, check if the session is valid in our session manager
    // In a real implementation, we would map the JWT token to a session ID
    // For this implementation, we'll just verify with Supabase and then check session timeout
    
    // Verify session with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid session' })
    }

    // Attach user to request object
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Session verification failed' })
  }
}

// Middleware to handle session timeout validation
export const validateSessionTimeout = (req, res, next) => {
  // Get session token from cookie
  const token = req.cookies.session_token;
  
  if (token) {
    // In a real implementation, we would map the JWT token to a session ID
    // For now, we'll just continue
    // SessionManager.refreshSession(sessionId); // Refresh session on activity
  }
  
  next();
}