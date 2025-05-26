import React from 'react';
import ScrollRevealWrapper from '../ScrollRevealWrapper';
import MermaidControls from '../MermaidControls';

export default function SystemArchitectureSection() {
  return (
    <section className="system-architecture-section">
      <h2>System Architecture</h2>

      <ScrollRevealWrapper animation="fadeInUp" duration={1000} delay={200}>
        <div className="mermaid-container">
          <MermaidControls targetSelector=".mermaid-container .mermaid" />

          <pre className="mermaid">
{`%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#f8fafc',
    'primaryTextColor': '#334155',
    'primaryBorderColor': '#64748b',
    'lineColor': '#64748b',
    'secondaryColor': '#f1f5f9',
    'tertiaryColor': '#e2e8f0',
    'background': '#ffffff',
    'mainBkg': '#f8fafc',
    'secondBkg': '#f1f5f9',
    'tertiaryBkg': '#e2e8f0'
  }
}}%%

graph TB
    A[OmniDragon Token] --> B[Lottery System]
    A --> C[Cross-Chain Bridge]
    A --> D[Fee Management]
    A --> E[Governance]
    
    B --> F[VRF Randomness]
    B --> G[Prize Distribution]
    B --> H[Entry Management]
    
    C --> I[LayerZero Protocol]
    C --> J[Multi-Chain Support]
    C --> K[Asset Bridging]
    
    D --> L[Dynamic Fees]
    D --> M[Revenue Sharing]
    D --> N[Burn Mechanism]
    
    E --> O[Voting System]
    E --> P[Proposal Management]
    E --> Q[Treasury Control]
    
    F --> R[Chainlink VRF]
    F --> S[Drand Network]
    F --> T[Fallback Sources]

    classDef default fill:#f8fafc,stroke:#64748b,stroke-width:2px,color:#334155
    classDef primary fill:#e2e8f0,stroke:#475569,stroke-width:2px,color:#1e293b
    classDef secondary fill:#f1f5f9,stroke:#64748b,stroke-width:1px,color:#475569
    
    class A primary
    class B,C,D,E secondary`}
          </pre>
        </div>
      </ScrollRevealWrapper>
    </section>
  );
} 