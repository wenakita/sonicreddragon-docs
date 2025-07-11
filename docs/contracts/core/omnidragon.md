---
title: Omnidragon
sidebar_position: 1
description: Detailed explanation of this concept
---
# OmniDragon Token Contract

The**OmniDragon**contract is the core ERC20 token that powers the entire OmniDragon ecosystem. It's a specialized token with built-in fees, jackpot entries, cross-chain functionality, and advanced governance features.

## Overview

OmniDragon is deployed on Sonic blockchain and serves as the central hub for:
-**Cross-chain transfers**via LayerZero
-**Automated jackpot system**with VRF-powered randomness
-**Dynamic fee management**with multiple distribution channels
-**Partner ecosystem**integration
-**Governance mechanisms**with timelock protection

## Key Features

###  DRAGON Project Rules
On all DRAGON swaps:
-**6.9%**goes to jackpot vault
-**2.41%**goes to ve69LP fee distributor  
-**0.69%**is burned
-**Only buys qualify for jackpot entries**### 🌐 Cross-Chain Architecture
- Native LayerZero integration for seamless cross-chain transfers
- Sonic Chain ID: 332 (LayerZero)
- Trusted remote configuration for secure bridging
- Gas optimization for cross-chain operations

### 🎰 Integrated Lottery System
- Automatic jackpot entry creation on qualifying swaps
- VRF-powered randomness via OmniDragonRandomnessProvider
- Cooldown periods and entry limits for fair play
- MEV protection with commit-reveal schemes

### 🏛️ Advanced Governance
- Timelock protection for critical operations
- Emergency pause mechanisms
- Multi-signature admin operations
- Partner pool management

## Contract Architecture

```solidity
contract OmniDragon is ERC20, Ownable, ReentrancyGuard, IOmniDragon {
    using SafeERC20 for IERC20;
    using DragonTimelockLib for DragonTimelockLib.TimelockProposal;
    using DragonFeeProcessingLib for DragonFeeProcessingLib.Fees;
}
```

## Core Components

### State Variables

```solidity
// Core addresses
address public lzEndpoint;           // LayerZero endpoint
address public jackpotVault;         // Jackpot vault for jackpot payouts
address public revenueDistributor;   // Primary fee distributor
address public wrappedNativeToken;   // WETH/Wrapped native token
address public lotteryManager;       // Unified jackpot manager

// Partner ecosystem
address public dragonPartnerRegistry;  // Partner registry
address public dragonPartnerFactory;   // Partner pool factory

// Dynamic fee management
DragonFeeManager public adaptiveFeeManager;
address public ve69LPBoostManager;     // Voting power boost manager
```

### Constants

```solidity
uint256 public constant MAX_SUPPLY = 6942000 * 10**18;        // 6.942M tokens
uint256 public constant INITIAL_SUPPLY = 6942000 * 10**18;    // Initial supply
uint16 public constant SONIC_CHAIN_ID = 332;                  // Sonic LayerZero ID
uint256 public constant MAX_FEE_BASIS_POINTS = 1500;          // 15% max fees
uint256 public constant COMMITMENT_EXPIRY_BLOCKS = 50;        // MEV protection
```

## Fee Structure

### Default Fee Configuration

```solidity
// Buy Fees (10% total)
buyFees.jackpot = 690;  // 6.9%
buyFees.ve69LP = 241;   // 2.41%
buyFees.burn = 69;      // 0.69%
buyFees.total = 1000;   // 10%

// Sell Fees (10% total)
sellFees.jackpot = 690; // 6.9%
sellFees.ve69LP = 241;  // 2.41%
sellFees.burn = 69;     // 0.69%
sellFees.total = 1000;  // 10%

// Transfer Fees (0.69% total)
transferFees.burn = 69; // 0.69%
transferFees.total = 69; // 0.69%
```

### Dynamic Fee Management

The contract supports dynamic fee adjustment through the `DragonFeeManager`:

```solidity
function getApplicableFees(
    address from,
    address to,
    uint256 amount
) external view returns (DragonFeeProcessingLib.Fees memory);
```

## Core Functions

### Token Operations

#### Transfer with Fees
```solidity
function _transfer(address from, address to, uint256 amount) internal override {
    // Fee calculation and distribution
    // Lottery entry creation for qualifying swaps
    // MEV protection checks
    // Cross-chain compatibility
}
```

#### Cross-Chain Transfers
```solidity
function sendToChain(
    uint16 _dstChainId,
    bytes calldata _toAddress,
    uint _amount,
    address payable _refundAddress,
    address _zroPaymentAddress,
    bytes calldata _adapterParams
) external payable;
```

### Lottery Integration

#### Automatic Entry Creation
```solidity
function _createLotteryEntry(
    address user,
    uint256 swapAmountUSD,
    uint256 userVotingPower
) internal returns (uint256 entryId);
```

#### MEV Protection
```solidity
function submitCommitment(bytes32 commitment) external;
function revealAndCreateEntry(uint256 amount, uint256 nonce) external;
```

### Governance Functions

