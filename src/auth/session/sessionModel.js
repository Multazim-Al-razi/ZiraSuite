/**
 * UserSession Model
 * Represents an authenticated user session with validation and metadata
 */

class UserSession {
  constructor(sessionId, userId, jwtToken) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.jwtToken = jwtToken;
    this.createdAt = new Date();
    this.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    this.lastAccessed = new Date();
    this.ipAddress = null;
    this.userAgent = null;
 }

  /**
   * Updates the last accessed time to renew the session
   */
  updateLastAccessed() {
    this.lastAccessed = new Date();
    // Extend expiration time by 30 minutes from now
    this.expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  }

  /**
   * Checks if the session has expired based on inactivity
   * @returns {boolean} True if session has expired, false otherwise
   */
  isExpired() {
    return new Date() > this.expiresAt;
  }

  /**
   * Checks if the session is still valid
   * @returns {boolean} True if session is valid, false otherwise
   */
  isValid() {
    return !this.isExpired();
  }
}

module.exports = UserSession;