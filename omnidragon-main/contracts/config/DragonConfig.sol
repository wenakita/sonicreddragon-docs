// SPDX-License-Identifier: MIT
// Auto-fixed for linting issues - $(date +%Y-%m-%d)
pragma solidity ^0.8.20;

/**
 * @title DragonConfig
 * @dev Configuration constants for Dragon token and ecosystem.
 * All percentages are in basis points (1/100 of a percent).
 * Example: 100 = 1%, 10000 = 100%
 *
 * Chain-specific configurations defined here are used by:
 * - ChainRegistry: for managing cross-chain address mappings
 * - DragonSwapTriggerV2: for handling chain-specific wrapped native tokens in lottery
 * - OmniDragon: for cross-chain message handling and token operations
 *
 * The lottery is triggered when users swap ANY chain's wrapped native token for DRAGON,
 * not just the original Sonic chain's WrappedNativeToken token.
 */
contract DragonConfig {
    // Custom Errors
    error BuyFeeComponentsMismatch();
    error SellFeeComponentsMismatch();

    // Token Constants
    string public constant NAME = "Dragon";
    string public constant SYMBOL = "DRAGON";

    // Chain-specific native token symbols
    string public constant SONIC_NATIVE_SYMBOL = "wS";          // Wrapped Sonic token
    string public constant ARBITRUM_NATIVE_SYMBOL = "wETH";     // Wrapped native token on Arbitrum
    string public constant BASE_NATIVE_SYMBOL = "wETH";         // Wrapped native token on Base
    string public constant ETHEREUM_NATIVE_SYMBOL = "wETH";     // Wrapped native token on Ethereum
    string public constant OPTIMISM_NATIVE_SYMBOL = "wETH";     // Wrapped native token on Optimism
    string public constant POLYGON_NATIVE_SYMBOL = "wMATIC";    // Wrapped native token on Polygon
    string public constant AVALANCHE_NATIVE_SYMBOL = "wAVAX";   // Wrapped native token on Avalanche
    string public constant BSC_NATIVE_SYMBOL = "wBNB";          // Wrapped native token on BSC
    string public constant FANTOM_NATIVE_SYMBOL = "wFTM";       // Wrapped native token on Fantom
    string public constant ZKSYNC_NATIVE_SYMBOL = "wETH";       // Wrapped native token on zkSync

    // Placeholder/reference symbol for dynamic chain detection
    string public constant WRAPPED_NATIVE_TOKEN_PLACEHOLDER = "WrappedNativeToken";

    // Fee Structure (in basis points)
    // Buy fees: 10% total
    uint256 public constant BUY_FEE_TOTAL = 1000;             // 10%
    uint256 public constant BUY_FEE_JACKPOT = 690;            // 6.9% to jackpot
    uint256 public constant BUY_FEE_VE69LP_DISTRIBUTOR = 241; // 2.41% to ve69LPfeedistributor
    uint256 public constant BUY_FEE_OTHER = 69;               // 0.69% (reserved for future use)

    // Sell fees: 10% total
    uint256 public constant SELL_FEE_TOTAL = 1000;             // 10%
    uint256 public constant SELL_FEE_JACKPOT = 690;            // 6.9% to jackpot
    uint256 public constant SELL_FEE_VE69LP_DISTRIBUTOR = 241; // 2.41% to ve69LPfeedistributor
    uint256 public constant SELL_FEE_OTHER = 69;               // 0.69% (reserved for future use)

    // Transfer fee: 0.69% burned
    uint256 public constant TRANSFER_BURN_FEE = 69;           // 0.69% burned on all transfers

    // Lottery trigger when swapping any native token for DRAGON
    bool public constant LOTTERY_ON_NATIVE_SWAP = true;

    // Voting Power Calculator settings
    uint256 public constant BASE_MULTIPLIER = 10000;          // 1x (no boost)
    uint256 public constant MAX_MULTIPLIER = 25000;           // 2.5x (maximum boost)
    uint256 public constant MAX_VP = 10000 * 1e18;            // Adjustable based on real-world data

    // Cross-chain Configuration
    // LayerZero Chain IDs
    uint32 public constant ETHEREUM_CHAIN_ID = 101;           // Ethereum chain ID on LayerZero
    uint32 public constant BSC_CHAIN_ID = 102;                // BNB Chain ID on LayerZero
    uint32 public constant AVALANCHE_CHAIN_ID = 106;          // Avalanche chain ID on LayerZero
    uint32 public constant POLYGON_CHAIN_ID = 109;            // Polygon chain ID on LayerZero
    uint32 public constant ARBITRUM_CHAIN_ID = 110;           // Arbitrum chain ID on LayerZero
    uint32 public constant OPTIMISM_CHAIN_ID = 111;           // Optimism chain ID on LayerZero
    uint32 public constant FANTOM_CHAIN_ID = 112;             // Fantom chain ID on LayerZero
    uint32 public constant BASE_CHAIN_ID = 184;               // Base chain ID on LayerZero
    uint32 public constant ZKSYNC_CHAIN_ID = 165;             // zkSync chain ID on LayerZero
    uint32 public constant SONIC_CHAIN_ID = 332;              // Sonic chain ID on LayerZero

    // VRF Configuration
    uint32 public constant VRF_CALLBACK_GAS_LIMIT = 500000;   // Gas limit for VRF callbacks
    uint16 public constant VRF_REQUEST_CONFIRMATIONS = 3;     // Confirmations before VRF response

    // Probability system config
    uint256 public constant MIN_USD_AMOUNT = 1 * 1e18;        // $1 USD scaled to 18 decimals
    uint256 public constant MAX_USD_AMOUNT = 10000 * 1e18;    // $10,000 USD scaled to 18 decimals
    uint256 public constant MIN_PROBABILITY = 4;              // 0.0004% (4 out of 1,000,000)
    uint256 public constant MAX_PROBABILITY = 40000;          // 4% (40,000 out of 1,000,000)
    uint256 public constant PROBABILITY_PRECISION = 1000000;  // Base for probability calculation

    // Partner Registry Configuration
    uint256 public constant DEFAULT_PROBABILITY_BOOST = 690;  // 6.9% total boost to share among partners

    /**
     * @dev Verify fee structure integrity
     * @return true if all fee calculations are consistent
     */
    function verifyFeeIntegrity() external pure returns (bool) {
        if (BUY_FEE_JACKPOT + BUY_FEE_VE69LP_DISTRIBUTOR + BUY_FEE_OTHER != BUY_FEE_TOTAL) {
            revert BuyFeeComponentsMismatch();
        }

        if (SELL_FEE_JACKPOT + SELL_FEE_VE69LP_DISTRIBUTOR + SELL_FEE_OTHER != SELL_FEE_TOTAL) {
            revert SellFeeComponentsMismatch();
        }

        return true;
    }

    /**
     * @dev Calculate lottery probability based on USD amount
     * @param usdAmount Amount in USD (scaled by 1e18)
     * @return probability The probability (out of PROBABILITY_PRECISION)
     */
    function calculateProbability(uint256 usdAmount) external pure returns (uint256 probability) {
        // Cap input value
        if (usdAmount < MIN_USD_AMOUNT) {
            usdAmount = MIN_USD_AMOUNT;
        } else if (usdAmount > MAX_USD_AMOUNT) {
            usdAmount = MAX_USD_AMOUNT;
        }

        // Linear interpolation between min and max values
        uint256 range = MAX_USD_AMOUNT - MIN_USD_AMOUNT;
        uint256 position = usdAmount - MIN_USD_AMOUNT;
        uint256 probabilityRange = MAX_PROBABILITY - MIN_PROBABILITY;

        probability = MIN_PROBABILITY + (position * probabilityRange / range);

        return probability;
    }
}
