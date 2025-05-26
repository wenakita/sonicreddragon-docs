# OmniDragon Technical Changes Log

## Overview

This document provides detailed technical information about specific code changes made during the recent updates. It serves as a reference for developers working on the project.

## Mathematical Library Changes

### DragonMath.sol Critical Fixes

#### 1. Cube Root Scaling Fix

**Before:**
```solidity
// CRITICAL BUG: Comparing 1e6-scaled vs 1e18-scaled values
uint256 midCubed = mid.mulDiv(mid, 1e6).mulDiv(mid, 1e6); // Results in 1e6 scaling
if (midCubed == value) return mid; // value is 1e18 scaled!
```

**After:**
```solidity
// FIXED: Proper scaling for comparison
uint256 midSquared = mid.mulDiv(mid, 1e6); // mid^2 scaled by 1e6
uint256 midCubed = midSquared.mulDiv(mid, 1e6); // mid^3 scaled by 1e6
uint256 midCubedScaled18 = midCubed.mulDiv(PRECISION, 1e6); // Scale to 1e18
if (midCubedScaled18 == value) return mid;
```

#### 2. Hermes Formula Simplification

**Before:**
```solidity
// Complex formula with fractional exponents (error-prone)
function calculateHermesValue(uint256 x, uint256 d, uint256 n) {
    // Attempted: x / (x^3 + d^(n+2))^(1/3)
    // Multiple scaling issues and complex cube root calculations
}
```

**After:**
```solidity
// Simplified formula avoiding complex on-chain calculations
function calculateDynamicAllocationFactor(uint256 x, uint256 d, uint256 n) {
    // Formula: x^2 / (1 + d*n/x)
    uint256 x2 = x.mulDiv(x, PRECISION);
    uint256 dnTerm = d.mulDiv(n, PRECISION);
    uint256 denomTerm = dnTerm.mulDiv(PRECISION, x);
    uint256 denominator = PRECISION + denomTerm;
    return x2.mulDiv(PRECISION, denominator);
}
```

#### 3. Fee Allocation Minimum Guarantees

**Before:**
```solidity
// No guarantee minimums were met
jackpotBps = someCalculation;
lpBps = someOtherCalculation;
burnBps = BPS_DENOMINATOR - jackpotBps - lpBps;
// Could violate minimums!
```

**After:**
```solidity
// Start with minimums guaranteed
jackpotBps = MIN_JACKPOT_BPS;
lpBps = MIN_LP_BPS;
burnBps = MIN_BURN_BPS;

// Distribute remaining BPS
uint256 remainingBps = BPS_DENOMINATOR - (jackpotBps + lpBps + burnBps);
// Add proportionally to existing minimums
```

### Library Consolidation Changes

#### Files Deleted
- `contracts/library/utils/DragonMathLib.sol` (221 lines)

#### Import Updates in ve69LP.sol

**Before:**
```solidity
import { DragonMathLib } from "../../library/utils/DragonMathLib.sol";
import { ve69LPMath } from "./ve69LPMath.sol";
```

**After:**
```solidity
import { ve69LPMath } from "./ve69LPMath.sol";
```

#### Function Call Updates

**Before:**
```solidity
uint256 result = DragonMathLib.cubeRoot(timeRatio);
```

**After:**
```solidity
uint256 result = ve69LPMath.cubeRoot(timeRatio);
```

## Security Fix Changes

### DragonJackpotVault.sol

#### 1. Native ETH Handling Fix

**Before:**
```solidity
receive() external payable {
    // ETH received but not tracked!
}
```

**After:**
```solidity
receive() external payable {
    require(wrappedNativeToken != address(0), "Wrapped token not set for ETH");
    require(msg.value > 0, "No ETH sent");
    
    jackpotBalances[wrappedNativeToken] += msg.value;
    emit JackpotAdded(wrappedNativeToken, msg.value);
}
```

#### 2. ReentrancyGuard Implementation

**Before:**
```solidity
contract DragonJackpotVault is IDragonJackpotVault, Ownable {
    // No reentrancy protection
}
```

**After:**
```solidity
contract DragonJackpotVault is IDragonJackpotVault, Ownable, ReentrancyGuard {
    function payJackpot(...) external onlyOwner nonReentrant {
        // Protected against reentrancy
    }
}
```

### DragonJackpotDistributor.sol

#### 1. Immutable Token Address

