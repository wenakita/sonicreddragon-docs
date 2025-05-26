// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DrandVRFUtils
 * @dev Contains utility functions for working with Drand VRF randomness
 */
library DrandVRFUtils {
    struct RequestStatus {
        bool fulfilled;
        uint256 randomness;
        uint256 timestamp;
    }

    /**
     * @dev Calculate a random number between min and max from a seed
     * @param _seed The random seed to use
     * @param _min The minimum value (inclusive)
     * @param _max The maximum value (inclusive)
     * @return A random number between min and max
     */
    function getRandomInRange(
        uint256 _seed,
        uint256 _min,
        uint256 _max
    ) internal pure returns (uint256) {
        require(_max > _min, "Max must be greater than min");
        uint256 range = _max - _min + 1;
        return _min + (_seed % range);
    }

    /**
     * @dev Generate multiple random numbers from a seed
     * @param _seed The random seed to use
     * @param _count The number of random numbers to generate
     * @return An array of random numbers
     */
    function getMultipleRandomNumbers(
        uint256 _seed,
        uint256 _count
    ) internal pure returns (uint256[] memory) {
        uint256[] memory numbers = new uint256[](_count);

        for (uint256 i = 0; i < _count; i++) {
            // Use a different seed for each number by hashing the original seed with the index
            uint256 newSeed = uint256(keccak256(abi.encode(_seed, i)));
            numbers[i] = newSeed;
        }

        return numbers;
    }

    /**
     * @dev Generate a random subset of indices from a range
     * @param _seed The random seed to use
     * @param _count The number of indices to select
     * @param _max The maximum index value (exclusive)
     * @return An array of random indices
     */
    function getRandomIndices(
        uint256 _seed,
        uint256 _count,
        uint256 _max
    ) internal pure returns (uint256[] memory) {
        require(_count <= _max, "Count must be less than or equal to max");

        uint256[] memory indices = new uint256[](_count);
        uint256[] memory availableIndices = new uint256[](_max);

        // Initialize available indices
        for (uint256 i = 0; i < _max; i++) {
            availableIndices[i] = i;
        }

        // Select random indices
        for (uint256 i = 0; i < _count; i++) {
            // Use a different seed for each selection
            uint256 newSeed = uint256(keccak256(abi.encode(_seed, i)));
            uint256 remainingCount = _max - i;
            uint256 randomIndex = newSeed % remainingCount;

            // Select the random index
            indices[i] = availableIndices[randomIndex];

            // Replace the selected index with the last available index
            availableIndices[randomIndex] = availableIndices[remainingCount - 1];
        }

        return indices;
    }

    /**
     * @dev Shuffle an array using a random seed
     * @param _seed The random seed to use
     * @param _array The array to shuffle
     */
    function shuffleArray(
        uint256 _seed,
        uint256[] memory _array
    ) internal pure returns (uint256[] memory) {
        uint256 length = _array.length;
        uint256[] memory shuffled = new uint256[](length);

        // Copy the array
        for (uint256 i = 0; i < length; i++) {
            shuffled[i] = _array[i];
        }

        // Shuffle the array
        for (uint256 i = length - 1; i > 0; i--) {
            // Use a different seed for each swap
            uint256 newSeed = uint256(keccak256(abi.encode(_seed, i)));
            uint256 j = newSeed % (i + 1);

            // Swap elements
            uint256 temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }

        return shuffled;
    }
}
