---
sidebar_position: 1
title: Vrf Consumer
description: Detailed explanation of this concept
---

# OmniDragonVRFConsumer

The `OmniDragonVRFConsumer` is a sophisticated randomness aggregator contract that combines multiple independent randomness sources for enhanced security and reliability.

## Overview

This contract serves as the central hub of the OmniDragon randomness system, connecting to multiple randomness sources and providing a unified interface for consumer applications:

```mermaid
flowchart TB
subgraph "External Sources"
    s1["dRAND Network"]
    s2["Chainlink VRF"]
    s3["Arbitrum VRF"]
    s4["EVMnet"]
    s5["Quicknet"]
    subgraph "Integrators"
    i1["dRAND Integrator"]
    i2["Chainlink Integrator"]
    i3["Arbitrum Integrator"]
    i4["EVMnet Integrator"]
    i5["Quicknet Integrator"]
    subgraph "OmniDragonVRFConsumer"
    Buffer["Randomness Buffers"]
    Aggregator["Aggregation Logic"]
    Security["Security Controls"]
    Interface["Consumer Interface"]
    subgraph "Consumer Applications"
    c1["Jackpot System"]
    c2["Games"]
    c3["Governance"]
    s1 -->|> i1
    s2| i2
    s3 -->|> i3
    s4| i4
    s5 -->|> i5
    i1| Buffer
    i2 -->|> Buffer
    i3| Buffer
    i4 -->|> Buffer
    i5| Buffer
    Buffer -->|> Aggregator
    Aggregator| Interface
    Security -->|> Interface
    Interface| c1
    Interface -->|> c2
    end    Interface| c3    endclass Aggregator primary    end
endend
endend
end
```

## Key Features

-**Multi-Source Aggregation**: Combines randomness from multiple independent sources
-**Weighted Combination**: Assigns configurable weights to each source
-**Randomness Buffering**: Maintains buffers of recent values for enhanced unpredictability
-**Fault Tolerance**: Continues functioning even if some sources are unavailable
-**Access Controls**: Restricts randomness requests to authorized consumers
-**Request/Response Pattern**: Uses an asynchronous request/response pattern

## Contract Implementation

The core functionality of the OmniDragonVRFConsumer is implemented as follows:

```solidity
// Network tracking
struct NetworkInfo {
    address integrator;
    bool active;
    uint256 weight;
    uint256 lastUpdate;
    uint256 lastValue;
    uint256 lastRound;
}

// Network storage
mapping(bytes32 => NetworkInfo) public networks;
bytes32[] public networkIds;

// Randomness state
uint256 public aggregatedRandomness;
uint256 public lastAggregationTimestamp;
uint256 public aggregationCounter;

// Consumer tracking
mapping(address => bool) public authorizedConsumers;
```

## Network Management

The contract allows adding, updating, and removing randomness sources:

```solidity
/***@dev Add a new drand network
 * @param _networkId The unique identifier for this network
 * @param _integrator The integrator contract address
 * @param _weight The weight to give this network in aggregation
 */
function addNetwork(bytes32 _networkId, address _integrator, uint256 _weight) external onlyOwner {
    require(_integrator != address(0), "Invalid integrator address");
    require(networks[_networkId].integrator == address(0), "Network already exists");
    
    networks[_networkId] = NetworkInfo({
        integrator: _integrator,
        active: true,
        weight: _weight,
        lastUpdate: 0,
        lastValue: 0,
        lastRound: 0
    });
    
    networkIds.push(_networkId);
    
    emit NetworkAdded(_networkId, _integrator, _weight);
}
```

## Randomness Aggregation

The core aggregation logic combines values from multiple sources:

```solidity
/***@dev Aggregate randomness from all active networks
 */
function aggregateRandomness() public {
    require(networkIds.length > 0, "No networks configured");
    
    // Seed with previous value
    uint256 randomSeed = aggregatedRandomness;
    uint256 totalWeight = 0;
    uint256 activeNetworks = 0;
    
    // Go through each network
    for (uint256 i = 0; i < networkIds.length; i++) {
        NetworkInfo storage network = networks[networkIds[i]];
        
        if (!network.active) continue;
        
        try IDragonVRFIntegrator(network.integrator).getLatestRandomness() returns (uint256 randomness, uint256 round) {
            // Only use if this is new randomness
            if (round > network.lastRound) {
                // Apply weighted randomness
                randomSeed = uint256(keccak256(abi.encodePacked(
                    randomSeed, 
                    randomness, 
                    round, 
                    network.weight
                )));
                
                // Update network info
                network.lastValue = randomness;
                network.lastRound = round;
                network.lastUpdate = block.timestamp;
                
                totalWeight += network.weight;
                activeNetworks++;
            }
        } catch {
            // Skip networks that fail
        }
    }
    
    // Only update if we processed at least one active network
    if (activeNetworks > 0) {
        // Final pass by mixing with a counter to ensure uniqueness even with the same inputs
        aggregationCounter++;
        aggregatedRandomness = uint256(keccak256(abi.encodePacked(
            randomSeed, 
            block.timestamp, 
            block.difficulty, 
            totalWeight,
            aggregationCounter
        )));
        
        lastAggregationTimestamp = block.timestamp;
        
        emit RandomnessAggregated(block.timestamp, aggregatedRandomness);
    }
}
```

