---
sidebar_position: 1
title: Overview
description: Detailed explanation of this concept
---

# Overview

Sonic Red DRAGON is a cross-chain ERC-20 compatible token built on LayerZero V2, featuring advanced security measures and verifiable randomness through dRAND integration.

## Key Features

-**Cross-Chain Compatibility**: Seamlessly transfer tokens across multiple blockchains using LayerZero V2
-**Enhanced Security**: Advanced security features including role-based access control and pausable transfers
-**Verifiable Randomness**: Integration with dRAND for secure and verifiable randomness generation
-**Governance**: Decentralized governance system with ve69LP tokenomics
-**Jackpot System**: Innovative jackpot distribution mechanism with cross-chain capabilities

## Architecture

Sonic Red DRAGON's architecture is built on three main pillars:

1.**Core Token System**- ERC-20 compatible token with cross-chain capabilities
   - Advanced security features and role management
   - Fee mechanics and distribution system

2.**Cross-Chain Infrastructure**- LayerZero V2 integration for secure cross-chain messaging
   - Chain-specific endpoint management
   - Bridge contract for token transfers

3.**Randomness and Security**- dRAND integration for verifiable randomness
   - Chainlink VRF support for additional randomness sources
   - Comprehensive security measures and audits

## Protocol Rules

The OmniDragon protocol follows these core rules:

<div data-immersive>

```mermaid
graph TD
    A[DRAGON Swap] --> B{Fee Distribution}
    B -->|6.9%| C[Jackpot Vault]
    B -->|2.41%| D[ve69LP Fee Distributor]
    B -->|>|0.69%| E[Token Burn]
    A| F{Transaction Type}
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
```

</div>

## Getting Started

To start using Sonic Red DRAGON:

1. Read the [Installation Guide](/guides/installation)
2. Learn about [Token Usage](/guides/user/using-token)
3. Explore [Cross-Chain Features](/guides/user/bridging)
4. Understand [Governance](/guides/user/governance)

## Technical Stack

-**Smart Contracts**: Solidity with OpenZeppelin contracts
-**Cross-Chain**: LayerZero V2
-**Randomness**: dRAND and Chainlink VRF
-**Security**: Comprehensive audit system and role-based access control

## Next Steps

- [Architecture Details](/concepts/architecture)
- [Tokenomics](/concepts/tokenomics)
- [Security Model](/concepts/security)
- [Cross-Chain Features](/concepts/cross-chain)
- [Randomness System](/concepts/randomness)
