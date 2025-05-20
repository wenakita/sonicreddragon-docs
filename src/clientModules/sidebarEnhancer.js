/**
 * Client-side module to enhance the sidebar behavior for mobile users
 */

export default {
  onRouteUpdate() {
    if (typeof window === 'undefined') return;
    
    // Function to enhance mobile sidebar experience
    function enhanceMobileSidebar() {
      // Get relevant elements
      const sidebarToggle = document.querySelector('.navbar__toggle');
      const sidebar = document.querySelector('.navbar-sidebar');
      const body = document.body;
      
      // Fix Docusaurus specific sidebar issues
      const fixDocusaurusSidebar = () => {
        // Create backdrop overlay if it doesn't exist
        let overlay = document.querySelector('.overlay-container');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'overlay-container';
          document.body.appendChild(overlay);
          
          // Add click handler to close sidebar when overlay is clicked
          overlay.addEventListener('click', function() {
            const docSidebar = document.querySelector('.theme-doc-sidebar-container');
            if (docSidebar && docSidebar.classList.contains('menu--show')) {
              docSidebar.classList.remove('menu--show');
            }
          });
        }
        
        // Fix for doc sidebar toggle
        const docSidebarButton = document.querySelector('.navbar__toggle');
        if (docSidebarButton) {
          docSidebarButton.addEventListener('click', function() {
            const docSidebar = document.querySelector('.theme-doc-sidebar-container');
            if (docSidebar) {
              if (docSidebar.classList.contains('menu--show')) {
                docSidebar.classList.remove('menu--show');
              } else {
                docSidebar.classList.add('menu--show');
              }
            }
          });
        }
        
        // Ensure main content doesn't overlap with sidebar
        const mainContent = document.querySelector('.main-wrapper');
        if (mainContent) {
          mainContent.style.position = 'relative';
          mainContent.style.zIndex = '10';
        }
      };
      
      // Force proper z-index on the sidebar
      if (sidebar) {
        sidebar.style.zIndex = '500';
        
        // Fix sidebar position and backdrop
        const backdrop = document.querySelector('.navbar-sidebar__backdrop');
        if (backdrop) {
          backdrop.style.zIndex = '400';
          backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
      }
      
      // Add active link highlighting
      const activeLinks = document.querySelectorAll('.menu__link--active');
      activeLinks.forEach(link => {
        // For each active link, make sure its parent categories are expanded
        let parent = link.closest('.menu__list-item');
        while (parent) {
          const parentToggle = parent.querySelector('.menu__link--sublist, .menu__list-item-collapsible');
          if (parentToggle && parent.classList.contains('menu__list-item--collapsed')) {
            parentToggle.click(); // Expand the collapsed item
          }
          parent = parent.parentElement ? parent.parentElement.closest('.menu__list-item') : null;
        }
        
        // Scroll active link into view with a slight delay to allow expansion
        setTimeout(() => {
          link.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
      
      // Create a collapse button for quick sidebar closing
      let collapseButton = document.querySelector('.collapse-button');
      if (!collapseButton && sidebar) {
        collapseButton = document.createElement('button');
        collapseButton.className = 'collapse-button';
        collapseButton.innerHTML = '×';
        collapseButton.setAttribute('aria-label', 'Close sidebar');
        collapseButton.style.zIndex = '1000';
        collapseButton.addEventListener('click', () => {
          const closeButton = document.querySelector('.navbar-sidebar__close');
          if (closeButton) closeButton.click();
        });
        body.appendChild(collapseButton);
      }
      
      // Event listener for sidebar toggle
      if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
          setTimeout(() => {
            if (sidebar && sidebar.classList.contains('shown')) {
              body.classList.add('menu-opened');
              document.documentElement.style.overflow = 'hidden'; // Prevent background scrolling
            } else {
              body.classList.remove('menu-opened');
              document.documentElement.style.overflow = ''; // Restore scrolling
            }
          }, 100);
        });
      }
      
      // Make menu items larger touch targets on mobile
      const menuItems = document.querySelectorAll('.menu__list-item');
      if (window.innerWidth < 996) {
        menuItems.forEach(item => {
          item.style.margin = '0.25rem 0';
        });
      }
      
      // Fix for Docusaurus specific sidebar
      fixDocusaurusSidebar();
    }
    
    // Run when the page is loaded and after route changes
    setTimeout(enhanceMobileSidebar, 200);
    
    // Clean up event listeners on route change
    return function cleanup() {
      const collapseButton = document.querySelector('.collapse-button');
      if (collapseButton) {
        collapseButton.removeEventListener('click', () => {});
        if (collapseButton.parentNode) {
          collapseButton.parentNode.removeChild(collapseButton);
        }
      }
      
      // Restore body scrolling
      document.documentElement.style.overflow = '';
      
      // Remove any overlay that might have been added
      const overlay = document.querySelector('.overlay-container');
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
  }
}; 