import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import ModernMermaid from '@site/src/components/ModernMermaid';
import ImmersiveMermaid from '@site/src/components/ImmersiveMermaid';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Map the "immersive-diagram" container to our ImmersiveMermaid component
  'immersive-diagram': ({children}) => {
    // Extract the mermaid code and any title/caption from children
    let chart = '';
    let title = '';
    let caption = '';
    
    React.Children.forEach(children, child => {
      if (typeof child === 'object' && child.props) {
        // Check if it's a mermaid code block
        if (child.props.className === 'language-mermaid' || 
            (child.props.children && child.props.children.props && 
             child.props.children.props.className === 'language-mermaid')) {
          // Extract the chart content
          chart = child.props.children?.props?.children || child.props.children;
        }
        // Check if it's a title
        else if (child.props.className === 'diagram-title') {
          title = child.props.children;
        }
        // Check if it's a caption
        else if (child.props.className === 'diagram-caption') {
          caption = child.props.children;
        }
      }
    });
    
    // If we found a mermaid chart, render it with our component
    if (chart) {
      return (
        <ImmersiveMermaid 
          chart={chart} 
          title={title} 
          caption={caption} 
          animated={true}
          interactive={true}
          showControls={true}
          particles={true}
          glow={true}
        />
      );
    }
    
    // Otherwise, just render the children
    return <div className="immersive-diagram">{children}</div>;
  },
  // Override the default mermaid component with our ModernMermaid component
  'mermaid': ({children}) => {
    return (
      <ModernMermaid 
        chart={children} 
        animated={true}
        interactive={true}
        showControls={true}
      />
    );
  },
};
