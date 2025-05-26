import React, { useRef, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface SimpleScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export default function SimpleScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = 50,
  threshold = 0.1,
  triggerOnce = true,
  className = ''
}: SimpleScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!isBrowser || !elementRef.current) return;

    const element = elementRef.current;
    
    // Set initial state
    const initialState = getInitialState(direction, distance);
    Object.assign(element.style, initialState);

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate to visible state
            const animation = getAnimation(direction, distance, duration, delay);
            anime({
              targets: element,
              ...animation,
              easing: 'easeOutExpo'
            });
            
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            // Reset to hidden state
            Object.assign(element.style, initialState);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isBrowser, direction, distance, duration, delay, triggerOnce, threshold]);

  const getInitialState = (dir: string, dist: number) => {
    const base = { opacity: '0' };
    
    switch (dir) {
      case 'up':
        return { ...base, transform: `translateY(${dist}px)` };
      case 'down':
        return { ...base, transform: `translateY(-${dist}px)` };
      case 'left':
        return { ...base, transform: `translateX(${dist}px)` };
      case 'right':
        return { ...base, transform: `translateX(-${dist}px)` };
      case 'scale':
        return { ...base, transform: 'scale(0.8)' };
      case 'fade':
      default:
        return base;
    }
  };

  const getAnimation = (dir: string, dist: number, dur: number, del: number) => {
    const base = { opacity: 1, duration: dur, delay: del };
    
    switch (dir) {
      case 'up':
      case 'down':
        return { ...base, translateY: 0 };
      case 'left':
      case 'right':
        return { ...base, translateX: 0 };
      case 'scale':
        return { ...base, scale: 1 };
      case 'fade':
      default:
        return base;
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </div>
  );
} 