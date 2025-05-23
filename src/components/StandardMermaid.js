import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './StandardMermaid.module.css';

/**
 * StandardMermaid - An enhanced, modern Mermaid diagram component 
 * with improved error handling, animations and elegant styling
 */

// Initialize mermaid with our custom config
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    useMaxWidth: false
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 80,
    width: 150,
    height: 65,
    boxMargin: 10,
    messageMargin: 35,
    boxTextMargin: 15,
    noteMargin: 10
  },
  themeVariables: {
    primaryColor: '#4a80d1',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#4a80d1',
    lineColor: '#4a80d1',
    secondaryColor: '#6c8ebf',
    tertiaryColor: '#f5f7fa'
  }
});

const DiagramRenderer = ({ chart, className }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Using the mermaid API to render the diagram
        const { svg } = await mermaid.render('mermaid-svg-' + Math.random().toString(36).substr(2, 9), chart);
        setSvg(svg);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [chart]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingIndicator}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h4>Failed to render diagram</h4>
        <p>There was an error rendering the Mermaid diagram:</p>
        <pre>{error.message || 'Unknown error'}</pre>
        <details>
          <summary>Diagram Source</summary>
          <pre>{chart}</pre>
        </details>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.diagramContainer} ${className || ''} standard-mermaid-container`} 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

// Wrap in BrowserOnly to avoid SSR issues
const StandardMermaid = (props) => {
  return (
    <BrowserOnly>
      {() => <DiagramRenderer {...props} />}
    </BrowserOnly>
  );
};

export default StandardMermaid; 