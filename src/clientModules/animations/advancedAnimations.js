/**
 * Advanced Animations Module
 * 
 * This module provides advanced animations for Mermaid diagrams using Anime.js.
 * It consolidates functionality from mermaidAnimeIntegration.js and parts of animeModule.js.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Default configuration
const defaultConfig = {
  enabled: true,
  defaultAnimation: 'staggered-fade',
  duration: 1000,
  easing: 'easeOutElastic(1, .5)',
  autoplay: true,
  delay: 500,
};

/**
 * Initialize advanced animations for Mermaid diagrams
 * @param {Object} userConfig - User configuration to override defaults
 */
async function initializeAdvancedAnimations(userConfig = {}) {
  // Merge user config with defaults
  const config = { ...defaultConfig, ...userConfig };
  
  if (!config.enabled) return;
  
  console.log('Initializing advanced Mermaid animations with Anime.js...');
  
  // Check if Anime.js is available
  if (typeof window.anime === 'undefined') {
    console.warn('Anime.js not found. Advanced animations will not be available.');
    return;
  }
  
  // Wait for Mermaid diagrams to be rendered
  const checkInterval = setInterval(() => {
    const diagrams = document.querySelectorAll('.mermaid[data-processed="true"]');
    if (diagrams.length > 0) {
      clearInterval(checkInterval);
      console.log(`Found ${diagrams.length} rendered Mermaid diagrams. Applying advanced animations...`);
      
      // Apply animations to each diagram
      diagrams.forEach(diagram => {
        enhanceDiagramWithAnime(diagram, config);
      });
    }
  }, 300);
  
  // Set a timeout to stop checking after 10 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 10000);
}

/**
 * Enhance a Mermaid diagram with Anime.js animations
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Object} config - Configuration options
 */
function enhanceDiagramWithAnime(diagram, config) {
  // Skip if already enhanced with Anime.js
  if (diagram.classList.contains('anime-enhanced')) {
    return;
  }
  
  // Mark as enhanced
  diagram.classList.add('anime-enhanced');
  
  // Get parent container
  const container = diagram.closest('.docusaurus-mermaid-container') || diagram.parentNode;
  
  // Add anime container class
  container.classList.add('anime-animation-container');
  
  // Check for animation attributes
  const animationContainer = diagram.closest('[data-anime]');
  if (animationContainer) {
    const animationType = animationContainer.getAttribute('data-anime');
    const animationDuration = parseInt(animationContainer.getAttribute('data-anime-duration') || config.duration, 10);
    const animationEasing = animationContainer.getAttribute('data-anime-easing') || config.easing;
    
    // Initialize specific animation
    initializeAnimeAnimation(diagram, animationType, animationDuration, animationEasing);
  } else {
    // Add default animation controls
    addAnimeControls(diagram, container, config);
  }
}

/**
 * Initialize a specific Anime.js animation for a diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {string} animationType - The type of animation to apply
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} easing - Animation easing function
 */
function initializeAnimeAnimation(diagram, animationType, duration, easing) {
  console.log(`Initializing ${animationType} animation with Anime.js...`);
  
  // Get SVG element
  const svg = diagram.querySelector('svg');
  if (!svg) return;
  
  switch (animationType) {
    case 'staggered-fade':
      applyStaggeredFadeAnimation(svg, duration, easing);
      break;
    case 'path-drawing':
      applyPathDrawingAnimation(svg, duration, easing);
      break;
    case 'node-scale':
      applyNodeScaleAnimation(svg, duration, easing);
      break;
    case 'color-shift':
      applyColorShiftAnimation(svg, duration, easing);
      break;
    case 'motion-path':
      applyMotionPathAnimation(svg, duration, easing);
      break;
    default:
      console.log(`Unknown animation type: ${animationType}, applying default animation`);
      applyDefaultAnimation(svg, duration, easing);
      break;
  }
}

/**
 * Apply a staggered fade animation to a diagram
 * @param {SVGElement} svg - The SVG element of the diagram
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} easing - Animation easing function
 */
