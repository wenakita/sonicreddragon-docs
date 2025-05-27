import React, { useEffect, useRef, useState } from 'react';
import Mermaid from '@theme/Mermaid';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface MermaidRendererProps {
  chart: string;
  className?: string;
  showControls?: boolean;
  title?: string;
  id?: string;
}

interface MermaidControlsProps {
  containerId: string;
}

// Consolidated Mermaid Controls Component
function MermaidControls({ containerId }: MermaidControlsProps) {
  const isBrowser = useIsBrowser();

  const handleZoomIn = () => {
    if (!isBrowser) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const svg = container.querySelector('svg');
    if (svg) {
      const currentTransform = svg.style.transform || '';
      const currentScale = parseFloat(currentTransform.match(/scale\(([\d.]+)\)/)?.[1] || '1');
      const newScale = Math.min(currentScale * 1.2, 3);
      
      const baseTransform = currentTransform.replace(/scale\([\d.]+\)/, '').trim();
      svg.style.transform = `${baseTransform} scale(${newScale})`.trim();
      svg.style.transformOrigin = 'center center';
      svg.style.transition = 'transform 0.3s ease-out';
    }
  };

  const handleZoomOut = () => {
    if (!isBrowser) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const svg = container.querySelector('svg');
    if (svg) {
      const currentTransform = svg.style.transform || '';
      const currentScale = parseFloat(currentTransform.match(/scale\(([\d.]+)\)/)?.[1] || '1');
      const newScale = Math.max(currentScale * 0.8, 0.5);
      
      const baseTransform = currentTransform.replace(/scale\([\d.]+\)/, '').trim();
      svg.style.transform = `${baseTransform} scale(${newScale})`.trim();
      svg.style.transformOrigin = 'center center';
      svg.style.transition = 'transform 0.3s ease-out';
    }
  };

  const handleResetView = () => {
    if (!isBrowser) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const svg = container.querySelector('svg');
    if (svg) {
      svg.style.transform = '';
      svg.style.transformOrigin = 'center center';
      svg.style.transition = 'transform 0.4s ease-out';
    }
  };

  const handleReplay = () => {
    if (!isBrowser) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const svg = container.querySelector('svg');
    if (svg) {
      const currentTransform = svg.style.transform || '';
      
      svg.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
      svg.style.transform = currentTransform + ' scale(1.05)';
      svg.style.opacity = '0.8';
      
      setTimeout(() => {
        svg.style.transform = currentTransform;
        svg.style.opacity = '1';
      }, 300);
    }
  };

  return (
    <div className="mermaid-controls">
      <button className="mermaid-btn" onClick={handleZoomIn} title="Zoom In">
        🔍+ Zoom In
      </button>
      <button className="mermaid-btn" onClick={handleZoomOut} title="Zoom Out">
        🔍- Zoom Out
      </button>
      <button className="mermaid-btn" onClick={handleResetView} title="Reset View">
        🔄 Reset View
      </button>
      <button className="mermaid-btn" onClick={handleReplay} title="Replay Animation">
        ▶️ Replay
      </button>
    </div>
  );
}

// Main Mermaid Renderer Component
export default function MermaidRenderer({ 
  chart, 
  className = '', 
  showControls = true, 
  title,
  id 
}: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerId] = useState(() => id || `mermaid-${Math.random().toString(36).substr(2, 9)}`);
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!isBrowser || !containerRef.current) return;

    // Apply security and styling configurations
    const svg = containerRef.current.querySelector('svg');
    if (svg) {
      svg.style.maxWidth = '100%';
      svg.style.height = 'auto';
      svg.style.transformOrigin = 'center center';
      svg.style.transition = 'transform 0.3s ease-out';
    }
  }, [isBrowser, chart]);

  return (
    <div className={`mermaid-renderer ${className}`}>
      {title && <h3 className="mermaid-title">{title}</h3>}
      
      {showControls && <MermaidControls containerId={containerId} />}
      
      <div 
        ref={containerRef}
        id={containerId}
        className="mermaid-container"
      >
        <Mermaid value={chart} />
      </div>
    </div>
  );
}

// Export individual components for backward compatibility
export { MermaidControls }; 