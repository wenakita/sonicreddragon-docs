/**
 * Basic Animations Module
 * 
 * This module provides CSS-based animations for Mermaid diagrams.
 * It focuses on simple, performant animations that don't require Anime.js.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Default configuration
const defaultConfig = {
  enabled: true,
  flowAnimation: true,
  progressiveReveal: true,
  nodeInteractivity: true,
  zoomControls: true,
  revealDelay: 100,
  flowSpeed: 3,
};

/**
 * Add CSS styles for animations
 */
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Animation container */
    .mermaid-animation-container {
      position: relative;
      margin: 2rem 0;
    }
    
    /* Progressive reveal animations */
    .mermaid-step {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .mermaid-step.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Flow animation for edges */
    .mermaid .edgePath path {
      stroke-dasharray: 5, 5;
      animation: flowAnimation 3s linear infinite;
    }
    
    @keyframes flowAnimation {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 20; }
    }
    
    /* Node highlight effect */
    .mermaid .node {
      transition: all 0.3s ease;
    }
    
    .mermaid .node.highlight {
      filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.7));
    }
    
    .mermaid .node:hover {
      transform: scale(1.05);
    }
    
    .mermaid .edgePath.highlight path {
      stroke-width: 2.5px;
      stroke: #3b82f6;
    }
    
    /* Tooltip */
    .diagram-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      pointer-events: none;
      z-index: 100;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .diagram-tooltip.visible {
      opacity: 1;
    }
    
    /* Zoom controls */
    .mermaid-zoom-controls {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 5px;
      z-index: 10;
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }
    
    .mermaid-zoom-controls:hover {
      opacity: 1;
    }
    
    .mermaid-zoom-button {
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      line-height: 1;
    }
    
    /* Dark mode support */
    [data-theme='dark'] .mermaid-zoom-button {
      background: #333;
      border-color: #555;
      color: #fff;
    }
    
    [data-theme='dark'] .diagram-tooltip {
      background: rgba(30, 30, 30, 0.9);
      color: #f0f0f0;
    }
    
    /* Fullscreen mode */
    .mermaid-fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: white;
      z-index: 1000;
      padding: 20px;
      box-sizing: border-box;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    [data-theme='dark'] .mermaid-fullscreen {
      background: #1e1e1e;
    }
    
    .mermaid-fullscreen svg {
      max-width: 90%;
      max-height: 90%;
      margin: auto;
    }
    
    /* Animation controls */
    .mermaid-animation-controls {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      justify-content: center;
    }
    
    .mermaid-animation-button {
      background: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 14px;
    }
    
    [data-theme='dark'] .mermaid-animation-button {
      background: #333;
      border-color: #555;
      color: #fff;
    }
    
    /* Animation speed control */
    .mermaid-animation-speed {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .mermaid-animation-speed-label {
      font-size: 14px;
    }
    
    .mermaid-animation-speed-input {
      width: 80px;
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Initialize animations for Mermaid diagrams
 * @param {Object} userConfig - User configuration to override defaults
 */
function initializeAnimations(userConfig = {}) {
  // Merge user config with defaults
  const config = { ...defaultConfig, ...userConfig };
  
  if (!config.enabled) return;
  
  console.log('Initializing basic Mermaid animations...');
  
  // Wait for Mermaid diagrams to be rendered
  const checkInterval = setInterval(() => {
    const diagrams = document.querySelectorAll('.mermaid[data-processed="true"]');
    if (diagrams.length > 0) {
      clearInterval(checkInterval);
      console.log(`Found ${diagrams.length} rendered Mermaid diagrams. Applying animations...`);
      
      // Apply animations to each diagram
      diagrams.forEach(diagram => {
        enhanceDiagram(diagram, config);
      });
    }
  }, 300);
  
  // Set a timeout to stop checking after 10 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 10000);
}

/**
 * Enhance a Mermaid diagram with animations and interactivity
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Object} config - Configuration options
 */
function enhanceDiagram(diagram, config) {
  // Skip if already enhanced
  if (diagram.classList.contains('mermaid-enhanced')) {
    return;
  }
  
  // Mark as enhanced
  diagram.classList.add('mermaid-enhanced');
  
  // Get parent container
  const container = diagram.closest('.docusaurus-mermaid-container') || diagram.parentNode;
  
  // Add animation container class
  container.classList.add('mermaid-animation-container');
  
  // Get diagram type
  const diagramType = getDiagramType(diagram);
  
  // Apply type-specific enhancements
  switch (diagramType) {
    case 'flowchart':
      if (config.flowAnimation) {
        enhanceFlowchart(diagram, container);
      }
      break;
    case 'sequenceDiagram':
      enhanceSequenceDiagram(diagram, container);
      break;
    case 'classDiagram':
      enhanceClassDiagram(diagram, container);
      break;
    default:
      enhanceGenericDiagram(diagram, container);
      break;
  }
  
  // Add zoom controls
  if (config.zoomControls) {
    addZoomControls(diagram, container);
  }
  
  // Add node interactivity
  if (config.nodeInteractivity) {
    addNodeInteractivity(diagram, container);
  }
  
  // Add progressive reveal
  if (config.progressiveReveal) {
    addProgressiveReveal(diagram, container, config.revealDelay);
  }
}

/**
 * Determine the type of Mermaid diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @returns {string} - The diagram type
 */
function getDiagramType(diagram) {
  // Check SVG content to determine diagram type
  const svg = diagram.querySelector('svg');
  if (!svg) return 'unknown';
  
  if (svg.querySelector('.flowchart')) return 'flowchart';
  if (svg.querySelector('.sequenceDiagram')) return 'sequenceDiagram';
  if (svg.querySelector('.classDiagram')) return 'classDiagram';
  if (svg.querySelector('.stateDiagram')) return 'stateDiagram';
  if (svg.querySelector('.gantt')) return 'ganttChart';
  if (svg.querySelector('.journey')) return 'userJourney';
  if (svg.querySelector('.er')) return 'erDiagram';
  
  // Default to generic
  return 'generic';
}

/**
 * Enhance a flowchart diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 */
function enhanceFlowchart(diagram, container) {
  // Get all nodes and edges
  const nodes = diagram.querySelectorAll('.node');
  const edges = diagram.querySelectorAll('.edgePath');
  
  // Add flow animation to edges
  edges.forEach(edge => {
    const path = edge.querySelector('path');
    if (path) {
      path.style.strokeDasharray = '5, 5';
      path.style.animation = 'flowAnimation 3s linear infinite';
    }
  });
  
  // Add click handlers for nodes
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      // Toggle highlight class
      node.classList.toggle('highlight');
      
      // Find connected edges
      highlightConnectedEdges(diagram, node);
    });
  });
}

