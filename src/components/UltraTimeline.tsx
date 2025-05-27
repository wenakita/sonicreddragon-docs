import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  color: string;
  icon?: React.ReactNode;
}

interface UltraTimelineProps {
  items: TimelineItem[];
}

const UltraTimeline: React.FC<UltraTimelineProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 100,
    damping: 30,
  });

  return (
    <motion.section
      ref={containerRef}
      style={{
        padding: '8rem 0',
        background: 'linear-gradient(180deg, #0A0A0A 0%, #000000 50%, #0A0A0A 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.02,
      }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="#FF6B35" />
              <path d="M 50,50 L 100,50 M 50,50 L 50,100 M 50,50 L 0,50 M 50,50 L 50,0" stroke="#FF6B35" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              background: '#FF6B35',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px #FF6B35',
            }}
            animate={{
              y: [-20, -80, -20],
              x: [-10, 10, -10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative',
      }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '6rem' }}
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
              Roadmap
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
            The journey to revolutionize cross-chain DeFi
          </motion.p>
        </motion.div>

        {/* Timeline container */}
        <div style={{ position: 'relative' }}>
          {/* 3D Timeline path */}
          <svg
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              transform: 'translateX(-50%)',
              width: '2px',
              height: '100%',
              overflow: 'visible',
            }}
          >
            <defs>
              <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity="0" />
                <stop offset="20%" stopColor="#FF6B35" stopOpacity="1" />
                <stop offset="80%" stopColor="#FF4500" stopOpacity="1" />
                <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={`M 1,0 L 1,${items.length * 300}`}
              stroke="url(#timelineGradient)"
              strokeWidth="2"
              fill="none"
              style={{ pathLength }}
            />
          </svg>

          {/* Timeline items */}
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <TimelineNode
                key={index}
                item={item}
                index={index}
                isLeft={isLeft}
                totalItems={items.length}
              />
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

const TimelineNode: React.FC<{
  item: TimelineItem;
  index: number;
  isLeft: boolean;
  totalItems: number;
}> = ({ item, index, isLeft }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={nodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isLeft ? 'flex-end' : 'flex-start',
        marginBottom: '6rem',
        position: 'relative',
      }}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      {/* Content card */}
      <motion.div
        style={{
          width: '45%',
          position: 'relative',
          marginRight: isLeft ? '2rem' : 0,
          marginLeft: isLeft ? 0 : '2rem',
        }}
        initial={{ x: isLeft ? 50 : -50, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.2 + 0.2,
          ease: [0.215, 0.61, 0.355, 1],
        }}
      >
        <motion.div
          style={{
            background: 'rgba(10, 10, 10, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          whileHover={{ 
            scale: 1.02,
            borderColor: `${item.color}40`,
            transition: { duration: 0.3 }
          }}
        >
          {/* Gradient overlay */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${item.color}10 0%, ${item.color}05 100%)`,
              opacity: 0,
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Corner accent */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
            }}
          >
            <motion.path
              d="M 100,0 L 100,40 Q 100,50 90,50 L 50,50"
              fill="none"
              stroke={item.color}
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
            />
          </svg>

          {/* Date badge */}
          <motion.div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              background: item.color,
              borderRadius: '50%',
              boxShadow: `0 0 20px ${item.color}`,
            }} />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: item.color,
            }}>
              {item.date}
            </span>
          </motion.div>

          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: 400,
            marginBottom: '1rem',
            color: 'rgba(255, 255, 255, 0.95)',
            position: 'relative',
          }}>
            {item.title}
          </h3>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 300,
            position: 'relative',
          }}>
            {item.description}
          </p>

          {/* 3D depth effect */}
          <motion.div
            style={{
              position: 'absolute',
              inset: '10px',
              borderRadius: '20px',
              border: `1px solid ${item.color}20`,
              opacity: 0,
              transform: 'translateZ(-10px)',
            }}
            whileHover={{ 
              opacity: 1,
              transform: 'translateZ(-20px)',
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>

      {/* Center node */}
      <motion.div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : {}}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.2,
          type: "spring",
          stiffness: 200,
        }}
      >
        {/* Outer ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${item.color}40`,
            background: 'rgba(0, 0, 0, 0.8)',
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Inner circle */}
        <motion.div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: item.color,
            boxShadow: `0 0 30px ${item.color}80`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {item.icon || (
            <span style={{ 
              color: 'white', 
              fontSize: '0.875rem',
              fontWeight: 600,
            }}>
              {index + 1}
            </span>
          )}
        </motion.div>

        {/* Pulse effect */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            border: `1px solid ${item.color}`,
            opacity: 0,
          }}
          animate={{
            scale: [1, 1.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default UltraTimeline; 