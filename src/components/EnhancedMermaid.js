import React, { useEffect, useRef, useState } from 'react';
import { animateMermaidDiagram } from '../utils/animeUtils';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';

/**
 * EnhancedMermaid component for elegant, animated Mermaid diagrams
 *
 * @param {Object} props
 * @param {string} props.chart - The mermaid diagram code
 * @param {string} props.title - Optional title for the diagram
 * @param {string} props.caption - Optional caption for the diagram
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animated - Whether to apply animations (default: true)
 * @param {string} props.pulseSelector - CSS selector for elements that should pulse
 * @param {Object} props.animationOptions - Custom animation options
 */
export default function EnhancedMermaid({
  chart,
  title,
  caption,
  className,
  animated = true,
  pulseSelector,
  animationOptions = {},
}) {
  const containerRef = useRef(null);
  const isBrowser = useIsBrowser();
  const [renderAttempts, setRenderAttempts] = useState(0);
  const [renderError, setRenderError] = useState(null);
  const [isRendered, setIsRendered] = useState(false);

  // Clean chart of any potential issues
  const processedChart = chart?.trim() || '';
  
  useEffect(() => {
    if (!isBrowser || !containerRef.current) return;
    
    // Reset error state on new render attempts
    setRenderError(null);
    setIsRendered(false);
    
    // Only run in browser
    if (typeof window !== 'undefined' && window.mermaid) {
      try {
        // Get current theme from HTML attribute
        const isDarkTheme = document.documentElement.dataset.theme === 'dark';
        
        window.mermaid.initialize({
          theme: isDarkTheme ? 'dark' : 'default',
          themeVariables: { 
            darkMode: isDarkTheme 
          },
          securityLevel: 'loose',
        });
        
        // Use a short timeout to ensure the DOM is ready
        const renderTimer = setTimeout(() => {
          try {
            window.mermaid.init(
              undefined, 
              containerRef.current.querySelectorAll('.mermaid:not(.processed)')
            );
            
            // Mark diagrams as processed
            containerRef.current.querySelectorAll('.mermaid').forEach(el => {
              el.classList.add('processed');
            });
            
            setIsRendered(true);
            
            // Apply animations if enabled
            if (animated) {
              setTimeout(() => {
                const diagramContainer = containerRef.current.querySelector('.docusaurus-mermaid-container');
                if (diagramContainer) {
                  animateMermaidDiagram(diagramContainer, {
                    pulseSelector,
                    ...animationOptions
                  });
                }
              }, 100);
            }
          } catch (err) {
            console.error('Failed to render mermaid diagram:', err);
            setRenderError(err.message);
            
            // If we haven't tried too many times, attempt to re-render
            if (renderAttempts < 3) {
              setRenderAttempts(prev => prev + 1);
            }
          }
        }, 50);
        
        return () => clearTimeout(renderTimer);
      } catch (error) {
        console.error('Failed to initialize mermaid:', error);
        setRenderError(error.message);
      }
    }
  }, [chart, isBrowser, renderAttempts, animated, pulseSelector]);

  // Minimalist container style
  const containerClasses = [
    styles.enhancedMermaidContainer || '',
    className || '',
    isRendered ? styles.rendered || '' : ''
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={containerClasses}>
      {title && <h3 className={styles.mermaidTitle || ''}>{title}</h3>}
      
      <div className="docusaurus-mermaid-container">
        {renderError ? (
          <div className={styles.mermaidError}>
            <p>Error rendering diagram.</p>
            <details>
              <summary>View error details</summary>
              <pre>{renderError}</pre>
            </details>
          </div>
        ) : (
          <>
            <pre className="mermaid">
              {processedChart}
            </pre>
            {!isRendered && (
              <div className={styles.mermaidLoading || ''}>
                <div className={styles.loadingIndicator || ''}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {caption && <p className={styles.mermaidCaption || ''}>{caption}</p>}
    </div>
  );
} 