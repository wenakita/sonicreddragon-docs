# OmniDragon Core Contract

The `OmniDragon.sol` contract is the central coordinator of the OmniDragon VRF system, managing randomness requests, coordinating between different randomness sources, and handling cross-chain operations.

## Overview

The OmniDragon core contract serves as the primary interface for applications requesting verifiable randomness. It integrates multiple randomness sources (Drand and Chainlink VRF) and provides a unified API for consumers while optimizing costs through intelligent batching and routing.

## Contract Details

- **Location**: `contracts/core/OmniDragon.sol`
- **Network**: Sonic Mainnet (Chain ID: 146)
- **Inheritance**: `Ownable`, `ReentrancyGuard`, `IOmniDragon`

## Key Features

### 🎲 Dual Randomness Sources
- **Primary**: Drand beacon network (fast, 3-second rounds)
- **Secondary**: Chainlink VRF via cross-chain messaging
- **Automatic Failover**: Switches sources based on availability and cost

### ⚡ Cost Optimization
- **Bucket System**: Batches multiple requests for efficiency
- **Dynamic Pricing**: Adjusts fees based on network conditions
- **Gas Optimization**: Minimizes transaction costs

### 🔒 Security Features
- **Reentrancy Protection**: Prevents recursive calls
- **Access Control**: Role-based permissions
- **Request Validation**: Comprehensive input validation

## Interface

### Core Functions

#### `requestRandomness()`

Requests verifiable randomness from the system.

```solidity
function requestRandomness() external payable returns (uint256 requestId);
```

**Parameters**: None (payment sent as `msg.value`)

**Returns**: `uint256 requestId` - Unique identifier for the request

**Events**: 
- `RandomnessRequested(address indexed requester, uint256 indexed requestId, uint256 payment)`

**Requirements**:
- Must include sufficient payment for VRF fees
- Caller must be a valid contract or EOA
- System must not be paused

**Example Usage**:
```solidity
contract MyGame {
    IOmniDragon public omniDragon;
    
    function playGame() external payable {
        require(msg.value >= 0.01 ether, "Insufficient payment");
        
        uint256 requestId = omniDragon.requestRandomness{
            value: msg.value
        }();
        
        // Store requestId for callback
        pendingRequests[requestId] = msg.sender;
    }
}
```

#### `fulfillRandomness()`

Callback function called by the system to deliver randomness.

```solidity
function fulfillRandomness(uint256 requestId, uint256 randomness) external;
```

**Parameters**:
- `requestId`: The original request identifier
- `randomness`: The generated random number

**Access**: Only callable by the OmniDragon system

**Implementation Required**: Consumer contracts must implement this function

**Example Implementation**:
```solidity
function fulfillRandomness(uint256 requestId, uint256 randomness) external override {
    require(msg.sender == address(omniDragon), "Unauthorized");
    
    address player = pendingRequests[requestId];
    require(player != address(0), "Invalid request");
    
    // Use randomness for game logic
    uint256 outcome = randomness % 100;
    if (outcome < 50) {
        // Player wins
        payouts[player] += betAmounts[requestId] * 2;
    }
    
    delete pendingRequests[requestId];
    delete betAmounts[requestId];
}
```

### Administrative Functions

#### `setRandomnessSource()`

Updates the primary randomness source configuration.

```solidity
function setRandomnessSource(
    RandomnessSource source,
    bool enabled
) external onlyOwner;
```

#### `updateFeeStructure()`

Modifies the fee structure for randomness requests.

```solidity
function updateFeeStructure(
    uint256 baseFee,
    uint256 vrfFee,
    uint256 crossChainFee
) external onlyOwner;
```

#### `emergencyPause()`

Pauses the system in case of emergency.

```solidity
function emergencyPause() external onlyOwner;
```

## Randomness Sources

### Drand Integration

The primary randomness source uses the Drand beacon network:

```solidity
struct DrandConfig {
    string chainHash;
    uint256 period;
    uint256 genesisTime;
    address verifier;
}
```

