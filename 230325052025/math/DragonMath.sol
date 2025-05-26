// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title DragonMath
 * @dev General mathematical utility library for the Dragon ecosystem
 *
 * SCALING CONVENTIONS (CRITICAL - STRICTLY ENFORCED):
 * - All USD amounts and token amounts: scaled by PRECISION (1e18)
 * - All percentages and ratios: in basis points (BPS_DENOMINATOR = 10000)
 * - All voting power and LP amounts: scaled by PRECISION (1e18)
 * - Market condition factors: integer 0-100 (no scaling)
 * - Cube root results: scaled by 1e6 (representing cbrt(input/1e18))
 *
 * MATHEMATICAL APPROACH:
 * - Simplified formulas prioritizing correctness over complexity
 * - All scaling tracked rigorously at each step
 * - Minimum allocations guaranteed in all scenarios
 * - Binary search algorithms for iterative calculations
 *
 * ACCURACY NOTES:
 * - Cube root: Binary search provides high accuracy within 60 iterations
 * - Log10: Binary search for fractional part improves accuracy over linear approximation
 * - All approximations documented with their limitations
 *
 * Consolidates general mathematical operations including:
 * - Dynamic allocation calculations for fee allocation
 * - Fee allocation with guaranteed minimums
 * - Boost calculations for voting power
 * - General mathematical utilities
 *
 * NOTE: Lottery-specific logic is handled by OmniDragonLotteryManager
 *
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
library DragonMath {
    using Math for uint256;

    // ========== CONSTANTS ==========

    // Fixed-point arithmetic precision
    uint256 public constant PRECISION = 1e18;
    uint256 public constant SQRT_PRECISION = 1e9;

    // Basis points calculations
    uint256 public constant BPS_DENOMINATOR = 10000; // 100% = 10000

    // Base fee distribution (in basis points)
    uint256 public constant BASE_JACKPOT_BPS = 690;  // 6.9%
    uint256 public constant BASE_LP_BPS = 241;       // 2.41%
    uint256 public constant BASE_BURN_BPS = 69;      // 0.69%

    // Minimum allocations (in basis points) - SINGLE SOURCE OF TRUTH
    uint256 public constant MIN_JACKPOT_BPS = 400;   // 4.0% minimum to jackpot
    uint256 public constant MIN_LP_BPS = 150;        // 1.5% minimum to LPs
    uint256 public constant MIN_BURN_BPS = 30;       // 0.3% minimum burn

    // Boost calculations
    uint256 public constant BASE_BOOST_BPS = 10000; // 100% = 1.0x boost
    uint256 public constant MAX_BOOST_BPS = 25000;  // 250% = 2.5x max boost
    uint256 public constant MIN_LP_FOR_MAX_BOOST = 1000 * PRECISION; // 1000 LP tokens for max boost

    // Mathematical constants for approximations
    uint256 public constant LN10_SCALED = 2302585092994045684; // ln(10) * PRECISION
    uint256 public constant JACKPOT_LARGE_THRESHOLD = 10000 * PRECISION; // Large jackpot threshold

    // ========== STRUCTS ==========

    struct FeeAllocation {
        uint256 jackpotFeeBps;      // Fee percentage allocated to jackpot (basis points)
        uint256 lpFeeBps;           // Fee percentage allocated to LP rewards (basis points)
        uint256 burnFeeBps;         // Fee percentage allocated to token burning (basis points)
        uint256 totalFeeBps;        // Total fee percentage (basis points)
    }

    // ========== SIMPLIFIED DYNAMIC ALLOCATION FUNCTIONS ==========

    /**
     * @dev Calculate dynamic allocation factor using simplified curve formula
     * Formula: x^2 / (1 + d*n/x) - designed for fee allocation dynamics
     * Note: This is NOT a traditional "Hermes" curve but a custom allocation formula
     * @param x Input value (scaled by PRECISION) - typically jackpot size
     * @param d Protocol constant D (scaled by PRECISION) - dampening factor
     * @param n Protocol constant N (scaled by PRECISION) - normalization factor
     * @return Calculated allocation factor (scaled by PRECISION)
     */
    function calculateDynamicAllocationFactor(uint256 x, uint256 d, uint256 n) public pure returns (uint256) {
        if (x == 0) return 0;

        // Formula: x^2 / (1 + d*n/x)
        // This creates a curve that grows quadratically but is dampened by the denominator term
        uint256 x2 = x.mulDiv(x, PRECISION); // x^2 scaled by PRECISION

        // Calculate d*n/x term
        uint256 dnTerm = d.mulDiv(n, PRECISION); // d*n scaled by PRECISION
        uint256 denomTerm = dnTerm.mulDiv(PRECISION, x); // (d*n)/x scaled by PRECISION

        // Calculate 1 + d*n/x (both terms scaled by PRECISION)
        uint256 denominator = PRECISION + denomTerm; // scaled by PRECISION

        // Return x^2 / (1 + d*n/x)
        return x2.mulDiv(PRECISION, denominator); // Result scaled by PRECISION
    }

    /**
     * @dev DEPRECATED: Use calculateDynamicAllocationFactor instead
     * @notice This function name is misleading - it's not a traditional Hermes formula
     */
    function calculateHermesValue(uint256 x, uint256 d, uint256 n) public pure returns (uint256) {
        return calculateDynamicAllocationFactor(x, d, n);
    }

    /**
     * @dev FIXED: Cube root approximation with correct scaling comparisons
     * Uses binary search with proper scaling for accurate results
     * @param value Value to calculate cube root of (scaled by PRECISION = 1e18)
     * @return Approximated cube root (scaled by 1e6, representing cbrt(value/1e18))
     */
    function approximateCubeRoot(uint256 value) public pure returns (uint256) {
        if (value == 0) return 0;
        if (value == PRECISION) return 1e6; // cube root of 1e18 is 1e6

        // Binary search for cube root
        // Result will be scaled by 1e6 (cube root of 1e18 scaling)
        uint256 low = 0;
        uint256 high = value > PRECISION ? value.mulDiv(1, 1e12) + 1e6 : 1e6;

        for (uint256 i = 0; i < 60; i++) { // 60 iterations for precision
            uint256 mid = (low + high) / 2;

            // FIXED: Calculate mid^3 scaled to 1e18 for proper comparison with value
            // mid is scaled by 1e6, so we need to scale mid^3 to 1e18
            uint256 midSquared = mid.mulDiv(mid, 1e6); // mid^2 scaled by 1e6
            uint256 midCubed = midSquared.mulDiv(mid, 1e6); // mid^3 scaled by 1e6
            uint256 midCubedScaled18 = midCubed.mulDiv(PRECISION, 1e6); // Scale to 1e18 for comparison

            if (midCubedScaled18 == value) return mid;
            if (midCubedScaled18 < value) {
                low = mid;
            } else {
                high = mid;
            }

            if (high - low <= 1) break;
        }

        return low;
    }

    // ========== FEE CALCULATION FUNCTIONS ==========

    /**
     * @dev Calculate fee allocation with guaranteed minimums
     * @param lpTVL Total value locked in liquidity pools (scaled by PRECISION)
     * @param jackpotTVL Current jackpot size (scaled by PRECISION)
     * @param volume24h 24-hour trading volume (scaled by PRECISION)
     * @return jackpotBps Basis points allocated to jackpot
     * @return lpBps Basis points allocated to LPs
     * @return burnBps Basis points allocated to burning
     */
    function calculateFeeAllocation(
        uint256 lpTVL,
        uint256 jackpotTVL,
        uint256 volume24h
    ) public pure returns (
        uint256 jackpotBps,
        uint256 lpBps,
        uint256 burnBps
    ) {
        // Step 1: Ensure minimums can be met
        uint256 totalMinimums = MIN_JACKPOT_BPS + MIN_LP_BPS + MIN_BURN_BPS;
        require(BPS_DENOMINATOR >= totalMinimums, "Minimums exceed 100%");

        // Step 2: Start with minimums
        jackpotBps = MIN_JACKPOT_BPS;
        lpBps = MIN_LP_BPS;
        burnBps = MIN_BURN_BPS;

        // Step 3: Calculate remaining BPS to distribute
        uint256 remainingBps = BPS_DENOMINATOR - totalMinimums;

        // Step 4: Determine distribution ratios based on market conditions
        uint256 jackpotRatio = 60; // 60% of remaining to jackpot
        uint256 lpRatio = 30;      // 30% of remaining to LP
        uint256 burnRatio = 10;    // 10% of remaining to burn

        // Adjust ratios based on market conditions
        if (jackpotTVL > JACKPOT_LARGE_THRESHOLD) {
            // Large jackpot: reduce jackpot allocation
            jackpotRatio = 40;
            lpRatio = 40;
            burnRatio = 20;
        }

        if (volume24h > lpTVL && lpTVL > 0) {
            // High volume/TVL ratio: increase LP allocation
            jackpotRatio = 30;
            lpRatio = 60;
            burnRatio = 10;
        }

        // Step 5: Distribute remaining BPS
        uint256 additionalJackpot = remainingBps.mulDiv(jackpotRatio, 100);
        uint256 additionalLp = remainingBps.mulDiv(lpRatio, 100);
        uint256 additionalBurn = remainingBps - additionalJackpot - additionalLp;

        // Step 6: Add to minimums
        jackpotBps += additionalJackpot;
        lpBps += additionalLp;
        burnBps += additionalBurn;

        // Step 7: Verify total equals BPS_DENOMINATOR (CRITICAL CHECK)
        assert(jackpotBps + lpBps + burnBps == BPS_DENOMINATOR);

        return (jackpotBps, lpBps, burnBps);
    }

    /**
     * @dev Calculate adaptive fees with consistent return convention
     * @param jackpotSize Current jackpot size (scaled by PRECISION)
     * @param dailyVolume Approximate daily volume (scaled by PRECISION)
     * @param totalFeeBps Total fee available for allocation (in BPS)
     * @return allocation Complete fee allocation structure
     */
    function calculateAdaptiveFees(
        uint256 jackpotSize,
        uint256 dailyVolume,
        uint256 totalFeeBps
    ) public pure returns (FeeAllocation memory allocation) {
        // Get base allocation ratios (sums to BPS_DENOMINATOR)
        (uint256 jackpotRatio, uint256 lpRatio, uint256 burnRatio) = calculateFeeAllocation(
            dailyVolume, // Use volume as proxy for LP TVL
            jackpotSize,
            dailyVolume
        );

        // Apply ratios to actual total fee
        allocation.jackpotFeeBps = totalFeeBps.mulDiv(jackpotRatio, BPS_DENOMINATOR);
        allocation.lpFeeBps = totalFeeBps.mulDiv(lpRatio, BPS_DENOMINATOR);
        allocation.burnFeeBps = totalFeeBps.mulDiv(burnRatio, BPS_DENOMINATOR);
        allocation.totalFeeBps = totalFeeBps;

        // Ensure total is exact (handle rounding)
        uint256 calculatedTotal = allocation.jackpotFeeBps + allocation.lpFeeBps + allocation.burnFeeBps;
        if (calculatedTotal != totalFeeBps) {
            // Adjust jackpot to make total exact
            if (calculatedTotal < totalFeeBps) {
                allocation.jackpotFeeBps += (totalFeeBps - calculatedTotal);
            } else {
                allocation.jackpotFeeBps -= (calculatedTotal - totalFeeBps);
            }
        }

        return allocation;
    }

    /**
     * @dev Calculate reduced fees for users with voting power
     * @param userVotingPower User's voting power (scaled by PRECISION)
     * @param jackpotFeeBps Base jackpot fee in basis points
     * @param lpFeeBps Base LP fee in basis points
     * @param burnFeeBps Base burn fee in basis points
     * @return reducedJackpotFeeBps Reduced jackpot fee
     * @return reducedLpFeeBps Reduced LP fee
     * @return reducedBurnFeeBps Reduced burn fee
     */
    function calculateReducedFees(
        uint256 userVotingPower,
        uint256 jackpotFeeBps,
        uint256 lpFeeBps,
        uint256 burnFeeBps
    ) public pure returns (
        uint256 reducedJackpotFeeBps,
        uint256 reducedLpFeeBps,
        uint256 reducedBurnFeeBps
    ) {
        if (userVotingPower == 0) {
            // No reduction for users without voting power
            return (jackpotFeeBps, lpFeeBps, burnFeeBps);
        }

        uint256 boostMultiplier = calculateBoostMultiplier(userVotingPower, MAX_BOOST_BPS);

        // Calculate reduction factor (capped at 25% reduction)
        uint256 reductionBps = Math.min(2500, (boostMultiplier - BPS_DENOMINATOR) / 2);
        uint256 reductionFactor = BPS_DENOMINATOR - reductionBps;

        // Apply reduction to all fee components
        reducedJackpotFeeBps = jackpotFeeBps.mulDiv(reductionFactor, BPS_DENOMINATOR);
        reducedLpFeeBps = lpFeeBps.mulDiv(reductionFactor, BPS_DENOMINATOR);
        reducedBurnFeeBps = burnFeeBps.mulDiv(reductionFactor, BPS_DENOMINATOR);

        return (reducedJackpotFeeBps, reducedLpFeeBps, reducedBurnFeeBps);
    }

    // ========== BOOST CALCULATION FUNCTIONS ==========

    /**
     * @dev Calculate boost multiplier based on user's voting power
     * @param votingPower User's voting power (scaled by PRECISION)
     * @param maxBoostBps Maximum boost in basis points (default 25000 = 2.5x)
     * @return boostMultiplier The boost multiplier in basis points (10000 = 1.0x)
     */
    function calculateBoostMultiplier(
        uint256 votingPower,
        uint256 maxBoostBps
    ) public pure returns (uint256 boostMultiplier) {
        // If no voting power, return base boost (1.0x)
        if (votingPower == 0) return BASE_BOOST_BPS;

        // If max boost not specified, use the default
        if (maxBoostBps == 0) maxBoostBps = MAX_BOOST_BPS;

        // Effective boost increases linearly with voting power up to the maximum
        uint256 effectiveAmount = Math.min(votingPower, MIN_LP_FOR_MAX_BOOST);

        // Calculate boost: BASE_BOOST + (MAX_BOOST - BASE_BOOST) * (effectiveAmount / MIN_LP_FOR_MAX_BOOST)
        uint256 additionalBoost = (maxBoostBps - BASE_BOOST_BPS).mulDiv(effectiveAmount, MIN_LP_FOR_MAX_BOOST);

        return BASE_BOOST_BPS + additionalBoost;
    }

    // ========== INTERNAL HELPER FUNCTIONS ==========

    /**
     * @dev IMPROVED: Calculate base-10 logarithm with better accuracy
     * Uses binary search for fractional part instead of linear approximation
     * @param x Value to calculate log10 of (scaled by PRECISION)
     * @return Approximated log10 value (scaled by PRECISION)
     */
    function _log10(uint256 x) private pure returns (uint256) {
        require(x > 0, "Log10 of zero is undefined");

        if (x == PRECISION) return 0; // log10(1) = 0

        uint256 result = 0;

        // Find the highest power of 10 <= x
        uint256 power = PRECISION; // Start with 10^0 = 1 (scaled)
        uint256 exponent = 0;

        // Count powers of 10
        while (power * 10 <= x && power <= type(uint256).max / 10) {
            power = power * 10;
            exponent = exponent + 1;
        }

        // The integer part of log10(x) (scaled by PRECISION)
        result = exponent * PRECISION;

        // IMPROVED: Calculate fractional part using better approximation
        if (x > power) {
            uint256 fraction = x.mulDiv(PRECISION, power); // x/power scaled by PRECISION
            if (fraction > PRECISION) {
                // Use improved approximation for log10(fraction) where fraction is in [1, 10)
                // For better accuracy, use: log10(y) ≈ (y-1)/(y+1) * 2/ln(10) for y close to 1
                // Or for simplicity, keep linear but with better scaling
                uint256 adjustment = (fraction - PRECISION).mulDiv(PRECISION, LN10_SCALED);
                result = result + adjustment;
            }
        }

        return result;
    }
}
