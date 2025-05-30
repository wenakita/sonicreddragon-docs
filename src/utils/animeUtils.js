/**
 * Anime.js Utilities
 * 
 * Helper functions for working with anime.js animations
 */

import anime from 'animejs';

/**
 * Create a staggered entrance animation for multiple elements
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function staggeredEntrance(targets, options = {}) {
  const defaultOptions = {
    opacity: [0, 1],
    translateY: [20, 0],
    scale: [0.9, 1],
    delay: anime.stagger(50),
    duration: 600,
    easing: 'cubicBezier(0.22, 1, 0.36, 1)',
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a fade-in animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function fadeIn(targets, options = {}) {
  const defaultOptions = {
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutCubic',
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a fade-in-up animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function fadeInUp(targets, options = {}) {
  const defaultOptions = {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: 'easeOutCubic',
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a fade-in-down animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function fadeInDown(targets, options = {}) {
  const defaultOptions = {
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 800,
    easing: 'easeOutCubic',
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a fade-in-left animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function fadeInLeft(targets, options = {}) {
  const defaultOptions = {
    opacity: [0, 1],
    translateX: [-20, 0],
    duration: 800,
    easing: 'easeOutCubic',
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a fade-in-right animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function fadeInRight(targets, options = {}) {
  const defaultOptions = {
    opacity: [0, 1],
    translateX: [20, 0],
    duration: 800,
    easing: 'easeOutCubic',
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a zoom-in animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function zoomIn(targets, options = {}) {
  const defaultOptions = {
    opacity: [0, 1],
    scale: [0.5, 1],
    duration: 800,
    easing: 'easeOutCubic',
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a bounce animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function bounce(targets, options = {}) {
  const defaultOptions = {
    translateY: [
      { value: -15, duration: 300, easing: 'easeOutCubic' },
      { value: 0, duration: 500, easing: 'easeOutElastic(1, 0.5)' },
    ],
    duration: 800,
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a pulse animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function pulse(targets, options = {}) {
  const defaultOptions = {
    scale: [
      { value: 1.05, duration: 300, easing: 'easeOutCubic' },
      { value: 1, duration: 500, easing: 'easeOutElastic(1, 0.5)' },
    ],
    duration: 800,
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a shake animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function shake(targets, options = {}) {
  const defaultOptions = {
    translateX: [
      { value: -10, duration: 100, easing: 'easeInOutSine' },
      { value: 10, duration: 100, easing: 'easeInOutSine' },
      { value: -10, duration: 100, easing: 'easeInOutSine' },
      { value: 10, duration: 100, easing: 'easeInOutSine' },
      { value: -5, duration: 100, easing: 'easeInOutSine' },
      { value: 5, duration: 100, easing: 'easeInOutSine' },
      { value: 0, duration: 100, easing: 'easeInOutSine' },
    ],
    duration: 700,
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a path drawing animation
 * @param {string|Element|Element[]|NodeList} targets - SVG path elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function drawPath(targets, options = {}) {
  const defaultOptions = {
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: false,
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a typing animation for text
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {anime.AnimeInstance} - The anime.js animation instance
 */
export function typeText(targets, options = {}) {
  // Store original text content
  const elements = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
  const originalTexts = [];
  
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    originalTexts[i] = el.textContent;
    el.textContent = '';
  }
  
  const defaultOptions = {
    textContent: (el, i) => originalTexts[i],
    duration: (el, i) => originalTexts[i].length * 50,
    easing: 'steps(' + (originalTexts[0] ? originalTexts[0].length : 1) + ')',
    delay: anime.stagger(1000),
  };

  return anime({
    targets,
    ...defaultOptions,
    ...options,
  });
}

/**
 * Create a parallax scrolling effect
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Parallax options
 */
export function setupParallax(targets, options = {}) {
  const defaultOptions = {
    intensity: 0.1,
    direction: 'y',
    reverse: false,
  };
  
  const config = { ...defaultOptions, ...options };
  const elements = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
  
  // Skip if no elements or not in browser
  if (!elements || typeof window === 'undefined') return;
  
  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const speed = el.dataset.parallaxSpeed || 1;
      const offset = scrollY * speed * config.intensity;
      
      // Apply transform based on direction
      if (config.direction === 'y' || config.direction === 'both') {
        el.style.transform = `translateY(${config.reverse ? -offset : offset}px)`;
      } else if (config.direction === 'x' || config.direction === 'both') {
        el.style.transform = `translateX(${config.reverse ? -offset : offset}px)`;
      }
    }
  };
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial call
  handleScroll();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

/**
 * Create a scroll-triggered animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 */
