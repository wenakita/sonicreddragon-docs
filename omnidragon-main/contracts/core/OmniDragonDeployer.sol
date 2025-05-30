// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "../library/access/Ownable.sol";
import {ReentrancyGuard} from "../library/security/ReentrancyGuard.sol";
import {OmniDragon} from "./OmniDragon.sol";

/**
 * @title OmniDragonDeployer
 * @dev Factory contract for deploying OmniDragon instances across different chains
 *
 * Enables deterministic deployment of OmniDragon tokens with consistent addresses
 * Manages cross-chain deployment configurations and initialization parameters
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract OmniDragonDeployer {
    // Events
    event OmniDragonDeployed(address indexed omniDragonAddress);
    event BytecodeChecksumComputed(bytes32 bytecodeChecksum);
    event DeterministicAddressComputed(address computedAddress, bytes32 salt);

    // Default salt value for consistent addressing
    bytes32 public constant DEFAULT_SALT = bytes32(uint256(0x69));

    // Immutable bytecode hash to ensure consistency
    bytes32 public immutable INIT_CODE_HASH;

    // Custom errors
    error DeployedAddressMismatch();
    error FeeMRegistrationFailed();
    error DeploymentFailed();
    error InvalidBytecode();

    // Store the OmniDragon creation bytecode (without constructor args)
    bytes private creationCode;

    /**
     * @dev Constructor that takes the OmniDragon bytecode to ensure consistency
     * @param _omniDragonCreationCode The creation bytecode for OmniDragon (without constructor args)
     */
    constructor(bytes memory _omniDragonCreationCode) {
        // Validate the bytecode is non-empty
        if (_omniDragonCreationCode.length == 0) revert InvalidBytecode();

        // Store the creation code
        creationCode = _omniDragonCreationCode;

        // Compute and store the init code hash
        INIT_CODE_HASH = keccak256(_omniDragonCreationCode);
    }

    /**
     * @dev Deploy OmniDragon with the DEFAULT_SALT
     * @param name_ Name of the token
     * @param symbol_ Symbol of the token
     * @param initialSupply Initial supply of tokens
     * @param lzEndpoint Address of the LayerZero endpoint
     * @param jackpotVault Address of the jackpot vault
     * @param ve69LPFeeDistributor Address of the ve69LP fee distributor
     * @param chainRegistry Address of the chain registry
     * @param multisigAddress Address of the multisig
     * @return The address of the deployed OmniDragon contract
     */
    function deployOmniDragon(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address lzEndpoint,
        address jackpotVault,
        address ve69LPFeeDistributor,
        address chainRegistry,
        address multisigAddress
    ) public returns (address) {
        // Encode constructor parameters
        bytes memory constructorArgs = abi.encode(
            name_,
            symbol_,
            initialSupply,
            lzEndpoint,
            jackpotVault,
            ve69LPFeeDistributor,
            chainRegistry,
            multisigAddress
        );

        // Combine bytecode with constructor args
        bytes memory bytecode = abi.encodePacked(creationCode, constructorArgs);

        // Compute bytecode hash and emit it for verification
        bytes32 bytecodeHash = keccak256(bytecode);
        emit BytecodeChecksumComputed(bytecodeHash);

        // Compute deterministic address
        address computedAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            DEFAULT_SALT,
            bytecodeHash
        )))));
        emit DeterministicAddressComputed(computedAddress, DEFAULT_SALT);

        // Deploy with CREATE2
        address omniDragon;
        bytes32 salt = DEFAULT_SALT;
        assembly {
            omniDragon := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if eq(omniDragon, 0) {
                revert(0, 0)
            }
        }

        // If deployment failed, revert
        if (omniDragon == address(0)) {
            revert DeploymentFailed();
        }

        // Verify the deployed address matches the computed address
        if (omniDragon != computedAddress) {
            revert DeployedAddressMismatch();
        }

        emit OmniDragonDeployed(omniDragon);
        return omniDragon;
    }

    /**
     * @dev Get the precomputed address for OmniDragon deployment
     * This allows other contracts to know the token address before deployment
     */
    function getPrecomputedOmniDragonAddress(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address lzEndpoint,
        address jackpotVault,
        address ve69LPFeeDistributor,
        address chainRegistry,
        address multisigAddress
    ) external view returns (address) {
        // Encode constructor parameters
        bytes memory constructorArgs = abi.encode(
            name_,
            symbol_,
            initialSupply,
            lzEndpoint,
            jackpotVault,
            ve69LPFeeDistributor,
            chainRegistry,
            multisigAddress
        );

        // Combine bytecode with constructor args
        bytes memory bytecode = abi.encodePacked(creationCode, constructorArgs);

        // Compute bytecode hash
        bytes32 bytecodeHash = keccak256(bytecode);

        // Return the computed address
        return address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            DEFAULT_SALT,
            bytecodeHash
        )))));
    }

    /**
     * @dev Get the OmniDragon creation code that will be used
     * This is useful for verification and deployment to other chains
     */
    function getOmniDragonCreationCode() external view returns (bytes memory) {
        return creationCode;
    }

    /**
     * @dev Get the init code hash of the OmniDragon contract
     * This is useful for verification and cross-chain deployment
     */
    function getInitCodeHash() external view returns (bytes32) {
        return INIT_CODE_HASH;
    }

    /// @dev Register my contract on Sonic FeeM
    function registerMe() external {
        (bool _success,) = address(0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830).call(
            abi.encodeWithSignature("selfRegister(uint256)", 143)
        );
        if (!_success) {
            revert FeeMRegistrationFailed();
        }
    }
}
