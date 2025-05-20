---
sidebar_position: 2
title: Installation Guide
---

# Installation Guide

This guide provides detailed instructions for installing and setting up the OmniDragon development environment for different platforms.

## Prerequisites

Before installing OmniDragon, ensure you have the following prerequisites:

- **Node.js** - v16.x or later
- **npm** - v8.x or later
- **Git** - Latest version
- **Solidity** - Knowledge of Solidity v0.8.x
- **Hardhat** - Basic familiarity with Hardhat

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 8 GB | 16+ GB |
| Disk | 20 GB free | 50+ GB free |
| OS | Ubuntu 20.04, macOS 12+, Windows 10+ | Ubuntu 22.04, macOS 13+, Windows 11 |

## Installation Process

### Step 1: Clone the Repository

```bash
git clone https://github.com/omnidragon/omnidragon.git
cd omnidragon
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

Create your environment configuration:

```bash
cp .env.example .env
```

Edit the `.env` file with your settings:

```
# Network RPC URLs
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_API_KEY
ARBITRUM_RPC_URL=https://arbitrum-mainnet.infura.io/v3/YOUR_API_KEY
BSC_RPC_URL=https://bsc-dataseed.binance.org

# Private keys (NEVER share these)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key

# Contract configuration
INITIAL_SUPPLY=1000000000000000000000000000
FEE_DECIMALS=2
```

### Step 4: Compile Contracts

```bash
npx hardhat compile
```

### Step 5: Run Tests

```bash
npx hardhat test
```

You should see output similar to:

```
  OmniDragon Token
    Deployment
      ✓ Should deploy with correct name and symbol
      ✓ Should set initial supply correctly
    Fee Mechanics
      ✓ Should collect buy fees correctly
      ✓ Should collect sell fees correctly
      ✓ Should collect transfer fees correctly
    Jackpot Integration
      ✓ Should properly integrate with jackpot system
    Cross-Chain
      ✓ Should handle cross-chain transfers correctly

  DragonJackpotVault
    Deployment
      ✓ Should initialize with empty jackpot
    Funding
      ✓ Should accept deposits from authorized sources
    Distribution
      ✓ Should distribute jackpot amounts correctly

  11 passing (3.52s)
```

## Platform-Specific Instructions

### Linux (Ubuntu/Debian)

Additional packages you might need:

```bash
sudo apt update
sudo apt install build-essential python3 python3-dev
```

### macOS

Using Homebrew:

```bash
brew install node
brew install git
```

### Windows

1. Install [Node.js](https://nodejs.org/)
2. Install [Git for Windows](https://gitforwindows.org/)
3. Use Windows Terminal or PowerShell

## Docker Installation

For containerized development:

```bash
# Build the image
docker build -t omnidragon .

# Run development container
docker run -it --rm -v $(pwd):/app omnidragon bash

# Inside container
npm install
npx hardhat compile
```

## Troubleshooting

### Common Issues

#### "Cannot find module..."

```bash
rm -rf node_modules
npm cache clean --force
npm install
```

#### Compilation Errors

```bash
npx hardhat clean
npx hardhat compile
```

#### Network Connection Issues

Check your `.env` file for correct RPC URLs and API keys.

## Next Steps

After successful installation:

1. Explore the [Quick Start Guide](./quickstart.md)
2. Review the [Development Guide](./development.md)
3. Check out [Core Contracts](../contracts/core/token.md)

## Community Support

If you encounter issues not covered in this guide:

- **Discord**: [discord.gg/omnidragon](https://discord.gg/omnidragon)
- **GitHub Issues**: [github.com/omnidragon/omnidragon/issues](https://github.com/omnidragon/omnidragon/issues)
- **Documentation**: [docs.omnidragon.io](https://docs.omnidragon.io)
