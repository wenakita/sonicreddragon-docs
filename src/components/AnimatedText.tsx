/**
 * AnimatedText Component
 * 
 * A component that animates text with various effects.
 */

import React, { useEffect, useRef, ElementType } from 'react';
import { prefersReducedMotion } from '../utils/accessibilityUtils';
import anime from 'animejs';

interface AnimatedTextProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'typing' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  splitBy?: 'chars' | 'words' | 'lines' | 'none';
  staggerDelay?: number;
  easing?: string;
  once?: boolean;
  children?: React.ReactNode;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  tag = 'p',
  animation = 'fadeIn',
  delay = 0,
  duration = 800,
  className = '',
  splitBy = 'none',
  staggerDelay = 30,
  easing = 'cubicBezier(0.22, 1, 0.36, 1)',
  once = true,
  children,
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef<boolean>(false);
  
  useEffect(() => {
    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion()) return;
    
    // Skip if already animated and once is true
    if (once && hasAnimated.current) return;
    
    const element = elementRef.current;
    if (!element) return;
    
    // Set has animated flag
    hasAnimated.current = true;
    
    // Handle different animation types
    switch (animation) {
      case 'typing':
        handleTypingAnimation(element);
        break;
      case 'none':
        // No animation
        break;
      default:
        handleStandardAnimation(element);
        break;
    }
  }, [animation, delay, duration, easing, once, splitBy, staggerDelay, text]);
  
  // Handle typing animation
  const handleTypingAnimation = (element: HTMLElement) => {
    // Clear element content
    element.innerHTML = '';
    
    // Create wrapper for cursor
    const wrapper = document.createElement('span');
    wrapper.style.position = 'relative';
    
    // Create text span
    const textSpan = document.createElement('span');
    wrapper.appendChild(textSpan);
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.position = 'absolute';
    cursor.style.right = '-4px';
    cursor.style.top = '0';
    cursor.style.animation = 'cursorBlink 1s infinite';
    wrapper.appendChild(cursor);
    
    // Add wrapper to element
    element.appendChild(wrapper);
    
    // Add cursor blink animation if it doesn't exist
    if (!document.getElementById('cursor-blink-animation')) {
      const style = document.createElement('style');
      style.id = 'cursor-blink-animation';
      style.textContent = `
        @keyframes cursorBlink {
          0%, 70% { opacity: 1; }
          71%, 100% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Start typing after delay
    setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          textSpan.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 50);
    }, delay);
  };
  
  // Handle standard animations (fade, slide, etc.)
  const handleStandardAnimation = (element: HTMLElement) => {
    // Prepare animation targets based on split option
    let targets: HTMLElement | HTMLElement[] = element;
    
    if (splitBy !== 'none') {
      // Clear element content
      const originalHTML = element.innerHTML;
      element.innerHTML = '';
      
      // Split text based on option
      let splitText: string[] = [];
      
      switch (splitBy) {
        case 'chars':
          splitText = text.split('');
          break;
        case 'words':
          splitText = text.split(/\s+/);
          break;
        case 'lines':
          splitText = text.split(/\n/);
          break;
        default:
          splitText = [text];
      }
      
      // Create spans for each split item
      const spans: HTMLSpanElement[] = [];
      
      splitText.forEach((item, index) => {
        const span = document.createElement('span');
        span.textContent = item;
        
        if (splitBy === 'words' || splitBy === 'lines') {
          // Add space or newline after each item except the last
          if (index < splitText.length - 1) {
            if (splitBy === 'words') {
              span.textContent += ' ';
            } else if (splitBy === 'lines') {
              span.textContent += '\n';
            }
          }
        }
        
        // Set initial style
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        
        // Add to element
        element.appendChild(span);
        spans.push(span);
      });
      
      // Update targets to spans
      targets = spans;
    } else {
      // Set initial style for whole element
      element.style.opacity = '0';
    }
    
    // Create animation based on type
    let animationProps: any = {};
    
    switch (animation) {
      case 'fadeIn':
        animationProps = {
          opacity: [0, 1],
        };
        break;
      case 'fadeInUp':
        animationProps = {
          opacity: [0, 1],
          translateY: [20, 0],
        };
        break;
      case 'fadeInDown':
        animationProps = {
          opacity: [0, 1],
          translateY: [-20, 0],
        };
        break;
      case 'fadeInLeft':
        animationProps = {
          opacity: [0, 1],
          translateX: [-20, 0],
        };
        break;
      case 'fadeInRight':
        animationProps = {
          opacity: [0, 1],
          translateX: [20, 0],
        };
        break;
      default:
        animationProps = {
          opacity: [0, 1],
        };
    }
    
    // Create animation
    anime({
      targets,
      ...animationProps,
      duration,
      delay: splitBy !== 'none' ? anime.stagger(staggerDelay, { start: delay }) : delay,
      easing,
    });
  };
  
  // Render the component with the specified tag
  const Component = tag as ElementType;
  
  return (
    <Component ref={elementRef as any} className={className}>
      {children || text}
    </Component>
  );
};

export default AnimatedText;
