// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "../library/access/Ownable.sol";
import {ReentrancyGuard} from "../library/security/ReentrancyGuard.sol";

/**
 * @dev Interface for randomness bucket
 */
interface IOmniDragonRandomnessBucket {
    function drawRandomness() external returns (uint256);
    function drawMultipleRandomness(uint256 count) external returns (uint256[] memory);
    function getRemainingNumbers() external view returns (uint256);
    function getBucketStatus() external view returns (uint256, uint256, uint256, bool, uint256);
}

/**
 * @title CostEfficientGameContract
 * @dev Example gaming contract showing massive LINK cost savings with randomness bucket
 *
 * Demonstrates how to use OmniDragon's randomness bucket for ultra-low-cost gaming
 * Reduces randomness costs by 99%+ compared to direct Chainlink VRF usage
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract CostEfficientGameContract is Ownable, ReentrancyGuard {

    IOmniDragonRandomnessBucket public immutable randomnessBucket;

    // Game state
    mapping(address => uint256) public playerWins;
    mapping(address => uint256) public playerGames;
    uint256 public totalGames;
    uint256 public totalRandomnessUsed;

    // Game events
    event DiceRolled(address indexed player, uint256 roll, bool won);
    event CardsDealt(address indexed player, uint256[5] cards);
    event LotteryDrawn(uint256 indexed round, address indexed winner, uint256 number);
    event RandomnessStats(uint256 totalUsed, uint256 bucketRemaining);

    constructor(address _randomnessBucket) {
        randomnessBucket = IOmniDragonRandomnessBucket(_randomnessBucket);
    }

    /**
     * @dev Roll a dice (1-6) - Ultra cheap randomness!
     */
    function rollDice() external nonReentrant returns (uint256 roll, bool won) {
        // Get one random number from bucket (cost: ~0.0002 LINK vs 0.25 LINK direct VRF)
        uint256 randomness = randomnessBucket.drawRandomness();

        // Convert to dice roll (1-6)
        roll = (randomness % 6) + 1;

        // Player wins if roll is 5 or 6 (33% chance)
        won = roll >= 5;

        // Update stats
        playerGames[msg.sender]++;
        totalGames++;
        totalRandomnessUsed++;

        if (won) {
            playerWins[msg.sender]++;
        }

        emit DiceRolled(msg.sender, roll, won);
        emit RandomnessStats(totalRandomnessUsed, randomnessBucket.getRemainingNumbers());

        return (roll, won);
    }

    /**
     * @dev Deal 5 poker cards - Batch randomness for efficiency!
     */
    function dealPokerHand() external nonReentrant returns (uint256[5] memory cards) {
        // Get 5 random numbers in one call (super efficient!)
        uint256[] memory randoms = randomnessBucket.drawMultipleRandomness(5);

        // Convert to card values (1-52)
        for (uint256 i = 0; i < 5; i++) {
            cards[i] = (randoms[i] % 52) + 1;
        }

        totalRandomnessUsed += 5;
        emit CardsDealt(msg.sender, cards);
        emit RandomnessStats(totalRandomnessUsed, randomnessBucket.getRemainingNumbers());

        return cards;
    }

    /**
     * @dev Daily lottery draw - Multiple players, one call!
     */
    function drawLottery(address[] calldata players) external onlyOwner returns (address winner, uint256 winningNumber) {
        require(players.length > 0, "No players");

        // Get 2 random numbers: one for winner selection, one for winning number
        uint256[] memory randoms = randomnessBucket.drawMultipleRandomness(2);

        // Select winner
        uint256 winnerIndex = randoms[0] % players.length;
        winner = players[winnerIndex];

        // Generate winning number (lottery style)
        winningNumber = randoms[1] % 1000000; // 6-digit number

        totalRandomnessUsed += 2;
        emit LotteryDrawn(totalGames, winner, winningNumber);
        emit RandomnessStats(totalRandomnessUsed, randomnessBucket.getRemainingNumbers());

        return (winner, winningNumber);
    }

    /**
     * @dev Simulate 100 dice rolls for massive cost savings demonstration
     */
    function simulate100DiceRolls() external onlyOwner returns (uint256[] memory rolls) {
        // Get 100 random numbers in one efficient call
        uint256[] memory randoms = randomnessBucket.drawMultipleRandomness(100);

        rolls = new uint256[](100);
        uint256 wins = 0;

        for (uint256 i = 0; i < 100; i++) {
            rolls[i] = (randoms[i] % 6) + 1;
            if (rolls[i] >= 5) wins++;
        }

        totalRandomnessUsed += 100;
        totalGames += 100;

        emit RandomnessStats(totalRandomnessUsed, randomnessBucket.getRemainingNumbers());

        return rolls;
    }

    /**
     * @dev Get cost comparison analysis
     */
    function getCostAnalysis() external view returns (
        uint256 randomnessUsed,
        uint256 traditionalCostLINK,      // Cost if using direct VRF
        uint256 bucketCostLINK,           // Actual cost with bucket
        uint256 savingsPercent
    ) {
        randomnessUsed = totalRandomnessUsed;

        // Traditional: Each random number = 0.25 LINK
        traditionalCostLINK = randomnessUsed * 25; // 0.25 LINK = 25 (with 2 decimals)

        // Bucket: ~1 LINK per 1000 numbers (with refills)
        bucketCostLINK = (randomnessUsed / 1000) * 25 + ((randomnessUsed % 1000) > 0 ? 25 : 0);

        // Calculate savings percentage
        if (traditionalCostLINK > 0) {
            savingsPercent = ((traditionalCostLINK - bucketCostLINK) * 100) / traditionalCostLINK;
        }

        return (randomnessUsed, traditionalCostLINK, bucketCostLINK, savingsPercent);
    }

    /**
     * @dev Get bucket status for monitoring
     */
    function getBucketInfo() external view returns (
        uint256 remaining,
        uint256 total,
        uint256 lastRefill,
        bool needsRefill,
        uint256 nextRefillAvailable
    ) {
        return randomnessBucket.getBucketStatus();
    }

    /**
     * @dev Get player statistics
     */
    function getPlayerStats(address player) external view returns (
        uint256 games,
        uint256 wins,
        uint256 winRate
    ) {
        games = playerGames[player];
        wins = playerWins[player];
        winRate = games > 0 ? (wins * 100) / games : 0;

        return (games, wins, winRate);
    }

    /**
     * @dev Get global game statistics
     */
    function getGlobalStats() external view returns (
        uint256 totalGamesPlayed,
        uint256 totalRandomnessConsumed,
        uint256 bucketNumbersRemaining
    ) {
        return (
            totalGames,
            totalRandomnessUsed,
            randomnessBucket.getRemainingNumbers()
        );
    }
}
