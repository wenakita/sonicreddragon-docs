/**
 * Mermaid diagram enhancements
 * - Makes diagrams expandable
 * - Adds animation controls
 * - Adds zoom controls
 * - Provides sequential highlighting
 * - Supports exporting as image
 * - Provides dark mode toggle
 * - Adds reset zoom functionality
 * - Enables copying diagram source code
 */

// Only execute in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Wait for document to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Create backdrop for expanded diagrams
    const backdrop = document.createElement('div');
    backdrop.className = 'mermaid-backdrop';
    document.body.appendChild(backdrop);
    
    // Initialize once diagrams are rendered with longer delay
    setTimeout(setupMermaidDiagrams, 2000);
    
    // Also set up when navigating between pages
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          setTimeout(setupMermaidDiagrams, 1000);
        }
      });
    });
    
    // Target the main content area for Docusaurus
    const contentArea = document.querySelector('main');
    if (contentArea) {
      observer.observe(contentArea, { childList: true, subtree: true });
    }
    
    // Periodically check for diagrams that don't have controls
    setInterval(checkForMissingControls, 3000);
  });

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
}

/**
 * Check for diagrams that don't have controls and set them up
 */
function checkForMissingControls() {
  if (typeof document === 'undefined') return;
  
  const allMermaidDivs = document.querySelectorAll('.mermaid');
  
  allMermaidDivs.forEach((div) => {
    // If this diagram isn't wrapped yet and has SVG content (rendered)
    if (!div.parentElement.classList.contains('mermaid-wrapper') && div.querySelector('svg')) {
      console.log('Found a mermaid diagram without controls, setting up now');
      setupMermaidDiagrams();
    }
  });
}

/**
 * Set up all Mermaid diagrams on the page
 */
