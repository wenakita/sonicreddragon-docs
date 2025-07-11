/**
 * Enhance Mermaid Interactive Script
 * 
 * This script enhances Mermaid diagrams with interactive features, animations,
 * and modern styling. It builds upon the existing Mermaid fixes and adds
 * additional functionality.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting to enhance Mermaid diagrams with interactive features...');

// Ensure the required directories exist
const componentsDir = path.join(__dirname, '..', 'src', 'components');
const utilsDir = path.join(__dirname, '..', 'src', 'utils');
const staticCssDir = path.join(__dirname, '..', 'static', 'css');

if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
  console.log(`Created components directory at ${componentsDir}`);
}

if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, { recursive: true });
  console.log(`Created utils directory at ${utilsDir}`);
}

if (!fs.existsSync(staticCssDir)) {
  fs.mkdirSync(staticCssDir, { recursive: true });
  console.log(`Created static CSS directory at ${staticCssDir}`);
}

// Create enhanced CSS for interactive Mermaid diagrams
const mermaidInteractiveCssPath = path.join(staticCssDir, 'mermaid-interactive.css');
const mermaidInteractiveCss = `/**
 * Mermaid Interactive CSS
 *
 * This CSS provides enhanced styling for interactive Mermaid diagrams.
 */

/* Interactive Mermaid container */
.mermaid-interactive {
  position: relative;
  margin: 3rem 0;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(248, 250, 252, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transform: translateZ(0);
}

[data-theme='dark'] .mermaid-interactive {
  background: rgba(10, 10, 10, 0.7);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.mermaid-interactive:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

[data-theme='dark'] .mermaid-interactive:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.3);
}

/* Interactive node hover effects */
.mermaid-interactive .node:hover rect,
.mermaid-interactive .node:hover circle,
.mermaid-interactive .node:hover ellipse,
.mermaid-interactive .node:hover polygon,
.mermaid-interactive .node:hover path {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
  cursor: pointer;
  transform: scale(1.05);
  transition: all 0.3s ease;
}

.mermaid-interactive .edgePath:hover .path {
  stroke-width: 3px !important;
  filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.6));
  cursor: pointer;
}

/* Tooltip styles */
.mermaid-tooltip {
  position: absolute;
  background: rgba(26, 32, 44, 0.95);
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  max-width: 300px;
  z-index: 100;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  pointer-events: none;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.mermaid-tooltip.visible {
  opacity: 1;
  transform: translateY(0);
}

[data-theme='light'] .mermaid-tooltip {
  background: rgba(255, 255, 255, 0.95);
  color: #1a202c;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Fullscreen styles */
.mermaid-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  margin: 0;
  padding: 0;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  background-color: rgba(248, 250, 252, 0.95);
}

[data-theme='dark'] .mermaid-fullscreen {
  background-color: rgba(10, 10, 10, 0.95);
}

.mermaid-fullscreen .mermaid-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.mermaid-fullscreen .mermaid-container svg {
  max-height: 80vh;
  max-width: 90vw;
}

/* Zoom controls */
.mermaid-zoom-controls {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.mermaid-zoom-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #1a202c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

[data-theme='dark'] .mermaid-zoom-button {
  background: rgba(59, 130, 246, 0.2);
  color: #fff;
}

.mermaid-zoom-button:hover {
  background: rgba(59, 130, 246, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 8px rgba(59, 130, 246, 0.4);
}

/* Particle effects */
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  background-color: rgba(59, 130, 246, 0.5);
  border-radius: 50%;
  pointer-events: none;
  animation: float 15s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-30px) translateX(15px);
  }
  50% {
    transform: translateY(-15px) translateX(-15px);
  }
  75% {
    transform: translateY(-45px) translateX(10px);
  }
}

/* Node highlight effect */
.mermaid-interactive .node.highlight rect,
.mermaid-interactive .node.highlight circle,
.mermaid-interactive .node.highlight ellipse,
.mermaid-interactive .node.highlight polygon,
.mermaid-interactive .node.highlight path {
  filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.8));
  stroke-width: 3px !important;
}

.mermaid-interactive .edgePath.highlight .path {
  stroke-width: 3px !important;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
}

/* Animation for nodes */
@keyframes nodeAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mermaid-interactive .node {
  animation: nodeAppear 0.5s ease-out forwards;
}

