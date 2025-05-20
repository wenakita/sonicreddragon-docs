import React, { type ReactNode, useEffect, useRef } from 'react';
import Mermaid from '@theme-original/Mermaid';
import type MermaidType from '@theme/Mermaid';
import type {WrapperProps} from '@docusaurus/types';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';

type Props = WrapperProps<typeof MermaidType>;

export default function MermaidWrapper(props: Props): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();
  
  // Add post-processing effects for rendered diagrams
  useEffect(() => {
    if (!isBrowser || !containerRef.current) {
      return;
    }
    
    // Get the svg after mermaid renders it
    const checkForSvg = () => {
      const svg = containerRef.current?.querySelector('svg');
      if (svg) {
        console.log('Enhancing mermaid diagram');
        
        // Add enhanced styling
        svg.classList.add(styles.enhancedDiagram);
        
        // Make sure diagram is responsive
        if (!svg.hasAttribute('width')) {
          svg.setAttribute('width', '100%');
        }
        
        if (!svg.hasAttribute('height')) {
          svg.setAttribute('height', 'auto');
        }
      } else {
        // If not found yet, try again after a short delay
        setTimeout(checkForSvg, 200);
      }
    };
    
    // Start checking for the SVG
    checkForSvg();
  }, [isBrowser]);
  
  return (
    <div ref={containerRef} className={styles.mermaidContainer}>
      <Mermaid {...props} />
    </div>
  );
}