**Advantages**:
- Fast delivery (~3 seconds)
- Lower cost
- Distributed trust model
- Continuous availability

**Process**:
1. Fetch latest beacon from Drand network
2. Verify cryptographic proof on-chain
3. Extract randomness value
4. Deliver to requesting contract

### Chainlink VRF Integration

The secondary source uses Chainlink VRF via cross-chain messaging:

```solidity
struct ChainlinkConfig {
    uint16 chainId;
    address vrfCoordinator;
    uint64 subscriptionId;
    bytes32 keyHash;
    uint32 callbackGasLimit;
}
```

**Advantages**:
- Industry-standard verification
- High security guarantees
- Proven track record
- Regulatory compliance

**Process**:
1. Send cross-chain request via LayerZero
2. Execute VRF request on Arbitrum
3. Receive VRF response
4. Relay back to Sonic via LayerZero
5. Deliver to requesting contract

## Cost Structure

### Fee Components

| Component | Amount | Description |
|-----------|--------|-------------|
| Base Fee | 0.001 S | Minimum processing fee |
| Drand Fee | 0.002 S | Drand verification cost |
| VRF Fee | 0.005 ETH | Chainlink VRF cost (cross-chain) |
| LayerZero Fee | ~0.01 S | Cross-chain messaging |

### Dynamic Pricing

Fees adjust based on:
- Network congestion
- Randomness source availability
- Request volume
- Gas prices

```solidity
function calculateFee(RandomnessSource source) public view returns (uint256) {
    uint256 baseFee = getBaseFee();
    uint256 sourceFee = getSourceFee(source);
    uint256 congestionMultiplier = getCongestionMultiplier();
    
    return (baseFee + sourceFee) * congestionMultiplier / 100;
}
```

## Security Considerations

### Reentrancy Protection

All external calls are protected against reentrancy:

```solidity
modifier nonReentrant() {
    require(!_locked, "ReentrancyGuard: reentrant call");
    _locked = true;
    _;
    _locked = false;
}
```

### Access Control

Critical functions use role-based access control:

```solidity
modifier onlyAuthorized() {
    require(
        hasRole(ADMIN_ROLE, msg.sender) || 
        hasRole(OPERATOR_ROLE, msg.sender),
        "Unauthorized"
    );
    _;
}
```

### Request Validation

All requests undergo comprehensive validation:

```solidity
function _validateRequest(address requester, uint256 payment) internal view {
    require(requester != address(0), "Invalid requester");
    require(payment >= getMinimumFee(), "Insufficient payment");
    require(!paused(), "System paused");
    require(_isValidConsumer(requester), "Invalid consumer");
}
```

### Randomness Verification

All randomness sources are cryptographically verified:

```solidity
function _verifyDrandBeacon(
    bytes memory beacon,
    bytes memory proof
) internal view returns (bool) {
    return drandVerifier.verify(beacon, proof, drandConfig.chainHash);
}
```

## Events

### RandomnessRequested

Emitted when randomness is requested:

```solidity
event RandomnessRequested(
    address indexed requester,
    uint256 indexed requestId,
    uint256 payment,
    RandomnessSource source
);
```

### RandomnessFulfilled

Emitted when randomness is delivered:

```solidity
event RandomnessFulfilled(
    address indexed requester,
    uint256 indexed requestId,
    uint256 randomness,
    RandomnessSource source
);
```

### SourceSwitched

Emitted when randomness source changes:

```solidity
event SourceSwitched(
    RandomnessSource from,
    RandomnessSource to,
    string reason
);
```

## Error Handling

### Custom Errors

```solidity
error InsufficientPayment(uint256 required, uint256 provided);
error InvalidRandomnessSource(RandomnessSource source);
error RequestExpired(uint256 requestId, uint256 timestamp);
error UnauthorizedCaller(address caller);
error SystemPaused();
```

### Failure Recovery

