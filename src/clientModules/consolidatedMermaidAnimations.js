/**
 * Consolidated Mermaid Animations Module
 * 
 * This module provides optimized animations for Mermaid diagrams
 * with reduced complexity and better performance.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
  } else {
    initializeAnimations();
  }
  
  // Re-initialize on route change
  document.addEventListener('docusaurus.routeDidUpdate', () => {
    // Wait for DOM to update
    setTimeout(initializeAnimations, 300);
  });
}

function initializeAnimations() {
  console.log('Initializing optimized Mermaid animations...');
  
  // Add animation styles
  addAnimationStyles();
  
  // Initialize animations with delay for Mermaid rendering
  setTimeout(() => {
    enhanceMermaidDiagrams();
  }, 1000);
  
  // Initialize scroll-triggered animations
  initializeScrollAnimations();
}

function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Enhanced diagram container */
    .docusaurus-mermaid-container {
      position: relative;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      transition: all 0.3s ease;
    }
    
    /* Progressive reveal animations */
    .mermaid-step {
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.5s ease-out;
    }
    
    .mermaid-step.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Flow animation for paths */
    .mermaid .edgePath path {
      stroke-dasharray: 5, 5;
      animation: flowAnimation 3s linear infinite;
    }
    
    @keyframes flowAnimation {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 20; }
    }
    
    /* Interactive tooltip */
    .diagram-tooltip {
      position: absolute;
      background: rgba(15, 23, 42, 0.95);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1.4;
      max-width: 200px;
      z-index: 1000;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      pointer-events: none;
    }
    
    .diagram-tooltip.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Zoom controls */
    .mermaid-zoom-controls {
      position: absolute;
      bottom: 10px;
      right: 10px;
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .docusaurus-mermaid-container:hover .mermaid-zoom-controls {
      opacity: 1;
    }
    
    .mermaid-zoom-button {
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 4px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
    }
    
    /* Node interactions */
    .mermaid .node {
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .mermaid .node:hover {
      filter: brightness(1.1);
    }
    
    .mermaid .node.highlight,
    .mermaid .edgePath.highlight {
      filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.5));
    }
    
    /* Fullscreen mode */
    .mermaid-fullscreen {
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 9999;
      background: white;
      padding: 40px;
      margin: 0;
      overflow: auto;
    }
    
    [data-theme='dark'] .mermaid-fullscreen {
      background: #1e293b;
    }
    
    /* Dark mode support */
    [data-theme='dark'] .diagram-tooltip {
      background: rgba(15, 23, 42, 0.95);
      color: #e2e8f0;
    }
  `;
  
  document.head.appendChild(style);
}

function enhanceMermaidDiagrams() {
  // Find all processed Mermaid diagrams
  const diagrams = document.querySelectorAll('.mermaid[data-processed="true"]');
  
  diagrams.forEach(diagram => {
    // Skip if already enhanced
    if (diagram.classList.contains('mermaid-enhanced')) return;
    
    // Add interactive class
    diagram.classList.add('mermaid-interactive');
    diagram.classList.add('mermaid-enhanced');
    
    // Get SVG element
    const svg = diagram.querySelector('svg');
    if (!svg) return;
    
    // Add zoom controls
    addZoomControls(diagram, svg);
    
    // Add node interactivity
    addNodeInteractivity(diagram, svg);
    
    // Add fullscreen toggle
    addFullscreenToggle(diagram, svg);
    
    // Add progressive reveal
    addProgressiveReveal(diagram, svg);
  });
}

function addZoomControls(diagram, svg) {
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
  
  // Add buttons to controls
  zoomControls.appendChild(zoomOutButton);
  zoomControls.appendChild(resetZoomButton);
  zoomControls.appendChild(zoomInButton);
  
  // Add controls to diagram
  diagram.appendChild(zoomControls);
  
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
}

function addNodeInteractivity(diagram, svg) {
  // Get all nodes
  const nodes = svg.querySelectorAll('.node');
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'diagram-tooltip';
  diagram.appendChild(tooltip);
  
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
      const diagramRect = diagram.getBoundingClientRect();
      
      tooltip.style.left = `${nodeRect.left - diagramRect.left + nodeRect.width / 2}px`;
      tooltip.style.top = `${nodeRect.top - diagramRect.top - tooltip.offsetHeight - 10}px`;
      
      // Add highlight class
      node.classList.add('highlight');
      
      // Highlight connected edges
      highlightConnectedEdges(svg, node);
    });
    
    node.addEventListener('mouseleave', () => {
      // Hide tooltip
      tooltip.classList.remove('visible');
      
      // Remove highlight class
      node.classList.remove('highlight');
      
      // Remove highlight from edges
      svg.querySelectorAll('.edgePath.highlight').forEach(edge => {
        edge.classList.remove('highlight');
      });
    });
    
    // Add click effect
    node.addEventListener('click', () => {
      // Toggle highlight class
      node.classList.toggle('highlight');
      
      // Toggle highlight on connected edges
      highlightConnectedEdges(svg, node);
    });
  });
}

function highlightConnectedEdges(svg, node) {
  // Get node ID
  const nodeId = node.id;
  
  // Get all edges
  const edges = svg.querySelectorAll('.edgePath');
  
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

function addFullscreenToggle(diagram, svg) {
  // Create fullscreen button
  const fullscreenButton = document.createElement('button');
  fullscreenButton.className = 'mermaid-zoom-button';
  fullscreenButton.innerHTML = '⛶';
  fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen');
  fullscreenButton.setAttribute('title', 'Toggle fullscreen');
  
  // Add button to zoom controls
  const zoomControls = diagram.querySelector('.mermaid-zoom-controls');
  if (zoomControls) {
    zoomControls.appendChild(fullscreenButton);
  
    // Add event listener
    fullscreenButton.addEventListener('click', () => {
      // Toggle fullscreen class
      diagram.classList.toggle('mermaid-fullscreen');
      
      // Update button icon
      if (diagram.classList.contains('mermaid-fullscreen')) {
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
}

function addProgressiveReveal(diagram, svg) {
  // Get all nodes and edges
  const nodes = svg.querySelectorAll('.node');
  const edges = svg.querySelectorAll('.edgePath');
  
  // Add step class to all elements
  [...nodes, ...edges].forEach(el => {
    el.classList.add('mermaid-step');
  });
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reveal elements progressively
        revealElements(svg);
        // Disconnect observer after revealing
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  
  // Observe diagram
  observer.observe(diagram);
}

function revealElements(svg) {
  // Get all steps
  const steps = svg.querySelectorAll('.mermaid-step');
  
  // Reveal each step with delay
  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('revealed');
    }, index * 100); // 100ms delay between each element
  });
}

function initializeScrollAnimations() {
  // Create intersection observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const diagram = entry.target;
        const svg = diagram.querySelector('svg');
        
        if (svg && !diagram.classList.contains('mermaid-enhanced')) {
          // Add interactive features
          diagram.classList.add('mermaid-interactive');
          diagram.classList.add('mermaid-enhanced');
          
          // Add zoom controls
          addZoomControls(diagram, svg);
          
          // Add node interactivity
          addNodeInteractivity(diagram, svg);
          
          // Add fullscreen toggle
          addFullscreenToggle(diagram, svg);
          
          // Add progressive reveal
          addProgressiveReveal(diagram, svg);
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '50px' });
  
  // Observe all mermaid containers
  document.querySelectorAll('.docusaurus-mermaid-container').forEach(container => {
    observer.observe(container);
  });
}

export default {};
