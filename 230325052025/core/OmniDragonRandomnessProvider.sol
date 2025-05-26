// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "../library/access/Ownable.sol";
import { ReentrancyGuard } from "../library/security/ReentrancyGuard.sol";
import { IDrandVRFIntegrator } from "../vrf/drand/interfaces/IDrandVRFIntegrator.sol";
import { IOmniDragonVRFConsumer } from "../interfaces/core/IOmniDragonVRFConsumer.sol";

/**
 * @dev Interface for ChainlinkVRFIntegrator to avoid circular dependencies
 */
interface IChainlinkVRFIntegrator {
    function requestRandomness(address consumer) external returns (uint256 requestId);
}

/**
 * @title OmniDragonRandomnessProvider
 * @dev SINGLE SOURCE OF TRUTH for all randomness in the OmniDragon ecosystem
 *
 * Responsibilities:
 * ✅ Manage all VRF sources (Chainlink VRF 2.5 via LayerZero, Drand, etc.)
 * ✅ Provide fallback mechanisms between VRF sources
 * ✅ Cost-efficient bucket system for high-frequency requests
 * ✅ Aggregate multiple randomness sources for enhanced security
 * ✅ Serve randomness to ANY consumer (lottery, games, etc.)
 *
 * Does NOT handle:
 * ❌ Lottery logic (handled by LotteryManager)
 * ❌ Probability calculations (handled by LotteryManager)
 * ❌ Jackpot management (handled by LotteryManager)
 *
 * OPERATIONAL REQUIREMENTS:
 * 🔧 ChainlinkVRFIntegrator must be deployed and configured on Sonic
 * 🔧 ChainlinkVRFIntegrator must be funded with $S for LayerZero fees
 * 🔧 OmniDragonVRFRequester must be deployed on Arbitrum with funded VRF subscription
 * 🔧 LayerZero endpoints must be configured for cross-chain messaging
 * 🔧 collectDrandRandomness() should be called periodically (via keeper/automation)
 * 🔧 Drand integrator contracts must be deployed and configured
 * 🔧 Pool refresh is gas-intensive (~1M gas for POOL_SIZE=1000)
 *
 * COST MODEL:
 * 💰 Protocol covers all randomness costs
 * 💰 Chainlink VRF: LayerZero fees paid in $S (Sonic native token)
 * 💰 Drand: Free queries, only gas costs
 * 💰 Consumers: Free to request randomness (must be authorized)
 *
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract OmniDragonRandomnessProvider is Ownable, ReentrancyGuard, IOmniDragonVRFConsumer {

    // ======== VRF Source Configuration ========
    enum VRFSource {
        CHAINLINK_V2_5,    // Primary: Chainlink VRF 2.5 via LayerZero from Arbitrum (async callback)
        DRAND_BEACON,      // Secondary: Drand League of Entropy (synchronous aggregation)
        CHAINLINK_V2_0,    // Fallback: Legacy Chainlink VRF 2.0 if available locally (async callback)
        DRAND_QUICKNET,    // Tertiary: Drand Quicknet for fast randomness (synchronous aggregation)
        DRAND_EVMNET       // Quaternary: Drand EVMnet for EVM-optimized randomness (synchronous aggregation)
    }

    struct VRFConfig {
        address contractAddress;    // VRF contract address (Integrator for Chainlink, Integrator for Drand)
        bool isActive;             // Whether this VRF source is active
        uint256 priority;          // Priority level (1 = highest) - Reserved for future multi-source fallback
        uint256 maxRetries;        // Maximum retry attempts - Reserved for future retry logic
        uint256 timeoutSeconds;    // Timeout for VRF response - Reserved for future timeout handling
        uint256 successCount;      // Number of successful requests
        uint256 failureCount;      // Number of failed requests
    }

    // ======== Randomness Bucket System ========
    struct RandomnessBucket {
        uint256 seed;              // Current VRF seed
        uint256 nonce;             // Counter for deriving unique numbers
        uint256 maxNonce;          // Maximum nonce for this seed
        uint256 lastRefill;        // Timestamp of last VRF request
    }

    // ======== Enhanced Randomness Pool System ========
    struct RandomnessPool {
        uint256[] randomNumbers;    // Array of pre-generated random numbers
        uint256 currentIndex;       // Current index for drawing numbers
        uint256 lastChainlinkSeed; // Last Chainlink VRF seed used
        uint256 lastRefreshTime;    // Last time pool was refreshed
        bool isRefreshing;          // Whether pool is currently being refreshed
    }

    // ======== Request Management ========
    struct RandomnessRequest {
        address requester;         // Contract requesting randomness
        VRFSource vrfSource;       // VRF source for this request
        uint256 requestTime;       // When the request was made
        uint256 retryCount;        // Number of retry attempts
        bool fulfilled;            // Whether request has been fulfilled
        bool useBucket;            // Whether to use bucket system
    }

    // ======== Storage ========

    // VRF Configuration
    mapping(VRFSource => VRFConfig) public vrfConfigs;
    VRFSource public primaryVRFSource = VRFSource.CHAINLINK_V2_5;

    // Request Management
    mapping(uint256 => RandomnessRequest) public randomnessRequests;
    mapping(uint256 => uint256) public chainlinkVrfRequestIdToRandomnessId;

    uint256 public requestIdCounter;

    // Bucket System
    RandomnessBucket public currentBucket;
    uint256 public constant BUCKET_SIZE = 1000;
    uint256 public constant REFILL_THRESHOLD = 100;
    uint256 public constant CHAINLINK_REQUEST_INTERVAL = 1 hours;

    // Enhanced Randomness Pool
    RandomnessPool public randomnessPool;
    uint256 public constant POOL_SIZE = 1000;
    uint256 public constant POOL_REFRESH_INTERVAL = 30 minutes;
    uint256 public constant MIN_POOL_SIZE = 100;
    uint256 public pendingChainlinkRequestForPool;

    // Consumer Management
    mapping(address => bool) public authorizedConsumers;
    mapping(address => uint256) public consumerRequestCount;

    // Drand Network Aggregation
    struct DrandNetwork {
        address integrator;
        bool active;
        uint256 weight;
        uint256 lastUpdate;
        uint256 lastValue;
        uint256 lastRound;
    }

    mapping(bytes32 => DrandNetwork) public drandNetworks;
    bytes32[] public drandNetworkIds;
    uint256 public aggregatedRandomness;
    uint256 public lastAggregationTimestamp;
    uint256 public aggregationCounter;

    // Continuous Drand Collection
    uint256[] public drandRandomnessHistory;
    uint256 public constant MAX_DRAND_HISTORY = 100;
    uint256 public drandHistoryHead; // Index for next write
    uint256 public drandHistoryCount; // Number of elements stored
    mapping(bytes32 => uint256[]) public networkRandomnessHistory; // Per-network history
    mapping(bytes32 => uint256) public networkHistoryHead; // Per-network head index
    mapping(bytes32 => uint256) public networkHistoryCount; // Per-network count

    // Configuration
    uint256 public constant MAX_RETRY_ATTEMPTS = 3;
    uint256 public constant VRF_TIMEOUT_SECONDS = 300; // 5 minutes
    uint256 public constant AGGREGATION_TIMEOUT_SECONDS = 30;
    uint256 public constant MAX_DRAND_NETWORKS = 10; // DoS protection

    // ======== Events ========
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
    event DrandNetworkAdded(bytes32 indexed networkId, address integrator, uint256 weight);
    event RandomnessAggregated(uint256 timestamp, uint256 value);
    event RandomnessPoolRefreshed(uint256 poolSize, uint256 chainlinkSeed, uint256 drandSources);
    event RandomnessPoolDrawn(address indexed consumer, uint256 randomness, uint256 poolIndex);

    event RandomnessDeliveryFailed(uint256 indexed requestId, address indexed consumer, uint256 randomness);
    event RandomnessRequestFailed(uint256 indexed requestId, address indexed requester, string reason);
    event IntegratorFunded(address indexed integrator, uint256 amount);
    event FundsReceived(address indexed sender, uint256 amount);

    // ======== Constructor ========
    constructor() {
        // Initialize default VRF configurations
        _initializeVRFConfigs();

        // Initialize bucket with placeholder
        _initializeBucket();

        // Initialize randomness pool
        _initializeRandomnessPool();
    }

    /**
     * @dev Initialize the randomness pool
     */
    function _initializeRandomnessPool() internal {
        // Start with empty pool, will be filled on first use
        randomnessPool.lastRefreshTime = block.timestamp;
        randomnessPool.isRefreshing = false;

        // Initialize with an empty pool instead of trying to generate with potentially insufficient entropy
        // The pool will be filled on first draw attempt or when sufficient entropy is available
        delete randomnessPool.randomNumbers;
        randomnessPool.currentIndex = 0;
    }

    // ======== Main Randomness Functions ========

    /**
     * @dev Request randomness (main entry point for all consumers)
     * @notice The protocol covers all randomness costs - consumers don't need to send ETH
     * @return requestId The randomness request ID
     */
    function requestRandomness() external returns (uint256 requestId) {
        return requestRandomnessWithSource(primaryVRFSource, false);
    }

    /**
     * @dev Request randomness with specific VRF source
     * @notice The protocol covers all randomness costs - consumers don't need to send ETH
     * @param vrfSource Preferred VRF source
     * @param useBucket Whether to use bucket system for cost efficiency
     * @return requestId The randomness request ID
     */
    function requestRandomnessWithSource(VRFSource vrfSource, bool useBucket) public nonReentrant returns (uint256 requestId) {
        require(authorizedConsumers[msg.sender], "Not authorized consumer");

        VRFConfig storage config = vrfConfigs[vrfSource];
        require(config.isActive, "VRF source not active");

        requestId = ++requestIdCounter;

        randomnessRequests[requestId] = RandomnessRequest({
            requester: msg.sender,
            vrfSource: vrfSource,
            requestTime: block.timestamp,
            retryCount: 0,
            fulfilled: false,
            useBucket: useBucket
        });

        consumerRequestCount[msg.sender]++;

        emit RandomnessRequested(requestId, msg.sender, vrfSource, useBucket);

        // If using bucket and bucket has randomness available, fulfill immediately
        if (useBucket && _getBucketRemainingNumbers() > 0) {
            _fulfillFromBucket(requestId);
        } else {
            // Route to appropriate VRF source
            _requestFromVRFSource(requestId, vrfSource);
        }

        return requestId;
    }

    /**
     * @dev Draw randomness from bucket (for high-frequency, low-cost randomness)
     * @notice IMPORTANT: This function will revert if bucket is empty
     * @notice Consumers should check getBucketStatus() before calling or handle reverts
     * @notice Bucket refills are asynchronous and depend on VRF source availability
     * @return randomness A unique random number
     */
    function drawRandomnessFromBucket() external nonReentrant returns (uint256 randomness) {
        require(authorizedConsumers[msg.sender], "Not authorized consumer");

        // Check if bucket needs refill
        if (_shouldRefillBucket()) {
            _requestBucketRefill();
        }

        require(_getBucketRemainingNumbers() > 0, "Bucket empty");

        // Generate randomness from current seed
        randomness = _generateFromSeed(currentBucket.seed, currentBucket.nonce, msg.sender);

        // Increment nonce
        currentBucket.nonce++;
        consumerRequestCount[msg.sender]++;

        emit RandomnessDrawn(msg.sender, randomness, currentBucket.nonce - 1);

        return randomness;
    }

    /**
     * @dev Get aggregated Drand randomness (free, immediate)
     * @notice This returns the last aggregated randomness from all configured Drand networks
     * @notice Freshness depends on the frequency of collectDrandRandomness calls (onlyOwner)
     * @notice For guaranteed fresh randomness, use requestRandomness() instead
     * @return randomness Current aggregated randomness (may be stale if not recently updated)
     */
    function getAggregatedRandomness() external view returns (uint256 randomness) {
        return aggregatedRandomness;
    }

    // ======== VRF Source Management ========

    /**
     * @dev Request randomness from specific VRF source
     * @param requestId Internal request ID
     * @param vrfSource VRF source to use
     */
    function _requestFromVRFSource(uint256 requestId, VRFSource vrfSource) internal {
        VRFConfig storage config = vrfConfigs[vrfSource];

        if (vrfSource == VRFSource.CHAINLINK_V2_5 || vrfSource == VRFSource.CHAINLINK_V2_0) {
            _requestChainlinkVRF(requestId, config.contractAddress);
        } else if (vrfSource == VRFSource.DRAND_BEACON || vrfSource == VRFSource.DRAND_QUICKNET || vrfSource == VRFSource.DRAND_EVMNET) {
            _requestDrandVRF(requestId, config.contractAddress);
        }
    }

    /**
     * @dev Request Chainlink VRF
     * @param requestId Internal request ID
     * @param chainlinkContract Chainlink integrator contract address
     */
    function _requestChainlinkVRF(uint256 requestId, address chainlinkContract) internal {
        require(chainlinkContract != address(0), "Chainlink contract not configured");

        // Get the VRF source from the request
        RandomnessRequest storage request = randomnessRequests[requestId];

        // For Chainlink via LayerZero, we use the integrator pattern
        // The protocol funds the integrator separately for LayerZero fees
        try IChainlinkVRFIntegrator(chainlinkContract).requestRandomness(address(this)) returns (uint256 integratorRequestId) {
            // Store mapping for callback
            chainlinkVrfRequestIdToRandomnessId[integratorRequestId] = requestId;

            // Update VRF source statistics
            vrfConfigs[request.vrfSource].successCount++;
        } catch {
            // Fallback to Drand on Chainlink failure
            vrfConfigs[request.vrfSource].failureCount++;

            // Check if Drand fallback is available before attempting
            VRFConfig storage drandConfig = vrfConfigs[VRFSource.DRAND_BEACON];
            if (drandConfig.isActive && drandConfig.contractAddress != address(0)) {
                emit VRFSourceFallback(request.vrfSource, VRFSource.DRAND_BEACON, "Chainlink request failed");
                _requestDrandVRF(requestId, drandConfig.contractAddress);
            } else {
                // No fallback available - mark request as failed
                emit RandomnessRequestFailed(requestId, request.requester, "No fallback VRF source available");
                // Note: Request remains unfulfilled, consumer should handle timeout
            }
        }
    }

    /**
     * @dev Request Drand VRF (synchronous model - gets latest aggregated randomness)
     * @notice Drand operates synchronously, providing immediate randomness from aggregated sources
     * @notice This is different from Chainlink which requires asynchronous callbacks
     * @param requestId Internal request ID
     * @param drandContract Drand VRF contract address (used for validation only)
     */
    function _requestDrandVRF(uint256 requestId, address drandContract) internal {
        require(drandContract != address(0), "Drand contract not configured");

        // Get the VRF source from the request
        RandomnessRequest storage request = randomnessRequests[requestId];

        // Only aggregate if data is stale (avoid repeated expensive calls)
        if (block.timestamp > lastAggregationTimestamp + AGGREGATION_TIMEOUT_SECONDS) {
            _aggregateDrandRandomness();
        }

        // Fulfill immediately with aggregated randomness + unique mixing
        uint256 uniqueRandomness = uint256(keccak256(abi.encodePacked(
            aggregatedRandomness,
            requestId,
            request.requester
        )));

        // Update VRF source statistics - use the actual source from the request
        vrfConfigs[request.vrfSource].successCount++;

        _fulfillRandomnessRequest(requestId, uniqueRandomness);
    }

    /**
     * @dev Fulfill randomness request
     * @param requestId Request ID
     * @param randomValue Random value
     */
    function _fulfillRandomnessRequest(uint256 requestId, uint256 randomValue) internal {
        RandomnessRequest storage request = randomnessRequests[requestId];
        require(!request.fulfilled, "Request already fulfilled");

        request.fulfilled = true;

        // Note: successCount is already incremented in the request functions
        // No need to increment again here to avoid double counting

        // Send randomness to requester
        try this.deliverRandomness(request.requester, requestId, randomValue) {
            emit RandomnessFulfilled(requestId, request.requester, randomValue, request.vrfSource);
        } catch {
            // Mark as failed if delivery fails
            vrfConfigs[request.vrfSource].failureCount++;
            emit RandomnessDeliveryFailed(requestId, request.requester, randomValue);
        }
    }

    /**
     * @dev Deliver randomness to consumer contract
     * @param consumer Consumer contract address
     * @param requestId Request ID
     * @param randomValue Random value
     */
    function deliverRandomness(address consumer, uint256 requestId, uint256 randomValue) external {
        require(msg.sender == address(this), "Internal call only");

        // Call the consumer's fulfillRandomness function
        (bool success,) = consumer.call(
            abi.encodeWithSignature("fulfillRandomness(uint256,uint256)", requestId, randomValue)
        );

        if (!success) {
            revert("Failed to deliver randomness");
        }
    }

    // ======== Bucket System ========

    /**
     * @dev Initialize bucket with Drand randomness
     */
    function _initializeBucket() internal {
        _aggregateDrandRandomness();

        currentBucket = RandomnessBucket({
            seed: aggregatedRandomness,
            nonce: 0,
            maxNonce: BUCKET_SIZE,
            lastRefill: block.timestamp
        });

        emit BucketRefilled(aggregatedRandomness, block.timestamp, VRFSource.DRAND_BEACON);
    }

    /**
     * @dev Fulfill request from bucket
     * @param requestId Request ID to fulfill
     */
    function _fulfillFromBucket(uint256 requestId) internal {
        RandomnessRequest storage request = randomnessRequests[requestId];

        uint256 randomness = _generateFromSeed(currentBucket.seed, currentBucket.nonce, request.requester);
        currentBucket.nonce++;

        _fulfillRandomnessRequest(requestId, randomness);
    }

    /**
     * @dev Generate unique randomness from seed and nonce
     * @notice Uses only VRF-derived seed and deterministic values for maximum security
     * @notice The bucket system is designed for high-frequency, lower-security use cases
     * @param seed The VRF-derived seed value
     * @param nonce The unique counter for this seed
     * @param consumer The consumer address for additional uniqueness
     * @return Deterministic random value based on inputs
     */
    function _generateFromSeed(uint256 seed, uint256 nonce, address consumer) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
            seed,
            nonce,
            consumer
        )));
    }

    /**
     * @dev Check if bucket should be refilled
     */
    function _shouldRefillBucket() internal view returns (bool) {
        return _getBucketRemainingNumbers() <= REFILL_THRESHOLD &&
               block.timestamp >= currentBucket.lastRefill + CHAINLINK_REQUEST_INTERVAL;
    }

    /**
     * @dev Get remaining numbers in bucket
     */
    function _getBucketRemainingNumbers() internal view returns (uint256) {
        if (currentBucket.nonce >= currentBucket.maxNonce) {
            return 0;
        }
        return currentBucket.maxNonce - currentBucket.nonce;
    }

    /**
     * @dev Request bucket refill with premium VRF source
     */
    function _requestBucketRefill() internal {


        // Try to refill with primary VRF source (usually Chainlink for premium randomness)
        VRFConfig storage primaryConfig = vrfConfigs[primaryVRFSource];

        if (primaryConfig.isActive && primaryConfig.contractAddress != address(0)) {
            // Request premium VRF for bucket refill
            uint256 refillRequestId = ++requestIdCounter;

            randomnessRequests[refillRequestId] = RandomnessRequest({
                requester: address(this), // Self-request for bucket refill
                vrfSource: primaryVRFSource,
                requestTime: block.timestamp,
                retryCount: 0,
                fulfilled: false,
                useBucket: false
            });

            _requestFromVRFSource(refillRequestId, primaryVRFSource);
        } else {
            // Fallback to Drand aggregation if primary source unavailable
            _refillBucketWithDrand();
        }
    }

    /**
     * @dev Refill bucket with Drand randomness
     */
    function _refillBucketWithDrand() internal {
        _aggregateDrandRandomness();

        // Mix with previous seed for added entropy
        uint256 newSeed = uint256(keccak256(abi.encodePacked(
            aggregatedRandomness,
            currentBucket.seed,
            aggregationCounter  // Use aggregation counter instead of timestamp
        )));

        currentBucket.seed = newSeed;
        currentBucket.nonce = 0;
        currentBucket.maxNonce = BUCKET_SIZE;
        currentBucket.lastRefill = block.timestamp;


        emit BucketRefilled(newSeed, block.timestamp, VRFSource.DRAND_BEACON);
    }

    // ======== Drand Aggregation ========

    /**
     * @dev Aggregate randomness from all active Drand networks
     */
    function _aggregateDrandRandomness() internal {
        aggregationCounter++;

        // Seed with previous value
        uint256 randomSeed = aggregatedRandomness;
        uint256 totalWeight = 0;
        uint256 activeNetworks = 0;

        // Go through each network
        for (uint256 i = 0; i < drandNetworkIds.length; i++) {
            DrandNetwork storage network = drandNetworks[drandNetworkIds[i]];

            if (!network.active) continue;

            try IDrandVRFIntegrator(network.integrator).getLatestRandomness() returns (uint256 randomness, uint256 round) {
                // Only use if this is new randomness
                if (round > network.lastRound) {
                    // Apply weighted randomness
                    randomSeed = uint256(keccak256(abi.encodePacked(
                        randomSeed,
                        randomness,
                        round,
                        network.weight
                    )));

                    // Update network info
                    network.lastValue = randomness;
                    network.lastRound = round;
                    network.lastUpdate = block.timestamp;

                    totalWeight += network.weight;
                    activeNetworks++;
                }
            } catch {
                // Skip networks that fail
            }
        }

        // Only update if we processed at least one active network
        if (activeNetworks > 0) {
            // Final pass by mixing with counter and weight for uniqueness
            aggregatedRandomness = uint256(keccak256(abi.encodePacked(
                randomSeed,
                totalWeight,
                aggregationCounter
            )));

            lastAggregationTimestamp = block.timestamp;

            emit RandomnessAggregated(block.timestamp, aggregatedRandomness);
        }
    }

    // ======== Configuration Functions ========

    /**
     * @dev Initialize default VRF configurations
     */
    function _initializeVRFConfigs() internal {
        // Chainlink VRF 2.5 (Primary)
        vrfConfigs[VRFSource.CHAINLINK_V2_5] = VRFConfig({
            contractAddress: address(0), // To be set after deployment
            isActive: false,
            priority: 1,
            maxRetries: 3,
            timeoutSeconds: 300,
            successCount: 0,
            failureCount: 0
        });

        // Drand Beacon (Secondary)
        vrfConfigs[VRFSource.DRAND_BEACON] = VRFConfig({
            contractAddress: address(0), // To be set after deployment
            isActive: true, // Default active for free randomness
            priority: 2,
            maxRetries: 2,
            timeoutSeconds: 60,
            successCount: 0,
            failureCount: 0
        });

        // Chainlink VRF 2.0 (Fallback)
        vrfConfigs[VRFSource.CHAINLINK_V2_0] = VRFConfig({
            contractAddress: address(0), // To be set after deployment
            isActive: false,
            priority: 3,
            maxRetries: 3,
            timeoutSeconds: 300,
            successCount: 0,
            failureCount: 0
        });

        // Drand Quicknet (Tertiary)
        vrfConfigs[VRFSource.DRAND_QUICKNET] = VRFConfig({
            contractAddress: address(0), // To be set after deployment
            isActive: false,
            priority: 4,
            maxRetries: 2,
            timeoutSeconds: 30,
            successCount: 0,
            failureCount: 0
        });

        // Drand EVMnet (Quaternary)
        vrfConfigs[VRFSource.DRAND_EVMNET] = VRFConfig({
            contractAddress: address(0), // To be set after deployment
            isActive: false,
            priority: 5,
            maxRetries: 2,
            timeoutSeconds: 30,
            successCount: 0,
            failureCount: 0
        });
    }

    /**
     * @dev Update VRF source configuration
     * @param source VRF source to update
     * @param contractAddress Contract address for this VRF source
     * @param isActive Whether this source is active
     */
    function updateVRFSource(
        VRFSource source,
        address contractAddress,
        bool isActive
    ) external onlyOwner {
        vrfConfigs[source].contractAddress = contractAddress;
        vrfConfigs[source].isActive = isActive;

        emit VRFSourceUpdated(source, contractAddress, isActive);
    }

    /**
     * @dev Set primary VRF source
     * @param source Primary VRF source
     */
    function setPrimaryVRFSource(VRFSource source) external onlyOwner {
        require(vrfConfigs[source].isActive, "VRF source not active");
        primaryVRFSource = source;
    }

    /**
     * @dev Authorize a consumer to request randomness
     * @param consumer Consumer contract address
     * @param authorized Whether to authorize or deauthorize
     */
    function setAuthorizedConsumer(address consumer, bool authorized) external onlyOwner {
        authorizedConsumers[consumer] = authorized;
        emit ConsumerAuthorized(consumer, authorized);
    }

    /**
     * @dev Add a Drand network
     * @param networkId The unique identifier for this network
     * @param integrator The integrator contract address
     * @param weight The weight to give this network in aggregation
     */
    function addDrandNetwork(bytes32 networkId, address integrator, uint256 weight) external onlyOwner {
        require(integrator != address(0), "Invalid integrator address");
        require(drandNetworks[networkId].integrator == address(0), "Network already exists");
        require(drandNetworkIds.length < MAX_DRAND_NETWORKS, "Too many Drand networks");

        drandNetworks[networkId] = DrandNetwork({
            integrator: integrator,
            active: true,
            weight: weight,
            lastUpdate: 0,
            lastValue: 0,
            lastRound: 0
        });

        drandNetworkIds.push(networkId);

        emit DrandNetworkAdded(networkId, integrator, weight);
    }

    // ======== View Functions ========

    /**
     * @dev Get VRF source configuration
     * @param source VRF source
     */
    function getVRFConfig(VRFSource source) external view returns (VRFConfig memory) {
        return vrfConfigs[source];
    }

    /**
     * @dev Get randomness request details
     * @param requestId Request ID
     */
    function getRandomnessRequest(uint256 requestId) external view returns (RandomnessRequest memory) {
        return randomnessRequests[requestId];
    }

    /**
     * @dev Get bucket status
     */
    function getBucketStatus() external view returns (
        uint256 remaining,
        uint256 total,
        uint256 lastRefill,
        bool shouldRefill
    ) {
        return (
            _getBucketRemainingNumbers(),
            BUCKET_SIZE,
            currentBucket.lastRefill,
            _shouldRefillBucket()
        );
    }

    /**
     * @dev Get consumer statistics
     * @param consumer Consumer address
     */
    function getConsumerStats(address consumer) external view returns (
        uint256 totalRequests,
        bool isAuthorized
    ) {
        return (
            consumerRequestCount[consumer],
            authorizedConsumers[consumer]
        );
    }

    /**
     * @dev Get randomness pool status
     */
    function getPoolStatus() external view returns (
        uint256 poolSize,
        uint256 currentIndex,
        uint256 remainingNumbers,
        uint256 lastRefreshTime,
        bool isRefreshing,
        uint256 lastChainlinkSeed
    ) {
        poolSize = randomnessPool.randomNumbers.length;
        currentIndex = randomnessPool.currentIndex;
        remainingNumbers = poolSize > currentIndex ? poolSize - currentIndex : 0;
        lastRefreshTime = randomnessPool.lastRefreshTime;
        isRefreshing = randomnessPool.isRefreshing;
        lastChainlinkSeed = randomnessPool.lastChainlinkSeed;
    }

    /**
     * @dev Get Drand history size
     */
    function getDrandHistoryInfo() external view returns (
        uint256 globalHistorySize,
        uint256 activeNetworks,
        uint256 maxHistorySize
    ) {
        globalHistorySize = drandHistoryCount;
        activeNetworks = drandNetworkIds.length;
        maxHistorySize = MAX_DRAND_HISTORY;
    }

    // ======== Emergency Functions ========

    /**
     * @dev Emergency refill bucket (owner only)
     */
    function emergencyRefillBucket() external onlyOwner {
        _refillBucketWithDrand();
    }

    /**
     * @dev Emergency fulfill request (owner only)
     * @param requestId Request ID
     * @param randomValue Manual random value
     */
    function emergencyFulfillRequest(uint256 requestId, uint256 randomValue) external onlyOwner {
        require(!randomnessRequests[requestId].fulfilled, "Request already fulfilled");
        _fulfillRandomnessRequest(requestId, randomValue);
    }

    // ======== Enhanced Randomness Pool Functions ========

    /**
     * @dev Draw randomness from the enhanced pool (most efficient method)
     * @notice This provides pre-generated randomness from multiple sources
     * @notice IMPORTANT: This function will revert if pool is empty
     * @notice Consumers should check getPoolStatus() before calling or handle reverts
     * @notice Pool refreshes are asynchronous and depend on keeper calls and VRF availability
     * @return randomness A cryptographically secure random number
     */
    function drawFromRandomnessPool() external nonReentrant returns (uint256 randomness) {
        require(authorizedConsumers[msg.sender], "Not authorized consumer");
        require(randomnessPool.randomNumbers.length > 0, "Randomness pool empty");

        // Check if pool needs refresh
        if (_shouldRefreshPool()) {
            _initiatePoolRefresh();
        }

        // Get random number from pool
        uint256 poolLength = randomnessPool.randomNumbers.length;
        uint256 index = randomnessPool.currentIndex;

        // Wrap around if we've used all numbers
        if (index >= poolLength) {
            randomnessPool.currentIndex = 0;
            index = 0;
        }

        randomness = randomnessPool.randomNumbers[index];
        randomnessPool.currentIndex = index + 1;

        // Mix with consumer-specific data for additional uniqueness
        randomness = uint256(keccak256(abi.encodePacked(
            randomness,
            msg.sender,
            consumerRequestCount[msg.sender]++,
            index
        )));

        emit RandomnessPoolDrawn(msg.sender, randomness, index);

        return randomness;
    }

    /**
     * @dev Check if pool should be refreshed
     */
    function _shouldRefreshPool() internal view returns (bool) {
        // Refresh if: pool is getting low, enough time has passed, or pool is empty
        uint256 remainingNumbers = randomnessPool.randomNumbers.length - randomnessPool.currentIndex;

        return (
            remainingNumbers < MIN_POOL_SIZE ||
            block.timestamp >= randomnessPool.lastRefreshTime + POOL_REFRESH_INTERVAL ||
            randomnessPool.randomNumbers.length == 0
        );
    }

    /**
     * @dev Initiate pool refresh with Chainlink VRF
     */
    function _initiatePoolRefresh() internal {
        if (randomnessPool.isRefreshing || pendingChainlinkRequestForPool != 0) {
            return; // Already refreshing
        }

        VRFConfig storage chainlinkConfig = vrfConfigs[VRFSource.CHAINLINK_V2_5];

        if (chainlinkConfig.isActive && chainlinkConfig.contractAddress != address(0)) {
            // Request Chainlink VRF for pool refresh via integrator
            try IChainlinkVRFIntegrator(chainlinkConfig.contractAddress).requestRandomness(address(this)) returns (uint256 integratorRequestId) {
                pendingChainlinkRequestForPool = integratorRequestId;
                randomnessPool.isRefreshing = true;
                chainlinkConfig.successCount++;
            } catch {
                // If Chainlink fails, refresh with Drand only
                chainlinkConfig.failureCount++;
                _refreshPoolWithDrandOnly();
            }
        } else {
            // No Chainlink available, use Drand only
            _refreshPoolWithDrandOnly();
        }
    }

    /**
     * @dev Refresh pool using only Drand sources
     */
    function _refreshPoolWithDrandOnly() internal {
        // Aggregate latest Drand randomness
        _aggregateDrandRandomness();

        // Generate pool using Drand history and aggregated randomness
        _generateRandomnessPool(0, true);
    }

    /**
     * @dev Generate new randomness pool by combining multiple sources
     * @param chainlinkSeed Seed from Chainlink VRF (0 if not available)
     * @param drandOnly Whether using only Drand sources
     */
    function _generateRandomnessPool(uint256 chainlinkSeed, bool drandOnly) internal {
        uint256[] memory newPool = new uint256[](POOL_SIZE);

        // Collect all available entropy sources
        uint256[] memory entropySources = _collectEntropySources(chainlinkSeed);

        // If we have insufficient entropy, fail securely rather than use weak randomness
        if (entropySources.length < 2 && chainlinkSeed == 0) {
            revert("Insufficient entropy sources - system not ready for secure randomness generation");
        }

        // Generate pool entries using cryptographic mixing
        for (uint256 i = 0; i < POOL_SIZE; i++) {
            uint256 mixedEntropy = _cryptographicMix(
                entropySources,
                i,
                chainlinkSeed,
                drandOnly
            );

            newPool[i] = mixedEntropy;
        }

        // Update pool storage efficiently with single assignment
        randomnessPool.randomNumbers = newPool;

        randomnessPool.currentIndex = 0;
        randomnessPool.lastChainlinkSeed = chainlinkSeed;
        randomnessPool.lastRefreshTime = block.timestamp;
        randomnessPool.isRefreshing = false;

        emit RandomnessPoolRefreshed(POOL_SIZE, chainlinkSeed, entropySources.length);
    }

    /**
     * @dev Collect all available entropy sources
     */
    function _collectEntropySources(uint256 chainlinkSeed) internal view returns (uint256[] memory) {
        uint256 sourceCount = drandRandomnessHistory.length + drandNetworkIds.length + 2; // +2 for chainlink and aggregated
        uint256[] memory sources = new uint256[](sourceCount);
        uint256 index = 0;

        // Add Chainlink seed if available
        if (chainlinkSeed != 0) {
            sources[index++] = chainlinkSeed;
        }

        // Add aggregated Drand randomness
        sources[index++] = aggregatedRandomness;

        // Add Drand history
        for (uint256 i = 0; i < drandRandomnessHistory.length && index < sourceCount; i++) {
            sources[index++] = drandRandomnessHistory[i];
        }

        // Add per-network latest values
        for (uint256 i = 0; i < drandNetworkIds.length && index < sourceCount; i++) {
            DrandNetwork storage network = drandNetworks[drandNetworkIds[i]];
            if (network.active && network.lastValue != 0) {
                sources[index++] = network.lastValue;
            }
        }

        // Resize array to actual size
        // Assembly is used here to efficiently resize the memory array without copying
        // This sets the length field of the dynamic array to the actual number of elements used
        // Memory layout: [length][element0][element1]...[elementN]
        // mstore(sources, index) overwrites the length field with the actual count
        assembly {
            mstore(sources, index)
        }

        return sources;
    }

    /**
     * @dev Cryptographically mix entropy sources
     * @param sources Array of entropy sources
     * @param index Current pool index
     * @param chainlinkSeed Chainlink seed (may be 0)
     * @param drandOnly Whether using only Drand
     * @notice Uses standard cryptographic mixing via repeated hashing
     */
    function _cryptographicMix(
        uint256[] memory sources,
        uint256 index,
        uint256 chainlinkSeed,
        bool drandOnly
    ) internal pure returns (uint256) {
        // Initialize with all available seeds
        bytes memory seedData = abi.encodePacked(
            index,
            chainlinkSeed,
            drandOnly ? bytes32("DRAND_ONLY") : bytes32("MIXED_SOURCES")
        );

        // Mix all entropy sources using standard approach
        for (uint256 i = 0; i < sources.length; i++) {
            if (sources[i] != 0) {
                // Combine using keccak256 for cryptographic strength
                seedData = abi.encodePacked(
                    keccak256(seedData),
                    sources[i],
                    i // Include position for additional entropy
                );
            }
        }

        // Final hash to produce the mixed entropy
        return uint256(keccak256(seedData));
    }

    /**
     * @dev Continuous Drand collection (to be called periodically)
     * @notice Only owner can call to prevent gas griefing attacks
     */
    function collectDrandRandomness() external onlyOwner {
        _aggregateDrandRandomness();

        // Store in history using circular buffer pattern
        if (aggregatedRandomness != 0) {
            // Initialize array if needed
            if (drandRandomnessHistory.length < MAX_DRAND_HISTORY) {
                drandRandomnessHistory.push(aggregatedRandomness);
                drandHistoryCount++;
            } else {
                // Use circular buffer - overwrite oldest entry
                drandRandomnessHistory[drandHistoryHead] = aggregatedRandomness;
                drandHistoryHead = (drandHistoryHead + 1) % MAX_DRAND_HISTORY;
                if (drandHistoryCount < MAX_DRAND_HISTORY) {
                    drandHistoryCount++;
                }
            }
        }

        // Store per-network history using circular buffer
        for (uint256 i = 0; i < drandNetworkIds.length; i++) {
            bytes32 networkId = drandNetworkIds[i];
            DrandNetwork storage network = drandNetworks[networkId];

            if (network.active && network.lastValue != 0) {
                uint256[] storage networkHistory = networkRandomnessHistory[networkId];

                // Initialize array if needed
                if (networkHistory.length < MAX_DRAND_HISTORY) {
                    networkHistory.push(network.lastValue);
                    networkHistoryCount[networkId]++;
                } else {
                    // Use circular buffer
                    uint256 head = networkHistoryHead[networkId];
                    networkHistory[head] = network.lastValue;
                    networkHistoryHead[networkId] = (head + 1) % MAX_DRAND_HISTORY;
                    if (networkHistoryCount[networkId] < MAX_DRAND_HISTORY) {
                        networkHistoryCount[networkId]++;
                    }
                }
            }
        }
    }

    // ======== VRF Callbacks ========

    /**
     * @dev Callback function for VRF integrators (Chainlink via LayerZero only)
     * @notice Drand uses synchronous model and doesn't use this callback
     * @param _requestId Request ID from the integrator
     * @param _randomness Random value
     * @param _round Round number (ignored for Chainlink, always 0)
     */
    function fulfillRandomness(
        uint256 _requestId,
        uint256 _randomness,
        uint256 _round
    ) external override nonReentrant {
        // Only Chainlink integrators use callbacks, Drand is synchronous
        require(
            msg.sender == vrfConfigs[VRFSource.CHAINLINK_V2_5].contractAddress ||
            msg.sender == vrfConfigs[VRFSource.CHAINLINK_V2_0].contractAddress,
            "Unauthorized VRF callback"
        );

        // Check if this is for pool refresh
        if (_requestId == pendingChainlinkRequestForPool) {
            pendingChainlinkRequestForPool = 0;
            _generateRandomnessPool(_randomness, false);
            return;
        }

        // Otherwise, it's a regular request
        uint256 internalRequestId = chainlinkVrfRequestIdToRandomnessId[_requestId];
        require(internalRequestId != 0, "Invalid request ID");

        // Clean up mapping
        delete chainlinkVrfRequestIdToRandomnessId[_requestId];

        _fulfillRandomnessRequest(internalRequestId, _randomness);
    }

    // ======== Protocol Management Functions ========

    /**
     * @dev Fund the Chainlink integrator for LayerZero fees (owner only)
     * @param amount Amount of $S (Sonic native token) to send to the integrator
     * @notice LayerZero fees on Sonic are paid in $S, not ETH
     */
    function fundChainlinkIntegrator(uint256 amount) external onlyOwner {
        address chainlinkIntegrator = vrfConfigs[VRFSource.CHAINLINK_V2_5].contractAddress;
        require(chainlinkIntegrator != address(0), "Chainlink integrator not set");
        require(address(this).balance >= amount, "Insufficient balance");

        (bool success, ) = chainlinkIntegrator.call{value: amount}("");
        require(success, "Transfer failed");

        emit IntegratorFunded(chainlinkIntegrator, amount);
    }

    /**
     * @dev Withdraw $S from contract (owner only)
     * @param amount Amount of $S to withdraw
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner()).transfer(amount);
    }

    /**
     * @dev Receive $S for protocol funding
     */
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
}
