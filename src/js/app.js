// Main Application Entry Point
import { renderTopNav } from '../components/navbar.js';
import { renderBottomNav } from '../components/bottom-nav.js';
import { initRouter } from './router.js';
import { checkAuth } from './auth.js';

// Initialize the app
async function init() {
  console.log('🚀 Birth Control Community App Starting...');
  
  // Check authentication status
  const user = await checkAuth();
  
  // Render navigation
  renderTopNav();
  renderBottomNav();
  
  // Initialize router
  initRouter(user);
  
  // Handle pull-to-refresh
  setupPullToRefresh();
  
  console.log('✅ App initialized successfully');
}

// Pull to refresh functionality
function setupPullToRefresh() {
  let startY = 0;
  let pulling = false;
  
  const app = document.getElementById('app');
  
  app.addEventListener('touchstart', (e) => {
    if (app.scrollTop === 0) {
      startY = e.touches[0].pageY;
      pulling = true;
    }
  });
  
  app.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    
    const currentY = e.touches[0].pageY;
    const distance = currentY - startY;
    
    if (distance > 80) {
      // Trigger refresh
      window.location.reload();
    }
  });
  
  app.addEventListener('touchend', () => {
    pulling = false;
  });
}

// Handle navigation events
window.addEventListener('navigate', (e) => {
  const { page } = e.detail;
  window.location.hash = page;
});

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
window.app = {
  version: '1.0.0',
  name: 'Intake'
};
