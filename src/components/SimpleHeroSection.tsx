import React from 'react';

interface SimpleHeroSectionProps {
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

const SimpleHeroSection: React.FC<SimpleHeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
}) => {
  return (
    <section style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.2) 0%, transparent 50%)',
      }} />
      
      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          marginBottom: '3rem',
          gap: '1rem',
        }}>
          <div style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #FF6B35)',
          }} />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 300,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#FF6B35',
          }}>
            Next-Generation Protocol
          </span>
          <div style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, #FF6B35, transparent)',
          }} />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 100,
          lineHeight: 0.9,
          marginBottom: '2rem',
          color: '#FFFFFF',
        }}>
          <span style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FF6B35 50%, #FF4500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(255, 107, 53, 0.5))',
          }}>
            {title}
          </span>
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p style={{
            fontSize: '1.5rem',
            fontWeight: 100,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem',
          }}>
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '800px',
            margin: '0 auto 4rem',
            fontWeight: 300,
          }}>
            {description}
          </p>
        )}

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {primaryCta && (
            <a
              href={primaryCta.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1.5rem 4rem',
                fontSize: '1rem',
                fontWeight: 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
                color: 'white',
                borderRadius: '50px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 20px 40px rgba(255, 107, 53, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(255, 107, 53, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.3)';
              }}
            >
              {primaryCta.label}
            </a>
          )}

          {secondaryCta && (
            <a
              href={secondaryCta.href}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1.5rem 4rem',
                fontSize: '1rem',
                fontWeight: 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.9)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.5)';
                e.currentTarget.style.background = 'rgba(255, 107, 53, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default SimpleHeroSection; 