// CRITICAL EMERGENCY FIX FOR SIDEBAR LAYOUT ISSUES - v1.0.1 (FORCE REBUILD)
(function() {
  // Create a style element
  function injectEmergencyCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* CRITICAL: Fix sidebar layout with fixed positioning */
      :root {
        --sidebar-width: 250px !important;
      }
      
      * {
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
        direction: ltr !important;
      }
      
      /* DISABLE FLEXBOX - Use fixed positioning instead */
      .main-wrapper {
        display: block !important;
        width: 100% !important;
        position: relative !important;
        min-height: 100vh !important;
      }
      
      /* Fixed navbar */
      .navbar {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 500 !important;
      }
      
      /* Fixed sidebar */
      .theme-doc-sidebar-container,
      [class*="docSidebarContainer"] {
        position: fixed !important;
        top: var(--ifm-navbar-height, 60px) !important;
        left: 0 !important;
        bottom: 0 !important;
        width: var(--sidebar-width) !important;
        min-width: var(--sidebar-width) !important;
        max-width: var(--sidebar-width) !important;
        height: calc(100vh - var(--ifm-navbar-height, 60px)) !important;
        background-color: var(--ifm-background-surface-color) !important;
        border-right: 1px solid rgba(0, 0, 0, 0.1) !important;
        overflow-y: auto !important;
        z-index: 400 !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        transition: transform 0.3s ease !important;
        transform: translateX(0) !important;
      }
      
      /* Position main content with margin left */
      .docMainContainer, 
      [class*="docMainContainer"],
      .docPage,
      [class*="docPage"] {
        margin-left: var(--sidebar-width) !important;
        width: calc(100% - var(--sidebar-width)) !important;
        max-width: calc(100% - var(--sidebar-width)) !important;
        padding-top: var(--ifm-navbar-height, 60px) !important;
        position: relative !important;
        display: block !important;
        overflow-x: hidden !important;
      }
      
      /* Fix content containers */
      .container {
        width: 100% !important;
        max-width: 100% !important;
        padding-left: 2rem !important;
        padding-right: 2rem !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        box-sizing: border-box !important;
      }
      
      /* Fix rows */
      .row {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
      }
      
      /* Mobile layout fixes */
      @media (max-width: 996px) {
        .theme-doc-sidebar-container,
        [class*="docSidebarContainer"] {
          transform: translateX(-100%) !important;
          width: 85% !important;
          max-width: 300px !important;
          z-index: 999 !important;
        }
        
        .theme-doc-sidebar-container.menu--show,
        [class*="docSidebarContainer"].menu--show {
          transform: translateX(0) !important;
        }
        
        .docMainContainer, 
        [class*="docMainContainer"],
        .docPage,
        [class*="docPage"] {
          margin-left: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Create a direct DOM fix function that runs repeatedly
    function directFixSidebar() {
      // Fix sidebar
      const sidebar = document.querySelector('.theme-doc-sidebar-container');
      if (sidebar) {
        if (window.innerWidth > 996) {
          // Desktop
          sidebar.style.position = 'fixed';
          sidebar.style.top = 'var(--ifm-navbar-height, 60px)';
          sidebar.style.left = '0';
          sidebar.style.height = 'calc(100vh - var(--ifm-navbar-height, 60px))';
          sidebar.style.width = '250px';
          sidebar.style.minWidth = '250px';
          sidebar.style.maxWidth = '250px';
          sidebar.style.transform = 'none';
          sidebar.style.borderRight = '1px solid rgba(0, 0, 0, 0.1)';
          sidebar.style.zIndex = '400';
        } else {
          // Mobile
          sidebar.style.position = 'fixed';
          sidebar.style.top = '0';
          sidebar.style.left = '0';
          sidebar.style.bottom = '0';
          sidebar.style.width = '85%';
          sidebar.style.maxWidth = '300px';
          if (!sidebar.classList.contains('menu--show')) {
            sidebar.style.transform = 'translateX(-100%)';
          } else {
            sidebar.style.transform = 'translateX(0)';
          }
          sidebar.style.zIndex = '999';
        }
      }
      
      // Fix main content
      const mainContainers = document.querySelectorAll('.docMainContainer, [class*="docMainContainer"]');
      mainContainers.forEach(container => {
        if (window.innerWidth > 996) {
          container.style.marginLeft = '250px';
          container.style.width = 'calc(100% - 250px)';
          container.style.maxWidth = 'calc(100% - 250px)';
        } else {
          container.style.marginLeft = '0';
          container.style.width = '100%';
          container.style.maxWidth = '100%';
        }
      });
      
      // Handle overlay
      let overlay = document.querySelector('.overlay-container');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay-container';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '990';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        
        // Close sidebar when clicking overlay
        overlay.addEventListener('click', function() {
          if (sidebar) {
            sidebar.classList.remove('menu--show');
            overlay.style.display = 'none';
          }
        });
      }
      
      // Handle toggle button
      const toggle = document.querySelector('.navbar__toggle');
      if (toggle) {
        // Remove existing listeners
        const newToggle = toggle.cloneNode(true);
        if (toggle.parentNode) {
          toggle.parentNode.replaceChild(newToggle, toggle);
        }
        
        newToggle.addEventListener('click', function() {
          if (sidebar) {
            if (sidebar.classList.contains('menu--show')) {
              sidebar.classList.remove('menu--show');
              sidebar.style.transform = 'translateX(-100%)';
              overlay.style.display = 'none';
            } else {
              sidebar.classList.add('menu--show');
              sidebar.style.transform = 'translateX(0)';
              overlay.style.display = 'block';
            }
          }
        });
      }
    }
    
    // Run the fix every 200ms to ensure it stays fixed
    setInterval(directFixSidebar, 200);
    directFixSidebar();
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