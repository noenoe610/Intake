// Home Page
import { getPosts } from '../js/db.js';
import { formatRelativeTime } from '../js/utils.js';

export async function renderHomePage(user) {
  const app = document.getElementById('app');
  
  // Show loading state
  app.innerHTML = `
    <div class="container">
      <div style="text-align: center; padding: 40px 20px;">
        <div class="spinner" style="margin: 0 auto;"></div>
      </div>
    </div>
  `;
  
  // Fetch recent posts
  const { data: posts, error } = await getPosts({ limit: 10 });
  
  if (error) {
    console.error('Error loading posts:', error);
    app.innerHTML = `
      <div class="container">
        <div class="alert alert-info">
          Welcome! No posts yet. Be the first to share your experience!
        </div>
        ${renderHeroAndCategories(user)}
      </div>
    `;
    return;
  }
  
  const postsHTML = posts && posts.length > 0 
    ? posts.map(post => renderPostCard(post)).join('')
    : '<p class="text-muted">No posts yet. Be the first to share!</p>';
  
  app.innerHTML = `
    <div class="container" style="padding-top: var(--space-6); padding-bottom: var(--space-6);">
      ${renderHeroAndCategories(user)}
      
      <!-- Recent Posts -->
      <div class="section">
        <div class="section-header">
          <h2>Recent Posts</h2>
          <a href="#browse" class="text-link">See all</a>
        </div>
        <div class="posts-list">
          ${postsHTML}
        </div>
      </div>
      
      <!-- Call to Action -->
      ${!user ? renderCTA() : ''}
    </div>
  `;
}

function renderHeroAndCategories(user) {
  return `
    <!-- Hero Section -->
    <div class="hero-section">
      <h1>Welcome to Intake</h1>
      <p class="hero-subtitle">
        Real experiences with birth control and medications, beyond the official description
      </p>
    </div>
    
    <!-- Quick Access Categories -->
    <div class="category-grid">
      ${renderCategories()}
    </div>
  `;
}

function renderCategories() {
  const categories = [
    { id: 'pills', name: 'Pills', icon: '💊', count: 'Share experiences' },
    { id: 'iud', name: 'IUD', icon: '🔧', count: 'Share experiences' },
    { id: 'implant', name: 'Implant', icon: '💉', count: 'Share experiences' },
    { id: 'patch', name: 'Patch', icon: '🩹', count: 'Share experiences' },
    { id: 'ring', name: 'Ring', icon: '⭕', count: 'Share experiences' }
  ];
  
  return categories.map(cat => `
    <button class="category-card" onclick="window.location.hash='browse?method=${cat.id}'">
      <div class="category-icon">${cat.icon}</div>
      <div class="category-name">${cat.name}</div>
      <div class="category-count">${cat.count}</div>
    </button>
  `).join('');
}

function renderPostCard(post) {
  // Handle both mock data and real Supabase data
  const username = post.username || 'Anonymous';
  const upvoteCount = post.upvote_count || post.upvotes || 0;
  const commentCount = post.comment_count || post.comments || 0;
  const verified = post.user_verified !== undefined ? post.user_verified : post.verified || false;
  const methodId = post.method_id || post.method || '';
  
  return `
    <div class="card post-card" onclick="window.location.hash='discussion?id=${post.id}'">
      <div class="card-header">
        <div class="post-meta">
          <span class="badge badge-info">${methodId}</span>
          ${verified ? '<span class="badge badge-verified">✓ Verified User</span>' : ''}
        </div>
      </div>
      <div class="card-body">
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
      </div>
      <div class="card-footer">
        <div class="post-author">
          <span class="author-name">${username}</span>
          <span class="post-time">${formatRelativeTime(post.created_at)}</span>
        </div>
        <div class="post-stats">
          <span class="stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 10v12"></path>
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
            </svg>
            ${upvoteCount}
          </span>
          <span class="stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            ${commentCount}
          </span>
        </div>
      </div>
    </div>
  `;
}

function renderCTA() {
  return `
    <div class="cta-section">
      <div class="card" style="text-align: center; background: var(--color-primary-pale);">
        <h3>Join Intake</h3>
        <p class="text-secondary">Share your experiences and help others navigate their medication journey</p>
        <button class="btn btn-primary btn-large" onclick="window.location.hash='login'">
          Get Started
        </button>
      </div>
    </div>
  `;
}

// Add page-specific styles
const style = document.createElement('style');
style.textContent = `
  .hero-section {
    text-align: center;
    margin-bottom: var(--space-8);
    padding: var(--space-6) 0;
  }
  
  .hero-subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }
  
  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }
  
  .category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-5);
    background: var(--color-bg-white);
    border: var(--border-width) solid var(--color-primary-light);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .category-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }
  
  .category-icon {
    font-size: 48px;
    margin-bottom: var(--space-3);
  }
  
  .category-name {
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-1);
  }
  
  .category-count {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
  
  .section {
    margin-bottom: var(--space-8);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }
  
  .text-link {
    color: var(--color-primary-darker);
    font-weight: var(--font-weight-semibold);
    font-size: var(--font-size-sm);
  }
  
  .posts-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .post-card {
    cursor: pointer;
  }
  
  .post-meta {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }
  
  .post-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-2);
    color: var(--color-text-primary);
  }
  
  .post-excerpt {
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    line-height: 1.6;
  }
  
  .post-author {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }
  
  .author-name {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }
  
  .post-time {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
  
  .post-stats {
    display: flex;
    gap: var(--space-4);
  }
  
  .stat {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }
  
  .cta-section {
    margin-top: var(--space-12);
  }
`;
document.head.appendChild(style);
