---
sidebar_position: 1
title: dRand Integration
description: Detailed explanation of this concept
---

# dRand Network Integration

OmniDragon integrates with the [dRand Network](https://drand.love/) to provide cryptographically verifiable randomness for its jackpot system and other randomized mechanics. This integration ensures that all random processes in the OmniDragon ecosystem are provably fair and tamper-resistant.

## What is dRand?

dRand is a distributed randomness beacon protocol that generates verifiable, unpredictable, and unbiasable random values. Key features include:

-**Decentralized**: Operated by a distributed set of nodes across different organizations
-**Verifiable**: Anyone can verify the correctness of generated random values
-**Unpredictable**: Random values cannot be predicted in advance
-**Unbiasable**: No single party can bias the randomness generation process
-**Efficient**: Uses threshold cryptography for efficient randomness generation

## OmniDragon's dRand Implementation

```mermaid
graph LR
    A[Input] -->|> B[Process]| C[Output]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#059669,stroke:#047857,color:#fff
```

## Backup Randomness Sources

To ensure high availability, OmniDragon implements backup randomness sources:

1.**Primary**: dRand Network
2.**Secondary**: Chainlink VRF
3.**Fallback**: Block hash-based randomness (only in emergency)

The system automatically switches to secondary sources if the primary source fails to deliver randomness within a specified timeframe.

## Integration Example

Here's an example of how to request randomness from the OmniDragon VRF system:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@OmniDragon/contracts/interfaces/IOmniDragonVRFConsumer.sol";
import "@OmniDragon/contracts/interfaces/IDragonVRFConsumer.sol";

contract RandomnessExample is IDragonVRFConsumer {
    IOmniDragonVRFConsumer public vrfConsumer;
    uint256 public randomResult;
    bool public randomnessReceived;
    
    constructor(address _vrfConsumerAddress) {
        vrfConsumer = IOmniDragonVRFConsumer(_vrfConsumerAddress);
    }
    
    // Request randomness
    function requestRandomNumber() external {
        vrfConsumer.requestRandomness(address(this));
        randomnessReceived = false;
    }
    
    // Receive randomness from VRF consumer
    function consumeRandomness(uint256 requestId, uint256 randomness) 
        external override {
        require(msg.sender == address(vrfConsumer), "Unauthorized");
        
        randomResult = randomness;
        randomnessReceived = true;
        
        // Use the randomness (e.g., select winner, determine outcome)
    }
    
    // Example: Select a winner using randomness
    function selectWinner(address[] memory participants) 
        external view returns (address) {
        require(randomnessReceived, "No randomness available");
        
        uint256 winnerIndex = randomResult % participants.length;
        return participants[winnerIndex];
    }
}
```

## Security Considerations

When using OmniDragon's dRand integration:

1.**Verification**: Always verify that randomness comes from the authorized VRF consumer
2.**Freshness**: Check that the randomness is from a recent dRand round
3.**Public Inputs**: Never rely on user-provided inputs for randomness generation
4.**Multiple Sources**: For critical applications, consider using multiple sources of randomness

## Additional Resources

- [dRand Network Documentation](https://drand.love/docs/)
- [League of Entropy](https://leagueofentropy.com/) (dRand operators)
- [OmniDragon dRand Setup Guide](/partner/case-studies/drand)
- [OmniDragon dRand Usage Examples](/partner/case-studies/drand)
