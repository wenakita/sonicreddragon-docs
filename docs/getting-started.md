---
sidebar_position: 2
---

# Getting Started with OmniDragon

Welcome to OmniDragon! This guide will help you get started with our cross-chain VRF system, whether you're a developer building applications, an end user, or a security researcher.

## What You'll Learn

- How to interact with the OmniDragon VRF system
- Setting up your development environment
- Making your first randomness request
- Understanding cross-chain operations
- Security best practices

## Prerequisites

Before you begin, ensure you have:

- Basic understanding of blockchain and smart contracts
- Familiarity with Ethereum/EVM-compatible networks
- MetaMask or similar Web3 wallet
- Some ETH on Sonic and/or Arbitrum for gas fees

## Choose Your Path

<div className="row">
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>🎮 Application Developer</h3>
      </div>
      <div className="card__body">
        <p>Building applications that need secure randomness</p>
        <ul>
          <li>Gaming contracts</li>
          <li>Lottery systems</li>
          <li>DeFi protocols</li>
          <li>NFT projects</li>
        </ul>
      </div>
      <div className="card__footer">
        <a href="#developer-quickstart" className="button button--primary">Developer Guide</a>
      </div>
    </div>
  </div>
  
  <div className="col col--6">
    <div className="card">
      <div className="card__header">
        <h3>👤 End User</h3>
      </div>
      <div className="card__body">
        <p>Using applications built on OmniDragon</p>
        <ul>
          <li>Playing games</li>
          <li>Participating in lotteries</li>
          <li>Governance participation</li>
          <li>Cross-chain operations</li>
        </ul>
      </div>
      <div className="card__footer">
        <a href="#user-quickstart" className="button button--primary">User Guide</a>
      </div>
    </div>
  </div>
</div>

## Developer Quickstart

### Step 1: Environment Setup

First, set up your development environment:

