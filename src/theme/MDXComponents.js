import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import EnhancedMermaid from '@site/src/components/EnhancedMermaid';

export default {
  // Re-export the default MDXComponents
  ...MDXComponents,
  // Register our custom components for global use in MDX
  EnhancedMermaid,
  
  // Override code blocks to make sure Mermaid gets processed correctly
  code: (props) => {
    const { children, className } = props;
    
    // Directly handle Mermaid code blocks
    if (className === 'language-mermaid') {
      const diagramCode = children?.trim();
      if (!diagramCode) {
        return <div className="mermaid-error">Empty mermaid diagram</div>;
      }
      
      // Use our enhanced component
      return <EnhancedMermaid chart={diagramCode} />;
    }
    
    // Use default handling for other code blocks
    return <MDXComponents.code {...props} />;
  },
  
  // Override pre tag to handle Mermaid code blocks
  pre: (props) => {
    const { children } = props;
    
    // Check if this is a mermaid code block
    if (
      children?.props?.mdxType === 'code' &&
      children.props.className === 'language-mermaid'
    ) {
      const mermaidCode = children.props.children?.trim();
      if (!mermaidCode) {
        return <div className="mermaid-error">Empty mermaid diagram</div>;
      }
      
      return <EnhancedMermaid chart={mermaidCode} />;
    }
    
    // Use default handling for other pre blocks
    return <MDXComponents.pre {...props} />;
  },
}; 