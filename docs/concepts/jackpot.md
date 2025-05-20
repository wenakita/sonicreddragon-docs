---
title: Jackpot System
sidebar_position: 4
---

# OmniDragon Jackpot System

The OmniDragon Jackpot System is a core feature that distributes rewards to token holders based on verifiable randomness. This document explains how the system works and its key components.

## System Overview

The jackpot system uses a combination of fee collection, randomness, and distribution mechanisms to create an engaging token economy:

```mermaid
flowchart TB
    %% Define main components with clear labels
    subgraph Collection ["Fee Collection"]
        direction LR
        TXFEE["Transaction Fees"]:::fee
        BRIDGE["Bridge Fees"]:::fee
        FEE_ADAPT["Adaptive Fee Logic"]:::fee
    end
    
    subgraph Pool ["Jackpot Pool"]
        direction TB
        VAULT["Jackpot Vault"]:::vault
        TRACKER["Growth Tracker"]:::vault
    end
    
    subgraph Trigger ["Trigger Mechanism"]
        direction LR
        TIME["Time-Based"]:::trigger
        RANDOM["Randomness Oracle"]:::trigger
        THRESHOLD["Threshold Events"]:::trigger
    end
    
    subgraph Distribution ["Reward Distribution"]
        direction LR
        WINNERS["Winner Selection"]:::dist
        REWARDS["Reward Calculation"]:::dist
        PAYOUT["Payout Process"]:::dist
    end
    
    %% Connect the components
    TXFEE --> FEE_ADAPT
    BRIDGE --> FEE_ADAPT
    FEE_ADAPT --> VAULT
    
    VAULT --> TRACKER
    TRACKER --> THRESHOLD
    
    TIME --> RANDOM
    RANDOM --> WINNERS
    THRESHOLD --> WINNERS
    
    VAULT --> REWARDS
    WINNERS --> REWARDS
    REWARDS --> PAYOUT
    
    %% Apply styling
    classDef fee fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    classDef vault fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    classDef trigger fill:#fff8e1,stroke:#ffc107,color:#ff6f00
    classDef dist fill:#f3e5f5,stroke:#9c27b0,color:#4a148c
    
    %% Style subgraphs
    style Collection fill:#e3f2fd,stroke:#bbdefb,color:#0d47a1
    style Pool fill:#e8f5e9,stroke:#c8e6c9,color:#1b5e20
    style Trigger fill:#fff8e1,stroke:#ffecb3,color:#ff6f00
    style Distribution fill:#f3e5f5,stroke:#e1bee7,color:#4a148c
```

## Jackpot Cycle

The jackpot system follows a regular cycle of accumulation, triggering, and distribution:

```mermaid
flowchart LR
    %% Define cycle stages
    COLLECT([Fee Collection]):::collect
    ACCUMULATE([Pool Growth]):::accumulate
    TRIGGER([Trigger Event]):::trigger
    SELECT([Winner Selection]):::select
    DISTRIBUTE([Distribution]):::distribute
    RESET([Pool Reset]):::reset
    
    %% Connect in cycle
    COLLECT --> ACCUMULATE
    ACCUMULATE --> TRIGGER
    TRIGGER --> SELECT
    SELECT --> DISTRIBUTE
    DISTRIBUTE --> RESET
    RESET --> COLLECT
    
    %% Apply styling
    classDef collect fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    classDef accumulate fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    classDef trigger fill:#fff8e1,stroke:#ffc107,color:#ff6f00
    classDef select fill:#f3e5f5,stroke:#9c27b0,color:#4a148c
    classDef distribute fill:#fce4ec,stroke:#e91e63,color:#880e4f
    classDef reset fill:#f5f5f5,stroke:#9e9e9e,color:#212121
```

## Trigger Mechanism

The jackpot is triggered through a combination of time-based and randomness-based mechanisms:

