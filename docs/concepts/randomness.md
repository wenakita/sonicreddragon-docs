---
title: Randomness System
sidebar_position: 3
---

# OmniDragon Randomness System

The OmniDragon protocol leverages multiple sources of verifiable randomness to power its jackpot system and other applications requiring secure randomness.

## System Overview

The following diagram illustrates the high-level architecture of our randomness system:

```mermaid
flowchart TB
    %% Define the layers with clear visual hierarchy
    subgraph External ["External Randomness Sources"]
        direction LR
        DRAND["dRAND Network"]:::source
        CHAIN["Chainlink VRF"]:::source
        ARB["Arbitrum VRF"]:::source
    end
    
    subgraph Verification ["On-Chain Verification Layer"]
        direction LR
        DI["dRAND Integrator"]:::verify
        CI["Chainlink Integrator"]:::verify
        AI["Arbitrum Integrator"]:::verify
    end
    
    subgraph Core ["Core Aggregation Layer"]
        direction TB
        VC["VRF Consumer"]:::core
        RB["Randomness Buffer"]:::core
        WC["Weighted Combiner"]:::core
    end
    
    subgraph Applications ["Consumer Applications"]
        direction LR
        JP["Jackpot System"]:::app
        GAME["Games"]:::app
        GOV["Governance"]:::app
    end
    
    %% Connect the components
    DRAND --> DI
    CHAIN --> CI
    ARB --> AI
    
    DI --> VC
    CI --> VC
    AI --> VC
    
    VC --> RB
    RB --> WC
    
    WC --> JP
    WC --> GAME
    WC --> GOV
    
    %% Apply styling
    classDef source fill:#f8f9fa,stroke:#6c757d,color:#343a40
    classDef verify fill:#e9ecef,stroke:#495057,color:#212529
    classDef core fill:#e7f5ff,stroke:#339af0,color:#1864ab
    classDef app fill:#ebfbee,stroke:#37b24d,color:#2b8a3e
    
    %% Style subgraphs
    style External fill:#f8f9fa,stroke:#dee2e6,color:#495057
    style Verification fill:#e9ecef,stroke:#ced4da,color:#495057
    style Core fill:#e7f5ff,stroke:#74c0fc,color:#1864ab
    style Applications fill:#ebfbee,stroke:#8ce99a,color:#2b8a3e
```

## Randomness Request Flow

The sequence diagram below shows how randomness is requested and fulfilled:

```mermaid
sequenceDiagram
    participant App as Consumer App
    participant VRF as VRF Consumer
    participant Sources as Randomness Sources
    participant Buffer as Randomness Buffer
    
    rect rgb(240, 244, 248)
    note over App: Initiates request
    end
    
    App->>+VRF: requestRandomness()
    VRF->>VRF: Generate request ID
    VRF-->>App: Return request ID
    
    rect rgb(235, 241, 245)
    note over VRF,Sources: External verification
    end
    
    par Request from multiple sources
        VRF->>+Sources: Request from dRAND
        Sources-->>-VRF: Return dRAND proof
        
        VRF->>+Sources: Request from Chainlink
        Sources-->>-VRF: Return Chainlink proof
        
        VRF->>+Sources: Request from Arbitrum
        Sources-->>-VRF: Return Arbitrum proof
    end
    
    rect rgb(231, 245, 255)
    note over VRF,Buffer: Aggregation
    end
    
    VRF->>+Buffer: Store verified randomness
    Buffer-->>-VRF: Confirm storage
    Buffer->>Buffer: Combine randomness
    Buffer->>+App: fulfillRandomness(requestId, result)
    
    rect rgb(235, 251, 238)
    note over App: Process result
    end
    
    App->>App: Process randomness
    App-->>-Buffer: Acknowledge receipt
```

## Multi-Chain Randomness Architecture

Our system works across multiple chains with secure cross-chain verification:

