// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "../library/access/Ownable.sol";
import {ReentrancyGuard} from "../library/security/ReentrancyGuard.sol";
import "../interfaces/oracles/AggregatorV3Interface.sol";
import "../interfaces/oracles/IApi3Proxy.sol";
import "../interfaces/oracles/IPyth.sol";
import "../interfaces/oracles/IStdReference.sol";
import "../interfaces/oracles/IStorkOracle.sol";
import "../interfaces/oracles/IRedstoneOracle.sol";

/**
 * @title OmniDragonPriceOracle
 * @dev SINGLE SOURCE OF TRUTH for all price data in the OmniDragon ecosystem
 *
 * Responsibilities:
 * ✅ Aggregate prices from multiple oracle sources
 * ✅ Provide market condition data for lottery calculations
 * ✅ Circuit breaker and security features
 * ✅ Serve price data to ANY consumer (lottery, trading, etc.)
 *
 * Does NOT handle:
 * ❌ Lottery entries (handled by LotteryManager)
 * ❌ Randomness generation (handled by RandomnessProvider)
 * ❌ User management (handled by LotteryManager)
 *
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract OmniDragonPriceOracle is Ownable, ReentrancyGuard {

    // ======== Oracle Configuration ========
    enum OracleType { CHAINLINK, API3, BAND, PYTH, REDSTONE, STORK }

    struct OracleSource {
        address oracleAddress;
        OracleType oracleType;
        bool isActive;
        uint8 decimals;
        bytes32 priceId; // Used by Pyth and STORK
        string baseSymbol; // Used by Band Protocol
        string quoteSymbol; // Used by Band Protocol
    }

    struct PriceData {
        int256 price;
        uint256 timestamp;
        uint256 roundId;
    }

    // ======== Storage ========

    /// @notice Native token symbol for this chain (e.g., "SONIC", "ETH", "BNB", "MATIC")
    string public nativeTokenSymbol;

    /// @notice Quote token symbol (typically "USD")
    string public quoteTokenSymbol;

    /// @notice Mapping of oracle ID to oracle configuration
    mapping(uint8 => OracleSource) public oracleSources;

    /// @notice Number of currently active oracles
    uint8 public activeOracleCount;

    /// @notice Minimum number of oracles required for valid price aggregation
    uint8 public minimumOracleResponses = 1;

    /// @notice Mapping of oracle ID to last valid price data for circuit breaker functionality
    mapping(uint8 => PriceData) public lastValidPrices;

    // ======== Market Condition Tracking ========
    uint256 public totalSwapVolume;
    uint256 public swapCount;
    uint256 public averageSwapAmount;
    uint256 public lastPriceUpdate;
    int256 public lastAggregatedPrice;

    // Price volatility tracking
    uint256 public priceChangeCount;
    uint256 public significantPriceChanges; // Changes > 5%

    // ======== Constants ========

    /// @notice Maximum time in seconds before a price is considered stale
    uint256 public constant STALE_PRICE_THRESHOLD = 3600; // 1 hour

    /// @notice Maximum price change percentage (in basis points) before circuit breaker triggers
    uint256 public circuitBreakerThreshold = 5000; // 50% - configurable

    /// @notice Maximum oracle ID to check in price aggregation loops (limits gas usage)
    uint8 public constant MAX_ORACLE_ID_CHECK = 10;

    /// @notice Target decimal precision for aggregated prices
    uint8 public constant AGGREGATION_DECIMALS = 8;

    /// @notice Basis points denominator (10000 = 100%)
    uint256 public constant BASIS_POINTS_DENOMINATOR = 10000;

    /// @notice Significant price change threshold (500 = 5%)
    uint256 public significantChangeThreshold = 500; // 5% - configurable

    // ======== Events ========
    event OracleAdded(uint8 indexed oracleId, address oracleAddress, OracleType oracleType);
    event OracleUpdated(uint8 indexed oracleId, address oracleAddress, bool isActive);
    event MinimumOracleResponsesUpdated(uint8 oldValue, uint8 newValue);
    event NativeTokenConfigured(string nativeSymbol, string quoteSymbol);
    event PriceAggregated(int256 price, uint256 timestamp, uint8 oracleCount);
    event MarketConditionUpdated(uint256 swapVolume, uint256 swapCount, uint256 marketScore);
    event CircuitBreakerTriggered(uint8 indexed oracleId, int256 oldPrice, int256 newPrice);
    event MarketStatsReset(uint256 newVolume, uint256 newCount, string reason);
    event SignificantPriceChange(int256 oldPrice, int256 newPrice, uint256 changePercent);
    event PriceRefreshed(int256 price, uint256 timestamp, bool success);
    event CircuitBreakerThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);
    event SignificantChangeThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);

    // ======== Constructor ========
    constructor(
        string memory _nativeSymbol,
        string memory _quoteSymbol
    ) {
        require(bytes(_nativeSymbol).length > 0, "Empty native symbol");
        require(bytes(_quoteSymbol).length > 0, "Empty quote symbol");

        nativeTokenSymbol = _nativeSymbol;
        quoteTokenSymbol = _quoteSymbol;

        emit NativeTokenConfigured(_nativeSymbol, _quoteSymbol);
    }

    // ======== Main Price Functions ========

    /**
     * @dev Get current aggregated price
     * @return price Aggregated price in 8 decimals
     * @return success Whether price aggregation was successful
     * @return timestamp Timestamp of the price
     */
    function getAggregatedPrice() external view returns (int256 price, bool success, uint256 timestamp) {
        (price, success) = _getAggregatedPriceView();
        timestamp = lastPriceUpdate;
        return (price, success, timestamp);
    }

    /**
     * @dev Update and get fresh aggregated price (state-changing)
     * @return price Aggregated price in 8 decimals
     * @return success Whether price aggregation was successful
     */
    function updateAndGetPrice() external returns (int256 price, bool success) {
        return _fetchAndAggregatePrice();
    }

    /**
     * @dev Get market condition score (0-100)
     * @return score Market condition score based on volatility and volume
     */
    function getMarketConditionScore() external view returns (uint256 score) {
        // Base score starts at 50 (neutral)
        score = 50;

        // Adjust based on price volatility (lower volatility = higher score)
        if (priceChangeCount > 0) {
            uint256 volatilityRatio = (significantPriceChanges * 10000) / priceChangeCount;
            if (volatilityRatio < 1000) { // Less than 10% significant changes
                score += 20;
            } else if (volatilityRatio > 5000) { // More than 50% significant changes
                score = score > 20 ? score - 20 : 0;
            }
        }

        // Adjust based on recent activity
        if (block.timestamp - lastPriceUpdate < 300) { // Updated within 5 minutes
            score += 10;
        } else if (block.timestamp - lastPriceUpdate > 3600) { // Not updated for 1 hour
            score = score > 15 ? score - 15 : 0;
        }

        // Ensure score is within bounds
        if (score > 100) score = 100;

        return score;
    }

    /**
     * @dev Update market conditions with new swap data
     * @param swapAmount Swap amount to add to statistics
     * @notice WARNING: This function calls _fetchAndAggregatePrice which performs expensive oracle queries
     * @notice High gas cost - consider batching multiple swap updates before calling
     */
    function updateMarketConditions(uint256 swapAmount) external nonReentrant {
        require(swapAmount > 0, "Invalid swap amount");

        // Update swap statistics with overflow protection
        if (totalSwapVolume > type(uint256).max - swapAmount) {
            // On overflow, preserve recent statistics by keeping last 1000 swaps
            // This maintains a meaningful average while preventing overflow
            uint256 preservedSwaps = swapCount > 1000 ? 1000 : swapCount;
            totalSwapVolume = averageSwapAmount * preservedSwaps;
            swapCount = preservedSwaps;

            emit MarketStatsReset(totalSwapVolume, swapCount, "Overflow protection triggered");
        }

        totalSwapVolume += swapAmount;
        swapCount++;

        // Recalculate average
        if (swapCount > 0) {
            averageSwapAmount = totalSwapVolume / swapCount;
        } else {
            averageSwapAmount = 0;
        }

        // Use last stored price for volatility calculations (gas efficient)
        // Price updates are handled separately by keepers/automation
        if (lastAggregatedPrice != 0) {
            // Track price age for market condition scoring
            uint256 priceAge = block.timestamp - lastPriceUpdate;

            // Only update price change stats if we have a recent price (< 1 hour old)
            if (priceAge < 3600) {
                priceChangeCount++;
                // Note: Actual price change detection happens in refreshPrice() function
            }
        }

        uint256 marketScore = this.getMarketConditionScore();
        emit MarketConditionUpdated(totalSwapVolume, swapCount, marketScore);
    }

    /**
     * @dev Refresh price data from oracles (called by keepers/automation)
     * @notice This function should be called periodically to update price data
     * @notice Separated from updateMarketConditions for gas efficiency
     */
    function refreshPrice() external nonReentrant {
        int256 previousPrice = lastAggregatedPrice;
        (int256 currentPrice, bool success) = _fetchAndAggregatePrice();

        if (success && previousPrice != 0) {
            // Calculate price change for volatility tracking
            uint256 priceChange = currentPrice > previousPrice
                ? uint256((currentPrice - previousPrice) * 10000 / previousPrice)
                : uint256((previousPrice - currentPrice) * 10000 / previousPrice);

            if (priceChange > significantChangeThreshold) {
                significantPriceChanges++;
                emit SignificantPriceChange(previousPrice, currentPrice, priceChange);
            }
        }

        emit PriceRefreshed(currentPrice, block.timestamp, success);
    }

    // ======== Oracle Management ========

    /**
     * @dev Add an oracle data source
     * @param _oracleId ID for this oracle (MUST be < MAX_ORACLE_ID_CHECK for aggregation)
     * @param _oracleAddress Contract address of the oracle
     * @param _oracleType Type of oracle (Chainlink, API3, etc.)
     * @param _decimals Number of decimals in the price feed
     * @param _priceId Price feed identifier (used by Pyth/STORK/RedStone, 0x0 for others)
     * @param _baseSymbol Base symbol (used by Band, empty for others)
     * @param _quoteSymbol Quote symbol (used by Band, empty for others)
     */
    function addOracle(
        uint8 _oracleId,
        address _oracleAddress,
        OracleType _oracleType,
        uint8 _decimals,
        bytes32 _priceId,
        string memory _baseSymbol,
        string memory _quoteSymbol
    ) external onlyOwner {
        require(_oracleId < MAX_ORACLE_ID_CHECK, "Oracle ID must be less than MAX_ORACLE_ID_CHECK");
        require(_oracleAddress != address(0), "Zero oracle address");
        require(!oracleSources[_oracleId].isActive, "Oracle ID already in use");

        // Validate required parameters based on oracle type
        if (_oracleType == OracleType.PYTH || _oracleType == OracleType.STORK || _oracleType == OracleType.REDSTONE) {
            require(_priceId != bytes32(0), "Price ID required for this oracle type");
        }
        if (_oracleType == OracleType.BAND) {
            require(bytes(_baseSymbol).length > 0, "Base symbol required for Band oracle");
            require(bytes(_quoteSymbol).length > 0, "Quote symbol required for Band oracle");
        }

        oracleSources[_oracleId] = OracleSource({
            oracleAddress: _oracleAddress,
            oracleType: _oracleType,
            isActive: true,
            decimals: _decimals,
            priceId: _priceId,
            baseSymbol: _baseSymbol,
            quoteSymbol: _quoteSymbol
        });

        activeOracleCount++;

        // Reset circuit breaker data for new oracle
        lastValidPrices[_oracleId] = PriceData({
            price: 0,
            timestamp: 0,
            roundId: 0
        });

        emit OracleAdded(_oracleId, _oracleAddress, _oracleType);
    }

    /**
     * @dev Update oracle status (enable/disable)
     * @param _oracleId ID of the oracle to update
     * @param _isActive Whether the oracle should be active
     */
    function updateOracleStatus(uint8 _oracleId, bool _isActive) external onlyOwner {
        require(oracleSources[_oracleId].oracleAddress != address(0), "Oracle does not exist");

        if (oracleSources[_oracleId].isActive && !_isActive) {
            require(activeOracleCount > minimumOracleResponses, "Deactivating would drop below minimum required oracles");
            activeOracleCount--;
        } else if (!oracleSources[_oracleId].isActive && _isActive) {
            activeOracleCount++;
        }

        oracleSources[_oracleId].isActive = _isActive;
        emit OracleUpdated(_oracleId, oracleSources[_oracleId].oracleAddress, _isActive);
    }

    /**
     * @dev Set minimum number of oracles required for a valid price
     * @param _minResponses Minimum required responses
     */
    function setMinimumOracleResponses(uint8 _minResponses) external onlyOwner {
        require(_minResponses > 0, "Must require at least 1 oracle");
        require(_minResponses <= activeOracleCount, "Min responses exceeds active oracles");

        uint8 oldValue = minimumOracleResponses;
        minimumOracleResponses = _minResponses;
        emit MinimumOracleResponsesUpdated(oldValue, _minResponses);
    }

    /**
     * @dev Set circuit breaker threshold
     * @param _threshold New threshold in basis points (5000 = 50%)
     */
    function setCircuitBreakerThreshold(uint256 _threshold) external onlyOwner {
        require(_threshold > 0 && _threshold <= 10000, "Invalid threshold");
        uint256 oldThreshold = circuitBreakerThreshold;
        circuitBreakerThreshold = _threshold;
        emit CircuitBreakerThresholdUpdated(oldThreshold, _threshold);
    }

    /**
     * @dev Set significant change threshold
     * @param _threshold New threshold in basis points (500 = 5%)
     */
    function setSignificantChangeThreshold(uint256 _threshold) external onlyOwner {
        require(_threshold > 0 && _threshold <= 10000, "Invalid threshold");
        uint256 oldThreshold = significantChangeThreshold;
        significantChangeThreshold = _threshold;
        emit SignificantChangeThresholdUpdated(oldThreshold, _threshold);
    }

    // ======== Internal Price Functions ========

    /**
     * @dev Fetch and aggregate prices from multiple oracles with state updates
     * @return aggregatedPrice The median price from all active oracles
     * @return success Whether enough oracles responded successfully
     */
    function _fetchAndAggregatePrice() internal returns (int256 aggregatedPrice, bool success) {
        int256[] memory prices = new int256[](MAX_ORACLE_ID_CHECK);
        uint8 validPrices = 0;

        // Collect prices from all active oracles
        for (uint8 i = 0; i < MAX_ORACLE_ID_CHECK; i++) {
            if (oracleSources[i].isActive) {
                (int256 price, bool priceSuccess) = _getPriceFromOracleSecure(i);

                if (priceSuccess && price > 0) {
                    prices[validPrices] = price;
                    validPrices++;
                }
            }
        }

        // Check if we have enough valid prices
        if (validPrices < minimumOracleResponses) {
            return (0, false);
        }

        // Calculate median from collected prices
        aggregatedPrice = _calculateMedian(prices, validPrices);

        // Update state
        lastAggregatedPrice = aggregatedPrice;
        lastPriceUpdate = block.timestamp;

        emit PriceAggregated(aggregatedPrice, block.timestamp, validPrices);

        return (aggregatedPrice, true);
    }

    /**
     * @dev Get aggregated price without updating state (view-only)
     * @return aggregatedPrice The median price from all active oracles
     * @return success Whether enough oracles responded successfully
     */
    function _getAggregatedPriceView() internal view returns (int256 aggregatedPrice, bool success) {
        int256[] memory prices = new int256[](MAX_ORACLE_ID_CHECK);
        uint8 validPrices = 0;

        // Collect prices from all active oracles (view-only)
        for (uint8 i = 0; i < MAX_ORACLE_ID_CHECK; i++) {
            if (oracleSources[i].isActive) {
                (int256 price, bool priceSuccess) = _getPriceFromOracleView(i);

                if (priceSuccess && price > 0) {
                    prices[validPrices] = price;
                    validPrices++;
                }
            }
        }

        // Check if we have enough valid prices
        if (validPrices < minimumOracleResponses) {
            return (lastAggregatedPrice, false); // Return last known price
        }

        // Calculate median from collected prices
        aggregatedPrice = _calculateMedian(prices, validPrices);

        return (aggregatedPrice, true);
    }

    /**
     * @dev Enhanced oracle price fetching with security checks and state updates
     * @param _oracleId The oracle ID to fetch price from
     * @return price The fetched price normalized to 8 decimals
     * @return success Whether the price fetch was successful
     */
    function _getPriceFromOracleSecure(uint8 _oracleId) internal returns (int256 price, bool success) {
        OracleSource memory source = oracleSources[_oracleId];

        if (!source.isActive || source.oracleAddress == address(0)) {
            return (0, false);
        }

        if (source.oracleType == OracleType.CHAINLINK) {
            try AggregatorV3Interface(source.oracleAddress).latestRoundData() returns (
                uint80 roundId, int256 answer, uint256, uint256 updatedAt, uint80
            ) {
                // Check for stale prices
                if (block.timestamp - updatedAt >= STALE_PRICE_THRESHOLD) {
                    return (0, false);
                }

                // Check for zero/negative prices
                if (answer <= 0) {
                    return (0, false);
                }

                // Normalize price to 8 decimals
                if (source.decimals > 8) {
                    answer = answer / int256(10 ** (source.decimals - 8));
                } else if (source.decimals < 8) {
                    answer = answer * int256(10 ** (8 - source.decimals));
                }

                // Circuit breaker check against last valid price
                PriceData memory lastPrice = lastValidPrices[_oracleId];
                if (lastPrice.price > 0) {
                    uint256 priceChange = answer > lastPrice.price
                        ? uint256((answer - lastPrice.price) * 10000 / lastPrice.price)
                        : uint256((lastPrice.price - answer) * 10000 / lastPrice.price);

                    if (priceChange > circuitBreakerThreshold) {
                        emit CircuitBreakerTriggered(_oracleId, lastPrice.price, answer);
                        return (0, false); // Price change too extreme
                    }
                }

                // Update lastValidPrices with the successfully validated price
                lastValidPrices[_oracleId] = PriceData({
                    price: answer,
                    timestamp: updatedAt,
                    roundId: roundId
                });

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // API3 Oracle Implementation
        if (source.oracleType == OracleType.API3) {
            try IApi3Proxy(source.oracleAddress).read() returns (int224 value, uint32 timestamp) {
                // Check for stale prices
                if (block.timestamp - uint256(timestamp) >= STALE_PRICE_THRESHOLD) {
                    return (0, false);
                }

                int256 answer = int256(value);

                // Check for zero/negative prices
                if (answer <= 0) {
                    return (0, false);
                }

                // API3 returns 18 decimals, normalize to 8
                answer = answer / int256(10 ** 10);

                // Circuit breaker check
                PriceData memory lastPrice = lastValidPrices[_oracleId];
                if (lastPrice.price > 0) {
                    uint256 priceChange = answer > lastPrice.price
                        ? uint256((answer - lastPrice.price) * 10000 / lastPrice.price)
                        : uint256((lastPrice.price - answer) * 10000 / lastPrice.price);

                    if (priceChange > circuitBreakerThreshold) {
                        emit CircuitBreakerTriggered(_oracleId, lastPrice.price, answer);
                        return (0, false);
                    }
                }

                // Update last valid price
                lastValidPrices[_oracleId] = PriceData({
                    price: answer,
                    timestamp: uint256(timestamp),
                    roundId: 0 // API3 doesn't have round IDs
                });

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // Band Protocol Oracle Implementation
        if (source.oracleType == OracleType.BAND) {
            try IStdReference(source.oracleAddress).getReferenceData(
                source.baseSymbol,
                source.quoteSymbol
            ) returns (IStdReference.ReferenceData memory data) {
                // Check for stale prices
                uint256 lastUpdate = data.lastUpdatedBase > data.lastUpdatedQuote
                    ? data.lastUpdatedBase
                    : data.lastUpdatedQuote;

                if (block.timestamp - lastUpdate >= STALE_PRICE_THRESHOLD) {
                    return (0, false);
                }

                // Band returns price with 18 decimals, convert to int256 and normalize to 8
                int256 answer = int256(data.rate / 10 ** 10);

                // Check for zero/negative prices
                if (answer <= 0) {
                    return (0, false);
                }

                // Circuit breaker check
                PriceData memory lastPrice = lastValidPrices[_oracleId];
                if (lastPrice.price > 0) {
                    uint256 priceChange = answer > lastPrice.price
                        ? uint256((answer - lastPrice.price) * 10000 / lastPrice.price)
                        : uint256((lastPrice.price - answer) * 10000 / lastPrice.price);

                    if (priceChange > circuitBreakerThreshold) {
                        emit CircuitBreakerTriggered(_oracleId, lastPrice.price, answer);
                        return (0, false);
                    }
                }

                // Update last valid price
                lastValidPrices[_oracleId] = PriceData({
                    price: answer,
                    timestamp: lastUpdate,
                    roundId: 0 // Band doesn't have round IDs
                });

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // Pyth Network Oracle Implementation
        if (source.oracleType == OracleType.PYTH) {
            try IPyth(source.oracleAddress).getPriceUnsafe(source.priceId) returns (IPyth.Price memory pythPrice) {
                // Check for stale prices
                if (block.timestamp - pythPrice.publishTime >= STALE_PRICE_THRESHOLD) {
                    return (0, false);
                }

                // Convert Pyth price to standard format
                // Pyth uses price * 10^expo format
                int256 answer;
                int32 targetDecimals = 8;
                int32 deltaDecimals = pythPrice.expo - targetDecimals;

                if (deltaDecimals >= 0) {
                    // Need to multiply
                    answer = int256(pythPrice.price) * int256(10 ** uint32(deltaDecimals));
                } else {
                    // Need to divide
                    answer = int256(pythPrice.price) / int256(10 ** uint32(-deltaDecimals));
                }

                // Check for zero/negative prices
                if (answer <= 0) {
                    return (0, false);
                }

                // Circuit breaker check
                PriceData memory lastPrice = lastValidPrices[_oracleId];
                if (lastPrice.price > 0) {
                    uint256 priceChange = answer > lastPrice.price
                        ? uint256((answer - lastPrice.price) * 10000 / lastPrice.price)
                        : uint256((lastPrice.price - answer) * 10000 / lastPrice.price);

                    if (priceChange > circuitBreakerThreshold) {
                        emit CircuitBreakerTriggered(_oracleId, lastPrice.price, answer);
                        return (0, false);
                    }
                }

                // Update last valid price
                lastValidPrices[_oracleId] = PriceData({
                    price: answer,
                    timestamp: pythPrice.publishTime,
                    roundId: 0 // Pyth doesn't have round IDs
                });

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // RedStone Oracle Implementation
        if (source.oracleType == OracleType.REDSTONE) {
            try IRedstoneOracle(source.oracleAddress).getValueWithTimestamp(source.priceId) returns (
                uint256 value,
                uint256 timestamp
            ) {
                // Check for stale prices
                if (block.timestamp - timestamp >= STALE_PRICE_THRESHOLD) {
                    return (0, false);
                }

                // Check if uint256 value can be safely converted to int256
                if (value > uint256(type(int256).max)) {
                    return (0, false);
                }

                int256 answer = int256(value);

                // Check for zero prices
                if (answer <= 0) {
                    return (0, false);
                }

                // Normalize price to 8 decimals
                if (source.decimals > 8) {
                    answer = answer / int256(10 ** (source.decimals - 8));
                } else if (source.decimals < 8) {
                    answer = answer * int256(10 ** (8 - source.decimals));
                }

                // Circuit breaker check
                PriceData memory lastPrice = lastValidPrices[_oracleId];
                if (lastPrice.price > 0) {
                    uint256 priceChange = answer > lastPrice.price
                        ? uint256((answer - lastPrice.price) * 10000 / lastPrice.price)
                        : uint256((lastPrice.price - answer) * 10000 / lastPrice.price);

                    if (priceChange > circuitBreakerThreshold) {
                        emit CircuitBreakerTriggered(_oracleId, lastPrice.price, answer);
                        return (0, false);
                    }
                }

                // Update last valid price
                lastValidPrices[_oracleId] = PriceData({
                    price: answer,
                    timestamp: timestamp,
                    roundId: 0 // RedStone doesn't have round IDs
                });

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // STORK Oracle Implementation
        if (source.oracleType == OracleType.STORK) {
            try IStorkOracle(source.oracleAddress).getLatestPrice(source.priceId) returns (
                uint256 price,
                uint256 timestamp
            ) {
                // Check for stale prices
                if (block.timestamp - timestamp >= STALE_PRICE_THRESHOLD) {
                    return (0, false);
                }

                // Check if uint256 value can be safely converted to int256
                if (price > uint256(type(int256).max)) {
                    return (0, false);
                }

                int256 answer = int256(price);

                // Check for zero prices
                if (answer <= 0) {
                    return (0, false);
                }

                // Normalize price to 8 decimals
                if (source.decimals > 8) {
                    answer = answer / int256(10 ** (source.decimals - 8));
                } else if (source.decimals < 8) {
                    answer = answer * int256(10 ** (8 - source.decimals));
                }

                // Circuit breaker check
                PriceData memory lastPrice = lastValidPrices[_oracleId];
                if (lastPrice.price > 0) {
                    uint256 priceChange = answer > lastPrice.price
                        ? uint256((answer - lastPrice.price) * 10000 / lastPrice.price)
                        : uint256((lastPrice.price - answer) * 10000 / lastPrice.price);

                    if (priceChange > circuitBreakerThreshold) {
                        emit CircuitBreakerTriggered(_oracleId, lastPrice.price, answer);
                        return (0, false);
                    }
                }

                // Update last valid price
                lastValidPrices[_oracleId] = PriceData({
                    price: answer,
                    timestamp: timestamp,
                    roundId: 0 // STORK doesn't have round IDs
                });

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        return (0, false);
    }

    /**
     * @dev View-only oracle price fetching without state updates
     * @param _oracleId The oracle ID to fetch price from
     * @return price The fetched price normalized to 8 decimals
     * @return success Whether the price fetch was successful
     */
    function _getPriceFromOracleView(uint8 _oracleId) internal view returns (int256 price, bool success) {
        OracleSource memory source = oracleSources[_oracleId];

        if (!source.isActive || source.oracleAddress == address(0)) {
            return (0, false);
        }

        // Simplified oracle price fetching without circuit breaker updates
        if (source.oracleType == OracleType.CHAINLINK) {
            try AggregatorV3Interface(source.oracleAddress).latestRoundData() returns (
                uint80, int256 answer, uint256, uint256 updatedAt, uint80
            ) {
                if (block.timestamp - updatedAt >= STALE_PRICE_THRESHOLD || answer <= 0) {
                    return (0, false);
                }

                // Normalize price to 8 decimals
                if (source.decimals > 8) {
                    answer = answer / int256(10 ** (source.decimals - 8));
                } else if (source.decimals < 8) {
                    answer = answer * int256(10 ** (8 - source.decimals));
                }

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // API3 Oracle Implementation (view-only)
        if (source.oracleType == OracleType.API3) {
            try IApi3Proxy(source.oracleAddress).read() returns (int224 value, uint32 timestamp) {
                if (block.timestamp - uint256(timestamp) >= STALE_PRICE_THRESHOLD || int256(value) <= 0) {
                    return (0, false);
                }

                // API3 returns 18 decimals, normalize to 8
                int256 answer = int256(value) / int256(10 ** 10);
                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // Band Protocol Oracle Implementation (view-only)
        if (source.oracleType == OracleType.BAND) {
            try IStdReference(source.oracleAddress).getReferenceData(
                source.baseSymbol,
                source.quoteSymbol
            ) returns (IStdReference.ReferenceData memory data) {
                uint256 lastUpdate = data.lastUpdatedBase > data.lastUpdatedQuote
                    ? data.lastUpdatedBase
                    : data.lastUpdatedQuote;

                if (block.timestamp - lastUpdate >= STALE_PRICE_THRESHOLD) {
                    return (0, false);
                }

                // Band returns price with 18 decimals, normalize to 8
                int256 answer = int256(data.rate / 10 ** 10);

                if (answer <= 0) {
                    return (0, false);
                }

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // Pyth Network Oracle Implementation (view-only)
        if (source.oracleType == OracleType.PYTH) {
            try IPyth(source.oracleAddress).getPriceUnsafe(source.priceId) returns (IPyth.Price memory pythPrice) {
                if (block.timestamp - pythPrice.publishTime >= STALE_PRICE_THRESHOLD) {
                    return (0, false);
                }

                // Convert Pyth price to standard format
                int256 answer;
                int32 targetDecimals = 8;
                int32 deltaDecimals = pythPrice.expo - targetDecimals;

                if (deltaDecimals >= 0) {
                    answer = int256(pythPrice.price) * int256(10 ** uint32(deltaDecimals));
                } else {
                    answer = int256(pythPrice.price) / int256(10 ** uint32(-deltaDecimals));
                }

                if (answer <= 0) {
                    return (0, false);
                }

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // RedStone Oracle Implementation (view-only)
        if (source.oracleType == OracleType.REDSTONE) {
            try IRedstoneOracle(source.oracleAddress).getValueWithTimestamp(source.priceId) returns (
                uint256 value,
                uint256 timestamp
            ) {
                if (block.timestamp - timestamp >= STALE_PRICE_THRESHOLD || value == 0) {
                    return (0, false);
                }

                // Check if uint256 value can be safely converted to int256
                if (value > uint256(type(int256).max)) {
                    return (0, false);
                }

                int256 answer = int256(value);

                // Normalize price to 8 decimals
                if (source.decimals > 8) {
                    answer = answer / int256(10 ** (source.decimals - 8));
                } else if (source.decimals < 8) {
                    answer = answer * int256(10 ** (8 - source.decimals));
                }

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        // STORK Oracle Implementation (view-only)
        if (source.oracleType == OracleType.STORK) {
            try IStorkOracle(source.oracleAddress).getLatestPrice(source.priceId) returns (
                uint256 price,
                uint256 timestamp
            ) {
                if (block.timestamp - timestamp >= STALE_PRICE_THRESHOLD || price == 0) {
                    return (0, false);
                }

                // Check if uint256 value can be safely converted to int256
                if (price > uint256(type(int256).max)) {
                    return (0, false);
                }

                int256 answer = int256(price);

                // Normalize price to 8 decimals
                if (source.decimals > 8) {
                    answer = answer / int256(10 ** (source.decimals - 8));
                } else if (source.decimals < 8) {
                    answer = answer * int256(10 ** (8 - source.decimals));
                }

                return (answer, true);
            } catch {
                return (0, false);
            }
        }

        return (0, false);
    }

    /**
     * @dev Calculate median from an array of prices
     * @param prices Array of prices to calculate median from
     * @param count Number of valid prices in the array
     * @return median The median price
     */
    function _calculateMedian(int256[] memory prices, uint8 count) internal pure returns (int256 median) {
        if (count == 0) return 0;
        if (count == 1) return prices[0];

        // Sort prices using bubble sort
        for (uint8 i = 0; i < count - 1; i++) {
            for (uint8 j = 0; j < count - i - 1; j++) {
                if (prices[j] > prices[j + 1]) {
                    int256 temp = prices[j];
                    prices[j] = prices[j + 1];
                    prices[j + 1] = temp;
                }
            }
        }

        // Calculate median
        if (count % 2 == 0) {
            // Even number of prices, average the middle two
            median = (prices[count / 2 - 1] + prices[count / 2]) / 2;
        } else {
            // Odd number of prices, take the middle one
            median = prices[count / 2];
        }

        return median;
    }

    // ======== View Functions ========

    /**
     * @dev Get oracle configuration for a specific oracle ID
     * @param _oracleId The oracle ID to query
     */
    function getOracleConfig(uint8 _oracleId) external view returns (
        address oracleAddress,
        OracleType oracleType,
        bool isActive,
        uint8 decimals,
        bytes32 priceId,
        string memory baseSymbol,
        string memory quoteSymbol
    ) {
        OracleSource memory oracle = oracleSources[_oracleId];
        return (
            oracle.oracleAddress,
            oracle.oracleType,
            oracle.isActive,
            oracle.decimals,
            oracle.priceId,
            oracle.baseSymbol,
            oracle.quoteSymbol
        );
    }

    /**
     * @dev Get market statistics
     */
    function getMarketStats() external view returns (
        uint256 totalVolume,
        uint256 totalSwaps,
        uint256 avgSwapAmount,
        uint256 priceChanges,
        uint256 significantChanges,
        uint256 lastUpdate
    ) {
        return (
            totalSwapVolume,
            swapCount,
            averageSwapAmount,
            priceChangeCount,
            significantPriceChanges,
            lastPriceUpdate
        );
    }

    /**
     * @dev Get last valid price for an oracle
     * @param _oracleId Oracle ID
     */
    function getLastValidPrice(uint8 _oracleId) external view returns (PriceData memory) {
        return lastValidPrices[_oracleId];
    }

    // ======== Configuration Functions ========

    /**
     * @dev Update native token configuration
     * @param _nativeSymbol New native token symbol
     * @param _quoteSymbol New quote token symbol
     */
    function updateTokenConfig(
        string memory _nativeSymbol,
        string memory _quoteSymbol
    ) external onlyOwner {
        require(bytes(_nativeSymbol).length > 0, "Empty native symbol");
        require(bytes(_quoteSymbol).length > 0, "Empty quote symbol");

        nativeTokenSymbol = _nativeSymbol;
        quoteTokenSymbol = _quoteSymbol;

        emit NativeTokenConfigured(_nativeSymbol, _quoteSymbol);
    }

    /**
     * @dev Reset market statistics (emergency function)
     */
    function resetMarketStats() external onlyOwner {
        totalSwapVolume = 0;
        swapCount = 0;
        averageSwapAmount = 0;
        priceChangeCount = 0;
        significantPriceChanges = 0;
        emit MarketStatsReset(totalSwapVolume, swapCount, "Emergency reset");
    }
}
