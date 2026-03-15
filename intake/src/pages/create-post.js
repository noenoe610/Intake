// Create Post Page
import { getMethods, getBrands, createPost, isVerifiedForBrand } from '../js/db.js';
import { getCurrentUser } from '../js/auth.js';
import { showToast } from '../js/utils.js';
import { showVerificationModal } from '../components/verification-modal.js';

export async function renderCreatePostPage(user) {
  const app = document.getElementById('app');
  
  if (!user) {
    window.location.hash = 'login';
    return;
  }
  
  // Load methods
  const { data: methods } = await getMethods();
  
  app.innerHTML = `
    <div class="container" style="padding-top: var(--space-6); padding-bottom: var(--space-6);">
      <h1>Share Your Experience</h1>
      <p class="text-secondary mb-6">Help others by sharing your tips, experiences, or side effects</p>
      
      <form id="create-post-form" class="create-post-form">
        <!-- Category -->
        <div class="input-group">
          <label class="input-label" for="category">What would you like to share?</label>
          <select id="category" class="input-field" required>
            <option value="">Select a category</option>
            <option value="tips">Tips & Tricks</option>
            <option value="side-effects">Side Effects</option>
            <option value="discussion">General Discussion</option>
          </select>
        </div>
        
        <!-- Method -->
        <div class="input-group">
          <label class="input-label" for="method">Method Type</label>
          <select id="method" class="input-field" required>
            <option value="">Select a method</option>
            ${methods.map(m => `<option value="${m.id}">${m.icon} ${m.name}</option>`).join('')}
          </select>
        </div>
        
        <!-- Brand (populated based on method) -->
        <div class="input-group" id="brand-group" style="display: none;">
          <label class="input-label" for="brand">Specific Brand (Optional)</label>
          <select id="brand" class="input-field">
            <option value="">Select a brand</option>
          </select>
          <p class="text-muted" style="font-size: var(--font-size-sm); margin-top: var(--space-2);">
            Select a specific brand to get verified and add credibility to your post
          </p>
        </div>
        
        <!-- Verification status -->
        <div id="verification-status" class="alert alert-info" style="display: none;">
          <p id="verification-message"></p>
        </div>
        
        <!-- Title -->
        <div class="input-group">
          <label class="input-label" for="title">Title</label>
          <input 
            type="text" 
            id="title" 
            class="input-field" 
            placeholder="e.g., 'Don't take with grapefruit juice!'"
            required
            maxlength="200"
          />
          <p class="text-muted" style="font-size: var(--font-size-sm); margin-top: var(--space-2);">
            Keep it clear and descriptive
          </p>
        </div>
        
        <!-- Content -->
        <div class="input-group">
          <label class="input-label" for="content">Your Experience</label>
          <textarea 
            id="content" 
            class="input-field textarea-field" 
            placeholder="Share your experience in detail. What did you learn? What worked for you?"
            required
            rows="8"
          ></textarea>
          <p class="text-muted" style="font-size: var(--font-size-sm); margin-top: var(--space-2);">
            Be specific and helpful. Your experience could help someone else!
          </p>
        </div>
        
        <!-- Submit -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="window.history.back()">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary btn-large">
            Share Experience
          </button>
        </div>
      </form>
    </div>
  `;
  
  setupFormHandlers(user);
}

function setupFormHandlers(user) {
  const form = document.getElementById('create-post-form');
  const methodSelect = document.getElementById('method');
  const brandSelect = document.getElementById('brand');
  const brandGroup = document.getElementById('brand-group');
  const verificationStatus = document.getElementById('verification-status');
  const verificationMessage = document.getElementById('verification-message');
  
  let selectedBrand = null;
  let isVerified = false;
  
  // Method change handler
  methodSelect.addEventListener('change', async (e) => {
    const methodId = e.target.value;
    
    if (!methodId) {
      brandGroup.style.display = 'none';
      verificationStatus.style.display = 'none';
      return;
    }
    
    // Load brands for this method
    const { data: brands } = await getBrands(methodId);
    
    if (brands && brands.length > 0) {
      brandSelect.innerHTML = '<option value="">Select a brand (optional)</option>' +
        brands.map(b => `<option value="${b.id}">${b.name} (${b.manufacturer})</option>`).join('');
      brandGroup.style.display = 'block';
    } else {
      brandGroup.style.display = 'none';
    }
    
    verificationStatus.style.display = 'none';
  });
  
  // Brand change handler
  brandSelect.addEventListener('change', async (e) => {
    const brandId = e.target.value;
    selectedBrand = brandId;
    
    if (!brandId) {
      verificationStatus.style.display = 'none';
      isVerified = false;
      return;
    }
    
    // Check if user is verified for this brand
    const { isVerified: verified } = await isVerifiedForBrand(user.id, brandId);
    isVerified = verified;
    
    if (verified) {
      verificationMessage.innerHTML = `
        <span class="badge badge-verified">✓ Verified</span>
        You are verified for this brand! Your post will show the verified badge.
      `;
      verificationStatus.className = 'alert alert-success';
      verificationStatus.style.display = 'block';
    } else {
      verificationMessage.innerHTML = `
        You're not verified for this brand yet. 
        <button type="button" class="btn btn-small btn-primary" id="get-verified-btn">
          Get Verified Now
        </button>
      `;
      verificationStatus.className = 'alert alert-info';
      verificationStatus.style.display = 'block';
      
      // Add verification button handler
      document.getElementById('get-verified-btn').addEventListener('click', () => {
        showVerificationModal(brandId, async () => {
          // Refresh verification status after successful verification
          const { isVerified: newVerified } = await isVerifiedForBrand(user.id, brandId);
          isVerified = newVerified;
          
          if (newVerified) {
            verificationMessage.innerHTML = `
              <span class="badge badge-verified">✓ Verified</span>
              You are now verified! Your post will show the verified badge.
            `;
            verificationStatus.className = 'alert alert-success';
          }
        });
      });
    }
  });
  
  // Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const category = document.getElementById('category').value;
    const methodId = document.getElementById('method').value;
    const brandId = selectedBrand || null;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    
    if (!category || !methodId || !title || !content) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
    
    // Create post
    const postData = {
      user_id: user.id,
      method_id: methodId,
      brand_id: brandId,
      category: category,
      title: title,
      content: content
    };
    
    const { data, error } = await createPost(postData);
    
    if (error) {
      showToast('Error creating post. Please try again.', 'error');
      console.error(error);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Share Experience';
    } else {
      showToast('Post created successfully!', 'success');
      setTimeout(() => {
        window.location.hash = `method?id=${methodId}`;
      }, 1000);
    }
  });
}

// Add page-specific styles
const style = document.createElement('style');
style.textContent = `
  .create-post-form {
    max-width: 700px;
  }
  
  .form-actions {
    display: flex;
    gap: var(--space-3);
    margin-top: var(--space-6);
  }
  
  .form-actions .btn {
    flex: 1;
  }
  
  select.input-field {
    cursor: pointer;
  }
`;
document.head.appendChild(style);
