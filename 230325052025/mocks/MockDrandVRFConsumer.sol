// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../vrf/drand/DrandVRFConsumer.sol";

/**
 * @title MockDrandVRFConsumer
 * @dev Mock implementation of DrandVRFConsumer for testing purposes
 */
contract MockDrandVRFConsumer is DrandVRFConsumer {
    // Track the last randomness value received
    uint256 public lastRandomValue;
    uint256 public lastRequestId;

    // Events
    event RandomnessReceived(uint256 requestId, uint256 randomValue);

    constructor(address _vrfIntegrator) DrandVRFConsumer(_vrfIntegrator) {}

    /**
     * @dev Make a request for randomness
     */
    function makeRequest() external returns (uint256) {
        lastRequestId = requestRandomness();
        return lastRequestId;
    }

    /**
     * @dev Override the internal fulfillRandomness function
     */
    function _fulfillRandomness(uint256 _requestId, uint256 _randomness) internal override {
        lastRandomValue = _randomness;
        emit RandomnessReceived(_requestId, _randomness);
    }

    /**
     * @dev Exposes the internal requestRandomness function for testing
     */
    function performRequestRandomness() external returns (uint256) {
        return requestRandomness();
    }
}
