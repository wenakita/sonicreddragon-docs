// Ultimate Sidebar Fix - v3.0.0
(function() {
  // Configuration
  const config = {
    sidebarWidth: '250px',
    mobileBreakpoint: 996, // Match Docusaurus mobile breakpoint
    sidebarSelector: '.theme-doc-sidebar-container',
    mainContentSelector: '[class*="docMainContainer"]',
    toggleButtonSelectors: '.navbar__toggle, .navbar-sidebar__close',
    fixInterval: 200 // ms between checks/fixes
  };

  // Core fix function that applies all necessary layout adjustments
  function applySidebarFix() {
    const sidebar = document.querySelector(config.sidebarSelector);
    const mainContent = document.querySelector(config.mainContentSelector);
    const isMobile = window.innerWidth <= config.mobileBreakpoint;
    
    if (!sidebar || !mainContent) return; // Exit if elements not found
    
    // 1. Fix the sidebar positioning
    Object.assign(sidebar.style, {
      position: 'fixed',
      top: 'var(--ifm-navbar-height)',
      left: '0',
      bottom: '0',
      width: config.sidebarWidth,
      maxWidth: config.sidebarWidth,
      height: 'calc(100vh - var(--ifm-navbar-height))',
      zIndex: '200',
      overflowY: 'auto',
      overflowX: 'hidden',
      borderRight: '1px solid var(--ifm-toc-border-color)',
      transform: isMobile ? 'translateX(-100%)' : 'none',
      transition: 'transform 0.3s ease'
    });
    
    // Special mobile styling
    if (isMobile) {
      if (document.body.classList.contains('sidebar-shown')) {
        sidebar.style.transform = 'translateX(0)';
      }
    }
    
    // 2. Fix the main content positioning
    Object.assign(mainContent.style, {
      marginLeft: isMobile ? '0' : config.sidebarWidth,
      width: isMobile ? '100%' : `calc(100% - ${config.sidebarWidth})`,
      maxWidth: isMobile ? '100%' : `calc(100% - ${config.sidebarWidth})`,
      transition: 'margin-left 0.3s ease, width 0.3s ease, max-width 0.3s ease'
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
  
  // Initialize everything
  function init() {
    // Apply fix immediately
    applySidebarFix();
    
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
      // Small delay to ensure DOM is fully updated
      setTimeout(function() {
        applySidebarFix();
        setupToggleButtons();
      }, 100);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
})(); 