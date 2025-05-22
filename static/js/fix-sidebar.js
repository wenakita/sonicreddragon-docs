// Ultimate Sidebar Fix - v4.0.0
(function() {
  // Configuration
  const config = {
    sidebarWidth: '250px',
    mobileBreakpoint: 996, // Match Docusaurus mobile breakpoint
    sidebarSelector: '.theme-doc-sidebar-container',
    mainContentSelector: '[class*="docMainContainer"]',
    toggleButtonSelectors: '.navbar__toggle, .navbar-sidebar__close',
    fixInterval: 100 // Shorter interval for more frequent checks
  };

  // Core fix function that applies all necessary layout adjustments
  function applySidebarFix() {
    const sidebar = document.querySelector(config.sidebarSelector);
    const mainContent = document.querySelector(config.mainContentSelector);
    const isMobile = window.innerWidth <= config.mobileBreakpoint;
    
    if (!sidebar || !mainContent) return; // Exit if elements not found
    
    // 1. Fix the sidebar positioning - with !important flags
    Object.assign(sidebar.style, {
      position: 'fixed !important',
      top: 'var(--ifm-navbar-height) !important',
      left: '0 !important',
      bottom: '0 !important',
      width: config.sidebarWidth + ' !important',
      maxWidth: config.sidebarWidth + ' !important',
      height: 'calc(100vh - var(--ifm-navbar-height)) !important',
      zIndex: '200 !important',
      overflowY: 'auto !important',
      overflowX: 'hidden !important',
      borderRight: '1px solid var(--ifm-toc-border-color) !important',
      transform: isMobile ? 'translateX(-100%) !important' : 'none !important',
      transition: 'transform 0.3s ease !important',
      boxShadow: isMobile ? '2px 0 8px rgba(0,0,0,0.15) !important' : 'none !important'
    });
    
    // Special mobile styling
    if (isMobile) {
      if (document.body.classList.contains('sidebar-shown')) {
        sidebar.style.transform = 'translateX(0) !important';
      }
    }
    
    // 2. Fix the main content positioning - with !important flags
    Object.assign(mainContent.style, {
      marginLeft: isMobile ? '0 !important' : config.sidebarWidth + ' !important',
      width: isMobile ? '100% !important' : `calc(100% - ${config.sidebarWidth}) !important`,
      maxWidth: isMobile ? '100% !important' : `calc(100% - ${config.sidebarWidth}) !important`,
      transition: 'margin-left 0.3s ease, width 0.3s ease, max-width 0.3s ease !important'
    });
    
    // Also directly set CSS custom properties that Docusaurus might use
    document.documentElement.style.setProperty('--doc-sidebar-width', config.sidebarWidth);
    
    // Force fix any nested container elements that might have their own margins/widths
    const containerElements = mainContent.querySelectorAll('.container, .row, [class*="docItemCol"]');
    containerElements.forEach(container => {
      if (container) {
        container.style.width = '100% !important';
        container.style.maxWidth = '100% !important';
        container.style.marginLeft = '0 !important';
        container.style.paddingLeft = 'var(--ifm-spacing-horizontal) !important';
      }
    });
    
    // 3. Create/manage overlay for mobile
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
      
      // Close sidebar when clicking overlay
      overlay.addEventListener('click', function() {
        document.body.classList.remove('sidebar-shown');
        applySidebarFix(); // Apply immediately on toggle
      });
    }
    
    // Update overlay visibility
    overlay.style.display = (isMobile && document.body.classList.contains('sidebar-shown')) 
      ? 'block' 
      : 'none';
  }
  
  // Initialize toggle buttons for mobile sidebar
  function setupToggleButtons() {
    const toggleButtons = document.querySelectorAll(config.toggleButtonSelectors);
    
    toggleButtons.forEach(btn => {
      // Use event delegation or remove existing listeners to avoid duplicates
      const newBtn = btn.cloneNode(true);
      if (btn.parentNode) {
        btn.parentNode.replaceChild(newBtn, btn);
      }
      
      newBtn.addEventListener('click', function() {
        document.body.classList.toggle('sidebar-shown');
        applySidebarFix(); // Apply immediately on toggle
      });
    });
    
    // Add keyboard support for closing sidebar with ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.body.classList.contains('sidebar-shown')) {
        document.body.classList.remove('sidebar-shown');
        applySidebarFix();
      }
    });
  }
  
  // Add CSS classes for specific browsers to handle potential quirks
  function addBrowserSpecificFixes() {
    const html = document.documentElement;
    
    // Detect Chrome
    if (navigator.userAgent.indexOf("Chrome") > -1) {
      html.classList.add('browser-chrome');
    }
    // Detect Firefox
    else if (navigator.userAgent.indexOf("Firefox") > -1) {
      html.classList.add('browser-firefox');
    }
    // Detect Safari
    else if (navigator.userAgent.indexOf("Safari") > -1) {
      html.classList.add('browser-safari');
    }
    // Detect Edge
    else if (navigator.userAgent.indexOf("Edg") > -1) {
      html.classList.add('browser-edge');
    }
  }
  
  // Initialize everything
  function init() {
    // Add browser-specific classes
    addBrowserSpecificFixes();
    
    // Apply fix immediately and again after a small delay
    // (helps with race conditions during page load)
    applySidebarFix();
    
    // Apply again after a small delay to ensure DOM is fully rendered
    setTimeout(applySidebarFix, 50);
    setTimeout(applySidebarFix, 200);
    setTimeout(applySidebarFix, 500);
    
    // Setup toggle buttons
    setupToggleButtons();
    
    // Apply fix on window resize
    window.addEventListener('resize', applySidebarFix);
    
    // Set interval to continually ensure layout is correct
    // This helps override any Docusaurus dynamic changes
    const intervalId = setInterval(applySidebarFix, config.fixInterval);
    
    // Store interval ID for potential cleanup
    window._sidebarFixInterval = intervalId;
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Handle SPA navigation by watching for DOM changes
  const observer = new MutationObserver(function(mutations) {
    let shouldApplyFix = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        // Check if navigation occurred
        if (mutation.target.tagName === 'BODY' || 
            mutation.target.classList.contains('main-wrapper')) {
          shouldApplyFix = true;
        }
      }
    });
    
    if (shouldApplyFix) {
      // Apply multiple times with delays to ensure it catches
      applySidebarFix();
      setTimeout(applySidebarFix, 50);
      setTimeout(applySidebarFix, 200);
      setTimeout(setupToggleButtons, 100);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Also expose a global function that can be called manually if needed
  window.fixDocusaurusSidebar = applySidebarFix;
})(); 