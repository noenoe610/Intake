// Bottom Navigation Bar Component
export function renderBottomNav(activePage = 'home') {
  const nav = document.getElementById('bottom-nav');
  
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>`
    },
    {
      id: 'browse',
      label: 'Browse',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>`
    },
    {
      id: 'contribute',
      label: 'Share',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>`
    },
    {
      id: 'community',
      label: 'Community',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>`
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>`
    }
  ];
  
  const navHTML = navItems.map(item => `
    <button 
      class="bottom-nav-item ${item.id === activePage ? 'active' : ''}" 
      data-page="${item.id}"
      aria-label="${item.label}"
    >
      <div class="nav-item-icon">
        ${item.icon}
      </div>
      <span class="nav-item-label">${item.label}</span>
    </button>
  `).join('');
  
  nav.innerHTML = `<div class="bottom-nav-bar">${navHTML}</div>`;
  
  // Add click listeners
  nav.querySelectorAll('.bottom-nav-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const page = e.currentTarget.dataset.page;
      navigateTo(page);
    });
  });
}

function navigateTo(page) {
  // TODO: Implement routing
  console.log('Navigate to:', page);
  // This will be connected to the router later
  window.dispatchEvent(new CustomEvent('navigate', { detail: { page } }));
}

// Add styles for bottom nav
const style = document.createElement('style');
style.textContent = `
  #bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--z-bottom-nav);
  }
  
  .bottom-nav-bar {
    height: var(--bottom-nav-height);
    background-color: var(--color-bg-white);
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: var(--bottom-nav-padding) 0;
    border-top: var(--border-width) solid var(--color-primary-light);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .bottom-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    padding: var(--space-2);
    color: var(--color-text-secondary);
    transition: all 0.2s ease;
    border-radius: var(--radius-sm);
    min-width: 60px;
  }
  
  .bottom-nav-item:hover {
    background-color: var(--color-primary-pale);
  }
  
  .bottom-nav-item.active {
    color: var(--color-primary-darker);
  }
  
  .bottom-nav-item.active .nav-item-icon svg {
    stroke: var(--color-primary-darker);
    stroke-width: 2.5px;
  }
  
  .nav-item-icon {
    width: var(--icon-md);
    height: var(--icon-md);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-item-label {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
  }
  
  .bottom-nav-item.active .nav-item-label {
    color: var(--color-primary-darker);
  }
  
  /* Safe area padding for iOS */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .bottom-nav-bar {
      padding-bottom: calc(var(--bottom-nav-padding) + env(safe-area-inset-bottom));
    }
  }
`;
document.head.appendChild(style);
