import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

// Only execute in browser environment
if (ExecutionEnvironment.canUseDOM) {
  interface UltraHeroSectionProps {
    title: string;
    subtitle?: string;
    description?: string;
    primaryCta?: {
      label: string;
      href: string;
    };
    secondaryCta?: {
      label: string;
      href: string;
    };
  }
  
  const UltraHeroSection: React.FC<UltraHeroSectionProps> = ({
    title,
    subtitle,
    description,
    primaryCta,
    secondaryCta,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
  
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end start"],
    });
  
    // Parallax transforms
    const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  
    // Mouse parallax
    const backgroundX = useSpring(useTransform(mouseX, [0, 1], [-30, 30]), {
      stiffness: 75,
      damping: 20,
    });
    const backgroundY = useSpring(useTransform(mouseY, [0, 1], [-30, 30]), {
      stiffness: 75,
      damping: 20,
    });
  
    useEffect(() => {
      setIsLoaded(true);
  
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set(clientX / innerWidth);
        mouseY.set(clientY / innerHeight);
      };
  
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);
  
    return (
      <motion.section
        ref={containerRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#000000',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Ultra-modern background layers */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(255, 69, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(255, 23, 68, 0.1) 0%, transparent 50%)
          `,
        }}>
          {/* Animated mesh gradient */}
          <motion.div
            style={{
              position: 'absolute',
              inset: '-50%',
              background: 'radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%)',
              filter: 'blur(100px)',
              x: backgroundX,
              y: backgroundY,
            }}
          />
          
          {/* Noise texture overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            mixBlendMode: 'overlay',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }} />
        </div>
  
        {/* Animated grid pattern */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.05,
          }}
        >
          <defs>
            <pattern id="ultraGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <motion.path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke="#FF6B35" 
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </pattern>
          </defs>
          <motion.rect
            width="100%"
            height="100%"
            fill="url(#ultraGrid)"
            style={{ y, scale }}
          />
        </svg>
  
        {/* Floating 3D elements */}
        <div style={{ position: 'absolute', inset: 0, perspective: '2000px' }}>
          <AnimatePresence>
            {isLoaded && [...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: `${60 + i * 20}px`,
                  height: `${60 + i * 20}px`,
                  border: '1px solid',
                  borderColor: `rgba(255, 107, 53, ${0.2 - i * 0.02})`,
                  borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '0%' : '20%',
                  left: `${10 + (i * 12)}%`,
                  top: `${15 + (i * 10)}%`,
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  rotateX: -180,
                  rotateY: -180,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateX: [0, 360],
                  rotateY: [0, -360],
                  rotateZ: i % 2 === 0 ? [0, 360] : [0, -360],
                }}
                transition={{
                  opacity: { duration: 1, delay: i * 0.1 },
                  scale: { duration: 1, delay: i * 0.1 },
                  rotateX: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
                  rotateY: { duration: 25 + i * 3, repeat: Infinity, ease: "linear" },
                  rotateZ: { duration: 30 + i * 2, repeat: Infinity, ease: "linear" },
                }}
              />
            ))}
          </AnimatePresence>
        </div>
  
        {/* Main content */}
        <motion.div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem',
            textAlign: 'center',
            opacity,
          }}
        >
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: '3rem',
            }}
          >
            <motion.div
              style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #FF6B35)',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.span
              style={{
                margin: '0 1.5rem',
                fontSize: '0.75rem',
                fontWeight: 300,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#FF6B35',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Next-Generation Protocol
            </motion.span>
            <motion.div
              style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, #FF6B35, transparent)',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </motion.div>
  
          {/* Title with advanced animation */}
          <motion.h1
            style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              fontWeight: 100,
              lineHeight: 0.85,
              marginBottom: '2rem',
              letterSpacing: '-0.08em',
              position: 'relative',
              color: '#FFFFFF', // Fallback color
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FF6B35 50%, #FF4500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              position: 'relative',
              // Add text shadow for better visibility
              textShadow: '0 2px 20px rgba(255, 107, 53, 0.8)',
            }}>
              {title}
              {/* Glow effect */}
              <span style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FF6B35 50%, #FF4500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'blur(20px)',
                opacity: 0.5,
                zIndex: -1,
              }}>
                {title}
              </span>
            </span>
          </motion.h1>
  
          {/* Subtitle */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              style={{ marginBottom: '2rem' }}
            >
              <motion.p
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 100,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.9)',
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                {subtitle}
              </motion.p>
              <motion.div
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
                  marginTop: '1rem',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              />
            </motion.div>
          )}
  
          {/* Description */}
          {description && (
            <motion.p
              style={{
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: '800px',
                margin: '0 auto 4rem',
                fontWeight: 300,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              {description}
            </motion.p>
          )}
  
          {/* Ultra-modern CTAs */}
          <motion.div
            style={{
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            {primaryCta && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={primaryCta.href}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '1.5rem 4rem',
                    fontSize: '0.875rem',
                    fontWeight: 300,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'white',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    transition: 'all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)',
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    target.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.color = 'white';
                  }}
                >
                  {/* Animated border */}
                  <span style={{
                    position: 'absolute',
                    inset: 0,
                    border: '1px solid transparent',
                    borderRadius: '60px',
                    background: 'linear-gradient(135deg, #FF6B35, #FF4500, #FF1744) border-box',
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }} />
                  
                  {/* Hover background */}
                  <motion.span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '60px',
                      background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                      zIndex: -1,
                    }}
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                  />
                  
                  <span style={{ position: 'relative' }}>{primaryCta.label}</span>
                </a>
              </motion.div>
            )}
  
            {secondaryCta && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={secondaryCta.href}
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '1.5rem 4rem',
                    fontSize: '0.875rem',
                    fontWeight: 300,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.9)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '60px',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    transition: 'all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1)',
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    target.style.borderColor = 'rgba(255, 107, 53, 0.5)';
                    target.style.background = 'rgba(255, 107, 53, 0.1)';
                    target.style.color = '#FF6B35';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    target.style.background = 'rgba(255, 255, 255, 0.03)';
                    target.style.color = 'rgba(255, 255, 255, 0.9)';
                  }}
                >
                  {secondaryCta.label}
                </a>
              </motion.div>
            )}
          </motion.div>
  
          {/* Scroll indicator */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '-6rem',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div style={{
                width: '24px',
                height: '40px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '3px',
                    height: '8px',
                    background: '#FF6B35',
                    borderRadius: '2px',
                  }}
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
  
        {/* Premium floating orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              style={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(255, ${107 - i * 20}, ${53 - i * 10}, ${0.08 - i * 0.02}) 0%, transparent 60%)`,
                filter: 'blur(80px)',
                left: `${20 + i * 20}%`,
                top: `${10 + i * 20}%`,
              }}
              animate={{
                x: [0, 50, -50, 0],
                y: [0, -50, 50, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{
                duration: 25 + i * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.section>
    );
  };
  
  export default UltraHeroSection; 
}

// Export empty module for SSR
export default function() {};