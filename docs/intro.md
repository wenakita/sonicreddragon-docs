---
sidebar_position: 1
title: Welcome to OmniDragon
hide_title: true
custom_edit_url: null
className: intro-page
---

import SimpleHeroSection from '@site/src/components/SimpleHeroSection';
import UltraFeatureShowcase from '@site/src/components/UltraFeatureShowcase';
import UltraStatsDashboard from '@site/src/components/UltraStatsDashboard';
import UltraTimeline from '@site/src/components/UltraTimeline';
import SimpleCTA from '@site/src/components/SimpleCTA';
import BrowserOnly from '@docusaurus/BrowserOnly';

<BrowserOnly>
{() => (
  <>
    <SimpleHeroSection
      title="OmniDragon"
      subtitle="Cross-Chain Token Ecosystem"
      description="Revolutionary DeFi protocol combining automated lottery mechanics with seamless cross-chain operations. Built on Sonic blockchain with LayerZero integration for true multi-chain dominance."
      primaryCta={{
        label: "Launch Protocol",
        href: "/smart-contracts/token"
      }}
      secondaryCta={{
        label: "Explore Docs",
        href: "/contracts/core/token"
      }}
    />

    {/* Ultra-modern statistics dashboard */}
    <UltraStatsDashboard
      stats={[
        { 
          value: '10%', 
          label: 'Swap Fee', 
          color: '#FF6B35',
          description: 'Redistributed to holders and ecosystem'
        },
        { 
          value: '6.9%', 
          label: 'To Jackpot', 
          color: '#FF4500',
          description: 'Accumulated for lottery winners'
        },
        { 
          value: '2.41%', 
          label: 'Staking APY', 
          color: '#FF8C00',
          description: 'Dynamic rewards for stakers'
        },
        { 
          value: '0.69%', 
          label: 'Auto Burn', 
          color: '#FFA500',
          description: 'Deflationary mechanism'
        },
      ]}
    />

    {/* Ultra-modern feature showcase */}
    <UltraFeatureShowcase
      features={[
        {
          title: "Multi-Chain Native",
          description: "Seamlessly operate across multiple blockchains with LayerZero V2 integration for true cross-chain dominance",
          icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          ),
        },
        {
          title: "Automated Lottery",
          description: "Every swap automatically enters you into the lottery powered by dual VRF sources for maximum fairness",
          icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          ),
        },
        {
          title: "Dynamic Fees",
          description: "Intelligent fee distribution system that benefits holders, stakers, and the ecosystem simultaneously",
          icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          ),
        },
      ]}
    />

    {/* Ultra-modern timeline */}
    <UltraTimeline
      items={[
        {
          date: "Q1 2024",
          title: "Foundation",
          description: "Core architecture design and initial implementation of the multi-source VRF system with advanced cryptographic primitives.",
          color: "#FF6B35"
        },
        {
          date: "Q2 2024",
          title: "Integration",
          description: "LayerZero V2 protocol integration and cross-chain messaging infrastructure deployment across multiple networks.",
          color: "#FF4500"
        },
        {
          date: "Q3 2024",
          title: "Enhancement",
          description: "Advanced randomness algorithms, dual VRF sources, and failover mechanisms for maximum reliability and security.",
          color: "#FF8C00"
        },
        {
          date: "Q4 2024",
          title: "Deployment",
          description: "Mainnet launch across major EVM chains with comprehensive security audits and ecosystem partnerships.",
          color: "#FFA500"
        }
      ]}
    />

    {/* Call to Action */}
    <SimpleCTA />
  </>
)}
</BrowserOnly>