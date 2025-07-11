import React, { useRef, useEffect, useState } from 'react';
import { anime, useAnimationPerformance } from '../utils/animationUtils';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface ScrollRevealWrapperProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scale' | 'slideUp' | 'slideLeft' | 'slideRight';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  stagger?: boolean;
  staggerDelay?: number;
}

/**
 * ScrollRevealWrapper - A component that reveals its children when scrolled into view
 * 
 * This component uses IntersectionObserver to detect when it's in the viewport,
 * then animates its children using the unified animation system.
 */
export default function ScrollRevealWrapper({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  stagger = false,
  staggerDelay = 100
}: ScrollRevealWrapperProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isBrowser = useIsBrowser();
  const { prefersReducedMotion, getOptimalDuration } = useAnimationPerformance();

  useEffect(() => {
    if (!isBrowser || !elementRef.current) return;
    
    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) {
      // Make content immediately visible without animation
      if (elementRef.current) {
        elementRef.current.style.opacity = '1';
        elementRef.current.style.transform = 'none';
      }
      return;
    }

    const element = elementRef.current;
    
    // Set initial state based on animation type
    const initialState = getInitialState(animation);
    Object.assign(element.style, initialState);

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            
            // Get animation targets
            const targets = stagger 
              ? Array.from(element.children).length > 0 
                ? Array.from(element.children)
                : [element]
              : [element];

            // Animate to visible state
            const animationConfig = getAnimationConfig(animation, getOptimalDuration(duration), delay, stagger, staggerDelay);
            
            anime({
              targets,
              ...animationConfig,
              easing: 'easeOutExpo'
            });
            
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!entry.isIntersecting && !triggerOnce && isVisible) {
            // Reset to hidden state if not triggerOnce
            setIsVisible(false);
            Object.assign(element.style, initialState);
          }
        });
      },
      { 
        threshold,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isBrowser, animation, duration, delay, triggerOnce, threshold, isVisible, stagger, staggerDelay, prefersReducedMotion, getOptimalDuration]);

  const getInitialState = (animationType: string) => {
    // If user prefers reduced motion, don't apply initial transforms
    if (prefersReducedMotion) {
      return { opacity: '1' };
    }
    
    const base = { 
      opacity: '0',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden' as const
    };
    
    switch (animationType) {
      case 'fadeInUp':
      case 'slideUp':
        return { ...base, transform: 'translateY(30px)' };
      case 'fadeInLeft':
      case 'slideLeft':
        return { ...base, transform: 'translateX(-30px)' };
      case 'fadeInRight':
      case 'slideRight':
        return { ...base, transform: 'translateX(30px)' };
      case 'scale':
        return { ...base, transform: 'scale(0.9)' };
      default:
        return base;
    }
  };

  const getAnimationConfig = (animationType: string, dur: number, del: number, useStagger: boolean, staggerDel: number) => {
    const base = { 
      opacity: 1, 
      duration: dur, 
      delay: useStagger ? anime.stagger(staggerDel, { start: del }) : del
    };
    
    switch (animationType) {
      case 'fadeInUp':
      case 'slideUp':
        return { ...base, translateY: 0 };
      case 'fadeInLeft':
      case 'slideLeft':
        return { ...base, translateX: 0 };
      case 'fadeInRight':
      case 'slideRight':
        return { ...base, translateX: 0 };
      case 'scale':
        return { ...base, scale: 1 };
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
