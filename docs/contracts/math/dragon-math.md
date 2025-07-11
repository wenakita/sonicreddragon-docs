---
title: DRAGON Math
sidebar_position: 1
description: Detailed explanation of this concept
---
# DragonMath Library

The**DragonMath**library is the core mathematical engine powering the OmniDragon ecosystem. It provides secure, gas-optimized mathematical functions for probability calculations, boost multipliers, fee processing, and complex financial computations.

## Overview

DragonMath serves as the mathematical foundation for:
-**Probability Calculations**: Lottery win probability and randomness distribution
-**Boost Multipliers**: Voting power and staking reward calculations
-**Fee Processing**: Dynamic fee calculations and distribution ratios
-**Financial Mathematics**: Interest rates, yield calculations, and token economics
-**Security Functions**: Overflow protection and precision handling

## Key Features

### 🧮 Advanced Mathematics
-**Precision Arithmetic**: 18-decimal precision for accurate calculations
-**Overflow Protection**: SafeMath integration with custom optimizations
-**Gas Optimization**: Efficient algorithms for on-chain computation
-**Rounding Control**: Configurable rounding modes for different use cases

###  Specialized Functions
-**Probability Models**: Statistical functions for jackpot and gaming
-**Boost Calculations**: Non-linear boost curves for incentive systems
-**Fee Mathematics**: Complex fee distribution and processing logic
-**Token Economics**: Supply, inflation, and deflation calculations

### 🔒 Security Features
-**Bounds Checking**: Automatic validation of input ranges
-**Precision Loss Prevention**: Careful handling of decimal operations
-**Integer Overflow Protection**: Safe arithmetic operations
-**Deterministic Results**: Consistent outputs across different environments

## Core Constants

### Precision and Scaling

```solidity
uint256 public constant PRECISION = 1e18;           // 18 decimal precision
uint256 public constant BPS_DENOMINATOR = 10000;    // 100% = 10000 basis points
uint256 public constant PERCENTAGE_DENOMINATOR = 100; // 100% = 100
uint256 public constant MAX_PERCENTAGE = 100;       // Maximum percentage value
```

### Boost System Constants

```solidity
uint256 public constant MAX_BOOST_BPS = 5000;       // 50% maximum boost
uint256 public constant MIN_BOOST_BPS = 0;          // 0% minimum boost
uint256 public constant BOOST_CURVE_FACTOR = 2;     // Boost curve steepness
uint256 public constant MAX_VOTING_POWER = 1000 * PRECISION; // Max voting power for calculations
```

### Mathematical Limits

```solidity
uint256 public constant MAX_SAFE_UINT256 = type(uint256).max / 2; // Safe maximum for calculations
uint256 public constant MIN_CALCULATION_AMOUNT = 1e6;  // Minimum amount for calculations (0.000001)
uint256 public constant MAX_CALCULATION_AMOUNT = 1e30; // Maximum amount for calculations
```

## Core Functions

### Basic Mathematical Operations

#### Safe Multiplication with Precision
```solidity
function mulDiv(uint256 a, uint256 b, uint256 denominator) 
    public pure returns (uint256 result);
```**Purpose**: Performs `(a * b) / denominator` with overflow protection and precision handling.**Features**:
- Overflow protection for intermediate calculations
- Precision preservation for large numbers
- Gas-optimized implementation
- Handles edge cases (zero values, maximum values)

#### Percentage Calculations
```solidity
function calculatePercentage(uint256 amount, uint256 percentage) 
    public pure returns (uint256);
```**Purpose**: Calculates percentage of an amount with precision.**Formula**: `result = (amount * percentage) / PERCENTAGE_DENOMINATOR`

#### Basis Points Calculations
```solidity
function calculateBasisPoints(uint256 amount, uint256 bps) 
    public pure returns (uint256);
```**Purpose**: Calculates basis points of an amount (1 bps = 0.01%).**Formula**: `result = (amount * bps) / BPS_DENOMINATOR`

