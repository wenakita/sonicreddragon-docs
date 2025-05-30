// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IOmniDragonVRFConsumer
 * @dev Interface for OmniDragon contracts that consume VRF randomness from any source
 *
 * Used by both Chainlink and Drand integrators to deliver randomness to OmniDragon ecosystem
 * The round parameter can be ignored for sources that don't use rounds (like Chainlink)
 */
interface IOmniDragonVRFConsumer {
    /**
     * @dev Callback function used by VRF integrators to deliver randomness
     * @param requestId The ID of the request
     * @param randomness The random result
     * @param round The round number (0 for sources without rounds)
     */
    function fulfillRandomness(
        uint256 requestId,
        uint256 randomness,
        uint256 round
    ) external;
}
