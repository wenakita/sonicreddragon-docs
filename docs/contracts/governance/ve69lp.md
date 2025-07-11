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

```mermaidflowchart TD
    LPToken["69/31 LP Token"] -->|"Lock tokens"| ve69LP["ve69LP Contract"]
    ve69LP -->|"Grants"| VotingPower["Voting Power"]
    ve69LP -->|"Allows"| Governance["Governance Voting"]
    ve69LP -->|"Earns"| Rewards["Fee Revenue"]
    TimeLength["Lock Duration"] -->|"Impacts"| VotingMultiplier["Voting Multiplier"]
    VotingMultiplier -->|"Increases"| VotingPower
    classDef highlight fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    class ve69LP primary
```

The ve69LP system is designed to:

1.**Incentivize Long-Term Holders**: Rewards users who commit to locking tokens for extended periods
2.**Enable Governance Participation**: Provides voting power proportional to locked amount and time
3.**Apply Non-Linear Boost**: Uses cube root scaling to balance short and long-term positions
4.**Distribute Protocol Fees**: Serves as the mechanism for fee distribution to protocol supporters

## Contract Implementation

The `ve69LP` contract implements the `Ive69LP` interface and includes security features:

```solidity
contract ve69LP is Ownable, ReentrancyGuard, Ive69LP {
    using Math for uint256;
    using SafeCast for uint256;
    
    // Constants
    uint256 private constant WEEK = 7 * 86400;             // 1 week in seconds
    uint256 private constant MAX_LOCK_TIME = 4 * 365 * 86400; // 4 years in seconds
    uint256 private constant MIN_LOCK_TIME = 7 * 86400;    // 1 week in seconds
    uint256 private constant PRECISION = 1e18;             // Precision for calculations
    
    // State variables
    IERC20 public lpToken;    // 69/31 LP token
    bool public initialized;  // Initialization flag
    uint256 public totalSupply;       // Total ve69LP supply
    mapping(address => LockedBalance) public locked;
    mapping(address => uint256) public userPointEpoch;
    mapping(address => mapping(uint256 => Point)) public userPointHistory;
    mapping(uint256 => Point) public pointHistory;
    
    // Voting power configuration
    uint256 public maxVP = 15000;      // Maximum voting power multiplier (2.5x) in basis points
    uint256 public maxBoost;          // Pre-calculated maximum boost (for gas optimization)
    
    uint256 public epoch;
    
    // ... more code ...
}
```

## Core Data Structures

### LockedBalance

```solidity
struct LockedBalance {
    uint256 amount;       // Amount of 69/31 LP tokens locked
    uint256 unlockTime;   // Unix timestamp when tokens unlock
}
```

The `LockedBalance` struct tracks how many LP tokens a user has locked and when they can be withdrawn.

### Point

```solidity
struct Point {
    uint256 bias;         // Voting power at the time of recording
    uint256 slope;        // How fast the voting power is decreasing over time
    uint256 timestamp;    // Time point was recorded
}
```

The `Point` struct represents a checkpoint in the voting power history, allowing the contract to determine historical voting power for governance snapshots.

## Lock Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| `MIN_LOCK_TIME` | 1 week | Minimum lock duration |
| `MAX_LOCK_TIME` | 4 years | Maximum lock duration |
| `maxVP` | 15000 (150%) | Maximum voting power boost |

## Core Functions

### Creating a Lock

```solidity
function createLock(uint256 lpAmount, uint256 lockDuration) external nonReentrant whenInitialized {
    if (lpAmount == 0) revert ZeroAmount();
    
    // Align lock end time to week boundary using DragonDateTimeLib
    uint256 unlockTime = DragonDateTimeLib.calculateLockEndAligned(block.timestamp, lockDuration);
    
    if (unlockTime <= block.timestamp) revert LockTimeNotInFuture();
    if (unlockTime - block.timestamp < MIN_LOCK_TIME) revert LockTimeTooShort();
    if (unlockTime - block.timestamp > MAX_LOCK_TIME) revert LockTimeTooLong();

    LockedBalance storage userLock = locked[msg.sender];
    if (userLock.amount > 0) revert ExistingLockFound();

    // Transfer tokens to contract
    bool success = lpToken.transferFrom(msg.sender, address(this), lpAmount);
    if (!success) revert TransferFailed();

    // Update locked balance
    userLock.amount = lpAmount;
    userLock.unlockTime = unlockTime;

    // Calculate voting power
    uint256 votingPower = calculateVotingPower(lpAmount, unlockTime);

    // Update total supply
    uint256 prevSupply = totalSupply;
    totalSupply = prevSupply + votingPower;

    // Update user point history
    userPointEpoch[msg.sender] += 1;
    uint256 userEpoch = userPointEpoch[msg.sender];
    userPointHistory[msg.sender][userEpoch] = Point({
        bias: votingPower,
        slope: votingPower / (unlockTime - block.timestamp),
        timestamp: block.timestamp
    });

    // Update global point history
    epoch += 1;
    pointHistory[epoch] = Point({
        bias: totalSupply,
        slope: pointHistory[epoch - 1].slope + (votingPower / (unlockTime - block.timestamp)),
        timestamp: block.timestamp
    });

    // Emit Deposit event using the interface parameter names
    emit Deposit(msg.sender, lpAmount, unlockTime, votingPower);
    emit Supply(prevSupply, totalSupply);
}
```

