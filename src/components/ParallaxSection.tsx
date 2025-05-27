import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backgroundLayers?: Array<{
    image?: string;
    gradient?: string;
    speed: number;
    opacity?: number;
  }>;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  title,
  subtitle,
  children,
  backgroundLayers = [
    { gradient: 'radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 50%)', speed: 0.2 },
    { gradient: 'radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.08) 0%, transparent 50%)', speed: 0.4 },
  ]
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Create transforms for each layer
  const layerTransforms = backgroundLayers.map(layer => 
    useTransform(scrollYProgress, [0, 1], [0, layer.speed * 100])
  );

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0F172A 0%, #1A1F3A 100%)',
      }}
    >
      {/* Parallax background layers */}
      {backgroundLayers.map((layer, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            inset: 0,
            background: layer.gradient || `url(${layer.image}) center/cover no-repeat`,
            opacity: layer.opacity || 1,
            y: layerTransforms[index],
          }}
        />
      ))}

      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.02,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 2rem',
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        <motion.h2
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 300,
            textAlign: 'center',
            marginBottom: '1rem',
            color: 'rgba(255, 255, 255, 0.95)',
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        {subtitle && (
          <motion.p
            style={{
              fontSize: '1.125rem',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '3rem',
              maxWidth: '600px',
              margin: '0 auto 3rem',
              lineHeight: 1.6,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </motion.p>
        )}

        <div style={{ perspective: '1000px' }}>
          {children}
        </div>
      </motion.div>

      {/* Elegant bottom fade */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          background: 'linear-gradient(to top, #0F172A 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </motion.section>
  );
};

export default ParallaxSection; 