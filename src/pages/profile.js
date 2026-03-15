// Profile Page
import { getCurrentUser, logout } from '../js/auth.js';
import { getVerifiedMethods } from '../js/db.js';

export async function renderProfilePage(user) {
  const app = document.getElementById('app');
  
  if (!user) {
    window.location.hash = 'login';
    return;
  }
  
  // Fetch user data
  const { data: verifiedMethods } = await getVerifiedMethods(user.id);
  
  app.innerHTML = `
    <div class="container" style="padding-top: var(--space-6); padding-bottom: var(--space-6);">
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-circle">
            ${user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
        <h1>${user.username || 'User'}</h1>
        <p class="text-secondary">${user.email}</p>
      </div>
      
      <div class="profile-section">
        <h2>Verified Methods</h2>
        <div class="verified-methods">
          ${verifiedMethods && verifiedMethods.length > 0 
            ? verifiedMethods.map(method => `
                <div class="badge badge-verified">
                  ✓ ${method.name}
                </div>
              `).join('')
            : '<p class="text-muted">No verified methods yet. Contribute to get verified!</p>'
          }
        </div>
      </div>
      
      <div class="profile-section">
        <h2>My Activity</h2>
        <div class="activity-stats">
          <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">Posts</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">Comments</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">0</div>
            <div class="stat-label">Helpful Votes</div>
          </div>
        </div>
      </div>
      
      <div class="profile-actions">
        <button class="btn btn-secondary btn-full" onclick="alert('Settings coming soon!')">
          Settings
        </button>
        <button class="btn btn-outline btn-full" id="logout-btn">
          Logout
        </button>
      </div>
    </div>
  `;
  
  // Setup logout
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await logout();
  });
}

// Add page-specific styles
const style = document.createElement('style');
style.textContent = `
  .profile-header {
    text-align: center;
    margin-bottom: var(--space-8);
    padding: var(--space-6) 0;
  }
  
  .profile-avatar {
    margin-bottom: var(--space-4);
  }
  
  .avatar-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--color-primary);
    color: var(--color-text-white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    margin: 0 auto;
    border: 4px solid var(--color-primary-dark);
  }
  
  .profile-section {
    margin-bottom: var(--space-8);
  }
  
  .profile-section h2 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-4);
  }
  
  .verified-methods {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  
  .activity-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }
  
  .stat-card {
    background: var(--color-bg-white);
    border: var(--border-width) solid var(--color-primary-light);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    text-align: center;
  }
  
  .stat-value {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary-darker);
    margin-bottom: var(--space-2);
  }
  
  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
  
  .profile-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-top: var(--space-8);
  }
`;
document.head.appendChild(style);
