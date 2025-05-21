// Enhanced mermaid initialization
import mermaid from 'mermaid';

// Function to sanitize mermaid diagram code at runtime
function sanitizeMermaidDiagram(element) {
  if (!element || !element.textContent) return;
  
  // Get the original content
  const originalContent = element.textContent;
  
  // Apply comprehensive sanitization
  let sanitized = originalContent
    // Fix classDef with problematic Unicode
    .replace(/classDef\s+(\w+)\s+fill:[^\n;]*/g, (match, className) => {
      return `classDef ${className} fill:#4a80d1`;
    })
    // FIX: Properly handle class statements with commas and highlight keyword
    // Example: "class Token,LZ,Governance,JackpotSystem highlight" -> "class Token LZ Governance JackpotSystem highlight"
    .replace(/class\s+([^;\n]+)(\s+highlight)/g, (match, classList, highlight) => {
      // Replace commas with spaces in the class list
      const fixedClassList = classList.replace(/,/g, ' ');
      return `class ${fixedClassList}${highlight}`;
    })
    // Fix commas in class names in class diagrams that don't have highlight
    .replace(/class\s+([^;\n]+)(?!\s+highlight)/g, (match, classList) => {
      // Replace commas with spaces
      const fixedClassList = classList.replace(/,/g, ' ');
      return `class ${fixedClassList}`;
    })
    // Replace all non-ASCII characters
    .replace(/[^\x00-\x7F]/g, '')
    // Ensure spaces around relationships
    .replace(/(\w+)--+>(\w+)/g, '$1 --> $2')
    .replace(/(\w+)<--+(\w+)/g, '$1 <-- $2')
    .replace(/(\w+)-.+->(\w+)/g, '$1 --> $2')
    // Replace any remaining problematic characters
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[—–]/g, '-');
  
  // Only update if there were changes
  if (sanitized !== originalContent) {
    console.log('Sanitized Mermaid diagram');
    element.textContent = sanitized;
  }
}

// This runs on client-side browser only
export default {
  onRouteUpdate() {
    if (typeof window === 'undefined') return;
    
    console.log('Initializing mermaid from client module');
    
    try {
      // Get current theme
      const isDarkTheme = document.documentElement.dataset.theme === 'dark';
      
      // Patch the mermaid render function to sanitize diagrams before rendering
      if (!mermaid._originalRender && mermaid.render) {
        mermaid._originalRender = mermaid.render;
        mermaid.render = function(id, text, ...args) {
          // Sanitize the text before rendering
          let sanitizedText = text
            // Fix classDef with problematic Unicode
            .replace(/classDef\s+(\w+)\s+fill:[^\n;]*/g, (match, className) => {
              return `classDef ${className} fill:#4a80d1`;
            })
            // FIX: Properly handle class statements with commas and highlight keyword
            // Example: "class Token,LZ,Governance,JackpotSystem highlight" -> "class Token LZ Governance JackpotSystem highlight"
            .replace(/class\s+([^;\n]+)(\s+highlight)/g, (match, classList, highlight) => {
              // Replace commas with spaces in the class list
              const fixedClassList = classList.replace(/,/g, ' ');
              return `class ${fixedClassList}${highlight}`;
            })
            // Fix commas in class names in class diagrams that don't have highlight
            .replace(/class\s+([^;\n]+)(?!\s+highlight)/g, (match, classList) => {
              // Replace commas with spaces
              const fixedClassList = classList.replace(/,/g, ' ');
              return `class ${fixedClassList}`;
            })
            // Replace all non-ASCII characters
            .replace(/[^\x00-\x7F]/g, '')
            // Ensure spaces around relationships
            .replace(/(\w+)--+>(\w+)/g, '$1 --> $2')
            .replace(/(\w+)<--+(\w+)/g, '$1 <-- $2')
            .replace(/(\w+)-.+->(\w+)/g, '$1 --> $2')
            // Replace any remaining problematic characters
            .replace(/[""]/g, '"')
            .replace(/['']/g, "'")
            .replace(/[—–]/g, '-');
          
          // Call the original render with sanitized text
          return mermaid._originalRender.call(this, id, sanitizedText, ...args);
        };
      }
      
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
        // Add class diagram settings
        classDiagram: {
          useMaxWidth: true,
          diagramPadding: 20,
        },
        // Configuration to handle error cases more gracefully
        logLevel: 'error',
        deterministicIds: true,
        deterministicSelection: true,
      });
      
      // Store an initialized flag
      window.mermaidInitialized = true;
      
      // Sanitize all mermaid diagrams before processing
      document.querySelectorAll('.mermaid').forEach(sanitizeMermaidDiagram);
      
      // Process all diagrams
      const renderAllDiagrams = () => {
        const diagrams = document.querySelectorAll('.mermaid:not([data-processed="true"])');
        if (diagrams.length > 0) {
          console.log(`Found ${diagrams.length} unprocessed diagrams, rendering...`);
          diagrams.forEach(sanitizeMermaidDiagram);
          
          // Try to render each diagram individually for better error handling
          diagrams.forEach(diagram => {
            try {
              mermaid.init(undefined, [diagram]);
            } catch (diagramError) {
              console.error('Error rendering individual diagram:', diagramError);
              diagram.classList.add('mermaid-error');
              const errorDiv = document.createElement('div');
              errorDiv.className = 'mermaid-error-message';
              errorDiv.textContent = 'Error rendering diagram. Check browser console for details.';
              diagram.parentNode.insertBefore(errorDiv, diagram.nextSibling);
            }
          });
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