import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import styles from './styles.module.css';

export default function CubeRootAnimation() {
  const animationRef = useRef(null);
  const timelineRef = useRef(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Create animation only when component is mounted
    let isComponentMounted = true;

    try {
      if (!animationRef.current) return;

      // Store timeline in ref for cleanup
      timelineRef.current = anime.timeline({
        easing: 'easeOutQuad',
        loop: true,
        autoplay: true,
      });
      
      // Step 1: Show initial cube
      timelineRef.current.add({
        targets: animationRef.current.querySelector('.input-cube'),
        scale: [0, 1],
        opacity: [0, 1],
        duration: 800,
      });
      
      // Step 2: Show label for the initial value
      timelineRef.current.add({
        targets: animationRef.current.querySelector('.input-value'),
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 400,
      });
      
      // Step 3: Show the processing animation
      timelineRef.current.add({
        targets: animationRef.current.querySelector('.processing-steps'),
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: 200,
      });
      
      // Step 4: Split the cube into its cube root
      timelineRef.current.add({
        targets: animationRef.current.querySelector('.input-cube'),
        scale: 0.6,
        translateX: -100,
        duration: 800,
        delay: 400,
      });
      
      // Step 5: Show the result cube
      timelineRef.current.add({
        targets: animationRef.current.querySelector('.result-cube'),
        scale: [0, 1],
        opacity: [0, 1],
        translateX: [0, 100],
        duration: 800,
      });
      
      // Step 6: Show result value
      timelineRef.current.add({
        targets: animationRef.current.querySelector('.result-value'),
        opacity: [0, 1],
        duration: 400,
      });
      
      // Step 7: Pause at the end
      timelineRef.current.add({
        duration: 1500,
      });
      
      // Step 8: Reset animation
      timelineRef.current.add({
        targets: animationRef.current.querySelectorAll('.input-cube, .result-cube, .input-value, .result-value, .processing-steps'),
        opacity: 0,
        translateX: 0,
        translateY: 0,
        scale: 0,
        duration: 600,
      });
    } catch (err) {
      console.error("Animation setup error:", err);
      if (isComponentMounted) {
        setError("Failed to initialize animation");
      }
    }
    
    // Cleanup function to handle unmounting
    return () => {
      isComponentMounted = false;
      if (timelineRef.current) {
        timelineRef.current.pause();
        timelineRef.current = null;
      }
    };
  }, []);
  
  if (error) {
    return (
      <div className={styles.animationError}>
        <p>Unable to load animation: {error}</p>
        <p>Please refresh the page or try again later.</p>
      </div>
    );
  }
  
  return (
    <div className={styles.animationContainer} ref={animationRef}>
      <h3 className={styles.animationTitle}>Cube Root Calculation</h3>
      <p className={styles.animationDescription}>
        Visualizing how the cube root mathematical operation works
      </p>
      
      <div className={styles.calculationContainer}>
        <div className={styles.inputSide}>
          <div className="input-cube"></div>
          <div className="input-value">x³</div>
        </div>
        
        <div className="processing-steps">
          <div className={styles.arrowRight}></div>
          <div className={styles.processingText}>Cube Root Operation</div>
          <div className={styles.arrowRight}></div>
        </div>
        
        <div className={styles.resultSide}>
          <div className="result-cube"></div>
          <div className="result-value">x</div>
        </div>
      </div>
    </div>
  );
} 