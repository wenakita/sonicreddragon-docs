import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  function fixMermaidTextColors() {
    // Check if we're in dark mode - multiple ways since default is dark
    const dataTheme = document.documentElement.getAttribute('data-theme');
    const isDarkMode = dataTheme === 'dark' || dataTheme === null || !dataTheme || 
                      document.body.classList.contains('dark') ||
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    console.log('Fixing mermaid colors, dark mode:', isDarkMode, 'data-theme:', dataTheme);
    
    if (isDarkMode) {
      // Find all mermaid diagrams
      const mermaidElements = document.querySelectorAll('.mermaid svg, .docusaurus-mermaid-container svg, .mermaid-container svg');
      
      console.log('Found mermaid elements:', mermaidElements.length);
      
      mermaidElements.forEach((svg, index) => {
        console.log('Processing mermaid', index);
        
        // Force all text elements to be white - comprehensive selector
        const textElements = svg.querySelectorAll('text, tspan, .label, .nodeLabel, .edgeLabel, .messageText, .actor-label, .labelText, .cluster-label, .section, .titleText');
        console.log('Found text elements:', textElements.length);
        
        textElements.forEach(el => {
          el.style.setProperty('fill', '#ffffff', 'important');
          el.style.setProperty('color', '#ffffff', 'important');
          el.style.setProperty('stroke', 'none', 'important');
        });
        
        // Also fix any elements with specific classes
        const specificElements = svg.querySelectorAll('[class*="label"], [class*="text"], [class*="Text"]');
        specificElements.forEach(el => {
          el.style.setProperty('fill', '#ffffff', 'important');
          el.style.setProperty('color', '#ffffff', 'important');
          el.style.setProperty('stroke', 'none', 'important');
        });
        
        // Force ALL text elements regardless of class
        const allTextElements = svg.querySelectorAll('*');
        allTextElements.forEach(el => {
          if (el.tagName === 'text' || el.tagName === 'tspan') {
            el.style.setProperty('fill', '#ffffff', 'important');
            el.style.setProperty('color', '#ffffff', 'important');
            el.style.setProperty('stroke', 'none', 'important');
          }
        });
      });
    }
  }
  
  // Run immediately when script loads
  fixMermaidTextColors();
  
  // Run on initial load
  window.addEventListener('DOMContentLoaded', () => {
    fixMermaidTextColors();
    setTimeout(fixMermaidTextColors, 100);
    setTimeout(fixMermaidTextColors, 500);
    setTimeout(fixMermaidTextColors, 1000);
    setTimeout(fixMermaidTextColors, 2000);
  });
  
  // Run when page is fully loaded
  window.addEventListener('load', () => {
    fixMermaidTextColors();
    setTimeout(fixMermaidTextColors, 100);
    setTimeout(fixMermaidTextColors, 500);
  });
  
  // Run when theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        fixMermaidTextColors();
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
    fixMermaidTextColors();
    setTimeout(fixMermaidTextColors, 200);
  });
  
  // Start observing immediately if possible
  if (document.body) {
    contentObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      contentObserver.observe(mainContent, {
        childList: true,
        subtree: true
      });
    }
  });
  
  // Also run on any mermaid-specific events
  document.addEventListener('mermaid-rendered', fixMermaidTextColors);
  
  // Continuous check for the first few seconds
  let checkCount = 0;
  const intervalCheck = setInterval(() => {
    fixMermaidTextColors();
    checkCount++;
    if (checkCount > 20) { // Stop after 20 checks (10 seconds)
      clearInterval(intervalCheck);
    }
  }, 500);
} 