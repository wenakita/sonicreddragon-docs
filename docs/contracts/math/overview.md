---
sidebar_position: 1
title: Overview
description: Detailed explanation of this concept
---

# Mathematical Framework

## Introduction

The OmniDragon protocol relies on sophisticated mathematical algorithms to power its core features, ranging from equitable governance voting to dynamic jackpot distribution. These mathematical libraries represent a significant innovation in on-chain computation, providing gas-efficient implementations of complex algorithms that would otherwise be prohibitively expensive to execute.

Our mathematical framework is organized into modular libraries that address different aspects of the protocol:

```mermaid
flowchart TD
    subgraph "Protocol Core"
    CoreMath["Core Mathematics"]
    DistributionSystem["Distribution System"]
    TimeCalculations["Time Calculations"]
    subgraph "Domain Applications"
    Governance["Governance"]
    Jackpot["Jackpot System"]
    Market["Market Operations"]
    Tokenomics["Token Economics"]
    CoreMath -->|"Supports"| DistributionSystem
    CoreMath -->|"Supports"| TimeCalculations
    DistributionSystem -->|"Powers"| Jackpot
    CoreMath -->|"Enables"| Governance
    TimeCalculations -->|"Schedules"| Jackpot
    TimeCalculations -->|"Synchronizes"| Market
    DistributionSystem -->|"Optimizes"| Tokenomics
    classDef highlight fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    end    class CoreMath primary    endclass DistributionSystem primary    end
end
```

## System Architecture

The mathematical framework consists of specialized libraries that work together to solve complex problems:

### Core Libraries

| Library | Purpose | Key Features |
|---------|---------|-------------|
| [`DragonMathLib`](/DRAGON-math-lib) | Fundamental mathematical operations | Cube root, voting power, weighted averages |
| [`HermesMath`](/hermes-math) | Jackpot distribution mathematics | Dynamic prize allocation, win probability |
| [`DragonDateTimeLib`](/date-time-lib) | Time-based calculations | Epoch conversion, duration calculations |

### Domain-Specific Libraries

| Library | Purpose | Key Features |
|---------|---------|-------------|
| [`ve69LPMath`](/ve69LP-math) | Vote-escrowed LP calculations | Lock duration, voting power decay |
| [`VotingPowerCalculator`](/voting-power) | Governance weighting | Equitable delegation, proposal thresholds |
| [`DragonAdaptiveFeeManager`](/adaptive-fee) | Dynamic fee adjustment | Market-responsive fee scaling |
| [`HermesMathIntegration`](/hermes-integration) | Application layer | Contract interfaces for formula application |
| [`MarketConditionOracle`](/market-oracle) | Market analytics | Price impact, volatility measurements |

## Mathematical Principles

Our framework is built on several key mathematical principles:

### 1. Fixed-Point Decimal Arithmetic

All calculations use fixed-point decimal math to handle fractional values on EVM chains, typically with 18 decimal places of precision (`1e18`). This approach avoids the need for floating-point operations while maintaining high precision.

### 2. Cube Root Distribution (Wyoming Rule)

The governance system uses cube root normalization based on the political science concept of the Wyoming Rule, which creates more equitable voting power distribution. This means that as a user's token holdings increase, their voting power increases at a diminishing rate, preventing excessive influence from large holders while still rewarding greater stake.

### 3. Iterative Approximation

Complex operations like cube roots are calculated using iterative methods such as Newton's method, which converges rapidly while minimizing gas usage through early exit conditions and smart initial guesses.

### 4. Hermès Formula

The proprietary Hermès formula for jackpot distribution uses a specialized mathematical model that balances jackpot growth with win frequency. This creates an optimal player experience while ensuring the sustainability of the protocol.

## Key Components

The mathematical foundation of the OmniDragon ecosystem consists of several specialized libraries:

### 1. DragonMathLib

Core mathematical utilities used throughout the protocol:
- Cube root approximation using Newton's method
- Voting power calculation with cube root normalization
- Percentage calculations with precision control
- Boost application with precise math
- Weighted average calculations
- Range mapping and linear interpolation

### 2. HermesMath

Implementation of the proprietary Hermès formula for dynamic jackpot distribution:
- Sophisticated distribution algorithm using high-order mathematics
- Components approximation for gas optimization
- Fixed-point decimal arithmetic for high precision
- Customizable governance parameters

### 3. DragonDateTimeLib

Date and time manipulation library:
- Timestamp to date/time conversion
- Duration calculations
- Time-based scheduling support
- Cross-chain time synchronization

### 4. ve69LPMath

Mathematical functions for the ve69LP vote-escrowed token system:
- Locked token voting power calculation
- Time-decay math for voting power
- Boost calculation based on lock duration
- Voting weight determination

### 5. VotingPowerCalculator

Specialized math for governance voting:
- Cube root normalization for equitable governance
- Delegation math for combined voting power
- Proposal threshold calculations
- Quorum determination

### 6. DragonAdaptiveFeeManager

Dynamic fee calculation system:
- Market-responsive fee adjustments
- Volume-based fee scaling
- Protocol performance optimization
- Cross-chain fee normalization

### 7. HermesMathIntegration

Application layer integrating the Hermès formula:
- Contract interfaces for jackpot distribution
- Parameter management for formula adjustments
- Integration with jackpot distribution system

### 8. MarketConditionOracle

Market analytics and condition assessment:
- Price impact calculations
- Volatility measurements
- Liquidity depth analysis
- Automated market maker optimization

## Integration Examples

### Using DragonMathLib for Voting Power

```solidity
// Import the library
import "../math/DragonMathLib.sol";

contract GovernanceExample {
    using DragonMathLib for uint256;
    
    // Constants
    uint256 private constant PRECISION = 1e18;
    
    function calculateVote(uint256 tokenAmount) external pure returns (uint256) {
        // Use cube root for more equitable voting power
        return DragonMathLib.calculateVotingPower(tokenAmount);
    }
}
```

### Using HermesMath for Jackpot Distribution

```solidity
// Import the library
import "../math/HermesMath.sol";

contract JackpotExample {
    using HermesMath for uint256;
    
    // Governance parameters
    uint256 public d = 3 * 1e18; // Protocol constant D
    uint256 public n = 2 * 1e18; // Protocol constant N
    
    function calculatePrize(uint256 jackpotSize) external view returns (uint256) {
        // Calculate optimal prize using Hermès formula
        return HermesMath.calculateHermesValue(jackpotSize, d, n);
    }
}
```

## Security Considerations

The math libraries implement several security measures:

1.**Overflow Protection**: Using Solidity 0.8+ built-in overflow checks
2.**Division Safety**: Checks for division by zero in all calculations
3.**Precision Management**: Careful handling of precision to avoid rounding errors
4.**Gas Optimization**: Iterative approximations with early exit conditions
5.**Parameter Bounds**: Enforcing safe ranges for input parameters 
