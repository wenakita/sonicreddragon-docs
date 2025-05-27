import React from 'react';
import ScrollRevealWrapper from '../ScrollRevealWrapper';
import InteractiveCard from '../InteractiveCard';

export default function GettingStartedSection() {
  return (
    <section className="getting-started-section">
      <div className="section-container">
        <h2>Getting Started</h2>
        <p>Ready to join the OmniDragon ecosystem? Here's how to get started:</p>

        <ScrollRevealWrapper animation="fadeInUp" duration={800} delay={200} stagger={true} staggerDelay={150}>
        <div className="cards-grid">
          <InteractiveCard
            title="For Users"
            variant="primary"
            withGlow={true}
            withParallax={true}
          >
            <ul>
              <li><strong>Acquire DRAGON Tokens</strong>: Purchase on supported DEXs</li>
              <li><strong>Connect Wallet</strong>: Use MetaMask or compatible wallet</li>
              <li><strong>Start Swapping</strong>: Every qualifying swap enters you into the lottery</li>
              <li><strong>Stake for Rewards</strong>: Earn additional yield through staking</li>
            </ul>
          </InteractiveCard>

          <InteractiveCard
            title="For Developers"
            variant="accent"
            withGlow={true}
            withParallax={true}
          >
            <ul>
              <li><strong>Review Documentation</strong>: Explore our comprehensive guides</li>
              <li><strong>Test Integration</strong>: Use our testnet environment</li>
              <li><strong>Deploy Contracts</strong>: Leverage our battle-tested infrastructure</li>
              <li><strong>Join Community</strong>: Connect with other builders</li>
            </ul>
          </InteractiveCard>

          <InteractiveCard
            title="For Partners"
            variant="glass"
            withGlow={true}
            withParallax={true}
          >
            <ul>
              <li><strong>Integration Opportunities</strong>: White-label lottery solutions</li>
              <li><strong>Revenue Sharing</strong>: Participate in fee distribution</li>
              <li><strong>Cross-Chain Expansion</strong>: Leverage our LayerZero integration</li>
              <li><strong>Governance Participation</strong>: Shape the future of OmniDragon</li>
            </ul>
          </InteractiveCard>
        </div>
      </ScrollRevealWrapper>
      </div>
    </section>
  );
} 