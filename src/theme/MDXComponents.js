import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import MermaidDiagram from '@site/src/components/MermaidDiagram';

// Custom mermaid code block renderer
function MermaidWrapper({children}) {
  // Extract the mermaid diagram code from the children
  const mermaidCode = React.Children.toArray(children)
    .filter(child => typeof child === 'string')
    .join('\n');

  return <MermaidDiagram chart={mermaidCode} />;
}

export default {
  ...MDXComponents,
  // Override the default mermaid code block with our custom component
  code: (props) => {
    const {children, className} = props;
    
    // Check if this is a mermaid code block
    const isMermaid = className?.includes('language-mermaid');
    
    if (isMermaid) {
      return <MermaidWrapper>{children}</MermaidWrapper>;
    }
    
    // Fall back to the default code block for other languages
    return <MDXComponents.code {...props} />;
  },
}; 