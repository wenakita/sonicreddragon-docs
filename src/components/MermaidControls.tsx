import React, { useRef, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { ZoomInIcon, ZoomOutIcon, ResetIcon, PlayIcon } from './Icon';

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

    // Animate controls entrance with CSS
    const buttons = Array.from(controlsRef.current.children) as HTMLElement[];
    buttons.forEach((button, index) => {
      button.style.opacity = '0';
      button.style.transform = 'translateY(10px)';
      button.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
      
      setTimeout(() => {
        button.style.opacity = '1';
        button.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, [isBrowser]);

  const handleZoomIn = () => {
    // Look for both .mermaid and .docusaurus-mermaid-container
    const containers = document.querySelectorAll('.mermaid-container, .docusaurus-mermaid-container');
    
    containers.forEach((container) => {
      const svg = container.querySelector('svg');
      if (svg) {
        const currentTransform = svg.style.transform || '';
        const currentScale = parseFloat(currentTransform.match(/scale\(([\d.]+)\)/)?.[1] || '1');
        const newScale = Math.min(currentScale * 1.2, 3);
        
        // Apply transform with scale
        const baseTransform = currentTransform.replace(/scale\([\d.]+\)/, '').trim();
        svg.style.transform = `${baseTransform} scale(${newScale})`.trim();
        svg.style.transformOrigin = 'center center';
        
        // Add smooth transition
        svg.style.transition = 'transform 0.3s ease-out';
      }
    });
  };

  const handleZoomOut = () => {
    const containers = document.querySelectorAll('.mermaid-container, .docusaurus-mermaid-container');
    
    containers.forEach((container) => {
      const svg = container.querySelector('svg');
      if (svg) {
        const currentTransform = svg.style.transform || '';
        const currentScale = parseFloat(currentTransform.match(/scale\(([\d.]+)\)/)?.[1] || '1');
        const newScale = Math.max(currentScale * 0.8, 0.5);
        
        // Apply transform with scale
        const baseTransform = currentTransform.replace(/scale\([\d.]+\)/, '').trim();
        svg.style.transform = `${baseTransform} scale(${newScale})`.trim();
        svg.style.transformOrigin = 'center center';
        
        // Add smooth transition
        svg.style.transition = 'transform 0.3s ease-out';
      }
    });
  };

  const handleResetView = () => {
    const containers = document.querySelectorAll('.mermaid-container, .docusaurus-mermaid-container');
    
    containers.forEach((container) => {
      const svg = container.querySelector('svg');
      if (svg) {
        // Reset transform
        svg.style.transform = '';
        svg.style.transformOrigin = 'center center';
        
        // Add smooth transition
        svg.style.transition = 'transform 0.4s ease-out';
      }
    });
  };

  const handleReplay = () => {
    const containers = document.querySelectorAll('.mermaid-container, .docusaurus-mermaid-container');
    
    containers.forEach((container) => {
      const svg = container.querySelector('svg');
      if (svg) {
        // Store current transform
        const currentTransform = svg.style.transform || '';
        
        // Simple pulse animation
        svg.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        svg.style.transform = currentTransform + ' scale(1.05)';
        svg.style.opacity = '0.8';
        
        setTimeout(() => {
          svg.style.transform = currentTransform;
          svg.style.opacity = '1';
        }, 300);
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
      >
        <ZoomInIcon size={16} />
        Zoom In
      </button>
      
      <button
        className="mermaid-btn"
        onClick={handleZoomOut}
        title="Zoom Out"
      >
        <ZoomOutIcon size={16} />
        Zoom Out
      </button>
      
      <button
        className="mermaid-btn"
        onClick={handleResetView}
        title="Reset View"
      >
        <ResetIcon size={16} />
        Reset View
      </button>
      
      <button
        className="mermaid-btn"
        onClick={handleReplay}
        title="Replay Animation"
      >
        <PlayIcon size={16} />
        Replay
      </button>
    </div>
  );
} 