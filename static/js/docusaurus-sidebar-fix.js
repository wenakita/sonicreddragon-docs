// Direct Docusaurus Sidebar Fix - v1.0.0
// This script is injected directly in the HTML head for immediate execution

(function() {
  // Direct style injection - before any other styles
  const styleText = `
    /* Desktop sidebar positioning - enforced with !important */
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

  // Create and inject the style element immediately
  const style = document.createElement('style');
  style.id = 'direct-sidebar-fix';
  style.textContent = styleText;
  document.head.insertBefore(style, document.head.firstChild);

  // Create overlay and setup toggle handlers once DOM is ready
  function setupSidebar() {
    // Create overlay for mobile sidebar
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
      
      // Close sidebar when clicking overlay
      overlay.addEventListener('click', function() {
        document.body.classList.remove('sidebar-shown');
      });
    }
    
    // Setup toggle buttons for mobile
    const toggleButtons = document.querySelectorAll('.navbar__toggle, .navbar-sidebar__close');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        document.body.classList.toggle('sidebar-shown');
      });
    });
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.body.classList.contains('sidebar-shown')) {
        document.body.classList.remove('sidebar-shown');
      }
    });
  }

  // Run as soon as possible, and again when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSidebar);
  } else {
    setupSidebar();
  }
})(); 