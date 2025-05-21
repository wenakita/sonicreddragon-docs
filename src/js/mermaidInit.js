/**
 * Custom Mermaid initialization script with animation controls
 */

import anime from 'animejs/lib/anime.es.js';

export default function initMermaidWithControls() {
  // Execute after Mermaid has rendered diagrams
  setTimeout(() => {
    // Find all Mermaid diagrams on the page
    const diagrams = document.querySelectorAll('.docusaurus-mermaid-container');
    
    diagrams.forEach((diagram, index) => {
      const diagramId = `mermaid-diagram-${index}`;
      diagram.id = diagramId;
      
      // Create control container
      const controlContainer = document.createElement('div');
      controlContainer.className = 'mermaid-controls';
      controlContainer.style.display = 'flex';
      controlContainer.style.justifyContent = 'center';
      controlContainer.style.marginTop = '10px';
      controlContainer.style.gap = '10px';
      
      // Create play button
      const playButton = document.createElement('button');
      playButton.className = 'mermaid-play-button button button--primary';
      playButton.innerHTML = '▶️ Play Animation';
      playButton.setAttribute('aria-label', 'Play animation');
      
      // Create stop button
      const stopButton = document.createElement('button');
      stopButton.className = 'mermaid-stop-button button button--secondary';
      stopButton.innerHTML = '⏹️ Stop Animation';
      stopButton.setAttribute('aria-label', 'Stop animation');
      stopButton.style.display = 'none'; // Initially hidden
      
      // Add buttons to control container
      controlContainer.appendChild(playButton);
      controlContainer.appendChild(stopButton);
      
      // Add control container after diagram
      diagram.parentNode.insertBefore(controlContainer, diagram.nextSibling);
      
      // Animation instance reference
      let animation = null;
      
      // Play button click handler
      playButton.addEventListener('click', () => {
        // Hide play button, show stop button
        playButton.style.display = 'none';
        stopButton.style.display = 'inline-flex';
        
        // Get SVG elements to animate
        const svg = diagram.querySelector('svg');
        if (!svg) return;
        
        // Find different element types to animate
        const paths = svg.querySelectorAll('path');
        const edges = svg.querySelectorAll('.edgePath');
        const flowchartPaths = svg.querySelectorAll('.flowchart-link');
        const nodes = svg.querySelectorAll('.node');
        const labels = svg.querySelectorAll('.edgeLabel, .nodeLabel');
        
        // Reset animation state
        if (animation) animation.pause();
        
        // Create timeline for sequence
        let animeTimeline = anime.timeline({
          easing: 'easeInOutSine',
          duration: 800
        });
        
        // Add nodes to timeline (fade in)
        if (nodes.length > 0) {
          nodes.forEach(node => {
            node.style.opacity = 0;
          });
          
          animeTimeline.add({
            targets: nodes,
            opacity: [0, 1],
            translateY: [10, 0],
            delay: anime.stagger(100),
            duration: 500
          });
        }
        
        // Add labels to timeline
        if (labels.length > 0) {
          labels.forEach(label => {
            label.style.opacity = 0;
          });
          
          animeTimeline.add({
            targets: labels,
            opacity: [0, 1],
            duration: 500,
            delay: anime.stagger(50)
          }, '-=300');
        }
        
        // Add path animations (draw paths)
        const pathsToAnimate = paths.length > 0 ? paths : 
                               edges.length > 0 ? edges : 
                               flowchartPaths;
                               
        if (pathsToAnimate.length > 0) {
          pathsToAnimate.forEach(path => {
            // Save original styles to restore later
            if (!path.dataset.originalStroke) {
              path.dataset.originalStroke = path.getAttribute('stroke') || '';
              path.dataset.originalOpacity = path.getAttribute('opacity') || '1';
              path.dataset.originalStrokeDasharray = path.getAttribute('stroke-dasharray') || '';
              path.dataset.originalStrokeDashoffset = path.getAttribute('stroke-dashoffset') || '';
            }
            
            // Setup for animation
            if (path.getTotalLength) {
              const pathLength = path.getTotalLength();
              path.setAttribute('stroke-dasharray', pathLength);
              path.setAttribute('stroke-dashoffset', pathLength);
              path.setAttribute('opacity', 1);
            } else {
              // If getTotalLength is not available
              path.setAttribute('opacity', 0);
            }
          });
          
          // Animate paths
          animeTimeline.add({
            targets: pathsToAnimate,
            opacity: [0, 1],
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 1000,
            delay: anime.stagger(150),
            easing: 'easeInOutQuad'
          }, '-=200');
        }
        
        // Store animation reference
        animation = animeTimeline;
      });
      
      // Stop button click handler
      stopButton.addEventListener('click', () => {
        // Hide stop button, show play button
        stopButton.style.display = 'none';
        playButton.style.display = 'inline-flex';
        
        // Stop animation
        if (animation) {
          animation.pause();
          
          // Reset elements to original state
          const svg = diagram.querySelector('svg');
          if (!svg) return;
          
          // Reset paths
          const allPaths = svg.querySelectorAll('path, .edgePath, .flowchart-link');
          allPaths.forEach(path => {
            // Restore original attributes
            if (path.dataset.originalStroke) {
              path.setAttribute('stroke', path.dataset.originalStroke);
            }
            if (path.dataset.originalOpacity) {
              path.setAttribute('opacity', path.dataset.originalOpacity);
            }
            if (path.dataset.originalStrokeDasharray) {
              path.setAttribute('stroke-dasharray', path.dataset.originalStrokeDasharray);
            } else {
              path.removeAttribute('stroke-dasharray');
            }
            if (path.dataset.originalStrokeDashoffset) {
              path.setAttribute('stroke-dashoffset', path.dataset.originalStrokeDashoffset);
            } else {
              path.removeAttribute('stroke-dashoffset');
            }
          });
          
          // Reset nodes and labels
          const nodesAndLabels = svg.querySelectorAll('.node, .edgeLabel, .nodeLabel');
          nodesAndLabels.forEach(el => {
            el.style.opacity = 1;
            el.style.transform = 'translateY(0)';
          });
        }
      });
    });
  }, 1000); // Wait for Mermaid to finish rendering
} 