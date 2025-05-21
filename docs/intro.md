---
sidebar_position: 1
---

# Introduction

Welcome to Sonic Red Dragon documentation!

*Last updated: Added workflow automation for documentation deployment*

Sonic Red Dragon is a LayerZero V2 compatible token that brings unique features and capabilities to the cross-chain ecosystem.

## What is Sonic Red Dragon?

Sonic Red Dragon is a next-generation token built on the LayerZero V2 protocol, designed to provide seamless cross-chain functionality while maintaining high security and efficiency. Our token leverages advanced cryptographic techniques and the dRAND network for verifiable randomness, making it ideal for various DeFi applications.

## Architecture Overview

```mermaid
graph TD
    A[User] -->|Request| B[Ethereum]
    A -->|Request| C[Sonic]
    A -->|Request| D[Arbitrum]
    B <-->|LayerZero| C
    B <-->|LayerZero| D
    C <-->|LayerZero| D
    B --> E[Sonic Red Dragon Protocol]
    C --> E
    D --> E
```

## Ecosystem Components

Sonic Red Dragon creates a comprehensive ecosystem with several interconnected components:

```mermaid
flowchart LR
    %% Color classes for different components
    classDef coreSystem fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000000
    classDef tokenSystem fill:#e8eaf6,stroke:#5c6bc0,stroke-width:2px,color:#000000
    classDef userSystem fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000000
    
    %% Core Protocol
    subgraph Core["Core Protocol"]
        direction TB
        
        OmniDragon["OmniDragon Token<br>• ERC20 with lottery<br>• Cross-chain capability<br>• Fee distribution"]:::coreSystem
        SwapTriggerOracle["SwapTriggerOracle<br>• Monitors trading<br>• Triggers lottery draws"]:::coreSystem
        ChainRegistry["ChainRegistry<br>• Manages chain IDs<br>• Cross-chain config"]:::coreSystem
        
        LPToken["69LP Token<br>• Liquidity provider<br>• Earns trading fees"]:::tokenSystem
    end
    
    %% User Journey
    subgraph Journey["User Journey"]
        direction TB
        
        User["User"]:::userSystem
        Trading["Trading<br>• Buy/Sell<br>• Generates fees<br>• Lottery entry"]:::userSystem
        AddLiquidity["Add Liquidity<br>• Create LP tokens<br>• Earn fees"]:::userSystem
        StakeLock["Stake & Lock<br>• 69LP → ve69LP<br>• Governance rights"]:::userSystem
        Vote["Vote & Boost<br>• Governance<br>• Direct boost"]:::userSystem
        Collect["Collect Rewards<br>• Fee distribution<br>• Lottery winnings"]:::userSystem
    end
    
    %% Connect Components
    User --> Trading
    Trading --> AddLiquidity
    AddLiquidity --> StakeLock
    StakeLock --> Vote
    Vote --> Collect
    Trading --> OmniDragon
    OmniDragon -- "Powers" --> SwapTriggerOracle
    ChainRegistry -- "Configures" --> OmniDragon
    
    %% Style the containers
    style Core fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style Journey fill:#fff9c4,stroke:#ffb300,stroke-width:2px
```

For a more detailed view of the ecosystem architecture, you can explore our [complete ecosystem diagrams](./ecosystem/architecture).

## Key Features

- **LayerZero V2 Compatibility**: Seamless cross-chain operations with enhanced security
- **dRAND Integration**: Verifiable randomness for fair and transparent operations
- **Advanced Security**: Built with modern cryptographic primitives
- **Cross-Chain Functionality**: Operate across multiple blockchain networks
- **Developer-Friendly**: Comprehensive documentation and easy integration

## Randomness System

One of our standout features is the advanced randomness system that powers our lottery mechanism:

```mermaid
flowchart LR
    %% Color classes for different components
    classDef randomSource fill:#e1f5fe,stroke:#1976d2,stroke-width:2px,color:#000000
    classDef processor fill:#fff3e0,stroke:#ff9800,stroke-width:2px,color:#000000
    
    %% Randomness Sources
    DrandDefault["drand Default<br>League of Entropy"]:::randomSource
    DrandEVM["drand EVMNet<br>3s period"]:::randomSource
    ChainlinkVRF["Chainlink VRF 2.5<br>On-demand"]:::randomSource
    
    %% Processors
    Integrators["Verification Layer<br>• Proof validation<br>• Format conversion"]:::processor
    VRFConsumer["OmniDragon VRF Consumer<br>• Aggregates sources<br>• Fallback system<br>• Security measures"]:::processor
    SwapTrigger["Swap Trigger Oracle<br>• Receives random values<br>• Determines winners"]:::processor
    
    %% Flow
    DrandDefault --> Integrators
    DrandEVM --> Integrators
    ChainlinkVRF --> Integrators
    Integrators --> VRFConsumer
    VRFConsumer --> SwapTrigger
```

Our randomness system combines multiple sources including drand networks and Chainlink VRF to ensure reliable and verifiable random number generation for our lottery mechanism.

## Getting Started

To start using Sonic Red Dragon in your project:

1. Review the [Contracts Overview](./contracts/overview) to understand our smart contract architecture
2. Learn about our [Randomness System](./ecosystem/drand-network) for verifiable random number generation
3. Check out our GitHub repository for implementation examples

## Community

Join our community to stay updated and get support:

- [Telegram](https://t.me/SonicRedDragon)
- [Discord](https://discord.gg/sonicreddragon)
- [Twitter](https://twitter.com/sonicreddragon)
- [GitHub](https://github.com/wenakita/omnidragon)

## Contributing

We welcome contributions from the community! Whether it's improving documentation, reporting bugs, or suggesting new features, your input helps make Sonic Red Dragon better for everyone.

Visit our [GitHub repository](https://github.com/wenakita/omnidragon) to:
- Report issues
- Submit pull requests
- Review our code
- Join discussions 