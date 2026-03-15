// Verification Modal Component
import { getBrand, verifyUserMethod, isVerifiedForBrand } from '../js/db.js';
import { getCurrentUser } from '../js/auth.js';
import { showToast } from '../js/utils.js';

export async function showVerificationModal(brandId, onSuccess) {
  const user = getCurrentUser();
  
  if (!user) {
    showToast('Please login to get verified', 'error');
    window.location.hash = 'login';
    return;
  }
  
  // Check if already verified
  const { isVerified } = await isVerifiedForBrand(user.id, brandId);
  if (isVerified) {
    showToast('You are already verified for this method!', 'info');
    if (onSuccess) onSuccess();
    return;
  }
  
  // Get brand data with questions
  const { data: brand, error } = await getBrand(brandId);
  
  if (error || !brand) {
    showToast('Could not load verification questions', 'error');
    return;
  }
  
  // Render modal
  renderModal(brand, user, onSuccess);
}

function renderModal(brand, user, onSuccess) {
  const container = document.getElementById('modal-container');
  
  const questions = brand.verification_questions;
  let currentQuestionIndex = 0;
  let answers = [];
  
  const modalHTML = `
    <div class="modal-overlay" id="verification-overlay">
      <div class="modal verification-modal">
        <div class="modal-header">
          <h2 class="modal-title">Verify You Use ${brand.name}</h2>
          <button class="modal-close" id="close-verification">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="text-secondary mb-6">
            Answer these questions to get verified and unlock the ability to post about ${brand.name}.
            This helps ensure our community shares authentic experiences.
          </p>
          
          <div id="verification-content">
            <!-- Question will be rendered here -->
          </div>
          
          <div class="verification-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
            </div>
            <p class="progress-text" id="progress-text">Question 1 of ${questions.length}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = modalHTML;
  
  // Event listeners
  document.getElementById('close-verification').addEventListener('click', closeModal);
  document.getElementById('verification-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'verification-overlay') closeModal();
  });
  
  // Render first question
  renderQuestion(currentQuestionIndex);
  
  // Functions
  function renderQuestion(index) {
    const question = questions[index];
    const content = document.getElementById('verification-content');
    
    content.innerHTML = `
      <div class="verification-question">
        <h3 class="question-title">${question.question}</h3>
        <div class="question-options">
          ${question.options.map((option, i) => `
            <button class="option-btn" data-option="${option}">
              ${option}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    
    // Add click handlers to options
    content.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        handleAnswer(e.target.dataset.option, question.correct);
      });
    });
    
    // Update progress
    const progress = ((index) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = 
      `Question ${index + 1} of ${questions.length}`;
  }
  
  function handleAnswer(selected, correct) {
    answers.push(selected);
    
    if (selected !== correct) {
      // Wrong answer
      showToast('Incorrect answer. Please try again.', 'error');
      answers = [];
      currentQuestionIndex = 0;
      renderQuestion(0);
      return;
    }
    
    // Correct answer
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
      // More questions
      renderQuestion(currentQuestionIndex);
    } else {
      // All questions answered correctly!
      completeVerification();
    }
  }
  
  async function completeVerification() {
    const content = document.getElementById('verification-content');
    content.innerHTML = `
      <div class="verification-success">
        <div class="success-icon">✓</div>
        <h3>Verification Successful!</h3>
        <p class="text-secondary">
          You're now verified for ${brand.name}. You can share your experiences and tips!
        </p>
      </div>
    `;
    
    // Update progress to 100%
    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('progress-text').textContent = 'Verified!';
    
    // Save verification to database
    const { error } = await verifyUserMethod(user.id, brand.id, brand.method_id);
    
    if (error) {
      showToast('Error saving verification', 'error');
      console.error(error);
    } else {
      showToast('You are now verified!', 'success');
    }
    
    // Close modal after 2 seconds
    setTimeout(() => {
      closeModal();
      if (onSuccess) onSuccess();
    }, 2000);
  }
  
  function closeModal() {
    container.innerHTML = '';
  }
}

// Add modal-specific styles
const style = document.createElement('style');
style.textContent = `
  .verification-modal {
    max-width: 600px;
  }
  
  .verification-question {
    margin-bottom: var(--space-6);
  }
  
  .question-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-5);
    color: var(--color-text-primary);
  }
  
  .question-options {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .option-btn {
    width: 100%;
    padding: var(--space-4);
    text-align: left;
    background: var(--color-bg-white);
    border: var(--border-width) solid var(--color-border-light);
    border-radius: var(--radius-lg);
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .option-btn:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-pale);
    transform: translateX(4px);
  }
  
  .verification-progress {
    margin-top: var(--space-8);
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--color-primary-pale);
    border-radius: var(--radius-pill);
    overflow: hidden;
    margin-bottom: var(--space-2);
  }
  
  .progress-fill {
    height: 100%;
    background: var(--color-primary);
    transition: width 0.3s ease;
  }
  
  .progress-text {
    text-align: center;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-semibold);
  }
  
  .verification-success {
    text-align: center;
    padding: var(--space-8) 0;
  }
  
  .success-icon {
    width: 80px;
    height: 80px;
    background: var(--color-primary);
    color: var(--color-text-white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    margin: 0 auto var(--space-4);
    animation: scaleIn 0.4s ease;
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .verification-success h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-3);
  }
`;
document.head.appendChild(style);
