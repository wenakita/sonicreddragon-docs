---
sidebar_position: 1
title: Protocol Architecture Overview
description: Comprehensive overview of the OmniDragon protocol architecture
---

# Protocol Architecture Overview

The OmniDragon protocol implements a sophisticated multi-chain architecture that integrates several key components to create a secure, scalable, and feature-rich ecosystem. This document provides a comprehensive overview of the entire system architecture.

## System Overview

OmniDragon's architecture consists of several interconnected components that work together to provide a complete ecosystem:

```mermaid
flowchart TB
subgraph "Core Protocol"
    TOKEN["OmniDragon Token"]
    JACKPOT["Jackpot System"]
    RANDOM["Randomness Infrastructure"]
    CROSS["Cross-Chain Bridge"]
    GOV["ve69LP Governance"]
    subgraph "External Integrations"
    LZ["LayerZero"]
    DRAND["Drand Network"]
    CHAIN["Chainlink VRF"]
    DEX["Decentralized Exchanges"]
    subgraph "User Interfaces"
    WEB["Web Interface"]
    SDK["Developer SDK"]
    API["API Layer"]
    TOKEN -->|> JACKPOT
    TOKEN| CROSS
    TOKEN -->|> GOV
    JACKPOT| RANDOM
    RANDOM -->|> DRAND
    RANDOM| CHAIN
    CROSS -->|> LZ
    TOKEN| DEX
    WEB -->|>|> TOKEN
    SDK| TOKEN
    API| TOKEN
    classDef core fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef external fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef interface fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    class TOKEN core
    class JACKPOTRANDO core
    class M core
    class CROSS core
    class GOV core
    class LZ external
    class DRANDCHAIN external
    class DEX external
    class WEB interface_style_style_style_style_style_style_style_style_style_style_style_style
    class SDKAPI interface_style_style_style_style_style_style_style_style_style_style_style_style
endend
endend
end
```

## Core Components

### 1. OmniDragon Token

The OmniDragon token (DRAGON) is the central component of the protocol:

-**ERC-20 Compatible**: Standard token interface for broad compatibility
-**Fee Mechanism**: 10% fee on transactions distributed to various components
-**Cross-Chain Capability**: Ability to move between supported blockchains
-**Deflationary Model**: Automatic burn mechanism reduces supply over time

### 2. Jackpot System

The jackpot system provides an automatic jackpot for token holders:

-**Entry Mechanism**: Buy transactions automatically qualify for jackpot entries
-**Probability Engine**: Calculates win probability based on multiple factors
-**Reward Distribution**: Automatically distributes rewards to winners
-**Funding Source**: 6.9% of all fees fund the jackpot vault

### 3. Randomness Infrastructure

The randomness infrastructure provides secure, verifiable random numbers:

-**Multiple Sources**: Combines Drand, Chainlink VRF, and custom oracles
-**Verification Layer**: Cryptographically verifies all randomness sources
-**Aggregation Logic**: Combines multiple sources for enhanced security
-**Distribution System**: Delivers randomness to consuming applications

### 4. Cross-Chain Bridge

The cross-chain bridge enables seamless operation across multiple blockchains:

-**LayerZero Integration**: Uses LayerZero for secure cross-chain messaging
-**Token Bridging**: Allows tokens to move between supported chains
-**Message Passing**: Enables cross-chain communication for protocol components
-**Security Measures**: Implements multiple security layers for cross-chain operations

### 5. ve69LP Governance

The governance system enables community-driven decision making:

-**Vote-Escrowed Model**: Longer lock periods grant higher voting power
-**Fee Distribution**: Governance participants earn a share of protocol fees
-**Proposal System**: Allows community members to propose and vote on changes
-**Parameter Control**: Governs key protocol parameters and upgrades

## System Interactions

### Token Purchase Flow

When a user purchases tokens, several system interactions occur:
```

```mermaidsequenceDiagram
participant User
participant DEX
participant Token
participant SwapTrigger
participant JackpotVault
participant Ve69LP
    User ->> DEX: Buy DRAGON tokens
    DEX ->> Token: Transfer tokens to user
    Token ->> Token: Apply 10% fee
    Token ->> JackpotVault: Send 6.9% to jackpot
    Token ->> Ve69LP: Send 2.41% to governance
    Token ->> Token: Burn 0.69%
    Token ->> SwapTrigger: Notify of purchase
    SwapTrigger ->> SwapTrigger: Process jackpot entry
