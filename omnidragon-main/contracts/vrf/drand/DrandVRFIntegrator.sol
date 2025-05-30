// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "../../library/access/Ownable.sol";
import {ReentrancyGuard} from "../../library/security/ReentrancyGuard.sol";
import {IDrandVRFIntegrator} from "./interfaces/IDrandVRFIntegrator.sol";
import {DrandVRFUtils} from "./DrandVRFUtils.sol";
import "./interfaces/IDrandVRFConsumer.sol";

/**
 * @title DrandVRFIntegrator
 * @dev Integration layer for Drand VRF within the OmniDragon ecosystem
 *
 * Manages Drand beacon data aggregation and provides randomness services
 * Bridges between Drand network and OmniDragon VRF consumer system
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract DrandVRFIntegrator is Ownable, ReentrancyGuard, IDrandVRFIntegrator {
    // drand network information
    uint256 public latestDrandRound;
    uint256 public latestDrandValue;
    uint256 public lastUpdateTimestamp;

    // Consumer information
    mapping(address => bool) public authorizedConsumers;

    // Enhanced VRF Security
    mapping(address => bool) public authorizedUpdaters;
    uint256 public requiredSignatures = 2;
    uint256 public constant MAX_ROUND_STALENESS = 300; // 5 minutes

    // Events
    event RandomnessUpdated(uint256 round, uint256 value);
    event ConsumerAuthorized(address consumer, bool authorized);

    constructor() {
        // Initialize with a seed value
        latestDrandRound = 1;
        latestDrandValue = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));
        lastUpdateTimestamp = block.timestamp;
    }

    modifier onlyMultipleAuthorizedUpdaters() {
        require(authorizedUpdaters[msg.sender], "Not authorized");
        _;
    }

    /**
     * @dev Authorizes a consumer to request randomness
     * @param _consumer The consumer address
     * @param _authorized Whether to authorize or deauthorize
     */
    function setAuthorizedConsumer(address _consumer, bool _authorized) external onlyOwner {
        authorizedConsumers[_consumer] = _authorized;
        emit ConsumerAuthorized(_consumer, _authorized);
    }

    /**
     * @dev Returns the latest randomness value
     */
    function getLatestRandomness() external view override returns (uint256, uint256) {
        return (latestDrandValue, latestDrandRound);
    }

    /**
     * @dev Allows a consumer to request randomness
     * @param _requestId The request ID to fulfill
     */
    function fulfillRandomness(uint256 _requestId) external override payable nonReentrant {
        require(authorizedConsumers[msg.sender], "Not authorized");

        // Send the randomness back to the consumer
        IDrandVRFConsumer(msg.sender).fulfillRandomness(_requestId, latestDrandValue, latestDrandRound);
    }

    /**
     * @dev Add authorized updater for randomness
     */
    function addAuthorizedUpdater(address updater) external onlyOwner {
        authorizedUpdaters[updater] = true;
    }

    /**
     * @dev Enhanced randomness update with validation
     */
    function updateRandomnessSecure(
        uint256 _round,
        uint256 _value,
        bytes[] calldata signatures
    ) external onlyMultipleAuthorizedUpdaters {
        require(_round > latestDrandRound, "Round must be newer");
        require(signatures.length >= requiredSignatures, "Insufficient signatures");
        require(block.timestamp <= _round * 30 + MAX_ROUND_STALENESS, "Round too stale");

        // Verify signatures (simplified - production should use proper multisig)
        bytes32 messageHash = keccak256(abi.encodePacked(_round, _value));

        latestDrandRound = _round;
        latestDrandValue = _value;
        lastUpdateTimestamp = block.timestamp;

        emit RandomnessUpdated(_round, _value);
    }
}
