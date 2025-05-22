// Safe sidebar fix script - executes only in browser
// Version with timestamp: 2023-11-01-002
(function() {
  // SSR check - return immediately if not in browser
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Docusaurus SSR safety - the script is marked as defer so it will run after page load
  // Wait for DOM to be fully loaded
  function handleSidebar() {
    try {
      console.log('[Sidebar Fix] Initializing sidebar fix script...');
      
      // Setup toggle buttons for mobile sidebar
      const toggleButtons = document.querySelectorAll('.navbar__toggle, .navbar-sidebar__close');
      toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          console.log('[Sidebar Fix] Toggle button clicked');
          document.body.classList.toggle('sidebar-shown');
        });
      });
      
      // Create and handle overlay
      let overlay = document.querySelector('.sidebar-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', function() {
          console.log('[Sidebar Fix] Overlay clicked');
          document.body.classList.remove('sidebar-shown');
        });
      }
      
      // Apply critical CSS for desktop if not already applied
      const criticalCSS = `
        @media (min-width: 997px) {
          .theme-doc-sidebar-container {
            position: fixed !important;
            top: var(--ifm-navbar-height) !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 250px !important;
            height: calc(100vh - var(--ifm-navbar-height)) !important;
            overflow-y: auto !important;
            z-index: 200 !important;
            border-right: 1px solid var(--ifm-toc-border-color) !important;
          }
          
          [class*="docMainContainer"] {
            margin-left: 250px !important;
            width: calc(100% - 250px) !important;
            max-width: calc(100% - 250px) !important;
          }
        
          /* Fix any nested container elements */
          [class*="docMainContainer"] .container,
          [class*="docMainContainer"] .row,
          [class*="docMainContainer"] [class*="docItemCol"] {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
          }
        }
        
        /* Mobile sidebar positioning */
        @media (max-width: 996px) {
          .theme-doc-sidebar-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 85% !important;
            max-width: 300px !important;
            height: 100% !important;
            z-index: 10000 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
            background-color: var(--ifm-background-surface-color) !important;
            border-right: 1px solid var(--ifm-toc-border-color) !important;
            box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15) !important;
          }
        
          body.sidebar-shown .theme-doc-sidebar-container {
            transform: translateX(0) !important;
          }
        
          [class*="docMainContainer"] {
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        
          .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999;
          }
        
          body.sidebar-shown .sidebar-overlay {
            display: block;
          }
        
          body.sidebar-shown {
            overflow: hidden;
          }
        }
      `;
      
      // Add the CSS
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      style.setAttribute('id', 'sidebar-critical-css');
      if (!document.getElementById('sidebar-critical-css')) {
        document.head.appendChild(style);
        console.log('[Sidebar Fix] Critical CSS injected');
      }
      
      console.log('[Sidebar Fix] Sidebar fix script initialized successfully');
    } catch (error) {
      console.error('[Sidebar Fix] Error initializing sidebar:', error);
    }
  }
  
  // Run when the DOM is ready - using a setTimeout to ensure it runs after SSR
  setTimeout(function() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleSidebar);
    } else {
      handleSidebar();
    }
  }, 0);
})();

// Cache-busting timestamp: 1698858778901 