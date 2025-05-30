// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IApi3Proxy
 * @dev Interface for API3 data feed proxy contracts
 *
 * Used by OmniDragonSwapTriggerOracle to read API3 price feeds
 * API3 provides decentralized data feeds with 18 decimal precision
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
interface IApi3Proxy {
    /**
     * @dev Reads the current value and timestamp from the proxy
     * @return value The current value with 18 decimals precision
     * @return timestamp The timestamp of the last update (off-chain time)
     */
    function read() external view returns (int224 value, uint32 timestamp);
}
