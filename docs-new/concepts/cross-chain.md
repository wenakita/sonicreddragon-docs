---
sidebar_position: 5
title: Cross-Chain Infrastructure
description: Comprehensive explanation of OmniDragon's cross-chain architecture
---

# Cross-Chain Infrastructure

The OmniDragon protocol implements a sophisticated cross-chain infrastructure that enables seamless operation across multiple blockchains. This document provides a comprehensive overview of the cross-chain architecture.

## System Overview

OmniDragon's cross-chain infrastructure allows the protocol to operate across multiple blockchains:

```mermaidgraph LR
    A[Source Chain] -->|> B[LayerZero]
    B| C[Destination Chain]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#059669,stroke:#047857,color:#fff
```

## LayerZero Integration

LayerZero provides the messaging infrastructure that makes cross-chain operations possible:
```

```mermaidgraph LR
    A[Source Chain] -->|> B[LayerZero]
    B| C[Destination Chain]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#059669,stroke:#047857,color:#fff
```

## Security Model

The cross-chain security model relies on multiple independent validation layers:

### Oracle Network Validation
-**Block Confirmation**: Oracles confirm transaction finality on the source chain
-**Cryptographic Proofs**: Mathematical verification of transaction validity
-**Decentralized Consensus**: Multiple oracles must agree on transaction state

### Relayer Network Delivery
-**Message Integrity**: Cryptographic signatures ensure message authenticity
-**Delivery Guarantees**: Economic incentives ensure reliable message delivery
-**Redundancy**: Multiple relayers provide backup delivery paths

### Smart Contract Validation
-**Payload Verification**: Destination contracts validate message contents
-**Replay Protection**: Nonce-based protection against duplicate transactions
-**Access Controls**: Only authorized contracts can mint/unlock tokens

## Supported Networks

OmniDragon currently supports the following blockchain networks:

| Network | Chain ID | Status | Features |
|---------|----------|--------|----------|
| Ethereum | 1 |  Live | Full functionality |
| Arbitrum | 42161 |  Live | Low fees, fast finality |
| Polygon | 137 |  Live | High throughput |
| Avalanche | 43114 | 🚧 Coming Soon | Sub-second finality |
| BSC | 56 | 🚧 Coming Soon | Low cost transactions |

## Gas Optimization

Cross-chain transfers are optimized for gas efficiency:

### Source Chain Costs
-**Token Operations**: Burn/lock operations (~50k gas)
-**LayerZero Message**: Message creation and sending (~100k gas)
-**Total Estimated**: ~150k gas on source chain

### Destination Chain Costs
-**Message Processing**: LayerZero message validation (~80k gas)
-**Token Operations**: Mint/unlock operations (~50k gas)
-**Total Estimated**: ~130k gas on destination chain

### Cost Comparison
Compared to traditional bridge solutions, OmniDragon offers:
-**50% lower gas costs**through optimized contract design
-**Faster finality**with LayerZero's efficient messaging
-**Better UX**with single-transaction cross-chain transfers

## Developer Integration

Integrating cross-chain functionality into your dApp:

```solidity
// Example: Cross-chain token transfer
interface IOmniDragon {
    function crossChainTransfer(
        uint16 dstChainId,
        address to,
        uint256 amount,
        bytes calldata adapterParams
    ) external payable;
}

