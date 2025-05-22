import React, { useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

// This Root component wraps the entire Docusaurus application
export default function Root({ children }) {
  const isBrowser = useIsBrowser();
  
  useEffect(() => {
    if (isBrowser) {
      // Mermaid theme observer - handles theme changes for mermaid diagrams
      const themeObserver = new MutationObserver((mutations) => {
        // When theme changes, find all mermaid diagrams and reinitialize them
        const mermaidDiagrams = document.querySelectorAll('.mermaid');
        if (mermaidDiagrams.length > 0 && window.mermaid) {
          try {
            // Get the current theme
            const isDarkTheme = document.documentElement.dataset.theme === 'dark';
            
            // Apply current theme
            window.mermaid.initialize({
              theme: isDarkTheme ? 'dark' : 'default',
              themeVariables: { 
                darkMode: isDarkTheme 
              }
            });
            
            // Reinitialize diagrams
            window.mermaid.init(undefined, mermaidDiagrams);
          } catch (error) {
            console.error('Error reinitializing mermaid diagrams:', error);
          }
        }
      });
      
      // Observe theme changes by watching data-theme attribute
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      
      // Cleanup
      return () => {
        themeObserver.disconnect();
      };
    }
  }, [isBrowser]);

  return <>{children}</>;
} 