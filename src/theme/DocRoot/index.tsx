import React, { useEffect } from 'react';
import DocRoot from '@theme-original/DocRoot';
import { useLocation } from '@docusaurus/router';

export default function DocRootWrapper(props) {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on the intro page - more comprehensive path checking
    const isIntroPage = location.pathname === '/' || 
                       location.pathname === '/intro' || 
                       location.pathname === '/intro/' ||
                       location.pathname.endsWith('/intro');
    
    const article = document.querySelector('article');
    
    // Debug logging
    console.log('DocRoot - Current path:', location.pathname);
    console.log('DocRoot - Is intro page:', isIntroPage);
    console.log('DocRoot - Article element:', !!article);
    
    if (article) {
      if (isIntroPage) {
        article.classList.add('intro-page');
        console.log('DocRoot - Added intro-page class');
      } else {
        article.classList.remove('intro-page');
        console.log('DocRoot - Removed intro-page class');
      }
    }
  }, [location.pathname]);

  return <DocRoot {...props} />;
} 