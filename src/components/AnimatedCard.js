import React, { useEffect, useRef } from 'react';
import { anime, useAnimationPerformance } from '../utils/animationUtils';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';

/**
 * AnimatedCard component - an elegant, animated card using Anime.js
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.icon - Optional icon name (from available SVG icons)
 * @param {string} props.color - Optional color theme (default, primary, success, warning, danger)
 * @param {boolean} props.withHover - Enable hover animation effects
 */
export default function AnimatedCard({
  title,
  children,
  className,
  icon,
  color = 'default',
  withHover = true,
}) {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const isBrowser = useIsBrowser();
  
  // Animate on initial render
  useEffect(() => {
    if (!isBrowser || !cardRef.current) return;
    
    // Initial animation timeline
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 800
    });
    
    // Add card entrance animation
    timeline.add({
      targets: cardRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600
    });
    
    // Add icon animation if icon exists
    if (iconRef.current) {
      timeline.add({
        targets: iconRef.current,
        scale: [0.5, 1],
        opacity: [0, 1],
        rotate: [45, 0],
        duration: 700
      }, '-=400');
    }
    
    // Add title animation
    if (titleRef.current) {
      timeline.add({
        targets: titleRef.current,
        opacity: [0, 1],
        translateX: [10, 0],
        duration: 500
      }, '-=600');
    }
    
    // Add content animation
    if (contentRef.current) {
      const contentElements = contentRef.current.children;
      timeline.add({
        targets: contentElements,
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(100),
        duration: 500
      }, '-=400');
    }
    
    // Add hover effect if enabled
    if (withHover && cardRef.current) {
      // Mouse enter effect
      cardRef.current.addEventListener('mouseenter', () => {
        anime({
          targets: cardRef.current,
          scale: 1.02,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          duration: 300,
          easing: 'easeOutCubic'
        });
        
        // Animate icon if it exists
        if (iconRef.current) {
          anime({
            targets: iconRef.current,
            rotate: ['0deg', '5deg', '0deg', '-5deg', '0deg'],
            duration: 700,
            easing: 'easeInOutQuad'
          });
        }
      });
      
      // Mouse leave effect
      cardRef.current.addEventListener('mouseleave', () => {
        anime({
          targets: cardRef.current,
          scale: 1,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          duration: 300,
          easing: 'easeOutCubic'
        });
      });
    }
  }, [isBrowser, withHover]);
  
  // Determine color class based on the color prop
  const colorClass = color ? `cardColor--${color}` : '';
  
  // Combine class names
  const cardClasses = [
    styles.animatedCard || '',
    styles[colorClass] || '',
    className || '',
    withHover ? styles.withHover || '' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={cardRef} className={cardClasses}>
      {icon && (
        <div ref={iconRef} className={styles.cardIcon || ''}>
          {icon === 'security' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          )}
          {icon === 'token' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
            </svg>
          )}
          {icon === 'network' && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            </svg>
          )}
          {!['security', 'token', 'network'].includes(icon) && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          )}
        </div>
      )}
      
      {title && (
        <h3 ref={titleRef} className={styles.cardTitle || ''}>{title}</h3>
      )}
      
      <div ref={contentRef} className={styles.cardContent || ''}>
        {children}
      </div>
    </div>
  );
} 