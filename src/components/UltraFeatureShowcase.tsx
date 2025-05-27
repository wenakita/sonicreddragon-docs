import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient?: string;
}

interface UltraFeatureShowcaseProps {
  features: Feature[];
}

const UltraFeatureShowcase: React.FC<UltraFeatureShowcaseProps> = ({ features }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.section
      ref={containerRef}
      style={{
        padding: '8rem 0',
        background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)',
        position: 'relative',
        overflow: 'hidden',
        opacity,
        scale,
      }}
    >
      {/* Dynamic background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 30% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 40%),
          radial-gradient(circle at 70% 80%, rgba(255, 69, 0, 0.1) 0%, transparent 40%)
        `,
      }} />

      {/* Animated particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: '#FF6B35',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              x: [-10, 10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <motion.h2
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 100,
              marginBottom: '1rem',
              letterSpacing: '-0.05em',
            }}
          >
            <span style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FF6B35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Core Features
            </span>
          </motion.h2>
          <motion.p
            style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 300,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Experience the next generation of DeFi infrastructure
          </motion.p>
        </motion.div>

        {/* Feature grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          position: 'relative',
        }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              viewport={{ once: true }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                position: 'relative',
                background: 'rgba(10, 10, 10, 0.6)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '3rem',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)',
              }}
              whileHover={{
                y: -10,
                borderColor: 'rgba(255, 107, 53, 0.3)',
              }}
            >
              {/* Gradient overlay */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: feature.gradient || 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 69, 0, 0.1) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.5s ease',
                }}
                animate={{ opacity: activeIndex === index ? 1 : 0 }}
              />

              {/* Glow effect */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%)',
                  transform: 'translate(-50%, -50%)',
                  opacity: 0,
                  filter: 'blur(60px)',
                }}
                animate={{ opacity: activeIndex === index ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />

              {/* Icon container */}
              <motion.div
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 69, 0, 0.2) 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                animate={{
                  rotate: activeIndex === index ? 360 : 0,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Icon glow */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: '-50%',
                    background: 'radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, transparent 70%)',
                    opacity: 0,
                  }}
                  animate={{ opacity: activeIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <div style={{ 
                  color: '#FF6B35',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {feature.icon}
                </div>
              </motion.div>

              {/* Content */}
              <motion.h3
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 400,
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.95)',
                  letterSpacing: '-0.02em',
                  position: 'relative',
                }}
              >
                {feature.title}
              </motion.h3>

              <motion.p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 300,
                  position: 'relative',
                }}
              >
                {feature.description}
              </motion.p>

              {/* Animated corner accents */}
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                <defs>
                  <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FF4500" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M 0,60 L 0,24 Q 0,0 24,0 L 60,0"
                  fill="none"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: activeIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.path
                  d="M 340,280 L 340,316 Q 340,340 316,340 L 280,340"
                  fill="none"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: activeIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>

              {/* Hover indicator */}
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  right: '2rem',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 107, 53, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.8,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="2"
                  animate={{ x: activeIndex === index ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </motion.svg>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Connection lines between features */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FF4500" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {features.length > 1 && (
            <motion.path
              d="M 200,200 Q 600,150 1000,200"
              fill="none"
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          )}
        </svg>
      </div>
    </motion.section>
  );
};

export default UltraFeatureShowcase; 