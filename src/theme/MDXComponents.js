import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import UnifiedMermaid from '@site/src/components/UnifiedMermaid';

// Helper function to safely extract content from children
const extractMermaidContent = (children) => {
  // If children is a string, return it directly
  if (typeof children === 'string') {
    return children;
  }
  
  // If children is an array, look for mermaid content
  if (Array.isArray(children)) {
    // Find the mermaid code block
    for (const child of children) {
      // Check if this is a mermaid code block
      if (child?.props?.className === 'language-mermaid' && child?.props?.children) {
        return child.props.children;
      }
      
      // Check if this is a pre > code structure
      if (child?.props?.children) {
        const nestedContent = extractMermaidContent(child.props.children);
        if (nestedContent) return nestedContent;
      }
    }
  }
  
  // If we get here, no mermaid content was found
  return '';
};

// Helper function to safely extract text content
const extractTextContent = (element) => {
  if (!element) return '';
  
  if (typeof element === 'string') {
    return element;
  }
  
  if (typeof element === 'object' && element?.props?.children) {
    if (typeof element.props.children === 'string') {
      return element.props.children;
    }
    
    if (Array.isArray(element.props.children)) {
      return element.props.children
        .map(extractTextContent)
        .filter(Boolean)
        .join(' ');
    }
  }
  
  return '';
};

export default {
  ...MDXComponents,
  
  // Simplified modern-diagram component
  'modern-diagram': (props) => {
    const { children, title, caption, ...rest } = props;
    const chart = extractMermaidContent(children);
    
    return (
      <UnifiedMermaid
        chart={chart}
        title={title}
        caption={caption}
        animated={true}
        interactive={true}
        particles={false}
        {...rest}
      />
    );
  },
  
  // Simplified immersive-diagram component
  'immersive-diagram': (props) => {
    const { children, title, caption, ...rest } = props;
    const chart = extractMermaidContent(children);
    
    return (
      <UnifiedMermaid
        chart={chart}
        title={title}
        caption={caption}
        animated={true}
        interactive={true}
        particles={true}
        {...rest}
      />
    );
  },
  
  // Improved div component with more robust parsing
  div: (props) => {
    const { children, ...rest } = props;
    
    // Check if this is an immersive diagram div
    if (props['data-immersive'] !== undefined) {
      // Extract props from data attributes
      const dataProps = {
        title: props['data-title'] || '',
        caption: props['data-caption'] || '',
        animated: props['data-animated'] !== 'false',
        interactive: props['data-interactive'] !== 'false',
        particles: props['data-particles'] === 'true',
        className: props.className || '',
      };
      
      // Extract chart content
      const chart = extractMermaidContent(children);
      
      // If no chart content was found, fall back to regular div
      if (!chart) {
        return <div {...rest}>{children}</div>;
      }
      
      // If no title was provided via data attribute, try to find it in children
      if (!dataProps.title && Array.isArray(children)) {
        const titleElement = children.find(
          child => child?.type === 'h3' || child?.props?.mdxType === 'h3'
        );
        
        if (titleElement) {
          dataProps.title = extractTextContent(titleElement);
        }
      }
      
      // If no caption was provided via data attribute, try to find it in children
      if (!dataProps.caption && Array.isArray(children)) {
        const captionElement = children.find(
          child => (child?.type === 'p' || child?.props?.mdxType === 'p') && 
                  (!child?.props?.className || !child?.props?.className.includes('mermaid'))
        );
        
        if (captionElement) {
          dataProps.caption = extractTextContent(captionElement);
        }
      }
      
      // Use the UnifiedMermaid component
      return <UnifiedMermaid chart={chart} {...dataProps} />;
    }
    
    // Regular div, pass through to default handler
    return <div {...rest}>{children}</div>;
  },
};
