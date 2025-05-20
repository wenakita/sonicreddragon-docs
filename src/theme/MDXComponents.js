import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import StandardMermaid from '@site/src/components/StandardMermaid';
import EnhancedMermaid from '@site/src/components/EnhancedMermaid';
import AnimatedCard from '@site/src/components/AnimatedCard';
import MermaidWrapper from '@site/src/components/MermaidWrapper';

export default {
  // Re-export the default MDXComponents
  ...MDXComponents,
  // Register our custom components for global use in MDX
  StandardMermaid,
  EnhancedMermaid,
  AnimatedCard,
  MermaidWrapper,
  
  // Override code blocks to make sure Mermaid gets processed correctly
  code: (props) => {
    const {children, className} = props;
    
    // Directly handle Mermaid code blocks
    if (className === 'language-mermaid') {
      return (
        <div className="mermaid-container">
          <div className="mermaid">
            {children}
          </div>
        </div>
      );
    }
    
    // Use default for all other code blocks
    return <MDXComponents.code {...props} />;
  },
  
  // Also handle pre blocks for backward compatibility
  pre: (props) => {
    const { children, ...rest } = props;
    
    // Check if this is a mermaid code block
    if (
      children &&
      children.props &&
      children.props.mdxType === 'code' &&
      children.props.className === 'language-mermaid'
    ) {
      const mermaidCode = children.props.children.trim();
      return <StandardMermaid chart={mermaidCode} />;
    }
    
    // Otherwise, render the normal pre
    return <MDXComponents.pre {...rest}>{children}</MDXComponents.pre>;
  }
}; 