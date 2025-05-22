import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import { useLocation } from '@docusaurus/router';

import styles from './styles.module.css';

// Import the original sidebar to reuse its content
import OriginalSidebar from '@theme-original/DocPage/Layout/Sidebar';

export default function Sidebar(props) {
  const sidebar = useDocsSidebar();
  const location = useLocation();
  const [sidebarShown, setSidebarShown] = useState(false);

  // Effect to fix sidebar positioning programmatically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fixSidebar = () => {
        const sidebarEl = document.querySelector('.theme-doc-sidebar-container');
        if (!sidebarEl) return;

        // Always set these core styles
        sidebarEl.style.position = 'fixed';
        sidebarEl.style.top = 'var(--ifm-navbar-height)';
        sidebarEl.style.left = '0';
        sidebarEl.style.bottom = '0';
        sidebarEl.style.width = '250px';
        sidebarEl.style.maxWidth = '250px';
        sidebarEl.style.zIndex = '200';
        sidebarEl.style.background = 'var(--ifm-background-surface-color)';
        sidebarEl.style.borderRight = '1px solid var(--ifm-toc-border-color)';
        sidebarEl.style.overflowY = 'auto';
        sidebarEl.style.overflowX = 'hidden';
        sidebarEl.style.height = 'calc(100vh - var(--ifm-navbar-height))';
        sidebarEl.style.padding = '0';
        sidebarEl.style.margin = '0';

        // Mobile styles
        if (window.innerWidth <= 996) {
          if (sidebarShown) {
            sidebarEl.style.transform = 'translateX(0)';
          } else {
            sidebarEl.style.transform = 'translateX(-100%)';
          }
        } else {
          // Desktop styles - always show
          sidebarEl.style.transform = 'none';
        }

        // Fix main content positioning
        const mainContent = document.querySelector('[class*="docMainContainer"]');
        if (mainContent) {
          if (window.innerWidth > 996) {
            mainContent.style.marginLeft = '250px';
            mainContent.style.width = 'calc(100% - 250px)';
            mainContent.style.maxWidth = 'calc(100% - 250px)';
          } else {
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
            mainContent.style.maxWidth = '100%';
          }
        }
      };

      // Run fix immediately and on resize
      fixSidebar();
      window.addEventListener('resize', fixSidebar);

      // Setup mobile menu toggle handler
      const toggleBtns = document.querySelectorAll('.navbar__toggle, .navbar-sidebar__close');
      const toggleHandler = () => {
        setSidebarShown(prev => !prev);
        setTimeout(fixSidebar, 10);
      };

      toggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleHandler);
      });

      // Create an overlay for mobile
      let overlay = document.querySelector('.sidebar-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.background = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '199';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
          setSidebarShown(false);
          overlay.style.display = 'none';
          fixSidebar();
        });
      }

      // Update overlay visibility based on sidebar state
      if (window.innerWidth <= 996) {
        overlay.style.display = sidebarShown ? 'block' : 'none';
      } else {
        overlay.style.display = 'none';
      }

      // Continuous fix to ensure it stays applied
      const intervalId = setInterval(fixSidebar, 1000);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener('resize', fixSidebar);
        toggleBtns.forEach(btn => {
          btn.removeEventListener('click', toggleHandler);
        });
      };
    }
  }, [sidebarShown]);

  // Create a wrapper around the original sidebar to apply our fixes
  return (
    <div className={clsx('custom-sidebar-container', styles.customSidebar)}>
      <OriginalSidebar {...props} />
    </div>
  );
} 