The system includes automatic recovery mechanisms:

1. **Source Failover**: Automatically switches to backup source
2. **Request Retry**: Retries failed requests up to 3 times
3. **Refund Mechanism**: Refunds payments for failed requests

## Integration Examples

### Basic Gaming Contract

```solidity
contract SimpleGame is IOmniDragonConsumer {
    IOmniDragon public immutable omniDragon;
    
    mapping(uint256 => address) public players;
    mapping(address => uint256) public winnings;
    
    constructor(address _omniDragon) {
        omniDragon = IOmniDragon(_omniDragon);
    }
    
    function playGame() external payable {
        require(msg.value >= 0.01 ether, "Minimum bet required");
        
        uint256 requestId = omniDragon.requestRandomness{
            value: 0.005 ether // VRF fee
        }();
        
        players[requestId] = msg.sender;
    }
    
    function fulfillRandomness(
        uint256 requestId, 
        uint256 randomness
    ) external override {
        require(msg.sender == address(omniDragon), "Unauthorized");
        
        address player = players[requestId];
        uint256 outcome = randomness % 100;
        
        if (outcome < 50) {
            winnings[player] += 0.015 ether; // 50% win rate, 1.5x payout
        }
        
        delete players[requestId];
    }
}
```

### Advanced DeFi Integration

```solidity
contract YieldFarming is IOmniDragonConsumer, ReentrancyGuard {
    IOmniDragon public immutable omniDragon;
    IERC20 public immutable rewardToken;
    
    struct Claim {
        address user;
        uint256 baseAmount;
        uint256 timestamp;
    }
    
    mapping(uint256 => Claim) public pendingClaims;
    mapping(address => uint256) public stakedBalances;
    
    function claimRewards() external nonReentrant {
        uint256 baseReward = calculateBaseReward(msg.sender);
        require(baseReward > 0, "No rewards available");
        
        uint256 requestId = omniDragon.requestRandomness{
            value: 0.005 ether
        }();
        
        pendingClaims[requestId] = Claim({
            user: msg.sender,
            baseAmount: baseReward,
            timestamp: block.timestamp
        });
    }
    
    function fulfillRandomness(
        uint256 requestId, 
        uint256 randomness
    ) external override {
        require(msg.sender == address(omniDragon), "Unauthorized");
        
        Claim memory claim = pendingClaims[requestId];
        require(claim.user != address(0), "Invalid claim");
        
        // Random multiplier between 0.8x and 1.2x
        uint256 multiplier = 80 + (randomness % 41);
        uint256 finalReward = claim.baseAmount * multiplier / 100;
        
        rewardToken.transfer(claim.user, finalReward);
        delete pendingClaims[requestId];
    }
}
```

## Deployment Information

### Mainnet Addresses

- **Sonic Mainnet**: `0x[CONTRACT_ADDRESS]`
- **Testnet**: `0x[TESTNET_ADDRESS]`

### Constructor Parameters

```solidity
constructor(
    address _drandVerifier,
    address _layerZeroEndpoint,
    address _randomnessBucket,
    DrandConfig memory _drandConfig,
    ChainlinkConfig memory _chainlinkConfig
) {
    // Initialization logic
}
```

### Verification

Contract source code is verified on:
- Sonic Explorer: [Link to verification]
- GitHub: [Link to source code]

## Best Practices

### For Developers

1. **Always validate the caller** in `fulfillRandomness()`
2. **Handle request failures** gracefully
3. **Implement proper access controls**
4. **Use reentrancy protection** for financial operations
5. **Monitor gas costs** and optimize accordingly

### For Users

1. **Verify contract addresses** before interacting
2. **Understand fee structure** before making requests
3. **Monitor transaction status** across chains
4. **Keep sufficient balance** for cross-chain operations

## Support

- **Documentation**: [Link to full docs]
- **GitHub Issues**: [Link to issues]
- **Developer Support**: [Contact information]
- **Security Contact**: [Security email] 