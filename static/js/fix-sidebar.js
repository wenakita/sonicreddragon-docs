// Emergency fix for vertical text in the sidebar
(function() {
  // Create a style element
  function injectEmergencyCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* CRITICAL FIX: Force horizontal text rendering for all elements */
      * {
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
        direction: ltr !important;
      }
      
      /* Target all sidebar and TOC elements */
      aside,
      nav,
      .table-of-contents,
      .theme-doc-sidebar-menu,
      .theme-doc-toc-desktop,
      .theme-doc-sidebar-container,
      [class*="tableOfContents"],
      [class*="tocCollapsible"],
      [class*="sidebar"],
      [class*="menu"] {
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
        direction: ltr !important;
        text-align: left !important;
        display: block !important;
      }
      
      /* Force all text elements to display horizontally */
      h1, h2, h3, h4, h5, h6, p, span, a, div, li, ul, ol {
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
        direction: ltr !important;
        text-align: left !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Apply fix immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectEmergencyCSS);
  } else {
    injectEmergencyCSS();
  }
  
  // Also apply on route changes for single-page applications
  const observer = new MutationObserver(function(mutations) {
    // Check if we've navigated to a new page
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        injectEmergencyCSS();
      }
    });
  });
  
  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
})(); 