/**
 * MermaidDiagram Component (Compatibility Layer)
 * 
 * This component forwards to EnhancedMermaid to maintain backward compatibility
 * while we transition documentation to use EnhancedMermaid directly.
 */
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import EnhancedMermaid from './EnhancedMermaid';

// Simple wrapper that passes all props to EnhancedMermaid
export default function MermaidDiagram(props) {
  // Forward warning to browser console only
  return (
    <BrowserOnly fallback={<div className="mermaid-loading">Loading diagram...</div>}>
      {() => {
        // Only log this warning in the browser console
        console.warn(
          'MermaidDiagram is deprecated. Please use EnhancedMermaid instead. ' +
          'This compatibility layer will be removed in a future update.'
        );
        
        return <EnhancedMermaid {...props} />;
      }}
    </BrowserOnly>
  );
} 