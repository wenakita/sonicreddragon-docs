---
sidebar_position: 1
---

# Smart Contracts Overview

Sonic Red Dragon's smart contract system is built on LayerZero V2, providing a robust foundation for cross-chain operations and verifiable randomness.

## Core Contracts

### SonicRedDragonToken

The main token contract that implements the ERC-20 standard with LayerZero V2 compatibility. Key features include:

- Cross-chain token transfers
- Secure minting and burning mechanisms
- Access control for administrative functions
- Integration with dRAND for randomness

### SonicRedDragonBridge

Handles cross-chain messaging and token bridging operations:

- LayerZero V2 message passing
- Bridge security and validation
- Cross-chain state synchronization
- Gas optimization for cross-chain operations

### SonicRedDragonRandomness

Manages the integration with dRAND network for verifiable randomness:

- dRAND beacon integration
- Randomness verification
- Request and callback mechanisms
- Fallback randomness sources

## Security Features

Our contracts implement several security measures:

- Role-based access control (RBAC)
- Multi-signature requirements for critical operations
- Rate limiting and circuit breakers
- Comprehensive event logging
- Regular security audits

## Integration Guide

To integrate Sonic Red Dragon into your project:

1. **Token Integration**
   ```solidity
   import "@sonicreddragon/contracts/SonicRedDragonToken.sol";
   ```

2. **Bridge Integration**
   ```solidity
   import "@sonicreddragon/contracts/SonicRedDragonBridge.sol";
   ```

3. **Randomness Integration**
   ```solidity
   import "@sonicreddragon/contracts/SonicRedDragonRandomness.sol";
   ```

## Contract Addresses

### Mainnet
- SonicRedDragonToken: `0x...` (Coming Soon)
- SonicRedDragonBridge: `0x...` (Coming Soon)
- SonicRedDragonRandomness: `0x...` (Coming Soon)

### Testnet
- SonicRedDragonToken: `0x...` (Coming Soon)
- SonicRedDragonBridge: `0x...` (Coming Soon)
- SonicRedDragonRandomness: `0x...` (Coming Soon)

## Development

For developers looking to contribute or build on Sonic Red Dragon:

1. Clone our repository:
   ```bash
   git clone https://github.com/wenakita/omnidragon.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Security

Security is our top priority. Our contracts have undergone multiple audits and are continuously monitored. If you discover any security issues, please report them to security@sonicreddragon.io.

## Support

For technical support or questions about contract integration:
- Join our [Discord](https://discord.gg/sonicreddragon)
- Open an issue on [GitHub](https://github.com/wenakita/omnidragon)
- Contact us at support@sonicreddragon.io 