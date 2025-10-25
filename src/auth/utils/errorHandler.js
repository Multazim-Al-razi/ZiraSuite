/**
 * Error handling and logging infrastructure for authentication
 */

export class AuthErrorHandler {
  /**
   * Handles authentication errors and creates appropriate responses
   * @param {Error} error - The error that occurred
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static handleAuthError(error, req, res, next) {
    // Log the error with relevant information
    this.logError(error, req);

    // Determine the appropriate response based on error type
    if (error.status === 401 || error.message.includes('Invalid session') || error.message.includes('Authentication required')) {
      return res.status(401).json({ 
        error: 'Unauthorized: Invalid or expired session',
        success: false
      });
    } else if (error.status === 40 || error.message.includes('email') || error.message.includes('password')) {
      return res.status(400).json({ 
        error: 'Bad Request: Invalid input parameters',
        success: false
      });
    } else {
      // For other errors, return a generic server error
      return res.status(500).json({ 
        error: 'Internal Server Error',
        success: false
      });
    }
  }

  /**
   * Logs authentication errors for security monitoring
   * @param {Error} error - The error to log
   * @param {Object} req - Express request object
   */
  static logError(error, req) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      method: req.method,
      url: req.url,
      userId: req.user ? req.user.id : 'unauthenticated',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown'
    };

    // In a real application, you would send this to a logging service
    console.error('Authentication Error:', JSON.stringify(logEntry, null, 2));
  }

  /**
   * Creates a standardized error response
   * @param {string} message - The error message
   * @param {number} status - The HTTP status code
   * @returns {Object} The error response object
   */
  static createErrorResponse(message, status = 500) {
    return {
      error: message,
      status: status,
      success: false,
      timestamp: new Date().toISOString()
    };
  }
}

export default AuthErrorHandler;