function applyStaggeredFadeAnimation(svg, duration, easing) {
  // Get all nodes and edges
  const elements = [...svg.querySelectorAll('.node'), ...svg.querySelectorAll('.edgePath')];
  
  // Set initial opacity
  elements.forEach(el => {
    el.style.opacity = '0';
  });
  
  // Create animation
  window.anime({
    targets: elements,
    opacity: 1,
    duration: duration,
    easing: easing,
    delay: window.anime.stagger(100),
    begin: () => {
      console.log('Starting staggered fade animation');
    }
  });
}

/**
 * Apply a path drawing animation to a diagram
 * @param {SVGElement} svg - The SVG element of the diagram
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} easing - Animation easing function
 */
function applyPathDrawingAnimation(svg, duration, easing) {
  // Get all paths
  const paths = svg.querySelectorAll('path');
  
  // Prepare paths for animation
  paths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });
  
  // Create animation
  window.anime({
    targets: paths,
    strokeDashoffset: 0,
    duration: duration,
    easing: easing,
    delay: window.anime.stagger(100),
    begin: () => {
      console.log('Starting path drawing animation');
    }
  });
}

/**
 * Apply a node scale animation to a diagram
 * @param {SVGElement} svg - The SVG element of the diagram
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} easing - Animation easing function
 */
function applyNodeScaleAnimation(svg, duration, easing) {
  // Get all nodes
  const nodes = svg.querySelectorAll('.node');
  
  // Set initial scale
  nodes.forEach(node => {
    node.style.transformOrigin = 'center';
    node.style.transform = 'scale(0)';
  });
  
  // Create animation
  window.anime({
    targets: nodes,
    scale: 1,
    duration: duration,
    easing: easing,
    delay: window.anime.stagger(100),
    begin: () => {
      console.log('Starting node scale animation');
    }
  });
}

/**
 * Apply a color shift animation to a diagram
 * @param {SVGElement} svg - The SVG element of the diagram
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} easing - Animation easing function
 */
function applyColorShiftAnimation(svg, duration, easing) {
  // Get all nodes and edges
  const nodes = svg.querySelectorAll('.node rect, .node circle, .node ellipse, .node polygon');
  
  // Create animation
  window.anime({
    targets: nodes,
    fill: [
      { value: '#FF5733', duration: duration / 3 },
      { value: '#33FF57', duration: duration / 3 },
      { value: '#3357FF', duration: duration / 3 }
    ],
    easing: easing,
    direction: 'alternate',
    loop: true,
    begin: () => {
      console.log('Starting color shift animation');
    }
  });
}

/**
 * Apply a motion path animation to a diagram
 * @param {SVGElement} svg - The SVG element of the diagram
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} easing - Animation easing function
 */
function applyMotionPathAnimation(svg, duration, easing) {
  // Get all nodes
  const nodes = svg.querySelectorAll('.node');
  
  // Create a motion path
  const path = window.anime.path('M0 0 L50 50 L100 0 L150 50 L200 0');
  
  // Create animation
  window.anime({
    targets: nodes,
    translateX: path('x'),
    translateY: path('y'),
    duration: duration,
    easing: easing,
    loop: true,
    direction: 'alternate',
    begin: () => {
      console.log('Starting motion path animation');
    }
  });
}

/**
 * Apply a default animation to a diagram
 * @param {SVGElement} svg - The SVG element of the diagram
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} easing - Animation easing function
 */
function applyDefaultAnimation(svg, duration, easing) {
  // Get all elements
  const elements = svg.querySelectorAll('g');
  
  // Create animation
  window.anime({
    targets: elements,
    opacity: [0, 1],
    translateY: [10, 0],
    duration: duration,
    easing: easing,
    delay: window.anime.stagger(50),
    begin: () => {
      console.log('Starting default animation');
    }
  });
}

/**
 * Add animation controls to a diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 * @param {Object} config - Configuration options
 */
function addAnimeControls(diagram, container, config) {
  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'anime-animation-controls';
  controls.style.display = 'flex';
  controls.style.justifyContent = 'center';
  controls.style.marginTop = '10px';
  controls.style.gap = '8px';
  
  // Create animation buttons
  const animations = [
    { name: 'Staggered Fade', type: 'staggered-fade' },
    { name: 'Path Drawing', type: 'path-drawing' },
    { name: 'Node Scale', type: 'node-scale' },
    { name: 'Color Shift', type: 'color-shift' }
  ];
  
  animations.forEach(animation => {
    const button = document.createElement('button');
    button.className = 'anime-animation-button';
    button.innerHTML = animation.name;
    button.style.background = '#3b82f6';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.padding = '4px 12px';
    button.style.fontSize = '12px';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', () => {
      // Get SVG element
      const svg = diagram.querySelector('svg');
      if (!svg) return;
      
      // Initialize animation
      initializeAnimeAnimation(diagram, animation.type, config.duration, config.easing);
    });
    
    controls.appendChild(button);
  });
  
  // Add controls to container
  container.appendChild(controls);
}

