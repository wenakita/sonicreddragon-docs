import React, { useEffect, useRef, useState } from 'react';
import styles from './UnifiedMermaid.module.css';
import MermaidControls from './MermaidControls';
import { animateMermaidDiagram, addMermaidInteractivity, prefersReducedMotion } from '../utils/animationUtils';

interface UnifiedMermaidProps {
  chart: string;
  title?: string;
  caption?: string;
  interactive?: boolean;
  animated?: boolean;
  particles?: boolean;
  className?: string;
}

/**
 * UnifiedMermaid - A single component for rendering Mermaid diagrams
 * 
 * This component leverages Docusaurus's built-in Mermaid support and adds
 * optional enhancements like animations, interactivity, and controls.
 * It uses React refs and effects to interact with the rendered SVG,
 * avoiding direct DOM manipulation.
 */
const UnifiedMermaid: React.FC<UnifiedMermaidProps> = ({
  chart,
  title,
  caption,
  interactive = true,
  animated = true,
  particles = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [svgAttributes, setSvgAttributes] = useState({
    width: '100%',
    height: '100%',
    maxWidth: '100%'
  });
  
  // Check if user prefers reduced motion
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion());
  
  // Listen for changes to prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setReducedMotion(mediaQuery.matches);
    
    // Add listener for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Older browsers
    else if ('addListener' in mediaQuery) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Detect theme on initial render and when it changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Initial theme detection
    setIsDarkTheme(document.documentElement.dataset.theme === 'dark');
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.dataset.theme === 'dark');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  // Render the Mermaid diagram
  useEffect(() => {
    if (!chart || !containerRef.current) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const renderMermaid = async () => {
      try {
        // Clear any previous errors
        setError(null);
        
        // Wait for mermaid to be available (Docusaurus loads it)
        if (typeof window.mermaid === 'undefined') {
          const checkMermaid = () => {
            if (typeof window.mermaid !== 'undefined') {
              renderDiagram();
            } else {
              timeoutId = setTimeout(checkMermaid, 100);
            }
          };
          checkMermaid();
          return;
        }
        
        renderDiagram();
      } catch (err) {
        console.error('Error rendering Mermaid diagram:', err);
        setError(err instanceof Error ? err.message : 'Unknown error rendering diagram');
      }
    };
    
    const renderDiagram = () => {
      if (!containerRef.current) return;
      
      // Find the mermaid container that Docusaurus creates
      const mermaidContainer = containerRef.current.querySelector('.docusaurus-mermaid-container');
      if (!mermaidContainer) return;
      
      // Find the SVG element
      const svg = mermaidContainer.querySelector('svg');
      if (!svg) return;
      
      // Store a reference to the SVG
      svgRef.current = svg as SVGSVGElement;
      
      // Apply basic SVG styling using attributes state
      Object.entries(svgAttributes).forEach(([attr, value]) => {
        svgRef.current?.setAttribute(attr, value);
      });
      
      // Apply animations if enabled and user doesn't prefer reduced motion
      let cleanupAnimation;
      if (animated && !reducedMotion) {
        animateMermaidDiagram(svg as SVGElement);
      }
      
      // Add interactive hover effects if enabled
      let cleanupInteractivity;
      if (interactive && !reducedMotion) {
        cleanupInteractivity = addMermaidInteractivity(svg as SVGElement);
      }
      
      // Return cleanup function
      return () => {
        if (cleanupInteractivity) cleanupInteractivity();
      };
    };
    
    renderMermaid();
    
    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [chart, animated, interactive, svgAttributes, prefersReducedMotion]);


  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle animation replay
  const replayAnimation = () => {
    if (svgRef.current && !reducedMotion) {
      animateMermaidDiagram(svgRef.current);
    }
  };

  // Handle SVG download
  const downloadSvg = () => {
    if (!svgRef.current) return;
    
    // Create a blob from the SVG
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''} ${className || ''}`}
      ref={containerRef}
      data-theme={isDarkTheme ? 'dark' : 'light'}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      
      <div className={styles.diagramContainer}>
        {particles && !reducedMotion && (
          <div className={styles.particles}>
            {/* Particles are rendered via CSS */}
          </div>
        )}
        
        <div className={styles.mermaidWrapper}>
          {/* This is where Docusaurus will render the Mermaid diagram */}
          <div className="mermaid">{chart}</div>
        </div>
        
        {error && (
          <div className={styles.error}>
            Error rendering diagram: {error}
          </div>
        )}
        
        {/* Controls for the diagram */}
        <MermaidControls 
          onReplay={replayAnimation}
          onFullscreen={toggleFullscreen}
          onDownload={downloadSvg}
          isFullscreen={isFullscreen}
        />
      </div>
      
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
};

export default UnifiedMermaid;
