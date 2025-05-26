---
sidebar_position: 5
title: ve69LPMath
description: Vote-escrowed token mathematical library for time-weighted staking and governance
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import VotingDecayAnimation from '@site/src/components/VotingDecayAnimation';
import PartnerBoostAnimation from '@site/src/components/PartnerBoostAnimation';
import CubeRootAnimation from '@site/src/components/CubeRootAnimation';

# ve69LPMath

**Vote-escrowed token mathematical library for time-weighted staking and governance**

<div className="contract-badges">
  <span className="contract-badge governance">Governance</span>
  <span className="contract-badge staking">Staking</span>
  <span className="contract-badge liquidity">Liquidity</span>
</div>

## Overview

The `ve69LPMath` library provides the mathematical foundation for the vote-escrowed token system, enabling time-weighted staking and governance power. This implementation follows the veCRV model pioneered by Curve Finance, with specialized adaptations for the OmniDragon ecosystem.

```mermaid
flowchart TB
    subgraph "Token Locking System"
        Lock["Lock LP Tokens"]
        Decay["Time Decay"]
        Boost["Boost Calculation"]
        Power["Voting Power"]
    end
    
    subgraph "Applications"
        Governance["Governance Voting"]
        FeesBoost["Trading Fee Boost"]
        JackpotBoost["Jackpot Win Boost"]
    end
    
    Lock --> Decay
    Decay --> Power
    Lock --> Boost
    Boost --> FeesBoost
    Boost --> JackpotBoost
    Power --> Governance
    
    classDef highlight fill:#f96,stroke:#333,;
    class Lock,Power highlight;
```

## Key Functions

The library provides specialized mathematical functions for the vote-escrowed token system.

<VotingDecayAnimation />

<div className="function-signature">
function calculateVotingPower(uint256 amount, uint256 lockDuration, uint256 maxLockDuration) internal pure returns (uint256)
</div>

Calculates the voting power based on locked amount and duration, where longer locks receive proportionally more voting power.

<div className="function-signature">
function calculateDecay(uint256 initialVotingPower, uint256 timeElapsed, uint256 lockDuration) internal pure returns (uint256)
</div>

Calculates the time-based decay of voting power as a lock approaches expiration.

<div className="function-signature">
function calculateBoost(uint256 veTokenBalance, uint256 totalVeSupply, uint256 userLpBalance, uint256 totalLpBalance) internal pure returns (uint256)
</div>

Calculates the boost multiplier applied to rewards and other benefits.

<CubeRootAnimation />

<Tabs>
  <TabItem value="voting" label="Voting Power Formula" default>
    <div className="math-formula">
    votingPower = amount * lockDuration / maxLockDuration
    </div>
    <p>This formula linearly weights tokens based on lock duration, creating an incentive for longer-term commitment.</p>
  </TabItem>
  <TabItem value="decay" label="Decay Formula">
    <div className="math-formula">
    currentPower = initialPower * (lockDuration - timeElapsed) / lockDuration
    </div>
    <p>As time progresses, voting power linearly decays until the lock expires.</p>
  </TabItem>
  <TabItem value="boost" label="Boost Formula">
    <div className="math-formula">
    boost = min(2.5, 1 + 1.5 * (veBalance / totalVeSupply) / (lpBalance / totalLpBalance))
    </div>
    <p>The boost formula rewards users who lock a higher percentage of their LP tokens for longer periods.</p>
  </TabItem>
</Tabs>

## Integration Examples

### Governance Voting Power

```solidity
// Import the library
import "../math/ve69LPMath.sol";

contract GovernanceVoting {
    using ve69LPMath for uint256;
    
    // Constants
    uint256 public constant MAX_LOCK_DURATION = 4 * 365 days; // 4 years
    
    // Calculate voting power for governance
    function calculateVotePower(
        address user, 
        uint256 tokenAmount, 
        uint256 lockDuration
    ) external view returns (uint256) {
        // Ensure lock duration is valid
        require(lockDuration > 0 && lockDuration <= MAX_LOCK_DURATION, "Invalid lock duration");
        
        // Calculate voting power
        return ve69LPMath.calculateVotingPower(
            tokenAmount, 
            lockDuration, 
            MAX_LOCK_DURATION
        );
    }
}
```

