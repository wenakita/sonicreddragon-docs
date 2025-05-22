import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';

export default function DocPageLayoutMain({children}) {
  const sidebar = useDocsSidebar();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fixMainContent = () => {
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

      // Run immediately and on resize
      fixMainContent();
      window.addEventListener('resize', fixMainContent);

      // Set an interval to make sure styles stay applied
      const intervalId = setInterval(fixMainContent, 1000);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener('resize', fixMainContent);
      };
    }
  }, []);

  return (
    <main
      className={clsx(styles.docMainContainer, 'doc-main-container', {
        [styles.docMainContainerEnhanced]: sidebar,
      })}>
      <div
        className={clsx(
          'container',
          'padding-top--md',
          'padding-bottom--lg',
          styles.docItemWrapper,
          {
            [styles.docItemWrapperEnhanced]: sidebar,
          },
        )}>
        {children}
      </div>
    </main>
  );
} 