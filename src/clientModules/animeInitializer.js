import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  /**
   * Anime.js Initialization Module
   * 
   * This module initializes anime.js animations on the client side.
   * It provides global configuration and utility functions for animations.
   */
  
  export default function() {
    if (typeof window !== 'undefined') {
      // Initialize anime.js when the DOM is fully loaded
      document.addEventListener('DOMContentLoaded', () => {
        try {
          // Check if anime.js is available
          if (typeof window.anime !== 'undefined') {
            console.log('Initializing anime.js animations...');
            
            // Store the original anime function
            const originalAnime = window.anime;
            
            // Create a wrapper function with default settings
            window.anime = function(params) {
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
              }
            };
            
            // Initialize animations for elements with data-anime attribute
            document.querySelectorAll('[data-anime]').forEach(element => {
              try {
                const animationParams = JSON.parse(element.dataset.anime);
                window.anime({
                  targets: element,
                  ...animationParams
                });
              } catch (error) {
                console.error('Error parsing animation parameters:', error);
              }
            });
            
            console.log('Anime.js initialization complete');
          } else {
            console.warn('Anime.js library not found');
          }
        } catch (error) {
          console.error('Error initializing anime.js:', error);
        }
      });
    }
  }
  
}

// Export empty module for SSR
export default function() {};