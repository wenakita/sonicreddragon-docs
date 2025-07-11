---
sidebar_position: 1
title: LayerZero Integration
description: Detailed explanation of this concept
---

# LayerZero Integration

OmniDragon leverages [LayerZero](https://LayerZero.network/) as its primary cross-chain messaging protocol. This integration enables OmniDragon tokens to seamlessly move across multiple blockchains while maintaining a unified token economy and jackpot system.

## What is LayerZero?

LayerZero is a powerful omnichain interoperability protocol designed for lightweight cross-chain messaging. It provides:

-**Security**: Uses a dual-node validation system with Oracle and Relayer
-**Efficiency**: Optimized for low gas costs and high throughput
-**Flexibility**: Supports various message types and complex cross-chain applications
-**Unified UX**: Enables seamless user experiences across multiple chains

## OmniDragon's LayerZero Implementation

```mermaid
graph LR
    A[Input] -->|> B[Process]| C[Output]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#059669,stroke:#047857,color:#fff
```

## Core Features

### 1. Cross-Chain Token Transfers

OmniDragon tokens can be sent across any supported blockchain network through LayerZero's messaging protocol. When tokens are transferred:

1. Tokens are burned on the source chain
2. A message is sent through LayerZero to the destination chain
3. Equivalent tokens are minted on the destination chain

This maintains the total supply constant across all chains while enabling full mobility.

### 2. Cross-Chain Jackpot System

The OmniDragon jackpot system works across all chains:

- Jackpot contributions from all chains flow into a unified pool
- Winners can be selected from any chain
- Rewards are delivered on the winner's current chain

### 3. Cross-Chain Governance

OmniDragon's governance system leverages LayerZero to:

- Broadcast governance decisions across all chains
- Collect votes from token holders on any chain
- Implement protocol changes consistently across the ecosystem

## Technical Implementation

OmniDragon implements LayerZero V2 compatibility through the following components:

### Chain Registry Contract

The `ChainRegistry` contract maintains information about all supported chains:

```solidity
// ChainRegistry.sol (simplified)
contract ChainRegistry {
    // Map of chainId to chain information
    mapping(uint16 => ChainInfo) public chains;
    
    struct ChainInfo {
        bytes endpoint;   // Chain-specific endpoint address
        bool isActive;    // Whether the chain is active
        uint256 gasPrice; // Reference gas price
    }
    
    // Register a new chain
    function registerChain(
        uint16 _chainId,
        bytes calldata _endpoint,
        bool _isActive
    ) external onlyOwner;
    
    // Get chain endpoint
    function getChainEndpoint(uint16 _chainId) 
        external view returns (bytes memory);
}
```

### OmniDragon Token Contract

The OmniDragon token implements LayerZero interfaces for cross-chain functionality:

```solidity
// OmniDragon.sol (simplified)
contract OmniDragon is ERC20, ILayerZeroReceiver {
    ILayerZeroEndpoint public lzEndpoint;
    
    // Send tokens to another chain
    function sendToChain(
        uint16 _dstChainId,
        bytes calldata _destination,
        uint256 _amount,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable;
    
    // Receive cross-chain message
    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        uint64 _nonce,
        bytes calldata _payload
    ) external override;
    
    // Set peer address for LayerZero V2
    function setPeer(
        uint16 _chainId,
        bytes calldata _peer
    ) external onlyOwner;
}
```

## Fee Structure

Cross-chain transfers incur several types of fees:

1.**LayerZero Protocol Fees**: Paid to the LayerZero protocol for message delivery
2.**Gas Fees**: Covers gas costs on the destination chain
3.**Cross-Chain Bridge Fees**: Optional fees for using OmniDragon's bridge services

## Supported Chains

OmniDragon currently supports (or plans to support) the following chains through LayerZero:

| Chain | Chain ID | Status |
|-------|----------|--------|
| Ethereum | 1 | Planned |
| Arbitrum | 42161 | Planned |
| Optimism | 10 | Planned |
| Avalanche | 43114 | Planned |
| Sonic | 146 | Planned |
| Polygon | 137 | Planned |

## Integration Example

Here's an example of how to initiate a cross-chain transfer:

```solidity
// Example: Send tokens from Ethereum to Arbitrum
function sendTokensToArbitrum(uint256 amount, address recipient) external payable {
    // Convert recipient address to bytes
    bytes memory destination = abi.encodePacked(recipient);
    
    // Arbitrum chain ID in LayerZero
    uint16 dstChainId = 42161;
    
    // Call the OmniDragon sendToChain function
    omniDragon.sendToChain{value: msg.value}(
        dstChainId,
        destination,
        amount,
        payable(msg.sender), // refund address
        address(0),          // zero payment address
        ""                   // default adapter params
    );
}
```

## LayerZero V2 Compatibility

OmniDragon has implemented LayerZero V2 compatibility with the `setPeer` function, which allows updating peer addresses for different chains. This ensures the token contract stays current with LayerZero protocol updates.

## Security Considerations

When using OmniDragon's LayerZero integration:

1.**Message Verification**: Always verify that messages come from trusted sources
2.**Gas Limits**: Set appropriate gas limits for cross-chain operations
3.**Peer Addresses**: Ensure peer addresses are correctly configured
4.**Timeout Handling**: Implement proper handling for message delivery timeouts

## Additional Resources

- [LayerZero Documentation](https://docs.LayerZero.network/)
- [LayerZero GitHub](https://github.com/LayerZero-Labs)
- [OmniDragon Setup Guide](/partner/case-studies/layerzero)