**Before:**
```solidity
IERC20 public token;

function setToken(address _token) external onlyOwner {
    token = IERC20(_token);
}
```

**After:**
```solidity
IERC20 public immutable token;

constructor(address _token, ...) {
    token = IERC20(_token);
    // Cannot be changed after deployment
}
```

#### 2. Array Size Limits

**Before:**
```solidity
function batchTransferToTreasury(address[] calldata tokens) external onlyOwner {
    // No size limit - could hit gas limit
}
```

**After:**
```solidity
uint256 public constant MAX_BATCH_SIZE = 100;

function batchTransferToTreasury(address[] calldata tokens) external onlyOwner {
    require(tokens.length <= MAX_BATCH_SIZE, "Batch size too large");
    // Protected against gas limit issues
}
```

## Architectural Refactoring Changes

### Lottery Logic Migration

#### Functions Moved from DragonMath.sol to OmniDragonLotteryManager.sol

**DragonMath.sol (removed):**
```solidity
function calculateLotteryProbability(uint256 swapAmountUSD, uint256 userVotingPower) public pure returns (LotteryResult memory)
function determineLotteryWin(uint256 winProbability, uint256 randomValue) public pure returns (bool)
function calculateBoostedWinProbability(uint256 baseWinProb, uint256 votingPower) public pure returns (uint256)
function calculateJackpotPayout(...) public pure returns (JackpotPayout memory)
```

**OmniDragonLotteryManager.sol (added as internal):**
```solidity
function _calculateLotteryProbability(uint256 swapAmountUSD, uint256 userVotingPower) internal pure returns (LotteryResult memory)
function _determineLotteryWin(uint256 winProbability, uint256 randomValue) internal pure returns (bool)
function _calculateBoostedWinProbability(uint256 baseWinProb, uint256 votingPower) internal pure returns (uint256)
function _calculateJackpotPayout(...) internal pure returns (JackpotPayout memory)
```

### Import Path Updates

**Example changes across multiple files:**

**Before:**
```solidity
import { IOmniDragonSwapTriggerOracle } from "./interfaces/IOmniDragonSwapTriggerOracle.sol";
import { IDragonJackpotVault } from "./interfaces/IDragonJackpotVault.sol";
```

**After:**
```solidity
import { IOmniDragonSwapTriggerOracle } from "../interfaces/core/IOmniDragonSwapTriggerOracle.sol";
import { IDragonJackpotVault } from "../interfaces/vault/IDragonJackpotVault.sol";
```

## VRF System Implementation

### New Contracts Created

#### 1. OmniDragonRandomnessProvider.sol (Sonic)
```solidity
contract OmniDragonRandomnessProvider {
    // Bucket system for high-frequency operations
    mapping(address => RandomnessBucket) public buckets;
    
    // Pool system for aggregated randomness
    uint256[] public randomnessPool;
    
    // VRF source management
    mapping(VRFSource => VRFSourceConfig) public vrfSources;
}
```

#### 2. DrandVRFIntegrator.sol (Sonic)
```solidity
contract DrandVRFIntegrator {
    // Multi-network Drand support
    mapping(bytes32 => DrandNetwork) public drandNetworks;
    
    function aggregateRandomness() external returns (uint256) {
        // Weighted aggregation from multiple Drand networks
    }
}
```

#### 3. ChainlinkVRFIntegrator.sol (Sonic)
```solidity
contract ChainlinkVRFIntegrator {
    // LayerZero integration for cross-chain VRF
    ILayerZeroEndpoint public immutable lzEndpoint;
    
    function requestRandomness(address consumer) external payable {
        // Send cross-chain message to Arbitrum
    }
}
```

#### 4. OmniDragonVRFRequester.sol (Arbitrum)
```solidity
contract OmniDragonVRFRequester is VRFConsumerBaseV2Plus {
    // Chainlink VRF 2.5 integration
    uint256 public immutable subscriptionId;
    
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        // Send result back to Sonic via LayerZero
    }
}
```

### Configuration Constants

