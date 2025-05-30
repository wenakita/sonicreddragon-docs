---
sidebar_position: 1
---

# OmniDragon Protocol

Welcome to the official documentation for the OmniDragon Protocol - a specialized token with built-in fees, lottery entries, and cross-chain functionality.

import ImmersiveMermaid from '@site/src/components/ImmersiveMermaid';

## Protocol Overview

OmniDragon is a next-generation token protocol that combines innovative tokenomics with cross-chain functionality and a built-in lottery system.

<ImmersiveMermaid
  chart={`
    graph TB
      subgraph "Core Protocol"
        OD[OmniDragon Token] --> |Fees| FD[Fee Distribution]
        OD --> |Lottery Entries| LM[Lottery Manager]
        OD --> |Cross-Chain| CC[Cross-Chain Bridge]
      end
      
      subgraph "Fee Distribution"
        FD --> |6.9%| JV[Jackpot Vault]
        FD --> |2.41%| VE[ve69LP Fee Distributor]
        FD --> |0.69%| BN[Token Burn]
      end
      
      subgraph "Lottery System"
        LM --> |Requests Randomness| RP[Randomness Provider]
        RP --> |VRF Sources| VRF[Chainlink VRF / Drand]
        LM --> |Triggers Payout| JV
      end
      
      subgraph "Cross-Chain"
        CC --> |LayerZero| OC[Other Chains]
      end
      
      style OD fill:#6942ff,color:#fff,stroke:#fff
      style FD fill:#4b30b3,color:#fff,stroke:#fff
      style LM fill:#4b30b3,color:#fff,stroke:#fff
      style CC fill:#4b30b3,color:#fff,stroke:#fff
      style JV fill:#ff6900,color:#fff,stroke:#fff
      style VE fill:#ff6900,color:#fff,stroke:#fff
      style BN fill:#ff6900,color:#fff,stroke:#fff
      style RP fill:#00bfff,color:#fff,stroke:#fff
      style VRF fill:#00bfff,color:#fff,stroke:#fff
      style OC fill:#00bfff,color:#fff,stroke:#fff
  `}
  title="OmniDragon Protocol Architecture"
  caption="High-level overview of the OmniDragon protocol components and their interactions"
/>

## Key Features

### Built-in Fee Distribution

On all DRAGON swaps, fees are automatically distributed:

<ImmersiveMermaid
  chart={`
    pie
      title "OmniDragon Fee Distribution"
      "Jackpot Vault (6.9%)" : 6.9
      "ve69LP Fee Distributor (2.41%)" : 2.41
      "Token Burn (0.69%)" : 0.69
  `}
  title="Fee Distribution"
  caption="Automatic fee distribution on all DRAGON swaps"
/>

### Lottery System

Every buy transaction qualifies for lottery entries, giving users a chance to win from the jackpot.

<ImmersiveMermaid
  chart={`
    sequenceDiagram
      participant User
      participant OmniDragon
      participant LotteryManager
      participant RandomnessProvider
      participant JackpotVault
      
      User->>OmniDragon: Buy DRAGON tokens
      OmniDragon->>LotteryManager: Create lottery entry
      LotteryManager->>RandomnessProvider: Request randomness
      RandomnessProvider-->>LotteryManager: Return secure random number
      
      alt User wins lottery
        LotteryManager->>JackpotVault: Trigger jackpot payout
        JackpotVault->>User: Transfer jackpot reward
      else User doesn't win
        LotteryManager->>LotteryManager: Record entry in history
      end
  `}
  title="Lottery System Flow"
  caption="How the lottery system processes entries and determines winners"
/>

### Cross-Chain Functionality

OmniDragon operates seamlessly across multiple blockchains using LayerZero technology.

<ImmersiveMermaid
  chart={`
    graph LR
      subgraph "Sonic Chain"
        OD1[OmniDragon]
        LZ1[LayerZero Endpoint]
      end
      
      subgraph "Ethereum"
        OD2[OmniDragon]
        LZ2[LayerZero Endpoint]
      end
      
      subgraph "Arbitrum"
        OD3[OmniDragon]
        LZ3[LayerZero Endpoint]
      end
      
      OD1 <--> LZ1
      OD2 <--> LZ2
      OD3 <--> LZ3
      
      LZ1 <--> LZ2
      LZ1 <--> LZ3
      LZ2 <--> LZ3
      
      style OD1 fill:#6942ff,color:#fff,stroke:#fff
      style OD2 fill:#6942ff,color:#fff,stroke:#fff
      style OD3 fill:#6942ff,color:#fff,stroke:#fff
      style LZ1 fill:#00bfff,color:#fff,stroke:#fff
      style LZ2 fill:#00bfff,color:#fff,stroke:#fff
      style LZ3 fill:#00bfff,color:#fff,stroke:#fff
  `}
  title="Cross-Chain Architecture"
  caption="OmniDragon's cross-chain functionality via LayerZero"
/>

## Core Components

