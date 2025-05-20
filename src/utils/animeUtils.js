/**
 * Animation utilities using Anime.js
 */
import anime from 'animejs/lib/anime.es.js';

/**
 * Creates a fade-in animation for elements
 * @param {HTMLElement|NodeList|Array} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {Object} Animation instance
 */
export function fadeIn(targets, options = {}) {
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [15, 0],
    duration: options.duration || 800,
    delay: options.delay || anime.stagger(100),
    easing: options.easing || 'easeOutCubic',
    ...options
  });
}

/**
 * Creates a draw SVG path animation
 * @param {HTMLElement|NodeList|Array} targets - SVG paths to animate
 * @param {Object} options - Animation options
 * @returns {Object} Animation instance
 */
export function drawPath(targets, options = {}) {
  return anime({
    targets,
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: options.duration || 1200,
    delay: options.delay || anime.stagger(150, { start: options.startDelay || 300 }),
    easing: options.easing || 'easeInOutSine',
    ...options
  });
}

/**
 * Creates a subtle pulse animation
 * @param {HTMLElement|NodeList|Array} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {Object} Animation instance
 */
export function pulse(targets, options = {}) {
  return anime({
    targets,
    scale: [1, options.scale || 1.05, 1],
    opacity: [1, options.opacityMin || 0.8, 1],
    duration: options.duration || 2000,
    loop: true,
    direction: 'alternate',
    easing: options.easing || 'easeInOutSine',
    delay: options.delay || anime.stagger(100),
    ...options
  });
}

/**
 * Creates a typewriter effect for text
 * @param {HTMLElement} element - Text element
 * @param {string} text - Text to type
 * @param {Object} options - Animation options
 */
export function typeText(element, text, options = {}) {
  const speed = options.speed || 50;
  let i = 0;
  
  // Clear existing text
  element.textContent = '';
  
  // Start typing
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (options.onComplete) {
      options.onComplete();
    }
  }
  
  // Initial delay
  setTimeout(type, options.delay || 0);
}

/**
 * Creates a sequential animation for diagram elements
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Animation options
 * @returns {Object} Animation timeline
 */
export function animateDiagram(container, options = {}) {
  // Create animation timeline
  const timeline = anime.timeline({
    easing: options.easing || 'easeOutExpo',
    duration: options.duration || 800,
    loop: options.loop || false,
    complete: options.complete || undefined
  });
  
  // Add nodes animation
  if (container.querySelectorAll('.animated-element').length > 0) {
    timeline.add({
      targets: container.querySelectorAll('.animated-element'),
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(150)
    });
  }
  
  // Add connections animation
  if (container.querySelectorAll('.connection-line').length > 0) {
    timeline.add({
      targets: container.querySelectorAll('.connection-line'),
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 700,
      delay: function(el, i) { return i * 250 }
    }, '-=400');
  }
  
  // Add highlight animation
  if (container.querySelectorAll('.highlight-element').length > 0) {
    timeline.add({
      targets: container.querySelectorAll('.highlight-element'),
      backgroundColor: [
        'rgba(var(--ifm-color-primary-rgb), 0.2)', 
        'rgba(var(--ifm-color-primary-rgb), 0.6)'
      ],
      boxShadow: [
        '0 0 0 rgba(var(--ifm-color-primary-rgb), 0)', 
        '0 0 10px rgba(var(--ifm-color-primary-rgb), 0.5)'
      ],
      easing: 'easeOutExpo',
      duration: 600
    }, '-=300');
  }
  
  return timeline;
}

/**
 * Animate Mermaid diagram elements after rendering
 * @param {HTMLElement} container - Mermaid container element
 * @param {Object} options - Animation options
 */
export function animateMermaidDiagram(container, options = {}) {
  // Wait for Mermaid to fully render
  setTimeout(() => {
    // Find the SVG element
    const svg = container.querySelector('svg');
    if (!svg) return;
    
    // Create animation timeline
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 800
    });
    
    // Nodes (rect, circle, ellipse)
    const nodes = svg.querySelectorAll('g.node rect, g.node circle, g.node ellipse, .actor');
    if (nodes.length) {
      timeline.add({
        targets: nodes,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800,
        delay: anime.stagger(100)
      });
    }
    
    // Labels and text
    const labels = svg.querySelectorAll('g.node .label, .messageText, .loopText, text:not(.actor)');
    if (labels.length) {
      timeline.add({
        targets: labels,
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(80)
      }, '-=600');
    }
    
    // Edges/paths
    const edges = svg.querySelectorAll('.edgePath path, .messageLine0, .messageLine1');
    if (edges.length) {
      timeline.add({
        targets: edges,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 1000,
        delay: anime.stagger(150),
        easing: 'easeInOutSine'
      }, '-=500');
    }
    
    // Arrowheads
    const markers = svg.querySelectorAll('marker, .marker');
    if (markers.length) {
      timeline.add({
        targets: markers,
        opacity: [0, 1],
        duration: 300
      }, '-=200');
    }
    
    // Apply pulsing effect to specific nodes if requested
    if (options.pulseSelector) {
      const pulseNodes = svg.querySelectorAll(options.pulseSelector);
      if (pulseNodes.length) {
        timeline.add({
          targets: pulseNodes,
          scale: [1, 1.05, 1],
          opacity: [1, 0.9, 1],
          duration: 2000,
          loop: true,
          direction: 'alternate',
          easing: 'easeInOutSine'
        });
      }
    }
  }, options.delay || 1000);
} 