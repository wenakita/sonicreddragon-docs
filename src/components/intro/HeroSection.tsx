import React from 'react';
import AnimatedText from '../AnimatedText';
import ScrollRevealWrapper from '../ScrollRevealWrapper';
import FloatingParticles from '@site/src/components/FloatingParticles';

export default function HeroSection() {
  return (
    <section className="hero-section-modern">
      <FloatingParticles />
      
      <div className="section-container">
        <div className="hero-grid">
        <div className="hero-content">
          <ScrollRevealWrapper animation="fadeInLeft" duration={1000} delay={100}>
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>Next-Gen DeFi on Sonic</span>
            </div>
          </ScrollRevealWrapper>

          <ScrollRevealWrapper animation="fadeInUp" duration={1000} delay={300}>
            <h1 className="hero-title">
              <span className="hero-title-main">OmniDragon</span>
              <span className="hero-title-sub gradient-text-modern">Cross-Chain Token Ecosystem</span>
            </h1>
          </ScrollRevealWrapper>

          <ScrollRevealWrapper animation="fadeInUp" duration={800} delay={500}>
            <p className="hero-description-modern">
              Revolutionary DeFi protocol combining <span className="highlight-text">automated lottery mechanics</span> with 
              <span className="highlight-text"> seamless cross-chain operations</span>. Built on Sonic blockchain with 
              LayerZero integration for true multi-chain dominance.
            </p>
          </ScrollRevealWrapper>

          <ScrollRevealWrapper animation="fadeInUp" duration={800} delay={700}>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-value">10%</div>
                <div className="stat-label">Swap Fee</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">6.9%</div>
                <div className="stat-label">To Jackpot</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">2.41%</div>
                <div className="stat-label">Staking APY</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">0.69%</div>
                <div className="stat-label">Auto Burn</div>
              </div>
            </div>
          </ScrollRevealWrapper>

          <ScrollRevealWrapper animation="fadeInUp" duration={800} delay={900}>
            <div className="hero-cta-group">
              <a href="/getting-started" className="btn-primary-modern">
                <span>Get Started</span>
                <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="/contracts/overview" className="btn-secondary-modern">
                <span>View Contracts</span>
              </a>
            </div>
          </ScrollRevealWrapper>
        </div>

        <div className="hero-visual">
          <ScrollRevealWrapper animation="fadeInRight" duration={1200} delay={400}>
            <div className="hero-visual-container">
              <div className="orbital-ring ring-1"></div>
              <div className="orbital-ring ring-2"></div>
              <div className="orbital-ring ring-3"></div>
              <div className="dragon-logo-modern">
                <img src="/img/logo.svg" alt="OmniDragon" />
              </div>
            </div>
          </ScrollRevealWrapper>
        </div>
      </div>

      <ScrollRevealWrapper animation="fadeInUp" duration={1000} delay={1100}>
        <div className="feature-cards-modern">
          <div className="feature-card-modern">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Multi-Chain Native</h3>
            <p>Seamlessly operate across multiple blockchains with LayerZero V2 integration</p>
          </div>

          <div className="feature-card-modern">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Automated Lottery</h3>
            <p>Every swap automatically enters you into the lottery powered by dual VRF sources</p>
          </div>

          <div className="feature-card-modern">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Dynamic Fees</h3>
            <p>Intelligent fee distribution system that benefits holders, stakers, and the ecosystem</p>
          </div>
        </div>
      </ScrollRevealWrapper>
      </div>
    </section>
  );
} 