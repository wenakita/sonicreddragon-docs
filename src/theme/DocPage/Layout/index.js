import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';
import Layout from '@theme/Layout';
import BackToTopButton from '@theme/BackToTopButton';
import DocPageLayoutSidebar from '@theme/DocPage/Layout/Sidebar';
import DocPageLayoutMain from '@theme/DocPage/Layout/Main';
import styles from './styles.module.css';

export default function DocPageLayout({children}) {
  const sidebar = useDocsSidebar();
  const [sidebarShown, setSidebarShown] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Apply body class based on sidebar state for mobile view
      const body = document.querySelector('body');
      if (sidebarShown) {
        body.classList.add('sidebar-shown');
      } else {
        body.classList.remove('sidebar-shown');
      }

      // Setup mobile menu toggle handler
      const toggleBtns = document.querySelectorAll('.navbar__toggle, .navbar-sidebar__close');
      const toggleHandler = () => {
        setSidebarShown(prev => !prev);
      };

      toggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleHandler);
      });

      return () => {
        toggleBtns.forEach(btn => {
          btn.removeEventListener('click', toggleHandler);
        });
      };
    }
  }, [sidebarShown]);

  return (
    <Layout wrapperClassName={clsx(styles.docsWrapper, 'docs-wrapper')}>
      <BackToTopButton />
      <div className={clsx(styles.docPage, 'doc-page')}>
        {sidebar && (
          <DocPageLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={!sidebar}
            onHiddenSidebarContainer={() => setSidebarShown(false)}
          />
        )}
        <DocPageLayoutMain>{children}</DocPageLayoutMain>
      </div>
    </Layout>
  );
} 