// Usage in your contract
contract MyDApp {
    IOmniDragon public omniDragon;
    
    function transferToPolygon(address recipient, uint256 amount) external {
        // Transfer tokens to Polygon (chain ID 137)
        omniDragon.crossChainTransfer{value: msg.value}(
            137,           // Polygon chain ID
            recipient,     // Recipient address
            amount,        // Token amount
            ""            // Default adapter params
        );
    }
}
```

## Monitoring and Analytics

Track cross-chain transfers through:

-**LayerZero Scan**: Official LayerZero block explorer
-**OmniDragon Dashboard**: Real-time transfer monitoring
-**Chain-specific Explorers**: Etherscan, PolygonScan, etc.

## Best Practices

### For Users
1.**Verify Addresses**: Double-check recipient addresses on destination chains
2.**Gas Estimation**: Use the gas calculator for accurate fee estimates
3.**Network Status**: Check network congestion before large transfers

### For Developers
1.**Error Handling**: Implement robust error handling for failed transfers
2.**Gas Management**: Monitor and optimize gas usage patterns
3.**Testing**: Use testnets extensively before mainnet deployment

## Troubleshooting

Common issues and solutions:

### Transfer Stuck
-**Check LayerZero Scan**: Verify message status
-**Gas Price**: Ensure sufficient gas for destination execution
-**Network Congestion**: Wait for network conditions to improve

### High Gas Costs
-**Timing**: Transfer during low network activity
-**Batch Transfers**: Combine multiple transfers when possible
-**Alternative Routes**: Consider different chain combinations

### Failed Transfers
-**Insufficient Balance**: Verify token balance before transfer
-**Contract Limits**: Check for transfer limits or restrictions
-**Network Issues**: Verify both chains are operational

The cross-chain architecture ensures that OmniDragon tokens maintain their utility and value across all supported networks while providing users with the flexibility to operate on their preferred blockchain.

## Cross-Chain Jackpot

The jackpot system works across multiple chains:

### Cross-Chain Entry

Users can participate in the jackpot from any supported chain:

1.**Local Entry**: Buy transactions on the local chain create local entries
2.**Cross-Chain Entry**: Cross-chain transfers create entries on the destination chain
3.**Global Pool**: All chains contribute to a global jackpot pool
4.**Chain-Specific Pools**: Each chain also has a local jackpot pool

### Cross-Chain Distribution

When a jackpot is won, rewards can be distributed across chains:

1.**Local Distribution**: Winners on the local chain receive rewards directly
2.**Cross-Chain Distribution**: Winners on other chains receive rewards via the bridge
3.**Multi-Chain Winners**: Multiple winners can be selected across different chains

## Cross-Chain Governance

The governance system works across multiple chains:

### Governance Mechanism

Token holders can participate in governance from any supported chain:

1.**Proposal Creation**: Proposals can be created on the primary chain (Ethereum)
2.**Cross-Chain Voting**: Votes can be cast from any supported chain
3.**Vote Aggregation**: Votes are aggregated on the primary chain
4.**Execution**: Passed proposals are executed on all relevant chains

### Implementation

The cross-chain governance is implemented using LayerZero:

```solidity
function castVoteFromOtherChain(
    uint16 _srcChainId,
    bytes memory _srcAddress,
    uint64 _nonce,
    bytes memory _payload
) external {
    // Verify sender
    require(msg.sender == lzEndpoint, "Invalid endpoint");
    
    // Verify source address
    require(
        _srcAddress.length == trustedRemoteLookup[_srcChainId].length &&
        keccak256(_srcAddress) == keccak256(trustedRemoteLookup[_srcChainId]),
        "Invalid source address"
    );
    
    // Decode payload
    (address voter, uint256 proposalId, bool support, uint256 votingPower) = abi.decode(
        _payload,
        (address, uint256, bool, uint256)
    );
    
    // Cast vote
    _castVote(voter, proposalId, support, votingPower);
}
```

## Cross-Chain Fee Economics

The cross-chain infrastructure includes a fee mechanism:

### Fee Structure

Cross-chain transfers incur a small fee:

1.**Base Fee**: 0.69% fee on all cross-chain transfers
2.**LayerZero Fee**: Additional fee to cover the cost of the LayerZero message
3.**Destination Gas**: Fee to cover the cost of minting tokens on the destination chain

### Fee Distribution

The collected fees are distributed as follows:

1.**Jackpot Contribution**: A portion of fees goes to the jackpot vault
2.**Protocol Treasury**: A portion of fees goes to the protocol treasury
3.**LayerZero Payment**: A portion of fees covers the LayerZero message cost

## User Experience

From a user perspective, the cross-chain experience is designed to be seamless:

### Cross-Chain Transfer

Users can transfer tokens between chains with a simple interface:

1.**Chain Selection**: User selects the destination chain
2.**Amount Input**: User inputs the amount to transfer
3.**Fee Display**: User sees the fee breakdown
4.**Confirmation**: User confirms the transfer
5.**Status Tracking**: User can track the status of the transfer

### Cross-Chain Jackpot

Users can participate in the jackpot from any chain:

1.**Automatic Entry**: Buy transactions automatically qualify for jackpot entries
2.**Cross-Chain Wins**: Wins can occur on any chain
3.**Reward Distribution**: Rewards are distributed on the chain where the win occurred

## Integration with Other Components

The cross-chain infrastructure integrates with several other components of the OmniDragon ecosystem:

### Token Integration

The token contract integrates with the cross-chain bridge:

```solidity
function mint(address to, uint256 amount) external onlyBridge {
    _mint(to, amount);
}

function burnFrom(address account, uint256 amount) external onlyBridge {
    _burn(account, amount);
}
```

### Jackpot Integration

The jackpot system integrates with the cross-chain bridge:

```solidity
function addCrossChainJackpotEntry(
    address user,
    uint256 amount,
    uint16 srcChainId
) external onlyBridge {
    // Create jackpot entry for cross-chain transfer
    _createJackpotEntry(user, amount, srcChainId);
}
```

### Governance Integration

The governance system integrates with the cross-chain bridge:

```solidity
function castCrossChainVote(
    address voter,
    uint256 proposalId,
    bool support,
    uint256 votingPower,
    uint16 srcChainId
) external onlyBridge {
    // Cast vote from another chain
    _castVote(voter, proposalId, support, votingPower);
}
```

## Future Expansion

The cross-chain infrastructure is designed to be expandable:

### Additional Chains

Support for additional chains can be added:

1.**Contract Deployment**: Deploy the OmniDragon token on the new chain
2.**Bridge Configuration**: Configure the cross-chain bridge for the new chain
3.**LayerZero Integration**: Set up the LayerZero endpoint for the new chain
4.**Trusted Remote Configuration**: Configure trusted remote addresses

### Enhanced Functionality

Additional cross-chain functionality can be added:

1.**Cross-Chain Staking**: Stake tokens on one chain and earn rewards on another
2.**Cross-Chain Liquidity**: Provide liquidity on one chain and use it on another
3.**Cross-Chain Governance**: Create proposals on one chain and execute on another

## Conclusion

The OmniDragon cross-chain infrastructure provides a seamless experience for users across multiple blockchains. By leveraging LayerZero for secure cross-chain messaging, the protocol enables token transfers, jackpot participation, and governance across Ethereum, BNB Chain, Arbitrum, and Avalanche.

## Further Reading

- [Token System](/concepts/tokenomics): Detailed information about the token mechanics
- [Jackpot System](/concepts/jackpot-system-consolidated-system): Comprehensive documentation of the jackpot system
- [Governance System](/concepts/governance): In-depth documentation of the governance system
- [Security Model](/concepts/security-model): Comprehensive overview of the security architecture
