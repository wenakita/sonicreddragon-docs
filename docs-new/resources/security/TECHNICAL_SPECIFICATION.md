---
title: TECHNICAL_SPECIFICATION
sidebar_position: 1
description: Detailed explanation of this concept
---
# OmniDragon VRF System Technical Specification

## 1. Executive Summary

The OmniDragon VRF System is a cross-chain verifiable random function implementation that provides secure, unbiased randomness for blockchain applications. It combines multiple entropy sources (Chainlink VRF 2.5 and Drand beacon) with cross-chain messaging via LayerZero to deliver cost-effective randomness on the Sonic blockchain.

### Key Features
- Dual randomness sources: Chainlink VRF (premium) and Drand (free)
- Cross-chain architecture: Sonic (main) + Arbitrum (Chainlink VRF)
- High-frequency optimization: Bucket system with pre-generated numbers
- Cost optimization: Pool system for aggregated randomness
- Fallback mechanism: Automatic failover from Chainlink to Drand

## 2. System Architecture

### 2.1 Contract Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         SONIC BLOCKCHAIN                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────┐                      │
│  │   OmniDragonRandomnessProvider       │                      │
│  │   (Main Coordinator)                 │                      │
│  │   - Request routing                  │                      │
│  │   - Source selection                 │                      │
│  │   - Bucket management                │                      │
│  │   - Pool aggregation                 │                      │
│  └────────────┬────────────┬───────────┘                      │
│               │            │                                    │
│      ┌────────▼───┐  ┌────▼──────────┐                       │
│      │   Drand    │  │  Chainlink    │                       │
│      │ Integrator │  │  Integrator   │◄───────┐              │
│      └────────────┘  └───────────────┘        │              │
│                                                │              │
└────────────────────────────────────────────────┼──────────────┘
                                                 │
                                          LayerZero Protocol
                                                 │
┌────────────────────────────────────────────────┼──────────────┐
│                         ARBITRUM                │              │
├─────────────────────────────────────────────────┼──────────────┤
│                                                │              │
│                           ┌─────────────────────▼─────┐       │
│                           │ OmniDragonVRFRequester    │       │
│                           │ - Chainlink VRF 2.5       │       │
│                           │ - Cross-chain messaging   │       │
│                           └───────────────────────────┘       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### 2.2 Contract Addresses and Configuration

#### Sonic Mainnet
-**Chain ID**: 146
-**LayerZero Endpoint**: `0x6F475642a6e85809B1c36Fa62763669b1b48DD5B`
-**LayerZero Chain ID**: 332

#### Arbitrum Mainnet
-**Chain ID**: 42161
-**LayerZero Endpoint**: `0x1a44076050125825900e736c501f859c50fE728c`
-**VRF Coordinator**: `0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e`
-**Subscription ID**: `65914062761074472397678945586748169687979388122746586980459153805795126649565`

## 3. Core Components

### 3.1 OmniDragonRandomnessProvider (Sonic)**Purpose**: Central coordinator for all randomness requests on Sonic.**Key Functions**:
```solidity
function requestRandomness(uint256 _type) external returns (uint256 requestId)
function requestRandomnessForContract(address _consumer) external returns (uint256 requestId)
function getRandomnessFromBucket() external returns (uint256)
function getAggregatedRandomness(uint256 _count, uint256 _entropy) external returns (uint256)
```**State Variables**:
- `mapping(VRFSource => VRFSourceConfig) public vrfSources`
- `mapping(uint256 => RandomnessRequest) public requests`
- `uint256[1000] private randomnessBucket`
- `uint256[100] private randomnessPool`**Security Features**:
- ReentrancyGuard on all external functions
- Authorized consumer whitelist
- Emergency pause mechanism
- Request timeout (24 hours)

### 3.2 DrandVRFIntegrator (Sonic)**Purpose**: Integrates multiple Drand beacon networks for free randomness.**Key Functions**:
```solidity
function requestRandomness(address consumer) external returns (uint256)
function fulfillRandomness(uint256 requestId, uint256 randomness) external
function verifyDrandBeacon(uint256 round, bytes memory signature) public view returns (bool)
```**Drand Networks**:
- League of Entropy (Mainnet)
- Quicknet (Fast beacon)
- EVMnet (EVM-optimized)**Security Considerations**:
- BLS signature verification
- Multi-network aggregation for enhanced security
- No external dependencies for basic operation

### 3.3 ChainlinkVRFIntegrator (Sonic)**Purpose**: Bridges Chainlink VRF requests from Sonic to Arbitrum via LayerZero.**Key Functions**:
```solidity
function requestRandomness(address consumer) external payable returns (uint256)
function lzReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload) external
function estimateFee() public view returns (uint256)
```**Cross-Chain Flow**:
1. Request initiated on Sonic
2. Message sent via LayerZero to Arbitrum
3. VRF request made on Arbitrum
4. Result sent back via LayerZero
5. Randomness fulfilled on Sonic

