import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

const GradientBackground: React.FC = () => {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gradientRef.current) return;
    animate({
      targets: gradientRef.current,
      backgroundPosition: [
        '0% 50%',
        '100% 50%',
        '0% 50%'
      ],
      duration: 12000,
      direction: 'alternate',
      loop: true,
      easing: 'linear',
    }, {});
  }, []);

  return (
    <div
      id="gradient-animate"
      ref={gradientRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.7,
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 40%, #ff6e30 100%)',
        backgroundSize: '200% 200%',
        transition: 'background-position 1s',
      }}
    />
  );
};

export default GradientBackground; 