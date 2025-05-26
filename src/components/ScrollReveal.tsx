import React, { useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import { useAnimation as useGlobalAnimation } from './AnimationProvider';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

const getVariants = (direction: string, distance: number) => {
  const variants = {
    hidden: {},
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  switch (direction) {
    case 'up':
      variants.hidden = { opacity: 0, y: distance };
      variants.visible = { ...variants.visible, y: 0 };
      break;
    case 'down':
      variants.hidden = { opacity: 0, y: -distance };
      variants.visible = { ...variants.visible, y: 0 };
      break;
    case 'left':
      variants.hidden = { opacity: 0, x: distance };
      variants.visible = { ...variants.visible, x: 0 };
      break;
    case 'right':
      variants.hidden = { opacity: 0, x: -distance };
      variants.visible = { ...variants.visible, x: 0 };
      break;
    case 'scale':
      variants.hidden = { opacity: 0, scale: 0.8 };
      variants.visible = { ...variants.visible, scale: 1 };
      break;
    case 'fade':
    default:
      variants.hidden = { opacity: 0 };
      break;
  }

  return variants;
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  threshold = 0.1,
  triggerOnce = true,
  className = ''
}: ScrollRevealProps) {
  const controls = useAnimation();
  const { prefersReducedMotion } = useGlobalAnimation();
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  const variants = getVariants(direction, distance);

  useEffect(() => {
    if (prefersReducedMotion) {
      controls.set('visible');
      return;
    }

    if (inView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [controls, inView, triggerOnce, prefersReducedMotion]);

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      animate={controls}
      variants={variants}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 