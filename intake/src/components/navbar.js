// Top Navigation Bar Component
export function renderTopNav(currentPage = 'home') {
  const nav = document.getElementById('top-nav');
  
  nav.innerHTML = `
    <div class="top-nav-bar">
      <button class="nav-menu-btn" id="menu-btn" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      <div class="nav-logo">
        <span class="logo-text">Intake</span>
      </div>
      
      <button class="nav-search-btn" id="search-btn" aria-label="Search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('menu-btn').addEventListener('click', toggleMenu);
  document.getElementById('search-btn').addEventListener('click', openSearch);
}

function toggleMenu() {
  // TODO: Implement menu sidebar
  console.log('Menu clicked');
}

function openSearch() {
  // TODO: Implement search modal
  console.log('Search clicked');
}

// Add styles for top nav
const style = document.createElement('style');
style.textContent = `
  #top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-top-nav);
  }
  
  .top-nav-bar {
    height: var(--top-bar-height);
    background-color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-4);
    border-bottom: var(--border-width) solid var(--color-primary-dark);
  }
  
  .nav-menu-btn,
  .nav-search-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-white);
    border-radius: var(--radius-sm);
    transition: background-color 0.2s ease;
  }
  
  .nav-menu-btn:hover,
  .nav-search-btn:hover {
    background-color: var(--color-primary-dark);
  }
  
  .nav-menu-btn:active,
  .nav-search-btn:active {
    background-color: var(--color-primary-darker);
  }
  
  .nav-logo {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logo-text {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-white);
  }
`;
document.head.appendChild(style);
