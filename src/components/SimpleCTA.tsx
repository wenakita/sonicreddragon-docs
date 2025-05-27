import React from 'react';

const SimpleCTA: React.FC = () => {
  return (
    <section style={{
      padding: '10rem 0',
      background: 'radial-gradient(ellipse at center, rgba(255, 107, 53, 0.15) 0%, #000000 70%)',
      position: 'relative',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(255, ${107 - i * 10}, 53, 0.1) 0%, transparent 60%)`,
              filter: 'blur(60px)',
              left: `${i * 25}%`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        ))}
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <h2 style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 100,
          marginBottom: '2rem',
          letterSpacing: '-0.05em',
          lineHeight: 0.9,
        }}>
          <span style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FF6B35 40%, #FF4500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 60px rgba(255, 107, 53, 0.6))',
          }}>
            Ready to Begin?
          </span>
        </h2>

        <p style={{
          fontSize: '1.5rem',
          lineHeight: 1.8,
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '4rem',
          fontWeight: 300,
          maxWidth: '600px',
          margin: '0 auto 4rem',
        }}>
          Join the next generation of cross-chain DeFi infrastructure
        </p>

        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <a
            href="/smart-contracts/token"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.75rem 4.5rem',
              fontSize: '1rem',
              fontWeight: 300,
              color: 'white',
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
              borderRadius: '100px',
              textDecoration: 'none',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              transition: 'all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)',
              boxShadow: '0 20px 60px rgba(255, 107, 53, 0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.boxShadow = '0 30px 80px rgba(255, 107, 53, 0.6)';
              target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.boxShadow = '0 20px 60px rgba(255, 107, 53, 0.4)';
              target.style.transform = 'translateY(0)';
            }}
          >
            Enter Protocol
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="https://github.com/wenakita/sonicreddragon"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.75rem 4.5rem',
              fontSize: '1rem',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.9)',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '100px',
              textDecoration: 'none',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              transition: 'all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.borderColor = 'rgba(255, 107, 53, 0.5)';
              target.style.background = 'rgba(255, 107, 53, 0.1)';
              target.style.color = '#FF6B35';
              target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              target.style.background = 'rgba(255, 255, 255, 0.05)';
              target.style.color = 'rgba(255, 255, 255, 0.9)';
              target.style.transform = 'translateY(0)';
            }}
          >
            View Source
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </div>

        {/* Final flourish */}
        <div style={{
          marginTop: '6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #FF6B35)',
          }} />
          <span style={{
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 300,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Powered by Sonic
          </span>
          <div style={{
            width: '60px',
            height: '1px',
            background: 'linear-gradient(90deg, #FF6B35, transparent)',
          }} />
        </div>
      </div>
    </section>
  );
};

export default SimpleCTA; 