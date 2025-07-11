/**
 * Interactive Features Module
 * 
 * This module provides interactive features for Mermaid diagrams,
 * such as tooltips, explanations, and interactive elements.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Default configuration
const defaultConfig = {
  enabled: true,
  tooltips: true,
  explanations: true,
  clickableNodes: true,
  highlightConnections: true,
};

/**
 * Initialize interactive features for Mermaid diagrams
 * @param {Object} userConfig - User configuration to override defaults
 */
function initializeInteractiveFeatures(userConfig = {}) {
  // Merge user config with defaults
  const config = { ...defaultConfig, ...userConfig };
  
  if (!config.enabled) return;
  
  console.log('Initializing interactive features for Mermaid diagrams...');
  
  // Wait for Mermaid diagrams to be rendered
  const checkInterval = setInterval(() => {
    const diagrams = document.querySelectorAll('.mermaid[data-processed="true"]');
    if (diagrams.length > 0) {
      clearInterval(checkInterval);
      console.log(`Found ${diagrams.length} rendered Mermaid diagrams. Adding interactive features...`);
      
      // Apply interactive features to each diagram
      diagrams.forEach(diagram => {
        addInteractiveFeatures(diagram, config);
      });
    }
  }, 300);
  
  // Set a timeout to stop checking after 10 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 10000);
}

/**
 * Add interactive features to a Mermaid diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Object} config - Configuration options
 */
function addInteractiveFeatures(diagram, config) {
  // Skip if already enhanced
  if (diagram.classList.contains('interactive-enhanced')) {
    return;
  }
  
  // Mark as enhanced
  diagram.classList.add('interactive-enhanced');
  
  // Get parent container
  const container = diagram.closest('.docusaurus-mermaid-container') || diagram.parentNode;
  
  // Add interactive container class
  container.classList.add('mermaid-interactive-container');
  
  // Add tooltips
  if (config.tooltips) {
    addTooltips(diagram, container);
  }
  
  // Add explanations
  if (config.explanations) {
    addExplanations(diagram, container);
  }
  
  // Add clickable nodes
  if (config.clickableNodes) {
    addClickableNodes(diagram, container, config.highlightConnections);
  }
  
  // Add diagram info button
  addDiagramInfoButton(diagram, container);
}

/**
 * Add tooltips to diagram elements
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 */
function addTooltips(diagram, container) {
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
    });
    
    node.addEventListener('mouseleave', () => {
      // Hide tooltip
      tooltip.classList.remove('visible');
    });
  });
}

/**
 * Add explanations to diagram elements
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 */
function addExplanations(diagram, container) {
  // Get diagram type
  const diagramType = getDiagramType(diagram);
  
  // Create explanation element
  const explanation = document.createElement('div');
  explanation.className = 'diagram-explanation';
  container.appendChild(explanation);
  
  // Add explanation based on diagram type
  switch (diagramType) {
    case 'flowchart':
      explanation.innerHTML = `
        <h4>Flowchart Diagram</h4>
        <p>This flowchart shows the relationships and flow between different components.</p>
        <ul>
          <li>Boxes represent components or steps</li>
          <li>Arrows show the flow direction</li>
          <li>Hover over elements for more details</li>
        </ul>
      `;
      break;
    case 'sequenceDiagram':
      explanation.innerHTML = `
        <h4>Sequence Diagram</h4>
        <p>This sequence diagram shows the interaction between different actors over time.</p>
        <ul>
          <li>Vertical lines represent actors</li>
          <li>Horizontal arrows show messages</li>
          <li>Time flows from top to bottom</li>
        </ul>
      `;
      break;
    case 'classDiagram':
      explanation.innerHTML = `
        <h4>Class Diagram</h4>
        <p>This class diagram shows the structure and relationships between classes.</p>
        <ul>
          <li>Boxes represent classes</li>
          <li>Lines show relationships</li>
          <li>Methods and properties are listed inside</li>
        </ul>
      `;
      break;
    default:
      explanation.innerHTML = `
        <h4>Diagram</h4>
        <p>This diagram visualizes the structure and relationships in the system.</p>
        <ul>
          <li>Hover over elements for more details</li>
          <li>Click on nodes to highlight connections</li>
        </ul>
      `;
      break;
  }
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'explanation-close-button';
  closeButton.innerHTML = '×';
  closeButton.setAttribute('aria-label', 'Close explanation');
  explanation.appendChild(closeButton);
  
  // Add event listener to close button
  closeButton.addEventListener('click', () => {
    explanation.classList.remove('visible');
  });
  
  // Initially hide explanation
  explanation.classList.remove('visible');
}

