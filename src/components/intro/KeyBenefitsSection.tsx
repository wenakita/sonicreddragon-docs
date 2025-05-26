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
              <li style={{'--i': 0} as React.CSSProperties}>
                <strong>Automatic Lottery Entries</strong>: No additional action required
              </li>
              <li style={{'--i': 1} as React.CSSProperties}>
                <strong>Multiple Prize Tiers</strong>: Weekly, monthly, and instant wins
              </li>
              <li style={{'--i': 2} as React.CSSProperties}>
                <strong>Staking Rewards</strong>: Earn yield on held tokens
              </li>
              <li style={{'--i': 3} as React.CSSProperties}>
                <strong>Governance Rights</strong>: Vote on protocol decisions
              </li>
            </ul>
          </div>

          <div className="benefit-category">
            <h3>For Developers</h3>
            <ul>
              <li style={{'--i': 0} as React.CSSProperties}>
                <strong>Battle-Tested Infrastructure</strong>: Proven randomness solutions
              </li>
              <li style={{'--i': 1} as React.CSSProperties}>
                <strong>Cross-Chain Ready</strong>: Built-in LayerZero integration
              </li>
              <li style={{'--i': 2} as React.CSSProperties}>
                <strong>Comprehensive APIs</strong>: Easy integration tools
              </li>
              <li style={{'--i': 3} as React.CSSProperties}>
                <strong>Active Support</strong>: Dedicated developer community
              </li>
            </ul>
          </div>

          <div className="benefit-category">
            <h3>For Ecosystem</h3>
            <ul>
              <li style={{'--i': 0} as React.CSSProperties}>
                <strong>Sustainable Tokenomics</strong>: Balanced fee distribution
              </li>
              <li style={{'--i': 1} as React.CSSProperties}>
                <strong>Deflationary Mechanics</strong>: Regular token burns
              </li>
              <li style={{'--i': 2} as React.CSSProperties}>
                <strong>Community Governance</strong>: Decentralized decision making
              </li>
              <li style={{'--i': 3} as React.CSSProperties}>
                <strong>Continuous Innovation</strong>: Regular protocol upgrades
              </li>
            </ul>
          </div>
        </div>
      </ScrollRevealWrapper>
    </section>
  );
} 