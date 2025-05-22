/**
 * Client-side module to enhance the sidebar behavior
 */

export default {
  onRouteUpdate() {
    if (typeof window === 'undefined') return;
    
    // Function to enhance sidebar behavior
    function enhanceSidebar() {
      // Get relevant elements
      const sidebarToggle = document.querySelector('.navbar__toggle');
      const sidebar = document.querySelector('.navbar-sidebar');
      const body = document.body;
      
      // Create or update overlay for sidebar backdrop
      let overlay = document.querySelector('.overlay-container');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'overlay-container';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9000';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        
        // Add click handler to close sidebar when overlay is clicked
        overlay.addEventListener('click', function() {
          const docSidebar = document.querySelector('.theme-doc-sidebar-container');
          if (docSidebar && docSidebar.classList.contains('menu--show')) {
            docSidebar.classList.remove('menu--show');
            body.classList.remove('sidebar-open');
            overlay.style.display = 'none';
          }
          
          // Also close navbar sidebar if open
          const closeButton = document.querySelector('.navbar-sidebar__close');
          if (closeButton && sidebar && sidebar.classList.contains('shown')) {
            closeButton.click();
          }
        });
      }
      
      // Fix layout on load and resize
      function fixLayout() {
        // Desktop layout
        if (window.innerWidth > 996) {
          // Get all the main container elements by their various class names
          const mainContainers = document.querySelectorAll(
            '.docMainContainer, ' +
            '.docMainContainer_node_modules-\\@docusaurus-theme-classic-lib-theme-DocPage-Layout-Main-styles-module, ' +
            '.docMainContainer_src-theme-DocPage-Layout-Main-styles-module, ' +
            '.docMainContainer_gTbr, ' +
            '.docMainContainer_N2Fh'
          );
          
          // Get the sidebar element
          const docSidebar = document.querySelector('.theme-doc-sidebar-container');
          
          if (docSidebar) {
            // Set proper positioning for desktop
            docSidebar.style.position = 'sticky';
            docSidebar.style.top = 'var(--ifm-navbar-height)';
            docSidebar.style.height = 'calc(100vh - var(--ifm-navbar-height))';
            docSidebar.style.transform = 'none';
            docSidebar.style.width = 'var(--doc-sidebar-width, 240px)';
            
            // Apply correct styles to main container
            mainContainers.forEach(container => {
              if (container) {
                container.style.marginLeft = '0';
                container.style.width = 'auto';
                container.style.flex = '1 1 auto';
              }
            });
          }
        } 
        // Mobile layout
        else {
          const docSidebar = document.querySelector('.theme-doc-sidebar-container');
          
          if (docSidebar) {
            // Only fix position if sidebar is not currently shown
            if (!docSidebar.classList.contains('menu--show')) {
              docSidebar.style.position = 'fixed';
              docSidebar.style.transform = 'translateX(-100%)';
              docSidebar.style.width = 'var(--doc-sidebar-width, 240px)';
              docSidebar.style.maxWidth = '85%';
            }
          }
        }
      }
      
      // Apply fixes immediately
      fixLayout();
      
      // Handle sidebar toggle
      if (sidebarToggle) {
        // Replace existing listener to prevent duplicates
        const newToggle = sidebarToggle.cloneNode(true);
        if (sidebarToggle.parentNode) {
          sidebarToggle.parentNode.replaceChild(newToggle, sidebarToggle);
        }
        
        newToggle.addEventListener('click', () => {
          // Toggle doc sidebar
          const docSidebar = document.querySelector('.theme-doc-sidebar-container');
          
          if (docSidebar) {
            if (docSidebar.classList.contains('menu--show')) {
              // Hide sidebar
              docSidebar.classList.remove('menu--show');
              body.classList.remove('sidebar-open');
              overlay.style.display = 'none';
              body.style.overflow = '';
            } else {
              // Show sidebar
              docSidebar.classList.add('menu--show');
              body.classList.add('sidebar-open');
              overlay.style.display = 'block';
              body.style.overflow = 'hidden';
            }
          }
        });
      }
      
      // Handle window resize
      window.addEventListener('resize', fixLayout);
      
      // Fix for close buttons
      const closeButtons = document.querySelectorAll('.navbar-sidebar__close, .navbar-sidebar__backdrop');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const docSidebar = document.querySelector('.theme-doc-sidebar-container');
          if (docSidebar && docSidebar.classList.contains('menu--show')) {
            docSidebar.classList.remove('menu--show');
            overlay.style.display = 'none';
          }
          body.style.overflow = '';
        });
      });
    }
    
    // Run when the page is loaded
    setTimeout(enhanceSidebar, 200);
    
    // Clean up event listeners on route change
    return function cleanup() {
      window.removeEventListener('resize', () => {});
      document.body.classList.remove('sidebar-open');
      document.body.style.overflow = '';
    };
  }
}; 