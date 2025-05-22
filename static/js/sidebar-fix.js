// Optimized Sidebar Fix - v2.0.0
(function() {
  // Run once DOM is loaded
  function initSidebar() {
    // Create overlay for mobile sidebar
    let overlay = document.querySelector('.overlay-container');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'overlay-container';
      document.body.appendChild(overlay);
      
      // Close sidebar when clicking overlay
      overlay.addEventListener('click', function() {
        const sidebar = document.querySelector('.theme-doc-sidebar-container');
        if (sidebar) {
          sidebar.classList.remove('menu--show');
          document.body.removeAttribute('data-sidebar-shown');
        }
      });
    }
    
    // Handle navbar toggle button click
    const toggleButtons = document.querySelectorAll('.navbar__toggle, .navbar-sidebar__close');
    toggleButtons.forEach(btn => {
      // Remove existing listeners to avoid duplicates
      const newBtn = btn.cloneNode(true);
      if (btn.parentNode) {
        btn.parentNode.replaceChild(newBtn, btn);
      }
      
      // Add fresh click listener
      newBtn.addEventListener('click', function() {
        const sidebar = document.querySelector('.theme-doc-sidebar-container');
        if (sidebar) {
          sidebar.classList.toggle('menu--show');
          if (sidebar.classList.contains('menu--show')) {
            document.body.setAttribute('data-sidebar-shown', 'true');
          } else {
            document.body.removeAttribute('data-sidebar-shown');
          }
        }
      });
    });
    
    // Handle ESC key to close mobile sidebar
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const sidebar = document.querySelector('.theme-doc-sidebar-container');
        if (sidebar && sidebar.classList.contains('menu--show')) {
          sidebar.classList.remove('menu--show');
          document.body.removeAttribute('data-sidebar-shown');
        }
      }
    });
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
  } else {
    initSidebar();
  }
  
  // Also run on navigation in single-page app
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        initSidebar();
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
})(); 