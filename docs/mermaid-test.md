---
title: Mermaid Diagram Test
sidebar_position: 1
---

# Mermaid Diagram Gallery

This page demonstrates our enhanced mermaid diagrams with minimal styling and semantic color coding.

## Simple Flowchart

```mermaid
flowchart LR
    A([Begin]) --> B{Decision}
    B -->|Yes| C([Complete])
    B -->|No| D([Refine])
    D --> A
    
    classDef start fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    classDef process fill:#fff3e0,stroke:#ff9800,color:#e65100
    classDef end fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    
    class A start
    class B,D process
    class C end
```

## OmniDragon Randomness System

```mermaid
flowchart TB
    %% Define node groups with clear labels
    subgraph External ["External VRF Sources"]
        direction LR
        DR["dRAND"]:::source
        CL["Chainlink"]:::source
        AR["Arbitrum"]:::source
    end
    
    subgraph Verifiers ["On-Chain Verification"]
        direction LR
        DI["dRAND Integrator"]:::integrator
        CI["Chainlink Integrator"]:::integrator
        AI["Arbitrum Integrator"]:::integrator
    end
    
    subgraph Core ["Core Components"]
        direction TB
        OC["OmniDragon Consumer"]:::core
        RB["Randomness Buffer"]:::core
        WC["Weighted Combiner"]:::core
    end
    
    subgraph Applications ["Consumer Applications"]
        direction LR
        JP["Jackpot"]:::app
        GM["Games"]:::app
        GV["Governance"]:::app
    end
    
    %% Define connections with consistent pattern
    DR --> DI
    CL --> CI
    AR --> AI
    
    DI --> OC
    CI --> OC
    AI --> OC
    
    OC --> RB
    RB --> WC
    
    WC --> JP
    WC --> GM
    WC --> GV
    
    %% Style definitions
    classDef source fill:#fafafa,stroke:#9e9e9e,color:#424242
    classDef integrator fill:#e8eaf6,stroke:#7986cb,color:#3949ab
    classDef core fill:#e1f5fe,stroke:#4fc3f7,color:#0288d1
    classDef app fill:#e0f2f1,stroke:#4db6ac,color:#00796b
    
    %% Style subgraphs
    style External fill:#f5f5f5,stroke:#e0e0e0,color:#616161
    style Verifiers fill:#e8eaf6,stroke:#c5cae9,color:#3949ab
    style Core fill:#e1f5fe,stroke:#b3e5fc,color:#0288d1
    style Applications fill:#e0f2f1,stroke:#b2dfdb,color:#00796b
```

## Cross-Chain Token Flow

```mermaid
sequenceDiagram
    %% Define participants with roles
    participant User as 👤 User
    participant Source as 🔄 Source Chain
    participant Bridge as 🌉 Bridge
    participant Dest as 📥 Destination
    
    %% Activate participants with semantic colors
    activate User
    rect rgb(242, 242, 247)
    note over User: Initiates transaction
    end
    
    %% Request flow
    User->>+Source: Request transfer
    deactivate User
    rect rgb(235, 245, 251)
    note over Source: Locks tokens
    end
    
    %% Bridge processing
    Source->>+Bridge: Send message with proof
    deactivate Source
    rect rgb(255, 245, 230)
    note over Bridge: Validates transaction
    end
    
    %% Destination delivery
    Bridge->>+Dest: Deliver verified message
    deactivate Bridge
    rect rgb(235, 249, 242)
    note over Dest: Mints or releases tokens
    end
    
    %% Complete transaction
    Dest->>User: Credit tokens to account
    deactivate Dest
    activate User
    deactivate User
    
    %% Overall process annotation
    note over Bridge,Dest: Secure cross-chain verification
```

## Token System Architecture

```mermaid
classDiagram
    %% Define core classes
    class OmniToken {
        +string name
        +string symbol
        +uint256 total
        +mapping balances
        +transfer()
        +approve()
    }
    
    class RandomSource {
        +requestRandom()
        +verifyProof()
        +combineEntropy()
    }
    
    class JackpotSystem {
        +uint256 pool
        +uint256 nextDraw
        +trigger()
        +distribute()
    }
    
    class Governance {
        +propose()
        +vote()
        +execute()
    }
    
    %% Define relationships
    OmniToken --> JackpotSystem: funds
    RandomSource --> JackpotSystem: entropy
    JackpotSystem --> Governance: influences
    OmniToken --> Governance: voting power
    
    %% Apply semantic styling
    classDef token fill:#e8f4f8,stroke:#4dabf7,color:#1971c2
    classDef random fill:#f3f0ff,stroke:#b197fc,color:#6741d9
    classDef jackpot fill:#fff9db,stroke:#ffd43b,color:#f08c00
    classDef gov fill:#e6fcf5,stroke:#3bc9db,color:#0b7285
    
    class OmniToken token
    class RandomSource random
    class JackpotSystem jackpot
    class Governance gov
``` 