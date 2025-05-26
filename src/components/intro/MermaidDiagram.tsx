import React, { useEffect, useRef } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

declare global {
  interface Window {
    mermaid?: {
      init: (config: any, elements: HTMLElement | HTMLElement[]) => void;
    };
  }
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!isBrowser || !elementRef.current) return;

    const element = elementRef.current;
    
    // Set the mermaid content
    element.textContent = chart;
    element.className = `mermaid ${className}`;
    
    // Initialize mermaid if available
    if (window.mermaid) {
      try {
        window.mermaid.init(undefined, element);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    }
  }, [chart, className, isBrowser]);

  if (!isBrowser) {
    return (
      <div className={`mermaid ${className}`}>
        {chart}
      </div>
    );
  }

  return <div ref={elementRef} className={`mermaid ${className}`} />;
} 