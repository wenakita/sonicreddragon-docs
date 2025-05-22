// Critical emergency fix for sidebar issues
(function() {
  // Create a style element
  function injectEmergencyCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Force horizontal text and block display */
      * {
        writing-mode: horizontal-tb !important;
        text-orientation: mixed !important;
        direction: ltr !important;
      }
      
      /* Critical layout structure fixes */
      .main-wrapper {
        display: flex !important;
        flex-direction: row !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
      }
      
      /* Fix left sidebar layout - percentage based */
      .theme-doc-sidebar-container {
        width: 18% !important;
        max-width: 18% !important;
        min-width: 18% !important;
        margin-right: 0 !important;
        position: sticky !important;
        top: 60px !important;
        height: calc(100vh - 60px) !important;
        overflow-y: auto !important;
        z-index: 100 !important;
        flex: 0 0 auto !important;
        border-right: 1px solid rgba(0, 0, 0, 0.1) !important;
      }
      
      /* Fix main content area */
      .docMainContainer, 
      [class*="docMainContainer"] {
        flex: 1 1 auto !important;
        width: 0 !important;
        min-width: 0 !important;
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        overflow-x: hidden !important;
      }
      
      /* Fix content pages and document layout */
      .row {
        display: flex !important;
        flex-wrap: wrap !important;
        margin: 0 !important;
        width: 100% !important;
      }
      
      /* Responsive sidebar sizing for different screen sizes */
      @media (min-width: 997px) and (max-width: 1200px) {
        .theme-doc-sidebar-container {
          width: 22% !important;
          max-width: 22% !important;
          min-width: 22% !important;
        }
      }
      
      @media (min-width: 1201px) and (max-width: 1599px) {
        .theme-doc-sidebar-container {
          width: 18% !important;
          max-width: 18% !important;
          min-width: 18% !important;
        }
      }
      
      @media (min-width: 1600px) {
        .theme-doc-sidebar-container {
          width: 15% !important;
          max-width: 15% !important;
          min-width: 15% !important;
        }
      }
      
      /* Mobile layout fixes */
      @media (max-width: 996px) {
        .theme-doc-sidebar-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          bottom: 0 !important;
          transform: translateX(-100%) !important;
          transition: transform 0.3s ease !important;
          z-index: 9999 !important;
          width: 85% !important;
          max-width: 320px !important;
          height: 100% !important;
        }
        
        .theme-doc-sidebar-container.menu--show {
          transform: translateX(0) !important;
        }
        
        .docMainContainer,
        [class*="docMainContainer"],
        .docPage,
        [class*="docPage"],
        .docItemContainer,
        [class*="docItemContainer"] {
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Programmatically fix sidebar behavior after a small delay
    setTimeout(function() {
      // Fix sidebar positioning
      const sidebar = document.querySelector('.theme-doc-sidebar-container');
      if (sidebar) {
        if (window.innerWidth > 996) {
          // Desktop
          sidebar.style.position = 'sticky';
          sidebar.style.top = 'var(--ifm-navbar-height, 60px)';
          sidebar.style.height = 'calc(100vh - var(--ifm-navbar-height, 60px))';
          sidebar.style.transform = 'none';
          
          // Set appropriate width based on screen size
          if (window.innerWidth > 1600) {
            sidebar.style.width = '15%';
          } else if (window.innerWidth > 1200) {
            sidebar.style.width = '18%';
          } else {
            sidebar.style.width = '22%';
          }
        } else {
          // Mobile
          sidebar.style.position = 'fixed';
          sidebar.style.transform = 'translateX(-100%)';
          sidebar.style.width = '85%';
          sidebar.style.maxWidth = '320px';
        }
      }
      
      // Create or update overlay
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
        overlay.style.zIndex = '9000';
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
      
      // Handle sidebar toggle click
      const toggle = document.querySelector('.navbar__toggle');
      if (toggle) {
        toggle.addEventListener('click', function() {
          if (sidebar) {
            if (sidebar.classList.contains('menu--show')) {
              sidebar.classList.remove('menu--show');
              overlay.style.display = 'none';
            } else {
              sidebar.classList.add('menu--show');
              overlay.style.display = 'block';
            }
          }
        });
      }
      
      // Handle window resize events
      window.addEventListener('resize', function() {
        if (sidebar) {
          if (window.innerWidth > 996) {
            // Desktop
            sidebar.style.position = 'sticky';
            sidebar.style.transform = 'none';
            
            // Set appropriate width based on screen size
            if (window.innerWidth > 1600) {
              sidebar.style.width = '15%';
            } else if (window.innerWidth > 1200) {
              sidebar.style.width = '18%';
            } else {
              sidebar.style.width = '22%';
            }
          } else {
            // Mobile
            sidebar.style.position = 'fixed';
            if (!sidebar.classList.contains('menu--show')) {
              sidebar.style.transform = 'translateX(-100%)';
            }
            sidebar.style.width = '85%';
            sidebar.style.maxWidth = '320px';
          }
        }
      });
    }, 200);
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