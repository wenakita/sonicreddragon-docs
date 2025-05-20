# Sonic Red Dragon Randomness

This document provides technical details about the Sonic Red Dragon randomness contract implementation, which integrates with dRAND for verifiable randomness generation.

## Contract Overview

The Sonic Red Dragon randomness contract integrates with the dRAND network to provide cryptographically secure and verifiable randomness for various on-chain applications.

**Contract Address (Ethereum)**: Coming Soon

## Key Features

- dRAND network integration
- Verifiable randomness
- Cross-chain randomness
- Request batching
- Fallback mechanisms
- Rate limiting
- Role-based access control
- Emergency controls

## Contract Interfaces

### IDRANDConsumer

```solidity
interface IDRANDConsumer {
    function requestRandomness(
        uint256 _roundId,
        bytes calldata _callbackData
    ) external returns (uint256 requestId);

    function fulfillRandomness(
        uint256 _requestId,
        uint256 _randomness,
        bytes calldata _proof
    ) external;

    function getRandomness(uint256 _roundId) external view returns (uint256);
    function isRandomnessReady(uint256 _roundId) external view returns (bool);
}
```

### ISonicRedDragonRandomness

```solidity
interface ISonicRedDragonRandomness {
    function setDRANDEndpoint(address _endpoint) external;
    function setMaxRequestsPerRound(uint256 _maxRequests) external;
    function setCallbackGasLimit(uint256 _gasLimit) external;
    function pause() external;
    function unpause() external;
    function isPaused() external view returns (bool);
}
```

## Constructor Parameters

```solidity
constructor(
    address _drandEndpoint,
    address _securityManager,
    uint256 _maxRequestsPerRound,
    uint256 _callbackGasLimit
)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| _drandEndpoint | address | dRAND network endpoint |
| _securityManager | address | Security manager contract |
| _maxRequestsPerRound | uint256 | Maximum requests per dRAND round |
| _callbackGasLimit | uint256 | Gas limit for callback execution |

## Main Functions

### Randomness Functions

```solidity
function requestRandomness(
    uint256 _roundId,
    bytes calldata _callbackData
) external returns (uint256 requestId)
```

Requests randomness from dRAND for a specific round.

```solidity
function fulfillRandomness(
    uint256 _requestId,
    uint256 _randomness,
    bytes calldata _proof
) external
```

Fulfills a randomness request with dRAND proof.

### Security Functions

```solidity
function setDRANDEndpoint(address _endpoint) external onlyRole(ADMIN_ROLE)
function setMaxRequestsPerRound(uint256 _maxRequests) external onlyRole(ADMIN_ROLE)
function setCallbackGasLimit(uint256 _gasLimit) external onlyRole(ADMIN_ROLE)
function pause() external onlyRole(PAUSER_ROLE)
function unpause() external onlyRole(PAUSER_ROLE)
```

### View Functions

```solidity
function getRandomness(uint256 _roundId) external view returns (uint256)
function isRandomnessReady(uint256 _roundId) external view returns (bool)
function getRequestStatus(uint256 _requestId) external view returns (RequestStatus)
function getMaxRequestsPerRound() external view returns (uint256)
function getCallbackGasLimit() external view returns (uint256)
```

## Events

```solidity
event RandomnessRequested(
    uint256 indexed requestId,
    uint256 indexed roundId,
    address indexed requester,
    bytes callbackData
);
event RandomnessFulfilled(
    uint256 indexed requestId,
    uint256 indexed roundId,
    uint256 randomness,
    bytes proof
);
event DRANDEndpointUpdated(address newEndpoint);
event MaxRequestsPerRoundUpdated(uint256 newMaxRequests);
event CallbackGasLimitUpdated(uint256 newGasLimit);
event RandomnessPaused(address indexed pauser);
event RandomnessUnpaused(address indexed unpauser);
```

## Security Features

The randomness contract implements multiple security layers:

### Access Control

- Role-based permissions for administrative functions
- Request validation and authorization
- Pausable functionality for emergencies

### Rate Limiting

- Maximum requests per round
- Request throttling
- Callback gas limits

### Proof Verification

- dRAND proof validation
- Round verification
- Request validation
- Callback validation

### Fallback Mechanisms

- Multiple dRAND endpoints
- Request retry logic
- Emergency fallback sources
- State recovery

## dRAND Integration

The contract integrates with dRAND:

```solidity
contract SonicRedDragonRandomness is IDRANDConsumer, AccessControl, Pausable {
    // Contract implementation
}
```

This enables:

1. Verifiable randomness generation
2. Cross-chain randomness distribution
3. Request batching and optimization
4. Proof verification
5. Emergency controls

## Error Handling

The contract implements robust error handling:

- **Validation Errors**: Invalid parameters or states
- **Security Errors**: Unauthorized access attempts
- **Rate Limit Errors**: Exceeded request limits
- **Proof Errors**: Invalid dRAND proofs
- **Recovery Mechanisms**: Administrative recovery options

## Development

For developers looking to interact with the randomness contract:

1. Install dependencies:
   ```bash
   npm install @sonicreddragon/contracts
   ```

2. Import the contract:
   ```solidity
   import "@sonicreddragon/contracts/SonicRedDragonRandomness.sol";
   ```

3. Example usage:
   ```solidity
   // Request randomness
   const requestId = await randomness.requestRandomness(
       roundId,
       callbackData
   );

   // Check randomness status
   const isReady = await randomness.isRandomnessReady(roundId);
   const randomValue = await randomness.getRandomness(roundId);
   ```

## Contract Verification

The randomness contract source code will be verified on all deployed chain explorers:

- Ethereum Explorer (Coming Soon)
- Arbitrum Explorer (Coming Soon)
- Optimism Explorer (Coming Soon)
- Base Explorer (Coming Soon)
- Polygon Explorer (Coming Soon)
- Avalanche Explorer (Coming Soon)

## Best Practices

When using the randomness contract:

1. **Request Management**
   - Monitor request status
   - Handle failed requests
   - Implement retry logic
   - Use appropriate gas limits

2. **Security**
   - Verify randomness proofs
   - Implement rate limiting
   - Use secure callback patterns
   - Monitor for anomalies

3. **Integration**
   - Test with testnet dRAND
   - Implement fallback mechanisms
   - Handle cross-chain scenarios
   - Monitor gas costs

4. **Maintenance**
   - Regular security audits
   - Endpoint monitoring
   - Performance optimization
   - Emergency response plan 