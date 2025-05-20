---
title: Cross-Chain Architecture
sidebar_position: 5
---

# OmniDragon Cross-Chain Architecture

OmniDragon is built from the ground up as a cross-chain token system, enabling seamless operations across multiple blockchains while maintaining coherent state and security.

## System Architecture

The diagram below illustrates the high-level architecture of OmniDragon's cross-chain functionality:

```mermaid
flowchart TB
    %% Define main components with clear visual hierarchy
    subgraph Core ["Core Protocol"]
        direction TB
        TOKEN["OmniDragon Token"]:::core
        BRIDGE["OmniDragon Bridge"]:::core
        ROUTER["Message Router"]:::core
    end
    
    subgraph LZ ["LayerZero Protocol"]
        direction TB
        LZ_EP["LayerZero Endpoint"]:::lz
        LZ_R["LayerZero Relayer"]:::lz
        LZ_O["LayerZero Oracle"]:::lz
    end
    
    subgraph Networks ["Blockchain Networks"]
        direction LR
        ETH["Ethereum"]:::eth
        ARB["Arbitrum"]:::arb
        OPT["Optimism"]:::opt
        BSC["BNB Chain"]:::bsc
        AVAX["Avalanche"]:::avax
    end
    
    %% Connect components
    TOKEN -->|Uses| BRIDGE
    BRIDGE -->|Uses| ROUTER
    ROUTER -->|Sends via| LZ_EP
    LZ_EP -->|Relayed by| LZ_R
    LZ_EP -->|Verified by| LZ_O
    
    %% Connect networks to protocol
    ETH --- LZ_EP
    ARB --- LZ_EP
    OPT --- LZ_EP
    BSC --- LZ_EP
    AVAX --- LZ_EP
    
    %% Apply styling
    classDef core fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    classDef lz fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    classDef eth fill:#eceff1,stroke:#607d8b,color:#263238
    classDef arb fill:#ede7f6,stroke:#7e57c2,color:#311b92
    classDef opt fill:#e8eaf6,stroke:#5c6bc0,color:#1a237e
    classDef bsc fill:#fff8e1,stroke:#ffc107,color:#ff6f00
    classDef avax fill:#ffebee,stroke:#f44336,color:#b71c1c
    
    %% Style subgraphs
    style Core fill:#e3f2fd,stroke:#bbdefb,color:#0d47a1
    style LZ fill:#e8f5e9,stroke:#c8e6c9,color:#1b5e20
    style Networks fill:#f5f5f5,stroke:#e0e0e0,color:#424242
```

## Message Flow Sequence

The sequence diagram below demonstrates how messages and tokens flow between chains:

```mermaid
sequenceDiagram
    participant User
    participant Source as Source Chain
    participant Bridge as LayerZero Bridge
    participant Dest as Destination Chain
    
    %% Add styling to different sections
    rect rgb(238, 242, 255)
    note over User,Source: Transaction initiation
    end
    
    User->>+Source: Send tokens to destination chain
    Source->>Source: Lock or burn tokens
    Source->>+Bridge: Send cross-chain message
    
    rect rgb(239, 246, 239)
    note over Bridge: Cross-chain verification
    end
    
    Bridge->>Bridge: Validate message
    Bridge->>Bridge: Generate and verify proofs
    Bridge->>+Dest: Deliver verified message
    
    rect rgb(240, 244, 248)
    note over Dest,User: Transaction completion
    end
    
    Dest->>Dest: Process message
    Dest->>Dest: Mint or unlock tokens
    Dest->>-User: Credit tokens on destination
    
    Bridge-->>-Source: Confirm message processed
    Source-->>-User: Transaction complete
```

## Token Consistency Model

OmniDragon maintains token supply consistency across chains using a hybrid lock/mint model:

