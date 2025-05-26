// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IDrandVRFConsumer
 * @dev Interface for Drand VRF Consumer
 */
interface IDrandVRFConsumer {
    /**
     * @dev Callback function used by VRF Integrator to deliver randomness
     * @param _requestId The ID of the request
     * @param _randomness The random result
     * @param _round The round number
     */
    function fulfillRandomness(
        uint256 _requestId,
        uint256 _randomness,
        uint256 _round
    ) external;
}
