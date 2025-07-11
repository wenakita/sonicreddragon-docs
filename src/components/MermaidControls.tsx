import React from 'react';
import styles from './MermaidControls.module.css';

export interface MermaidControlsProps {
  onReplay: () => void;
  onFullscreen: () => void;
  onDownload: () => void;
  isFullscreen: boolean;
}

/**
 * MermaidControls - Control buttons for Mermaid diagrams
 * 
 * Provides buttons for replaying animations, toggling fullscreen mode,
 * and downloading the diagram as SVG.
 */
const MermaidControls: React.FC<MermaidControlsProps> = ({
  onReplay,
  onFullscreen,
  onDownload,
  isFullscreen,
}) => {
  return (
    <div className={styles.controls}>
      <button 
        className={styles.controlButton} 
        onClick={onReplay}
        title="Replay animation"
        aria-label="Replay animation"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
      </button>
      
      <button 
        className={styles.controlButton} 
        onClick={onFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        )}
      </button>
      
      <button 
        className={styles.controlButton} 
        onClick={onDownload}
        title="Download SVG"
        aria-label="Download SVG"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
        </svg>
      </button>
    </div>
  );
};

export default MermaidControls;
