// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IDragonJackpotVault } from "../interfaces/vault/IDragonJackpotVault.sol";
import { IChainRegistry } from "../interfaces/misc/IChainRegistry.sol";
import { IOmniDragon } from "../interfaces/core/IOmniDragon.sol";
import { IOmniDragonLotteryManager } from "../interfaces/core/IOmniDragonLotteryManager.sol";
import { IDragonPartnerRegistry } from "../interfaces/governance/IDragonPartnerRegistry.sol";
import { IDragonPartnerFactory } from "../interfaces/governance/IDragonPartnerFactory.sol";
import { IDragonPartnerPool } from "../interfaces/governance/IDragonPartnerPool.sol";
import { IDragonRevenueDistributor } from "../interfaces/governance/IDragonRevenueDistributor.sol";
import { DragonFeeManager } from "../governance/fees/DragonFeeManager.sol";
import { DragonTimelockLib } from "../library/dragon/DragonTimelockLib.sol";
import { DragonFeeProcessingLib } from "../library/dragon/DragonFeeProcessingLib.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title OmniDragon
 * @dev Specialized token with built-in fees, lottery entries, and cross-chain functionality
 *
 * IMPORTANT DRAGON PROJECT RULES:
 * - On all DRAGON swaps:
 *   1. 6.9% goes to jackpot
 *   2. 2.41% goes to ve69LP fee distributor
 *   3. 0.69% is burned
 *   4. Only buys qualify for lottery entries
 *
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */

/**
 * @dev Simple interface for ve69LP Boost Manager
 */
interface Ive69LPBoostManager {
    function getVotingPower(address user) external view returns (uint256);
}

/**
 * @title OmniDragon
 * @dev Specialized token with built-in fees, lottery entries, and cross-chain functionality
 */
