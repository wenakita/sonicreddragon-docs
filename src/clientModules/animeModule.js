/**
 * Anime.js Client Module
 * 
 * This client module initializes animations for the Docusaurus site
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { initializeAnimations } from '../utils/animeUtils';

// Only execute in browser
if (ExecutionEnvironment.canUseDOM) {
  // Initialize animations when DOM is ready
  const initialize = () => {
    // Initialize animations
    initializeAnimations();
    
    // Add global styles for animations
    addAnimationStyles();
  };
  
  // Add global styles for animations
  const addAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Animation classes */
      [data-animated-text] {
        opacity: 0;
      }
      
      [data-scroll-reveal] {
        opacity: 0;
      }
      
      /* Parallax container */
      [data-parallax-container] {
        position: relative;
        overflow: hidden;
      }
      
      /* Interactive element */
      .interactive-element {
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        border-radius: 12px;
        overflow: hidden;
      }
      
      .interactive-element:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      }
      
      [data-theme='dark'] .interactive-element:hover {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(59, 130, 246, 0.3);
      }
      
      /* Animated button */
      [data-animated-button] {
        position: relative;
        overflow: hidden;
        transform: translate3d(0, 0, 0);
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        border-radius: 8px;
      }
      
      [data-animated-button]:hover {
        transform: translateY(-2px) scale(1.03);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      }
      
      [data-theme='dark'] [data-animated-button]:hover {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2), 0 0 10px rgba(59, 130, 246, 0.3);
      }
      
      /* Animated cards */
      .animated-card {
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        transform: translateZ(0);
        background: var(--ifm-card-background-color);
        border: 1px solid var(--ifm-color-emphasis-200);
      }
      
      .animated-card:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        border-color: var(--ifm-color-primary-lightest);
      }
      
      [data-theme='dark'] .animated-card:hover {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(59, 130, 246, 0.2);
      }
      
      /* Immersive timeline */
      .immersive-timeline-item {
        opacity: 0;
        transform: translateY(20px);
      }
      
      /* Mermaid diagrams */
      .mermaid {
        background: transparent !important;
      }
      
      /* Animated diagrams */
      .animated-diagram {
        opacity: 0;
        transform: translateY(20px);
      }
      
      /* Immersive diagram container */
      .immersive-diagram {
        position: relative;
        margin: 3rem 0;
        border-radius: 16px;
        overflow: hidden;
        background: rgba(248, 250, 252, 0.9);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        border: 1px solid rgba(59, 130, 246, 0.2);
      }
      
      [data-theme='dark'] .immersive-diagram {
        background: rgba(10, 10, 10, 0.7);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      
      .immersive-diagram:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      }
      
      [data-theme='dark'] .immersive-diagram:hover {
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.3);
      }
      
      .diagram-title {
        margin: 0;
        padding: 1.5rem 2rem;
        background: rgba(248, 250, 252, 0.9);
        color: var(--ifm-color-gray-900);
        font-size: 1.5rem;
        font-weight: 600;
        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
      }
      
      [data-theme='dark'] .diagram-title {
        background: rgba(10, 10, 10, 0.8);
        color: #fff;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        border-bottom: 1px solid rgba(59, 130, 246, 0.2);
      }
      
      .diagram-caption {
        margin: 0;
        padding: 1.5rem 2rem;
        background: rgba(248, 250, 252, 0.9);
        color: var(--ifm-color-gray-600);
        font-size: 1rem;
        font-style: italic;
        border-top: 1px solid rgba(59, 130, 246, 0.2);
      }
      
      [data-theme='dark'] .diagram-caption {
        background: rgba(10, 10, 10, 0.8);
        color: rgba(255, 255, 255, 0.8);
        border-top: 1px solid rgba(59, 130, 246, 0.2);
      }
      
      /* Mermaid controls */
      .mermaid-controls {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1rem;
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        z-index: 10;
      }
      
      .mermaid-control-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.15);
        border: 1px solid rgba(59, 130, 246, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      
      .mermaid-control-button:hover {
        background: rgba(59, 130, 246, 0.25);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 8px rgba(59, 130, 246, 0.4);
      }
      
      .mermaid-control-button svg {
        width: 22px;
        height: 22px;
        fill: rgba(255, 255, 255, 0.9);
      }
      
      /* Mermaid fullscreen */
      .mermaid-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        margin: 0;
        padding: 0;
        border-radius: 0;
        display: flex;
        flex-direction: column;
        background-color: rgba(248, 250, 252, 0.95);
      }
      
      [data-theme='dark'] .mermaid-fullscreen {
        background-color: rgba(10, 10, 10, 0.95);
      }
      
      /* Particle container */
      .particle-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      }
      
      /* Gradient backgrounds */
      .gradient-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        background: linear-gradient(45deg, var(--ifm-color-primary-dark), var(--ifm-color-primary), var(--ifm-color-primary-light));
        opacity: 0.1;
        pointer-events: none;
      }
      
      [data-theme='dark'] .gradient-background {
        opacity: 0.2;
      }
      
      /* Animated gradient */
      .animated-gradient {
        background-size: 400% 400%;
        animation: gradientAnimation 15s ease infinite;
      }
      
      @keyframes gradientAnimation {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      /* Glow effects */
      .glow-effect {
        position: relative;
      }
      
      .glow-effect::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        box-shadow: 0 0 25px rgba(59, 130, 246, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
        pointer-events: none;
      }
      
      .glow-effect:hover::after {
        opacity: 1;
      }
      
      /* Immersive content */
      .immersive-content {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        background: rgba(var(--ifm-color-primary-rgb), 0.05);
        border: 1px solid rgba(var(--ifm-color-primary-rgb), 0.1);
        padding: 2rem;
        margin: 2rem 0;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      
      [data-theme='dark'] .immersive-content {
        background: rgba(26, 26, 26, 0.4);
        border: 1px solid rgba(59, 130, 246, 0.2);
      }
      
      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        [data-animated-text],
        [data-scroll-reveal],
        .immersive-timeline-item,
        .animated-diagram {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
        
        .interactive-element:hover,
        [data-animated-button]:hover,
        .animated-card:hover {
          transform: none !important;
          transition: none !important;
        }
        
        .animated-gradient {
          animation: none !important;
        }
        
        .glow-effect::after {
          display: none !important;
        }
      }
    `;
    
    // Add style to head
    document.head.appendChild(style);
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Re-initialize on route change
  document.addEventListener('docusaurus.routeDidUpdate', () => {
    // Wait for DOM to update
    setTimeout(initialize, 200);
  });
}

export function onRouteDidUpdate({ location, previousLocation }) {
  // Re-initialize animations on route change
  if (ExecutionEnvironment.canUseDOM && location !== previousLocation) {
    // Wait for DOM to update
    setTimeout(() => {
      initializeAnimations();
    }, 200);
  }
}
