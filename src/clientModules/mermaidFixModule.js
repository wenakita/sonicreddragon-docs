/**
 * Mermaid Fix Module
 * 
 * This module enhances Mermaid diagrams with our custom ModernMermaid and ImmersiveMermaid components.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import { animateMermaidDiagram } from '../utils/enhancedMermaidAnimations';

// Only execute in browser
if (ExecutionEnvironment.canUseDOM) {
  // Initialize Mermaid with our custom theme
  if (typeof window !== 'undefined' && window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        primaryColor: '#2A2A2A',
        primaryBorderColor: '#3b82f6',
        lineColor: '#3b82f6',
        secondaryColor: '#1A1A1A',
        tertiaryColor: '#0A0A0A',
        background: '#0A0A0A',
        mainBkg: '#2A2A2A',
        secondBkg: '#1A1A1A',
        textColor: '#FFFFFF',
        labelColor: '#FFFFFF',
        nodeTextColor: '#FFFFFF',
        edgeLabelBackground: '#1A1A1A',
        clusterBkg: 'rgba(59, 130, 246, 0.1)',
        clusterBorder: '#3b82f6',
        defaultLinkColor: '#3b82f6',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontSize: '14px',
      },
      flowchart: {
        htmlLabels: true,
        nodeSpacing: 50,
        rankSpacing: 50,
        curve: 'basis',
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
      }
    });
  }

  // Debounce function to prevent excessive calls
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Load our components dynamically to avoid SSR issues
  let ModernMermaid = null;
  let ImmersiveMermaid = null;

  // Function to load components
  async function loadComponents() {
    try {
      // Dynamic imports to avoid SSR issues
      const modernModule = await import('../components/ModernMermaid');
      const immersiveModule = await import('../components/ImmersiveMermaid');
      
      ModernMermaid = modernModule.default;
      ImmersiveMermaid = immersiveModule.default;
      
      // After components are loaded, enhance diagrams
      enhanceMermaidDiagrams();
    } catch (error) {
      console.error('Error loading Mermaid components:', error);
      
      // Fallback to basic enhancement if components fail to load
      enhanceMermaidDiagramsBasic();
    }
  }

  // Enhanced Mermaid diagrams with our custom components
  function enhanceMermaidDiagrams() {
    if (!ModernMermaid || !ImmersiveMermaid) {
      console.warn('Mermaid components not loaded yet, using basic enhancement');
      enhanceMermaidDiagramsBasic();
      return;
    }
    
    // Find all mermaid diagrams
    const mermaidDivs = document.querySelectorAll('.docusaurus-mermaid-container');
    
    // Process each diagram
    mermaidDivs.forEach(container => {
      // Skip already enhanced diagrams
      if (container.getAttribute('data-enhanced') === 'true') return;
      
      // Mark as enhanced
      container.setAttribute('data-enhanced', 'true');
      
      // Get the diagram content
      const svgContainer = container.querySelector('svg');
      if (!svgContainer) return;
      
      // Get the parent element to determine if we should use immersive mode
      const parentElement = container.parentElement;
      const useImmersive = parentElement && (
        parentElement.classList.contains('immersive-diagram') || 
        parentElement.hasAttribute('data-immersive')
      );
      
      // Get diagram title and caption if available
      const titleElement = parentElement && parentElement.querySelector('h3, h4, .diagram-title');
      const captionElement = parentElement && parentElement.querySelector('.diagram-caption, figcaption');
      
      const title = titleElement ? titleElement.textContent : '';
      const caption = captionElement ? captionElement.textContent : '';
      
      // Get the original mermaid code
      const mermaidCode = container.getAttribute('data-mermaid') || '';
      
      // Create a wrapper for our enhanced component
      const wrapper = document.createElement('div');
      wrapper.className = 'enhanced-mermaid-wrapper';
      
      // Replace the container with our wrapper
      container.parentNode.insertBefore(wrapper, container);
      
      // Hide the original container
      container.style.display = 'none';
      
      // Render our enhanced component
      try {
        if (useImmersive) {
          // Render ImmersiveMermaid
          ReactDOM.render(
            React.createElement(ImmersiveMermaid, {
              chart: mermaidCode,
              title: title,
              caption: caption,
              animated: true,
              interactive: true,
              showControls: true,
              particles: true,
              glowEffect: true,
              gradientBorder: true,
            }),
            wrapper
          );
        } else {
          // Render ModernMermaid
          ReactDOM.render(
            React.createElement(ModernMermaid, {
              chart: mermaidCode,
              title: title,
              caption: caption,
              animated: true,
              interactive: true,
              showControls: true,
            }),
            wrapper
          );
        }
      } catch (error) {
        console.error('Error rendering enhanced Mermaid component:', error);
        
        // Show the original container if rendering fails
        container.style.display = 'block';
        
        // Remove the wrapper
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
        
        // Apply basic animation as fallback
        animateMermaidDiagram(container);
      }
    });
  }

  // Basic enhancement for fallback
  function enhanceMermaidDiagramsBasic() {
    // Find all mermaid diagrams
    const mermaidDivs = document.querySelectorAll('.docusaurus-mermaid-container');
    
    // Process each diagram
    mermaidDivs.forEach(container => {
      // Skip already enhanced diagrams
      if (container.getAttribute('data-enhanced') === 'true') return;
      
      // Mark as enhanced
      container.setAttribute('data-enhanced', 'true');
      
      // Add animation to the diagram
      const svgContainer = container.querySelector('svg');
      if (svgContainer) {
        // Apply animations
        animateMermaidDiagram(container);
        
        // Add interactive controls
        addDiagramControls(container);
      }
    });
    
    // Add global styles for better mermaid diagrams
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced Mermaid Styling */
      [data-theme='dark'] .docusaurus-mermaid-container {
        background: rgba(26, 26, 26, 0.4);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid rgba(59, 130, 246, 0.2);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        margin: 2rem 0;
        overflow: hidden;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      }
      
      [data-theme='dark'] .docusaurus-mermaid-container:hover {
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2), 0 0 20px rgba(249, 115, 22, 0.2);
        border-color: rgba(59, 130, 246, 0.4);
        transform: translateY(-2px);
      }
      
      [data-theme='dark'] .mermaid text,
      [data-theme='dark'] .mermaid .label {
        fill: #E2E8F0 !important;
        color: #E2E8F0 !important;
      }
      
      [data-theme='dark'] .mermaid .node rect,
      [data-theme='dark'] .mermaid .node circle,
      [data-theme='dark'] .mermaid .node ellipse {
        fill: #2A2A2A !important;
        stroke: #3b82f6 !important;
        rx: 6px;
        ry: 6px;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
      }
      
      [data-theme='dark'] .mermaid .edgePath .path {
        stroke: #3b82f6 !important;
        stroke-width: 2px !important;
      }
      
      [data-theme='dark'] .mermaid .arrowheadPath {
        fill: #3b82f6 !important;
        stroke: #3b82f6 !important;
      }
      
      [data-theme='dark'] .mermaid .cluster rect {
        fill: rgba(59, 130, 246, 0.1) !important;
        stroke: #3b82f6 !important;
        rx: 8px;
        ry: 8px;
      }
      
      /* Hover effects */
      [data-theme='dark'] .mermaid .node:hover rect,
      [data-theme='dark'] .mermaid .node:hover circle,
      [data-theme='dark'] .mermaid .node:hover ellipse {
        fill: rgba(59, 130, 246, 0.15) !important;
        stroke: #60a5fa !important;
        stroke-width: 2.5px !important;
        filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.5));
        transform: translateY(-3px) scale(1.03);
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }
      
      [data-theme='dark'] .mermaid .edgePath:hover .path {
        stroke: #60a5fa !important;
        stroke-width: 3px !important;
        filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
      }
      
      /* Diagram controls */
      .mermaid-controls {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      
      .mermaid-control-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--ifm-color-emphasis-200, rgba(255, 255, 255, 0.1));
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0;
      }
      
      .mermaid-control-button:hover {
        background: var(--ifm-color-emphasis-300, rgba(255, 255, 255, 0.2));
      }
      
      .mermaid-control-button svg {
        width: 20px;
        height: 20px;
        fill: var(--ifm-color-emphasis-700, rgba(255, 255, 255, 0.7));
      }
      
      /* Fullscreen mode */
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
        padding: 2rem;
        border-radius: 0;
        display: flex;
        flex-direction: column;
        background-color: var(--ifm-background-color, #1a1a1a);
      }
      
      .mermaid-fullscreen svg {
        max-height: 90vh;
        max-width: 90vw;
        margin: auto;
      }
    `;
    
    // Remove any existing style and add new one
    const existingStyle = document.getElementById('mermaid-enhanced-styling');
    if (existingStyle) {
      existingStyle.remove();
    }
    style.id = 'mermaid-enhanced-styling';
    document.head.appendChild(style);
  }

  // Add interactive controls to mermaid diagrams
  function addDiagramControls(container) {
    // Skip if controls already exist
    if (container.querySelector('.mermaid-controls')) return;
    
    // Create controls container
    const controls = document.createElement('div');
    controls.className = 'mermaid-controls';
    
    // Add replay animation button
    const replayButton = document.createElement('button');
    replayButton.className = 'mermaid-control-button';
    replayButton.title = 'Replay animation';
    replayButton.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
      </svg>
    `;
    replayButton.addEventListener('click', () => {
      // Reset animation
      animateMermaidDiagram(container);
    });
    
    // Add fullscreen button
    const fullscreenButton = document.createElement('button');
    fullscreenButton.className = 'mermaid-control-button';
    fullscreenButton.title = 'Toggle fullscreen';
    fullscreenButton.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
      </svg>
    `;
    fullscreenButton.addEventListener('click', () => {
      // Toggle fullscreen
      container.classList.toggle('mermaid-fullscreen');
      
      // Update button icon
      if (container.classList.contains('mermaid-fullscreen')) {
        fullscreenButton.innerHTML = `
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
          </svg>
        `;
      } else {
        fullscreenButton.innerHTML = `
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        `;
      }
    });
    
    // Add download button
    const downloadButton = document.createElement('button');
    downloadButton.className = 'mermaid-control-button';
    downloadButton.title = 'Download SVG';
    downloadButton.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      </svg>
    `;
    downloadButton.addEventListener('click', () => {
      // Download SVG
      const svg = container.querySelector('svg');
      if (!svg) return;
      
      // Create a blob from the SVG
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagram.svg';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
    
    // Add buttons to controls
    controls.appendChild(replayButton);
    controls.appendChild(fullscreenButton);
    controls.appendChild(downloadButton);
    
    // Add controls to container
    container.appendChild(controls);
  }

  // Debounced version to prevent excessive calls
  const debouncedEnhance = debounce(() => {
    if (ModernMermaid && ImmersiveMermaid) {
      enhanceMermaidDiagrams();
    } else {
      enhanceMermaidDiagramsBasic();
    }
  }, 100);

  // Load components when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    loadComponents();
  }

  // Run when theme changes
  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        debouncedEnhance();
      }
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Only observe for new mermaid diagrams being added
  const contentObserver = new MutationObserver((mutations) => {
    let shouldCheck = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Only trigger if mermaid-related elements are added
            if (node.matches && (
              node.matches('.mermaid, .docusaurus-mermaid-container, .mermaid-container') ||
              node.querySelector('.mermaid, .docusaurus-mermaid-container, .mermaid-container')
            )) {
              shouldCheck = true;
            }
          }
        });
      }
    });
    
    if (shouldCheck) {
      debouncedEnhance();
    }
  });

  // Start observing for new content
  if (document.body) {
    contentObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    themeObserver.disconnect();
    contentObserver.disconnect();
  });
}

