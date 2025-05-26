import React, { useRef, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface MermaidControlsProps {
  targetSelector?: string;
  className?: string;
}

export default function MermaidControls({ 
  targetSelector = '.mermaid', 
  className = '' 
}: MermaidControlsProps) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!isBrowser || !controlsRef.current) return;

    // Animate controls entrance
    anime({
      targets: controlsRef.current.children,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 400,
      delay: anime.stagger(100),
      easing: 'easeOutCubic'
    });
  }, [isBrowser]);

  const handleZoomIn = () => {
    const mermaidElements = document.querySelectorAll(targetSelector);
    mermaidElements.forEach((element) => {
      const svg = element.querySelector('svg');
      if (svg) {
        const currentScale = parseFloat(svg.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || '1');
        const newScale = Math.min(currentScale * 1.2, 3);
        
        anime({
          targets: svg,
          scale: newScale,
          duration: 300,
          easing: 'easeOutCubic'
        });
      }
    });
  };

  const handleZoomOut = () => {
    const mermaidElements = document.querySelectorAll(targetSelector);
    mermaidElements.forEach((element) => {
      const svg = element.querySelector('svg');
      if (svg) {
        const currentScale = parseFloat(svg.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || '1');
        const newScale = Math.max(currentScale * 0.8, 0.5);
        
        anime({
          targets: svg,
          scale: newScale,
          duration: 300,
          easing: 'easeOutCubic'
        });
      }
    });
  };

  const handleResetView = () => {
    const mermaidElements = document.querySelectorAll(targetSelector);
    mermaidElements.forEach((element) => {
      const svg = element.querySelector('svg');
      if (svg) {
        anime({
          targets: svg,
          scale: 1,
          translateX: 0,
          translateY: 0,
          duration: 400,
          easing: 'easeOutCubic'
        });
      }
    });
  };

  const handleReplay = () => {
    const mermaidElements = document.querySelectorAll(targetSelector);
    mermaidElements.forEach((element) => {
      const svg = element.querySelector('svg');
      if (svg) {
        // Pulse animation to indicate replay
        anime({
          targets: svg,
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
          duration: 600,
          easing: 'easeInOutQuad'
        });
      }
    });
  };

  return (
    <div 
      ref={controlsRef}
      className={`mermaid-controls ${className}`}
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}
    >
      <button
        className="mermaid-btn"
        onClick={handleZoomIn}
        title="Zoom In"
        style={{
          background: 'var(--ifm-color-primary)',
          border: '1px solid var(--ifm-color-primary-dark)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        Zoom In
      </button>
      
      <button
        className="mermaid-btn"
        onClick={handleZoomOut}
        title="Zoom Out"
        style={{
          background: 'var(--ifm-color-primary)',
          border: '1px solid var(--ifm-color-primary-dark)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        Zoom Out
      </button>
      
      <button
        className="mermaid-btn"
        onClick={handleResetView}
        title="Reset View"
        style={{
          background: 'var(--ifm-color-primary)',
          border: '1px solid var(--ifm-color-primary-dark)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        Reset View
      </button>
      
      <button
        className="mermaid-btn"
        onClick={handleReplay}
        title="Replay Animation"
        style={{
          background: 'var(--ifm-color-primary)',
          border: '1px solid var(--ifm-color-primary-dark)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        Replay
      </button>
    </div>
  );
} 