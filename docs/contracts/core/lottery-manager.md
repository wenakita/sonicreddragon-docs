# OmniDragon Lottery Manager

The **OmniDragonLotteryManager** is the single source of truth for all lottery operations in the OmniDragon ecosystem. It handles lottery entry creation, probability calculations, randomness integration, and payout processing with sophisticated mathematical models.

## Overview

The Lottery Manager serves as the central hub for:
- **Lottery Entry Creation**: Automatic entries from OmniDragon swaps
- **Probability Calculations**: Advanced mathematical models for win chances
- **Randomness Integration**: Seamless integration with RandomnessProvider
- **Payout Processing**: Automated jackpot distribution and winner rewards
- **User Management**: Cooldowns, limits, and statistics tracking

## Key Features

### 🎰 Automated Lottery System
- **Swap-Based Entries**: Automatic lottery entries on qualifying token swaps
- **Dynamic Probabilities**: Win chances based on swap amount and voting power
- **Cooldown Protection**: 60-second cooldown between entries
- **Entry Limits**: Maximum 100 pending entries per user

### 🧮 Advanced Mathematics
- **Probability Scaling**: Linear scaling from $1 to $10,000 swap amounts
- **Voting Power Boost**: Enhanced win chances for ve69LP holders
- **Jackpot Calculations**: Dynamic payout percentages based on jackpot size
- **Market Conditions**: Payout adjustments based on market factors

### 🔒 Security & Fairness
- **VRF Integration**: Cryptographically secure randomness
- **MEV Protection**: Commit-reveal schemes for sensitive operations
- **Access Control**: Only OmniDragon token can create entries
- **Comprehensive Validation**: Input validation and state checks

## Contract Architecture

```solidity
contract OmniDragonLotteryManager is Ownable, ReentrancyGuard {
    using Math for uint256;
    
    // Core components
    address public immutable omniDragonToken;
    address public jackpotVault;
    address public randomnessProvider;
    address public priceOracle;
    
    // Entry management
    mapping(uint256 => LotteryEntry) public lotteryEntries;
    mapping(address => uint256) public lastEntryTime;
    mapping(address => uint256) public userEntryCount;
}
```

## Lottery Constants

### Probability Constants

```solidity
uint256 public constant BASE_WIN_PROB_BPS = 4;           // 0.04% base probability
uint256 public constant MAX_BASE_WIN_PROB_BPS = 400;     // 4% max base probability
uint256 public constant MAX_BOOSTED_WIN_PROB_BPS = 1000; // 10% max boosted probability
```

### Amount Bounds

```solidity
uint256 public constant MIN_AMOUNT_USD = 1 * 1e18;       // $1 minimum
uint256 public constant MAX_AMOUNT_USD = 10000 * 1e18;   // $10,000 maximum
uint256 public constant MIN_SWAP_AMOUNT_USD = 10 * 1e18; // $10 minimum for entry
```

### Payout Constants

```solidity
uint256 public constant MIN_PAYOUT_BPS = 5000;           // 50% minimum payout
uint256 public constant MAX_PAYOUT_BPS = 8000;           // 80% maximum payout
uint256 public constant BASE_PAYOUT_BPS = 6900;          // 69% base payout
uint256 public constant MAX_PAYOUT_REDUCTION_BPS = 1900; // 19% max reduction
```

### System Limits

```solidity
uint256 public constant COOLDOWN_PERIOD = 60;            // 60 seconds between entries
uint256 public constant MAX_ENTRIES_PER_USER = 100;      // Max pending entries per user
uint256 public constant MAX_CLEANUP_BATCH_SIZE = 50;     // Max cleanup batch size
```

## Data Structures

### Lottery Entry

