import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

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
        htmlLabels: false,
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

  // Track processed elements to avoid reprocessing
  const processedElements = new WeakSet();

  function fixMermaidColors() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDarkMode) {
      // Fix text colors
      const textElements = document.querySelectorAll('.mermaid text, .mermaid .label, .mermaid .nodeLabel, .mermaid .edgeLabel');
      textElements.forEach(el => {
        el.style.fill = '#E2E8F0';
        el.style.color = '#E2E8F0';
      });

      // Fix node backgrounds
      const nodes = document.querySelectorAll('.mermaid .node rect, .mermaid .node circle, .mermaid .node ellipse');
      nodes.forEach(el => {
        el.style.fill = '#2A2A2A';
        el.style.stroke = '#3b82f6';
        el.style.strokeWidth = '2px';
      });

      // Fix edges and arrows
      const edges = document.querySelectorAll('.mermaid .edgePath .path, .mermaid path.flowchart-link');
      edges.forEach(el => {
        el.style.stroke = '#3b82f6';
        el.style.strokeWidth = '2px';
      });

      const arrowheads = document.querySelectorAll('.mermaid .arrowheadPath');
      arrowheads.forEach(el => {
        el.style.fill = '#3b82f6';
        el.style.stroke = '#3b82f6';
      });

      // Fix cluster backgrounds
      const clusters = document.querySelectorAll('.mermaid .cluster rect');
      clusters.forEach(el => {
        el.style.fill = 'rgba(59, 130, 246, 0.1)';
        el.style.stroke = '#3b82f6';
        el.style.strokeWidth = '2px';
      });

      // Apply important styles with higher specificity
      const style = document.createElement('style');
      style.textContent = `
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
        }
        
        [data-theme='dark'] .mermaid .edgePath .path {
          stroke: #3b82f6 !important;
        }
        
        [data-theme='dark'] .mermaid .arrowheadPath {
          fill: #3b82f6 !important;
          stroke: #3b82f6 !important;
        }
        
        [data-theme='dark'] .mermaid .cluster rect {
          fill: rgba(59, 130, 246, 0.1) !important;
          stroke: #3b82f6 !important;
        }
      `;
      
      // Remove any existing style and add new one
      const existingStyle = document.getElementById('mermaid-dark-mode-fix');
      if (existingStyle) {
        existingStyle.remove();
      }
      style.id = 'mermaid-dark-mode-fix';
      document.head.appendChild(style);
    }
  }

  // Debounced version to prevent excessive calls
  const debouncedFixColors = debounce(fixMermaidColors, 100);

  // Run once on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixMermaidColors);
  } else {
    fixMermaidColors();
  }

  // Run when theme changes
  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        // Clear processed elements when theme changes
        processedElements.clear();
        debouncedFixColors();
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
      debouncedFixColors();
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
  if (typeof window !== 'undefined' && window.mermaid) {
    // Update mermaid config
    window.mermaid.initialize({
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
      },
    });

    // Apply fixes to existing diagrams
    setTimeout(() => {
      fixMermaidColors();
    }, 100);
  }
} 