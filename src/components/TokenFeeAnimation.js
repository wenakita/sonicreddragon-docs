import React, { useEffect, useRef } from 'react';
import { anime, useAnimationPerformance } from '../utils/animationUtils';
import styles from './styles.module.css';

export default function TokenFeeAnimation() {
  const animationRef = useRef(null);
  
  useEffect(() => {
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 3000,
      loop: true,
      autoplay: true,
    });
    
    // Step 1: Initialization - Token swap happens
    timeline.add({
      targets: '.token-swap',
      scale: [0, 1],
      opacity: [0, 1],
      duration: 500,
    });
    
    // Step 2: Fee collection
    timeline.add({
      targets: '.fee-collection-arrow',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 700,
    });
    
    // Step 3: Fee distribution starts
    timeline.add({
      targets: '.fee-pool',
      scale: [1, 1.1],
      backgroundColor: '#4CAF50',
      duration: 500,
    });
    
    // Step 4: Fee distribution to jackpot
    timeline.add({
      targets: '.jackpot-arrow',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 700,
    });
    
    // Step 5: Jackpot receives fees
    timeline.add({
      targets: '.jackpot-node',
      scale: [1, 1.1],
      backgroundColor: '#F9A825',
      duration: 500,
    });
    
    // Step 6: Fee distribution to ve69LP
    timeline.add({
      targets: '.ve69lp-arrow',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 700,
    });
    
    // Step 7: ve69LP receives fees
    timeline.add({
      targets: '.ve69lp-node',
      scale: [1, 1.1],
      backgroundColor: '#5C6BC0',
      duration: 500,
    });
    
    // Step 8: Burn fees
    timeline.add({
      targets: '.burn-arrow',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 700,
    });
    
    // Step 9: Burn happens
    timeline.add({
      targets: '.burn-node',
      scale: [1, 1.2],
      backgroundColor: '#F44336',
      opacity: [1, 0.7],
      duration: 800,
    });
    
    // Step 10: Reset for next loop
    timeline.add({
      targets: ['.token-swap', '.jackpot-node', '.ve69lp-node', '.burn-node', '.fee-pool'],
      scale: [null, 1],
      backgroundColor: function(el) {
        if (el.classList.contains('jackpot-node')) return '#E19A00';
        if (el.classList.contains('ve69lp-node')) return '#3F51B5';
        if (el.classList.contains('burn-node')) return '#D32F2F';
        if (el.classList.contains('fee-pool')) return '#388E3C';
        return '#333';
      },
      opacity: 1,
      duration: 500,
      delay: 800,
    });
    
    // Reset all arrows
    timeline.add({
      targets: ['.fee-collection-arrow', '.jackpot-arrow', '.ve69lp-arrow', '.burn-arrow'],
      opacity: 0,
      duration: 100,
    });
    
    timeline.add({
      targets: ['.fee-collection-arrow', '.jackpot-arrow', '.ve69lp-arrow', '.burn-arrow'],
      strokeDashoffset: anime.setDashoffset,
      opacity: 1,
      duration: 1,
    });
    
    return () => {
      timeline.pause();
    };
  }, []);
  
  return (
    <div className={styles.animationContainer} ref={animationRef}>
      <h3 className={styles.animationTitle}>Token Fee Distribution Flow</h3>
      <p className={styles.animationDescription}>
        Visualizing how fees are collected and distributed in the OmniDragon ecosystem
      </p>
      
      <div className={styles.feeSystemContainer}>
        <div className={`${styles.tokenSwapNode} token-swap`}>
          <div className={styles.nodeLabel}>Token Swap</div>
          <div className={styles.percentTag}>10% Fee</div>
        </div>
        
        <svg className={styles.arrowSvg} width="100%" height="60">
          <path 
            className="fee-collection-arrow" 
            d="M150,30 L250,30" 
            fill="none" 
            stroke="#388E3C" 
            strokeWidth="3"
          />
          <polygon points="250,25 260,30 250,35" fill="#388E3C" />
        </svg>
        
        <div className={`${styles.feePoolNode} fee-pool`}>
          <div className={styles.nodeLabel}>Fee Pool</div>
        </div>
        
        <div className={styles.feeDistributionContainer}>
          <svg className={styles.arrowSvg} width="100" height="80">
            <path 
              className="jackpot-arrow" 
              d="M50,1 L50,50" 
              fill="none" 
              stroke="#E19A00" 
              strokeWidth="3"
            />
            <polygon points="45,50 50,60 55,50" fill="#E19A00" />
          </svg>
          
          <svg className={styles.arrowSvg} width="100" height="80">
            <path 
              className="ve69lp-arrow" 
              d="M150,1 L150,50" 
              fill="none" 
              stroke="#3F51B5" 
              strokeWidth="3"
            />
            <polygon points="145,50 150,60 155,50" fill="#3F51B5" />
          </svg>
          
          <svg className={styles.arrowSvg} width="100" height="80">
            <path 
              className="burn-arrow" 
              d="M250,1 L250,50" 
              fill="none" 
              stroke="#D32F2F" 
              strokeWidth="3"
            />
            <polygon points="245,50 250,60 255,50" fill="#D32F2F" />
          </svg>
        </div>
        
        <div className={styles.feeDestinationsContainer}>
          <div className={`${styles.feeDestinationNode} jackpot-node`}>
            <div className={styles.nodeLabel}>Jackpot Vault</div>
            <div className={styles.percentTag}>6.9%</div>
          </div>
          
          <div className={`${styles.feeDestinationNode} ve69lp-node`}>
            <div className={styles.nodeLabel}>ve69LP</div>
            <div className={styles.percentTag}>2.41%</div>
          </div>
          
          <div className={`${styles.feeDestinationNode} burn-node`}>
            <div className={styles.nodeLabel}>Burn</div>
            <div className={styles.percentTag}>0.69%</div>
          </div>
        </div>
      </div>
    </div>
  );
} 