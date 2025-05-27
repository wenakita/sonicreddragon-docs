import React, { useEffect } from 'react';
import DocRoot from '@theme-original/DocRoot';
import { useLocation } from '@docusaurus/router';

export default function DocRootWrapper(props) {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on the intro page
    const isIntroPage = location.pathname === '/' || location.pathname === '/intro';
    const article = document.querySelector('article');
    
    if (article) {
      if (isIntroPage) {
        article.classList.add('intro-page');
      } else {
        article.classList.remove('intro-page');
      }
    }
  }, [location.pathname]);

  return <DocRoot {...props} />;
} 