/**
 * Enhance a sequence diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 */
function enhanceSequenceDiagram(diagram, container) {
  // Get all actors and messages
  const actors = diagram.querySelectorAll('.actor');
  const messages = diagram.querySelectorAll('.message');
  
  // Add animation classes
  actors.forEach(actor => {
    actor.classList.add('mermaid-step');
  });
  
  messages.forEach((message, index) => {
    message.classList.add('mermaid-step');
    message.style.transitionDelay = `${index * 0.2}s`;
  });
  
  // Add animation controls
  addAnimationControls(diagram, container, 'sequence');
}

/**
 * Enhance a class diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 */
function enhanceClassDiagram(diagram, container) {
  // Get all classes
  const classes = diagram.querySelectorAll('.classGroup');
  
  // Add animation classes
  classes.forEach((classGroup, index) => {
    classGroup.classList.add('mermaid-step');
    classGroup.style.transitionDelay = `${index * 0.1}s`;
  });
  
  // Add animation controls
  addAnimationControls(diagram, container, 'class');
}

/**
 * Enhance a generic diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 */
function enhanceGenericDiagram(diagram, container) {
  // Add basic animations to all elements
  const elements = diagram.querySelectorAll('g');
  
  elements.forEach((element, index) => {
    // Skip container elements
    if (element.querySelector('g')) return;
    
    element.classList.add('mermaid-step');
    element.style.transitionDelay = `${index * 0.05}s`;
  });
}

/**
 * Add zoom controls to a diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 */