contract OmniDragon is ERC20, Ownable, ReentrancyGuard, IOmniDragon {
    using SafeERC20 for IERC20;
    using DragonTimelockLib for DragonTimelockLib.TimelockProposal;
    using DragonFeeProcessingLib for DragonFeeProcessingLib.Fees;

    // ======== Storage ========
    address public lzEndpoint;       // LayerZero endpoint
    address public jackpotVault;     // Jackpot vault
    address public revenueDistributor;  // Primary fee distributor
    address public wrappedNativeToken;    // WrappedNativeToken/WETH

    address public chainRegistry;    // Chain registry for chain ID verification
    address public uniswapRouter;    // Uniswap router address
    address public sonicFeeMRegistry; // Sonic FeeM registry address (no longer hardcoded)
    address public lotteryManager; // Unified Lottery Manager for all lottery operations

    // Dragon Partners integration
    address public dragonPartnerRegistry;  // Registry for partner addresses
    address public dragonPartnerFactory;   // Factory for creating partner pools

    // Dynamic Fee Management - Replaces static fee structures
    DragonFeeManager public adaptiveFeeManager;

    // ve69LP Boost Manager - Required state variable that was missing
    address public ve69LPBoostManager;

    // Fee structures (used as fallbacks when adaptiveFeeManager not set and for distribution ratios)
    DragonFeeProcessingLib.Fees public buyFees;
    DragonFeeProcessingLib.Fees public sellFees;
    DragonFeeProcessingLib.Fees public transferFees;

    // Multi-DEX support
    enum DexType { UNKNOWN, UNISWAP_V2, UNISWAP_V3, BALANCER, CURVE }

    // Constants
    uint256 public constant MAX_SUPPLY = 6942000 * 10**18;   // Max supply (6.942 million)
    uint256 public constant INITIAL_SUPPLY = 6942000 * 10**18; // Initial supply to mint
    uint16 public constant SONIC_CHAIN_ID = 332;  // Sonic's LayerZero chain ID
    uint256 public constant MAX_FEE_BASIS_POINTS = 1500; // Maximum 15% fees
    uint256 public constant SONIC_FEEM_REGISTER_VALUE = 143; // Magic number required by Sonic FeeM protocol for fee sharing eligibility
    uint256 public constant COMMITMENT_EXPIRY_BLOCKS = 50; // Commitment expiry: ~10 minutes on most chains

    // Threshold values
    uint256 public swapThreshold;
    uint256 public minimumAmountForProcessing;

    // State packed into single storage slots (gas optimization)
    // Slot 1: Various boolean flags packed together
    bool public transfersPaused;
    bool public feesEnabled;
    bool public swapEnabled;
    bool private inSwap;
    uint8 public configurationVersion; // 0=None, 1=V1, 2=V2, etc.
    bool public initialMintingDone;

    // Mappings
    mapping(address => bool) public isExcludedFromFees;
    mapping(address => bool) public isPair;
    mapping(address => DexType) public pairToDexType;
    mapping(uint16 => bytes) public trustedRemoteLookup;
    mapping(uint16 => uint) public minDstGasLookup;

    // Dragon Partners mappings
    mapping(address => bool) public isPartnerPool;
    mapping(address => uint256) public partnerPoolIds;

    // MEV Protection - FIXED: Allow multiple commitments per user
    mapping(address => mapping(bytes32 => uint256)) public userCommitments;
    uint256 public constant MIN_COMMIT_REVEAL_DELAY = 2; // 2 blocks minimum

    // Emergency controls
    bool public emergencyPaused;
    address public emergencyPauser;
    uint256 public maxSingleTransfer = 1000000 * 10**18; // 1M tokens max per transfer

    // Authorized addresses for specific functions
    mapping(address => bool) public isAuthorizedCaller; // For functions like processEntry, distributeFees, updateMarketConditions

    // Timelock system
    bool public timelockInitialized;
    uint256 public constant TIMELOCK_DELAY = 48 hours; // 48 hour delay
    uint256 public constant MIN_TIMELOCK_DELAY = 24 hours; // Minimum 24 hours
    uint256 public constant MAX_TIMELOCK_DELAY = 7 days; // Maximum 7 days
    uint256 public timelockDelay = TIMELOCK_DELAY;

    // Use library enums and structs to reduce contract size
    mapping(bytes32 => DragonTimelockLib.TimelockProposal) public timelockProposals;
    mapping(DragonTimelockLib.AdminOperation => bool) public operationUsedOnce;

    // ======== Errors ========
    error JackpotVaultZeroAddress();
    error RevenueDistributorZeroAddress();
    error WrappedNativeTokenNotSet();
    error LzEndpointZeroAddress();
    error ChainRegistryZeroAddress();
    error ZeroAddress();
    error ZeroAmount();
    error NotAuthorized();
    error RegistrationFailed();
    error InvalidEndpoint();
    error InvalidPayload();
    error InvalidSource();
    error AlreadyConfigured();
    error NotSonicChain();
    error InitialMintingAlreadyDone();
    error MaxSupplyExceeded();
    error InvalidSender();
    error InvalidInputAmount();
    error InvalidOutputAmount();
    error TransfersPaused();
    error InsufficientWrappedNativeBalance();
    error CannotRecoverDragonTokens();
    error DragonPartnerRegistryZeroAddress();
    error DragonPartnerFactoryZeroAddress();
    error PartnerPoolAlreadyRegistered();
    error PartnerPoolNotFound();
    error NotPartnerPool();
    error MaxSingleTransferExceeded();
    error EmergencyPaused();
    error FeesTooHigh();

    // ======== Events ========
    event ExcludedFromFees(address indexed account, bool isExcluded);
    event FeesUpdated(string feeType, uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee, uint256 totalFee);
    event FeeTransferred(address indexed recipient, uint256 amount, string feeType);
    event TokensBurned(uint256 amount);
    event SetTrustedRemote(uint16 _srcChainId, bytes _path);
    event SendToChain(
        uint16 indexed _dstChainId,
        address indexed _from,
        bytes indexed _toAddress,
        uint _amount
    );
    event ReceiveFromChain(
        uint16 indexed _srcChainId,
        bytes indexed _srcAddress,
        address indexed _toAddress,
        uint _amount
    );
    event WrappedNativeTokenSet(address indexed oldAddress, address indexed newAddress);
    event LzEndpointUpdated(address indexed oldEndpoint, address indexed newEndpoint);
    event ContractFullyConfigured();
    event V1FullyConfigured();
    event V2FullyConfigured();
    event InitialMintingPerformed(address indexed to, uint256 amount);
    event PairAdded(address indexed pair);
    event RouterSet(address indexed router);
    event TokensSwappedForWrappedNative(uint256 tokensSwapped, uint256 wrappedNativeReceived);
    event TransfersStatusChanged(bool paused);
    event FeesStatusChanged(bool enabled);
    event DragonPartnerRegistryUpdated(address indexed oldRegistry, address indexed newRegistry);
    event DragonPartnerFactoryUpdated(address indexed oldFactory, address indexed newFactory);
    event RevenueDistributorUpdated(address indexed oldDistributor, address indexed newDistributor);
    event PartnerPoolRegistered(address indexed pool, uint256 partnerId);
    event PartnerPoolRemoved(address indexed pool, uint256 partnerId);
    event PartnerFeesTransferred(address indexed partner, address indexed token, uint256 amount);
    event PartnerJackpotTriggered(address indexed user, address indexed partnerPool, uint256 amount);
    event CommitSubmitted(address indexed user, bytes32 commitment);
    event LotteryEntryRevealed(address indexed user, uint256 amount, uint256 nonce);
    event ProposalCreated(
        bytes32 indexed proposalId,
        DragonTimelockLib.AdminOperation indexed operation,
        bytes data,
        uint256 executeTime
    );
    event ProposalExecuted(bytes32 indexed proposalId, DragonTimelockLib.AdminOperation indexed operation);
    event ProposalCancelled(bytes32 indexed proposalId, DragonTimelockLib.AdminOperation indexed operation);
    event TimelockInitialized(uint256 delay);
    event TimelockDelayUpdated(uint256 oldDelay, uint256 newDelay);
    event Ve69LPBoostManagerUpdated(address indexed oldManager, address indexed newManager);
    event SonicFeeMRegistryUpdated(address indexed oldRegistry, address indexed newRegistry);
    event VRFLotteryManagerUpdated(address indexed oldManager, address indexed newManager);
    event EmergencyBypassExecuted(DragonTimelockLib.AdminOperation indexed operation, string justification);
    event AuthorizedCallerUpdated(address indexed caller, bool authorized);

    // Swap modifiers
    modifier lockTheSwap {
        inSwap = true;
        _;
        inSwap = false;
    }

    modifier notEmergencyPaused() {
        if (emergencyPaused) revert EmergencyPaused();
        _;
    }

    modifier onlyEmergencyPauser() {
        require(msg.sender == emergencyPauser || msg.sender == owner(), "Not emergency pauser");
        _;
    }

    modifier onlyAfterTimelock(DragonTimelockLib.AdminOperation operation, bytes memory data) {
        // First time operations can be executed immediately to bootstrap the system
        if (!timelockInitialized || !operationUsedOnce[operation]) {
            operationUsedOnce[operation] = true;
            // FIXED: Initialize timelock on ANY first-time operation, not just specific ones
            if (!timelockInitialized) {
                timelockInitialized = true;
                emit TimelockInitialized(timelockDelay);
            }
            _;
            return;
        }

        // Subsequent operations require timelock
        bytes32 proposalId = keccak256(abi.encode(operation, data));
        DragonTimelockLib.TimelockProposal storage proposal = timelockProposals[proposalId];

        require(proposal.exists, "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp >= proposal.executeTime, "Timelock not expired");

        proposal.executed = true;
        emit ProposalExecuted(proposalId, operation);
        _;
    }

    /**
     * @dev Propose an admin operation (required after timelock is initialized)
     */
    function proposeAdminOperation(
        DragonTimelockLib.AdminOperation operation,
        bytes calldata data
    ) external onlyOwner returns (bytes32 proposalId) {
        require(timelockInitialized, "Timelock not initialized");
        require(operationUsedOnce[operation], "First use must be direct");

        proposalId = keccak256(abi.encode(operation, data));
        require(!timelockProposals[proposalId].exists, "Proposal already exists");

        uint256 executeTime = block.timestamp + timelockDelay;

        timelockProposals[proposalId] = DragonTimelockLib.TimelockProposal({
            operation: operation,
            data: data,
            executeTime: executeTime,
            executed: false,
            exists: true
        });

        emit ProposalCreated(proposalId, operation, data, executeTime);
        return proposalId;
    }

    /**
     * @dev Cancel a pending proposal
     */
    function cancelProposal(bytes32 proposalId) external onlyOwner {
        DragonTimelockLib.TimelockProposal storage proposal = timelockProposals[proposalId];
        require(proposal.exists, "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");

        DragonTimelockLib.AdminOperation operation = proposal.operation;
        delete timelockProposals[proposalId];

        emit ProposalCancelled(proposalId, operation);
    }

    /**
     * @dev Set timelock delay (with timelock protection after first use)
     */
    function setTimelockDelay(uint256 _delay) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_TIMELOCK_DELAY, abi.encode(_delay)) {
        require(_delay >= MIN_TIMELOCK_DELAY, "Delay too short");
        require(_delay <= MAX_TIMELOCK_DELAY, "Delay too long");

        uint256 oldDelay = timelockDelay;
        timelockDelay = _delay;

        emit TimelockDelayUpdated(oldDelay, _delay);
    }

    /**
     * @dev Constructor to initialize the token
     */
    constructor(
        string memory _name, // Dragon
        string memory _symbol, // DRAGON
        address _jackpotVault,
        address _revenueDistributor,
        address _lzEndpoint,
        address _chainRegistry
    ) ERC20(_name, _symbol) Ownable() {
        if (_jackpotVault == address(0)) revert JackpotVaultZeroAddress();
        if (_revenueDistributor == address(0)) revert RevenueDistributorZeroAddress();
        if (_lzEndpoint == address(0)) revert InvalidEndpoint();
        if (_chainRegistry == address(0)) revert ChainRegistryZeroAddress();

        jackpotVault = _jackpotVault;
        revenueDistributor = _revenueDistributor;
        lzEndpoint = _lzEndpoint;
        chainRegistry = _chainRegistry;

        // Initialize to zero address - must be set before use
        wrappedNativeToken = address(0);

        // Initialize default Sonic FeeM registry (can be updated later)
        sonicFeeMRegistry = 0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830;

        // Initialize flag values
        feesEnabled = true;
        swapEnabled = true;

        // Set up default fees
        // Buy fees (10%)
        buyFees.jackpot = 690; // 6.9%
        buyFees.ve69LP = 241; // 2.41%
        buyFees.burn = 69;  // 0.69%
        buyFees.total = 1000; // 10%

        // Sell fees (10%)
        sellFees.jackpot = 690; // 6.9%
        sellFees.ve69LP = 241; // 2.41%
        sellFees.burn = 69;  // 0.69%
        sellFees.total = 1000; // 10%

        // Regular transfer fees
        transferFees.jackpot = 0; // 0%
        transferFees.ve69LP = 0; // 0%
        transferFees.burn = 69;  // 0.69%
        transferFees.total = 69; // 0.69%

        // Default swap threshold (0.1% of supply)
        swapThreshold = (INITIAL_SUPPLY * 1) / 1000;

        // Set minimum amount for processing (0.01% of supply)
        minimumAmountForProcessing = (INITIAL_SUPPLY * 1) / 10000;

        // Exclude addresses from fees
        isExcludedFromFees[address(this)] = true;
        isExcludedFromFees[_jackpotVault] = true;
        isExcludedFromFees[_revenueDistributor] = true;
        isExcludedFromFees[owner()] = true;

        initialMintingDone = false;
    }

    /**
     * @dev Sets the wrapped native token address after deployment
     * This allows us to deploy with identical bytecode across chains
     * @param _wrappedNativeToken The actual wrapped native token address (WrappedNativeToken/WETH)
     */
    function setWrappedNativeToken(address _wrappedNativeToken) external onlyOwner {
        if (_wrappedNativeToken == address(0)) revert WrappedNativeTokenNotSet();
        if (configurationVersion >= 1) revert AlreadyConfigured();

        // Store old address for event
        address oldAddress = wrappedNativeToken;

        // Set new address
        wrappedNativeToken = _wrappedNativeToken;

        // Exclude from fees
        isExcludedFromFees[_wrappedNativeToken] = true;

        emit WrappedNativeTokenSet(oldAddress, _wrappedNativeToken);
    }

    /**
     * @dev Sets the Uniswap Router address (with timelock protection after first use)
     * @param _router The Uniswap Router address
     */
    function setUniswapRouter(address _router) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_UNISWAP_ROUTER, abi.encode(_router)) {
        if (_router == address(0)) revert ZeroAddress();
        uniswapRouter = _router;
        isExcludedFromFees[_router] = true;
        emit RouterSet(_router);
    }

    /**
     * @dev Add a liquidity pair to the known pairs list
     * @param _pair The pair address to add
     */
    function addPair(address _pair) external onlyOwner notEmergencyPaused {
        if (_pair == address(0)) revert ZeroAddress();
        isPair[_pair] = true;
        // Not auto-excluding, so fees apply by default
        pairToDexType[_pair] = DexType.UNKNOWN;
        emit PairAdded(_pair);
    }

    /**
     * @dev Add a liquidity pair with specific DEX type
     * @param _pair The pair address to add
     * @param _dexType The DEX type (1=UniV2, 2=UniV3, 3=Balancer, 4=Curve)
     */
    function addPairWithType(address _pair, DexType _dexType) external onlyOwner {
        if (_pair == address(0)) revert ZeroAddress();
        isPair[_pair] = true;
        // Not auto-excluding, so fees apply by default
        pairToDexType[_pair] = _dexType;
        emit PairAdded(_pair);
    }

    /**
     * @dev Add multiple pairs at once
     * @param _pairs The array of pair addresses
     * @param _dexTypes The array of corresponding DEX types
     */
    function addPairsBatch(address[] calldata _pairs, DexType[] calldata _dexTypes) external onlyOwner {
        require(_pairs.length == _dexTypes.length, "Arrays must have same length");

        for (uint256 i = 0; i < _pairs.length; i++) {
            if (_pairs[i] == address(0)) continue;

            isPair[_pairs[i]] = true;
            // Not auto-excluding, so fees apply by default
            pairToDexType[_pairs[i]] = _dexTypes[i];
            emit PairAdded(_pairs[i]);
        }
    }

    /**
     * @dev Sets the swap threshold that triggers a token swap
     * @param _threshold The threshold amount
     */
    function setSwapThreshold(uint256 _threshold) external onlyOwner {
        swapThreshold = _threshold;
    }

    /**
     * @dev Pauses all transfers (emergency use only)
     * @param _paused Whether transfers should be paused
     */
    function pauseTransfers(bool _paused) external onlyOwner {
        transfersPaused = _paused;
        emit TransfersStatusChanged(_paused);
    }

    /**
     * @dev Enables or disables fees (emergency use only)
     * @param _enabled Whether fees should be enabled
     */
    function setFeesEnabled(bool _enabled) external onlyOwner {
        feesEnabled = _enabled;
        emit FeesStatusChanged(_enabled);
    }

    /**
     * @dev Sets the minimum amount for fee processing
     * @param _minAmount The minimum amount
     */
    function setMinimumAmountForProcessing(uint256 _minAmount) external onlyOwner {
        minimumAmountForProcessing = _minAmount;
    }

    /**
     * @dev Enable or disable swapping to native tokens
     * @param _enabled Whether swapping is enabled
     */
    function setSwapEnabled(bool _enabled) external onlyOwner {
        swapEnabled = _enabled;
    }

    /**
     * @dev Sets the LayerZero endpoint address after deployment
     * This allows us to deploy with identical bytecode across chains
     * @param _lzEndpoint The actual LayerZero endpoint address
     */
    function setLzEndpoint(address _lzEndpoint) external onlyOwner {
        if (_lzEndpoint == address(0)) revert LzEndpointZeroAddress();
        if (configurationVersion >= 1) revert AlreadyConfigured();

        // Store old address for event
        address oldEndpoint = lzEndpoint;

        // Set new address
        lzEndpoint = _lzEndpoint;

        emit LzEndpointUpdated(oldEndpoint, _lzEndpoint);
    }

    /**
     * @dev Mark contract as V1 fully configured
     * This locks critical V1 infrastructure components
     */
    function markV1FullyConfigured() external onlyOwner {
        require(configurationVersion == 0, "Already configured");
        configurationVersion = 1;
        emit ContractFullyConfigured();
        emit V1FullyConfigured();
    }

    /**
     * @dev Mark contract as V2 fully configured
     * This locks partner components after they've been set up
     */
    function markV2FullyConfigured() external onlyOwner {
        require(configurationVersion == 1, "Must configure V1 first");
        configurationVersion = 2;
        emit V2FullyConfigured();
    }

    /**
     * @dev OFTv2 functionality: Set trusted remote address for a chain
     */
    function setTrustedRemote(uint16 _srcChainId, bytes calldata _path) external onlyOwner {
        trustedRemoteLookup[_srcChainId] = _path;
        emit SetTrustedRemote(_srcChainId, _path);
    }

    /**
     * @dev V2 compatibility: Set peer address for a specific chain
     * @param _srcEid Source endpoint ID
     * @param _peerAddress Peer contract address on the source chain
     */
    function setPeer(uint16 _srcEid, bytes32 _peerAddress) external onlyOwner {
        trustedRemoteLookup[_srcEid] = abi.encodePacked(_peerAddress);
        emit SetTrustedRemote(_srcEid, abi.encodePacked(_peerAddress));
    }

    /**
     * @dev OFTv2 functionality: Set the minimum gas required on the destination
     */
    function setMinDstGas(uint16 _dstChainId, uint _minGas) external onlyOwner {
        minDstGasLookup[_dstChainId] = _minGas;
    }

    /**
     * @dev V2 compatibility: Check if a peer is trusted for a specific chain
     */
    function isPeer(uint16 _srcEid, bytes32 _srcAddress) public view returns (bool) {
        if (trustedRemoteLookup[_srcEid].length == 0) return false;
        return keccak256(abi.encodePacked(_srcAddress)) == keccak256(trustedRemoteLookup[_srcEid]);
    }

    /**
     * @dev V2 compatibility: Allow path initialization
     */
    function allowInitializePath(Origin calldata _origin) external view returns (bool) {
        return trustedRemoteLookup[_origin.srcEid].length > 0;
    }

    /**
     * @dev OFTv2 functionality: Estimate send fee for a cross-chain transfer
     */
    function estimateSendFee(
        uint16 _dstChainId,
        bytes calldata _toAddress,
        uint _amount,
        bool _useZro,
        bytes calldata _adapterParams
    ) public view returns (uint nativeFee, uint zroFee) {
        bytes memory payload = abi.encode(_toAddress, _amount);
        return _estimateFee(_dstChainId, payload, _useZro, _adapterParams);
    }

    /**
     * @dev Internal function to estimate fees for a cross-chain transfer
     */
    function _estimateFee(
        uint16 _dstChainId,
        bytes memory _payload,
        bool _useZro,
        bytes memory _adapterParams
    ) internal view returns (uint nativeFee, uint zroFee) {
        try ILayerZeroEndpoint(lzEndpoint).estimateFees(
            _dstChainId,
            address(this),
            _payload,
            _useZro,
            _adapterParams
        ) returns (uint _nativeFee, uint _zroFee) {
            return (_nativeFee, _zroFee);
        } catch {
            // If estimation fails, return a default fee
            return (0.01 ether, 0);
        }
    }

    /**
     * @dev OFTv2 functionality: Send tokens to another chain
     */
    function sendTokens(
        uint16 _dstChainId,
        bytes32 _toAddress,
        uint _amount,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable {
        _debitFrom(msg.sender, _amount);

        bytes memory payload = abi.encode(_toAddress, _amount);

        _lzSend(
            _dstChainId,
            payload,
            _refundAddress,
            _zroPaymentAddress,
            _adapterParams
        );

        emit SendToChain(_dstChainId, msg.sender, abi.encodePacked(_toAddress), _amount);
    }

    /**
     * @dev Send a message via LayerZero with proper error handling
     */
    function _lzSend(
        uint16 _dstChainId,
        bytes memory _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes memory _adapterParams
    ) internal {
        try ILayerZeroEndpoint(lzEndpoint).send{value: msg.value}(
            _dstChainId,
            trustedRemoteLookup[_dstChainId],
            _payload,
            _refundAddress,
            _zroPaymentAddress,
            _adapterParams
        ) {} catch (bytes memory) {
            // Revert all operations if the send fails
            revert InvalidEndpoint();
        }
    }

    /**
     * @dev OFTv2 functionality: Receive tokens from another chain - FIXED V2 decoding
     */
    function lzReceive(
        Origin calldata _origin,
        bytes32 /* _guid */,
        bytes calldata _message,
        address /* _executor */,
        bytes calldata /* _extraData */
    ) external {
        // Verify source
        if (msg.sender != lzEndpoint) revert InvalidSource();

        // Verify trusted remote
        if (!isPeer(_origin.srcEid, _origin.sender)) revert InvalidSource();

        // FIXED: Correct decoding for LayerZero V2
        (bytes32 toAddressBytes32, uint amount) = abi.decode(_message, (bytes32, uint));
        address toAddress = address(bytes20(toAddressBytes32));

        // Credit tokens to the recipient
        _creditTo(_origin.srcEid, toAddress, amount);
        emit ReceiveFromChain(_origin.srcEid, abi.encodePacked(_origin.sender), toAddress, amount);
    }

    /**
     * @dev Debit tokens from an account (burn)
     */
    function _debitFrom(address _from, uint _amount) internal returns (uint) {
        address spender = _msgSender();

        if (_from != spender) {
            _spendAllowance(_from, spender, _amount);
        }

        _burn(_from, _amount);
        return _amount;
    }

    /**
     * @dev Credit tokens to an account (mint) - FIXED with MAX_SUPPLY enforcement
     */
    function _creditTo(uint16 /* _srcChainId */, address _toAddress, uint _amount) internal returns (uint) {
        // FIXED: Enforce MAX_SUPPLY to prevent over-minting via cross-chain transfers
        if (totalSupply() + _amount > MAX_SUPPLY) revert MaxSupplyExceeded();

        _mint(_toAddress, _amount);
        return _amount;
    }

    /**
     * @dev Sets jackpot vault address (with timelock protection after first use)
     */
    function setJackpotVault(address _jackpotVault) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_JACKPOT_VAULT, abi.encode(_jackpotVault)) {
        if (_jackpotVault == address(0)) revert JackpotVaultZeroAddress();
        jackpotVault = _jackpotVault;
        isExcludedFromFees[_jackpotVault] = true;
    }

    /**
     * @dev Set the revenue distributor address (with timelock protection after first use)
     */
    function setRevenueDistributor(address _revenueDistributor) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_REVENUE_DISTRIBUTOR, abi.encode(_revenueDistributor)) {
        if (_revenueDistributor == address(0)) revert RevenueDistributorZeroAddress();

        address oldDistributor = revenueDistributor;
        isExcludedFromFees[_revenueDistributor] = true;
        revenueDistributor = _revenueDistributor;

        emit RevenueDistributorUpdated(oldDistributor, _revenueDistributor);
    }



    /**
     * @dev Excludes account from fees
     */
    function setExcludedFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
        emit ExcludedFromFees(account, excluded);
    }

    /**
     * @dev Validates fee values to ensure they don't exceed limits
     */
    function _validateFees(uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee) internal pure returns (uint256) {
        uint256 total = jackpotFee + ve69Fee + burnFee;
        if (total > MAX_FEE_BASIS_POINTS) revert FeesTooHigh();
        return total;
    }

    /**
     * @dev Sets buy fees (with timelock protection after first use)
     */
    function setBuyFees(uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_BUY_FEES, abi.encode(jackpotFee, ve69Fee, burnFee)) {
        buyFees.total = _validateFees(jackpotFee, ve69Fee, burnFee);
        buyFees.jackpot = jackpotFee;
        buyFees.ve69LP = ve69Fee;
        buyFees.burn = burnFee;

        emit FeesUpdated("Buy", jackpotFee, ve69Fee, burnFee, buyFees.total);
    }

    /**
     * @dev Sets sell fees (with timelock protection after first use)
     */
    function setSellFees(uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_SELL_FEES, abi.encode(jackpotFee, ve69Fee, burnFee)) {
        sellFees.total = _validateFees(jackpotFee, ve69Fee, burnFee);
        sellFees.jackpot = jackpotFee;
        sellFees.ve69LP = ve69Fee;
        sellFees.burn = burnFee;

        emit FeesUpdated("Sell", jackpotFee, ve69Fee, burnFee, sellFees.total);
    }

    /**
     * @dev Sets transfer fees (with timelock protection after first use)
     */
    function setTransferFees(uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_TRANSFER_FEES, abi.encode(jackpotFee, ve69Fee, burnFee)) {
        transferFees.total = _validateFees(jackpotFee, ve69Fee, burnFee);
        transferFees.jackpot = jackpotFee;
        transferFees.ve69LP = ve69Fee;
        transferFees.burn = burnFee;

        emit FeesUpdated("Transfer", jackpotFee, ve69Fee, burnFee, transferFees.total);
    }

    /**
     * @dev Gets buy fees
     */
    function getBuyFees() external view returns (
        uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee, uint256 totalFee
    ) {
        return (buyFees.jackpot, buyFees.ve69LP, buyFees.burn, buyFees.total);
    }

    /**
     * @dev Gets sell fees
     */
    function getSellFees() external view returns (
        uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee, uint256 totalFee
    ) {
        return (sellFees.jackpot, sellFees.ve69LP, sellFees.burn, sellFees.total);
    }

    /**
     * @dev Gets transfer fees
     */
    function getTransferFees() external view returns (
        uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee, uint256 totalFee
    ) {
        return (transferFees.jackpot, transferFees.ve69LP, transferFees.burn, transferFees.total);
    }

    /**
     * @dev Override _transfer to implement dynamic fees and lottery entries - FIXED transaction type logic
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override nonReentrant notEmergencyPaused {
        // Early return conditions for gas optimization
        if (amount == 0) {
            super._transfer(from, to, amount);
            return;
        }

        // FIXED: Enforce max single transfer limit
        if (amount > maxSingleTransfer && from != owner() && to != owner()) {
            revert MaxSingleTransferExceeded();
        }

        // Check transfers paused - use custom error instead of string for gas savings
        if (transfersPaused && from != owner() && !isExcludedFromFees[from]) {
            revert TransfersPaused();
        }

        // FIXED: Declare pair/pool variables once to avoid shadowing
        bool isFromPairOrPool = isPair[from] || isPartnerPool[from];
        bool isToPairOrPool = isPair[to] || isPartnerPool[to];

        // Skip processing for exempt addresses or during swap
        bool isFromExcluded = isExcludedFromFees[from];
        bool isToExcluded = isExcludedFromFees[to];
        if (isFromExcluded || isToExcluded || inSwap) {
            super._transfer(from, to, amount);

            // Process lottery entry for BUYS only (tokens FROM pair/pool TO user)
            if (lotteryManager != address(0) && isFromPairOrPool && !isToPairOrPool) {
                _tryProcessLotteryEntry(to, amount); // 'to' is the user buying
            }
            _updateMarketConditionsInternal(amount);
            return;
        }

        // Skip processing for small amounts to save gas
        if (amount < minimumAmountForProcessing) {
            super._transfer(from, to, amount);
            return;
        }

        // Check if we need to swap accumulated tokens
        uint256 contractBalance = balanceOf(address(this));
        if (
            swapEnabled &&
            !inSwap &&
            from != owner() &&
            contractBalance >= swapThreshold
        ) {
            swapTokensForWrappedNative(swapThreshold);
        }

        // FIXED: Correct transaction type determination

        uint8 transactionType;
        if (isFromPairOrPool && !isToPairOrPool) {
            transactionType = 0; // Buy: tokens moving FROM pair/pool TO user
        } else if (!isFromPairOrPool && isToPairOrPool) {
            transactionType = 1; // Sell: tokens moving FROM user TO pair/pool
        } else {
            transactionType = 2; // Transfer: user-to-user, or other combinations
        }

        // Get dynamic fees based on current market conditions
        (uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee, uint256 totalFee) =
            this.getCurrentFees(to, transactionType);

        // Skip fee calculation if fees are disabled or total fee is 0
        if (!feesEnabled || totalFee == 0) {
            super._transfer(from, to, amount);

            // Update market conditions and process lottery entry
            _updateMarketConditionsInternal(amount);
            // Process lottery entry for BUYS only
            if (lotteryManager != address(0) && transactionType == 0) {
                _tryProcessLotteryEntry(to, amount); // 'to' is the user buying
            }
            return;
        }

        // Calculate fee amounts using dynamic fees
        uint256 feeBase = amount / 10000;
        uint256 burnAmount = burnFee * feeBase;
        uint256 jackpotAmount = jackpotFee * feeBase;
        uint256 ve69Amount = ve69Fee * feeBase;
        uint256 totalFeeAmount = burnAmount + jackpotAmount + ve69Amount;

        // Check for potential underflow
        if (totalFeeAmount > amount) {
            revert InvalidInputAmount();
        }

        // Apply burn directly if non-zero
        if (burnAmount > 0) {
            super._transfer(from, address(0xdead), burnAmount);
            emit TokensBurned(burnAmount);
        }

        // Bundle transfers to contract for gas savings
        uint256 contractFeeAmount = jackpotAmount + ve69Amount;
        if (contractFeeAmount > 0) {
            super._transfer(from, address(this), contractFeeAmount);
        }

        // Transfer remaining tokens to recipient
        super._transfer(from, to, amount - totalFeeAmount);

        // Update market conditions with this transaction
        _updateMarketConditionsInternal(amount);

        // Process lottery entry ONLY for buys (transactionType == 0)
        if (lotteryManager != address(0) && transactionType == 0) {
            _tryProcessLotteryEntry(to, amount); // 'to' is the user buying
        }
    }

    /**
     * @dev Internal function to update market conditions
     */
    function _updateMarketConditionsInternal(uint256 amount) private {
        if (address(adaptiveFeeManager) != address(0)) {
            try adaptiveFeeManager.addVolume(amount) {} catch {}
        }
    }

    /**
     * @dev Helper function to process lottery entry with clean architecture
     * UPDATED: Now uses unified LotteryManager only
     */
    function _tryProcessLotteryEntry(address user, uint256 amount) private {
        // Use unified lottery manager (clean architecture)
        if (lotteryManager != address(0)) {
            try IOmniDragonLotteryManager(lotteryManager).createLotteryEntry(
                user,
                amount,
                _getUserVotingPower(user)
            ) {
                // Lottery entry successful - single call handles everything
            } catch {
                // Ignore failures - no action needed
            }
        }
    }

    /**
     * @dev Get user's voting power for lottery calculations
     * @param user User address
     * @return votingPower User's ve69LP voting power
     */
    function _getUserVotingPower(address user) private view returns (uint256 votingPower) {
        if (ve69LPBoostManager != address(0)) {
            try Ive69LPBoostManager(ve69LPBoostManager).getVotingPower(user) returns (uint256 power) {
                return power;
            } catch {
                return 0;
            }
        }
        return 0;
    }

    /**
     * @dev Swap tokens for wrapped native token and distribute to fee recipients
     * @notice ALL accumulated fees (buy/sell/transfer) are distributed using BUY fee ratios
     *         This is intentional design for simplicity - all swapped proceeds use 69%/24.1% split
     */
    function swapTokensForWrappedNative(uint256 tokenAmount) private lockTheSwap {
        // Skip if router, wrapped native token, or token amount is not valid
        if (uniswapRouter == address(0) || wrappedNativeToken == address(0) || tokenAmount == 0) return;

        // Get router interface
        IUniswapRouter router = IUniswapRouter(uniswapRouter);

        // Cache wrapped native token address for gas savings
        address wrappedToken = wrappedNativeToken;

        // Approve router to spend tokens - only approve what's needed
        _approve(address(this), uniswapRouter, tokenAmount);

        // Set up the swap path (optimized to use storage less)
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = wrappedToken;

        // Store balance before swap for accurate received amount calculation
        uint256 balanceBefore = IERC20(wrappedToken).balanceOf(address(this));

        // Execute the swap
        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // Accept any amount of wrapped native
            path,
            address(this),
            block.timestamp + 300
        );

        // Calculate how much we received and distribute
        uint256 wrappedNativeReceived = IERC20(wrappedToken).balanceOf(address(this)) - balanceBefore;

        emit TokensSwappedForWrappedNative(tokenAmount, wrappedNativeReceived);

        // Skip distribution if nothing was received
        if (wrappedNativeReceived == 0) return;

        // Calculate fee distribution using cached variables for gas efficiency
        uint256 totalFeeBasis = buyFees.jackpot + buyFees.ve69LP;

        // Avoid division by zero
        if (totalFeeBasis == 0) return;

        uint256 jackpotShare = (wrappedNativeReceived * buyFees.jackpot) / totalFeeBasis;
        uint256 ve69Share = wrappedNativeReceived - jackpotShare; // Optimized to avoid additional math

        // Distribute fees
        _distributeFees(jackpotShare, ve69Share);
    }

    /**
     * @dev Distribute fees to jackpot and revenue distributor
     */
    function _distributeFees(uint256 jackpotAmount, uint256 ve69Amount) internal {
        // Cache token and vault addresses for gas optimization
        address wrappedToken = wrappedNativeToken;
        if (wrappedToken == address(0)) return; // Skip if wrapped native token not set
        address vault = jackpotVault;

        // Process jackpot fee if non-zero and vault exists
        if (jackpotAmount > 0 && vault != address(0)) {
            IERC20(wrappedToken).safeTransfer(vault, jackpotAmount);
            IDragonJackpotVault(vault).addToJackpot(jackpotAmount);
            emit FeeTransferred(vault, jackpotAmount, "Jackpot");
        }

        // Process ve69LP fee if non-zero and distributor exists
        if (ve69Amount > 0 && revenueDistributor != address(0)) {
            IERC20(wrappedToken).safeTransfer(revenueDistributor, ve69Amount);
            // Use the general fee distribution method
            IDragonRevenueDistributor(revenueDistributor).distributeGeneralFees(wrappedToken, ve69Amount);
            emit FeeTransferred(revenueDistributor, ve69Amount, "Revenue");
        }
    }

    /**
     * @dev Manual swap function to convert accumulated tokens to wrapped native
     */
    function manualSwap() external onlyOwner notEmergencyPaused {
        uint256 tokenBalance = balanceOf(address(this));
        if (tokenBalance > 0) {
            swapTokensForWrappedNative(tokenBalance);
        }
    }

    /**
     * @dev Burns tokens
     */
    function burn(uint256 amount) public {
        if (amount == 0) return;

        _burn(msg.sender, amount);
        emit TokensBurned(amount);
    }

    /**
     * @dev Adds to jackpot
     */
    function addToJackpot(uint256 amount) external onlyOwner notEmergencyPaused {
        if (amount == 0) revert ZeroAmount();
        if (wrappedNativeToken == address(0)) revert WrappedNativeTokenNotSet();

        IERC20(wrappedNativeToken).safeTransferFrom(msg.sender, jackpotVault, amount);
        IDragonJackpotVault(jackpotVault).addToJackpot(amount);

        emit FeeTransferred(jackpotVault, amount, "Jackpot");
    }

    /**
     * @dev Process entry for lottery directly - FIXED authorization
     */
    function processEntry(address user, uint256 amount) external nonReentrant notEmergencyPaused {
        if (user == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        // Proper authorization check using dedicated mapping
        if (msg.sender != owner() && !isAuthorizedCaller[msg.sender]) {
            revert NotAuthorized();
        }

        // Process lottery entry if lottery manager is set
        if (lotteryManager != address(0)) {
            _tryProcessLotteryEntry(user, amount);
        }
    }

    /**
     * @dev Register on Sonic FeeM - FIXED hardcoded address
     */
    function registerMe() external nonReentrant notEmergencyPaused {
        if (sonicFeeMRegistry == address(0)) revert ZeroAddress();

        (bool success,) = sonicFeeMRegistry.call(
            abi.encodeWithSignature("selfRegister(uint256)", SONIC_FEEM_REGISTER_VALUE)
        );
        if (!success) revert RegistrationFailed();
    }

    /**
     * @dev Performs the initial minting of tokens (only on Sonic chain)
     * Can only be called once and only on Sonic chain
     */
    function performInitialMinting(address recipient) external onlyOwner {
        // Check if initial minting has already been done
        if (initialMintingDone) revert InitialMintingAlreadyDone();

        // Check if we're on Sonic Chain
        uint16 currentChainId = IChainRegistry(chainRegistry).getCurrentChainId();
        if (currentChainId != SONIC_CHAIN_ID) revert NotSonicChain();

        // Set flag to prevent future minting
        initialMintingDone = true;

        // Mint initial supply to the specified recipient
        _mint(recipient, INITIAL_SUPPLY);

        emit InitialMintingPerformed(recipient, INITIAL_SUPPLY);
    }

    /**
     * @dev Mint tokens (owner only)
     * Can only mint up to MAX_SUPPLY across all chains
     */
    function mint(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        uint256 totalSupplyValue = totalSupply();
        if (totalSupplyValue + amount > MAX_SUPPLY) revert MaxSupplyExceeded();

        _mint(to, amount);
    }

    /**
     * @dev Recover any tokens accidentally sent to this contract
     */
    function recoverToken(address tokenAddress) external onlyOwner {
        // Can't recover DRAGON tokens to prevent abuse
        if (tokenAddress == address(this)) revert CannotRecoverDragonTokens();

        uint256 tokenAmount = IERC20(tokenAddress).balanceOf(address(this));
        if (tokenAmount > 0) {
            IERC20(tokenAddress).safeTransfer(owner(), tokenAmount);
        }
    }

    /**
     * @dev Process swap of native tokens ($S) to Dragon tokens and apply fees
     * @notice This function calculates fees on native swap amount and returns the swappable amount.
     *         IMPORTANT: Burn fees are calculated but NOT enforced for native swaps.
     *         The caller is responsible for:
     *         1. Using the returned swappableAmount for the actual token swap
     *         2. Converting the fee amounts (nativeAmount - swappableAmount) to wrapped native tokens
     *         3. Calling distributeFees() with the converted wrapped native amounts
     *         4. Handling burn fees separately if desired (not enforced by this contract)
     * @param _user User performing the swap
     * @param _nativeAmount Total native amount being swapped
     * @return swappableAmount Amount available for swapping after fees (includes calculated burn)
     * @return nativeFeeAmount Total native amount for distribution (excludes burn)
     * @return jackpotFeeAmount Native amount for jackpot (within nativeFeeAmount)
     * @return ve69FeeAmount Native amount for ve69LP (within nativeFeeAmount)
     */
    function processNativeSwapFees(address _user, uint256 _nativeAmount) external override nonReentrant notEmergencyPaused returns (uint256 swappableAmount, uint256 nativeFeeAmount, uint256 jackpotFeeAmount, uint256 ve69FeeAmount) {
        if (_user == address(0)) revert ZeroAddress();
        if (_nativeAmount == 0) revert ZeroAmount();

        // Proper authorization check for native swap handlers
        if (msg.sender != owner() && !isAuthorizedCaller[msg.sender] && msg.sender != uniswapRouter) {
            revert NotAuthorized();
        }

        // Cache buyFees to avoid multiple SLOAD operations
        uint256 burnFee = buyFees.burn;
        uint256 jackpotFee = buyFees.jackpot;
        uint256 ve69Fee = buyFees.ve69LP;

        // Calculate fees using the buy fee structure
        uint256 feeBase = _nativeAmount / 10000;
        uint256 burnAmount = burnFee * feeBase;
        jackpotFeeAmount = jackpotFee * feeBase;
        ve69FeeAmount = ve69Fee * feeBase;
        uint256 totalFeeAmount = burnAmount + jackpotFeeAmount + ve69FeeAmount;

        // Amount actually used for swap after fees
        swappableAmount = _nativeAmount - totalFeeAmount;
        nativeFeeAmount = jackpotFeeAmount + ve69FeeAmount; // Exclude burn from fees to distribute

        // Process lottery entry if lottery manager is set
        if (lotteryManager != address(0)) {
            _tryProcessLotteryEntry(_user, _nativeAmount);
        }

        return (swappableAmount, nativeFeeAmount, jackpotFeeAmount, ve69FeeAmount);
    }

    /**
     * @dev Process complete native swap with fee handling
     * @notice This function handles the complete native swap process including fee conversion.
     *         It accepts wrapped native tokens and distributes them based on current fee ratios.
     * @param _user User performing the swap
     * @param _nativeAmount Total native amount being swapped (for lottery entry)
     * @param _wrappedNativeFeeAmount Wrapped native amount sent for fees
     */
    function processNativeSwapWithFees(address _user, uint256 _nativeAmount, uint256 _wrappedNativeFeeAmount) external nonReentrant notEmergencyPaused {
        if (_user == address(0)) revert ZeroAddress();
        if (_nativeAmount == 0) revert ZeroAmount();
        if (_wrappedNativeFeeAmount == 0) revert ZeroAmount();

        // Proper authorization check for native swap handlers
        if (msg.sender != owner() && !isAuthorizedCaller[msg.sender] && msg.sender != uniswapRouter) {
            revert NotAuthorized();
        }

        // Transfer wrapped native fees from caller to this contract
        IERC20(wrappedNativeToken).safeTransferFrom(msg.sender, address(this), _wrappedNativeFeeAmount);

        // Calculate distribution based on CURRENT buy fee ratios (more robust than strict equality)
        uint256 totalFeeBasis = buyFees.jackpot + buyFees.ve69LP;

        if (totalFeeBasis > 0) {
            uint256 jackpotAmount = (_wrappedNativeFeeAmount * buyFees.jackpot) / totalFeeBasis;
            uint256 ve69Amount = _wrappedNativeFeeAmount - jackpotAmount;

            // Distribute the fees immediately
            _distributeFees(jackpotAmount, ve69Amount);
        }

        // Process lottery entry if lottery manager is set
        if (lotteryManager != address(0)) {
            _tryProcessLotteryEntry(_user, _nativeAmount);
        }
    }

    /**
     * @dev Distribute fees - FIXED authorization
     */
    function distributeFees(uint256 jackpotAmount, uint256 ve69Amount) external override nonReentrant notEmergencyPaused {
        // Proper authorization check for fee distributors
        if (msg.sender != owner() && !isAuthorizedCaller[msg.sender] && msg.sender != uniswapRouter) {
            revert NotAuthorized();
        }

        if (jackpotAmount > 0 || ve69Amount > 0) {
            _distributeFees(jackpotAmount, ve69Amount);
        }
    }

    /**
     * @dev Set Dragon Partner Registry address
     * @param _registry The Dragon Partner Registry address
     */
    function setDragonPartnerRegistry(address _registry) external onlyOwner {
        if (_registry == address(0)) revert DragonPartnerRegistryZeroAddress();
        if (configurationVersion >= 2) revert AlreadyConfigured();

        address oldRegistry = dragonPartnerRegistry;
        dragonPartnerRegistry = _registry;
        isExcludedFromFees[_registry] = true;

        emit DragonPartnerRegistryUpdated(oldRegistry, _registry);
    }

    /**
     * @dev Set Dragon Partner Factory address
     * @param _factory The Dragon Partner Factory address
     */
    function setDragonPartnerFactory(address _factory) external onlyOwner {
        if (_factory == address(0)) revert DragonPartnerFactoryZeroAddress();
        if (configurationVersion >= 2) revert AlreadyConfigured();

        address oldFactory = dragonPartnerFactory;
        dragonPartnerFactory = _factory;
        isExcludedFromFees[_factory] = true;

        emit DragonPartnerFactoryUpdated(oldFactory, _factory);
    }

    /**
     * @dev Register a partner pool
     * @param _pool Partner pool address
     * @param _partnerId Partner ID from the registry
     */
    function registerPartnerPool(address _pool, uint256 _partnerId) external {
        // Only allow registry or factory to call this
        if (msg.sender != dragonPartnerRegistry && msg.sender != dragonPartnerFactory && msg.sender != owner()) {
            revert NotAuthorized();
        }

        if (_pool == address(0)) revert ZeroAddress();
        if (isPartnerPool[_pool]) revert PartnerPoolAlreadyRegistered();

        // Mark as partner pool
        isPartnerPool[_pool] = true;
        partnerPoolIds[_pool] = _partnerId;

        // Exclude partner pool from fees
        isExcludedFromFees[_pool] = true;

        emit PartnerPoolRegistered(_pool, _partnerId);
    }

    /**
     * @dev Remove a partner pool
     * @param _pool Partner pool address to remove
     */
    function removePartnerPool(address _pool) external {
        // Only allow registry or owner to call this
        if (msg.sender != dragonPartnerRegistry && msg.sender != owner()) {
            revert NotAuthorized();
        }

        if (!isPartnerPool[_pool]) revert PartnerPoolNotFound();

        uint256 partnerId = partnerPoolIds[_pool];

        // Remove from partner pools
        isPartnerPool[_pool] = false;
        partnerPoolIds[_pool] = 0;

        // No longer exclude from fees
        isExcludedFromFees[_pool] = false;

        emit PartnerPoolRemoved(_pool, partnerId);
    }

    /**
     * @dev Process jackpot entry from a partner pool
     * @param _user User address to credit lottery entry
     * @param _amount Amount to base the lottery entry on
     */
    function processPartnerJackpotEntry(address _user, uint256 _amount) external {
        // Only partner pools can call this
        if (!isPartnerPool[msg.sender]) revert NotPartnerPool();

        if (_user == address(0)) revert ZeroAddress();
        if (_amount == 0) revert ZeroAmount();

        // Process lottery entry if lottery manager is set
        if (lotteryManager != address(0)) {
            _tryProcessLotteryEntry(_user, _amount);
        }

        emit PartnerJackpotTriggered(_user, msg.sender, _amount);
    }

    /**
     * @dev Distribute partner-sourced fees - FIXED fallback logic
     */
    function distributePartnerFees(address _partner, address _token, uint256 _amount) external nonReentrant notEmergencyPaused {
        // Only partner pools can call this
        if (!isPartnerPool[msg.sender]) revert NotPartnerPool();

        if (_partner == address(0)) revert ZeroAddress();
        if (_token == address(0)) revert ZeroAddress();
        if (_amount == 0) revert ZeroAmount();

        // FIXED: Check that revenue distributor is set
        if (revenueDistributor == address(0)) revert RevenueDistributorZeroAddress();

        uint256 partnerId = partnerPoolIds[msg.sender];

        // Transfer fees from the partner pool to the revenue distributor
        IERC20(_token).safeTransferFrom(msg.sender, revenueDistributor, _amount);

        // Record the deposit in the distributor
        IDragonRevenueDistributor(revenueDistributor).depositFees(
            partnerId,
            _token,
            _amount
        );

        emit PartnerFeesTransferred(_partner, _token, _amount);
    }

    // Allow the contract to receive ETH
    receive() external payable {}

    /**
     * @dev Commit phase for MEV-resistant lottery entry
     * @param commitment Hash of (user, amount, nonce, blockNumber)
     */
    function commitLotteryEntry(bytes32 commitment) external {
        require(commitment != bytes32(0), "Invalid commitment");
        require(userCommitments[msg.sender][commitment] == 0, "Commitment already exists");

        userCommitments[msg.sender][commitment] = block.number;
        emit CommitSubmitted(msg.sender, commitment);
    }

    /**
     * @dev Reveal phase for lottery entry
     * @param amount The lottery entry amount
     * @param nonce Random nonce used in commitment
     * @param commitBlock The block number when the commitment was made
     */
    function revealLotteryEntry(uint256 amount, uint256 nonce, uint256 commitBlock) external {
        bytes32 commitment = keccak256(abi.encodePacked(msg.sender, amount, nonce, commitBlock));

        require(userCommitments[msg.sender][commitment] != 0, "Invalid commitment");
        require(userCommitments[msg.sender][commitment] == commitBlock, "Block number mismatch");
        require(block.number >= commitBlock + MIN_COMMIT_REVEAL_DELAY, "Too early to reveal");
        require(block.number <= commitBlock + COMMITMENT_EXPIRY_BLOCKS, "Commitment expired");

        // Clear the commitment
        delete userCommitments[msg.sender][commitment];

        // Process lottery entry with MEV protection
        if (lotteryManager != address(0)) {
            _tryProcessLotteryEntry(msg.sender, amount);
        }

        emit LotteryEntryRevealed(msg.sender, amount, nonce);
    }

    /**
     * @dev Check if a specific commitment exists and is revealable
     * @param user The user address
     * @param commitment The commitment hash
     * @return exists Whether the commitment exists
     * @return canReveal Whether the commitment can be revealed now
     * @return expired Whether the commitment has expired
     */
    function getCommitmentStatus(address user, bytes32 commitment) external view returns (
        bool exists,
        bool canReveal,
        bool expired
    ) {
        uint256 commitBlock = userCommitments[user][commitment];
        exists = commitBlock != 0;

        if (exists) {
            canReveal = block.number >= commitBlock + MIN_COMMIT_REVEAL_DELAY;
            expired = block.number > commitBlock + COMMITMENT_EXPIRY_BLOCKS;
        }

        return (exists, canReveal, expired);
    }

    /**
     * @dev Set emergency pauser address (with timelock protection after first use)
     */
    function setEmergencyPauser(address _pauser) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_EMERGENCY_PAUSER, abi.encode(_pauser)) {
        emergencyPauser = _pauser;
    }

    /**
     * @dev Set ve69LP boost manager address (with timelock protection after first use)
     */
    function setVe69LPBoostManager(address _manager) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_VE69_LP_BOOST_MANAGER, abi.encode(_manager)) {
        address oldManager = ve69LPBoostManager;
        ve69LPBoostManager = _manager;
        emit Ve69LPBoostManagerUpdated(oldManager, _manager);
    }

    /**
     * @dev Set Sonic FeeM registry address (with timelock protection after first use)
     */
    function setSonicFeeMRegistry(address _registry) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_SONIC_FEEM_REGISTRY, abi.encode(_registry)) {
        address oldRegistry = sonicFeeMRegistry;
        sonicFeeMRegistry = _registry;
        emit SonicFeeMRegistryUpdated(oldRegistry, _registry);
    }

    /**
     * @dev Set Lottery Manager address (with timelock protection after first use)
     */
    function setLotteryManager(address _lotteryManager) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_VRF_LOTTERY_MANAGER, abi.encode(_lotteryManager)) {
        address oldManager = lotteryManager;
        lotteryManager = _lotteryManager;
        emit VRFLotteryManagerUpdated(oldManager, _lotteryManager);
    }

    /**
     * @dev Emergency pause all operations
     */
    function emergencyPause() external onlyEmergencyPauser {
        emergencyPaused = true;
    }

    /**
     * @dev Resume operations (owner only)
     */
    function emergencyUnpause() external onlyOwner {
        emergencyPaused = false;
    }

    /**
     * @dev Set maximum single transfer amount (with timelock protection after first use)
     */
    function setMaxSingleTransfer(uint256 _amount) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_MAX_SINGLE_TRANSFER, abi.encode(_amount)) {
        maxSingleTransfer = _amount;
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(bytes32 proposalId) external view returns (
        DragonTimelockLib.AdminOperation operation,
        bytes memory data,
        uint256 executeTime,
        bool executed,
        bool exists,
        bool canExecute
    ) {
        DragonTimelockLib.TimelockProposal storage proposal = timelockProposals[proposalId];
        canExecute = proposal.exists && !proposal.executed && block.timestamp >= proposal.executeTime;

        return (
            proposal.operation,
            proposal.data,
            proposal.executeTime,
            proposal.executed,
            proposal.exists,
            canExecute
        );
    }

    /**
     * @dev Check if an operation has been used once
     */
    function isOperationUsedOnce(DragonTimelockLib.AdminOperation operation) external view returns (bool) {
        return operationUsedOnce[operation];
    }

    /**
     * @dev Generate proposal ID for a given operation and data
     */
    function generateProposalId(DragonTimelockLib.AdminOperation operation, bytes calldata data) external pure returns (bytes32) {
        return keccak256(abi.encode(operation, data));
    }

    /**
     * @dev Execute a timelocked proposal directly (for complex operations) - FIXED to use call() instead of duplicating logic
     */
    function executeTimelockProposal(bytes32 proposalId) external onlyOwner nonReentrant notEmergencyPaused {
        DragonTimelockLib.TimelockProposal storage proposal = timelockProposals[proposalId];
        require(proposal.exists, "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp >= proposal.executeTime, "Timelock not expired");

        // FIXED: Construct callData and execute BEFORE marking as executed
        bytes memory callData;

        if (proposal.operation == DragonTimelockLib.AdminOperation.SET_JACKPOT_VAULT) {
            address _jackpotVault = abi.decode(proposal.data, (address));
            callData = abi.encodeWithSignature("setJackpotVault(address)", _jackpotVault);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_REVENUE_DISTRIBUTOR) {
            address _revenueDistributor = abi.decode(proposal.data, (address));
            callData = abi.encodeWithSignature("setRevenueDistributor(address)", _revenueDistributor);

        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_UNISWAP_ROUTER) {
            address _router = abi.decode(proposal.data, (address));
            callData = abi.encodeWithSignature("setUniswapRouter(address)", _router);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_EMERGENCY_PAUSER) {
            address _pauser = abi.decode(proposal.data, (address));
            callData = abi.encodeWithSignature("setEmergencyPauser(address)", _pauser);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_MAX_SINGLE_TRANSFER) {
            uint256 _amount = abi.decode(proposal.data, (uint256));
            callData = abi.encodeWithSignature("setMaxSingleTransfer(uint256)", _amount);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_TIMELOCK_DELAY) {
            uint256 _delay = abi.decode(proposal.data, (uint256));
            callData = abi.encodeWithSignature("setTimelockDelay(uint256)", _delay);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_ADAPTIVE_FEE_MANAGER) {
            address _adaptiveFeeManager = abi.decode(proposal.data, (address));
            callData = abi.encodeWithSignature("setAdaptiveFeeManager(address)", _adaptiveFeeManager);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_BUY_FEES) {
            (uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee) = abi.decode(proposal.data, (uint256, uint256, uint256));
            callData = abi.encodeWithSignature("setBuyFees(uint256,uint256,uint256)", jackpotFee, ve69Fee, burnFee);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_SELL_FEES) {
            (uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee) = abi.decode(proposal.data, (uint256, uint256, uint256));
            callData = abi.encodeWithSignature("setSellFees(uint256,uint256,uint256)", jackpotFee, ve69Fee, burnFee);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_TRANSFER_FEES) {
            (uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee) = abi.decode(proposal.data, (uint256, uint256, uint256));
            callData = abi.encodeWithSignature("setTransferFees(uint256,uint256,uint256)", jackpotFee, ve69Fee, burnFee);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_VE69_LP_BOOST_MANAGER) {
            address _ve69LPBoostManager = abi.decode(proposal.data, (address));
            callData = abi.encodeWithSignature("setVe69LPBoostManager(address)", _ve69LPBoostManager);
        } else if (proposal.operation == DragonTimelockLib.AdminOperation.SET_SONIC_FEEM_REGISTRY) {
            address _sonicFeeMRegistry = abi.decode(proposal.data, (address));
            callData = abi.encodeWithSignature("setSonicFeeMRegistry(address)", _sonicFeeMRegistry);
        } else {
            revert NotAuthorized();
        }

        // Execute the call to the actual function - this ensures identical logic execution
        (bool success, bytes memory result) = address(this).call(callData);
        require(success, string(abi.encodePacked("Execution failed: ", result)));

        // FIXED: Only mark as executed AFTER successful execution
        proposal.executed = true;
        emit ProposalExecuted(proposalId, proposal.operation);
    }

    /**
     * @dev Emergency bypass for critical operations (requires 2/3 majority if implemented with multisig)
     * This function should be used ONLY in extreme circumstances
     * FIXED: Use call() to execute original setter functions to avoid logic duplication
     */
    function emergencyBypassTimelock(
        DragonTimelockLib.AdminOperation operation,
        bytes calldata data,
        string calldata justification
    ) external onlyOwner nonReentrant notEmergencyPaused {
        require(bytes(justification).length > 10, "Justification required");

        // Only allow bypass for non-fee operations in emergencies
        require(
            operation != DragonTimelockLib.AdminOperation.SET_JACKPOT_VAULT &&
            operation != DragonTimelockLib.AdminOperation.SET_REVENUE_DISTRIBUTOR &&
            operation != DragonTimelockLib.AdminOperation.SET_ADAPTIVE_FEE_MANAGER &&
            operation != DragonTimelockLib.AdminOperation.SET_BUY_FEES &&
            operation != DragonTimelockLib.AdminOperation.SET_SELL_FEES &&
            operation != DragonTimelockLib.AdminOperation.SET_TRANSFER_FEES &&
            operation != DragonTimelockLib.AdminOperation.SET_TIMELOCK_DELAY,
            "Cannot bypass fee changes"
        );

        // FIXED: Construct callData for the original setter function
        bytes memory callData;

        if (operation == DragonTimelockLib.AdminOperation.SET_EMERGENCY_PAUSER) {
            address _pauser = abi.decode(data, (address));
            callData = abi.encodeWithSignature("setEmergencyPauser(address)", _pauser);

        } else if (operation == DragonTimelockLib.AdminOperation.SET_UNISWAP_ROUTER) {
            address _router = abi.decode(data, (address));
            callData = abi.encodeWithSignature("setUniswapRouter(address)", _router);
        } else if (operation == DragonTimelockLib.AdminOperation.SET_VE69_LP_BOOST_MANAGER) {
            address _manager = abi.decode(data, (address));
            callData = abi.encodeWithSignature("setVe69LPBoostManager(address)", _manager);
        } else if (operation == DragonTimelockLib.AdminOperation.SET_SONIC_FEEM_REGISTRY) {
            address _registry = abi.decode(data, (address));
            callData = abi.encodeWithSignature("setSonicFeeMRegistry(address)", _registry);
        } else {
            revert NotAuthorized();
        }

        // FIXED: Execute via call() to use exact same logic as normal setters
        // This ensures consistency and avoids logic duplication
        (bool success, bytes memory result) = address(this).call(callData);
        require(success, string(abi.encodePacked("Emergency execution failed: ", result)));

        emit ProposalExecuted(bytes32(0), operation); // Use zero hash for emergency bypass
        emit EmergencyBypassExecuted(operation, justification);
    }

    /**
     * @dev Get current dynamic fees based on market conditions - FIXED fallback logic
     */
    function getCurrentFees(address user, uint8 transactionType) external view returns (
        uint256 jackpotFee, uint256 ve69Fee, uint256 burnFee, uint256 totalFee
    ) {
        if (address(adaptiveFeeManager) == address(0)) {
            // FIXED: Use proper fallback to stored fee structures based on transaction type
            if (transactionType == 0) { // Buy
                return (buyFees.jackpot, buyFees.ve69LP, buyFees.burn, buyFees.total);
            } else if (transactionType == 1) { // Sell
                return (sellFees.jackpot, sellFees.ve69LP, sellFees.burn, sellFees.total);
            } else { // Transfer
                return (transferFees.jackpot, transferFees.ve69LP, transferFees.burn, transferFees.total);
            }
        }

        // Get base dynamic fees from adaptive manager
        jackpotFee = adaptiveFeeManager.jackpotFee();
        burnFee = adaptiveFeeManager.burnFee();
        totalFee = adaptiveFeeManager.totalFee();
        ve69Fee = totalFee - jackpotFee - burnFee;

        // Apply user-specific reductions if they have ve69LP (simplified without HermesMath for now)
        if (user != address(0) && ve69LPBoostManager != address(0)) {
            try Ive69LPBoostManager(ve69LPBoostManager).getVotingPower(user) returns (uint256 votingPower) {
                if (votingPower > 0) {
                    // Simple fee reduction based on voting power (can be enhanced later)
                    uint256 reduction = (votingPower * 500) / 10000; // Max 5% reduction
                    jackpotFee = jackpotFee > reduction ? jackpotFee - reduction : 0;
                    ve69Fee = ve69Fee > reduction ? ve69Fee - reduction : 0;
                    totalFee = jackpotFee + ve69Fee + burnFee;
                }
            } catch {
                // Ignore errors and use base fees
            }
        }

        return (jackpotFee, ve69Fee, burnFee, totalFee);
    }

    /**
     * @dev Update market conditions - FIXED authorization
     */
    function updateMarketConditions(uint256 volumeAmount) external nonReentrant notEmergencyPaused {
        // FIXED: Proper authorization check for market condition updaters
        if (msg.sender != owner() && !isAuthorizedCaller[msg.sender] && msg.sender != address(adaptiveFeeManager)) {
            revert NotAuthorized();
        }

        if (address(adaptiveFeeManager) != address(0)) {
            try adaptiveFeeManager.addVolume(volumeAmount) {} catch {}

            // Update jackpot size if vault exists
            if (jackpotVault != address(0)) {
                try IDragonJackpotVault(jackpotVault).getJackpotBalance() returns (uint256 balance) {
                    try adaptiveFeeManager.updateJackpotSize(balance) {} catch {}
                } catch {}
            }
        }
    }

    /**
     * @dev Set the adaptive fee manager (with timelock protection after first use)
     * @param _adaptiveFeeManager The DragonFeeManager address
     */
    function setAdaptiveFeeManager(address _adaptiveFeeManager) external onlyOwner
        onlyAfterTimelock(DragonTimelockLib.AdminOperation.SET_ADAPTIVE_FEE_MANAGER, abi.encode(_adaptiveFeeManager)) {
        if (_adaptiveFeeManager == address(0)) revert ZeroAddress();

        adaptiveFeeManager = DragonFeeManager(_adaptiveFeeManager);
    }

    /**
     * @dev Set authorized caller status for specific functions
     * @param caller The address to authorize/deauthorize
     * @param authorized Whether the address should be authorized
     */
    function setAuthorizedCaller(address caller, bool authorized) external onlyOwner {
        if (caller == address(0)) revert ZeroAddress();
        isAuthorizedCaller[caller] = authorized;
        emit AuthorizedCallerUpdated(caller, authorized);
    }

    /**
     * @dev Set multiple authorized callers at once
     * @param callers Array of addresses to set authorization for
     * @param authorized Array of authorization statuses
     */
    function setAuthorizedCallersBatch(address[] calldata callers, bool[] calldata authorized) external onlyOwner {
        require(callers.length == authorized.length, "Arrays must have same length");

        for (uint256 i = 0; i < callers.length; i++) {
            if (callers[i] == address(0)) continue;
            isAuthorizedCaller[callers[i]] = authorized[i];
            emit AuthorizedCallerUpdated(callers[i], authorized[i]);
        }
    }
}

/**
 * @dev Simplified LayerZero Endpoint interface
 */
interface ILayerZeroEndpoint {
    function send(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable;

    function estimateFees(
        uint16 _dstChainId,
        address _userApplication,
        bytes calldata _payload,
        bool _payInZRO,
        bytes calldata _adapterParams
    ) external view returns (uint nativeFee, uint zroFee);
}

/**
 * @dev LayerZero V2 Origin struct
 */
struct Origin {
    uint16 srcEid;
    bytes32 sender;
    uint64 nonce;
}

/**
 * @dev Simple Uniswap Router interface
 */
interface IUniswapRouter {
    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}