This function allows users to create a new lock by depositing LP tokens and specifying a lock duration. The lock end time is aligned to a week boundary, and voting power is calculated based on the lock amount and duration.

### Increasing Lock Amount

```solidity
function increaseLockAmount(uint256 additionalAmount) external nonReentrant whenInitialized {
    LockedBalance storage userLocked = locked[msg.sender];
    
    if (additionalAmount == 0) revert ZeroAmount();
    if (userLocked.amount == 0) revert NoLockFound();
    if (userLocked.unlockTime <= block.timestamp) revert LockExpired();
    
    // Checkpoint with new amount but same unlock time
    _checkpoint(msg.sender, userLocked, LockedBalance({
        amount: userLocked.amount + additionalAmount,
        unlockTime: userLocked.unlockTime
    }));
    
    // Update user's lock
    userLocked.amount += additionalAmount;
    
    // Transfer LP tokens from user to contract
    bool success = lpToken.transferFrom(msg.sender, address(this), additionalAmount);
    if (!success) revert TransferFailed();
    
    uint256 lockTime = userLocked.unlockTime;
    uint256 votingPower = calculateVotingPower(userLocked.amount, lockTime);
    
    // Emit with interface parameters
    emit Deposit(msg.sender, additionalAmount, lockTime, votingPower);
}
```

Users can add more LP tokens to their existing lock without changing the unlock time. This increases their voting power proportionally.

### Extending Lock Duration

```solidity
function extendLock(uint256 lockDuration) external nonReentrant whenInitialized {
    LockedBalance storage userLock = locked[msg.sender];
    if (userLock.amount == 0) revert NoLockFound();
    
    // Align the new unlock time to a week boundary using DragonDateTimeLib
    uint256 newUnlockTime = DragonDateTimeLib.calculateLockEndAligned(userLock.unlockTime, lockDuration);
    
    if (newUnlockTime <= userLock.unlockTime) revert LockTimeNotInFuture();
    if (newUnlockTime > block.timestamp + MAX_LOCK_TIME) revert LockTimeTooLong();
    if (newUnlockTime < block.timestamp + MIN_LOCK_TIME) revert LockTimeTooShort();

    // Calculate old voting power
    uint256 oldVotingPower = calculateVotingPower(userLock.amount, userLock.unlockTime);

    // Update unlock time
    userLock.unlockTime = newUnlockTime;

    // Calculate new voting power
    uint256 newVotingPower = calculateVotingPower(userLock.amount, newUnlockTime);

    // Update user point history
    userPointEpoch[msg.sender] += 1;
    uint256 userEpoch = userPointEpoch[msg.sender];
    userPointHistory[msg.sender][userEpoch] = Point({
        bias: newVotingPower,
        slope: 0,
        timestamp: block.timestamp
    });

    // Update total supply
    totalSupply = totalSupply - oldVotingPower + newVotingPower;

    // Update global point history
    epoch += 1;
    pointHistory[epoch] = Point({
        bias: totalSupply,
        slope: 0,
        timestamp: block.timestamp
    });

    // Emit LockUpdated event instead of Deposit
    emit LockUpdated(msg.sender, lockDuration, newVotingPower);
}
```

Users can extend the duration of their existing lock to increase their voting power. The new unlock time is aligned to a week boundary, and voting power is recalculated.

### Withdrawing Tokens

```solidity
function withdraw() external nonReentrant whenInitialized {
    LockedBalance storage userLock = locked[msg.sender];
    if (userLock.amount == 0) revert NoLockFound();
    if (block.timestamp < userLock.unlockTime) revert LockNotExpired();

    // Save the amount to withdraw
    uint256 amount = userLock.amount;

    // Clear the lock before any external calls
    userLock.amount = 0;
    userLock.unlockTime = 0;

    // Update total supply (voting power should already be 0 since lock expired)
    uint256 oldVotingPower = calculateVotingPower(amount, userLock.unlockTime);
    if (oldVotingPower > 0) {
        totalSupply = totalSupply > oldVotingPower ? totalSupply - oldVotingPower : 0;
    }

    // Update user point history
    userPointEpoch[msg.sender] += 1;
    uint256 userEpoch = userPointEpoch[msg.sender];
    userPointHistory[msg.sender][userEpoch] = Point({
        bias: 0,
        slope: 0,
        timestamp: block.timestamp
    });

    // Update global point history
    epoch += 1;
    pointHistory[epoch] = Point({
        bias: totalSupply,
        slope: 0,
        timestamp: block.timestamp
    });

    // Transfer tokens back to user
    bool success = lpToken.transfer(msg.sender, amount);
    if (!success) revert TransferFailed();

    emit Withdraw(msg.sender, amount);
    emit Supply(totalSupply + oldVotingPower, totalSupply);
}
```