### Boost Multiplier Calculations

#### Calculate Boost Multiplier
```solidity
function calculateBoostMultiplier(uint256 votingPower, uint256 maxBoostBps) 
    public pure returns (uint256 multiplier);
```**Purpose**: Calculates boost multiplier based on voting power using a non-linear curve.**Algorithm**:
```solidity
// Normalize voting power to [0, 1] range
uint256 normalizedPower = min(votingPower, MAX_VOTING_POWER) * PRECISION / MAX_VOTING_POWER;

// Apply boost curve (square root for diminishing returns)
uint256 boostFactor = sqrt(normalizedPower * PRECISION) / sqrt(PRECISION);

// Calculate final boost
uint256 boostBps = (boostFactor * maxBoostBps) / PRECISION;

// Return as multiplier (10000 = 1.0x, 15000 = 1.5x)
return BPS_DENOMINATOR + boostBps;
```**Features**:
- Non-linear boost curve with diminishing returns
- Configurable maximum boost percentage
- Smooth scaling from 0 to maximum voting power
- Gas-optimized square root implementation

#### Apply Boost to Amount
```solidity
function applyBoost(uint256 baseAmount, uint256 boostMultiplier) 
    public pure returns (uint256 boostedAmount);
```**Purpose**: Applies a boost multiplier to a base amount.**Formula**: `boostedAmount = (baseAmount * boostMultiplier) / BPS_DENOMINATOR`

### Probability Mathematics

#### Calculate Win Probability
```solidity
function calculateWinProbability(
    uint256 baseAmount,
    uint256 minAmount,
    uint256 maxAmount,
    uint256 minProbabilityBps,
    uint256 maxProbabilityBps
) public pure returns (uint256 probabilityBps);
```**Purpose**: Calculates win probability using linear interpolation between bounds.**Algorithm**:
```solidity
if (baseAmount <= minAmount) {
    return minProbabilityBps;
} else if (baseAmount >= maxAmount) {
    return maxProbabilityBps;
} else {
    // Linear interpolation
    uint256 range = maxAmount - minAmount;
    uint256 position = baseAmount - minAmount;
    uint256 probabilityRange = maxProbabilityBps - minProbabilityBps;
    
    return minProbabilityBps + (position * probabilityRange) / range;
}
```

#### Determine Random Outcome
```solidity
function determineOutcome(uint256 probabilityBps, uint256 randomValue) 
    public pure returns (bool success);
```**Purpose**: Determines if a random outcome succeeds based on probability.**Algorithm**:
```solidity
// Calculate threshold
uint256 threshold = (probabilityBps * type(uint256).max) / BPS_DENOMINATOR;

// Check if random value is below threshold
return randomValue < threshold;
```

### Fee Calculation Functions

#### Calculate Dynamic Fees
```solidity
function calculateDynamicFees(
    uint256 baseAmount,
    uint256 baseFeesBps,
    uint256 volumeMultiplier,
    uint256 timeMultiplier
) public pure returns (uint256 totalFees);
```**Purpose**: Calculates dynamic fees based on multiple factors.**Algorithm**:
```solidity
// Apply base fees
uint256 baseFees = (baseAmount * baseFeesBps) / BPS_DENOMINATOR;

// Apply volume multiplier
uint256 volumeAdjustedFees = (baseFees * volumeMultiplier) / PRECISION;

// Apply time multiplier
uint256 finalFees = (volumeAdjustedFees * timeMultiplier) / PRECISION;

return finalFees;
```

#### Distribute Fees
```solidity
function distributeFees(
    uint256 totalFees,
    uint256[] memory distributionBps
) public pure returns (uint256[] memory distributions);
```**Purpose**: Distributes total fees according to specified basis point allocations.**Validation**: Ensures distribution basis points sum to exactly 10000 (100%).

### Advanced Mathematical Functions

#### Square Root Calculation
```solidity
function sqrt(uint256 x) public pure returns (uint256 result);
```**Purpose**: Calculates integer square root using Newton's method.**Algorithm**: Optimized Newton-Raphson iteration for gas efficiency.

