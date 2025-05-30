// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title ve69LPMath
 * @dev Mathematical library for ve69LP voting power calculations
 *
 * Handles complex time-based voting power decay and boost calculations
 * Implements non-linear scaling for optimal governance participation incentives
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */

library ve69LPMath {
    using Math for uint256;

    // Constants for time calculations
    uint256 public constant WEEK = 7 * 86400; // 7 days in seconds
    uint256 public constant MAX_LOCK_TIME = 4 * 365 * 86400; // 4 years in seconds
    uint256 public constant MAX_LOCK_WEEKS = MAX_LOCK_TIME / WEEK; // ~208 weeks

    // Constants for basis points calculations
    uint256 public constant BPS_MAX = 10000; // 100% in basis points
    uint256 public constant PERCENTAGE_SCALE = 100;
    uint256 public constant PRECISION = 1e18; // High precision for calculations

    // Boost parameters
    uint256 public constant BASE_BOOST_BPS = 10000; // 100% = 1.0x boost
    uint256 public constant MAX_BOOST_BPS = 25000; // 250% = 2.5x max boost
    uint256 public constant MIN_LP_FOR_MAX_BOOST = 1000 ether; // 1000 LP tokens for max boost

    // Fee distribution base parameters (in basis points)
    uint256 public constant BASE_JACKPOT_BPS = 690;  // 69.0%
    uint256 public constant BASE_LP_BPS = 241;       // 24.1%
    uint256 public constant BASE_BURN_BPS = 69;      // 6.9%

    // Minimum fee allocations (in basis points)
    uint256 public constant MIN_JACKPOT_BPS = 400;   // 40.0% minimum to jackpot
    uint256 public constant MIN_LP_BPS = 150;        // 15.0% minimum to LPs
    uint256 public constant MIN_BURN_BPS = 30;       // 3.0% minimum burn

    // Jackpot parameters
    uint256 public constant BASE_JACKPOT_PAYOUT_BPS = 6900; // 69.0% base payout
    uint256 public constant MIN_JACKPOT_PAYOUT_BPS = 5000;  // 50.0% minimum payout

    // Lottery win parameters
    uint256 public constant BASE_WIN_PROB_BPS = 4;     // 0.0004% base win probability
    uint256 public constant MAX_WIN_PROB_BPS = 400;    // 0.04% maximum win probability
    uint256 public constant MIN_AMOUNT_USD = 1 ether;  // $1 minimum swap amount
    uint256 public constant MAX_AMOUNT_USD = 10000 ether; // $10,000 for max probability

    /**
     * @dev Calculate cube root (implementation specific to our precision needs)
     * @param n The number to find the cube root of
     * @return The cube root of n, with precision
     */
    function cubeRoot(uint256 n) public pure returns (uint256) {
        if (n == 0) return 0;

        // Use improved initial guess for faster convergence
        uint256 x;
        if (n <= PRECISION) {
            // For values <= 1, start with a value close to 1
            x = (n + 2 * PRECISION) / 3;
        } else {
            // For values > 1, use a logarithmic approximation for initial guess
            uint256 log2n = 0;
            uint256 temp = n;
            while (temp > PRECISION) {
                temp = temp / 2;
                log2n++;
            }
            x = 1 << (log2n / 3);

            // Ensure x is not zero (fallback)
            if (x == 0) x = n / 3;
        }

        // Apply Newton's method with improved convergence check
        for (uint256 i = 0; i < 8; i++) {
            uint256 x2 = x * x / PRECISION;
            if (x2 == 0) break;

            uint256 xCubed = x * x2 / PRECISION;

            // If we're already very close, break early
            if (xCubed > n * 995 / 1000 && xCubed < n * 1005 / 1000) {
                break;
            }

            // y = (2*x + n/x^2)/3
            uint256 term1 = 2 * x;
            uint256 term2;

            // Handle potential underflow in division
            if (x2 > 0) {
                term2 = n * PRECISION / x2;
                uint256 y = (term1 + term2 / x) / 3;

                // Check for convergence with tighter tolerance
                if ((y >= x && y - x < PRECISION / 10000) ||
                    (y < x && x - y < PRECISION / 10000)) {
                    x = y;
                    break;
                }

                x = y;
            } else {
                break;
            }
        }

        return x;
    }

    /**
     * @dev Calculate voting power using cube root normalization for more equitable distribution
     * @param amount The amount of tokens
     * @return votingPower The calculated voting power
     */
    function calculateVotingPower(uint256 amount) public pure returns (uint256 votingPower) {
        if (amount == 0) return 0;

        // Use cube root for more equitable voting power distribution
        return cubeRoot(amount * PRECISION) * 100;
    }

    /**
     * @dev Calculate voting power based on locked amount and lock duration
     * @param lockedAmount Amount of 69LP tokens locked
     * @param lockDuration Duration of the lock in seconds
     * @return votingPower The calculated voting power
     */
    function calculateVotingPowerWithLock(
        uint256 lockedAmount,
        uint256 lockDuration
    ) public pure returns (uint256 votingPower) {
        if (lockedAmount == 0) return 0;

        // Ensure lock duration is capped at MAX_LOCK_TIME
        lockDuration = Math.min(lockDuration, MAX_LOCK_TIME);

        // Calculate time ratio (0-1 scaled by PRECISION)
        uint256 timeRatio = (lockDuration * PRECISION) / MAX_LOCK_TIME;

        // Apply cube root scaling for non-linear boost
        uint256 nonLinearBoost = cubeRoot(timeRatio);

        // Scale by MAX_BOOST_BPS and apply to locked amount
        uint256 boostMultiplier = (nonLinearBoost * (MAX_BOOST_BPS - BASE_BOOST_BPS)) / PRECISION;
        uint256 effectiveBoost = BASE_BOOST_BPS + boostMultiplier;

        // Calculate boosted amount
        return (lockedAmount * effectiveBoost) / BPS_MAX;
    }

    /**
     * @dev Calculate effective voting power at a specific timestamp
     * @param lockedAmount Amount of 69LP tokens locked
     * @param lockEnd Timestamp when lock expires
     * @param timestamp Current timestamp to calculate voting power at
     * @return effectiveVotingPower The time-decayed voting power
     */
    function calculateEffectiveVotingPower(
        uint256 lockedAmount,
        uint256 lockEnd,
        uint256 timestamp
    ) public pure returns (uint256 effectiveVotingPower) {
        // If lock has expired, voting power is 0
        if (timestamp >= lockEnd) return 0;

        // Calculate remaining lock duration
        uint256 remainingLockTime = lockEnd - timestamp;

        // Calculate effective voting power
        return calculateVotingPowerWithLock(lockedAmount, remainingLockTime);
    }

    /**
     * @dev Calculate boost multiplier based on user's voting power
     * @param votingPower User's voting power
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
        uint256 additionalBoost = ((maxBoostBps - BASE_BOOST_BPS) * effectiveAmount) / MIN_LP_FOR_MAX_BOOST;

        return BASE_BOOST_BPS + additionalBoost;
    }

    /**
     * @dev Calculate normalized boost multiplier based on user's share
     * @param userBalance User's token balance
     * @param totalSupply Total token supply
     * @param maxBoostBps Maximum boost in basis points (default 25000 = 2.5x)
     * @return multiplier The calculated boost multiplier
     */
    function calculateNormalizedBoostMultiplier(
        uint256 userBalance,
        uint256 totalSupply,
        uint256 maxBoostBps
    ) public pure returns (uint256 multiplier) {
        if (userBalance == 0 || totalSupply == 0) {
            return BASE_BOOST_BPS; // Default to base boost if no balance
        }

        // If max boost not specified, use the default
        if (maxBoostBps == 0) maxBoostBps = MAX_BOOST_BPS;

        // Calculate user's share using cube root for compression
        uint256 userVotingPower = calculateVotingPower(userBalance);
        uint256 totalVotingPower = calculateVotingPower(totalSupply);

        // Calculate compressed share percentage with high precision
        uint256 compressedSharePct = (userVotingPower * PRECISION) / totalVotingPower;

        // Calculate boost within range from base to max
        uint256 boostRange = maxBoostBps - BASE_BOOST_BPS;
        uint256 additionalBoost = (boostRange * compressedSharePct) / PRECISION;

        // Ensure we don't exceed maxBoost
        uint256 calculatedBoost = BASE_BOOST_BPS + additionalBoost;
        return calculatedBoost > maxBoostBps ? maxBoostBps : calculatedBoost;
    }

    /**
     * @dev Calculate lottery win probability boost based on user's ve69LP balance
     * @param baseWinProbability Base win probability without boost (in basis points)
     * @param votingPower User's voting power
     * @return boostedProbability The boosted win probability in basis points
     */
    function calculateBoostedWinProbability(
        uint256 /* swapAmount */,
        uint256 baseWinProbability,
        uint256 votingPower
    ) public pure returns (uint256 boostedProbability) {
        // Get boost multiplier (10000 = 1.0x, 25000 = 2.5x)
        uint256 boostMultiplier = calculateBoostMultiplier(votingPower, MAX_BOOST_BPS);

        // Apply boost to the base probability
        boostedProbability = (baseWinProbability * boostMultiplier) / BPS_MAX;

        // Cap at maximum probability (0.04%)
        return Math.min(boostedProbability, MAX_WIN_PROB_BPS);
    }

    /**
     * @dev Calculate win threshold for lottery based on swap amount and ve69LP boost
     * @param swapAmountUSD Swap amount in USD (scaled by 1e18)
     * @param ve69LPBalance ve69LP balance of the user (if any)
     * @return threshold Random number threshold for win (higher = more likely to win)
     */
    function calculateWinThreshold(
        uint256 swapAmountUSD,
        uint256 ve69LPBalance
    ) public pure returns (uint256 threshold) {
        // Calculate base win probability
        uint256 winProbabilityBPS;

        if (swapAmountUSD <= MIN_AMOUNT_USD) {
            winProbabilityBPS = BASE_WIN_PROB_BPS;
        } else {
            uint256 additionalProb = swapAmountUSD > MAX_AMOUNT_USD
                ? (MAX_WIN_PROB_BPS - BASE_WIN_PROB_BPS)
                : ((swapAmountUSD - MIN_AMOUNT_USD) * (MAX_WIN_PROB_BPS - BASE_WIN_PROB_BPS)) /
                  (MAX_AMOUNT_USD - MIN_AMOUNT_USD);

            winProbabilityBPS = BASE_WIN_PROB_BPS + additionalProb;
        }

        // Apply ve69LP boost (up to 2.5x)
        if (ve69LPBalance > 0) {
            // Calculate boost factor (1.0 to 2.5 based on balance)
            uint256 boostFactor;

            if (ve69LPBalance >= MIN_LP_FOR_MAX_BOOST) {
                boostFactor = 250; // 2.5x
            } else {
                // Linear increase between 1.0x and 2.5x
                boostFactor = 100 + ((ve69LPBalance * 150) / MIN_LP_FOR_MAX_BOOST);
            }

            // Apply boost
            winProbabilityBPS = (winProbabilityBPS * boostFactor) / 100;

            // Cap at max probability
            winProbabilityBPS = Math.min(MAX_WIN_PROB_BPS, winProbabilityBPS);
        }

        // Convert probability to threshold
        // For example, a 0.01% chance = 1/10000 = threshold of 10000/1 = 10000
        // So if random number % 10000 == 0, the user wins (1 in 10000 chance)
        if (winProbabilityBPS == 0) return 1; // Avoid division by zero

        threshold = BPS_MAX * BPS_MAX / winProbabilityBPS;
        return threshold;
    }

    /**
     * @dev Calculate the jackpot payout percentage based on jackpot size
     * @param jackpotSize Current jackpot size (in wei)
     * @param marketConditionFactor Market condition factor (0-100) that can adjust payout
     * @return payoutBps Basis points for jackpot payout (e.g. 6900 = 69%)
     */
    function calculateJackpotPayoutPercentage(
        uint256 jackpotSize,
        uint256 marketConditionFactor
    ) public pure returns (uint256 payoutBps) {
        // Start with base payout (69%)
        uint256 basePayout = BASE_JACKPOT_PAYOUT_BPS;
        uint256 reduction = 0;

        // For large jackpots, reduce the percentage to create sustainability
        if (jackpotSize > 10000 ether) {
            // Calculate log10 approximation
            uint256 magnitude = 0;
            uint256 value = jackpotSize / 1 ether;

            while (value >= 10) {
                value /= 10;
                magnitude++;
            }

            // Each order of magnitude reduces by 3%
            reduction = Math.min(1900, magnitude * 300); // Cap at 19% reduction (50% floor)
        }

        // Apply market condition factor - can adjust +/- 5% based on conditions
        if (marketConditionFactor > 50) {
            // High market factor increases payout (better conditions)
            uint256 marketBoost = Math.min(500, (marketConditionFactor - 50) * 10);

            // Ensure we don't exceed the base payout
            reduction = reduction > marketBoost ? reduction - marketBoost : 0;
        } else if (marketConditionFactor < 50) {
            // Low market factor decreases payout (worse conditions)
            uint256 marketPenalty = Math.min(500, (50 - marketConditionFactor) * 10);
            reduction += marketPenalty;
        }

        // Apply reduction with floor check
        uint256 finalPayout = basePayout - reduction;
        return finalPayout < MIN_JACKPOT_PAYOUT_BPS ? MIN_JACKPOT_PAYOUT_BPS : finalPayout;
    }

    /**
     * @dev Calculates the optimal fee allocation based on various market factors
     * @param lpTVL Total value locked in liquidity pools (in wei)
     * @param jackpotTVL Current jackpot size (in wei)
     * @param volume24h 24-hour trading volume (in wei)
     * @param lastWinTimestamp Timestamp of the last jackpot win
     * @param numStakers Number of active LP stakers
     * @param marketVolatility Market volatility metric (0-100 scale)
     * @return jackpotBps Basis points allocated to jackpot (e.g. 690 = 69.0%)
     * @return lpBps Basis points allocated to LPs
     * @return burnBps Basis points allocated to burning
     */
    function calculateFeeAllocation(
        uint256 lpTVL,
        uint256 jackpotTVL,
        uint256 volume24h,
        uint256 lastWinTimestamp,
        uint256 numStakers,
        uint256 marketVolatility
    ) public view returns (
        uint256 jackpotBps,
        uint256 lpBps,
        uint256 burnBps
    ) {
        // Volume/LP ratio factor (high ratio = more to LPs)
        int256 volumeLPFactor;
        if (volume24h > 0 && lpTVL > 0) {
            // Calculate ratio with 18 decimals precision
            uint256 volumeLPRatio = (volume24h * 1e18) / lpTVL;
            // Scale to basis points, apply thresholds
            if (volumeLPRatio > 2e17) { // 0.2 with 18 decimals
                uint256 scaledRatio = (volumeLPRatio - 2e17) / 1e16; // Scale to percentage points
                volumeLPFactor = int256(Math.min(150, scaledRatio)); // Cap at 150 bps
            } else {
                volumeLPFactor = -100; // Minimum impact for very low volume/LP ratio
            }
        } else {
            volumeLPFactor = 0;
        }

        // Jackpot size factor (large jackpot = less to jackpot)
        int256 jackpotSizeFactor;
        if (jackpotTVL > 10000 ether) {
            // Use log10 approximation
            uint256 magnitude = 0;
            uint256 value = jackpotTVL / 1 ether;

            while (value >= 10) {
                value /= 10;
                magnitude++;
            }

            jackpotSizeFactor = int256(Math.min(200, magnitude * 10));
        } else {
            jackpotSizeFactor = 0;
        }

        // Time factor (longer without win = more to jackpot)
        int256 timeFactor;
        uint256 daysSinceWin = (block.timestamp - lastWinTimestamp) / 1 days;

        if (daysSinceWin > 7) {
            timeFactor = int256(Math.min(150, (daysSinceWin - 7) * 10));
        } else {
            timeFactor = 0;
        }

        // Staker factor (more stakers = more to LPs)
        int256 stakerFactor;
        if (numStakers > 100) {
            // Log10 approximation for stakers
            uint256 magnitude = 0;
            uint256 value = numStakers;

            while (value >= 10) {
                value /= 10;
                magnitude++;
            }

            stakerFactor = int256(Math.min(100, magnitude * 20));
        } else {
            stakerFactor = 0;
        }

        // Volatility factor (high volatility = more to LPs)
        int256 volatilityFactor;
        if (marketVolatility > 50) {
            volatilityFactor = int256(Math.min(100, (marketVolatility - 50) * 2));
        } else {
            volatilityFactor = 0;
        }

        // Calculate adjustments
        int256 jackpotAdjustment = timeFactor - jackpotSizeFactor;
        int256 lpAdjustment = volumeLPFactor + stakerFactor + volatilityFactor;

        // Apply bounds to prevent negative allocations
        int256 adjustedJackpotBps = int256(BASE_JACKPOT_BPS) + jackpotAdjustment;
        int256 adjustedLPBps = int256(BASE_LP_BPS) + lpAdjustment;

        // Ensure minimums
        uint256 finalJackpotBps = adjustedJackpotBps > 0
            ? uint256(adjustedJackpotBps)
            : 0;
        finalJackpotBps = Math.max(finalJackpotBps, MIN_JACKPOT_BPS);

        uint256 finalLPBps = adjustedLPBps > 0
            ? uint256(adjustedLPBps)
            : 0;
        finalLPBps = Math.max(finalLPBps, MIN_LP_BPS);

        // Calculate burn with minimum
        uint256 remainingForBurn = BPS_MAX - finalJackpotBps - finalLPBps;
        uint256 finalBurnBps = Math.max(remainingForBurn, MIN_BURN_BPS);

        // Handle case where allocations exceed max
        uint256 total = finalJackpotBps + finalLPBps + finalBurnBps;

        if (total > BPS_MAX) {
            // Scale back proportionally while respecting minimums
            uint256 excess = total - BPS_MAX;

            uint256 jackpotAboveMin = finalJackpotBps > MIN_JACKPOT_BPS
                ? finalJackpotBps - MIN_JACKPOT_BPS
                : 0;

            uint256 lpAboveMin = finalLPBps > MIN_LP_BPS
                ? finalLPBps - MIN_LP_BPS
                : 0;

            uint256 burnAboveMin = finalBurnBps > MIN_BURN_BPS
                ? finalBurnBps - MIN_BURN_BPS
                : 0;

            uint256 totalAboveMin = jackpotAboveMin + lpAboveMin + burnAboveMin;

            if (totalAboveMin >= excess) {
                // We can reduce proportionally
                finalJackpotBps -= (jackpotAboveMin * excess) / totalAboveMin;
                finalLPBps -= (lpAboveMin * excess) / totalAboveMin;
                finalBurnBps = BPS_MAX - finalJackpotBps - finalLPBps; // Ensure exactly BPS_MAX
            } else {
                // Set all to minimums and distribute remainder
                finalJackpotBps = MIN_JACKPOT_BPS;
                finalLPBps = MIN_LP_BPS;
                finalBurnBps = MIN_BURN_BPS;

                uint256 remaining = BPS_MAX - (MIN_JACKPOT_BPS + MIN_LP_BPS + MIN_BURN_BPS);
                uint256 totalBase = BASE_JACKPOT_BPS + BASE_LP_BPS + BASE_BURN_BPS;

                finalJackpotBps += (BASE_JACKPOT_BPS * remaining) / totalBase;
                finalLPBps += (BASE_LP_BPS * remaining) / totalBase;
                finalBurnBps = BPS_MAX - finalJackpotBps - finalLPBps; // Ensure exactly BPS_MAX
            }
        }

        return (finalJackpotBps, finalLPBps, finalBurnBps);
    }

    /**
     * @dev Calculate lock end time for a new lock
     * @param currentTime Current timestamp
     * @param lockDuration Duration to lock for in seconds
     * @return lockEnd Timestamp when lock will expire
     */
    function calculateLockEnd(
        uint256 currentTime,
        uint256 lockDuration
    ) public pure returns (uint256 lockEnd) {
        // Ensure lock duration is capped at MAX_LOCK_TIME
        lockDuration = Math.min(lockDuration, MAX_LOCK_TIME);

        // Align to weekly boundaries (Curve style)
        uint256 unlockTime = ((currentTime + lockDuration) / WEEK) * WEEK;

        return unlockTime;
    }

    /**
     * @dev Convert seconds to weeks, rounded down
     * @param timeInSeconds Time in seconds
     * @return weeksCount Number of weeks
     */
    function secondsToWeeks(uint256 timeInSeconds) public pure returns (uint256 weeksCount) {
        return timeInSeconds / WEEK;
    }

    /**
     * @dev Convert weeks to seconds
     * @param weeksCount Number of weeks
     * @return timeInSeconds Time in seconds
     */
    function weeksToSeconds(uint256 weeksCount) public pure returns (uint256 timeInSeconds) {
        return weeksCount * WEEK;
    }
}
