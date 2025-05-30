// SPDX-License-Identifier: MIT

/**
 * Interface: IChainRegistry
 *
 * https://x.com/sonicreddragon
 * https://t.me/sonic_reddragon_bot
 */

pragma solidity ^0.8.20;

/**
 * @title IChainRegistry
 * @dev Interface for chain registry and cross-chain verification
 *
 * Manages chain IDs and validates cross-chain operations within the OmniDragon ecosystem
 * Ensures secure LayerZero communication between supported chains
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
interface IChainRegistry {
    /**
     * @dev Struct to hold chain-specific configuration
     */
    struct ChainConfig {
        uint16 chainId;
        string chainName;
        address wrappedNativeToken;    // WETH, WrappedNativeToken, WSOL, WBERA, etc.
        address swapTrigger;           // Chain-specific swap trigger implementation
        address vrfConsumer;           // Chain-specific VRF consumer
        address dragonToken;           // Dragon token address on this chain
        bool isActive;                 // Whether this chain is active
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
    ) external;

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
    ) external;

    /**
     * @notice Set chain active status
     * @param _chainId The LayerZero chain ID
     * @param _isActive Whether the chain is active
     */
    function setChainActive(uint16 _chainId, bool _isActive) external;

    /**
     * @notice Set the current chain ID
     * @param _chainId The current chain's LayerZero ID
     */
    function setCurrentChainId(uint16 _chainId) external;

    /**
     * @notice Get chain configuration
     * @param _chainId The LayerZero chain ID
     * @return Chain configuration struct
     */
    function getChainConfig(uint16 _chainId) external view returns (ChainConfig memory);

    /**
     * @dev Get the current chain's LayerZero ID
     * @return The LayerZero chain ID of the current chain
     */
    function getCurrentChainId() external view returns (uint16);

    /**
     * @dev Get the wrapped native token address for a specific chain
     * @param _chainId The LayerZero chain ID
     * @return The wrapped native token address for the specified chain
     */
    function getWrappedNativeToken(uint16 _chainId) external view returns (address);

    /**
     * @dev Get the swap trigger address for a specific chain
     * @param _chainId The LayerZero chain ID
     * @return The swap trigger address
     */
    function getSwapTrigger(uint16 _chainId) external view returns (address);

    /**
     * @dev Get the VRF consumer address for a specific chain
     * @param _chainId The LayerZero chain ID
     * @return The VRF consumer address
     */
    function getVRFConsumer(uint16 _chainId) external view returns (address);

    /**
     * @dev Get the Dragon token address for a specific chain
     * @param _chainId The LayerZero chain ID
     * @return The Dragon token address
     */
    function getDragonToken(uint16 _chainId) external view returns (address);

    /**
     * @dev Get all supported chain IDs
     * @return Array of supported chain IDs
     */
    function getSupportedChains() external view returns (uint16[] memory);

    /**
     * @dev Check if a chain is supported
     * @param _chainId The LayerZero chain ID to check
     * @return True if the chain is supported, false otherwise
     */
    function isChainSupported(uint16 _chainId) external view returns (bool);

    /**
     * @notice Updates the chain-specific LZ endpoint address
     * @param _newEndpoint The new chain-specific LZ endpoint address
     */
    function updateEndpoint(address _newEndpoint) external;

    /**
     * @dev Returns whether the endpoint has been updated
     * @return True if updated, false otherwise
     */
    function isEndpointUpdated() external view returns (bool);

    /**
     * @dev Returns the deadline for updating the endpoint
     * @return Timestamp of the update deadline
     */
    function updateDeadline() external view returns (uint256);
}
