import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';

/**
 * StandardMermaid component - ensures standard Mermaid code blocks render properly
 * Use this component in MDX to directly render Mermaid diagrams
 * 
 * @param {Object} props
 * @param {string} props.chart - The mermaid diagram code
 * @param {string} props.className - Additional CSS classes
 */
export default function StandardMermaid({ chart, className }) {
  const containerRef = useRef(null);
  const isBrowser = useIsBrowser();
  const [isRendered, setIsRendered] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Ensure chart is properly processed
  const processedChart = chart?.trim() || '';
  
  // Create a unique identifier for this diagram
  const uniqueId = useRef(`mermaid-${Math.random().toString(36).substring(2, 11)}`);
  
  useEffect(() => {
    if (!isBrowser || !containerRef.current || !processedChart) {
      return;
    }
    
    const renderDiagram = async () => {
      try {
        if (typeof window === 'undefined' || !window.mermaid) {
          // Dynamically import mermaid if needed
          const mermaid = (await import('mermaid')).default;
          window.mermaid = mermaid;
        }
        
        // Initialize mermaid if not already initialized
        if (!window.mermaid.initialized) {
          window.mermaid.initialize({
            startOnLoad: false,
            theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          });
          
          window.mermaid.initialized = true;
        }
        
        // Get a reference to the diagram container
        const diagramContainer = containerRef.current;
        if (!diagramContainer) return;
        
        // Find or create a diagram element
        let diagramElement = diagramContainer.querySelector('.mermaid-diagram');
        if (!diagramElement) {
          diagramElement = document.createElement('div');
          diagramElement.className = 'mermaid-diagram';
          diagramElement.id = uniqueId.current;
          diagramContainer.appendChild(diagramElement);
        }
        
        // Set the content and render
        diagramElement.textContent = processedChart;
        
        // Render the diagram
        const { svg } = await window.mermaid.render(uniqueId.current, processedChart);
        
        // Replace the content with the SVG
        diagramElement.innerHTML = svg;
        
        // Mark as rendered
        setIsRendered(true);
        setIsError(false);
        
        // Apply animation if available
        setTimeout(() => {
          if (window.animateMermaidDiagrams && typeof window.animateMermaidDiagrams === 'function') {
            window.animateMermaidDiagrams();
          }
        }, 200);
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        setIsError(true);
        setErrorMessage(error.message || 'Failed to render diagram');
      }
    };
    
    // Render with a slight delay to ensure the DOM is ready
    const timeoutId = setTimeout(renderDiagram, 100);
    
    // Cleanup
    return () => clearTimeout(timeoutId);
  }, [chart, isBrowser, processedChart]);
  
  return (
    <div ref={containerRef} className={`${styles.standardMermaidContainer || ''} ${className || ''}`}>
      {isError ? (
        <div className={styles.mermaidError || ''}>
          <p>Error rendering diagram: {errorMessage}</p>
          <details>
            <summary>View diagram code</summary>
            <pre>{processedChart}</pre>
          </details>
        </div>
      ) : !isRendered && isBrowser ? (
        <div className={styles.mermaidLoading || ''}>
          <div className={styles.loadingIndicator || ''}>
            <span></span><span></span><span></span>
          </div>
        </div>
      ) : null}
    </div>
  );
} 