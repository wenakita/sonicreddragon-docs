---
sidebar_position: 1
title: Quick Start Guide
---

# Quick Start Guide

This guide will help you get started with the Sonic Red Dragon protocol for developers, integrators, and users.

## For Users

### Acquiring Dragon Tokens

1. **Connect Wallet**: Visit [app.sonicreddragon.io](https://app.sonicreddragon.io) and connect your Web3 wallet
2. **Select Network**: Choose your preferred network (Ethereum, Arbitrum, BSC, etc.)
3. **Swap Tokens**: Use the swap interface to exchange your assets for Dragon tokens
4. **Confirm Transaction**: Approve the transaction in your wallet

### Participating in Jackpots

1. **Navigate to Jackpot**: Go to the Jackpot section in the OmniDragon app
2. **View Current Jackpot**: Check the current jackpot amount and time until next draw
3. **Increase Chances**: Increase your jackpot chances by:
   - Holding more tokens
   - Staking tokens in the protocol
   - Participating in promotions

### Cross-Chain Transfers

1. **Go to Bridge**: Navigate to the Bridge section
2. **Select Chains**: Choose source and destination chains
3. **Enter Amount**: Specify the amount to transfer
4. **Confirm**: Approve the transaction in your wallet
5. **Wait for Confirmation**: The cross-chain transfer typically completes in 10-15 minutes

## For Developers

### Environment Setup

```bash
# Clone the repository
git clone https://github.com/wenakita/sonicreddragon.git
cd sonicreddragon

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Compile contracts
npx hardhat compile
```

### Local Development

```bash
# Start local blockchain
npx hardhat node

# Deploy contracts to local network
npx hardhat run scripts/deploy.js --network localhost

# Run tests
npx hardhat test
```

### Key Contracts

```solidity
// Import core contracts
import "@omnidragon/contracts/OmniDragon.sol";
import "@omnidragon/contracts/DragonJackpotVault.sol";
```

### Example Integration

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@omnidragon/interfaces/IOmniDragon.sol";

contract OmniDragonIntegration {
    IOmniDragon public omniDragon;
    
    constructor(address _omniDragonAddress) {
        omniDragon = IOmniDragon(_omniDragonAddress);
    }
    
    function getJackpotInfo() external view returns (uint256) {
        return omniDragon.getCurrentJackpotAmount();
    }
}
```

## For Node Operators

### Running a Node

1. **Hardware Requirements**:
   - 4+ CPU cores
   - 16GB+ RAM
   - 500GB+ SSD storage
   
2. **Installation**:
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Pull and run OmniDragon node
   docker pull omnidragon/node:latest
   docker run -d --name omnidragon-node -p 8545:8545 -v /path/to/data:/data omnidragon/node:latest
   ```

3. **Configuration**:
   - Edit `config.json` with your network parameters
   - Set up secure RPC endpoints
   - Configure validator keys (if applicable)

## SDK Integration

### JavaScript/TypeScript

```javascript
// Install the SDK
// npm install @omnidragon/sdk

// Initialize in your application
import { OmniDragonSDK } from '@omnidragon/sdk';

const sdk = new OmniDragonSDK({
  rpcUrl: 'https://arbitrum-mainnet.infura.io/v3/YOUR_API_KEY',
  chainId: 42161 // Arbitrum
});

// Get token information
const tokenInfo = await sdk.getTokenInfo();

// Check jackpot status
const jackpotInfo = await sdk.getJackpotInfo();
```

## Community Resources

- **Discord**: [discord.gg/w75vaxDXuE](https://discord.gg/w75vaxDXuE)
- **GitHub**: [github.com/wenakita/sonicreddragon](https://github.com/wenakita/sonicreddragon)
- **Documentation**: [docs.sonicreddragon.io](https://docs.sonicreddragon.io)
- **Twitter**: [@sonicreddragon](https://twitter.com/sonicreddragon)