```mermaid
flowchart LR
    %% Define chain-specific components
    subgraph Ethereum ["Ethereum"]
        direction TB
        ETH_DRAND["dRAND Verifier"]:::eth
        ETH_CHAIN["Chainlink VRF"]:::eth
        ETH_CONSUMER["ETH VRF Consumer"]:::eth
    end
    
    subgraph Arbitrum ["Arbitrum"]
        direction TB
        ARB_VRF["Arbitrum VRF"]:::arb
        ARB_CONSUMER["ARB VRF Consumer"]:::arb
    end
    
    subgraph Optimism ["Optimism"]
        direction TB
        OPT_CONSUMER["OPT VRF Consumer"]:::opt
    end
    
    subgraph LayerZero ["Cross-Chain Messaging"]
        LZ["LayerZero"]:::lz
    end
    
    %% Connect components
    ETH_DRAND --> ETH_CONSUMER
    ETH_CHAIN --> ETH_CONSUMER
    ARB_VRF --> ARB_CONSUMER
    
    ETH_CONSUMER <--> LZ
    ARB_CONSUMER <--> LZ
    OPT_CONSUMER <--> LZ
    
    LZ --> ETH_CONSUMER
    LZ --> ARB_CONSUMER
    LZ --> OPT_CONSUMER
    
    %% Apply styling
    classDef eth fill:#eceff1,stroke:#546e7a,color:#263238
    classDef arb fill:#ede7f6,stroke:#7e57c2,color:#311b92
    classDef opt fill:#e3f2fd,stroke:#42a5f5,color:#0d47a1
    classDef lz fill:#e8f5e9,stroke:#66bb6a,color:#1b5e20
    
    %% Style subgraphs
    style Ethereum fill:#eceff1,stroke:#cfd8dc,color:#263238
    style Arbitrum fill:#ede7f6,stroke:#d1c4e9,color:#311b92
    style Optimism fill:#e3f2fd,stroke:#bbdefb,color:#0d47a1
    style LayerZero fill:#e8f5e9,stroke:#c8e6c9,color:#1b5e20
```

## Security Model

The diagram below illustrates our multi-layered security approach:

```mermaid
flowchart TB
    %% Security layers
    subgraph InputSecurity ["Input Security"]
        direction LR
        MULTI["Multiple Sources"]:::sec1
        THRESH["Threshold Security"]:::sec1
        COMMIT["Commit-Reveal"]:::sec1
    end
    
    subgraph VerificationSecurity ["Verification Security"]
        direction LR
        SIG["Signature Verification"]:::sec2
        HASH["Hash Verification"]:::sec2
        PROOF["Zero-Knowledge Proofs"]:::sec2
    end
    
    subgraph OutputSecurity ["Output Security"]
        direction LR
        BUFFER["Randomness Buffer"]:::sec3
        COMBINE["Weighted Combination"]:::sec3
        DELAY["Time-Delayed Release"]:::sec3
    end
    
    %% Connect security layers
    InputSecurity --> VerificationSecurity
    VerificationSecurity --> OutputSecurity
    
    %% Apply styling
    classDef sec1 fill:#ffebee,stroke:#ef5350,color:#b71c1c
    classDef sec2 fill:#e8eaf6,stroke:#7986cb,color:#1a237e
    classDef sec3 fill:#e0f2f1,stroke:#4db6ac,color:#004d40
    
    %% Style subgraphs
    style InputSecurity fill:#ffebee,stroke:#ffcdd2,color:#b71c1c
    style VerificationSecurity fill:#e8eaf6,stroke:#c5cae9,color:#1a237e
    style OutputSecurity fill:#e0f2f1,stroke:#b2dfdb,color:#004d40
```

## Implementation Components

The following class diagram shows the main components of our randomness system:

```mermaid
classDiagram
    %% Define main classes
    class IRandomnessProvider {
        <<interface>>
        +requestRandomness(bytes32 seed) bytes32
        +verifyRandomness(bytes proof) bool
    }
    
    class DragonVRFConsumer {
        -mapping providers
        -mapping requests
        -uint256 threshold
        +addProvider(address provider)
        +removeProvider(address provider)
        +requestRandomness() bytes32
        +fulfillRandomness(bytes32 requestId, uint256 randomness)
    }
    
    class RandomnessBuffer {
        -mapping values
        -uint256 capacity
        +addRandomness(uint256 value)
        +getRandomness() uint256
        +getRandomInRange(uint256 min, uint256 max) uint256
    }
    
    class dRANDIntegrator {
        -bytes publicKey
        +verifyRandomness(bytes signature, bytes message) bool
        +fetchLatestRandomness() bytes32
    }
    
    class ChainlinkVRFIntegrator {
        -address coordinator
        -bytes32 keyHash
        +requestRandomness() bytes32
        +fulfillRandomWords(bytes32 requestId, uint256[] randomWords)
    }
    
    %% Define relationships
    IRandomnessProvider <|-- dRANDIntegrator
    IRandomnessProvider <|-- ChainlinkVRFIntegrator
    DragonVRFConsumer --> IRandomnessProvider
    DragonVRFConsumer --> RandomnessBuffer
    
    %% Apply styling
    classDef interface fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    classDef consumer fill:#f3e5f5,stroke:#9c27b0,color:#4a148c
    classDef provider fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    classDef utility fill:#fff3e0,stroke:#ff9800,color:#e65100
    
    class IRandomnessProvider interface
    class DragonVRFConsumer consumer
    class RandomnessBuffer utility
    class dRANDIntegrator provider
    class ChainlinkVRFIntegrator provider
```

By integrating multiple sources of randomness and utilizing a secure aggregation mechanism, OmniDragon achieves a highly secure and reliable source of randomness that is resistant to manipulation and single points of failure.
