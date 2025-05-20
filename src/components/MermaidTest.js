import React from 'react';
import MermaidDiagram from './MermaidDiagram';

export default function MermaidTest() {
  const diagramCode = `flowchart TB
    subgraph "External Randomness Sources"
        drand["dRAND Network"]
        chainlink["Chainlink VRF"]
        arbitrum["Arbitrum VRF"]
        evmnet["EVMnet"]
        quicknet["Quicknet"]
    end
    
    subgraph "On-Chain Verification"
        drandIntegrator["DragonVRFIntegrator"]
        chainlinkIntegrator["ChainlinkVRFIntegrator"]
        arbitrumIntegrator["ArbitrumVRFIntegrator"]
        evmnetIntegrator["EVMnetIntegrator"]
        quicknetIntegrator["QuicknetIntegrator"]
    end
    
    subgraph "Aggregation Layer"
        omniConsumer["OmniDragonVRFConsumer"]
        randomBuffer["Randomness Buffer"]
        weighted["Weighted Combination"]
    end
    
    subgraph "Consumer Applications"
        jackpotSystem["Jackpot System"]
        games["Games & Applications"]
        governance["Governance Decisions"]
    end
    
    drand --> drandIntegrator
    chainlink --> chainlinkIntegrator
    arbitrum --> arbitrumIntegrator
    evmnet --> evmnetIntegrator
    quicknet --> quicknetIntegrator
    
    drandIntegrator --> omniConsumer
    chainlinkIntegrator --> omniConsumer
    arbitrumIntegrator --> omniConsumer
    evmnetIntegrator --> omniConsumer
    quicknetIntegrator --> omniConsumer
    
    omniConsumer --> randomBuffer
    randomBuffer --> weighted
    weighted --> jackpotSystem
    weighted --> games
    weighted --> governance
    
    classDef highlight fill:#f9f,stroke:#333,stroke-width:2px;
    class omniConsumer,randomBuffer,weighted highlight`;

  return (
    <div>
      <h2>Mermaid Diagram Test</h2>
      <p>Testing flowchart TB syntax with the randomness diagram</p>
      <MermaidDiagram chart={diagramCode} />
    </div>
  );
} 