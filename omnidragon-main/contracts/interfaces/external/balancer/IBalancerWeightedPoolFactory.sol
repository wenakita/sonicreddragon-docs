// SPDX-License-Identifier: MIT

/**
 * @title IBalancerWeightedPoolFactory
 * @dev Interface for Balancer weighted pool factory
 *
 * Enables creation of custom weighted pools for specialized trading pairs
 * Supports deployment of new liquidity pools within the OmniDragon ecosystem
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */

pragma solidity ^0.8.20;

interface IBalancerWeightedPoolFactory {
    /**
     * @dev Create a new weighted pool
     * @param name The name of the pool
     * @param symbol The symbol of the pool
     * @param tokens Array of token addresses in the pool
     * @param weights Array of weights for each token (normalized to 1e18)
     * @param swapFeePercentage The fee percentage (in 1e18 format, 0.01e18 = 1%)
     * @param owner The owner of the pool
     * @return The address of the newly created pool
     */
    function create(
        string memory name,
        string memory symbol,
        address[] memory tokens,
        uint256[] memory weights,
        uint256 swapFeePercentage,
        address owner
    ) external returns (address);
}