function setupMermaidDiagrams() {
  if (typeof document === 'undefined') return;
  
  console.log('Setting up Mermaid diagrams with interactive controls');
  
  const mermaidDivs = document.querySelectorAll('.mermaid');
  console.log(`Found ${mermaidDivs.length} mermaid diagrams`);
  
  mermaidDivs.forEach((mermaidDiv, index) => {
    // Skip if already wrapped
    if (mermaidDiv.parentElement.classList.contains('mermaid-wrapper')) {
      console.log(`Diagram ${index} already has controls`);
      return;
    }
    
    console.log(`Setting up controls for diagram ${index}`);
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid-wrapper expandable';
    wrapper.setAttribute('data-diagram-id', `diagram-${index}`);
    
    // Add controls wrapper
    const controls = document.createElement('div');
    controls.className = 'mermaid-controls';
    controls.style.zIndex = '100';
    controls.style.position = 'relative';
    controls.style.padding = '8px';
    controls.style.display = 'flex';
    controls.style.justifyContent = 'center';
    controls.style.background = 'rgba(0,0,0,0.05)';
    controls.style.borderRadius = '8px 8px 0 0';
    
    // Add zoom controls
    const zoomIn = document.createElement('button');
    zoomIn.className = 'mermaid-control zoom-in';
    zoomIn.innerHTML = '🔍+';
    zoomIn.setAttribute('aria-label', 'Zoom in');
    zoomIn.title = 'Zoom in';
    zoomIn.style.margin = '0 5px';
    zoomIn.style.padding = '5px 10px';
    zoomIn.style.background = '#4a80d1';
    zoomIn.style.color = 'white';
    zoomIn.style.border = 'none';
    zoomIn.style.borderRadius = '4px';
    zoomIn.style.cursor = 'pointer';
    
    const zoomOut = document.createElement('button');
    zoomOut.className = 'mermaid-control zoom-out';
    zoomOut.innerHTML = '🔍-';
    zoomOut.setAttribute('aria-label', 'Zoom out');
    zoomOut.title = 'Zoom out';
    zoomOut.style.margin = '0 5px';
    zoomOut.style.padding = '5px 10px';
    zoomOut.style.background = '#4a80d1';
    zoomOut.style.color = 'white';
    zoomOut.style.border = 'none';
    zoomOut.style.borderRadius = '4px';
    zoomOut.style.cursor = 'pointer';
    
    // Add reset zoom control
    const resetZoom = document.createElement('button');
    resetZoom.className = 'mermaid-control reset-zoom';
    resetZoom.innerHTML = '🔄';
    resetZoom.setAttribute('aria-label', 'Reset zoom');
    resetZoom.title = 'Reset zoom';
    resetZoom.style.margin = '0 5px';
    resetZoom.style.padding = '5px 10px';
    resetZoom.style.background = '#4a80d1';
    resetZoom.style.color = 'white';
    resetZoom.style.border = 'none';
    resetZoom.style.borderRadius = '4px';
    resetZoom.style.cursor = 'pointer';
    
    // Add animation controls for flowcharts
    const playPause = document.createElement('button');
    playPause.className = 'mermaid-control play-pause';
    playPause.innerHTML = '⏸️';
    playPause.setAttribute('data-playing', 'true');
    playPause.setAttribute('aria-label', 'Pause animation');
    playPause.title = 'Pause animation';
    playPause.style.margin = '0 5px';
    playPause.style.padding = '5px 10px';
    playPause.style.background = '#4a80d1';
    playPause.style.color = 'white';
    playPause.style.border = 'none';
    playPause.style.borderRadius = '4px';
    playPause.style.cursor = 'pointer';
    
    // Add sequential highlight button
    const highlight = document.createElement('button');
    highlight.className = 'mermaid-control highlight-seq';
    highlight.innerHTML = '🔄';
    highlight.setAttribute('aria-label', 'Highlight sequence');
    highlight.title = 'Highlight sequence';
    highlight.style.margin = '0 5px';
    highlight.style.padding = '5px 10px';
    highlight.style.background = '#4a80d1';
    highlight.style.color = 'white';
    highlight.style.border = 'none';
    highlight.style.borderRadius = '4px';
    highlight.style.cursor = 'pointer';
    
    // Add dark mode toggle
    const darkMode = document.createElement('button');
    darkMode.className = 'mermaid-control dark-mode';
    darkMode.innerHTML = '🌙';
    darkMode.setAttribute('data-dark', 'false');
    darkMode.setAttribute('aria-label', 'Toggle dark mode');
    darkMode.title = 'Toggle dark mode';
    darkMode.style.margin = '0 5px';
    darkMode.style.padding = '5px 10px';
    darkMode.style.background = '#4a80d1';
    darkMode.style.color = 'white';
    darkMode.style.border = 'none';
    darkMode.style.borderRadius = '4px';
    darkMode.style.cursor = 'pointer';
    
    // Add export as image button
    const exportImg = document.createElement('button');
    exportImg.className = 'mermaid-control export-img';
    exportImg.innerHTML = '📥';
    exportImg.setAttribute('aria-label', 'Export as image');
    exportImg.title = 'Export as image';
    exportImg.style.margin = '0 5px';
    exportImg.style.padding = '5px 10px';
    exportImg.style.background = '#4a80d1';
    exportImg.style.color = 'white';
    exportImg.style.border = 'none';
    exportImg.style.borderRadius = '4px';
    exportImg.style.cursor = 'pointer';
    
    // Add copy source button
    const copySource = document.createElement('button');
    copySource.className = 'mermaid-control copy-source';
    copySource.innerHTML = '📋';
    copySource.setAttribute('aria-label', 'Copy diagram code');
    copySource.title = 'Copy diagram code';
    copySource.style.margin = '0 5px';
    copySource.style.padding = '5px 10px';
    copySource.style.background = '#4a80d1';
    copySource.style.color = 'white';
    copySource.style.border = 'none';
    copySource.style.borderRadius = '4px';
    copySource.style.cursor = 'pointer';
    
    // Add controls to the wrapper
    controls.appendChild(zoomIn);
    controls.appendChild(zoomOut);
    controls.appendChild(resetZoom);
    controls.appendChild(playPause);
    controls.appendChild(highlight);
    controls.appendChild(darkMode);
    controls.appendChild(exportImg);
    controls.appendChild(copySource);
    
    // Add hint to expand
    const expandHint = document.createElement('div');
    expandHint.className = 'expand-hint';
    expandHint.textContent = 'Click to expand';
    expandHint.style.position = 'absolute';
    expandHint.style.bottom = '10px';
    expandHint.style.right = '10px';
    expandHint.style.background = 'rgba(0,0,0,0.6)';
    expandHint.style.color = 'white';
    expandHint.style.padding = '5px 10px';
    expandHint.style.borderRadius = '4px';
    expandHint.style.fontSize = '12px';
    expandHint.style.zIndex = '5';
    
    // Add close button for expanded view
    const closeButton = document.createElement('button');
    closeButton.className = 'mermaid-close';
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close diagram');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.fontSize = '18px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.display = 'none';
    closeButton.style.zIndex = '1001';
    
    // Replace original diagram with wrapped version
    mermaidDiv.parentNode.insertBefore(wrapper, mermaidDiv);
    wrapper.appendChild(controls);
    wrapper.appendChild(mermaidDiv);
    wrapper.appendChild(expandHint);
    wrapper.appendChild(closeButton);
    
    // Store the original diagram source for copy functionality
    try {
      // Look for data-content attribute or innerText before rendering
      const originalSource = mermaidDiv.getAttribute('data-source') || mermaidDiv.innerText;
      if (originalSource && originalSource.trim() !== '') {
        wrapper.setAttribute('data-source', originalSource);
      }
    } catch (err) {
      console.warn('Could not extract mermaid source code', err);
    }
    
    // Make animation more visible for specific elements
    enhanceMermaidAnimations(mermaidDiv);
    
    // Add interaction for expansion
    setupDiagramExpansion(wrapper);
    
    // Add interaction for controls
    setupDiagramControls(wrapper);
    
    // Add SVG gradient definitions for better node styling
    addSvgGradients(mermaidDiv);
  });
}