#### Timelock Protected Operations
```solidity
modifier onlyAfterTimelock(
    DragonTimelockLib.AdminOperation operation,
    bytes memory data
);

function proposeAdminOperation(
    DragonTimelockLib.AdminOperation operation,
    bytes calldata data
) external onlyOwner returns (bytes32 proposalId);
```

#### Emergency Controls
```solidity
function emergencyPause() external onlyEmergencyPauser;
function emergencyUnpause() external onlyOwner;
```

### Partner System

#### Partner Pool Management
```solidity
function registerPartnerPool(
    address pool,
    uint256 partnerId
) external onlyOwner;

function removePartnerPool(address pool) external onlyOwner;
```

## Configuration Management

### Initial Setup

1.**Deploy Contract**```solidity
   constructor(
       string memory _name,
       string memory _symbol,
       address _jackpotVault,
       address _revenueDistributor,
       address _lzEndpoint,
       address _chainRegistry
   )
   ```

2.**Set Wrapped Native Token**```solidity
   function setWrappedNativeToken(address _wrappedNativeToken) external onlyOwner;
   ```

3.**Configure Router**```solidity
   function setUniswapRouter(address _router) external onlyOwner;
   ```

4.**Add Trading Pairs**```solidity
   function addPairWithType(address _pair, DexType _dexType) external onlyOwner;
   ```

### Advanced Configuration

#### Fee Exclusions
```solidity
function excludeFromFees(address account, bool excluded) external onlyOwner;
```

#### Swap Thresholds
```solidity
function setSwapThreshold(uint256 _threshold) external onlyOwner;
function setMinimumAmountForProcessing(uint256 _minAmount) external onlyOwner;
```

## Security Features

### MEV Protection
- Commit-reveal scheme for jackpot entries
- Block-based commitment expiry
- Multiple commitments per user support

### Emergency Controls
- Global transfer pause
- Emergency pauser role
- Maximum single transfer limits

### Timelock System
- 48-hour default delay for critical operations
- First-time operation bypass for bootstrapping
- Proposal creation and cancellation

### Access Control
- Owner-only administrative functions
- Authorized caller system for specific operations
- Emergency pauser separate from owner

## Events

### Core Events
```solidity
event ExcludedFromFees(address indexed account, bool isExcluded);
event FeesUpdated(string feeType, uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee, uint256 totalFee);
event TokensBurned(uint256 amount);
```

### Cross-Chain Events
```solidity
event SendToChain(uint16 indexed _dstChainId, address indexed _from, bytes indexed _toAddress, uint _amount);
event ReceiveFromChain(uint16 indexed _srcChainId, bytes indexed _srcAddress, address indexed _toAddress, uint _amount);
```

### Lottery Events
```solidity
event CommitSubmitted(address indexed user, bytes32 commitment);
event LotteryEntryRevealed(address indexed user, uint256 amount, uint256 nonce);
```

### Governance Events
```solidity
event ProposalCreated(bytes32 indexed proposalId, DragonTimelockLib.AdminOperation indexed operation, bytes data, uint256 executeTime);
event ProposalExecuted(bytes32 indexed proposalId, DragonTimelockLib.AdminOperation indexed operation);
```

## Integration Guide

### For Developers

1.**Basic Integration**```solidity
   import "./interfaces/core/IOmniDragon.sol";
   
   IOmniDragon DRAGON = IOmniDragon(OMNIDRAGON_ADDRESS);
   ```

2.**Fee Calculation**```solidity
   function calculateFees(address from, address to, uint256 amount) 
       external view returns (uint256 totalFees);
   ```

3.**Cross-Chain Transfer**```solidity
   function estimateSendFee(uint16 _dstChainId, bytes calldata _toAddress, uint _amount, bool _useZro, bytes calldata _adapterParams) 
       external view returns (uint nativeFee, uint zroFee);
   ```

### For Partners

1.**Register Partner Pool**```solidity
   DRAGON.registerPartnerPool(poolAddress, partnerId);
   ```

2.**Handle Partner Fees**```solidity
   function processPartnerFees(address partner, address token, uint256 amount) external;
   ```

## Best Practices

### Gas Optimization
- Use batch operations when possible
- Monitor swap thresholds for fee processing
- Consider using bucket randomness for high-frequency operations

### Security Considerations
- Always check fee exclusion status
- Implement proper slippage protection
- Use commit-reveal for MEV-sensitive operations

### Cross-Chain Operations
- Verify destination chain support
- Estimate fees before transactions
- Handle failed cross-chain transfers

## Error Handling

### Common Errors
```solidity
error TransfersPaused();
error FeesTooHigh();
error MaxSingleTransferExceeded();
error EmergencyPaused();
error NotAuthorized();
```

### Troubleshooting
- Check if transfers are paused
- Verify fee calculations
- Ensure proper authorization
- Monitor emergency pause status

## Links

-**Social**: [Twitter](https://x.com/sonicreddragon) | [Telegram](https://t.me/sonicreddragon)
-**Repository**: [GitHub](https://github.com/wenakita/OmniDragon)
-**Audit**: [Security Documentation](/audit/AUDIT_DOCUMENTATION_SUMMARY) 
