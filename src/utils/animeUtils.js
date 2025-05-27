/**
 * Consolidated Animation Utilities
 * This is the main anime.js utility file for the entire application
 */
import anime from 'animejs/lib/anime.es.js';

// Cache the anime instance globally for efficiency
let animeInstance = null;

/**
 * Get the anime.js instance (lazy loaded)
 * @returns {Object} The anime.js instance
 */
export function getAnime() {
  if (!animeInstance) {
    animeInstance = anime;
  }
  return animeInstance;
}

/**
 * Check if we're in browser environment
 * @returns {boolean} True if in browser
 */
export function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 * Creates a fade-in animation for elements
 * @param {HTMLElement|NodeList|Array} targets - Elements to animate
 * @param {Object} options - Animation options
 * @returns {Object} Animation instance
 */
export function fadeIn(targets, options = {}) {
  return getAnime()({
    targets,
    opacity: [0, 1],
    translateY: [15, 0],
    duration: options.duration || 800,
    delay: options.delay || getAnime().stagger(100),
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
  return getAnime()({
    targets,
    strokeDashoffset: [getAnime().setDashoffset, 0],
    duration: options.duration || 1200,
    delay: options.delay || getAnime().stagger(150, { start: options.startDelay || 300 }),
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
  return getAnime()({
    targets,
    scale: [1, options.scale || 1.05, 1],
    opacity: [1, options.opacityMin || 0.8, 1],
    duration: options.duration || 2000,
    loop: true,
    direction: 'alternate',
    easing: options.easing || 'easeInOutSine',
    delay: options.delay || getAnime().stagger(100),
    ...options
  });
}

/**
 * Simplified Mermaid Animations - Less Intrusive
 * @param {HTMLElement} container - Mermaid container element
 * @param {Object} options - Animation options
 */
export function animateMermaidDiagram(container, options = {}) {
  if (!isBrowser() || !container) return;
  
  // Find the SVG element (either direct or within the container)
  const svg = container?.tagName === 'svg' ? container : container?.querySelector('svg');
  if (!svg) return;
  
  // Don't animate if already animated
  if (container.dataset.animated === 'true') return;
  container.dataset.animated = 'true';
  
  // Simple fade-in animation for all elements
  const allElements = svg.querySelectorAll('g, path, text, rect, circle, ellipse');
  
  if (allElements.length) {
    // Set initial state
    allElements.forEach(el => {
      el.style.opacity = '0';
    });
    
    // Simple staggered fade-in
    getAnime()({
      targets: allElements,
      opacity: [0, 1],
      duration: 600,
      delay: getAnime().stagger(50),
      easing: 'easeOutQuad',
      complete: () => {
        // Add subtle hover effects
        addSubtleHoverEffects(svg);
      }
    });
  }
}

/**
 * Add subtle hover effects - less intrusive
 */
function addSubtleHoverEffects(svg) {
  const nodes = svg.querySelectorAll('.node, .actor, .classGroup');
  
  nodes.forEach(node => {
    node.style.cursor = 'pointer';
    node.style.transition = 'opacity 0.2s ease';
    
    node.addEventListener('mouseenter', () => {
      node.style.opacity = '0.8';
    });
    
    node.addEventListener('mouseleave', () => {
      node.style.opacity = '1';
    });
  });
}

/**
 * Initialize animations for all Mermaid diagrams on the page
 * Disabled for now to prevent issues
 */
export function initializeMermaidAnimations() {
  // Disabled to prevent mermaid animation issues
  return;
}

// Export default instance for compatibility
export default anime; 