/**
 * Enhance animations for specific diagram types
 */
function enhanceMermaidAnimations(diagram) {
  if (typeof document === 'undefined') return;
  
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
      
      // Add explicit animation styles
      edge.style.strokeDasharray = '5';
      edge.style.animation = 'flowAnimation 30s linear infinite';
    });
  }, 500);
}

/**
 * Set up expansion functionality for a diagram
 */
function setupDiagramExpansion(wrapper) {
  if (typeof document === 'undefined') return;
  
  const backdrop = document.querySelector('.mermaid-backdrop');
  const closeButton = wrapper.querySelector('.mermaid-close');
  
  // Toggle expanded state on click
  wrapper.addEventListener('click', function(e) {
    // Ignore clicks on control buttons
    if (e.target.classList.contains('mermaid-control')) {
      e.stopPropagation();
      return;
    }
    
    if (!wrapper.classList.contains('expanded')) {
      wrapper.classList.add('expanded');
      wrapper.style.position = 'fixed';
      wrapper.style.top = '50%';
      wrapper.style.left = '50%';
      wrapper.style.transform = 'translate(-50%, -50%)';
      wrapper.style.width = '90%';
      wrapper.style.height = '90%';
      wrapper.style.maxWidth = '1200px';
      wrapper.style.zIndex = '1000';
      wrapper.style.background = 'white';
      wrapper.style.padding = '20px';
      wrapper.style.overflow = 'auto';
      wrapper.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
      
      closeButton.style.display = 'block';
      
      backdrop.classList.add('visible');
      backdrop.style.display = 'block';
      backdrop.style.position = 'fixed';
      backdrop.style.top = '0';
      backdrop.style.left = '0';
      backdrop.style.width = '100%';
      backdrop.style.height = '100%';
      backdrop.style.background = 'rgba(0, 0, 0, 0.5)';
      backdrop.style.zIndex = '999';
      
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  });
  
  // Close diagram when clicking backdrop
  backdrop.addEventListener('click', function() {
    wrapper.classList.remove('expanded');
    wrapper.style.position = '';
    wrapper.style.top = '';
    wrapper.style.left = '';
    wrapper.style.transform = '';
    wrapper.style.width = '';
    wrapper.style.height = '';
    wrapper.style.maxWidth = '';
    wrapper.style.zIndex = '';
    wrapper.style.background = '';
    wrapper.style.padding = '';
    wrapper.style.overflow = '';
    wrapper.style.boxShadow = '';
    
    closeButton.style.display = 'none';
    
    backdrop.classList.remove('visible');
    backdrop.style.display = 'none';
    
    document.body.style.overflow = '';
  });
  
  // Close button functionality
  closeButton.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent triggering wrapper click
    wrapper.classList.remove('expanded');
    wrapper.style.position = '';
    wrapper.style.top = '';
    wrapper.style.left = '';
    wrapper.style.transform = '';
    wrapper.style.width = '';
    wrapper.style.height = '';
    wrapper.style.maxWidth = '';
    wrapper.style.zIndex = '';
    wrapper.style.background = '';
    wrapper.style.padding = '';
    wrapper.style.overflow = '';
    wrapper.style.boxShadow = '';
    
    closeButton.style.display = 'none';
    
    backdrop.classList.remove('visible');
    backdrop.style.display = 'none';
    
    document.body.style.overflow = '';
  });
  
  // Prevent diagram click from closing when clicking inside
  wrapper.querySelector('.mermaid').addEventListener('click', function(e) {
    if (wrapper.classList.contains('expanded')) {
      e.stopPropagation();
    }
  });
}

