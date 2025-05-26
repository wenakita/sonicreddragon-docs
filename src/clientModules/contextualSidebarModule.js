import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  function filterSidebarItems() {
    const pathname = window.location.pathname;
    const sidebarElement = document.querySelector('.menu');
    
    if (!sidebarElement) return;
    
    // Define which sections should be visible for each path pattern
    const visibilityRules = {
      '/': ['Getting Started', 'System Overview'],
      '/intro': ['Getting Started', 'System Overview'],
      '/getting-started': ['Getting Started', 'System Overview'],
      '/comprehensive-system': ['System Overview'],
      '/concepts/': ['System Overview'],
      '/audit/': ['Security & Audit'],
      '/contracts/': ['Smart Contracts'],
      '/guides/': ['User Guides'],
      '/integrations/': ['Integrations'],
      '/technical-architecture/': ['Technical Architecture'],
      '/reference/': ['Reference'],
      '/052525updates/': ['Updates & Changes', 'Security & Audit', 'Deployment & Operations'],
    };
    
    // Find which rule applies to current path
    let visibleSections = ['Getting Started']; // Default
    for (const [pattern, sections] of Object.entries(visibilityRules)) {
      if (pathname.includes(pattern)) {
        visibleSections = sections;
        break;
      }
    }
    
    // Hide all category items first
    const allCategories = sidebarElement.querySelectorAll('.menu__list-item--collapsed, .menu__list-item');
    allCategories.forEach(category => {
      const categoryTitle = category.querySelector('.menu__link--sublist')?.textContent?.trim();
      if (categoryTitle && !visibleSections.includes(categoryTitle)) {
        // Check if it's a top-level category
        const isTopLevel = category.parentElement?.classList.contains('menu__list');
        if (isTopLevel) {
          category.style.display = 'none';
        }
      } else if (categoryTitle && visibleSections.includes(categoryTitle)) {
        category.style.display = '';
      }
    });
    
    // Always show non-category items (like intro, getting-started)
    const nonCategoryItems = sidebarElement.querySelectorAll('.menu__list > .menu__list-item:not(.menu__list-item--collapsed)');
    nonCategoryItems.forEach(item => {
      const hasSublist = item.querySelector('.menu__link--sublist');
      if (!hasSublist) {
        item.style.display = '';
      }
    });
  }
  
  // Run on initial load
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(filterSidebarItems, 100);
  });
  
  // Run on navigation
  if (window.history && window.history.pushState) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(window.history, arguments);
      setTimeout(filterSidebarItems, 100);
    };
  }
  
  // Also observe DOM changes
  const observer = new MutationObserver(() => {
    filterSidebarItems();
  });
  
  window.addEventListener('DOMContentLoaded', () => {
    const sidebarContainer = document.querySelector('.menu');
    if (sidebarContainer) {
      observer.observe(sidebarContainer, {
        childList: true,
        subtree: true,
      });
    }
  });
} 