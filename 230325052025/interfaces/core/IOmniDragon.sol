// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IOmniDragon
 * @dev Interface for the OmniDragon token - Core Infrastructure
 *
 * Main interface defining the core functionality of the OmniDragon ecosystem
 * Handles native token swaps, fee distribution, and cross-chain operations
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
interface IOmniDragon {
    /**
     * @dev Process swap of native tokens ($S) to Dragon tokens and apply fees
     * @param _user The user who is swapping
     * @param _nativeAmount The amount of native tokens ($S) being swapped
     * @return swappableAmount The amount to be used for the actual swap after fees
     * @return nativeFeeAmount Total native amount that should be converted to fees
     * @return jackpotFeeAmount Native amount for jackpot (within nativeFeeAmount)
     * @return ve69FeeAmount Native amount for ve69LP (within nativeFeeAmount)
     */
    function processNativeSwapFees(address _user, uint256 _nativeAmount) external returns (uint256 swappableAmount, uint256 nativeFeeAmount, uint256 jackpotFeeAmount, uint256 ve69FeeAmount);

    /**
     * @dev Distribute fees to jackpot and ve69LP without triggering lottery entry
     * @param jackpotAmount Amount to send to jackpot
     * @param ve69Amount Amount to send to ve69LP
     */
    function distributeFees(uint256 jackpotAmount, uint256 ve69Amount) external;

    /**
     * @dev Get wrapped native token address
     * @return Address of the wrapped native token (WETH, wS, etc.)
     */
    function wrappedNativeToken() external view returns (address);
}
