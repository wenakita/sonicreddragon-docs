---
sidebar_position: 2
---

# Getting Started

Welcome to Sonic Red Dragon! This guide will help you get started with integrating and using our cross-chain token system.

## Prerequisites

Before you begin, make sure you have:

- Node.js (v16 or later)
- npm or yarn
- A code editor (VS Code recommended)
- Basic knowledge of Solidity and smart contracts
- Understanding of LayerZero V2 concepts

## Installation

1. Install the Sonic Red Dragon SDK:
   ```bash
   npm install @sonicreddragon/sdk
   # or
   yarn add @sonicreddragon/sdk
   ```

2. Add the contracts to your project:
   ```bash
   npm install @sonicreddragon/contracts
   # or
   yarn add @sonicreddragon/contracts
   ```

## Quick Start

Here's a simple example of how to use Sonic Red Dragon in your project:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@sonicreddragon/contracts/SonicRedDragonToken.sol";
import "@sonicreddragon/contracts/SonicRedDragonBridge.sol";
import "@sonicreddragon/contracts/SonicRedDragonRandomness.sol";

contract MyGame {
    SonicRedDragonToken public token;
    SonicRedDragonBridge public bridge;
    SonicRedDragonRandomness public randomness;

    constructor(
        address _token,
        address _bridge,
        address _randomness
    ) {
        token = SonicRedDragonToken(_token);
        bridge = SonicRedDragonBridge(_bridge);
        randomness = SonicRedDragonRandomness(_randomness);
    }

    // Example: Request randomness for a game
    function playGame() external {
        // Request randomness
        uint256 requestId = randomness.requestRandomness();
        
        // Store request ID for callback
        // ... implementation details ...
    }

    // Example: Cross-chain token transfer
    function sendTokensCrossChain(
        uint16 _dstChainId,
        bytes calldata _destination,
        uint256 _amount
    ) external payable {
        token.sendTokens{value: msg.value}(
            _dstChainId,
            _destination,
            _amount,
            payable(msg.sender),
            address(0),
            ""
        );
    }
}
```

## Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/wenakita/omnidragon.git
   cd omnidragon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Key Concepts

### Cross-Chain Operations

Sonic Red Dragon uses LayerZero V2 for cross-chain operations. Key concepts include:

- **Chain IDs**: Each supported blockchain has a unique chain ID
- **Message Passing**: Secure communication between chains
- **Gas Management**: Optimized for cross-chain transactions
- **Security**: Built-in message verification and replay protection

### Randomness System

The dRAND integration provides verifiable randomness:

- **Beacon Rounds**: Regular randomness updates
- **Verification**: Cryptographic proof verification
- **Fallback**: Multiple randomness sources
- **Cross-Chain**: Consistent randomness across chains

## Testing

1. Run unit tests:
   ```bash
   npm run test:unit
   ```

2. Run integration tests:
   ```bash
   npm run test:integration
   ```

3. Run cross-chain tests:
   ```bash
   npm run test:cross-chain
   ```

## Deployment

1. Configure networks in `hardhat.config.js`:
   ```javascript
   module.exports = {
     networks: {
       ethereum: {
         url: process.env.ETHEREUM_RPC_URL,
         accounts: [process.env.PRIVATE_KEY],
       },
       // Add other networks...
     },
   };
   ```

2. Deploy contracts:
   ```bash
   npx hardhat deploy --network ethereum
   ```

## Best Practices

1. **Security**
   - Always verify cross-chain messages
   - Use appropriate access controls
   - Implement circuit breakers
   - Regular security audits

2. **Gas Optimization**
   - Batch operations when possible
   - Use appropriate gas limits
   - Monitor gas costs across chains

3. **Error Handling**
   - Implement proper error handling
   - Use try-catch for cross-chain operations
   - Monitor failed transactions

4. **Testing**
   - Write comprehensive tests
   - Test cross-chain scenarios
   - Use testnets for development

## Support and Resources

- [Documentation](https://docs.sonicreddragon.io)
- [GitHub Repository](https://github.com/wenakita/omnidragon)
- [Discord Community](https://discord.gg/sonicreddragon)
- [Technical Support](mailto:support@sonicreddragon.io)

## Next Steps

1. Review the [Smart Contracts Overview](./contracts/overview.md)
2. Learn about [dRAND Integration](./ecosystem/drand-network.md)
3. Check out our [Example Projects](https://github.com/wenakita/omnidragon-examples)
4. Join our [Discord Community](https://discord.gg/sonicreddragon) 