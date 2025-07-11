import React, { useEffect, useRef, useState } from 'react';
import { anime, useAnimationPerformance } from '../utils/animationUtils';
import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';

/**
 * AnimatedDiagram component - adds anime.js animations to enhance Mermaid diagrams
 * 
 * @param {Object} props
 * @param {string} props.title - Optional title for the animation
 * @param {string} props.description - Optional description
 * @param {string} props.className - Optional additional CSS class
 */
export default function AnimatedDiagram({ title, description, className, children }) {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const isBrowser = useIsBrowser();
  const [hasRun, setHasRun] = useState(false);
  
  useEffect(() => {
    if (!isBrowser || !containerRef.current) return;
    
    // Give DOM time to fully render
    const timer = setTimeout(() => {
      const elements = containerRef.current.querySelectorAll('.animated-element');
      
      console.log('Found animated elements:', elements.length);
      
      // Clean up previous animation
      if (animationRef.current) {
        animationRef.current.pause();
      }
      
      // Create animation timeline
      animationRef.current = anime.timeline({
        easing: 'easeOutElastic(1, .8)',
        duration: 800,
        loop: false,
        complete: () => {
          setHasRun(true);
          // Create secondary animation that repeats
          anime({
            targets: containerRef.current.querySelectorAll('.pulse-element'),
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1],
            duration: 2000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine',
            delay: anime.stagger(100)
          });
        }
      });
      
      // Add animations to timeline
      animationRef.current
        .add({
          targets: elements,
          translateY: [20, 0],
          opacity: [0, 1],
          delay: anime.stagger(150)
        })
        .add({
          targets: containerRef.current.querySelectorAll('.connection-line'),
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutSine',
          duration: 700,
          delay: function(el, i) { return i * 250 }
        }, '-=400')
        .add({
          targets: containerRef.current.querySelectorAll('.highlight-element'),
          backgroundColor: ['rgba(74, 128, 209, 0.2)', 'rgba(74, 128, 209, 0.6)'],
          boxShadow: ['0 0 0 rgba(74, 128, 209, 0)', '0 0 10px rgba(74, 128, 209, 0.5)'],
          easing: 'easeOutExpo',
          duration: 600
        }, '-=300');
      
      // Start the animation
      animationRef.current.play();
    }, 500);
    
    // Clean up animation on unmount
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [isBrowser]);
  
  return (
    <div 
      ref={containerRef} 
      className={`${styles.animatedDiagramContainer || ''} ${className || ''}`}
    >
      {title && <h3 className={styles.animationTitle || ''}>{title}</h3>}
      {description && <p className={styles.animationDescription || ''}>{description}</p>}
      
      <div className={styles.animatedContent || ''}>
        {children}
      </div>
      
      {!hasRun && isBrowser && (
        <div className={styles.animationLoading}>
          Initializing animation...
        </div>
      )}
    </div>
  );
}

/**
 * AnimatedNode component - a pre-styled animated element
 */
export function AnimatedNode({ label, className, highlight, pulse, id }) {
  const classes = [
    styles.animatedNode || '',
    'animated-element',
    className || '',
    highlight ? 'highlight-element' : '',
    pulse ? 'pulse-element' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes} id={id || undefined}>
      {label}
    </div>
  );
}

/**
 * AnimatedConnection component - creates a line between nodes
 */
export function AnimatedConnection({ start, end, label }) {
  const pathRef = useRef(null);
  const isBrowser = useIsBrowser();
  
  useEffect(() => {
    if (!isBrowser || !pathRef.current) return;
    
    // Draw connection in next frame after DOM layout
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        const startEl = document.getElementById(start);
        const endEl = document.getElementById(end);
        
        if (!startEl || !endEl) {
          console.warn(`AnimatedConnection: Could not find elements with ids ${start} and ${end}`);
          return;
        }
        
        const startRect = startEl.getBoundingClientRect();
        const endRect = endEl.getBoundingClientRect();
        
        // Calculate positions
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;
        const endX = endRect.left + endRect.width / 2;
        const endY = endRect.top + endRect.height / 2;
        
        // Create SVG path
        pathRef.current.setAttribute(
          'd',
          `M${startX},${startY} C${startX},${startY + 50} ${endX},${endY - 50} ${endX},${endY}`
        );
      });
    }, 1000); // Longer delay to ensure nodes are positioned
    
    return () => clearTimeout(timer);
  }, [isBrowser, start, end]);
  
  return (
    <svg className={styles.connectionSvg || ''} style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'}}>
      <path
        ref={pathRef}
        className="connection-line"
        stroke="var(--ifm-color-primary)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,5"
      />
      {label && (
        <text className={`animated-element ${styles.connectionLabel || ''}`} textAnchor="middle" dy="-5">
          <textPath href="#path" startOffset="50%">
            {label}
          </textPath>
        </text>
      )}
    </svg>
  );
} 