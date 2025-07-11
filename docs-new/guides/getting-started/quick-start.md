---
sidebar_position: 2
title: Quick Start Guide
description: Step-by-step guide to get started with OmniDragon
---

# Quick Start Guide

This guide will help you get started with the OmniDragon protocol, from setting up a wallet to participating in the ecosystem. Follow these steps to begin your journey with OmniDragon.

## Prerequisites

Before you begin, you'll need:

- A Web3 wallet (MetaMask, Trust Wallet, etc.)
- Some native currency (ETH, BNB, AVAX, etc.) for gas fees
- Basic understanding of blockchain transactions

## Step 1: Set Up Your Wallet

1.**Install a Web3 wallet**:
   - [MetaMask](https://metamask.io/download.html) (recommended)
   - [Trust Wallet](https://trustwallet.com/)
   - [Coinbase Wallet](https://www.coinbase.com/wallet)

2.**Create a new wallet or import an existing one**:
   - Follow the wallet's instructions to create a new wallet or import an existing one
   -**Important**: Securely store your seed phrase offline and never share it with anyone

3.**Add supported networks**:**Ethereum Mainnet**(already included in most wallets)**BNB Chain**- Network Name: BNB Chain
   - RPC URL: https://bsc-dataseed.binance.org/
   - Chain ID: 56
   - Symbol: BNB
   - Block Explorer: https://bscscan.com**Arbitrum**- Network Name: Arbitrum One
   - RPC URL: https://arb1.arbitrum.io/rpc
   - Chain ID: 42161
   - Symbol: ETH
   - Block Explorer: https://arbiscan.io**Avalanche**- Network Name: Avalanche C-Chain
   - RPC URL: https://api.avax.network/ext/bc/C/rpc
   - Chain ID: 43114
   - Symbol: AVAX
   - Block Explorer: https://snowtrace.io

## Step 2: Acquire DRAGON Tokens

You can acquire DRAGON tokens through several methods:

### Option 1: Purchase on a Decentralized Exchange (DEX)

1.**Connect your wallet to a DEX**:
   - [Uniswap](https://app.uniswap.org/) (Ethereum, Arbitrum)
   - [PancakeSwap](https://pancakeswap.finance/) (BNB Chain)
   - [Trader Joe](https://www.traderjoexyz.com/) (Avalanche)

2.**Swap for DRAGON tokens**:
   - Select the appropriate network in your wallet
   - Enter the DRAGON token contract address:
     - Ethereum: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e4`
     - BNB Chain: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e5`
     - Arbitrum: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e6`
     - Avalanche: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e7`
   - Enter the amount you want to swap
   - Confirm the transaction and pay the gas fee

### Option 2: Bridge from Another Chain

If you already have DRAGON tokens on one chain, you can bridge them to another chain:

1.**Visit the OmniDragon Bridge**:
   - Go to [bridge.OmniDragon.io](https://bridge.OmniDragon.io)
   - Connect your wallet

2.**Initiate the bridge transaction**:
   - Select the source chain (where your tokens are)
   - Select the destination chain (where you want to send them)
   - Enter the amount to bridge
   - Confirm the transaction and pay the gas fee
   - Wait for the cross-chain transaction to complete (typically 10-15 minutes)

## Step 3: Participate in the Jackpot System

Every buy transaction automatically enters you into the jackpot system:

1.**Purchase DRAGON tokens**:
   - Follow the steps in Option 1 above to purchase tokens
   - Each buy transaction has a chance to win a portion of the jackpot

2.**Check your jackpot status**:
   - Go to [jackpot.OmniDragon.io](https://jackpot.OmniDragon.io)
   - Connect your wallet
   - View your entry history and any winnings

3.**Claim winnings**(if you've won):
   - If you've won a jackpot, you'll see it in your dashboard
   - Click "Claim" to receive your winnings
   - Confirm the transaction and pay the gas fee

## Step 4: Participate in Governance

You can participate in governance by locking LP tokens:

1.**Provide liquidity**:
   - Go to the appropriate DEX for your chain
   - Add liquidity to the DRAGON-ETH pair (or DRAGON-BNB, etc.)
   - Receive LP tokens in return

2.**Lock your LP tokens**:
   - Go to [governance.OmniDragon.io](https://governance.OmniDragon.io)
   - Connect your wallet
   - Select the amount of LP tokens to lock
   - Choose a lock duration (longer durations provide higher voting power)
   - Confirm the transaction and pay the gas fee

3.**Participate in governance**:
   - View active proposals
   - Vote on proposals using your voting power
   - Create new proposals (requires minimum voting power)

## Step 5: Use Cross-Chain Functionality

You can move your DRAGON tokens between supported chains:

1.**Visit the OmniDragon Bridge**:
   - Go to [bridge.OmniDragon.io](https://bridge.OmniDragon.io)
   - Connect your wallet

2.**Initiate the bridge transaction**:
   - Select the source chain (where your tokens are)
   - Select the destination chain (where you want to send them)
   - Enter the amount to bridge
   - Confirm the transaction and pay the gas fee
   - Wait for the cross-chain transaction to complete (typically 10-15 minutes)

## Step 6: Track Your Portfolio

You can track your DRAGON holdings and activity:

1.**Visit the OmniDragon Dashboard**:
   - Go to [app.OmniDragon.io](https://app.OmniDragon.io)
   - Connect your wallet

2.**View your portfolio**:
   - See your token balances across all chains
   - Track your jackpot entries and winnings
   - Monitor your governance participation
   - View your transaction history

## Common Operations

### Buying DRAGON Tokens

```mermaid
graph LR
    A[Input] -->|> B[Process]| C[Output]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#059669,stroke:#047857,color:#fff
```

## Troubleshooting

### Transaction Pending for Too Long

If your transaction is pending for too long:

1. Check the network status on [status.OmniDragon.io](https://status.OmniDragon.io)
2. If the network is congested, you can:
   - Wait for the congestion to clear
   - Speed up the transaction by increasing the gas price (if your wallet supports this)
   - Cancel the transaction and try again with a higher gas price

### Cross-Chain Transfer Delayed

If your cross-chain transfer is taking longer than expected:

1. Check the transaction status on [bridge.OmniDragon.io](https://bridge.OmniDragon.io)
2. Verify that the source transaction was confirmed
3. Note that cross-chain transfers typically take 10-15 minutes, but can take longer during periods of high congestion
4. If the transfer is still pending after 1 hour, contact support at [support@OmniDragon.io](mailto:support@OmniDragon.io)

### Token Not Showing in Wallet

If you've acquired DRAGON tokens but they're not showing in your wallet:

1. Manually add the token to your wallet using the contract address:
   - Ethereum: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e4`
   - BNB Chain: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e5`
   - Arbitrum: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e6`
   - Avalanche: `0x69420691e0e902191a9b2e72f4d28bc0b0dc12e7`
2. Ensure you're on the correct network in your wallet
3. If you've bridged tokens, wait for the cross-chain transfer to complete

## Security Best Practices

1.**Never share your seed phrase or private keys**with anyone, including OmniDragon team members
2.**Always verify contract addresses**before interacting with them
3.**Use hardware wallets**for large holdings
4.**Be cautious of phishing attempts**- always double-check URLs and contract addresses
5.**Keep your software updated**- use the latest version of your wallet and browser
6.**Use a dedicated device**for high-value transactions
7.**Enable additional security features**in your wallet, such as transaction signing and multi-factor authentication

## Next Steps

Now that you're familiar with the basic operations of the OmniDragon protocol, you can:

1.**Explore the [Developer Setup](/guides/guides/getting-started/developer-setup)**if you're interested in building on OmniDragon
2.**Dive deeper into [Core Concepts](/concepts/architecture.md)**to understand the protocol's architecture
3.**Join the community**on [Discord](https://discord.gg/OmniDragon) and [Telegram](https://t.me/OmniDragon)

## Support

If you need assistance, you can:

- Visit the [FAQ](/resources/faq) for answers to common questions
- Join the [Discord community](https://discord.gg/OmniDragon) for community support
- Contact the support team at [support@OmniDragon.io](mailto:support@OmniDragon.io)
