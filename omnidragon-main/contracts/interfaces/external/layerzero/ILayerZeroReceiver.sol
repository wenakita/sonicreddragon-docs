// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @title ILayerZeroReceiver
 * @dev Interface for receiving LayerZero messages
 *
 * Defines callback functionality for processing cross-chain messages
 * Essential for contracts that receive LayerZero communications in OmniDragon
 * https://x.com/sonicreddragon
 * https://t.me/sonicreddragon
 */
interface ILayerZeroReceiver {
    /**
     * @notice LayerZero endpoint will invoke this function to deliver the message on the destination
     * @param _srcChainId - the source endpoint identifier
     * @param _srcAddress - the source sending contract address from the source chain
     * @param _nonce - the ordered message nonce
     * @param _payload - the signed payload is the UA bytes has encoded to be sent
     */
    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        uint64 _nonce,
        bytes calldata _payload
    ) external;
}
