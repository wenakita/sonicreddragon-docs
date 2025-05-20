import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import styles from './styles.module.css';

export default function PartnerBoostAnimation() {
  const animationRef = useRef(null);
  
  useEffect(() => {
    // Set up the animation for the partner boost visualization
    const timeline = anime.timeline({
      easing: 'easeOutElastic(1, .8)',
      loop: true,
      autoplay: true,
    });
    
    // Initial state - equal voting
    timeline.add({
      targets: '.boost-fill',
      width: function(el, i) {
        return [0, '20%']; // All partners start with 20%
      },
      duration: 1000,
      delay: anime.stagger(100),
    });
    
    // Voting power shifts
    timeline.add({
      targets: '.boost-fill',
      width: function(el, i) {
        // Each partner gets different percentage
        const percentages = ['45%', '30%', '15%', '8%', '2%'];
        return percentages[i % percentages.length];
      },
      backgroundColor: function(el, i) {
        const colors = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#FF5722'];
        return colors[i % colors.length];
      },
      duration: 2000,
      delay: anime.stagger(150),
    });
    
    // Reset for next animation cycle
    timeline.add({
      targets: '.boost-fill',
      width: '20%',
      backgroundColor: '#2196F3',
      duration: 1000,
      delay: anime.stagger(50, {direction: 'reverse'}),
    });
    
    return () => {
      timeline.pause();
    };
  }, []);
  
  return (
    <div className={styles.animationContainer} ref={animationRef}>
      <h3 className={styles.animationTitle}>Partner Probability Boost Distribution</h3>
      <p className={styles.animationDescription}>
        Showing how the 6.9% probability boost is distributed among partners based on votes
      </p>
      
      <div className={styles.partnerBoostContainer}>
        {['Partner A', 'Partner B', 'Partner C', 'Partner D', 'Partner E'].map((name, index) => (
          <div key={index} className={styles.partner}>
            <div className={styles.partnerName}>{name}</div>
            <div className={styles.boostTrack}>
              <div className="boost-fill"></div>
            </div>
            <div className={styles.percentage}>0%</div>
          </div>
        ))}
        
        <div className={styles.totalAllocation}>
          <div className={styles.totalLabel}>Total Allocation: 6.9%</div>
          <div className={styles.totalBar}></div>
        </div>
      </div>
    </div>
  );
} 