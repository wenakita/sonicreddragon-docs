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
            } else {
              body.classList.remove('menu-opened');
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
    };
  }
}; 