function addZoomControls(diagram, container) {
  // Create zoom controls container
  const zoomControls = document.createElement('div');
  zoomControls.className = 'mermaid-zoom-controls';
  
  // Create zoom out button
  const zoomOutButton = document.createElement('button');
  zoomOutButton.className = 'mermaid-zoom-button';
  zoomOutButton.innerHTML = '-';
  zoomOutButton.setAttribute('aria-label', 'Zoom out');
  zoomOutButton.setAttribute('title', 'Zoom out');
  
  // Create zoom in button
  const zoomInButton = document.createElement('button');
  zoomInButton.className = 'mermaid-zoom-button';
  zoomInButton.innerHTML = '+';
  zoomInButton.setAttribute('aria-label', 'Zoom in');
  zoomInButton.setAttribute('title', 'Zoom in');
  
  // Create reset zoom button
  const resetZoomButton = document.createElement('button');
  resetZoomButton.className = 'mermaid-zoom-button';
  resetZoomButton.innerHTML = '↻';
  resetZoomButton.setAttribute('aria-label', 'Reset zoom');
  resetZoomButton.setAttribute('title', 'Reset zoom');
  
  // Create fullscreen button
  const fullscreenButton = document.createElement('button');
  fullscreenButton.className = 'mermaid-zoom-button';
  fullscreenButton.innerHTML = '⛶';
  fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen');
  fullscreenButton.setAttribute('title', 'Toggle fullscreen');
  
  // Add buttons to controls
  zoomControls.appendChild(zoomOutButton);
  zoomControls.appendChild(resetZoomButton);
  zoomControls.appendChild(zoomInButton);
  zoomControls.appendChild(fullscreenButton);
  
  // Add controls to container
  container.appendChild(zoomControls);
  
  // Get SVG element
  const svg = diagram.querySelector('svg');
  if (!svg) return;
  
  // Initialize zoom level
  let zoomLevel = 1;
  
  // Add event listeners
  zoomOutButton.addEventListener('click', () => {
    zoomLevel = Math.max(0.5, zoomLevel - 0.1);
    svg.style.transform = `scale(${zoomLevel})`;
    svg.style.transformOrigin = 'center center';
  });
  
  zoomInButton.addEventListener('click', () => {
    zoomLevel = Math.min(2, zoomLevel + 0.1);
    svg.style.transform = `scale(${zoomLevel})`;
    svg.style.transformOrigin = 'center center';
  });
  
  resetZoomButton.addEventListener('click', () => {
    zoomLevel = 1;
    svg.style.transform = 'scale(1)';
    svg.style.transformOrigin = 'center center';
  });
  
  fullscreenButton.addEventListener('click', () => {
    container.classList.toggle('mermaid-fullscreen');
    
    if (container.classList.contains('mermaid-fullscreen')) {
      fullscreenButton.innerHTML = '⮌';
      fullscreenButton.setAttribute('title', 'Exit fullscreen');
      fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
    } else {
      fullscreenButton.innerHTML = '⛶';
      fullscreenButton.setAttribute('title', 'Enter fullscreen');
      fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
    }
  });
}

/**
 * Add interactivity to diagram nodes
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 */
function addNodeInteractivity(diagram, container) {
  // Get all nodes
  const nodes = diagram.querySelectorAll('.node');
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'diagram-tooltip';
  container.appendChild(tooltip);
  
  nodes.forEach(node => {
    // Get node text
    const nodeText = node.querySelector('.label')?.textContent.trim() || 'Node';
    
    // Add hover effect
    node.addEventListener('mouseenter', () => {
      // Show tooltip
      tooltip.textContent = nodeText;
      tooltip.classList.add('visible');
      
      // Position tooltip
      const nodeRect = node.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      tooltip.style.left = `${nodeRect.left - containerRect.left + nodeRect.width / 2}px`;
      tooltip.style.top = `${nodeRect.top - containerRect.top - tooltip.offsetHeight - 10}px`;
      
      // Add highlight class
      node.classList.add('highlight');
      
      // Highlight connected edges
      highlightConnectedEdges(diagram, node);
    });
    
    node.addEventListener('mouseleave', () => {
      // Hide tooltip
      tooltip.classList.remove('visible');
      
      // Remove highlight class
      node.classList.remove('highlight');
      
      // Remove highlight from edges
      diagram.querySelectorAll('.edgePath.highlight').forEach(edge => {
        edge.classList.remove('highlight');
      });
    });
  });
}

/**
 * Highlight edges connected to a node
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} node - The node element
 */
function highlightConnectedEdges(diagram, node) {
  // Get node ID
  const nodeId = node.id;
  
  // Get all edges
  const edges = diagram.querySelectorAll('.edgePath');
  
  edges.forEach(edge => {
    // Check if edge is connected to node
    const edgePath = edge.querySelector('path');
    if (!edgePath) return;
    
    const edgePathD = edgePath.getAttribute('d');
    
    // Check if edge path contains node ID
    if (edgePathD && edgePathD.includes(nodeId)) {
      edge.classList.add('highlight');
    }
  });
}

/**
 * Add progressive reveal animation to a diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 * @param {number} delay - Delay between revealing elements
 */
function addProgressiveReveal(diagram, container, delay = 100) {
  // Get all nodes and edges
  const nodes = diagram.querySelectorAll('.node');
  const edges = diagram.querySelectorAll('.edgePath');
  
  // Add step class to all elements
  [...nodes, ...edges].forEach(el => {
    el.classList.add('mermaid-step');
  });
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reveal elements progressively
        revealElements(diagram, delay);
        // Disconnect observer after revealing
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  
  // Observe container
  observer.observe(container);
}

