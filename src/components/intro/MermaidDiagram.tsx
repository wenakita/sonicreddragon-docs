import React from 'react';
import Mermaid from '@theme/Mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  return (
    <div className={className}>
      <Mermaid value={chart} />
    </div>
  );
} 