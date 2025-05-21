---
sidebar_position: 1
title: Animated Ecosystem Diagrams
description: Interactive visualizations of the Sonic Red Dragon ecosystem with animation controls
---

# Animated Ecosystem Diagrams

This page demonstrates our interactive ecosystem diagrams with animation controls. Click the Play button below each diagram to see the flow animation.

## System Architecture

The Sonic Red Dragon architecture consists of several interconnected components that work together to provide cross-chain functionality, governance, and the jackpot system:

```mermaid
flowchart TD
    Token["OmniDragon Token"] --> LZ["LayerZero V2"]
    Token --> Governance["ve69LP Governance"]
    Token --> JackpotSystem["Jackpot System"]
    
    subgraph "Cross-Chain Infrastructure"
        LZ
        MessageLib["Message Library"]
        DVN["Data Verification Network"]
        Executor["Executor"]
    end
    
    subgraph "Governance System"
        Governance
        Treasury["Treasury"]
        VotingPower["Voting Power"]
        Rewards["Rewards Distribution"]
    end
    
    subgraph "Jackpot Infrastructure"
        JackpotSystem
        JackpotVault["Jackpot Vault"]
        SwapTrigger["Swap Trigger Oracle"]
        Distributor["Jackpot Distributor"]
    end
    
    LZ --> MessageLib
    LZ --> DVN
    LZ --> Executor
    
    Governance --> Treasury
    Governance --> VotingPower
    Governance --> Rewards
    
    JackpotSystem --> JackpotVault
    JackpotSystem --> SwapTrigger
    JackpotSystem --> Distributor
    
    classDef highlight fill:#4a80d1,stroke:#333,stroke-width:2px,color:white;
    class Token,LZ,Governance,JackpotSystem highlight

    style Core fill:#ebf5ff,stroke:#3c71c3,stroke-width:2px,color:#333
    style Users fill:#fff8e1,stroke:#ffc107,stroke-width:2px,color:#333
    style Governance fill:#e0f7fa,stroke:#00acc1,stroke-width:2px,color:#333
```

## Cross-Chain Message Flow

This sequence diagram shows how cross-chain messaging works through LayerZero V2:

```mermaid
sequenceDiagram
    participant UserA as "User (Chain A)"
    participant TokenA as "DRAGON (Chain A)"
    participant LZA as "LayerZero Endpoint (Chain A)"
    participant Relayer as "LayerZero Relayer"
    participant DVN as "Data Verification Network"
    participant LZB as "LayerZero Endpoint (Chain B)"
    participant TokenB as "DRAGON (Chain B)"
    participant UserB as "User (Chain B)"
    
    UserA->>TokenA: sendTokensToChain(ChainB, recipient, amount)
    TokenA->>TokenA: Burn tokens
    TokenA->>LZA: Send cross-chain message
    LZA->>Relayer: Relay message
    LZA->>DVN: Request data verification
    DVN-->>LZB: Verify message data
    Relayer-->>LZB: Deliver message
    LZB->>TokenB: Receive verified message
    TokenB->>TokenB: Mint tokens
    TokenB->>UserB: Token received
```

## Governance System

The governance system is based on the ve69LP (vote-escrowed) model:

```mermaid
flowchart TD
    LP["LP Tokens"] -->|"Lock"| ve69LP["ve69LP Tokens"]
    ve69LP -->|"Grant"| Voting["Voting Power"]
    ve69LP -->|"Receive"| FeeRewards["Fee Rewards"]
    ve69LP -->|"Boost"| StakingRewards["Staking Rewards"]
    
    Voting -->|"Vote on"| Proposals["Governance Proposals"]
    Proposals -->|"Execute"| Treasury["Treasury Actions"]
    Proposals -->|"Control"| Parameters["Protocol Parameters"]
    
    classDef highlight fill:#4a80d1,stroke:#333,stroke-width:2px,color:white;
    class ve69LP highlight
```

## Jackpot System Flow

The jackpot system provides on-chain lottery functionality through this process flow:

```mermaid
flowchart TD
    Buy["Token Purchase"] -->|"Detected by"| OmniDragon["OmniDragon Token"]
    OmniDragon -->|"Collect Fees"| FeeProcessor["Fee Processor"]
    FeeProcessor -->|"6.9% to Jackpot"| JackpotVault["Jackpot Vault"]
    OmniDragon -->|"Trigger"| SwapOracle["Swap Trigger Oracle"]
    SwapOracle -->|"Calculate Probability"| Entry["Lottery Entry"]
    Entry -->|"If Winning Entry"| Distributor["Jackpot Distributor"]
    JackpotVault -->|"Provide Funds"| Distributor
    Distributor -->|"Send Reward"| Winner["Winner"]
    
    classDef highlight fill:#4a80d1,stroke:#333,stroke-width:2px,color:white;
    class SwapOracle,JackpotVault,Distributor highlight
```

## Technical Contract Relationships

The relationship between the contracts can be visualized as follows:

```mermaid
classDiagram
    class OmniDragon {
        +address swapTrigger
        +address jackpotVault
        +address ve69LP
        +transfer()
        +_tryProcessLotteryEntry()
        +processPartnerJackpotEntry()
        +swapTokensForWrappedNative()
        +_distributeFees()
        +sendTokensToChain()
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
    
    class ve69LP {
        +createLock()
        +increaseLockAmount()
        +extendLockTime()
        +withdraw()
        +getVotingPower()
    }
    
    OmniDragon --> OmniDragonSwapTriggerOracle : triggers
    OmniDragon --> DragonJackpotVault : sends fees
    OmniDragon --> ve69LP : sends fees
    OmniDragonSwapTriggerOracle --> DragonJackpotDistributor : notifies
    DragonJackpotDistributor --> DragonJackpotVault : requests funds
```

## Tokenomics Flow

The economic flywheel of the OmniDragon ecosystem:

```mermaid
flowchart TD
    Transactions["Transaction Volume"]
    Fees["Transaction Fees"]
    Jackpot["Jackpot Pool"]
    Staking["ve69LP Staking"]
    Burn["Token Burns"]
    Price["Token Price"]
    
    Transactions -->|"Generate"| Fees
    Fees -->|"Fund"| Jackpot
    Fees -->|"Reward"| Staking
    Fees -->|"Fuel"| Burn
    
    Jackpot -->|"Attracts"| Users["Users & Liquidity"]
    Staking -->|"Locks"| Liquidity["Liquidity"]
    Burn -->|"Reduces"| Supply["Circulating Supply"]
    
    Users -->|"Increase"| Transactions
    Liquidity -->|"Improves"| TradingExperience["Trading Experience"]
    Supply -->|"With Growing Demand"| Price
    
    TradingExperience -->|"Encourages"| Transactions
    Price -->|"Attracts"| Users
    
    classDef highlight fill:#4a80d1,stroke:#333,stroke-width:2px,color:white;
    class Transactions,Fees,Jackpot highlight
```

## Fee Distribution

The token implements a fee model that distributes transaction fees as follows:

```mermaid
pie title Fee Distribution
    "Jackpot (6.9%)" : 6.9
    "Governance (2.41%)" : 2.41
    "Burn (0.69%)" : 0.69
```

Each time you press the Play button, you'll see an animated visualization of the diagram that helps you understand the flow and relationships between different components. 