/**
 * Add CSS styles for Anime.js animations
 */
function addAnimeStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .anime-animation-container {
      position: relative;
      margin: 2rem 0;
    }
    
    .anime-animation-controls {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      justify-content: center;
    }
    
    .anime-animation-button {
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .anime-animation-button:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
    
    /* Dark mode support */
    [data-theme='dark'] .anime-animation-button {
      background: #3b82f6;
      color: white;
    }
    
    [data-theme='dark'] .anime-animation-button:hover {
      background: #2563eb;
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Create a particle animation
 * @param {Element} container - The container element
 * @param {Object} options - Particle animation options
 */
function createParticleAnimation(container, options = {}) {
  // Check if Anime.js is available
  if (typeof window.anime === 'undefined') {
    console.warn('Anime.js not found. Particle animation will not be available.');
    return;
  }
  
  // Default options
  const defaults = {
    count: 20,
    size: 5,
    color: '#3b82f6',
    duration: 2000,
    easing: 'easeOutExpo',
    speed: 1,
    direction: 'random', // 'random', 'top', 'bottom', 'left', 'right'
  };
  
  // Merge options with defaults
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
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10';
    
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

/**
 * Create a flow animation for diagram edges
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Object} options - Flow animation options
 */
function createFlowAnimation(diagram, options = {}) {
  // Check if Anime.js is available
  if (typeof window.anime === 'undefined') {
    console.warn('Anime.js not found. Flow animation will not be available.');
    return;
  }
  
  // Default options
  const defaults = {
    duration: 2000,
    easing: 'linear',
    loop: true,
    particleSize: 3,
    particleColor: '#3b82f6',
    particleCount: 2,
  };
  
  // Merge options with defaults
  const settings = { ...defaults, ...options };
  
  // Get all edges
  const edges = diagram.querySelectorAll('.edgePath');
  
  edges.forEach(edge => {
    const path = edge.querySelector('path');
    if (!path) return;
    
    // Get path length
    const pathLength = path.getTotalLength();
    
    // Create particles for this path
    for (let i = 0; i < settings.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'anime-flow-particle';
      particle.style.position = 'absolute';
      particle.style.width = `${settings.particleSize}px`;
      particle.style.height = `${settings.particleSize}px`;
      particle.style.backgroundColor = settings.particleColor;
      particle.style.borderRadius = '50%';
      particle.style.opacity = '0';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '10';
      
      diagram.appendChild(particle);
      
      // Animate particle along the path
      window.anime({
        targets: particle,
        opacity: [0, 0.8, 0],
        duration: settings.duration,
        easing: settings.easing,
        loop: settings.loop,
        delay: i * (settings.duration / settings.particleCount),
        update: function(anim) {
          const progress = (anim.progress + i * (100 / settings.particleCount)) % 100 / 100;
          const point = path.getPointAtLength(pathLength * progress);
          
          // Position particle at the current point on the path
          particle.style.left = `${point.x}px`;
          particle.style.top = `${point.y}px`;
        }
      });
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
    document.addEventListener('DOMContentLoaded', () => initializeAdvancedAnimations(userConfig));
  } else {
    initializeAdvancedAnimations(userConfig);
  }
  
  // Re-initialize on route change for SPA navigation
  document.addEventListener('docusaurus.routeDidUpdate', () => {
    // Wait for DOM to update and Mermaid to render
    setTimeout(() => initializeAdvancedAnimations(userConfig), 500);
  });
  
  // Export utility functions
  return {
    createParticleAnimation,
    createFlowAnimation,
    applyStaggeredFadeAnimation,
    applyPathDrawingAnimation,
    applyNodeScaleAnimation,
    applyColorShiftAnimation,
    applyMotionPathAnimation,
  };
}
