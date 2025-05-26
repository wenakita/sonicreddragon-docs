// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../vrf/drand/DrandVRFUtils.sol";

/**
 * @title DrandVRFUtilsTest
 * @dev Test contract for DrandVRFUtils library
 */
contract DrandVRFUtilsTest {
    /**
     * @dev Test getRandomInRange function
     * @param _seed Random seed to use
     * @param _min Minimum value (inclusive)
     * @param _max Maximum value (inclusive)
     * @return Random number in the range [min, max]
     */
    function testGetRandomInRange(uint256 _seed, uint256 _min, uint256 _max) public pure returns (uint256) {
        return DrandVRFUtils.getRandomInRange(_seed, _min, _max);
    }

    /**
     * @dev Test getMultipleRandomNumbers function
     * @param _seed Random seed to use
     * @param _count Number of random numbers to generate
     * @return Array of random numbers
     */
    function testGetMultipleRandomNumbers(uint256 _seed, uint256 _count) public pure returns (uint256[] memory) {
        return DrandVRFUtils.getMultipleRandomNumbers(_seed, _count);
    }

    /**
     * @dev Test getRandomIndices function
     * @param _seed Random seed to use
     * @param _count Number of indices to select
     * @param _max Maximum index value (exclusive)
     * @return Array of random indices
     */
    function testGetRandomIndices(uint256 _seed, uint256 _count, uint256 _max) public pure returns (uint256[] memory) {
        return DrandVRFUtils.getRandomIndices(_seed, _count, _max);
    }

    /**
     * @dev Test shuffleArray function
     * @param _seed Random seed to use
     * @param _array Array to shuffle
     * @return Shuffled array
     */
    function testShuffleArray(uint256 _seed, uint256[] calldata _array) public pure returns (uint256[] memory) {
        return DrandVRFUtils.shuffleArray(_seed, _array);
    }
}
