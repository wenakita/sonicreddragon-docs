import React, { useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

// This Root component wraps the entire Docusaurus application
export default function Root({ children }) {
  const isBrowser = useIsBrowser();
  
  useEffect(() => {
    if (isBrowser) {
      // EMERGENCY SIDEBAR FIX - Inject CSS directly
      const fixSidebarStyle = document.createElement('style');
      fixSidebarStyle.id = 'emergency-sidebar-fix';
      fixSidebarStyle.innerHTML = `
        /* CRITICAL SIDEBAR FIX - OVERRIDES ALL DOCUSAURUS STYLES */
        
        /* Force root variables */
        :root {
          --sidebar-width: 260px !important;
        }
        
        /* Fix vertical text issues */
        * {
          writing-mode: horizontal-tb !important;
          text-orientation: mixed !important;
        }
        
        /* Set all positioning to be consistent */
        html, body {
          overflow-x: hidden !important;
        }
        
        /* FIXED SIDEBAR - bypassing Docusaurus flex layout */
        .theme-doc-sidebar-container {
          position: fixed !important;
          top: var(--ifm-navbar-height) !important;
          left: 0 !important;
          bottom: 0 !important;
          width: var(--sidebar-width) !important;
          max-width: var(--sidebar-width) !important;
          min-width: var(--sidebar-width) !important;
          background-color: var(--ifm-background-surface-color) !important;
          border-right: 1px solid var(--ifm-toc-border-color) !important;
          overflow-y: auto !important;
          z-index: 200 !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          transition: transform 0.3s ease !important;
        }
        
        /* Main content positioning - move it beside the sidebar */
        .docMainContainer_node_modules-\\@docusaurus-theme-classic-lib-theme-DocPage-Layout-Main-styles-module,
        .docMainContainer_src-theme-DocPage-Layout-Main-styles-module,
        .docMainContainer_gTbr,
        .docMainContainer_N2Fh,
        [class*="docMainContainer"] {
          margin-left: var(--sidebar-width) !important;
          width: calc(100% - var(--sidebar-width)) !important;
          max-width: calc(100% - var(--sidebar-width)) !important;
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
        
        /* Fix doc page wrapper */
        .docPage_node_modules-\\@docusaurus-theme-classic-lib-theme-DocPage-Layout-styles-module,
        .docPage_src-theme-DocPage-Layout-styles-module,
        .docPage_WvG3,
        [class*="docPage"] {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* Mobile fix */
        @media (max-width: 996px) {
          .theme-doc-sidebar-container {
            transform: translateX(-100%) !important;
            z-index: 1000 !important;
            width: 85% !important;
            max-width: 300px !important;
          }
          
          .theme-doc-sidebar-container.menu--show {
            transform: translateX(0) !important;
          }
          
          .docMainContainer_node_modules-\\@docusaurus-theme-classic-lib-theme-DocPage-Layout-Main-styles-module,
          .docMainContainer_src-theme-DocPage-Layout-Main-styles-module,
          .docMainContainer_gTbr,
          .docMainContainer_N2Fh,
          [class*="docMainContainer"] {
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `;
      document.head.appendChild(fixSidebarStyle);
      
      // EMERGENCY JS FIX - Direct DOM manipulation
      const fixSidebar = () => {
        // Get sidebar element
        const sidebar = document.querySelector('.theme-doc-sidebar-container');
        if (sidebar) {
          if (window.innerWidth > 996) {
            // Desktop
            sidebar.style.position = 'fixed';
            sidebar.style.top = 'var(--ifm-navbar-height)';
            sidebar.style.left = '0';
            sidebar.style.width = '260px';
            sidebar.style.height = 'calc(100vh - var(--ifm-navbar-height))';
            sidebar.style.transform = 'none';
          } else {
            // Mobile - hide by default
            sidebar.style.position = 'fixed';
            sidebar.style.width = '85%';
            sidebar.style.maxWidth = '300px';
            if (!sidebar.classList.contains('menu--show')) {
              sidebar.style.transform = 'translateX(-100%)';
            } else {
              sidebar.style.transform = 'translateX(0)';
            }
          }
        }
        
        // Fix main content positioning
        const mainContainers = document.querySelectorAll('[class*="docMainContainer"]');
        mainContainers.forEach(container => {
          if (window.innerWidth > 996) {
            container.style.marginLeft = '260px';
            container.style.width = 'calc(100% - 260px)';
          } else {
            container.style.marginLeft = '0';
            container.style.width = '100%';
          }
        });
      };
      
      // Run immediately
      fixSidebar();
      
      // Run on resize
      window.addEventListener('resize', fixSidebar);
      
      // Run periodically to ensure the fix stays applied
      const intervalId = setInterval(fixSidebar, 500);
      
      // Mermaid theme observer
      const themeObserver = new MutationObserver((mutations) => {
        // When theme changes, find all mermaid diagrams and reinitialize them
        const mermaidDiagrams = document.querySelectorAll('.mermaid');
        if (mermaidDiagrams.length > 0 && window.mermaid) {
          try {
            // Get the current theme
            const isDarkTheme = document.documentElement.dataset.theme === 'dark';
            
            // Apply current theme
            window.mermaid.initialize({
              theme: isDarkTheme ? 'dark' : 'default',
              themeVariables: { 
                darkMode: isDarkTheme 
              }
            });
            
            // Reinitialize diagrams
            window.mermaid.init(undefined, mermaidDiagrams);
          } catch (error) {
            console.error('Error reinitializing mermaid diagrams:', error);
          }
        }
        
        // Also reapply our sidebar fix when theme changes
        fixSidebar();
      });
      
      // Observe theme changes by watching data-theme attribute
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      
      // Cleanup
      return () => {
        themeObserver.disconnect();
        window.removeEventListener('resize', fixSidebar);
        clearInterval(intervalId);
      };
    }
  }, [isBrowser]);

  return <>{children}</>;
} 