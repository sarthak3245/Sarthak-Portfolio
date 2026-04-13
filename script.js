/* ============================================================
   script.js – Personal Portfolio
   ============================================================
   Features:
     1. Sticky navbar on scroll
     2. Mobile hamburger menu toggle
     3. Smooth scrolling for anchor links
     4. Scroll-reveal animations (IntersectionObserver)
     5. Contact form validation & submission
     6. Footer year auto-update
============================================================ */


/* ============================================================
   1. STICKY NAVBAR ON SCROLL
   Adds a "scrolled" class to the nav once the user scrolls
   past 60px, triggering the frosted-glass background in CSS.
============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


/* ============================================================
   2. MOBILE HAMBURGER MENU
   Toggles the nav link list open/closed on small screens.
============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu automatically when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ============================================================
   3. SMOOTH SCROLLING
   Intercepts clicks on any in-page "#" links and smoothly
   scrolls to the target section instead of jumping.
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ============================================================
   4. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
   Every element with class "reveal" starts hidden via CSS.
   When it enters the viewport, we add "visible" so the CSS
   transition plays and fades it in from below.
============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop watching once revealed — no need to re-animate
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,  // Trigger when 12% of the element is visible
    rootMargin: '0px 0px -60px 0px'  // Slight offset from the bottom
  }
);

// Observe every element with the "reveal" class
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


/* ============================================================
   5. CONTACT FORM VALIDATION & SUBMISSION
   Validates Name, Email, and Message fields.
   Shows inline error messages without page reload.
   On success, hides the form and shows a success message.
============================================================ */
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const submitBtn    = document.getElementById('submitBtn');

// Helper: show an error for a field
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.add('invalid');
  error.textContent = message;
}

// Helper: clear an error for a field
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  input.classList.remove('invalid');
  error.textContent = '';
}

// Validate all fields and return true if the form is valid
function validateForm() {
  let isValid = true;

  // --- Name ---
  const name = document.getElementById('name').value.trim();
  if (name.length < 2) {
    showError('name', 'nameError', 'Name must be at least 2 characters.');
    isValid = false;
  } else {
    clearError('name', 'nameError');
  }

  // --- Email ---
  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('email', 'emailError', 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError('email', 'emailError');
  }

  // --- Message ---
  const message = document.getElementById('message').value.trim();
  if (message.length < 10) {
    showError('message', 'messageError', 'Message must be at least 10 characters.');
    isValid = false;
  } else {
    clearError('message', 'messageError');
  }

  return isValid;
}

// Clear errors as user types (live feedback)
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    clearError(id, `${id}Error`);
  });
});

// Handle form submission
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Run validation
    if (!validateForm()) return;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

    // Simulate a 1.5s API call (replace with your real form endpoint if needed)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success state
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';

    // Reset button (useful if user navigates back)
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
  });
}


/* ============================================================
   6. FOOTER YEAR AUTO-UPDATE
   Keeps the copyright year current automatically.
============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
