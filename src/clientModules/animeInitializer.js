/**
 * Client module to initialize anime.js animations
 */
import anime from 'animejs/lib/anime.es.js';

/**
 * Animation function to apply to Mermaid diagrams
 * @param {HTMLElement} container - The container element
 */
function animateMermaidElements(container) {
  // Find the SVG element (either direct or within the container)
  const svg = container?.tagName === 'svg' ? container : container?.querySelector('svg');
  if (!svg) return;
  
  // Create animation timeline
  const timeline = anime.timeline({
    easing: 'easeOutExpo',
    duration: 800
  });
  
  // Apply initial opacity to prevent flashing
  const animatableElements = svg.querySelectorAll(
    'g.node rect, g.node circle, g.node ellipse, .actor, ' +
    'g.node .label, .messageText, .loopText, text:not(.actor), ' +
    '.edgePath path, .messageLine0, .messageLine1, ' +
    'marker, .marker'
  );
  
  // Initially hide elements to prevent flash
  animatableElements.forEach(el => {
    if (el.style) {
      el.style.opacity = '0';
    } else if (el.setAttribute) {
      el.setAttribute('opacity', '0');
    }
  });
  
  // Nodes (rect, circle, ellipse)
  const nodes = svg.querySelectorAll('g.node rect, g.node circle, g.node ellipse, .actor');
  if (nodes.length) {
    timeline.add({
      targets: nodes,
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: 800,
      delay: anime.stagger(70)
    });
  }
  
  // Labels and text
  const labels = svg.querySelectorAll('g.node .label, .messageText, .loopText, text:not(.actor)');
  if (labels.length) {
    timeline.add({
      targets: labels,
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(50)
    }, '-=600');
  }
  
  // Edges/paths
  const edges = svg.querySelectorAll('.edgePath path, .messageLine0, .messageLine1');
  if (edges.length) {
    // Set up stroke-dasharray and stroke-dashoffset for paths
    edges.forEach(path => {
      if (path.getTotalLength) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      }
    });
    
    timeline.add({
      targets: edges,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeInOutSine'
    }, '-=400');
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
}

/**
 * Initialize animations for all Mermaid diagrams on the page
 * @param {HTMLElement|null} targetElement - Optional specific element to animate
 */
function initializeAllAnimations(targetElement) {
  // If a specific element is provided, only animate that
  if (targetElement) {
    if (!targetElement.dataset.animated) {
      targetElement.dataset.animated = 'true';
      animateMermaidElements(targetElement);
    }
    return;
  }
  
  // Standard Mermaid containers
  const standardMermaidContainers = document.querySelectorAll(
    '.standard-mermaid-container, .standardMermaidContainer'
  );
  
  standardMermaidContainers.forEach(container => {
    // Skip if already animated
    if (container.dataset.animated === 'true') return;
    
    // Mark as animated to prevent duplicate animations
    container.dataset.animated = 'true';
    
    // Apply animations
    animateMermaidElements(container);
  });
  
  // Docusaurus Mermaid containers
  const docusaurusMermaidContainers = document.querySelectorAll('.docusaurus-mermaid-container');
  
  docusaurusMermaidContainers.forEach(container => {
    // Skip if already animated
    if (container.dataset.animated === 'true') return;
    
    // Mark as animated to prevent duplicate animations
    container.dataset.animated = 'true';
    
    // Apply animations
    animateMermaidElements(container);
  });
  
  // Direct mermaid elements
  const directMermaidElements = document.querySelectorAll('.mermaid-diagram-container .mermaid, .mermaid');
  directMermaidElements.forEach(el => {
    // Only animate elements that have been processed and have SVG
    const svg = el.querySelector('svg');
    if (svg && !el.dataset.animated) {
      el.dataset.animated = 'true';
      animateMermaidElements(el);
    }
  });
}

// Register global animation function
if (typeof window !== 'undefined') {
  window.animateMermaidDiagrams = initializeAllAnimations;
}

// Execute on route change
export function onRouteDidUpdate() {
  if (typeof window !== 'undefined') {
    // Wait for Mermaid diagrams to finish rendering
    setTimeout(() => {
      initializeAllAnimations();
    }, 500);
  }
  return null;
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Wait for Mermaid diagrams to finish rendering
    setTimeout(() => {
      initializeAllAnimations();
    }, 600);
  });
  
  // Also observe DOM changes to animate diagrams that are added dynamically
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      // Check if any mutations might have added Mermaid diagrams
      const shouldCheckForDiagrams = mutations.some(mutation => {
        return mutation.type === 'childList' && mutation.addedNodes.length > 0;
      });
      
      if (shouldCheckForDiagrams) {
        setTimeout(() => {
          initializeAllAnimations();
        }, 500);
      }
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
} 