/**
 * Reveal elements progressively
 * @param {Element} diagram - The Mermaid diagram element
 * @param {number} delay - Delay between revealing elements
 */
function revealElements(diagram, delay = 100) {
  // Get all steps
  const steps = diagram.querySelectorAll('.mermaid-step');
  
  // Reveal each step with delay
  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('revealed');
    }, index * delay);
  });
}

/**
 * Add animation controls to a diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 * @param {string} type - The diagram type
 */
function addAnimationControls(diagram, container, type) {
  // Create controls container
  const controls = document.createElement('div');
  controls.className = 'mermaid-animation-controls';
  
  // Create play button
  const playButton = document.createElement('button');
  playButton.className = 'mermaid-animation-button';
  playButton.innerHTML = 'Play';
  playButton.setAttribute('aria-label', 'Play animation');
  
  // Create reset button
  const resetButton = document.createElement('button');
  resetButton.className = 'mermaid-animation-button';
  resetButton.innerHTML = 'Reset';
  resetButton.setAttribute('aria-label', 'Reset animation');
  
  // Create speed control
  const speedControl = document.createElement('div');
  speedControl.className = 'mermaid-animation-speed';
  
  const speedLabel = document.createElement('span');
  speedLabel.className = 'mermaid-animation-speed-label';
  speedLabel.innerHTML = 'Speed:';
  
  const speedInput = document.createElement('input');
  speedInput.className = 'mermaid-animation-speed-input';
  speedInput.type = 'range';
  speedInput.min = '0.5';
  speedInput.max = '2';
  speedInput.step = '0.1';
  speedInput.value = '1';
  
  speedControl.appendChild(speedLabel);
  speedControl.appendChild(speedInput);
  
  // Add buttons to controls
  controls.appendChild(playButton);
  controls.appendChild(resetButton);
  controls.appendChild(speedControl);
  
  // Add controls to container
  container.appendChild(controls);
  
  // Animation state
  let isPlaying = false;
  let animationSpeed = 1;
  
  // Add event listeners
  playButton.addEventListener('click', () => {
    if (isPlaying) {
      pauseAnimation(diagram, type);
      playButton.innerHTML = 'Play';
    } else {
      playAnimation(diagram, type, animationSpeed);
      playButton.innerHTML = 'Pause';
    }
    isPlaying = !isPlaying;
  });
  
  resetButton.addEventListener('click', () => {
    resetAnimation(diagram, type);
    isPlaying = false;
    playButton.innerHTML = 'Play';
  });
  
  speedInput.addEventListener('input', () => {
    animationSpeed = parseFloat(speedInput.value);
    if (isPlaying) {
      pauseAnimation(diagram, type);
      playAnimation(diagram, type, animationSpeed);
    }
  });
}

/**
 * Play animation for a diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {string} type - The diagram type
 * @param {number} speed - Animation speed
 */
function playAnimation(diagram, type, speed) {
  // Reset animation first
  resetAnimation(diagram, type);
  
  // Get elements to animate
  let elements = [];
  
  switch (type) {
    case 'sequence':
      elements = diagram.querySelectorAll('.message');
      break;
    case 'class':
      elements = diagram.querySelectorAll('.classGroup');
      break;
    default:
      elements = diagram.querySelectorAll('.mermaid-step');
      break;
  }
  
  // Animate elements
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('revealed');
    }, index * (500 / speed));
  });
}

/**
 * Pause animation for a diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {string} type - The diagram type
 */
function pauseAnimation(diagram, type) {
  // Pause by freezing current state
  const elements = diagram.querySelectorAll('.mermaid-step');
  elements.forEach(element => {
    const isRevealed = element.classList.contains('revealed');
    element.style.transition = 'none';
    element.classList.toggle('revealed', isRevealed);
    
    // Force reflow
    void element.offsetWidth;
    
    // Restore transition
    element.style.transition = '';
  });
}

/**
 * Reset animation for a diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {string} type - The diagram type
 */
function resetAnimation(diagram, type) {
  // Hide all elements
  const elements = diagram.querySelectorAll('.mermaid-step');
  elements.forEach(element => {
    element.classList.remove('revealed');
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
    document.addEventListener('DOMContentLoaded', addAnimationStyles);
  } else {
    addAnimationStyles();
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAnimations(userConfig));
  } else {
    initializeAnimations(userConfig);
  }
  
  // Re-initialize on route change for SPA navigation
  document.addEventListener('docusaurus.routeDidUpdate', () => {
    // Wait for DOM to update and Mermaid to render
    setTimeout(() => initializeAnimations(userConfig), 500);
  });
}
