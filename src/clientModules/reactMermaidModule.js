/**
 * React Mermaid Module
 *
 * This module adds global styles for Mermaid diagrams.
 * The actual rendering is handled by the UnifiedMermaid component via MDXComponents.js.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  // Function to add global styles for better mermaid diagrams
  function addGlobalStyles() {
    // Check if style already exists
    const existingStyle = document.getElementById('mermaid-enhanced-styling');
    if (existingStyle) {
      return; // Style already exists, no need to add it again
    }
    
    // Create style element
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced Mermaid Styling */
      .docusaurus-mermaid-container {
        margin: 2rem 0;
      }

      /* Unified Mermaid wrapper */
      .unified-mermaid-wrapper {
        margin: 2rem 0;
      }
      
      /* Reduced motion styles */
      @media (prefers-reduced-motion: reduce) {
        .docusaurus-mermaid-container svg * {
          transition: none !important;
          animation: none !important;
        }
      }
    `;
    
    style.id = 'mermaid-enhanced-styling';
    document.head.appendChild(style);
  }

  // Cleanup function to remove the style element
  function removeGlobalStyles() {
    const existingStyle = document.getElementById('mermaid-enhanced-styling');
    if (existingStyle) {
      existingStyle.remove();
    }
  }

  // Initialize when DOM is loaded
  let domContentLoadedListener;
  
  if (document.readyState === 'loading') {
    domContentLoadedListener = () => {
      addGlobalStyles();
      document.removeEventListener('DOMContentLoaded', domContentLoadedListener);
    };
    document.addEventListener('DOMContentLoaded', domContentLoadedListener);
  } else {
    addGlobalStyles();
  }
  
  // Clean up when the module is unloaded (e.g., hot reload during development)
  if (module.hot) {
    module.hot.dispose(() => {
      if (domContentLoadedListener) {
        document.removeEventListener('DOMContentLoaded', domContentLoadedListener);
      }
      removeGlobalStyles();
    });
  }
}

// Export a function to be called on route updates
export function onRouteDidUpdate({ location, previousLocation }) {
  // No need to do anything here since MDXComponents.js handles the rendering
}
