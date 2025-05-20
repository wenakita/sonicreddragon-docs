---
title: Mermaid Diagrams
sidebar_position: 99
---

# Elegant Mermaid Diagrams

This page showcases our redesigned mermaid diagrams with minimalistic styling and semantic color coding.

## Basic Process Flow

A simple, elegant decision flow with action-based color coding:

```mermaid
flowchart LR
    A([Start]) --> B{Decision?}
    B -->|Yes| C([Success])
    B -->|No| D([Retry])
    D --> A
    
    classDef start fill:#b5e2fa,stroke:#0077b6,color:#023047
    classDef process fill:#ffedd8,stroke:#f4a261,color:#264653
    classDef success fill:#d8f3dc,stroke:#2a9d8f,color:#264653
    
    class A start
    class B,D process
    class C success
```

## Randomness System Architecture

A layered architecture diagram with clear visual hierarchy:

```mermaid
flowchart TB
    %% Define nodes with minimal text
    subgraph Sources ["External Sources"]
        direction LR
        D[dRAND]
        C[Chainlink]
        A[Arbitrum]
    end
    
    subgraph Integrators ["Verification Layer"]
        direction LR
        DI[dRAND Integrator]
        CI[Chainlink Integrator]
        AI[Arbitrum Integrator]
    end
    
    subgraph Core ["Aggregation Core"]
        direction LR
        VC[VRF Consumer]
        RB[Randomness Buffer]
        WC[Weighted Combiner]
    end
    
    subgraph Apps ["Applications"]
        direction LR
        J[Jackpot]
        G[Games]
        Gov[Governance]
    end
    
    %% Connect the layers
    D --> DI
    C --> CI
    A --> AI
    
    DI --> VC
    CI --> VC
    AI --> VC
    
    VC --> RB
    RB --> WC
    
    WC --> J
    WC --> G
    WC --> Gov
    
    %% Style the diagram
    classDef source fill:#f8f9fa,stroke:#dee2e6,color:#343a40
    classDef integrator fill:#e9ecef,stroke:#adb5bd,color:#343a40
    classDef core fill:#d0ebff,stroke:#339af0,color:#1864ab
    classDef app fill:#d3f9d8,stroke:#51cf66,color:#2b8a3e
    
    class D,C,A source
    class DI,CI,AI integrator
    class VC,RB,WC core
    class J,G,Gov app
    
    %% Style the subgraphs
    style Sources fill:#f8f9fa,stroke:#dee2e6,color:#343a40
    style Integrators fill:#e9ecef,stroke:#adb5bd,color:#343a40
    style Core fill:#d0ebff,stroke:#339af0,color:#1864ab
    style Apps fill:#d3f9d8,stroke:#51cf66,color:#2b8a3e
```

## Cross-Chain Transfer Sequence

A sequence diagram with semantic colors for different actors and actions:

```mermaid
sequenceDiagram
    participant U as User
    participant S as Source Chain
    participant B as Bridge
    participant D as Destination Chain
    
    %% Style actors by their role
    rect rgb(240, 240, 245)
    Note over U: Initiator
    end
    rect rgb(234, 242, 252)
    Note over S: Origin
    end
    rect rgb(255, 240, 219)
    Note over B: Middleware
    end
    rect rgb(232, 244, 234)
    Note over D: Target
    end
    
    %% Define sequence with semantic coloring
    U->>+S: Request Transfer
    S->>+B: Lock Assets & Send Message
    Note right of S: Assets secured
    B->>B: Verify Message
    B-->>-S: Confirmation
    B->>+D: Deliver Proof
    D->>-U: Release or Mint Assets
    
    %% Use notes for key information
    Note over B,D: Cross-chain verification
```

## Token System Class Diagram

A clean class diagram with meaningful relationships:

```mermaid
classDiagram
    %% Define classes with minimal properties/methods
    class Token {
        +name: string
        +symbol: string
        +totalSupply: uint256
        +transfer()
        +approve()
    }
    
    class Jackpot {
        +pool: uint256
        +drawTime: uint256
        +triggerDraw()
        +distribute()
    }
    
    class VRFConsumer {
        +requestRandom()
        +fulfillRandom()
    }
    
    class Governance {
        +proposals: map
        +vote()
        +execute()
    }
    
    %% Define relationships
    Token ..> Jackpot : funds
    VRFConsumer ..> Jackpot : provides randomness
    Jackpot ..> Governance : influences
    
    %% Style with meaningful colors
    classDef token fill:#e7f5ff,stroke:#339af0,color:#1864ab
    classDef jackpot fill:#fff9db,stroke:#fcc419,color:#e67700
    classDef vrf fill:#f8f0fc,stroke:#cc5de8,color:#862e9c
    classDef gov fill:#e6fcf5,stroke:#20c997,color:#087f5b
    
    class Token token
    class Jackpot jackpot
    class VRFConsumer vrf
    class Governance gov
``` 