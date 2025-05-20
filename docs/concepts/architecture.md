---
sidebar_position: 2
---

# Architecture

The Sonic Red Dragon ecosystem is built on a modular, extensible architecture designed for cross-chain compatibility, security, and scalability.

## System Overview

At a high level, the Sonic Red Dragon architecture consists of several interconnected components:

```mermaid
graph TD
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
    
    class Token,LZ,Governance,JackpotSystem highlight
```

## Core Components

### OmniDragon Token

The OmniDragon token serves as the foundation of the ecosystem. It implements:

- ERC-20 standard functionality
- Cross-chain compatibility via LayerZero V2
- Fee collection and distribution
- Jackpot entry triggering for buy transactions
- Governance integration

### Cross-Chain Infrastructure

The cross-chain functionality is powered by LayerZero V2:

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

### Governance System

The governance system is based on the ve69LP (vote-escrowed) model:

```mermaid
graph TD
    LP["LP Tokens"] -->|"Lock"| ve69LP["ve69LP Tokens"]
    ve69LP -->|"Grant"| Voting["Voting Power"]
    ve69LP -->|"Receive"| FeeRewards["Fee Rewards"]
    ve69LP -->|"Boost"| StakingRewards["Staking Rewards"]
    
    Voting -->|"Vote on"| Proposals["Governance Proposals"]
    Proposals -->|"Execute"| Treasury["Treasury Actions"]
    Proposals -->|"Control"| Parameters["Protocol Parameters"]
    
    class ve69LP highlight
```

### Jackpot System

The jackpot system provides on-chain lottery functionality:

```mermaid
graph TD
    Buy["Token Purchase"] -->|"Detected by"| OmniDragon["OmniDragon Token"]
    OmniDragon -->|"Collect Fees"| FeeProcessor["Fee Processor"]
    FeeProcessor -->|"6.9% to Jackpot"| JackpotVault["Jackpot Vault"]
    OmniDragon -->|"Trigger"| SwapOracle["Swap Trigger Oracle"]
    SwapOracle -->|"Calculate Probability"| Entry["Lottery Entry"]
    Entry -->|"If Winning Entry"| Distributor["Jackpot Distributor"]
    JackpotVault -->|"Provide Funds"| Distributor
    Distributor -->|"Send Reward"| Winner["Winner"]
    
    class SwapOracle,JackpotVault,Distributor highlight
```

## Technical Relationships

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

## Multi-Chain Deployment

The Sonic Red Dragon ecosystem is deployed on multiple blockchains with identical functionality on each chain:

| Chain | Layer Type | Primary Use Cases |
|-------|------------|------------------|
| Ethereum | L1 | Governance, Security, Prime Liquidity |
| BNB Chain | L1 | High Throughput, Lower Fees |
| Arbitrum | L2 | Scaling, Lower Fees |
| Avalanche | L1 | Fast Finality, EVM Compatible |
| Base | L2 | Scaling, Lower Fees |

## Security Model

The security architecture is built on several principles:

1. **Multi-Layered Access Controls**: Role-based permissions with strict validation
2. **Economic Security**: Fee mechanism and incentive alignment
3. **Oracle Diversity**: Multiple price feeds for reliable market data
4. **Governance Time-Locks**: Delay periods for critical changes
5. **External Verification**: LayerZero DVN provides additional security layer

## Fee Flow

The token implements a fee model that distributes transaction fees as follows:

```mermaid
pie title Fee Distribution
    "Jackpot (6.9%)" : 6.9
    "Governance (2.41%)" : 2.41
    "Burn (0.69%)" : 0.69
```

## Integration Points

The system exposes several integration points for partners and extensions:

1. **Partner Jackpot Program**: Special jackpot entries for integrated pools
2. **Cross-Chain Messaging**: LayerZero integration for cross-chain communication
3. **Governance Hooks**: Extensible governance for protocol evolution
4. **Oracle Aggregation**: Multiple price feed sources for reliability