## Consumer Interface

Consumer contracts interact with the OmniDragonVRFConsumer using this interface:

```solidity
/***@dev Request randomness (helper function for consumers)
 * @param _consumer The consumer address
 */
function requestRandomness(address _consumer) external override returns (uint256) {
    require(authorizedConsumers[_consumer], "Consumer not authorized");
    
    uint256 requestId = uint256(keccak256(abi.encodePacked(
        _consumer,
        blockhash(block.number - 1),
        aggregationCounter,
        block.timestamp
    )));
    
    emit RandomnessRequested(_consumer, requestId);
    
    // Try to fulfill immediately
    try this.fulfillRandomness(_consumer, requestId) {
        // Succeeded
    } catch {
        // Will need to be fulfilled later
    }
    
    return requestId;
}
```

## Fulfillment Logic

The contract fulfills randomness requests using this function:

```solidity
/***@dev Fulfill a randomness request for a consumer
 * @param _consumer The consumer address
 * @param _requestId The ID of the request
 */
function fulfillRandomness(address _consumer, uint256 _requestId) external override nonReentrant {
    require(msg.sender == owner() || authorizedConsumers[msg.sender], "Not authorized");
    
    // Aggregate if it's been a while since last update
    if (block.timestamp - lastAggregationTimestamp > 30) {
        aggregateRandomness();
    }
    
    // Derive unique randomness for this request
    uint256 uniqueRandomness = uint256(keccak256(abi.encodePacked(
        aggregatedRandomness,
        _consumer,
        _requestId,
        block.timestamp
    )));
    
    // Send it to the consumer
    try IDragonVRFConsumer(_consumer).fulfillRandomness(_requestId, uniqueRandomness, aggregationCounter) {
        emit RandomnessFulfilled(_consumer, _requestId, uniqueRandomness);
    } catch {
        // Ignore failures
    }
}
```

## Security Features

The OmniDragonVRFConsumer implements several security measures:

1.**Access Control**: Only authorized consumers can request randomness
   ```solidity
   function setAuthorizedConsumer(address _consumer, bool _authorized) external onlyOwner {
       authorizedConsumers[_consumer] = _authorized;
       emit ConsumerAuthorized(_consumer, _authorized);
   }
   ```

2.**Reentrancy Protection**: Uses ReentrancyGuard to prevent reentrant calls
   ```solidity
   function fulfillRandomness(address _consumer, uint256 _requestId) external override nonReentrant {
       // Implementation
   }
   ```

3.**Error Handling**: Gracefully handles failures from external contracts
   ```solidity
   try IDragonVRFIntegrator(network.integrator).getLatestRandomness() returns (uint256 randomness, uint256 round) {
       // Success handling
   } catch {
       // Skip networks that fail
   }
   ```

4.**Uniqueness Guarantee**: Uses a monotonically increasing counter to ensure uniqueness
   ```solidity
   aggregationCounter++;
   aggregatedRandomness = uint256(keccak256(abi.encodePacked(
       randomSeed, 
       block.timestamp, 
       block.difficulty, 
       totalWeight,
       aggregationCounter
   )));
   ```

## Events

The contract emits the following events:

```solidity
// Network management events
event NetworkAdded(bytes32 indexed networkId, address integrator, uint256 weight);
event NetworkUpdated(bytes32 indexed networkId, address integrator, uint256 weight, bool active);
event NetworkRemoved(bytes32 indexed networkId);

// Randomness events
event RandomnessAggregated(uint256 timestamp, uint256 value);
event ConsumerAuthorized(address consumer, bool authorized);
event RandomnessRequested(address consumer, uint256 requestId);
event RandomnessFulfilled(address consumer, uint256 requestId, uint256 randomness);
```

## Consumer Integration

To integrate with the OmniDragonVRFConsumer, contracts should implement this interface:

```solidity
interface IDragonVRFConsumer {
    function fulfillRandomness(uint256 requestId, uint256 randomness, uint256 round) external;
}
```

## Usage Example

Here's how a consumer contract would use the OmniDragonVRFConsumer:

```solidity
// Consumer contract that uses OmniDragonVRFConsumer
contract RandomnessConsumer is IDragonVRFConsumer {
    IOmniDragonVRFConsumer public omniConsumer;
    
    mapping(uint256 => bool) public pendingRequests;
    uint256 public lastRandomValue;
    
    constructor(address _omniConsumer) {
        omniConsumer = IOmniDragonVRFConsumer(_omniConsumer);
    }
    
    // Request randomness
    function getRandomNumber() external returns (uint256) {
        uint256 requestId = omniConsumer.requestRandomness(address(this));
        pendingRequests[requestId] = true;
        return requestId;
    }
    
    // Called by the OmniDragonVRFConsumer to fulfill the randomness request
    function fulfillRandomness(uint256 requestId, uint256 randomness, uint256 round) external override {
        require(msg.sender == address(omniConsumer), "Only OmniConsumer can fulfill");
        require(pendingRequests[requestId], "Request not found");
        
        lastRandomValue = randomness;
        delete pendingRequests[requestId];
        
        // Use the randomness value
        // ...
    }
}
``` 
