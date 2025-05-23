/**
 * EMERGENCY SIDEBAR FIX
 * This is the simplest possible fix that will work immediately
 */

(function() {
  'use strict';
  
  console.log('🚨 EMERGENCY SIDEBAR FIX LOADING...');
  
  // Inject CSS immediately - highest priority
  const emergencyCSS = `
    <style id="emergency-sidebar-fix" type="text/css">
    
    /* EMERGENCY SIDEBAR FIX - ABSOLUTE HIGHEST PRIORITY */
    
    /* Desktop Layout - Fixed Sidebar */
    @media screen and (min-width: 997px) {
      
      /* Force sidebar to exact dimensions */
      .theme-doc-sidebar-container,
      div[class*="theme-doc-sidebar-container"],
      [class*="docSidebarContainer"] {
        position: fixed !important;
        top: 60px !important;
        left: 0 !important;
        width: 250px !important;
        min-width: 250px !important;
        max-width: 250px !important;
        height: calc(100vh - 60px) !important;
        overflow-y: auto !important;
        z-index: 100 !important;
        background: var(--ifm-background-surface-color, #fff) !important;
        border-right: 1px solid #ddd !important;
        transform: none !important;
        transition: none !important;
        flex: none !important;
        flex-grow: 0 !important;
        flex-shrink: 0 !important;
        flex-basis: 250px !important;
      }
      
      /* Force main content to the right of sidebar */
      [class*="docPage"],
      [class*="docMainContainer"],
      .main-wrapper,
      div[class*="docPage"],
      div[class*="docMainContainer"] {
        margin-left: 250px !important;
        width: calc(100% - 250px) !important;
        max-width: calc(100% - 250px) !important;
        min-width: 0 !important;
        flex: 1 1 auto !important;
      }
      
      /* Reset any flex container that might be causing issues */
      .row,
      div[class*="row"] {
        margin-left: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
      }
      
      /* Main content containers */
      [class*="docMainContainer"] .container,
      [class*="docItemCol"] {
        margin-left: 0 !important;
        padding-left: 2rem !important;
        padding-right: 2rem !important;
        width: 100% !important;
        max-width: 100% !important;
      }
    }
    
    /* Mobile Layout - Hidden by default */
    @media screen and (max-width: 996px) {
      .theme-doc-sidebar-container,
      div[class*="theme-doc-sidebar-container"],
      [class*="docSidebarContainer"] {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 280px !important;
        max-width: 80vw !important;
        height: 100vh !important;
        z-index: 9999 !important;
        background: var(--ifm-background-surface-color, #fff) !important;
        border-right: 1px solid #ddd !important;
        box-shadow: 2px 0 10px rgba(0,0,0,0.3) !important;
        transform: translateX(-100%) !important;
        transition: transform 0.3s ease !important;
      }
      
      /* Mobile content takes full width */
      [class*="docPage"],
      [class*="docMainContainer"],
      .main-wrapper {
        margin-left: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
    }
    
    /* Sidebar menu styling */
    .theme-doc-sidebar-menu {
      padding: 1rem !important;
      height: 100% !important;
      box-sizing: border-box !important;
    }
    
    /* Menu items */
    .menu {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      font-size: 14px !important;
    }
    
    .menu__link {
      padding: 0.5rem !important;
      margin: 2px 0 !important;
      border-radius: 4px !important;
      display: block !important;
      text-decoration: none !important;
    }
    
    .menu__link--active {
      background: rgba(74, 128, 209, 0.1) !important;
      border-left: 3px solid #4a80d1 !important;
      font-weight: 600 !important;
    }
    
    .menu__link:hover {
      background: rgba(74, 128, 209, 0.05) !important;
    }
    
    /* Override any competing styles */
    html, body {
      overflow-x: hidden !important;
    }
    
    </style>
  `;
  
  // Inject CSS into head immediately
  document.head.insertAdjacentHTML('beforeend', emergencyCSS);
  console.log('💉 Emergency CSS injected');
  
  // Function to apply direct style fixes
  function applyEmergencyFixes() {
    const sidebar = document.querySelector('.theme-doc-sidebar-container, [class*="docSidebarContainer"]');
    const mainContent = document.querySelector('[class*="docPage"], [class*="docMainContainer"]');
    
    if (sidebar && window.innerWidth > 996) {
      console.log('🔧 Applying emergency desktop fixes...');
      
      // Force sidebar dimensions directly
      sidebar.style.cssText = `
        position: fixed !important;
        top: 60px !important;
        left: 0px !important;
        width: 250px !important;
        min-width: 250px !important;
        max-width: 250px !important;
        height: calc(100vh - 60px) !important;
        overflow-y: auto !important;
        z-index: 100 !important;
        background: var(--ifm-background-surface-color) !important;
        border-right: 1px solid var(--ifm-toc-border-color) !important;
        transform: none !important;
        transition: none !important;
        flex: none !important;
      `;
      
      // Force main content positioning
      const docPages = document.querySelectorAll('[class*="docPage"]');
      docPages.forEach(page => {
        page.style.cssText = `
          margin-left: 250px !important;
          width: calc(100% - 250px) !important;
          max-width: calc(100% - 250px) !important;
          min-width: 0 !important;
        `;
      });
      
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
      
      console.log('✅ Emergency desktop fixes applied');
    }
  }
  
  // Apply fixes immediately and repeatedly
  applyEmergencyFixes();
  
  // Apply fixes when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyEmergencyFixes);
  }
  
  // Apply fixes on window resize
  window.addEventListener('resize', applyEmergencyFixes);
  
  // Apply fixes every 3 seconds for the first 30 seconds
  const fixInterval = setInterval(applyEmergencyFixes, 3000);
  setTimeout(() => clearInterval(fixInterval), 30000);
  
  // Watch for route changes
  let currentUrl = window.location.href;
  setInterval(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      setTimeout(applyEmergencyFixes, 100);
    }
  }, 1000);
  
  console.log('🚨 EMERGENCY SIDEBAR FIX LOADED!');
  
})(); 