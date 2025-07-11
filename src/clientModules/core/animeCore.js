/**
 * Anime.js Core Module
 * 
 * This module provides core functionality for Anime.js animations.
 * It consolidates functionality from animeInitializer.js and core parts of animeModule.js.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Default configuration
const defaultConfig = {
  easing: 'easeOutElastic(1, .5)',
  duration: 800,
  autoplay: true,
  loop: false,
  performance: 'balanced', // 'high', 'balanced', or 'low'
};

/**
 * Initialize Anime.js
 * @param {Object} userConfig - User configuration to override defaults
 */
async function initializeAnime(userConfig = {}) {
  console.log('Initializing Anime.js...');
  
  // Merge user config with defaults
  const config = { ...defaultConfig, ...userConfig };
  
  // Dynamically import Anime.js
  let anime;
  try {
    anime = (await import('animejs')).default;
    console.log('Anime.js loaded successfully');
  } catch (error) {
    console.warn('Failed to load Anime.js:', error);
    return null;
  }
  
  // Store the original anime function
  const originalAnime = anime;
  
  // Create a wrapper function with default settings
  window.anime = function(params) {
    // Apply performance settings
    let performanceSettings = {};
    
    switch (config.performance) {
      case 'high':
        performanceSettings = {
          update: function(anim) {
            // Only update on every other frame for high performance
            if (anim.currentTime % 2 === 0) return;
          }
        };
        break;
      case 'low':
        performanceSettings = {
          update: null // Always update for best quality
        };
        break;
      // 'balanced' is default, no special settings
    }
    
    // Merge defaults with provided parameters and performance settings
    const mergedParams = { 
      ...config, 
      ...params,
      ...performanceSettings
    };
    
    // Call the original anime function with merged parameters
    return originalAnime(mergedParams);
  };
  
  // Add utility functions
  window.anime.utils = {
    // Create a staggered animation for multiple elements
    stagger: function(elements, animationParams, staggerDelay = 50) {
      if (!elements || elements.length === 0) return;
      
      const targets = Array.from(elements);
      
      return window.anime({
        targets: targets,
        delay: window.anime.stagger(staggerDelay),
        ...animationParams
      });
    },
    
    // Create a scroll-triggered animation
    scrollTrigger: function(elements, animationParams, offset = 100) {
      if (!elements || elements.length === 0) return;
      
      const targets = Array.from(elements);
      const animations = [];
      
      targets.forEach(target => {
        // Set initial state
        Object.keys(animationParams).forEach(key => {
          if (key !== 'duration' && key !== 'easing' && key !== 'delay') {
            if (typeof animationParams[key] === 'object' && animationParams[key].value !== undefined) {
              target.style[key] = animationParams[key].value[0];
            }
          }
        });
        
        // Create animation but don't play it yet
        const animation = window.anime({
          targets: target,
          ...animationParams,
          autoplay: false
        });
        
        animations.push({ target, animation });
      });
      
      // Create intersection observer
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const animation = animations.find(a => a.target === entry.target)?.animation;
            if (animation) {
              animation.play();
              observer.unobserve(entry.target);
            }
          }
        });
      }, {
        rootMargin: `0px 0px -${offset}px 0px`
      });
      
      // Observe all targets
      targets.forEach(target => {
        observer.observe(target);
      });
      
      return animations.map(a => a.animation);
    },
    
    // Create a timeline animation
    timeline: function(timelineParams = {}) {
      return window.anime.timeline({
        easing: config.easing,
        duration: config.duration,
        ...timelineParams
      });
    },
    
    // Create a path animation
    path: function(pathEl) {
      return window.anime.path(pathEl);
    },
    
    // Create a particle animation
    particles: function(container, options = {}) {
      const defaults = {
        count: 20,
        size: 5,
        color: '#3b82f6',
        duration: 2000,
        easing: 'easeOutExpo',
        speed: 1,
        direction: 'random', // 'random', 'top', 'bottom', 'left', 'right'
      };
      
      const settings = { ...defaults, ...options };
      
      // Create particles
      for (let i = 0; i < settings.count; i++) {
        const particle = document.createElement('div');
        particle.className = 'anime-particle';
        particle.style.position = 'absolute';
        particle.style.width = `${settings.size}px`;
        particle.style.height = `${settings.size}px`;
        particle.style.backgroundColor = settings.color;
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0';
        
        container.appendChild(particle);
        
        // Set initial position
        const containerRect = container.getBoundingClientRect();
        let startX, startY, endX, endY;
        
        switch (settings.direction) {
          case 'top':
            startX = Math.random() * containerRect.width;
            startY = -settings.size;
            endX = startX + (Math.random() * 100 - 50);
            endY = containerRect.height + settings.size;
            break;
          case 'bottom':
            startX = Math.random() * containerRect.width;
            startY = containerRect.height + settings.size;
            endX = startX + (Math.random() * 100 - 50);
            endY = -settings.size;
            break;
          case 'left':
            startX = -settings.size;
            startY = Math.random() * containerRect.height;
            endX = containerRect.width + settings.size;
            endY = startY + (Math.random() * 100 - 50);
            break;
          case 'right':
            startX = containerRect.width + settings.size;
            startY = Math.random() * containerRect.height;
            endX = -settings.size;
            endY = startY + (Math.random() * 100 - 50);
            break;
          default: // random
            startX = Math.random() * containerRect.width;
            startY = Math.random() * containerRect.height;
            endX = Math.random() * containerRect.width;
            endY = Math.random() * containerRect.height;
        }
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        // Animate particle
        window.anime({
          targets: particle,
          left: endX,
          top: endY,
          opacity: [0, 0.8, 0],
          duration: settings.duration / settings.speed,
          delay: i * (settings.duration / settings.count / settings.speed),
          easing: settings.easing,
          complete: function() {
            particle.remove();
          }
        });
      }
    }
  };
  
  // Copy original properties and methods
  window.anime.random = originalAnime.random;
  window.anime.stagger = originalAnime.stagger;
  window.anime.path = originalAnime.path;
  window.anime.setDashoffset = originalAnime.setDashoffset;
  window.anime.version = originalAnime.version;
  window.anime.speed = originalAnime.speed;
  window.anime.running = originalAnime.running;
  window.anime.remove = originalAnime.remove;
  window.anime.get = originalAnime.get;
  window.anime.set = originalAnime.set;
  window.anime.timeline = originalAnime.timeline;
  window.anime.easings = originalAnime.easings;
  
  return window.anime;
}

