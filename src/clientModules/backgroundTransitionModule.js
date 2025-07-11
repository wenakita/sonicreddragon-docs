import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  /**
   * Background Transition Module
   * 
   * This module ensures smooth transitions between pages while maintaining
   * a consistent background. It applies the background to the root Docusaurus
   * element and ensures it persists during page transitions.
   */
  
  export function onRouteUpdate() {
    // Apply transition class to main content
    const mainContent = document.querySelector('.main-wrapper');
    if (mainContent) {
      mainContent.classList.add('page-transition');
    }
  
    // Ensure the background is applied to the root element
    const docusaurusRoot = document.getElementById('__docusaurus');
    if (docusaurusRoot) {
      // Make sure the background properties are properly set
      docusaurusRoot.style.backgroundAttachment = 'fixed';
      docusaurusRoot.style.backgroundSize = 'cover';
      docusaurusRoot.style.backgroundRepeat = 'no-repeat';
      docusaurusRoot.style.minHeight = '100vh';
      docusaurusRoot.style.height = 'auto';
      
      // For dark mode, ensure the gradient is applied
      const isDarkMode = document.documentElement.dataset.theme === 'dark';
      if (isDarkMode) {
        const style = getComputedStyle(document.documentElement);
        const gradient = style.getPropertyValue('--immersive-bg-gradient');
        if (gradient) {
          docusaurusRoot.style.backgroundImage = gradient;
          
          // Also apply background color to html and body
          document.documentElement.style.backgroundColor = 'var(--ifm-background-color)';
          document.body.style.backgroundColor = 'var(--ifm-background-color)';
        }
      }
    }
  
    // Make sure all content containers are transparent
    const containers = document.querySelectorAll('.container, .docMainContainer, .docSidebarContainer, .docItemContainer');
    containers.forEach(container => {
      container.style.background = 'transparent';
    });
  
    // Ensure content areas don't break the background
    const contentAreas = document.querySelectorAll('article, .markdown');
    contentAreas.forEach(area => {
      area.style.background = 'transparent';
    });
  }
  
}

// Export empty module for SSR
export default function() {};