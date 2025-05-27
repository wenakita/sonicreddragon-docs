import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ImmersiveFeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  gradient?: string;
  delay?: number;
}

const ImmersiveFeatureCard: React.FC<ImmersiveFeatureCardProps> = ({
  title,
  description,
  icon,
  gradient = 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(78, 205, 196, 0.05) 100%)',
  delay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="immersive-feature-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '2.5rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
      whileHover={{ 
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Subtle gradient overlay */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: gradient,
          opacity: 0,
          transition: 'opacity 0.4s ease',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {icon && (
          <motion.div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
              color: 'white',
            }}
            animate={{
              rotate: isHovered ? 180 : 0,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>
        )}

        <motion.h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 500,
            marginBottom: '0.75rem',
            color: 'rgba(255, 255, 255, 0.9)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </motion.h3>

        <motion.p
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.6)',
            margin: 0,
          }}
        >
          {description}
        </motion.p>

        {/* Subtle accent line */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #FF6B35 0%, #4ECDC4 100%)',
            transformOrigin: 'left',
            scaleX: 0,
          }}
          animate={{
            scaleX: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default ImmersiveFeatureCard; 