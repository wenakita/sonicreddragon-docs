import React, { useEffect } from 'react';
import DefaultLayout from '@theme-original/Layout';
import GradientBackground from '../components/GradientBackground';

export default function Layout(props) {
  // Add emergency fix for sidebar on every page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Direct DOM manipulation for sidebar fix
      const emergencyFixSidebar = () => {
        // Fix sidebar positioning
        const sidebar = document.querySelector('.theme-doc-sidebar-container');
        if (sidebar) {
          sidebar.style.position = 'fixed';
          sidebar.style.top = 'var(--ifm-navbar-height)';
          sidebar.style.left = '0';
          sidebar.style.width = '260px';
          sidebar.style.maxWidth = '260px';
          sidebar.style.height = 'calc(100vh - var(--ifm-navbar-height))';
          sidebar.style.zIndex = '200';
          sidebar.style.overflow = 'auto';
          sidebar.style.borderRight = '1px solid var(--ifm-toc-border-color)';
          
          // Mobile sidebar
          if (window.innerWidth <= 996) {
            if (!sidebar.classList.contains('menu--show')) {
              sidebar.style.transform = 'translateX(-100%)';
            } else {
              sidebar.style.transform = 'translateX(0)';
            }
            sidebar.style.width = '85%';
            sidebar.style.maxWidth = '300px';
          } else {
            sidebar.style.transform = 'none';
          }
        }
        
        // Fix content position
        const mainContent = document.querySelector('[class*="docMainContainer"]');
        if (mainContent && window.innerWidth > 996) {
          mainContent.style.marginLeft = '260px';
          mainContent.style.width = 'calc(100% - 260px)';
          mainContent.style.maxWidth = 'calc(100% - 260px)';
        } else if (mainContent) {
          mainContent.style.marginLeft = '0';
          mainContent.style.width = '100%';
          mainContent.style.maxWidth = '100%';
        }
      };
      
      // Apply fix immediately and periodically
      emergencyFixSidebar();
      const intervalId = setInterval(emergencyFixSidebar, 1000);
      
      // Apply on resize
      window.addEventListener('resize', emergencyFixSidebar);
      
      return () => {
        clearInterval(intervalId);
        window.removeEventListener('resize', emergencyFixSidebar);
      };
    }
  }, []);
  
  return (
    <>
      <GradientBackground />
      <DefaultLayout {...props} />
    </>
  );
}
