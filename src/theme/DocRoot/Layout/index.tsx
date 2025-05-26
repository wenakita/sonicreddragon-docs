import React from 'react';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import CustomSidebar from '../../../components/CustomSidebar';

interface Props {
  children: React.ReactNode;
}

export default function DocRootLayout({ children }: Props): React.ReactElement {
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = React.useState(false);

  return (
    <>
      <BackToTopButton />
      <div className="docs-root">
        {/* Use our custom sidebar instead of the default one */}
        <CustomSidebar />
        
        {/* Main content area */}
        <div 
          className="docs-main-container"
          style={{
            marginLeft: '250px',
            width: 'calc(100% - 250px)',
            minHeight: 'calc(100vh - var(--ifm-navbar-height, 60px))',
            paddingTop: '2rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          }}
        >
          <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
            {children}
          </DocRootLayoutMain>
        </div>
      </div>
    </>
  );
} 