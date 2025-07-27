// Simple scroll animations using Intersection Observer
export function initScrollAnimations() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-animate-in');
      }
    });
  }, observerOptions);

  // Observe all elements with scroll-animate classes
  const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-right');
  animatedElements.forEach(el => observer.observe(el));

  return observer;
}

// Initialize animations when DOM is loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
} 