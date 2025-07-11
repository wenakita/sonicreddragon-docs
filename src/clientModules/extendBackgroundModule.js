import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  /**
   * Extend Background Module
   * 
   * This module ensures the background extends to the full height of the content
   * and fixes any issues with the background not extending properly when scrolling.
   */
  
  export function onRouteUpdate() {
    // Get all the elements we need to modify
    const html = document.documentElement;
    const body = document.body;
    const docusaurusRoot = document.getElementById('__docusaurus');
    const mainWrapper = document.querySelector('.main-wrapper');
    const mainContent = document.querySelector('main');
    
    // Set min-height on all elements to ensure they extend properly
    html.style.minHeight = '100%';
    html.style.height = '100%';
    
    body.style.minHeight = '100%';
    body.style.height = '100%';
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    
    if (docusaurusRoot) {
      docusaurusRoot.style.flex = '1 0 auto';
      docusaurusRoot.style.minHeight = '100vh';
      docusaurusRoot.style.display = 'flex';
      docusaurusRoot.style.flexDirection = 'column';
      docusaurusRoot.style.backgroundAttachment = 'fixed';
      docusaurusRoot.style.backgroundSize = 'cover';
      docusaurusRoot.style.backgroundRepeat = 'no-repeat';
      
      // For dark mode, ensure the gradient is applied
      const isDarkMode = html.dataset.theme === 'dark';
      if (isDarkMode) {
        const style = getComputedStyle(html);
        
        // Apply background color to html and body
        html.style.backgroundColor = style.getPropertyValue('--ifm-background-color');
        body.style.backgroundColor = style.getPropertyValue('--ifm-background-color');
        
        // Apply gradient to docusaurus root
        const gradient = style.getPropertyValue('--immersive-bg-gradient');
        if (gradient) {
          docusaurusRoot.style.backgroundImage = gradient;
        }
      }
    }
    
    // Make sure the main wrapper extends properly
    if (mainWrapper) {
      mainWrapper.style.flex = '1 0 auto';
      mainWrapper.style.display = 'flex';
      mainWrapper.style.flexDirection = 'column';
      mainWrapper.style.background = 'transparent';
    }
    
    // Make sure the main content extends properly
    if (mainContent) {
      mainContent.style.flex = '1 0 auto';
    }
    
    // Make sure all content containers are transparent
    const containers = document.querySelectorAll('.container, .docMainContainer, .docSidebarContainer, .docItemContainer, article, .markdown');
    containers.forEach(container => {
      if (container instanceof HTMLElement) {
        container.style.background = 'transparent';
      }
    });
    
    // Add a resize event listener to ensure the background extends properly when the window is resized
    window.addEventListener('resize', () => {
      if (docusaurusRoot) {
        const contentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        
        docusaurusRoot.style.minHeight = `${contentHeight}px`;
      }
    });
    
    // Trigger a resize event to ensure the background extends properly
    window.dispatchEvent(new Event('resize'));
  }
  
}

// Export empty module for SSR
export default function() {};