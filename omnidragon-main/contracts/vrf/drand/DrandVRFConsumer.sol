// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "../../library/access/Ownable.sol";
import {ReentrancyGuard} from "../../library/security/ReentrancyGuard.sol";
import {IDrandVRFConsumer} from "./interfaces/IDrandVRFConsumer.sol";
import "./interfaces/IDrandVRFIntegrator.sol";

/**
 * @title DrandVRFConsumer
 * @dev Consumer contract for Drand distributed randomness beacon
 *
 * Integrates with the League of Entropy's Drand network for free, verifiable randomness
 * Provides high-frequency randomness updates for the OmniDragon ecosystem
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
contract DrandVRFConsumer is Ownable, ReentrancyGuard, IDrandVRFConsumer {
    // VRF Integrator address
    address public vrfIntegrator;

    // Request tracking
    struct Request {
        bool fulfilled;
        uint256 randomness;
        uint256 round;
    }

    // Request mapping
    mapping(uint256 => Request) public requests;

    // Request ID counter
    uint256 private requestIdCounter;

    // Events
    event RandomnessRequested(uint256 indexed requestId);
    event RandomnessFulfilled(uint256 indexed requestId, uint256 randomness, uint256 round);
    event VRFIntegratorUpdated(address oldIntegrator, address newIntegrator);

    constructor(address _vrfIntegrator) {
        vrfIntegrator = _vrfIntegrator;
    }

    /**
     * @dev Updates the VRF integrator address
     * @param _vrfIntegrator The new integrator address
     */
    function setVRFIntegrator(address _vrfIntegrator) external onlyOwner {
        address oldIntegrator = vrfIntegrator;
        vrfIntegrator = _vrfIntegrator;
        emit VRFIntegratorUpdated(oldIntegrator, _vrfIntegrator);
    }

    /**
     * @dev Requests randomness from the integrator
     * @return requestId The ID for this request
     */
    function requestRandomness() internal returns (uint256) {
        // Generate a requestId
        uint256 requestId = ++requestIdCounter;

        // Create the request
        requests[requestId] = Request({
            fulfilled: false,
            randomness: 0,
            round: 0
        });

        emit RandomnessRequested(requestId);

        // Try to get immediate fulfilment
        try IDrandVRFIntegrator(vrfIntegrator).fulfillRandomness(requestId) {
            // Request processed immediately
        } catch {
            // Request will be processed later
        }

        return requestId;
    }

    /**
     * @dev Callback function used by VRF Integrator to deliver randomness
     * @param _requestId The ID of the request
     * @param _randomness The random result
     * @param _round The round number
     */
    function fulfillRandomness(
        uint256 _requestId,
        uint256 _randomness,
        uint256 _round
    ) external override nonReentrant {
        // Ensure only the VRF integrator can fulfill randomness
        require(msg.sender == vrfIntegrator, "Only VRF integrator");

        // Get the request
        Request storage request = requests[_requestId];

        // Ensure the request exists and isn't fulfilled
        require(!request.fulfilled, "Already fulfilled");

        // Mark as fulfilled and store result
        request.fulfilled = true;
        request.randomness = _randomness;
        request.round = _round;

        emit RandomnessFulfilled(_requestId, _randomness, _round);

        // Call internal handler
        _fulfillRandomness(_requestId, _randomness);
    }

    /**
     * @dev Internal function to handle randomness fulfillment
     * @param _requestId The ID of the request
     * @param _randomness The random result
     */
    function _fulfillRandomness(uint256 _requestId, uint256 _randomness) internal virtual {
        // Override in derived contracts
    }

    /**
     * @dev Gets the current randomness
     */
    function getCurrentRandomness() external view returns (uint256 randomness, uint256 round) {
        return IDrandVRFIntegrator(vrfIntegrator).getLatestRandomness();
    }

    /**
     * @dev Checks if a request has been fulfilled
     * @param _requestId The request ID to check
     */
    function isRequestFulfilled(uint256 _requestId) external view returns (bool) {
        return requests[_requestId].fulfilled;
    }
}
