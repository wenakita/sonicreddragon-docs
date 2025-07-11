/**
 * SPA Navigation Module
 * 
 * This module provides fixes and enhancements for Single Page Application (SPA) navigation
 * in Docusaurus, particularly for Mermaid diagrams and animations.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Default configuration
const defaultConfig = {
  enabled: true,
  smoothTransitions: true,
  preserveScroll: true,
  reinitMermaid: true,
  reinitAnimations: true,
  transitionDuration: 300,
};

/**
 * Initialize SPA navigation enhancements
 * @param {Object} userConfig - User configuration to override defaults
 */
function initializeSpaNavigation(userConfig = {}) {
  // Merge user config with defaults
  const config = { ...defaultConfig, ...userConfig };
  
  if (!config.enabled) return;
  
  console.log('Initializing SPA navigation enhancements...');
  
  // Add event listeners for route changes
  document.addEventListener('docusaurus.routeDidUpdate', (event) => {
    handleRouteChange(event, config);
  });
  
  // Add smooth transitions if enabled
  if (config.smoothTransitions) {
    addSmoothTransitions(config.transitionDuration);
  }
  
  // Add scroll preservation if enabled
  if (config.preserveScroll) {
    addScrollPreservation();
  }
}

/**
 * Handle route changes in the SPA
 * @param {Event} event - The route change event
 * @param {Object} config - Configuration options
 */
function handleRouteChange(event, config) {
  console.log('Route changed, applying SPA navigation enhancements...');
  
  // Wait for DOM to update
  setTimeout(() => {
    // Reinitialize Mermaid diagrams if enabled
    if (config.reinitMermaid) {
      reinitializeMermaidDiagrams();
    }
    
    // Reinitialize animations if enabled
    if (config.reinitAnimations) {
      reinitializeAnimations();
    }
    
    // Fix anchor links
    fixAnchorLinks();
    
    // Fix code highlighting
    fixCodeHighlighting();
  }, 200);
}

/**
 * Add smooth transitions between pages
 * @param {number} duration - Transition duration in milliseconds
 */
function addSmoothTransitions(duration) {
  // Add CSS for transitions
  const style = document.createElement('style');
  style.textContent = `
    .docusaurus-page-transition {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.5);
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity ${duration}ms ease;
    }
    
    .docusaurus-page-transition.active {
      opacity: 1;
    }
    
    [data-theme='dark'] .docusaurus-page-transition {
      background: rgba(0, 0, 0, 0.5);
    }
    
    /* Content transition */
    main {
      opacity: 1;
      transition: opacity ${duration}ms ease;
    }
    
    main.transitioning {
      opacity: 0;
    }
  `;
  
  document.head.appendChild(style);
  
  // Create transition overlay
  const overlay = document.createElement('div');
  overlay.className = 'docusaurus-page-transition';
  document.body.appendChild(overlay);
  
  // Add event listeners for navigation
  document.addEventListener('docusaurus.routeWillUpdate', () => {
    // Show transition overlay
    overlay.classList.add('active');
    
    // Fade out content
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('transitioning');
    }
  });
  
  document.addEventListener('docusaurus.routeDidUpdate', () => {
    // Wait for content to load
    setTimeout(() => {
      // Hide transition overlay
      overlay.classList.remove('active');
      
      // Fade in content
      const main = document.querySelector('main');
      if (main) {
        main.classList.remove('transitioning');
      }
    }, 100);
  });
}

/**
 * Add scroll position preservation
 */
function addScrollPreservation() {
  // Store scroll positions for each page
  const scrollPositions = new Map();
  
  // Store current scroll position before navigation
  document.addEventListener('docusaurus.routeWillUpdate', (event) => {
    const { location } = event;
    scrollPositions.set(location.pathname, window.scrollY);
  });
  
  // Restore scroll position after navigation
  document.addEventListener('docusaurus.routeDidUpdate', (event) => {
    const { previousLocation } = event;
    
    // Check if navigating back
    if (previousLocation && window.history.state?.back) {
      const savedPosition = scrollPositions.get(window.location.pathname);
      if (savedPosition !== undefined) {
        // Wait for content to render
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
        }, 100);
      }
    }
  });
}

/**
 * Reinitialize Mermaid diagrams after navigation
 */
