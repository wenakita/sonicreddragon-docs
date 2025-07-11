import React, { useEffect, useRef } from 'react';
import { anime, useAnimationPerformance } from '../utils/animationUtils';
import styles from './styles.module.css';

export default function VotingDecayAnimation() {
  const animationRef = useRef(null);
  
  useEffect(() => {
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 2000,
      loop: true,
      autoplay: true,
    });
    
    // Initial state - full voting power
    timeline.add({
      targets: '.voting-power-bar',
      width: '100%',
      backgroundColor: '#4CAF50',
      duration: 500,
    });
    
    // Time passes, power decays
    timeline.add({
      targets: '.voting-power-bar',
      width: '75%',
      backgroundColor: '#8BC34A',
      duration: 1000,
    });
    
    // More time passes, more decay
    timeline.add({
      targets: '.voting-power-bar',
      width: '50%',
      backgroundColor: '#FFC107',
      duration: 1000,
    });
    
    // Near expiration
    timeline.add({
      targets: '.voting-power-bar',
      width: '25%',
      backgroundColor: '#FF5722',
      duration: 1000,
    });
    
    // Expired
    timeline.add({
      targets: '.voting-power-bar',
      width: '5%',
      backgroundColor: '#F44336',
      duration: 500,
    });
    
    return () => {
      timeline.pause();
    };
  }, []);
  
  return (
    <div className={styles.animationContainer} ref={animationRef}>
      <h3 className={styles.animationTitle}>Voting Power Time Decay</h3>
      <p className={styles.animationDescription}>
        Visualizing how voting power decreases linearly as time passes and lock expiration approaches
      </p>
      
      <div className={styles.votingPowerContainer}>
        <div className={styles.timelineLabels}>
          <span>Lock Start</span>
          <span>Lock End</span>
        </div>
        <div className={styles.votingPowerTrack}>
          <div className="voting-power-bar"></div>
        </div>
        <div className={styles.timelineLabels}>
          <span>100% Power</span>
          <span>0% Power</span>
        </div>
      </div>
    </div>
  );
} 