```solidity
struct LotteryEntry {
    address user;                    // User address
    uint256 swapAmountUSD;          // Swap amount in USD (scaled by 1e18)
    uint256 userVotingPower;        // User's ve69LP voting power
    uint256 probabilityBps;         // Calculated win probability in basis points
    uint256 timestamp;              // Entry timestamp
    uint256 randomnessRequestId;    // Request ID for randomness
    bool processed;                 // Whether entry has been processed
    bool won;                       // Whether user won the lottery
    uint256 payoutAmount;           // Payout amount if won
    bool usedPoolRandomness;        // Whether pool randomness was used
    bool paymentFailed;             // Whether payout failed
}
```

### Lottery Result

```solidity
struct LotteryResult {
    uint256 baseWinProbability;     // Base win probability in basis points
    uint256 boostedWinProbability;  // Boosted win probability in basis points
    uint256 finalProbabilityBps;    // Final probability to use with VRF
}
```

### Jackpot Payout

```solidity
struct JackpotPayout {
    uint256 payoutBps;              // Final jackpot payout percentage in basis points
    uint256 boostApplied;           // Boost multiplier applied (10000 = 1.0x)
    uint256 basePayoutBps;          // Base payout before boost
}
```

## Core Functions

### Lottery Entry Creation

#### Create Lottery Entry
```solidity
function createLotteryEntry(
    address user,
    uint256 swapAmountUSD,
    uint256 userVotingPower
) external nonReentrant returns (uint256 entryId);
```

**Access**: Only OmniDragon token contract

**Process**:
1. Validates user and swap amount
2. Checks cooldown period and entry limits
3. Calculates win probability
4. Attempts to use randomness pool for instant processing
5. Falls back to VRF request if pool unavailable
6. Processes win/loss and handles payouts

**Requirements**:
- Caller must be OmniDragon token contract
- Swap amount must be ≥ $10 USD
- User must not be in cooldown period
- User must have < 100 pending entries

### Randomness Integration

#### Fulfill Randomness
```solidity
function fulfillRandomness(uint256 randomnessRequestId, uint256 randomValue) external nonReentrant;
```

**Access**: Only randomness provider

**Process**:
1. Validates randomness request
2. Determines win/loss using secure random value
3. Processes payout if winner
4. Updates user statistics
5. Emits processing events

### Mathematical Calculations

#### Calculate Lottery Probability
```solidity
function _calculateLotteryProbability(
    uint256 swapAmountUSD,
    uint256 userVotingPower
) internal pure returns (LotteryResult memory result);
```

**Algorithm**:
1. **Base Probability**: Linear scaling from 0.04% to 4% based on swap amount
2. **Voting Power Boost**: Additional boost for ve69LP holders
3. **Final Probability**: Capped at 10% maximum

**Formula**:
```solidity
// Base probability calculation
if (swapAmountUSD <= MIN_AMOUNT_USD) {
    baseProb = BASE_WIN_PROB_BPS; // 0.04%
} else if (swapAmountUSD >= MAX_AMOUNT_USD) {
    baseProb = MAX_BASE_WIN_PROB_BPS; // 4%
} else {
    // Linear interpolation
    additionalProb = (swapAmountUSD - MIN_AMOUNT_USD) * 
                    (MAX_BASE_WIN_PROB_BPS - BASE_WIN_PROB_BPS) / 
                    (MAX_AMOUNT_USD - MIN_AMOUNT_USD);
    baseProb = BASE_WIN_PROB_BPS + additionalProb;
}

// Apply voting power boost
if (userVotingPower > 0) {
    boostMultiplier = DragonMath.calculateBoostMultiplier(userVotingPower);
    boostedProb = baseProb * boostMultiplier / BPS_DENOMINATOR;
    finalProb = min(boostedProb, MAX_BOOSTED_WIN_PROB_BPS);
}
```

#### Determine Lottery Win
```solidity
function _determineLotteryWin(
    uint256 probabilityBps,
    uint256 secureRandomValue
) internal pure returns (bool isWinner);
```

**Algorithm**:
```solidity
// Calculate threshold for win determination
uint256 threshold = probabilityBps * type(uint256).max / BPS_DENOMINATOR;

// Determine win: randomValue < threshold
return secureRandomValue < threshold;
```

