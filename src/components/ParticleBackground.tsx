import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface ParticleBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  animationSpeed?: number;
  colors?: string[];
  opacity?: number;
  className?: string;
}

export default function ParticleBackground({
  particleCount = 20,
  particleSize = 3,
  animationSpeed = 5000,
  colors = ['rgba(59, 130, 246, 0.6)', 'rgba(234, 88, 12, 0.6)', 'rgba(16, 185, 129, 0.6)'],
  opacity = 0.6,
  className = ''
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();

  useEffect(() => {
    if (!isBrowser || !containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = particleSize + Math.random() * 2;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        will-change: transform, opacity;
        z-index: 1;
      `;
      
      // Random starting position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      container.appendChild(particle);
      particles.push(particle);
      
      // Animate particle
      animateParticle(particle, animationSpeed);
    }

    // Cleanup function
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [isBrowser, particleCount, particleSize, animationSpeed, colors, opacity]);

  const animateParticle = (particle: HTMLDivElement, speed: number) => {
    const animation = () => {
      // Random movement pattern
      const moveX = (Math.random() - 0.5) * 200;
      const moveY = (Math.random() - 0.5) * 200;
      const scale = 0.5 + Math.random() * 1.5;
      const duration = speed + Math.random() * 2000;
      
      anime({
        targets: particle,
        translateX: moveX,
        translateY: moveY,
        scale: [scale, scale * 0.5],
        opacity: [0, opacity, 0],
        duration: duration,
        easing: 'easeInOutSine',
        complete: () => {
          // Reset position and restart
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';
          particle.style.transform = 'translate(0, 0) scale(1)';
          setTimeout(animation, Math.random() * 1000);
        }
      });
    };
    
    // Start with random delay
    setTimeout(animation, Math.random() * 2000);
  };

  return (
    <div
      ref={containerRef}
      className={`particle-background ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
} 