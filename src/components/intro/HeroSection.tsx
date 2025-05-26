import React from 'react';
import AnimatedText from '../AnimatedText';
import ScrollRevealWrapper from '../ScrollRevealWrapper';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <ScrollRevealWrapper animation="fadeInUp" duration={1000} delay={100}>
        <AnimatedText as="h1" animation="typewriter" duration={2000} className="gradient-text">
          Revolutionary Cross-Chain Token Ecosystem
        </AnimatedText>
      </ScrollRevealWrapper>

      <ScrollRevealWrapper animation="fadeInUp" duration={800} delay={300}>
        <p className="hero-description">
          <strong>OmniDragon</strong> is a revolutionary cross-chain token ecosystem built on Sonic blockchain, 
          featuring an integrated lottery system powered by dual VRF sources, dynamic fee management, 
          and advanced governance mechanisms.
        </p>
      </ScrollRevealWrapper>

      <div className="hero-content">
        <ScrollRevealWrapper animation="fadeInLeft" duration={800} delay={500}>
          <h2>What is OmniDragon?</h2>
          <p>
            OmniDragon combines the best of DeFi innovation with gaming mechanics, creating a unique token 
            that automatically generates lottery entries for holders while providing seamless cross-chain 
            functionality through LayerZero integration.
          </p>
        </ScrollRevealWrapper>

        <ScrollRevealWrapper animation="fadeInRight" duration={800} delay={700}>
          <h3>Core Features</h3>
          <ul className="core-features-list">
            <li style={{'--i': 0} as React.CSSProperties}>
              <strong>Integrated Lottery System</strong>: Automatic lottery entries on qualifying swaps with VRF-powered randomness
            </li>
            <li style={{'--i': 1} as React.CSSProperties}>
              <strong>Cross-Chain Native</strong>: Built-in LayerZero integration for seamless multi-chain operations
            </li>
            <li style={{'--i': 2} as React.CSSProperties}>
              <strong>Dynamic Fee Management</strong>: Intelligent fee distribution across multiple ecosystem components
            </li>
            <li style={{'--i': 3} as React.CSSProperties}>
              <strong>Governance Integration</strong>: Community-driven decision making with transparent voting mechanisms
            </li>
            <li style={{'--i': 4} as React.CSSProperties}>
              <strong>Advanced Security</strong>: Multi-source VRF randomness with fallback mechanisms
            </li>
          </ul>
        </ScrollRevealWrapper>
      </div>
    </section>
  );
} 