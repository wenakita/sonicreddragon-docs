import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

/**
 * StandardMermaid component - renders Mermaid diagrams with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.chart - The mermaid diagram code
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animate - Whether to animate the diagram
 */
export default function StandardMermaid({ chart, className, animate = true }) {
  const containerRef = useRef(null);
  const isBrowser = useIsBrowser();
  const { colorMode } = useColorMode();
  const [isRendered, setIsRendered] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  
  // Ensure chart is properly processed
  const processedChart = chart?.trim() || '';
  
  // Create a unique identifier for this diagram
  const uniqueId = useRef(`mermaid-${Math.random().toString(36).substring(2, 11)}`);
  
  // Function to load Mermaid if it's not already loaded
  const loadMermaid = async () => {
    if (typeof window === 'undefined') return null;
    
    if (!window.mermaid) {
      try {
        const mermaid = (await import('mermaid')).default;
        window.mermaid = mermaid;
        return mermaid;
      } catch (error) {
        console.error('Failed to load Mermaid:', error);
        return null;
      }
    }
    
    return window.mermaid;
  };
  
  // Function to initialize Mermaid with the current theme
  const initializeMermaid = (mermaid) => {
    if (!mermaid || mermaid.initialized) return mermaid;
    
    const isDarkTheme = colorMode === 'dark';
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkTheme ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      themeVariables: {
        primaryColor: isDarkTheme ? '#5468ff' : '#1a73e8',
        primaryTextColor: isDarkTheme ? '#f0f0f0' : '#333',
        primaryBorderColor: isDarkTheme ? '#555' : '#ddd',
        lineColor: isDarkTheme ? '#999' : '#666',
        secondaryColor: '#cc5a2b',
        tertiaryColor: isDarkTheme ? '#1e293b' : '#f8f9fa',
      }
    });
    
    mermaid.initialized = true;
    return mermaid;
  };
  
  // Render the Mermaid diagram
  const renderDiagram = async () => {
    if (!isBrowser || !containerRef.current || !processedChart) {
      return;
    }
    
    try {
      // Load mermaid
      const mermaid = await loadMermaid();
      if (!mermaid) {
        throw new Error('Failed to load Mermaid library');
      }
      
      // Initialize mermaid if not already initialized
      initializeMermaid(mermaid);
      
      // Get a reference to the diagram container
      const diagramContainer = containerRef.current;
      if (!diagramContainer) return;
      
      // Clear previous content
      diagramContainer.innerHTML = '';
      
      // Create a diagram element
      const diagramElement = document.createElement('div');
      diagramElement.id = uniqueId.current;
      diagramElement.style.width = '100%';
      diagramElement.style.height = 'auto';
      diagramElement.style.overflow = 'visible';
      diagramContainer.appendChild(diagramElement);
      
      // Render the diagram
      const { svg } = await mermaid.render(uniqueId.current, processedChart);
      
      // Replace the content with the SVG
      diagramElement.innerHTML = svg;
      
      // Mark as rendered
      setIsRendered(true);
      setIsError(false);
      
      // Apply animation if available and requested
      if (animate && window.animateMermaidDiagrams && typeof window.animateMermaidDiagrams === 'function') {
        setTimeout(() => {
          window.animateMermaidDiagrams(diagramElement);
        }, 100);
      }
    } catch (error) {
      console.error('Error rendering Mermaid diagram:', error);
      setIsError(true);
      setErrorMessage(error.message || 'Failed to render diagram');
      
      // Retry a few times with exponential backoff
      if (retryCount < 3) {
        const timeoutId = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          renderDiagram();
        }, 500 * Math.pow(2, retryCount));
        
        return () => clearTimeout(timeoutId);
      }
    }
  };
  
  // Effect to render the diagram
  useEffect(() => {
    const timeoutId = setTimeout(renderDiagram, 100);
    return () => clearTimeout(timeoutId);
  }, [chart, isBrowser, processedChart, colorMode, retryCount]);
  
  return (
    <div 
      ref={containerRef} 
      className={`${styles.standardMermaidContainer || 'standard-mermaid-container'} ${className || ''}`}
      data-theme={colorMode}
    >
      {isError ? (
        <div className={styles.mermaidError || 'mermaid-error'}>
          <p>Error rendering diagram: {errorMessage}</p>
          <details>
            <summary>View diagram code</summary>
            <pre>{processedChart}</pre>
          </details>
        </div>
      ) : !isRendered && isBrowser ? (
        <div className={styles.mermaidLoading || 'mermaid-loading'}>
          <div className={styles.loadingIndicator || 'loading-indicator'}>
            <span></span><span></span><span></span>
          </div>
        </div>
      ) : null}
    </div>
  );
} 