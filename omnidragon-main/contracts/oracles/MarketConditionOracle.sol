// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title MarketConditionOracle
 * @dev Library for calculating market condition factors for the Hermes formula
 * Uses on-chain metrics to determine optimal fee allocations and jackpot payouts
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
library MarketConditionOracle {
    using Math for uint256;

    // Constants
    uint256 public constant PRECISION = 1e18;
    uint256 public constant PERCENTAGE_SCALE = 100;
    uint256 public constant BPS_DENOMINATOR = 10000;

    // Time windows for calculations
    uint256 public constant HOUR = 3600;
    uint256 public constant DAY = 86400;
    uint256 public constant WEEK = 7 * DAY;

    // Market condition score ranges (0-100)
    uint256 public constant MIN_CONDITION_SCORE = 0;
    uint256 public constant MAX_CONDITION_SCORE = 100;
    uint256 public constant NEUTRAL_CONDITION_SCORE = 50;

    /**
     * @dev Calculate market condition score based on multiple factors
     * @param lpTVL Total value locked in liquidity pools
     * @param volume24h 24-hour trading volume
     * @param priceChangePercent Price change percentage (scaled by PERCENTAGE_SCALE)
     * @param stakers Number of ve69LP stakers
     * @param jackpotTVL Current jackpot size
     * @param daysSinceLastJackpot Days since last jackpot win
     * @return conditionScore Market condition score (0-100)
     */
    function calculateMarketConditionScore(
        uint256 lpTVL,
        uint256 volume24h,
        int256 priceChangePercent,
        uint256 stakers,
        uint256 jackpotTVL,
        uint256 daysSinceLastJackpot
    ) public pure returns (uint256 conditionScore) {
        // Calculate component scores
        uint256 volumeScore = calculateVolumeScore(volume24h, lpTVL);
        uint256 priceScore = calculatePriceScore(priceChangePercent);
        uint256 stakingScore = calculateStakingScore(stakers);
        uint256 jackpotScore = calculateJackpotScore(jackpotTVL, daysSinceLastJackpot);

        // Combine scores with different weights
        uint256 weightedScore = (
            volumeScore * 30 +
            priceScore * 25 +
            stakingScore * 20 +
            jackpotScore * 25
        ) / PERCENTAGE_SCALE;

        // Ensure score is within bounds
        return Math.min(MAX_CONDITION_SCORE, Math.max(MIN_CONDITION_SCORE, weightedScore));
    }

    /**
     * @dev Calculate score based on volume/liquidity ratio
     * @param volume24h 24-hour trading volume
     * @param lpTVL Total value locked in liquidity pools
     * @return volumeScore Score component for volume (0-100)
     */
    function calculateVolumeScore(
        uint256 volume24h,
        uint256 lpTVL
    ) public pure returns (uint256 volumeScore) {
        if (lpTVL == 0) return NEUTRAL_CONDITION_SCORE;

        // Calculate volume/TVL ratio (daily turnover ratio)
        uint256 volumeRatio = (volume24h * PRECISION) / lpTVL;

        // Interpret volume ratio:
        // 0% = 0 score (extremely low activity)
        // 10% = 50 score (healthy activity)
        // 30%+ = 100 score (very high activity)

        if (volumeRatio <= PRECISION / 100) { // 0-1% daily turnover
            // Linear scaling from 0 to 20
            return (volumeRatio * 2000) / (PRECISION / 100);
        } else if (volumeRatio <= PRECISION / 10) { // 1-10% daily turnover
            // Linear scaling from 20 to 50
            uint256 baseScore = 20;
            uint256 additionalScore = ((volumeRatio - (PRECISION / 100)) * 30) / (PRECISION / 10 - PRECISION / 100);
            return baseScore + additionalScore;
        } else if (volumeRatio <= 3 * PRECISION / 10) { // 10-30% daily turnover
            // Linear scaling from 50 to 100
            uint256 baseScore = 50;
            uint256 additionalScore = ((volumeRatio - (PRECISION / 10)) * 50) / (3 * PRECISION / 10 - PRECISION / 10);
            return baseScore + additionalScore;
        } else { // >30% daily turnover
            return 100;
        }
    }

    /**
     * @dev Calculate score based on recent price performance
     * @param priceChangePercent Price change percentage (scaled by PERCENTAGE_SCALE)
     * @return priceScore Score component for price performance (0-100)
     */
    function calculatePriceScore(
        int256 priceChangePercent
    ) public pure returns (uint256 priceScore) {
        // Neutral starting point
        uint256 baseScore = 50;

        // Adjust score based on price change direction and magnitude
        if (priceChangePercent > 0) {
            // Positive price change - increase score
            // +10% price change = +25 points (up to +50 points max at +20% or higher)
            uint256 increase = uint256(priceChangePercent) > 20 ? 50 : (uint256(priceChangePercent) * 5) / 2;
            return baseScore + increase;
        } else if (priceChangePercent < 0) {
            // Negative price change - decrease score
            // -10% price change = -25 points (down to -50 points max at -20% or lower)
            uint256 decrease = uint256(-priceChangePercent) > 20 ? 50 : (uint256(-priceChangePercent) * 5) / 2;
            return decrease > baseScore ? 0 : baseScore - decrease;
        } else {
            // No price change
            return baseScore;
        }
    }

    /**
     * @dev Calculate score based on number of stakers
     * @param stakers Number of ve69LP stakers
     * @return stakingScore Score component for staking participation (0-100)
     */
    function calculateStakingScore(
        uint256 stakers
    ) public pure returns (uint256 stakingScore) {
        // Interpret staking count:
        // 0 stakers = 0 score
        // 100 stakers = 50 score
        // 1000+ stakers = 100 score

        if (stakers == 0) {
            return 0;
        } else if (stakers < 100) {
            // Linear scaling from 0 to 50
            return (stakers * 50) / 100;
        } else if (stakers < 1000) {
            // Linear scaling from 50 to 100
            uint256 baseScore = 50;
            uint256 additionalScore = ((stakers - 100) * 50) / 900;
            return baseScore + additionalScore;
        } else {
            return 100;
        }
    }

    /**
     * @dev Calculate score based on jackpot size and time since last win
     * @param jackpotTVL Current jackpot size
     * @param daysSinceLastJackpot Days since last jackpot win
     * @return jackpotScore Score component for jackpot metrics (0-100)
     */
    function calculateJackpotScore(
        uint256 jackpotTVL,
        uint256 daysSinceLastJackpot
    ) public pure returns (uint256 jackpotScore) {
        // Calculate jackpot size score component (0-50)
        uint256 jackpotSizeScore;
        if (jackpotTVL < 100 ether) {
            jackpotSizeScore = (jackpotTVL * 20) / 100 ether;
        } else if (jackpotTVL < 1000 ether) {
            jackpotSizeScore = 20 + ((jackpotTVL - 100 ether) * 20) / 900 ether;
        } else {
            jackpotSizeScore = 40 + ((jackpotTVL - 1000 ether) * 10) / 10000 ether;
            jackpotSizeScore = Math.min(50, jackpotSizeScore);
        }

        // Calculate time since last win component (0-50)
        uint256 timeScore;
        if (daysSinceLastJackpot < 7) {
            // Linear increase from 0 to 25 over first week
            timeScore = (daysSinceLastJackpot * 25) / 7;
        } else if (daysSinceLastJackpot < 30) {
            // Linear increase from 25 to 40 between 1-4 weeks
            timeScore = 25 + ((daysSinceLastJackpot - 7) * 15) / 23;
        } else {
            // Linear increase from 40 to 50 beyond 30 days, capped at 60 days
            uint256 cappedDays = Math.min(60, daysSinceLastJackpot);
            timeScore = 40 + ((cappedDays - 30) * 10) / 30;
            timeScore = Math.min(50, timeScore);
        }

        // Combine scores
        return jackpotSizeScore + timeScore;
    }

    /**
     * @dev Calculate volatility score based on price standard deviation
     * @param stdDevPercentage Standard deviation as percentage of price (scaled by PERCENTAGE_SCALE)
     * @return volatilityScore Volatility score (0-100)
     */
    function calculateVolatilityScore(
        uint256 stdDevPercentage
    ) public pure returns (uint256 volatilityScore) {
        // Interpret standard deviation:
        // 0% = 0 score (no volatility)
        // 5% = 50 score (moderate volatility)
        // 15%+ = 100 score (extreme volatility)

        if (stdDevPercentage <= 5 * PERCENTAGE_SCALE) {
            // Linear scaling from 0 to 50
            return (stdDevPercentage * 50) / (5 * PERCENTAGE_SCALE);
        } else if (stdDevPercentage <= 15 * PERCENTAGE_SCALE) {
            // Linear scaling from 50 to 100
            uint256 baseScore = 50;
            uint256 additionalScore = ((stdDevPercentage - 5 * PERCENTAGE_SCALE) * 50) / (10 * PERCENTAGE_SCALE);
            return baseScore + additionalScore;
        } else {
            return 100;
        }
    }

    /**
     * @dev Calculate recommended market condition factor for jackpot payout
     * @param conditionScore Market condition score (0-100)
     * @return marketConditionFactor Market condition factor for jackpot formula (0-100)
     */
    function getJackpotMarketConditionFactor(
        uint256 conditionScore
    ) public pure returns (uint256 marketConditionFactor) {
        // Convert general market condition score to jackpot-specific factor
        // Higher market scores = more favorable conditions for higher payouts

        // Map score: 0 -> 30, 50 -> 50, 100 -> 70
        // This gives us a range of +/- 20 points around neutral 50
        if (conditionScore <= 50) {
            // Scale 0-50 to 30-50
            return 30 + ((conditionScore * 20) / 50);
        } else {
            // Scale 51-100 to 51-70
            return 50 + (((conditionScore - 50) * 20) / 50);
        }
    }

    /**
     * @dev Calculate recommended jackpot payout percentage based on market conditions
     * @param jackpotSize Current jackpot size
     * @param conditionScore Market condition score (0-100)
     * @return payoutPercentage Recommended payout percentage (in basis points)
     */
    function recommendJackpotPayoutPercentage(
        uint256 jackpotSize,
        uint256 conditionScore
    ) public pure returns (uint256 payoutPercentage) {
        // Get market condition factor for jackpot calculation
        uint256 marketConditionFactor = getJackpotMarketConditionFactor(conditionScore);

        // Base payout is 69%
        uint256 basePayout = 6900; // in basis points
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
        return finalPayout < 5000 ? 5000 : finalPayout; // 50% minimum payout
    }
}
