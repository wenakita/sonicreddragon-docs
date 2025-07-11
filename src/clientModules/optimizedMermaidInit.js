/**
 * Optimized Mermaid Initialization Module
 * 
 * This module provides a robust initialization for Mermaid diagrams
 * in Docusaurus, with proper error handling, dark mode support,
 * and SPA navigation handling.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMermaid);
  } else {
    initializeMermaid();
  }
  
  // Re-initialize on route change for SPA navigation
  document.addEventListener('docusaurus.routeDidUpdate', () => {
    // Wait for DOM to update
    setTimeout(initializeMermaid, 200);
  });
}

function initializeMermaid() {
  // Create a more robust initialization that retries multiple times
  let attempts = 0;
  const maxAttempts = 10;
  const attemptInterval = 300;

  function attemptInitialization() {
    attempts++;
    console.log(`Attempting to initialize Mermaid (attempt ${attempts}/${maxAttempts})...`);
    
    try {
      // Check if mermaid is available
      if (typeof window.mermaid !== 'undefined') {
        console.log('Mermaid library found. Initializing...');
        
        // Configure mermaid with production-optimized settings
        window.mermaid.initialize({
          startOnLoad: true,
          theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'neutral',
          securityLevel: 'loose',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 14,
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            useMaxWidth: true,
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
            bottomMarginAdj: 1,
            useMaxWidth: true,
          },
          // Disable logs in production
          logLevel: 'error',
        });

        // Force re-render all diagrams
        const diagrams = document.querySelectorAll('.mermaid:not([data-processed])');
        if (diagrams.length > 0) {
          console.log(`Rendering ${diagrams.length} Mermaid diagrams...`);
          
          try {
            window.mermaid.init(undefined, diagrams);
            
            // Add visibility class after processing
            diagrams.forEach(diagram => {
              diagram.classList.add('mermaid-visible');
            });
            
            // Add a global flag to indicate Mermaid has been initialized
            window.mermaidInitialized = true;
            
            console.log('Mermaid diagrams initialized successfully.');
          } catch (renderError) {
            console.error('Error rendering diagrams:', renderError);
            
            // Try to render each diagram individually to isolate problematic ones
            diagrams.forEach((diagram, index) => {
              try {
                window.mermaid.init(undefined, [diagram]);
                diagram.classList.add('mermaid-visible');
              } catch (individualError) {
                console.warn(`Could not render diagram #${index + 1}:`, individualError);
                
                // Replace with error message for visibility
                const errorMessage = document.createElement('div');
                errorMessage.className = 'mermaid-error';
                errorMessage.innerHTML = `<p>Diagram could not be rendered</p>`;
                errorMessage.style.padding = '20px';
                errorMessage.style.background = '#ffebee';
                errorMessage.style.color = '#c62828';
                errorMessage.style.borderRadius = '4px';
                errorMessage.style.margin = '10px 0';
                
                diagram.parentNode.insertBefore(errorMessage, diagram.nextSibling);
              }
            });
          }
          
          return; // Initialization successful, exit the retry loop
        } else {
          console.log('No unprocessed Mermaid diagrams found on the page.');
          return; // No diagrams to process, exit the retry loop
        }
      } else {
        console.warn(`Mermaid library not found (attempt ${attempts}/${maxAttempts}). Retrying...`);
        
        if (attempts < maxAttempts) {
          setTimeout(attemptInitialization, attemptInterval);
        } else {
          console.error(`Failed to initialize Mermaid after ${maxAttempts} attempts.`);
          
          // Add fallback for diagrams when mermaid fails to load
          document.querySelectorAll('.mermaid:not([data-processed])').forEach(diagram => {
            const fallback = document.createElement('div');
            fallback.className = 'mermaid-fallback';
            fallback.innerHTML = `
              <p style="padding: 20px; background: #fff3e0; color: #e65100; border-radius: 4px; margin: 10px 0;">
                Diagram could not be loaded. Please refresh the page or try again later.
              </p>
            `;
            diagram.parentNode.insertBefore(fallback, diagram.nextSibling);
          });
        }
      }
    } catch (error) {
      console.error('Error initializing Mermaid:', error);
      
      if (attempts < maxAttempts) {
        console.log(`Retrying initialization (attempt ${attempts}/${maxAttempts})...`);
        setTimeout(attemptInitialization, attemptInterval);
      } else {
        console.error(`Failed to initialize Mermaid after ${maxAttempts} attempts.`);
      }
    }
  }
  
  // Start the initialization process
  attemptInitialization();
  
  // Add a mutation observer to handle dynamically added Mermaid diagrams
  const observer = new MutationObserver(mutations => {
    let newDiagrams = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if this is a Mermaid diagram
            if ((node.classList && node.classList.contains('mermaid') && !node.getAttribute('data-processed')) ||
                node.querySelectorAll('.mermaid:not([data-processed])').length > 0) {
              newDiagrams = true;
            }
          }
        });
      }
    });
    
    if (newDiagrams && window.mermaidInitialized && window.mermaid) {
      console.log('New Mermaid diagrams detected. Initializing...');
      
      // Wait a bit for the DOM to settle
      setTimeout(() => {
        const newDiagramElements = document.querySelectorAll('.mermaid:not([data-processed])');
        if (newDiagramElements.length > 0) {
          try {
            window.mermaid.init(undefined, newDiagramElements);
            newDiagramElements.forEach(diagram => {
              diagram.classList.add('mermaid-visible');
            });
          } catch (error) {
            console.error('Error rendering new diagrams:', error);
          }
        }
      }, 100);
    }
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Add CSS for mermaid diagrams
function addMermaidStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .docusaurus-mermaid-container {
      background: transparent;
      overflow: hidden;
      margin: 2rem 0;
      position: relative;
    }
    
    .mermaid {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .mermaid-visible {
      opacity: 1;
    }
    
    .mermaid-error, .mermaid-fallback {
      margin: 1rem 0;
      padding: 1rem;
      border-radius: 0.5rem;
    }
    
    /* Dark mode support */
    [data-theme='dark'] .mermaid-fallback p {
      background: #4a3426;
      color: #ffb74d;
    }
    
    [data-theme='dark'] .mermaid-error {
      background: #4a2c2c;
      color: #ef9a9a;
    }
  `;
  
  document.head.appendChild(style);
}

// Add styles when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addMermaidStyles);
} else {
  addMermaidStyles();
}

export default {};
