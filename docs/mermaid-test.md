---
sidebar_position: 10
title: Mermaid Diagram Test
---

# Mermaid Diagram Test

This page contains various Mermaid diagrams to test our implementation.

## Simple Flowchart

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Continue]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant API
    participant Database

    User->>API: Request data
    activate API
    API->>Database: Query data
    activate Database
    Database-->>API: Return results
    deactivate Database
    API-->>User: Response with data
    deactivate API
```

## Class Diagram

```mermaid
classDiagram
    class Token {
        +string name
        +string symbol
        +uint256 totalSupply
        +transfer(address, uint256)
        +approve(address, uint256)
    }
    
    class Omni {
        +string name
        +string symbol
        +address endpoint
        +sendCrossChain(uint16, bytes, bytes)
    }
    
    Token <|-- Omni
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Processing: Submit
    Processing --> Completed: Success
    Processing --> Failed: Error
    Completed --> [*]
    Failed --> Pending: Retry
```

## Entity Relationship

```mermaid
erDiagram
    USER ||--o{ TOKEN : owns
    USER {
        string address
        uint256 balance
    }
    TOKEN {
        string name
        string symbol
        uint256 amount
    }
    TOKEN ||--o{ TRANSACTION : involves
    TRANSACTION {
        uint256 id
        uint256 amount
        uint256 timestamp
    }
```

## Gantt Chart

```mermaid
gantt
    title Sonic Red Dragon Development Roadmap
    dateFormat  YYYY-MM-DD
    
    section Planning
    Research           :done, a1, 2023-01-01, 30d
    Design             :done, a2, after a1, 45d
    
    section Development
    Smart Contracts    :active, b1, after a2, 60d
    Frontend           :b2, after a2, 60d
    Testing            :b3, after b1, 30d
    
    section Launch
    Audit              :c1, after b3, 30d
    Mainnet Deployment :c2, after c1, 10d
    Marketing          :c3, after c2, 30d
```

## Journey Diagram

```mermaid
journey
    title User Journey for Sonic Red Dragon
    section Discover
      Learn about Sonic Red Dragon: 5: User
      Visit documentation: 3: User
    section Interact
      Get tokens: 5: User, Web App
      Use cross-chain features: 4: User, Web App
    section Engage
      Join community: 5: User, Community
      Provide feedback: 3: User, Community
```

## Using StandardMermaid Component

<StandardMermaid chart={`graph LR
    A[Component] --> B[Rendering]
    B --> C[Animation]
    C --> D[Interactive]
`} />

## Using EnhancedMermaid Component

<EnhancedMermaid
  chart={`flowchart LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D
  `}
  caption="Enhanced Mermaid Diagram with Caption"
  theme="forest"
/>

## Using AnimatedCard with Mermaid

<AnimatedCard title="Cross-Chain Architecture">

Here's how our cross-chain architecture works:

```mermaid
graph TD
    A[User] -->|Request| B[Ethereum]
    A -->|Request| C[Avalanche]
    A -->|Request| D[Arbitrum]
    B <-->|LayerZero| C
    B <-->|LayerZero| D
    C <-->|LayerZero| D
    B --> E[Sonic Red Dragon Protocol]
    C --> E
    D --> E
```

</AnimatedCard> 