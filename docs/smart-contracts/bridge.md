# Sonic Red Dragon Bridge

This document provides technical details about the Sonic Red Dragon bridge contract implementation, which handles cross-chain token transfers and message passing.

## Contract Overview

The Sonic Red Dragon bridge contract is built on LayerZero V2, providing secure and efficient cross-chain token transfers with enhanced security features and gas optimization.

**Contract Address (Ethereum)**: Coming Soon

## Key Features

- LayerZero V2 integration
- Secure token bridging
- Message validation
- Gas optimization
- Role-based access control
- Rate limiting
- Emergency controls
- Cross-chain state management

## Contract Interfaces

### ILayerZeroV2Bridge

```solidity
interface ILayerZeroV2Bridge {
    function bridgeTokens(
        uint16 _dstChainId,
        bytes calldata _destination,
        uint256 _amount,
        bytes calldata _payload
    ) external payable;

    function receiveTokens(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        uint64 _nonce,
        bytes calldata _payload
    ) external;

    function estimateBridgeFee(
        uint16 _dstChainId,
        bytes calldata _destination,
        uint256 _amount,
        bytes calldata _payload
    ) external view returns (uint256 nativeFee, uint256 zroFee);
}
```

### ISonicRedDragonBridge

```solidity
interface ISonicRedDragonBridge {
    function setTrustedRemote(uint16 _remoteChainId, bytes calldata _path) external;
    function isTrustedRemote(uint16 _remoteChainId, bytes calldata _path) external view returns (bool);
    function setMaxDailyVolume(uint256 _maxVolume) external;
    function setMaxTransactionAmount(uint256 _maxAmount) external;
    function pause() external;
    function unpause() external;
    function isPaused() external view returns (bool);
}
```

## Constructor Parameters

```solidity
constructor(
    address _token,
    address _lzEndpoint,
    address _securityManager
)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| _token | address | Sonic Red Dragon token address |
| _lzEndpoint | address | LayerZero V2 endpoint |
| _securityManager | address | Security manager contract |

## Main Functions

### Bridge Functions

```solidity
function bridgeTokens(
    uint16 _dstChainId,
    bytes calldata _destination,
    uint256 _amount,
    bytes calldata _payload
) external payable
```

Handles outbound token transfers to other chains.

```solidity
function receiveTokens(
    uint16 _srcChainId,
    bytes calldata _srcAddress,
    uint64 _nonce,
    bytes calldata _payload
) external
```

Handles inbound token transfers from other chains.

### Security Functions

```solidity
function setTrustedRemote(uint16 _remoteChainId, bytes calldata _path) external onlyRole(ADMIN_ROLE)
function setMaxDailyVolume(uint256 _maxVolume) external onlyRole(ADMIN_ROLE)
function setMaxTransactionAmount(uint256 _maxAmount) external onlyRole(ADMIN_ROLE)
function pause() external onlyRole(PAUSER_ROLE)
function unpause() external onlyRole(PAUSER_ROLE)
```

### View Functions

```solidity
function isTrustedRemote(uint16 _remoteChainId, bytes calldata _path) external view returns (bool)
function getDailyVolume() external view returns (uint256)
function getMaxDailyVolume() external view returns (uint256)
function getMaxTransactionAmount() external view returns (uint256)
```

## Events

```solidity
event TokensBridged(
    uint16 indexed dstChainId,
    bytes indexed destination,
    uint256 amount,
    bytes payload
);
event TokensReceived(
    uint16 indexed srcChainId,
    bytes indexed srcAddress,
    uint256 amount,
    bytes payload
);
event TrustedRemoteSet(uint16 indexed remoteChainId, bytes path);
event MaxDailyVolumeUpdated(uint256 newMaxVolume);
event MaxTransactionAmountUpdated(uint256 newMaxAmount);
event BridgePaused(address indexed pauser);
event BridgeUnpaused(address indexed unpauser);
```

## Security Features

The bridge contract implements multiple security layers:

### Access Control

- Role-based permissions for administrative functions
- Trusted remote contract validation
- Pausable functionality for emergencies

### Rate Limiting

- Maximum daily volume limits
- Per-transaction amount limits
- Cross-chain message rate limiting

### Message Validation

- Source chain validation
- Trusted remote validation
- Payload validation
- Nonce validation

### Gas Optimization

- Optimized message payloads
- Efficient state management
- Gas refund mechanisms

## Cross-Chain Implementation

The bridge contract integrates with LayerZero V2:

```solidity
contract SonicRedDragonBridge is ILayerZeroV2Bridge, AccessControl, Pausable {
    // Contract implementation
}
```

This enables:

1. Secure cross-chain token transfers
2. Message validation and verification
3. Gas-optimized operations
4. State synchronization
5. Emergency controls

## Error Handling

The contract implements robust error handling:

- **Validation Errors**: Invalid parameters or states
- **Security Errors**: Unauthorized access attempts
- **Rate Limit Errors**: Exceeded volume or transaction limits
- **Cross-Chain Errors**: Failed message delivery or validation
- **Recovery Mechanisms**: Administrative recovery options

## Development

For developers looking to interact with the bridge:

1. Install dependencies:
   ```bash
   npm install @sonicreddragon/contracts
   ```

2. Import the contract:
   ```solidity
   import "@sonicreddragon/contracts/SonicRedDragonBridge.sol";
   ```

3. Example usage:
   ```solidity
   // Bridge tokens to another chain
   await bridge.bridgeTokens(
       dstChainId,
       destination,
       amount,
       payload
   );

   // Check bridge status
   const isPaused = await bridge.isPaused();
   const maxVolume = await bridge.getMaxDailyVolume();
   ```

## Contract Verification

The bridge contract source code will be verified on all deployed chain explorers:

- Ethereum Explorer (Coming Soon)
- Arbitrum Explorer (Coming Soon)
- Optimism Explorer (Coming Soon)
- Base Explorer (Coming Soon)
- Polygon Explorer (Coming Soon)
- Avalanche Explorer (Coming Soon) 