/**
 * Smooth Navigation Module
 * Ensures SPA-style navigation without sidebar reloading
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  // Override default link behavior for internal navigation
  document.addEventListener('click', (e) => {
    // Check if the clicked element is a link
    const link = e.target.closest('a');
    
    if (!link) return;
    
    // Check if it's an internal link
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    
    // Check if it's a docs link
    if (href.includes('/docs/') || link.classList.contains('menu__link')) {
      // Let Docusaurus handle the navigation
      // This ensures smooth SPA navigation
      return;
    }
  });
  
  // Preserve sidebar scroll position on navigation
  let sidebarScrollPosition = 0;
  
  const saveSidebarScroll = () => {
    const sidebar = document.querySelector('.theme-doc-sidebar-menu');
    if (sidebar) {
      sidebarScrollPosition = sidebar.scrollTop;
    }
  };
  
  const restoreSidebarScroll = () => {
    const sidebar = document.querySelector('.theme-doc-sidebar-menu');
    if (sidebar && sidebarScrollPosition > 0) {
      sidebar.scrollTop = sidebarScrollPosition;
    }
  };
  
  // Save scroll position before navigation
  window.addEventListener('beforeunload', saveSidebarScroll);
  
  // Restore scroll position after navigation
  if (window.docusaurus) {
    window.docusaurus.onRouteDidUpdate = ({location, previousLocation}) => {
      if (location.pathname !== previousLocation?.pathname) {
        setTimeout(restoreSidebarScroll, 100);
      }
    };
  }
  
  // Ensure sidebar stays consistent
  const observer = new MutationObserver(() => {
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    if (sidebar) {
      sidebar.style.transition = 'none';
      requestAnimationFrame(() => {
        sidebar.style.transition = '';
      });
    }
  });
  
  // Observe changes to the main content area
  const mainContent = document.querySelector('#__docusaurus');
  if (mainContent) {
    observer.observe(mainContent, {
      childList: true,
      subtree: true
    });
  }
} 