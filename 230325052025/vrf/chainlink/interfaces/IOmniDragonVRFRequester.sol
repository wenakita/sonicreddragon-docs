// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IOmniDragonVRFRequester
 * @dev Interface for OmniDragonVRFRequester contract - the main VRF requester for OmniDragon ecosystem
 */
interface IOmniDragonVRFRequester {
    /**
     * @dev Estimate fees for sending randomness back
     * @param _dstChainId Destination chain ID
     * @param _payload Payload to send
     * @return fee The estimated fee
     */
    function estimateFees(
        uint16 _dstChainId,
        bytes memory _payload
    ) external view returns (uint256 fee);

    /**
     * @dev Update VRF request settings
     * @param _callbackGasLimit Gas limit for the callback
     * @param _requestConfirmations Number of confirmations to wait
     * @param _numWords Number of random words to request
     */
    function updateVRFSettings(
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numWords
    ) external;
}