#### Calculate Jackpot Payout
```solidity
function _calculateJackpotPayout(
    uint256 jackpotSize,
    uint256 winnerVotingPower,
    uint256 marketConditionFactor
) internal pure returns (JackpotPayout memory result);
```

**Algorithm**:
1. **Base Payout**: 69% with reductions for large jackpots
2. **Market Adjustment**: ±10% based on market conditions
3. **Voting Power Bonus**: Up to 10% additional for ve69LP holders

**Formula**:
```solidity
// Base payout with jackpot size adjustment
basePayout = BASE_PAYOUT_BPS; // 69%
if (jackpotSize > JACKPOT_LARGE_THRESHOLD) {
    reduction = min(MAX_PAYOUT_REDUCTION_BPS, jackpotSize / (1000 * PRECISION));
    basePayout = max(MIN_PAYOUT_BPS, basePayout - reduction);
}

// Market condition adjustment
if (marketConditionFactor > 50) {
    basePayout += (marketConditionFactor - 50) * 10;
} else if (marketConditionFactor < 50) {
    basePayout -= (50 - marketConditionFactor) * 10;
}

// Voting power bonus
if (winnerVotingPower > 0) {
    effectivePower = min(winnerVotingPower, MAX_VOTING_POWER_FOR_JACKPOT_BONUS);
    bonusBps = effectivePower * 1000 / MAX_VOTING_POWER_FOR_JACKPOT_BONUS; // Up to 10%
    finalPayout = basePayout + bonusBps;
}
```

## Administrative Functions

### Component Management

#### Update Components
```solidity
function updateJackpotVault(address _jackpotVault) external onlyOwner;
function updateRandomnessProvider(address _randomnessProvider) external onlyOwner;
function updatePriceOracle(address _priceOracle) external onlyOwner;
```

### Entry Management

#### Cleanup Failed Entries
```solidity
function cleanupFailedEntries(uint256[] calldata entryIds) external onlyOwner;
```

#### Retry Failed Payments
```solidity
function retryFailedPayment(uint256 entryId) external onlyOwner;
```

### Emergency Functions

#### Emergency Pause
```solidity
function emergencyPause() external onlyOwner;
function emergencyUnpause() external onlyOwner;
```

## Events

### Core Events

```solidity
event LotteryEntryCreated(
    uint256 indexed entryId,
    address indexed user,
    uint256 swapAmountUSD,
    uint256 probabilityBps,
    uint256 randomnessRequestId
);

event LotteryProcessed(
    uint256 indexed entryId,
    address indexed user,
    bool won,
    uint256 randomValue,
    uint256 payoutAmount
);

event LotteryWin(
    uint256 indexed entryId,
    address indexed winner,
    uint256 swapAmountUSD,
    uint256 probabilityBps,
    uint256 payoutAmount
);
```

### System Events

```solidity
event PaymentFailed(
    uint256 indexed entryId,
    address indexed winner,
    uint256 payoutAmount,
    string reason
);

event ComponentUpdated(
    string indexed component,
    address indexed oldAddress,
    address indexed newAddress
);
```

## Integration Guide

### For OmniDragon Token

The lottery manager is designed to be called exclusively by the OmniDragon token contract:

```solidity
// In OmniDragon._transfer()
if (isQualifyingSwap && shouldCreateLotteryEntry) {
    uint256 swapAmountUSD = getSwapAmountInUSD(amount);
    uint256 userVotingPower = getVotingPower(to);
    
    uint256 entryId = lotteryManager.createLotteryEntry(
        to,
        swapAmountUSD,
        userVotingPower
    );
}
```

### For Randomness Provider

The randomness provider calls back with VRF results:

```solidity
// In RandomnessProvider.fulfillRandomness()
lotteryManager.fulfillRandomness(requestId, randomValue);
```

### For Jackpot Vault

The lottery manager requests payouts from the vault:

