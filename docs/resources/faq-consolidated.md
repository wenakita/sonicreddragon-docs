---
sidebar_position: 1
title: Frequently Asked Questions
description: Answers to common questions about OmniDragon
---

# Frequently Asked Questions

This document provides answers to common questions about the OmniDragon protocol. If you don't find the answer to your question here, please reach out to our community support channels.

## General Questions

### What is OmniDragon?

OmniDragon is a multi-chain token protocol that implements sophisticated tokenomics with a built-in jackpot system, cross-chain capabilities, and governance features. The protocol is designed to create sustainable value for all participants through its fee mechanism, deflationary pressure, and reward systems.

### Which blockchains does OmniDragon support?

OmniDragon currently supports the following blockchains:
- Ethereum Mainnet
- BNB Chain
- Arbitrum
- Avalanche

We plan to expand to additional chains in the future based on community governance decisions.

### How do I get started with OmniDragon?

To get started with OmniDragon:
1. Visit the [OmniDragon app](https://app.OmniDragon.io)
2. Connect your wallet (MetaMask, WalletConnect, etc.)
3. Ensure you have some native tokens (ETH, BNB, etc.) for gas fees
4. Buy DRAGON tokens through the swap interface
5. Explore the various features like jackpot, governance, and cross-chain transfers

For a detailed guide, see our [User Guide](/guide/user-guide.mdx).

### What makes OmniDragon different from other tokens?

OmniDragon differentiates itself through:
-**Integrated Jackpot System**: Automatic jackpot entries with every purchase
-**Cross-Chain Capability**: Seamless operation across multiple blockchains
-**Sustainable Tokenomics**: Fee distribution that creates multiple value streams
-**Deflationary Mechanism**: Automatic burns that reduce supply over time
-**Governance Integration**: Community control over protocol parameters

## Token Questions

### What is the total supply of DRAGON tokens?

The initial total supply of DRAGON tokens is 69,000,000,000 (69 billion). However, due to the deflationary mechanism, the circulating supply will decrease over time as tokens are burned.

### What are the tokenomics of DRAGON?

DRAGON tokenomics include:
-**Initial Supply**: 69,000,000,000 tokens
-**Initial Burn**: 6,900,000,000 tokens (10% of total supply)
-**Buy/Sell Fee**: 10% (6.9% to jackpot, 2.41% to governance, 0.69% burned)
-**Transfer Fee**: 0.69% (all burned)
-**Cross-Chain Fee**: 0.69% base fee plus LayerZero fees

For more details, see the [Token System](/concepts/token-system-consolidated) documentation.

### Where can I buy DRAGON tokens?

You can buy DRAGON tokens through:
1. The official [OmniDragon app](https://app.OmniDragon.io)
2. Decentralized exchanges where DRAGON is listed
3. Direct peer-to-peer transfers

We recommend using the official app for the best experience and to ensure you're interacting with the genuine DRAGON token.

### Why do transactions have fees?

Transactions have fees to create sustainable value for all participants:
-**Jackpot Funding**: 6.9% of buy/sell fees fund the jackpot vault
-**Governance Rewards**: 2.41% of buy/sell fees reward governance participants
-**Deflationary Pressure**: 0.69% of all transactions are burned

These fees create multiple value streams that benefit long-term holders and active participants in the ecosystem.

## Jackpot Questions

### How does the jackpot system work?

The jackpot system works as follows:
1. Every buy transaction automatically creates jackpot entries
2. The probability of winning depends on purchase size, jackpot size, time since last win, and network activity
3. When a win occurs, a portion of the jackpot vault is distributed to the winner
4. The remaining jackpot continues to grow from transaction fees

For more details, see the [Jackpot System](/concepts/jackpot.md) documentation.

### How are winners selected?

Winners are selected through a secure randomness process:
1. Each buy transaction has a chance to trigger the jackpot
2. The probability is calculated based on multiple factors
3. When triggered, the randomness infrastructure provides a verifiable randomness
4. This randomness determines the winner and reward amount

The selection process is fully transparent and verifiable on-chain.

### What are my chances of winning the jackpot?

Your chances of winning depend on several factors:
-**Purchase Size**: Larger purchases have a higher chance of winning
-**Jackpot Size**: Larger jackpots have a higher chance of being won
-**Time Factor**: The longer since the last win, the higher the chance
-**Network Activity**: Higher network activity increases the chance

The base probability is approximately 1 in 1,000,000, but these factors can significantly increase your chances.

### How much can I win?

The jackpot reward varies based on:
1. The current size of the jackpot vault
2. The randomness factor that determines the percentage of the vault to distribute
3. The chain where the win occurs

Typically, winners receive between 10% and 100% of the available jackpot, with the exact percentage determined by the randomness factor.

### How do I claim my winnings?

You don't need to claim your winnings manually. If you win the jackpot:
1. The reward is automatically sent to your wallet
2. You'll receive a notification in the app
3. The transaction will appear in your wallet's transaction history
4. Your win will be displayed in the recent winners list

## Cross-Chain Questions

### How do I bridge my tokens to another chain?

To bridge your tokens to another chain:
1. Navigate to the "Bridge" page in the app
2. Select your source chain and destination chain
3. Enter the amount of DRAGON to bridge
4. Click "Bridge Tokens"
5. Confirm the transaction in your wallet
6. Wait for the cross-chain transaction to complete

For a detailed guide, see the [User Guide](/guide/user-guide.mdx#bridging-tokens-to-another-chain).

### How long do cross-chain transfers take?

Cross-chain transfers typically take:
-**5-10 minutes**: Under normal network conditions
-**10-20 minutes**: During periods of network congestion
-**20+ minutes**: During extreme network congestion or if there are issues with the LayerZero relayers

You can track the status of your transfer in the "Transactions" tab of the app.

### What fees are involved in cross-chain transfers?

Cross-chain transfers incur the following fees:
1.**Base Fee**: 0.69% of the transfer amount
2.**LayerZero Fee**: Fee to cover the cost of the cross-chain message (varies by destination chain)
3.**Destination Gas**: Fee to cover the cost of minting tokens on the destination chain

The app will display the total fee before you confirm the transaction.

### What if my cross-chain transfer is stuck?

If your cross-chain transfer appears to be stuck:
1. Check the "Transactions" tab for the current status
2. Verify that the transaction was confirmed on the source chain
3. Allow extra time during periods of network congestion
4. If the transfer remains stuck for more than 1 hour, contact support with your transaction hash

## Governance Questions

### How do I participate in governance?

To participate in governance:
1. Navigate to the "Governance" page in the app
2. Stake your LP tokens to receive voting power
3. Browse active proposals and vote on them
4. Create your own proposals if you have sufficient voting power

For a detailed guide, see the [User Guide](/guide/user-guide.mdx#governance-participation).

### How is voting power calculated?

Voting power is calculated based on:
1. The amount of LP tokens staked
2. The duration of the lock period
3. The boost multiplier (longer locks receive higher multipliers)

The formula is: `Voting Power = LP Tokens * Lock Duration Multiplier`

### What can be changed through governance?

Governance can control various protocol parameters:
- Fee percentages and distribution
- Jackpot trigger conditions
- Cross-chain bridge parameters
- Protocol upgrades and improvements
- Treasury fund allocation

Any parameter that isn't hardcoded can potentially be modified through governance.

### How do I create a proposal?

To create a governance proposal:
1. Ensure you have sufficient voting power (minimum 100,000)
2. Navigate to the "Governance" page
3. Click "Create Proposal"
4. Fill in the proposal details (title, description, actions)
5. Submit the proposal
6. Share your proposal with the community to gather support

For a detailed guide, see the [User Guide](/guide/user-guide.mdx#creating-a-proposal).

## Security Questions

### Is OmniDragon secure?

OmniDragon implements multiple layers of security:
-**Smart Contract Security**: Comprehensive security measures in all contracts
-**Audits**: Regular audits by leading security firms
-**Bug Bounty Program**: Rewards for responsible disclosure of vulnerabilities
-**Multi-Signature Controls**: Critical functions require multiple approvals
-**Time-Locked Operations**: Sensitive operations require time delays

For more details, see the [Security Model](/concepts/security-model) documentation.

### Has OmniDragon been audited?

Yes, OmniDragon has been audited by multiple reputable security firms:
-**Firm A**: Comprehensive audit of all core contracts
-**Firm B**: Specialized audit of cross-chain functionality
-**Firm C**: Economic audit of tokenomics and incentive structures

All audit reports are available in the [Security section](https://docs.OmniDragon.io/security/audits) of our documentation.

### How can I report a security vulnerability?

To report a security vulnerability:
1. Do not disclose the vulnerability publicly
2. Email security@OmniDragon.io with details of the vulnerability
3. Include steps to reproduce the vulnerability
4. If possible, include a proof of concept

We offer rewards for responsible disclosure of vulnerabilities through our bug bounty program.

### How can I protect my assets?

To protect your assets:
1. Use a hardware wallet for large holdings
2. Never share your private key or seed phrase
3. Verify contract addresses before interacting with them
4. Be cautious of phishing attempts and fake websites
5. Keep your wallet software up to date

For more security tips, see the [User Guide](/guide/user-guide.mdx#security-best-practices).

## Technical Questions

### What is the contract address for DRAGON?

The DRAGON token contract addresses are:
-**Ethereum**: 0x69420EaEd4a68B7af8C548Ae5F5b2E0D5B5A7699
-**BNB Chain**: 0x69420EaEd4a68B7af8C548Ae5F5b2E0D5B5B7699
-**Arbitrum**: 0x69420EaEd4a68B7af8C548Ae5F5b2E0D5B5C7699
-**Avalanche**: 0x69420EaEd4a68B7af8C548Ae5F5b2E0D5B5D7699

Always verify contract addresses through official sources to avoid scams.

### How does the randomness system work?

The randomness system combines multiple sources of randomness:
1.**Drand Network**: A distributed randomness beacon
2.**Chainlink VRF**: Verifiable random functions
3.**Custom Oracle**: Additional randomness from block variables

These sources are combined and verified to ensure secure, unpredictable randomness for the jackpot system.

For more details, see the [Randomness Infrastructure](/concepts/randomness) documentation.

### How does the cross-chain bridge work?

The cross-chain bridge works as follows:
1. Tokens are locked or burned on the source chain
2. A cross-chain message is sent via LayerZero
3. The message is verified by the destination chain
4. Tokens are minted or unlocked on the destination chain

This process ensures that the total supply remains constant across all chains.

For more details, see the [Cross-Chain Infrastructure](/concepts/cross-chain) documentation.

### Can I integrate OmniDragon into my dApp?

Yes, you can integrate OmniDragon into your dApp using our SDK:
1. Install the SDK: `npm install @OmniDragon/sdk`
2. Initialize the SDK with your provider and signer
3. Use the SDK to interact with OmniDragon contracts

For a detailed guide, see the [Developer Guide](/guide/developer-guide.mdx).

## Troubleshooting

### My transaction failed. What should I do?

If your transaction failed:
1. Check that you have enough native tokens (ETH, BNB, etc.) for gas fees
2. Verify that you've approved the token for the contract interaction
3. Try increasing the gas limit or gas price
4. If using MetaMask, try resetting the account (Settings > Advanced > Reset Account)
5. If problems persist, contact support with your transaction hash

### I can't see my tokens in my wallet. What should I do?

If you can't see your tokens:
1. Make sure you've added the DRAGON token to your wallet
2. Verify that you're on the correct network
3. For cross-chain transfers, check the transaction status on the "Transactions" page
4. Allow some time for the transaction to be confirmed (especially for cross-chain transfers)
5. If problems persist, contact support with your transaction hash

### The app isn't loading. What should I do?

If the app isn't loading:
1. Refresh the page
2. Clear your browser cache
3. Try using a different browser
4. Check if your internet connection is stable
5. Verify that your wallet extension is up to date
6. Check our social media channels for any announced maintenance

### I'm having wallet connection issues. What should I do?

If you're having trouble connecting your wallet:
1. Refresh the page
2. Make sure your wallet extension is up to date
3. Try disconnecting and reconnecting your wallet
4. Check if you're on a supported network
5. Try using a different browser
6. If using a hardware wallet, ensure it's properly connected and unlocked

## Support

### How do I get help?

You can get help through various channels:
-**Discord**: Join our [Discord server](https://discord.gg/OmniDragon) for community support
-**Telegram**: Visit our [Telegram group](https://t.me/OmniDragon) for quick assistance
-**Email**: Contact support@OmniDragon.io for official support
-**Live Chat**: Available on the app during business hours
-**Community Forum**: Check the [Community Forum](https://forum.OmniDragon.io) for discussions

### Where can I find the latest updates?

You can find the latest updates through:
-**Twitter**: Follow [@OmniDragon](https://twitter.com/OmniDragon) for announcements
-**Discord**: Join our [Discord server](https://discord.gg/OmniDragon) for updates
-**Medium**: Read our [Medium blog](https://medium.com/OmniDragon) for detailed articles
-**Website**: Check the [News section](https://OmniDragon.io/news) of our website

### How do I report a bug?

To report a bug:
1. Check if the bug has already been reported in our [GitHub issues](https://github.com/OmniDragon/app/issues)
2. If not, create a new issue with:
   - A clear description of the bug
   - Steps to reproduce the bug
   - Expected behavior
   - Actual behavior
   - Screenshots or videos if applicable
   - Your browser and wallet information

### How do I suggest a feature?

To suggest a feature:
1. Check if the feature has already been suggested in our [GitHub issues](https://github.com/OmniDragon/app/issues)
2. If not, create a new issue with:
   - A clear description of the feature
   - The problem it solves
   - How it would benefit the ecosystem
   - Any relevant examples or mockups

Alternatively, you can create a governance proposal for feature suggestions that require protocol changes.