/**
 * Set up control buttons for a diagram
 */
function setupDiagramControls(wrapper) {
  if (typeof document === 'undefined') return;
  
  const mermaidDiv = wrapper.querySelector('.mermaid');
  const svg = mermaidDiv.querySelector('svg');
  if (!svg) return;
  
  // Zoom controls
  const zoomIn = wrapper.querySelector('.zoom-in');
  const zoomOut = wrapper.querySelector('.zoom-out');
  const resetZoom = wrapper.querySelector('.reset-zoom');
  
  // Set initial transform origin
  svg.style.transformOrigin = 'center center';
  
  // Default scale is 1
  let currentScale = 1;
  
  zoomIn.addEventListener('click', function(e) {
    e.stopPropagation();
    currentScale += 0.1;
    svg.style.transform = `scale(${currentScale})`;
  });
  
  zoomOut.addEventListener('click', function(e) {
    e.stopPropagation();
    if (currentScale > 0.5) {
      currentScale -= 0.1;
      svg.style.transform = `scale(${currentScale})`;
    }
  });
  
  resetZoom.addEventListener('click', function(e) {
    e.stopPropagation();
    currentScale = 1;
    svg.style.transform = 'scale(1)';
  });
  
  // Play/pause animation
  const playPause = wrapper.querySelector('.play-pause');
  
  playPause.addEventListener('click', function(e) {
    e.stopPropagation();
    const isPlaying = playPause.getAttribute('data-playing') === 'true';
    const paths = mermaidDiv.querySelectorAll('.flowchart-link, .edgePath .path');
    
    if (isPlaying) {
      // Pause animations
      paths.forEach(path => {
        path.style.animationPlayState = 'paused';
      });
      playPause.innerHTML = '▶️';
      playPause.title = 'Play animation';
      playPause.setAttribute('data-playing', 'false');
    } else {
      // Resume animations
      paths.forEach(path => {
        path.style.animationPlayState = 'running';
      });
      playPause.innerHTML = '⏸️';
      playPause.title = 'Pause animation';
      playPause.setAttribute('data-playing', 'true');
    }
  });
  
  // Sequential highlight
  const highlight = wrapper.querySelector('.highlight-seq');
  
  highlight.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Reset any previous highlights
    const allNodes = mermaidDiv.querySelectorAll('.node rect, .node circle, .node ellipse');
    allNodes.forEach(node => {
      node.classList.remove('highlight-active');
      node.style.filter = '';
    });
    
    // Perform sequential highlighting
    const nodes = Array.from(mermaidDiv.querySelectorAll('.node rect, .node circle, .node ellipse'));
    
    // If it's a sequence diagram, highlight actors
    const actors = Array.from(mermaidDiv.querySelectorAll('.actor'));
    if (actors.length > 0) {
      nodes.push(...actors);
    }
    
    // Perform the highlight animation
    nodes.forEach((node, i) => {
      setTimeout(() => {
        node.classList.add('highlight-active');
        node.style.filter = 'drop-shadow(0 0 6px var(--ifm-color-primary))';
        
        // Remove highlight after delay
        setTimeout(() => {
          node.classList.remove('highlight-active');
          node.style.filter = '';
        }, 1000);
      }, i * 300);
    });
  });
  
  // Dark mode toggle
  const darkMode = wrapper.querySelector('.dark-mode');
  
  darkMode.addEventListener('click', function(e) {
    e.stopPropagation();
    const isDark = darkMode.getAttribute('data-dark') === 'true';
    
    if (isDark) {
      // Switch to light mode
      svg.style.filter = '';
      svg.style.background = '';
      darkMode.innerHTML = '🌙';
      darkMode.title = 'Toggle dark mode';
      darkMode.setAttribute('data-dark', 'false');
      
      // Reset text colors
      const texts = svg.querySelectorAll('text');
      texts.forEach(text => {
        text.style.fill = '';
      });
    } else {
      // Switch to dark mode
      svg.style.filter = 'invert(0.85)';
      svg.style.background = '#333';
      darkMode.innerHTML = '☀️';
      darkMode.title = 'Toggle light mode';
      darkMode.setAttribute('data-dark', 'true');
      
      // Make text more visible
      const texts = svg.querySelectorAll('text');
      texts.forEach(text => {
        text.style.fill = '#fff';
      });
    }
  });
  
  // Export as image
  const exportImg = wrapper.querySelector('.export-img');
  
  exportImg.addEventListener('click', function(e) {
    e.stopPropagation();
    
    try {
      // Create a clone of the SVG to modify for export
      const svgClone = svg.cloneNode(true);
      
      // Make sure the SVG has dimensions
      if (!svgClone.getAttribute('width')) {
        svgClone.setAttribute('width', svg.getBoundingClientRect().width);
      }
      if (!svgClone.getAttribute('height')) {
        svgClone.setAttribute('height', svg.getBoundingClientRect().height);
      }
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create an image to convert SVG to PNG
      const img = new Image();
      img.onload = function() {
        // Create canvas to draw the image
        const canvas = document.createElement('canvas');
        const scale = 2; // Higher resolution
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // Draw with scaling for better quality
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        
        // Convert to PNG and download
        const fileName = `diagram-${wrapper.getAttribute('data-diagram-id')}.png`;
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.download = fileName;
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.click();
        
        // Clean up
        URL.revokeObjectURL(svgUrl);
      };
      
      img.src = svgUrl;
    } catch (err) {
      console.error('Error exporting diagram', err);
      alert('Failed to export diagram as image. ' + err.message);
    }
  });
  
  // Copy source code
  const copySource = wrapper.querySelector('.copy-source');
  
  copySource.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Get the diagram source from data attribute
    const source = wrapper.getAttribute('data-source');
    
    if (source) {
      try {
        navigator.clipboard.writeText(source).then(
          function() {
            // Show success feedback
            const origTitle = copySource.title;
            copySource.title = 'Copied!';
            copySource.style.background = '#4CAF50';
            
            // Reset after 2 seconds
            setTimeout(() => {
              copySource.title = origTitle;
              copySource.style.background = '#4a80d1';
            }, 2000);
          },
          function(err) {
            console.error('Could not copy text: ', err);
            alert('Failed to copy source code: ' + err.message);
          }
        );
      } catch (err) {
        console.error('Error copying source', err);
        
        // Fallback for browsers without clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = source;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          document.execCommand('copy');
          copySource.title = 'Copied!';
          copySource.style.background = '#4CAF50';
          
          setTimeout(() => {
            copySource.title = 'Copy diagram code';
            copySource.style.background = '#4a80d1';
          }, 2000);
        } catch (e) {
          console.error('Fallback copy failed', e);
          alert('Failed to copy source code');
        }
        
        document.body.removeChild(textarea);
      }
    } else {
      console.warn('No source code available for this diagram');
      alert('Source code not available for this diagram');
    }
  });
}

