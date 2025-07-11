---
sidebar_position: 3
title: Developer Setup
description: Set up your development environment to build on OmniDragon
---

# Developer Setup

This guide will help you set up your development environment to build applications on the OmniDragon protocol. Whether you're integrating with the token, jackpot system, or cross-chain functionality, this guide will get you started.

## Development Environment

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))
- [Foundry](https://getfoundry.sh/) (for Solidity development)

### Setting Up a New Project

1.**Create a new directory for your project**:

```bash
mkdir my-OmniDragon-app
cd my-OmniDragon-app
```

2.**Initialize a new Node.js project**:

```bash
npm init -y
```

3.**Install the OmniDragon SDK**:

```bash
npm install @OmniDragon/sdk ethers
```

4.**Create a basic project structure**:

```bash
mkdir -p src/contracts src/utils src/components
touch src/index.js
```

## OmniDragon SDK

The OmniDragon SDK provides a simple interface to interact with the protocol's contracts across all supported chains.

### Installation

```bash
npm install @OmniDragon/sdk ethers
```

### Basic Usage

```javascript
import { OmniDragon, ChainId } from '@OmniDragon/sdk';
import { ethers } from 'ethers';

// Initialize provider
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Initialize OmniDragon SDK
const omniDragon = new OmniDragon({
  provider,
  signer,
  chainId: ChainId.ETHEREUM,
});

// Get token balance
async function getBalance() {
  const balance = await omniDragon.token.balanceOf(await signer.getAddress());
  console.log(`Balance: ${ethers.utils.formatUnits(balance, 18)} DRAGON`);
}

// Transfer tokens
async function transfer(recipient, amount) {
  const tx = await omniDragon.token.transfer(
    recipient,
    ethers.utils.parseUnits(amount, 18)
  );
  await tx.wait();
  console.log(`Transferred ${amount} DRAGON to ${recipient}`);
}
```

### Cross-Chain Operations

```javascript
import { OmniDragon, ChainId } from '@OmniDragon/sdk';
import { ethers } from 'ethers';

// Initialize provider
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Initialize OmniDragon SDK
const omniDragon = new OmniDragon({
  provider,
  signer,
  chainId: ChainId.ETHEREUM,
});

// Bridge tokens to another chain
async function bridgeTokens(destinationChainId, recipient, amount) {
  // Estimate fees
  const fees = await omniDragon.bridge.estimateFees(
    destinationChainId,
    recipient,
    ethers.utils.parseUnits(amount, 18)
  );
  
  // Send tokens
  const tx = await omniDragon.bridge.sendTokens(
    destinationChainId,
    recipient,
    ethers.utils.parseUnits(amount, 18),
    { value: fees }
  );
  
  await tx.wait();
  console.log(`Bridged ${amount} DRAGON to chain ${destinationChainId}`);
}
```

### Jackpot System Integration

```javascript
import { OmniDragon, ChainId } from '@OmniDragon/sdk';
import { ethers } from 'ethers';

// Initialize provider
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Initialize OmniDragon SDK
const omniDragon = new OmniDragon({
  provider,
  signer,
  chainId: ChainId.ETHEREUM,
});

// Get jackpot information
async function getJackpotInfo() {
  const jackpotSize = await omniDragon.jackpot.getJackpotSize();
  const lastWinner = await omniDragon.jackpot.getLastWinner();
  const lastWinAmount = await omniDragon.jackpot.getLastWinAmount();
  
  console.log(`Current Jackpot: ${ethers.utils.formatUnits(jackpotSize, 18)} DRAGON`);
  console.log(`Last Winner: ${lastWinner}`);
  console.log(`Last Win Amount: ${ethers.utils.formatUnits(lastWinAmount, 18)} DRAGON`);
}

// Check if an address has won
async function checkWinStatus(address) {
  const hasWon = await omniDragon.jackpot.hasWon(address);
  if (hasWon) {
    const winAmount = await omniDragon.jackpot.getWinAmount(address);
    console.log(`Address ${address} has won ${ethers.utils.formatUnits(winAmount, 18)} DRAGON`);
  } else {
    console.log(`Address ${address} has not won`);
  }
}
```

### Governance Integration

```javascript
import { OmniDragon, ChainId } from '@OmniDragon/sdk';
import { ethers } from 'ethers';

// Initialize provider
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Initialize OmniDragon SDK
const omniDragon = new OmniDragon({
  provider,
  signer,
  chainId: ChainId.ETHEREUM,
});

// Get governance information
async function getGovernanceInfo() {
  const address = await signer.getAddress();
  const votingPower = await omniDragon.governance.getVotingPower(address);
  const proposals = await omniDragon.governance.getActiveProposals();
  
  console.log(`Voting Power: ${ethers.utils.formatUnits(votingPower, 18)}`);
  console.log(`Active Proposals: ${proposals.length}`);
  
  for (const proposal of proposals) {
    console.log(`Proposal ${proposal.id}: ${proposal.description}`);
    console.log(`For: ${ethers.utils.formatUnits(proposal.forVotes, 18)}`);
    console.log(`Against: ${ethers.utils.formatUnits(proposal.againstVotes, 18)}`);
  }
}

// Vote on a proposal
async function vote(proposalId, support) {
  const tx = await omniDragon.governance.vote(proposalId, support);
  await tx.wait();
  console.log(`Voted ${support ? 'for' : 'against'} proposal ${proposalId}`);
}

// Create a proposal
async function createProposal(description, callData, target) {
  const tx = await omniDragon.governance.createProposal(description, callData, target);
  await tx.wait();
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === 'ProposalCreated');
  const proposalId = event.args.proposalId;
  console.log(`Created proposal ${proposalId}: ${description}`);
}
```

## Smart Contract Development

If you're developing smart contracts that interact with the OmniDragon protocol, you can use Foundry for development and testing.

### Setting Up a Foundry Project

1.**Initialize a new Foundry project**:

```bash
forge init my-OmniDragon-contracts
cd my-OmniDragon-contracts
```

2.**Install OmniDragon contracts**:

```bash
forge install OmniDragon/contracts
```

3.**Create a contract that interacts with OmniDragon**:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "OmniDragon/contracts/interfaces/IOmniDragon.sol";
import "OmniDragon/contracts/interfaces/IJackpotVault.sol";

contract MyDragonApp {
    IOmniDragon public omniDragon;
    IJackpotVault public jackpotVault;
    
    constructor(address _omniDragon, address _jackpotVault) {
        omniDragon = IOmniDragon(_omniDragon);
        jackpotVault = IJackpotVault(_jackpotVault);
    }
    
    function getJackpotSize() external view returns (uint256) {
        return jackpotVault.getAvailableJackpot();
    }
    
    function transferTokens(address recipient, uint256 amount) external {
        omniDragon.transferFrom(msg.sender, recipient, amount);
    }
}
```

### Testing Your Contracts

Create a test file for your contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/MyDragonApp.sol";
import "OmniDragon/contracts/mocks/MockOmniDragon.sol";
import "OmniDragon/contracts/mocks/MockJackpotVault.sol";

contract MyDragonAppTest is Test {
    MyDragonApp public app;
    MockOmniDragon public mockToken;
    MockJackpotVault public mockVault;
    
    address public user = address(1);
    address public recipient = address(2);
    
    function setUp() public {
        mockToken = new MockOmniDragon();
        mockVault = new MockJackpotVault();
        app = new MyDragonApp(address(mockToken), address(mockVault));
        
        mockToken.mint(user, 1000 ether);
        vm.prank(user);
        mockToken.approve(address(app), 1000 ether);
    }
    
    function testGetJackpotSize() public {
        mockVault.setAvailableJackpot(100 ether);
        assertEq(app.getJackpotSize(), 100 ether);
    }
    
    function testTransferTokens() public {
        vm.prank(user);
        app.transferTokens(recipient, 50 ether);
        assertEq(mockToken.balanceOf(recipient), 50 ether);
    }
}
```

Run the tests:

```bash
forge test
```

## Frontend Development

For frontend development, you can use React with the OmniDragon SDK.

### Setting Up a React Project

1.**Create a new React app**:

```bash
npx create-react-app my-OmniDragon-frontend
cd my-OmniDragon-frontend
```

2.**Install dependencies**:

```bash
npm install @OmniDragon/sdk ethers@5.7.2 @web3-react/core @web3-react/injected-connector
```

3.**Create a wallet connection component**:

```jsx
// src/components/WalletConnect.js
import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
  supportedChainIds: [1, 56, 42161, 43114], // Ethereum, BNB Chain, Arbitrum, Avalanche
});

function WalletConnect() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const [balance, setBalance] = useState(null);

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    if (library && account) {
      let stale = false;
      library.getBalance(account).then((balance) => {
        if (!stale) {
          setBalance(balance);
        }
      });
      return () => {
        stale = true;
        setBalance(null);
      };
    }
  }, [library, account]);

  return (
    <div>
      {active ? (
        <div>
          <div>Connected with {account}</div>
          <div>Balance: {balance ? ethers.utils.formatEther(balance) : 'Loading...'}</div>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect to MetaMask</button>
      )}
    </div>
  );
}

export default WalletConnect;
```

4.**Create a component to interact with OmniDragon**:

```jsx
// src/components/DragonInteraction.js
import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { OmniDragon, ChainId } from '@OmniDragon/sdk';
import { ethers } from 'ethers';

function DragonInteraction() {
  const { active, account, library, chainId } = useWeb3React();
  const [dragonBalance, setDragonBalance] = useState(null);
  const [jackpotSize, setJackpotSize] = useState(null);
  const [omniDragon, setOmniDragon] = useState(null);

  useEffect(() => {
    if (library && account) {
      const sdk = new OmniDragon({
        provider: library,
        signer: library.getSigner(),
        chainId: chainId,
      });
      setOmniDragon(sdk);
    }
  }, [library, account, chainId]);

  useEffect(() => {
    if (omniDragon && account) {
      let stale = false;
      
      // Get DRAGON balance
      omniDragon.token.balanceOf(account).then((balance) => {
        if (!stale) {
          setDragonBalance(balance);
        }
      });
      
      // Get jackpot size
      omniDragon.jackpot.getJackpotSize().then((size) => {
        if (!stale) {
          setJackpotSize(size);
        }
      });
      
      return () => {
        stale = true;
        setDragonBalance(null);
        setJackpotSize(null);
      };
    }
  }, [omniDragon, account]);

  if (!active || !omniDragon) {
    return <div>Connect your wallet first</div>;
  }

  return (
    <div>
      <h2>OmniDragon Interaction</h2>
      <div>DRAGON Balance: {dragonBalance ? ethers.utils.formatUnits(dragonBalance, 18) : 'Loading...'}</div>
      <div>Current Jackpot: {jackpotSize ? ethers.utils.formatUnits(jackpotSize, 18) : 'Loading...'}</div>
    </div>
  );
}

export default DragonInteraction;
```

5.**Update your App.js**:

```jsx
// src/App.js
import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import WalletConnect from './components/WalletConnect';
import DragonInteraction from './components/DragonInteraction';
import './App.css';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <header className="App-header">
          <h1>OmniDragon App</h1>
          <WalletConnect />
          <DragonInteraction />
        </header>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
```

## Contract Addresses

Use these contract addresses to interact with the OmniDragon protocol:

### Ethereum Mainnet

- OmniDragon Token: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e4`
- Jackpot Vault: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12f4`
- Jackpot Distributor: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1304`
- Swap Trigger Oracle: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1314`
- Randomness Provider: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1324`
- ve69LP Governance: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1334`
- Cross-Chain Bridge: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1344`

### BNB Chain

- OmniDragon Token: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e5`
- Jackpot Vault: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12f5`
- Jackpot Distributor: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1305`
- Swap Trigger Oracle: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1315`
- Randomness Provider: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1325`
- ve69LP Governance: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1335`
- Cross-Chain Bridge: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1345`

### Arbitrum

- OmniDragon Token: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e6`
- Jackpot Vault: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12f6`
- Jackpot Distributor: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1306`
- Swap Trigger Oracle: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1316`
- Randomness Provider: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1326`
- ve69LP Governance: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1336`
- Cross-Chain Bridge: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1346`

### Avalanche

- OmniDragon Token: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e7`
- Jackpot Vault: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12f7`
- Jackpot Distributor: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1307`
- Swap Trigger Oracle: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1317`
- Randomness Provider: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1327`
- ve69LP Governance: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1337`
- Cross-Chain Bridge: `0x69420691e0e902191a9b2e72f4d28bc0b0dc1347`

## Development Resources

### Documentation

- [OmniDragon SDK Documentation](https://docs.OmniDragon.io/reference/sdk/installation)
- [Smart Contract Reference](https://docs.OmniDragon.io/reference/contracts/core)
- [API Reference](https://docs.OmniDragon.io/reference/api/overview)

### Tools

- [OmniDragon Explorer](https://explorer.OmniDragon.io): Explore transactions, addresses, and contracts
- [OmniDragon Testnet Faucet](https://faucet.OmniDragon.io): Get testnet tokens for development
- [OmniDragon Discord](https://discord.gg/OmniDragon): Join the developer community

### Example Projects

- [OmniDragon Jackpot UI](https://github.com/OmniDragon/jackpot-ui): Example jackpot interface
- [OmniDragon Bridge UI](https://github.com/OmniDragon/bridge-ui): Example bridge interface
- [OmniDragon Governance UI](https://github.com/OmniDragon/governance-ui): Example governance interface

## Best Practices

### Security

1.**Always validate user input**: Never trust user input, especially when constructing transactions
2.**Use the latest SDK version**: Keep your dependencies updated to benefit from security fixes
3.**Implement proper error handling**: Catch and handle errors gracefully
4.**Test thoroughly**: Test your application on testnets before deploying to mainnet
5.**Consider gas costs**: Optimize your contracts to minimize gas costs for users

### Performance

1.**Use batch requests**: Combine multiple read operations into a single multicall
2.**Implement caching**: Cache data that doesn't change frequently
3.**Optimize contract calls**: Minimize the number of contract calls in your application
4.**Use event listeners**: Subscribe to events instead of polling for updates
5.**Implement pagination**: Use pagination for large data sets

### User Experience

1.**Provide clear feedback**: Keep users informed about transaction status
2.**Handle network switching**: Support multiple networks and guide users to switch when needed
3.**Implement wallet connection**: Support multiple wallet providers
4.**Provide gas estimates**: Show users the estimated gas cost before they submit transactions
5.**Handle errors gracefully**: Display user-friendly error messages

## Next Steps

Now that you have set up your development environment, you can:

1.**Explore the [Core Concepts](/concepts/architecture)**to understand the protocol's architecture
2.**Check out the [Technical Documentation](/concepts/architecture#smart-contracts)**for detailed technical information
3.**Join the [Discord community](https://discord.gg/OmniDragon)**to connect with other developers

## Support

If you need assistance, you can:

- Visit the [FAQ](/resources/faq.md) for answers to common questions
- Join the [Discord community](https://discord.gg/OmniDragon) for developer support
- Contact the developer relations team at [developers@OmniDragon.io](mailto:developers@OmniDragon.io)
