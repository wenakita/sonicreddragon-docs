import React from 'react';
import UnifiedMermaid from '../UnifiedMermaid';

interface MermaidDiagramProps {
  chart: string;
  title?: string;
  caption?: string;
  className?: string;
  animated?: boolean;
  interactive?: boolean;
  particles?: boolean;
}

/**
 * UnifiedMermaidDiagram - A simple wrapper around UnifiedMermaid for the intro section
 * 
 * This component provides a consistent way to render Mermaid diagrams in the intro section.
 */
export default function UnifiedMermaidDiagram({
  chart,
  title,
  caption,
  className = '',
  animated = true,
  interactive = true,
  particles = false,
}: MermaidDiagramProps) {
  return (
    <UnifiedMermaid
      chart={chart}
      title={title}
      caption={caption}
      animated={animated}
      interactive={interactive}
      particles={particles}
      className={className}
    />
  );
}
