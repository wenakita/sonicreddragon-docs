// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IDragonJackpotVault
 * @dev Interface for the Dragon Jackpot Vault system
 *
 * Manages jackpot accumulation, distribution, and lottery mechanics
 * Core component of the OmniDragon tokenomics and reward system
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */

/**
 * @title IDragonJackpotVault
 * @dev Interface for the Dragon Jackpot Vault system
 *
 * Manages jackpot accumulation, distribution, and lottery mechanics
 * Core component of the OmniDragon tokenomics and reward system
 */
interface IDragonJackpotVault {
    /**
     * @dev Add to the jackpot
     * @param amount The amount to add
     */
    function addToJackpot(uint256 amount) external;

    /**
     * @notice Get the current jackpot balance
     * @return balance The current jackpot balance
     */
    function getJackpotBalance() external view returns (uint256 balance);

    /**
     * @notice Pay out a jackpot to a winner
     * @param winner Address of the winner
     * @param amount Amount to pay
     */
    function payJackpot(address winner, uint256 amount) external;

    /**
     * @notice Get the time of the last jackpot win
     * @return timestamp The last win timestamp
     */
    function getLastWinTime() external view returns (uint256 timestamp);

    /**
     * @notice Set the wrapped native token address
     * @param _wrappedNativeToken The new wrapped native token address
     */
    function setWrappedNativeToken(address _wrappedNativeToken) external;
}
