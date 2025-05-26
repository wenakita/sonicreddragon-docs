import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import { useLocation } from '@docusaurus/router';
import CustomSidebar from '../../components/CustomSidebar';

interface Props {
  children: React.ReactNode;
  wrapperClassName?: string;
}

export default function Layout({ children, wrapperClassName }: Props): React.ReactElement {
  const location = useLocation();
  
  // Only show custom sidebar on docs pages
  const isDocsPage = location.pathname.startsWith('/') && 
                     !location.pathname.startsWith('/blog') &&
                     location.pathname !== '/';

  if (isDocsPage) {
    return (
      <OriginalLayout wrapperClassName={wrapperClassName}>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--ifm-navbar-height, 60px) - var(--docusaurus-announcement-bar-height, 0px))' }}>
          <CustomSidebar />
          <div 
            style={{
              marginLeft: '250px',
              width: 'calc(100% - 250px)',
              padding: '2rem',
              boxSizing: 'border-box',
              marginTop: 'calc(var(--docusaurus-announcement-bar-height, 0px))',
            }}
          >
            {children}
          </div>
        </div>
      </OriginalLayout>
    );
  }

  // For non-docs pages, use the original layout
  return (
    <OriginalLayout wrapperClassName={wrapperClassName}>
      {children}
    </OriginalLayout>
  );
} 