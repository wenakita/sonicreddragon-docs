// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ILayerZeroEndpointV2
 * @dev Simplified interface for LayerZero Endpoint V2
 *
 * Provides V2-specific functionality for enhanced cross-chain messaging
 * Modern interface for OmniDragon's advanced LayerZero operations
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
interface ILayerZeroEndpointV2 {
    /**
     * @notice Parameters for sending messages across chains
     */
    struct MessagingParams {
        uint32 dstEid;         // Destination endpoint identifier
        bytes receiver;        // Destination address (bytes for cross-chain format)
        bytes message;         // Message to send
        bytes options;         // Additional options
        bool payInLzToken;     // Whether to pay in LZ token
    }

    /**
     * @notice Fee structure for cross-chain messages
     */
    struct MessagingFee {
        uint256 nativeFee;     // Fee in native token
        uint256 lzTokenFee;    // Fee in LZ token
    }

    /**
     * @notice Receipt for a cross-chain message
     */
    struct MessagingReceipt {
        bytes32 guid;          // Globally unique identifier
        uint64 nonce;          // Message nonce
        MessagingFee fee;      // Fee paid
    }

    /**
     * @notice Origin information for incoming messages
     */
    struct Origin {
        uint32 srcEid;        // Source endpoint ID
        bytes32 sender;       // Source sender address (as bytes32)
        uint64 nonce;         // Message nonce
    }

    /**
     * @notice Send a message to another chain
     * @param _params Messaging parameters
     * @param _refundAddress Address to refund excess fees
     * @return receipt Receipt for the message
     */
    function send(
        MessagingParams calldata _params,
        address payable _refundAddress
    ) external payable returns (MessagingReceipt memory receipt);

    /**
     * @notice Quote the fee for sending a message
     * @param _params Messaging parameters
     * @return fee The quoted fee for the message
     */
    function quoteFee(MessagingParams calldata _params) external view returns (MessagingFee memory fee);
}
