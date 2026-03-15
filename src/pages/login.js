// Login/Signup Page
import { login, signup } from '../js/auth.js';
import { showToast, isValidEmail } from '../js/utils.js';

let isLoginMode = true;

export function renderLoginPage() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container" style="padding-top: var(--space-8);">
      <div class="auth-container">
        <div class="auth-header">
          <h1>Welcome to Intake</h1>
          <p class="text-secondary">Real experiences, real knowledge</p>
        </div>
        
        <div class="auth-tabs">
          <button class="auth-tab active" id="login-tab" onclick="window.switchAuthMode('login')">
            Login
          </button>
          <button class="auth-tab" id="signup-tab" onclick="window.switchAuthMode('signup')">
            Sign Up
          </button>
        </div>
        
        <form id="auth-form" class="auth-form">
          <div id="form-fields"></div>
          
          <button type="submit" class="btn btn-primary btn-full btn-large">
            <span id="submit-text">Continue</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p class="text-muted text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  `;
  
  renderFormFields();
  setupFormHandler();
  
  // Expose switch mode function globally
  window.switchAuthMode = switchAuthMode;
}

function switchAuthMode(mode) {
  isLoginMode = mode === 'login';
  
  // Update tabs
  document.getElementById('login-tab').classList.toggle('active', isLoginMode);
  document.getElementById('signup-tab').classList.toggle('active', !isLoginMode);
  
  renderFormFields();
}

function renderFormFields() {
  const container = document.getElementById('form-fields');
  
  if (isLoginMode) {
    container.innerHTML = `
      <div class="input-group">
        <label class="input-label" for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          class="input-field" 
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div class="input-group">
        <label class="input-label" for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          class="input-field" 
          placeholder="••••••••"
          required
        />
      </div>
    `;
    document.getElementById('submit-text').textContent = 'Login';
  } else {
    container.innerHTML = `
      <div class="input-group">
        <label class="input-label" for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          class="input-field" 
          placeholder="Choose a username"
          required
        />
      </div>
      
      <div class="input-group">
        <label class="input-label" for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          class="input-field" 
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div class="input-group">
        <label class="input-label" for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          class="input-field" 
          placeholder="At least 8 characters"
          required
          minlength="8"
        />
      </div>
    `;
    document.getElementById('submit-text').textContent = 'Sign Up';
  }
}

function setupFormHandler() {
  const form = document.getElementById('auth-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = isLoginMode ? null : document.getElementById('username').value;
    
    // Validate email
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    
    // Validate password
    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
      let result;
      if (isLoginMode) {
        result = await login(email, password);
      } else {
        if (!username || username.length < 3) {
          showToast('Username must be at least 3 characters', 'error');
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          return;
        }
        result = await signup(email, password, username);
      }
      
      if (result.error) {
        showToast(result.error.message, 'error');
      } else {
        showToast(`Welcome ${isLoginMode ? 'back' : 'to Intake'}!`, 'success');
        setTimeout(() => {
          window.location.hash = 'home';
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

// Add page-specific styles
const style = document.createElement('style');
style.textContent = `
  .auth-container {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .auth-header {
    text-align: center;
    margin-bottom: var(--space-8);
  }
  
  .auth-tabs {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
    border-bottom: var(--border-width) solid var(--color-border-light);
  }
  
  .auth-tab {
    flex: 1;
    padding: var(--space-3) var(--space-4);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }
  
  .auth-tab:hover {
    color: var(--color-text-primary);
  }
  
  .auth-tab.active {
    color: var(--color-primary-darker);
    border-bottom-color: var(--color-primary);
  }
  
  .auth-form {
    margin-bottom: var(--space-6);
  }
  
  .auth-footer {
    margin-top: var(--space-8);
  }
  
  .auth-footer p {
    font-size: var(--font-size-sm);
  }
`;
document.head.appendChild(style);
