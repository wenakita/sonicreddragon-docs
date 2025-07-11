import React, { useEffect, useRef } from 'react';
import { anime, useAnimationPerformance } from '../utils/animationUtils';
import styles from './styles.module.css';
import useIsBrowser from '@docusaurus/useIsBrowser';

/**
 * AnimatedTriggerFlow - An interactive animation showing the OmniDragon trigger system
 * using anime.js for smooth animations
 */
export default function AnimatedTriggerFlow() {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const isBrowser = useIsBrowser();
  
  useEffect(() => {
    if (!isBrowser || !containerRef.current) return;
    
    // Give DOM time to fully render
    const timer = setTimeout(() => {
      // Clean up previous animation
      if (timelineRef.current) {
        timelineRef.current.pause();
      }
      
      // Initial setup - hide elements
      const nodes = containerRef.current.querySelectorAll('.trigger-node');
      const connections = containerRef.current.querySelectorAll('.trigger-connection');
      const eventIcons = containerRef.current.querySelectorAll('.event-icon');
      const tokenIcons = containerRef.current.querySelectorAll('.token-icon');
      
      console.log('Found elements:', { 
        nodes: nodes.length, 
        connections: connections.length,
        eventIcons: eventIcons.length,
        tokenIcons: tokenIcons.length
      });
      
      // Reset all elements
      anime.set(nodes, { opacity: 0, translateY: 20 });
      anime.set(connections, { opacity: 0 });
      anime.set(eventIcons, { opacity: 0, scale: 0 });
      anime.set(tokenIcons, { opacity: 0, translateX: -20 });
      
      // Create timeline
      timelineRef.current = anime.timeline({
        easing: 'easeOutExpo',
        duration: 800,
        autoplay: true
      });
      
      // Add animations to timeline
      timelineRef.current
        // Fade in nodes with staggered delay
        .add({
          targets: nodes,
          opacity: 1,
          translateY: 0,
          delay: anime.stagger(150),
          duration: 1000,
          easing: 'easeOutElastic(1, .8)'
        })
        
        // Reveal connections
        .add({
          targets: connections,
          opacity: 1,
          duration: 600,
          easing: 'easeInOutSine',
          delay: anime.stagger(200)
        }, '-=500')
        
        // Trigger swap event
        .add({
          targets: '.trigger-diagram-swap',
          boxShadow: [
            '0 0 0 rgba(74, 128, 209, 0)', 
            '0 0 20px rgba(74, 128, 209, 0.8)',
            '0 0 10px rgba(74, 128, 209, 0.3)'
          ],
          backgroundColor: [
            'rgba(74, 128, 209, 0.7)',
            'rgba(74, 128, 209, 1)',
            'rgba(74, 128, 209, 0.7)'
          ],
          duration: 1000,
          easing: 'easeOutCubic'
        }, '-=200')
        
        // Show event icon with pop effect
        .add({
          targets: eventIcons,
          opacity: 1,
          scale: [0, 1.2, 1],
          duration: 800,
          easing: 'easeOutElastic(1, .5)'
        }, '-=500')
        
        // Move tokens
        .add({
          targets: tokenIcons,
          opacity: 1,
          translateX: 0,
          delay: anime.stagger(300),
          duration: 800,
          easing: 'easeOutSine'
        }, '-=400')
        
        // Highlight winner selection
        .add({
          targets: '.trigger-diagram-jackpot',
          boxShadow: [
            '0 0 0 rgba(56, 142, 60, 0)',
            '0 0 20px rgba(56, 142, 60, 0.8)',
            '0 0 10px rgba(56, 142, 60, 0.3)'
          ],
          backgroundColor: [
            'rgba(56, 142, 60, 0.7)',
            'rgba(56, 142, 60, 1)',
            'rgba(56, 142, 60, 0.7)'
          ],
          duration: 1000,
          easing: 'easeOutCubic'
        }, '-=200')
        
        // Complete the cycle with a subtle final animation
        .add({
          targets: '.trigger-diagram-user-winner',
          backgroundColor: [
            'rgba(123, 31, 162, 0.7)',
            'rgba(123, 31, 162, 1)',
            'rgba(123, 31, 162, 0.7)'
          ],
          scale: [1, 1.05, 1],
          duration: 1000,
          easing: 'easeInOutSine'
        });
        
      // Setup repeating animations
      anime({
        targets: '.token-flow',
        translateY: [0, -5, 0],
        opacity: [0.5, 1, 0.5],
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
        duration: 2000,
        delay: anime.stagger(300)
      });
      
      // Add click handler to replay animation
      const replayButton = containerRef.current.querySelector('.replay-button');
      if (replayButton) {
        replayButton.addEventListener('click', () => {
          timelineRef.current.restart();
        });
      }
    }, 500); // Delay animation start to ensure DOM is ready
    
    // Clean up animation on unmount
    return () => {
      clearTimeout(timer);
      if (timelineRef.current) {
        timelineRef.current.pause();
      }
    };
  }, [isBrowser]);
  
  return (
    <div 
      ref={containerRef} 
      className={styles.animationContainer}
    >
      <h3 className={styles.animationTitle}>Interactive Swap-Based Trigger Flow</h3>
      <p className={styles.animationDescription}>
        Visualizing how the OmniDragon swap-based trigger system processes transactions 
        and determines lottery entries.
      </p>
      
      <div className="trigger-flow-diagram" style={{position: 'relative', height: '400px', margin: '0 auto', maxWidth: '800px'}}>
        {/* User Node */}
        <div 
          id="user-node" 
          className={`trigger-node ${styles.animatedNode} ${styles.nodeUser}`}
          style={{position: 'absolute', top: '10px', left: '20px'}}
        >
          User
        </div>
        
        {/* OmniDragon Token Node */}
        <div 
          id="token-node" 
          className={`trigger-node ${styles.animatedNode} ${styles.nodeContract}`}
          style={{position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)'}}
        >
          OmniDragon Token
        </div>
        
        {/* Swap Trigger Oracle Node */}
        <div 
          id="oracle-node" 
          className={`trigger-node trigger-diagram-swap ${styles.animatedNode} ${styles.nodeEvent}`}
          style={{position: 'absolute', top: '120px', left: '50%', transform: 'translateX(-50%)'}}
        >
          Swap Trigger Oracle
          <div className="event-icon" style={{position: 'absolute', top: '-10px', right: '-10px', background: '#ff9800', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 'bold'}}>
            !
          </div>
        </div>
        
        {/* Price Oracles Node */}
        <div 
          id="price-node" 
          className={`trigger-node ${styles.animatedNode} ${styles.nodeContract}`}
          style={{position: 'absolute', top: '120px', right: '20px'}}
        >
          Price Oracles
        </div>
        
        {/* Jackpot System Node */}
        <div 
          id="jackpot-node" 
          className={`trigger-node trigger-diagram-jackpot ${styles.animatedNode} ${styles.nodeProcess}`}
          style={{position: 'absolute', top: '230px', left: '50%', transform: 'translateX(-50%)'}}
        >
          Jackpot System
        </div>
        
        {/* Winner User Node */}
        <div 
          id="winner-node" 
          className={`trigger-node trigger-diagram-user-winner ${styles.animatedNode} ${styles.nodeUser}`}
          style={{position: 'absolute', top: '330px', left: '50%', transform: 'translateX(-50%)'}}
        >
          Winner Selection
        </div>
        
        {/* Connections using SVG */}
        <svg className="trigger-connections" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}>
          {/* User to Token */}
          <path 
            d="M90,40 C120,40 160,40 230,40" 
            className="trigger-connection" 
            stroke="var(--ifm-color-emphasis-500)" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)"
          />
          
          {/* Token to Oracle */}
          <path 
            d="M275,70 C275,80 275,90 275,110" 
            className="trigger-connection" 
            stroke="var(--ifm-color-emphasis-500)" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)"
          />
          
          {/* Oracle to Price Oracles */}
          <path 
            d="M335,140 C360,140 380,140 410,140" 
            className="trigger-connection" 
            stroke="var(--ifm-color-emphasis-500)" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)"
          />
          
          {/* Oracle to Jackpot */}
          <path 
            d="M275,180 C275,190 275,200 275,220" 
            className="trigger-connection" 
            stroke="var(--ifm-color-emphasis-500)" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)"
          />
          
          {/* Jackpot to Winner */}
          <path 
            d="M275,290 C275,300 275,310 275,320" 
            className="trigger-connection" 
            stroke="var(--ifm-color-emphasis-500)" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)"
          />
          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon 
                points="0 0, 10 3.5, 0 7" 
                fill="var(--ifm-color-emphasis-500)" 
              />
            </marker>
          </defs>
        </svg>
        
        {/* Animated tokens */}
        <div className="token-icon token-flow" style={{position: 'absolute', top: '60px', left: '170px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--ifm-color-primary)', zIndex: 5}}>
        </div>
        <div className="token-icon token-flow" style={{position: 'absolute', top: '170px', left: '250px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--ifm-color-primary)', zIndex: 5}}>
        </div>
        <div className="token-icon token-flow" style={{position: 'absolute', top: '280px', left: '290px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--ifm-color-primary)', zIndex: 5}}>
        </div>
      </div>
      
      <div style={{textAlign: 'center', marginTop: '2rem'}}>
        <button 
          className={`replay-button ${styles.animatedNode}`}
          style={{display: 'inline-block', cursor: 'pointer', border: 'none', background: 'var(--ifm-color-primary)', color: 'white', padding: '8px 16px'}}
        >
          Replay Animation
        </button>
      </div>
    </div>
  );
} 