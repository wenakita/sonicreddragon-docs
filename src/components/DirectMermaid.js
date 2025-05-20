import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';

/**
 * DirectMermaid component handles direct rendering of mermaid diagrams
 * with dynamic theme support and error handling.
 * 
 * @param {Object} props
 * @param {string} props.chart - The mermaid diagram code
 * @param {string} props.title - Optional title for the diagram
 * @param {string} props.caption - Optional caption for the diagram
 * @param {string} props.className - Optional additional CSS class
 */
export default function DirectMermaid({ chart, title, caption, className }) {
  const containerRef = useRef(null);
  const isBrowser = useIsBrowser();
  
  useEffect(() => {
    if (!isBrowser || !containerRef.current) return;
    
    try {
      // Ensure mermaid is available
      if (window.mermaid) {
        // Clear the container first
        const container = containerRef.current;
        const diagramContainer = container.querySelector('.mermaid-diagram-container');
        if (diagramContainer) {
          diagramContainer.innerHTML = '<div class="mermaid">' + chart + '</div>';
          
          // Detect current theme from HTML data-theme attribute
          const isDarkTheme = document.documentElement.dataset.theme === 'dark';
          
          // Render with current theme
          window.mermaid.initialize({
            theme: isDarkTheme ? 'dark' : 'default',
            themeVariables: { 
              darkMode: isDarkTheme 
            }
          });
          
          // Initialize the diagram
          window.mermaid.init(undefined, container.querySelectorAll('.mermaid'));
        }
      } else {
        console.warn('Mermaid library not loaded');
      }
    } catch (error) {
      console.error('Error rendering mermaid diagram:', error);
      
      // Show error state
      if (containerRef.current) {
        const errorDiv = document.createElement('div');
        errorDiv.className = styles.mermaidError || '';
        errorDiv.textContent = 'Error rendering diagram';
        containerRef.current.appendChild(errorDiv);
      }
    }
  }, [chart, isBrowser]);
  
  return (
    <div 
      ref={containerRef}
      className={`${styles.mermaidContainer || ''} ${className || ''}`}
    >
      {title && <h3 className={styles.mermaidTitle || ''}>{title}</h3>}
      <div className="mermaid-diagram-container">
        <div className="mermaid">{chart}</div>
      </div>
      {caption && <p className={styles.mermaidCaption || ''}>{caption}</p>}
    </div>
  );
} 