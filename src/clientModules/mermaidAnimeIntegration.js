/**
 * Mermaid Anime.js Integration Module
 * 
 * This module integrates Anime.js with Mermaid diagrams for advanced animations.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimeIntegration);
  } else {
    initializeAnimeIntegration();
  }
  
  // Re-initialize on route change
  document.addEventListener('docusaurus.routeDidUpdate', () => {
    // Wait for DOM to update and Mermaid to render
    setTimeout(initializeAnimeIntegration, 500);
  });
}

async function initializeAnimeIntegration() {
  console.log('Initializing Anime.js integration with Mermaid...');
  
  // Dynamically import Anime.js
  let anime;
  try {
    anime = (await import('animejs')).default;
  } catch (error) {
    console.error('Failed to load Anime.js:', error);
    return;
  }
  
  // Wait for Mermaid diagrams to be rendered
  const checkInterval = setInterval(() => {
    const diagrams = document.querySelectorAll('.mermaid[data-processed="true"]');
    if (diagrams.length > 0) {
      clearInterval(checkInterval);
      console.log(`Found ${diagrams.length} rendered Mermaid diagrams. Applying Anime.js animations...`);
      
      // Apply animations to each diagram
      diagrams.forEach(diagram => {
        enhanceDiagramWithAnime(diagram, anime);
      });
    }
  }, 300);
  
  // Set a timeout to stop checking after 10 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 10000);
}

function enhanceDiagramWithAnime(diagram, anime) {
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
    const animationDuration = parseInt(animationContainer.getAttribute('data-anime-duration') || '1000', 10);
    const animationEasing = animationContainer.getAttribute('data-anime-easing') || 'easeOutElastic(1, .5)';
    
    // Initialize specific animation
    initializeAnimeAnimation(diagram, anime, animationType, animationDuration, animationEasing);
  } else {
    // Add default animation controls
    addAnimeControls(diagram, container, anime);
  }
}

function initializeAnimeAnimation(diagram, anime, animationType, duration, easing) {
  console.log(`Initializing ${animationType} animation with Anime.js...`);
  
  // Get SVG element
  const svg = diagram.querySelector('svg');
  if (!svg) return;
  
  switch (animationType) {
    case 'staggered-fade':
      applyStaggeredFadeAnimation(svg, anime, duration, easing);
      break;
    case 'path-drawing':
      applyPathDrawingAnimation(svg, anime, duration, easing);
      break;
    case 'node-scale':
      applyNodeScaleAnimation(svg, anime, duration, easing);
      break;
    case 'color-shift':
      applyColorShiftAnimation(svg, anime, duration, easing);
      break;
    case 'motion-path':
      applyMotionPathAnimation(svg, anime, duration, easing);
      break;
    default:
      console.log(`Unknown animation type: ${animationType}, applying default animation`);
      applyDefaultAnimation(svg, anime, duration, easing);
      break;
  }
}

function applyStaggeredFadeAnimation(svg, anime, duration, easing) {
  // Get all nodes and edges
  const elements = [...svg.querySelectorAll('.node'), ...svg.querySelectorAll('.edgePath')];
  
  // Set initial opacity
  elements.forEach(el => {
    el.style.opacity = '0';
  });
  
  // Create animation
  anime({
    targets: elements,
    opacity: 1,
    duration: duration,
    easing: easing,
    delay: anime.stagger(100),
    begin: () => {
      console.log('Starting staggered fade animation');
    }
  });
}

function applyPathDrawingAnimation(svg, anime, duration, easing) {
  // Get all paths
  const paths = svg.querySelectorAll('path');
  
  // Prepare paths for animation
  paths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });
  
  // Create animation
  anime({
    targets: paths,
    strokeDashoffset: 0,
    duration: duration,
    easing: easing,
    delay: anime.stagger(100),
    begin: () => {
      console.log('Starting path drawing animation');
    }
  });
}

function applyNodeScaleAnimation(svg, anime, duration, easing) {
  // Get all nodes
  const nodes = svg.querySelectorAll('.node');
  
  // Set initial scale
  nodes.forEach(node => {
    node.style.transformOrigin = 'center';
    node.style.transform = 'scale(0)';
  });
  
  // Create animation
  anime({
    targets: nodes,
    scale: 1,
    duration: duration,
    easing: easing,
    delay: anime.stagger(100),
    begin: () => {
      console.log('Starting node scale animation');
    }
  });
}

function applyColorShiftAnimation(svg, anime, duration, easing) {
  // Get all nodes and edges
  const nodes = svg.querySelectorAll('.node rect, .node circle, .node ellipse, .node polygon');
  
  // Create animation
  anime({
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

function applyMotionPathAnimation(svg, anime, duration, easing) {
  // Get all nodes
  const nodes = svg.querySelectorAll('.node');
  
  // Create a motion path
  const path = anime.path('M0 0 L50 50 L100 0 L150 50 L200 0');
  
  // Create animation
  anime({
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

function applyDefaultAnimation(svg, anime, duration, easing) {
  // Get all elements
  const elements = svg.querySelectorAll('g');
  
  // Create animation
  anime({
    targets: elements,
    opacity: [0, 1],
    translateY: [10, 0],
    duration: duration,
    easing: easing,
    delay: anime.stagger(50),
    begin: () => {
      console.log('Starting default animation');
    }
  });
}

function addAnimeControls(diagram, container, anime) {
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
      initializeAnimeAnimation(diagram, anime, animation.type, 1000, 'easeOutElastic(1, .5)');
    });
    
    controls.appendChild(button);
  });
  
  // Add controls to container
  container.appendChild(controls);
}

export default {};
