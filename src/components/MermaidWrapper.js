import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useColorMode } from '@docusaurus/theme-common';

/**
 * MermaidWrapper - A robust client-side wrapper for mermaid diagrams
 * Simple alternate implementation focusing on direct rendering
 */
export default function MermaidWrapper({ chart }) {
  const containerRef = useRef(null);
  const [renderError, setRenderError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isBrowser = useIsBrowser();
  const { colorMode } = useColorMode();
  
  // Function to sanitize chart code to prevent parsing errors
  const sanitizeMermaidCode = (code) => {
    if (!code) return '';
    
    // Replace any non-standard quotes, dashes or problematic Unicode
    return code
      // Normalize quotes
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Normalize dashes
      .replace(/[—–]/g, '-')
      // Fix common Unicode errors in classDef lines
      .replace(/classDef\s+(\w+)\s+fill:([^\n,;]+)/g, (match, className, fill) => {
        // Clean up the fill value to ensure it only has valid hex colors or CSS color names
        const cleanFill = fill
          .replace(/[^\w#(),.\s-]/g, '') // Remove any non-alphanumeric characters except those valid in colors
          .replace(/\s+/g, ' ');         // Normalize whitespace
        
        return `classDef ${className} fill:${cleanFill}`;
      })
      // Ensure semicolons in style definitions are properly spaced
      .replace(/;(\w)/g, '; $1')
      // Replace any lingering problematic Unicode characters
      .replace(/[^\x00-\x7F]/g, '');
  };

  useEffect(() => {
    async function renderDiagram() {
      if (!isBrowser || !containerRef.current || !chart) {
        return;
      }
      
      setIsLoading(true);
      setRenderError(null);
      
      try {
        // Clear any previous content
        containerRef.current.innerHTML = '';
        
        // Make sure mermaid is available
        if (!window.mermaid) {
          // Try to load mermaid dynamically if needed
          try {
            const mermaid = (await import('mermaid')).default;
            window.mermaid = mermaid;
          } catch (loadError) {
            setRenderError('Could not load Mermaid library');
            setIsLoading(false);
            return;
          }
        }
        
        console.log('Rendering diagram with MermaidWrapper');
        
        // Generate a unique ID to avoid conflicts
        const id = `mermaid-diagram-${Math.random().toString(36).substr(2, 9)}`;
        
        // Sanitize the chart code
        const sanitizedChart = sanitizeMermaidCode(chart.trim());
        
        // Initialize mermaid with the current theme
        const isDarkTheme = colorMode === 'dark';
        window.mermaid.initialize({
          startOnLoad: false,
          theme: isDarkTheme ? 'dark' : 'default',
          securityLevel: 'loose',
          themeVariables: {
            primaryColor: isDarkTheme ? '#5468ff' : '#1a73e8',
            primaryTextColor: isDarkTheme ? '#f0f0f0' : '#333',
            primaryBorderColor: isDarkTheme ? '#555' : '#ddd',
            lineColor: isDarkTheme ? '#999' : '#666',
          }
        });
        
        try {
          // Pre-parse to catch syntax errors early
          await window.mermaid.parse(sanitizedChart);
          
          // Use mermaid's render method (most reliable)
          const { svg } = await window.mermaid.render(id, sanitizedChart);
          
          // Insert the rendered SVG
          containerRef.current.innerHTML = svg;
          
          // Process the SVG to make it responsive
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.display = 'block';
            svgElement.style.margin = '0 auto';
          }
          
          // Apply animations if available
          setTimeout(() => {
            if (window.animateMermaidDiagrams && typeof window.animateMermaidDiagrams === 'function') {
              window.animateMermaidDiagrams(containerRef.current);
            }
            setIsLoading(false);
          }, 100);
        } catch (renderError) {
          console.error('MermaidWrapper render error:', renderError);
          setRenderError(renderError.message || 'Failed to render diagram');
          
          // Log the problematic diagram code for debugging
          console.log('Problematic diagram code:', sanitizedChart);
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('MermaidWrapper error:', error);
        setRenderError(error.message || 'An error occurred');
        setIsLoading(false);
      }
    }
    
    renderDiagram();
  }, [chart, isBrowser, colorMode]);
  
  if (renderError) {
    return (
      <div className="mermaid-error">
        <p>Error rendering diagram: {renderError}</p>
        <details>
          <summary>View diagram code</summary>
          <pre>{chart}</pre>
        </details>
      </div>
    );
  }
  
  return (
    <div className="mermaid-container">
      {isLoading && isBrowser && (
        <div className="mermaid-loading">
          <div className="loading-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      )}
      <div ref={containerRef} data-theme={colorMode} />
    </div>
  );
} 