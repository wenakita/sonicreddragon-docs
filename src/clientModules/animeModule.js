/**
 * Consolidated Anime.js Module
 * Single client module to handle all anime.js interactions
 */
import { isBrowser, initializeMermaidAnimations } from '../utils/animeUtils';

// Debounce function to prevent excessive calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Initialize animations on route change
 */
function initializeAnimations() {
  if (!isBrowser()) return;
  
  // Allow time for DOM to settle and mermaid to render
  setTimeout(() => {
    initializeMermaidAnimations();
    setupScrollBasedMermaidAnimations();
  }, 1500); // Increased delay to avoid conflicts
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
          // Debounced animation to prevent conflicts
          setTimeout(() => {
            initializeMermaidAnimations();
          }, 800); // Increased delay
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
  
  // Debounced version to prevent excessive calls
  const debouncedInitialize = debounce(initializeMermaidAnimations, 300);
  
  const observer = new MutationObserver((mutations) => {
    let shouldInitialize = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Only trigger for mermaid-related elements
            if (node.matches && (
              node.matches('.mermaid, .docusaurus-mermaid-container, .mermaid-container') ||
              node.querySelector('.mermaid, .docusaurus-mermaid-container, .mermaid-container')
            )) {
              shouldInitialize = true;
            }
          }
        });
      }
    });
    
    if (shouldInitialize) {
      debouncedInitialize();
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
      setupMutationObserver();
    }
  },
  
  onRouteDidUpdate() {
    // Use debounced version for route updates
    const debouncedInitialize = debounce(initializeAnimations, 200);
    debouncedInitialize();
  }
}; 