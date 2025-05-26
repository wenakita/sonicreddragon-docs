// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IJackpot
 * @dev Interface for jackpot functionality
 */
interface IJackpot {
    function getJackpotBalance() external view returns (uint256);
    function participateInJackpot(address user) external;
    function isEligibleForJackpot(address user) external view returns (bool);
    function enterJackpotWithWrappedNativeToken(address user, uint256 amount) external;
}
