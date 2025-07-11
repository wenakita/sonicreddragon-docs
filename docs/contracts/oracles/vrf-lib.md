---
sidebar_position: 3
title: Vrf Lib
description: Detailed explanation of this concept
---

# DragonVRFLib

The `DragonVRFLib` is a utility library that provides helper functions for deploying and managing VRF (Verifiable Random Function) consumer contracts in the OmniDragon ecosystem.

## Overview

This library simplifies the deployment and configuration of VRF consumer contracts by providing standardized functions that handle common tasks:

```mermaidflowchart TD
    subgraph "DragonVRFLib"
    Deploy["Deployment Functions"]
    Config["Configuration Functions"]
    Proxy["Proxy Management"]
    Deploy -->|"Creates"| VRFConsumerProxy["VRF Consumer Proxy"]
    VRFConsumerProxy -->|"Delegates to"| VRFConsumerImpl["VRF Consumer Implementation"]
    Config -->|"Updates"| VRFConsumerProxy
    Config -->|"Configures"| Connections["Cross-Chain Connections"]
    Proxy -->|"Manages"| ProxyAdmin["Proxy Admin"]
    ProxyAdmin -->|"Controls"| VRFConsumerProxy
    classDef highlight fill:#4a80d1,stroke:#4a80d1,stroke-width:2px,color:#ffffff
    class Deploy primary    endclass Config primary    end
```

## Key Features

-**Upgradeability Support**: Deploys VRF consumers behind transparent proxies for future upgrades
-**Standardized Deployment**: Consistent deployment pattern for all VRF consumer contracts
-**Parameter Management**: Structured approach to managing VRF configuration parameters
-**Cross-Chain Integration**: Utilities for configuring cross-chain VRF connections

## Library Implementation

The core of DragonVRFLib is implemented as follows:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

/***@title DragonVRFLib
 * @dev Library for deploying VRFConsumer contracts with upgradeability support
 */
library DragonVRFLib {
    /***@dev Parameters for deploying a VRFConsumer contract
     */
    struct VRFParams {
        address implementation;
        address coordinator;
        bytes32 keyHash;
        uint64 subscriptionId;
        uint32 callbackGasLimit;
        uint16 requestConfirmations;
        uint32 numWords;
        address proxyAdmin;
        bytes initData; // Encoded initializer data
    }

    /***@notice Deploys a VRFConsumer contract behind a TransparentUpgradeableProxy
     * @param params The deployment parameters
     * @param owner The owner of the deployed contract
     * @return proxy The address of the deployed proxy contract
     */
    function deployVRFConsumer(
        VRFParams memory params,
        address owner
    ) internal returns (address proxy) {
        require(params.implementation != address(0), "No implementation");
        require(params.proxyAdmin != address(0), "No proxy admin");
        // Deploy the proxy
        TransparentUpgradeableProxy p = new TransparentUpgradeableProxy(
            params.implementation,
            params.proxyAdmin,
            params.initData
        );
        proxy = address(p);
        // Optionally, transfer ownership or set up roles here
        return proxy;
    }
}
```

## Deployment Functions

The library provides a function to deploy VRF consumers with proxy support:

```solidity
/***@notice Deploys a VRFConsumer contract behind a TransparentUpgradeableProxy
 * @param params The deployment parameters
 * @param owner The owner of the deployed contract
 * @return proxy The address of the deployed proxy contract
 */
function deployVRFConsumer(
    VRFParams memory params,
    address owner
) internal returns (address proxy) {
    require(params.implementation != address(0), "No implementation");
    require(params.proxyAdmin != address(0), "No proxy admin");
    // Deploy the proxy
    TransparentUpgradeableProxy p = new TransparentUpgradeableProxy(
        params.implementation,
        params.proxyAdmin,
        params.initData
    );
    proxy = address(p);
    // Optionally, transfer ownership or set up roles here
    return proxy;
}
```

## Configuration Functions

The library also includes functions for configuring VRF consumers after deployment:

```solidity
/***@notice Updates the jackpot contract address in the VRFConsumer
 * @param vrfConsumer The address of the VRFConsumer contract
 * @param lotteryContract The new jackpot contract address
 */
