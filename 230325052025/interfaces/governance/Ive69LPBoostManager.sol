// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Ive69LPBoostManager
 * @dev Interface for ve69LP boost management
 */
interface Ive69LPBoostManager {
    function calculateBoost(address user) external view returns (uint256);
    function isSpecialEventActive() external view returns (bool);
    function getNormalizedBoostMultiplier(address user) external view returns (uint256);
}
