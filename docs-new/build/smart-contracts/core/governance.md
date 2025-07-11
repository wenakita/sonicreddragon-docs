---
sidebar_position: 1
title: ve69LP
description: >-
  Voting escrow contract for LP tokens with time-weighted voting power and
  non-linear boost
---

# ve69LP Contract

The `ve69LP` contract implements a vote-escrowed token system that allows users to lock their 69/31 LP tokens for a period of time in exchange for voting power in the Sonic Red DRAGON ecosystem. This contract follows the veCRV model from Curve Finance, with improved math using cube root scaling for vote weighting.

## Overview

```mermaid
flowchart TB
    A[LP Holders] -->|>|> B[Lock Tokens]
    B| C[Vote on Proposals]
    C| D[Execute Changes]
    
    style A fill:#059669,stroke:#047857,color:#fff
    style D fill:#dc2626,stroke:#b91c1c,color:#fff
```

## Security Features

The contract implements multiple security features:

1.**ReentrancyGuard**: Prevents reentrant calls during token transfers
2.**Ownership Controls**: Restricts sensitive functions to the contract owner
3.**Clear State Management**: Updates state before external calls to prevent reentrancy issues
4.**Weekly Alignment**: Aligns all locks to weekly boundaries for predictable behavior
5.**Checkpoint System**: Records state changes to enable accurate historical queries

## Integration with Governance

The ve69LP contract serves as the foundation for the governance system, enabling:

1.**Proposal Voting**: Users with voting power can vote on governance proposals
2.**Fee Distribution**: Protocol fees can be distributed proportional to voting power
3.**Parameter Tuning**: Governance can adjust protocol parameters through voting
4.**Treasury Management**: Governance can direct treasury funds through voting

## Mathematical Considerations

The ve69LP implementation includes several mathematical optimizations:

1.**Cube Root Scaling**: Provides a balanced non-linear boost that rewards longer locks without overly penalizing shorter ones
2.**Pre-Calculated Maximum Boost**: Optimizes gas usage by pre-computing the maximum possible boost
3.**Precision Management**: Uses appropriate scaling factors to maintain precision in calculations
4.**Slope-Based Decay**: Tracks how voting power decreases over time using slopes for efficient calculation