### 3.4 OmniDragonVRFRequester (Arbitrum)**Purpose**: Interfaces with Chainlink VRF 2.5 on Arbitrum.**Key Functions**:
```solidity
function requestRandomWords() external returns (uint256)
function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override
function sendRandomnessToSonic(uint256 requestId, uint256 randomness) internal
```**Chainlink VRF Configuration**:
- Confirmation blocks: 3
- Callback gas limit: 500,000
- Number of words: 1

## 4. Randomness Sources

### 4.1 Chainlink VRF 2.5
-**Security**: Cryptographically secure, verifiable on-chain
-**Cost**: ~$3-5 per request (LINK tokens)
-**Latency**: 3-5 blocks + cross-chain messaging
-**Use Case**: High-value operations, lotteries

### 4.2 Drand Beacon
-**Security**: Distributed randomness beacon, BLS threshold signatures
-**Cost**: Free (only gas costs)
-**Latency**: Near-instant (30 second rounds)
-**Use Case**: High-frequency, low-value operations

## 5. Optimization Mechanisms

### 5.1 Bucket System
- Pre-generates 1000 random numbers
- Instant access for high-frequency operations
- Automatic refill when depleted
- Gas cost: ~50,000 per access

### 5.2 Pool System
- Aggregates randomness from multiple sources
- Weighted mixing (40% mainnet, 30% quicknet, 30% evmnet)
- Enhanced unpredictability
- Cost-effective for batch operations

## 6. Security Model

### 6.1 Access Control
```solidity
modifier onlyAuthorizedConsumer() {
    require(authorizedConsumers[msg.sender], "Unauthorized consumer");
    _;
}

modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}
```

### 6.2 Request Validation
- Nonce-based replay protection
- Request timeout mechanism
- Consumer balance checks
- Cross-chain message verification

### 6.3 Randomness Security
- No on-chain predictability
- Multiple entropy sources
- Commit-reveal pattern for sensitive operations
- Front-running protection via request IDs

## 7. Gas Optimization

### 7.1 Storage Patterns
- Packed structs for requests
- Efficient mapping usage
- Minimal storage updates

### 7.2 Function Optimization
- View functions for read operations
- Batch operations where possible
- Event emission for off-chain tracking

## 8. Cross-Chain Security

### 8.1 LayerZero Integration
- Trusted remote configuration
- Message authentication
- Replay protection via nonces
- Gas estimation for cross-chain calls

### 8.2 Message Validation
```solidity
require(_srcChainId == SOURCE_CHAIN_ID, "Invalid source chain");
require(keccak256(_srcAddress) == keccak256(trustedRemote), "Invalid source");
```

## 9. Failure Scenarios and Mitigations

### 9.1 Chainlink VRF Failure
-**Scenario**: Arbitrum network congestion or VRF unavailable
-**Mitigation**: Automatic fallback to Drand after timeout

### 9.2 LayerZero Message Failure
-**Scenario**: Cross-chain message not delivered
-**Mitigation**: Retry mechanism, manual recovery function

### 9.3 Drand Network Failure
-**Scenario**: One or more Drand networks offline
-**Mitigation**: Multi-network redundancy, weight redistribution

## 10. External Dependencies

### 10.1 Libraries
- OpenZeppelin Contracts 4.9.0
- LayerZero Solidity Examples
- Chainlink Contracts

### 10.2 External Services
- Chainlink VRF v2.5
- LayerZero Protocol
- Drand HTTP/HTTPS APIs

## 11. Known Limitations

1.**Cross-chain latency**: Chainlink requests take 1-2 minutes
2.**Gas costs**: Cross-chain messaging adds overhead
3.**Centralization points**: Owner privileges, trusted remotes
4.**Subscription management**: Manual LINK token management

## 12. Testing Coverage

- Unit tests: 85% coverage
- Integration tests: Cross-chain scenarios
- Fuzzing: Input validation
- Gas profiling: Optimization verification

## 13. Upgrade Path

The system uses a modular architecture allowing:
- Individual component upgrades
- New VRF source additions
- Configuration updates without migration

## 14. Audit Focus Areas

### Critical
1. Randomness manipulation vulnerabilities
2. Cross-chain message authentication
3. Reentrancy in payment functions
4. Integer overflow in aggregation

### High
1. Access control bypass
2. Request/fulfillment matching
3. Gas griefing attacks
4. Front-running vulnerabilities

### Medium
1. Centralization risks
2. Upgrade mechanism security
3. Event emission completeness
4. Error handling consistency

## Appendix A: Contract Interfaces

[Detailed interface definitions for all contracts]

## Appendix B: Deployment Instructions

[Step-by-step deployment and configuration guide]

## Appendix C: Emergency Procedures

[Incident response and recovery procedures] 
