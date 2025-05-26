// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "../../library/access/Ownable.sol";
import {ReentrancyGuard} from "../../library/security/ReentrancyGuard.sol";
import "../../interfaces/external/layerzero/ILayerZeroReceiver.sol";
import "../../interfaces/external/layerzero/ILayerZeroEndpoint.sol";
import "../drand/interfaces/IDrandVRFIntegrator.sol";
import "../../interfaces/core/IOmniDragonVRFConsumer.sol";
import "./interfaces/IChainlinkVRFRequester.sol";

/**
 * @title ChainlinkVRFIntegrator
 * @dev Integrates Chainlink VRF on Arbitrum with the Dragon VRF system on Sonic
 *
 * Handles cross-chain communication between Chainlink VRF (Arbitrum) and OmniDragon (Sonic)
 * Uses LayerZero for secure cross-chain messaging
 * LayerZero fees are paid in $S (Sonic native token) since messages originate from Sonic
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract ChainlinkVRFIntegrator is Ownable, ReentrancyGuard, IDrandVRFIntegrator, ILayerZeroReceiver {

    // Mapping to track pending VRF requests
    mapping(uint256 => address) public pendingRequests;

    // Current round number
    uint256 public latestRound;

    // Latest randomness value
    uint256 public latestRandomness;

    // LayerZero endpoint
    ILayerZeroEndpoint public lzEndpoint;

    // Remote chain ID (Arbitrum)
    uint16 public remoteChainId;

    // Remote trusted address
    bytes public trustedRemote;

    event RandomnessRequested(uint256 indexed requestId, address indexed consumer);
    event RandomnessFulfilled(uint256 indexed requestId, uint256 randomness);

    constructor(address _lzEndpoint, uint16 _remoteChainId) {
        lzEndpoint = ILayerZeroEndpoint(_lzEndpoint);
        remoteChainId = _remoteChainId;
    }

    function requestRandomness(address consumer) external returns (uint256 requestId) {
        requestId = uint256(keccak256(abi.encodePacked(block.timestamp, consumer, msg.sender)));
        pendingRequests[requestId] = consumer;

        emit RandomnessRequested(requestId, consumer);

        // Send LayerZero message to Arbitrum to request Chainlink VRF
        bytes memory payload = abi.encode(requestId, consumer);

        // Estimate LayerZero fees (paid in $S on Sonic)
        (uint256 messageFee, ) = lzEndpoint.estimateFees(
            remoteChainId,
            address(this),
            payload,
            false,
            bytes("")
        );

        require(address(this).balance >= messageFee, "Insufficient $S for LayerZero fee");

        // Send the cross-chain message (fee paid in $S)
        lzEndpoint.send{value: messageFee}(
            remoteChainId,           // destination chainId
            trustedRemote,           // destination address (OmniDragonVRFRequester on Arbitrum)
            payload,                 // encoded request data
            payable(address(this)),  // refund address
            address(0),              // future parameter
            bytes("")                // adapter params
        );

        return requestId;
    }

    function lzReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload) external override {
        require(msg.sender == address(lzEndpoint), "ChainlinkVRFIntegrator: Only endpoint");
        require(_srcChainId == remoteChainId, "ChainlinkVRFIntegrator: Invalid source chain");

        // Decode the payload to get requestId and randomness
        (uint256 requestId, uint256 randomness) = abi.decode(_payload, (uint256, uint256));

        // Get the requesting consumer
        address consumer = pendingRequests[requestId];
        require(consumer != address(0), "ChainlinkVRFIntegrator: Unknown request");

        // Update state
        latestRound++;
        latestRandomness = randomness;

        // Clean up the request
        delete pendingRequests[requestId];

        // Forward to the requesting consumer
        IOmniDragonVRFConsumer(consumer).fulfillRandomness(requestId, randomness, 0); // 0 for round since Chainlink doesn't use rounds

        emit RandomnessFulfilled(requestId, randomness);
    }

    function setTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress) external onlyOwner {
        trustedRemote = _srcAddress;
    }

    // Implement IDrandVRFIntegrator interface
    function getLatestRandomness() external view override returns (uint256 random, uint256 round) {
        return (latestRandomness, latestRound);
    }

    function fulfillRandomness(uint256 _requestId) external payable override {
        // This function is called by the interface but actual fulfillment happens in lzReceive
        // Implementation depends on specific requirements
        revert("ChainlinkVRFIntegrator: Use lzReceive for fulfillment");
    }

    /**
     * @dev Withdraw contract balance in $S (emergency function)
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Receive function to accept $S for LayerZero fees
     */
    receive() external payable {}
}
