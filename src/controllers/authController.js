import { supabase } from '../../config/supabase.js';
import SessionManager from '../auth/session/sessionManager.js';
import { AuthErrorHandler } from '../auth/utils/errorHandler.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password required', 
      success: false 
    });
  }

 try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log authentication failure for security monitoring
      AuthErrorHandler.logError(new Error(`Login failed for ${email}: ${error.message}`), req);
      return res.status(401).json({ 
        error: error.message, 
        success: false 
      });
    }

    // Create a session for the authenticated user
    const session = SessionManager.createSession(data.user.id, data.session.access_token);
    
    // Set session token in secure cookie
    res.cookie('session_token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 60 * 100, // 30 minutes
      sameSite: 'strict',
    });

    // Log successful authentication
    AuthErrorHandler.logError(new Error(`Login successful for ${email}`), req);

    res.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        emailVerified: data.user.email_confirmed_at ? true : false
      },
      message: 'Login successful' 
    });
  } catch (err) {
    // Log authentication error for security monitoring
    AuthErrorHandler.logError(err, req);
    res.status(500).json({ 
      error: 'Login failed', 
      success: false 
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Get the session token from the cookie
    const token = req.cookies.session_token;
    
    // If there's a token, try to sign out from Supabase
    if (token) {
      await supabase.auth.signOut();
      
      // Find and destroy the session in our session manager
      // We'd need to modify the session manager to look up by token
      // For now, we'll just clear the cookie
    }
    
    // Clear the session cookie
    res.clearCookie('session_token');
    
    // Log successful logout
    AuthErrorHandler.logError(new Error(`Logout successful for user ${req.user?.id || 'unknown'}`), req);
    
    res.json({ 
      success: true, 
      message: 'Logout successful' 
    });
  } catch (err) {
    // Log logout error for security monitoring
    AuthErrorHandler.logError(err, req);
    res.status(500).json({ 
      error: 'Logout failed', 
      success: false 
    });
  }
};

export const validateSession = async (req, res) => {
  try {
    const sessionId = req.cookies.session_token;
    const validation = SessionManager.validateSession(sessionId);
    
    if (validation.isValid) {
      res.json({ 
        valid: true, 
        userId: validation.userId,
        lastAccessed: validation.lastAccessed
      });
    } else {
      res.status(401).json({ 
        valid: false, 
        error: 'Invalid or expired session' 
      });
    }
  } catch (err) {
    // Log session validation error for security monitoring
    AuthErrorHandler.logError(err, req);
    res.status(500).json({ 
      valid: false, 
      error: 'Session validation failed' 
    });
  }
};