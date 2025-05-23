/**
 * SUPER AGGRESSIVE Sidebar Fixer for Docusaurus
 * This module forces the sidebar layout to work correctly on all devices
 */

export default (function() {
  if (typeof window === 'undefined') return;

  let isInitialized = false;
  let fixInterval;

  function initSidebarFixer() {
    if (isInitialized) return;
    isInitialized = true;

    console.log('🔧 Initializing SUPER AGGRESSIVE Sidebar Fixer...');

    // Inject critical CSS immediately
    injectCriticalCSS();
    
    // Apply fixes immediately and repeatedly
    applySidebarFixes();
    observeForChanges();
    setupMobileToggleHandler();
    
    // Apply fixes on window resize
    window.addEventListener('resize', debounce(applySidebarFixes, 100));
    
    // AGGRESSIVE: Apply fixes every 2 seconds to ensure they stick
    fixInterval = setInterval(applySidebarFixes, 2000);
    
    // Stop aggressive fixes after 30 seconds (should be settled by then)
    setTimeout(() => {
      if (fixInterval) {
        clearInterval(fixInterval);
        console.log('🏁 Stopped aggressive sidebar fixes');
      }
    }, 30000);
    
    console.log('✅ SUPER AGGRESSIVE Sidebar Fixer initialized');
  }

  function injectCriticalCSS() {
    // Inject critical CSS directly into the document head
    const style = document.createElement('style');
    style.id = 'sidebar-fixer-critical';
    style.innerHTML = `
      /* CRITICAL SIDEBAR FIX - HIGHEST PRIORITY */
      @media (min-width: 997px) {
        .theme-doc-sidebar-container {
          position: fixed !important;
          top: var(--ifm-navbar-height, 60px) !important;
          left: 0 !important;
          width: 250px !important;
          min-width: 250px !important;
          max-width: 250px !important;
          height: calc(100vh - var(--ifm-navbar-height, 60px)) !important;
          overflow-y: auto !important;
          z-index: 999999 !important;
          background: var(--ifm-background-surface-color) !important;
          border-right: 1px solid var(--ifm-toc-border-color) !important;
          transform: none !important;
          transition: none !important;
        }
        
        [class*="docPage"] {
          margin-left: 250px !important;
          width: calc(100% - 250px) !important;
          max-width: calc(100% - 250px) !important;
          display: block !important;
        }
        
        [class*="docMainContainer"] {
          margin-left: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          padding-left: 2rem !important;
          padding-right: 2rem !important;
        }
      }

      @media (max-width: 996px) {
        .theme-doc-sidebar-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 85% !important;
          max-width: 300px !important;
          height: 100% !important;
          z-index: 999999 !important;
          background: var(--ifm-background-surface-color) !important;
          border-right: 1px solid var(--ifm-toc-border-color) !important;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2) !important;
          transform: translateX(-100%) !important;
          transition: transform 0.3s ease !important;
        }
        
        [class*="docPage"], 
        [class*="docMainContainer"] {
          margin-left: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }
      }
      
      .theme-doc-sidebar-menu {
        padding: 1rem !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(style);
    console.log('💉 Critical CSS injected');
  }

  function applySidebarFixes() {
    try {
      const sidebar = document.querySelector('.theme-doc-sidebar-container');
      if (!sidebar) {
        console.log('⚠️ Sidebar not found, retrying...');
        return;
      }

      console.log('🔧 Applying aggressive sidebar fixes...');

      // Desktop fixes (viewport width > 996px)
      if (window.innerWidth > 996) {
        // SUPER AGGRESSIVE: Force styles with highest specificity
        sidebar.style.setProperty('position', 'fixed', 'important');
        sidebar.style.setProperty('top', 'var(--ifm-navbar-height)', 'important');
        sidebar.style.setProperty('left', '0', 'important');
        sidebar.style.setProperty('width', '250px', 'important');
        sidebar.style.setProperty('min-width', '250px', 'important');
        sidebar.style.setProperty('max-width', '250px', 'important');
        sidebar.style.setProperty('height', 'calc(100vh - var(--ifm-navbar-height))', 'important');
        sidebar.style.setProperty('overflow-y', 'auto', 'important');
        sidebar.style.setProperty('z-index', '999999', 'important');
        sidebar.style.setProperty('background', 'var(--ifm-background-surface-color)', 'important');
        sidebar.style.setProperty('border-right', '1px solid var(--ifm-toc-border-color)', 'important');
        sidebar.style.setProperty('transform', 'none', 'important');
        sidebar.style.setProperty('transition', 'none', 'important');

        // Fix all doc pages
        const docPages = document.querySelectorAll('[class*="docPage"]');
        docPages.forEach(page => {
          page.style.setProperty('margin-left', '250px', 'important');
          page.style.setProperty('width', 'calc(100% - 250px)', 'important');
          page.style.setProperty('max-width', 'calc(100% - 250px)', 'important');
          page.style.setProperty('display', 'block', 'important');
        });
        
        // Fix all main containers
        const mainContainers = document.querySelectorAll('[class*="docMainContainer"]');
        mainContainers.forEach(container => {
          container.style.setProperty('margin-left', '0', 'important');
          container.style.setProperty('width', '100%', 'important');
          container.style.setProperty('max-width', '100%', 'important');
          container.style.setProperty('padding-left', '2rem', 'important');
          container.style.setProperty('padding-right', '2rem', 'important');
        });

        console.log('✅ Desktop sidebar fixes applied');
      } 
      // Mobile fixes (viewport width <= 996px)
      else {
        sidebar.style.setProperty('position', 'fixed', 'important');
        sidebar.style.setProperty('top', '0', 'important');
        sidebar.style.setProperty('left', '0', 'important');
        sidebar.style.setProperty('width', '85%', 'important');
        sidebar.style.setProperty('max-width', '300px', 'important');
        sidebar.style.setProperty('height', '100%', 'important');
        sidebar.style.setProperty('z-index', '999999', 'important');
        sidebar.style.setProperty('background', 'var(--ifm-background-surface-color)', 'important');
        sidebar.style.setProperty('border-right', '1px solid var(--ifm-toc-border-color)', 'important');
        sidebar.style.setProperty('box-shadow', '2px 0 10px rgba(0, 0, 0, 0.2)', 'important');
        
        // Only set transform if not manually opened
        if (!sidebar.classList.contains('mobile-open')) {
          sidebar.style.setProperty('transform', 'translateX(-100%)', 'important');
        }
        sidebar.style.setProperty('transition', 'transform 0.3s ease', 'important');

        // Reset main content for mobile
        const docPages = document.querySelectorAll('[class*="docPage"]');
        docPages.forEach(page => {
          page.style.setProperty('margin-left', '0', 'important');
          page.style.setProperty('width', '100%', 'important');
          page.style.setProperty('max-width', '100%', 'important');
        });
        
        const mainContainers = document.querySelectorAll('[class*="docMainContainer"]');
        mainContainers.forEach(container => {
          container.style.setProperty('margin-left', '0', 'important');
          container.style.setProperty('width', '100%', 'important');
          container.style.setProperty('max-width', '100%', 'important');
          container.style.setProperty('padding-left', '1rem', 'important');
          container.style.setProperty('padding-right', '1rem', 'important');
        });

        console.log('✅ Mobile sidebar fixes applied');
      }

      // Clean up sidebar menu
      const sidebarMenu = document.querySelector('.theme-doc-sidebar-menu');
      if (sidebarMenu) {
        sidebarMenu.style.setProperty('padding', '1rem', 'important');
        sidebarMenu.style.setProperty('height', '100%', 'important');
      }

    } catch (error) {
      console.warn('❌ Sidebar fixer error:', error);
    }
  }

  function setupMobileToggleHandler() {
    const toggleButton = document.querySelector('.navbar__toggle');
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    
    if (!toggleButton || !sidebar) return;

    // Remove existing listeners to avoid duplicates
    toggleButton.removeEventListener('click', handleMobileToggle);
    toggleButton.addEventListener('click', handleMobileToggle);

    // Handle backdrop clicks
    document.removeEventListener('click', handleBackdropClick);
    document.addEventListener('click', handleBackdropClick);
  }

  function handleMobileToggle(event) {
    if (window.innerWidth > 996) return;

    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('mobile-open');
    
    if (isOpen) {
      // Close sidebar
      sidebar.classList.remove('mobile-open');
      sidebar.style.setProperty('transform', 'translateX(-100%)', 'important');
      document.body.style.overflow = '';
      removeMobileBackdrop();
    } else {
      // Open sidebar
      sidebar.classList.add('mobile-open');
      sidebar.style.setProperty('transform', 'translateX(0)', 'important');
      document.body.style.overflow = 'hidden';
      addMobileBackdrop();
    }
  }

  function handleBackdropClick(event) {
    if (window.innerWidth > 996) return;
    
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    if (!sidebar) return;

    const isClickingOutside = !sidebar.contains(event.target) && 
                              !event.target.closest('.navbar__toggle');
    const isOpen = sidebar.classList.contains('mobile-open');

    if (isClickingOutside && isOpen) {
      sidebar.classList.remove('mobile-open');
      sidebar.style.setProperty('transform', 'translateX(-100%)', 'important');
      document.body.style.overflow = '';
      removeMobileBackdrop();
    }
  }

  function addMobileBackdrop() {
    removeMobileBackdrop();
    
    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop-aggressive';
    backdrop.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: rgba(0, 0, 0, 0.7) !important;
      z-index: 999998 !important;
      display: block !important;
    `;
    
    document.body.appendChild(backdrop);
  }

  function removeMobileBackdrop() {
    const backdrop = document.querySelector('.sidebar-backdrop-aggressive');
    if (backdrop) {
      backdrop.remove();
    }
  }

  function observeForChanges() {
    const observer = new MutationObserver(debounce(() => {
      applySidebarFixes();
      setupMobileToggleHandler();
    }, 100));

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

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

  // Initialize immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarFixer);
  } else {
    initSidebarFixer();
  }

  // Also initialize on route changes
  let currentPath = window.location.pathname;
  const checkForRouteChange = () => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      setTimeout(initSidebarFixer, 50);
    }
  };
  
  window.addEventListener('popstate', checkForRouteChange);
  setInterval(checkForRouteChange, 500);

  return {
    init: initSidebarFixer,
    applySidebarFixes,
    setupMobileToggleHandler
  };
})(); 