```solidity
// In LotteryManager._processLotteryWin()
try IDragonJackpotVault(jackpotVault).processLotteryWin(
    winner,
    payoutAmount
) {
    // Payout successful
} catch {
    // Mark payment as failed for retry
}
```

## Security Features

### Access Control

```solidity
modifier onlyOmniDragonToken() {
    require(msg.sender == omniDragonToken, "Only OmniDragon token");
    _;
}

modifier onlyRandomnessProvider() {
    require(msg.sender == randomnessProvider, "Only randomness provider");
    _;
}
```

### Input Validation

```solidity
function _validateEntry(address user, uint256 swapAmountUSD) internal view {
    require(user != address(0), "Invalid user address");
    require(swapAmountUSD >= MIN_SWAP_AMOUNT_USD, "Swap amount below minimum");
    require(
        block.timestamp >= lastEntryTime[user] + COOLDOWN_PERIOD,
        "Cooldown period active"
    );
    require(userEntryCount[user] < MAX_ENTRIES_PER_USER, "Too many pending entries");
}
```

### Reentrancy Protection

All external functions use `nonReentrant` modifier to prevent reentrancy attacks.

### Randomness Security

- Uses cryptographically secure VRF from RandomnessProvider
- Fallback to randomness pool for efficiency
- Proper threshold calculation for win determination

## Best Practices

### For Developers

1. **Monitor Entry Limits**: Track user entry counts to avoid rejections
2. **Handle Cooldowns**: Implement proper timing for entry creation
3. **Validate Amounts**: Ensure swap amounts meet minimum requirements
4. **Error Handling**: Implement proper error handling for failed entries

### For Protocol Operators

1. **Monitor Failed Payments**: Regularly check for and retry failed payments
2. **Cleanup Entries**: Periodically cleanup old failed entries
3. **Component Updates**: Keep randomness provider and vault addresses updated
4. **Statistics Tracking**: Monitor win rates and payout amounts

## Error Handling

### Common Errors

```solidity
error InvalidUser();
error SwapAmountBelowMinimum();
error CooldownPeriodActive();
error TooManyPendingEntries();
error EntryNotFound();
error EntryAlreadyProcessed();
error PaymentFailed();
```

### Troubleshooting

- **Cooldown Active**: Wait for cooldown period to expire
- **Too Many Entries**: Wait for existing entries to be processed
- **Payment Failed**: Check jackpot vault balance and configuration
- **Invalid Randomness**: Verify randomness provider configuration

## Statistics and Monitoring

### Key Metrics

```solidity
uint256 public entryIdCounter;     // Total entries created
uint256 public totalEntries;       // Total entries processed
uint256 public totalWins;          // Total winning entries
uint256 public totalPayouts;       // Total payout amount
```

### User Statistics

```solidity
mapping(address => uint256) public lastEntryTime;    // Last entry timestamp
mapping(address => uint256) public userEntryCount;   // Pending entries per user
```

### Performance Monitoring

- Entry creation rate
- Processing time
- Win rate analysis
- Payout distribution
- Failed payment tracking

## Mathematical Models

### Probability Distribution

The lottery uses a sophisticated probability model:

1. **Base Probability**: Linear scaling ensures fair distribution
2. **Voting Power Boost**: Rewards long-term token holders
3. **Maximum Caps**: Prevents excessive win rates
4. **Market Integration**: Considers external market conditions

### Payout Optimization

The payout system balances multiple factors:

1. **Jackpot Size**: Larger jackpots have slightly reduced payouts
2. **Market Conditions**: Dynamic adjustments based on market health
3. **Voting Power**: Bonus rewards for governance participants
4. **Sustainability**: Ensures long-term protocol viability

## Links

- **Social**: [Twitter](https://x.com/sonicreddragon) | [Telegram](https://t.me/sonicreddragon)
- **Repository**: [GitHub](https://github.com/wenakita/omnidragon)
- **Math Library**: [DragonMath](/contracts/math/dragon-math)
- **Randomness Provider**: [Randomness Provider](/contracts/core/randomness-provider) 