/**
 * Consolidated Anime.js Module
 * Single client module to handle all anime.js interactions
 */
import { isBrowser, initializeMermaidAnimations } from '../utils/animeUtils';

/**
 * Initialize animations on route change
 */
function initializeAnimations() {
  if (!isBrowser()) return;
  
  // Allow time for DOM to settle
  setTimeout(() => {
    initializeMermaidAnimations();
    setupScrollBasedMermaidAnimations();
  }, 1000);
}

/**
 * Set up scroll-based mermaid animations
 */
function setupScrollBasedMermaidAnimations() {
  if (!isBrowser() || typeof IntersectionObserver === 'undefined') return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        if (!container.dataset.animated && container.querySelector('svg')) {
          setTimeout(() => {
            initializeMermaidAnimations();
          }, 500);
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observe all mermaid containers
  const containers = document.querySelectorAll('.mermaid-container, .docusaurus-mermaid-container');
  containers.forEach(container => observer.observe(container));
}

/**
 * Set up mutation observer to catch dynamically added content
 */
function setupMutationObserver() {
  if (!isBrowser() || typeof MutationObserver === 'undefined') return;
  
  const observer = new MutationObserver((mutations) => {
    const shouldInitialize = mutations.some(mutation => 
      mutation.type === 'childList' && mutation.addedNodes.length > 0
    );
    
    if (shouldInitialize) {
      setTimeout(initializeMermaidAnimations, 500);
    }
  });
  
  // Observe the entire document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// Export the required Docusaurus client module methods
export default {
  onRouteUpdate() {
    initializeAnimations();
    
    // Add the animation initializer to window load event (only once)
    if (isBrowser() && !window._animeLoadListenerAdded) {
      window._animeLoadListenerAdded = true;
      window.addEventListener('load', initializeAnimations);
    }
  },
  
  onRouteDidUpdate() {
    initializeAnimations();
  }
}; 