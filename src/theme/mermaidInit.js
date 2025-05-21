/**
 * mermaidInit.js - Enhanced Mermaid Animation Module
 * 
 * This module provides advanced animations and interactivity for mermaid diagrams
 * in the OmniDragon documentation. It uses anime.js for smooth animations and
 * enhances the diagrams with a modern, immersive appearance.
 */

// Global initialization function that runs once the page is loaded
export default function initMermaidEnhancements() {
  // Wait for page to fully load before enhancing mermaid diagrams
  window.addEventListener('load', () => {
    // If anime.js is not loaded, load it dynamically
    if (!window.anime) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
      script.onload = () => enhanceMermaidDiagrams();
      document.head.appendChild(script);
    } else {
      enhanceMermaidDiagrams();
    }
  });
  
  // Setup global animation function that can be called by the MermaidWrapper
  window.animateMermaidDiagrams = (container) => {
    if (!container) return;
    
    // Allow time for the SVG to be fully loaded and rendered
    setTimeout(() => {
      enhanceSingleDiagram(container);
    }, 200);
  };
}

// Main function to enhance all mermaid diagrams on the page
function enhanceMermaidDiagrams() {
  // Get all mermaid diagram containers
  const mermaidContainers = document.querySelectorAll('.mermaid-container, .standard-mermaid-container, .docusaurus-mermaid-container');
  
  // Apply enhancements to each container
  mermaidContainers.forEach(container => {
    enhanceSingleDiagram(container);
  });
  
  // Set up hover effects and interactions
  setupInteractions();
}

// Enhancement for a single diagram
function enhanceSingleDiagram(container) {
  if (!container) return;
  
  // Get the SVG element inside the container
  const svg = container.querySelector('svg');
  if (!svg) return;
  
  // Apply responsive styling
  svg.style.maxWidth = '100%';
  svg.style.height = 'auto';
  
  // Add smooth transitions for all elements
  const allElements = svg.querySelectorAll('*');
  allElements.forEach(el => {
    el.style.transition = 'all 0.3s ease';
  });
  
  // Get the diagram type to apply specific enhancements
  const isFlowchart = svg.querySelector('.flowchart-link, .flowchart, .cluster') !== null;
  const isSequence = svg.querySelector('.actor, .messageLine0, .messageLine1') !== null;
  const isClassDiagram = svg.querySelector('.classGroup, .classLabel') !== null;
  
  // Apply specific enhancements based on diagram type
  if (isFlowchart) {
    enhanceFlowchart(svg);
  } else if (isSequence) {
    enhanceSequenceDiagram(svg);
  } else if (isClassDiagram) {
    enhanceClassDiagram(svg);
  }
  
  // Apply general SVG enhancements
  enhanceSvgElements(svg);
}

// Enhance flowchart diagrams specifically
function enhanceFlowchart(svg) {
  if (!window.anime) return;
  
  // Find all edges/paths
  const edges = svg.querySelectorAll('.flowchart-link, .edgePath .path');
  if (edges.length > 0) {
    // Create a staggered animation for edges to simulate data flow
    window.anime({
      targets: edges,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1500,
      delay: (el, i) => i * 150,
      direction: 'alternate',
      loop: false
    });
  }
  
  // Create a subtle animation for nodes
  const nodes = svg.querySelectorAll('.node rect, .node circle, .node ellipse, .node polygon');
  if (nodes.length > 0) {
    window.anime({
      targets: nodes,
      scale: [0.95, 1],
      opacity: [0.8, 1],
      easing: 'easeOutElastic(1, .5)',
      duration: 800,
      delay: (el, i) => 500 + i * 50
    });
  }
  
  // Animate labels to fade in
  const labels = svg.querySelectorAll('.label');
  if (labels.length > 0) {
    window.anime({
      targets: labels,
      opacity: [0, 1],
      translateY: [10, 0],
      easing: 'easeOutQuad',
      duration: 800,
      delay: (el, i) => 1000 + i * 50
    });
  }
}

