/**
 * Animation Utilities
 * 
 * This module provides utilities for animations using anime.js.
 * It includes performance optimizations and helper functions.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Import anime.js dynamically in browser environment
let anime;
if (ExecutionEnvironment.canUseDOM) {
  // Use dynamic import for anime.js
  import('animejs').then(module => {
    anime = module.default;
    
    // Initialize anime.js with default settings
    const originalAnime = anime;
    anime = function(params) {
      // Default settings
      const defaults = {
        easing: 'easeOutElastic(1, .5)',
        duration: 800,
        autoplay: true,
        loop: false
      };
      
      // Merge defaults with provided parameters
      const mergedParams = { ...defaults, ...params };
      
      // Call the original anime function with merged parameters
      return originalAnime(mergedParams);
    };
    
    // Copy all properties from the original anime
    Object.keys(originalAnime).forEach(key => {
      anime[key] = originalAnime[key];
    });
    
    // Add utility functions
    anime.utils = {
      // Create a staggered animation for multiple elements
      stagger: function(elements, animationParams, staggerDelay = 50) {
        if (!elements || elements.length === 0) return;
        
        const targets = Array.from(elements);
        
        return anime({
          targets: targets,
          delay: anime.stagger(staggerDelay),
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
          const animation = anime({
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
      timeline: function(animations, timelineParams = {}) {
        const timeline = anime.timeline({
          easing: 'easeOutElastic(1, .5)',
          duration: 800,
          ...timelineParams
        });
        
        animations.forEach(animation => {
          timeline.add(animation);
        });
        
        return timeline;
      },
      
      // Create a hover animation
      hover: function(element, enterParams, leaveParams) {
        if (!element) return;
        
        const enterAnimation = anime({
          targets: element,
          ...enterParams,
          autoplay: false
        });
        
        const leaveAnimation = anime({
          targets: element,
          ...leaveParams,
          autoplay: false
        });
        
        element.addEventListener('mouseenter', () => {
          leaveAnimation.pause();
          enterAnimation.play();
        });
        
        element.addEventListener('mouseleave', () => {
          enterAnimation.pause();
          leaveAnimation.play();
        });
        
        return { enter: enterAnimation, leave: leaveAnimation };
      }
    };
    
    // Make anime globally available
    window.anime = anime;
  }).catch(error => {
    console.error('Error loading anime.js:', error);
  });
} else {
  // Provide a dummy anime function for SSR
  anime = () => {};
  anime.timeline = () => ({ add: () => {} });
  anime.stagger = () => {};
  anime.utils = {
    stagger: () => {},
    scrollTrigger: () => {},
    timeline: () => {},
    hover: () => {}
  };
}

// Export anime
export { anime };

/**
 * Hook to optimize animations based on device performance
 * 
 * @returns {Object} Animation settings based on device performance
 */
export function useAnimationPerformance() {
  if (!ExecutionEnvironment.canUseDOM) {
    return {
      shouldAnimate: false,
      quality: 'low',
      particleCount: 0,
      complexity: 'simple'
    };
  }
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return {
      shouldAnimate: false,
      quality: 'low',
      particleCount: 0,
      complexity: 'simple'
    };
  }
  
  // Check for device performance
  const isHighEndDevice = () => {
    // Check for high-end device indicators
    const memory = navigator.deviceMemory;
    const concurrency = navigator.hardwareConcurrency;
    const connection = navigator.connection?.effectiveType;
    
    // High-end device has more memory and CPU cores
    if (memory && memory >= 4 && concurrency && concurrency >= 4) {
      return true;
    }
    
    // High-end device has fast connection
    if (connection && ['4g', 'wifi'].includes(connection)) {
      return true;
    }
    
    // Default to medium performance
    return false;
  };
  
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  // Determine performance level
  const performanceLevel = isHighEndDevice() ? (isMobileDevice() ? 'medium' : 'high') : 'low';
  
  // Return settings based on performance level
  switch (performanceLevel) {
    case 'high':
      return {
        shouldAnimate: true,
        quality: 'high',
        particleCount: 50,
        complexity: 'complex'
      };
    case 'medium':
      return {
        shouldAnimate: true,
        quality: 'medium',
        particleCount: 20,
        complexity: 'moderate'
      };
    case 'low':
    default:
      return {
        shouldAnimate: true,
        quality: 'low',
        particleCount: 10,
        complexity: 'simple'
      };
  }
}

