import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  /**
   * Sidebar Enhancement Module
   * 
   * This module adds interactive features to the sidebar
   * such as smooth animations and hover effects.
   */
  
  export default function() {
    // Execute after the DOM is fully loaded
    if (typeof window !== 'undefined') {
      document.addEventListener('DOMContentLoaded', function() {
        // Add animation delay to menu items
        const menuItems = document.querySelectorAll('.menu__list-item');
        menuItems.forEach((item, index) => {
          item.style.setProperty('--ifm-menu-animation-index', index);
        });
  
        // Add hover effect to menu items
        menuItems.forEach(item => {
          item.addEventListener('mouseenter', () => {
            item.classList.add('menu__list-item--hover');
          });
          
          item.addEventListener('mouseleave', () => {
            item.classList.remove('menu__list-item--hover');
          });
        });
  
        // Add smooth transition when expanding/collapsing categories
        const categoryButtons = document.querySelectorAll('.menu__link--sublist');
        categoryButtons.forEach(button => {
          button.addEventListener('click', () => {
            // Add a class to the parent list item for animation
            const parentItem = button.closest('.menu__list-item');
            if (parentItem) {
              parentItem.classList.add('menu__list-item--animating');
              
              // Remove the class after animation completes
              setTimeout(() => {
                parentItem.classList.remove('menu__list-item--animating');
              }, 300);
            }
          });
        });
  
        // Add subtle pulse effect to active menu item
        const activeItems = document.querySelectorAll('.menu__link--active');
        activeItems.forEach(item => {
          item.classList.add('menu__link--pulse');
        });
      });
    }
  }
  
}

// Export empty module for SSR
export default function() {};