```solidity
// Sonic Configuration
address constant SONIC_LZ_ENDPOINT = 0x6F475642a6e85809B1c36Fa62763669b1b48DD5B;
uint16 constant SONIC_CHAIN_ID = 146;
uint16 constant SONIC_LZ_CHAIN_ID = 332;

// Arbitrum Configuration  
address constant ARBITRUM_LZ_ENDPOINT = 0x1a44076050125825900e736c501f859c50fE728c;
uint16 constant ARBITRUM_CHAIN_ID = 42161;
uint16 constant ARBITRUM_LZ_CHAIN_ID = 110;

// Chainlink VRF Configuration
address constant VRF_COORDINATOR = 0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e;
bytes32 constant KEY_HASH = 0x8472ba59cf7134dfe321f4d61a430c4857e8b19cdd5230b09952a92671c24409;
uint256 constant SUBSCRIPTION_ID = 65914062761074472397678945586748169687979388122746586980459153805795126649565;
```

## Compilation Fixes

### Missing Interface Files Created

#### 1. contracts/interfaces/tokens/Ive69LP.sol
```solidity
interface Ive69LP {
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function getVotingPower(address user) external view returns (uint256);
}
```

#### 2. contracts/interfaces/governance/IJackpot.sol
```solidity
interface IJackpot {
    function addToJackpot(uint256 amount) external;
    function distributeJackpot(address winner) external;
    function getJackpotSize() external view returns (uint256);
}
```

### Mock Contracts Created

#### 1. MockOmniDragonToken.sol
```solidity
contract MockOmniDragonToken is ERC20 {
    constructor() ERC20("Mock OmniDragon", "MDRAGON") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
```

#### 2. MockLzEndpointV2.sol
```solidity
contract MockLzEndpointV2 {
    function send(...) external payable {
        // Mock implementation for testing
    }
}
```

## Performance Optimizations

### Bucket System Implementation
```solidity
// Pre-generate 1000 random numbers
function _fillBucket(address consumer) internal {
    RandomnessBucket storage bucket = buckets[consumer];
    uint256 seed = _aggregateDrandRandomness();
    
    for (uint256 i = 0; i < BUCKET_SIZE; i++) {
        bucket.randomNumbers[i] = uint256(keccak256(abi.encodePacked(seed, i)));
    }
    bucket.currentIndex = 0;
}

// Draw from bucket (gas efficient)
function drawFromBucket() external returns (uint256) {
    RandomnessBucket storage bucket = buckets[msg.sender];
    require(bucket.currentIndex < BUCKET_SIZE, "Bucket empty");
    return bucket.randomNumbers[bucket.currentIndex++];
}
```

### Pool System Implementation
```solidity
// Aggregate randomness from multiple sources
function _refreshRandomnessPool() internal {
    delete randomnessPool;
    
    // Get Chainlink seed (if available)
    uint256 chainlinkSeed = _getChainlinkSeed();
    
    // Collect Drand history
    uint256[] memory drandHistory = _collectDrandHistory(10);
    
    // Generate pool with cryptographic mixing
    for (uint256 i = 0; i < POOL_SIZE; i++) {
        randomnessPool.push(uint256(keccak256(abi.encodePacked(
            chainlinkSeed,
            drandHistory[i % drandHistory.length],
            i,
            block.timestamp
        ))));
    }
}
```

## Gas Optimization Changes

### Before (Unoptimized):
```solidity
for (uint256 i = 0; i < recipients.length; i++) {
    token.transfer(recipients[i], amounts[i]);
}
```

### After (Optimized):
```solidity
for (uint256 i = 0; i < recipients.length;) {
    token.safeTransfer(recipients[i], amounts[i]);
    unchecked { ++i; }
}
```

## Testing Enhancements

### New Test Functions Added
```solidity
function testCubeRootScaling() public {
    uint256 input = 8 * PRECISION * PRECISION * PRECISION; // 8^3 scaled
    uint256 result = DragonMath.approximateCubeRoot(input);
    assertApproxEqRel(result, 2 * 1e6, 0.001e18); // 2 scaled by 1e6
}

function testMinimumFeeAllocations() public {
    (uint256 j, uint256 l, uint256 b) = DragonMath.calculateFeeAllocation(0, 0, 0);
    assertGe(j, DragonMath.MIN_JACKPOT_BPS());
    assertGe(l, DragonMath.MIN_LP_BPS());
    assertGe(b, DragonMath.MIN_BURN_BPS());
    assertEq(j + l + b, 10000);
}
```

## Summary

These technical changes represent a comprehensive improvement to the OmniDragon codebase, addressing critical security issues, improving mathematical accuracy, optimizing performance, and establishing a robust randomness generation system. All changes maintain backward compatibility where possible and follow Solidity best practices. 