import React from 'react';
import AnimatedText from '../AnimatedText';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <AnimatedText as="h2" animation="typewriter" duration={2000} className="gradient-text">
        Revolutionary Cross-Chain Token Ecosystem
      </AnimatedText>

      <p className="hero-description">
        <strong>OmniDragon</strong> is a revolutionary cross-chain token ecosystem built on Sonic blockchain, 
        featuring an integrated lottery system powered by dual VRF sources, dynamic fee management, 
        and advanced governance mechanisms.
      </p>

      <div className="hero-content">
        <h2>What is OmniDragon?</h2>
        <p>
          OmniDragon combines the best of DeFi innovation with gaming mechanics, creating a unique token 
          that automatically generates lottery entries for holders while providing seamless cross-chain 
          functionality through LayerZero integration.
        </p>

        <h3>Core Features</h3>
        <ul className="core-features-list">
          <li><strong>Integrated Lottery System</strong>: Automatic lottery entries on qualifying swaps with VRF-powered randomness</li>
          <li><strong>Cross-Chain Native</strong>: Built-in LayerZero integration for seamless multi-chain operations</li>
          <li><strong>Dynamic Fee Management</strong>: Intelligent fee distribution across multiple ecosystem components</li>
          <li><strong>Governance Integration</strong>: Community-driven decision making with transparent voting mechanisms</li>
          <li><strong>Advanced Security</strong>: Multi-source VRF randomness with fallback mechanisms</li>
        </ul>
      </div>
    </section>
  );
} 