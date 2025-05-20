/**
 * Mermaid diagram enhancements
 * - Makes diagrams expandable
 * - Adds animation controls
 */

// Wait for document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create backdrop for expanded diagrams
  const backdrop = document.createElement('div');
  backdrop.className = 'mermaid-backdrop';
  document.body.appendChild(backdrop);
  
  // Initialize once diagrams are rendered
  setTimeout(setupMermaidDiagrams, 1000);
  
  // Also set up when navigating between pages
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        setTimeout(setupMermaidDiagrams, 500);
      }
    });
  });
  
  // Target the main content area for Docusaurus
  const contentArea = document.querySelector('main');
  if (contentArea) {
    observer.observe(contentArea, { childList: true, subtree: true });
  }
});

/**
 * Set up all Mermaid diagrams on the page
 */
function setupMermaidDiagrams() {
  const mermaidDivs = document.querySelectorAll('.mermaid');
  
  mermaidDivs.forEach((mermaidDiv, index) => {
    // Skip if already wrapped
    if (mermaidDiv.parentElement.classList.contains('mermaid-wrapper')) {
      return;
    }
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid-wrapper expandable';
    wrapper.setAttribute('data-diagram-id', `diagram-${index}`);
    
    // Add hint to expand
    const expandHint = document.createElement('div');
    expandHint.className = 'expand-hint';
    expandHint.textContent = 'Click to expand';
    
    // Add close button for expanded view
    const closeButton = document.createElement('button');
    closeButton.className = 'mermaid-close';
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close diagram');
    
    // Replace original diagram with wrapped version
    mermaidDiv.parentNode.insertBefore(wrapper, mermaidDiv);
    wrapper.appendChild(mermaidDiv);
    wrapper.appendChild(expandHint);
    wrapper.appendChild(closeButton);
    
    // Make animation more visible for specific elements
    enhanceMermaidAnimations(mermaidDiv);
    
    // Add interaction for expansion
    setupDiagramExpansion(wrapper);
  });
}

/**
 * Enhance animations for specific diagram types
 */
function enhanceMermaidAnimations(diagram) {
  // Delay to ensure diagram is rendered
  setTimeout(() => {
    // Find flowchart links and add animation classes
    const edges = diagram.querySelectorAll('.flowchart-link, .edgePath .path');
    edges.forEach(edge => {
      // Add base animation class
      edge.classList.add('animated-path');
      
      // Check marker-end to determine type of connection
      const markerEnd = edge.getAttribute('marker-end');
      if (markerEnd && markerEnd.includes('arrow')) {
        edge.classList.add('thick');
      }
      
      // Check styles for dashed lines
      const style = edge.getAttribute('style');
      if (style && style.includes('dash')) {
        edge.classList.add('dashed');
      }
    });
  }, 500);
}

/**
 * Set up expansion functionality for a diagram
 */
function setupDiagramExpansion(wrapper) {
  const backdrop = document.querySelector('.mermaid-backdrop');
  const closeButton = wrapper.querySelector('.mermaid-close');
  
  // Toggle expanded state on click
  wrapper.addEventListener('click', function(e) {
    if (!wrapper.classList.contains('expanded')) {
      wrapper.classList.add('expanded');
      backdrop.classList.add('visible');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  });
  
  // Close diagram when clicking backdrop
  backdrop.addEventListener('click', function() {
    wrapper.classList.remove('expanded');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  });
  
  // Close button functionality
  closeButton.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent triggering wrapper click
    wrapper.classList.remove('expanded');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
  });
  
  // Prevent diagram click from closing when clicking inside
  wrapper.querySelector('.mermaid').addEventListener('click', function(e) {
    if (wrapper.classList.contains('expanded')) {
      e.stopPropagation();
    }
  });
}

// Add keyboard support for accessibility
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const expandedDiagram = document.querySelector('.mermaid-wrapper.expanded');
    if (expandedDiagram) {
      expandedDiagram.classList.remove('expanded');
      document.querySelector('.mermaid-backdrop').classList.remove('visible');
      document.body.style.overflow = '';
    }
  }
}); 