```mermaid
sequenceDiagram
    participant Timer as Time Oracle
    participant VRF as Randomness Oracle
    participant Trigger as Jackpot Trigger
    participant Vault as Jackpot Vault
    participant Distributor as Reward Distributor
    
    %% Add style regions
    rect rgb(238, 242, 255)
    note over Timer,VRF: Conditions check
    end
    
    Timer->>+Trigger: Time threshold reached
    Trigger->>Trigger: Check eligibility
    Trigger->>+VRF: Request trigger randomness
    
    rect rgb(255, 248, 225)
    note over VRF,Trigger: Random determination
    end
    
    VRF-->>-Trigger: Provide randomness
    Trigger->>Trigger: Determine if triggered
    
    alt Jackpot triggered
        rect rgb(243, 229, 245)
        note over Trigger,Distributor: Distribution process
        end
        
        Trigger->>+Vault: Request current pool
        Vault-->>-Trigger: Return pool amount
        Trigger->>+Distributor: Initiate distribution
        Distributor->>+VRF: Request winner selection
        VRF-->>-Distributor: Provide selection randomness
        Distributor->>Distributor: Select winners
        Distributor->>Distributor: Calculate rewards
        Distributor->>Vault: Transfer rewards
        Distributor-->>-Trigger: Distribution complete
    else Not triggered
        Trigger->>Trigger: Update next check time
    end
    
    Trigger-->>-Timer: Process complete
```

## Implementation Architecture

The core contracts that implement the jackpot system are structured as follows:

```mermaid
classDiagram
    %% Define core contracts
    class JackpotVault {
        -uint256 poolAmount
        -address trigger
        -address distributor
        +deposit(uint256 amount)
        +withdraw(address recipient, uint256 amount)
        +getPoolSize() uint256
    }
    
    class JackpotTrigger {
        -address vault
        -address randomness
        -uint256 minTime
        -uint256 lastCheck
        +checkTrigger() bool
        +executeTrigger()
        +setParameters(uint256 minTime)
    }
    
    class RewardDistributor {
        -address vault
        -address randomness
        -uint256 winnersCount
        +distributeRewards()
        +selectWinners() address[]
        +calculateRewards(address[] winners) uint256[]
    }
    
    class RandomnessConsumer {
        -address vrfCoordinator
        +requestRandomness() bytes32
        +fulfillRandomness(bytes32 requestId, uint256 randomness)
    }
    
    class FeeCollector {
        -address vault
        -uint256 feeRate
        +collectFee(uint256 amount) uint256
        +setFeeRate(uint256 rate)
    }
    
    %% Define relationships
    FeeCollector --> JackpotVault: deposits fees
    JackpotTrigger --> JackpotVault: requests pool
    JackpotTrigger --> RandomnessConsumer: requests randomness
    JackpotTrigger --> RewardDistributor: initiates distribution
    RewardDistributor --> JackpotVault: withdraws rewards
    RewardDistributor --> RandomnessConsumer: requests randomness
    
    %% Apply styling
    classDef vault fill:#e8f5e9,stroke:#4caf50,color:#1b5e20
    classDef trigger fill:#fff8e1,stroke:#ffc107,color:#ff6f00
    classDef distributor fill:#f3e5f5,stroke:#9c27b0,color:#4a148c
    classDef randomness fill:#e0f7fa,stroke:#00bcd4,color:#006064
    classDef fee fill:#e3f2fd,stroke:#2196f3,color:#0d47a1
    
    class JackpotVault vault
    class JackpotTrigger trigger
    class RewardDistributor distributor
    class RandomnessConsumer randomness
    class FeeCollector fee
```

## Jackpot Distribution Formula

The jackpot distribution uses a weighted formula that rewards both loyalty and token holdings:

- **Base Allocation**: 60% of the pool distributed to randomly selected winners
- **Staking Boost**: 30% additional weight for staked tokens
- **Loyalty Multiplier**: Up to 2x multiplier based on holding duration
- **Cross-Chain Participants**: Special allocation for cross-chain token holders

This creates an engaging and fair distribution system that incentivizes long-term holding and active participation in the OmniDragon ecosystem. 