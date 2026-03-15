// Client-Side Router
import { renderHomePage } from '../pages/home.js';
import { renderBrowsePage } from '../pages/browse.js';
import { renderProfilePage } from '../pages/profile.js';
import { renderLoginPage } from '../pages/login.js';
import { renderCreatePostPage } from '../pages/create-post.js';
import { renderBottomNav } from '../components/bottom-nav.js';

let currentUser = null;

// Route configuration
const routes = {
  '': 'home',
  'home': 'home',
  'browse': 'browse',
  'contribute': 'create-post',
  'create-post': 'create-post',
  'community': 'community',
  'profile': 'profile',
  'login': 'login',
  'method': 'method-detail',
  'discussion': 'discussion',
  'tips': 'tips',
  'side-effects': 'side-effects'
};

// Page renderers
const pageRenderers = {
  home: renderHomePage,
  browse: renderBrowsePage,
  profile: renderProfilePage,
  login: renderLoginPage,
  'create-post': renderCreatePostPage,
  community: () => renderPlaceholder('Community', 'Connect with others in the community'),
  'method-detail': () => renderPlaceholder('Method Details', 'Detailed information about a specific method'),
  discussion: () => renderPlaceholder('Discussion', 'Forum discussion'),
  tips: () => renderPlaceholder('Tips & Tricks', 'Practical advice from the community'),
  'side-effects': () => renderPlaceholder('Side Effects', 'Track and share side effects')
};

export function initRouter(user) {
  currentUser = user;
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute);
  
  // Initial route
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash.slice(1); // Remove #
  const routeName = routes[hash] || 'home';
  
  // Check if route requires authentication
  if (requiresAuth(routeName) && !currentUser) {
    navigateToLogin();
    return;
  }
  
  // Render the page
  const renderer = pageRenderers[routeName] || pageRenderers.home;
  renderer(currentUser);
  
  // Update bottom nav active state
  renderBottomNav(routeName);
  
  // Scroll to top
  window.scrollTo(0, 0);
}

function requiresAuth(routeName) {
  const authRequired = ['contribute', 'create-post', 'profile'];
  return authRequired.includes(routeName);
}

function navigateToLogin() {
  window.location.hash = 'login';
}

// Placeholder page renderer for pages not yet built
function renderPlaceholder(title, description) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="empty-state">
        <div class="empty-state-icon">🚧</div>
        <h2 class="empty-state-title">${title}</h2>
        <p class="empty-state-text">${description}</p>
        <p class="text-muted">Coming soon!</p>
      </div>
    </div>
  `;
}

// Export navigation helper
export function navigate(path) {
  window.location.hash = path;
}
