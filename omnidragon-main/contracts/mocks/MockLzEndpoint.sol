// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockLzEndpoint
 * @dev Mock implementation of LayerZero endpoint for testing
 */
contract MockLzEndpoint {
    mapping(uint16 => mapping(bytes => mapping(uint64 => bytes))) public storedPayload;
    mapping(uint16 => bytes) public trustedRemoteLookup;

    // Events to match the real endpoint
    event PayloadStored(uint16 srcChainId, bytes srcAddress, address dstAddress, uint64 nonce, bytes payload);
    event UaForceResumeReceive(uint16 chainId, bytes srcAddress);

    // Store a payload
    function storePayload(uint16 _srcChainId, bytes calldata _srcAddress, address _dstAddress, uint64 _nonce, bytes calldata _payload) external {
        storedPayload[_srcChainId][_srcAddress][_nonce] = _payload;
        emit PayloadStored(_srcChainId, _srcAddress, _dstAddress, _nonce, _payload);
    }

    // Mock send function
    function send(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _txParameters
    ) external payable {
        // Do nothing, just a mock
    }

    // Mock setTrustedRemote
    function setTrustedRemote(uint16 _remoteChainId, bytes calldata _path) external {
        trustedRemoteLookup[_remoteChainId] = _path;
    }

    // Force resume receive
    function forceResumeReceive(uint16 _srcChainId, bytes calldata _srcAddress) external {
        emit UaForceResumeReceive(_srcChainId, _srcAddress);
    }
}
