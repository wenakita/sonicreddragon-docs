---
title: Chain Registry
sidebar_position: 2
---

# Chain Registry Contract

The Chain Registry (`ChainRegistry.sol`) is a critical infrastructure contract that maintains information about supported blockchain networks and their respective endpoints for cross-chain communication.

## Contract Overview

The Chain Registry serves as a central directory for the OmniDragon ecosystem, providing:

- Registry of supported blockchain networks
- Configuration for each chain's endpoint
- Active/inactive status tracking for chains
- Chain-specific parameters and settings

## Key Functions

```solidity
// Register a new blockchain network
function registerChain(
    uint16 _chainId,
    bytes calldata _endpoint,
    bool _isActive
) external onlyOwner;

// Update an existing chain's endpoint
function updateChainEndpoint(
    uint16 _chainId,
    bytes calldata _endpoint
) external onlyOwner;

// Set chain active/inactive status
function setChainActive(
    uint16 _chainId,
    bool _isActive
) external onlyOwner;

// Get chain endpoint information
function getChainEndpoint(
    uint16 _chainId
) external view returns (bytes memory);

// Check if a chain is supported and active
function isChainSupported(
    uint16 _chainId
) external view returns (bool);

// Get all supported chain IDs
function getSupportedChains() external view returns (uint16[] memory);
```

## Architecture Diagram

```mermaid
flowchart TB
    %% Main registry contract
    ChainRegistry["Chain Registry"]:::main
    
    %% Chain connections
    subgraph Chains ["Supported Blockchains"]
        direction TB
        Ethereum["Ethereum<br>Chain ID: 1"]:::chain
        Arbitrum["Arbitrum<br>Chain ID: 42161"]:::chain
        Optimism["Optimism<br>Chain ID: 10"]:::chain
        Avalanche["Avalanche<br>Chain ID: 43114"]:::chain
        Others["Other EVM Chains"]:::chain
    end
    
    %% Registry data structure
    subgraph RegistryData ["Registry Data"]
        direction TB
        ChainMap["Chain Mapping<br>chainId => ChainInfo"]:::data
        ChainInfo["ChainInfo Struct<br>endpoint, isActive"]:::data
        ChainList["Supported Chain List"]:::data
    end
    
    %% Systems using the registry
    OmniDragon["OmniDragon Token"]:::system
    Bridge["Cross-Chain Bridge"]:::system
    Router["Message Router"]:::system
    
    %% Connect components
    ChainRegistry -->|"Manages"| RegistryData
    Chains -.->|"Registered in"| ChainRegistry
    
    ChainRegistry -->|"Provides endpoints to"| OmniDragon
    ChainRegistry -->|"Configures"| Bridge
    ChainRegistry -->|"Directs"| Router
    
    %% Interactions
    Router -->|"Routes messages to"| Chains
    Bridge -->|"Bridges tokens to"| Chains
    OmniDragon -->|"Transfers across"| Chains
    
    %% Styling
    classDef main fill:#4a80d1;stroke:#355899;color:#ffffff;font-weight:bold
    classDef chain fill:#43a047;stroke:#2e7d32;color:#ffffff
    classDef data fill:#ff9800;stroke:#f57c00;color:#ffffff
    classDef system fill:#9c27b0;stroke:#7b1fa2;color:#ffffff
    
    %% Subgraph styling
    style Chains fill:rgba(76,175,80,0.1);stroke:#c8e6c9;color:#2e7d32
    style RegistryData fill:rgba(255,152,0,0.1);stroke:#ffecb3;color:#ff8f00
```

## Chain Information Structure

The registry maintains detailed information about each supported chain:

```solidity
struct ChainInfo {
    bytes endpoint;     // Chain-specific endpoint address
    bool isActive;      // Whether the chain is currently active
    uint256 gasPrice;   // Reference gas price for the chain
    uint256 gasLimit;   // Default gas limit for cross-chain operations
    uint16[] paths;     // Valid destination chains from this chain
}
```

## Integration Example

Here's how other contracts in the ecosystem integrate with the Chain Registry:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@omnidragon/contracts/interfaces/IChainRegistry.sol";

contract ChainRegistryConsumer {
    IChainRegistry public registry;
    
    constructor(address _registryAddress) {
        registry = IChainRegistry(_registryAddress);
    }
    
    function sendCrossChainMessage(
        uint16 _destinationChainId,
        bytes calldata _payload
    ) external payable {
        // Check if destination chain is supported
        require(registry.isChainSupported(_destinationChainId), "Chain not supported");
        
        // Get the destination chain endpoint
        bytes memory endpoint = registry.getChainEndpoint(_destinationChainId);
        
        // Send message to the appropriate endpoint
        // Implementation details would depend on the messaging protocol
    }
    
    function getValidDestinations(uint16 _sourceChainId) external view returns (uint16[] memory) {
        return registry.getValidDestinations(_sourceChainId);
    }
}
```

## Chain Registry Update Process

Updates to the Chain Registry follow a careful process to ensure system integrity:

1. **Proposal**: Changes are proposed through governance
2. **Review**: The proposal undergoes technical review
3. **Testing**: Changes are tested in a staging environment
4. **Implementation**: Once approved, changes are applied to the registry
5. **Monitoring**: System monitors for any issues following updates

## Security Considerations

The Chain Registry implements several security measures:

- **Role-Based Access**: Only authorized addresses can modify registry entries
- **Validation Checks**: Endpoints undergo validation before registration
- **Emergency Controls**: Ability to quickly disable problematic chains
- **Event Logging**: Comprehensive event emission for all registry changes

## Interface

The Chain Registry exposes its functionality through the following interface:

```solidity
interface IChainRegistry {
    // Chain registration
    function registerChain(uint16 _chainId, bytes calldata _endpoint, bool _isActive) external;
    function updateChainEndpoint(uint16 _chainId, bytes calldata _endpoint) external;
    function setChainActive(uint16 _chainId, bool _isActive) external;
    
    // Chain information retrieval
    function getChainEndpoint(uint16 _chainId) external view returns (bytes memory);
    function isChainSupported(uint16 _chainId) external view returns (bool);
    function isChainActive(uint16 _chainId) external view returns (bool);
    function getSupportedChains() external view returns (uint16[] memory);
    function getValidDestinations(uint16 _sourceChainId) external view returns (uint16[] memory);
    
    // Chain-specific parameters
    function setChainGasPrice(uint16 _chainId, uint256 _gasPrice) external;
    function setChainGasLimit(uint16 _chainId, uint256 _gasLimit) external;
    function getChainGasPrice(uint16 _chainId) external view returns (uint256);
    function getChainGasLimit(uint16 _chainId) external view returns (uint256);
}
```