```

### Jackpot Winner Flow

When a user wins the jackpot, the following interactions occur:

```mermaidsequenceDiagram
participant User
participant SwapTrigger
participant RandomnessProvider
participant JackpotDistributor
participant JackpotVault
    User ->> SwapTrigger: Buy triggers jackpot entry
    SwapTrigger ->> RandomnessProvider: Request randomness
    RandomnessProvider ->> RandomnessProvider: Generate randomness
    RandomnessProvider ->> JackpotDistributor: Provide randomness
    JackpotDistributor ->> JackpotDistributor: Determine winner
    JackpotDistributor ->> JackpotVault: Request reward distribution
    JackpotVault ->> User: Transfer reward
```

### Cross-Chain Transfer Flow

When a user transfers tokens between chains, the following interactions occur:
```

```mermaidsequenceDiagram
participant User
participant SourceToken
participant SourceBridge
participant LayerZero
participant DestBridge
participant DestToken
    User ->> SourceToken: Approve bridge
    User ->> SourceBridge: Request cross-chain transfer
    SourceBridge ->> SourceToken: Burn tokens
    SourceBridge ->> LayerZero: Send cross-chain message
    LayerZero ->> DestBridge: Deliver message
    DestBridge ->> DestBridge: Verify message
    DestBridge ->> DestToken: Mint tokens
    DestToken ->> User: Receive tokens on destination chain
```

## Contract Architecture

The protocol's smart contract architecture follows a modular design:

```mermaidclassDiagram
class OmniDragon {
+address swapTrigger
        +address jackpotVault
        +address ve69LP
        +transfer()
        +_tryProcessLotteryEntry()
        +processPartnerJackpotEntry()
    }
    class OmniDragonSwapTriggerOracle {
+address omniDragon
        +address jackpotDistributor
        +onSwap()
        +calculateWinProbability()
        +getAggregatedPrice()
    }
    class DragonJackpotVault {
+address omniDragon
        +address distributor
        +uint256 availableJackpotAmount
        +addToJackpot()
        +distributeJackpot()
        +getAvailableJackpot()
    }
    class DragonJackpotDistributor {
+address jackpotVault
        +triggerJackpot()
        +distributeJackpot()
    }
    class RandomnessProvider {
+requestRandomness()
        +fulfillRandomness()
        +getVerifiedRandom()
    }
    class Ve69LP {
+address omniDragon
        +lock()
        +unlock()
        +vote()
        +getVotingPower()
    }
    class CrossChainBridge {
+address omniDragon
        +address lzEndpoint
        +sendTokens()
        +receiveTokens()
        +lzReceive()
    }
    OmniDragon -->|> OmniDragonSwapTriggerOracle : triggers
    OmniDragon| DragonJackpotVault : sends fees
    OmniDragon -->|> Ve69LP : sends fees
    OmniDragon| CrossChainBridge : enables cross-chain
    OmniDragonSwapTriggerOracle -->|>|> DragonJackpotDistributor : notifies
    DragonJackpotDistributor| DragonJackpotVault : requests funds
    DragonJackpotDistributor| RandomnessProvider : requests randomness
```

## Cross-Chain Architecture

The protocol's cross-chain architecture enables operation across multiple blockchains:
```

```mermaid
flowchart TB
subgraph "Ethereum"
    ETH_TOKEN["OmniDragon Token"]
    ETH_BRIDGE["Cross-Chain Bridge"]
    ETH_LZ["LayerZero Endpoint"]
    subgraph "BNB Chain"
    BSC_TOKEN["OmniDragon Token"]
    BSC_BRIDGE["Cross-Chain Bridge"]
    BSC_LZ["LayerZero Endpoint"]
    subgraph "Arbitrum"
    ARB_TOKEN["OmniDragon Token"]
    ARB_BRIDGE["Cross-Chain Bridge"]
    ARB_LZ["LayerZero Endpoint"]
    subgraph "Avalanche"
    AVAX_TOKEN["OmniDragon Token"]
    AVAX_BRIDGE["Cross-Chain Bridge"]
    AVAX_LZ["LayerZero Endpoint"]
    ETH_TOKEN -->|> ETH_BRIDGE
    ETH_BRIDGE| ETH_LZ
    BSC_TOKEN -->|> BSC_BRIDGE
    BSC_BRIDGE| BSC_LZ
    ARB_TOKEN -->|> ARB_BRIDGE
    ARB_BRIDGE| ARB_LZ
    AVAX_TOKEN -->|>|>|>|>|>|>|> AVAX_BRIDGE
    AVAX_BRIDGE| AVAX_LZ
    ETH_LZ <| BSC_LZ
    ETH_LZ <| ARB_LZ
    ETH_LZ <| AVAX_LZ
    BSC_LZ <| ARB_LZ
    BSC_LZ <| AVAX_LZ
    ARB_LZ <| AVAX_LZ
    classDef eth fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef bsc fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef arb fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef avax fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    class ETH_TOKEN eth
    class ETH_BRIDGE_LZ eth
    class BSC_TOKEN bsc
    class BSC_BRIDGE_LZ bsc
    class ARB_TOKEN arb
    class ARB_BRIDGE_LZ arb
    class AVAX_TOKEN avax
    class AVAX_BRIDGE_LZ avax
