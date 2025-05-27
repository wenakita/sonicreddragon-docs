import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  function fixMermaidTextColors() {
    // Check if we're in dark mode
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDarkMode) {
      // Find all mermaid diagrams
      const mermaidElements = document.querySelectorAll('.mermaid svg');
      
      mermaidElements.forEach(svg => {
        // Force all text elements to be white
        const textElements = svg.querySelectorAll('text, tspan, .label, .nodeLabel, .edgeLabel, .messageText, .actor-label, .labelText');
        textElements.forEach(el => {
          el.style.fill = '#ffffff';
          el.style.color = '#ffffff';
          el.style.stroke = 'none';
        });
        
        // Also fix any elements with specific classes
        const specificElements = svg.querySelectorAll('[class*="label"], [class*="text"], [class*="Text"]');
        specificElements.forEach(el => {
          el.style.fill = '#ffffff';
          el.style.color = '#ffffff';
          el.style.stroke = 'none';
        });
      });
    }
  }
  
  // Run on initial load
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(fixMermaidTextColors, 500);
  });
  
  // Run when theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        setTimeout(fixMermaidTextColors, 100);
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
  
  // Run when new content is loaded (for navigation)
  const contentObserver = new MutationObserver(() => {
    setTimeout(fixMermaidTextColors, 200);
  });
  
  window.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      contentObserver.observe(mainContent, {
        childList: true,
        subtree: true
      });
    }
  });
} 