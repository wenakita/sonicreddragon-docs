# API Reference

## Overview

This section provides comprehensive API documentation for the OmniDragon cross-chain VRF system.

## Core Contracts

### OmniDragon Main Contract

The primary contract for cross-chain VRF requests and management.

#### Key Functions

##### `requestRandomness(uint256 seed, uint32 callbackGasLimit)`

Requests randomness from the VRF system.

**Parameters:**
- `seed`: Random seed for the request
- `callbackGasLimit`: Gas limit for the callback function

**Returns:**
- `requestId`: Unique identifier for the request

**Events:**
- `RandomnessRequested(bytes32 indexed requestId, address indexed requester, uint256 seed)`

##### `fulfillRandomness(bytes32 requestId, uint256 randomness)`

Fulfills a randomness request (internal function called by VRF coordinator).

**Parameters:**
- `requestId`: The request identifier
- `randomness`: The generated random number

**Events:**
- `RandomnessFulfilled(bytes32 indexed requestId, uint256 randomness)`

### VRF Coordinator

Manages VRF requests and coordinates with multiple randomness sources.

#### Key Functions

##### `addRandomnessSource(address source, uint256 weight)`

Adds a new randomness source to the system.

**Parameters:**
- `source`: Address of the randomness source
- `weight`: Weight for the source in aggregation

**Access:** Admin only

##### `removeRandomnessSource(address source)`

Removes a randomness source from the system.

**Parameters:**
- `source`: Address of the randomness source to remove

**Access:** Admin only

## Cross-Chain Integration

### LayerZero Integration

#### Endpoint Configuration

```solidity
interface ILayerZeroEndpoint {
    function send(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable;
}
```

#### Message Types

- `MSG_TYPE_REQUEST`: Cross-chain randomness request
- `MSG_TYPE_FULFILL`: Cross-chain randomness fulfillment
- `MSG_TYPE_CONFIG`: Configuration updates

## Error Codes

### Common Errors

- `INVALID_REQUEST`: Request parameters are invalid
- `INSUFFICIENT_FEE`: Insufficient fee for the request
- `REQUEST_NOT_FOUND`: Request ID not found
- `UNAUTHORIZED`: Caller not authorized
- `CHAIN_NOT_SUPPORTED`: Target chain not supported

### VRF Specific Errors

- `VRF_COORDINATOR_NOT_SET`: VRF coordinator not configured
- `RANDOMNESS_SOURCE_NOT_FOUND`: Randomness source not available
- `CALLBACK_FAILED`: Callback execution failed

## Gas Estimates

### Typical Gas Usage

| Operation | Estimated Gas |
|-----------|---------------|
| Request Randomness | 150,000 |
| Fulfill Randomness | 100,000 |
| Cross-chain Send | 200,000 |
| Cross-chain Receive | 180,000 |

### Optimization Tips

1. **Batch Requests**: Combine multiple requests to reduce overhead
2. **Callback Optimization**: Keep callback functions lightweight
3. **Gas Limit Setting**: Set appropriate gas limits for cross-chain calls

## Rate Limits

### Request Limits

- **Per Address**: 10 requests per block
- **Global**: 100 requests per block
- **Cross-chain**: 50 requests per block per chain

### Fee Structure

```solidity
struct FeeConfig {
    uint256 baseFee;        // Base fee in native token
    uint256 crossChainFee;  // Additional fee for cross-chain
    uint256 priorityFee;    // Priority fee for faster processing
}
```

## Integration Examples

### Basic VRF Request

```solidity
contract MyContract {
    IOmniDragon public omniDragon;
    
    function requestRandom() external {
        uint256 seed = uint256(keccak256(abi.encode(block.timestamp, msg.sender)));
        bytes32 requestId = omniDragon.requestRandomness(seed, 100000);
        // Store requestId for later use
    }
    
    function fulfillRandomness(bytes32 requestId, uint256 randomness) external {
        require(msg.sender == address(omniDragon), "Unauthorized");
        // Use the randomness
    }
}
```

### Cross-Chain Request

```solidity
contract CrossChainLottery {
    function requestCrossChainRandom(uint16 targetChain) external payable {
        bytes memory payload = abi.encode(msg.sender, block.timestamp);
        omniDragon.requestCrossChainRandomness{value: msg.value}(
            targetChain,
            payload,
            200000 // callback gas limit
        );
    }
}
```

## Security Considerations

### Best Practices

1. **Validate Callbacks**: Always verify the caller in callback functions
2. **Handle Failures**: Implement proper error handling for failed requests
3. **Fee Management**: Ensure sufficient fees for cross-chain operations
4. **Reentrancy Protection**: Use reentrancy guards in callback functions

### Common Pitfalls

- Not checking the caller in callback functions
- Insufficient gas limits for complex callbacks
- Not handling cross-chain message failures
- Relying on single randomness source

## Monitoring and Analytics

### Events to Monitor

- `RandomnessRequested`: Track request volume
- `RandomnessFulfilled`: Monitor fulfillment rate
- `CrossChainMessageSent`: Track cross-chain activity
- `FeeUpdated`: Monitor fee changes

### Metrics

- **Request Success Rate**: Percentage of successful requests
- **Average Fulfillment Time**: Time from request to fulfillment
- **Cross-Chain Latency**: Time for cross-chain message delivery
- **Gas Efficiency**: Average gas used per operation

## Support and Resources

### Documentation Links

- [Smart Contracts Documentation](../contracts/core/omnidragon.md)
- [Integration Guide](../guides/development.md)
- [Security Audit](../audit/AUDIT_DOCUMENTATION_SUMMARY.md)

### Community

- **Discord**: [OmniDragon Community](https://discord.gg/omnidragon)
- **GitHub**: [OmniDragon Repository](https://github.com/wenakita/omnidragon)
- **Forum**: [Developer Forum](https://forum.omnidragon.io)

### Support

For technical support and integration assistance:
- Email: support@omnidragon.io
- Documentation: [docs.omnidragon.io](https://docs.omnidragon.io)
- Bug Reports: [GitHub Issues](https://github.com/wenakita/omnidragon/issues) 