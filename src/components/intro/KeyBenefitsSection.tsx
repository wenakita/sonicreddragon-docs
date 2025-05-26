import React from 'react';
import ScrollRevealWrapper from '../ScrollRevealWrapper';

export default function KeyBenefitsSection() {
  return (
    <section className="key-benefits-section">
      <h2>Key Benefits</h2>

      <ScrollRevealWrapper animation="fadeInLeft" duration={800} delay={300} stagger={true} staggerDelay={200}>
        <div className="benefits-grid">
          <div className="benefit-category">
            <h3>For Token Holders</h3>
            <ul>
              <li><strong>Automatic Lottery Entries</strong>: No additional action required</li>
              <li><strong>Multiple Prize Tiers</strong>: Weekly, monthly, and instant wins</li>
              <li><strong>Staking Rewards</strong>: Earn yield on held tokens</li>
              <li><strong>Governance Rights</strong>: Vote on protocol decisions</li>
            </ul>
          </div>

          <div className="benefit-category">
            <h3>For Developers</h3>
            <ul>
              <li><strong>Battle-Tested Infrastructure</strong>: Proven randomness solutions</li>
              <li><strong>Cross-Chain Ready</strong>: Built-in LayerZero integration</li>
              <li><strong>Comprehensive APIs</strong>: Easy integration tools</li>
              <li><strong>Active Support</strong>: Dedicated developer community</li>
            </ul>
          </div>

          <div className="benefit-category">
            <h3>For Ecosystem</h3>
            <ul>
              <li><strong>Sustainable Tokenomics</strong>: Balanced fee distribution</li>
              <li><strong>Deflationary Mechanics</strong>: Regular token burns</li>
              <li><strong>Community Governance</strong>: Decentralized decision making</li>
              <li><strong>Continuous Innovation</strong>: Regular protocol upgrades</li>
            </ul>
          </div>
        </div>
      </ScrollRevealWrapper>
    </section>
  );
} 