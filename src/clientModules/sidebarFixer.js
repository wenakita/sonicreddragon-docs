/**
 * Comprehensive Sidebar Fixer for Docusaurus
 * This module ensures the sidebar layout works correctly on all devices
 */

export default (function() {
  if (typeof window === 'undefined') return;

  let isInitialized = false;

  function initSidebarFixer() {
    if (isInitialized) return;
    isInitialized = true;

    console.log('🔧 Initializing Sidebar Fixer...');

    // Apply fixes immediately and on DOM changes
    applySidebarFixes();
    observeForChanges();
    setupMobileToggleHandler();
    
    // Apply fixes on window resize
    window.addEventListener('resize', debounce(applySidebarFixes, 250));
    
    console.log('✅ Sidebar Fixer initialized');
  }

  function applySidebarFixes() {
    try {
      const sidebar = document.querySelector('.theme-doc-sidebar-container');
      const mainContent = document.querySelector('[class*="docPage"], [class*="docMainContainer"]');
      
      if (!sidebar) return;

      // Desktop fixes (viewport width > 996px)
      if (window.innerWidth > 996) {
        // Force fixed positioning for desktop
        sidebar.style.cssText = `
          position: fixed !important;
          top: var(--ifm-navbar-height) !important;
          left: 0 !important;
          width: 250px !important;
          height: calc(100vh - var(--ifm-navbar-height)) !important;
          overflow-y: auto !important;
          z-index: 100 !important;
          background: var(--ifm-background-surface-color) !important;
          border-right: 1px solid var(--ifm-toc-border-color) !important;
          transform: none !important;
          transition: none !important;
        `;

        // Adjust main content
        if (mainContent) {
          const docPage = document.querySelector('[class*="docPage"]');
          if (docPage) {
            docPage.style.cssText = `
              margin-left: 250px !important;
              width: calc(100% - 250px) !important;
              display: block !important;
            `;
          }
          
          // Fix main containers
          const mainContainers = document.querySelectorAll('[class*="docMainContainer"]');
          mainContainers.forEach(container => {
            container.style.cssText = `
              margin-left: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              padding-left: 2rem !important;
              padding-right: 2rem !important;
            `;
          });
        }
      } 
      // Mobile fixes (viewport width <= 996px)
      else {
        // Reset desktop styles and apply mobile styles
        sidebar.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 85% !important;
          max-width: 300px !important;
          height: 100% !important;
          z-index: 9999 !important;
          background: var(--ifm-background-surface-color) !important;
          border-right: 1px solid var(--ifm-toc-border-color) !important;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2) !important;
          transform: translateX(-100%) !important;
          transition: transform 0.3s ease !important;
        `;

        // Reset main content for mobile
        if (mainContent) {
          const docPage = document.querySelector('[class*="docPage"]');
          if (docPage) {
            docPage.style.cssText = `
              margin-left: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            `;
          }
          
          const mainContainers = document.querySelectorAll('[class*="docMainContainer"]');
          mainContainers.forEach(container => {
            container.style.cssText = `
              margin-left: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            `;
          });
        }
      }

      // Clean up sidebar menu
      const sidebarMenu = document.querySelector('.theme-doc-sidebar-menu');
      if (sidebarMenu) {
        sidebarMenu.style.cssText = `
          padding: 1rem !important;
          height: 100% !important;
        `;
      }

    } catch (error) {
      console.warn('Sidebar fixer error:', error);
    }
  }

  function setupMobileToggleHandler() {
    // Handle mobile sidebar toggle
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
    if (window.innerWidth > 996) return; // Only for mobile

    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    if (!sidebar) return;

    const isOpen = !sidebar.style.transform.includes('translateX(-100%)');
    
    if (isOpen) {
      // Close sidebar
      sidebar.style.transform = 'translateX(-100%)';
      document.body.style.overflow = '';
      removeMobileBackdrop();
    } else {
      // Open sidebar
      sidebar.style.transform = 'translateX(0)';
      document.body.style.overflow = 'hidden';
      addMobileBackdrop();
    }
  }

  function handleBackdropClick(event) {
    if (window.innerWidth > 996) return;
    
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    if (!sidebar) return;

    // If clicking outside sidebar while it's open, close it
    const isClickingOutside = !sidebar.contains(event.target) && 
                              !event.target.closest('.navbar__toggle');
    const isOpen = !sidebar.style.transform.includes('translateX(-100%)');

    if (isClickingOutside && isOpen) {
      sidebar.style.transform = 'translateX(-100%)';
      document.body.style.overflow = '';
      removeMobileBackdrop();
    }
  }

  function addMobileBackdrop() {
    removeMobileBackdrop(); // Remove existing backdrop
    
    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9998;
      display: block;
    `;
    
    document.body.appendChild(backdrop);
  }

  function removeMobileBackdrop() {
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }

  function observeForChanges() {
    // Watch for DOM changes that might affect the sidebar
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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarFixer);
  } else {
    initSidebarFixer();
  }

  // Also initialize on route changes (for SPAs)
  let currentPath = window.location.pathname;
  const checkForRouteChange = () => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      setTimeout(initSidebarFixer, 100); // Small delay for DOM updates
    }
  };
  
  // Use both popstate and a polling mechanism for route changes
  window.addEventListener('popstate', checkForRouteChange);
  setInterval(checkForRouteChange, 1000);

  return {
    init: initSidebarFixer,
    applySidebarFixes,
    setupMobileToggleHandler
  };
})(); 