Once a lock expires, users can withdraw their LP tokens. This removes their voting power and updates the total supply.

## Voting Power Calculation

The ve69LP contract uses a sophisticated voting power calculation that applies a non-linear boost based on lock time:

```solidity
function calculateVotingPower(uint256 _amount, uint256 _unlockTime) public view returns (uint256) {
    if (_amount == 0 || _unlockTime <= block.timestamp) {
        return 0;
    }
    
    uint256 timeDiff = _unlockTime - block.timestamp;
    if (timeDiff > MAX_LOCK_TIME) {
        timeDiff = MAX_LOCK_TIME;
    }
    
    // Calculate time ratio as a percentage of MAX_LOCK_TIME (scaled by 1e18)
    uint256 timeRatio = (timeDiff * PRECISION) / MAX_LOCK_TIME;
    
    // Apply cube root scaling for non-linear boost using project's math library
    uint256 nonLinearBoost = DragonMathLib.cubeRoot(timeRatio);
    
    // Scale nonLinearBoost by maxVP
    uint256 boostMultiplier = (nonLinearBoost * maxVP) / 10000;
    
    // Apply boost cap (cannot exceed maxBoost)
    if (boostMultiplier > maxBoost) {
        boostMultiplier = maxBoost;
    }
    
    // Calculate final voting power with the non-linear boost
    uint256 votingPower = (_amount * (10000 + boostMultiplier)) / 10000;
    
    return votingPower;
}
```

This calculation:
1. Determines the time ratio of the lock as a percentage of the maximum lock time
2. Applies cube root scaling to create a non-linear boost
3. Scales the boost by the maximum voting power multiplier (maxVP)
4. Caps the boost at the maximum allowed boost
5. Applies the boost to the locked amount to determine voting power

## Voting Power Boost Curve

The non-linear boost creates a curve that incentivizes longer lock durations while still providing meaningful voting power for shorter locks:
```

```mermaidxychart-beta
    title "Voting Power Multiplier by Lock Duration"
    x-axis "Lock Duration (Years)" [0, 1, 2, 3, 4]
    y-axis "Multiplier" 1 --> 2.5
    line[1, 1.42, 1.78, 2.13, 2.5]
```

The cube root scaling provides these benefits:
- More significant initial boost for shorter lock periods (encouraging participation)
- Diminishing returns for extremely long locks (avoiding excessive concentration of power)
- Smooth progression that avoids arbitrary thresholds

## View Functions

The contract provides several view functions to query voting power and lock information:

```solidity
// Get current voting power of a user
function votingPowerOf(address _user) external view returns (uint256);

// Get historical voting power at a specific timestamp
function getVotingPowerAt(address user, uint256 timestamp) external view returns (uint256);

// Get total voting power
function getTotalVotingPower() external view returns (uint256);

// Get lock information for a user
function getUserLock(address user) external view returns (uint256 amount, uint256 end);

// Check if a user has an active lock
function hasActiveLock(address _user) external view returns (bool);
```

These functions enable:
- Governance mechanisms to calculate voting power for proposals
- User interfaces to display lock information
- Historical voting power queries for snapshot-based voting

## Lock Flow Example

```mermaid
sequenceDiagram
participant User
participant LPToken as LP Token
participant ve69LP as ve69LP Contract
participant Governance as Governance System
    User ->> LPToken: Approve(ve69LP, amount)
    User ->> ve69LP: createLock(amount, duration)
    ve69LP ->> LPToken: transferFrom(user, ve69LP, amount)
    ve69LP ->> ve69LP: Calculate voting power
    ve69LP ->> ve69LP: Update user point history
    ve69LP ->> ve69LP: Update global point history

    Note over User, ve69LP: Lock Active Period
    Governance ->> ve69LP: getVotingPower(user)
    ve69LP -->> Governance: Return voting power
    Governance ->> User: Allow voting with power

    Note over User, ve69LP: Time Passes...

    alt Extend Lock
    User ->> ve69LP: extendLock(newDuration)
        ve69LP ->> ve69LP: Recalculate voting power
        ve69LP ->> ve69LP: Update histories
    else Increase Amount
    User ->> LPToken: Approve(ve69LP, additionalAmount)
    User ->> ve69LP: increaseLockAmount(additionalAmount)
        ve69LP ->> LPToken: transferFrom(user, ve69LP, additionalAmount)
        ve69LP ->> ve69LP: Recalculate voting power
        ve69LP ->> ve69LP: Update histories
    Note over User, ve69LP: Lock Expires
    User ->> ve69LP: withdraw()
    ve69LP ->> ve69LP: Set voting power to 0
    ve69LP ->> LPToken: transfer(user, amount)
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
