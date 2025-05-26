import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface AnimationContextType {
  isPageLoading: boolean;
  triggerPageTransition: () => void;
  prefersReducedMotion: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  isPageLoading: false,
  triggerPageTransition: () => {},
  prefersReducedMotion: false,
});

export const useAnimation = () => useContext(AnimationContext);

interface Props {
  children: React.ReactNode;
}

export default function AnimationProvider({ children }: Props) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const location = useLocation();
  const isBrowser = useIsBrowser();

  // Check for reduced motion preference
  useEffect(() => {
    if (!isBrowser) return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isBrowser]);

  // Handle page transitions
  useEffect(() => {
    if (!isBrowser) return;
    
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname, isBrowser]);

  const triggerPageTransition = () => {
    setIsPageLoading(true);
    setTimeout(() => setIsPageLoading(false), 300);
  };

  const contextValue: AnimationContextType = {
    isPageLoading,
    triggerPageTransition,
    prefersReducedMotion,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            ease: "easeInOut"
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </AnimationContext.Provider>
  );
} 