.mermaid-interactive .node:nth-child(1) { animation-delay: 0.1s; }
.mermaid-interactive .node:nth-child(2) { animation-delay: 0.2s; }
.mermaid-interactive .node:nth-child(3) { animation-delay: 0.3s; }
.mermaid-interactive .node:nth-child(4) { animation-delay: 0.4s; }
.mermaid-interactive .node:nth-child(5) { animation-delay: 0.5s; }
.mermaid-interactive .node:nth-child(6) { animation-delay: 0.6s; }
.mermaid-interactive .node:nth-child(7) { animation-delay: 0.7s; }
.mermaid-interactive .node:nth-child(8) { animation-delay: 0.8s; }
.mermaid-interactive .node:nth-child(9) { animation-delay: 0.9s; }
.mermaid-interactive .node:nth-child(10) { animation-delay: 1.0s; }

/* Animation for edges */
@keyframes edgeAppear {
  from {
    opacity: 0;
    stroke-dashoffset: 100;
  }
  to {
    opacity: 1;
    stroke-dashoffset: 0;
  }
}

.mermaid-interactive .edgePath {
  animation: edgeAppear 1s ease-out forwards;
  stroke-dasharray: 100;
}

.mermaid-interactive .edgePath:nth-child(1) { animation-delay: 0.5s; }
.mermaid-interactive .edgePath:nth-child(2) { animation-delay: 0.6s; }
.mermaid-interactive .edgePath:nth-child(3) { animation-delay: 0.7s; }
.mermaid-interactive .edgePath:nth-child(4) { animation-delay: 0.8s; }
.mermaid-interactive .edgePath:nth-child(5) { animation-delay: 0.9s; }
.mermaid-interactive .edgePath:nth-child(6) { animation-delay: 1.0s; }
.mermaid-interactive .edgePath:nth-child(7) { animation-delay: 1.1s; }
.mermaid-interactive .edgePath:nth-child(8) { animation-delay: 1.2s; }
.mermaid-interactive .edgePath:nth-child(9) { animation-delay: 1.3s; }
.mermaid-interactive .edgePath:nth-child(10) { animation-delay: 1.4s; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .mermaid-interactive,
  .mermaid-interactive:hover,
  .mermaid-interactive .node,
  .mermaid-interactive .node:hover,
  .mermaid-interactive .edgePath,
  .mermaid-interactive .edgePath:hover,
  .mermaid-zoom-button,
  .mermaid-zoom-button:hover,
  .mermaid-tooltip,
  .particle {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
}
`;

// Write the enhanced CSS file
fs.writeFileSync(mermaidInteractiveCssPath, mermaidInteractiveCss);
console.log(`Created enhanced Mermaid interactive CSS file at ${mermaidInteractiveCssPath}`);

// Update docusaurus.config.ts to include the new CSS file
const docusaurusConfigPath = path.join(__dirname, '..', 'docusaurus.config.ts');
let docusaurusConfig = fs.readFileSync(docusaurusConfigPath, 'utf8');

// Check if the CSS file is already included
if (!docusaurusConfig.includes('/css/mermaid-interactive.css')) {
  // Find the stylesheets array
  const stylesheetsMatch = docusaurusConfig.match(/stylesheets:\s*\[([\s\S]*?)\]/);
  if (stylesheetsMatch) {
    // Add the new CSS file to the end of the array
    const updatedStylesheets = stylesheetsMatch[0].replace(
      /\]$/,
      ',\n    { href: \'/css/mermaid-interactive.css\', type: \'text/css\' }\n  ]'
    );
    docusaurusConfig = docusaurusConfig.replace(stylesheetsMatch[0], updatedStylesheets);
    
    // Write the updated config
    fs.writeFileSync(docusaurusConfigPath, docusaurusConfig);
    console.log(`Updated docusaurus.config.ts to include mermaid-interactive.css`);
  } else {
    console.error('Could not find stylesheets array in docusaurus.config.ts');
  }
}

// Update package.json to include the new script
const packageJsonPath = path.join(__dirname, '..', 'package.json');
let packageJson = fs.readFileSync(packageJsonPath, 'utf8');
const packageJsonObj = JSON.parse(packageJson);

// Add the new script if it doesn't exist
if (!packageJsonObj.scripts['enhance-mermaid-interactive']) {
  packageJsonObj.scripts['enhance-mermaid-interactive'] = 'node ./scripts/enhance-mermaid-interactive.js';
  
  // Update the build script to include the new enhancement
  packageJsonObj.scripts['build'] = packageJsonObj.scripts['build'].replace(
    'fix-mermaid-diagrams',
    'fix-mermaid-diagrams && npm run enhance-mermaid-interactive'
  );
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonObj, null, 2));
  console.log(`Updated package.json to include enhance-mermaid-interactive script`);
}

// Update the rebuild-with-mermaid-fix.js script
const rebuildScriptPath = path.join(__dirname, '..', 'scripts', 'rebuild-with-mermaid-fix.js');
if (fs.existsSync(rebuildScriptPath)) {
  let rebuildScript = fs.readFileSync(rebuildScriptPath, 'utf8');
  
  // Check if the script already includes the enhance-mermaid-interactive step
  if (!rebuildScript.includes('enhance-mermaid-interactive')) {
    // Add the new step after fix-mermaid-diagrams
    rebuildScript = rebuildScript.replace(
      /execSync\('node \.\/scripts\/fix-mermaid-diagrams\.js', { stdio: 'inherit' }\);/,
      `execSync('node ./scripts/fix-mermaid-diagrams.js', { stdio: 'inherit' });\n\n// Step 5: Enhance Mermaid with interactive features\nconsole.log('\\n=== Step 5: Enhancing Mermaid diagrams with interactive features ===');\nexecSync('node ./scripts/enhance-mermaid-interactive.js', { stdio: 'inherit' });`
    );
    
    // Write the updated script
    fs.writeFileSync(rebuildScriptPath, rebuildScript);
    console.log(`Updated rebuild-with-mermaid-fix.js to include enhance-mermaid-interactive`);
  }
}

