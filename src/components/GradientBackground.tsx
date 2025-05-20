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
      duration: 30000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
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
        opacity: 0.6,
        background: 'linear-gradient(135deg, #0f1c36 0%, #1a3161 40%, #cc5a2b 100%)',
        backgroundSize: '200% 200%',
        transition: 'background-position 1s',
      }}
    />
  );
};

export default GradientBackground; 