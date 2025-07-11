import React, { useEffect, useRef, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * UnifiedMermaid Component
 * 
 * A comprehensive Mermaid diagram component with:
 * - Modern styling
 * - Animations
 * - Interactive features
 * - Fullscreen mode
 * - Zoom controls
 * - Particle effects (optional)
 * - Dark/light theme support
 * 
 * @param {Object} props
 * @param {string} props.chart - The Mermaid diagram code
 * @param {string} props.title - Optional title for the diagram
 * @param {string} props.caption - Optional caption for the diagram
 * @param {boolean} props.animated - Whether to animate the diagram (default: true)
 * @param {boolean} props.interactive - Whether to add interactive controls (default: true)
 * @param {boolean} props.particles - Whether to add particle effects (default: false)
 * @param {string} props.className - Additional CSS class
 */
export default function UnifiedMermaid({
  chart,
  title,
  caption,
  animated = true,
  interactive = true,
  particles = false,
  className,
  ...rest
}) {
  const containerRef = useRef(null);
  const mermaidRef = useRef(null);
  const isBrowser = useIsBrowser();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueId] = useState(() => `mermaid-${Math.random().toString(36).substring(2, 11)}`);
  
  // Initialize particles if enabled
  useEffect(() => {
    if (!isBrowser || !particles) return;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    containerRef.current?.appendChild(particleContainer);
    
    // Create particles
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = styles.particle || '';
      
      // Random position, size, and animation delay
      const size = Math.random() * 5 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      
      particleContainer.appendChild(particle);
    }
    
    return () => {
      containerRef.current?.removeChild(particleContainer);
    };
  }, [isBrowser, particles]);
  
  // Initialize Mermaid diagram
  useEffect(() => {
    if (!isBrowser || !chart) return;
    
    // Reset error state
    setError(null);
    setIsLoading(true);
    
    // Create a div for the Mermaid diagram
    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.id = uniqueId;
    mermaidDiv.textContent = chart;
    
    // Clear previous content
    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = '';
      mermaidRef.current.appendChild(mermaidDiv);
    }
    
    // Initialize Mermaid with a delay to ensure the library is loaded
    const initTimer = setTimeout(() => {
      try {
        if (typeof window.mermaid !== 'undefined') {
          window.mermaid.initialize({
            startOnLoad: true,
            theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'neutral',
            securityLevel: 'loose',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 14,
            themeVariables: {
              darkMode: document.documentElement.dataset.theme === 'dark',
              primaryColor: '#2A2A2A',
              primaryTextColor: '#FFFFFF',
              primaryBorderColor: '#3b82f6',
              lineColor: '#3b82f6',
              secondaryColor: '#1A1A1A',
              tertiaryColor: '#0A0A0A',
              background: document.documentElement.dataset.theme === 'dark' ? '#1e1e1e' : '#f8fafc',
              mainBkg: document.documentElement.dataset.theme === 'dark' ? '#2A2A2A' : '#f1f5f9',
              secondBkg: document.documentElement.dataset.theme === 'dark' ? '#1A1A1A' : '#e2e8f0',
              textColor: document.documentElement.dataset.theme === 'dark' ? '#FFFFFF' : '#1e293b',
              labelColor: document.documentElement.dataset.theme === 'dark' ? '#FFFFFF' : '#1e293b',
              edgeLabelBackground: document.documentElement.dataset.theme === 'dark' ? '#1A1A1A' : '#f1f5f9',
              clusterBkg: document.documentElement.dataset.theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              clusterBorder: '#3b82f6',
              defaultLinkColor: '#3b82f6',
            },
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
          });
          
          // Render the diagram
          window.mermaid.init(undefined, `#${uniqueId}`);
          
          // Add animation if enabled
          if (animated) {
            animateDiagram();
          }
          
          setIsLoading(false);
        } else {
          console.error('Mermaid library not found');
          setError('Mermaid library not found');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing Mermaid:', err);
        setError(`Error initializing Mermaid: ${err.message}`);
        setIsLoading(false);
      }
    }, 500);
    
    return () => {
      clearTimeout(initTimer);
    };
  }, [isBrowser, chart, uniqueId, animated]);
  
  // Add animation to the diagram
  const animateDiagram = () => {
    if (!isBrowser || !window.anime) return;
    
    setTimeout(() => {
      try {
        // Get all SVG elements
        const svg = mermaidRef.current?.querySelector('svg');
        if (!svg) return;
        
        // Check if reduced motion is preferred
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        
        // Animate nodes with staggered entrance
        const nodes = svg.querySelectorAll('.node, .actor, .cluster, .labelText, .classGroup, .statediagram-state');
        window.anime({
          targets: nodes,
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.9, 1],
          delay: window.anime.stagger(80),
          easing: 'easeOutElastic(1, .5)',
          duration: 800
        });
        
        // Animate edges with drawing effect
        const edges = svg.querySelectorAll('.edgePath path, .messageLine, .relation');
        edges.forEach(edge => {
          // Set initial state for animation
          edge.setAttribute('stroke-dasharray', edge.getTotalLength());
          edge.setAttribute('stroke-dashoffset', edge.getTotalLength());
        });
        
        window.anime({
          targets: edges,
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutSine',
          duration: 700,
          delay: function(el, i) { return i * 120 + 400; }
        });
        
        // Animate labels with fade-in
        const labels = svg.querySelectorAll('.edgeLabel, .messageText, .noteText');
        window.anime({
          targets: labels,
          opacity: [0, 1],
          translateY: [10, 0],
          delay: window.anime.stagger(80, {start: 600}),
          easing: 'easeOutQuad',
          duration: 500
        });
        
        // Add hover effects to nodes
        nodes.forEach(node => {
          node.addEventListener('mouseenter', () => {
            window.anime({
              targets: node,
              scale: 1.05,
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))',
              duration: 300,
              easing: 'easeOutQuad'
            });
            
            // Highlight connected edges
            const nodeId = node.id;
            if (nodeId) {
              const connectedEdges = svg.querySelectorAll('.edgePath path');
              connectedEdges.forEach(edge => {
                const edgePathD = edge.getAttribute('d');
                if (edgePathD && edgePathD.includes(nodeId)) {
                  window.anime({
                    targets: edge,
                    strokeWidth: 3,
                    filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.6))',
                    duration: 300,
                    easing: 'easeOutQuad'
                  });
                }
              });
            }
          });
          
          node.addEventListener('mouseleave', () => {
            window.anime({
              targets: node,
              scale: 1,
              filter: 'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
              duration: 300,
              easing: 'easeOutQuad'
            });
            
            // Reset connected edges
            const nodeId = node.id;
            if (nodeId) {
              const connectedEdges = svg.querySelectorAll('.edgePath path');
              connectedEdges.forEach(edge => {
                const edgePathD = edge.getAttribute('d');
                if (edgePathD && edgePathD.includes(nodeId)) {
                  window.anime({
                    targets: edge,
                    strokeWidth: 2,
                    filter: 'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
                    duration: 300,
                    easing: 'easeOutQuad'
                  });
                }
              });
            }
          });
        });
      } catch (err) {
        console.error('Error animating diagram:', err);
      }
    }, 800);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Re-render the diagram after toggling fullscreen
    setTimeout(() => {
      if (typeof window.mermaid !== 'undefined') {
        window.mermaid.init(undefined, `#${uniqueId}`);
        
        // Re-apply animations if enabled
        if (animated) {
          animateDiagram();
        }
      }
    }, 300);
  };
  
  // Zoom in/out
  const handleZoom = (direction) => {
    const newZoom = direction === 'in' 
      ? Math.min(zoomLevel + 0.25, 3) 
      : Math.max(zoomLevel - 0.25, 0.5);
    
    setZoomLevel(newZoom);
    
    // Apply zoom to the SVG
    const svg = mermaidRef.current?.querySelector('svg');
    if (svg) {
      svg.style.transform = `scale(${newZoom})`;
      svg.style.transformOrigin = 'center center';
    }
  };
  
  // Download diagram as SVG
  const downloadSVG = () => {
    const svg = mermaidRef.current?.querySelector('svg');
    if (!svg) return;
    
    // Create a copy of the SVG to modify
    const svgCopy = svg.cloneNode(true);
    
    // Add styles to the SVG
    const style = document.createElement('style');
    style.textContent = `
      .node rect, .node circle, .node ellipse, .node polygon, .node path {
        fill: ${document.documentElement.dataset.theme === 'dark' ? '#2A2A2A' : '#f1f5f9'};
        stroke: #3b82f6;
      }
      .edgePath .path {
        stroke: #3b82f6;
        stroke-width: 2px;
      }
      .arrowheadPath {
        fill: #3b82f6;
      }
      .edgeLabel {
        background-color: ${document.documentElement.dataset.theme === 'dark' ? '#1A1A1A' : '#f1f5f9'};
        color: ${document.documentElement.dataset.theme === 'dark' ? '#FFFFFF' : '#1e293b'};
      }
      .cluster rect {
        fill: ${document.documentElement.dataset.theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'};
        stroke: #3b82f6;
      }
      .label {
        color: ${document.documentElement.dataset.theme === 'dark' ? '#FFFFFF' : '#1e293b'};
      }
    `;
    svgCopy.appendChild(style);
    
    // Set background color
    svgCopy.style.backgroundColor = document.documentElement.dataset.theme === 'dark' ? '#1e1e1e' : '#f8fafc';
    
    // Convert SVG to a data URL
    const svgData = new XMLSerializer().serializeToString(svgCopy);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${title || 'mermaid-diagram'}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up
    URL.revokeObjectURL(svgUrl);
  };
  
  // Render the component
  return (
    <div 
      ref={containerRef}
      className={clsx(
        styles.unifiedMermaidWrapper || '',
        isFullscreen ? styles.fullscreen || 'mermaid-fullscreen' : '',
        particles ? styles.withParticles || '' : '',
        animated ? styles.animated || '' : '',
        className
      )}
      {...rest}
    >
      {title && <h3 className={styles.diagramTitle || 'diagram-title'}>{title}</h3>}
      
      <div 
        ref={mermaidRef} 
        className={clsx(
          styles.mermaidContainer || '',
          isLoading ? styles.loading || '' : ''
        )}
        style={{ 
          position: 'relative',
          padding: '1.5rem',
          minHeight: '150px'
        }}
      >
        {isLoading && (
          <div className={styles.loadingIndicator || ''}>
            <div className={styles.loadingSpinner || ''}>
              <div></div><div></div><div></div><div></div>
            </div>
            <p>Rendering diagram...</p>
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage || ''}>
            <p>Error rendering diagram:</p>
            <pre>{error}</pre>
          </div>
        )}
      </div>
      
      {caption && <p className={styles.diagramCaption || 'diagram-caption'}>{caption}</p>}
      
      {interactive && !isLoading && !error && (
        <div className={styles.mermaidControls || 'mermaid-controls'}>
          <button 
            className={styles.mermaidControlButton || 'mermaid-control-button'} 
            onClick={() => handleZoom('out')}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M19 13H5v-2h14v2z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            className={styles.mermaidControlButton || 'mermaid-control-button'} 
            onClick={() => handleZoom('in')}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            className={styles.mermaidControlButton || 'mermaid-control-button'} 
            onClick={downloadSVG}
            aria-label="Download SVG"
            title="Download SVG"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            className={styles.mermaidControlButton || 'mermaid-control-button'} 
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              {isFullscreen ? (
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="currentColor"/>
              ) : (
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/>
              )}
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
