---
title: Enhanced Mermaid Diagrams
description: Showcase of our enhanced Mermaid diagram rendering with animations and interactive features
---

# Enhanced Mermaid Diagrams

This page demonstrates our enhanced Mermaid diagram rendering with animations and interactive features.

## Basic Mermaid Diagram

Here's a basic Mermaid diagram that uses our modern styling:

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
```

## Immersive Mermaid Diagram

For more important diagrams, you can use the immersive style by wrapping your Mermaid code block in a div with the `immersive-diagram` class:

<div className="immersive-diagram">

```mermaid
flowchart LR
    A[Dragon Protocol] --> B[Randomness]
    A --> C[Cross-Chain]
    A --> D[Jackpot]
    B --> E[VRF]
    B --> F[dRand]
    C --> G[LayerZero]
    C --> H[Wormhole]
    D --> I[Staking]
    D --> J[Rewards]
```

</div>

## Diagram with Title and Caption

You can add titles and captions to your diagrams:

<div className="immersive-diagram">
  <h3 className="diagram-title">Dragon Protocol Architecture</h3>

  ```mermaid
  flowchart TD
      A[User Interface] --> B[Smart Contract Layer]
      B --> C[Core Protocol]
      C --> D1[Randomness Module]
      C --> D2[Cross-Chain Module]
      C --> D3[Jackpot Module]
      D1 --> E1[VRF Service]
      D1 --> E2[dRand Network]
      D2 --> F1[LayerZero]
      D2 --> F2[Wormhole]
      D3 --> G1[Staking Contract]
      D3 --> G2[Rewards Distribution]
  ```

  <p className="diagram-caption">High-level architecture of the Dragon Protocol ecosystem</p>
</div>

## Sequence Diagram

Sequence diagrams are great for showing interactions between components:

```mermaid
sequenceDiagram
    participant User
    participant Contract
    participant Oracle

    User->>Contract: Request Randomness
    Contract->>Oracle: Forward Request
    Oracle->>Oracle: Generate Random Number
    Oracle->>Contract: Return Result
    Contract->>User: Process Result
```

## Class Diagram

Class diagrams help visualize the structure of your system:

<div className="immersive-diagram">

```mermaid
classDiagram
    class DragonProtocol {
        +address owner
        +initialize()
        +configureRandomness()
        +executeCrossChain()
    }
    
    class RandomnessModule {
        +requestRandomness()
        +fulfillRandomness()
    }
    
    class CrossChainModule {
        +sendMessage()
        +receiveMessage()
    }
    
    class JackpotModule {
        +enterJackpot()
        +drawWinner()
        +claimReward()
    }
    
    DragonProtocol --> RandomnessModule
    DragonProtocol --> CrossChainModule
    DragonProtocol --> JackpotModule
```

</div>

## State Diagram

State diagrams show the different states of a system:

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Request Received
    Processing --> Success: Valid Result
    Processing --> Failed: Error
    Success --> Idle: Reset
    Failed --> Idle: Reset
    Failed --> [*]: Critical Error
```

## Entity Relationship Diagram

ER diagrams show the relationships between entities:

<div className="immersive-diagram">

```mermaid
erDiagram
    USER ||--o{ TICKET : purchases
    TICKET ||--o{ DRAW : participates
    DRAW }|--|| JACKPOT : funds
    JACKPOT ||--o{ WINNER : rewards
```

</div>

## Gantt Chart

Gantt charts are useful for project planning:

```mermaid
gantt
    title Dragon Protocol Development Roadmap
    dateFormat  YYYY-MM-DD
    
    section Phase 1
    Research & Design           :done,    des1, 2023-01-01, 2023-03-01
    Core Development            :active,  des2, 2023-03-01, 2023-06-01
    
    section Phase 2
    Randomness Integration      :         des3, 2023-06-01, 2023-08-01
    Cross-Chain Implementation  :         des4, 2023-08-01, 2023-10-01
    
    section Phase 3
    Jackpot Mechanism           :         des5, 2023-10-01, 2023-12-01
    Security Audit              :         des6, 2023-12-01, 2024-01-01
    Mainnet Launch              :         des7, 2024-01-01, 2024-02-01
```

## Interactive Features

All diagrams have interactive features:

1. **Node Highlighting**: Click on any node to highlight it and its connections
2. **Hover Effects**: Hover over nodes and edges for visual feedback
3. **Controls**: Use the controls to replay animations, toggle fullscreen, or download the diagram
4. **Responsive**: Diagrams adapt to different screen sizes

## Complex Example

Here's a more complex example showing the randomness flow:

<div className="immersive-diagram">
  <h3 className="diagram-title">Randomness Flow</h3>

  ```mermaid
  flowchart TD
      subgraph User["User Application"]
        A[User Interface]
        B[Client Logic]
      end
      
      subgraph Protocol["Dragon Protocol"]
        C[Request Handler]
        D[Verification Module]
        E[Response Processor]
      end
      
      subgraph Sources["Randomness Sources"]
        F[VRF Service]
        G[dRand Network]
        H[Chain-specific RNG]
      end
      
      subgraph Security["Security Layer"]
        I[Proof Verification]
        J[Fraud Detection]
        K[Backup Systems]
      end
      
      A --> B
      B -->|Submit Request| C
      C -->|Process Request| D
      D -->|Request Randomness| F
      D -->|Request Randomness| G
      D -->|Request Randomness| H
      F -->|Return Proof| I
      G -->|Return Proof| I
      H -->|Return Proof| I
      I -->|Verified Proof| E
      J -->|Monitor| I
      K -->|Backup| D
      E -->|Return Result| B
      B -->|Update UI| A
  ```

  <p className="diagram-caption">Detailed flow of randomness generation and verification in the Dragon Protocol</p>
</div>

## Conclusion

With our enhanced Mermaid integration, you can create beautiful, interactive diagrams that make your documentation more engaging and easier to understand. Use these features to visualize complex systems, workflows, and relationships in an elegant way.

For more information on how to create these diagrams, see the [Elegant Diagrams](/docs/guide/elegant-diagrams) guide.
