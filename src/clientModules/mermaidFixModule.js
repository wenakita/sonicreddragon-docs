import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  // Initialize Mermaid with our custom theme
  if (typeof window !== 'undefined' && window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#2A2A2A',
        primaryTextColor: '#FFFFFF',
        primaryBorderColor: '#FF6B35',
        lineColor: '#FF6B35',
        secondaryColor: '#1A1A1A',
        tertiaryColor: '#0A0A0A',
        background: '#0A0A0A',
        mainBkg: '#2A2A2A',
        secondBkg: '#1A1A1A',
        textColor: '#FFFFFF',
        labelColor: '#FFFFFF',
        nodeTextColor: '#FFFFFF',
        edgeLabelBackground: '#1A1A1A',
        clusterBkg: 'rgba(255, 107, 53, 0.1)',
        clusterBorder: '#FF6B35',
        defaultLinkColor: '#FF6B35',
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

  function fixMermaidTextColors() {
    // Check if we're in dark mode - multiple ways since default is dark
    const dataTheme = document.documentElement.getAttribute('data-theme');
    const isDarkMode = dataTheme === 'dark' || dataTheme === null || !dataTheme || 
                      document.body.classList.contains('dark') ||
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
      // Find all mermaid diagrams that haven't been processed
      const mermaidElements = document.querySelectorAll('.mermaid svg, .docusaurus-mermaid-container svg, .mermaid-container svg');
      
      let newElementsFound = false;
      
      mermaidElements.forEach((svg) => {
        // Skip if already processed
        if (processedElements.has(svg)) {
          return;
        }
        
        newElementsFound = true;
        processedElements.add(svg);
        
        // Update all text to white
        const textElements = svg.querySelectorAll('text, tspan, .label, .nodeLabel, .edgeLabel, .messageText, .actor-label, .labelText, .cluster-label, .section, .titleText');
        textElements.forEach(el => {
          el.style.setProperty('fill', '#FFFFFF', 'important');
          el.style.setProperty('color', '#FFFFFF', 'important');
          el.style.setProperty('stroke', 'none', 'important');
        });
        
        // Update nodes with our theme colors
        const nodes = svg.querySelectorAll('.node rect, .node circle, .node ellipse, .node polygon');
        nodes.forEach(el => {
          el.style.setProperty('fill', '#2A2A2A', 'important');
          el.style.setProperty('stroke', '#FF6B35', 'important');
          el.style.setProperty('stroke-width', '2px', 'important');
        });
        
        // Update edges/lines
        const edges = svg.querySelectorAll('.edgePath .path, .flowchart-link, path[stroke]');
        edges.forEach(el => {
          if (!el.hasAttribute('marker-end') && !el.classList.contains('arrowheadPath')) {
            el.style.setProperty('stroke', '#FF6B35', 'important');
            el.style.setProperty('stroke-width', '2px', 'important');
          }
        });
        
        // Update arrowheads
        const arrowheads = svg.querySelectorAll('.arrowheadPath, marker path');
        arrowheads.forEach(el => {
          el.style.setProperty('fill', '#FF6B35', 'important');
          el.style.setProperty('stroke', '#FF6B35', 'important');
        });
        
        // Update clusters
        const clusters = svg.querySelectorAll('.cluster rect');
        clusters.forEach(el => {
          el.style.setProperty('fill', 'rgba(255, 107, 53, 0.1)', 'important');
          el.style.setProperty('stroke', '#FF6B35', 'important');
          el.style.setProperty('stroke-width', '1px', 'important');
        });
        
        // Force ALL text elements regardless of class
        const allTextElements = svg.querySelectorAll('*');
        allTextElements.forEach(el => {
          if (el.tagName === 'text' || el.tagName === 'tspan') {
            el.style.setProperty('fill', '#FFFFFF', 'important');
            el.style.setProperty('color', '#FFFFFF', 'important');
            el.style.setProperty('stroke', 'none', 'important');
          }
        });
      });
      
      // Only log if we actually processed new elements
      if (newElementsFound) {
        console.log('Fixed mermaid text colors for', mermaidElements.length, 'diagrams');
      }
    }
  }

  // Debounced version to prevent excessive calls
  const debouncedFixColors = debounce(fixMermaidTextColors, 100);

  // Run once on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixMermaidTextColors);
  } else {
    fixMermaidTextColors();
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