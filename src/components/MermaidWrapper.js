import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

/**
 * MermaidWrapper - A robust client-side wrapper for mermaid diagrams
 */
export default function MermaidWrapper({ chart }) {
  const containerRef = useRef(null);
  const [renderError, setRenderError] = useState(null);
  const isBrowser = useIsBrowser();
  
  useEffect(() => {
    async function renderDiagram() {
      if (!isBrowser || !containerRef.current || !chart) {
        return;
      }
      
      try {
        // Clear any previous content
        containerRef.current.innerHTML = '';
        
        // Make sure mermaid is available
        if (window.mermaid) {
          console.log('Rendering diagram with MermaidWrapper');
          
          // Generate a unique ID to avoid conflicts
          const id = `mermaid-diagram-${Math.random().toString(36).substr(2, 9)}`;
          
          try {
            // Use mermaid's render method (most reliable)
            const { svg } = await window.mermaid.render(id, chart.trim());
            
            // Insert the rendered SVG
            containerRef.current.innerHTML = svg;
            
            // Process the SVG to make it responsive
            const svgElement = containerRef.current.querySelector('svg');
            if (svgElement) {
              svgElement.style.maxWidth = '100%';
              svgElement.style.height = 'auto';
            }
          } catch (renderError) {
            console.error('MermaidWrapper render error:', renderError);
            setRenderError(renderError.message || 'Failed to render diagram');
          }
        } else {
          console.error('MermaidWrapper: Mermaid library not loaded');
          setRenderError('Mermaid library not loaded');
        }
      } catch (error) {
        console.error('MermaidWrapper error:', error);
        setRenderError(error.message || 'An error occurred');
      }
    }
    
    renderDiagram();
  }, [chart, isBrowser]);
  
  if (renderError) {
    return (
      <div className="mermaid-error">
        <p>Error rendering diagram: {renderError}</p>
        <pre>{chart}</pre>
      </div>
    );
  }
  
  return (
    <div className="mermaid-container">
      <div ref={containerRef} />
    </div>
  );
} 