#### Power Calculation
```solidity
function pow(uint256 base, uint256 exponent) public pure returns (uint256 result);
```**Purpose**: Calculates integer exponentiation with overflow protection.**Features**:
- Efficient exponentiation by squaring
- Overflow detection and prevention
- Gas-optimized implementation

#### Logarithm Calculation
```solidity
function log2(uint256 x) public pure returns (uint256 result);
```**Purpose**: Calculates base-2 logarithm for advanced calculations.**Use Cases**: Compound interest, decay functions, scaling algorithms.

### Token Economics Functions

#### Calculate Inflation
```solidity
function calculateInflation(
    uint256 currentSupply,
    uint256 inflationRateBps,
    uint256 timeElapsed
) public pure returns (uint256 newTokens);
```**Purpose**: Calculates token inflation over time.**Formula**: `newTokens = currentSupply * inflationRateBps * timeElapsed / (BPS_DENOMINATOR * SECONDS_PER_YEAR)`

#### Calculate Compound Interest
```solidity
function calculateCompoundInterest(
    uint256 principal,
    uint256 annualRateBps,
    uint256 timeElapsed,
    uint256 compoundingFrequency
) public pure returns (uint256 finalAmount);
```**Purpose**: Calculates compound interest for staking and yield farming.**Algorithm**: Uses approximation for gas efficiency while maintaining accuracy.

### Validation Functions

#### Validate Range
```solidity
function validateRange(uint256 value, uint256 min, uint256 max) 
    public pure returns (bool valid);
```**Purpose**: Validates that a value falls within specified bounds.

#### Validate Percentage
```solidity
function validatePercentage(uint256 percentage) public pure returns (bool valid);
```**Purpose**: Validates that a percentage is within 0-100 range.

#### Validate Basis Points
```solidity
function validateBasisPoints(uint256 bps) public pure returns (bool valid);
```**Purpose**: Validates that basis points are within 0-10000 range.

## Security Features

### Overflow Protection

All mathematical operations include overflow protection:

```solidity
function safeMul(uint256 a, uint256 b) internal pure returns (uint256) {
    require(a == 0 || (a * b) / a == b, "DragonMath: multiplication overflow");
    return a * b;
}

function safeDiv(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b > 0, "DragonMath: division by zero");
    return a / b;
}
```

### Precision Loss Prevention

```solidity
function preservePrecision(uint256 numerator, uint256 denominator) 
    internal pure returns (uint256) {
    require(denominator > 0, "DragonMath: zero denominator");
    
    // Add half of denominator for rounding
    return (numerator + denominator / 2) / denominator;
}
```

### Input Validation

```solidity
modifier validInput(uint256 value) {
    require(value >= MIN_CALCULATION_AMOUNT, "DragonMath: value too small");
    require(value <= MAX_CALCULATION_AMOUNT, "DragonMath: value too large");
    _;
}
```

## Gas Optimization Techniques

### Efficient Algorithms

1.**Bit Manipulation**: Uses bit operations for power-of-2 calculations
2.**Lookup Tables**: Pre-computed values for common calculations
3.**Early Returns**: Optimized control flow to minimize gas usage
4.**Packed Structs**: Efficient storage layout for complex calculations

### Assembly Optimizations

Critical functions use inline assembly for maximum efficiency:

```solidity
function efficientMulDiv(uint256 a, uint256 b, uint256 c) 
    internal pure returns (uint256 result) {
    assembly {
        result := div(mul(a, b), c)
    }
}
```

## Integration Examples

### Lottery Probability Calculation

