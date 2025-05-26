// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title DragonFeeProcessingLib
 * @dev Library for efficient fee calculation and distribution processing
 *
 * Handles complex fee structures including jackpot, ve69LP, and burn mechanisms
 * Optimized for gas efficiency and secure fee distribution operations
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */

library DragonFeeProcessingLib {
    using SafeERC20 for IERC20;

    struct Fees {
        uint256 jackpot;
        uint256 ve69LP;
        uint256 burn;
        uint256 total;
    }

    uint256 public constant MAX_FEE_BASIS_POINTS = 1500; // Maximum 15% fees

    error FeesTooHigh();

    /**
     * @dev Validates fee values to ensure they don't exceed limits
     */
    function validateFees(uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee) external pure returns (uint256) {
        uint256 total = jackpotFee + ve69Fee + burnFee;
        if (total > MAX_FEE_BASIS_POINTS) revert FeesTooHigh();
        return total;
    }

    /**
     * @dev Calculate fee amounts based on transaction amount and fee rates
     */
    function calculateFeeAmounts(
        uint256 amount,
        uint256 jackpotFee,
        uint256 ve69Fee,
        uint256 burnFee
    ) external pure returns (
        uint256 burnAmount,
        uint256 jackpotAmount,
        uint256 ve69Amount,
        uint256 totalFeeAmount
    ) {
        uint256 feeBase = amount / 10000;
        burnAmount = burnFee * feeBase;
        jackpotAmount = jackpotFee * feeBase;
        ve69Amount = ve69Fee * feeBase;
        totalFeeAmount = burnAmount + jackpotAmount + ve69Amount;

        return (burnAmount, jackpotAmount, ve69Amount, totalFeeAmount);
    }

    /**
     * @dev Calculate fee distribution ratio for swapped tokens
     */
    function calculateDistributionRatio(
        uint256 wrappedNativeReceived,
        uint256 jackpotFeeRate,
        uint256 ve69FeeRate
    ) external pure returns (uint256 jackpotShare, uint256 ve69Share) {
        uint256 totalFeeBasis = jackpotFeeRate + ve69FeeRate;

        if (totalFeeBasis == 0) return (0, 0);

        jackpotShare = (wrappedNativeReceived * jackpotFeeRate) / totalFeeBasis;
        ve69Share = wrappedNativeReceived - jackpotShare;

        return (jackpotShare, ve69Share);
    }

    /**
     * @dev Apply simple voting power fee reduction
     */
    function applyVotingPowerReduction(
        uint256 votingPower,
        uint256 jackpotFee,
        uint256 ve69Fee,
        uint256 burnFee
    ) external pure returns (uint256, uint256, uint256, uint256) {
        if (votingPower == 0) {
            return (jackpotFee, ve69Fee, burnFee, jackpotFee + ve69Fee + burnFee);
        }

        // Simple fee reduction based on voting power (max 5% reduction)
        uint256 reduction = (votingPower * 500) / 10000;
        jackpotFee = jackpotFee > reduction ? jackpotFee - reduction : 0;
        ve69Fee = ve69Fee > reduction ? ve69Fee - reduction : 0;
        uint256 totalFee = jackpotFee + ve69Fee + burnFee;

        return (jackpotFee, ve69Fee, burnFee, totalFee);
    }
}
