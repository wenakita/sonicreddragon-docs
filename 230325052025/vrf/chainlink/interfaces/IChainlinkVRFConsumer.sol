// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IChainlinkVRFConsumer
 * @dev Interface for contracts that consume Chainlink VRF randomness
 */
interface IChainlinkVRFConsumer {
    /**
     * @dev Get the randomness data for a request
     * @param _requestId The request ID to get
     * @return fulfilled Whether the request is fulfilled
     * @return randomness The randomness value
     * @return timestamp The timestamp when the randomness was fulfilled
     */
    function getRandomnessData(uint256 _requestId) external view returns (
        bool fulfilled,
        uint256 randomness,
        uint256 timestamp
    );

    /**
     * @dev Calculate a random number in a range
     * @param _requestId The request ID to use
     * @param _min The minimum value (inclusive)
     * @param _max The maximum value (inclusive)
     * @return The random number in the range [_min, _max]
     */
    function getRandomInRange(uint256 _requestId, uint256 _min, uint256 _max) external view returns (uint256);
}
