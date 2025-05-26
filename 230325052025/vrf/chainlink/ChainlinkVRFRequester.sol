// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../interfaces/external/layerzero/ILayerZeroReceiver.sol";
import "../../interfaces/external/layerzero/ILayerZeroEndpoint.sol";
import "./interfaces/IChainlinkVRFRequester.sol";
import "./compat/VRFConsumerBaseV2.sol";
import "./compat/VRFCoordinatorV2Interface.sol";

/**
 * @title ChainlinkVRFRequester
 * @dev Handles Chainlink VRF requests on Arbitrum and sends results back to Sonic
 *
 * Part of the OmniDragon multi-source randomness ecosystem
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
abstract contract ChainlinkVRFRequester is VRFConsumerBaseV2, ILayerZeroReceiver, IChainlinkVRFRequester {
    // This is an abstract contract that can be extended by specific implementations
}
