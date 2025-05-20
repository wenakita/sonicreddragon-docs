// Simple mermaid initialization
import mermaid from 'mermaid';

// This runs on client-side browser only
export default {
  onRouteUpdate() {
    if (typeof window !== 'undefined') {
      console.log('Initializing mermaid from client module');
      
      try {
        // Initialize mermaid with simple config
        mermaid.initialize({
          startOnLoad: true,
          theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default',
        });
        
        // Force render all mermaid diagrams
        setTimeout(() => {
          const diagrams = document.querySelectorAll('.mermaid:not([data-processed])');
          if (diagrams.length > 0) {
            console.log(`Found ${diagrams.length} unprocessed diagrams`);
            mermaid.init(undefined, diagrams);
          }
        }, 500);
      } catch (error) {
        console.error('Mermaid initialization error:', error);
      }
    }
  }
}; 