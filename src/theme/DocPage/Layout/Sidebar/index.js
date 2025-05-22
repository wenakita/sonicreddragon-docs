/**
 * Simplified sidebar component that lets our custom JS handle positioning
 */
import React from 'react';
import DocSidebar from '@theme/DocSidebar';
import {useLocation} from '@docusaurus/router';

export default function DocPageLayoutSidebar({sidebar, className}) {
  const {pathname} = useLocation();

  return (
    <aside className={className}>
      <DocSidebar 
        sidebar={sidebar}
        path={pathname}
        className="docs-doc-sidebar"
      />
    </aside>
  );
} 