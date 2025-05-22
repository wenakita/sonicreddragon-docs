import React from 'react';
import clsx from 'clsx';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';

export default function DocPageLayoutMain({children}) {
  const sidebar = useDocsSidebar();

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