### Reward Boost Calculation

```solidity
// Import the library
import "../math/ve69LPMath.sol";

contract RewardDistributor {
    using ve69LPMath for uint256;
    
    // Token contracts
    IERC20 public lpToken;
    IVe69LP public veToken;
    
    // Calculate user's boosted rewards
    function calculateBoostedRewards(
        address user,
        uint256 baseReward
    ) external view returns (uint256) {
        // Get user LP and ve token balances
        uint256 userLpBalance = lpToken.balanceOf(user);
        uint256 userVeBalance = veToken.balanceOf(user);
        
        // Get total supplies
        uint256 totalLpSupply = lpToken.totalSupply();
        uint256 totalVeSupply = veToken.totalSupply();
        
        // Calculate boost multiplier
        uint256 boostMultiplier = ve69LPMath.calculateBoost(
            userVeBalance,
            totalVeSupply,
            userLpBalance,
            totalLpSupply
        );
        
        // Apply boost to base reward
        return (baseReward * boostMultiplier) / 10000;
    }
}
```

## Time-Weighted Staking Model

The ve69LP system implements a time-weighted staking model that incentivizes long-term alignment:

1. **Lock Duration**: Users lock LP tokens for up to 4 years
2. **Voting Power**: Proportional to amount locked and remaining lock time
3. **Linear Decay**: Voting power decreases linearly as lock expiration approaches
4. **Boost Mechanism**: Provides increased benefits proportional to lock commitment
5. **Governance Rights**: Weighted voting based on lock duration and amount

## Partner Probability Boost

The ve69LP system includes a partner voting mechanism that allocates a 6.9% (690 basis points) probability boost among ecosystem partners:

1. **Total Allocation**: A fixed 6.9% probability boost shared among all partners
2. **Voting Power**: ve69LP holders vote for partners using their voting power
3. **Proportional Distribution**: The 6.9% is distributed proportionally based on votes received
4. **Weekly Periods**: Voting occurs in 7-day periods with recalculation at period end
5. **Partner Registry**: Only registered and active partners can receive votes

<PartnerBoostAnimation />

```mermaid
flowchart TB
    subgraph "Partner Boost System"
        Votes["ve69LP Holder Votes"]
        Calculation["Weekly Calculation"]
        Distribution["Boost Distribution"]
        Partners["Partner Registry"]
    end
    
    subgraph "Applications"
        ProbBoost["Probability Boost"]
    end
    
    Votes --> Calculation
    Partners --> Calculation
    Calculation --> Distribution
    Distribution --> ProbBoost
    
    classDef highlight fill:#f96,stroke:#333,;
    class Distribution highlight;
```

<div className="security-consideration">
  <h4>Security Considerations</h4>
  <p>When implementing ve token mathematics, consider these security best practices:</p>
  <ul>
    <li><strong>Overflow Protection</strong>: All calculations use Solidity 0.8+ built-in checks</li>
    <li><strong>Rounding Behavior</strong>: All rounding should favor the protocol to prevent exploitation</li>
    <li><strong>Checkpoint System</strong>: Use a checkpoint system for tracking historical balances</li>
    <li><strong>Lock Extension</strong>: Allow users to extend lock duration but not reduce it</li>
    <li><strong>Fee Control</strong>: Ensure boost calculations cannot manipulate fee distribution unfairly</li>
  </ul>
</div>

## Gas Optimization

<div className="gas-optimization">
  <h4>Gas Optimization Notes</h4>
  <p>The ve69LPMath library implements several gas optimizations:</p>
  <ul>
    <li>Precalculated constants for common time values</li>
    <li>Efficient balance tracking using a checkpoint system</li>
    <li>Optimized boost calculation with fixed-point arithmetic</li>
    <li>Memory-efficient storage for lock data</li>
    <li>Balance caching to minimize external calls</li>
  </ul>
</div> 