function reinitializeMermaidDiagrams() {
  // Check if Mermaid is available
  if (typeof window.mermaid === 'undefined') {
    console.warn('Mermaid not found. Cannot reinitialize diagrams.');
    return;
  }
  
  console.log('Reinitializing Mermaid diagrams...');
  
  // Find unprocessed diagrams
  const diagrams = document.querySelectorAll('.mermaid:not([data-processed])');
  
  if (diagrams.length > 0) {
    console.log(`Found ${diagrams.length} unprocessed Mermaid diagrams. Rendering...`);
    
    try {
      window.mermaid.init(undefined, diagrams);
      console.log('Mermaid diagrams reinitialized successfully.');
    } catch (error) {
      console.error('Error reinitializing Mermaid diagrams:', error);
      
      // Try to render each diagram individually
      diagrams.forEach((diagram, index) => {
        try {
          window.mermaid.init(undefined, [diagram]);
        } catch (individualError) {
          console.warn(`Could not render diagram #${index + 1}:`, individualError);
        }
      });
    }
  } else {
    console.log('No unprocessed Mermaid diagrams found.');
  }
}

/**
 * Reinitialize animations after navigation
 */
function reinitializeAnimations() {
  // Trigger animation initialization events
  const event = new CustomEvent('docusaurus.animations.reinitialize');
  document.dispatchEvent(event);
  
  // Find animation containers
  const animationContainers = document.querySelectorAll('.docusaurus-mermaid-container');
  
  if (animationContainers.length > 0) {
    console.log(`Found ${animationContainers.length} animation containers. Reinitializing...`);
    
    // Reset animation classes
    animationContainers.forEach(container => {
      // Remove animation classes
      container.querySelectorAll('.mermaid-step').forEach(step => {
        step.classList.remove('revealed');
      });
      
      // Reset animation state
      setTimeout(() => {
        container.querySelectorAll('.mermaid-step').forEach((step, index) => {
          setTimeout(() => {
            step.classList.add('revealed');
          }, index * 100);
        });
      }, 500);
    });
  }
}

/**
 * Fix anchor links after navigation
 */
function fixAnchorLinks() {
  // Check if there's a hash in the URL
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const element = document.getElementById(hash);
    
    if (element) {
      // Wait for content to render
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
  
  // Fix all anchor links on the page
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
        
        // Update URL hash without scrolling
        window.history.pushState(null, null, href);
      }
    });
  });
}

/**
 * Fix code highlighting after navigation
 */
function fixCodeHighlighting() {
  // Check if Prism is available
  if (typeof window.Prism !== 'undefined') {
    // Find unprocessed code blocks
    const codeBlocks = document.querySelectorAll('pre code:not(.prism-highlighted)');
    
    if (codeBlocks.length > 0) {
      console.log(`Found ${codeBlocks.length} unprocessed code blocks. Highlighting...`);
      
      // Highlight code blocks
      window.Prism.highlightAllUnder(document);
      
      // Mark as highlighted
      codeBlocks.forEach(block => {
        block.classList.add('prism-highlighted');
      });
    }
  }
}

/**
 * Add CSS styles for SPA navigation
 */
function addSpaNavigationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Smooth transitions */
    .docusaurus-page-transition {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.5);
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 300ms ease;
    }
    
    .docusaurus-page-transition.active {
      opacity: 1;
    }
    
    [data-theme='dark'] .docusaurus-page-transition {
      background: rgba(0, 0, 0, 0.5);
    }
    
    /* Content transition */
    main {
      opacity: 1;
      transition: opacity 300ms ease;
    }
    
    main.transitioning {
      opacity: 0;
    }
    
    /* Anchor link highlight */
    :target {
      animation: highlight-target 2s ease;
    }
    
    @keyframes highlight-target {
      0% { background-color: rgba(59, 130, 246, 0.2); }
      100% { background-color: transparent; }
    }
  `;
  
  document.head.appendChild(style);
}

// Main export function
export default function(userConfig = {}) {
  // Only execute in browser environment
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }
  
  // Add styles when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSpaNavigationStyles);
  } else {
    addSpaNavigationStyles();
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeSpaNavigation(userConfig));
  } else {
    initializeSpaNavigation(userConfig);
  }
  
  // Export utility functions
  return {
    reinitializeMermaidDiagrams,
    reinitializeAnimations,
    fixAnchorLinks,
    fixCodeHighlighting,
  };
}