/**
 * Add CSS styles for Anime.js animations
 */
function addAnimeStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .anime-container {
      position: relative;
      overflow: hidden;
    }
    
    .anime-particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10;
    }
    
    /* Animation keyframes */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    /* Animation utility classes */
    .anime-fade-in {
      animation: fadeIn 0.5s ease forwards;
    }
    
    .anime-fade-out {
      animation: fadeOut 0.5s ease forwards;
    }
    
    .anime-slide-in {
      animation: slideIn 0.5s ease forwards;
    }
    
    .anime-pulse {
      animation: pulse 2s ease-in-out infinite;
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Initialize animations for elements with data-anime attribute
 */
function initializeDataAttributes(anime) {
  if (!anime) return;
  
  document.querySelectorAll('[data-anime]').forEach(element => {
    try {
      const animationParams = JSON.parse(element.dataset.anime);
      anime({
        targets: element,
        ...animationParams
      });
    } catch (error) {
      console.error('Error parsing animation parameters:', error);
    }
  });
}

// Main export function
export default function(userConfig = {}) {
  // Only execute in browser environment
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }
  
  // Add styles when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAnimeStyles);
  } else {
    addAnimeStyles();
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      const anime = await initializeAnime(userConfig);
      if (anime) {
        initializeDataAttributes(anime);
      }
    });
  } else {
    initializeAnime(userConfig).then(anime => {
      if (anime) {
        initializeDataAttributes(anime);
      }
    });
  }
  
  // Re-initialize on route change for SPA navigation
  document.addEventListener('docusaurus.routeDidUpdate', () => {
    // Wait for DOM to update
    setTimeout(() => {
      if (window.anime) {
        initializeDataAttributes(window.anime);
      }
    }, 200);
  });
}