/**
 * Utility function to create animated SVG paths
 * 
 * @param {string} pathString - SVG path string
 * @param {Object} options - Animation options
 * @returns {SVGPathElement} Animated path element
 */
export function createAnimatedPath(pathString, options = {}) {
  if (!ExecutionEnvironment.canUseDOM) return null;
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathString);
  
  // Set default attributes
  path.setAttribute('fill', options.fill || 'none');
  path.setAttribute('stroke', options.stroke || '#3b82f6');
  path.setAttribute('stroke-width', options.strokeWidth || '2');
  path.setAttribute('stroke-linecap', options.strokeLinecap || 'round');
  path.setAttribute('stroke-linejoin', options.strokeLinejoin || 'round');
  
  // Prepare for animation
  if (options.animate !== false) {
    path.style.opacity = '0';
    
    // Animate the path when it's added to the DOM
    setTimeout(() => {
      anime({
        targets: path,
        opacity: 1,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: options.duration || 1500,
        delay: options.delay || 0
      });
    }, 100);
  }
  
  return path;
}

/**
 * Utility function to create particle effects
 * 
 * @param {HTMLElement} container - Container element for particles
 * @param {Object} options - Particle options
 * @returns {Function} Cleanup function
 */
export function createParticleEffect(container, options = {}) {
  if (!ExecutionEnvironment.canUseDOM || !container) return () => {};
  
  // Get performance settings
  const { shouldAnimate, particleCount: defaultCount } = useAnimationPerformance();
  
  if (!shouldAnimate) return () => {};
  
  // Create particle container
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  particleContainer.style.position = 'absolute';
  particleContainer.style.top = '0';
  particleContainer.style.left = '0';
  particleContainer.style.width = '100%';
  particleContainer.style.height = '100%';
  particleContainer.style.pointerEvents = 'none';
  particleContainer.style.zIndex = '0';
  
  container.appendChild(particleContainer);
  
  // Create particles
  const count = options.count || defaultCount || 30;
  const particles = [];
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = options.className || 'particle';
    
    // Random position, size, and animation delay
    const size = Math.random() * (options.maxSize || 5) + (options.minSize || 2);
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = options.color || 'rgba(59, 130, 246, 0.5)';
    particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
    
    // Add to container
    particleContainer.appendChild(particle);
    particles.push(particle);
    
    // Animate particle
    anime({
      targets: particle,
      translateX: () => anime.random(-50, 50),
      translateY: () => anime.random(-50, 50),
      opacity: [
        { value: Math.random() * 0.5 + 0.1, duration: 1000 },
        { value: 0, duration: 1000 }
      ],
      scale: [
        { value: Math.random() + 0.5, duration: 1000 },
        { value: 0, duration: 1000 }
      ],
      easing: 'easeInOutQuad',
      duration: options.duration || 5000,
      delay: anime.random(0, 2000),
      complete: (anim) => {
        // Reset particle position and restart animation
        const particle = anim.animatables[0].target;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        anime({
          targets: particle,
          translateX: () => anime.random(-50, 50),
          translateY: () => anime.random(-50, 50),
          opacity: [
            { value: Math.random() * 0.5 + 0.1, duration: 1000 },
            { value: 0, duration: 1000 }
          ],
          scale: [
            { value: Math.random() + 0.5, duration: 1000 },
            { value: 0, duration: 1000 }
          ],
          easing: 'easeInOutQuad',
          duration: options.duration || 5000,
          delay: anime.random(0, 1000)
        });
      }
    });
  }
  
  // Return cleanup function
  return () => {
    if (container.contains(particleContainer)) {
      container.removeChild(particleContainer);
    }
  };
}
