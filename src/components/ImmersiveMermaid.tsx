import React, { useEffect, useRef, useState } from 'react';
import { 
  animateMermaidDiagram, 
  addMermaidInteractivity, 
  addMermaidControls, 
  addParticleEffects,
  addMermaidGlowEffect,
  prefersReducedMotion
} from '../utils/enhancedMermaidAnimations';
import styles from './ImmersiveMermaid.module.css';

interface ImmersiveMermaidProps {
  chart: string;
  title?: string;
  caption?: string;
  animated?: boolean;
  interactive?: boolean;
  showControls?: boolean;
  particles?: boolean;
  glow?: boolean;
  className?: string;
}

/**
 * ImmersiveMermaid component renders an immersive, animated Mermaid diagram
 * with interactive features, controls, and particle effects
 */
export default function ImmersiveMermaid({
  chart,
  title,
  caption,
  animated = true,
  interactive = true,
  showControls = true,
  particles = true,
  glow = true,
  className = '',
}: ImmersiveMermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cleanupFn, setCleanupFn] = useState<(() => void) | null>(null);

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
            nodeSpacing: 60,
            rankSpacing: 80,
            curve: 'basis',
          },
          sequence: {
            useMaxWidth: true,
            wrap: true,
            actorMargin: 80,
            boxMargin: 20,
            mirrorActors: false,
            bottomMarginAdj: 10,
          },
          er: {
            layoutDirection: 'LR',
            entityPadding: 30,
            useMaxWidth: true,
          },
          gantt: {
            leftPadding: 75,
            rightPadding: 20,
            topPadding: 20,
            gridLineStartPadding: 35,
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

        // Check if user prefers reduced motion
        const reducedMotion = prefersReducedMotion();

        // Apply animations if enabled and not reduced motion
        if (animated && !reducedMotion) {
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

        // Add glow effect if enabled
        if (glow && !reducedMotion) {
          addMermaidGlowEffect(diagramContainer as HTMLElement);
        }

        // Add particle effects if enabled and not reduced motion
        if (particles && !reducedMotion && canvasRef.current) {
          // Clean up previous particle effects
          if (cleanupFn) {
            cleanupFn();
          }

          // Add new particle effects
          const cleanup = addParticleEffects(canvasRef.current, {
            particleCount: 20,
            color: '#3b82f6',
            size: 1.5,
            speed: 0.3,
            opacity: 0.2,
            linkOpacity: 0.1,
            linkDistance: 120
          });

          // Save cleanup function
          setCleanupFn(() => cleanup);
        }
      } catch (err) {
        console.error('Error rendering Mermaid diagram:', err);
        setError(`Error rendering diagram: ${err.message}`);
      }
    };

    renderMermaid();

    // Cleanup function
    return () => {
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [chart, animated, interactive, showControls, particles, glow]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''} ${styles.gradientBorder} ${className}`}
      ref={containerRef}
    >
      {title && <h3 className={styles.title}>{title}</h3>}
      
      <div className={styles.diagramContainer}>
        <div className={styles.canvasContainer} ref={canvasRef}></div>
        
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