export function onRouteDidUpdate({ location, previousLocation }) {
  // Apply Mermaid theme overrides after route updates
  if (typeof window !== 'undefined') {
    // Force re-render of all mermaid diagrams on route change
    setTimeout(() => {
      // Check if mermaid is loaded
      if (window.mermaid) {
        // Update mermaid config
        window.mermaid.initialize({
          startOnLoad: true,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            primaryColor: '#2A2A2A',
            primaryBorderColor: '#3b82f6',
            lineColor: '#3b82f6',
            secondaryColor: '#1A1A1A',
            tertiaryColor: '#0A0A0A',
            background: '#0A0A0A',
            mainBkg: '#2A2A2A',
            secondBkg: '#1A1A1A',
            textColor: '#FFFFFF',
            labelColor: '#FFFFFF',
            nodeTextColor: '#FFFFFF',
            edgeLabelBackground: '#1A1A1A',
            clusterBkg: 'rgba(59, 130, 246, 0.1)',
            clusterBorder: '#3b82f6',
            defaultLinkColor: '#3b82f6',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: '14px',
          },
        });

        // Find all mermaid diagrams that need rendering
        const mermaidDivs = document.querySelectorAll('.mermaid:not([data-processed="true"])');
        if (mermaidDivs.length > 0) {
          console.log(`Found ${mermaidDivs.length} unprocessed mermaid diagrams, rendering...`);
          try {
            window.mermaid.init(undefined, mermaidDivs);
          } catch (error) {
            console.error('Error initializing mermaid diagrams:', error);
          }
        }

        // Apply enhancements to all diagrams
        setTimeout(() => {
          // Try to load components and enhance diagrams
          if (typeof loadComponents === 'function') {
            loadComponents();
          } else {
            // Fallback to basic enhancement
            if (typeof enhanceMermaidDiagramsBasic === 'function') {
              enhanceMermaidDiagramsBasic();
            }
          }
        }, 300);
      } else {
        console.warn('Mermaid library not loaded yet');
        
        // Try to load mermaid if it's not available
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js';
        script.onload = () => {
          if (window.mermaid) {
            window.mermaid.initialize({
              startOnLoad: true,
              theme: 'dark',
            });
            
            // Try to render diagrams after loading
            const mermaidDivs = document.querySelectorAll('.mermaid:not([data-processed="true"])');
            if (mermaidDivs.length > 0) {
              try {
                window.mermaid.init(undefined, mermaidDivs);
                
                // Apply enhancements
                setTimeout(() => {
                  // Try to load components and enhance diagrams
                  if (typeof loadComponents === 'function') {
                    loadComponents();
                  } else {
                    // Fallback to basic enhancement
                    if (typeof enhanceMermaidDiagramsBasic === 'function') {
                      enhanceMermaidDiagramsBasic();
                    }
                  }
                }, 300);
              } catch (error) {
                console.error('Error initializing mermaid diagrams after load:', error);
              }
            }
          }
        };
        document.head.appendChild(script);
      }
    }, 300); // Increased timeout to ensure DOM is ready
  }
}
