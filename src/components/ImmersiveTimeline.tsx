import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

interface ImmersiveTimelineProps {
  items: TimelineItem[];
}

const ImmersiveTimeline: React.FC<ImmersiveTimelineProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} style={{
      position: 'relative',
      padding: '4rem 0',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      {/* Central timeline line */}
      <svg
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '2px',
          transform: 'translateX(-50%)',
          zIndex: 0,
        }}
        width="2"
        height="100%"
      >
        <motion.path
          d={`M 1 0 L 1 ${items.length * 250}`}
          stroke="url(#timeline-gradient)"
          strokeWidth="2"
          fill="none"
          style={{
            pathLength,
            opacity: 0.3,
          }}
        />
        <defs>
          <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0" />
            <stop offset="50%" stopColor="#4ECDC4" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Timeline items */}
      {items.map((item, index) => {
        const isLeft = index % 2 === 0;
        
        return (
          <motion.div
            key={index}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4rem',
              justifyContent: isLeft ? 'flex-end' : 'flex-start',
            }}
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Content card */}
            <motion.div
              style={{
                width: '45%',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                position: 'relative',
                [isLeft ? 'marginRight' : 'marginLeft']: '3rem',
              }}
              whileHover={{
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Date */}
              <motion.div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: item.color || '#4ECDC4',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.1em',
                }}
              >
                {item.date}
              </motion.div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 500,
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '-0.01em',
              }}>
                {item.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item.description}
              </p>

              {/* Subtle accent */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  [isLeft ? 'right' : 'left']: 0,
                  width: '3px',
                  height: '100%',
                  background: `linear-gradient(180deg, ${item.color || '#4ECDC4'} 0%, transparent 100%)`,
                  borderRadius: '0 16px 16px 0',
                  opacity: 0.5,
                }}
              />
            </motion.div>

            {/* Center node */}
            <motion.div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#0F172A',
                border: `2px solid ${item.color || '#4ECDC4'}`,
                zIndex: 1,
              }}
              whileHover={{
                scale: 1.3,
                boxShadow: `0 0 20px ${item.color || '#4ECDC4'}40`,
              }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2,
                },
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default ImmersiveTimeline; 