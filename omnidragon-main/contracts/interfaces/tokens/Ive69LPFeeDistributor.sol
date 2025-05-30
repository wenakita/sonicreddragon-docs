// SPDX-License-Identifier: MIT

/**
 * Interface: Ive69LPFeeDistributor
 *
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */

pragma solidity ^0.8.20;

/**
 * @title Ive69LPFeeDistributor
 * @dev Interface for the ve69LP fee distributor contract
 *
 * Manages fee collection and distribution to ve69LP holders
 * Core component of the OmniDragon revenue sharing mechanism
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
interface Ive69LPFeeDistributor {
    /**
     * @notice Receive rewards (DRAGON tokens) from external sources
     * @param _amount The amount of DRAGON tokens to receive
     */
    function receiveRewards(uint256 _amount) external;

    /**
     * @notice Distribute accumulated rewards to the ve69LP contract or reward mechanism
     */
    function distributeRewards() external;

    /**
     * @notice Get the current accumulated rewards that have not been distributed
     * @return The amount of undistributed rewards
     */
    function accumulatedRewards() external view returns (uint256);

    /**
     * @notice Set the DRAGON token address
     * @param _rewardToken The address of the DRAGON token
     */
    function setRewardToken(address _rewardToken) external;

    /**
     * @notice Update the ve69LP recipient address
     * @param _ve69LPAddress The new ve69LP contract or reward distributor address
     */
    function setVe69LPAddress(address _ve69LPAddress) external;

    /**
     * @notice Set the wrapped native token address
     * @param _wrappedNativeToken The new wrapped native token address
     */
    function setWrappedNativeToken(address _wrappedNativeToken) external;
}