export function scrollTriggeredAnimation(targets, options = {}) {
  const defaultOptions = {
    animation: 'fadeInUp',
    threshold: 0.2,
    once: true,
  };
  
  const config = { ...defaultOptions, ...options };
  const elements = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
  
  // Skip if no elements or not in browser
  if (!elements || typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  
  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Animation functions map
  const animations = {
    fadeIn: fadeIn,
    fadeInUp: fadeInUp,
    fadeInDown: fadeInDown,
    fadeInLeft: fadeInLeft,
    fadeInRight: fadeInRight,
    zoomIn: zoomIn,
    bounce: bounce,
    pulse: pulse,
  };
  
  // Set initial state
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    el.style.opacity = '0';
  }
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Get animation function
        const animationName = entry.target.dataset.animation || config.animation;
        const animationFn = animations[animationName] || animations.fadeInUp;
        
        // Get animation options
        const delay = parseInt(entry.target.dataset.delay || 0, 10);
        const duration = parseInt(entry.target.dataset.duration || 800, 10);
        
        // Run animation
        animationFn(entry.target, { delay, duration });
        
        // Unobserve if once is true
        if (config.once) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: config.threshold,
    rootMargin: '0px 0px -100px 0px',
  });
  
  // Observe elements
  for (let i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  }
  
  // Return cleanup function
  return () => {
    for (let i = 0; i < elements.length; i++) {
      observer.unobserve(elements[i]);
    }
  };
}

/**
 * Create a mouse-follow animation
 * @param {string|Element|Element[]|NodeList} targets - Elements to animate
 * @param {Object} options - Animation options
 */
export function mouseFollowAnimation(targets, options = {}) {
  const defaultOptions = {
    intensity: 0.1,
    ease: 0.1,
    perspective: 1000,
  };
  
  const config = { ...defaultOptions, ...options };
  const elements = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
  
  // Skip if no elements or not in browser
  if (!elements || typeof window === 'undefined') return;
  
  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  
  // Update mouse position
  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };
  
  // Add mouse move event listener
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  
  // Animation loop
  const animate = () => {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const rect = el.getBoundingClientRect();
      
      // Calculate center of element
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse to center
      const distX = mouseX - centerX;
      const distY = mouseY - centerY;
      
      // Apply transform
      el.style.transform = `perspective(${config.perspective}px) rotateX(${distY * -config.intensity}deg) rotateY(${distX * config.intensity}deg)`;
    }
    
    // Request next frame
    requestAnimationFrame(animate);
  };
  
  // Start animation loop
  const animationId = requestAnimationFrame(animate);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animationId);
  };
}

/**
 * Create a ripple effect animation
 * @param {Event} e - Click event
 * @param {Element} el - Element to apply ripple to
 * @param {Object} options - Ripple options
 */
export function createRipple(e, el, options = {}) {
  const defaultOptions = {
    color: 'rgba(255, 255, 255, 0.3)',
    duration: 800,
  };
  
  const config = { ...defaultOptions, ...options };
  
  // Skip if not in browser
  if (typeof document === 'undefined') return;
  
  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Get element position
  const rect = el.getBoundingClientRect();
  
  // Calculate ripple position
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Calculate ripple size
  const size = Math.max(rect.width, rect.height) * 2;
  
  // Create ripple element
  const ripple = document.createElement('span');
  ripple.style.position = 'absolute';
  ripple.style.top = `${y}px`;
  ripple.style.left = `${x}px`;
  ripple.style.width = '0';
  ripple.style.height = '0';
  ripple.style.borderRadius = '50%';
  ripple.style.backgroundColor = config.color;
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.pointerEvents = 'none';
  
  // Add ripple to element
  el.appendChild(ripple);
  
  // Animate ripple
  anime({
    targets: ripple,
    width: size,
    height: size,
    opacity: [0.5, 0],
    easing: 'easeOutExpo',
    duration: config.duration,
    complete: () => {
      ripple.remove();
    },
  });
}

/**
 * Initialize animations for elements with data attributes
 */
export function initializeAnimations() {
  // Skip if not in browser
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  
  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Initialize scroll-triggered animations
  scrollTriggeredAnimation('[data-scroll-reveal]');
  
  // Initialize parallax effects
  const parallaxContainers = document.querySelectorAll('[data-parallax-container]');
  parallaxContainers.forEach(container => {
    const intensity = parseFloat(container.dataset.parallaxIntensity || 0.1);
    const direction = container.dataset.parallaxAxis || 'y';
    const reverse = container.dataset.parallaxReverse === 'true';
    
    setupParallax(container.querySelectorAll('[data-parallax]'), {
      intensity,
      direction,
      reverse,
    });
  });
  
  // Initialize mouse-follow animations
  mouseFollowAnimation('[data-mouse-follow]');
  
  // Initialize animated text
  const animatedTextElements = document.querySelectorAll('[data-animated-text]');
  animatedTextElements.forEach(el => {
    const animation = el.dataset.animatedText;
    const delay = parseInt(el.dataset.animatedDelay || 0, 10);
    
    // Get animation function
    const animations = {
      fadeIn: fadeIn,
      fadeInUp: fadeInUp,
      fadeInDown: fadeInDown,
      fadeInLeft: fadeInLeft,
      fadeInRight: fadeInRight,
      zoomIn: zoomIn,
      typeText: typeText,
    };
    
    const animationFn = animations[animation] || animations.fadeIn;
    
    // Run animation
    animationFn(el, { delay });
  });
  
  // Initialize ripple buttons
  const rippleButtons = document.querySelectorAll('[data-animated-button]');
  rippleButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      createRipple(e, button);
    });
  });
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Export anime for direct use
export { anime };