function updateLotteryContract(
    address vrfConsumer,
    address lotteryContract
) internal {
    // Example: call a function on the VRFConsumer to update the jackpot contract
    // (bool success,) = vrfConsumer.call(abi.encodeWithSignature("setLotteryContract(address)", lotteryContract));
    // require(success, "Update failed");
}
```

## Cross-Chain Integration

Support for cross-chain VRF integration is provided through functions that manage peer addresses:

```solidity
/***@notice Updates peer addresses for VRF contracts
 * @param arbReq The Arbitrum VRF requester address
 * @param sonicVRF The Sonic VRF consumer address
 */
function updateVRFPeers(
    address arbReq,
    address sonicVRF
) internal {
    // Example: call a function to update peer addresses
    // (bool success,) = arbReq.call(abi.encodeWithSignature("setPeer(address)", sonicVRF));
    // require(success, "Update failed");
}
```

## Usage Examples

### Deploying a VRF Consumer

Here's how to use the library to deploy a VRF consumer contract:

```solidity
// Import the library
import "../lib/DRAGON/DragonVRFLib.sol";

contract DragonVRFDeployer {
    using DragonVRFLib for *;
    
    address public proxyAdmin;
    address public implementation;
    
    constructor(address _proxyAdmin, address _implementation) {
        proxyAdmin = _proxyAdmin;
        implementation = _implementation;
    }
    
    function deployConsumer(
        address coordinator,
        bytes32 keyHash,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint16 requestConfirmations,
        uint32 numWords,
        address owner
    ) external returns (address) {
        // Encode initialization data
        bytes memory initData = abi.encodeWithSignature(
            "initialize(address,bytes32,uint64,uint32,uint16,uint32,address)",
            coordinator,
            keyHash,
            subscriptionId,
            callbackGasLimit,
            requestConfirmations,
            numWords,
            owner
        );
        
        // Set up deployment parameters
        DragonVRFLib.VRFParams memory params = DragonVRFLib.VRFParams({
            implementation: implementation,
            coordinator: coordinator,
            keyHash: keyHash,
            subscriptionId: subscriptionId,
            callbackGasLimit: callbackGasLimit,
            requestConfirmations: requestConfirmations,
            numWords: numWords,
            proxyAdmin: proxyAdmin,
            initData: initData
        });
        
        // Deploy the consumer
        return DragonVRFLib.deployVRFConsumer(params, owner);
    }
}
```

### Configuring Cross-Chain VRF

Here's how to configure cross-chain VRF connections:

```solidity
// Import the library
import "../lib/DRAGON/DragonVRFLib.sol";

contract DragonVRFManager {
    using DragonVRFLib for *;
    
    function configureCrossChainVRF(
        address arbitrumVRF,
        address ethereumVRF
    ) external {
        // Update peer addresses
        DragonVRFLib.updateVRFPeers(arbitrumVRF, ethereumVRF);
    }
}
```

## Security Considerations

When using the DragonVRFLib, consider these security best practices:

1.**Proxy Admin Management**: Carefully manage the proxy admin address, as it has the power to upgrade the implementation
2.**Initialization Values**: Ensure initialization parameters are correct, as they cannot be easily changed after deployment
3.**Access Control**: Implement proper access control in the VRF consumer contracts
4.**Parameter Validation**: Validate all parameters before deployment to prevent issues
5.**Gas Limits**: Set appropriate callback gas limits to ensure randomness fulfillment succeeds

## Upgradeability Pattern

The library uses OpenZeppelin's TransparentUpgradeableProxy pattern:
```

```mermaidsequenceDiagram
participant Caller
participant Proxy as TransparentUpgradeableProxy
participant Implementation
participant Admin as ProxyAdmin
    Caller ->> Proxy: function call

    alt Caller is admin
    Proxy ->> Admin: delegate admin functions
    else Caller is not admin
    Proxy ->> Implementation: delegate call
    Implementation ->> Implementation: execute logic
        Implementation -->> Proxy: return result
        Proxy -->> Caller: return result
```

This pattern allows:
- Separation of concerns between admin operations and contract logic
- Upgrading the implementation while preserving storage
- Maintaining the same address for the contract interface 
