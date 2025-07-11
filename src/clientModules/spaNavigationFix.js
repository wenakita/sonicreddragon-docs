/**
 * SPA Navigation Fix for Mermaid Diagrams
 * 
 * This module ensures mermaid diagrams render correctly during SPA navigation.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  // Track page transitions
  let currentPath = window.location.pathname;
  
  // Function to reinitialize mermaid on page change
  const reinitializeMermaid = () => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      
      console.log('Page changed, reinitializing mermaid...');
      
      // Wait for content to be updated
      setTimeout(() => {
        if (window.mermaid && typeof window.mermaid.init === 'function') {
          try {
            // Find unprocessed diagrams
            const diagrams = document.querySelectorAll('.mermaid:not([data-processed])');
            
            if (diagrams.length > 0) {
              console.log(`Rendering ${diagrams.length} diagrams after navigation`);
              window.mermaid.init(undefined, diagrams);
              
              // Add visibility class
              diagrams.forEach(diagram => {
                diagram.classList.add('mermaid-visible');
              });
            }
          } catch (error) {
            console.error('Error reinitializing mermaid after navigation:', error);
          }
        }
      }, 300);
    }
  };
  
  // Listen for Docusaurus route updates
  if (window.docusaurus) {
    const originalRouteDidUpdate = window.docusaurus.onRouteDidUpdate;
    
    window.docusaurus.onRouteDidUpdate = (params) => {
      // Call original handler if it exists
      if (typeof originalRouteDidUpdate === 'function') {
        originalRouteDidUpdate(params);
      }
      
      // Reinitialize mermaid
      reinitializeMermaid();
    };
  }
  
  // Fallback: check for route changes periodically
  setInterval(reinitializeMermaid, 1000);
  
  // Also listen for popstate events
  window.addEventListener('popstate', reinitializeMermaid);
}

export default {};
