// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IDrandVRFIntegrator
 * @dev Interface for Drand VRF integration within the OmniDragon ecosystem
 *
 * Defines integration points for League of Entropy's Drand randomness beacon
 * Provides free, verifiable randomness for cost-efficient lottery operations
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
interface IDrandVRFIntegrator {
    /**
     * @dev Returns the latest randomness value
     * @return random The randomness value
     * @return round The round number
     */
    function getLatestRandomness() external view returns (uint256 random, uint256 round);

    /**
     * @dev Fulfills a randomness request
     * @param _requestId The request ID to fulfill
     */
    function fulfillRandomness(uint256 _requestId) external payable;
}