```mermaid
flowchart LR
    %% Define the consistency model
    subgraph Home ["Home Chain (Ethereum)"]
        direction TB
        MASTER["Master Supply"]:::primary
        LOCKED["Locked Tokens"]:::primary
    end
    
    subgraph Remote ["Remote Chains"]
        direction TB
        subgraph Chain1 ["Arbitrum"]
            ARB_SUPPLY["Local Supply"]:::secondary
        end
        
        subgraph Chain2 ["Optimism"]
            OPT_SUPPLY["Local Supply"]:::secondary
        end
        
        subgraph Chain3 ["BNB Chain"]
            BSC_SUPPLY["Local Supply"]:::secondary
        end
    end
    
    %% Define token flow
    MASTER -->|"Lock"| LOCKED
    LOCKED -->|"Unlock on return"| MASTER
    
    LOCKED -->|"Mint equivalent"| ARB_SUPPLY
    LOCKED -->|"Mint equivalent"| OPT_SUPPLY
    LOCKED -->|"Mint equivalent"| BSC_SUPPLY
    
    ARB_SUPPLY -->|"Burn on exit"| LOCKED
    OPT_SUPPLY -->|"Burn on exit"| LOCKED
    BSC_SUPPLY -->|"Burn on exit"| LOCKED
    
    %% Apply styling
    classDef primary fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    classDef secondary fill:#f3e5f5,stroke:#9c27b0,color:#4a148c
    
    %% Style subgraphs
    style Home fill:#e3f2fd,stroke:#bbdefb,color:#0d47a1
    style Remote fill:#f3e5f5,stroke:#e1bee7,color:#4a148c
    style Chain1 fill:#ede7f6,stroke:#d1c4e9,color:#311b92
    style Chain2 fill:#e8eaf6,stroke:#c5cae9,color:#1a237e
    style Chain3 fill:#fff8e1,stroke:#ffecb3,color:#ff6f00
```

## Contract Architecture

The following class diagram shows the key contracts that enable cross-chain functionality:

```mermaid
classDiagram
    %% Define key interfaces
    class IOmniDragonToken {
        <<interface>>
        +mint(address, uint256)
        +burn(address, uint256)
        +transferFrom(address, address, uint256)
    }
    
    class IOmniDragonBridge {
        <<interface>>
        +sendTokens(uint16 chainId, address to, uint256 amount)
        +receiveTokens(uint16 chainId, address to, uint256 amount)
    }
    
    class ILayerZeroEndpoint {
        <<interface>>
        +send(uint16 dstChainId, bytes payload, address payable refundAddress)
        +receivePayload(uint16 srcChainId, bytes srcAddress, bytes payload)
    }
    
    %% Define implementation classes
    class OmniDragonToken {
        -mapping balances
        -uint256 totalSupply
        -address bridge
        +mint(address, uint256)
        +burn(address, uint256)
        +transferFrom(address, address, uint256)
    }
    
    class OmniDragonBridge {
        -address token
        -address lzEndpoint
        -mapping remoteTokens
        -mapping remoteChains
        +sendTokens(uint16 chainId, address to, uint256 amount)
        +receiveTokens(uint16 chainId, address to, uint256 amount)
        +lzReceive(uint16 srcChainId, bytes srcAddress, bytes payload)
    }
    
    class LayerZeroEndpoint {
        -address relayer
        -address oracle
        +send(uint16 dstChainId, bytes payload, address payable refundAddress)
        +receivePayload(uint16 srcChainId, bytes srcAddress, bytes payload)
    }
    
    %% Define relationships
    IOmniDragonToken <|-- OmniDragonToken
    IOmniDragonBridge <|-- OmniDragonBridge
    ILayerZeroEndpoint <|-- LayerZeroEndpoint
    
    OmniDragonBridge --> OmniDragonToken
    OmniDragonBridge --> LayerZeroEndpoint
    
    %% Apply styling
    classDef interface fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    classDef token fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    classDef bridge fill:#f3e5f5,stroke:#9c27b0,color:#4a148c
    classDef lz fill:#fff8e1,stroke:#ffc107,color:#ff6f00
    
    class IOmniDragonToken interface
    class IOmniDragonBridge interface
    class ILayerZeroEndpoint interface
    class OmniDragonToken token
    class OmniDragonBridge bridge
    class LayerZeroEndpoint lz
```

## Security Features

OmniDragon's cross-chain system implements multiple security measures:

1. **Message Verification**: All cross-chain messages are cryptographically verified
2. **Oracle Validation**: Independent oracle networks verify cross-chain state
3. **Consistency Checks**: Built-in checks ensure token supply consistency across chains
4. **Relayer Redundancy**: Multiple relayers ensure message delivery
5. **Timeout Handling**: Automatic handling of timeout conditions with recovery mechanisms

By leveraging LayerZero's secure cross-chain messaging infrastructure and adding OmniDragon-specific security measures, the system ensures reliable and secure token movement across blockchain networks.
