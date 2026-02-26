/** NEXUS Premium Site Scripts */

// Intersection Observer for Reveal Animations
const revealOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add a small delay for staggered effect if multiple items appear
      setTimeout(() => {
        entry.target.classList.add('in');
      }, 100);
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el);
});

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// CTA Tracking
const track = (eventName, payload = {}) => {
  console.log(`[NEXUS-TRACK] ${eventName}`, payload);
  // Future: Integrate with Google Analytics or custom backend
};

document.querySelectorAll('.track-cta').forEach(btn => {
  btn.addEventListener('click', () => {
    track('cta_click', { id: btn.dataset.cta || 'unknown' });
  });
});

// Header scroll effect
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.padding = '10px 0';
    header.style.background = 'rgba(8, 20, 17, 0.95)';
  } else {
    header.style.padding = '0';
    header.style.background = 'rgba(13, 31, 26, 0.8)';
  }
});
