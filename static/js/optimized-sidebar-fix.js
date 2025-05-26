/**
 * OPTIMIZED SIDEBAR FIX for Docusaurus
 * Consolidates all sidebar fixes into one efficient solution
 * v1.0.0 - Production Ready
 */

(function() {
  'use strict';
  
  console.log('🚀 Loading Optimized Sidebar Fix v1.0.0');
  
  // Configuration
  const CONFIG = {
    DESKTOP_BREAKPOINT: 997,
    SIDEBAR_WIDTH: 250,
    TOC_WIDTH: 280,
    NAVBAR_HEIGHT_VAR: 'var(--ifm-navbar-height, 60px)',
    Z_INDEX: {
      SIDEBAR: 100,
      TOC: 50,
      MOBILE_BACKDROP: 9999,
      MOBILE_SIDEBAR: 10000
    }
  };
  
  let isInitialized = false;
  let resizeTimeout;
  let routeCheckInterval;
  let currentUrl = window.location.href;
  
  // Inject optimized CSS immediately
  function injectOptimizedCSS() {
    const existingStyle = document.getElementById('optimized-sidebar-fix');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'optimized-sidebar-fix';
    style.innerHTML = `
/* OPTIMIZED SIDEBAR FIX - SINGLE SOURCE OF TRUTH */

/* Desktop Layout (>= 997px) */
@media screen and (min-width: 997px) {
  /* Fixed sidebar positioning */
  .theme-doc-sidebar-container {
    position: fixed !important;
    top: ${CONFIG.NAVBAR_HEIGHT_VAR} !important;
    left: 0 !important;
    width: ${CONFIG.SIDEBAR_WIDTH}px !important;
    min-width: ${CONFIG.SIDEBAR_WIDTH}px !important;
    max-width: ${CONFIG.SIDEBAR_WIDTH}px !important;
    height: calc(100vh - ${CONFIG.NAVBAR_HEIGHT_VAR}) !important;
    overflow-y: auto !important;
    z-index: ${CONFIG.Z_INDEX.SIDEBAR} !important;
    background: var(--ifm-background-surface-color) !important;
    border-right: 1px solid var(--ifm-toc-border-color) !important;
    transform: none !important;
    transition: none !important;
  }
  
  /* Main content adjustment */
  [class*="docPage"] {
    margin-left: ${CONFIG.SIDEBAR_WIDTH}px !important;
    width: calc(100% - ${CONFIG.SIDEBAR_WIDTH}px) !important;
    max-width: calc(100% - ${CONFIG.SIDEBAR_WIDTH}px) !important;
    display: flex !important;
    flex-direction: row !important;
  }
  
  /* Content container */
  [class*="docMainContainer"] {
    margin-left: 0 !important;
    width: calc(100% - ${CONFIG.TOC_WIDTH}px) !important;
    max-width: calc(100% - ${CONFIG.TOC_WIDTH}px) !important;
    flex: 1 1 auto !important;
    padding-left: 2rem !important;
    padding-right: 1rem !important;
    min-width: 0 !important;
  }
  
  /* Table of Contents - Fixed right */
  .theme-doc-toc-desktop,
  [class*="tocDesktop"],
  .col.col--3 {
    position: fixed !important;
    top: ${CONFIG.NAVBAR_HEIGHT_VAR} !important;
    right: 0 !important;
    width: ${CONFIG.TOC_WIDTH}px !important;
    max-width: ${CONFIG.TOC_WIDTH}px !important;
    height: calc(100vh - ${CONFIG.NAVBAR_HEIGHT_VAR}) !important;
    overflow-y: auto !important;
    z-index: ${CONFIG.Z_INDEX.TOC} !important;
    background: var(--ifm-background-surface-color) !important;
    border-left: 1px solid var(--ifm-toc-border-color) !important;
    padding: 1rem !important;
    display: block !important;
    visibility: visible !important;
  }
}

/* Mobile Layout (<= 996px) */
@media screen and (max-width: 996px) {
  .theme-doc-sidebar-container {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 85% !important;
    max-width: 300px !important;
    height: 100% !important;
    z-index: ${CONFIG.Z_INDEX.MOBILE_SIDEBAR} !important;
    background: var(--ifm-background-surface-color) !important;
    border-right: 1px solid var(--ifm-toc-border-color) !important;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3) !important;
    transform: translateX(-100%) !important;
    transition: transform 0.3s ease !important;
  }
  
  /* Mobile content takes full width */
  [class*="docPage"],
  [class*="docMainContainer"] {
    margin-left: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  
  /* Hide TOC on mobile */
  .theme-doc-toc-desktop,
  [class*="tocDesktop"] {
    display: none !important;
  }
}

/* Sidebar menu styling */
.theme-doc-sidebar-menu {
  padding: 1rem !important;
  height: 100% !important;
  box-sizing: border-box !important;
}

/* Menu styling */
.menu {
  padding: 0 !important;
  margin: 0 !important;
  font-size: 14px !important;
}

.menu__link {
  padding: 0.5rem !important;
  margin: 2px 0 !important;
  border-radius: 4px !important;
  display: block !important;
  text-decoration: none !important;
  transition: all 0.2s ease !important;
}

.menu__link--active {
  background: rgba(74, 128, 209, 0.1) !important;
  border-left: 3px solid var(--ifm-color-primary) !important;
  font-weight: 600 !important;
}

.menu__link:hover {
  background: rgba(74, 128, 209, 0.05) !important;
}

/* TOC styling */
.table-of-contents__link {
  font-size: 0.875rem !important;
  padding: 0.25rem 0 !important;
  display: block !important;
  color: var(--ifm-color-content-secondary) !important;
  text-decoration: none !important;
}

.table-of-contents__link--active {
  color: var(--ifm-color-primary) !important;
  font-weight: 600 !important;
}

.table-of-contents__link:hover {
  color: var(--ifm-color-primary) !important;
}

/* Mobile backdrop */
.mobile-sidebar-backdrop {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.7) !important;
  z-index: ${CONFIG.Z_INDEX.MOBILE_BACKDROP} !important;
  display: none !important;
}

.mobile-sidebar-backdrop.visible {
  display: block !important;
}

/* Mobile sidebar open state */
.mobile-sidebar-open .theme-doc-sidebar-container {
  transform: translateX(0) !important;
}

.mobile-sidebar-open .mobile-sidebar-backdrop {
  display: block !important;
}

.mobile-sidebar-open {
  overflow: hidden !important;
}
    `;
    
    document.head.appendChild(style);
    console.log('💉 Optimized CSS injected');
  }
  
  // Mobile sidebar management
  const MobileSidebar = {
    isOpen: false,
    
    toggle() {
      if (window.innerWidth > CONFIG.DESKTOP_BREAKPOINT) return;
      
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    
    open() {
      if (window.innerWidth > CONFIG.DESKTOP_BREAKPOINT) return;
      
      this.isOpen = true;
      document.body.classList.add('mobile-sidebar-open');
      this.addBackdrop();
      console.log('📱 Mobile sidebar opened');
    },
    
    close() {
      this.isOpen = false;
      document.body.classList.remove('mobile-sidebar-open');
      this.removeBackdrop();
      console.log('📱 Mobile sidebar closed');
    },
    
    addBackdrop() {
      this.removeBackdrop();
      const backdrop = document.createElement('div');
      backdrop.className = 'mobile-sidebar-backdrop visible';
      backdrop.addEventListener('click', () => this.close());
      document.body.appendChild(backdrop);
    },
    
    removeBackdrop() {
      const backdrop = document.querySelector('.mobile-sidebar-backdrop');
      if (backdrop) backdrop.remove();
    }
  };
  
  // Setup mobile toggle functionality
  function setupMobileHandlers() {
    // Handle navbar toggle button
    const toggleButton = document.querySelector('.navbar__toggle');
    if (toggleButton) {
      toggleButton.removeEventListener('click', MobileSidebar.toggle);
      toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        MobileSidebar.toggle();
      });
    }
    
    // Handle escape key
    document.removeEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleEscapeKey);
  }
  
  function handleEscapeKey(e) {
    if (e.key === 'Escape' && MobileSidebar.isOpen) {
      MobileSidebar.close();
    }
  }
  
  // Apply direct style fixes (fallback for timing issues)
  function applyDirectFixes() {
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    if (!sidebar) return;
    
    const isDesktop = window.innerWidth > CONFIG.DESKTOP_BREAKPOINT;
    
    if (isDesktop) {
      // Get navbar height dynamically
      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar ? navbar.offsetHeight : 60;
      
      // Force desktop layout
      sidebar.style.cssText = `
        position: fixed !important;
        top: ${navbarHeight}px !important;
        left: 0px !important;
        width: ${CONFIG.SIDEBAR_WIDTH}px !important;
        min-width: ${CONFIG.SIDEBAR_WIDTH}px !important;
        max-width: ${CONFIG.SIDEBAR_WIDTH}px !important;
        height: calc(100vh - ${navbarHeight}px) !important;
        overflow-y: auto !important;
        z-index: ${CONFIG.Z_INDEX.SIDEBAR} !important;
        background: var(--ifm-background-surface-color) !important;
        border-right: 1px solid var(--ifm-toc-border-color) !important;
        transform: none !important;
        transition: none !important;
      `;
    } else {
      // Force mobile layout
      sidebar.style.cssText = `
        position: fixed !important;
        top: 0px !important;
        left: 0px !important;
        width: 85% !important;
        max-width: 300px !important;
        height: 100% !important;
        z-index: ${CONFIG.Z_INDEX.MOBILE_SIDEBAR} !important;
        background: var(--ifm-background-surface-color) !important;
        border-right: 1px solid var(--ifm-toc-border-color) !important;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3) !important;
        transform: translateX(-100%) !important;
        transition: transform 0.3s ease !important;
      `;
    }
  }
  
  // Handle window resize
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Close mobile sidebar on resize to desktop
      if (window.innerWidth > CONFIG.DESKTOP_BREAKPOINT && MobileSidebar.isOpen) {
        MobileSidebar.close();
      }
      applyDirectFixes();
    }, 100);
  }
  
  // Handle route changes
  function handleRouteChange() {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      // Close mobile sidebar on route change
      if (MobileSidebar.isOpen) {
        MobileSidebar.close();
      }
      setTimeout(() => {
        setupMobileHandlers();
        applyDirectFixes();
      }, 100);
    }
  }
  
  // Initialize the optimized sidebar fix
  function initialize() {
    if (isInitialized) return;
    isInitialized = true;
    
    console.log('🚀 Initializing Optimized Sidebar Fix');
    
    // Inject CSS immediately
    injectOptimizedCSS();
    
    // Setup handlers
    setupMobileHandlers();
    
    // Apply direct fixes as fallback
    applyDirectFixes();
    
    // Setup event listeners
    window.addEventListener('resize', handleResize);
    
    // Watch for route changes
    routeCheckInterval = setInterval(handleRouteChange, 1000);
    
    console.log('✅ Optimized Sidebar Fix initialized successfully');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  // Initialize on window load as backup
  window.addEventListener('load', initialize);
  
  console.log('🚀 Optimized Sidebar Fix v1.0.0 loaded');
  
})(); 