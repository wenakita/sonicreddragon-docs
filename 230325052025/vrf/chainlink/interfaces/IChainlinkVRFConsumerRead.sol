// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IChainlinkVRFConsumerRead
 * @dev Read-only interface for Chainlink VRF Consumer
 */
interface IChainlinkVRFConsumerRead {
    /**
     * @dev Get the latest randomness value
     * @return value The latest random value
     * @return timestamp When the value was last updated
     */
    function getLatestRandomness() external view returns (
        uint256 value,
        uint256 timestamp
    );

    /**
     * @dev Check if a randomness request is fulfilled
     * @param _requestId The request ID to check
     * @return Whether the request is fulfilled
     */
    function isRequestFulfilled(uint256 _requestId) external view returns (bool);
}
