/**
 * Mermaid Interactive Module
 * 
 * This module adds interactivity to Mermaid diagrams.
 */

// ExecutionEnvironment is not needed in Node.js scripts
// const ExecutionEnvironment = require('@docusaurus/ExecutionEnvironment');

// Node.js script - no browser environment check needed
// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMermaidInteractive);
} else {
  initializeMermaidInteractive();
}

// Re-initialize on route change
document.addEventListener('docusaurus.routeDidUpdate', () => {
  // Wait for DOM to update
  setTimeout(initializeMermaidInteractive, 200);
});
}

function initializeMermaidInteractive() {
// Wait for Mermaid to initialize
const checkMermaid = setInterval(() => {
  const diagrams = document.querySelectorAll('.mermaid[data-processed="true"]');
  if (diagrams.length > 0) {
    clearInterval(checkMermaid);
    enhanceMermaidDiagrams();
  }
}, 500);

// Stop checking after 10 seconds
setTimeout(() => {
  clearInterval(checkMermaid);
}, 10000);
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
  
  // Add edge interactivity
  addEdgeInteractivity(diagram, svg);
  
  // Add fullscreen toggle
  addFullscreenToggle(diagram, svg);
  
  // Add particle effects for immersive diagrams
  const isImmersive = diagram.closest('[data-immersive]');
  if (isImmersive) {
    addParticleEffects(diagram);
  }
});
}

function addZoomControls(diagram, svg) {
// Create zoom controls container
const zoomControls = document.createElement('div');
zoomControls.className = 'mermaid-zoom-controls';

// Create zoom out button
const zoomOutButton = document.createElement('button');
zoomOutButton.className = 'mermaid-zoom-button';
zoomOutButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 13H5v-2h14v2z" fill="currentColor"/></svg>';
zoomOutButton.setAttribute('aria-label', 'Zoom out');
zoomOutButton.setAttribute('title', 'Zoom out');

// Create zoom in button
const zoomInButton = document.createElement('button');
zoomInButton.className = 'mermaid-zoom-button';
zoomInButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/></svg>';
zoomInButton.setAttribute('aria-label', 'Zoom in');
zoomInButton.setAttribute('title', 'Zoom in');

// Create reset zoom button
const resetZoomButton = document.createElement('button');
resetZoomButton.className = 'mermaid-zoom-button';
resetZoomButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="currentColor"/></svg>';
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
tooltip.className = 'mermaid-tooltip';
diagram.appendChild(tooltip);

nodes.forEach(node => {
  // Get node text
  const nodeText = node.querySelector('.label').textContent.trim();
  
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

function addEdgeInteractivity(diagram, svg) {
// Get all edges
const edges = svg.querySelectorAll('.edgePath');

// Create tooltip element
const tooltip = document.createElement('div');
tooltip.className = 'mermaid-tooltip';
diagram.appendChild(tooltip);

edges.forEach(edge => {
  // Get edge label if it exists
  const edgeLabel = edge.querySelector('.edgeLabel');
  const edgeLabelText = edgeLabel ? edgeLabel.textContent.trim() : '';
  
  // Add hover effect
  edge.addEventListener('mouseenter', () => {
    // Show tooltip if there's a label
    if (edgeLabelText) {
      tooltip.textContent = edgeLabelText;
      tooltip.classList.add('visible');
      
      // Position tooltip
      const edgeRect = edge.getBoundingClientRect();
      const diagramRect = diagram.getBoundingClientRect();
      
      tooltip.style.left = `${edgeRect.left - diagramRect.left + edgeRect.width / 2}px`;
      tooltip.style.top = `${edgeRect.top - diagramRect.top - tooltip.offsetHeight - 10}px`;
    }
    
    // Add highlight class
    edge.classList.add('highlight');
  });
  
  edge.addEventListener('mouseleave', () => {
    // Hide tooltip
    tooltip.classList.remove('visible');
    
    // Remove highlight class
    edge.classList.remove('highlight');
  });
  
  // Add click effect
  edge.addEventListener('click', () => {
    // Toggle highlight class
    edge.classList.toggle('highlight');
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
  const edgePathD = edgePath.getAttribute('d');
  
  // Check if edge path contains node ID
  if (edgePathD.includes(nodeId)) {
    edge.classList.add('highlight');
  }
});
}

function addFullscreenToggle(diagram, svg) {
// Create fullscreen button
const fullscreenButton = document.createElement('button');
fullscreenButton.className = 'mermaid-zoom-button';
fullscreenButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/></svg>';
fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen');
fullscreenButton.setAttribute('title', 'Toggle fullscreen');

// Add button to zoom controls
const zoomControls = diagram.querySelector('.mermaid-zoom-controls');
zoomControls.appendChild(fullscreenButton);

// Add event listener
fullscreenButton.addEventListener('click', () => {
  // Toggle fullscreen class
  diagram.classList.toggle('mermaid-fullscreen');
  
  // Update button icon
  if (diagram.classList.contains('mermaid-fullscreen')) {
    fullscreenButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="currentColor"/></svg>';
    fullscreenButton.setAttribute('title', 'Exit fullscreen');
    fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
  } else {
    fullscreenButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/></svg>';
    fullscreenButton.setAttribute('title', 'Enter fullscreen');
    fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
  }
});
}

function addParticleEffects(diagram) {
// Create particle container
const particleContainer = document.createElement('div');
particleContainer.className = 'particle-container';

// Add container to diagram
diagram.appendChild(particleContainer);

// Create particles
const particleCount = 20;
for (let i = 0; i < particleCount; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random position, size, and animation delay
  const size = Math.random() * 5 + 2;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;
  particle.style.animationDelay = `${Math.random() * 5}s`;
  particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
  
  particleContainer.appendChild(particle);
}
}

export function onRouteDidUpdate({ location, previousLocation }) {
// Re-initialize on route change
if (ExecutionEnvironment.canUseDOM && location !== previousLocation) {
  // Wait for DOM to update
  setTimeout(initializeMermaidInteractive, 200);
}
}
