import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import styles from './styles.module.css';

// Lazy load mermaid for better performance
const loadMermaid = () => import('mermaid').then(m => m.default);

/**
 * MermaidDiagram component renders mermaid diagrams with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.chart - The mermaid diagram code
 * @param {string} props.title - Optional title for the diagram
 * @param {string} props.caption - Optional caption for the diagram
 * @param {string} props.className - Optional additional CSS class
 */
export default function MermaidDiagram({ chart, title, caption, className }) {
  const mermaidRef = useRef(null);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const mermaidInstanceRef = useRef(null);
  const uniqueId = useRef(`mermaid-diagram-${Math.random().toString(36).substring(2, 11)}`);

  // Check if we're on the client side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
    return () => {
      // Clean up any mermaid instance to prevent DOM manipulation errors
      if (mermaidInstanceRef.current) {
        try {
          // Safely clear content on unmount
          if (mermaidRef.current && mermaidRef.current.parentNode) {
            mermaidRef.current.innerHTML = '';
          }
        } catch (e) {
          console.error("Error cleaning up mermaid:", e);
        }
      }
    };
  }, []);
  
  // Handle intersection observer for lazy loading
  useEffect(() => {
    if (!isClient || !mermaidRef.current || isRendered) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          renderMermaid();
          observer.disconnect();
        }
      });
    }, { rootMargin: '200px 0px' });
    
    observer.observe(mermaidRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [isClient, chart, isRendered]);
  
  // Function to render the mermaid diagram
  const renderMermaid = async () => {
    if (!mermaidRef.current || !chart || isRendered) return;
    
    try {
      // Clear any existing content
      while (mermaidRef.current.firstChild) {
        mermaidRef.current.removeChild(mermaidRef.current.firstChild);
      }
      
      // Load mermaid dynamically
      const mermaid = await loadMermaid();
      mermaidInstanceRef.current = mermaid;
      
      // Initialize mermaid with our configuration
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: 16,
        themeVariables: {
          darkMode: true,
          primaryColor: '#4a80d1',
          primaryTextColor: '#f5f6fa',
          primaryBorderColor: '#666',
          lineColor: '#999',
          secondaryColor: '#cc5a2b',
          tertiaryColor: '#1e293b',
        },
        flowchart: {
          curve: 'basis',
          nodeSpacing: 60,
          rankSpacing: 80,
          padding: 20,
          useMaxWidth: true,
        },
        sequence: {
          mirrorActors: false,
          bottomMarginAdj: 10,
          boxMargin: 10,
          noteMargin: 10,
          messageMargin: 35,
          boxTextMargin: 15,
        },
      });
      
      // Safely set the ID and content
      mermaidRef.current.id = uniqueId.current;
      
      // Create text node (safer than innerHTML)
      const textNode = document.createTextNode(chart);
      mermaidRef.current.appendChild(textNode);
      
      // Render with error handling
      try {
        await mermaid.render(uniqueId.current, chart).then(({ svg, bindFunctions }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
            if (bindFunctions) bindFunctions(mermaidRef.current);
            setIsRendered(true);
          }
        });
      } catch (renderError) {
        console.error("Mermaid rendering error:", renderError);
        setError(`Diagram rendering error: ${renderError.message || 'Unknown error'}`);
      }
    } catch (initError) {
      console.error("Mermaid initialization error:", initError);
      setError(`Diagram initialization error: ${initError.message || 'Failed to load diagram library'}`);
    }
  };

  if (error) {
    return (
      <div className={`${styles.mermaidContainer} ${className || ''}`}>
        {title && <h3 className={styles.mermaidTitle}>{title}</h3>}
        <div className={styles.mermaidError}>{error}</div>
        {caption && <p className={styles.mermaidCaption}>{caption}</p>}
      </div>
    );
  }

  return (
    <div className={`${styles.mermaidContainer} ${className || ''}`}>
      {title && <h3 className={styles.mermaidTitle}>{title}</h3>}
      <div className="mermaid" ref={mermaidRef}>
        {!isClient && <div className={styles.mermaidLoading}>Loading diagram...</div>}
        {isClient && !isRendered && <div className={styles.mermaidLoading}>Rendering diagram...</div>}
      </div>
      {caption && <p className={styles.mermaidCaption}>{caption}</p>}
    </div>
  );
} 