endend
endend
endend
end
```

## Security Architecture

The protocol implements a multi-layered security architecture:

```mermaid
flowchart TB
subgraph "Protocol Security Layers"
    CRYPTO["Cryptographic Security"]
    CONTRACT["Smart Contract Security"]
    ECONOMIC["Economic Security"]
    GOVERNANCE["Governance Security"]
    OPERATIONAL["Operational Security"]
    subgraph "External Security"
    AUDIT["External Audits"]
    BOUNTY["Bug Bounty Program"]
    MONITORING["24/7 Monitoring"]
    CRYPTO -->|> CONTRACT
    CONTRACT| ECONOMIC
    ECONOMIC -->|> GOVERNANCE
    GOVERNANCE| OPERATIONAL
    AUDIT -->|>|> CONTRACT
    BOUNTY| CONTRACT
    MONITORING| OPERATIONAL
    classDef protocol fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef external fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    class CRYPTO protocol
    class CONTRACTECONOMI protocol
    class C protocol
    class GOVERNANCE protocol
    class OPERATIONAL protocol
    class AUDIT external
    class BOUNTYMONITORING external
end
end
```

## Data Flow

The protocol's data flow illustrates how information and value move through the system:
```

```mermaidflowchart TB
A[User Transaction] -->|> B[Token Contract]
    B| C[Fee Collection]
    C -->|> D[Fee Distribution]
    D| E[Jackpot Vault]
    D -->|> F[ve69LP Governance]
    D| G[Token Burn]
    B -->|> H[Swap Trigger Oracle]
    H| I[Lottery Entry Processing]
    I -->|> J[Randomness Provider]
    J| K[Winner Selection]
    K -->|> L[Reward Distribution]
    B| M[Cross-Chain Bridge]
    M -->|> N[LayerZero Endpoint]
    N| O[Destination Chain]
    classDef user fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef token fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef fee fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef jackpot fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    classDef bridge fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    class A user
    class B token
    class CD token
    class E fee
    class FG fee
    class H jackpot
    class I jackpot
    class J jackpot
    class K jackpot
    class L jackpot
    class M bridge
    class NO bridge
```

## Key Features Summary

| Component | Key Features |
|-----------|--------------|
| Token | ERC-20 compatible, 10% fee, cross-chain capability, deflationary |
| Jackpot | Automatic entry, probability engine, reward distribution |
| Randomness | Multiple sources, verification layer, aggregation logic |
| Cross-Chain | LayerZero integration, token bridging, message passing |
| Governance | Vote-escrowed model, fee distribution, proposal system |

## Integration Points

The protocol provides several integration points for developers:

1.**Token Integration**: Integrate with the OmniDragon token for payments and transfers
2.**Jackpot Integration**: Build applications that leverage the jackpot system
3.**Randomness Integration**: Use the randomness infrastructure for secure random numbers
4.**Cross-Chain Integration**: Build cross-chain applications using the bridge
5.**Governance Integration**: Participate in governance through the ve69LP system

## Further Reading

- [Token System](/concepts/fee-system-consolidated.md): Detailed information about the token mechanics
- [Fee System](/concepts/fee-system-consolidated.md): In-depth explanation of the fee mechanism
- [Jackpot System](/concepts/jackpot-system-consolidated.md): Comprehensive documentation of the jackpot system
- [Cross-Chain Architecture](/concepts/cross-chain-consolidated.md): Detailed explanation of cross-chain functionality
- [Randomness System](/concepts/randomness-consolidated.md): In-depth documentation of the randomness infrastructure
- [Security Model](/concepts/security-model-consolidated.md): Comprehensive overview of the security architecture
