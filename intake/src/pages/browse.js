// Browse Page
export function renderBrowsePage(user) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="container" style="padding-top: var(--space-6); padding-bottom: var(--space-6);">
      <h1>Browse Methods</h1>
      <p class="text-secondary mb-6">Explore different birth control methods and brands</p>
      
      <div class="methods-grid">
        ${renderMethodCard('pills', '💊', 'Birth Control Pills', 'Oral contraceptives taken daily', '2,400+ posts')}
        ${renderMethodCard('iud', '🔧', 'IUD', 'Long-term intrauterine device', '1,800+ posts')}
        ${renderMethodCard('implant', '💉', 'Implant', 'Arm implant lasting 3-5 years', '890+ posts')}
        ${renderMethodCard('patch', '🩹', 'Patch', 'Weekly contraceptive patch', '450+ posts')}
        ${renderMethodCard('ring', '⭕', 'Vaginal Ring', 'Monthly contraceptive ring', '320+ posts')}
      </div>
    </div>
  `;
}

function renderMethodCard(id, icon, name, description, stats) {
  return `
    <div class="card method-card" onclick="window.location.hash='method?id=${id}'">
      <div class="method-icon">${icon}</div>
      <div class="method-info">
        <h3 class="method-name">${name}</h3>
        <p class="method-description">${description}</p>
        <div class="method-stats">
          <span class="badge badge-info">${stats}</span>
        </div>
      </div>
      <div class="method-arrow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>
  `;
}

// Add page-specific styles
const style = document.createElement('style');
style.textContent = `
  .methods-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .method-card {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    cursor: pointer;
    padding: var(--space-5);
  }
  
  .method-icon {
    font-size: 48px;
    flex-shrink: 0;
  }
  
  .method-info {
    flex: 1;
  }
  
  .method-name {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-2);
  }
  
  .method-description {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-3);
  }
  
  .method-stats {
    display: flex;
    gap: var(--space-2);
  }
  
  .method-arrow {
    color: var(--color-text-muted);
    flex-shrink: 0;
  }
  
  .method-card:hover .method-arrow {
    color: var(--color-primary-darker);
    transform: translateX(4px);
    transition: all 0.2s ease;
  }
`;
document.head.appendChild(style);
