# Quickstart Guide: Supabase Authentication Integration

## Prerequisites

- Existing server-based accounting application
- Supabase project set up with authentication enabled
- Node.js environment (if using Node.js for server)
- Git for version control

## Setup Steps

### 1. Install Dependencies

First, install the Supabase client library:

```bash
npm install @supabase/supabase-js
```

### 2. Configure Supabase

Create a configuration file for Supabase credentials:

```javascript
// config/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Make sure to add your Supabase URL and anon key to your environment variables:

```bash
# .env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Authentication Middleware

Implement authentication middleware to protect routes:

```javascript
// middleware/auth.js
import { supabase } from '../config/supabase.js'

export const requireAuth = async (req, res, next) => {
  // Get session from cookie or header
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies.session_token

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
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
```

### 4. Create Login Endpoint

Implement the login endpoint:

```javascript
// controllers/authController.js
import { supabase } from '../config/supabase.js'

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    // Set session token in cookie
    res.cookie('session_token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict',
    })

    res.json({ 
      success: true, 
      user: data.user,
      message: 'Login successful' 
    })
  } catch (err) {
    res.status(50).json({ error: 'Login failed' })
  }
}

export const logout = async (req, res) => {
 try {
    await supabase.auth.signOut()
    res.clearCookie('session_token')
    res.json({ success: true, message: 'Logout successful' })
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' })
  }
}
```

### 5. Create Login Page

Create a simple login page:

```html
<!-- views/login.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Login - Accounting Application</title>
    <link rel="stylesheet" href="/css/login.css">
</head>
<body>
    <div class="login-container">
        <h1>Accounting Application</h1>
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
        <div id="error-message" class="error hidden"></div>
    </div>

    <script src="/js/login.js"></script>
</body>
</html>
```

### 6. Add Authentication Routes

Add routes for authentication:

```javascript
// routes/auth.js
import express from 'express'
import { login, logout } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', requireAuth, logout)

export default router
```

### 7. Protect Application Routes

Apply authentication middleware to protected routes:

```javascript
// app.js or server.js
import authRoutes from './routes/auth.js'
import { requireAuth } from './middleware/auth.js'

// Public routes
app.use('/auth', authRoutes)

// Protected routes (require authentication)
app.use('/api', requireAuth, apiRoutes)
app.use('/dashboard', requireAuth, dashboardRoutes)
app.use('/reports', requireAuth, reportsRoutes)
// Add other routes that require authentication
```

### 8. Update Existing Application

Modify your existing application to redirect unauthenticated users to the login page:

```javascript
// For server-side rendered applications
app.get('*', (req, res, next) => {
  // Check if this is a protected route
  const protectedRoutes = ['/dashboard', '/reports', '/api'];
  
  if (protectedRoutes.some(route => req.path.startsWith(route)) && !req.user) {
    // Redirect to login page
    return res.redirect('/login');
  }
  
  next();
});
```

## Environment Configuration

Make sure your environment is properly configured:

```bash
# For development
SUPABASE_URL=your_dev_supabase_url
SUPABASE_ANON_KEY=your_dev_supabase_anon_key
NODE_ENV=development

# For production
SUPABASE_URL=your_prod_supabase_url
SUPABASE_ANON_KEY=your_prod_supabase_anon_key
NODE_ENV=production
```

## Running the Application

1. Set up your environment variables
2. Install dependencies: `npm install`
3. Start your server: `npm start` or `node server.js`
4. Access your application at the configured port
5. You will be redirected to the login page if you try to access protected routes

## Testing Authentication

You can test the authentication flow:

1. Navigate to a protected route - you should be redirected to login
2. Use the login form with valid Supabase credentials
3. After successful login, you should be able to access protected routes
4. Verify that the session persists across page refreshes
5. Test logout functionality