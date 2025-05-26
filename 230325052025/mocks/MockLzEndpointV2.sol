// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/external/layerzero/ILayerZeroEndpointV2.sol";
import "../interfaces/external/layerzero/ILayerZeroReceiver.sol";

/**
 * @title MockLzEndpointV2
 * @dev A mock implementation of LayerZero V2 endpoint for testing cross-chain functionality
 */
contract MockLzEndpointV2 is ILayerZeroEndpointV2 {
    uint32 public immutable chainId;

    // Mapping to simulate remote endpoints
    mapping(address => address) public dstEndpoints;

    // The next nonce for a given sender
    mapping(address => mapping(uint32 => mapping(bytes32 => uint64))) public outboundNonce;

    constructor(uint32 _chainId) {
        chainId = _chainId;
    }

    // Set the destination endpoint for a given source
    function setDestLzEndpoint(address srcAddress, address dstEndpoint) external {
        dstEndpoints[srcAddress] = dstEndpoint;
    }

    // ============== ILayerZeroEndpointV2 ====================

    /**
     * @notice Send a message to another chain
     * @param _params Messaging parameters
     * @param _refundAddress Address to refund excess fees
     * @return receipt Receipt for the message
     */
    function send(
        MessagingParams calldata _params,
        address payable _refundAddress
    ) external payable returns (MessagingReceipt memory receipt) {
        // Convert receiver to bytes32 for nonce tracking
        bytes32 receiverHash = keccak256(_params.receiver);

        // Increment outbound nonce
        uint64 nonce = ++outboundNonce[msg.sender][_params.dstEid][receiverHash];

        // Get the destination endpoint
        address dstEndpoint = dstEndpoints[msg.sender];
        require(dstEndpoint != address(0), "MockLzEndpointV2: destination endpoint not set");

        // Create origin for the destination
        Origin memory origin = Origin({
            srcEid: chainId,
            sender: bytes32(uint256(uint160(msg.sender))),
            nonce: nonce
        });

        // Call the destination endpoint (immediate execution for testing)
        MockLzEndpointV2(dstEndpoint).lzReceive(
            _params.dstEid,
            _params.receiver,
            origin,
            _params.message
        );

        // Return receipt
        return MessagingReceipt({
            guid: keccak256(abi.encode(chainId, _params.dstEid, nonce)),
            nonce: nonce,
            fee: MessagingFee({
                nativeFee: 0,
                lzTokenFee: 0
            })
        });
    }

    /**
     * @notice Quote the fee for sending a message
     * @param _params Messaging parameters
     * @return fee The quoted fee for the message
     */
    function quoteFee(MessagingParams calldata _params) external pure returns (MessagingFee memory fee) {
        // Return 0 fees for testing purposes
        return MessagingFee({
            nativeFee: 0,
            lzTokenFee: 0
        });
    }

    /**
     * @notice Internal function to receive messages from other chains
     * @param _srcEid Source endpoint ID
     * @param _receiver Receiver address as bytes
     * @param _origin Origin information
     * @param _payload Message payload
     */
    function lzReceive(
        uint32 _srcEid,
        bytes memory _receiver,
        Origin memory _origin,
        bytes memory _payload
    ) public {
        // Convert receiver bytes to address
        address receiverAddress;
        assembly {
            receiverAddress := mload(add(_receiver, 32))
        }

        // Convert sender bytes32 to bytes for ILayerZeroReceiver
        bytes memory senderBytes = abi.encodePacked(_origin.sender);

        // Call the receive function on the destination contract
        ILayerZeroReceiver(receiverAddress).lzReceive(
            uint16(_srcEid), // Convert to uint16 for compatibility
            senderBytes,
            _origin.nonce,
            _payload
        );
    }

    // ============== Additional helper functions ====================

    function getOutboundNonce(uint32 _dstEid, address _sender, bytes32 _receiver) public view returns (uint64) {
        return outboundNonce[_sender][_dstEid][_receiver];
    }
}
