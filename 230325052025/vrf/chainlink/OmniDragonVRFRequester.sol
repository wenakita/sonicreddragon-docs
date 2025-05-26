// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "../../library/security/ReentrancyGuard.sol";
import "../../interfaces/external/layerzero/ILayerZeroEndpoint.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "./interfaces/IOmniDragonVRFRequester.sol";

/**
 * @title OmniDragonVRFRequester
 * @dev OmniDragon's main VRF requester deployed on Arbitrum for cost-efficient Chainlink VRF 2.5 requests
 *
 * Integrates with the OmniDragon ecosystem by sending randomness to Sonic via LayerZero
 * Part of the multi-source VRF aggregation system in OmniDragonVRFConsumer
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract OmniDragonVRFRequester is VRFConsumerBaseV2Plus, ReentrancyGuard, IOmniDragonVRFRequester {

    // VRF 2.5 Configuration
    uint256 public subscriptionId;  // VRF 2.5 uses uint256
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 100000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    // LayerZero Configuration
    ILayerZeroEndpoint public lzEndpoint;
    uint16 public sonicChainId;
    bytes public sonicVRFIntegratorPath;

    // Request tracking
    mapping(uint256 => uint256) public vrfRequestToSonicRequest;
    mapping(uint256 => address) public requestIdToRequester;

    // Events
    event VRFRequested(uint256 indexed vrfRequestId, uint256 indexed sonicRequestId, address requester);
    event VRFFulfilled(uint256 indexed vrfRequestId, uint256 randomness);
    event RandomnessSentToSonic(uint256 indexed sonicRequestId, uint256 randomness);

    constructor(
        address vrfCoordinator,
        uint256 _subscriptionId,  // VRF 2.5 uses uint256
        bytes32 _keyHash,
        address _lzEndpoint,
        uint16 _sonicChainId,
        bytes memory _sonicVRFIntegratorPath
    ) VRFConsumerBaseV2Plus(vrfCoordinator) {
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        lzEndpoint = ILayerZeroEndpoint(_lzEndpoint);
        sonicChainId = _sonicChainId;
        sonicVRFIntegratorPath = _sonicVRFIntegratorPath;
    }

    /**
     * @dev Request VRF and prepare to send to Sonic
     * @param _sonicRequestId The request ID from Sonic
     * @param _requester The address requesting randomness
     */
    function requestVRF(uint256 _sonicRequestId, address _requester) external payable nonReentrant {
        // Estimate LayerZero fees
        bytes memory payload = abi.encode(_sonicRequestId, 0); // 0 will be replaced with actual randomness
        (uint256 messageFee, ) = lzEndpoint.estimateFees(
            sonicChainId,
            address(this),
            payload,
            false,
            bytes("")
        );

        require(msg.value >= messageFee, "Insufficient fee for LayerZero");

        // Request VRF using VRF 2.5 format
        uint256 vrfRequestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
            })
        );

        // Track the request
        vrfRequestToSonicRequest[vrfRequestId] = _sonicRequestId;
        requestIdToRequester[_sonicRequestId] = _requester;

        emit VRFRequested(vrfRequestId, _sonicRequestId, _requester);
    }

    /**
     * @dev Callback function used by VRF Coordinator (VRF 2.5 format)
     */
    function fulfillRandomWords(uint256 _vrfRequestId, uint256[] calldata _randomWords) internal override {
        uint256 sonicRequestId = vrfRequestToSonicRequest[_vrfRequestId];
        require(sonicRequestId != 0, "Unknown VRF request");

        uint256 randomness = _randomWords[0];

        emit VRFFulfilled(_vrfRequestId, randomness);

        // Send randomness to Sonic via LayerZero
        _sendRandomnessToSonic(sonicRequestId, randomness);

        // Clean up
        delete vrfRequestToSonicRequest[_vrfRequestId];
    }

    /**
     * @dev Send randomness to Sonic via LayerZero
     */
    function _sendRandomnessToSonic(uint256 _sonicRequestId, uint256 _randomness) internal {
        bytes memory payload = abi.encode(_sonicRequestId, _randomness);

        // Estimate fees again to be safe
        (uint256 messageFee, ) = lzEndpoint.estimateFees(
            sonicChainId,
            address(this),
            payload,
            false,
            bytes("")
        );

        // CRITICAL FIX: Check sufficient balance before sending
        require(address(this).balance >= messageFee, "Insufficient balance for LayerZero fees");

        // Send message to Sonic
        lzEndpoint.send{value: messageFee}(
            sonicChainId,
            sonicVRFIntegratorPath,
            payload,
            payable(address(this)),
            address(0),
            bytes("")
        );

        emit RandomnessSentToSonic(_sonicRequestId, _randomness);
    }

    /**
     * @dev Estimate fees for cross-chain request
     */
    function estimateFees(
        uint16 _dstChainId,
        bytes memory _payload
    ) external view override returns (uint256 fee) {
        (fee, ) = lzEndpoint.estimateFees(_dstChainId, address(this), _payload, false, bytes(""));
    }

    /**
     * @dev Update VRF settings
     */
    function updateVRFSettings(
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numWords
    ) external override onlyOwner {
        callbackGasLimit = _callbackGasLimit;
        requestConfirmations = _requestConfirmations;
        numWords = _numWords;
    }

    /**
     * @dev Update LayerZero configuration
     */
    function updateLayerZeroConfig(
        uint16 _sonicChainId,
        bytes memory _sonicVRFIntegratorPath
    ) external onlyOwner {
        sonicChainId = _sonicChainId;
        sonicVRFIntegratorPath = _sonicVRFIntegratorPath;
    }

    /**
     * @dev Update VRF subscription
     */
    function updateSubscription(uint256 _subscriptionId) external onlyOwner {
        subscriptionId = _subscriptionId;
    }

    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
