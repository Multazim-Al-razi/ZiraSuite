document.addEventListener('DOMContentLoaded', function() {
 const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('error-message');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        // Call login API
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Login successful - redirect to main application
          window.location.href = '/dashboard'; // or wherever the main app is
        } else {
          // Show error message
          errorMessage.textContent = data.error || 'Login failed';
          errorMessage.classList.remove('hidden');
        }
      } catch (error) {
        // Handle network errors
        errorMessage.textContent = 'Network error. Please try again.';
        errorMessage.classList.remove('hidden');
        console.error('Login error:', error);
      }
    });
  }
  
  // Function to handle logout
  window.handleLogout = async function() {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include' // Include cookies in the request
      });
      
      if (response.ok) {
        // Redirect to login page after logout
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  // Add logout button to login page if user is logged in elsewhere
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Logout';
  logoutBtn.onclick = window.handleLogout;
  logoutBtn.style.display = 'none'; // Initially hidden
  document.body.appendChild(logoutBtn);
  
  // Check if user is already logged in by validating session
  window.checkSession = async function() {
    try {
      const response = await fetch('/auth/session', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const sessionData = await response.json();
        if (sessionData.valid) {
          // User is logged in, show logout button
          logoutBtn.style.display = 'block';
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };
  
  // Check session on page load
  window.checkSession();
});