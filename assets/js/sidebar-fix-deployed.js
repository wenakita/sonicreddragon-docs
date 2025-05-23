/**
 * Sidebar Fix v7.0.0 - Deployed Version
 * Direct fix for gh-pages branch
 */

(function() {
  'use strict';
  
  // SSR Safety Check
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  let overlay = null;
  let isInitialized = false;

  function createOverlay() {
    if (overlay) return overlay;
    
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 9999;
      cursor: pointer;
    `;
    
    // Close sidebar when overlay is clicked
    overlay.addEventListener('click', closeSidebar);
    document.body.appendChild(overlay);
    
    return overlay;
  }

  function openSidebar() {
    document.body.classList.add('sidebar-shown');
    if (overlay) {
      overlay.style.display = 'block';
    }
  }

  function closeSidebar() {
    document.body.classList.remove('sidebar-shown');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  function toggleSidebar() {
    if (document.body.classList.contains('sidebar-shown')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  function isMobile() {
    return window.innerWidth <= 996;
  }

  function initializeSidebar() {
    if (isInitialized) return;
    
    // Create overlay for mobile
    createOverlay();

    // Handle mobile menu toggle
    const menuToggle = document.querySelector('.navbar__toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', function(e) {
        if (isMobile()) {
          e.preventDefault();
          e.stopPropagation();
          toggleSidebar();
        }
      });
    }

    // Handle ESC key to close sidebar on mobile
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isMobile() && document.body.classList.contains('sidebar-shown')) {
        closeSidebar();
      }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
      if (!isMobile()) {
        closeSidebar();
      }
    });

    // Close sidebar when clicking on main content on mobile
    document.addEventListener('click', function(e) {
      if (!isMobile()) return;
      
      const sidebar = document.querySelector('.theme-doc-sidebar-container');
      const menuToggle = document.querySelector('.navbar__toggle');
      
      if (sidebar && !sidebar.contains(e.target) && 
          menuToggle && !menuToggle.contains(e.target) &&
          document.body.classList.contains('sidebar-shown')) {
        closeSidebar();
      }
    });

    isInitialized = true;
    console.log('✅ Sidebar Fix v7.0.0 (deployed) initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSidebar);
  } else {
    initializeSidebar();
  }

  // Re-initialize after navigation (for SPA routing)
  let currentPath = window.location.pathname;
  function checkForNavigation() {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      setTimeout(initializeSidebar, 100);
    }
  }
  setInterval(checkForNavigation, 500);

  // Expose functions globally for debugging
  window.sidebarFix = {
    version: '7.0.0-deployed',
    open: openSidebar,
    close: closeSidebar,
    toggle: toggleSidebar,
    reinit: function() {
      isInitialized = false;
      initializeSidebar();
    }
  };

})(); 