// Enhanced mermaid initialization
import mermaid from 'mermaid';

// This runs on client-side browser only
export default {
  onRouteUpdate() {
    if (typeof window === 'undefined') return;
    
    console.log('Initializing mermaid from client module');
    
    try {
      // Get current theme
      const isDarkTheme = document.documentElement.dataset.theme === 'dark';
      
      // Initialize mermaid with detailed configuration
      mermaid.initialize({
        startOnLoad: true,
        theme: isDarkTheme ? 'dark' : 'default',
        securityLevel: 'loose', // Needed for some diagram features
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: 16,
        flowchart: {
          curve: 'basis',
          htmlLabels: true,
        },
        sequence: {
          diagramMarginX: 50,
          diagramMarginY: 10,
          actorMargin: 50,
          width: 150,
          height: 65,
        },
      });
      
      // Store an initialized flag
      window.mermaidInitialized = true;
      
      // Process all diagrams
      const renderAllDiagrams = () => {
        const diagrams = document.querySelectorAll('.mermaid:not([data-processed="true"])');
        if (diagrams.length > 0) {
          console.log(`Found ${diagrams.length} unprocessed diagrams, rendering...`);
          mermaid.init(undefined, diagrams);
        }
      };
      
      // Render with a slight delay to ensure the DOM is fully ready
      setTimeout(renderAllDiagrams, 300);
      
      // Also re-render on theme change
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            // Theme changed, reinitialize with new theme
            const newIsDarkTheme = document.documentElement.dataset.theme === 'dark';
            mermaid.initialize({
              ...mermaid.mermaidAPI.getConfig(),
              theme: newIsDarkTheme ? 'dark' : 'default'
            });
            
            // Re-render diagrams with new theme
            renderAllDiagrams();
          }
        });
      });
      
      // Start observing theme changes
      observer.observe(document.documentElement, { attributes: true });
      
    } catch (error) {
      console.error('Mermaid initialization error:', error);
    }
  }
}; 