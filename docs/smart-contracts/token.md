# Sonic Red Dragon Token

This document provides technical details about the Sonic Red Dragon token contract implementation.

## Contract Overview

The Sonic Red Dragon token is a cross-chain ERC-20 compatible token built on LayerZero V2 with dRAND integration for verifiable randomness and enhanced security features.

**Contract Address (Ethereum)**: Coming Soon

## Key Features

- Standard ERC-20 functionality
- LayerZero V2 cross-chain compatibility
- dRAND network integration
- Advanced security features
- Role-based access control
- Cross-chain supply management
- Emergency controls
- Rate limiting

## Contract Interfaces

### ILayerZeroV2

```solidity
interface ILayerZeroV2 {
    function send(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable;

    function estimateFee(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload,
        bool _useZro,
        bytes calldata _adapterParams
    ) external view returns (uint256 nativeFee, uint256 zroFee);
}
```

### ISonicRedDragon

```solidity
interface ISonicRedDragon is IERC20 {
    function bridgeTokens(
        uint16 _dstChainId,
        bytes calldata _destination,
        uint256 _amount,
        bytes calldata _payload
    ) external payable;

    function requestRandomness() external returns (uint256);
    function verifyRandomness(uint256 _round, bytes calldata _proof) external view returns (bool);
    function pause() external;
    function unpause() external;
    function isPaused() external view returns (bool);
    function maxSupply() external view returns (uint256);
    function hasRole(bytes32 role, address account) external view returns (bool);
}
```

## Constructor Parameters

```solidity
constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _maxSupply,
    address _lzEndpoint,
    address _drandEndpoint
)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| _name | string | Token name ("Sonic Red Dragon") |
| _symbol | string | Token symbol ("SRD") |
| _decimals | uint8 | Decimal places (18) |
| _maxSupply | uint256 | Maximum token supply |
| _lzEndpoint | address | LayerZero V2 endpoint |
| _drandEndpoint | address | dRAND network endpoint |

## Main Functions

### Transfer Functions

```solidity
function transfer(address to, uint256 amount) public override returns (bool)
function transferFrom(address from, address to, uint256 amount) public override returns (bool)
```

Both functions include security checks and rate limiting.

### Cross-Chain Functions

```solidity
function bridgeTokens(
    uint16 _dstChainId,
    bytes calldata _destination,
    uint256 _amount,
    bytes calldata _payload
) external payable
```

Handles cross-chain token transfers through LayerZero V2.

### Randomness Functions

```solidity
function requestRandomness() external returns (uint256)
function verifyRandomness(uint256 _round, bytes calldata _proof) external view returns (bool)
function fulfillRandomness(uint256 _requestId, uint256 _randomness) external
```

Manages dRAND integration for verifiable randomness.

### Security Functions

```solidity
function pause() external onlyRole(PAUSER_ROLE)
function unpause() external onlyRole(PAUSER_ROLE)
function grantRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE)
function revokeRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE)
```

## Events

```solidity
event TokensBridged(uint16 indexed dstChainId, bytes indexed destination, uint256 amount);
event RandomnessRequested(uint256 indexed requestId, address indexed requester);
event RandomnessFulfilled(uint256 indexed requestId, uint256 randomness);
event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
event MaxSupplyUpdated(uint256 newMaxSupply);
```

## Cross-Chain Implementation

The Sonic Red Dragon token implements LayerZero V2 for cross-chain functionality:

```solidity
contract SonicRedDragon is ERC20, AccessControl, Pausable {
    // Contract implementation
}
```

This enables:

1. Secure cross-chain token transfers
2. Global supply management
3. Consistent token properties across chains
4. Gas-optimized cross-chain messages
5. Enhanced security features

## Randomness Implementation

The contract integrates with dRAND for verifiable randomness:

```solidity
contract SonicRedDragonRandomness {
    // Randomness implementation
}
```

Features:
- Verifiable randomness through dRAND beacon
- Cross-chain randomness consistency
- Fallback mechanisms
- Rate limiting for randomness requests

## Security Considerations

The contract implements multiple security layers:

- **Role-Based Access Control**: Granular permissions for different functions
- **Pausable Transfers**: Emergency pause functionality
- **Rate Limiting**: Prevents abuse of cross-chain and randomness functions
- **Supply Enforcement**: Strict maximum supply management
- **Input Validation**: Comprehensive validation for all functions
- **Cross-Chain Security**: Message verification and validation
- **Randomness Security**: Verification of dRAND proofs

## Contract Verification

The contract source code will be verified on all deployed chain explorers:

- Ethereum Explorer (Coming Soon)
- Arbitrum Explorer (Coming Soon)
- Optimism Explorer (Coming Soon)
- Base Explorer (Coming Soon)
- Polygon Explorer (Coming Soon)
- Avalanche Explorer (Coming Soon)

## Development

For developers looking to interact with the contract:

1. Install dependencies:
   ```bash
   npm install @sonicreddragon/contracts
   ```

2. Import the contract:
   ```solidity
   import "@sonicreddragon/contracts/SonicRedDragon.sol";
   ```

3. Example usage:
   ```solidity
   // Cross-chain transfer
   await token.bridgeTokens(
       dstChainId,
       destination,
       amount,
       payload
   );

   // Request randomness
   const requestId = await token.requestRandomness();
   ``` 