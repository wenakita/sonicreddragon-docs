import React, { useEffect, useRef } from 'react';
import OriginalLayout from '@theme-original/Layout';
import { useLocation } from '@docusaurus/router';
import CustomSidebar from '../../components/CustomSidebar';
import anime from 'animejs/lib/anime.es.js';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface Props {
  children: React.ReactNode;
  wrapperClassName?: string;
}

export default function Layout({ children, wrapperClassName }: Props): React.ReactElement {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const isBrowser = useIsBrowser();
  
  // Only show custom sidebar on docs pages
  const isDocsPage = location.pathname.startsWith('/') && 
                     !location.pathname.startsWith('/blog') &&
                     location.pathname !== '/';

  // Page transition animations
  useEffect(() => {
    if (!isBrowser || !contentRef.current) return;

    const content = contentRef.current;
    
    // Special handling for intro page - make it visible immediately
    if (location.pathname === '/' || location.pathname.includes('intro')) {
      content.style.opacity = '1';
    }
    
    // Animate page entrance
    anime({
      targets: content,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing: 'easeOutExpo',
      delay: 100
    });

    // Animate child elements with stagger
    const animatableElements = content.querySelectorAll('h1, h2, h3, .card, .interactive-card, .mermaid-container, p, ul, ol, blockquote');
    if (animatableElements.length > 0) {
      anime({
        targets: animatableElements,
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 500,
        delay: anime.stagger(50, { start: 200 }),
        easing: 'easeOutCubic'
      });
    }

    // Add floating particles effect for special pages
    if (location.pathname === '/' || location.pathname.includes('intro')) {
      createFloatingParticles();
    }

  }, [location.pathname, isBrowser]);

  const createFloatingParticles = () => {
    if (!isBrowser || !contentRef.current) return;

    const container = contentRef.current;
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, rgba(59, 130, 246, 0.6), rgba(234, 88, 12, 0.6));
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
      `;
      
      container.appendChild(particle);
      
      // Animate particle
      anime({
        targets: particle,
        opacity: [0, 0.8, 0],
        translateX: anime.random(-100, 100),
        translateY: anime.random(-100, 100),
        scale: [0, 1, 0],
        duration: anime.random(3000, 6000),
        delay: anime.random(0, 2000),
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
      });
    }

    // Cleanup particles after 30 seconds
    setTimeout(() => {
      const particles = container.querySelectorAll('.floating-particle');
      particles.forEach(particle => particle.remove());
    }, 30000);
  };

  // Use default Docusaurus layout for all pages
  // if (isDocsPage) {
  //   return (
  //     <OriginalLayout wrapperClassName={wrapperClassName}>
  //       <div style={{ 
  //         display: 'flex', 
  //         minHeight: 'calc(100vh - var(--ifm-navbar-height, 60px) - var(--docusaurus-announcement-bar-height, 0px))',
  //         position: 'relative',
  //         overflow: 'hidden'
  //       }}>
  //         <CustomSidebar />
  //         <div 
  //           ref={contentRef}
  //           style={{
  //             marginLeft: '250px',
  //             width: 'calc(100% - 250px)',
  //             padding: '2rem',
  //             boxSizing: 'border-box',
  //             marginTop: 'calc(var(--docusaurus-announcement-bar-height, 0px))',
  //             position: 'relative',
  //             opacity: 0,
  //             willChange: 'transform, opacity'
  //           }}
  //         >
  //           {children}
  //         </div>
  //       </div>
  //     </OriginalLayout>
  //   );
  // }

  // For non-docs pages, use enhanced layout with animations
  const isIntroPage = location.pathname === '/' || location.pathname.includes('intro');
  
  return (
    <OriginalLayout wrapperClassName={wrapperClassName}>
      <div 
        ref={contentRef}
        style={{
          position: 'relative',
          opacity: isIntroPage ? 1 : 0,
          willChange: 'transform, opacity',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    </OriginalLayout>
  );
} 