import React from 'react';
import ScrollRevealWrapper from '../ScrollRevealWrapper';
import MermaidControls from '../MermaidControls';
import MermaidDiagram from './MermaidDiagram';

const feeStructureChart = `sankey-beta
    DRAGON Swap Fee,Jackpot Pool,6.9
    DRAGON Swap Fee,Stakers,2.41
    DRAGON Swap Fee,Burn,0.69
    Jackpot Pool,Weekly Winners,4.8
    Jackpot Pool,Monthly Jackpot,2.1
    Stakers,Yield Distribution,2.41
    Burn,Deflationary Pressure,0.69`;

const lotteryProbabilityChart = `xychart-beta
    title "Lottery Win Probability vs Swap Amount"
    x-axis "Swap Amount (USD)" [10, 100, 1000, 2500, 5000, 10000]
    y-axis "Win Probability (%)" 0 --> 11
    line "Base Probability" [0.004, 0.04, 0.4, 1.0, 2.0, 4.0]
    line "With 2.5x Boost" [0.01, 0.1, 1.0, 2.5, 5.0, 10.0]`;

const vrfArchitectureChart = `flowchart TD
    A[Sonic Blockchain] --> B[OmniDragon Contract]
    B --> C[Randomness Request]
    C --> D[LayerZero Bridge]
    D --> E[Arbitrum Network]
    E --> F[Chainlink VRF 2.5]
    F --> G[Random Number Generation]
    G --> H[VRF Proof]
    H --> I[LayerZero Return]
    I --> J[Sonic Verification]
    J --> K[Lottery Execution]
    
    B --> L[Fallback: Drand]
    L --> M[Drand Beacon]
    M --> N[Aggregated Randomness]
    N --> O[Direct Integration]
    O --> K
    
    K --> P[Winner Selection]
    K --> Q[Prize Distribution]
    K --> R[Event Emission]

    classDef default fill:#f8fafc,stroke:#64748b,stroke-width:2px,color:#334155
    classDef network fill:#e2e8f0,stroke:#475569,stroke-width:2px,color:#1e293b
    classDef process fill:#f1f5f9,stroke:#64748b,stroke-width:1px,color:#475569
    
    class A,E network
    class C,G,K,P process`;

const tokenEconomicsChart = `flowchart LR
    A[User Swap] --> B[10% Fee Collection]
    B --> C{Fee Distribution}
    
    C --> D[6.9% Jackpot Pool]
    C --> E[2.41% Staker Rewards]
    C --> F[0.69% Token Burn]
    
    D --> G[Weekly Lottery]
    D --> H[Monthly Jackpot]
    D --> I[Instant Wins]
    
    E --> J[Staking Yield]
    E --> K[Governance Rewards]
    
    F --> L[Supply Reduction]
    F --> M[Deflationary Pressure]
    
    G --> N[Prize Distribution]
    H --> N
    I --> N
    
    J --> O[Compound Staking]
    K --> P[Voting Power]
    
    L --> Q[Price Appreciation]
    M --> Q
    
    N --> R[Ecosystem Growth]
    O --> R
    P --> R
    Q --> R

    classDef default fill:#f8fafc,stroke:#64748b,stroke-width:2px,color:#334155
    classDef fee fill:#e2e8f0,stroke:#475569,stroke-width:2px,color:#1e293b
    classDef outcome fill:#f1f5f9,stroke:#64748b,stroke-width:1px,color:#475569
    
    class B,C fee
    class N,R outcome`;

export default function DiagramsSection() {
  return (
    <section className="diagrams-section">
      <div className="section-container">
        {/* Fee Structure & Distribution */}
        <div className="diagram-subsection">
        <h2>Fee Structure & Distribution</h2>
        <ScrollRevealWrapper animation="fadeInLeft" duration={1000} delay={300}>
          <div className="mermaid-container">
            <MermaidControls />
            <MermaidDiagram chart={feeStructureChart} />
          </div>
        </ScrollRevealWrapper>
      </div>

      {/* Lottery Probability System */}
      <div className="diagram-subsection">
        <h2>Lottery Probability System</h2>
        <ScrollRevealWrapper animation="fadeInRight" duration={1000} delay={400}>
          <div className="mermaid-container">
            <MermaidControls />
            <MermaidDiagram chart={lotteryProbabilityChart} />
          </div>
        </ScrollRevealWrapper>
      </div>

      {/* Cross-Chain VRF Architecture */}
      <div className="diagram-subsection">
        <h2>Cross-Chain VRF Architecture</h2>
        <ScrollRevealWrapper animation="scale" duration={1000} delay={500}>
          <div className="mermaid-container">
            <MermaidControls />
            <MermaidDiagram chart={vrfArchitectureChart} />
          </div>
        </ScrollRevealWrapper>
      </div>

      {/* Token Economics Flow */}
      <div className="diagram-subsection">
        <h2>Token Economics Flow</h2>
        <ScrollRevealWrapper animation="fadeInUp" duration={1000} delay={600}>
          <div className="mermaid-container">
            <MermaidControls />
            <MermaidDiagram chart={tokenEconomicsChart} />
          </div>
        </ScrollRevealWrapper>
      </div>
      </div>
    </section>
  );
} 