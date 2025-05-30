// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IChainRegistry} from "../interfaces/misc/IChainRegistry.sol";
import {DragonDeployerLib} from "../library/dragon/DragonDeployerLib.sol";
import {DragonVRFLib} from "../library/dragon/DragonVRFLib.sol";

/**
 * @title OmniDragonPeriphery
 * @dev Factory contract for deploying Dragon ecosystem components
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract OmniDragonPeriphery is Ownable {
    // References
    IChainRegistry public chainRegistry;
    address public omniDragon;
    address public vrfImpl;
    address public swapImpl;

    // Custom errors (single letter to minimize bytecode)
    error F(); // FeeMRegistrationFailed
    error Z(); // ZeroAddress

    // Events
    event ChainRegistrySet(address registry);
    event OmniDragonSet(address dragon);
    event VRFImplSet(address impl);
    event SwapImplSet(address impl);
    event DeploymentComplete(address swapTrigger, address vrfConsumer);

    /**
     * @dev Constructor
     */
    constructor(address _chainRegistry) Ownable() {
        if (_chainRegistry == address(0)) revert Z();
        chainRegistry = IChainRegistry(_chainRegistry);
        emit ChainRegistrySet(_chainRegistry);
    }

    /**
     * @notice Set the OmniDragon token address
     */
    function setOmniDragon(address _omniDragon) external onlyOwner {
        if (_omniDragon == address(0)) revert Z();
        omniDragon = _omniDragon;
        emit OmniDragonSet(_omniDragon);
    }

    /**
     * @notice Set the implementations contracts
     */
    function setImplementations(address _vrfImpl, address _swapImpl) external onlyOwner {
        if (_vrfImpl == address(0) || _swapImpl == address(0)) revert Z();
        vrfImpl = _vrfImpl;
        swapImpl = _swapImpl;
        emit VRFImplSet(_vrfImpl);
        emit SwapImplSet(_swapImpl);
    }

    /**
     * @notice Deploy chain implementation components
     */
    function deployChainImplementation(
        DragonVRFLib.VRFParams calldata vrfP,
        DragonDeployerLib.SwapParams calldata swapP
    ) external onlyOwner returns (address swapTrigger, address vrfConsumer) {
        if (vrfImpl == address(0) || swapImpl == address(0)) revert Z();
        if (omniDragon == address(0)) revert Z();

        // First deploy the VRF consumer
        vrfConsumer = DragonVRFLib.deployVRFConsumer(vrfP, owner());

        // Then deploy the swap trigger using the VRF consumer
        swapTrigger = DragonDeployerLib.deploySwapTrigger(omniDragon, swapP, owner());

        // Connect the two contracts
        DragonVRFLib.updateLotteryContract(vrfConsumer, swapTrigger);

        emit DeploymentComplete(swapTrigger, vrfConsumer);
        return (swapTrigger, vrfConsumer);
    }

    /**
     * @notice Update peer addresses for VRF contracts
     */
    function updateVRFPeers(address arbReq, address sonicVRF) external onlyOwner {
        if (vrfImpl == address(0)) revert Z();
        DragonVRFLib.updateVRFPeers(arbReq, sonicVRF);
    }

    /**
     * @dev Register on Sonic FeeM
     */
    function registerMe() external {
        (bool s,) = address(0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830).call(
            abi.encodeWithSignature("selfRegister(uint256)", 143)
        );
        if (!s) revert F();
    }
}
