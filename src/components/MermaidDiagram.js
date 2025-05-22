/**
 * MermaidDiagram Component (Compatibility Layer)
 * 
 * This component forwards to EnhancedMermaid to maintain backward compatibility
 * while we transition documentation to use EnhancedMermaid directly.
 */
import React from 'react';
import EnhancedMermaid from './EnhancedMermaid';

// Simple wrapper that passes all props to EnhancedMermaid
export default function MermaidDiagram(props) {
  console.warn(
    'MermaidDiagram is deprecated. Please use EnhancedMermaid instead. ' +
    'This compatibility layer will be removed in a future update.'
  );
  
  return <EnhancedMermaid {...props} />;
} 