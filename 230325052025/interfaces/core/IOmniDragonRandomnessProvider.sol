// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IOmniDragonRandomnessProvider
 * @dev Interface for the unified OmniDragon Randomness Provider
 */
interface IOmniDragonRandomnessProvider {
    /**
     * @dev VRF Source enumeration
     */
    enum VRFSource {
        CHAINLINK_V2_5,    // Primary: Chainlink VRF 2.5 on Arbitrum
        DRAND_BEACON,      // Secondary: Drand League of Entropy
        CHAINLINK_V2_0,    // Fallback: Legacy Chainlink VRF 2.0
        DRAND_QUICKNET,    // Tertiary: Drand Quicknet for fast randomness
        DRAND_EVMNET       // Quaternary: Drand EVMnet for EVM-optimized randomness
    }

    /**
     * @dev VRF configuration structure
     */
    struct VRFConfig {
        address contractAddress;    // VRF contract address
        bool isActive;             // Whether this VRF source is active
        uint256 priority;          // Priority level (1 = highest)
        uint256 maxRetries;        // Maximum retry attempts
        uint256 timeoutSeconds;    // Timeout for VRF response
        uint256 successCount;      // Number of successful requests
        uint256 failureCount;      // Number of failed requests
    }

    /**
     * @dev Randomness request structure
     */
    struct RandomnessRequest {
        address requester;         // Contract requesting randomness
        VRFSource vrfSource;       // VRF source for this request
        uint256 requestTime;       // When the request was made
        uint256 retryCount;        // Number of retry attempts
        bool fulfilled;            // Whether request has been fulfilled
        bool useBucket;            // Whether to use bucket system
    }

    /**
     * @dev Request randomness (main entry point for all consumers)
     * @return requestId The randomness request ID
     */
    function requestRandomness() external returns (uint256 requestId);

    /**
     * @dev Request randomness with specific VRF source
     * @param vrfSource Preferred VRF source
     * @param useBucket Whether to use bucket system for cost efficiency
     * @return requestId The randomness request ID
     */
    function requestRandomnessWithSource(VRFSource vrfSource, bool useBucket) external returns (uint256 requestId);

    /**
     * @dev Draw randomness from bucket (for high-frequency, low-cost randomness)
     * @return randomness A unique random number
     */
    function drawRandomnessFromBucket() external returns (uint256 randomness);

    /**
     * @dev Draw randomness from the enhanced pool (most efficient method)
     * @notice This provides pre-generated randomness from multiple sources
     * @return randomness A cryptographically secure random number
     */
    function drawFromRandomnessPool() external returns (uint256 randomness);

    /**
     * @dev Get aggregated Drand randomness (free, immediate)
     * @return randomness Current aggregated randomness
     */
    function getAggregatedRandomness() external view returns (uint256 randomness);

    /**
     * @dev Get VRF source configuration
     * @param source VRF source
     * @return config VRF configuration
     */
    function getVRFConfig(VRFSource source) external view returns (VRFConfig memory config);

    /**
     * @dev Get randomness request details
     * @param requestId Request ID
     * @return request Randomness request details
     */
    function getRandomnessRequest(uint256 requestId) external view returns (RandomnessRequest memory request);

    /**
     * @dev Get bucket status
     * @return remaining Numbers remaining in bucket
     * @return total Total bucket size
     * @return lastRefill Last refill timestamp
     * @return needsRefill Whether bucket needs refill
     */
    function getBucketStatus() external view returns (
        uint256 remaining,
        uint256 total,
        uint256 lastRefill,
        bool needsRefill
    );

    /**
     * @dev Get consumer statistics
     * @param consumer Consumer address
     * @return totalRequests Total requests made
     * @return isAuthorized Whether consumer is authorized
     */
    function getConsumerStats(address consumer) external view returns (
        uint256 totalRequests,
        bool isAuthorized
    );

    // Events
    event RandomnessRequested(
        uint256 indexed requestId,
        address indexed requester,
        VRFSource vrfSource,
        bool useBucket
    );

    event RandomnessFulfilled(
        uint256 indexed requestId,
        address indexed requester,
        uint256 randomValue,
        VRFSource vrfSource
    );

    event VRFSourceFallback(
        VRFSource indexed fromSource,
        VRFSource indexed toSource,
        string reason
    );

    event BucketRefilled(uint256 seed, uint256 timestamp, VRFSource source);
    event RandomnessDrawn(address indexed consumer, uint256 randomness, uint256 nonce);
    event VRFSourceUpdated(VRFSource indexed source, address contractAddress, bool isActive);
    event ConsumerAuthorized(address indexed consumer, bool authorized);
}
