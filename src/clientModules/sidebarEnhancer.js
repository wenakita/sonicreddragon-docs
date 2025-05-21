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
      
      // Additional fix for content overlapping sidebar
      function forceSidebarAboveContent() {
        // Force main wrapper to lower z-index
        const mainWrapper = document.querySelector('.main-wrapper');
        if (mainWrapper) {
          mainWrapper.style.zIndex = '1';
          mainWrapper.style.position = 'relative';
        }
        
        // Force all content containers to lower z-index
        const contentContainers = document.querySelectorAll('.container, .docItemContainer, .docMainContainer, .docPage, article');
        contentContainers.forEach(container => {
          if (container) {
            container.style.zIndex = '1';
            container.style.position = 'relative';
          }
        });
        
        // Force sidebar to highest z-index
        if (sidebar) {
          sidebar.style.zIndex = '10000';
          
          // Also push backdrop to high z-index
          const backdrop = document.querySelector('.navbar-sidebar__backdrop');
          if (backdrop) {
            backdrop.style.zIndex = '9999';
            backdrop.style.position = 'fixed';
            backdrop.style.inset = '0';  // shorthand for top/right/bottom/left = 0
          }
        }
        
        // Fix docusaurus-specific sidebar
        const docSidebar = document.querySelector('.theme-doc-sidebar-container');
        if (docSidebar) {
          docSidebar.style.zIndex = '10000';
          docSidebar.style.position = 'fixed';
          docSidebar.style.top = '0';
          docSidebar.style.bottom = '0';
          docSidebar.style.left = '0';
          
          // Use responsive widths
          if (window.innerWidth <= 996) {
            // Mobile width
            docSidebar.style.width = '85%';
            docSidebar.style.maxWidth = '300px';
          } else {
            // Desktop width
            docSidebar.style.width = '300px';
            docSidebar.style.maxWidth = '300px';
          }
          
          // Ensure it has the right background
          const theme = document.documentElement.dataset.theme;
          if (theme === 'dark') {
            docSidebar.style.backgroundColor = 'var(--ifm-background-surface-color)';
          } else {
            docSidebar.style.backgroundColor = 'var(--ifm-background-surface-color)';
          }
        }
      }
      
      // Apply the fix immediately and also when sidebar visibility changes
      forceSidebarAboveContent();
      
      // Fix Docusaurus specific sidebar issues
      const fixDocusaurusSidebar = () => {
        // Create backdrop overlay if it doesn't exist
        let overlay = document.querySelector('.overlay-container');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'overlay-container';
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.right = '0';
          overlay.style.bottom = '0';
          overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          overlay.style.zIndex = '9999';
          overlay.style.display = 'none';
          document.body.appendChild(overlay);
          
          // Add click handler to close sidebar when overlay is clicked
          overlay.addEventListener('click', function() {
            const docSidebar = document.querySelector('.theme-doc-sidebar-container');
            if (docSidebar && docSidebar.classList.contains('menu--show')) {
              docSidebar.classList.remove('menu--show');
              overlay.style.display = 'none';
            }
            
            // Also close navbar sidebar if open
            const closeButton = document.querySelector('.navbar-sidebar__close');
            if (closeButton && sidebar && sidebar.classList.contains('shown')) {
              closeButton.click();
            }
          });
        }
        
        // Fix for doc sidebar toggle
        const docSidebarButton = document.querySelector('.navbar__toggle');
        if (docSidebarButton) {
          // Remove any existing listeners to prevent duplicates
          const newButton = docSidebarButton.cloneNode(true);
          if (docSidebarButton.parentNode) {
            docSidebarButton.parentNode.replaceChild(newButton, docSidebarButton);
          }
          
          newButton.addEventListener('click', function() {
            // Force correct positioning
            const docSidebar = document.querySelector('.theme-doc-sidebar-container');
            if (docSidebar) {
              // Set correct positioning for the sidebar
              docSidebar.style.position = 'fixed';
              docSidebar.style.top = '0';
              docSidebar.style.left = '0';
              docSidebar.style.bottom = '0';
              docSidebar.style.zIndex = '10000';
              
              // On mobile, use percentage width
              if (window.innerWidth <= 996) {
                docSidebar.style.width = '85%';
                docSidebar.style.maxWidth = '300px';
              }
              
              // Ensure background color is set for mobile
              const theme = document.documentElement.dataset.theme;
              docSidebar.style.backgroundColor = theme === 'dark' ? 
                'var(--ifm-background-surface-color)' : 
                'var(--ifm-background-surface-color)';
              
              // Toggle visibility
              if (docSidebar.classList.contains('menu--show')) {
                docSidebar.classList.remove('menu--show');
                overlay.style.display = 'none';
                document.body.style.overflow = '';
              } else {
                docSidebar.classList.add('menu--show');
                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
              }
            }
          });
        }
        
        // Update sidebar class based on scroll position
        window.addEventListener('scroll', function() {
          const docSidebar = document.querySelector('.theme-doc-sidebar-container');
          const navbar = document.querySelector('.navbar');
          
          if (docSidebar && navbar) {
            const navbarHeight = navbar.offsetHeight;
            
            // Only apply desktop behavior for wider screens
            if (window.innerWidth > 996) {
              // On desktop, ensure sidebar is positioned below navbar
              docSidebar.style.position = 'sticky';
              docSidebar.style.top = `${navbarHeight}px`;
              docSidebar.style.height = `calc(100vh - ${navbarHeight}px)`;
              docSidebar.style.maxHeight = `calc(100vh - ${navbarHeight}px)`;
            }
          }
        });
        
        // Ensure main content doesn't overlap with sidebar
        const mainContent = document.querySelector('.main-wrapper');
        if (mainContent) {
          mainContent.style.position = 'relative';
          mainContent.style.zIndex = '1';
        }
      };
      
      // Force proper z-index on the sidebar
      if (sidebar) {
        sidebar.style.zIndex = '10000';
        
        // Fix sidebar position and backdrop
        const backdrop = document.querySelector('.navbar-sidebar__backdrop');
        if (backdrop) {
          backdrop.style.zIndex = '9999';
          backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          backdrop.style.position = 'fixed';
          backdrop.style.inset = '0';
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
        collapseButton.style.zIndex = '10001'; // Higher than sidebar
        collapseButton.style.position = 'fixed';
        collapseButton.style.top = '1rem';
        collapseButton.style.right = '1rem';
        collapseButton.style.width = '40px';
        collapseButton.style.height = '40px';
        collapseButton.style.borderRadius = '50%';
        collapseButton.style.backgroundColor = 'var(--ifm-color-primary)';
        collapseButton.style.color = 'white';
        collapseButton.style.border = 'none';
        collapseButton.style.display = 'flex';
        collapseButton.style.justifyContent = 'center';
        collapseButton.style.alignItems = 'center';
        collapseButton.style.fontSize = '24px';
        collapseButton.style.cursor = 'pointer';
        collapseButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        collapseButton.style.display = 'none';
        
        collapseButton.addEventListener('click', () => {
          // Close navbar sidebar if open
          const closeButton = document.querySelector('.navbar-sidebar__close');
          if (closeButton && sidebar && sidebar.classList.contains('shown')) {
            closeButton.click();
          }
          
          // Close doc sidebar if open
          const docSidebar = document.querySelector('.theme-doc-sidebar-container');
          if (docSidebar && docSidebar.classList.contains('menu--show')) {
            docSidebar.classList.remove('menu--show');
            const overlay = document.querySelector('.overlay-container');
            if (overlay) overlay.style.display = 'none';
          }
          
          collapseButton.style.display = 'none';
        });
        
        body.appendChild(collapseButton);
      }
      
      // Event listener for sidebar toggle
      if (sidebarToggle) {
        // Remove existing listener to prevent duplicates
        const newToggle = sidebarToggle.cloneNode(true);
        if (sidebarToggle.parentNode) {
          sidebarToggle.parentNode.replaceChild(newToggle, sidebarToggle);
        }
        
        newToggle.addEventListener('click', () => {
          forceSidebarAboveContent(); // Ensure z-index is correct
          
          setTimeout(() => {
            if (sidebar && sidebar.classList.contains('shown')) {
              body.classList.add('menu-opened');
              document.documentElement.style.overflow = 'hidden'; // Prevent background scrolling
              if (collapseButton) collapseButton.style.display = 'flex';
            } else {
              body.classList.remove('menu-opened');
              document.documentElement.style.overflow = ''; // Restore scrolling
              if (collapseButton) collapseButton.style.display = 'none';
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