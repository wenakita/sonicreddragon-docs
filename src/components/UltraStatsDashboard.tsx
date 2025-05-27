import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
  color: string;
  description?: string;
}

interface UltraStatsDashboardProps {
  stats: Stat[];
}

const UltraStatsDashboard: React.FC<UltraStatsDashboardProps> = ({ stats }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={containerRef}
      style={{
        padding: '6rem 0',
        background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 50%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
        opacity,
      }}
    >
      {/* Animated background mesh */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.03,
        }}
      >
        <defs>
          <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2) rotate(0)">
            <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" fill="none" stroke="#FF6B35" strokeWidth="0.5"/>
            <polygon points="0,10.7 12.5,3.5 25,10.7 25,25.2 12.5,32.4 0,25.2" fill="none" stroke="#FF6B35" strokeWidth="0.5"/>
            <polygon points="50,10.7 37.5,3.5 25,10.7 25,25.2 37.5,32.4 50,25.2" fill="none" stroke="#FF6B35" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>

      {/* Floating orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${stats[i % stats.length]?.color}20 0%, transparent 70%)`,
              filter: 'blur(40px)',
              left: `${i * 20}%`,
              top: `${i % 2 === 0 ? -10 : 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
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
        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
          gap: '2rem',
        }}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              whileHover={{ y: -10 }}
              style={{
                position: 'relative',
                background: 'rgba(10, 10, 10, 0.4)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '3rem 2rem',
                textAlign: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = `${stat.color}40`;
                target.style.boxShadow = `0 20px 40px ${stat.color}30`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                target.style.boxShadow = 'none';
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '-100%',
                  background: `radial-gradient(circle at 50% 50%, ${stat.color}30 0%, transparent 70%)`,
                  opacity: 0,
                }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Floating particles */}
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '2px',
                      height: '2px',
                      background: stat.color,
                      borderRadius: '50%',
                      left: `${30 + i * 20}%`,
                      bottom: '20%',
                    }}
                    animate={{
                      y: [-10, -80, -10],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              {/* Value with count animation */}
              <motion.div
                style={{
                  fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                  fontWeight: 100,
                  marginBottom: '0.5rem',
                  position: 'relative',
                  letterSpacing: '-0.05em',
                }}
              >
                <motion.span
                  style={{
                    background: `linear-gradient(180deg, ${stat.color} 0%, ${stat.color}CC 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: `drop-shadow(0 0 30px ${stat.color}66)`,
                    display: 'inline-block',
                  }}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.1 + 0.3,
                  }}
                >
                  {stat.value}
                </motion.span>
              </motion.div>

              {/* Label */}
              <motion.h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 300,
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: stat.description ? '1rem' : 0,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  position: 'relative',
                }}
              >
                {stat.label}
              </motion.h3>

              {/* Description */}
              {stat.description && (
                <motion.p
                  style={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    position: 'relative',
                  }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {stat.description}
                </motion.p>
              )}

              {/* Corner accents */}
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
                  <linearGradient id={`stat-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={stat.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={stat.color} stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="100"
                  fill="none"
                  stroke={`url(#stat-gradient-${index})`}
                  strokeWidth="0.5"
                  strokeDasharray="5,10"
                  initial={{ pathLength: 0, rotate: 0 }}
                  animate={isInView ? { 
                    pathLength: 1,
                    rotate: 360,
                  } : {}}
                  transition={{
                    pathLength: { duration: 2, delay: index * 0.1 },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  }}
                />
              </svg>

              {/* Pulse effect on hover */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  border: `1px solid ${stat.color}`,
                  transform: 'translate(-50%, -50%)',
                  opacity: 0,
                }}
                initial={{ scale: 0.8 }}
                whileHover={{ 
                  scale: 1.1,
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Live indicator */}
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '3rem',
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            style={{
              width: '8px',
              height: '8px',
              background: '#4ADE80',
              borderRadius: '50%',
              boxShadow: '0 0 20px #4ADE80',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span style={{
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 300,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Live Protocol Metrics
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default UltraStatsDashboard; 