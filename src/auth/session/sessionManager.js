import UserSession from './sessionModel.js';

class SessionManager {
  constructor() {
    // In a real application, you would use a database or Redis to store sessions
    // For this implementation, we'll use an in-memory store
    this.sessions = new Map();
  }

 /**
   * Creates a new session for a user
   * @param {string} userId - The ID of the user
   * @param {string} jwtToken - The JWT token for the session
   * @returns {UserSession} The created session
   */
  createSession(userId, jwtToken) {
    const sessionId = this.generateSessionId();
    const session = new UserSession(sessionId, userId, jwtToken);
    
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Gets a session by its ID
   * @param {string} sessionId - The ID of the session
   * @returns {UserSession|null} The session if found and valid, null otherwise
   */
  getSession(sessionId) {
    if (!sessionId) return null;
    
    const session = this.sessions.get(sessionId);
    if (!session || !session.isValid()) {
      if (session) {
        this.destroySession(sessionId); // Clean up expired session
      }
      return null;
    }
    
    // Update last accessed time to renew the session
    session.updateLastAccessed();
    return session;
 }

  /**
   * Destroys a session
   * @param {string} sessionId - The ID of the session to destroy
   */
  destroySession(sessionId) {
    this.sessions.delete(sessionId);
  }

  /**
   * Generates a unique session ID
   * @returns {string} A unique session ID
   */
  generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Validates a session and returns its status
   * @param {string} sessionId - The ID of the session to validate
   * @returns {Object} An object with validation status and user info if valid
   */
  validateSession(sessionId) {
    const session = this.getSession(sessionId);
    if (session) {
      return {
        isValid: true,
        userId: session.userId,
        lastAccessed: session.lastAccessed
      };
    }
    
    return {
      isValid: false,
      userId: null,
      lastAccessed: null
    };
  }

  /**
   * Cleans up expired sessions (should be called periodically)
   */
  cleanupExpiredSessions() {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.isExpired()) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Implements session refresh mechanism to update lastAccessed timestamp
   * @param {string} sessionId - The ID of the session to refresh
   * @returns {boolean} True if session was refreshed, false if session not found
   */
  refreshSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.updateLastAccessed();
      return true;
    }
    return false;
  }
}

// Export a singleton instance
export default new SessionManager();