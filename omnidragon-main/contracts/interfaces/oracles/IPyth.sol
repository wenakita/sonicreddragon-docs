// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPyth
 * @dev Simplified interface for Pyth Network price oracle
 *
 * Used by OmniDragonSwapTriggerOracle to read Pyth price feeds
 * Pyth uses a pull-based oracle model with on-demand updates
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
interface IPyth {
    /**
     * @dev Price structure returned by Pyth
     */
    struct Price {
        // Price value
        int64 price;
        // Confidence interval around the price
        uint64 conf;
        // Exponent for price (price = price * 10^expo)
        int32 expo;
        // Unix timestamp describing when the price was published
        uint publishTime;
    }

    /**
     * @dev Get the latest price for a price feed ID without staleness check
     * @param id The Pyth price feed ID (32 byte identifier)
     * @return price The latest available price
     */
    function getPriceUnsafe(bytes32 id) external view returns (Price memory price);

    /**
     * @dev Get the latest price for a price feed ID with staleness check
     * @param id The Pyth price feed ID
     * @return price The latest price if not stale, reverts otherwise
     */
    function getPrice(bytes32 id) external view returns (Price memory price);

    /**
     * @dev Get the validity period for price staleness checks
     * @return validTimePeriod The period in seconds after which prices are considered stale
     */
    function getValidTimePeriod() external view returns (uint validTimePeriod);
}
