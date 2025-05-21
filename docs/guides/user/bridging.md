---
sidebar_position: 2
---

# Bridging DRAGON Tokens

This guide explains how to transfer your DRAGON tokens between different blockchain networks using Sonic Red Dragon's built-in cross-chain functionality.

## Overview

DRAGON tokens can be transferred seamlessly between all supported blockchains using the LayerZero V2 messaging protocol. The bridging process uses a burn-and-mint model, where tokens are burned on the source chain and minted on the destination chain, ensuring that the total supply remains constant across all chains.

## Supported Networks

You can bridge DRAGON tokens between the following networks:

| Network | Chain ID | Status |
|---------|----------|--------|
| Ethereum | 101 | Active |
| BNB Chain | 102 | Active |
| Sonic | 332 | Active |
| Arbitrum | 110 | Active |
| Base | 184 | Active |
| Optimism | 111 | Coming Soon |
| Polygon | 109 | Coming Soon |

## Prerequisites

Before bridging your DRAGON tokens, make sure you have:

1. **DRAGON Tokens**: Sufficient DRAGON tokens on the source chain
2. **Native Gas Token**: Enough native tokens (ETH, BNB, AVAX, etc.) to pay for gas fees on the source chain
3. **Wallet Setup**: Your wallet connected to both the source and destination chains

## Step-by-Step Bridging Guide

### Method 1: Using the Official Sonic Red Dragon Bridge

The recommended way to bridge DRAGON tokens is through the official bridge interface at [bridge.sonicreddragon.io](https://bridge.sonicreddragon.io).

1. **Connect Your Wallet**
   - Visit [bridge.sonicreddragon.io](https://bridge.sonicreddragon.io)
   - Click "Connect Wallet" and select your wallet provider
   - Ensure your wallet is connected to the source chain

2. **Select Source and Destination Chains**
   - In the "From" dropdown, select the source chain where your tokens are currently located
   - In the "To" dropdown, select the destination chain where you want to send your tokens

3. **Enter Amount**
   - Enter the amount of DRAGON tokens you want to bridge
   - The interface will display the estimated fees and the amount you'll receive on the destination chain

4. **Review and Confirm**
   - Review the transaction details, including:
     - Amount to bridge
     - Destination chain
     - Estimated gas fees
     - Estimated time to completion
   - Click "Bridge Tokens" to proceed

5. **Approve Tokens (First-time Only)**
   - If this is your first time bridging, you'll need to approve the bridge contract to spend your DRAGON tokens
   - Confirm the approval transaction in your wallet

6. **Confirm Bridge Transaction**
   - Confirm the bridge transaction in your wallet
   - Make sure you have enough native tokens to cover the gas fees

7. **Wait for Confirmation**
   - The bridge will show a progress indicator while the transaction is being processed
   - This typically takes 10-15 minutes depending on network congestion
   - You'll receive a notification once the tokens are available on the destination chain

8. **Switch Network and Verify**
   - Switch your wallet to the destination chain
   - Verify that you've received the DRAGON tokens in your wallet

### Method 2: Using the Smart Contract Directly

Advanced users can interact directly with the OmniDragon contract to bridge tokens.

1. **Get the OmniDragon Contract Address**
   - Find the contract address for your current chain in the [Contract Addresses](/reference/addresses/mainnet) section

2. **Connect to the Contract**
   - Use a blockchain explorer (like Etherscan) or a wallet with dApp browser to connect to the OmniDragon contract
   - Look for the `sendTokensToChain` function

3. **Prepare the Transaction Parameters**
   - Destination Chain ID: The LayerZero chain ID for the destination chain
   - Recipient Address: Your wallet address (converted to bytes)
   - Amount: The amount of DRAGON tokens to bridge
   - Refund Address: Your address to receive any excess gas fees
   - ZRO Payment Address: Usually address(0)
   - Adapter Parameters: Usually empty bytes

4. **Estimate Gas Fees**
   - Call the `estimateSendFee` function to get the required native token amount for gas
   ```solidity
   (uint256 nativeFee, ) = dragonToken.estimateSendFee(
       destinationChainId,
       abi.encodePacked(recipient),
       amount,
       false,
       bytes("")
   );
   ```

5. **Execute the Bridge Transaction**
   - Call the `sendTokensToChain` function with the required parameters and gas fee
   ```solidity
   dragonToken.sendTokensToChain{value: nativeFee}(
       destinationChainId,
       abi.encodePacked(recipient),
       amount,
       refundAddress,
       address(0),
       bytes("")
   );
   ```

6. **Switch Networks and Verify**
   - Switch to the destination chain and verify that you received the tokens

## Bridge Fees

When bridging DRAGON tokens, there are two types of fees to consider:

1. **Native Gas Fees**: These are paid in the native token of the source chain and cover:
   - Gas cost on the source chain
   - LayerZero messaging fees
   - Gas cost on the destination chain
   
2. **Protocol Fees**: Some chains may have additional protocol fees for bridging (if enabled):
   - These fees contribute to the Sonic Red Dragon ecosystem
   - The fee percentage is typically 0.1-0.5% depending on the chain

## Troubleshooting

### Transaction Stuck or Pending

If your bridge transaction is stuck or pending for an extended period:

1. **Check Transaction Status**
   - Use a block explorer to check the status of your transaction on the source chain
   - If it's still pending after 30 minutes, it may be due to low gas price

2. **Check Bridge Status**
   - Visit the [Bridge Status Page](https://status.sonicreddragon.io) to see if there are any known issues

3. **Verify on Destination Chain**
   - Even if the UI doesn't update, your tokens might have arrived
   - Check your balance on the destination chain using a block explorer

4. **Contact Support**
   - If you're still experiencing issues, contact support through:
     - Discord: [discord.gg/w75vaxDXuE](https://discord.gg/w75vaxDXuE)
     - Telegram: [@sonic_reddragon_support](https://t.me/sonic_reddragon_support)

### Failed Transaction

If your transaction fails:

1. **Insufficient Gas**: Make sure you have enough native tokens for gas
2. **Slippage or Price Impact**: Try reducing the amount you're bridging
3. **Network Congestion**: Try again when the network is less congested

## Security Tips

To ensure safe bridging of your DRAGON tokens:

1. **Double-Check Addresses**: Always verify the contract addresses you're interacting with
2. **Start Small**: For your first bridge transaction, start with a small amount
3. **Use Official Interfaces**: Always use the official Sonic Red Dragon bridge interface
4. **Check Gas Fees**: Be aware of high gas fees during network congestion
5. **Verify Destination Chain**: Make sure your wallet is properly configured for the destination chain

## FAQ

### How long does bridging take?

Typically 10-15 minutes, but can be longer during periods of network congestion.

### Is there a minimum amount I can bridge?

Yes, the minimum amount is 10 DRAGON tokens to ensure it's economically viable considering gas fees.

### Can I bridge to any wallet address?

Yes, you can bridge to any valid wallet address on the destination chain, including exchanges that support direct deposits of DRAGON tokens.

### What happens if I bridge to the wrong chain?

The transaction will fail if the destination chain is not supported. If you intended to bridge to a different supported chain, you'll need to bridge again from your current chain to the correct destination.

### Are there any limits on how much I can bridge?

There are no hard limits, but very large transfers might be subject to additional verification to prevent potential exploits.

## Video Tutorial

<iframe width="100%" height="400" src="https://www.youtube.com/embed/example-video-id" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*Coming soon...*
