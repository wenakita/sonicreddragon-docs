/**
 * Mermaid client module for Docusaurus
 * Adds animation controls to Mermaid diagrams
 */

import { loadAnime, isBrowser } from '../js/animeInitializer';

export default {
  onRouteUpdate() {
    if (!isBrowser()) return;
    
    // Wait for page to fully render
    setTimeout(async () => {
      const diagrams = document.querySelectorAll('.docusaurus-mermaid-container');
      if (diagrams.length === 0) return;
      
      try {
        // Load anime.js
        await loadAnime();
        
        // Dynamically import the mermaid initialization module
        const { default: initMermaidWithControls } = await import('../js/mermaidInit');
        
        // Initialize animation controls
        initMermaidWithControls();
      } catch (error) {
        console.error('Failed to initialize Mermaid animation controls:', error);
      }
    }, 1500);
  }
}; 