// Create a client module for interactive Mermaid diagrams
const mermaidInteractiveModulePath = path.join(__dirname, '..', 'src', 'clientModules', 'mermaidInteractiveModule.js');
const mermaidInteractiveModule = `/**
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
  svg.style.transform = \`scale(\${zoomLevel})\`;
  svg.style.transformOrigin = 'center center';
});

zoomInButton.addEventListener('click', () => {
  zoomLevel = Math.min(2, zoomLevel + 0.1);
  svg.style.transform = \`scale(\${zoomLevel})\`;
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
    
    tooltip.style.left = \`\${nodeRect.left - diagramRect.left + nodeRect.width / 2}px\`;
    tooltip.style.top = \`\${nodeRect.top - diagramRect.top - tooltip.offsetHeight - 10}px\`;
    
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
      
      tooltip.style.left = \`\${edgeRect.left - diagramRect.left + edgeRect.width / 2}px\`;
      tooltip.style.top = \`\${edgeRect.top - diagramRect.top - tooltip.offsetHeight - 10}px\`;
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
  particle.style.width = \`\${size}px\`;
  particle.style.height = \`\${size}px\`;
  particle.style.left = \`\${Math.random() * 100}%\`;
  particle.style.top = \`\${Math.random() * 100}%\`;
  particle.style.animationDelay = \`\${Math.random() * 5}s\`;
  particle.style.opacity = \`\${Math.random() * 0.5 + 0.1}\`;
  
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
`;

// Write the interactive module file
fs.writeFileSync(mermaidInteractiveModulePath, mermaidInteractiveModule);
console.log(`Created Mermaid interactive module at ${mermaidInteractiveModulePath}`);

// Update docusaurus.config.ts to include the new client module
docusaurusConfig = fs.readFileSync(docusaurusConfigPath, 'utf8');

// Check if the client module is already included
if (!docusaurusConfig.includes('mermaidInteractiveModule.js')) {
// Find the clientModules array
const clientModulesMatch = docusaurusConfig.match(/clientModules:\s*\[([\s\S]*?)\]/);
if (clientModulesMatch) {
  // Add the new client module to the end of the array
  const updatedClientModules = clientModulesMatch[0].replace(
    /\]$/,
    ',\n    require.resolve(\'./src/clientModules/mermaidInteractiveModule.js\')\n  ]'
  );
  docusaurusConfig = docusaurusConfig.replace(clientModulesMatch[0], updatedClientModules);
  
  // Write the updated config
  fs.writeFileSync(docusaurusConfigPath, docusaurusConfig);
  console.log(`Updated docusaurus.config.ts to include mermaidInteractiveModule.js`);
} else {
  console.error('Could not find clientModules array in docusaurus.config.ts');
}
}

console.log('Finished enhancing Mermaid diagrams with interactive features.');
