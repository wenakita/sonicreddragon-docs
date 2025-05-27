import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import AnimationSystem from '../utils/animationSystem';

interface HeroSectionProps {
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

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Mouse parallax effect
  const backgroundX = useSpring(useTransform(mouseX, [0, 1], [-20, 20]), {
    stiffness: 100,
    damping: 30,
  });
  const backgroundY = useSpring(useTransform(mouseY, [0, 1], [-20, 20]), {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({ x: clientX, y: clientY });
      mouseX.set(clientX / innerWidth);
      mouseY.set(clientY / innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const system = AnimationSystem.getInstance();

    // Advanced text animation
    if (titleRef.current) {
      system.animateText(titleRef.current, {
        type: 'split',
        duration: 1.5,
        stagger: 0.005,
      });
    }

    // WebGL-inspired particle system
    if (containerRef.current) {
      system.createParticleSystem(containerRef.current, {
        count: 150,
        color: ['#FF6B35', '#FF4500', '#FF1744', '#D84315'],
        size: { min: 1, max: 4 },
        speed: { min: 0.2, max: 1 },
        glow: true,
        interactive: true,
      });

      // Create 3D scene
      system.create3DScene(containerRef.current, {
        type: 'geometry',
        interactive: true,
      });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      system.cleanup();
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
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
    >
      {/* Dynamic gradient background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-20%',
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 107, 53, 0.3) 0%, transparent 40%)`,
          filter: 'blur(100px)',
          x: backgroundX,
          y: backgroundY,
        }}
      />

      {/* Mesh gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at top left, rgba(255, 107, 53, 0.2) 0%, transparent 40%),
          radial-gradient(ellipse at top right, rgba(255, 69, 0, 0.2) 0%, transparent 40%),
          radial-gradient(ellipse at bottom left, rgba(255, 23, 68, 0.2) 0%, transparent 40%),
          radial-gradient(ellipse at bottom right, rgba(216, 67, 21, 0.2) 0%, transparent 40%)
        `,
        opacity: 0.6,
      }} />

      {/* Animated grid */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.1,
        }}
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#FF6B35" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          style={{
            y,
            scale,
          }}
        />
      </svg>

      {/* Floating geometric shapes */}
      <div style={{
        position: 'absolute',
        inset: 0,
        perspective: '1000px',
      }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              border: '1px solid',
              borderColor: `rgba(255, 107, 53, ${0.3 - i * 0.05})`,
              borderRadius: i % 2 === 0 ? '50%' : '0%',
              left: `${20 + i * 10}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              rotateZ: i % 2 === 0 ? 360 : -360,
              rotateY: [-20, 20],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotateZ: {
                duration: 30 + i * 5,
                repeat: Infinity,
                ease: "linear",
              },
              rotateY: {
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse",
              },
              scale: {
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </div>

      {/* Content */}
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
        {/* Elegant badge */}
        <motion.div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '3rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            width: '40px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
          }} />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 400,
            color: '#FF6B35',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Next-Gen DeFi Protocol
          </span>
          <div style={{
            width: '40px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
          }} />
        </motion.div>

        {/* Title with split animation */}
        <motion.h1
          ref={titleRef}
          style={{
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            fontWeight: 100,
            lineHeight: 0.9,
            marginBottom: '2rem',
            letterSpacing: '-0.05em',
            position: 'relative',
          }}
        >
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FF6B35 50%, #FF4500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 80px rgba(255, 107, 53, 0.5))',
          }}>
            {title}
          </span>
        </motion.h1>

        {/* Subtitle with elegant animation */}
        {subtitle && (
          <motion.div
            style={{
              fontSize: '1.5rem',
              fontWeight: 200,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '2rem',
              position: 'relative',
            }}
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {subtitle}
            <motion.div
              style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #FF6B35, transparent)',
              }}
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.div>
        )}

        {/* Description with typewriter effect */}
        {description && (
          <motion.p
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              margin: '0 auto 3rem',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {description}
          </motion.p>
        )}

        {/* Next-gen CTA buttons */}
        <motion.div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '4rem',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {primaryCta && (
            <motion.a
              href={primaryCta.href}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 3.5rem',
                fontSize: '1rem',
                fontWeight: 400,
                textDecoration: 'none',
                letterSpacing: '0.1em',
                color: 'white',
                background: 'transparent',
                border: 'none',
                overflow: 'hidden',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Gradient border */}
              <div style={{
                position: 'absolute',
                inset: 0,
                padding: '1px',
                background: 'linear-gradient(135deg, #FF6B35, #FF4500, #FF1744)',
                borderRadius: '50px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }} />
              
              {/* Hover fill */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                  borderRadius: '50px',
                  opacity: 0,
                  scale: 0.8,
                }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <span style={{ position: 'relative', zIndex: 1 }}>{primaryCta.label}</span>
            </motion.a>
          )}

          {secondaryCta && (
            <motion.a
              href={secondaryCta.href}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem 3.5rem',
                fontSize: '1rem',
                fontWeight: 400,
                textDecoration: 'none',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.9)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50px',
                overflow: 'hidden',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              whileHover={{
                borderColor: 'rgba(255, 107, 53, 0.5)',
                background: 'rgba(255, 107, 53, 0.1)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {secondaryCta.label}
            </motion.a>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-4rem',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div style={{
            width: '30px',
            height: '50px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '15px',
            position: 'relative',
          }}>
            <motion.div
              style={{
                position: 'absolute',
                top: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '4px',
                height: '10px',
                background: '#FF6B35',
                borderRadius: '2px',
              }}
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Next-gen floating orbs */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              background: `radial-gradient(circle, rgba(255, ${107 - i * 20}, ${53 - i * 10}, 0.1) 0%, transparent 70%)`,
              filter: 'blur(60px)',
            }}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            initial={{
              left: `${30 + i * 20}%`,
              top: `${20 + i * 30}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default HeroSection; 