The OmniDragon protocol consists of several key components:

### OmniDragon Token

The main token contract with built-in fee distribution and lottery integration.

<ImmersiveMermaid
  chart={`
    classDiagram
      class OmniDragon {
        +address jackpotVault
        +address revenueDistributor
        +address lzEndpoint
        +address chainRegistry
        +uint256 MAX_SUPPLY
        +uint256 INITIAL_SUPPLY
        +transfer(address to, uint256 amount)
        +processLotteryEntry(address user, uint256 amount)
        +distributeFees(uint256 jackpotAmount, uint256 ve69Amount)
        +sendTokens(uint16 dstChainId, bytes32 toAddress, uint256 amount)
      }
      
      class ERC20 {
        +string name
        +string symbol
        +uint256 totalSupply
        +balanceOf(address account)
        +transfer(address to, uint256 amount)
        +approve(address spender, uint256 amount)
        +transferFrom(address from, address to, uint256 amount)
      }
      
      class Ownable {
        +address owner
        +onlyOwner()
        +transferOwnership(address newOwner)
      }
      
      class ReentrancyGuard {
        +nonReentrant()
      }
      
      OmniDragon --|> ERC20
      OmniDragon --|> Ownable
      OmniDragon --|> ReentrancyGuard
  `}
  title="OmniDragon Token Contract"
  caption="Main token contract structure and inheritance"
/>

### Lottery Manager

Manages lottery entries, calculates win probabilities, and triggers jackpot payouts.

<ImmersiveMermaid
  chart={`
    classDiagram
      class OmniDragonLotteryManager {
        +address omniDragonToken
        +address jackpotVault
        +address randomnessProvider
        +address priceOracle
        +uint256 BASE_WIN_PROB_BPS
        +uint256 MAX_BOOSTED_WIN_PROB_BPS
        +createLotteryEntry(address user, uint256 amount, uint256 votingPower)
        +fulfillRandomness(uint256 requestId, uint256 randomValue)
        +calculateLotteryProbability(uint256 swapAmount, uint256 votingPower)
        +calculateJackpotPayout(uint256 jackpotSize, uint256 winnerVotingPower)
      }
      
      class LotteryEntry {
        +address user
        +uint256 swapAmountUSD
        +uint256 userVotingPower
        +uint256 probabilityBps
        +uint256 timestamp
        +uint256 randomnessRequestId
        +bool processed
        +bool won
        +uint256 payoutAmount
      }
      
      OmniDragonLotteryManager -- LotteryEntry : manages
  `}
  title="Lottery Manager"
  caption="Manages lottery entries and win calculations"
/>

### Randomness Provider

Provides secure randomness from multiple sources for the lottery system.

<ImmersiveMermaid
  chart={`
    classDiagram
      class OmniDragonRandomnessProvider {
        +enum VRFSource
        +requestRandomness()
        +drawFromRandomnessPool()
        +fulfillRandomness(uint256 requestId, uint256 randomValue)
        +aggregateDrandRandomness()
      }
      
      class VRFSource {
        CHAINLINK_V2_5
        DRAND_BEACON
        CHAINLINK_V2_0
        DRAND_QUICKNET
        DRAND_EVMNET
      }
      
      OmniDragonRandomnessProvider -- VRFSource
  `}
  title="Randomness Provider"
  caption="Manages multiple sources of verifiable randomness"
/>

## Protocol Rules

The OmniDragon protocol follows these core rules:

<ImmersiveMermaid
  chart={`
    graph TD
      A[DRAGON Swap] --> B{Fee Distribution}
      B -->|6.9%| C[Jackpot Vault]
      B -->|2.41%| D[ve69LP Fee Distributor]
      B -->|0.69%| E[Token Burn]
      A --> F{Transaction Type}
      F -->|Buy| G[Qualify for Lottery]
      F -->|Sell| H[No Lottery Entry]
      F -->|Transfer| I[No Lottery Entry]
      
      style A fill:#6942ff,color:#fff,stroke:#fff
      style B fill:#4b30b3,color:#fff,stroke:#fff
      style C fill:#ff6900,color:#fff,stroke:#fff
      style D fill:#ff6900,color:#fff,stroke:#fff
      style E fill:#ff6900,color:#fff,stroke:#fff
      style F fill:#4b30b3,color:#fff,stroke:#fff
      style G fill:#00bfff,color:#fff,stroke:#fff
      style H fill:#666,color:#fff,stroke:#fff
      style I fill:#666,color:#fff,stroke:#fff
  `}
  title="Protocol Rules"
  caption="Core rules governing the OmniDragon protocol"
/>

## Getting Started

Ready to dive deeper into the OmniDragon protocol? Check out these guides:

- [Protocol Architecture](./concepts/architecture.md)
- [Fee System](./concepts/fee-system.md)
- [Lottery System](./concepts/jackpot.md)
- [Cross-Chain Functionality](./concepts/cross-chain.md)
- [Smart Contracts](./contracts/overview.md)