// Enhance sequence diagrams specifically
function enhanceSequenceDiagram(svg) {
  if (!window.anime) return;
  
  // Animate actors
  const actors = svg.querySelectorAll('.actor');
  if (actors.length > 0) {
    window.anime({
      targets: actors,
      translateY: [20, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 800,
      delay: (el, i) => i * 150
    });
  }
  
  // Animate message lines
  const messages = svg.querySelectorAll('.messageLine0, .messageLine1');
  if (messages.length > 0) {
    window.anime({
      targets: messages,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1200,
      delay: (el, i) => 800 + i * 200,
      direction: 'normal',
      loop: false
    });
  }
}

// Enhance class diagrams specifically
function enhanceClassDiagram(svg) {
  if (!window.anime) return;
  
  // Animate class boxes
  const classGroups = svg.querySelectorAll('.classGroup');
  if (classGroups.length > 0) {
    window.anime({
      targets: classGroups,
      scale: [0.9, 1],
      opacity: [0.7, 1],
      easing: 'easeOutElastic(1, .6)',
      duration: 1000,
      delay: (el, i) => i * 100
    });
  }
  
  // Animate relationships
  const relations = svg.querySelectorAll('.relation');
  if (relations.length > 0) {
    window.anime({
      targets: relations,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutQuad',
      duration: 1500,
      delay: (el, i) => 800 + i * 150
    });
  }
}

// General SVG enhancements for all diagram types
function enhanceSvgElements(svg) {
  // Add shadow filter if it doesn't exist
  if (!svg.querySelector('filter#shadow')) {
    const defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS('http://www.w3.org/2000/svg', 'defs'), svg.firstChild);
    
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'shadow');
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    
    const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
    feDropShadow.setAttribute('dx', '2');
    feDropShadow.setAttribute('dy', '2');
    feDropShadow.setAttribute('stdDeviation', '3');
    feDropShadow.setAttribute('flood-opacity', '0.3');
    
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
  }
  
  // Apply the shadow to appropriate elements
  const nodeShapes = svg.querySelectorAll('.node rect, .node circle, .node ellipse, .node polygon, .cluster rect');
  nodeShapes.forEach(shape => {
    shape.style.filter = 'url(#shadow)';
  });
  
  // Ensure text is crisp and readable
  const allText = svg.querySelectorAll('text');
  allText.forEach(text => {
    text.style.fontFamily = "'Inter', sans-serif";
    text.style.shapeRendering = 'geometricPrecision';
    text.style.textRendering = 'optimizeLegibility';
  });
}

// Set up interactive behaviors
function setupInteractions() {
  const diagrams = document.querySelectorAll('.mermaid-container, .standard-mermaid-container, .docusaurus-mermaid-container');
  
  diagrams.forEach(diagram => {
    const svg = diagram.querySelector('svg');
    if (!svg) return;
    
    // Node hover effects
    const nodes = svg.querySelectorAll('.node');
    nodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        if (window.anime) {
          window.anime({
            targets: node,
            scale: 1.05,
            duration: 300,
            easing: 'easeOutQuad'
          });
        } else {
          node.style.transform = 'scale(1.05)';
        }
        
        // Highlight connected edges
        highlightConnections(svg, node);
      });
      
      node.addEventListener('mouseleave', () => {
        if (window.anime) {
          window.anime({
            targets: node,
            scale: 1,
            duration: 300,
            easing: 'easeOutQuad'
          });
        } else {
          node.style.transform = 'scale(1)';
        }
        
        // Remove highlight from connections
        resetConnections(svg);
      });
    });
  });
}

// Highlight connections between nodes
function highlightConnections(svg, node) {
  // This is a simplified version - a more robust implementation would
  // need to parse the actual graph structure from the SVG
  
  // First get the node ID
  const nodeId = node.id;
  if (!nodeId) return;
  
  // Find edges connected to this node
  const edges = svg.querySelectorAll('.edgePath');
  edges.forEach(edge => {
    const edgeId = edge.id;
    if (edgeId && (edgeId.includes(nodeId + '-') || edgeId.includes('-' + nodeId))) {
      // This edge is connected to our node
      const path = edge.querySelector('path');
      if (path) {
        path.style.stroke = '#ff9800';
        path.style.strokeWidth = '3px';
        path.style.transition = 'stroke 0.3s ease, stroke-width 0.3s ease';
      }
    }
  });
}

// Reset connections to original state
function resetConnections(svg) {
  const edges = svg.querySelectorAll('.edgePath path');
  edges.forEach(path => {
    path.style.stroke = '';
    path.style.strokeWidth = '';
  });
} 