import React, {useState} from 'react';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';
import Layout from '@theme/Layout';
import BackToTopButton from '@theme/BackToTopButton';
import DocPageLayoutSidebar from '@theme/DocPage/Layout/Sidebar';
import DocPageLayoutMain from '@theme/DocPage/Layout/Main';
import styles from './styles.module.css';

export default function DocPageLayout({children}) {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  
  // Don't enforce any CSS class to push content based on sidebar width
  // Our JavaScript sidebar fix will handle the layout

  return (
    <Layout wrapperClassName="doc-page">
      <BackToTopButton />
      <div className={styles.docPage}>
        {sidebar && (
          <DocPageLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocPageLayoutMain>{children}</DocPageLayoutMain>
      </div>
    </Layout>
  );
} 