// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "../library/access/Ownable.sol";
import { ReentrancyGuard } from "../library/security/ReentrancyGuard.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { DragonMath } from "../math/DragonMath.sol";
import { IDragonJackpotVault } from "../interfaces/vault/IDragonJackpotVault.sol";
import { IOmniDragonRandomnessProvider } from "../interfaces/core/IOmniDragonRandomnessProvider.sol";
import { IOmniDragonPriceOracle } from "../interfaces/core/IOmniDragonPriceOracle.sol";

/**
 * @title OmniDragonLotteryManager
 * @dev SINGLE SOURCE OF TRUTH for all lottery operations in the OmniDragon ecosystem
 *
 * Responsibilities:
 * ✅ Create lottery entries from OmniDragon swaps
 * ✅ Calculate win probabilities using internal lottery math
 * ✅ Request randomness from RandomnessProvider
 * ✅ Process lottery results and trigger payouts
 * ✅ Track user statistics and cooldowns
 * ✅ Handle all lottery-specific mathematical calculations
 *
 * Does NOT handle:
 * ❌ VRF source management (handled by RandomnessProvider)
 * ❌ Price aggregation (handled by PriceOracle)
 * ❌ Randomness generation (handled by RandomnessProvider)
 * ❌ General mathematical utilities (handled by DragonMath)
 *
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract OmniDragonLotteryManager is Ownable, ReentrancyGuard {
    using Math for uint256;

    // ======== Lottery-Specific Constants ========

    // Win probability constants
    uint256 public constant BASE_WIN_PROB_BPS = 4;      // 0.04% base probability
    uint256 public constant MAX_BASE_WIN_PROB_BPS = 400;  // 4% max base probability
    uint256 public constant MAX_BOOSTED_WIN_PROB_BPS = 1000; // 10% max boosted probability

    // Lottery amount bounds (scaled by PRECISION)
    uint256 public constant MIN_AMOUNT_USD = 1 * 1e18; // $1
    uint256 public constant MAX_AMOUNT_USD = 10000 * 1e18; // $10,000

    // Maximum voting power for jackpot bonus (scaled by PRECISION)
    uint256 public constant MAX_VOTING_POWER_FOR_JACKPOT_BONUS = 1000 * 1e18;

    // Jackpot payout constants
    uint256 public constant MIN_PAYOUT_BPS = 5000; // 50% minimum payout
    uint256 public constant MAX_PAYOUT_BPS = 8000; // 80% maximum payout
    uint256 public constant BASE_PAYOUT_BPS = 6900; // 69% base payout
    uint256 public constant MAX_PAYOUT_REDUCTION_BPS = 1900; // 19% max reduction
    uint256 public constant PARTICIPANT_ADJUSTMENT_THRESHOLD = 100; // Participant count threshold
    uint256 public constant MAX_PARTICIPANT_ADJUSTMENT_BPS = 500; // 5% max participant adjustment

    // Shared constants from DragonMath
    uint256 public constant BPS_DENOMINATOR = 10000; // 100% = 10000
    uint256 public constant PRECISION = 1e18;
    uint256 public constant JACKPOT_LARGE_THRESHOLD = 10000 * 1e18; // Large jackpot threshold

    // ======== Lottery-Specific Structs ========

    struct LotteryResult {
        uint256 baseWinProbability;     // Base win probability in basis points
        uint256 boostedWinProbability;  // Boosted win probability in basis points
        uint256 finalProbabilityBps;    // Final probability to use with secure VRF
    }

    struct JackpotPayout {
        uint256 payoutBps;              // Final jackpot payout percentage in basis points
        uint256 boostApplied;           // Boost multiplier applied (10000 = 1.0x)
        uint256 basePayoutBps;          // Base payout before boost
    }

    // ======== Core Components ========
    address public immutable omniDragonToken;      // OmniDragon token contract
    address public jackpotVault;                   // Jackpot vault for payouts
    address public randomnessProvider;             // Unified randomness provider
    address public priceOracle;                    // Price oracle for market conditions

    // ======== Lottery Configuration ========
    uint256 public constant MIN_SWAP_AMOUNT_USD = 10 * 1e18;  // $10 minimum
    uint256 public constant COOLDOWN_PERIOD = 60;             // 60 seconds between entries
    uint256 public constant MAX_ENTRIES_PER_USER = 100;       // Max pending entries per user
    uint256 public constant MAX_CLEANUP_BATCH_SIZE = 50;      // Max entries to cleanup in one tx

    // ======== Lottery Entry Management ========
    // Sentinel value for "no VRF request needed" - guaranteed not to be issued by randomness provider
    uint256 public constant NO_VRF_REQUEST_SENTINEL = type(uint256).max;

    struct LotteryEntry {
        address user;                    // User address
        uint256 swapAmountUSD;          // Swap amount in USD (scaled by 1e18)
        uint256 userVotingPower;        // User's ve69LP voting power
        uint256 probabilityBps;         // Calculated win probability in basis points
        uint256 timestamp;              // Entry timestamp
        uint256 randomnessRequestId;    // Request ID for randomness (NO_VRF_REQUEST_SENTINEL if pool was used)
        bool processed;                 // Whether entry has been processed
        bool won;                       // Whether user won the lottery
        uint256 payoutAmount;           // Payout amount if won
        bool usedPoolRandomness;        // Whether pool randomness was used instead of VRF
        bool paymentFailed;             // Whether payout failed (for retry mechanisms)
    }

    // ======== Storage ========
    mapping(uint256 => LotteryEntry) public lotteryEntries;
    mapping(address => uint256) public lastEntryTime;
    mapping(address => uint256) public userEntryCount;
    mapping(uint256 => uint256) public randomnessRequestToEntryId;

    // Note: User entries are tracked via LotteryEntryCreated events for gas efficiency
    // Use off-chain indexing to get user's lottery history

    uint256 public entryIdCounter;
    uint256 public totalEntries;
    uint256 public totalWins;
    uint256 public totalPayouts;

    // ======== Events ========
    event LotteryEntryCreated(
        uint256 indexed entryId,
        address indexed user,
        uint256 swapAmountUSD,
        uint256 probabilityBps,
        uint256 randomnessRequestId
    );

    event LotteryProcessed(
        uint256 indexed entryId,
        address indexed user,
        bool won,
        uint256 randomValue,
        uint256 payoutAmount
    );

    event LotteryWin(
        uint256 indexed entryId,
        address indexed winner,
        uint256 swapAmountUSD,
        uint256 probabilityBps,
        uint256 payoutAmount
    );

    event PaymentFailed(
        uint256 indexed entryId,
        address indexed winner,
        uint256 payoutAmount,
        string reason
    );

    event ComponentUpdated(string indexed component, address indexed oldAddress, address indexed newAddress);

    // ======== Constructor ========
    constructor(
        address _omniDragonToken,
        address _jackpotVault,
        address _randomnessProvider,
        address _priceOracle
    ) {
        require(_omniDragonToken != address(0), "Invalid OmniDragon token");
        require(_jackpotVault != address(0), "Invalid jackpot vault");
        require(_randomnessProvider != address(0), "Invalid randomness provider");
        require(_priceOracle != address(0), "Invalid price oracle");

        omniDragonToken = _omniDragonToken;
        jackpotVault = _jackpotVault;
        randomnessProvider = _randomnessProvider;
        priceOracle = _priceOracle;
    }

    // ======== Internal Lottery Math Functions ========

    /**
     * @dev Calculate lottery win probability with voting power boost
     * @param swapAmountUSD Swap amount in USD (scaled by PRECISION)
     * @param userVotingPower User's voting power (scaled by PRECISION)
     * @return result Complete lottery calculation result
     */
    function _calculateLotteryProbability(
        uint256 swapAmountUSD,
        uint256 userVotingPower
    ) internal pure returns (LotteryResult memory result) {
        // Calculate base win probability
        if (swapAmountUSD <= MIN_AMOUNT_USD) {
            result.baseWinProbability = BASE_WIN_PROB_BPS;
        } else if (swapAmountUSD >= MAX_AMOUNT_USD) {
            result.baseWinProbability = MAX_BASE_WIN_PROB_BPS;
        } else {
            // Linear scaling between min and max
            uint256 additionalProb = (swapAmountUSD - MIN_AMOUNT_USD).mulDiv(
                MAX_BASE_WIN_PROB_BPS - BASE_WIN_PROB_BPS,
                MAX_AMOUNT_USD - MIN_AMOUNT_USD
            );

            result.baseWinProbability = BASE_WIN_PROB_BPS + additionalProb;
        }

        // Apply voting power boost if applicable
        if (userVotingPower > 0) {
            result.boostedWinProbability = _calculateBoostedWinProbability(
                result.baseWinProbability,
                userVotingPower
            );
        } else {
            result.boostedWinProbability = result.baseWinProbability;
        }

        result.finalProbabilityBps = result.boostedWinProbability;

        return result;
    }

    /**
     * @dev Calculate lottery win probability boost based on user's voting power
     * @param baseWinProbability Base win probability without boost (in basis points)
     * @param votingPower User's voting power (scaled by PRECISION)
     * @return boostedProbability The boosted win probability in basis points
     */
    function _calculateBoostedWinProbability(
        uint256 baseWinProbability,
        uint256 votingPower
    ) internal pure returns (uint256 boostedProbability) {
        // Get boost multiplier from DragonMath (general boost calculation)
        uint256 boostMultiplier = DragonMath.calculateBoostMultiplier(votingPower, DragonMath.MAX_BOOST_BPS);

        // Apply boost to the base probability
        boostedProbability = baseWinProbability.mulDiv(boostMultiplier, BPS_DENOMINATOR);

        // Cap at maximum boosted probability
        return Math.min(boostedProbability, MAX_BOOSTED_WIN_PROB_BPS);
    }

    /**
     * @dev Determine lottery win using secure random number
     * @param probabilityBps Win probability in basis points
     * @param secureRandomValue Cryptographically secure random number (0 to type(uint256).max)
     * @return isWinner True if the user wins the lottery
     */
    function _determineLotteryWin(
        uint256 probabilityBps,
        uint256 secureRandomValue
    ) internal pure returns (bool isWinner) {
        if (probabilityBps == 0) {
            return false; // Zero probability always loses
        }

        // Calculate threshold for win determination
        uint256 threshold = Math.mulDiv(probabilityBps, type(uint256).max, BPS_DENOMINATOR);

        // Determine win: randomValue < threshold
        return secureRandomValue < threshold;
    }

    /**
     * @dev Calculate jackpot payout percentage with corrected reduction formula
     * @param jackpotSize Current jackpot size (scaled by PRECISION)
     * @return payoutBps Basis points for jackpot payout (e.g. 6900 = 69%)
     */
    function _calculateJackpotPayoutPercentage(uint256 jackpotSize) internal pure returns (uint256 payoutBps) {
        // Base payout percentage (69%)
        payoutBps = BASE_PAYOUT_BPS;

        // Adjust based on jackpot size
        if (jackpotSize > JACKPOT_LARGE_THRESHOLD) {
            // 1 BPS reduction per $1000 jackpot
            uint256 reduction = Math.min(
                MAX_PAYOUT_REDUCTION_BPS,
                jackpotSize.mulDiv(1, 1000 * PRECISION) // 1 BPS per $1000
            );
            payoutBps = Math.max(MIN_PAYOUT_BPS, payoutBps - reduction);
        }

        return payoutBps;
    }

    /**
     * @dev Calculate jackpot payout with voting power boost
     * @param jackpotSize Current jackpot size (scaled by PRECISION)
     * @param winnerVotingPower Winner's voting power (scaled by PRECISION)
     * @param marketConditionFactor Market condition factor (0-100, no scaling)
     * @return result Complete jackpot payout calculation
     */
    function _calculateJackpotPayout(
        uint256 jackpotSize,
        uint256 winnerVotingPower,
        uint256 marketConditionFactor
    ) internal pure returns (JackpotPayout memory result) {
        // Calculate base payout percentage
        result.basePayoutBps = _calculateJackpotPayoutPercentage(jackpotSize);

        // Apply market condition factor (simple implementation)
        if (marketConditionFactor > 50) {
            // Good market conditions, slightly increase payout
            result.basePayoutBps = Math.min(MAX_PAYOUT_BPS, result.basePayoutBps + (marketConditionFactor - 50) * 10);
        } else if (marketConditionFactor < 50) {
            // Poor market conditions, slightly decrease payout
            uint256 decrease = (50 - marketConditionFactor) * 10;
            result.basePayoutBps = result.basePayoutBps > decrease ? result.basePayoutBps - decrease : MIN_PAYOUT_BPS;
        }

        // Start with base payout
        result.payoutBps = result.basePayoutBps;
        result.boostApplied = BPS_DENOMINATOR; // Default 1.0x

        // Apply voting power bonus if winner has voting power
        if (winnerVotingPower > 0) {
            // Calculate boost - up to 10% additional payout for voting power holders
            uint256 effectivePower = Math.min(winnerVotingPower, MAX_VOTING_POWER_FOR_JACKPOT_BONUS);
            uint256 bonusBps = effectivePower.mulDiv(1000, MAX_VOTING_POWER_FOR_JACKPOT_BONUS); // Up to 10% bonus

            // Add bonus to payout
            result.payoutBps = result.basePayoutBps + bonusBps;

            // Calculate boost multiplier as standard ratio (boosted/base)
            if (result.basePayoutBps > 0) {
                result.boostApplied = result.payoutBps.mulDiv(BPS_DENOMINATOR, result.basePayoutBps);
            } else {
                result.boostApplied = BPS_DENOMINATOR;
            }
        }

        return result;
    }

    // ======== Main Lottery Functions ========

    /**
     * @dev Create a lottery entry for a user's swap
     * @param user User address
     * @param swapAmountUSD Swap amount in USD (scaled by 1e18)
     * @param userVotingPower User's ve69LP voting power
     * @return entryId The created lottery entry ID (0 if entry not created)
     */
    function createLotteryEntry(
        address user,
        uint256 swapAmountUSD,
        uint256 userVotingPower
    ) external nonReentrant returns (uint256 entryId) {
        require(msg.sender == omniDragonToken, "LotteryManager: Only OmniDragon token can create entries");
        require(user != address(0), "LotteryManager: Invalid user address");
        require(swapAmountUSD >= MIN_SWAP_AMOUNT_USD, "LotteryManager: Swap amount below minimum threshold");

        // Check cooldown period
        require(
            block.timestamp >= lastEntryTime[user] + COOLDOWN_PERIOD,
            "Cooldown period active"
        );

        // Check max entries per user
        require(userEntryCount[user] < MAX_ENTRIES_PER_USER, "Too many pending entries");

        // Calculate lottery probability using internal math
        LotteryResult memory lotteryResult = _calculateLotteryProbability(swapAmountUSD, userVotingPower);
        uint256 probabilityBps = lotteryResult.finalProbabilityBps;

        // Skip lottery if probability is 0
        if (probabilityBps == 0) {
            return 0;
        }

        // Create lottery entry
        entryId = ++entryIdCounter;

        // Update user entry count immediately after creation
        userEntryCount[user]++;
        lastEntryTime[user] = block.timestamp;
        totalEntries++;

        // Get randomness from the enhanced pool (more efficient than individual VRF requests)
        uint256 randomValue;
        try IOmniDragonRandomnessProvider(randomnessProvider).drawFromRandomnessPool() returns (uint256 poolRandomness) {
            randomValue = poolRandomness;
        } catch {
            // Fallback to traditional VRF request if pool fails
            uint256 randomnessRequestId;
            try IOmniDragonRandomnessProvider(randomnessProvider).requestRandomness() returns (uint256 requestId) {
                randomnessRequestId = requestId;
                require(randomnessRequestId != 0, "LotteryManager: Failed to obtain randomness request ID");
            } catch {
                // Both pool and VRF request failed - revert the entire transaction
                // Decrement counters that were incremented earlier
                userEntryCount[user]--;
                lastEntryTime[user] = 0; // Reset last entry time
                totalEntries--;
                revert("LotteryManager: Unable to obtain randomness from any source");
            }

            // Store lottery entry with pending randomness
            lotteryEntries[entryId] = LotteryEntry({
                user: user,
                swapAmountUSD: swapAmountUSD,
                userVotingPower: userVotingPower,
                probabilityBps: probabilityBps,
                timestamp: block.timestamp,
                randomnessRequestId: randomnessRequestId,
                processed: false,
                won: false,
                payoutAmount: 0,
                usedPoolRandomness: false,
                paymentFailed: false
            });

            // Update tracking
            randomnessRequestToEntryId[randomnessRequestId] = entryId;

            emit LotteryEntryCreated(entryId, user, swapAmountUSD, probabilityBps, randomnessRequestId);

            return entryId;
        }

        // Process immediately with pool randomness
        bool won = _determineLotteryWin(probabilityBps, randomValue);

        // Store lottery entry (already processed)
        lotteryEntries[entryId] = LotteryEntry({
            user: user,
            swapAmountUSD: swapAmountUSD,
            userVotingPower: userVotingPower,
            probabilityBps: probabilityBps,
            timestamp: block.timestamp,
            randomnessRequestId: NO_VRF_REQUEST_SENTINEL, // No request needed, used pool
            processed: true,
            won: won,
            payoutAmount: 0,
            usedPoolRandomness: true,
            paymentFailed: false
        });

        // Decrement user entry count since it's already processed
        userEntryCount[user]--;

        // Emit creation event before processing event
        emit LotteryEntryCreated(entryId, user, swapAmountUSD, probabilityBps, NO_VRF_REQUEST_SENTINEL);

        uint256 payoutAmount = 0;
        if (won) {
            payoutAmount = _processLotteryWin(entryId);
            lotteryEntries[entryId].payoutAmount = payoutAmount;

            // Only update stats if payment was successful
            if (payoutAmount > 0) {
                totalWins++;
                totalPayouts += payoutAmount;
                emit LotteryWin(entryId, user, swapAmountUSD, probabilityBps, payoutAmount);
            }
            // If payoutAmount is 0, payment failed and PaymentFailed event was already emitted
        }

        emit LotteryProcessed(entryId, user, won, randomValue, payoutAmount);

        return entryId;
    }

    /**
     * @dev Process a lottery entry with randomness (called by RandomnessProvider)
     * @param randomnessRequestId The randomness request ID
     * @param randomValue Secure random value from VRF
     */
    function fulfillRandomness(uint256 randomnessRequestId, uint256 randomValue) external nonReentrant {
        require(msg.sender == randomnessProvider, "Only randomness provider");

        uint256 entryId = randomnessRequestToEntryId[randomnessRequestId];
        require(entryId != 0, "Invalid randomness request");

        LotteryEntry storage entry = lotteryEntries[entryId];
        require(!entry.processed, "Entry already processed");

        // Use internal lottery math to determine win
        bool won = _determineLotteryWin(entry.probabilityBps, randomValue);

        entry.processed = true;
        entry.won = won;

        // Update user entry count
        userEntryCount[entry.user]--;

        uint256 payoutAmount = 0;
        if (won) {
            payoutAmount = _processLotteryWin(entryId);
            entry.payoutAmount = payoutAmount;

            // Only update stats if payment was successful
            if (payoutAmount > 0) {
                totalWins++;
                totalPayouts += payoutAmount;
                emit LotteryWin(entryId, entry.user, entry.swapAmountUSD, entry.probabilityBps, payoutAmount);
            }
            // If payoutAmount is 0, payment failed and PaymentFailed event was already emitted
        }

        emit LotteryProcessed(entryId, entry.user, won, randomValue, payoutAmount);

        // Clean up mapping
        delete randomnessRequestToEntryId[randomnessRequestId];
    }

    /**
     * @dev Process a lottery win and calculate payout
     * @param entryId Lottery entry ID
     * @return payoutAmount The amount paid out (0 if payment failed)
     */
    function _processLotteryWin(uint256 entryId) internal returns (uint256 payoutAmount) {
        LotteryEntry storage entry = lotteryEntries[entryId];

        // Get current jackpot size
        uint256 jackpotSize;
        try IDragonJackpotVault(jackpotVault).getJackpotBalance() returns (uint256 balance) {
            jackpotSize = balance;
        } catch {
            // If we can't get jackpot balance, mark payment as failed
            entry.paymentFailed = true;
            emit PaymentFailed(entryId, entry.user, 0, "Failed to get jackpot balance");
            return 0;
        }

        // Get market condition score from price oracle
        uint256 marketConditionScore = 50; // Default neutral score when oracle unavailable
        if (priceOracle != address(0)) {
            try IOmniDragonPriceOracle(priceOracle).getMarketConditionScore() returns (uint256 score) {
                marketConditionScore = score;
            } catch {
                // Use default neutral score (50) on failure - represents balanced market conditions
            }
        }

        // Calculate payout using internal lottery math
        JackpotPayout memory jackpotPayout = _calculateJackpotPayout(
            jackpotSize,
            entry.userVotingPower,
            marketConditionScore
        );
        uint256 payoutBps = jackpotPayout.payoutBps;

        // Calculate actual payout amount
        payoutAmount = (jackpotSize * payoutBps) / 10000;

        // Attempt jackpot payout with error handling
        try IDragonJackpotVault(jackpotVault).payJackpot(entry.user, payoutAmount) {
            // Payment successful - no additional action needed
            entry.paymentFailed = false;
        } catch Error(string memory reason) {
            // Payment failed with a reason string
            entry.paymentFailed = true;
            emit PaymentFailed(entryId, entry.user, payoutAmount, reason);
            return 0; // Return 0 to indicate no payout was made
        } catch (bytes memory) {
            // Payment failed without a reason string
            entry.paymentFailed = true;
            emit PaymentFailed(entryId, entry.user, payoutAmount, "Unknown payment failure");
            return 0; // Return 0 to indicate no payout was made
        }

        return payoutAmount;
    }

    // ======== Configuration Functions ========

    /**
     * @dev Update jackpot vault address
     * @param _jackpotVault New jackpot vault address
     */
    function setJackpotVault(address _jackpotVault) external onlyOwner {
        require(_jackpotVault != address(0), "Invalid jackpot vault");
        address oldVault = jackpotVault;
        jackpotVault = _jackpotVault;
        emit ComponentUpdated("JackpotVault", oldVault, _jackpotVault);
    }

    /**
     * @dev Update randomness provider address
     * @param _randomnessProvider New randomness provider address
     */
    function setRandomnessProvider(address _randomnessProvider) external onlyOwner {
        require(_randomnessProvider != address(0), "Invalid randomness provider");
        address oldProvider = randomnessProvider;
        randomnessProvider = _randomnessProvider;
        emit ComponentUpdated("RandomnessProvider", oldProvider, _randomnessProvider);
    }

    /**
     * @dev Update price oracle address
     * @param _priceOracle New price oracle address
     */
    function setPriceOracle(address _priceOracle) external onlyOwner {
        require(_priceOracle != address(0), "Invalid price oracle");
        address oldOracle = priceOracle;
        priceOracle = _priceOracle;
        emit ComponentUpdated("PriceOracle", oldOracle, _priceOracle);
    }

    // ======== View Functions ========

    /**
     * @dev Get lottery entry details
     * @param entryId Lottery entry ID
     */
    function getLotteryEntry(uint256 entryId) external view returns (LotteryEntry memory) {
        return lotteryEntries[entryId];
    }

    /**
     * @dev Get user's lottery entries
     * @param user User address
     * @return message Instructions for getting user entries
     *
     * Note: For gas efficiency, user entries are tracked via events.
     * Use off-chain indexing of LotteryEntryCreated events filtered by user address.
     */
    function getUserEntries(address user) external pure returns (string memory message) {
        return "Use off-chain indexing of LotteryEntryCreated events to get user entries";
    }

    /**
     * @dev Get user's pending entries count
     * @param user User address
     * @return count Number of pending entries
     */
    function getUserPendingEntries(address user) external view returns (uint256 count) {
        return userEntryCount[user];
    }

    /**
     * @dev Get lottery statistics
     * @return totalEntries_ Total entries created
     * @return totalWins_ Total wins
     * @return totalPayouts_ Total payout amount
     * @return winRate Win rate in basis points
     */
    function getLotteryStats() external view returns (
        uint256 totalEntries_,
        uint256 totalWins_,
        uint256 totalPayouts_,
        uint256 winRate
    ) {
        totalEntries_ = totalEntries;
        totalWins_ = totalWins;
        totalPayouts_ = totalPayouts;
        winRate = totalEntries > 0 ? (totalWins * 10000) / totalEntries : 0;
    }

    /**
     * @dev Check if user can create lottery entry
     * @param user User address
     * @return canCreate Whether user can create entry
     * @return reason Reason if cannot create
     */
    function canCreateEntry(address user) external view returns (bool canCreate, string memory reason) {
        if (block.timestamp < lastEntryTime[user] + COOLDOWN_PERIOD) {
            return (false, "Cooldown period active");
        }
        if (userEntryCount[user] >= MAX_ENTRIES_PER_USER) {
            return (false, "Too many pending entries");
        }
        return (true, "");
    }

    // ======== Emergency Functions ========

    /**
     * @dev Emergency process lottery entry (owner only)
     * @param entryId Lottery entry ID
     * @param randomValue Manual random value
     */
    function emergencyProcessEntry(uint256 entryId, uint256 randomValue) external onlyOwner {
        LotteryEntry storage entry = lotteryEntries[entryId];
        require(!entry.processed, "Entry already processed");
        require(entry.user != address(0), "Entry does not exist");

        // Process as if randomness was fulfilled
        entry.processed = true;

        bool won = _determineLotteryWin(entry.probabilityBps, randomValue);
        entry.won = won;

        // Update user entry count
        userEntryCount[entry.user]--;

        uint256 payoutAmount = 0;
        if (won) {
            payoutAmount = _processLotteryWin(entryId);
            entry.payoutAmount = payoutAmount;

            // Only update stats if payment was successful
            if (payoutAmount > 0) {
                totalWins++;
                totalPayouts += payoutAmount;
                emit LotteryWin(entryId, entry.user, entry.swapAmountUSD, entry.probabilityBps, payoutAmount);
            }
            // If payoutAmount is 0, payment failed and PaymentFailed event was already emitted
        }

        emit LotteryProcessed(entryId, entry.user, won, randomValue, payoutAmount);

        // Clean up mapping if exists
        if (randomnessRequestToEntryId[entry.randomnessRequestId] == entryId) {
            delete randomnessRequestToEntryId[entry.randomnessRequestId];
        }
    }

    /**
     * @dev Clean up stale entries (owner only)
     * @param entryIds Array of entry IDs to clean up
     * @notice For gas efficiency, process entries in batches of MAX_CLEANUP_BATCH_SIZE max
     * @notice Call multiple times with smaller batches if needed
     */
    function cleanupStaleEntries(uint256[] calldata entryIds) external onlyOwner {
        require(entryIds.length <= MAX_CLEANUP_BATCH_SIZE, "Batch size too large");

        for (uint256 i = 0; i < entryIds.length; i++) {
            uint256 entryId = entryIds[i];
            LotteryEntry storage entry = lotteryEntries[entryId];

            // Only clean up entries older than 24 hours that aren't processed
            if (!entry.processed &&
                entry.timestamp > 0 &&
                block.timestamp > entry.timestamp + 24 hours) {

                entry.processed = true;
                userEntryCount[entry.user]--;

                // Clean up mapping
                if (randomnessRequestToEntryId[entry.randomnessRequestId] == entryId) {
                    delete randomnessRequestToEntryId[entry.randomnessRequestId];
                }
            }
        }
    }
}