```bash
# Clone the repository
git clone https://github.com/wenakita/omnidragon.git
cd omnidragon

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Step 2: Network Configuration

Add the supported networks to your development setup:

```javascript
// hardhat.config.js
networks: {
  sonic: {
    url: "https://rpc.soniclabs.com",
    chainId: 146,
    accounts: [process.env.PRIVATE_KEY]
  },
  arbitrum: {
    url: "https://arb1.arbitrum.io/rpc",
    chainId: 42161,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

### Step 3: Your First Randomness Request

Here's a simple example of requesting randomness:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@interfaces/core/IOmniDragon.sol";

contract MyGameContract {
    IOmniDragon public immutable omniDragon;
    
    mapping(uint256 => address) public requesters;
    mapping(address => uint256) public userRandomness;
    
    event RandomnessRequested(address indexed user, uint256 indexed requestId);
    event RandomnessReceived(address indexed user, uint256 randomness);
    
    constructor(address _omniDragon) {
        omniDragon = IOmniDragon(_omniDragon);
    }
    
    function requestRandomness() external payable {
        // Request randomness with payment
        uint256 requestId = omniDragon.requestRandomness{value: msg.value}();
        
        requesters[requestId] = msg.sender;
        emit RandomnessRequested(msg.sender, requestId);
    }
    
    function fulfillRandomness(uint256 requestId, uint256 randomness) external {
        require(msg.sender == address(omniDragon), "Only OmniDragon");
        
        address user = requesters[requestId];
        userRandomness[user] = randomness;
        
        emit RandomnessReceived(user, randomness);
        
        // Your game logic here
        _processGameResult(user, randomness);
    }
    
    function _processGameResult(address user, uint256 randomness) internal {
        // Implement your game logic
        uint256 result = randomness % 100; // 0-99
        // Handle the random result...
    }
}
```

### Step 4: Deploy and Test

```bash
# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy-game.js --network sonic

# Run tests
npx hardhat test
```

### Step 5: Integration Testing

Test your integration with our comprehensive test suite:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyGameContract", function () {
  let omniDragon, gameContract;
  
  beforeEach(async function () {
    // Deploy mock OmniDragon for testing
    const OmniDragonMock = await ethers.getContractFactory("OmniDragonMock");
    omniDragon = await OmniDragonMock.deploy();
    
    const GameContract = await ethers.getContractFactory("MyGameContract");
    gameContract = await GameContract.deploy(omniDragon.address);
  });
  
  it("Should request randomness successfully", async function () {
    const tx = await gameContract.requestRandomness({ value: ethers.utils.parseEther("0.01") });
    await expect(tx).to.emit(gameContract, "RandomnessRequested");
  });
});
```

## User Quickstart

### Step 1: Wallet Setup

1. **Install MetaMask** or your preferred Web3 wallet
2. **Add Networks**:
   - **Sonic Mainnet**: Chain ID 146, RPC: https://rpc.soniclabs.com
   - **Arbitrum Mainnet**: Chain ID 42161, RPC: https://arb1.arbitrum.io/rpc

### Step 2: Get Test Tokens

For testing on testnets:
- **Sonic Testnet**: Get test S from the faucet
- **Arbitrum Testnet**: Get test ETH from the faucet

### Step 3: Interact with Applications

1. **Find OmniDragon-powered applications**
2. **Connect your wallet**
3. **Follow the application's interface** to:
   - Request randomness
   - Participate in games/lotteries
   - View results

### Step 4: Monitor Transactions

Track your transactions across chains:
- **Sonic Explorer**: https://explorer.soniclabs.com
- **Arbitrum Explorer**: https://arbiscan.io
- **LayerZero Scan**: https://layerzeroscan.com

## Understanding the System

### Architecture Overview

```mermaid
sequenceDiagram
    participant User
    participant App
    participant OmniDragon
    participant Drand
    participant Chainlink
    participant LayerZero
    
    User->>App: Request randomness
    App->>OmniDragon: requestRandomness()
    
    alt Drand Source
        OmniDragon->>Drand: Fetch beacon
        Drand-->>OmniDragon: Random value
    else Chainlink Source
        OmniDragon->>LayerZero: Cross-chain message
        LayerZero->>Chainlink: VRF request
        Chainlink-->>LayerZero: VRF response
        LayerZero-->>OmniDragon: Random value
    end
    
    OmniDragon->>App: fulfillRandomness()
    App->>User: Show result
```

### Key Concepts

**Randomness Sources**:
- **Drand**: Fast, distributed beacon network
- **Chainlink VRF**: Industry-standard verifiable randomness
- **Automatic Failover**: System switches sources if needed

**Cross-Chain Flow**:
- Requests can originate on any supported chain
- LayerZero handles secure message passing
- Results are delivered back to the requesting chain

**Cost Optimization**:
- **Bucket System**: Batch multiple requests for efficiency
- **Pool Mechanisms**: Share costs across users
- **Dynamic Pricing**: Costs adjust based on network conditions

## Security Considerations

### For Developers

1. **Validate Randomness Source**:
   ```solidity
   require(msg.sender == address(omniDragon), "Invalid caller");
   ```

2. **Handle Reentrancy**:
   ```solidity
   modifier nonReentrant() {
       require(!locked, "Reentrant call");
       locked = true;
       _;
       locked = false;
   }
   ```

3. **Implement Timeouts**:
   ```solidity
   require(block.timestamp <= requestTime + TIMEOUT, "Request expired");
   ```

### For Users

1. **Verify Contract Addresses**: Always check you're interacting with official contracts
2. **Understand Costs**: Randomness requests require payment for gas and VRF fees
3. **Monitor Transactions**: Use block explorers to track cross-chain operations

## Common Patterns

### Gaming Applications

```solidity
contract LotteryGame {
    struct Ticket {
        address player;
        uint256 numbers;
        bool claimed;
    }
    
    mapping(uint256 => Ticket[]) public gameTickets;
    uint256 public currentGame;
    
    function buyTicket(uint256 numbers) external payable {
        gameTickets[currentGame].push(Ticket({
            player: msg.sender,
            numbers: numbers,
            claimed: false
        }));
    }
    
    function drawWinner() external {
        omniDragon.requestRandomness{value: vrfFee}();
    }
    
    function fulfillRandomness(uint256 requestId, uint256 randomness) external {
        uint256 winningIndex = randomness % gameTickets[currentGame].length;
        address winner = gameTickets[currentGame][winningIndex].player;
        // Distribute prize...
    }
}
```

### DeFi Applications

```solidity
contract RandomizedYield {
    function claimRewards() external {
        uint256 baseReward = calculateBaseReward(msg.sender);
        omniDragon.requestRandomness{value: vrfFee}();
        // Store pending claim...
    }
    
    function fulfillRandomness(uint256 requestId, uint256 randomness) external {
        address claimer = pendingClaims[requestId];
        uint256 multiplier = (randomness % 50) + 100; // 100-149% multiplier
        uint256 finalReward = baseReward * multiplier / 100;
        // Transfer rewards...
    }
}
```

## Next Steps

### For Developers
1. **[Smart Contract Documentation](./contracts/core/omnidragon)** - Deep dive into contract APIs
2. **[Testing Guide](./guide/testing-framework)** - Comprehensive testing strategies
3. **[Deployment Guide](./052525updates/SONIC_VRF_DEPLOYMENT_GUIDE)** - Production deployment

### For Users
1. **[User Guides](./guides/user/getting-started)** - Detailed user documentation
2. **[Cross-Chain Operations](./guides/user/cross-chain-operations)** - Understanding cross-chain flows
3. **[Governance](./guides/user/governance-participation)** - Participate in protocol governance

### For Security Researchers
1. **[Audit Documentation](./audit/AUDIT_DOCUMENTATION_SUMMARY)** - Complete security analysis
2. **[Threat Model](./audit/THREAT_MODEL)** - Risk assessment and mitigations
3. **[Security Best Practices](./052525updates/SECURITY_AUDIT_RECOMMENDATIONS)** - Implementation guidelines

## Support & Community

- **Documentation**: Comprehensive guides and references
- **GitHub Issues**: Report bugs and request features
- **Developer Support**: Technical assistance for integrations
- **Security Contact**: For security-related inquiries

---

**Ready to build?** Choose your path above and start integrating secure, verifiable randomness into your applications with OmniDragon! 