```solidity
// Calculate jackpot win probability
uint256 swapAmount = 1000 * 1e18; // $1000
uint256 votingPower = 500 * 1e18;  // 500 voting power

// Base probability (0.04% to 4% based on amount)
uint256 baseProb = DragonMath.calculateWinProbability(
    swapAmount,
    1 * 1e18,      // $1 minimum
    10000 * 1e18,  // $10,000 maximum
    4,             // 0.04% minimum probability
    400            // 4% maximum probability
);

// Apply voting power boost
uint256 boostMultiplier = DragonMath.calculateBoostMultiplier(
    votingPower,
    5000  // 50% maximum boost
);

uint256 finalProb = DragonMath.applyBoost(baseProb, boostMultiplier);
```

### Fee Distribution

```solidity
// Distribute fees among multiple recipients
uint256 totalFees = 1000 * 1e18; // 1000 tokens

uint256[] memory distributionBps = new uint256[](3);
distributionBps[0] = 6900; // 69% to jackpot
distributionBps[1] = 2410; // 24.1% to stakers
distributionBps[2] = 690;  // 6.9% to burn

uint256[] memory distributions = DragonMath.distributeFees(
    totalFees,
    distributionBps
);
```

### Boost Calculation

```solidity
// Calculate staking rewards with voting power boost
uint256 baseReward = 100 * 1e18;  // 100 tokens base reward
uint256 userVotingPower = 750 * 1e18; // User's voting power

uint256 boostMultiplier = DragonMath.calculateBoostMultiplier(
    userVotingPower,
    3000  // 30% maximum boost
);

uint256 boostedReward = DragonMath.applyBoost(baseReward, boostMultiplier);
```

## Error Handling

### Custom Errors

```solidity
error DragonMath__InvalidInput(uint256 value, uint256 min, uint256 max);
error DragonMath__DivisionByZero();
error DragonMath__Overflow();
error DragonMath__PrecisionLoss();
error DragonMath__InvalidPercentage(uint256 percentage);
error DragonMath__InvalidBasisPoints(uint256 bps);
```

### Error Recovery

```solidity
function safeCalculation(uint256 a, uint256 b) 
    public pure returns (uint256 result, bool success) {
    try this.riskyCalculation(a, b) returns (uint256 _result) {
        return (_result, true);
    } catch {
        return (0, false);
    }
}
```

## Testing and Verification

### Unit Tests

The library includes comprehensive unit tests covering:
- Edge cases (zero values, maximum values)
- Precision accuracy
- Gas usage optimization
- Security vulnerabilities

### Formal Verification

Critical functions undergo formal verification to ensure:
- Mathematical correctness
- Overflow protection
- Precision preservation
- Deterministic behavior

## Best Practices

### For Developers

1.**Always validate inputs**before calling DragonMath functions
2.**Handle precision loss**in multi-step calculations
3.**Use appropriate precision**for your use case
4.**Test edge cases**thoroughly
5.**Monitor gas usage**for complex calculations

### For Protocol Integration

1.**Cache frequently used calculations**to save gas
2.**Batch operations**when possible
3.**Use view functions**for read-only calculations
4.**Implement proper error handling**for all mathematical operations

## Performance Metrics

### Gas Costs

| Function | Gas Cost | Description |
|----------|----------|-------------|
| `mulDiv` | ~200 gas | Basic multiplication with division |
| `calculateBoostMultiplier` | ~500 gas | Boost calculation with square root |
| `calculateWinProbability` | ~300 gas | Linear interpolation |
| `distributeFees` | ~100 gas per recipient | Fee distribution |
| `sqrt` | ~400 gas | Square root calculation |

### Precision Accuracy

-**18 decimal places**for token amounts
-**4 decimal places**for percentages (basis points)
-**Rounding errors**< 1 wei for typical operations
-**Deterministic results**across all EVM implementations

## Links

-**Social**: [Twitter](https://x.com/sonicreddragon) | [Telegram](https://t.me/sonicreddragon)
-**Repository**: [GitHub](https://github.com/wenakita/OmniDragon)
-**Audit**: [Security Documentation](/audit/AUDIT_DOCUMENTATION_SUMMARY)
-**Integration**: [Lottery Manager](/contracts/core/jackpot-manager) | [OmniDragon Token](/contracts/core/OmniDragon) 
