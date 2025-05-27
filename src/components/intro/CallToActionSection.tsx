import React from 'react';
import AnimatedText from '../AnimatedText';
import AnimatedButton from '../AnimatedButton';
import ParticleBackground from '../ParticleBackground';

export default function CallToActionSection() {
  return (
    <div className="intro-page-wrapper">
      <section className="call-to-action-section">
        <div className="section-container">
        <div className="cta-container">
        <ParticleBackground particleCount={15} />
        
        <AnimatedText as="h2" animation="glow" duration={1500} loop={true} className="gradient-text">
          Ready to experience the future of DeFi gaming?
        </AnimatedText>
        
        <p className="cta-description">
          Join the OmniDragon ecosystem today and start earning rewards with every transaction!
        </p>
        
        <div className="cta-buttons">
          <AnimatedButton 
            variant="gradient" 
            size="large" 
            glowEffect={true}
            href="/docs/getting-started"
          >
            Get Started
          </AnimatedButton>
          
          <AnimatedButton 
            variant="ghost" 
            size="large"
            href="/docs/contracts/core/omnidragon"
          >
            View Documentation
          </AnimatedButton>
        </div>
      </div>
      </div>
    </section>
    </div>
  );
} 