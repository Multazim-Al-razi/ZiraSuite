# Data Model: Supabase Authentication Integration

## User Session Entity

**Entity Name**: UserSession
**Description**: Represents an authenticated user session with validation and metadata
**Fields**:
- sessionId (string): Unique identifier for the session
- userId (string): Reference to the authenticated user
- jwtToken (string): JWT token for session validation
- createdAt (datetime): Timestamp when session was created
- expiresAt (datetime): Timestamp when session expires
- lastAccessed (datetime): Timestamp of last activity
- ipAddress (string): IP address of the client
- userAgent (string): Browser/client information

**Validation Rules**:
- sessionId must be unique
- expiresAt must be in the future
- userId must reference a valid user in Supabase auth system

## Supabase Auth User Entity

**Entity Name**: AuthUser
**Description**: Represents a user in the Supabase authentication system
**Fields**:
- id (string): Unique user identifier from Supabase
- email (string): User's email address (unique)
- emailVerified (boolean): Whether email has been verified
- createdAt (datetime): Account creation timestamp
- updatedAt (datetime): Last update timestamp
- lastSignInAt (datetime): Last sign-in timestamp
- role (string): User role/permission level
- isActive (boolean): Whether account is active

**Validation Rules**:
- email must be valid and unique
- email must be verified before full access
- isActive must be true for access to application

## Authentication Attempt Entity

**Entity Name**: AuthAttempt
**Description**: Records authentication attempts for security monitoring
**Fields**:
- attemptId (string): Unique identifier for the attempt
- userId (string): Reference to user (if known)
- email (string): Email used in the attempt
- success (boolean): Whether attempt was successful
- timestamp (datetime): When attempt occurred
- ipAddress (string): IP address of the client
- userAgent (string): Browser/client information
- failureReason (string): Reason for failure (if applicable)

**Validation Rules**:
- timestamp must be current
- ipAddress and userAgent must be captured for security

## User Permissions Entity

**Entity Name**: UserPermissions
**Description**: Defines permissions for authenticated users
**Fields**:
- permissionId (string): Unique identifier for the permission
- userId (string): Reference to the authenticated user
- resource (string): Resource or feature being accessed
- action (string): Action being performed (read, write, delete)
- granted (boolean): Whether permission is granted
- createdAt (datetime): When permission was set
- expiresAt (datetime): When permission expires (optional)

**Validation Rules**:
- userId must reference a valid user
- resource and action must be predefined values
- expiresAt must be in the future (if set)

## Session Configuration Entity

**Entity Name**: SessionConfig
**Description**: Configuration settings for session management
**Fields**:
- configId (string): Unique identifier for config
- sessionTimeout (integer): Session timeout in minutes
- rememberMeTimeout (integer): Remember me timeout in days
- concurrentSessions (integer): Max concurrent sessions allowed
- refreshTokenWindow (integer): Refresh token window in minutes
- forceMfa (boolean): Whether MFA is required

**Validation Rules**:
- sessionTimeout must be between 15 and 1440 minutes
- rememberMeTimeout must be between 1 and 365 days
- concurrentSessions must be between 1 and 10

## Relationships

1. **AuthUser** (1) → (0..*) **UserSession**: An authenticated user can have multiple sessions
2. **AuthUser** (1) → (0..*) **AuthAttempt**: A user can have multiple authentication attempts
3. **AuthUser** (1) → (0..*) **UserPermissions**: A user can have multiple permissions
4. **SessionConfig** (1) → (1) **UserSession**: Each session follows a configuration

## State Transitions

### User Session States
- **Active**: Session is valid and user has access
- **Expired**: Session has passed its expiration time
- **Revoked**: Session was manually invalidated
- **TimedOut**: Session exceeded inactivity timeout

### Authentication States
- **Pending**: Authentication request received
- **Validating**: Credentials being verified
- **Success**: Authentication successful
- **Failed**: Authentication failed
- **Locked**: Account temporarily locked after failed attempts