/**
 * Add clickable nodes to a diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 * @param {boolean} highlightConnections - Whether to highlight connections
 */
function addClickableNodes(diagram, container, highlightConnections) {
  // Get all nodes
  const nodes = diagram.querySelectorAll('.node');
  
  nodes.forEach(node => {
    // Add click handler
    node.addEventListener('click', () => {
      // Toggle active class
      const wasActive = node.classList.contains('active');
      
      // Remove active class from all nodes
      nodes.forEach(n => n.classList.remove('active'));
      
      // Remove highlight from all edges
      diagram.querySelectorAll('.edgePath.highlight').forEach(edge => {
        edge.classList.remove('highlight');
      });
      
      // If node wasn't active, make it active and highlight connections
      if (!wasActive) {
        node.classList.add('active');
        
        if (highlightConnections) {
          highlightConnectedEdges(diagram, node);
        }
        
        // Show node details
        showNodeDetails(node, container);
      } else {
        // Hide node details
        hideNodeDetails(container);
      }
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
 * Show details for a node
 * @param {Element} node - The node element
 * @param {Element} container - The container element
 */
function showNodeDetails(node, container) {
  // Get node text
  const nodeText = node.querySelector('.label')?.textContent.trim() || 'Node';
  
  // Remove existing details
  hideNodeDetails(container);
  
  // Create details element
  const details = document.createElement('div');
  details.className = 'node-details';
  
  // Generate details content
  details.innerHTML = `
    <h4>${nodeText}</h4>
    <p>${generateNodeDescription(nodeText)}</p>
  `;
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'details-close-button';
  closeButton.innerHTML = '×';
  closeButton.setAttribute('aria-label', 'Close details');
  details.appendChild(closeButton);
  
  // Add event listener to close button
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    hideNodeDetails(container);
    
    // Remove active class from all nodes
    container.querySelectorAll('.node').forEach(n => n.classList.remove('active'));
    
    // Remove highlight from all edges
    container.querySelectorAll('.edgePath.highlight').forEach(edge => {
      edge.classList.remove('highlight');
    });
  });
  
  // Add details to container
  container.appendChild(details);
  
  // Show details with animation
  setTimeout(() => {
    details.classList.add('visible');
  }, 10);
}

/**
 * Hide node details
 * @param {Element} container - The container element
 */
function hideNodeDetails(container) {
  // Get existing details
  const details = container.querySelector('.node-details');
  
  if (details) {
    // Hide with animation
    details.classList.remove('visible');
    
    // Remove after animation
    setTimeout(() => {
      details.remove();
    }, 300);
  }
}

/**
 * Generate a description for a node
 * @param {string} nodeText - The text of the node
 * @returns {string} - The generated description
 */
function generateNodeDescription(nodeText) {
  // Common node types and descriptions
  const descriptions = {
    'API': 'Application Programming Interface that allows different software systems to communicate with each other.',
    'Database': 'A structured collection of data that is stored and accessed electronically.',
    'Server': 'A computer program or device that provides functionality for other programs or devices, called clients.',
    'Client': 'A piece of computer hardware or software that accesses a service made available by a server.',
    'User': 'The end user who interacts with the system.',
    'Auth': 'Authentication and authorization service that verifies user identity and permissions.',
    'Cache': 'A hardware or software component that stores data so that future requests for that data can be served faster.',
    'Load Balancer': 'Distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed.',
    'Gateway': 'A network node that connects two networks using different protocols.',
    'Microservice': 'An architectural style that structures an application as a collection of loosely coupled services.',
    'Frontend': 'The part of a website or application that users interact with directly.',
    'Backend': 'The part of a website or application that is not directly accessible by users, responsible for storing and manipulating data.',
  };
  
  // Check if node text contains any of the known types
  for (const [type, description] of Object.entries(descriptions)) {
    if (nodeText.toLowerCase().includes(type.toLowerCase())) {
      return description;
    }
  }
  
  // Default description
  return 'This is a component in the system. Click on other nodes to explore their connections and details.';
}

/**
 * Add info button to diagram
 * @param {Element} diagram - The Mermaid diagram element
 * @param {Element} container - The container element
 */
function addDiagramInfoButton(diagram, container) {
  // Create info button
  const infoButton = document.createElement('button');
  infoButton.className = 'diagram-info-button';
  infoButton.innerHTML = 'ℹ️';
  infoButton.setAttribute('aria-label', 'Diagram information');
  infoButton.setAttribute('title', 'Show diagram information');
  
  // Add event listener to info button
  infoButton.addEventListener('click', () => {
    // Toggle explanation visibility
    const explanation = container.querySelector('.diagram-explanation');
    if (explanation) {
      explanation.classList.toggle('visible');
    }
  });
  
  // Add button to container
  container.appendChild(infoButton);
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
 * Add CSS styles for interactive features
 */
function addInteractiveStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Interactive container */
    .mermaid-interactive-container {
      position: relative;
      margin: 2rem 0;
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
      transform: translateX(-50%) translateY(-100%);
    }
    
    .diagram-tooltip.visible {
      opacity: 1;
    }
    
    .diagram-tooltip::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid rgba(0, 0, 0, 0.8);
    }
    
    /* Explanation */
    .diagram-explanation {
      position: absolute;
      top: 10px;
      right: 10px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      width: 250px;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 50;
      opacity: 0;
      transform: translateX(20px);
      transition: all 0.3s ease;
      max-height: 80%;
      overflow-y: auto;
    }
    
    .diagram-explanation.visible {
      opacity: 1;
      transform: translateX(0);
    }
    
    .diagram-explanation h4 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 16px;
    }
    
    .diagram-explanation p {
      margin-bottom: 8px;
    }
    
    .diagram-explanation ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .explanation-close-button {
      position: absolute;
      top: 5px;
      right: 5px;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }
    
    /* Node details */
    .node-details {
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 12px;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 50;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }
    
    .node-details.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .node-details h4 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 16px;
    }
    
    .node-details p {
      margin-bottom: 0;
    }
    
    .details-close-button {
      position: absolute;
      top: 5px;
      right: 5px;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }
    
    /* Info button */
    .diagram-info-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      z-index: 40;
    }
    
    /* Active node */
    .mermaid .node.active {
      filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.7));
    }
    
    /* Highlighted edge */
    .mermaid .edgePath.highlight path {
      stroke-width: 2.5px;
      stroke: #3b82f6;
    }
    
    /* Dark mode support */
    [data-theme='dark'] .diagram-explanation,
    [data-theme='dark'] .node-details,
    [data-theme='dark'] .diagram-info-button {
      background: #1e1e1e;
      border-color: #444;
      color: #f0f0f0;
    }
    
    [data-theme='dark'] .explanation-close-button,
    [data-theme='dark'] .details-close-button {
      color: #aaa;
    }
    
    [data-theme='dark'] .diagram-tooltip {
      background: rgba(30, 30, 30, 0.9);
    }
    
    [data-theme='dark'] .diagram-tooltip::after {
      border-top-color: rgba(30, 30, 30, 0.9);
    }
  `;
  
  document.head.appendChild(style);
}

// Main export function
export default function(userConfig = {}) {
  // Only execute in browser environment
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }
  
  // Add styles when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addInteractiveStyles);
  } else {
    addInteractiveStyles();
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeInteractiveFeatures(userConfig));
  } else {
    initializeInteractiveFeatures(userConfig);
  }
  
  // Re-initialize on route change for SPA navigation
  document.addEventListener('docusaurus.routeDidUpdate', () => {
    // Wait for DOM to update and Mermaid to render
    setTimeout(() => initializeInteractiveFeatures(userConfig), 500);
  });
  
  // Export utility functions
  return {
    addTooltips,
    addExplanations,
    addClickableNodes,
    showNodeDetails,
    hideNodeDetails,
  };
}
