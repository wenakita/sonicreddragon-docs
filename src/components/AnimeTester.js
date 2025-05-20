import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js'; // Use explicit ES module import
import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';

/**
 * Simple component to test anime.js animations
 */
export default function AnimeTester() {
  const containerRef = useRef(null);
  const isBrowser = useIsBrowser();
  
  useEffect(() => {
    // Only run in browser
    if (!isBrowser || !containerRef.current) return;
    
    // Simple animation that doesn't rely on other elements
    const animation = anime({
      targets: '.anime-test-box',
      translateX: 250,
      rotate: '1turn',
      backgroundColor: '#FFC107',
      duration: 2000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad',
      autoplay: true
    });
    
    return () => {
      // Clean up
      if (animation) animation.pause();
    };
  }, [isBrowser]);
  
  return (
    <div ref={containerRef} className={styles.animationContainer}>
      <h3 className={styles.animationTitle}>Anime.js Test</h3>
      <p className={styles.animationDescription}>
        This is a simple test to verify that anime.js is working correctly.
      </p>
      
      <div style={{padding: '50px', display: 'flex', justifyContent: 'center'}}>
        <div 
          className="anime-test-box"
          style={{
            width: '100px',
            height: '100px',
            background: '#3F51B5',
            borderRadius: '8px',
          }}
        ></div>
      </div>
      
      <p style={{marginTop: '30px', textAlign: 'center', fontSize: '14px', color: 'var(--ifm-color-emphasis-600)'}}>
        You should see a blue square animating. If not, there's an issue with anime.js.
      </p>
    </div>
  );
} 