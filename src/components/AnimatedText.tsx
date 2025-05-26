import React, { useRef, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useIsBrowser from '@docusaurus/useIsBrowser';
import clsx from 'clsx';

interface AnimatedTextProps {
  children: string;
  animation?: 'typewriter' | 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'scale' | 'wave' | 'glow';
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  loop?: boolean;
  autoPlay?: boolean;
}

export default function AnimatedText({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 1000,
  className,
  as: Component = 'div',
  loop = false,
  autoPlay = true
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!isBrowser || !textRef.current || !autoPlay) return;

    const element = textRef.current;
    
    // Clear any existing content and prepare for animation
    element.innerHTML = '';
    
    switch (animation) {
      case 'typewriter':
        animateTypewriter(element, children, duration, delay, loop);
        break;
      case 'fadeInUp':
        animateFadeInUp(element, children, duration, delay);
        break;
      case 'slideInLeft':
        animateSlideIn(element, children, duration, delay, 'left');
        break;
      case 'slideInRight':
        animateSlideIn(element, children, duration, delay, 'right');
        break;
      case 'scale':
        animateScale(element, children, duration, delay);
        break;
      case 'wave':
        animateWave(element, children, duration, delay, loop);
        break;
      case 'glow':
        animateGlow(element, children, duration, delay, loop);
        break;
      default:
        element.textContent = children;
    }
  }, [isBrowser, children, animation, delay, duration, loop, autoPlay]);

  const animateTypewriter = (element: HTMLElement, text: string, duration: number, delay: number, loop: boolean) => {
    element.textContent = '';
    const chars = text.split('');
    
    const typeAnimation = () => {
      element.textContent = '';
      chars.forEach((char, index) => {
        setTimeout(() => {
          element.textContent += char;
          if (index === chars.length - 1 && loop) {
            setTimeout(() => {
              element.textContent = '';
              setTimeout(typeAnimation, 500);
            }, 2000);
          }
        }, (duration / chars.length) * index + delay);
      });
    };
    
    typeAnimation();
  };

  const animateFadeInUp = (element: HTMLElement, text: string, duration: number, delay: number) => {
    element.textContent = text;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    anime({
      targets: element,
      opacity: [0, 1],
      translateY: [20, 0],
      duration,
      delay,
      easing: 'easeOutExpo'
    });
  };

  const animateSlideIn = (element: HTMLElement, text: string, duration: number, delay: number, direction: 'left' | 'right') => {
    element.textContent = text;
    element.style.opacity = '0';
    element.style.transform = direction === 'left' ? 'translateX(-30px)' : 'translateX(30px)';
    
    anime({
      targets: element,
      opacity: [0, 1],
      translateX: [direction === 'left' ? -30 : 30, 0],
      duration,
      delay,
      easing: 'easeOutCubic'
    });
  };

  const animateScale = (element: HTMLElement, text: string, duration: number, delay: number) => {
    element.textContent = text;
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    
    anime({
      targets: element,
      opacity: [0, 1],
      scale: [0.8, 1],
      duration,
      delay,
      easing: 'easeOutBack'
    });
  };

  const animateWave = (element: HTMLElement, text: string, duration: number, delay: number, loop: boolean) => {
    element.innerHTML = '';
    const chars = text.split('').map((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      element.appendChild(span);
      return span;
    });

    const waveAnimation = () => {
      anime({
        targets: chars,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: anime.stagger(50, { start: delay }),
        easing: 'easeOutExpo',
        complete: () => {
          if (loop) {
            setTimeout(() => {
              anime({
                targets: chars,
                opacity: [1, 0],
                translateY: [0, -20],
                duration: 400,
                delay: anime.stagger(30),
                easing: 'easeInExpo',
                complete: () => {
                  setTimeout(waveAnimation, 500);
                }
              });
            }, 2000);
          }
        }
      });
    };

    waveAnimation();
  };

  const animateGlow = (element: HTMLElement, text: string, duration: number, delay: number, loop: boolean) => {
    element.textContent = text;
    element.style.opacity = '0';
    element.style.textShadow = '0 0 0px currentColor';
    
    const glowAnimation = () => {
      anime({
        targets: element,
        opacity: [0, 1],
        textShadow: [
          '0 0 0px currentColor',
          '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor'
        ],
        duration,
        delay,
        easing: 'easeOutExpo',
        complete: () => {
          if (loop) {
            setTimeout(() => {
              anime({
                targets: element,
                textShadow: [
                  '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
                  '0 0 0px currentColor'
                ],
                duration: duration / 2,
                easing: 'easeInExpo',
                complete: () => {
                  setTimeout(glowAnimation, 500);
                }
              });
            }, 2000);
          }
        }
      });
    };

    glowAnimation();
  };

  const classes = clsx(
    'animated-text',
    `animated-text--${animation}`,
    className
  );

  return React.createElement(Component, {
    ref: textRef,
    className: classes,
    style: {
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden'
    }
  });
} 