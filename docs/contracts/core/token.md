---
sidebar_position: 1
---

# OmniDragon Token

The OmniDragon token (`DRAGON`) is the core smart contract that powers the Sonic Red Dragon ecosystem, implementing a cross-chain compatible ERC-20 token with specialized functionality for fee distribution, jackpot mechanics, and LayerZero V2 integration.

## Overview

The OmniDragon token is designed with a comprehensive set of features that extend beyond the standard ERC-20 functionality:

- **Cross-Chain Compatibility**: Seamlessly bridge tokens between supported blockchains via LayerZero V2
- **Built-in Fee System**: Automatically distributes transaction fees to various ecosystem components
- **Jackpot Mechanics**: Integrate with the jackpot system for random token distributions
- **Governance Integration**: Connect with the ve69LP governance system
- **Partner Program Support**: Enable third-party integrations through the Dragon Partner Program

## Token Specifications

| Parameter | Value |
|-----------|-------|
| Token Name | Sonic Red Dragon |
| Token Symbol | DRAGON |
| Decimals | 18 |
| Maximum Supply | 6,942,000 DRAGON |
| Initial Supply | 6,942,000 DRAGON |
| Fee Structure | Dynamic fees based on transaction type |

## Fee Distribution

The OmniDragon token implements a sophisticated fee structure that automatically distributes fees on transactions:

```mermaid
flowchart TD
    Transaction["Token Transaction"] -->|"Fee Collection"| FeeProcessor["Fee Processor"]
    FeeProcessor -->|"6.9%"| JackpotVault["Jackpot Vault"]
    FeeProcessor -->|"2.41%"| ve69LPDistributor["ve69LP Fee Distributor"]
    FeeProcessor -->|"0.69%"| BurnAddress["Burn Address (0x0)"]
    JackpotVault -->|"Random Distribution"| Winners["Lucky Winners"]
    ve69LPDistributor -->|"Rewards"| Stakers["ve69LP Stakers"]
    
    class Transaction,JackpotVault highlight
```

The fee percentages are:
- **6.9%** directed to the jackpot vault for random distribution
- **2.41%** directed to ve69LP holders as staking rewards
- **0.69%** permanently burned, reducing total supply

## Cross-Chain Functionality

The OmniDragon token implements the LayerZero V2 messaging protocol for secure cross-chain transfers:

```mermaid
sequenceDiagram
    participant User
    participant DragonChainA as "DRAGON (Chain A)"
    participant LZEndpointA as "LZ Endpoint (Chain A)"
    participant LZNetwork as "LayerZero Network"
    participant LZEndpointB as "LZ Endpoint (Chain B)"
    participant DragonChainB as "DRAGON (Chain B)"
    
    User->>DragonChainA: sendTokensToChain(ChainB, recipient, amount)
    DragonChainA->>DragonChainA: Burn tokens on Chain A
    DragonChainA->>LZEndpointA: Send cross-chain message
    LZEndpointA->>LZNetwork: Relay message with proof
    LZNetwork->>LZEndpointB: Deliver message with proof
    LZEndpointB->>DragonChainB: Receive cross-chain message
    DragonChainB->>DragonChainB: Mint tokens on Chain B
    DragonChainB->>User: Tokens received on Chain B
```

## Core Functions

### Token Management

```solidity
// Mint tokens (owner only)
function mint(address to, uint256 amount) external onlyOwner

// Burn tokens
function burn(uint256 amount) external

// Transfer with fee handling
function transfer(address recipient, uint256 amount) external returns (bool)

// Transfer from with fee handling
function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)
```

### Fee Configuration

```solidity
// Update fee structure
function updateFees(
    uint256 jackpotFee,
    uint256 ve69Fee,
    uint256 burnFee,
    string memory feeType
) external onlyOwner

// Exclude an address from fees
function excludeFromFees(address account, bool excluded) external onlyOwner
```

### Cross-Chain Operations

```solidity
// Send tokens to another chain
function sendTokensToChain(
    uint16 dstChainId,
    bytes memory toAddress,
    uint amount,
    address payable refundAddress,
    address zroPaymentAddress,
    bytes memory adapterParams
) external payable

// Receive tokens from another chain (internal)
function _receiveTokensFromChain(
    uint16 srcChainId,
    bytes memory srcAddress,
    address toAddress,
    uint amount
) internal
```

### Partner Integration

```solidity
// Register a partner pool
function registerPartnerPool(address pool) external onlyOwner

// Remove a partner pool
function removePartnerPool(address pool) external onlyOwner
```

## Integration Examples

### Basic Token Transfer

```solidity
// Transfer tokens
IERC20(dragonTokenAddress).transfer(recipient, amount);
```

### Cross-Chain Transfer

```solidity
// Get the required fee for the cross-chain transfer
uint nativeFee = dragonToken.estimateSendFee(
    destinationChainId,
    abi.encodePacked(recipientAddress),
    amount,
    false,
    bytes("")
);

// Send tokens to another chain
dragonToken.sendTokensToChain{value: nativeFee}(
    destinationChainId,
    abi.encodePacked(recipientAddress),
    amount,
    msg.sender,
    address(0),
    bytes("")
);
```

## Security Considerations

The OmniDragon token implements several security measures:

- **Reentrancy Protection**: Uses ReentrancyGuard to prevent reentrant calls
- **Access Control**: Implements Ownable pattern for privileged operations
- **Pause Mechanism**: Ability to pause transfers in case of emergency
- **Fee Caps**: Maximum fee limits to prevent potential abuse

## Contract Address

| Chain | Address |
|-------|---------|
| Ethereum | `0x...` (coming soon) |
| BNB Chain | `0x...` (coming soon) |
| Arbitrum | `0x...` (coming soon) |
| Avalanche | `0x...` (coming soon) |
| Base | `0x...` (coming soon) |

For the most up-to-date contract addresses, see the [Contract Addresses](/reference/addresses/mainnet) section.
