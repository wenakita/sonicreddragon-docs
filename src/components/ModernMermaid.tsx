import React, { useEffect, useRef, useState } from 'react';
import { animateMermaidDiagram, addMermaidInteractivity, addMermaidControls } from '../utils/enhancedMermaidAnimations';
import styles from './ModernMermaid.module.css';

interface ModernMermaidProps {
  chart: string;
  title?: string;
  caption?: string;
  animated?: boolean;
  interactive?: boolean;
  showControls?: boolean;
}

/**
 * ModernMermaid component renders a modern, animated Mermaid diagram
 * with interactive features and controls
 */
export default function ModernMermaid({
  chart,
  title,
  caption,
  animated = true,
  interactive = true,
  showControls = true,
}: ModernMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Render the Mermaid diagram
  useEffect(() => {
    if (!chart || !containerRef.current) return;

    const renderMermaid = async () => {
      try {
        // Import mermaid dynamically to avoid SSR issues
        const { default: mermaid } = await import('mermaid');

        // Configure mermaid
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            primaryColor: '#2A2A2A',
            primaryBorderColor: '#3b82f6',
            lineColor: '#3b82f6',
            secondaryColor: '#1A1A1A',
            tertiaryColor: '#0A0A0A',
            background: '#0A0A0A',
            mainBkg: '#2A2A2A',
            secondBkg: '#1A1A1A',
            textColor: '#FFFFFF',
            labelColor: '#FFFFFF',
            nodeTextColor: '#FFFFFF',
            edgeLabelBackground: '#1A1A1A',
            clusterBkg: 'rgba(59, 130, 246, 0.1)',
            clusterBorder: '#3b82f6',
            defaultLinkColor: '#3b82f6',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '14px',
          },
          flowchart: {
            htmlLabels: true,
            nodeSpacing: 50,
            rankSpacing: 50,
            curve: 'basis',
          },
          sequence: {
            useMaxWidth: true,
            wrap: true,
          }
        });

        // Clear previous content
        const diagramContainer = containerRef.current.querySelector(`.${styles.diagramContainer}`);
        if (diagramContainer) {
          diagramContainer.innerHTML = '';
        }

        // Create a div for mermaid
        const mermaidDiv = document.createElement('div');
        mermaidDiv.className = 'mermaid';
        mermaidDiv.textContent = chart;
        diagramContainer?.appendChild(mermaidDiv);

        // Render mermaid
        await mermaid.run();
        setIsRendered(true);
        setError(null);

        // Apply animations if enabled
        if (animated) {
          animateMermaidDiagram(diagramContainer as HTMLElement);
        }

        // Add interactive features if enabled
        if (interactive) {
          addMermaidInteractivity(diagramContainer as HTMLElement);
        }

        // Add controls if enabled
        if (showControls) {
          addMermaidControls(diagramContainer as HTMLElement);
        }
      } catch (err) {
        console.error('Error rendering Mermaid diagram:', err);
        setError(`Error rendering diagram: ${err.message}`);
      }
    };

    renderMermaid();
  }, [chart, animated, interactive, showControls]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Replay animation
  const replayAnimation = () => {
    if (containerRef.current) {
      const diagramContainer = containerRef.current.querySelector(`.${styles.diagramContainer}`);
      if (diagramContainer) {
        animateMermaidDiagram(diagramContainer as HTMLElement);
      }
    }
  };

  // Handle control button clicks
  useEffect(() => {
    if (!isRendered || !containerRef.current) return;

    const container = containerRef.current;
    
    // Find control buttons
    const replayButton = container.querySelector('.mermaid-control-button[title="Replay animation"]');
    const fullscreenButton = container.querySelector('.mermaid-control-button[title="Toggle fullscreen"]');
    
    // Add event listeners
    if (replayButton) {
      // Remove existing listeners
      const newReplayButton = replayButton.cloneNode(true);
      replayButton.parentNode?.replaceChild(newReplayButton, replayButton);
      
      // Add new listener
      newReplayButton.addEventListener('click', replayAnimation);
    }
    
    if (fullscreenButton) {
      // Remove existing listeners
      const newFullscreenButton = fullscreenButton.cloneNode(true);
      fullscreenButton.parentNode?.replaceChild(newFullscreenButton, fullscreenButton);
      
      // Add new listener
      newFullscreenButton.addEventListener('click', toggleFullscreen);
    }
    
    return () => {
      // Cleanup
      if (replayButton) {
        replayButton.removeEventListener('click', replayAnimation);
      }
      
      if (fullscreenButton) {
        fullscreenButton.removeEventListener('click', toggleFullscreen);
      }
    };
  }, [isRendered]);

  return (
    <div 
      className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''}`}
      ref={containerRef}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      
      <div 
        className={styles.diagramContainer}
        data-animated={animated}
        data-interactive={interactive}
      >
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <pre>{chart}</pre>
          </div>
        )}
      </div>
      
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
