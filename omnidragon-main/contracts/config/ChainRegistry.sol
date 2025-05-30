// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "../library/access/Ownable.sol";
import {IChainRegistry} from "../interfaces/misc/IChainRegistry.sol";
import "../interfaces/external/layerzero/ILayerZeroEndpoint.sol";

/**
 * @title ChainRegistry
 * @dev Central registry for cross-chain configuration and chain-specific parameters
 *
 * Manages supported chains, LayerZero endpoints, and chain-specific token addresses
 * Essential for secure cross-chain operations in the OmniDragon ecosystem
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract ChainRegistry is IChainRegistry, Ownable {
    // Storage for chain configuration
    mapping(uint16 => ChainConfig) private chainConfigs;

    // Track all supported chains
    uint16[] private supportedChains;

    // Current chain ID (set at deployment time)
    uint16 private currentChainId;

    // Layer Zero endpoint address (for proxy functionality)
    address public lzEndpointAddress;

    // Control flags for endpoint proxy
    bool private _endpointUpdated;
    uint256 private constant UPDATE_PERIOD = 7 days;
    uint256 private immutable _updateDeadline;

    // Custom errors
    error ChainAlreadyRegistered(uint16 chainId);
    error ChainNotRegistered(uint16 chainId);
    error ZeroAddress();
    error EndpointAlreadyUpdated();
    error UpdatedPeriodExpired();
    error DelegateCallFailed();

    // Events
    event ChainRegistered(uint16 indexed chainId, string chainName);
    event ChainUpdated(uint16 indexed chainId);
    event ChainStatusChanged(uint16 indexed chainId, bool isActive);
    event CurrentChainSet(uint16 indexed chainId);
    event EndpointUpdated(address indexed oldEndpoint, address indexed newEndpoint);

    /**
     * @dev Constructor
     * @param _placeholderEndpoint A placeholder endpoint address (same for all chains)
     */
    constructor(address _placeholderEndpoint) {
        // Default to Sonic chain (will be updated if needed)
        currentChainId = 332;

        // Set placeholder endpoint
        if (_placeholderEndpoint == address(0)) revert ZeroAddress();
        lzEndpointAddress = _placeholderEndpoint;

        // Set update deadline
        _updateDeadline = block.timestamp + UPDATE_PERIOD;
    }

    /**
     * @notice Set the current chain ID
     * @param _chainId The current chain's LayerZero ID
     */
    function setCurrentChainId(uint16 _chainId) external onlyOwner {
        currentChainId = _chainId;
        emit CurrentChainSet(_chainId);
    }

    /**
     * @notice Updates the chain-specific LZ endpoint address
     * @param _newEndpoint The new chain-specific LZ endpoint address
     */
    function updateEndpoint(address _newEndpoint) external onlyOwner {
        // Check conditions
        if (_newEndpoint == address(0)) revert ZeroAddress();
        if (_endpointUpdated) revert EndpointAlreadyUpdated();
        if (block.timestamp > _updateDeadline) revert UpdatedPeriodExpired();

        // Store old address for event
        address oldEndpoint = lzEndpointAddress;

        // Update endpoint address
        lzEndpointAddress = _newEndpoint;

        // Mark as updated to prevent further changes
        _endpointUpdated = true;

        // Emit event
        emit EndpointUpdated(oldEndpoint, _newEndpoint);
    }

    /**
     * @dev Returns whether the endpoint has been updated
     * @return True if updated, false otherwise
     */
    function isEndpointUpdated() external view returns (bool) {
        return _endpointUpdated;
    }

    /**
     * @dev Returns the deadline for updating the endpoint
     * @return Timestamp of the update deadline
     */
    function updateDeadline() external view returns (uint256) {
        return _updateDeadline;
    }

    /**
     * @notice Register a new chain configuration
     * @param _chainId The LayerZero chain ID
     * @param _chainName The human-readable chain name
     * @param _wrappedNativeToken The wrapped native token address (WETH, WrappedNativeToken, WSOL, WBERA, etc.)
     * @param _swapTrigger The chain-specific swap trigger address
     * @param _vrfConsumer The chain-specific VRF consumer address
     * @param _dragonToken The Dragon token address on this chain
     */
    function registerChain(
        uint16 _chainId,
        string calldata _chainName,
        address _wrappedNativeToken,
        address _swapTrigger,
        address _vrfConsumer,
        address _dragonToken
    ) external override onlyOwner {
        // Check if chain is already registered
        if (chainConfigs[_chainId].chainId == _chainId) revert ChainAlreadyRegistered(_chainId);

        // Validate wrapped native token address
        if (_wrappedNativeToken == address(0)) revert ZeroAddress();

        // Create chain config
        chainConfigs[_chainId] = ChainConfig({
            chainId: _chainId,
            chainName: _chainName,
            wrappedNativeToken: _wrappedNativeToken,
            swapTrigger: _swapTrigger,
            vrfConsumer: _vrfConsumer,
            dragonToken: _dragonToken,
            isActive: true
        });

        // Add to supported chains
        supportedChains.push(_chainId);

        // If this is the first chain, set it as current chain
        if (supportedChains.length == 1) {
            currentChainId = _chainId;
            emit CurrentChainSet(_chainId);
        }

        emit ChainRegistered(_chainId, _chainName);
    }

    /**
     * @notice Update an existing chain configuration
     * @param _chainId The LayerZero chain ID to update
     * @param _wrappedNativeToken The wrapped native token address
     * @param _swapTrigger The chain-specific swap trigger address
     * @param _vrfConsumer The chain-specific VRF consumer address
     * @param _dragonToken The Dragon token address on this chain
     */
    function updateChain(
        uint16 _chainId,
        address _wrappedNativeToken,
        address _swapTrigger,
        address _vrfConsumer,
        address _dragonToken
    ) external override onlyOwner {
        // Check if chain exists
        if (chainConfigs[_chainId].chainId != _chainId) revert ChainNotRegistered(_chainId);

        // Validate wrapped native token address
        if (_wrappedNativeToken == address(0)) revert ZeroAddress();

        // Update chain config
        ChainConfig storage config = chainConfigs[_chainId];
        config.wrappedNativeToken = _wrappedNativeToken;

        // Only update if non-zero address provided
        if (_swapTrigger != address(0)) {
            config.swapTrigger = _swapTrigger;
        }

        if (_vrfConsumer != address(0)) {
            config.vrfConsumer = _vrfConsumer;
        }

        if (_dragonToken != address(0)) {
            config.dragonToken = _dragonToken;
        }

        emit ChainUpdated(_chainId);
    }

    /**
     * @notice Set chain active status
     * @param _chainId The LayerZero chain ID
     * @param _isActive Whether the chain is active
     */
    function setChainActive(uint16 _chainId, bool _isActive) external override onlyOwner {
        // Check if chain exists
        if (chainConfigs[_chainId].chainId != _chainId) revert ChainNotRegistered(_chainId);

        // Update active status
        chainConfigs[_chainId].isActive = _isActive;

        emit ChainStatusChanged(_chainId, _isActive);
    }

    /**
     * @notice Get chain configuration
     * @param _chainId The LayerZero chain ID
     * @return Chain configuration struct
     */
    function getChainConfig(uint16 _chainId) external view override returns (ChainConfig memory) {
        // Check if chain exists
        if (chainConfigs[_chainId].chainId != _chainId) revert ChainNotRegistered(_chainId);

        return chainConfigs[_chainId];
    }

    /**
     * @dev Get the current chain's LayerZero ID
     * @return The LayerZero chain ID of the current chain
     */
    function getCurrentChainId() external view override returns (uint16) {
        return currentChainId;
    }

    /**
     * @dev Get the wrapped native token address for a specific chain
     * @param _chainId The LayerZero chain ID
     * @return The wrapped native token address for the specified chain
     */
    function getWrappedNativeToken(uint16 _chainId) external view override returns (address) {
        // Check if chain exists
        if (chainConfigs[_chainId].chainId != _chainId) revert ChainNotRegistered(_chainId);

        return chainConfigs[_chainId].wrappedNativeToken;
    }

    /**
     * @notice Get swap trigger address for a specific chain
     * @param _chainId The LayerZero chain ID
     * @return The swap trigger address
     */
    function getSwapTrigger(uint16 _chainId) external view override returns (address) {
        // Check if chain exists
        if (chainConfigs[_chainId].chainId != _chainId) revert ChainNotRegistered(_chainId);

        return chainConfigs[_chainId].swapTrigger;
    }

    /**
     * @notice Get VRF consumer address for a specific chain
     * @param _chainId The LayerZero chain ID
     * @return The VRF consumer address
     */
    function getVRFConsumer(uint16 _chainId) external view override returns (address) {
        // Check if chain exists
        if (chainConfigs[_chainId].chainId != _chainId) revert ChainNotRegistered(_chainId);

        return chainConfigs[_chainId].vrfConsumer;
    }

    /**
     * @notice Get Dragon token address for a specific chain
     * @param _chainId The LayerZero chain ID
     * @return The Dragon token address
     */
    function getDragonToken(uint16 _chainId) external view override returns (address) {
        // Check if chain exists
        if (chainConfigs[_chainId].chainId != _chainId) revert ChainNotRegistered(_chainId);

        return chainConfigs[_chainId].dragonToken;
    }

    /**
     * @notice Get all supported chain IDs
     * @return Array of supported chain IDs
     */
    function getSupportedChains() external view override returns (uint16[] memory) {
        return supportedChains;
    }

    /**
     * @dev Check if a chain is supported
     * @param _chainId The LayerZero chain ID to check
     * @return True if the chain is supported, false otherwise
     */
    function isChainSupported(uint16 _chainId) external view override returns (bool) {
        return chainConfigs[_chainId].chainId == _chainId;
    }

    /**
     * @dev Register on Sonic FeeM
     */
    function registerMe() external {
        (bool success,) = address(0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830).call(
            abi.encodeWithSignature("selfRegister(uint256)", 143)
        );
        require(success, "Registration failed");
    }

    /**
     * @dev Fallback function that delegates all calls to the chain-specific endpoint
     * This enables the registry to also act as a proxy to the LayerZero endpoint
     */
    fallback() external payable {
        address endpoint = lzEndpointAddress;
        assembly {
            // Copy msg.data to memory
            calldatacopy(0, 0, calldatasize())

            // Forward call to endpoint
            let result := delegatecall(gas(), endpoint, 0, calldatasize(), 0, 0)

            // Copy the returned data
            returndatacopy(0, 0, returndatasize())

            // Return or revert
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
