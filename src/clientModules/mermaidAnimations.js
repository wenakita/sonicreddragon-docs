/**
 * Mermaid Animations Module
 * 
 * This module adds animation capabilities to Mermaid diagrams
 * using anime.js for smooth transitions and effects.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  // Initialize animations when the DOM is ready
  const initAnimations = () => {
    try {
      // Check if anime.js is loaded
      if (typeof window.anime === 'undefined') {
        console.warn('anime.js not found. Mermaid animations will not work.');
        return;
      }

      console.log('Initializing Mermaid animations...');
      
      // Function to add animation to flowchart nodes
      const animateFlowchartNodes = () => {
        const nodes = document.querySelectorAll('.flowchart-node, .node');
        if (nodes.length > 0) {
          window.anime({
            targets: nodes,
            opacity: [0, 1],
            translateY: [10, 0],
            delay: window.anime.stagger(100),
            easing: 'easeOutQuad',
            duration: 800
          });
        }
      };
      
      // Function to add animation to flowchart edges
      const animateFlowchartEdges = () => {
        const edges = document.querySelectorAll('.flowchart-edge, .edgePath');
        if (edges.length > 0) {
          window.anime({
            targets: edges,
            opacity: [0, 1],
            delay: window.anime.stagger(50, {start: 300}),
            easing: 'easeOutQuad',
            duration: 800
          });
        }
      };
      
      // Function to add animation to sequence diagram actors
      const animateSequenceActors = () => {
        const actors = document.querySelectorAll('.actor');
        if (actors.length > 0) {
          window.anime({
            targets: actors,
            opacity: [0, 1],
            translateY: [-20, 0],
            delay: window.anime.stagger(150),
            easing: 'easeOutElastic(1, .6)',
            duration: 1000
          });
        }
      };
      
      // Function to add animation to sequence diagram messages
      const animateSequenceMessages = () => {
        const messages = document.querySelectorAll('.messageLine0, .messageLine1');
        if (messages.length > 0) {
          window.anime({
            targets: messages,
            opacity: [0, 1],
            scaleX: [0, 1],
            delay: window.anime.stagger(200, {start: 500}),
            easing: 'easeOutCubic',
            duration: 800
          });
        }
      };
      
      // Function to add animation to class diagram
      const animateClassDiagram = () => {
        const classes = document.querySelectorAll('.classGroup');
        if (classes.length > 0) {
          window.anime({
            targets: classes,
            opacity: [0, 1],
            scale: [0.9, 1],
            delay: window.anime.stagger(150),
            easing: 'easeOutSine',
            duration: 800
          });
        }
        
        const relations = document.querySelectorAll('.relation');
        if (relations.length > 0) {
          window.anime({
            targets: relations,
            opacity: [0, 1],
            delay: window.anime.stagger(100, {start: 400}),
            easing: 'easeOutQuad',
            duration: 600
          });
        }
      };
      
      // Function to add animation to ER diagram
      const animateERDiagram = () => {
        const entities = document.querySelectorAll('.er.entityBox');
        if (entities.length > 0) {
          window.anime({
            targets: entities,
            opacity: [0, 1],
            translateY: [10, 0],
            delay: window.anime.stagger(150),
            easing: 'easeOutQuad',
            duration: 800
          });
        }
        
        const relationships = document.querySelectorAll('.er.relationshipLabelBox');
        if (relationships.length > 0) {
          window.anime({
            targets: relationships,
            opacity: [0, 1],
            scale: [0.8, 1],
            delay: window.anime.stagger(150, {start: 300}),
            easing: 'easeOutElastic(1, .5)',
            duration: 800
          });
        }
      };
      
      // Function to add animation to Gantt chart
      const animateGanttChart = () => {
        const tasks = document.querySelectorAll('.task');
        if (tasks.length > 0) {
          window.anime({
            targets: tasks,
            opacity: [0, 1],
            width: ['0%', '100%'],
            delay: window.anime.stagger(100),
            easing: 'easeOutQuad',
            duration: 800
          });
        }
      };
      
      // Function to add animation to pie chart
      const animatePieChart = () => {
        const slices = document.querySelectorAll('.pieCircle');
        if (slices.length > 0) {
          window.anime({
            targets: slices,
            opacity: [0, 1],
            scale: [0, 1],
            delay: window.anime.stagger(150),
            easing: 'easeOutElastic(1, .6)',
            duration: 1000
          });
        }
      };
      
      // Function to apply animations based on diagram type
      const applyAnimations = (diagram) => {
        if (!diagram) return;
        
        // Get the diagram type
        const diagramType = diagram.getAttribute('data-diagram-type') || 
                           (diagram.querySelector('.flowchart') ? 'flowchart' :
                            diagram.querySelector('.sequence') ? 'sequence' :
                            diagram.querySelector('.classGroup') ? 'class' :
                            diagram.querySelector('.er') ? 'er' :
                            diagram.querySelector('.gantt') ? 'gantt' :
                            diagram.querySelector('.pieChart') ? 'pie' : 'unknown');
        
        // Apply animations based on diagram type
        switch (diagramType) {
          case 'flowchart':
            animateFlowchartNodes();
            animateFlowchartEdges();
            break;
          case 'sequence':
            animateSequenceActors();
            animateSequenceMessages();
            break;
          case 'class':
            animateClassDiagram();
            break;
          case 'er':
            animateERDiagram();
            break;
          case 'gantt':
            animateGanttChart();
            break;
          case 'pie':
            animatePieChart();
            break;
          default:
            // Generic animation for unknown diagram types
            const elements = diagram.querySelectorAll('g:not(g g)');
            if (elements.length > 0) {
              window.anime({
                targets: elements,
                opacity: [0, 1],
                translateY: [5, 0],
                delay: window.anime.stagger(50),
                easing: 'easeOutQuad',
                duration: 800
              });
            }
        }
      };
      
      // Function to initialize animations for all diagrams
      const initAllDiagrams = () => {
        const diagrams = document.querySelectorAll('.mermaid[data-processed="true"]');
        diagrams.forEach(diagram => {
          // Only animate if not already animated
          if (!diagram.getAttribute('data-animated')) {
            applyAnimations(diagram);
            diagram.setAttribute('data-animated', 'true');
          }
        });
      };
      
      // Initialize animations when Mermaid is done rendering
      const checkForMermaidCompletion = () => {
        if (document.querySelectorAll('.mermaid[data-processed="true"]').length > 0) {
          initAllDiagrams();
        } else {
          // Check again after a short delay
          setTimeout(checkForMermaidCompletion, 200);
        }
      };
      
      // Start checking for Mermaid completion
      checkForMermaidCompletion();
      
      // Re-initialize on route changes for SPA navigation
      document.addEventListener('docusaurus.routeDidUpdate', () => {
        // Reset animation state for all diagrams
        document.querySelectorAll('.mermaid[data-animated="true"]').forEach(diagram => {
          diagram.removeAttribute('data-animated');
        });
        
        // Check for new diagrams after a delay to allow Mermaid to render
        setTimeout(checkForMermaidCompletion, 500);
      });
      
      console.log('Mermaid animations initialized successfully!');
    } catch (error) {
      console.error('Error initializing Mermaid animations:', error);
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
}

// Export empty module for SSR
export default function() {};