/**
 * Add SVG gradients to diagram
 */
function addSvgGradients(mermaidDiv) {
  setTimeout(() => {
    const svg = mermaidDiv.querySelector('svg');
    if (!svg) return;
    
    // Check if defs already exist
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }
    
    // Add primary gradient
    const gradientPrimary = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradientPrimary.setAttribute('id', `gradient-primary-${Math.random().toString(36).substring(2, 9)}`);
    gradientPrimary.setAttribute('x1', '0%');
    gradientPrimary.setAttribute('y1', '0%');
    gradientPrimary.setAttribute('x2', '100%');
    gradientPrimary.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#4a80d1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#2a5599');
    
    gradientPrimary.appendChild(stop1);
    gradientPrimary.appendChild(stop2);
    defs.appendChild(gradientPrimary);
    
    // Add secondary gradient
    const gradientSecondary = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradientSecondary.setAttribute('id', `gradient-secondary-${Math.random().toString(36).substring(2, 9)}`);
    gradientSecondary.setAttribute('x1', '0%');
    gradientSecondary.setAttribute('y1', '0%');
    gradientSecondary.setAttribute('x2', '100%');
    gradientSecondary.setAttribute('y2', '100%');
    
    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '0%');
    stop3.setAttribute('stop-color', '#cc5a2b');
    
    const stop4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop4.setAttribute('offset', '100%');
    stop4.setAttribute('stop-color', '#973f19');
    
    gradientSecondary.appendChild(stop3);
    gradientSecondary.appendChild(stop4);
    defs.appendChild(gradientSecondary);
    
    // Apply gradients to nodes
    const nodes = svg.querySelectorAll('.node rect, .node circle');
    nodes.forEach((node, i) => {
      if (i % 2 === 0) {
        node.setAttribute('fill', `url(#${gradientPrimary.id})`);
      } else {
        node.setAttribute('fill', `url(#${gradientSecondary.id})`);
      }
    });
  }, 800);
} 