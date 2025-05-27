import React from 'react';

const TestHero: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FF6B35 50%, #FF4500 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: '#FFFFFF' // Fallback
      }}>
        OmniDragon
      </h1>
      <p style={{
        fontSize: '1.5rem',
        color: '#FF6B35',
        marginBottom: '3rem'
      }}>
        Cross-Chain Token Ecosystem
      </p>
      <button style={{
        padding: '1rem 3rem',
        fontSize: '1rem',
        background: 'linear-gradient(135deg, #FF6B35, #FF4500)',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer'
      }}>
        Launch Protocol
      </button>
    </div>
  );
};

export default TestHero; 